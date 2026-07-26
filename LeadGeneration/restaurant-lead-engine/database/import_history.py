from __future__ import annotations

import argparse
import hashlib
import json
import re
import unicodedata
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import pandas as pd
from psycopg.types.json import Jsonb

from config.database import get_connection


PROJECT_ROOT = Path(__file__).resolve().parents[1]

DEFAULT_MANIFEST = (
    PROJECT_ROOT
    / "database"
    / "import_manifest.json"
)

NON_OWNED_DOMAINS = {
    "facebook.com",
    "instagram.com",
    "doordash.com",
    "ubereats.com",
    "grubhub.com",
    "yelp.com",
    "tripadvisor.com",
    "toasttab.com",
    "clover.com",
    "opentable.com",
}


def is_empty(value: Any) -> bool:
    if value is None:
        return True

    try:
        result = pd.isna(value)

        if isinstance(result, bool):
            return result

    except (TypeError, ValueError):
        pass

    return False


def as_text(value: Any) -> str:
    if is_empty(value):
        return ""

    text = str(value).strip()

    if text.lower() in {
        "nan",
        "none",
        "null",
        "<na>",
    }:
        return ""

    return text


def normalize_text(value: Any) -> str:
    text = as_text(value)

    if not text:
        return ""

    text = unicodedata.normalize(
        "NFKD",
        text,
    )

    text = text.encode(
        "ascii",
        errors="ignore",
    ).decode("ascii")

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9]+",
        " ",
        text,
    )

    return " ".join(
        text.split()
    )


def normalize_domain(value: Any) -> str:
    website = as_text(value)

    if not website:
        return ""

    candidate = website

    if not candidate.startswith(
        ("http://", "https://")
    ):
        candidate = f"https://{candidate}"

    try:
        parsed = urlparse(candidate)
        hostname = parsed.hostname or ""

    except ValueError:
        return ""

    hostname = hostname.lower().strip(".")

    if hostname.startswith("www."):
        hostname = hostname[4:]

    return hostname


def is_non_owned_domain(
    domain: str,
) -> bool:
    if not domain:
        return False

    return any(
        domain == blocked
        or domain.endswith(
            f".{blocked}"
        )
        for blocked in NON_OWNED_DOMAINS
    )


def normalize_phone(value: Any) -> str:
    phone = as_text(value)

    if not phone:
        return ""

    digits = re.sub(
        r"\D+",
        "",
        phone,
    )

    if (
        len(digits) == 11
        and digits.startswith("1")
    ):
        digits = digits[1:]

    return digits


def normalize_external_id(
    value: Any,
) -> str:
    if is_empty(value):
        return ""

    if isinstance(value, float):
        if value.is_integer():
            return str(int(value))

    return as_text(value)


def safe_float(
    value: Any,
) -> float | None:
    if is_empty(value):
        return None

    try:
        return float(value)

    except (TypeError, ValueError):
        return None


def safe_int(
    value: Any,
) -> int | None:
    if is_empty(value):
        return None

    try:
        return int(float(value))

    except (TypeError, ValueError):
        return None


def clean_json_value(
    value: Any,
) -> Any:
    if isinstance(value, dict):
        return {
            str(key): clean_json_value(item)
            for key, item in value.items()
        }

    if isinstance(value, (list, tuple, set)):
        return [
            clean_json_value(item)
            for item in value
        ]

    if is_empty(value):
        return None

    if isinstance(value, datetime):
        return value.isoformat()

    if hasattr(value, "item"):
        try:
            return clean_json_value(
                value.item()
            )
        except (ValueError, TypeError):
            pass

    if isinstance(
        value,
        (
            str,
            int,
            float,
            bool,
        ),
    ):
        return value

    return str(value)


def clean_json_mapping(
    mapping: dict[str, Any],
) -> dict[str, Any]:
    return {
        str(key): clean_json_value(value)
        for key, value in mapping.items()
    }


def parse_datetime_value(
    value: Any,
    fallback: datetime,
) -> datetime:
    text = as_text(value)

    if not text:
        return fallback

    try:
        parsed = datetime.fromisoformat(
            text.replace(
                "Z",
                "+00:00",
            )
        )

    except ValueError:
        return fallback

    if parsed.tzinfo is None:
        return parsed.astimezone()

    return parsed


