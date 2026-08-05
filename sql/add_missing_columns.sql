-- Add metrics to projects (JSONB array)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '[]'::jsonb;

-- Add contact_github to profile (TEXT)
ALTER TABLE profile ADD COLUMN IF NOT EXISTS contact_github TEXT DEFAULT '';
