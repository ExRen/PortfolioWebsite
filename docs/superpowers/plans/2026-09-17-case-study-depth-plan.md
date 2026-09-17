# Case-Study Depth — Implementation Plan
Spec: `docs/superpowers/specs/2026-09-17-case-study-depth-design.md`
Single file: `app/[locale]/projects/[slug]/page.tsx` (+ reuse existing CSS
classes; add scoped styles to `app/globals.css` only if the metrics grid /
CTA band need tokens that don't exist).

## Steps
1. **Outcome hero** — replace metrics tag list with a large-number grid
   above the description; render only when `metrics.length > 0`.
2. **Frugal gallery** — first image eager (unchanged props), rest get
   `loading="lazy"`.
3. **Prev/next** — fetch project list server-side (`getProjects()` alongside
   existing `Promise.all`), pick neighbors by `sort_order` (fallback `id`),
   render locale-aware links; omit missing sides.
4. **CTA band** — contact + CV links reusing `hero.getInTouch` /
   `hero.dossier` keys; anchor `/{locale}#contact`, CV `/api/cv/{locale}`.
5. **Validate** — `npm run typecheck`, `npm run build`, render EN + ID,
   confirm lazy gallery, boundary prev/next, CTA targets.

## Boundaries
- No schema/action/admin/i18n-key changes. No new deps.
- Keep highlight/status ID-suppression and all locale pickers as-is.