def stable_hash(
    *parts: Any,
) -> str:
    normalized_parts = [
        as_text(part)
        for part in parts
    ]

    payload = "|".join(
        normalized_parts
    )

    return hashlib.sha256(
        payload.encode("utf-8")
    ).hexdigest()


def file_sha256(
    file_path: Path,
) -> str:
    hasher = hashlib.sha256()

    with file_path.open("rb") as file_handle:
        while True:
            chunk = file_handle.read(
                1024 * 1024
            )

            if not chunk:
                break

            hasher.update(chunk)

    return hasher.hexdigest()


def get_row_address(
    row: dict[str, Any],
) -> str:
    full_address = as_text(
        row.get("full_address")
    )

    if full_address:
        return full_address

    address_parts = [
        as_text(row.get("street")),
        as_text(row.get("city")),
        as_text(row.get("state")),
        as_text(row.get("postcode")),
    ]

    return ", ".join(
        part
        for part in address_parts
        if part
    )


def get_country_from_location(
    location: str,
) -> str:
    parts = [
        part.strip()
        for part in location.split(",")
        if part.strip()
    ]

    if not parts:
        return ""

    return parts[-1]


def get_website_domain(
    row: dict[str, Any],
) -> str:
    domain = normalize_domain(
        row.get("website")
    )

    if domain:
        return domain

    return normalize_domain(
        row.get("final_url")
    )


def build_business_key(
    row: dict[str, Any],
    vertical_key: str,
    country: str,
) -> tuple[str, str, str]:
    business_name = as_text(
        row.get("business_name")
    )

    normalized_name = normalize_text(
        business_name
    )

    domain = get_website_domain(row)

    ownership_type = as_text(
        row.get(
            "website_ownership_type"
        )
    ).lower()

    region = normalize_text(
        row.get("state")
    )

    normalized_country = normalize_text(
        country
    )

    owned_domain = (
        ownership_type == "owned_website"
        and domain
        and not is_non_owned_domain(
            domain
        )
    )

    if owned_domain:
        identity_value = (
            f"domain:{domain}"
        )

    else:
        identity_value = (
            f"name:{normalized_name}"
            f"|region:{region}"
            f"|country:{normalized_country}"
        )

    business_key = stable_hash(
        vertical_key,
        identity_value,
    )

    return (
        business_key,
        normalized_name,
        domain,
    )


def build_location_key(
    row: dict[str, Any],
    vertical_key: str,
    country: str,
) -> tuple[
    str,
    str,
    str,
    str,
    str,
]:
    business_name = as_text(
        row.get("business_name")
    )

    normalized_name = normalize_text(
        business_name
    )

    domain = get_website_domain(row)

    phone = normalize_phone(
        row.get("phone")
    )

    address = get_row_address(row)

    normalized_address = normalize_text(
        address
    )

    city = normalize_text(
        row.get("city")
    )

    region = normalize_text(
        row.get("state")
    )

    normalized_country = normalize_text(
        country
    )

    latitude = safe_float(
        row.get("latitude")
    )

    longitude = safe_float(
        row.get("longitude")
    )

    source_system = (
        as_text(row.get("source"))
        .lower()
        or "osm"
    )

    source_external_id = (
        normalize_external_id(
            row.get("source_id")
        )
    )

    if source_external_id:
        identity_value = (
            f"source:{source_system}"
            f"|id:{source_external_id}"
        )

    elif phone and normalized_address:
        identity_value = (
            f"phone:{phone}"
            f"|address:{normalized_address}"
        )

    elif normalized_name and normalized_address:
        identity_value = (
            f"name:{normalized_name}"
            f"|address:{normalized_address}"
        )

    elif (
        normalized_name
        and latitude is not None
        and longitude is not None
    ):
        identity_value = (
            f"name:{normalized_name}"
            f"|lat:{latitude:.5f}"
            f"|lng:{longitude:.5f}"
        )

    else:
        identity_value = (
            f"name:{normalized_name}"
            f"|city:{city}"
            f"|region:{region}"
            f"|country:{normalized_country}"
            f"|domain:{domain}"
        )

    location_key = stable_hash(
        vertical_key,
        identity_value,
    )

    return (
        location_key,
        domain,
        phone,
        normalized_address,
        source_external_id,
    )


