from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd
import streamlit as st

from config.verticals import VERTICALS
from pipeline_runner import (
    PipelineAlreadyRunningError,
    pipeline_is_running,
    run_full_pipeline,
)
from processing.export_helper import (
    prepare_lead_export,
)


PROJECT_ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = PROJECT_ROOT / "output"

LATEST_RUN_FILE = OUTPUT_DIR / "latest_run.json"

NEW_RESTAURANT_FILE = (
    OUTPUT_DIR / "restaurants_scored.csv"
)

LEGACY_RESTAURANT_FILE = (
    OUTPUT_DIR
    / "houston_restaurants_scored.csv"
)


st.set_page_config(
    page_title="Northova Lead Engine",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="collapsed",
)


def inject_custom_css() -> None:
    st.markdown(
        """
        <style>
        .stApp {
            background:
                radial-gradient(
                    circle at top right,
                    rgba(37, 99, 235, 0.10),
                    transparent 28%
                ),
                radial-gradient(
                    circle at top left,
                    rgba(14, 165, 233, 0.08),
                    transparent 25%
                );
        }

        .block-container {
            max-width: 1450px;
            padding-top: 2rem;
            padding-bottom: 4rem;
        }

        .northova-hero {
            padding: 30px 34px;
            margin-bottom: 24px;
            border: 1px solid rgba(
                148,
                163,
                184,
                0.22
            );
            border-radius: 22px;
            background: linear-gradient(
                135deg,
                rgba(15, 23, 42, 0.96),
                rgba(30, 64, 175, 0.72)
            );
            box-shadow:
                0 20px 55px
                rgba(0, 0, 0, 0.20);
        }

        .northova-badge {
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 12px;
            border-radius: 999px;
            background: rgba(
                255,
                255,
                255,
                0.12
            );
            color: #bfdbfe;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.04em;
        }

        .northova-hero h1 {
            margin: 0;
            color: white;
            font-size: 38px;
            line-height: 1.15;
        }

        .northova-hero p {
            max-width: 800px;
            margin: 12px 0 0;
            color: #dbeafe;
            font-size: 16px;
            line-height: 1.7;
        }

        div[data-testid="stMetric"] {
            padding: 18px;
            border: 1px solid rgba(
                148,
                163,
                184,
                0.18
            );
            border-radius: 16px;
            background: rgba(
                30,
                41,
                59,
                0.30
            );
            box-shadow:
                0 8px 25px
                rgba(0, 0, 0, 0.10);
        }

        div[data-testid="stMetricValue"] {
            font-weight: 800;
        }

        div[data-testid="stTabs"]
        button[role="tab"] {
            padding: 12px 22px;
            font-weight: 700;
        }

        div[data-baseweb="select"] > div,
        div[data-baseweb="input"] > div {
            border-radius: 12px;
        }

        div.stButton > button,
        div[data-testid="stDownloadButton"]
        button {
            min-height: 48px;
            border-radius: 12px;
            font-weight: 800;
        }

        div.stButton >
        button[kind="primary"] {
            border: 0;
            background: linear-gradient(
                90deg,
                #2563eb,
                #0ea5e9
            );
            color: white;
        }

        .run-note {
            padding: 14px 16px;
            margin-top: 12px;
            border-left: 4px solid #3b82f6;
            border-radius: 8px;
            background: rgba(
                37,
                99,
                235,
                0.10
            );
        }

        .success-card {
            padding: 20px;
            margin-top: 18px;
            border: 1px solid rgba(
                34,
                197,
                94,
                0.28
            );
            border-radius: 16px;
            background: rgba(
                34,
                197,
                94,
                0.08
            );
        }

        [data-testid="stDataFrame"] {
            border-radius: 14px;
            overflow: hidden;
        }

        footer {
            visibility: hidden;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def initialize_session_state() -> None:
    defaults = {
        "pipeline_ui_running": False,
        "pending_generation": None,
        "last_generation": None,
        "last_generation_error": "",
        "generated_scored_file": "",
    }

    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


@st.cache_data
def load_data(
    file_path: str,
) -> pd.DataFrame:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Lead file not found: "
            f"{path.resolve()}"
        )

    dataframe = pd.read_csv(path)

    if (
        "opportunity_score"
        in dataframe.columns
    ):
        dataframe["opportunity_score"] = (
            pd.to_numeric(
                dataframe[
                    "opportunity_score"
                ],
                errors="coerce",
            )
            .fillna(0)
            .astype(int)
        )

    if (
        "lead_previous_seen_count"
        in dataframe.columns
    ):
        dataframe[
            "lead_previous_seen_count"
        ] = (
            pd.to_numeric(
                dataframe[
                    "lead_previous_seen_count"
                ],
                errors="coerce",
            )
            .fillna(0)
            .astype(int)
        )

    if (
        "lead_times_seen"
        in dataframe.columns
    ):
        dataframe[
            "lead_times_seen"
        ] = (
            pd.to_numeric(
                dataframe[
                    "lead_times_seen"
                ],
                errors="coerce",
            )
            .fillna(0)
            .astype(int)
        )

    return dataframe


def safe_options(
    dataframe: pd.DataFrame,
    column: str,
) -> list[str]:
    if column not in dataframe.columns:
        return []

    values = (
        dataframe[column]
        .dropna()
        .astype(str)
        .str.strip()
    )

    values = values[
        (values != "")
        & (
            values.str.lower()
            != "nan"
        )
    ]

    return sorted(
        values.unique().tolist()
    )


def normalize_website_url(
    value: Any,
) -> str:
    if value is None:
        return ""

    try:
        if pd.isna(value):
            return ""
    except (TypeError, ValueError):
        pass

    website = str(value).strip()

    if (
        not website
        or website.lower() == "nan"
    ):
        return ""

    if not website.startswith(
        ("http://", "https://")
    ):
        return f"https://{website}"

    return website


def read_latest_metadata() -> dict[str, Any]:
    if not LATEST_RUN_FILE.exists():
        return {}

    try:
        return json.loads(
            LATEST_RUN_FILE.read_text(
                encoding="utf-8"
            )
        )

    except (
        json.JSONDecodeError,
        OSError,
    ):
        return {}


def get_latest_scored_file(
) -> tuple[Path | None, dict[str, Any]]:
    metadata = read_latest_metadata()

    candidates: list[Path] = []

    generated_file = (
        st.session_state.get(
            "generated_scored_file"
        )
    )

    if generated_file:
        candidates.append(
            Path(generated_file)
        )

    metadata_file = metadata.get(
        "scored_file"
    )

    if metadata_file:
        candidates.append(
            Path(metadata_file)
        )

    candidates.extend(
        [
            NEW_RESTAURANT_FILE,
            LEGACY_RESTAURANT_FILE,
        ]
    )

    for candidate in candidates:
        if candidate.exists():
            return candidate, metadata

    return None, metadata


def history_is_available(
    dataframe: pd.DataFrame,
) -> bool:
    if (
        "lead_history_status"
        not in dataframe.columns
    ):
        return False

    statuses = (
        dataframe[
            "lead_history_status"
        ]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.lower()
    )

    return statuses.isin(
        [
            "new",
            "seen_before",
        ]
    ).any()


def apply_history_scope(
    dataframe: pd.DataFrame,
    include_seen_before: bool,
) -> pd.DataFrame:
    if not history_is_available(
        dataframe
    ):
        return dataframe.copy()

    if include_seen_before:
        return dataframe.copy()

    return dataframe[
        dataframe[
            "lead_history_status"
        ]
        .fillna("")
        .astype(str)
        .str.lower()
        .eq("new")
    ].copy()


def get_winning_leads(
    dataframe: pd.DataFrame,
    include_seen_before: bool,
) -> pd.DataFrame:
    winning = dataframe[
        (
            dataframe[
                "eligibility_status"
            ]
            == "eligible"
        )
        & (
            dataframe[
                "qualification"
            ].isin(
                [
                    "priority",
                    "qualified",
                ]
            )
        )
    ].copy()

    winning = apply_history_scope(
        dataframe=winning,
        include_seen_before=(
            include_seen_before
        ),
    )

    return winning.sort_values(
        by="opportunity_score",
        ascending=False,
    )


def display_summary_metrics(
    dataframe: pd.DataFrame,
    first_label: str = "Total Leads",
) -> None:
    eligible_count = int(
        (
            dataframe[
                "eligibility_status"
            ]
            == "eligible"
        ).sum()
    )

    priority_count = int(
        (
            dataframe[
                "qualification"
            ]
            == "priority"
        ).sum()
    )

    qualified_count = int(
        (
            dataframe[
                "qualification"
            ]
            == "qualified"
        ).sum()
    )

    metric_columns = st.columns(4)

    metric_columns[0].metric(
        first_label,
        len(dataframe),
    )

    metric_columns[1].metric(
        "Eligible",
        eligible_count,
    )

    metric_columns[2].metric(
        "Priority",
        priority_count,
    )

    metric_columns[3].metric(
        "Qualified",
        qualified_count,
    )


def display_history_metrics(
    dataframe: pd.DataFrame,
) -> None:
    if not history_is_available(
        dataframe
    ):
        return

    statuses = (
        dataframe[
            "lead_history_status"
        ]
        .fillna("")
        .astype(str)
        .str.lower()
    )

    new_count = int(
        statuses.eq("new").sum()
    )

    seen_count = int(
        statuses.eq(
            "seen_before"
        ).sum()
    )

    total_repeated_visits = 0

    if (
        "lead_previous_seen_count"
        in dataframe.columns
    ):
        total_repeated_visits = int(
            dataframe[
                "lead_previous_seen_count"
            ].sum()
        )

    metric_columns = st.columns(3)

    metric_columns[0].metric(
        "New Leads",
        new_count,
    )

    metric_columns[1].metric(
        "Seen Before",
        seen_count,
    )

    metric_columns[2].metric(
        "Previous Appearances",
        total_repeated_visits,
    )


def execute_pending_generation() -> None:
    pending = st.session_state.get(
        "pending_generation"
    )

    if not pending:
        return

    st.subheader(
        "Lead Generation Progress"
    )

    progress_bar = st.progress(
        0,
        text=(
            "Preparing lead-generation run..."
        ),
    )

    status_message = st.empty()

    def update_progress(
        message: str,
        percentage: int,
    ) -> None:
        progress_bar.progress(
            percentage,
            text=message,
        )

        status_message.caption(
            message
        )

    try:
        result = run_full_pipeline(
            vertical_key=pending[
                "vertical_key"
            ],
            location=pending["location"],
            lead_limit=pending[
                "lead_limit"
            ],
            progress_callback=(
                update_progress
            ),
        )

        scored_file = Path(
            result["scored_file"]
        )

        st.session_state[
            "generated_scored_file"
        ] = str(scored_file)

        st.session_state[
            "last_generation"
        ] = {
            "vertical_key": result[
                "vertical_key"
            ],
            "vertical_label": result[
                "vertical_label"
            ],
            "location": result[
                "location"
            ],
            "lead_limit": result[
                "lead_limit"
            ],
            "completed_at": result[
                "completed_at"
            ],
            "scored_file": str(
                scored_file
            ),
            "history_batch_key": (
                result.get(
                    "history_batch_key",
                    "",
                )
            ),
            "history_summary": (
                result.get(
                    "history_summary",
                    {},
                )
            ),
        }

        st.session_state[
            "last_generation_error"
        ] = ""

        load_data.clear()

    except PipelineAlreadyRunningError:
        st.session_state[
            "last_generation_error"
        ] = (
            "Another lead-generation run "
            "is already active."
        )

    except Exception as error:
        st.session_state[
            "last_generation_error"
        ] = str(error)

    finally:
        st.session_state[
            "pipeline_ui_running"
        ] = False

        st.session_state[
            "pending_generation"
        ] = None

    st.rerun()


def display_last_generation() -> None:
    last_generation = (
        st.session_state.get(
            "last_generation"
        )
    )

    generation_error = (
        st.session_state.get(
            "last_generation_error"
        )
    )

    if generation_error:
        st.error(
            "Lead generation failed."
        )

        with st.expander(
            "Technical error details"
        ):
            st.code(generation_error)

    if not last_generation:
        return

    scored_file = Path(
        last_generation[
            "scored_file"
        ]
    )

    if not scored_file.exists():
        return

    dataframe = load_data(
        str(scored_file)
    )

    st.markdown(
        """
        <div class="success-card">
            <strong>
                Lead generation completed.
            </strong>
            The results have been audited,
            scored and registered in lead history.
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.caption(
        f"{last_generation['vertical_label']} "
        f"• {last_generation['location']} "
        f"• Requested "
        f"{last_generation['lead_limit']} leads"
    )

    display_summary_metrics(
        dataframe=dataframe,
        first_label="Total Generated",
    )

    display_history_metrics(
        dataframe
    )

    history_available = (
        history_is_available(
            dataframe
        )
    )

    if history_available:
        include_seen_before = st.toggle(
            "Include previously seen leads",
            value=False,
            key=(
                "latest_include_seen_before"
            ),
            help=(
                "Disabled by default so the "
                "download contains only genuinely "
                "new outreach opportunities."
            ),
        )

    else:
        include_seen_before = True

        st.info(
            "This file was generated before "
            "CSV history annotation was enabled. "
            "History-aware filtering will apply "
            "automatically to future runs."
        )

    winning_leads = get_winning_leads(
        dataframe=dataframe,
        include_seen_before=(
            include_seen_before
        ),
    )

    if winning_leads.empty:
        if (
            history_available
            and not include_seen_before
        ):
            st.warning(
                "No new priority or qualified "
                "leads were found. Enable "
                "'Include previously seen leads' "
                "to review older opportunities."
            )

        else:
            st.warning(
                "No priority or qualified leads "
                "were found in this run."
            )

        return

    scope_text = (
        "new winning leads"
        if (
            history_available
            and not include_seen_before
        )
        else "winning leads"
    )

    st.success(
        f"{len(winning_leads)} "
        f"{scope_text} are ready."
    )

    (
        export_data,
        export_filename,
    ) = prepare_lead_export(
        dataframe=winning_leads,
        vertical_key=last_generation.get(
            "vertical_key",
            "restaurants",
        ),
        location=last_generation[
            "location"
        ],
        generated_at=last_generation.get(
            "completed_at"
        ),
    )

    if (
        history_available
        and not include_seen_before
    ):
        export_filename = (
            export_filename.replace(
                "_winning_",
                "_new_winning_",
            )
        )

    winning_csv = export_data.to_csv(
        index=False,
        encoding="utf-8-sig",
    )

    st.download_button(
        label=(
            "Download New Winning Leads"
            if (
                history_available
                and not include_seen_before
            )
            else "Download Winning Leads"
        ),
        data=winning_csv,
        file_name=export_filename,
        mime="text/csv",
        use_container_width=True,
        key="latest_winning_download",
    )

    st.caption(
        f"Download filename: "
        f"{export_filename}"
    )


def render_generate_tab() -> None:
    st.header(
        "Generate Winning Leads"
    )

    st.write(
        "Choose a category, location and "
        "run size. The engine will extract, "
        "audit, retry temporary failures, "
        "score and register the leads."
    )

    supported_verticals = {
        key: configuration
        for key, configuration
        in VERTICALS.items()
        if configuration.get(
            "supported",
            False,
        )
    }

    unsupported_verticals = [
        configuration["label"]
        for configuration
        in VERTICALS.values()
        if not configuration.get(
            "supported",
            False,
        )
    ]

    backend_running = (
        pipeline_is_running()
    )

    ui_running = bool(
        st.session_state.get(
            "pipeline_ui_running"
        )
    )

    controls_disabled = (
        backend_running
        or ui_running
    )

    if (
        backend_running
        and not ui_running
    ):
        st.warning(
            "A lead-generation run is active "
            "in another browser tab or session."
        )

    first_column, second_column = (
        st.columns(2)
    )

    with first_column:
        vertical_key = st.selectbox(
            "Business category",
            options=list(
                supported_verticals.keys()
            ),
            format_func=lambda key: (
                supported_verticals[
                    key
                ]["label"]
            ),
            disabled=controls_disabled,
        )

        location = st.text_input(
            "Target location",
            value=(
                "Houston, Texas, USA"
            ),
            placeholder=(
                "City, state, country"
            ),
            disabled=controls_disabled,
        )

    with second_column:
        run_mode = st.selectbox(
            "Lead generation mode",
            options=[
                "Quick",
                "Balanced",
                "Deep",
                "Custom",
            ],
            index=1,
            disabled=controls_disabled,
            help=(
                "Larger runs audit more "
                "websites and take longer."
            ),
        )

        mode_limits = {
            "Quick": 50,
            "Balanced": 100,
            "Deep": 200,
        }

        if run_mode == "Custom":
            lead_limit = st.number_input(
                "Number of leads",
                min_value=10,
                max_value=500,
                value=250,
                step=10,
                disabled=controls_disabled,
            )

        else:
            lead_limit = mode_limits[
                run_mode
            ]

            st.number_input(
                "Number of leads",
                min_value=1,
                value=lead_limit,
                disabled=True,
            )

    selected_config = (
        supported_verticals[
            vertical_key
        ]
    )

    st.info(
        selected_config[
            "description"
        ]
    )

    if run_mode in {
        "Deep",
        "Custom",
    }:
        st.markdown(
            """
            <div class="run-note">
                Larger batches take longer
                because every website is audited,
                retried and scored individually.
            </div>
            """,
            unsafe_allow_html=True,
        )

    if unsupported_verticals:
        st.caption(
            "Coming next: "
            + ", ".join(
                unsupported_verticals
            )
        )

    generate_clicked = st.button(
        (
            "Generating Leads..."
            if controls_disabled
            else "Generate Winning Leads"
        ),
        type="primary",
        use_container_width=True,
        disabled=controls_disabled,
    )

    if generate_clicked:
        if not location.strip():
            st.error(
                "Please enter a target location."
            )

        else:
            st.session_state[
                "pending_generation"
            ] = {
                "vertical_key": vertical_key,
                "location": (
                    location.strip()
                ),
                "lead_limit": int(
                    lead_limit
                ),
            }

            st.session_state[
                "pipeline_ui_running"
            ] = True

            st.session_state[
                "last_generation_error"
            ] = ""

            st.rerun()

    if ui_running:
        execute_pending_generation()

    display_last_generation()


def apply_review_filters(
    dataframe: pd.DataFrame,
) -> tuple[
    pd.DataFrame,
    bool,
]:
    filtered = dataframe.copy()

    history_available = (
        history_is_available(
            dataframe
        )
    )

    with st.expander(
        "Search and Filters",
        expanded=True,
    ):
        winning_only = st.toggle(
            "Show winning leads only",
            value=True,
            key="review_winning_only",
        )

        if history_available:
            include_seen_before = st.toggle(
                "Include previously seen leads",
                value=False,
                key=(
                    "review_include_seen_before"
                ),
                help=(
                    "Keep disabled to focus on "
                    "businesses that have not "
                    "appeared in earlier batches."
                ),
            )

        else:
            include_seen_before = True

            st.caption(
                "History filter unavailable for "
                "this pre-integration CSV."
            )

        search_text = st.text_input(
            "Search leads",
            placeholder=(
                "Business, cuisine, address "
                "or opportunity"
            ),
            key="review_search",
        )

        qualification_options = (
            safe_options(
                dataframe,
                "qualification",
            )
        )

        ownership_options = safe_options(
            dataframe,
            "website_ownership_type",
        )

        first_column, second_column = (
            st.columns(2)
        )

        with first_column:
            selected_qualifications = (
                st.multiselect(
                    "Qualification",
                    qualification_options,
                    default=(
                        [
                            value
                            for value in [
                                "priority",
                                "qualified",
                            ]
                            if value
                            in qualification_options
                        ]
                        if winning_only
                        else qualification_options
                    ),
                    key=(
                        "review_qualifications"
                    ),
                )
            )

        with second_column:
            selected_ownership = (
                st.multiselect(
                    "Website type",
                    ownership_options,
                    default=ownership_options,
                    key=(
                        "review_website_types"
                    ),
                )
            )

        minimum_score = st.slider(
            "Minimum opportunity score",
            min_value=0,
            max_value=100,
            value=(
                50
                if winning_only
                else 0
            ),
            step=5,
            key="review_minimum_score",
        )

    if winning_only:
        filtered = filtered[
            (
                filtered[
                    "eligibility_status"
                ]
                == "eligible"
            )
            & (
                filtered[
                    "qualification"
                ].isin(
                    [
                        "priority",
                        "qualified",
                    ]
                )
            )
        ]

    filtered = apply_history_scope(
        dataframe=filtered,
        include_seen_before=(
            include_seen_before
        ),
    )

    if selected_qualifications:
        filtered = filtered[
            filtered[
                "qualification"
            ].isin(
                selected_qualifications
            )
        ]

    if selected_ownership:
        filtered = filtered[
            filtered[
                "website_ownership_type"
            ].isin(
                selected_ownership
            )
        ]

    filtered = filtered[
        filtered[
            "opportunity_score"
        ]
        >= minimum_score
    ]

    if search_text.strip():
        search_value = (
            search_text.strip().lower()
        )

        searchable_columns = [
            column
            for column in [
                "business_name",
                "category",
                "cuisine",
                "full_address",
                "address",
                "sales_angle",
                "score_reasons",
            ]
            if column in filtered.columns
        ]

        search_mask = pd.Series(
            False,
            index=filtered.index,
        )

        for column in searchable_columns:
            search_mask = (
                search_mask
                | filtered[column]
                .fillna("")
                .astype(str)
                .str.lower()
                .str.contains(
                    search_value,
                    regex=False,
                )
            )

        filtered = filtered[
            search_mask
        ]

    return (
        filtered.sort_values(
            by="opportunity_score",
            ascending=False,
        ),
        include_seen_before,
    )


def render_review_tab() -> None:
    st.header(
        "Review and Export Leads"
    )

    scored_file, metadata = (
        get_latest_scored_file()
    )

    if scored_file is None:
        st.info(
            "No lead file is available yet."
        )
        return

    dataframe = load_data(
        str(scored_file)
    )

    vertical_key = metadata.get(
        "vertical_key",
        "restaurants",
    )

    vertical_label = metadata.get(
        "vertical_label",
        "Restaurants",
    )

    location = metadata.get(
        "location",
        (
            "Houston, Texas, USA"
            if scored_file
            == LEGACY_RESTAURANT_FILE
            else "Unknown location"
        ),
    )

    generated_at = metadata.get(
        "completed_at"
    )

    st.caption(
        f"{vertical_label} • {location} "
        f"• Run total: {len(dataframe)}"
    )

    display_history_metrics(
        dataframe
    )

    (
        filtered,
        include_seen_before,
    ) = apply_review_filters(
        dataframe
    )

    display_summary_metrics(
        dataframe=filtered,
        first_label="Visible Leads",
    )

    if filtered.empty:
        st.warning(
            "No leads match the selected filters."
        )
        return

    display_data = filtered.copy()

    if "website" in display_data.columns:
        display_data[
            "website_link"
        ] = display_data[
            "website"
        ].apply(
            normalize_website_url
        )

    display_columns = [
        column
        for column in [
            "business_name",
            "city",
            "category",
            "cuisine",
            "website_link",
            "phone",
            "email",
            "extracted_emails",
            "website_status",
            "website_ownership_type",
            "opportunity_score",
            "qualification",
            "lead_history_status",
            "lead_previous_seen_count",
            "lead_times_seen",
            "sales_angle",
            "score_reasons",
            "full_address",
            "address",
        ]
        if column in display_data.columns
    ]

    st.dataframe(
        display_data[
            display_columns
        ],
        hide_index=True,
        use_container_width=True,
        height=610,
        column_config={
            "business_name": (
                st.column_config.TextColumn(
                    "Business",
                    width="medium",
                )
            ),
            "website_link": (
                st.column_config.LinkColumn(
                    "Website",
                    display_text=(
                        "Open website"
                    ),
                    width="medium",
                )
            ),
            "opportunity_score": (
                st.column_config.ProgressColumn(
                    "Score",
                    min_value=0,
                    max_value=100,
                    format="%d",
                )
            ),
            "lead_history_status": (
                st.column_config.TextColumn(
                    "History",
                    width="small",
                )
            ),
            "lead_previous_seen_count": (
                st.column_config.NumberColumn(
                    "Previous Times Seen",
                    format="%d",
                )
            ),
            "lead_times_seen": (
                st.column_config.NumberColumn(
                    "Total Times Seen",
                    format="%d",
                )
            ),
            "sales_angle": (
                st.column_config.TextColumn(
                    "Recommended Sales Angle",
                    width="large",
                )
            ),
            "score_reasons": (
                st.column_config.TextColumn(
                    "Why This Lead Scored",
                    width="large",
                )
            ),
        },
    )

    (
        export_data,
        export_filename,
    ) = prepare_lead_export(
        dataframe=filtered,
        vertical_key=vertical_key,
        location=location,
        generated_at=generated_at,
    )

    history_available = (
        history_is_available(
            dataframe
        )
    )

    if (
        history_available
        and not include_seen_before
    ):
        filtered_filename = (
            export_filename.replace(
                "_winning_",
                "_new_filtered_",
            )
        )

    else:
        filtered_filename = (
            export_filename.replace(
                "_winning_",
                "_filtered_",
            )
        )

    filtered_csv = export_data.to_csv(
        index=False,
        encoding="utf-8-sig",
    )

    st.download_button(
        label=(
            "Download New Filtered Leads"
            if (
                history_available
                and not include_seen_before
            )
            else "Download Filtered Leads"
        ),
        data=filtered_csv,
        file_name=filtered_filename,
        mime="text/csv",
        use_container_width=True,
    )

    st.caption(
        f"Download filename: "
        f"{filtered_filename}"
    )


def main() -> None:
    inject_custom_css()
    initialize_session_state()

    st.markdown(
        """
        <div class="northova-hero">
            <div class="northova-badge">
                NORTHOVA DIGITAL
            </div>
            <h1>
                Intelligent Local Lead Engine
            </h1>
            <p>
                Find independent businesses,
                audit their digital presence,
                identify strong opportunities
                and avoid repeating leads from
                earlier generation batches.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    generate_tab, review_tab = st.tabs(
        [
            "⚡ Generate Leads",
            "📊 Review Leads",
        ]
    )

    with generate_tab:
        render_generate_tab()

    with review_tab:
        render_review_tab()


if __name__ == "__main__":
    main()
