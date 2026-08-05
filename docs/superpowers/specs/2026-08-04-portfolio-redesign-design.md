# Portfolio redesign specification

**Status:** Approved design; pending user review before implementation planning.

## Product intent

Rebuild Bima Aryadinata's bilingual portfolio as a quiet-premium, hybrid-builder experience that makes hiring or contacting Bima the clearest visitor outcome. Preserve truthful existing content; replace the resume-like sequence, mixed visual systems, unsafe data boundaries, and ambiguous administrative workflows.

## Visual direction — The Quiet Workshop

The portfolio should feel like a well-made studio notebook: warm, precise, tactile, and quietly confident. It demonstrates the ability to turn ambiguous ideas into useful software, clear systems, and shipped experiences without sterile product-marketing minimalism.

- **Palette:** Ink `#202322`, Paper `#F4F1EA`, Soft stone `#DDD9D0`, Moss `#66745D`, Signal orange `#D86D3F`, Clay `#B8A99A`, and Dark field `#292D2B`. Use orange only for contact, selected, and destructive intent; moss is a supporting signature/state color.
- **Material:** subtle paper grain, thin stone borders, flat surfaces by default, soft broad shadows only for overlays/image layers. Project media reads as contact sheets, workshop boards, or field notes with occasional orange registration marks/index rules.
- **Typography:** a personality-led geometric display face such as Space Grotesk or Sora; DM Sans or Source Sans 3 for body copy; IBM Plex Mono only for technical labels. Body text is 17–18px with generous leading; metadata never below 12–13px.
- **Layout:** an ink or dark-moss compact header; a two-part hero pairing a concise position statement with a portrait/work artifact; three proof points below. Feature projects in alternating large panels, followed by a compact index. Treat skills, education, certifications, GitHub, and experience as consolidated proof rather than equal-weight chapters.
- **Motion:** a single restrained page-load reveal; short crop/lift on work panels; quick fade/position shift for filters; subtle button response; opacity-plus-small-scale dialogs. Reduced motion removes transforms, smooth scrolling, ticker movement, and layout animation.
- **Discard:** `DESIGN-apple.md`'s Apple/product-marketing framing, SF Pro/system-font dependence, black navigation as sole identity, Action Blue, tiny utility controls, unexplained top-of-page ticker, and equal-weight résumé sequencing. Do not use gradients, glassmorphism, neon, excessive rounding, generic SaaS card grids, or decorative animation.

## Scope and phases

### Phase 1 — trusted content platform

- Establish `public.admin_users` as the single authorization source for every admin action, analytics read, and storage mutation. A forward-only migration resolves `bimaaryadinata01@gmail.com` once to its immutable Auth user ID and fails closed if that user is absent or ambiguous. A shared `public.is_admin()` predicate is used by both RLS/Storage policies and server-side `requireAdmin()` via the cookie-bound Supabase client. Do not duplicate authorization in Vercel environment variables.
- Add runtime validation at every trust boundary: explicit allowed fields, lengths, IDs, URLs, localized content, sort order, and safe generic user-facing errors. TypeScript types alone are not accepted as runtime validation.
- Add a dedicated contact-message table and action. Contact submissions require validated fields, a honeypot, basic rate limiting, safe feedback, and must not be stored in analytics.
- Add a tracked SQL migration for the contact model, restrictive RLS/storage policies, and a transactional database RPC for destructive seed/resync operations. Verify the deployed `analytics_events` schema before changing related workflows.
- Centralize media validation and replacement: validate image MIME/content/size, upload a replacement before deleting a current asset, persist its reference only after storage success, and constrain deletion to the target project's storage prefix.
- Split public and administrative read semantics. Public reads use explicit columns and may render curated fallback only when Supabase actually fails; empty datasets are legitimate data. Administrative reads never fall back to defaults and must expose a safe actionable failure state.
- Combine next-intl locale routing and Supabase session refresh in root middleware.

### Phase 2 — public editorial gallery

Information order is fixed:

1. Hero
2. Selected work
3. Current focus / proof
4. Experience
5. About — skills, education, certifications, GitHub support
6. Contact

- Present one clear hybrid-builder position, a short supporting statement, a primary **Let's work together** CTA, and a correctly labeled CV PDF secondary action. Do not encode hero line breaks in admin-entered newlines.
- Keep top-level navigation to Work, Experience, About, and Contact. Make Contact the persistent primary action. Language/theme controls remain accessible utilities.
- Treat work as case studies: problem, contribution, outcome, tools, and destination. Feature the strongest two or three projects as large visual stories; show remaining projects in a compact accessible archive.
- Use The Quiet Workshop's dark-ink header, warm paper canvas, dark-field media tiles, generous rhythm, thin stone borders, moss identity detail, and Signal Orange only for important actions/selected state. Avoid decorative gradients and public chrome shadows.
- Establish public interaction rules: skip link; high-contrast `:focus-visible`; keyboard-operable filters with state/result announcements; semantic links or buttons for work; dialogs with labelled controls, Escape close, focus trapping, and focus return; reduced motion including no smooth scrolling under reduced-motion preference.
- Translate every public visible and accessible UI string for English and Indonesian. Use explicit language names in language controls and test both locales at mobile width and 200% zoom.
- Add locale-specific metadata, canonical URLs, language alternates, sitemap, robots, truthful Person JSON-LD with safely escaped serialization, and locale-aware Open Graph data. Keep admin routes outside public discovery.
- Keep RSC rendering and parallel public fetches. Limit client components to genuine interactions; use responsive `next/image` assets with stable dimensions and only preload the actual LCP image.

