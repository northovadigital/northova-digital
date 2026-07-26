from __future__ import annotations

from pathlib import Path

import pandas as pd

from auditors.website_auditor import audit_website


INPUT_FILE = Path("output/houston_restaurants_priority.csv")
OUTPUT_FILE = Path("output/houston_restaurants_audited_test.csv")
TEST_LIMIT = 5


def main() -> None:
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Input CSV not found: {INPUT_FILE.resolve()}"
        )

    dataframe = pd.read_csv(INPUT_FILE)

    website_rows = dataframe[
        dataframe["website"].fillna("").str.strip().ne("")
    ].head(TEST_LIMIT)

    if website_rows.empty:
        print("No restaurant websites found for testing.")
        return

    audited_records: list[dict] = []
    total = len(website_rows)

    print(f"\nAuditing {total} restaurant websites...\n")

    for position, (_, row) in enumerate(
        website_rows.iterrows(),
        start=1,
    ):
        business_name = str(row.get("business_name", "Unknown"))
        website = row.get("website", "")

        print(f"[{position}/{total}] {business_name}")
        print(f"Website: {website}")

        audit_result = audit_website(website)

        complete_record = row.to_dict()
        complete_record.update(audit_result)
        audited_records.append(complete_record)

        print(
            "Result:",
            audit_result["website_status"],
            "| Issues:",
            audit_result["website_issues"] or "None detected",
        )
        print("-" * 70)

    output_dataframe = pd.DataFrame(audited_records)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    output_dataframe.to_csv(
        OUTPUT_FILE,
        index=False,
        encoding="utf-8-sig",
    )

    print("\nAudit completed successfully.")
    print(f"Output file: {OUTPUT_FILE.resolve()}")


if __name__ == "__main__":
    main()