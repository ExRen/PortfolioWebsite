# Session Notes — 2026-06-15

## What this session did
Migrated the repo from vanilla HTML/CSS/JS → **Next.js 15 (App Router, RSC, server actions)** with TypeScript, Tailwind v4, next-intl, framer-motion, and `@supabase/ssr`. Single big-bang migration, no preview branch.

## Final state
- Build passes (`npm run build`) — all 4 routes prerender as static HTML.
- Typecheck clean (`npm run typecheck`).
- Public site at `/en` and `/id`, admin at `/en/admin` and `/id/admin`.
- All Supabase tables + storage bucket + RLS still intact; SQL migrations in `sql/` are unchanged.
- `.env.local` is committed (URL + anon key only, both safe to expose). The user should set the same two vars in Vercel → Project → Environment Variables before deploying.

## Key files for the next session
- `app/[locale]/page.tsx` — public site root (RSC, parallel fetches).
- `app/[locale]/admin/page.tsx` — auth-gated admin shell.
- `lib/fetcher.ts` — Supabase → `lib/data.ts` fallback pattern (don't remove the fallback).
- `lib/data.ts` — typed defaults + the source the admin "Seed" / "Resync" buttons use.
- `app/globals.css` — Tailwind v4 `@theme` tokens + legacy class names in `@layer components`. Add new utility classes here.
- `app/[locale]/admin/_actions/crud.ts` — all write paths. Each calls `requireAuth()` first.
- `AGENTS.md` — already updated for the new stack. Read it before refactoring.

## Known limitations / follow-ups
- **Project modal gallery is rendered but the `images` field is empty** in all defaults. Uploads work via admin (saves to `portfolio-assets/projects/<id>/`), but no project has images populated yet.
- **GitHub section** uses external image services (`github-readme-stats.vercel.app`, `streak-stats.demolab.com`). If those go down, the cards break.
- **Counter animation in stats bar** fires on first intersection only; the `data-count` attribute is gone (the component tracks visibility internally).
- **The legacy `js/data.js` and `js/app.js` are deleted.** Anything that referenced them is gone. If you find any old code paths, they should be migrated to the new `lib/data.ts` / component structure.
- **No tests.** Verification is `npm run dev` + click-through.

## What I did NOT do
- I did not push to git, deploy, or set Vercel env vars. The user has to do those manually.
- I did not write Playwright/E2E tests (skipped per "no test runner" decision in the original plan).
- I did not delete the `.antigravitycli/` directory in the repo root (appears empty but I left it alone).

## Decisions made during the session
- **Big-bang migration** (no preview branch).
- **Tailwind v4** with `@theme` tokens + legacy class names preserved in `@layer components` for 1:1 visual fidelity (not a full visual rewrite).
- **Admin auth via `@supabase/ssr` cookie + RLS** (same security model as the old admin, just routed through server actions instead of direct browser calls).
- **Static export rejected** (admin needs server actions).
- **Stale `PORTFOLIO_*.md` AI prompt files deleted** — they assumed a Next.js + Tailwind stack but contained wrong/stale advice.
- **Ticker items + categories** stay in `lib/data.ts` (small enough to inline, no need for a table).

## Open questions for the user
- Does the user want Playwright tests added later? (Not in this session.)
- Does the user want a CI workflow? (Not in this session — no lint/test commands were added to a runner.)
- Does the user want me to add a database seed for the Supabase project on first deploy? (Right now it requires running the SQL migrations and clicking Seed in admin manually.)

## Portfolio Redesign (Completed Aug 2026)
- **Phase 1-4 Complete**: Full Next.js App Router migration with Server Actions. Legacy static HTML/CSS/JS deleted.
- **Design System**: Implemented "Quiet Workshop" visual direction (warm paper, ink, moss, orange).
- **Admin Workspace**: Completed robust admin UI with typed destructive confirmations (Resync, Delete), empty states for all panels, loading indicators, and dirty-state protection (unsaved changes).
- **CSS Architecture**: Standardized Z-index scaling (--z-overlay, --z-modal, --z-toast) and refined generic box-shadows to tinted, ambient elevations. Fixed global dark mode viewport issues.
- **Copywriting**: Updated messages/en.json, messages/id.json, and lib/data.ts to feature benefit-led project descriptions and stronger conversion CTAs ("See My Work", "Start a Conversation").
- **Motion**: Integrated Framer Motion for buttery smooth scroll-triggered entrances and hover states on project cards without CSS transition conflicts.