def get_observed_at(
    row: dict[str, Any],
    generated_at: datetime,
) -> datetime:
    for column in (
        "audited_at",
        "extracted_at",
    ):
        value = row.get(column)

        if as_text(value):
            return parse_datetime_value(
                value,
                generated_at,
            )

    return generated_at


def load_manifest(
    manifest_path: Path,
) -> list[dict[str, Any]]:
    if not manifest_path.exists():
        raise FileNotFoundError(
            f"Manifest not found: "
            f"{manifest_path}"
        )

    manifest = json.loads(
        manifest_path.read_text(
            encoding="utf-8"
        )
    )

    batches = manifest.get("batches")

    if not isinstance(batches, list):
        raise RuntimeError(
            "Manifest must contain "
            "a batches list."
        )

    prepared_batches = []

    for item in batches:
        relative_file = Path(
            item["file"]
        )

        file_path = (
            PROJECT_ROOT
            / relative_file
        ).resolve()

        if not file_path.exists():
            raise FileNotFoundError(
                f"Import file not found: "
                f"{file_path}"
            )

        generated_at = (
            datetime.fromtimestamp(
                file_path.stat().st_mtime
            ).astimezone()
        )

        if item.get("generated_at"):
            generated_at = (
                parse_datetime_value(
                    item["generated_at"],
                    generated_at,
                )
            )

        content_hash = file_sha256(
            file_path
        )

        relative_path = (
            file_path.relative_to(
                PROJECT_ROOT
            ).as_posix()
        )

        batch_key = (
            "historical-"
            + stable_hash(
                relative_path,
                content_hash,
            )[:48]
        )

        prepared_item = dict(item)

        prepared_item.update(
            {
                "file_path": file_path,
                "relative_path": (
                    relative_path
                ),
                "generated_at": (
                    generated_at
                ),
                "file_sha256": (
                    content_hash
                ),
                "batch_key": batch_key,
            }
        )

        prepared_batches.append(
            prepared_item
        )

    return sorted(
        prepared_batches,
        key=lambda item: item[
            "generated_at"
        ],
    )


def validate_dataframe(
    dataframe: pd.DataFrame,
    batch: dict[str, Any],
) -> None:
    expected_rows = int(
        batch["expected_rows"]
    )

    if len(dataframe) != expected_rows:
        raise RuntimeError(
            f"{batch['relative_path']}: "
            f"expected {expected_rows} rows, "
            f"found {len(dataframe)}."
        )

    required_columns = {
        "business_name",
        "opportunity_score",
        "qualification",
        "eligibility_status",
    }

    missing_columns = (
        required_columns
        - set(dataframe.columns)
    )

    if missing_columns:
        missing_text = ", ".join(
            sorted(missing_columns)
        )

        raise RuntimeError(
            f"{batch['relative_path']}: "
            f"missing columns: "
            f"{missing_text}"
        )


def load_existing_history(
    cursor,
) -> tuple[
    set[str],
    dict[str, int],
    set[str],
]:
    cursor.execute(
        """
        SELECT batch_key
        FROM lead_engine.lead_batches
        """
    )

    existing_batches = {
        row[0]
        for row in cursor.fetchall()
    }

    cursor.execute(
        """
        SELECT business_key
        FROM lead_engine.businesses
        """
    )

    existing_businesses = {
        row[0]
        for row in cursor.fetchall()
    }

    cursor.execute(
        """
        SELECT
            business_locations.location_key,
            COUNT(
                lead_observations.id
            )
        FROM lead_engine.business_locations
        LEFT JOIN lead_engine.lead_observations
            ON lead_observations.business_location_id
                = business_locations.id
        GROUP BY
            business_locations.location_key
        """
    )

    location_counts = {
        row[0]: int(row[1])
        for row in cursor.fetchall()
    }

    return (
        existing_batches,
        location_counts,
        existing_businesses,
    )


