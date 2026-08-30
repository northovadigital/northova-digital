from __future__ import annotations

import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus


OUTPUT_COLUMNS = [
    "business_name",
    "category",
    "cuisine",
    "website",
    "phone",
    "email",
    "street",
    "city",
    "state",
    "postcode",
    "full_address",
    "opening_hours",
    "rating",
    "review_count",
    "latitude",
    "longitude",
    "source",
    "source_id",
    "source_url",
    "google_maps_search_url",
    "chain_status",
    "data_quality_score",
    "manual_status",
    "website_issue",
    "ordering_status",
    "sales_angle",
    "outreach_status",
    "notes",
    "extracted_at",
]


def _pick(tags: dict[str, Any], *keys: str) -> str:
    for key in keys:
        value = tags.get(key)

        if value is not None and str(value).strip():
            return str(value).strip()

    return ""


def _normalize_text(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def _coordinates(element: dict[str, Any]) -> tuple[float | None, float | None]:
    latitude = element.get("lat")
    longitude = element.get("lon")

    if latitude is not None and longitude is not None:
        return latitude, longitude

    center = element.get("center", {})

    return center.get("lat"), center.get("lon")


def _category(tags: dict[str, Any]) -> str:
    if tags.get("shop") == "bakery":
        return "bakery"

    if tags.get("tourism"):
        return str(tags["tourism"])

    return str(tags.get("amenity", "restaurant"))


def _build_address(tags: dict[str, Any]) -> tuple[str, str]:
    house_number = _pick(tags, "addr:housenumber")
    street_name = _pick(tags, "addr:street")

    street = " ".join(
        part for part in [house_number, street_name] if part
    ).strip()

    city = _pick(tags, "addr:city")
    state = _pick(tags, "addr:state")
    postcode = _pick(tags, "addr:postcode")

    full_address = ", ".join(
        part for part in [street, city, state, postcode] if part
    )

    return street, full_address


def element_to_record(element: dict[str, Any]) -> dict[str, Any] | None:
    tags = element.get("tags", {})

    business_name = _pick(tags, "name")

    if not business_name:
        return None

    latitude, longitude = _coordinates(element)
    street, full_address = _build_address(tags)

    city = _pick(tags, "addr:city")
    state = _pick(tags, "addr:state")
    postcode = _pick(tags, "addr:postcode")

    website = _pick(tags, "website", "contact:website")
    phone = _pick(tags, "phone", "contact:phone")
    email = _pick(tags, "email", "contact:email")

    element_type = str(element.get("type", ""))
    element_id = str(element.get("id", ""))

    search_query = ", ".join(
        part
        for part in [business_name, full_address, "Houston Texas"]
        if part
    )

    extracted_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    return {
        "business_name": business_name,
        "category": _category(tags),
        "cuisine": _pick(tags, "cuisine"),
        "website": website,
        "phone": phone,
        "email": email,
        "street": street,
        "city": city,
        "state": state,
        "postcode": postcode,
        "full_address": full_address,
        "opening_hours": _pick(tags, "opening_hours"),
        "rating": "",
        "review_count": "",
        "latitude": latitude,
        "longitude": longitude,
        "source": "openstreetmap",
        "source_id": f"{element_type}:{element_id}",
        "source_url": (
            f"https://www.openstreetmap.org/{element_type}/{element_id}"
        ),
        "google_maps_search_url": (
            "https://www.google.com/maps/search/?api=1&query="
            + quote_plus(search_query)
        ),
        "chain_status": "independent_or_unknown",
        "extracted_at": extracted_at,
    }


def normalize_elements(
    elements: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []

    for element in elements:
        record = element_to_record(element)

        if record:
            records.append(record)

    return records


def deduplicate_records(
    records: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    unique_records: list[dict[str, Any]] = []
    seen: set[str] = set()

    for record in records:
        name_key = _normalize_text(record["business_name"])
        address_key = _normalize_text(record["full_address"])

        if address_key:
            duplicate_key = f"{name_key}|{address_key}"
        else:
            latitude = record.get("latitude")
            longitude = record.get("longitude")

            coordinate_key = (
                f"{float(latitude):.4f}|{float(longitude):.4f}"
                if latitude is not None and longitude is not None
                else record["source_id"]
            )

            duplicate_key = f"{name_key}|{coordinate_key}"

        if duplicate_key in seen:
            continue

        seen.add(duplicate_key)
        unique_records.append(record)

    return unique_records


def load_blocked_chains(path: str | Path) -> list[str]:
    chain_file = Path(path)

    if not chain_file.exists():
        return []

    return [
        line.strip()
        for line in chain_file.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]


def partition_blocked_chains(
    records: list[dict[str, Any]],
    blocked_chains: list[str],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    allowed: list[dict[str, Any]] = []
    blocked: list[dict[str, Any]] = []

    normalized_chains = [
        _normalize_text(chain)
        for chain in blocked_chains
    ]

    for record in records:
        normalized_name = _normalize_text(record["business_name"])

        is_blocked = any(
            chain and chain in normalized_name
            for chain in normalized_chains
        )

        if is_blocked:
            record["chain_status"] = "blocked_national_chain"
            blocked.append(record)
        else:
            record["chain_status"] = "independent_or_unknown"
            allowed.append(record)

    return allowed, blocked
