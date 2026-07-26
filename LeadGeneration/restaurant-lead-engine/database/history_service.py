from __future__ import annotations

import argparse
import os
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd
from psycopg.types.json import Jsonb

from config.database import get_connection
from database.import_history import (
    as_text,
    build_location_key,
    clean_json_mapping,
    file_sha256,
    get_country_from_location,
    get_observed_at,
    get_row_address,
    resolve_location,
    safe_int,
    stable_hash,
    upsert_source_reference,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]


HISTORY_COLUMNS = [
    "lead_batch_key",
    "lead_history_status",
    "lead_previous_seen_count",
    "lead_first_seen_at",
    "lead_last_seen_at",
    "lead_times_seen",
]


def initialize_history_columns(
    dataframe: pd.DataFrame,
) -> pd.DataFrame:
    prepared = dataframe.copy()

    for column in HISTORY_COLUMNS:
        prepared[column] = pd.Series(
            [None] * len(prepared),
            index=prepared.index,
            dtype="object",
        )

    return prepared


def parse_generated_at(
    value: str | None,
    fallback_file: Path,
) -> datetime:
    if value:
        try:
            parsed = datetime.fromisoformat(
                value.replace(
                    "Z",
                    "+00:00",
                )
            )

            if parsed.tzinfo is None:
                return parsed.astimezone()

            return parsed

        except ValueError as error:
            raise RuntimeError(
                "generated_at must be a valid "
                "ISO datetime."
            ) from error

    return datetime.fromtimestamp(
        fallback_file.stat().st_mtime
    ).astimezone()


def build_pipeline_batch_key(
    vertical_key: str,
    location: str,
    generated_at: datetime,
    content_hash: str,
) -> str:
    identity_hash = stable_hash(
        vertical_key,
        location,
        generated_at.isoformat(),
        content_hash,
    )

    return (
        "pipeline-"
        + identity_hash[:48]
    )


def validate_scored_dataframe(
    dataframe: pd.DataFrame,
) -> None:
    required_columns = {
        "business_name",
        "eligibility_status",
        "qualification",
        "opportunity_score",
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
            "Scored file is missing required "
            f"columns: {missing_text}"
        )


def insert_pipeline_batch(
    cursor,
    batch_key: str,
    vertical_key: str,
    location: str,
    requested_lead_count: int,
    generated_at: datetime,
    source_file: str,
    file_hash: str,
    run_metadata: dict[str, Any],
) -> int:
    metadata = {
        "import_type": "pipeline_run",
        "file_sha256": file_hash,
        **run_metadata,
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
            batch_key,
            vertical_key,
            location,
            requested_lead_count,
            generated_at,
            source_file,
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
            "Could not create pipeline batch."
        )

    return int(result[0])


