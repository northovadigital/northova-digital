from __future__ import annotations

from typing import Any, Mapping
from urllib.parse import urlparse

import pandas as pd


CHAIN_DOMAINS = {
    "bahamabucks.com",
    "benihana.com",
    "bluestonelane.com",
    "campero.com",
    "cava.com",
    "culvers.com",
    "dairyqueen.com",
    "einsteinbros.com",
    "freebirds.com",
    "gusfriedchicken.com",
    "houseofblues.com",
    "lamadeleine.com",
    "locations.modpizza.com",
    "locations.schlotzskys.com",
    "locations.wafflehouse.com",
    "maggianos.com",
    "modpizza.com",
    "pandaexpress.com",
    "pappadeaux.com",
    "pfchangs.com",
    "shakeshack.com",
    "tacocabana.com",
    "tacodeli.com",
    "torchystacos.com",
    "velvettaco.com",
    "voodoodoughnut.com",
    "yardhouse.com",
}

CHAIN_NAMES = {
    "bahama buck's original shaved ice",
    "benihana",
    "bluestone lane",
    "cava",
    "culver's",
    "dq grill & chill",
    "einstein bros. bagels",
    "freebirds",
    "house of blues",
    "la madeleine",
    "luby's",
    "maggiano's little italy",
    "mod pizza",
    "p.f. chang's",
    "panda express",
    "pappadeaux seafood kitchen",
    "pollo campero",
    "schlotzsky's",
    "shake shack",
    "taco cabana",
    "torchy's tacos",
    "velvet taco",
    "voodoo doughnut",
    "waffle house",
    "yard house",
}

SOCIAL_DOMAINS = {
    "facebook.com",
    "instagram.com",
    "linktr.ee",
    "tiktok.com",
}

THIRD_PARTY_DOMAINS = {
    "business.site",
    "chownow.com",
    "clover.com",
    "doordash.com",
    "ezcater.com",
    "grubhub.com",
    "order.online",
    "seamless.com",
    "singleplatform.com",
    "slice.com",
    "square.site",
    "toasttab.com",
    "ubereats.com",
    "yelp.com",
}

CORPORATE_OR_HOTEL_DOMAINS = {
    "capitalone.com",
    "heb.com",
    "hilton.com",
    "marriott.com",
}


def is_empty(value: Any) -> bool:
    if value is None:
        return True

    try:
        if pd.isna(value):
            return True
    except (TypeError, ValueError):
        pass

    return str(value).strip().lower() in {
        "",
        "nan",
        "none",
    }


def normalize_text(value: Any) -> str:
    if is_empty(value):
        return ""

    return " ".join(
        str(value).strip().lower().split()
    )


def extract_domain(url: Any) -> str:
    if is_empty(url):
        return ""

    url_text = str(url).strip()

    if not url_text.startswith(
        ("http://", "https://")
    ):
        url_text = f"https://{url_text}"

    try:
        domain = urlparse(url_text).netloc.lower()
    except ValueError:
        return ""

    if domain.startswith("www."):
        domain = domain[4:]

    return domain


def domain_matches(
    domain: str,
    known_domains: set[str],
) -> bool:
    return any(
        domain == known_domain
        or domain.endswith(f".{known_domain}")
        for known_domain in known_domains
    )


def classify_lead_eligibility(
    record: Mapping[str, Any],
) -> tuple[str, str, str, str]:
    business_name = normalize_text(
        record.get("business_name")
    )

    website = record.get("website")
    domain = extract_domain(website)

    chain_status = normalize_text(
        record.get("chain_status")
    )

    if (
        business_name in CHAIN_NAMES
        or domain_matches(domain, CHAIN_DOMAINS)
        or chain_status
        in {
            "chain",
            "large_chain",
            "blocked_chain",
        }
    ):
        return (
            "excluded",
            "large_chain",
            "Large chain or franchise",
            "Exclude from independent restaurant outreach",
        )

    if is_empty(website):
        return (
            "eligible",
            "no_website",
            "",
            "Strong website-development opportunity",
        )

    if domain_matches(
        domain,
        CORPORATE_OR_HOTEL_DOMAINS,
    ):
        return (
            "manual_review",
            "corporate_or_hotel_page",
            "Website belongs to a hotel or corporate platform",
            "Confirm whether the restaurant controls its own marketing decisions",
        )

    if domain_matches(domain, SOCIAL_DOMAINS):
        return (
            "eligible",
            "social_only",
            "",
            "Business relies on a social profile instead of an owned website",
        )

    if domain_matches(
        domain,
        THIRD_PARTY_DOMAINS,
    ):
        return (
            "eligible",
            "third_party_only",
            "",
            "Business relies on a hosted or third-party platform",
        )

    if not domain:
        return (
            "manual_review",
            "invalid_url",
            "Website URL could not be understood",
            "Manually verify the website",
        )

    return (
        "eligible",
        "owned_website",
        "",
        "Restaurant appears to have its own website",
    )