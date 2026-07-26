from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

from auditors.browser_fetcher import fetch_rendered_html
from processing.email_cleaner import clean_extracted_emails


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 Chrome/149 Safari/537.36 "
    "NorthovaDigitalLeadEngine/0.2"
)

REQUEST_TIMEOUT = 20

THIRD_PARTY_ORDERING_PLATFORMS = {
    "doordash": "doordash.com",
    "uber_eats": "ubereats.com",
    "grubhub": "grubhub.com",
    "seamless": "seamless.com",
    "postmates": "postmates.com",
    "toast": "toasttab.com",
    "chownow": "chownow.com",
    "slice": "slicelife.com",
    "ezcater": "ezcater.com",
}

SOCIAL_DOMAINS = {
    "instagram_url": "instagram.com",
    "facebook_url": "facebook.com",
    "twitter_url": "twitter.com",
    "tiktok_url": "tiktok.com",
}


def normalize_url(value: Any) -> str:
    if value is None:
        return ""

    url = str(value).strip()

    if not url or url.lower() in {
        "nan",
        "none",
    }:
        return ""

    if not url.startswith(
        ("http://", "https://")
    ):
        url = f"https://{url}"

    return url


def is_third_party_url(url: str) -> bool:
    hostname = urlparse(url).netloc.lower()

    return any(
        domain in hostname
        for domain
        in THIRD_PARTY_ORDERING_PLATFORMS.values()
    )


def create_empty_result() -> dict[str, Any]:
    return {
        "website_status": "not_checked",
        "audit_method": "",
        "http_status": "",
        "final_url": "",
        "uses_https": False,
        "mobile_viewport": False,
        "has_menu": False,
        "has_pdf_menu": False,
        "has_direct_ordering": False,
        "third_party_platforms": "",
        "has_reservation": False,
        "has_phone_cta": False,
        "has_contact_page": False,
        "extracted_emails": "",
        "instagram_url": "",
        "facebook_url": "",
        "twitter_url": "",
        "tiktok_url": "",
        "website_issues": "",
        "audit_error": "",
        "source_url_issue": "",
        "audited_at": datetime.now(
            timezone.utc
        ).isoformat(
            timespec="seconds"
        ),
    }


def analyze_html(
    result: dict[str, Any],
    html: str,
    final_url: str,
    status_code: int,
) -> dict[str, Any]:
    result["http_status"] = status_code
    result["final_url"] = final_url
    result["uses_https"] = (
        final_url.startswith("https://")
    )

    if status_code >= 400:
        result["website_status"] = (
            "unreachable"
        )
        result["website_issues"] = (
            f"Website returned HTTP {status_code}"
        )
        return result

    result["website_status"] = "working"

    soup = BeautifulSoup(
        html,
        "html.parser",
    )

    result["mobile_viewport"] = (
        soup.find(
            "meta",
            attrs={"name": "viewport"},
        )
        is not None
    )

    links: list[tuple[str, str]] = []

    for anchor in soup.find_all(
        "a",
        href=True,
    ):
        href = urljoin(
            final_url,
            str(anchor["href"]).strip(),
        )

        text = anchor.get_text(
            " ",
            strip=True,
        ).lower()

        links.append(
            (
                href,
                text,
            )
        )

    result["has_menu"] = any(
        "menu" in text
        or "menu" in href.lower()
        for href, text in links
    )

    result["has_pdf_menu"] = any(
        ".pdf" in href.lower()
        and (
            "menu" in href.lower()
            or "menu" in text
        )
        for href, text in links
    )

    order_links = [
        href
        for href, text in links
        if any(
            phrase in text
            for phrase in (
                "order online",
                "order now",
                "place order",
                "pickup",
                "delivery",
            )
        )
        or any(
            phrase in href.lower()
            for phrase in (
                "order-online",
                "order_online",
                "/order",
                "ordering",
            )
        )
    ]

    platforms = sorted(
        {
            platform
            for platform, domain
            in THIRD_PARTY_ORDERING_PLATFORMS.items()
            if any(
                domain in href.lower()
                for href, _ in links
            )
        }
    )

    result["third_party_platforms"] = (
        ", ".join(platforms)
    )

    result["has_direct_ordering"] = any(
        not is_third_party_url(href)
        for href in order_links
    )

    result["has_reservation"] = any(
        any(
            phrase in text
            for phrase in (
                "reservation",
                "reserve",
                "book a table",
                "book table",
            )
        )
        or any(
            phrase in href.lower()
            for phrase in (
                "reservation",
                "reserve",
                "booking",
            )
        )
        for href, text in links
    )

    result["has_phone_cta"] = any(
        href.lower().startswith("tel:")
        for href, _ in links
    )

    result["has_contact_page"] = any(
        "contact" in text
        or "contact" in href.lower()
        for href, text in links
    )

    result["extracted_emails"] = (
        clean_extracted_emails(
            raw_emails=html,
            website_url=final_url,
        )
    )

    for column, domain in (
        SOCIAL_DOMAINS.items()
    ):
        social_url = next(
            (
                href
                for href, _ in links
                if domain in href.lower()
            ),
            "",
        )

        result[column] = social_url

    issues: list[str] = []

    if not result["uses_https"]:
        issues.append(
            "Website does not use HTTPS"
        )

    if not result["mobile_viewport"]:
        issues.append(
            "Mobile viewport missing"
        )

    if not result["has_menu"]:
        issues.append(
            "Menu not detected"
        )

    if result["has_pdf_menu"]:
        issues.append(
            "PDF menu detected"
        )

    if not result[
        "has_direct_ordering"
    ]:
        issues.append(
            "Direct ordering not detected"
        )

    if (
        platforms
        and not result[
            "has_direct_ordering"
        ]
    ):
        issues.append(
            "Third-party ordering only"
        )

    if not result["has_reservation"]:
        issues.append(
            "Reservation CTA not detected"
        )

    if not result["has_phone_cta"]:
        issues.append(
            "Phone CTA not detected"
        )

    if not result["has_contact_page"]:
        issues.append(
            "Contact page not detected"
        )

    result["website_issues"] = (
        "; ".join(issues)
    )

    return result


