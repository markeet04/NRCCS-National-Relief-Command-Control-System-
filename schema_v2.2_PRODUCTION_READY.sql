-- =====================================================
-- DEDUCTIVE REASONING SYSTEM - AI SUGGESTIONS (v2.3)
-- Added: December 28, 2025
-- =====================================================

-- 1. Add flood history tracking to provinces table
ALTER TABLE provinces 
ADD COLUMN IF NOT EXISTS flood_history_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_flood_date TIMESTAMP;

COMMENT ON COLUMN provinces.flood_history_count IS 'Number of floods in the last 3 years';
COMMENT ON COLUMN provinces.last_flood_date IS 'Date of the most recent flood event';

-- 2. AI-generated resource allocation suggestions requiring human approval
CREATE TABLE IF NOT EXISTS resource_suggestions (
    id SERIAL PRIMARY KEY,
    suggestion_type VARCHAR(50) NOT NULL,
    province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    suggested_quantity INTEGER NOT NULL,
    reasoning TEXT NOT NULL,
    rule_ids TEXT[] NOT NULL,
    confidence_score DECIMAL(4,3),
    ml_prediction_data JSONB,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    flags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id),
    rejection_reason TEXT,
    execution_status VARCHAR(20) CHECK (execution_status IN ('EXECUTING', 'COMPLETED', 'FAILED')),
    allocation_id INTEGER REFERENCES ndma_resource_allocations(id)
);

