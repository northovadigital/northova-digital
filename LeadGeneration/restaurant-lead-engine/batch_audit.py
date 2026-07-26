from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

from auditors.website_auditor import audit_website


DEFAULT_INPUT = Path("output/houston_restaurants_priority.csv")
DEFAULT_OUTPUT = Path("output/houston_restaurants_audited.csv")


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Audit restaurant websites from a CSV file."
    )

    parser.add_argument(
        "--input",
        default=str(DEFAULT_INPUT),
        help="Input restaurant CSV file.",
    )

    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT),
        help="Output audited CSV file.",
    )

    parser.add_argument(
        "--limit",
        type=int,
        default=20,
        help="Maximum number of unprocessed leads to audit.",
    )

    return parser.parse_args()


def main() -> None:
    args = parse_arguments()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if output_path.exists():
        dataframe = pd.read_csv(output_path)
        print(f"Resuming existing audit file: {output_path}")
    else:
        if not input_path.exists():
            raise FileNotFoundError(f"Input CSV not found: {input_path.resolve()}")

        dataframe = pd.read_csv(input_path)
        print(f"Starting new audit from: {input_path}")

    audit_columns = [
        "website_status",
        "audit_method",
        "http_status",
        "final_url",
        "uses_https",
        "mobile_viewport",
        "has_menu",
        "has_pdf_menu",
        "has_direct_ordering",
        "third_party_platforms",
        "has_reservation",
        "has_phone_cta",
        "has_contact_page",
        "extracted_emails",
        "instagram_url",
        "facebook_url",
        "twitter_url",
        "tiktok_url",
        "website_issues",
        "audit_error",
        "source_url_issue",
        "audited_at",
    ]

    for column in audit_columns:
        if column not in dataframe.columns:
            dataframe[column] = pd.Series(
                [None] * len(dataframe),
                dtype="object",
            )
        else:
            dataframe[column] = dataframe[column].astype("object")

    unprocessed_mask = (
        dataframe["website_status"]
        .fillna("")
        .astype(str)
        .str.strip()
        .isin(["", "not_checked"])
    )

    pending_indices = dataframe[unprocessed_mask].index.tolist()

    if args.limit > 0:
        pending_indices = pending_indices[: args.limit]

    if not pending_indices:
        print("No pending leads available for audit.")
        return

    total = len(pending_indices)

    print(f"\nAuditing {total} leads...\n")

    for position, index in enumerate(pending_indices, start=1):
        business_name = str(dataframe.at[index, "business_name"])
        website = dataframe.at[index, "website"]

        print(f"[{position}/{total}] {business_name}")
        print(f"Website: {website}")

        audit_result = audit_website(website)

        for key, value in audit_result.items():
            dataframe.at[index, key] = value

        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Save after every website so progress is not lost.
        dataframe.to_csv(
            output_path,
            index=False,
            encoding="utf-8-sig",
        )

        print(
            "Result:",
            audit_result["website_status"],
            "| Method:",
            audit_result["audit_method"] or "none",
        )

        print(
            "Issues:",
            audit_result["website_issues"] or "None detected",
        )

        print("-" * 70)

    print("\nBatch audit completed.")
    print(f"Output file: {output_path.resolve()}")


if __name__ == "__main__":
    main()