def audit_with_browser(
    url: str,
    result: dict[str, Any],
) -> dict[str, Any]:
    try:
        (
            html,
            final_url,
            status_code,
        ) = fetch_rendered_html(url)

        result["audit_method"] = (
            "playwright"
        )

        if status_code >= 400:
            parsed_url = urlparse(
                final_url or url
            )

            root_url = (
                f"{parsed_url.scheme}://"
                f"{parsed_url.netloc}/"
                if (
                    parsed_url.scheme
                    and parsed_url.netloc
                )
                else ""
            )

            current_url = (
                final_url or url
            )

            if (
                root_url
                and root_url.rstrip("/")
                != current_url.rstrip("/")
            ):
                (
                    root_html,
                    root_final_url,
                    root_status,
                ) = fetch_rendered_html(
                    root_url
                )

                if root_status < 400:
                    result[
                        "audit_method"
                    ] = (
                        "playwright_root_fallback"
                    )

                    result[
                        "source_url_issue"
                    ] = (
                        "Listed URL returned "
                        f"HTTP {status_code}; "
                        "root homepage used"
                    )

                    html = root_html
                    final_url = (
                        root_final_url
                    )
                    status_code = (
                        root_status
                    )

        audited_result = analyze_html(
            result=result,
            html=html,
            final_url=final_url,
            status_code=status_code,
        )

        if (
            audited_result[
                "website_status"
            ]
            == "working"
            and audited_result[
                "source_url_issue"
            ]
        ):
            existing_issues = (
                audited_result[
                    "website_issues"
                ]
            )

            audited_result[
                "website_issues"
            ] = "; ".join(
                issue
                for issue in [
                    audited_result[
                        "source_url_issue"
                    ],
                    existing_issues,
                ]
                if issue
            )

        return audited_result

    except Exception as exc:
        result["website_status"] = (
            "unreachable"
        )
        result["audit_method"] = (
            "playwright_failed"
        )
        result["audit_error"] = str(exc)
        result["website_issues"] = (
            "Website could not be reached"
        )

        return result


def audit_website(
    website: Any,
) -> dict[str, Any]:
    url = normalize_url(website)
    result = create_empty_result()

    if not url:
        result["website_status"] = (
            "missing"
        )
        result["website_issues"] = (
            "No website available"
        )
        return result

    try:
        response = requests.get(
            url,
            headers={
                "User-Agent": USER_AGENT
            },
            timeout=REQUEST_TIMEOUT,
            allow_redirects=True,
        )

        if response.status_code >= 400:
            return audit_with_browser(
                url,
                result,
            )

        if len(
            response.text.strip()
        ) < 200:
            return audit_with_browser(
                url,
                result,
            )

        result["audit_method"] = (
            "requests"
        )

        return analyze_html(
            result=result,
            html=response.text,
            final_url=response.url,
            status_code=(
                response.status_code
            ),
        )

    except requests.RequestException:
        return audit_with_browser(
            url,
            result,
        )

    except Exception as exc:
        result["website_status"] = (
            "error"
        )
        result["audit_error"] = str(exc)
        result["website_issues"] = (
            "Unexpected audit error"
        )

        return result