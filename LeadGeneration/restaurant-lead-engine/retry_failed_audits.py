from __future__ import annotations

import argparse
import gc
import time
from pathlib import Path
from typing import Any

import pandas as pd

from auditors.website_auditor import (
    audit_website,
    create_empty_result,
)


DEFAULT_INPUT = Path("output/restaurants_audited.csv")

TRANSIENT_HTTP_STATUSES = {
    500,
    502,
    503,
    504,
    520,
    522,
    524,
}


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=("Retry temporary or failed website audits.")
    )

    parser.add_argument(
        "--input",
        default=str(DEFAULT_INPUT),
        help="Audited CSV file to update.",
    )

    parser.add_argument(
        "--attempts",
        type=int,
        default=2,
        help=("Maximum audit attempts per failed website."),
    )

    parser.add_argument(
        "--delay",
        type=float,
        default=2,
        help=("Seconds to wait between websites."),
    )

    parser.add_argument(
        "--cooldown-after",
        type=int,
        default=10,
        help=("Take a longer pause after this many websites."),
    )

    return parser.parse_args()


def normalize_http_status(
    value: Any,
) -> int | None:
    try:
        if pd.isna(value):
            return None
    except (TypeError, ValueError):
        pass

    try:
        return int(float(str(value).strip()))
    except (TypeError, ValueError):
        return None


def should_retry(
    row: pd.Series,
) -> bool:
    audit_method = str(row.get("audit_method", "")).strip().lower()

    website_status = str(row.get("website_status", "")).strip().lower()

    http_status = normalize_http_status(row.get("http_status"))

    if audit_method == "playwright_failed":
        return True

    if website_status == "error":
        return True

    return http_status in TRANSIENT_HTTP_STATUSES


def main() -> None:
    args = parse_arguments()

    audited_file = Path(args.input)

    if not audited_file.exists():
        raise FileNotFoundError(f"Audited CSV not found: {audited_file.resolve()}")

    dataframe = pd.read_csv(audited_file)

    audit_columns = list(create_empty_result().keys())

    for column in audit_columns:
        if column not in dataframe.columns:
            dataframe[column] = pd.Series(
                [None] * len(dataframe),
                dtype="object",
            )
        else:
            dataframe[column] = dataframe[column].astype("object")

    retry_indices = [index for index, row in dataframe.iterrows() if should_retry(row)]

    if not retry_indices:
        print("No temporary failed audits need retrying.")
        return

    total = len(retry_indices)
    recovered_count = 0

    print(f"\nRetrying {total} temporary website audit failures...\n")

    for position, index in enumerate(
        retry_indices,
        start=1,
    ):
        business_name = str(
            dataframe.at[
                index,
                "business_name",
            ]
        )

        website = dataframe.at[
            index,
            "website",
        ]

        print(f"[{position}/{total}] {business_name}")
        print(f"Website: {website}")

        previous_method = (
            str(
                dataframe.at[
                    index,
                    "audit_method",
                ]
            )
            .strip()
            .lower()
        )

        final_result: dict[str, Any] | None = None

        for attempt in range(
            1,
            args.attempts + 1,
        ):
            print(f"Attempt: {attempt}/{args.attempts}")

            final_result = audit_website(website)

            if final_result["audit_method"] != "playwright_failed":
                break

            if attempt < args.attempts:
                time.sleep(5)

        if final_result is None:
            continue

        for key, value in final_result.items():
            dataframe.at[
                index,
                key,
            ] = value

        dataframe.to_csv(
            audited_file,
            index=False,
            encoding="utf-8-sig",
        )

        new_method = str(final_result["audit_method"]).strip().lower()

        if previous_method == "playwright_failed" and new_method != "playwright_failed":
            recovered_count += 1

        print(
            "Result:",
            final_result["website_status"],
            "| Method:",
            final_result["audit_method"] or "none",
        )

        print(
            "Issues:",
            final_result["website_issues"] or "None detected",
        )

        print("-" * 70)

        gc.collect()
        time.sleep(args.delay)

        if args.cooldown_after > 0 and position % args.cooldown_after == 0:
            print("\nCooling down before continuing...\n")
            time.sleep(10)

    remaining_failures = int(
        (
            dataframe["audit_method"].fillna("").astype(str).str.strip().str.lower()
            == "playwright_failed"
        ).sum()
    )

    print("\nAutomatic audit retry completed.")
    print(
        "Recovered websites:",
        recovered_count,
    )
    print(
        "Still requiring manual review:",
        remaining_failures,
    )
    print(
        "Updated file:",
        audited_file.resolve(),
    )


if __name__ == "__main__":
    main()