def run_dry_run(
    batches: list[dict[str, Any]],
) -> None:
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            (
                existing_batches,
                location_counts,
                existing_businesses,
            ) = load_existing_history(
                cursor
            )

        print(
            "===== HISTORICAL IMPORT DRY RUN ====="
        )
        print(
            "No database rows will be inserted."
        )

        total_rows = 0
        total_new = 0
        total_seen_before = 0
        total_duplicates = 0
        total_missing_name = 0
        total_new_businesses = 0
        total_new_locations = 0
        skipped_batches = 0

        for number, batch in enumerate(
            batches,
            start=1,
        ):
            if (
                batch["batch_key"]
                in existing_batches
            ):
                skipped_batches += 1

                print()
                print(
                    f"{number}. ALREADY IMPORTED"
                )
                print(
                    f"   File: "
                    f"{batch['relative_path']}"
                )
                continue

            dataframe = pd.read_csv(
                batch["file_path"]
            )

            validate_dataframe(
                dataframe,
                batch,
            )

            country = (
                get_country_from_location(
                    batch["location"]
                )
            )

            batch_location_keys: set[str] = (
                set()
            )

            batch_new = 0
            batch_seen = 0
            batch_duplicates = 0
            batch_missing_name = 0
            batch_new_businesses = 0
            batch_new_locations = 0

            for row_number, series in (
                dataframe.iterrows()
            ):
                row = series.to_dict()

                business_name = as_text(
                    row.get(
                        "business_name"
                    )
                )

                if not business_name:
                    batch_missing_name += 1
                    continue

                (
                    business_key,
                    _normalized_name,
                    _domain,
                ) = build_business_key(
                    row=row,
                    vertical_key=batch[
                        "vertical_key"
                    ],
                    country=country,
                )

                (
                    location_key,
                    _domain,
                    _phone,
                    _address,
                    _source_id,
                ) = build_location_key(
                    row=row,
                    vertical_key=batch[
                        "vertical_key"
                    ],
                    country=country,
                )

                if (
                    location_key
                    in batch_location_keys
                ):
                    batch_duplicates += 1
                    continue

                batch_location_keys.add(
                    location_key
                )

                previous_count = (
                    location_counts.get(
                        location_key,
                        0,
                    )
                )

                if previous_count > 0:
                    batch_seen += 1
                else:
                    batch_new += 1
                    batch_new_locations += 1

                if (
                    business_key
                    not in existing_businesses
                ):
                    existing_businesses.add(
                        business_key
                    )

                    batch_new_businesses += 1

                location_counts[
                    location_key
                ] = previous_count + 1

            batch_rows = len(dataframe)

            total_rows += batch_rows
            total_new += batch_new
            total_seen_before += batch_seen
            total_duplicates += (
                batch_duplicates
            )
            total_missing_name += (
                batch_missing_name
            )
            total_new_businesses += (
                batch_new_businesses
            )
            total_new_locations += (
                batch_new_locations
            )

            print()
            print(f"{number}. READY")
            print(
                f"   File: "
                f"{batch['relative_path']}"
            )
            print(
                f"   Location: "
                f"{batch['location']}"
            )
            print(
                f"   Rows: {batch_rows}"
            )
            print(
                f"   New locations: "
                f"{batch_new}"
            )
            print(
                f"   Seen before: "
                f"{batch_seen}"
            )
            print(
                f"   Duplicate rows skipped: "
                f"{batch_duplicates}"
            )
            print(
                f"   Missing-name rows skipped: "
                f"{batch_missing_name}"
            )

        print()
        print("===== DRY RUN SUMMARY =====")
        print(
            f"Configured batches: "
            f"{len(batches)}"
        )
        print(
            f"Already imported batches: "
            f"{skipped_batches}"
        )
        print(
            f"CSV rows inspected: "
            f"{total_rows}"
        )
        print(
            f"New history records: "
            f"{total_new}"
        )
        print(
            f"Seen-before records: "
            f"{total_seen_before}"
        )
        print(
            f"New businesses estimated: "
            f"{total_new_businesses}"
        )
        print(
            f"New locations estimated: "
            f"{total_new_locations}"
        )
        print(
            f"Duplicate rows skipped: "
            f"{total_duplicates}"
        )
        print(
            f"Missing-name rows skipped: "
            f"{total_missing_name}"
        )
        print()
        print(
            "Dry run completed. "
            "No database rows were inserted."
        )

    finally:
        connection.close()


