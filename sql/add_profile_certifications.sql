-- ═══════════════════════════════════════════════════
-- MIGRATION: Add certifications column to profile table
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════

ALTER TABLE profile ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;
