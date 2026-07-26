from __future__ import annotations

from config.database import database_connection
from database.schema import (
    EXPECTED_TABLES,
    SCHEMA_DESCRIPTION,
    SCHEMA_STATEMENTS,
    SCHEMA_VERSION,
)


def initialize_database() -> None:
    with database_connection() as connection:
        with connection.cursor() as cursor:
            for statement in SCHEMA_STATEMENTS:
                cursor.execute(statement)

            cursor.execute(
                """
                INSERT INTO lead_engine.schema_versions (
                    version,
                    description
                )
                VALUES (%s, %s)
                ON CONFLICT (version) DO NOTHING
                """,
                (
                    SCHEMA_VERSION,
                    SCHEMA_DESCRIPTION,
                ),
            )


def verify_database_schema() -> None:
    with database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'lead_engine'
                ORDER BY table_name
                """
            )

            rows = cursor.fetchall()

            existing_tables = {
                row[0]
                for row in rows
            }

            cursor.execute(
                """
                SELECT version, description, applied_at
                FROM lead_engine.schema_versions
                ORDER BY version
                """
            )

            versions = cursor.fetchall()

    missing_tables = (
        EXPECTED_TABLES - existing_tables
    )

    if missing_tables:
        missing_text = ", ".join(
            sorted(missing_tables)
        )

        raise RuntimeError(
            "Database schema verification failed. "
            f"Missing tables: {missing_text}"
        )

    print("Database schema initialized successfully.")
    print()
    print("Tables:")

    for table_name in sorted(existing_tables):
        print(f"- lead_engine.{table_name}")

    print()
    print("Schema versions:")

    for version, description, applied_at in versions:
        print(
            f"- Version {version}: "
            f"{description} "
            f"({applied_at})"
        )


def main() -> None:
    initialize_database()
    verify_database_schema()


if __name__ == "__main__":
    main()
