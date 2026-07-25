from __future__ import annotations

import argparse
import random
import sys
from pathlib import Path

import pandas as pd

from extractors.overpass import ExtractionError, fetch_businesses
from processing.cleaner import (
    OUTPUT_COLUMNS,
    deduplicate_records,
    load_blocked_chains,
    normalize_elements,
    partition_blocked_chains,
)


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract restaurant leads into a standard CSV file."
    )

    parser.add_argument(
        "--location",
        default="Houston, Texas, USA",
        help="City or region to search.",
    )

    parser.add_argument(
        "--limit",
        type=int,
        default=200,
        help="Maximum number of records to export. Use 0 for all.",
    )

    parser.add_argument(
        "--output",
        default="output/houston_restaurants_raw.csv",
        help="CSV output path.",
    )

    parser.add_argument(
        "--include-chains",
        action="store_true",
        help="Include blocked national chains in the final CSV.",
    )

    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed used to produce a mixed result set.",
    )

    return parser.parse_args()


def main() -> int:
    args = parse_arguments()

    print(f"Searching businesses in: {args.location}")

    try:
        raw_elements = fetch_businesses(args.location)
    except ExtractionError as exc:
        print(f"\nExtraction failed:\n{exc}", file=sys.stderr)
        return 1
    except Exception as exc:
        print(f"\nUnexpected error: {exc}", file=sys.stderr)
        return 1

    print(f"Raw OpenStreetMap records: {len(raw_elements)}")

    normalized_records = normalize_elements(raw_elements)
    print(f"Named business records: {len(normalized_records)}")

    unique_records = deduplicate_records(normalized_records)
    print(f"After deduplication: {len(unique_records)}")

    blocked_chains = load_blocked_chains("config/blocked_chains.txt")

    allowed_records, blocked_records = partition_blocked_chains(
        unique_records,
        blocked_chains,
    )

    print(f"National chains filtered: {len(blocked_records)}")

    if args.include_chains:
        candidate_records = allowed_records + blocked_records
    else:
        candidate_records = allowed_records

    target_categories = {
        "restaurant",
        "cafe",
        "fast_food",
        "bar",
        "pub",
        "bakery",
    }

    category_records = [
        record
        for record in candidate_records
        if record.get("category") in target_categories
    ]

    print(
        "Restaurant-category records: "
        f"{len(category_records)}"
    )

    def calculate_data_quality(record: dict) -> int:
        score = 0

        if record.get("phone"):
            score += 4

        if record.get("email"):
            score += 3

        if record.get("full_address"):
            score += 3

        if record.get("website"):
            score += 2

        if record.get("opening_hours"):
            score += 1

        if record.get("cuisine"):
            score += 1

        return score

    for record in category_records:
        record["data_quality_score"] = calculate_data_quality(record)
        record["manual_status"] = "pending_review"
        record["website_issue"] = ""
        record["ordering_status"] = ""
        record["sales_angle"] = ""
        record["outreach_status"] = "not_contacted"
        record["notes"] = ""

    # Randomize records with equal scores, then place the most
    # complete and contactable businesses first.
    random.Random(args.seed).shuffle(category_records)

    final_records = sorted(
        category_records,
        key=lambda record: record["data_quality_score"],
        reverse=True,
    )

    if args.limit > 0:
        final_records = final_records[: args.limit]

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    dataframe = pd.DataFrame(final_records)

    if dataframe.empty:
        dataframe = pd.DataFrame(columns=OUTPUT_COLUMNS)
    else:
        dataframe = dataframe.reindex(columns=OUTPUT_COLUMNS)

    dataframe.to_csv(
        output_path,
        index=False,
        encoding="utf-8-sig",
    )

    print(f"Final exported records: {len(dataframe)}")
    print(f"CSV created: {output_path.resolve()}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
