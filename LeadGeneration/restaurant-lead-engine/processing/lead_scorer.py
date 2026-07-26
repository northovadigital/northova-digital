from __future__ import annotations

from typing import Any, Mapping

import pandas as pd


def is_empty(value: Any) -> bool:
    if value is None:
        return True

    try:
        if pd.isna(value):
            return True
    except (TypeError, ValueError):
        pass

    return str(value).strip().lower() in {"", "nan", "none"}


def as_boolean(value: Any) -> bool:
    if isinstance(value, bool):
        return value

    if is_empty(value):
        return False

    return str(value).strip().lower() in {
        "true",
        "1",
        "yes",
        "y",
    }


def calculate_opportunity_score(
    record: Mapping[str, Any],
) -> tuple[int, str, str, str]:
    score = 0
    reasons: list[str] = []
    sales_angles: list[str] = []

    website_status = str(record.get("website_status", "")).strip().lower()

    website = record.get("website")

    if is_empty(website) or website_status == "missing":
        score += 40
        reasons.append("No website")
        sales_angles.append("Build a modern restaurant website")

    elif website_status == "unreachable":
        http_status = str(record.get("http_status", "")).strip()

        # Pandas may load HTTP status as 404.0 instead of 404.
        if http_status.endswith(".0"):
            http_status = http_status[:-2]

        audit_method = str(record.get("audit_method", "")).strip().lower()

        if http_status in {
            "404",
            "500",
            "502",
            "503",
            "522",
        }:
            score += 35
            reasons.append(f"Website returned HTTP {http_status}")
            sales_angles.append("Repair or replace the broken website")

        elif http_status in {"401", "403", "429"}:
            score += 10
            reasons.append(f"Website audit blocked with HTTP {http_status}")
            sales_angles.append("Manual website review required")

        elif audit_method == "playwright_failed":
            score += 10
            reasons.append("Automated website audit failed")
            sales_angles.append("Manual website review required")

        else:
            score += 20
            reasons.append("Website could not be reached")
            sales_angles.append("Verify and improve website availability")

    elif website_status == "working":
        if not as_boolean(record.get("uses_https")):
            score += 10
            reasons.append("HTTPS missing")
            sales_angles.append("Secure and modernize the website")

        if not as_boolean(record.get("mobile_viewport")):
            score += 15
            reasons.append("Mobile support not detected")
            sales_angles.append("Create a mobile-friendly experience")

        if not as_boolean(record.get("has_menu")):
            score += 10
            reasons.append("Menu not detected")
            sales_angles.append("Add an accessible digital menu")

        if as_boolean(record.get("has_pdf_menu")):
            score += 8
            reasons.append("PDF menu detected")
            sales_angles.append("Replace the PDF with a mobile digital menu")

        has_direct_ordering = as_boolean(record.get("has_direct_ordering"))

        third_party_platforms = record.get("third_party_platforms")

        if not has_direct_ordering:
            score += 20
            reasons.append("Direct ordering not detected")
            sales_angles.append("Add a direct online ordering system")

        if not is_empty(third_party_platforms) and not has_direct_ordering:
            score += 15
            reasons.append("Third-party ordering only")
            sales_angles.append("Reduce third-party ordering commissions")

        if not as_boolean(record.get("has_reservation")):
            score += 5
            reasons.append("Reservation CTA not detected")

        if not as_boolean(record.get("has_phone_cta")):
            score += 5
            reasons.append("Phone CTA not detected")

        if not as_boolean(record.get("has_contact_page")):
            score += 5
            reasons.append("Contact page not detected")

        source_url_issue = record.get("source_url_issue")

        if not is_empty(source_url_issue):
            score += 5
            reasons.append(str(source_url_issue))

    phone = record.get("phone")
    email = record.get("email")
    extracted_emails = record.get("extracted_emails")

    if not is_empty(phone):
        score += 5
        reasons.append("Phone available")

    if not is_empty(email) or not is_empty(extracted_emails):
        score += 5
        reasons.append("Email available")

    score = min(score, 100)

    if score >= 70:
        qualification = "priority"
    elif score >= 50:
        qualification = "qualified"
    elif score >= 30:
        qualification = "manual_review"
    else:
        qualification = "low_priority"

    unique_angles = list(dict.fromkeys(sales_angles))

    sales_angle = (
        "; ".join(unique_angles[:3])
        if unique_angles
        else "Manual website review required"
    )

    score_reasons = "; ".join(reasons)

    return (
        score,
        qualification,
        sales_angle,
        score_reasons,
    )