COMMENT ON TABLE resource_suggestions IS 'AI-generated resource allocation suggestions requiring human approval';
COMMENT ON COLUMN resource_suggestions.suggestion_type IS 'Type of allocation: WATER_ALLOCATION, FOOD_ALLOCATION, MEDICAL_ALLOCATION, SHELTER_ALLOCATION';
COMMENT ON COLUMN resource_suggestions.resource_type IS 'Resource type: food, water, medical, shelter';
COMMENT ON COLUMN resource_suggestions.suggested_quantity IS 'AI-calculated quantity to allocate';
COMMENT ON COLUMN resource_suggestions.reasoning IS 'Human-readable explanation of why this suggestion was made';
COMMENT ON COLUMN resource_suggestions.rule_ids IS 'Array of rule IDs that triggered this suggestion (e.g., ["RULE-001", "RULE-302"] )';
COMMENT ON COLUMN resource_suggestions.confidence_score IS 'ML prediction confidence score (0.000-1.000)';
COMMENT ON COLUMN resource_suggestions.ml_prediction_data IS 'Complete ML prediction data: {flood_risk, rainfall, temperature, humidity, etc}';
COMMENT ON COLUMN resource_suggestions.status IS 'Approval status: PENDING (awaiting review), APPROVED (executed), REJECTED (declined)';
COMMENT ON COLUMN resource_suggestions.flags IS 'Warning flags: LOW_CONFIDENCE, INSUFFICIENT_STOCK, etc.';
COMMENT ON COLUMN resource_suggestions.execution_status IS 'Execution status after approval: EXECUTING, COMPLETED, FAILED';
COMMENT ON COLUMN resource_suggestions.allocation_id IS 'Link to the actual allocation record if approved and executed';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON resource_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_province ON resource_suggestions(province_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_created ON resource_suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_reviewed ON resource_suggestions(reviewed_at DESC) WHERE reviewed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_suggestions_pending ON resource_suggestions(status, created_at DESC) WHERE status = 'PENDING';
-- =====================================================
-- NRCCS - National Relief Command & Control System
-- PostgreSQL Database Schema v2.2 (PRODUCTION-READY)
-- Date: December 2025
-- Changes from v2.1: Added soft delete, session management, validation constraints
-- =====================================================
-- This schema supports ALL user roles:
-- 1. SUPERADMIN - System administration
-- 2. NDMA - National Disaster Management Authority
-- 3. PDMA - Provincial Disaster Management Authority
-- 4. DISTRICT - District level officers
-- 5. CIVILIAN - Public users
-- =====================================================

-- =====================================================
-- 4-LEVEL RESOURCE HIERARCHY MIGRATIONS (v2.3)
-- Levels: National (NDMA) → Province (PDMA) → District → Shelter
-- Date: December 26, 2025
-- =====================================================

-- Task 1.1: Check current resources structure (RUN FIRST TO ANALYZE)
-- SELECT 
--     id, name, type, quantity, allocated,
--     province_id, district_id,
--     CASE 
--         WHEN province_id IS NULL AND district_id IS NULL THEN 'National'
--         WHEN province_id IS NOT NULL AND district_id IS NULL THEN 'Province'
--         WHEN district_id IS NOT NULL THEN 'District'
--     END as level
-- FROM resources
-- ORDER BY 
--     CASE WHEN province_id IS NULL THEN 1 WHEN district_id IS NULL THEN 2 ELSE 3 END,
--     type;

-- Task 1.2: Add shelter_id column for 4th level (SAFE - No data loss)
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS shelter_id INTEGER REFERENCES shelters(id) ON DELETE SET NULL;

-- Task 1.3: Add indexes for shelter lookups and each hierarchy level
CREATE INDEX IF NOT EXISTS idx_resources_shelter ON resources(shelter_id);

CREATE INDEX IF NOT EXISTS idx_national_resources 
ON resources(type) 
WHERE province_id IS NULL AND district_id IS NULL AND shelter_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_province_resources 
ON resources(province_id, type) 
WHERE district_id IS NULL AND shelter_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_district_resources 
ON resources(district_id, type) 
WHERE shelter_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_shelter_resources 
ON resources(shelter_id, type);

-- Task 1.4: Helper Views for easier queries
CREATE OR REPLACE VIEW v_national_resources AS
SELECT * FROM resources
WHERE province_id IS NULL AND district_id IS NULL AND shelter_id IS NULL;

CREATE OR REPLACE VIEW v_resources_hierarchy AS
SELECT 
    r.*,
    p.name as province_name,
    d.name as district_name,
    s.name as shelter_name,
    CASE 
        WHEN r.shelter_id IS NOT NULL THEN 'Shelter'
        WHEN r.district_id IS NOT NULL THEN 'District'
        WHEN r.province_id IS NOT NULL THEN 'Province'
        ELSE 'National'
    END as level_name
FROM resources r
LEFT JOIN provinces p ON r.province_id = p.id
LEFT JOIN districts d ON r.district_id = d.id
LEFT JOIN shelters s ON r.shelter_id = s.id;

CREATE OR REPLACE VIEW v_resource_flow_by_type AS
SELECT 
    type,
    SUM(CASE WHEN province_id IS NULL AND district_id IS NULL AND shelter_id IS NULL 
        THEN quantity ELSE 0 END) as national_stock,
    SUM(CASE WHEN province_id IS NOT NULL AND district_id IS NULL AND shelter_id IS NULL 
        THEN quantity ELSE 0 END) as province_stock,
    SUM(CASE WHEN district_id IS NOT NULL AND shelter_id IS NULL 
        THEN quantity ELSE 0 END) as district_stock,
    SUM(CASE WHEN shelter_id IS NOT NULL 
        THEN quantity ELSE 0 END) as shelter_stock,
    SUM(quantity) as total_in_system
FROM resources
GROUP BY type;

-- Task 1.5: (OPTIONAL) Check for invalid hierarchy before adding constraint
-- SELECT id, name, province_id, district_id, shelter_id
-- FROM resources
-- WHERE NOT (
--     (province_id IS NULL AND district_id IS NULL AND shelter_id IS NULL) OR
--     (province_id IS NOT NULL AND district_id IS NULL AND shelter_id IS NULL) OR
--     (province_id IS NOT NULL AND district_id IS NOT NULL AND shelter_id IS NULL) OR
--     (province_id IS NOT NULL AND district_id IS NOT NULL AND shelter_id IS NOT NULL)
-- );

-- Task 1.6: (OPTIONAL) Add hierarchy validation constraint (run only if above returns empty)
-- ALTER TABLE resources ADD CONSTRAINT chk_valid_resource_hierarchy CHECK (
--     (province_id IS NULL AND district_id IS NULL AND shelter_id IS NULL) OR
--     (province_id IS NOT NULL AND district_id IS NULL AND shelter_id IS NULL) OR
--     (province_id IS NOT NULL AND district_id IS NOT NULL AND shelter_id IS NULL) OR
--     (province_id IS NOT NULL AND district_id IS NOT NULL AND shelter_id IS NOT NULL)
-- );

-- Task 1.7: (OPTIONAL) Clean and reseed national resources only
-- CREATE TABLE resources_backup_national AS 
-- SELECT * FROM resources WHERE province_id IS NULL AND district_id IS NULL;
-- 
-- DELETE FROM resources WHERE province_id IS NULL AND district_id IS NULL AND shelter_id IS NULL;
-- 
-- INSERT INTO resources (
--     name, icon, type, category, quantity, unit, location,
--     province_id, district_id, shelter_id, status, allocated, allocated_quantity, description
-- ) VALUES 
--     ('Food Supplies', 'package', 'food', 'essential', 100000, 'tons', 
--      'National Warehouse Islamabad', NULL, NULL, NULL, 'available', 0, 0, 
--      'National food reserve for disaster relief'),
--     ('Drinking Water', 'droplets', 'water', 'essential', 500000, 'liters', 
--      'National Warehouse Islamabad', NULL, NULL, NULL, 'available', 0, 0, 
--      'Potable water for emergency distribution'),
--     ('Medical Kits', 'stethoscope', 'medical', 'healthcare', 50000, 'kits', 
--      'National Medical Reserve Islamabad', NULL, NULL, NULL, 'available', 0, 0, 
--      'First aid and emergency medical supplies'),
--     ('Emergency Tents', 'home', 'shelter', 'housing', 20000, 'units', 
--      'National Warehouse Islamabad', NULL, NULL, NULL, 'available', 0, 0, 
--      'Emergency shelter tents for displaced persons');

-- =====================================================
-- END OF 4-LEVEL HIERARCHY MIGRATIONS
-- =====================================================

  -- Add district_id column to resource_requests table
  ALTER TABLE resource_requests 
  ADD COLUMN IF NOT EXISTS district_id INTEGER NULL REFERENCES districts(id) ON DELETE CASCADE;
  
  -- Make province_id nullable (since district requests won't have province_id directly)
  ALTER TABLE resource_requests 
  ALTER COLUMN province_id DROP NOT NULL;



-- =====================================================
  -- NRCCS Resource Allocation Flow Migration
  -- Adds tables for NDMA -> Province resource allocation
  -- =====================================================
  
  -- Resource Request Status Type
  DO $$ BEGIN
      CREATE TYPE resource_request_status AS ENUM ('pending', 'approved', 'rejected', 'partially_approved', 'fulfilled');
  EXCEPTION
      WHEN duplicate_object THEN null;
  END $$;
  
  -- Resource Request Priority Type
  DO $$ BEGIN
      CREATE TYPE resource_request_priority AS ENUM ('low', 'medium', 'high', 'urgent');
  EXCEPTION
      WHEN duplicate_object THEN null;
  END $$;
  
  -- NDMA Allocation Status Type
  DO $$ BEGIN
      CREATE TYPE ndma_allocation_status AS ENUM ('pending', 'in_transit', 'delivered', 'received', 'cancelled');
  EXCEPTION
      WHEN duplicate_object THEN null;
  END $$;
  
  -- =====================================================
  -- TABLE: RESOURCE_REQUESTS
  -- Tracks requests from PDMA (Province) to NDMA (National)
  -- =====================================================
  CREATE TABLE IF NOT EXISTS resource_requests (
      id SERIAL PRIMARY KEY,
      province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
      requested_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      requested_by_name VARCHAR(150),
      
      status resource_request_status DEFAULT 'pending',
      priority resource_request_priority DEFAULT 'medium',
      
      reason TEXT,
      notes TEXT,
      
      requested_items JSONB DEFAULT '[]'::jsonb,
      approved_items JSONB DEFAULT '[]'::jsonb,
      
      processed_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      processed_by_name VARCHAR(150),
      processed_at TIMESTAMPTZ,
      
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_resource_requests_province ON resource_requests(province_id);
  CREATE INDEX IF NOT EXISTS idx_resource_requests_status ON resource_requests(status);
  CREATE INDEX IF NOT EXISTS idx_resource_requests_priority ON resource_requests(priority);
  CREATE INDEX IF NOT EXISTS idx_resource_requests_created ON resource_requests(created_at DESC);
  
  -- =====================================================
  -- TABLE: NDMA_RESOURCE_ALLOCATIONS
  -- =====================================================
  CREATE TABLE IF NOT EXISTS ndma_resource_allocations (
      id SERIAL PRIMARY KEY,
      resource_id INTEGER REFERENCES resources(id) ON DELETE SET NULL,
      resource_type VARCHAR(50) NOT NULL,
      resource_name VARCHAR(200) NOT NULL,
      
      province_id INTEGER NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
      
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit VARCHAR(50),
      
      status ndma_allocation_status DEFAULT 'pending',
      priority VARCHAR(20) DEFAULT 'normal',
      
      purpose TEXT,
      notes TEXT,
      
      request_id INTEGER REFERENCES resource_requests(id) ON DELETE SET NULL,
      
      allocated_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      allocated_by_name VARCHAR(150),
      allocated_at TIMESTAMPTZ DEFAULT NOW(),
      
      received_at TIMESTAMPTZ,
      received_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      received_by_name VARCHAR(150)
  );
  
  CREATE INDEX IF NOT EXISTS idx_ndma_allocations_province ON ndma_resource_allocations(province_id);
  CREATE INDEX IF NOT EXISTS idx_ndma_allocations_resource ON ndma_resource_allocations(resource_id);
  CREATE INDEX IF NOT EXISTS idx_ndma_allocations_status ON ndma_resource_allocations(status);
  CREATE INDEX IF NOT EXISTS idx_ndma_allocations_allocated_at ON ndma_resource_allocations(allocated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_ndma_allocations_type ON ndma_resource_allocations(resource_type);
  
  -- =====================================================
  -- SEED DATA: National Level Resources
  -- =====================================================
  INSERT INTO resources (name, icon, type, category, quantity, unit, location, province_id, district_id, status, allocated, description)
  VALUES 
      ('Food Supplies', 'package', 'food', 'essential', 50000, 'tons', 'National Warehouse Islamabad', NULL, NULL, 'available', 0, 'National food reserve for disaster relief'),
      ('Drinking Water', 'droplets', 'water', 'essential', 500000, 'liters', 'National Warehouse Islamabad', NULL, NULL, 'available', 0, 'Potable water for emergency distribution'),
      ('Medical Kits', 'stethoscope', 'medical', 'healthcare', 25000, 'kits', 'National Medical Reserve', NULL, NULL, 'available', 0, 'First aid and emergency medical supplies'),
      ('Emergency Tents', 'home', 'shelter', 'housing', 10000, 'units', 'National Warehouse Islamabad', NULL, NULL, 'available', 0, 'Emergency shelter tents for displaced persons'),
      ('Blankets', 'blanket', 'clothing', 'essential', 100000, 'units', 'National Warehouse Islamabad', NULL, NULL, 'available', 0, 'Thermal blankets for cold weather relief'),
      ('Water Purification Tablets', 'droplets', 'water', 'essential', 1000000, 'tablets', 'National Medical Reserve', NULL, NULL, 'available', 0, 'Water purification supplies')
  ON CONFLICT DO NOTHING;
  
  -- =====================================================
  -- VIEW: National Resource Summary
  -- =====================================================
  CREATE OR REPLACE VIEW v_national_resource_summary AS
  SELECT 
      type,
      COUNT(*) as resource_count,
      COALESCE(SUM(quantity), 0) as total_quantity,
      COALESCE(SUM(allocated), 0) as total_allocated,
      COALESCE(SUM(quantity - allocated), 0) as available_quantity,
      CASE 
          WHEN SUM(quantity) > 0 THEN ROUND((SUM(allocated)::numeric / SUM(quantity)) * 100, 2)
          ELSE 0
      END as allocation_percentage
  FROM resources
  WHERE province_id IS NULL AND district_id IS NULL
  GROUP BY type;
  
  -- =====================================================
  -- VIEW: Provincial Allocation Summary
  -- =====================================================
  CREATE OR REPLACE VIEW v_provincial_allocation_summary AS
  SELECT 
      p.id as province_id,
      p.name as province_name,
      COUNT(DISTINCT nra.id) as total_allocations,
      COALESCE(SUM(nra.quantity), 0) as total_received,
      COUNT(DISTINCT CASE WHEN nra.status = 'delivered' THEN nra.id END) as delivered_count,
      COUNT(DISTINCT CASE WHEN nra.status = 'pending' THEN nra.id END) as pending_count
  FROM provinces p
  LEFT JOIN ndma_resource_allocations nra ON p.id = nra.province_id
  GROUP BY p.id, p.name
  ORDER BY p.name;
  
  -- =====================================================
  -- VIEW: Pending Resource Requests Summary
  -- =====================================================
  CREATE OR REPLACE VIEW v_pending_requests_summary AS
  SELECT 
      p.id as province_id,
      p.name as province_name,
      COUNT(*) as pending_requests,
      COUNT(CASE WHEN rr.priority = 'urgent' THEN 1 END) as urgent_count,
      COUNT(CASE WHEN rr.priority = 'high' THEN 1 END) as high_priority_count,
      MIN(rr.created_at) as oldest_request_date
  FROM resource_requests rr
  JOIN provinces p ON rr.province_id = p.id
  WHERE rr.status = 'pending'
  GROUP BY p.id, p.name
  ORDER BY urgent_count DESC, high_priority_count DESC;
-- Drop existing types if they exist (for clean re-run)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_level CASCADE;
DROP TYPE IF EXISTS sos_status CASCADE;
DROP TYPE IF EXISTS sos_priority CASCADE;
DROP TYPE IF EXISTS emergency_type CASCADE;
DROP TYPE IF EXISTS damage_report_status CASCADE;
DROP TYPE IF EXISTS shelter_status CASCADE;
DROP TYPE IF EXISTS rescue_team_status CASCADE;
DROP TYPE IF EXISTS rescue_team_type CASCADE;
DROP TYPE IF EXISTS alert_type CASCADE;
DROP TYPE IF EXISTS alert_severity CASCADE;
DROP TYPE IF EXISTS alert_status CASCADE;
DROP TYPE IF EXISTS resource_type CASCADE;
DROP TYPE IF EXISTS resource_status CASCADE;
DROP TYPE IF EXISTS missing_person_status CASCADE;
DROP TYPE IF EXISTS flood_zone_level CASCADE;
DROP TYPE IF EXISTS district_risk_level CASCADE;
DROP TYPE IF EXISTS gender_type CASCADE;

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE user_role AS ENUM ('superadmin', 'ndma', 'pdma', 'district', 'civilian');
CREATE TYPE user_level AS ENUM ('National', 'Provincial', 'District');
CREATE TYPE sos_status AS ENUM ('Pending', 'Assigned', 'En-route', 'In Progress', 'Rescued', 'Completed', 'Cancelled');
CREATE TYPE sos_priority AS ENUM ('Critical', 'High', 'Medium', 'Low');
CREATE TYPE emergency_type AS ENUM ('medical', 'fire', 'flood', 'accident', 'security', 'other');
CREATE TYPE damage_report_status AS ENUM ('pending', 'verified');
CREATE TYPE shelter_status AS ENUM ('available', 'limited', 'full', 'operational', 'closed');
CREATE TYPE rescue_team_status AS ENUM ('available', 'busy', 'deployed', 'on-mission', 'unavailable', 'resting');
CREATE TYPE rescue_team_type AS ENUM ('Rescue 1122', 'Medical Response', 'Civil Defense', 'Army', 'Navy', 'Other');
CREATE TYPE alert_type AS ENUM ('flood_warning', 'evacuation', 'all_clear', 'flood', 'shelter', 'earthquake', 'storm', 'health', 'fire', 'security', 'weather', 'other');
CREATE TYPE alert_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');
CREATE TYPE alert_status AS ENUM ('active', 'expired', 'resolved', 'pending', 'draft');
CREATE TYPE resource_type AS ENUM ('food', 'water', 'medical', 'shelter', 'clothing', 'blanket', 'transport', 'communication', 'equipment', 'personnel', 'other');
CREATE TYPE resource_status AS ENUM ('available', 'allocated', 'low', 'critical', 'maintenance', 'deployed');
CREATE TYPE missing_person_status AS ENUM ('active', 'found', 'dead', 'searching', 'closed');
CREATE TYPE flood_zone_level AS ENUM ('critical', 'high', 'medium', 'stable', 'low');
CREATE TYPE district_risk_level AS ENUM ('critical', 'high', 'medium', 'stable', 'low');
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');


-- =====================================================
-- TABLE 1: PROVINCES
-- =====================================================
CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10),
    district_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 2: DISTRICTS
-- =====================================================
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    province_id INTEGER REFERENCES provinces(id) ON DELETE CASCADE,
    population INTEGER DEFAULT 0,
    contact VARCHAR(20),
    email VARCHAR(100),
    risk_level district_risk_level DEFAULT 'stable',
    status VARCHAR(50) DEFAULT 'stable',
    active_teams INTEGER DEFAULT 0,
    sos_requests INTEGER DEFAULT 0,
    active_alerts INTEGER DEFAULT 0,
    last_update TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 3: USERS (WITH SOFT DELETE & PASSWORD VALIDATION)
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100),
    password_hash VARCHAR(255) CHECK (LENGTH(password_hash) >= 60), -- bcrypt min length
    name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'civilian',
    level user_level,
    phone VARCHAR(20),
    cnic VARCHAR(15),
    avatar_url TEXT,
    province_id INTEGER REFERENCES provinces(id) ON DELETE SET NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    location VARCHAR(255),
    permissions TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    
    -- SOFT DELETE SUPPORT
    deleted_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for soft delete queries
CREATE INDEX idx_users_not_deleted ON users(id) WHERE is_deleted = FALSE;


-- =====================================================
-- TABLE 3.1: USER_SESSIONS (FIXED)
-- =====================================================
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one active session per user (optional)
    UNIQUE(user_id, token_hash)
);

-- Index for session cleanup (finding expired sessions to delete)
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- FIXED: Changed from partial index with NOW() to composite index
-- This allows efficient queries like: WHERE user_id = ? AND expires_at > NOW()
CREATE INDEX idx_sessions_user_active ON user_sessions(user_id, expires_at);

-- =====================================================
-- TABLE 4: DISTRICT_OFFICERS
-- =====================================================
CREATE TABLE district_officers (
    id SERIAL PRIMARY KEY,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    position VARCHAR(100),
    officer_name VARCHAR(150),
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 5: SHELTERS (WITH SOFT DELETE & SUPPLY VALIDATION)
-- =====================================================
CREATE TABLE shelters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    
    -- Location (frontend uses lat/lng)
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    distance DECIMAL(6, 2),
    
    -- Capacity (frontend uses capacity/occupancy)
    capacity INTEGER DEFAULT 0,
    occupancy INTEGER DEFAULT 0 CHECK (occupancy >= 0 AND occupancy <= capacity),
    
    status shelter_status DEFAULT 'available',
    
    -- Contact info
    contact VARCHAR(20),
    contact_phone VARCHAR(20),
    manager_name VARCHAR(150),
    manager_phone VARCHAR(20),
    
    -- Facilities array
    facilities TEXT[],
    amenities TEXT[],
    
    -- Supply levels (percentage 0-100) WITH VALIDATION
    supply_food INTEGER DEFAULT 100 CHECK (supply_food BETWEEN 0 AND 100),
    supply_water INTEGER DEFAULT 100 CHECK (supply_water BETWEEN 0 AND 100),
    supply_medical INTEGER DEFAULT 100 CHECK (supply_medical BETWEEN 0 AND 100),
    supply_tents INTEGER DEFAULT 100 CHECK (supply_tents BETWEEN 0 AND 100),
    
    rating DECIMAL(3, 1) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    critical_needs TEXT[],
    
    -- SOFT DELETE SUPPORT
    deleted_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    last_update TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shelters_not_deleted ON shelters(id) WHERE is_deleted = FALSE;


-- =====================================================
-- TABLE 6: RESCUE_TEAMS (WITH SOFT DELETE)
-- =====================================================
CREATE TABLE rescue_teams (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    team_type VARCHAR(50),
    
    -- Leader info
    leader VARCHAR(150),
    leader_name VARCHAR(150),
    
    -- Contact
    contact VARCHAR(20),
    contact_phone VARCHAR(20),
    
    -- Members
    members INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 0,
    
    status rescue_team_status DEFAULT 'available',
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    
    -- Location
    location VARCHAR(255),
    current_location VARCHAR(255),
    coordinates VARCHAR(100),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    
    equipment TEXT[],
    
    -- Team composition
    composition_medical INTEGER DEFAULT 0,
    composition_rescue INTEGER DEFAULT 0,
    composition_support INTEGER DEFAULT 0,
    
    notes TEXT,
    current_mission_id VARCHAR(20),
    
    -- SOFT DELETE SUPPORT
    deleted_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    last_update TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rescue_teams_not_deleted ON rescue_teams(id) WHERE is_deleted = FALSE;


-- =====================================================
-- TABLE 7: SOS_REQUESTS (WITH SOFT DELETE)
-- =====================================================
CREATE TABLE sos_requests (
    id VARCHAR(20) PRIMARY KEY,
    
    -- Requester info (frontend uses 'name')
    name VARCHAR(150),
    requester_name VARCHAR(150),
    phone VARCHAR(20),
    cnic VARCHAR(15),
    
    -- Location
    location TEXT,
    location_address TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    coordinates VARCHAR(100),
    
    -- Emergency details
    people_count INTEGER DEFAULT 1 CHECK (people_count > 0),
    emergency_type VARCHAR(50),
    description TEXT,
    status sos_status DEFAULT 'Pending',
    priority sos_priority DEFAULT 'Medium',
    
    -- Assignment
    assigned_team VARCHAR(150),
    assigned_team_id VARCHAR(20) REFERENCES rescue_teams(id) ON DELETE SET NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    
    -- Response tracking
    estimated_arrival VARCHAR(50),
    estimated_response_time VARCHAR(50),
    distance_away VARCHAR(50),
    current_stage INTEGER DEFAULT 0,
    
    -- Response contact
    contact_phone VARCHAR(20),
    emergency_line VARCHAR(20),
    team_leader VARCHAR(150),
    investigator VARCHAR(150),
    response_team VARCHAR(150),
    team_contact VARCHAR(20),
    
    -- Submitter tracking
    submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    submitted_by_name VARCHAR(150),
    submitted_by_cnic VARCHAR(15),
    submitted_by_phone VARCHAR(20),
    
    -- Time fields
    time VARCHAR(50),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- SOFT DELETE SUPPORT
    deleted_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sos_not_deleted ON sos_requests(id) WHERE is_deleted = FALSE;

-- Add FK for rescue_teams after sos_requests exists
ALTER TABLE rescue_teams 
ADD CONSTRAINT fk_current_mission 
FOREIGN KEY (current_mission_id) REFERENCES sos_requests(id) ON DELETE SET NULL;


-- =====================================================
-- TABLE 8: SOS_REQUEST_TIMELINE
-- =====================================================
CREATE TABLE sos_request_timeline (
    id SERIAL PRIMARY KEY,
    sos_request_id VARCHAR(20) REFERENCES sos_requests(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    time VARCHAR(100),
    timestamp TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending',
    message TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 9: SOS_REQUEST_UPDATES
-- =====================================================
CREATE TABLE sos_request_updates (
    id SERIAL PRIMARY KEY,
    sos_request_id VARCHAR(20) REFERENCES sos_requests(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    time VARCHAR(100),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    type VARCHAR(20) DEFAULT 'info',
    update_type VARCHAR(20) DEFAULT 'info',
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 10: DAMAGE_REPORTS
-- =====================================================
CREATE TABLE damage_reports (
    id VARCHAR(20) PRIMARY KEY,
    location TEXT NOT NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    
    -- Submitter
    submitted_by VARCHAR(150),
    submitted_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Date
    date DATE DEFAULT CURRENT_DATE,
    report_date DATE DEFAULT CURRENT_DATE,
    
    status damage_report_status DEFAULT 'pending',
    description TEXT,
    
    verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 11: DAMAGE_REPORT_PHOTOS
-- =====================================================
CREATE TABLE damage_report_photos (
    id SERIAL PRIMARY KEY,
    damage_report_id VARCHAR(20) REFERENCES damage_reports(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    url TEXT,
    caption VARCHAR(255),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 12: ALERTS
-- =====================================================
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    
    -- Type (frontend uses both 'type' and 'alertType')
    type VARCHAR(50),
    alert_type VARCHAR(50),
    
    severity alert_severity DEFAULT 'medium',
    
    -- Description
    description TEXT,
    short_description VARCHAR(500),
    message TEXT,
    
    -- Affected areas
    affected_areas TEXT[],
    recommended_actions TEXT[],
    
    -- Location references
    province_id INTEGER REFERENCES provinces(id) ON DELETE SET NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    province VARCHAR(100),
    district VARCHAR(100),
    tehsil VARCHAR(100),
    location VARCHAR(255),
    
    -- Source
    source VARCHAR(150),
    issued_by VARCHAR(150),
    issued_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    creator VARCHAR(150),
    
    status alert_status DEFAULT 'active',
    
    -- Display
    color VARCHAR(20),
    display_color VARCHAR(20),
    
    -- Timestamps
    time TIMESTAMPTZ DEFAULT NOW(),
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    issue_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 13: ALERT_READ_STATUS
-- =====================================================
CREATE TABLE alert_read_status (
    id SERIAL PRIMARY KEY,
    alert_id INTEGER REFERENCES alerts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT TRUE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(alert_id, user_id)
);


-- =====================================================
-- TABLE 14: RESOURCES
-- =====================================================
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    icon VARCHAR(50),
    
    -- Type/Category
    type VARCHAR(50),
    category VARCHAR(50),
    resource_type VARCHAR(50),
    
    quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
    unit VARCHAR(50),
    location VARCHAR(255),
    
    province_id INTEGER REFERENCES provinces(id) ON DELETE SET NULL,
    province VARCHAR(100),
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    
    status resource_status DEFAULT 'available',
    
    -- Allocation
    allocated INTEGER DEFAULT 0 CHECK (allocated >= 0 AND allocated <= quantity),
    allocated_quantity INTEGER DEFAULT 0,
    trend INTEGER DEFAULT 0,
    trend_percentage DECIMAL(5, 2) DEFAULT 0,
    
    description TEXT,
    contact_email VARCHAR(255),
    last_update TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 15: RESOURCE_HISTORY
-- =====================================================
CREATE TABLE resource_history (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    quantity_change INTEGER,
    performed_by VARCHAR(150),
    performed_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 16: RESOURCE_ALLOCATIONS
-- =====================================================
CREATE TABLE resource_allocations (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
    allocated_to_district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    allocated_to_shelter_id INTEGER REFERENCES shelters(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 0 CHECK (quantity > 0),
    purpose TEXT,
    allocated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    returned_at TIMESTAMPTZ
);


-- =====================================================
-- TABLE 17: MISSING_PERSONS
-- =====================================================
CREATE TABLE missing_persons (
    id SERIAL PRIMARY KEY,
    
    -- Case reference (MP-YYYY-XXXX)
    case_number VARCHAR(20) UNIQUE,
    case_reference VARCHAR(20),
    
    name VARCHAR(150) NOT NULL,
    age INTEGER CHECK (age > 0 AND age < 150),
    gender gender_type,
    
    -- Last seen
    last_seen_location TEXT,
    last_seen_date DATE,
    
    description TEXT,
    
    -- Photo
    photo_url TEXT,
    photo TEXT,
    
    -- Reporter info
    reporter_name VARCHAR(150),
    reporter_phone VARCHAR(20),
    contact_number VARCHAR(20),
    reported_by VARCHAR(50),
    
    status missing_person_status DEFAULT 'active',
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    reported_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    found_at TIMESTAMPTZ,
    report_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 18: FLOOD_ZONES
-- =====================================================
CREATE TABLE flood_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    risk_level flood_zone_level DEFAULT 'medium',
    
    -- Location
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    affected_population INTEGER DEFAULT 0,
    shelter_count INTEGER DEFAULT 0,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    polygon_coordinates JSONB,
    description TEXT,
    last_assessment TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 19: ACTIVITY_LOGS
-- =====================================================
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20),
    location VARCHAR(255),
    province_id INTEGER REFERENCES provinces(id) ON DELETE SET NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    performed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    related_entity_type VARCHAR(50),
    related_entity_id VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 20: NOTIFICATIONS
-- =====================================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(50),
    notification_type VARCHAR(50),
    type VARCHAR(50),
    severity VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 21: AUDIT_LOGS
-- =====================================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 22: API_INTEGRATIONS
-- =====================================================
CREATE TABLE api_integrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255),
    endpoint TEXT,
    endpoint_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    last_sync TIMESTAMPTZ,
    last_tested TIMESTAMPTZ,
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 23: SYSTEM_SETTINGS
-- =====================================================
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    system_name VARCHAR(100) DEFAULT 'NRCCS',
    alert_level VARCHAR(20) DEFAULT 'normal',
    session_timeout VARCHAR(10) DEFAULT '30',
    auto_backup BOOLEAN DEFAULT TRUE,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    db_status VARCHAR(50) DEFAULT 'Connected',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE 24: WEATHER_DATA
-- =====================================================
CREATE TABLE weather_data (
    id SERIAL PRIMARY KEY,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    conditions VARCHAR(100),
    temperature VARCHAR(20),
    forecast TEXT,
    humidity VARCHAR(20),
    humidity_value INTEGER,
    wind_speed VARCHAR(50),
    rainfall VARCHAR(50),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(district_id)
);


-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_province ON users(province_id);
CREATE INDEX idx_users_district ON users(district_id);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_districts_province ON districts(province_id);
CREATE INDEX idx_districts_risk ON districts(risk_level);

CREATE INDEX idx_sos_status ON sos_requests(status);
CREATE INDEX idx_sos_priority ON sos_requests(priority);
CREATE INDEX idx_sos_district ON sos_requests(district_id);
CREATE INDEX idx_sos_team ON sos_requests(assigned_team_id);
CREATE INDEX idx_sos_created ON sos_requests(created_at DESC);
CREATE INDEX idx_sos_district_status ON sos_requests(district_id, status); -- Composite for queries

CREATE INDEX idx_shelters_district ON shelters(district_id);
CREATE INDEX idx_shelters_status ON shelters(status);
CREATE INDEX idx_shelters_district_status ON shelters(district_id, status); -- Composite

CREATE INDEX idx_rescue_teams_status ON rescue_teams(status);
CREATE INDEX idx_rescue_teams_district ON rescue_teams(district_id);

CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_province ON alerts(province_id);
CREATE INDEX idx_alerts_district ON alerts(district_id);

CREATE INDEX idx_resources_province ON resources(province_id);
CREATE INDEX idx_resources_district ON resources(district_id);
CREATE INDEX idx_resources_status ON resources(status);

CREATE INDEX idx_missing_status ON missing_persons(status);
CREATE INDEX idx_missing_district ON missing_persons(district_id);

CREATE INDEX idx_damage_status ON damage_reports(status);
CREATE INDEX idx_damage_district ON damage_reports(district_id);

CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);

CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_notif_read ON notifications(is_read);


-- =====================================================
-- INITIAL DATA
-- =====================================================

INSERT INTO provinces (name, code, district_count) VALUES
('Punjab', 'PB', 36),
('Sindh', 'SD', 30),
('Khyber Pakhtunkhwa', 'KP', 35),
('Balochistan', 'BL', 34),
('Gilgit-Baltistan', 'GB', 10),
('Azad Jammu & Kashmir', 'AJK', 10),
('Islamabad Capital Territory', 'ICT', 1);

INSERT INTO system_settings (setting_key, setting_value, system_name) 
VALUES ('app_name', 'NRCCS', 'NRCCS');


-- =====================================================
-- VIEWS FOR DASHBOARD STATISTICS (WITH SOFT DELETE FILTERS)
-- =====================================================

-- National Statistics (NDMA Dashboard)
CREATE OR REPLACE VIEW v_national_stats AS
SELECT 
    (SELECT COUNT(*) FROM sos_requests WHERE status IN ('Pending', 'Assigned', 'En-route', 'In Progress') AND is_deleted = FALSE) AS active_sos,
    (SELECT COUNT(*) FROM shelters WHERE status != 'closed' AND is_deleted = FALSE) AS total_shelters,
    (SELECT COALESCE(SUM(occupancy), 0) FROM shelters WHERE is_deleted = FALSE) AS people_sheltered,
    (SELECT COUNT(*) FROM rescue_teams WHERE status IN ('available', 'deployed', 'on-mission') AND is_deleted = FALSE) AS active_teams,
    (SELECT COUNT(*) FROM alerts WHERE status = 'active') AS active_alerts,
    (SELECT COUNT(*) FROM districts WHERE risk_level IN ('critical', 'high')) AS affected_districts;

-- Provincial Statistics (PDMA Dashboard)
CREATE OR REPLACE VIEW v_provincial_stats AS
SELECT 
    p.id AS province_id,
    p.name AS province_name,
    COUNT(DISTINCT d.id) AS total_districts,
    COUNT(DISTINCT CASE WHEN d.risk_level IN ('critical', 'high') THEN d.id END) AS affected_districts,
    COUNT(DISTINCT CASE WHEN s.is_deleted = FALSE THEN s.id END) AS total_shelters,
    COALESCE(SUM(CASE WHEN s.is_deleted = FALSE THEN s.occupancy ELSE 0 END), 0) AS people_sheltered,
    COUNT(DISTINCT CASE WHEN rt.is_deleted = FALSE THEN rt.id END) AS total_teams,
    COUNT(DISTINCT CASE WHEN rt.status = 'available' AND rt.is_deleted = FALSE THEN rt.id END) AS available_teams
FROM provinces p
LEFT JOIN districts d ON d.province_id = p.id
LEFT JOIN shelters s ON s.district_id = d.id
LEFT JOIN rescue_teams rt ON rt.district_id = d.id
GROUP BY p.id, p.name;

-- District Statistics (District Dashboard)
CREATE OR REPLACE VIEW v_district_stats AS
SELECT 
    d.id AS district_id,
    d.name AS district_name,
    (SELECT COUNT(*) FROM sos_requests sr WHERE sr.district_id = d.id AND sr.status = 'Pending' AND sr.is_deleted = FALSE) AS pending_sos,
    (SELECT COUNT(*) FROM sos_requests sr WHERE sr.district_id = d.id AND sr.status IN ('Pending', 'Assigned', 'En-route', 'In Progress') AND sr.is_deleted = FALSE) AS active_sos,
    (SELECT COUNT(*) FROM shelters s WHERE s.district_id = d.id AND s.is_deleted = FALSE) AS total_shelters,
    (SELECT COALESCE(SUM(s.occupancy), 0) FROM shelters s WHERE s.district_id = d.id AND s.is_deleted = FALSE) AS people_sheltered,
    (SELECT COUNT(*) FROM rescue_teams rt WHERE rt.district_id = d.id AND rt.status = 'available' AND rt.is_deleted = FALSE) AS available_teams,
    (SELECT COUNT(*) FROM damage_reports dr WHERE dr.district_id = d.id AND dr.status = 'pending') AS pending_reports
FROM districts d;


-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate SOS ID: SOS-YYYY-XXXX
CREATE OR REPLACE FUNCTION fn_generate_sos_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
    yr TEXT;
BEGIN
    yr := EXTRACT(YEAR FROM NOW())::TEXT;
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 10) AS INTEGER)), 0) + 1 
    INTO next_num 
    FROM sos_requests 
    WHERE id LIKE 'SOS-' || yr || '-%';
    NEW.id := 'SOS-' || yr || '-' || LPAD(next_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate DR ID: DR-XXX
CREATE OR REPLACE FUNCTION fn_generate_dr_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1 
    INTO next_num 
    FROM damage_reports;
    NEW.id := 'DR-' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate RT ID: RT-XXX
CREATE OR REPLACE FUNCTION fn_generate_rt_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1 
    INTO next_num 
    FROM rescue_teams;
    NEW.id := 'RT-' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate MP Case Number: MP-YYYY-XXXX
CREATE OR REPLACE FUNCTION fn_generate_mp_case()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
    yr TEXT;
BEGIN
    yr := EXTRACT(YEAR FROM NOW())::TEXT;
    SELECT COALESCE(MAX(CAST(SUBSTRING(case_number FROM 9) AS INTEGER)), 0) + 1 
    INTO next_num 
    FROM missing_persons 
    WHERE case_number LIKE 'MP-' || yr || '-%';
    NEW.case_number := 'MP-' || yr || '-' || LPAD(next_num::TEXT, 4, '0');
    NEW.case_reference := NEW.case_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_districts_updated BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_shelters_updated BEFORE UPDATE ON shelters FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_rescue_teams_updated BEFORE UPDATE ON rescue_teams FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_sos_updated BEFORE UPDATE ON sos_requests FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_damage_updated BEFORE UPDATE ON damage_reports FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_alerts_updated BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_missing_updated BEFORE UPDATE ON missing_persons FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_flood_zones_updated BEFORE UPDATE ON flood_zones FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_api_updated BEFORE UPDATE ON api_integrations FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ID generation triggers
CREATE TRIGGER trg_sos_id BEFORE INSERT ON sos_requests FOR EACH ROW WHEN (NEW.id IS NULL OR NEW.id = '') EXECUTE FUNCTION fn_generate_sos_id();
CREATE TRIGGER trg_dr_id BEFORE INSERT ON damage_reports FOR EACH ROW WHEN (NEW.id IS NULL OR NEW.id = '') EXECUTE FUNCTION fn_generate_dr_id();
CREATE TRIGGER trg_rt_id BEFORE INSERT ON rescue_teams FOR EACH ROW WHEN (NEW.id IS NULL OR NEW.id = '') EXECUTE FUNCTION fn_generate_rt_id();
CREATE TRIGGER trg_mp_case BEFORE INSERT ON missing_persons FOR EACH ROW WHEN (NEW.case_number IS NULL OR NEW.case_number = '') EXECUTE FUNCTION fn_generate_mp_case();


-- =====================================================
-- SCHEMA COMPLETE - v2.2 PRODUCTION-READY
-- =====================================================
-- Changes from v2.1:
-- ✅ Added soft delete (deleted_at, is_deleted) to users, shelters, rescue_teams, sos_requests
-- ✅ Added user_sessions table for session management
-- ✅ Added password_hash length validation (min 60 chars for bcrypt)
-- ✅ Added CHECK constraints for supply levels (0-100), occupancy, age, quantity
-- ✅ Updated views to respect soft delete filters
-- ✅ Added composite indexes for common query patterns
-- =====================================================
