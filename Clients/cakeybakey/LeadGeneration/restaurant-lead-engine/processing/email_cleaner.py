from __future__ import annotations

import re
from typing import Any
from urllib.parse import urlparse


EMAIL_PATTERN = re.compile(
    r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}",
    re.IGNORECASE,
)


BLOCKED_EMAIL_DOMAINS = {
    "cloudflare.com",
    "domain.com",
    "example.com",
    "example.net",
    "example.org",
    "gravatar.com",
    "mystore.com",
    "sentry.io",
    "shopify.com",
    "squarespace.com",
    "wixpress.com",
}


BLOCKED_LOCAL_PARTS = {
    "do-not-reply",
    "donotreply",
    "email",
    "example",
    "no-reply",
    "noreply",
    "null",
    "test",
    "user",
    "username",
    "your-email",
    "yourname",
}


PREFERRED_LOCAL_PARTS = {
    "info": 50,
    "contact": 48,
    "hello": 46,
    "reservations": 44,
    "reservation": 44,
    "orders": 42,
    "catering": 40,
    "sales": 38,
    "manager": 34,
    "office": 30,
    "media": 24,
}


def is_empty(value: Any) -> bool:
    if value is None:
        return True

    text = str(value).strip().lower()

    return text in {
        "",
        "nan",
        "none",
        "null",
    }


def normalize_domain(domain: str) -> str:
    normalized = domain.strip().lower()

    if normalized.startswith("www."):
        normalized = normalized[4:]

    return normalized.rstrip(".")


def extract_website_domain(
    website_url: Any,
) -> str:
    if is_empty(website_url):
        return ""

    url = str(website_url).strip()

    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"

    try:
        parsed_url = urlparse(url)
    except ValueError:
        return ""

    return normalize_domain(parsed_url.hostname or "")


def domain_matches(
    first_domain: str,
    second_domain: str,
) -> bool:
    if not first_domain or not second_domain:
        return False

    return (
        first_domain == second_domain
        or first_domain.endswith(f".{second_domain}")
        or second_domain.endswith(f".{first_domain}")
    )


def is_blocked_domain(
    email_domain: str,
) -> bool:
    return any(
        email_domain == blocked_domain or email_domain.endswith(f".{blocked_domain}")
        for blocked_domain in BLOCKED_EMAIL_DOMAINS
    )


def is_valid_candidate(
    email: str,
) -> bool:
    normalized_email = email.strip().lower()

    if "@" not in normalized_email:
        return False

    local_part, email_domain = normalized_email.rsplit("@", 1)

    email_domain = normalize_domain(email_domain)

    if not local_part or not email_domain or "." not in email_domain:
        return False

    normalized_local_part = local_part.replace("_", "-")

    if normalized_local_part in BLOCKED_LOCAL_PARTS:
        return False

    if normalized_local_part.startswith(
        (
            "noreply",
            "no-reply",
            "donotreply",
            "do-not-reply",
        )
    ):
        return False

    if is_blocked_domain(email_domain):
        return False

    return True


def calculate_email_score(
    email: str,
    website_domain: str,
) -> int:
    local_part, email_domain = email.rsplit("@", 1)

    score = 0

    if domain_matches(
        normalize_domain(email_domain),
        website_domain,
    ):
        score += 100

    normalized_local_part = local_part.lower().replace("_", "-").replace(".", "-")

    local_part_root = normalized_local_part.split("-", 1)[0]

    score += PREFERRED_LOCAL_PARTS.get(
        normalized_local_part,
        PREFERRED_LOCAL_PARTS.get(
            local_part_root,
            0,
        ),
    )

    return score


def clean_email_list(
    raw_emails: Any,
    website_url: Any = "",
    max_emails: int = 5,
) -> list[str]:
    if is_empty(raw_emails):
        return []

    website_domain = extract_website_domain(website_url)

    discovered_emails = EMAIL_PATTERN.findall(str(raw_emails))

    unique_emails: dict[str, str] = {}

    for discovered_email in discovered_emails:
        normalized_email = discovered_email.strip().lower().rstrip(".,;:")

        if not is_valid_candidate(normalized_email):
            continue

        unique_emails.setdefault(
            normalized_email,
            normalized_email,
        )

    sorted_emails = sorted(
        unique_emails.values(),
        key=lambda email: (
            -calculate_email_score(
                email,
                website_domain,
            ),
            email,
        ),
    )

    return sorted_emails[:max_emails]


def clean_extracted_emails(
    raw_emails: Any,
    website_url: Any = "",
    max_emails: int = 5,
) -> str:
    cleaned_emails = clean_email_list(
        raw_emails=raw_emails,
        website_url=website_url,
        max_emails=max_emails,
    )

    return ", ".join(cleaned_emails)
