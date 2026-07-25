from __future__ import annotations

from typing import Any

import requests


USER_AGENT = (
    "NorthovaDigitalLeadEngine/0.1 "
    "(https://github.com/northovadigital/northova-digital)"
)

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]


class ExtractionError(RuntimeError):
    """Raised when restaurant extraction cannot be completed."""


def resolve_area_id(location: str) -> int:
    """Resolve a city/location name into an OpenStreetMap area ID."""

    response = requests.get(
        NOMINATIM_URL,
        params={
            "q": location,
            "format": "jsonv2",
            "limit": 10,
            "addressdetails": 1,
        },
        headers={"User-Agent": USER_AGENT},
        timeout=30,
    )
    response.raise_for_status()

    results: list[dict[str, Any]] = response.json()

    relation = next(
        (
            result
            for result in results
            if result.get("osm_type") == "relation"
        ),
        None,
    )

    if not relation:
        raise ExtractionError(
            f"Could not find an administrative area for: {location}"
        )

    osm_relation_id = int(relation["osm_id"])

    # OpenStreetMap relation IDs become Overpass area IDs
    # by adding 3,600,000,000.
    return 3_600_000_000 + osm_relation_id


def build_query(area_id: int) -> str:
    """Build the Overpass query for restaurants and hospitality businesses."""

    return f"""
    [out:json][timeout:180];

    area({area_id})->.searchArea;

    (
        nwr["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"]
            (area.searchArea);

        nwr["shop"="bakery"]
            (area.searchArea);

        nwr["tourism"~"^(hotel|motel|guest_house)$"]
            (area.searchArea);
    );

    out center tags;
    """


def fetch_businesses(location: str) -> list[dict[str, Any]]:
    """Fetch restaurant and hospitality records from OpenStreetMap."""

    area_id = resolve_area_id(location)
    query = build_query(area_id)

    errors: list[str] = []

    for endpoint in OVERPASS_URLS:
        try:
            response = requests.post(
                endpoint,
                data={"data": query},
                headers={"User-Agent": USER_AGENT},
                timeout=240,
            )
            response.raise_for_status()

            payload = response.json()
            return payload.get("elements", [])

        except (requests.RequestException, ValueError) as exc:
            errors.append(f"{endpoint}: {exc}")

    raise ExtractionError(
        "All Overpass endpoints failed:\n" + "\n".join(errors)
    )
