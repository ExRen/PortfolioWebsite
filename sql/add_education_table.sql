-- ═══════════════════════════════════════════════════
-- SQL MIGRATION: ADD EDUCATION TABLE
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS education (
  id BIGSERIAL PRIMARY KEY,
  sort_order INT DEFAULT 1,
  period TEXT NOT NULL,
  institution TEXT NOT NULL,
  degree_en TEXT NOT NULL,
  degree_id TEXT NOT NULL,
  gpa TEXT DEFAULT '',
  highlights_en JSONB DEFAULT '[]'::jsonb,
  highlights_id JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "education_select_public" ON education
  FOR SELECT USING (true);
CREATE POLICY "education_insert_auth" ON education
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "education_update_auth" ON education
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "education_delete_auth" ON education
  FOR DELETE USING (auth.uid() IS NOT NULL);
