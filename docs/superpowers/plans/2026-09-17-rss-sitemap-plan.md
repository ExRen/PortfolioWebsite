# RSS + Sitemap — Implementation Plan
Spec: `docs/superpowers/specs/2026-09-17-rss-sitemap-design.md`

## Steps
1. **Confirm blog visibility rule** — read `app/[locale]/blog/page.tsx`; note
   exactly which posts are listed (published_at filter? sort?). Reuse the same
   predicate for feed + sitemap.
2. **RSS route** — create `app/[locale]/blog/rss.xml/route.ts`:
   `generateStaticParams` for `en`/`id`; fetch via `getPosts()`; cap 20 newest;
   locale-pick title/excerpt; absolute URLs against the canonical base;
   XML-escape helper; `Content-Type: application/rss+xml; charset=utf-8`;
   `export const revalidate = 3600`. Never throw (empty channel fallback).
3. **Sitemap** — extend `app/sitemap.ts` with `/blog`, post slugs, project
   slugs (via `getPosts()`/`getProjects()`), per-locale alternates,
   `lastModified` per row. Delete root `sitemap.xml`.
4. **Validate** — `npm run typecheck`, `npm run build`, curl `/sitemap.xml`,
   `/en/blog/rss.xml`, `/id/blog/rss.xml`: well-formed, slugs present, locale
   strings correct, no unescaped markup.

## Boundaries
- No new tables/actions/deps. No admin changes. No `robots.txt` change.
- Delete only the dead root `sitemap.xml` (not `public/`, not `vercel.json`).