def insert_batch(
    cursor,
    batch: dict[str, Any],
) -> int:
    metadata = {
        "import_type": (
            "historical_csv"
        ),
        "original_manifest": {
            key: value
            for key, value
            in batch.items()
            if key
            not in {
                "file_path",
                "generated_at",
            }
        },
    }

    cursor.execute(
        """
        INSERT INTO lead_engine.lead_batches (
            batch_key,
            vertical_key,
            location_query,
            requested_lead_count,
            generated_at,
            source_file,
            run_metadata
        )
        VALUES (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s
        )
        RETURNING id
        """,
        (
            batch["batch_key"],
            batch["vertical_key"],
            batch["location"],
            int(batch["expected_rows"]),
            batch["generated_at"],
            batch["relative_path"],
            Jsonb(
                clean_json_mapping(
                    metadata
                )
            ),
        ),
    )

    result = cursor.fetchone()

    if result is None:
        raise RuntimeError(
            "Could not create lead batch."
        )

    return int(result[0])


def update_business(
    cursor,
    business_id: int,
    business_name: str,
    normalized_name: str,
    domain: str,
    observed_at: datetime,
) -> None:
    cursor.execute(
        """
        UPDATE lead_engine.businesses
        SET
            canonical_name = %s,
            normalized_name = %s,
            primary_domain = COALESCE(
                %s,
                primary_domain
            ),
            first_seen_at = LEAST(
                first_seen_at,
                %s
            ),
            last_seen_at = GREATEST(
                last_seen_at,
                %s
            ),
            times_seen = times_seen + 1,
            updated_at = NOW()
        WHERE id = %s
        """,
        (
            business_name,
            normalized_name,
            domain or None,
            observed_at,
            observed_at,
            business_id,
        ),
    )


def create_or_update_business(
    cursor,
    business_key: str,
    business_name: str,
    normalized_name: str,
    vertical_key: str,
    domain: str,
    observed_at: datetime,
) -> tuple[int, bool]:
    cursor.execute(
        """
        SELECT id
        FROM lead_engine.businesses
        WHERE business_key = %s
        """,
        (business_key,),
    )

    existing = cursor.fetchone()

    if existing is not None:
        business_id = int(existing[0])

        update_business(
            cursor=cursor,
            business_id=business_id,
            business_name=business_name,
            normalized_name=(
                normalized_name
            ),
            domain=domain,
            observed_at=observed_at,
        )

        return business_id, False

    cursor.execute(
        """
        INSERT INTO lead_engine.businesses (
            business_key,
            canonical_name,
            normalized_name,
            vertical_key,
            primary_domain,
            first_seen_at,
            last_seen_at,
            times_seen
        )
        VALUES (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            1
        )
        RETURNING id
        """,
        (
            business_key,
            business_name,
            normalized_name,
            vertical_key,
            domain or None,
            observed_at,
            observed_at,
        ),
    )

    result = cursor.fetchone()

    if result is None:
        raise RuntimeError(
            "Could not create business."
        )

    return int(result[0]), True


