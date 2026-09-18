# RSS Discovery Links — Implementation Plan
Spec: `docs/superpowers/specs/2026-09-17-rss-discovery-design.md`

## Steps
1. **i18n keys** — add `blog.rssFeed` ("RSS feed" / "Umpan RSS") to
   `messages/en.json` + `messages/id.json` (parity).
2. **Blog index** — `app/[locale]/blog/page.tsx`: anchor + inline RSS SVG
   beside the subtitle, href `/{locale}/blog/rss.xml`, new tab.
3. **Footer** — `components/sections/footer.tsx`: icon-only anchor beside
   Admin link, `aria-label` from the new key.
4. **Validate** — `npm run typecheck`, `npm run build`, serve + curl both
   hrefs (200, rss+xml), sight-check placement EN + ID.

## Boundaries
- No schema/action/admin changes. No new deps. No `<head>` autodiscovery.
