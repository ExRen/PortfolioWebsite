-- ═══════════════════════════════════════════════════
-- ADD NEW COLUMNS — Run AFTER the initial migration
-- Adds: experience.type, profile new fields
-- ═══════════════════════════════════════════════════

-- Add type to experiences
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'professional'
  CHECK (type IN ('professional', 'organization'));

-- Add new profile columns
ALTER TABLE profile ADD COLUMN IF NOT EXISTS hero_name TEXT DEFAULT 'BIMA
ARYA';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS badge_en TEXT DEFAULT 'Available for hire';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS badge_id TEXT DEFAULT 'Terbuka untuk peluang baru';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Jakarta, Indonesia';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS footer_en TEXT DEFAULT '© 2025 Bima Aryadinata';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS footer_id TEXT DEFAULT '© 2025 Bima Aryadinata';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS contact_cta_en TEXT DEFAULT 'Let''s<br>work<span style="color:var(--ac)">.</span>';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS contact_cta_id TEXT DEFAULT 'Mari<br>bekerja<span style="color:var(--ac)">.</span>';

-- ═══════════════════════════════════════════════════
-- DONE! Refresh admin.html to see new fields.
-- ═══════════════════════════════════════════════════
