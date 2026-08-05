# Portfolio redesign implementation plan

**Design:** `docs/superpowers/specs/2026-08-04-portfolio-redesign-design.md`  
**Constraint:** Preserve existing dirty working-tree changes. Do not reset, broadly reformat, or remove legacy files until the Next.js replacement is verified.

## Phase 1 — Trusted content platform

**Owners:** `@fixer` (server/data implementation), `@librarian` only if a version-specific Supabase behavior is unclear.  
**Review gate:** `@oracle` — authorization and data-integrity boundary.

1. Inspect the live-equivalent schema/migrations and add one forward-only SQL migration.
   - Create `admin_users`, bootstrap the initial Auth account by email inside a fail-closed transaction, and expose hardened `is_admin()`.
   - Replace all content and Storage broad authenticated-write policies with `is_admin()` policies.
   - Create dedicated `contact_messages` with an anonymous-insert policy limited to its intended fields; inventory `analytics_events` policies before altering them.
   - Create an atomic seed/resync RPC that applies the known default data only after the full transaction can succeed.
2. Add a server-only authorization/data-boundary module.
   - Implement `requireAdmin()` with the cookie-bound Supabase client and `rpc("is_admin")`.
   - Implement compact runtime validators/allowlists for content, IDs/URLs/sort order, contact input, and image payloads; do not add a schema dependency unless existing dependencies cannot express the required boundary.
3. Rework server actions.
   - Use `requireAdmin()` for CRUD, analytics, seed/resync, upload, deletion, and admin-page reads.
   - Return generic client-safe failures; log actionable server detail.
   - Validate media, upload replacements before old-asset deletion, restrict project-image deletion by project prefix, and check every persistence result.
   - Move contact storage out of analytics; add honeypot plus minimum viable rate limiting.
4. Split reads and compose middleware.
   - Use explicit column projections.
   - Preserve public fallback only on an actual Supabase failure; no fallback for an empty result or any admin data path.
   - Compose locale routing and Supabase session refresh.
5. Focused checks.
   - SQL policy inspection, typecheck/build, admin/non-admin/anonymous negative paths, contact rejection cases, safe upload/replacement failure cases, and seed transaction behavior.

## Phase 2 — Public Quiet Workshop gallery

**Owner:** `@designer` (all public visual, responsive, interaction, and copy-structure changes).  
**Review gate:** `@oracle` — public accessibility, RSC/data-boundary, and performance integration.

1. Establish Quiet Workshop tokens in `app/globals.css`: paper/ink/stone/moss/orange palette, display/body/mono typography, gallery media framing, focus-visible states, and reduced-motion rules.
2. Reshape public composition in `app/[locale]/page.tsx` to: Hero → Selected Work → Current Focus/Proof → Experience → consolidated About → Contact.
3. Rebuild public navigation, hero, work features/index, filters, project details, proof and contact conversion flows.
   - Use semantic interactive controls, complete dialog behavior, stable responsive media, and translated accessible labels.
   - Remove/retire only superseded ticker and Apple-specific presentation behavior.
4. Complete public localization and discovery.
   - Translate remaining public UI strings in `messages/*.json`.
   - Add locale metadata, canonical/hreflang, safe JSON-LD, sitemap, and robots.
5. Focused checks.
   - Desktop/mobile visual pass in both locales; keyboard/filter/menu/dialog paths; reduced-motion and 200% zoom checks; LCP-image sizing/client-island review; typecheck/build.

## Phase 3 — Operational admin workspace

**Owner:** `@designer` (admin information architecture and UI); `@fixer` only for mechanical non-visual wiring that preserves the accepted design.  
**Review gate:** `@oracle` — operational safety, interaction semantics, and data-tool risk controls.

1. Make admin sections URL-addressable and navigation responsive.
2. Redesign admin surfaces as a warm-paper workspace with ink navigation, moss active/saved state, and orange primary/destructive intent.
3. Implement accessible forms, editor/confirmation dialogs, save/failure live status, and unsaved-change protection where applicable.
4. Isolate utilities in Data tools. Rename preview-only import and require explicit typed confirmation for replacement/resync operations.
5. Focused checks.
   - Admin session states, CRUD/save/error states, data-tool confirmations, dialog keyboard paths, mobile layout, locale behavior, and typecheck/build.

## Phase 4 — Release evidence

**Owner:** orchestrator coordinates focused validation; `@oracle` only if phase remediation materially changes risk.  

1. Run `npm run typecheck` and `npm run build`; adapt the lint command only if package tooling proves the existing script obsolete.
2. Verify live Supabase migration prerequisites and policies with one admin, one non-admin authenticated user, and anonymous access.
3. Verify critical visitor, contact, admin, storage, locale, metadata, accessibility, and responsive paths against the approved claims.
4. Inspect final diff and preserve unrelated working-tree changes.

## Sequencing and review budget

1. Phase 1 → Oracle review: authorization, RLS, storage, transactional data integrity are irreversible/high-risk.
2. Phase 2 → Oracle review: public architecture crosses RSC, i18n, SEO, performance, and accessibility.
3. Phase 3 → Oracle review: admin interactions can cause destructive data changes.
4. Phase 4 → focused validation: no separate Oracle review unless prior findings require a risk-changing remediation.
