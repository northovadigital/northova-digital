from __future__ import annotations

import hashlib
import random
import time
from dataclasses import dataclass
from typing import Any

import requests


USER_AGENT = (
    "NorthovaDigitalLeadEngine/0.2 "
    "(https://github.com/northovadigital/northova-digital)"
)

NOMINATIM_URL = (
    "https://nominatim.openstreetmap.org/search"
)

OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

NOMINATIM_TIMEOUT = 30
OVERPASS_QUERY_TIMEOUT = 60
OVERPASS_REQUEST_TIMEOUT = 90

ENDPOINT_ROUNDS = 2
MAX_SPLIT_DEPTH = 2
REQUEST_DELAY_SECONDS = 0.4

BBox = tuple[float, float, float, float]


class ExtractionError(RuntimeError):
    """Raised when business extraction cannot be completed."""


@dataclass(frozen=True)
class SearchArea:
    display_name: str
    bbox: BBox


def resolve_search_area(
    location: str,
) -> SearchArea:
    """Resolve a location into its bounding box."""

    response = requests.get(
        NOMINATIM_URL,
        params={
            "q": location,
            "format": "jsonv2",
            "limit": 10,
            "addressdetails": 1,
        },
        headers={
            "User-Agent": USER_AGENT,
            "Accept-Language": "en",
        },
        timeout=NOMINATIM_TIMEOUT,
    )

    response.raise_for_status()

    results: list[dict[str, Any]] = response.json()

    if not results:
        raise ExtractionError(
            f"Location could not be found: {location}"
        )

    selected_result = next(
        (
            result
            for result in results
            if result.get("osm_type") == "relation"
            and result.get("boundingbox")
        ),
        None,
    )

    if selected_result is None:
        selected_result = next(
            (
                result
                for result in results
                if result.get("boundingbox")
            ),
            None,
        )

    if selected_result is None:
        raise ExtractionError(
            f"No searchable boundary found for: {location}"
        )

    bounding_box = selected_result.get(
        "boundingbox"
    )

    if (
        not isinstance(bounding_box, list)
        or len(bounding_box) != 4
    ):
        raise ExtractionError(
            f"Invalid location boundary for: {location}"
        )

    try:
        south = float(bounding_box[0])
        north = float(bounding_box[1])
        west = float(bounding_box[2])
        east = float(bounding_box[3])
    except (TypeError, ValueError) as error:
        raise ExtractionError(
            f"Invalid location coordinates for: {location}"
        ) from error

    if south >= north or west >= east:
        raise ExtractionError(
            f"Invalid location boundary for: {location}"
        )

    return SearchArea(
        display_name=str(
            selected_result.get(
                "display_name",
                location,
            )
        ),
        bbox=(
            south,
            west,
            north,
            east,
        ),
    )


def choose_grid_size(limit: int) -> int:
    """Choose the number of map sections based on run size."""

    if limit <= 0:
        return 10

    if limit <= 50:
        return 6

    if limit <= 100:
        return 7

    if limit <= 200:
        return 8

    if limit <= 350:
        return 9

    return 10


def build_grid(
    bbox: BBox,
    grid_size: int,
) -> list[BBox]:
    """Divide a location boundary into smaller map sections."""

    south, west, north, east = bbox

    latitude_step = (
        north - south
    ) / grid_size

    longitude_step = (
        east - west
    ) / grid_size

    cells: list[BBox] = []

    for row in range(grid_size):
        cell_south = (
            south + row * latitude_step
        )

        cell_north = (
            north
            if row == grid_size - 1
            else cell_south + latitude_step
        )

        for column in range(grid_size):
            cell_west = (
                west
                + column * longitude_step
            )

            cell_east = (
                east
                if column == grid_size - 1
                else cell_west
                + longitude_step
            )

            cells.append(
                (
                    cell_south,
                    cell_west,
                    cell_north,
                    cell_east,
                )
            )

    return cells


def split_bbox(
    bbox: BBox,
) -> list[BBox]:
    """Split one map section into four smaller sections."""

    south, west, north, east = bbox

    middle_latitude = (
        south + north
    ) / 2

    middle_longitude = (
        west + east
    ) / 2

    return [
        (
            south,
            west,
            middle_latitude,
            middle_longitude,
        ),
        (
            south,
            middle_longitude,
            middle_latitude,
            east,
        ),
        (
            middle_latitude,
            west,
            north,
            middle_longitude,
        ),
        (
            middle_latitude,
            middle_longitude,
            north,
            east,
        ),
    ]


def build_query(
    bbox: BBox,
) -> str:
    """Build a lightweight Overpass query for one map section."""

    south, west, north, east = bbox

    return f"""
    [out:json][timeout:{OVERPASS_QUERY_TIMEOUT}];

    (
        nwr["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"]
            ({south},{west},{north},{east});

        nwr["shop"="bakery"]
            ({south},{west},{north},{east});
    );

    out center tags qt;
    """


