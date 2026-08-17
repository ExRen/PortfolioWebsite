# AGENTS.md

## What this repo is
Personal portfolio for **Bima Aryadinata** (https://portfolio-bima-eosin.vercel.app/), migrated from vanilla HTML/CSS/JS to **Next.js 15 (App Router, RSC, server actions)** with TypeScript, Tailwind v4, next-intl, and Supabase.

## Stack
- **Next.js 15** App Router · RSC by default · server actions for admin writes
- **TypeScript** strict mode
- **Tailwind v4** (CSS-first `@theme` in `app/globals.css`; `next.config.ts` wires it via `@tailwindcss/postcss`)
- **next-intl** for EN/ID, locale-prefixed routes `/en` and `/id`
- **Supabase** for auth, database, and storage — accessed via `@supabase/supabase-js` + `@supabase/ssr`
- **framer-motion** for entrance + filter animations
- Deployed to **Vercel** as a standard Next.js project

## Layout
```
app/
  layout.tsx                   # Pass-through root (Next.js requires it)
  page.tsx                     # Redirects / to /en
  not-found.tsx
  globals.css                  # Tailwind v4 + @theme tokens + legacy class names
  [locale]/
    layout.tsx                 # <html>, providers, JSON-LD
    page.tsx                   # Public site (RSC, parallel fetches)
    blog/
      page.tsx                 # Blog listing (locale-aware, markdown excerpt)
      [slug]/page.tsx          # Post detail — react-markdown rendering
    projects/
      [slug]/page.tsx          # Project detail page (from projects.slug)
    admin/
      page.tsx                 # Auth-gated admin shell
      _actions/                # Server actions: auth, crud, seed, analytics
      _components/             # 'use client' admin UI + tab panels
  actions/
    contact.ts                 # Public contact-form server action
  api/
    cv/[lang]/route.ts         # CV download: records cv_download event → 302 redirect
components/
  sections/                    # RSC sections of the public site
  nav/                         # nav, mobile menu, nav-highlight
  theme-provider.tsx
  nav-progress.tsx
  scroll-top.tsx
  counter.tsx
lib/
  supabase/
    server.ts                  # createServerClient (cookies) — RSC + actions
    client.ts                  # createBrowserClient — admin client UI
    middleware.ts              # Session-refresh helper (currently unused)
  data.ts                      # DEFAULT_* typed constants + seed source
  fetcher.ts                   # getProjects / getSkills / etc. — Supabase → fallback
  i18n.ts                      # next-intl config
  types.ts                     # TypeScript types for all DB rows
messages/
  en.json                      # UI labels (root namespace)
  id.json
middleware.ts                  # next-intl locale routing
public/                        # og-image.png
sql/                           # Supabase migrations (unchanged)
DESIGN-apple.md                # Design reference — read before changing layout
vercel.json                    # Security headers (kept as-is)
```

## Run / dev / build
```bash
npm install            # first time only
npm run dev            # http://localhost:3000 → redirects to /en
npm run build          # production build (also runs type-check)
npm run start          # serve production build
npm run typecheck      # tsc --noEmit
npm run lint           # next lint
```
`.env.local` is committed in this repo (Supabase URL + anon key, both safe to expose). For a fresh deploy, set them in Vercel → Project → Environment Variables (and remove `.env.local` from the repo first if you want secrets out of git history).

## Backend (Supabase)
- URL + anon key are in `lib/supabase/server.ts` and `lib/supabase/client.ts` via `process.env.NEXT_PUBLIC_SUPABASE_*`.
- Tables: `projects`, `skills`, `experiences`, `education`, `currently_building`, `posts`, `profile` (single row, `id=1`), `analytics_events`. All RLS: public SELECT, `auth.uid() IS NOT NULL` for INSERT/UPDATE/DELETE. Exception: `analytics_events` also has a public INSERT policy (for `cv_download` events from anonymous visitors; the SELECT stays admin-only).
- Storage bucket: `portfolio-assets` (`photos/`, `projects/<id>/`, and `cv/<lang>/` for CV uploads).
- `lib/fetcher.ts` falls back to `lib/data.ts` defaults on any Supabase error, so the public site always renders.

## SQL migrations
Run in order in the Supabase SQL editor (unchanged from the pre-migration setup):
1. `sql/migration.sql`
2. `sql/add_education_table.sql`
3. `sql/add_admin_fields.sql`
4. `sql/add_new_columns.sql`
5. `sql/add_education_location.sql`
6. `sql/add_profile_certifications.sql`
7. `sql/fix_rls_policies.sql` — replaces broken `auth.role()`-based RLS with `auth.uid()`. **Run this once.**
8. `sql/storage_policies.sql` — bucket RLS. Create the bucket in Dashboard → Storage first.
9. `sql/add_features_v2.sql` — Features v2: profile `cv_url_*` columns, `projects.slug` (+ unique backfill), `currently_building` + `posts` tables, guarded post seeds, public INSERT policy on `analytics_events` (anonymous `cv_download` events). **Run once.** (Do NOT re-run `seed_portfolio_defaults` RPC after this — it clobbers user data and predates the new tables.)

## Bilingual content
- UI labels live in `messages/en.json` and `messages/id.json` (single root namespace).
- Data fields (projects, experiences, etc.) have paired `_en` / `_id` keys selected by `getLocale()`.
- `next-intl` middleware prefixes URLs. `app/page.tsx` redirects `/` to `/en`.
- Language switch is a `next/link` between `/en` and `/id` (in `components/nav/site-nav-client.tsx`).
- Theme + language preferences persist in `localStorage` under `pf-theme` and `pf-lang`. A per-session analytics id lives in `sessionStorage` under `pf-session-id`.

## Admin panel
- `app/[locale]/admin/page.tsx` is a server component that reads the Supabase session cookie. If not signed in, renders `<LoginForm />`; otherwise renders `<AdminDashboard />`.
- All writes go through server actions in `app/[locale]/admin/_actions/` — each calls `requireAuth()` first and throws if the user is not authenticated.
- "Seed" and "Resync" buttons in the admin header write `lib/data.ts` defaults into Supabase.
- The login form calls a server action (`auth.ts`) and `router.refresh()`es the page on success.

## Things that will silently break
- Reordering the `<script>` tags in `app/[locale]/layout.tsx` — providers depend on each other.
- Renaming Supabase tables/columns — every `from("…")` and `select("*")` is a string. Grep before refactoring.
- Removing the `safeFetch` fallback in `lib/fetcher.ts` — the public site will break if Supabase is unreachable.
- Running `output: 'export'` in `next.config.ts` — server actions (admin) and the cookie-based auth stop working. Not reversible without removing the admin.
- The `core.autocrlf` setting on this Windows repo is `true`. Files checked in from a non-Windows machine will look like mixed line endings. Don't reformat the whole repo to LF in a single commit.

## Conventions worth preserving
- Sections are identified by numeric prefixes in headers (`00 —`, `01 —`, …) and the order in `app/[locale]/page.tsx` is authoritative for the section order.
- Sort order fields (`sort_order`) on every list table; the UI sorts ascending.
- Hero photo upload via admin goes to `portfolio-assets/photos/`, and `uploadPhoto` deletes prior files in that folder before uploading.
- Project documentation images go to `portfolio-assets/projects/<projectId>/` and are referenced by public URL.
- The Tailwind v4 theme tokens in `app/globals.css` mirror the original CSS variables; legacy class names (`.pc`, `.edu-card`, `.timeline-content`, etc.) are preserved in `@layer components` for 1:1 visual fidelity. New code can use Tailwind utilities directly.

## Stale docs in the repo
- `DESIGN-apple.md` is the real design reference. Read it before changing layout/colors.

## Deploy
- Vercel auto-detects Next.js. The `vercel.json` only adds security response headers (kept verbatim from the old static-site config).
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel project's environment variables before the first deploy, or the site will fail to fetch.
- Pushes to `main` redeploy automatically.
