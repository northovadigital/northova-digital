from __future__ import annotations

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import sync_playwright


def fetch_rendered_html(url: str) -> tuple[str, str, int]:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        context = browser.new_context(
            ignore_https_errors=True,
            viewport={"width": 1440, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 Chrome/149 Safari/537.36"
            ),
        )

        try:
            page = context.new_page()

            response = page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=30000,
            )

            page.wait_for_timeout(2000)

            html = page.content()
            final_url = page.url
            status = response.status if response else 200

            return html, final_url, status

        except PlaywrightError as exc:
            raise RuntimeError(
                f"Browser fallback failed: {exc}"
            ) from exc

        finally:
            context.close()
            browser.close()