# Case-Study Depth (Project Detail) — Design

## Goal
Turn `app/[locale]/projects/[slug]/page.tsx` from a thin detail view into a
hiring-grade case study using only existing `Project` fields. No new tables,
columns, migrations, actions, or dependencies.

## Design

### 1. Outcome hero
- Render `metrics[]` (when non-empty) as a large-number grid directly under
  the header, above the description: big `value` + locale-picked
  `label_id`/`label_en` per item.
- Empty metrics → block omitted entirely, no placeholder, no layout gap.

### 2. Frugal gallery
- First image: eager hero visual (keep `next/image`, existing sizes).
- Remaining images: `loading="lazy"` + `next/image`, same grid.
- Alt text stays `"{name} screenshot {n}"`.

### 3. Prev/next navigation
- Below the gallery: previous/next project links ordered by `sort_order`
  (fallback `id`), labeled with project `name`, within the active locale.
- First/last items render only the side that exists (no dead links).

### 4. Closing CTA band
- End-of-article band: primary link to `/{locale}#contact`, secondary CV
  download (`/api/cv/{locale}`). Reuse existing CTA labels
  (`hero.getInTouch`, `hero.dossier`).

## Preserved
- ID-suppression pattern for `highlight`/`status` (EN-only, unchanged).
- Locale pickers for role/desc/detail/metrics labels.
- RSC data flow (`getProjectBySlug` + `getProfile` + translations); prev/next
  resolved server-side in the same component (no client state, no extra fetch).

## Validation
- `npm run typecheck` + `npm run build` pass.
- Render EN + ID: metrics grid present/absent correctly, gallery lazy below
  the fold, prev/next correct at boundaries, CTA links resolve.

## Out of scope
- New DB columns (period/client), testimonials on project pages, related
  projects, comments, admin form changes.
