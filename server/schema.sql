-- =========================================================================
-- ZYNTRA '26 — NEURAL HORIZONS | Sapthagiri NPS University, Bengaluru
-- Database Schema for PostgreSQL & Supabase
-- =========================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    college VARCHAR(250) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    event_id VARCHAR(100) NOT NULL,
    event_name VARCHAR(200) NOT NULL,
    team_name VARCHAR(150),
    team_members JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    
    -- Prevent duplicate registration for the same person in the same event
    CONSTRAINT unique_email_event UNIQUE (email, event_id)
);

-- Indexing for high-speed lookup and filtering
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON registrations(ticket_id);

-- 2. SPONSOR INQUIRIES TABLE
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

-- 3. AUDIT LOGS (Optional)
CREATE TABLE IF NOT EXISTS fest_audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
