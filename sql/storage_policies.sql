-- ═══════════════════════════════════════════════════
-- Storage Policies for portfolio-assets bucket
-- Run AFTER creating bucket in Dashboard → Storage
-- ═══════════════════════════════════════════════════

-- Drop existing policies if any (safe to re-run)
DROP POLICY IF EXISTS "Public read portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth update portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete portfolio-assets" ON storage.objects;

-- Allow public read
CREATE POLICY "Public read portfolio-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-assets');

-- Allow authenticated upload
CREATE POLICY "Auth upload portfolio-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets');

-- Allow authenticated update
CREATE POLICY "Auth update portfolio-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-assets');

-- Allow authenticated delete
CREATE POLICY "Auth delete portfolio-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-assets');
