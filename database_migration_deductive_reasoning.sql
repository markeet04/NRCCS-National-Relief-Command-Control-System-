-- ====================================================================
-- DEDUCTIVE REASONING SYSTEM - DATABASE MIGRATION
-- Created: December 27, 2025
-- Purpose: Add AI-powered resource allocation suggestion system
-- ====================================================================

-- 1. Add flood history tracking to provinces table
ALTER TABLE provinces 
ADD COLUMN IF NOT EXISTS flood_history_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_flood_date TIMESTAMP;

COMMENT ON COLUMN provinces.flood_history_count IS 'Number of floods in the last 3 years';
COMMENT ON COLUMN provinces.last_flood_date IS 'Date of the most recent flood event';

-- 2. Create resource_suggestions table
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

-- Add comments for documentation
COMMENT ON TABLE resource_suggestions IS 'AI-generated resource allocation suggestions requiring human approval';
COMMENT ON COLUMN resource_suggestions.suggestion_type IS 'Type of allocation: WATER_ALLOCATION, FOOD_ALLOCATION, MEDICAL_ALLOCATION, SHELTER_ALLOCATION';
COMMENT ON COLUMN resource_suggestions.resource_type IS 'Resource type: food, water, medical, shelter';
COMMENT ON COLUMN resource_suggestions.suggested_quantity IS 'AI-calculated quantity to allocate';
COMMENT ON COLUMN resource_suggestions.reasoning IS 'Human-readable explanation of why this suggestion was made';
COMMENT ON COLUMN resource_suggestions.rule_ids IS 'Array of rule IDs that triggered this suggestion (e.g., ["RULE-001", "RULE-302"])';
COMMENT ON COLUMN resource_suggestions.confidence_score IS 'ML prediction confidence score (0.000-1.000)';
COMMENT ON COLUMN resource_suggestions.ml_prediction_data IS 'Complete ML prediction data: {flood_risk, rainfall, temperature, humidity, etc}';
COMMENT ON COLUMN resource_suggestions.status IS 'Approval status: PENDING (awaiting review), APPROVED (executed), REJECTED (declined)';
COMMENT ON COLUMN resource_suggestions.flags IS 'Warning flags: LOW_CONFIDENCE, INSUFFICIENT_STOCK, etc.';
COMMENT ON COLUMN resource_suggestions.execution_status IS 'Execution status after approval: EXECUTING, COMPLETED, FAILED';
COMMENT ON COLUMN resource_suggestions.allocation_id IS 'Link to the actual allocation record if approved and executed';

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON resource_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_province ON resource_suggestions(province_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_created ON resource_suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_reviewed ON resource_suggestions(reviewed_at DESC) WHERE reviewed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_suggestions_pending ON resource_suggestions(status, created_at DESC) WHERE status = 'PENDING';

-- 4. Create view for quick stats
CREATE OR REPLACE VIEW suggestion_stats AS
SELECT 
  status,
  COUNT(*) as count,
  SUM(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 ELSE 0 END) as count_24h,
  AVG(confidence_score) as avg_confidence
FROM resource_suggestions
GROUP BY status;

COMMENT ON VIEW suggestion_stats IS 'Quick statistics on suggestion counts and confidence by status';

-- ====================================================================
-- VERIFICATION QUERIES (Run after migration to verify)
-- ====================================================================

-- Check provinces table columns
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'provinces' 
-- AND column_name IN ('flood_history_count', 'last_flood_date');

-- Check resource_suggestions table structure
-- SELECT column_name, data_type, column_default, is_nullable
-- FROM information_schema.columns 
-- WHERE table_name = 'resource_suggestions'
-- ORDER BY ordinal_position;

-- Check indexes
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'resource_suggestions';

-- Check view
-- SELECT * FROM suggestion_stats;

-- ====================================================================
-- END OF MIGRATION
-- ====================================================================
