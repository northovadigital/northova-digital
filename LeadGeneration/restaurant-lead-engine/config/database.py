from __future__ import annotations

import os
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

import psycopg
from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = PROJECT_ROOT / ".env"

load_dotenv(ENV_FILE)


REQUIRED_DATABASE_VARIABLES = (
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
)


def get_database_config() -> dict[str, object]:
    missing_variables = [
        variable
        for variable in REQUIRED_DATABASE_VARIABLES
        if not os.getenv(variable)
    ]

    if missing_variables:
        missing_text = ", ".join(missing_variables)

        raise RuntimeError(
            "Missing database configuration: "
            f"{missing_text}. Check the project .env file."
        )

    try:
        database_port = int(os.environ["DB_PORT"])

    except ValueError as error:
        raise RuntimeError(
            "DB_PORT must be a valid number."
        ) from error

    return {
        "host": os.environ["DB_HOST"],
        "port": database_port,
        "dbname": os.environ["DB_NAME"],
        "user": os.environ["DB_USER"],
        "password": os.environ["DB_PASSWORD"],
        "connect_timeout": 10,
        "application_name": "northova_lead_engine",
    }


def get_connection() -> psycopg.Connection:
    return psycopg.connect(
        **get_database_config()
    )


@contextmanager
def database_connection() -> Iterator[psycopg.Connection]:
    connection = get_connection()

    try:
        yield connection
        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def test_database_connection() -> None:
    with database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    current_database(),
                    current_user,
                    version()
                """
            )

            result = cursor.fetchone()

    if result is None:
        raise RuntimeError(
            "Database returned no connection information."
        )

    print("Database connection successful.")
    print(f"Database: {result[0]}")
    print(f"User: {result[1]}")
    print(f"Server: {result[2]}")


if __name__ == "__main__":
    test_database_connection()
