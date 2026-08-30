from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Callable

from config.verticals import get_vertical_config
from database.history_service import register_scored_file


PROJECT_ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = PROJECT_ROOT / "output"

LATEST_RUN_FILE = OUTPUT_DIR / "latest_run.json"
PIPELINE_LOCK_FILE = OUTPUT_DIR / ".pipeline.lock"

LOCK_STALE_AFTER = timedelta(hours=6)

ProgressCallback = Callable[
    [str, int],
    None,
]


class PipelineAlreadyRunningError(
    RuntimeError
):
    """Raised when another pipeline run is active."""


def emit_progress(
    callback: ProgressCallback | None,
    message: str,
    percentage: int,
) -> None:
    if callback is None:
        return

    safe_percentage = max(
        0,
        min(100, int(percentage)),
    )

    callback(
        message,
        safe_percentage,
    )


def read_lock_payload() -> dict[str, Any]:
    if not PIPELINE_LOCK_FILE.exists():
        return {}

    try:
        return json.loads(
            PIPELINE_LOCK_FILE.read_text(
                encoding="utf-8"
            )
        )

    except (
        json.JSONDecodeError,
        OSError,
    ):
        return {}


def remove_stale_lock() -> None:
    if not PIPELINE_LOCK_FILE.exists():
        return

    try:
        modified_at = datetime.fromtimestamp(
            PIPELINE_LOCK_FILE.stat().st_mtime
        )

    except OSError:
        return

    lock_age = (
        datetime.now()
        - modified_at
    )

    if lock_age > LOCK_STALE_AFTER:
        try:
            PIPELINE_LOCK_FILE.unlink()

        except OSError:
            pass


def pipeline_is_running() -> bool:
    remove_stale_lock()

    return PIPELINE_LOCK_FILE.exists()


def acquire_pipeline_lock(
    vertical_key: str,
    location: str,
    lead_limit: int,
) -> None:
    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    remove_stale_lock()

    if PIPELINE_LOCK_FILE.exists():
        payload = read_lock_payload()

        existing_location = payload.get(
            "location",
            "another location",
        )

        raise PipelineAlreadyRunningError(
            "Another lead-generation run "
            "is already active for "
            f"{existing_location}."
        )

    lock_payload = {
        "pid": os.getpid(),
        "vertical_key": vertical_key,
        "location": location,
        "lead_limit": lead_limit,
        "started_at": (
            datetime.now().isoformat(
                timespec="seconds"
            )
        ),
    }

    try:
        with PIPELINE_LOCK_FILE.open(
            "x",
            encoding="utf-8",
        ) as lock_file:
            json.dump(
                lock_payload,
                lock_file,
                indent=2,
            )

    except FileExistsError as error:
        raise PipelineAlreadyRunningError(
            "Another lead-generation run "
            "started at the same time."
        ) from error


def release_pipeline_lock() -> None:
    try:
        PIPELINE_LOCK_FILE.unlink(
            missing_ok=True
        )

    except OSError:
        pass


def run_command(
    command: list[str],
    stage_name: str,
) -> str:
    result = subprocess.run(
        command,
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )

    standard_output = (
        result.stdout or ""
    ).strip()

    standard_error = (
        result.stderr or ""
    ).strip()

    if result.returncode != 0:
        error_parts = [
            f"{stage_name} failed.",
            f"Exit code: {result.returncode}",
        ]

        if standard_output:
            error_parts.extend(
                [
                    "",
                    "Output:",
                    standard_output,
                ]
            )

        if standard_error:
            error_parts.extend(
                [
                    "",
                    "Error:",
                    standard_error,
                ]
            )

        raise RuntimeError(
            "\n".join(error_parts)
        )

    return standard_output


def create_archive_directory(
    vertical_key: str,
) -> Path:
    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    archive_directory = (
        OUTPUT_DIR
        / "archive"
        / vertical_key
        / timestamp
    )

    archive_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    return archive_directory