def get_previous_observation_count(
    cursor,
    location_id: int,
) -> int:
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM lead_engine.lead_observations
        WHERE business_location_id = %s
        """,
        (location_id,),
    )

    result = cursor.fetchone()

    if result is None:
        return 0

    return int(result[0])


def insert_pipeline_observation(
    cursor,
    batch_id: int,
    location_id: int,
    row: dict[str, Any],
    source_external_id: str,
    observed_at: datetime,
    raw_payload: dict[str, Any],
    previous_seen_count: int,
) -> str:
    history_status = (
        "seen_before"
        if previous_seen_count > 0
        else "new"
    )

    source_system = (
        as_text(row.get("source"))
        .lower()
        or "osm"
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
            previous_seen_count,
            as_text(
                row.get("business_name")
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
                row.get("extracted_emails")
            )
            or None,
            get_row_address(row)
            or None,
            as_text(
                row.get("website_status")
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
                row.get("qualification")
            )
            or None,
            as_text(
                row.get("sales_angle")
            )
            or None,
            as_text(
                row.get("score_reasons")
            )
            or None,
            source_system,
            source_external_id or None,
            Jsonb(raw_payload),
            observed_at,
        ),
    )

    return history_status


def get_location_history(
    cursor,
    location_id: int,
) -> dict[str, Any]:
    cursor.execute(
        """
        SELECT
            first_seen_at,
            last_seen_at,
            times_seen
        FROM lead_engine.business_locations
        WHERE id = %s
        """,
        (location_id,),
    )

    result = cursor.fetchone()

    if result is None:
        raise RuntimeError(
            "Could not read location history."
        )

    return {
        "first_seen_at": (
            result[0].isoformat()
            if result[0]
            else ""
        ),
        "last_seen_at": (
            result[1].isoformat()
            if result[1]
            else ""
        ),
        "times_seen": int(
            result[2]
        ),
    }


def get_existing_batch_id(
    cursor,
    batch_key: str,
) -> int | None:
    cursor.execute(
        """
        SELECT id
        FROM lead_engine.lead_batches
        WHERE batch_key = %s
        """,
        (batch_key,),
    )

    result = cursor.fetchone()

    if result is None:
        return None

    return int(result[0])


def get_existing_batch_summary(
    cursor,
    batch_id: int,
) -> dict[str, int]:
    cursor.execute(
        """
        SELECT
            COUNT(*),
            COUNT(*) FILTER (
                WHERE history_status = 'new'
            ),
            COUNT(*) FILTER (
                WHERE history_status = 'seen_before'
            )
        FROM lead_engine.lead_observations
        WHERE batch_id = %s
        """,
        (batch_id,),
    )

    result = cursor.fetchone()

    if result is None:
        return {
            "observations": 0,
            "new": 0,
            "seen_before": 0,
        }

    return {
        "observations": int(
            result[0]
        ),
        "new": int(
            result[1]
        ),
        "seen_before": int(
            result[2]
        ),
    }


def annotate_existing_batch(
    cursor,
    dataframe: pd.DataFrame,
    batch_id: int,
    batch_key: str,
    vertical_key: str,
    country: str,
) -> pd.DataFrame:
    cursor.execute(
        """
        SELECT
            business_locations.location_key,
            lead_observations.history_status,
            lead_observations.previous_seen_count,
            business_locations.first_seen_at,
            business_locations.last_seen_at,
            business_locations.times_seen
        FROM lead_engine.lead_observations
        INNER JOIN lead_engine.business_locations
            ON business_locations.id =
                lead_observations.business_location_id
        WHERE lead_observations.batch_id = %s
        """,
        (batch_id,),
    )

    history_by_location = {
        row[0]: {
            "status": row[1],
            "previous_seen_count": int(
                row[2]
            ),
            "first_seen_at": (
                row[3].isoformat()
                if row[3]
                else ""
            ),
            "last_seen_at": (
                row[4].isoformat()
                if row[4]
                else ""
            ),
            "times_seen": int(
                row[5]
            ),
        }
        for row in cursor.fetchall()
    }

    annotated = initialize_history_columns(
        dataframe
    )

    for index, series in annotated.iterrows():
        row = series.to_dict()

        (
            location_key,
            _domain,
            _phone,
            _address,
            _source_external_id,
        ) = build_location_key(
            row=row,
            vertical_key=vertical_key,
            country=country,
        )

        history = history_by_location.get(
            location_key
        )

        if history is None:
            continue

        annotated.at[
            index,
            "lead_batch_key",
        ] = batch_key

        annotated.at[
            index,
            "lead_history_status",
        ] = history["status"]

        annotated.at[
            index,
            "lead_previous_seen_count",
        ] = history[
            "previous_seen_count"
        ]

        annotated.at[
            index,
            "lead_first_seen_at",
        ] = history["first_seen_at"]

        annotated.at[
            index,
            "lead_last_seen_at",
        ] = history["last_seen_at"]

        annotated.at[
            index,
            "lead_times_seen",
        ] = history["times_seen"]

    return annotated


def write_annotated_csv(
    dataframe: pd.DataFrame,
    scored_file: Path,
) -> None:
    temporary_file = scored_file.with_name(
        f".{scored_file.name}.tmp"
    )

    dataframe.to_csv(
        temporary_file,
        index=False,
        encoding="utf-8-sig",
    )

    os.replace(
        temporary_file,
        scored_file,
    )


def dry_run_registration(
    dataframe: pd.DataFrame,
    vertical_key: str,
    location: str,
) -> dict[str, int]:
    country = get_country_from_location(
        location
    )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    business_locations.location_key,
                    COUNT(
                        lead_observations.id
                    )
                FROM lead_engine.business_locations
                LEFT JOIN lead_engine.lead_observations
                    ON lead_observations.business_location_id =
                        business_locations.id
                GROUP BY
                    business_locations.location_key
                """
            )

            existing_counts = {
                row[0]: int(row[1])
                for row in cursor.fetchall()
            }

        batch_location_keys: set[str] = set()

        summary = {
            "rows": len(dataframe),
            "new": 0,
            "seen_before": 0,
            "duplicate_in_batch": 0,
            "missing_name": 0,
        }

        for _, series in dataframe.iterrows():
            row = series.to_dict()

            if not as_text(
                row.get("business_name")
            ):
                summary["missing_name"] += 1
                continue

            (
                location_key,
                _domain,
                _phone,
                _address,
                _source_external_id,
            ) = build_location_key(
                row=row,
                vertical_key=vertical_key,
                country=country,
            )

            if (
                location_key
                in batch_location_keys
            ):
                summary[
                    "duplicate_in_batch"
                ] += 1
                continue

            batch_location_keys.add(
                location_key
            )

            if (
                existing_counts.get(
                    location_key,
                    0,
                )
                > 0
            ):
                summary[
                    "seen_before"
                ] += 1

            else:
                summary["new"] += 1

        return summary

    finally:
        connection.close()


