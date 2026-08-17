-- ═══════════════════════════════════════════════════
-- SQL MIGRATION: FEATURES V2 (CV, BLOG, BUILDING, SLUGS)
-- Run this in your Supabase SQL Editor (after all previous migrations)
-- ═══════════════════════════════════════════════════

-- Guard: this migration expects the base tables from migrations 1-8
-- (migration.sql → storage_policies.sql). A fresh project must run those first.
DO $$
BEGIN
  IF to_regclass('public.profile') IS NULL
     OR to_regclass('public.projects') IS NULL
     OR to_regclass('public.analytics_events') IS NULL THEN
    RAISE EXCEPTION 'Base tables missing. Run sql/migration.sql through sql/storage_policies.sql in order FIRST, then re-run this file.';
  END IF;
END $$;

-- 1. PROFILE: CV RESUME FILES (one per locale)
ALTER TABLE profile ADD COLUMN IF NOT EXISTS cv_url_en TEXT DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS cv_url_id TEXT DEFAULT '';

-- 2. PROJECTS: SEO SLUG (backfill existing rows, id suffix prevents collisions)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE OR REPLACE FUNCTION public.slugify(text) RETURNS text
  LANGUAGE sql IMMUTABLE AS $$
  SELECT regexp_replace(
           regexp_replace(
             btrim(regexp_replace(lower($1), '[^a-z0-9]+', '-', 'g'), '-'),
             '-{2,}', '-', 'g'),
           '^-+|-+$', '')
$$;

UPDATE projects
SET slug = public.slugify(name) || '-' || id
WHERE slug IS NULL OR slug = '';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_slug_key') THEN
    ALTER TABLE projects ADD CONSTRAINT projects_slug_key UNIQUE (slug);
  END IF;
END $$;


