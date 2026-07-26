from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

from processing.eligibility_filter import (
    classify_lead_eligibility,
)
from processing.lead_scorer import (
    calculate_opportunity_score,
)


DEFAULT_INPUT = Path(
    "output/houston_restaurants_audited.csv"
)

DEFAULT_OUTPUT = Path(
    "output/houston_restaurants_scored.csv"
)


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Filter and score audited business leads."
        )
    )

    parser.add_argument(
        "--input",
        default=str(DEFAULT_INPUT),
        help="Input audited CSV file.",
    )

    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT),
        help="Output scored CSV file.",
    )

    return parser.parse_args()


def main() -> None:
    args = parse_arguments()

    input_file = Path(args.input)
    output_file = Path(args.output)

    if not input_file.exists():
        raise FileNotFoundError(
            f"Input CSV not found: "
            f"{input_file.resolve()}"
        )

    dataframe = pd.read_csv(input_file)

    eligibility_results = dataframe.apply(
        lambda row: classify_lead_eligibility(
            row.to_dict()
        ),
        axis=1,
    )

    dataframe["eligibility_status"] = [
        result[0]
        for result in eligibility_results
    ]

    dataframe["website_ownership_type"] = [
        result[1]
        for result in eligibility_results
    ]

    dataframe["exclusion_reason"] = [
        result[2]
        for result in eligibility_results
    ]

    dataframe["eligibility_sales_angle"] = [
        result[3]
        for result in eligibility_results
    ]

    scoring_results = dataframe.apply(
        lambda row: calculate_opportunity_score(
            row.to_dict()
        ),
        axis=1,
    )

    dataframe["opportunity_score"] = [
        result[0]
        for result in scoring_results
    ]

    dataframe["qualification"] = [
        result[1]
        for result in scoring_results
    ]

    dataframe["sales_angle"] = [
        result[2]
        for result in scoring_results
    ]

    dataframe["score_reasons"] = [
        result[3]
        for result in scoring_results
    ]

    for index, row in dataframe.iterrows():
        eligibility_status = row[
            "eligibility_status"
        ]

        ownership_type = row[
            "website_ownership_type"
        ]

        eligibility_angle = row[
            "eligibility_sales_angle"
        ]

        if eligibility_status == "excluded":
            dataframe.at[
                index,
                "opportunity_score",
            ] = 0

            dataframe.at[
                index,
                "qualification",
            ] = "excluded"

            dataframe.at[
                index,
                "sales_angle",
            ] = eligibility_angle

            dataframe.at[
                index,
                "score_reasons",
            ] = row["exclusion_reason"]

        elif eligibility_status == "manual_review":
            dataframe.at[
                index,
                "qualification",
            ] = "manual_review"

            dataframe.at[
                index,
                "sales_angle",
            ] = eligibility_angle

            current_reasons = str(
                row["score_reasons"]
            ).strip()

            exclusion_reason = str(
                row["exclusion_reason"]
            ).strip()

            dataframe.at[
                index,
                "score_reasons",
            ] = "; ".join(
                reason
                for reason in [
                    exclusion_reason,
                    current_reasons,
                ]
                if reason
                and reason.lower() != "nan"
            )

        elif ownership_type in {
            "social_only",
            "third_party_only",
        }:
            current_angle = str(
                row["sales_angle"]
            ).strip()

            combined_angles = [
                eligibility_angle,
            ]

            if (
                current_angle
                and current_angle.lower() != "nan"
            ):
                combined_angles.append(
                    current_angle
                )

            dataframe.at[
                index,
                "sales_angle",
            ] = "; ".join(
                dict.fromkeys(combined_angles)
            )

    qualification_order = {
        "priority": 1,
        "qualified": 2,
        "manual_review": 3,
        "low_priority": 4,
        "excluded": 5,
    }

    dataframe["qualification_order"] = (
        dataframe["qualification"]
        .map(qualification_order)
        .fillna(99)
    )

    dataframe = dataframe.sort_values(
        by=[
            "qualification_order",
            "opportunity_score",
        ],
        ascending=[
            True,
            False,
        ],
    )

    dataframe = dataframe.drop(
        columns=["qualification_order"]
    )

    output_file.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    dataframe.to_csv(
        output_file,
        index=False,
        encoding="utf-8-sig",
    )

    print(
        "\n===== FINAL LEAD SCORING SUMMARY ====="
    )

    print("Total leads:", len(dataframe))

    print("\nEligibility breakdown:")
    print(
        dataframe["eligibility_status"]
        .value_counts()
        .to_string()
    )

    print("\nWebsite ownership breakdown:")
    print(
        dataframe["website_ownership_type"]
        .value_counts()
        .to_string()
    )

    print("\nFinal qualification breakdown:")
    print(
        dataframe["qualification"]
        .value_counts()
        .to_string()
    )

    eligible_leads = dataframe[
        dataframe["eligibility_status"]
        == "eligible"
    ]

    print("\nTop 10 eligible leads:")
    print(
        eligible_leads[
            [
                "business_name",
                "website_ownership_type",
                "website_status",
                "opportunity_score",
                "qualification",
                "sales_angle",
            ]
        ]
        .head(10)
        .to_string(index=False)
    )

    print(
        f"\nOutput file: "
        f"{output_file.resolve()}"
    )


if __name__ == "__main__":
    main()