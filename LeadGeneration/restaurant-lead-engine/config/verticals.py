from __future__ import annotations

from typing import Any


VERTICALS: dict[str, dict[str, Any]] = {
    "restaurants": {
        "label": "Restaurants",
        "description": (
            "Independent restaurants, cafes, bars, "
            "bakeries and food businesses."
        ),
        "supported": True,
        "extractor_script": "main.py",
        "auditor_script": "batch_audit.py",
        "scorer_script": "score_leads.py",
        "priority_filename": "restaurants_priority.csv",
        "audited_filename": "restaurants_audited.csv",
        "scored_filename": "restaurants_scored.csv",
    },
    "salons": {
        "label": "Salons & Spas",
        "description": (
            "Hair salons, beauty salons, barbers "
            "and spas."
        ),
        "supported": False,
    },
    "mechanics": {
        "label": "Auto Repair & Mechanics",
        "description": (
            "Mechanics, garages, auto repair "
            "and vehicle-service businesses."
        ),
        "supported": False,
    },
    "carpenters": {
        "label": "Carpenters & Woodworkers",
        "description": (
            "Carpenters, cabinet makers and "
            "woodworking businesses."
        ),
        "supported": False,
    },
}


def get_vertical_config(
    vertical_key: str,
) -> dict[str, Any]:
    normalized_key = vertical_key.strip().lower()

    if normalized_key not in VERTICALS:
        available_verticals = ", ".join(
            VERTICALS.keys()
        )

        raise ValueError(
            f"Unknown business category: "
            f"{vertical_key}. Available: "
            f"{available_verticals}"
        )

    configuration = VERTICALS[normalized_key]

    if not configuration.get("supported", False):
        raise ValueError(
            f"{configuration['label']} lead "
            f"generation is not active yet."
        )

    return configuration
