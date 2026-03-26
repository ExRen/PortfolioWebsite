-- ═══════════════════════════════════════════════════
-- PORTFOLIO DATABASE — FIX RLS POLICIES
-- Run this in Supabase SQL Editor to fix 406 errors
-- ═══════════════════════════════════════════════════

-- Drop old policies (they used auth.role() which may not work in newer Supabase)
DROP POLICY IF EXISTS "projects_insert_auth" ON projects;
DROP POLICY IF EXISTS "projects_update_auth" ON projects;
DROP POLICY IF EXISTS "projects_delete_auth" ON projects;
DROP POLICY IF EXISTS "skills_insert_auth" ON skills;
DROP POLICY IF EXISTS "skills_update_auth" ON skills;
DROP POLICY IF EXISTS "skills_delete_auth" ON skills;
DROP POLICY IF EXISTS "experiences_insert_auth" ON experiences;
DROP POLICY IF EXISTS "experiences_update_auth" ON experiences;
DROP POLICY IF EXISTS "experiences_delete_auth" ON experiences;
DROP POLICY IF EXISTS "profile_insert_auth" ON profile;
DROP POLICY IF EXISTS "profile_update_auth" ON profile;
DROP POLICY IF EXISTS "profile_delete_auth" ON profile;

-- ── Recreate with auth.uid() check (more reliable) ──

-- PROJECTS
CREATE POLICY "projects_insert_auth" ON projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "projects_update_auth" ON projects
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "projects_delete_auth" ON projects
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- SKILLS
CREATE POLICY "skills_insert_auth" ON skills
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "skills_update_auth" ON skills
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "skills_delete_auth" ON skills
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- EXPERIENCES
CREATE POLICY "experiences_insert_auth" ON experiences
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "experiences_update_auth" ON experiences
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "experiences_delete_auth" ON experiences
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- PROFILE
CREATE POLICY "profile_insert_auth" ON profile
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "profile_update_auth" ON profile
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "profile_delete_auth" ON profile
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════════════
-- DONE! After running this, try saving a project again in admin.html
-- ═══════════════════════════════════════════════════