def resolve_location(
    cursor,
    row: dict[str, Any],
    vertical_key: str,
    country: str,
    observed_at: datetime,
) -> tuple[
    int,
    bool,
    bool,
    str,
    str,
]:
    business_name = as_text(
        row.get("business_name")
    )

    (
        business_key,
        normalized_name,
        business_domain,
    ) = build_business_key(
        row=row,
        vertical_key=vertical_key,
        country=country,
    )

    (
        location_key,
        location_domain,
        normalized_phone,
        normalized_address,
        source_external_id,
    ) = build_location_key(
        row=row,
        vertical_key=vertical_key,
        country=country,
    )

    city = as_text(
        row.get("city")
    )

    region = as_text(
        row.get("state")
    )

    latitude = safe_float(
        row.get("latitude")
    )

    longitude = safe_float(
        row.get("longitude")
    )

    cursor.execute(
        """
        SELECT
            id,
            business_id
        FROM lead_engine.business_locations
        WHERE location_key = %s
        """,
        (location_key,),
    )

    existing_location = (
        cursor.fetchone()
    )

    if existing_location is not None:
        location_id = int(
            existing_location[0]
        )

        business_id = int(
            existing_location[1]
        )

        update_business(
            cursor=cursor,
            business_id=business_id,
            business_name=business_name,
            normalized_name=(
                normalized_name
            ),
            domain=business_domain,
            observed_at=observed_at,
        )

        cursor.execute(
            """
            UPDATE lead_engine.business_locations
            SET
                display_name = %s,
                normalized_domain = COALESCE(
                    %s,
                    normalized_domain
                ),
                normalized_phone = COALESCE(
                    %s,
                    normalized_phone
                ),
                normalized_address = COALESCE(
                    %s,
                    normalized_address
                ),
                city = COALESCE(
                    %s,
                    city
                ),
                region = COALESCE(
                    %s,
                    region
                ),
                country = COALESCE(
                    %s,
                    country
                ),
                latitude = COALESCE(
                    %s,
                    latitude
                ),
                longitude = COALESCE(
                    %s,
                    longitude
                ),
                first_seen_at = LEAST(
                    first_seen_at,
                    %s
                ),
                last_seen_at = GREATEST(
                    last_seen_at,
                    %s
                ),
                times_seen = times_seen + 1,
                updated_at = NOW()
            WHERE id = %s
            """,
            (
                business_name,
                location_domain or None,
                normalized_phone or None,
                normalized_address or None,
                city or None,
                region or None,
                country or None,
                latitude,
                longitude,
                observed_at,
                observed_at,
                location_id,
            ),
        )

        return (
            location_id,
            False,
            False,
            location_key,
            source_external_id,
        )

    (
        business_id,
        business_created,
    ) = create_or_update_business(
        cursor=cursor,
        business_key=business_key,
        business_name=business_name,
        normalized_name=normalized_name,
        vertical_key=vertical_key,
        domain=business_domain,
        observed_at=observed_at,
    )

    cursor.execute(
        """
        INSERT INTO lead_engine.business_locations (
            business_id,
            location_key,
            display_name,
            normalized_domain,
            normalized_phone,
            normalized_address,
            city,
            region,
            country,
            latitude,
            longitude,
            first_seen_at,
            last_seen_at,
            times_seen
        )
        VALUES (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            1
        )
        RETURNING id
        """,
        (
            business_id,
            location_key,
            business_name,
            location_domain or None,
            normalized_phone or None,
            normalized_address or None,
            city or None,
            region or None,
            country or None,
            latitude,
            longitude,
            observed_at,
            observed_at,
        ),
    )

    result = cursor.fetchone()

    if result is None:
        raise RuntimeError(
            "Could not create "
            "business location."
        )

    return (
        int(result[0]),
        business_created,
        True,
        location_key,
        source_external_id,
    )


def upsert_source_reference(
    cursor,
    location_id: int,
    row: dict[str, Any],
    source_external_id: str,
    observed_at: datetime,
    raw_payload: dict[str, Any],
) -> None:
    if not source_external_id:
        return

    source_system = (
        as_text(row.get("source"))
        .lower()
        or "osm"
    )

    source_url = as_text(
        row.get("source_url")
    )

    cursor.execute(
        """
        INSERT INTO lead_engine.business_source_refs (
            business_location_id,
            source_system,
            source_entity_type,
            external_id,
            source_url,
            first_seen_at,
            last_seen_at,
            raw_payload
        )
        VALUES (
            %s,
            %s,
            'business',
            %s,
            %s,
            %s,
            %s,
            %s
        )
        ON CONFLICT (
            source_system,
            source_entity_type,
            external_id
        )
        DO UPDATE SET
            business_location_id =
                EXCLUDED.business_location_id,
            source_url = COALESCE(
                EXCLUDED.source_url,
                lead_engine.business_source_refs.source_url
            ),
            first_seen_at = LEAST(
                lead_engine.business_source_refs.first_seen_at,
                EXCLUDED.first_seen_at
            ),
            last_seen_at = GREATEST(
                lead_engine.business_source_refs.last_seen_at,
                EXCLUDED.last_seen_at
            ),
            raw_payload = EXCLUDED.raw_payload
        """,
        (
            location_id,
            source_system,
            source_external_id,
            source_url or None,
            observed_at,
            observed_at,
            Jsonb(raw_payload),
        ),
    )


