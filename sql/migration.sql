-- ═══════════════════════════════════════════════════
-- PORTFOLIO DATABASE MIGRATION
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  sort_order INT DEFAULT 1,
  category TEXT NOT NULL DEFAULT 'fullstack' CHECK (category IN ('ai', 'fullstack', 'tools')),
  name TEXT NOT NULL,
  desc_en TEXT DEFAULT '',
  desc_id TEXT DEFAULT '',
  detail_en TEXT DEFAULT '',
  detail_id TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  github_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_public" ON projects
  FOR SELECT USING (true);
CREATE POLICY "projects_insert_auth" ON projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "projects_update_auth" ON projects
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "projects_delete_auth" ON projects
  FOR DELETE USING (auth.uid() IS NOT NULL);


-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  group_name TEXT NOT NULL DEFAULT 'Frontend',
  name TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 1
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skills_select_public" ON skills
  FOR SELECT USING (true);
CREATE POLICY "skills_insert_auth" ON skills
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "skills_update_auth" ON skills
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "skills_delete_auth" ON skills
  FOR DELETE USING (auth.uid() IS NOT NULL);


-- 3. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS experiences (
  id BIGSERIAL PRIMARY KEY,
  sort_order INT DEFAULT 1,
  period TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_id TEXT DEFAULT '',
  org TEXT NOT NULL DEFAULT '',
  desc_en TEXT DEFAULT '',
  desc_id TEXT DEFAULT ''
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "experiences_select_public" ON experiences
  FOR SELECT USING (true);
CREATE POLICY "experiences_insert_auth" ON experiences
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "experiences_update_auth" ON experiences
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "experiences_delete_auth" ON experiences
  FOR DELETE USING (auth.uid() IS NOT NULL);


-- 4. PROFILE TABLE (single row)
CREATE TABLE IF NOT EXISTS profile (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_bio_en TEXT DEFAULT '',
  hero_bio_id TEXT DEFAULT '',
  stats JSONB DEFAULT '[]'::jsonb,
  contact_email TEXT DEFAULT '',
  contact_linkedin TEXT DEFAULT '',
  contact_portfolio TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  about_en JSONB DEFAULT '[]'::jsonb,
  about_id JSONB DEFAULT '[]'::jsonb,
  pills_en JSONB DEFAULT '[]'::jsonb,
  pills_id JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_select_public" ON profile
  FOR SELECT USING (true);
CREATE POLICY "profile_insert_auth" ON profile
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "profile_update_auth" ON profile
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "profile_delete_auth" ON profile
  FOR DELETE USING (auth.uid() IS NOT NULL);


-- ═══════════════════════════════════════════════════
-- DONE! Next steps:
-- 1. Create an admin user in Supabase Auth → Users
-- 2. Open admin.html → enter Supabase URL + anon key
-- 3. Login and click "Seed Defaults"
-- ═══════════════════════════════════════════════════