def register_scored_file(
    scored_file: Path,
    vertical_key: str,
    location: str,
    generated_at: datetime,
    requested_lead_count: int,
    run_metadata: dict[str, Any] | None = None,
    apply: bool = False,
    annotate_csv: bool = True,
) -> dict[str, Any]:
    scored_file = scored_file.resolve()

    if not scored_file.exists():
        raise FileNotFoundError(
            f"Scored file not found: "
            f"{scored_file}"
        )

    dataframe = pd.read_csv(
        scored_file
    )

    validate_scored_dataframe(
        dataframe
    )

    content_hash = file_sha256(
        scored_file
    )

    batch_key = build_pipeline_batch_key(
        vertical_key=vertical_key,
        location=location,
        generated_at=generated_at,
        content_hash=content_hash,
    )

    if not apply:
        dry_summary = dry_run_registration(
            dataframe=dataframe,
            vertical_key=vertical_key,
            location=location,
        )

        return {
            "mode": "dry_run",
            "batch_key": batch_key,
            **dry_summary,
        }

    country = get_country_from_location(
        location
    )

    try:
        relative_file = (
            scored_file.relative_to(
                PROJECT_ROOT
            ).as_posix()
        )

    except ValueError:
        relative_file = str(
            scored_file
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            existing_batch_id = (
                get_existing_batch_id(
                    cursor,
                    batch_key,
                )
            )

            if existing_batch_id is not None:
                existing_summary = (
                    get_existing_batch_summary(
                        cursor,
                        existing_batch_id,
                    )
                )

                annotated = (
                    annotate_existing_batch(
                        cursor=cursor,
                        dataframe=dataframe,
                        batch_id=(
                            existing_batch_id
                        ),
                        batch_key=batch_key,
                        vertical_key=(
                            vertical_key
                        ),
                        country=country,
                    )
                )

                connection.commit()

                if annotate_csv:
                    write_annotated_csv(
                        dataframe=annotated,
                        scored_file=scored_file,
                    )

                return {
                    "mode": "already_registered",
                    "batch_key": batch_key,
                    **existing_summary,
                }

            batch_id = insert_pipeline_batch(
                cursor=cursor,
                batch_key=batch_key,
                vertical_key=vertical_key,
                location=location,
                requested_lead_count=(
                    requested_lead_count
                ),
                generated_at=generated_at,
                source_file=relative_file,
                file_hash=content_hash,
                run_metadata=(
                    run_metadata or {}
                ),
            )

            annotated = initialize_history_columns(
                dataframe
            )

            batch_location_keys: set[str] = (
                set()
            )

            summary = {
                "rows": len(dataframe),
                "observations": 0,
                "new": 0,
                "seen_before": 0,
                "duplicate_in_batch": 0,
                "missing_name": 0,
                "new_businesses": 0,
                "new_locations": 0,
            }

            for index, series in (
                dataframe.iterrows()
            ):
                row = series.to_dict()

                business_name = as_text(
                    row.get("business_name")
                )

                if not business_name:
                    summary["missing_name"] += 1

                    annotated.at[
                        index,
                        "lead_batch_key",
                    ] = batch_key

                    annotated.at[
                        index,
                        "lead_history_status",
                    ] = "missing_business_name"

                    continue

                (
                    temporary_location_key,
                    _domain,
                    _phone,
                    _address,
                    _source_external_id,
                ) = build_location_key(
                    row=row,
                    vertical_key=vertical_key,
                    country=country,
                )

                if (
                    temporary_location_key
                    in batch_location_keys
                ):
                    summary[
                        "duplicate_in_batch"
                    ] += 1

                    annotated.at[
                        index,
                        "lead_batch_key",
                    ] = batch_key

                    annotated.at[
                        index,
                        "lead_history_status",
                    ] = "duplicate_in_batch"

                    continue

                batch_location_keys.add(
                    temporary_location_key
                )

                observed_at = get_observed_at(
                    row,
                    generated_at,
                )

                raw_payload = (
                    clean_json_mapping(
                        row
                    )
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
                    vertical_key=vertical_key,
                    country=country,
                    observed_at=observed_at,
                )

                previous_seen_count = (
                    get_previous_observation_count(
                        cursor,
                        location_id,
                    )
                )

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
                    insert_pipeline_observation(
                        cursor=cursor,
                        batch_id=batch_id,
                        location_id=location_id,
                        row=row,
                        source_external_id=(
                            source_external_id
                        ),
                        observed_at=observed_at,
                        raw_payload=raw_payload,
                        previous_seen_count=(
                            previous_seen_count
                        ),
                    )
                )

                location_history = (
                    get_location_history(
                        cursor,
                        location_id,
                    )
                )

                annotated.at[
                    index,
                    "lead_batch_key",
                ] = batch_key

                annotated.at[
                    index,
                    "lead_history_status",
                ] = history_status

                annotated.at[
                    index,
                    "lead_previous_seen_count",
                ] = previous_seen_count

                annotated.at[
                    index,
                    "lead_first_seen_at",
                ] = location_history[
                    "first_seen_at"
                ]

                annotated.at[
                    index,
                    "lead_last_seen_at",
                ] = location_history[
                    "last_seen_at"
                ]

                annotated.at[
                    index,
                    "lead_times_seen",
                ] = location_history[
                    "times_seen"
                ]

                summary["observations"] += 1
                summary[history_status] += 1

                if business_created:
                    summary[
                        "new_businesses"
                    ] += 1

                if location_created:
                    summary[
                        "new_locations"
                    ] += 1

        connection.commit()

        if annotate_csv:
            write_annotated_csv(
                dataframe=annotated,
                scored_file=scored_file,
            )

        return {
            "mode": "registered",
            "batch_key": batch_key,
            **summary,
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def print_summary(
    summary: dict[str, Any],
) -> None:
    print(
        "===== LEAD HISTORY SUMMARY ====="
    )

    print(
        f"Mode: {summary['mode']}"
    )

    print(
        f"Batch key: "
        f"{summary['batch_key']}"
    )

    for key in [
        "rows",
        "observations",
        "new",
        "seen_before",
        "new_businesses",
        "new_locations",
        "duplicate_in_batch",
        "missing_name",
    ]:
        if key in summary:
            label = key.replace(
                "_",
                " ",
            ).title()

            print(
                f"{label}: "
                f"{summary[key]}"
            )


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Register a scored lead file "
            "in PostgreSQL history."
        )
    )

    parser.add_argument(
        "--scored-file",
        required=True,
    )

    parser.add_argument(
        "--vertical",
        required=True,
    )

    parser.add_argument(
        "--location",
        required=True,
    )

    parser.add_argument(
        "--generated-at",
    )

    parser.add_argument(
        "--requested-leads",
        type=int,
    )

    parser.add_argument(
        "--apply",
        action="store_true",
    )

    parser.add_argument(
        "--no-annotate",
        action="store_true",
    )

    return parser.parse_args()


def main() -> None:
    arguments = parse_arguments()

    scored_file = Path(
        arguments.scored_file
    )

    if not scored_file.is_absolute():
        scored_file = (
            PROJECT_ROOT
            / scored_file
        )

    generated_at = parse_generated_at(
        arguments.generated_at,
        scored_file,
    )

    dataframe = pd.read_csv(
        scored_file
    )

    requested_leads = (
        arguments.requested_leads
        if arguments.requested_leads
        is not None
        else len(dataframe)
    )

    summary = register_scored_file(
        scored_file=scored_file,
        vertical_key=arguments.vertical,
        location=arguments.location,
        generated_at=generated_at,
        requested_lead_count=(
            requested_leads
        ),
        run_metadata={
            "registered_from": (
                "history_service_cli"
            )
        },
        apply=arguments.apply,
        annotate_csv=(
            not arguments.no_annotate
        ),
    )

    print_summary(summary)


if __name__ == "__main__":
    main()