def archive_existing_outputs(
    output_files: list[Path],
    vertical_key: str,
) -> tuple[
    Path | None,
    dict[Path, Path],
]:
    existing_files = [
        file_path
        for file_path in output_files
        if file_path.exists()
    ]

    if not existing_files:
        return None, {}

    archive_directory = (
        create_archive_directory(
            vertical_key
        )
    )

    archived_files: dict[
        Path,
        Path,
    ] = {}

    for source_file in existing_files:
        archived_file = (
            archive_directory
            / source_file.name
        )

        shutil.copy2(
            source_file,
            archived_file,
        )

        archived_files[
            source_file
        ] = archived_file

    return (
        archive_directory,
        archived_files,
    )


def clear_current_outputs(
    output_files: list[Path],
) -> None:
    for output_file in output_files:
        try:
            output_file.unlink(
                missing_ok=True
            )

        except OSError as error:
            raise RuntimeError(
                "Could not clear previous "
                f"output file: {output_file}"
            ) from error


def restore_archived_outputs(
    output_files: list[Path],
    archived_files: dict[Path, Path],
) -> None:
    for output_file in output_files:
        try:
            output_file.unlink(
                missing_ok=True
            )

        except OSError:
            pass

    for original_file, archived_file in (
        archived_files.items()
    ):
        if not archived_file.exists():
            continue

        shutil.copy2(
            archived_file,
            original_file,
        )


def save_latest_run_metadata(
    metadata: dict[str, Any],
) -> None:
    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    temporary_file = (
        LATEST_RUN_FILE.with_suffix(
            ".json.tmp"
        )
    )

    temporary_file.write_text(
        json.dumps(
            metadata,
            indent=2,
            default=str,
        ),
        encoding="utf-8",
    )

    os.replace(
        temporary_file,
        LATEST_RUN_FILE,
    )


