# RSS Discovery Links — Design

## Goal
Make the live per-locale RSS feeds discoverable: one link on the blog index,
one in the footer. No new tables, columns, actions, or dependencies.

## Design

### 1. Blog index link
- File: `app/[locale]/blog/page.tsx`, next to the subtitle (`blog.subtitle`).
- Anchor to `/{locale}/blog/rss.xml`, `target="_blank"`, `rel="noopener"`,
  inline RSS SVG icon (same stroke style as existing icons) + short `RSS`
  label + screen-reader text from new i18n key `blog.rssFeed`
  (EN "RSS feed", ID "Umpan RSS").

### 2. Footer link
- File: `components/sections/footer.tsx`, beside the Admin link.
- Icon-only anchor to `/{locale}/blog/rss.xml` (footer already receives
  `locale`), `aria-label` from `blog.rssFeed`.

## Preserved
- Existing i18n key parity (both keys added to `en.json` + `id.json`).
- No layout shift: links reuse current flex rows and label sizes.

## Validation
- `npm run typecheck` + `npm run build` pass.
- Both locale blog pages render the link; both hrefs return HTTP 200 with
  `application/rss+xml`.

## Out of scope
- `<link rel="alternate">` feed autodiscovery in `<head>` (follow-up if wanted),
  feed styling (XSL), analytics on feed hits.
