# RSS + Sitemap — Design

## Goal
Expose per-locale RSS feeds for the blog and a complete locale-aware sitemap
(blog index, post slugs, project slugs), replacing the stale dead root
`sitemap.xml`. No new tables, actions, or dependencies.

## Context
- Live sitemap today is `app/sitemap.ts` (home EN/ID only). Root `sitemap.xml`
  is a static-era leftover: not served (only `public/` is), content stale.
- `robots.txt` already points at `/sitemap.xml` — unchanged.
- `Post` (`slug`, `title_en/id`, `excerpt_en/id`, `published_at`, `updated_at`)
  and `Project` (`slug`, `updated_at`) come from `lib/fetcher.ts` with
  `safeFetch` fallback to `lib/data.ts` defaults.

## Design

### 1. RSS feed per locale
- New route `app/[locale]/blog/rss.xml/route.ts` serving RSS 2.0,
  `Content-Type: application/rss+xml; charset=utf-8`, with route-segment
  caching (`revalidate`, hourly is plenty for dispatches).
- Items from `getPosts()`, newest first, capped at 20: `<title>` and
  `<description>` use the request locale (`_id` when locale is `id`, else
  `_en`); `<link>`/`<guid>` absolute post URL
  `https://portfolio-bima-eosin.vercel.app/{locale}/blog/{slug}`;
  `<pubDate>` from `published_at` (fallback `updated_at`).
- XML-escape all interpolated strings (`&<>"'`). Channel title/description
  bilingual per locale; `<language>` `en-us` / `id`.
- Failure mode: fetcher fallback guarantees rows; route never throws —
  empty list still renders a valid empty channel, never 500.

### 2. Complete sitemap
- Extend `app/sitemap.ts`: for each locale (`en`, `id`): `/`, `/blog`,
  `/blog/{slug}` for every post the listing shows (same visibility rule as
  the blog index — no unpublished-date filtering beyond what listing does),
  `/projects/{slug}` for every project; `lastModified` from each row's
  `updated_at` (fallback `published_at`, then now); keep `alternates.languages`
  en/id on every entry.
- Delete root `sitemap.xml` (dead, stale, confusing).

### 3. Validation
- `npm run typecheck` + `npm run build` pass.
- `curl` the three outputs (`/sitemap.xml`, `/en/blog/rss.xml`,
  `/id/blog/rss.xml`): well-formed XML, every known slug present, locale
  strings in the right feed, no raw `&`/`<` leaks.

## Out of scope
- `robots.txt` changes, per-post full-content feeds, JSON Feed, admin UI,
  analytics for feed hits.
