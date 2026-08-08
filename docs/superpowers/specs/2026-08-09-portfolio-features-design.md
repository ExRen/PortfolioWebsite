# Design: Portfolio Features Batch 2 — CV, Currently Building, Blog, Project Details

**Date:** 2026-08-09
**Status:** Approved design
**Stack context:** Next.js 16.3.0 (App Router, RSC, server actions), TypeScript strict, Tailwind v4 (CSS-first `@theme` + legacy classes), next-intl EN/ID, Supabase (tables + RLS public SELECT / auth writes, storage bucket `portfolio-assets`).

## Goal

Four features that serve three stated goals: credibility for job applications, looking active/consistent, and organic/SEO reach.

1. CV download that works end-to-end and is manageable from the admin panel (replaces hardcoded Google Drive link; makes the already-present `cv_download` analytics metric real).
2. "Currently Building" section becomes dynamic (Supabase table + admin CRUD) instead of hardcoded defaults.
3. Blog with dedicated pages (`/blog`, `/blog/[slug]`), markdown content stored in Supabase, admin-managed.
4. Public project detail pages (`/projects/[slug]`) for SEO, reusing existing project detail fields.

Testimonials were explicitly removed from scope (user decision: invalid/biased).

## Feature 1 — CV module

### Storage & schema
- New columns on `profile` (single-row table, existing pattern): `cv_url_en TEXT DEFAULT ''`, `cv_url_id TEXT DEFAULT ''`.
- PDFs stored in existing bucket `portfolio-assets` under `cv/cv-en-<timestamp>.pdf` / `cv/cv-id-<timestamp>.pdf`. `upsert: true`, small size guard (PDF, ≤ 5MB) reusing the existing `validateImage`-style helper as `validatePdf`.

### Admin (upload)
- New server action `uploadCv(formData)` in `app/[locale]/admin/_actions/crud.ts` (same file as `uploadPhoto`, same pattern: `requireAuth` → upload → persist URL into `profile` row) plus `clearCv(lang)` to remove.
- `profile-panel.tsx` gains a "CV" block: two upload fields (EN / ID) showing current URL with Upload / Remove buttons, following existing panel styling.

### Download (analytics-aware)
- New route handler `app/api/cv/[lang]/route.ts` (`en` | `id` only; anything else → 404):
  1. Reads `profile.cv_url_<lang>`; if empty, falls back to the other language's URL; if both empty → 404.
  2. Fires the `cv_download` analytics event (same server-action/insert pattern already used by the public client tracker — analysis panel already counts `cv_download`, but no code ever emits it today; this fixes that).
  3. Returns `307` redirect to the storage URL (browser saves the file directly from Supabase CDN).
- `hero.tsx`: the secondary CTA (`hero.downloadCv`) href changes from the hardcoded Google Drive link to `/api/cv/<current-locale>`.

## Feature 2 — Currently Building (dynamic)

- Schema: new table `currently_building`:
  `id BIGSERIAL, sort_order INT DEFAULT 1, name_en TEXT, name_id TEXT, description_en TEXT, description_id TEXT, status_en TEXT, status_id TEXT, stack TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ`
- RLS: 4 policies copied from `experiences` (SELECT true; INSERT/UPDATE/DELETE `auth.uid() IS NOT NULL`).
- `lib/fetcher.ts`: `getCurrentlyBuilding()` reads the table ordered by `sort_order`, fallback to `DEFAULT_CURRENT_BUILDING` on error/empty.
- Admin: new "building" tab — grid of cards with edit/delete + add form (same panel pattern as `experience-panel.tsx`).
- Public UI: unchanged (`currently-building.tssx` renders from array).

## Feature 3 — Blog (markdown, separate routes)