-- 3. CURRENTLY BUILDING (dynamic section data)
CREATE TABLE IF NOT EXISTS currently_building (
  id BIGSERIAL PRIMARY KEY,
  sort_order INT DEFAULT 1,
  name_en TEXT NOT NULL DEFAULT '',
  name_id TEXT NOT NULL DEFAULT '',
  description_en TEXT DEFAULT '',
  description_id TEXT DEFAULT '',
  status_en TEXT DEFAULT '',
  status_id TEXT DEFAULT '',
  stack JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE currently_building ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "currently_building_select_public" ON currently_building;
CREATE POLICY "currently_building_select_public" ON currently_building
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "currently_building_insert_auth" ON currently_building;
CREATE POLICY "currently_building_insert_auth" ON currently_building
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "currently_building_update_auth" ON currently_building;
CREATE POLICY "currently_building_update_auth" ON currently_building
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "currently_building_delete_auth" ON currently_building;
CREATE POLICY "currently_building_delete_auth" ON currently_building
  FOR DELETE USING (auth.uid() IS NOT NULL);


-- 4. BLOG POSTS
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL DEFAULT '',
  title_id TEXT NOT NULL DEFAULT '',
  excerpt_en TEXT DEFAULT '',
  excerpt_id TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  content_id TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_public" ON posts;
CREATE POLICY "posts_select_public" ON posts
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "posts_insert_auth" ON posts;
CREATE POLICY "posts_insert_auth" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "posts_update_auth" ON posts;
CREATE POLICY "posts_update_auth" ON posts
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "posts_delete_auth" ON posts;
CREATE POLICY "posts_delete_auth" ON posts
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Guarded seed posts (only when the table is empty → resync-safe)
INSERT INTO posts (slug, title_en, title_id, excerpt_en, excerpt_id, content_en, content_id, published_at)
SELECT * FROM (VALUES
  (
    'migrating-to-nextjs',
    'Why I Migrated My Portfolio to Next.js 15',
    'Kenapa Saya Migrasi Portofolio ke Next.js 15',
    'From vanilla HTML/CSS/JS to App Router, RSC, server actions, and i18n. A concise writeup of the migration and what changed.',
    'Dari vanilla HTML/CSS/JS ke App Router, RSC, server actions, dan i18n. Ringkasan migrasi dan apa saja yang berubah.',
    $$## The old site

My portfolio started as a single-page vanilla site: one big `index.html`, a CSS file full of custom properties, and a handful of inline scripts. It worked, but every change was a full-file edit and translations lived in the markup.

## The move to Next.js

The rewrite went to **Next.js 15** with the App Router:

- Server components for every section (hero, projects, experience)
- Server actions for admin CRUD
- `next-intl` for EN/ID routes
- Tailwind v4 with the old CSS variables preserved as theme tokens

## What improved

1. **Typed data** — all Supabase rows are TypeScript-first
2. **Admin panel** — auth-gated writes via server actions
3. **i18n** — locale-prefixed routes done once, language toggles for free
4. **Fallbacks** — a `safeFetch` wrapper keeps the site rendering even if Supabase is unreachable

## Takeaways

Migrating felt slow for a week and fast after that. Most time went into types and the data layer — the UI itself moved over almost unchanged.$$,
    $$## Situs lama

Portofolio saya dimulai sebagai satu halaman vanilla: satu file `index.html` besar, CSS penuh custom properties, dan beberapa script inline. Fungsional, tapi setiap perubahan berarti mengedit seluruh file.

## Pindah ke Next.js

Migrasi mengarah ke **Next.js 15** dengan App Router:

- Server components untuk setiap section
- Server actions untuk penulisan admin
- `next-intl` untuk rute EN/ID
- Tailwind v4 dengan variabel CSS lama dipertahankan sebagai theme tokens

## Hasilnya

Semua section jadi typed, panel admin terpisah aman, dan bilingual tanpa duplikasi. Fallback `safeFetch` menjaga situs tetap tampil walau Supabase bermasalah.

## Kesimpulan

Migrasi terasa lambat di minggu pertama, menyenangkan setelahnya. Waktu terbesar dihabiskan pada lapisan data dan tipe — komponen UI hampir tidak berubah.$$,
    '2026-08-01T00:00:00Z'::timestamptz
  ),
  (
    'scraping-instagram-responsibly',
    'Scraping Instagram Without Getting Blocked',
    'Scraping Instagram Tanpa Kena Block',
    'Reduce login restrictions and bot detection with the right combo of tools, rate limits, and clean session handling.',
    'Kurangi hambatan login dan deteksi bot dengan kombinasi tools, rate limit, dan penanganan sesi yang bersih.',
    $$# The problem

Collecting public data from Instagram hits two walls: login walls and bot detection.

## The stack that works

My internal tool pairs `instagrapi` with a few tricks:

- **Fresh sessions** — regenerate the session file, never reuse stale ones
- **Rate limits** — a sleep between requests tuned per endpoint
- **Streamlit frontend** — a thin UI on top so teammates can trigger scrapes without touching code

## Practical rules

1. Respect the rate limits you set
2. Cache aggressively — never re-fetch what you already stored
3. Log failures distinctly from blocked
4. Keep daily volume deliberately low

## Closing

Treat scraping as engineering at scale: the value is in a scraper that stays alive, not in throughput.$$,
    $$## The problem

Mengumpulkan data publik dari Instagram menghadapi dua tembok: halaman login dan deteksi bot.

## Stack yang dipakai

Tool internal ini memadukan `instagrapi` dengan beberapa trik:

- **Fresh sessions** — regenerasi file sesi, jangan pakai sesi basi
- **Rate limit** — jeda antar request yang disesuaikan
- **Frontend Streamlit** — lapisan tipis supaya tim bisa menjalankannya tanpa menyentuh kode

## Aturan praktis

1. Hormati rate limit yang kamu buat sendiri
2. Cache sesi, jangan tarik ulang data yang sudah ada
3. Bedakan error karena block vs error teknis
4. Batasi volume harian

## Penutup

Perlakukan scraping sebagai engineering berskala: nilai ada di scraper yang tetap hidup, bukan di throughput.$$,
    '2026-07-15T00:00:00Z'::timestamptz
  )
) AS v(slug, title_en, title_id, excerpt_en, excerpt_id, content_en, content_id, published_at)
WHERE NOT EXISTS (SELECT 1 FROM posts);


-- 5. ANALYTICS: ALLOW PUBLIC EVENT INSERT (cv_download from visitors)
-- The panel read stays admin-only; this opens writes so the CV download
-- route handler can record anonymous events. event_value/session_id are free fields.
DROP POLICY IF EXISTS "analytics_events_insert_public" ON analytics_events;
CREATE POLICY "analytics_events_insert_public" ON analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);