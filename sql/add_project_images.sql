-- ═══════════════════════════════════════════════════
-- ADD IMAGES COLUMN TO PROJECTS TABLE
-- Run this in your Supabase SQL Editor
-- Stores documentation photos as JSONB array of URLs
-- ═══════════════════════════════════════════════════

-- Add images column (JSONB array of public URLs)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Add a comment for documentation
COMMENT ON COLUMN projects.images IS 'Array of public URLs for project documentation photos, stored in Supabase Storage under projects/{project_id}/';