- Schema table `posts`: `id BIGSERIAL, slug TEXT UNIQUE NOT NULL, title_en, title_id, excerpt_en, excerpt_id, content_en, content_id TEXT (markdown), cover_url TEXT DEFAULT '', published_at TIMESTAMPTZ, sort_order INT, created_at` + same RLS pattern.
- Pages:
  - `app/[locale]/blog/page.tsx`: list of posts (locale fields; slug, excerpt, date), `generateStaticParams` per locale, `generateMetadata` title/description.
  - `app/[locale]/blog/[slug]/page.tsx`: full post; `generateStaticParams` from `getPosts()`; `notFound()` for unknown slugs; metadata per locale.
- Unmatched `/blog/*` under blog list and per-post 404s.
- Markdown rendering: new dependency `react-markdown` (no plugins — no GFM table extension, no syntax highlighting; content written in plain CommonMark subset). Rendering happens in the server component; styling via a small `.md-body` block in `app/globals.css` `@layer components` following existing CSS-class conventions (headings, paragraphs, lists, inline code, links). No client hydration needed.
- Messages: add `nav.blog` ("Blog" / "Blog") in EN/ID; homepage "Latest" section header near projects area (`section.latest`), list latest 2 posts linking through.
- Admin: new "Blog" tab — table of posts with create/edit/delete forms (slug auto-generated from `title_en` on create, editable after), straightforward textarea-based editors (no preview).
- Seeds: two sample posts EN/ID in `lib/data.ts` (`DEFAULT_POSTS`) used as fallback. **The existing `seed_portfolio_defaults` RPC is NOT modified** (it would clobber user data); instead the migration file itself contains guarded inserts for the sample posts (`INSERT ... WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = ...)`). `currently_building` needs no seed: fetcher falls back to `DEFAULT_CURRENT_BUILDING` while the table is empty.

## Feature 4 — Public project detail pages

- DB: `projects.slug TEXT` column; populated for existing rows during migration (lowercase, strip non-alphanumerics, collapse dashes, dedupe by appending `-2` on collision) — those slugs persist in DB, not recomputed at render (render keeps display data).
- Route `app/[locale]/projects/[slug]/page.tsx` + `generateStaticParams` from `getProjects()`; `generateMetadata` from name/desc; `notFound()` for unknown.
- Page displays: `role`, `status`, `highlight` (existing), `desc_en/_id` + `detail_en/_id` (existing long text), `tags`, `metrics[]`, `github_url`/`live_url` links, `images[]` gallery (existing data).
- `components/sections/projects-client.tsx`: project card footer gains a "View details →" link to `/projects/<slug>`; existing modal stays as the in-page fast experience.

## Data plumbing + shared changes

- `lib/types.ts`: add `Post` interface, `cv_url_en/cv_url_id` optional on `Profile`, `slug` optional on `Project`, keep `BuildingItem` as `CurrentlyBuilding`.
- `lib/fetcher.ts`: add `getPosts()`, `getCurrentlyBuilding()`; extend nothing else.
- `messages/en.json` + `id.json`: add `blog` nav label, `latest` section label.
- `sql/add_blog_cv_building.sql`: migration listed below.
- `sql/seed_default_posts.sql` (or same file): sample posts data as fallback inset, idempotent (`WHERE NOT EXISTS` by slug).

## Migration SQL summary (`sql/add_blog_cv_building.sql`)

```sql
ALTER TABLE profile ADD COLUMN IF NOT EXISTS cv_url_en TEXT DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS cv_url_id TEXT DEFAULT '';

ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT;
UPDATE projects SET slug = <slugify(name)> WHERE slug IS NULL OR slug = '';  -- with unique suffix loop

CREATE TABLE IF NOT EXISTS currently_building (...);
CREATE TABLE IF NOT EXISTS posts (..., slug UNIQUE ...);
-- RLS policies for both (copied from experiences)
```

No image storage changes; small PDFs + optional cover images reuse the existing bucket.

## Dependencies

- Add `react-markdown` (only new dependency; the blog is the only markdown surface).

## Open items / deferred

- Blog RSS feed (`/feed.xml`) deferred (user picked option A without feed).
- Testimonials removed by user choice.
- No syntax highlighting / GFM in posts (YAGNI; add remark-gfm only if needed).