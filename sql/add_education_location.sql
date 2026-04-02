-- ═══════════════════════════════════════════════════
-- MIGRATION: Add location columns to education table
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════

ALTER TABLE education ADD COLUMN IF NOT EXISTS location_en TEXT DEFAULT '';
ALTER TABLE education ADD COLUMN IF NOT EXISTS location_id TEXT DEFAULT '';
