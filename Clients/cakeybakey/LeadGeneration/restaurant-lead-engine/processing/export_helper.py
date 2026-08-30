from __future__ import annotations

import re
from datetime import datetime
from typing import Any

import pandas as pd


def slugify(value: Any) -> str:
    text = str(value or "").strip().lower()

    text = re.sub(
        r"[^a-z0-9]+",
        "_",
        text,
    )

    return text.strip("_") or "unknown"


def parse_datetime(
    generated_at: str | None,
) -> datetime:
    if generated_at:
        try:
            return datetime.fromisoformat(
                generated_at
            )
        except ValueError:
            pass

    return datetime.now()


def prepare_lead_export(
    dataframe: pd.DataFrame,
    vertical_key: str,
    location: str,
    generated_at: str | None = None,
) -> tuple[pd.DataFrame, str]:
    export_data = dataframe.copy()

    generated_datetime = parse_datetime(
        generated_at
    )

    vertical_slug = slugify(
        vertical_key
    )

    city_name = (
        location.split(",")[0].strip()
        if location
        else "unknown"
    )

    city_slug = slugify(
        city_name
    )

    date_text = generated_datetime.strftime(
        "%Y-%m-%d"
    )

    time_text = generated_datetime.strftime(
        "%H%M"
    )

    batch_id = (
        f"{vertical_slug}-"
        f"{city_slug}-"
        f"{generated_datetime.strftime('%Y%m%d-%H%M')}"
    )

    metadata_columns = {
        "lead_batch_id": batch_id,
        "lead_generated_at": (
            generated_datetime.isoformat(
                timespec="minutes"
            )
        ),
        "lead_vertical": vertical_slug,
        "lead_location": location,
    }

    for position, (
        column,
        value,
    ) in enumerate(
        metadata_columns.items()
    ):
        if column in export_data.columns:
            export_data[column] = value
        else:
            export_data.insert(
                position,
                column,
                value,
            )

    filename = (
        f"northova_{vertical_slug}_"
        f"{city_slug}_winning_"
        f"{date_text}_{time_text}.csv"
    )

    return export_data, filename