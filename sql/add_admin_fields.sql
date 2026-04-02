-- ═══════════════════════════════════════════════════
-- MIGRATION: Add new fields for admin panel support
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════

-- ── Projects: role, highlight, status ──
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role_en TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role_id TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS highlight TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT '';

-- ── Experiences: location, achievement, tools ──
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS location_en TEXT DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS location_id TEXT DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS achievement_en TEXT DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS achievement_id TEXT DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS tools TEXT[] DEFAULT '{}';

-- ── Profile: hero tagline ──
ALTER TABLE profile ADD COLUMN IF NOT EXISTS hero_tagline_en TEXT DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS hero_tagline_id TEXT DEFAULT '';
