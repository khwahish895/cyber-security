-- ============================================================================
-- CyberShield AI - Supabase PostgreSQL Schema Migration
-- SIH26145 / NTRO: AI-Based Detection of Cyber Threats in Unidirectional IP Traffic
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    badge_number TEXT,
    role TEXT NOT NULL DEFAULT 'SOC Analyst' CHECK (role IN ('SecOps Lead', 'SOC Analyst', 'Threat Hunter', 'Auditor')),
    clearance_level TEXT DEFAULT 'LEVEL 3 - AUTHORIZED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Analyses Jobs Table
CREATE TABLE IF NOT EXISTS analyses (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    dataset_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
    total_records INTEGER NOT NULL DEFAULT 0,
    valid_records INTEGER NOT NULL DEFAULT 0,
    invalid_records INTEGER NOT NULL DEFAULT 0,
    threats_detected INTEGER NOT NULL DEFAULT 0,
    normal_flows INTEGER NOT NULL DEFAULT 0,
    avg_risk_score INTEGER NOT NULL DEFAULT 0,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 3. Traffic Flows Table (Unidirectional passive capture metrics)
CREATE TABLE IF NOT EXISTS traffic_flows (
    id TEXT PRIMARY KEY,
    analysis_id TEXT REFERENCES analyses(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    protocol TEXT NOT NULL CHECK (protocol IN ('TCP', 'UDP', 'ICMP')),
    source_ip INET NOT NULL,
    destination_ip INET NOT NULL,
    source_port INTEGER NOT NULL CHECK (source_port BETWEEN 0 AND 65535),
    destination_port INTEGER NOT NULL CHECK (destination_port BETWEEN 0 AND 65535),
    flow_duration_ms NUMERIC NOT NULL,
    total_fwd_packets INTEGER NOT NULL,
    total_fwd_bytes BIGINT NOT NULL,
    fwd_packet_length_max NUMERIC NOT NULL,
    fwd_packet_length_mean NUMERIC NOT NULL,
    flow_bytes_per_sec NUMERIC NOT NULL,
    flow_packets_per_sec NUMERIC NOT NULL,
    flow_iat_mean NUMERIC NOT NULL,
    flow_iat_std NUMERIC NOT NULL,
    syn_flag_count INTEGER NOT NULL DEFAULT 0,
    fin_flag_count INTEGER NOT NULL DEFAULT 0,
    rst_flag_count INTEGER NOT NULL DEFAULT 0,
    psh_flag_count INTEGER NOT NULL DEFAULT 0,
    ack_flag_count INTEGER NOT NULL DEFAULT 0,
    is_unidirectional BOOLEAN NOT NULL DEFAULT TRUE,
    predicted_class TEXT NOT NULL,
    confidence NUMERIC(4,3) NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    severity TEXT NOT NULL CHECK (severity IN ('normal', 'low', 'medium', 'high', 'critical')),
    explanation TEXT NOT NULL,
    top_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Security Alerts Table
CREATE TABLE IF NOT EXISTS security_alerts (
    id TEXT PRIMARY KEY,
    flow_id TEXT REFERENCES traffic_flows(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    threat_class TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('normal', 'low', 'medium', 'high', 'critical')),
    risk_score INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'acknowledged', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 5. Model Registry Table
CREATE TABLE IF NOT EXISTS model_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name TEXT NOT NULL,
    version TEXT NOT NULL UNIQUE,
    training_dataset TEXT NOT NULL,
    feature_schema JSONB NOT NULL,
    evaluation_metrics JSONB NOT NULL,
    inference_latency_ms NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_flows_timestamp ON traffic_flows(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_flows_analysis_id ON traffic_flows(analysis_id);
CREATE INDEX IF NOT EXISTS idx_flows_threat_class ON traffic_flows(predicted_class);
CREATE INDEX IF NOT EXISTS idx_flows_severity ON traffic_flows(severity);
CREATE INDEX IF NOT EXISTS idx_flows_risk_score ON traffic_flows(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON security_alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON security_alerts(severity);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on traffic_flows" ON traffic_flows FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on security_alerts" ON security_alerts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow analysts to update alerts" ON security_alerts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on analyses" ON analyses FOR SELECT USING (auth.role() = 'authenticated');
