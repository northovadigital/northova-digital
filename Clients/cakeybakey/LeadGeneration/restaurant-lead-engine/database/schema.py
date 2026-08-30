from __future__ import annotations


SCHEMA_VERSION = 1

SCHEMA_DESCRIPTION = (
    "Initial lead history, business, branch, source "
    "reference and batch observation schema."
)


SCHEMA_STATEMENTS = [
    """
    CREATE SCHEMA IF NOT EXISTS lead_engine
    """,

    """
    CREATE TABLE IF NOT EXISTS lead_engine.schema_versions (
        version INTEGER PRIMARY KEY,
        description TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
    """,

    """
    CREATE TABLE IF NOT EXISTS lead_engine.lead_batches (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        batch_key TEXT NOT NULL UNIQUE,
        vertical_key TEXT NOT NULL,
        location_query TEXT NOT NULL,
        requested_lead_count INTEGER,
        generated_at TIMESTAMPTZ NOT NULL,
        source_file TEXT,
        run_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT valid_requested_lead_count
            CHECK (
                requested_lead_count IS NULL
                OR requested_lead_count > 0
            )
    )
    """,

    """
    CREATE TABLE IF NOT EXISTS lead_engine.businesses (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        business_key VARCHAR(64) NOT NULL UNIQUE,
        canonical_name TEXT NOT NULL,
        normalized_name TEXT NOT NULL,
        vertical_key TEXT NOT NULL,
        primary_domain TEXT,
        first_seen_at TIMESTAMPTZ NOT NULL,
        last_seen_at TIMESTAMPTZ NOT NULL,
        times_seen INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT valid_business_times_seen
            CHECK (times_seen >= 1)
    )
    """,

    """
    CREATE TABLE IF NOT EXISTS lead_engine.business_locations (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        business_id BIGINT NOT NULL
            REFERENCES lead_engine.businesses(id)
            ON DELETE CASCADE,

        location_key VARCHAR(64) NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        normalized_domain TEXT,
        normalized_phone TEXT,
        normalized_address TEXT,
        city TEXT,
        region TEXT,
        country TEXT,
        latitude NUMERIC(10, 7),
        longitude NUMERIC(10, 7),
        first_seen_at TIMESTAMPTZ NOT NULL,
        last_seen_at TIMESTAMPTZ NOT NULL,
        times_seen INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT valid_location_times_seen
            CHECK (times_seen >= 1),

        CONSTRAINT valid_latitude
            CHECK (
                latitude IS NULL
                OR latitude BETWEEN -90 AND 90
            ),

        CONSTRAINT valid_longitude
            CHECK (
                longitude IS NULL
                OR longitude BETWEEN -180 AND 180
            )
    )
    """,

    """
    CREATE TABLE IF NOT EXISTS lead_engine.business_source_refs (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        business_location_id BIGINT NOT NULL
            REFERENCES lead_engine.business_locations(id)
            ON DELETE CASCADE,

        source_system TEXT NOT NULL,
        source_entity_type TEXT NOT NULL DEFAULT 'business',
        external_id TEXT NOT NULL,
        source_url TEXT,
        first_seen_at TIMESTAMPTZ NOT NULL,
        last_seen_at TIMESTAMPTZ NOT NULL,
        raw_payload JSONB NOT NULL DEFAULT '{}'::JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT unique_source_reference
            UNIQUE (
                source_system,
                source_entity_type,
                external_id
            )
    )
    """,

    """
    CREATE TABLE IF NOT EXISTS lead_engine.lead_observations (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

        batch_id BIGINT NOT NULL
            REFERENCES lead_engine.lead_batches(id)
            ON DELETE CASCADE,

        business_location_id BIGINT NOT NULL
            REFERENCES lead_engine.business_locations(id)
            ON DELETE CASCADE,

        history_status TEXT NOT NULL DEFAULT 'unknown',
        previous_seen_count INTEGER NOT NULL DEFAULT 0,

        business_name TEXT NOT NULL,
        category TEXT,
        cuisine TEXT,
        website TEXT,
        phone TEXT,
        email TEXT,
        extracted_emails TEXT,
        address TEXT,

        website_status TEXT,
        website_ownership_type TEXT,
        eligibility_status TEXT,
        opportunity_score INTEGER,
        qualification TEXT,
        sales_angle TEXT,
        score_reasons TEXT,

        source_system TEXT NOT NULL DEFAULT 'osm',
        source_external_id TEXT,
        raw_payload JSONB NOT NULL DEFAULT '{}'::JSONB,

        observed_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT unique_location_per_batch
            UNIQUE (
                batch_id,
                business_location_id
            ),

        CONSTRAINT valid_history_status
            CHECK (
                history_status IN (
                    'new',
                    'seen_before',
                    'unknown'
                )
            ),

        CONSTRAINT valid_previous_seen_count
            CHECK (previous_seen_count >= 0),

        CONSTRAINT valid_opportunity_score
            CHECK (
                opportunity_score IS NULL
                OR opportunity_score BETWEEN 0 AND 100
            )
    )
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_batches_generated_at
        ON lead_engine.lead_batches(generated_at DESC)
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_batches_vertical_location
        ON lead_engine.lead_batches(
            vertical_key,
            location_query
        )
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_businesses_normalized_name
        ON lead_engine.businesses(normalized_name)
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_businesses_primary_domain
        ON lead_engine.businesses(primary_domain)
        WHERE primary_domain IS NOT NULL
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_locations_business_id
        ON lead_engine.business_locations(business_id)
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_locations_domain
        ON lead_engine.business_locations(normalized_domain)
        WHERE normalized_domain IS NOT NULL
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_locations_phone
        ON lead_engine.business_locations(normalized_phone)
        WHERE normalized_phone IS NOT NULL
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_locations_address
        ON lead_engine.business_locations(normalized_address)
        WHERE normalized_address IS NOT NULL
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_observations_batch
        ON lead_engine.lead_observations(batch_id)
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_observations_location
        ON lead_engine.lead_observations(
            business_location_id
        )
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_observations_history_status
        ON lead_engine.lead_observations(
            history_status
        )
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_observations_qualification
        ON lead_engine.lead_observations(
            qualification
        )
    """,

    """
    CREATE INDEX IF NOT EXISTS idx_observations_score
        ON lead_engine.lead_observations(
            opportunity_score DESC
        )
    """,
]


EXPECTED_TABLES = {
    "schema_versions",
    "lead_batches",
    "businesses",
    "business_locations",
    "business_source_refs",
    "lead_observations",
}