### Phase 3 — admin workspace

- Design the admin as a quiet, dense warm-paper application rather than an extension of the public gallery. It uses an ink navigation surface, moss active/saved states, orange primary/destructive intent, and independent surface/elevation rules.
- Make content areas URL-addressable (routes or search parameters) for direct links, refresh persistence, and browser history.
- Use mobile-safe navigation, accessible editor/confirmation dialogs, labeled form fields, visible focus, live save/error status, and unsaved-change protection where edits can be lost.
- Give routine actions clear status: Saving, Saved, Failed. Return only safe actionable messages to the client.
- Move seed/resync/export/import under a separated **Data tools** area. Destructive changes require contextual confirmation; use a typed confirmation for replacement operations.
- Rename any non-writing import control to Preview import until a complete validated, diff-previewed, explicit-commit import exists.

### Phase 4 — release evidence

- Confirm type correctness and production build success.
- Exercise admin authorization and RLS boundaries as anonymous, ordinary authenticated, and authorized admin users.
- Verify validated CRUD, safe upload/replacement/deletion, contact submission/abuse rejection, transactional resync failure behavior, and administrative data-error states.
- Inspect desktop and mobile public/admin experience in both locales, light/dark modes where supported, 200% zoom, keyboard-only navigation, dialogs, filters, reduced motion, and form status announcements.
- Review generated metadata, canonical/hreflang values, sitemap/robots, JSON-LD safety, responsive image dimensions, and client-boundary/bundle impact.

## Architecture boundaries

| Boundary | Responsibility | Contract |
| --- | --- | --- |
| Public repositories | Explicit read projections and availability fallback | Curated fallback on actual query failure only; no admin use |
| Admin repositories/actions | Authenticated and authorized validated writes | `requireAdmin`, validated input, explicit invalidation, safe errors |
| Media service | Image validation and storage lifecycle | Targeted prefixes; storage/database operations checked before success |
| Contact service | Visitor message intake | Dedicated persistence, validation, abuse controls, no analytics reuse |
| Locale/session middleware | Locale routing and auth cookie refresh | Both behaviors compose without static-asset interference |
| Public gallery | Portfolio persuasion and conversion | RSC-first, bilingual, accessible, content-first presentation |
| Admin workspace | Content operation | URL-addressable, responsive, explicit data-tool risk states |

## Error and resilience policy

- Public visitors receive concise safe status messaging; curated portfolio fallback is available only for an actual data-read failure and must be observable server-side.
- An intentionally empty table remains empty; it is not replaced with default seed data.
- Admin surfaces never pretend fallback content is live. They identify non-sensitive persistence failures and prevent unsafe follow-up mutations.
- Technical provider/database error detail remains server-side. Actions return stable user-safe errors.
- Security, input validation, accessibility basics, and data-loss prevention are mandatory—not optional simplifications.

## Migration and compatibility constraints

- Preserve existing public content, the `/en` and `/id` route contract, Next.js App Router deployment, and the Supabase public-read requirement.
- Do not expose a service-role credential to the browser.
- `admin_users` is database-owned, RLS-protected, and inaccessible through the Data API. Future administrator changes are database allowlist operations; they do not require a Vercel redeploy. The bootstrap email selects the initial principal, while authorization remains bound to that principal's UUID.
- Preserve section identification conventions where retained, while the ordered public composition follows this specification.
- The present working tree includes uncommitted Next.js migration work and legacy static files. No implementation step may reset, overwrite, broadly reformat, or delete unrelated user changes. Retire legacy assets only after the replacement is validated as canonical.

## Verification claims

1. Only explicitly authorized administrators in `admin_users` can read administrative analytics or mutate data/storage, regardless of direct server-action invocation.
2. Untrusted content, contact, and media input is rejected before persistent side effects.
3. Failed image replacement or resync cannot silently remove or corrupt the published portfolio.
4. A visitor can understand Bima's hybrid-builder value and begin contact without traversing résumé-first content.
5. Core visitor and admin interactions remain usable with keyboard navigation, assistive technology semantics, reduced motion, English/Indonesian copy, and narrow screens.
6. SEO metadata represents the correct locale and URL while public performance retains RSC-first, stable-image rendering.

## Explicitly deferred

- A full analytics product redesign beyond securing the existing telemetry boundary.
- User-provided assets or claims not already supported by the verified portfolio content.
- A real JSON import write path; preview-only remains correctly labelled until its own validated design is approved.
