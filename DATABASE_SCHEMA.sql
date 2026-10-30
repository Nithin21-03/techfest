-- =========================================================================
-- ZYNTRA '26 — NEURAL HORIZONS | Sapthagiri NPS University, Bengaluru
-- Universal PostgreSQL & Supabase Database Production Schema
-- Compatible with: Neon, Supabase, Vercel Postgres, AWS RDS, Render, Railway
-- =========================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. REGISTRATIONS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    college VARCHAR(250) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    semester VARCHAR(50),
    event_id VARCHAR(100) NOT NULL,
    event_name VARCHAR(200) NOT NULL,
    team_name VARCHAR(150),
    team_members JSONB DEFAULT '[]'::jsonb,
    members_detail JSONB DEFAULT '[]'::jsonb,
    project_title VARCHAR(250),
    project_category VARCHAR(150),
    technologies VARCHAR(250),
    project_abstract TEXT,
    mentor_name VARCHAR(150),
    project_link VARCHAR(300),
    payment_mode VARCHAR(60) DEFAULT 'UPI / QR Code',
    transaction_ref VARCHAR(100) DEFAULT 'DEMO-UTR',
    payment_date VARCHAR(50),
    amount_paid VARCHAR(50) DEFAULT '₹ 500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'CONFIRMED',

    -- Prevent duplicate registration for same candidate in same event
    CONSTRAINT unique_email_event UNIQUE (email, event_id)
);

-- Fast Indexing for searches, queries, and filters
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- -------------------------------------------------------------------------
-- 2. SPONSOR INQUIRIES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    tier_interest VARCHAR(100) NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsor_inquiries(tier_interest);

-- -------------------------------------------------------------------------
-- 3. ROW-LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- -------------------------------------------------------------------------
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'registrations' AND policyname = 'Allow public inserts'
    ) THEN
        CREATE POLICY "Allow public inserts" ON registrations FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'registrations' AND policyname = 'Allow read access'
    ) THEN
        CREATE POLICY "Allow read access" ON registrations FOR SELECT USING (true);
    END IF;
END $$;

ALTER TABLE sponsor_inquiries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'sponsor_inquiries' AND policyname = 'Allow public sponsor inserts'
    ) THEN
        CREATE POLICY "Allow public sponsor inserts" ON sponsor_inquiries FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'sponsor_inquiries' AND policyname = 'Allow sponsor read access'
    ) THEN
        CREATE POLICY "Allow sponsor read access" ON sponsor_inquiries FOR SELECT USING (true);
    END IF;
END $$;