def request_overpass(
    session: requests.Session,
    query: str,
) -> tuple[
    list[dict[str, Any]] | None,
    list[str],
]:
    """Try the configured Overpass servers with retries."""

    errors: list[str] = []

    for round_number in range(
        1,
        ENDPOINT_ROUNDS + 1,
    ):
        for endpoint in OVERPASS_URLS:
            try:
                response = session.post(
                    endpoint,
                    data={"data": query},
                    timeout=(
                        OVERPASS_REQUEST_TIMEOUT
                    ),
                )

                response.raise_for_status()

                payload = response.json()

                elements = payload.get(
                    "elements",
                    [],
                )

                if not isinstance(
                    elements,
                    list,
                ):
                    raise ValueError(
                        "Invalid Overpass response."
                    )

                time.sleep(
                    REQUEST_DELAY_SECONDS
                )

                return elements, errors

            except (
                requests.RequestException,
                ValueError,
            ) as error:
                errors.append(
                    f"Round {round_number} - "
                    f"{endpoint}: {error}"
                )

        if round_number < ENDPOINT_ROUNDS:
            time.sleep(
                2 * round_number
            )

    return None, errors


def fetch_bbox_recursively(
    session: requests.Session,
    bbox: BBox,
    depth: int = 0,
) -> tuple[
    list[dict[str, Any]],
    list[str],
]:
    """
    Fetch one map section.

    If the section is too heavy, split it into
    four smaller sections and try again.
    """

    query = build_query(bbox)

    elements, errors = request_overpass(
        session,
        query,
    )

    if elements is not None:
        return elements, errors

    if depth >= MAX_SPLIT_DEPTH:
        return [], errors

    combined_elements: list[
        dict[str, Any]
    ] = []

    combined_errors = list(errors)

    for child_bbox in split_bbox(bbox):
        (
            child_elements,
            child_errors,
        ) = fetch_bbox_recursively(
            session=session,
            bbox=child_bbox,
            depth=depth + 1,
        )

        combined_elements.extend(
            child_elements
        )

        combined_errors.extend(
            child_errors
        )

    return (
        combined_elements,
        combined_errors,
    )


def get_element_key(
    element: dict[str, Any],
) -> tuple[str, str]:
    """Build a stable key for Overpass deduplication."""

    return (
        str(element.get("type", "")),
        str(element.get("id", "")),
    )


def fetch_businesses(
    location: str,
    limit: int = 200,
) -> list[dict[str, Any]]:
    """
    Fetch restaurant businesses using smaller map sections.

    More raw records than the requested export limit are
    collected so the cleaner can select the most useful leads.
    """

    search_area = resolve_search_area(
        location
    )

    print(
        "Resolved location: "
        f"{search_area.display_name}"
    )

    grid_size = choose_grid_size(limit)

    map_cells = build_grid(
        search_area.bbox,
        grid_size,
    )

    seed_text = (
        f"{location.strip().lower()}:{limit}"
    )

    seed_value = int(
        hashlib.sha256(
            seed_text.encode("utf-8")
        ).hexdigest()[:16],
        16,
    )

    random.Random(seed_value).shuffle(
        map_cells
    )

    raw_target = (
        max(limit * 4, 250)
        if limit > 0
        else None
    )

    print(
        f"Search grid: "
        f"{grid_size} x {grid_size} "
        f"({len(map_cells)} sections)"
    )

    if raw_target is not None:
        print(
            "Raw extraction target: "
            f"{raw_target} records"
        )

    session = requests.Session()

    session.headers.update(
        {
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
        }
    )

    unique_elements: dict[
        tuple[str, str],
        dict[str, Any],
    ] = {}

    all_errors: list[str] = []

    for position, bbox in enumerate(
        map_cells,
        start=1,
    ):
        print(
            f"Searching map section "
            f"{position}/{len(map_cells)}..."
        )

        elements, errors = (
            fetch_bbox_recursively(
                session=session,
                bbox=bbox,
            )
        )

        all_errors.extend(errors)

        for element in elements:
            element_key = get_element_key(
                element
            )

            if element_key == ("", ""):
                continue

            unique_elements[
                element_key
            ] = element

        print(
            "Unique raw records collected: "
            f"{len(unique_elements)}"
        )

        if (
            raw_target is not None
            and len(unique_elements)
            >= raw_target
        ):
            print(
                "Raw extraction target reached."
            )
            break

    session.close()

    if not unique_elements:
        recent_errors = all_errors[-10:]

        error_details = (
            "\n".join(recent_errors)
            if recent_errors
            else "No records were returned."
        )

        raise ExtractionError(
            "Business extraction failed across "
            "all map sections:\n"
            f"{error_details}"
        )

    if all_errors:
        print(
            "Some map requests failed, but "
            "extraction continued successfully."
        )

    return list(
        unique_elements.values()
    )