-- ============================================================
-- SQL MIGRATION: 2026 CV data sync (from CV_Bima Aryadinata.pdf)
-- Run this in your Supabase SQL Editor
-- Adds: GDSC org experience, Canva tool, Oracle SQL + Soft Skills
--       group, Jakarta Timur location
-- ============================================================

-- 1) GDSC UI/UX Member experience (from CV: Nov 2022 – Nov 2023)
INSERT INTO experiences (
  sort_order, type, period,
  title_en, title_id,
  org, location_en, location_id,
  desc_en, desc_id,
  achievement_en, achievement_id,
  tools, created_at
)
SELECT
  4,
  'organization',
  'NOV 2022 → NOV 2023',
  'UI/UX Member',
  'Anggota UI/UX',
  'Google Developer Student Clubs (GDSC) Palembang',
  'Palembang, Indonesia',
  'Palembang, Indonesia',
  'Designed high-fidelity prototype interfaces and ran usability testing to improve digital product accessibility across community technology projects.',
  'Merancang antarmuka prototipe high-fidelity dan menjalankan pengujian kegunaan untuk meningkatkan aksesibilitas produk digital pada proyek teknologi komunitas.',
  'Contributed to user-centric prototypes adopted across multiple community technology projects, sharpening hands-on UX research and design practice.',
  'Berkontribusi pada prototipe yang berpusat pada pengguna di berbagai proyek teknologi komunitas, memperkuat praktik riset dan desain UX secara langsung.',
  ARRAY['Figma'],
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM experiences
  WHERE org = 'Google Developer Student Clubs (GDSC) Palembang'
);

-- 2) Add Canva to PT ASABRI experience tools (per CV summary)
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE experiences
SET tools = ARRAY['Microsoft 365', 'Canva', 'Figma', 'Adobe Creative Suite'],
    updated_at = NOW()
WHERE org LIKE 'PT ASABRI%'
  AND NOT (tools @> ARRAY['Canva']);

-- 3) Oracle SQL skill (CV: SQL (MySQL/Oracle))
INSERT INTO skills (group_name, name, is_featured, sort_order)
SELECT 'Database', 'Oracle SQL', false, 34
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Oracle SQL');

-- 4) Soft Skills group (CV soft skills list)
INSERT INTO skills (group_name, name, is_featured, sort_order)
SELECT * FROM (VALUES
  ('Soft Skills', 'Strategic Leadership',   true,  35),
  ('Soft Skills', 'Project Management',     false, 36),
  ('Soft Skills', 'KPI Reporting',          false, 37),
  ('Soft Skills', 'Stakeholder Management', false, 38),
  ('Soft Skills', 'Time Management',        false, 39)
) AS v(group_name, name, is_featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE group_name = 'Soft Skills');

-- 5) Location update (CV: Jakarta Timur, Indonesia)
ALTER TABLE profile ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE profile
SET location = 'Jakarta Timur, Indonesia', updated_at = NOW()
WHERE id = 1;