def run_full_pipeline(
    vertical_key: str,
    location: str,
    lead_limit: int,
    progress_callback: (
        ProgressCallback | None
    ) = None,
) -> dict[str, Any]:
    vertical_key = (
        vertical_key.strip().lower()
    )

    location = location.strip()

    if not location:
        raise ValueError(
            "Target location is required."
        )

    if lead_limit < 1:
        raise ValueError(
            "Lead limit must be "
            "greater than zero."
        )

    vertical_config = (
        get_vertical_config(
            vertical_key
        )
    )

    acquire_pipeline_lock(
        vertical_key=vertical_key,
        location=location,
        lead_limit=lead_limit,
    )

    priority_file = (
        OUTPUT_DIR
        / vertical_config[
            "priority_filename"
        ]
    )

    audited_file = (
        OUTPUT_DIR
        / vertical_config[
            "audited_filename"
        ]
    )

    scored_file = (
        OUTPUT_DIR
        / vertical_config[
            "scored_filename"
        ]
    )

    output_files = [
        priority_file,
        audited_file,
        scored_file,
    ]

    archive_directory: Path | None = None
    archived_files: dict[
        Path,
        Path,
    ] = {}

    scoring_completed = False

    started_at = datetime.now().astimezone()

    try:
        emit_progress(
            progress_callback,
            "Preparing a safe lead-generation run...",
            3,
        )

        (
            archive_directory,
            archived_files,
        ) = archive_existing_outputs(
            output_files=output_files,
            vertical_key=vertical_key,
        )

        clear_current_outputs(
            output_files
        )

        emit_progress(
            progress_callback,
            (
                f"Discovering up to "
                f"{lead_limit} businesses "
                f"in {location}..."
            ),
            15,
        )

        extraction_output = run_command(
            [
                sys.executable,
                str(
                    PROJECT_ROOT
                    / vertical_config[
                        "extractor_script"
                    ]
                ),
                "--location",
                location,
                "--limit",
                str(lead_limit),
                "--output",
                str(priority_file),
            ],
            stage_name=(
                "Business extraction"
            ),
        )

        if not priority_file.exists():
            raise RuntimeError(
                "Extraction completed but "
                "the priority CSV was not created."
            )

        emit_progress(
            progress_callback,
            (
                "Auditing business websites, "
                "menus and ordering systems..."
            ),
            40,
        )

        audit_output = run_command(
            [
                sys.executable,
                str(
                    PROJECT_ROOT
                    / vertical_config[
                        "auditor_script"
                    ]
                ),
                "--input",
                str(priority_file),
                "--output",
                str(audited_file),
            ],
            stage_name="Website audit",
        )

        if not audited_file.exists():
            raise RuntimeError(
                "Website auditing completed but "
                "the audited CSV was not created."
            )

        emit_progress(
            progress_callback,
            (
                "Retrying temporary website "
                "and network failures..."
            ),
            70,
        )

        retry_output = run_command(
            [
                sys.executable,
                str(
                    PROJECT_ROOT
                    / "retry_failed_audits.py"
                ),
                "--input",
                str(audited_file),
                "--attempts",
                "2",
            ],
            stage_name=(
                "Temporary failure retry"
            ),
        )

        emit_progress(
            progress_callback,
            (
                "Filtering and scoring "
                "the strongest opportunities..."
            ),
            86,
        )

        scoring_output = run_command(
            [
                sys.executable,
                str(
                    PROJECT_ROOT
                    / vertical_config[
                        "scorer_script"
                    ]
                ),
                "--input",
                str(audited_file),
                "--output",
                str(scored_file),
            ],
            stage_name=(
                "Eligibility filtering "
                "and lead scoring"
            ),
        )

        if not scored_file.exists():
            raise RuntimeError(
                "Lead scoring completed but "
                "the scored CSV was not created."
            )

        scoring_completed = True

        completed_at = (
            datetime.now().astimezone()
        )

        emit_progress(
            progress_callback,
            (
                "Registering lead history "
                "and checking previous runs..."
            ),
            95,
        )

        history_summary = (
            register_scored_file(
                scored_file=scored_file,
                vertical_key=vertical_key,
                location=location,
                generated_at=completed_at,
                requested_lead_count=(
                    lead_limit
                ),
                run_metadata={
                    "pipeline_started_at": (
                        started_at.isoformat()
                    ),
                    "pipeline_completed_at": (
                        completed_at.isoformat()
                    ),
                    "vertical_label": (
                        vertical_config[
                            "label"
                        ]
                    ),
                    "archive_directory": (
                        str(
                            archive_directory
                        )
                        if archive_directory
                        else ""
                    ),
                },
                apply=True,
                annotate_csv=True,
            )
        )

        final_completed_at = (
            datetime.now().astimezone()
        )

        metadata = {
            "vertical_key": vertical_key,
            "vertical_label": (
                vertical_config["label"]
            ),
            "location": location,
            "lead_limit": lead_limit,
            "started_at": (
                started_at.isoformat()
            ),
            "completed_at": (
                final_completed_at.isoformat()
            ),
            "priority_file": str(
                priority_file
            ),
            "audited_file": str(
                audited_file
            ),
            "scored_file": str(
                scored_file
            ),
            "archive_directory": (
                str(archive_directory)
                if archive_directory
                else ""
            ),
            "history_registered": True,
            "history_batch_key": (
                history_summary[
                    "batch_key"
                ]
            ),
            "history_summary": (
                history_summary
            ),
        }

        save_latest_run_metadata(
            metadata
        )

        emit_progress(
            progress_callback,
            (
                "Lead generation completed. "
                "Winning leads are ready."
            ),
            100,
        )

        return {
            **metadata,
            "extraction_output": (
                extraction_output
            ),
            "audit_output": audit_output,
            "retry_output": retry_output,
            "scoring_output": (
                scoring_output
            ),
        }

    except Exception:
        # Extraction, audit ya scoring fail ho to
        # previous successful outputs restore honge.
        #
        # Scoring complete hone ke baad history
        # registration fail ho to new scored file
        # preserve ki jayegi, taake recovery possible ho.
        if not scoring_completed:
            restore_archived_outputs(
                output_files=output_files,
                archived_files=archived_files,
            )

        raise

    finally:
        release_pipeline_lock()