def insert_observation(
    cursor,
    batch_id: int,
    location_id: int,
    row: dict[str, Any],
    observed_at: datetime,
    raw_payload: dict[str, Any],
) -> str:
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM lead_engine.lead_observations
        WHERE business_location_id = %s
        """,
        (location_id,),
    )

    previous_count = int(
        cursor.fetchone()[0]
    )

    history_status = (
        "seen_before"
        if previous_count > 0
        else "new"
    )

    source_system = (
        as_text(row.get("source"))
        .lower()
        or "osm"
    )

    source_external_id = (
        normalize_external_id(
            row.get("source_id")
        )
        or None
    )

    cursor.execute(
        """
        INSERT INTO lead_engine.lead_observations (
            batch_id,
            business_location_id,
            history_status,
            previous_seen_count,
            business_name,
            category,
            cuisine,
            website,
            phone,
            email,
            extracted_emails,
            address,
            website_status,
            website_ownership_type,
            eligibility_status,
            opportunity_score,
            qualification,
            sales_angle,
            score_reasons,
            source_system,
            source_external_id,
            raw_payload,
            observed_at
        )
        VALUES (
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s
        )
        """,
        (
            batch_id,
            location_id,
            history_status,
            previous_count,
            as_text(
                row.get(
                    "business_name"
                )
            ),
            as_text(
                row.get("category")
            )
            or None,
            as_text(
                row.get("cuisine")
            )
            or None,
            as_text(
                row.get("website")
            )
            or None,
            as_text(
                row.get("phone")
            )
            or None,
            as_text(
                row.get("email")
            )
            or None,
            as_text(
                row.get(
                    "extracted_emails"
                )
            )
            or None,
            get_row_address(row)
            or None,
            as_text(
                row.get(
                    "website_status"
                )
            )
            or None,
            as_text(
                row.get(
                    "website_ownership_type"
                )
            )
            or None,
            as_text(
                row.get(
                    "eligibility_status"
                )
            )
            or None,
            safe_int(
                row.get(
                    "opportunity_score"
                )
            ),
            as_text(
                row.get(
                    "qualification"
                )
            )
            or None,
            as_text(
                row.get(
                    "sales_angle"
                )
            )
            or None,
            as_text(
                row.get(
                    "score_reasons"
                )
            )
            or None,
            source_system,
            source_external_id,
            Jsonb(raw_payload),
            observed_at,
        ),
    )

    return history_status


def apply_import(
    batches: list[dict[str, Any]],
) -> None:
    connection = get_connection()

    try:
        total_batches = 0
        total_rows = 0
        total_new = 0
        total_seen = 0
        total_new_businesses = 0
        total_new_locations = 0
        total_duplicates = 0
        total_missing_name = 0
        skipped_batches = 0

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT batch_key
                FROM lead_engine.lead_batches
                """
            )

            existing_batches = {
                row[0]
                for row in cursor.fetchall()
            }

            print(
                "===== APPLYING HISTORICAL IMPORT ====="
            )

            for number, batch in enumerate(
                batches,
                start=1,
            ):
                if (
                    batch["batch_key"]
                    in existing_batches
                ):
                    skipped_batches += 1

                    print()
                    print(
                        f"{number}. SKIPPED "
                        "(already imported)"
                    )
                    print(
                        f"   File: "
                        f"{batch['relative_path']}"
                    )
                    continue

                dataframe = pd.read_csv(
                    batch["file_path"]
                )

                validate_dataframe(
                    dataframe,
                    batch,
                )

                batch_id = insert_batch(
                    cursor,
                    batch,
                )

                country = (
                    get_country_from_location(
                        batch["location"]
                    )
                )

                batch_location_keys: set[str] = (
                    set()
                )

                batch_new = 0
                batch_seen = 0
                batch_new_businesses = 0
                batch_new_locations = 0
                batch_duplicates = 0
                batch_missing_name = 0

                for _, series in (
                    dataframe.iterrows()
                ):
                    row = series.to_dict()

                    business_name = as_text(
                        row.get(
                            "business_name"
                        )
                    )

                    if not business_name:
                        batch_missing_name += 1
                        continue

                    generated_at = batch[
                        "generated_at"
                    ]

                    observed_at = (
                        get_observed_at(
                            row,
                            generated_at,
                        )
                    )

                    raw_payload = (
                        clean_json_mapping(
                            row
                        )
                    )

                    (
                        temporary_location_key,
                        _domain,
                        _phone,
                        _address,
                        _source_id,
                    ) = build_location_key(
                        row=row,
                        vertical_key=batch[
                            "vertical_key"
                        ],
                        country=country,
                    )

                    if (
                        temporary_location_key
                        in batch_location_keys
                    ):
                        batch_duplicates += 1
                        continue

                    batch_location_keys.add(
                        temporary_location_key
                    )

                    (
                        location_id,
                        business_created,
                        location_created,
                        _location_key,
                        source_external_id,
                    ) = resolve_location(
                        cursor=cursor,
                        row=row,
                        vertical_key=batch[
                            "vertical_key"
                        ],
                        country=country,
                        observed_at=observed_at,
                    )

                    if business_created:
                        batch_new_businesses += 1

                    if location_created:
                        batch_new_locations += 1

                    upsert_source_reference(
                        cursor=cursor,
                        location_id=location_id,
                        row=row,
                        source_external_id=(
                            source_external_id
                        ),
                        observed_at=observed_at,
                        raw_payload=raw_payload,
                    )

                    history_status = (
                        insert_observation(
                            cursor=cursor,
                            batch_id=batch_id,
                            location_id=(
                                location_id
                            ),
                            row=row,
                            observed_at=(
                                observed_at
                            ),
                            raw_payload=(
                                raw_payload
                            ),
                        )
                    )

                    if history_status == "new":
                        batch_new += 1
                    else:
                        batch_seen += 1

                total_batches += 1
                total_rows += len(dataframe)
                total_new += batch_new
                total_seen += batch_seen
                total_new_businesses += (
                    batch_new_businesses
                )
                total_new_locations += (
                    batch_new_locations
                )
                total_duplicates += (
                    batch_duplicates
                )
                total_missing_name += (
                    batch_missing_name
                )

                print()
                print(f"{number}. IMPORTED")
                print(
                    f"   File: "
                    f"{batch['relative_path']}"
                )
                print(
                    f"   Location: "
                    f"{batch['location']}"
                )
                print(
                    f"   Rows: "
                    f"{len(dataframe)}"
                )
                print(
                    f"   New history: "
                    f"{batch_new}"
                )
                print(
                    f"   Seen before: "
                    f"{batch_seen}"
                )
                print(
                    f"   New businesses: "
                    f"{batch_new_businesses}"
                )
                print(
                    f"   New locations: "
                    f"{batch_new_locations}"
                )
                print(
                    f"   Duplicate rows skipped: "
                    f"{batch_duplicates}"
                )

        connection.commit()

        print()
        print("===== IMPORT COMPLETE =====")
        print(
            f"Batches imported: "
            f"{total_batches}"
        )
        print(
            f"Batches skipped: "
            f"{skipped_batches}"
        )
        print(
            f"CSV rows processed: "
            f"{total_rows}"
        )
        print(
            f"New history records: "
            f"{total_new}"
        )
        print(
            f"Seen-before records: "
            f"{total_seen}"
        )
        print(
            f"New businesses: "
            f"{total_new_businesses}"
        )
        print(
            f"New locations: "
            f"{total_new_locations}"
        )
        print(
            f"Duplicate rows skipped: "
            f"{total_duplicates}"
        )
        print(
            f"Missing-name rows skipped: "
            f"{total_missing_name}"
        )

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Import historical Northova "
            "lead CSV batches into PostgreSQL."
        )
    )

    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST),
        help=(
            "Path to the historical "
            "import manifest."
        ),
    )

    parser.add_argument(
        "--apply",
        action="store_true",
        help=(
            "Insert data into PostgreSQL. "
            "Without this option, only a "
            "safe dry run is performed."
        ),
    )

    return parser.parse_args()


def main() -> None:
    arguments = parse_arguments()

    manifest_path = Path(
        arguments.manifest
    )

    if not manifest_path.is_absolute():
        manifest_path = (
            PROJECT_ROOT
            / manifest_path
        ).resolve()

    batches = load_manifest(
        manifest_path
    )

    if arguments.apply:
        apply_import(batches)

    else:
        run_dry_run(batches)


if __name__ == "__main__":
    main()
