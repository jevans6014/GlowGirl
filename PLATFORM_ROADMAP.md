# Master Execution Roadmap
**Merge of `PLATFORM_BLUEPRINT.md` (operational plane) + `PLATFORM_BLUEPRINT_V2.md` (intelligence plane + scaling).**
*This is a build order, not an architecture doc. Day 1 → "onboard unlimited businesses."*

Two engineers, two Windsurf environments, parallel agents. The roadmap is engineered so that **Brayden and Julian almost never touch the same files**, connected only through versioned **contracts** (Phase 1). Read the reference maps first, then execute phases top-to-bottom; tasks within a phase run in parallel unless a `Dependencies` line says otherwise.

Task ID prefix = repo/owner boundary (so ownership is obvious from the ID):
- `INFRA-` → `infra` (Brayden, some Shared)
- `PLAT-` → `agency-platform` (Brayden)
- `DATA-` → `agency-data` (Julian)
- `PILOT-` → `glowgirl` (Shared)
- `CTR-` → contracts (owner varies — see Contract Ownership Map)
- `SHARED-` → cross-cutting / both monorepos

---

## A. Repository Ownership Map

| Repository | Owner | Contents | The other engineer may… |
|:-----------|:------|:---------|:------------------------|
| `infra` | Brayden | Terraform: VPC, ECS, ALB, RDS, ElastiCache, ECR, OIDC<br/>modules: shared-runtime, client-site, database, data-platform | open PRs for data-platform module (Julian) — Brayden reviews |
| `agency-platform` | Brayden | packages: core, cms, commerce, booking, forms, ui, analytics-sdk-php<br/>runtime (T0), template, docs | consume packages only; never edit |
| `platform-template` | Brayden | GitHub template → new T1 client repos | consume only |
| `agency-data` | Julian | ingest, warehouse (dbt), ml, dashboard-api, analytics-sdk-js | consume dashboard-api + emit events only |
| `glowgirl` | Shared | Pilot T1 app; bespoke try-on | both work here during Phase 4 — split by directory |

**Boundary rule:** `agency-platform` emits events and exposes the Services layer; `agency-data` ingests events and exposes `dashboard-api` + feature store. Neither reads the other's database. The event lake and the contracts are the only seams.

---

## B. Contract Ownership Map

Every contract lives in its **owner's repo** under `/contracts`, is **semver-versioned**, published as a package (npm/Composer/PyPI or a `contracts` git tag), and changed only via the breaking-change process below.

| Contract | Owner | Consumers | Versioning | Breaking-change process |
|---|---|---|---|---|
| **Event Contract / Schema Registry** (`CTR-001`) | **Julian** (`agency-data`) | Brayden (analytics-sdk, runtime, all sites) | JSON Schema per event, semver per event + registry version | New major = new event version emitted in parallel; old version deprecated for 2 release cycles; consumer CI fails on unknown/invalid events |
| **Analytics SDK Contract** (`CTR-002`) | **Julian** | Brayden (PHP) + sites (JS) | semver package | Additive only in minor; major requires both SDKs released together |
| **Dashboard API Contract** (`CTR-003`) | **Julian** | Owner dashboard UI (Shared) | OpenAPI, semver, `/v1` path | New `/v2` path; `/v1` kept ≥2 cycles; contract tests in CI |
| **Owner Identity Contract** (`CTR-004`) | **Brayden** | dashboard-api, ml, dashboard UI | OIDC/JWT claim schema, semver | Claims additive; removing a claim = major + coordinated release |
| **Feature-Store Contract** (`CTR-005`) | **Julian** | ml / ai package | semver | Additive features; deprecate before delete |
| **Tenant Provisioning Contract** (`CTR-006`) | **Shared** (Brayden drafts) | runtime, infra, data plane | semver; defines `tenant_id` format + lifecycle events | Coordinated; `tenant_id` format is frozen after Phase 1 |
| **CDC / Domain-Event Contract** (`CTR-007`) | **Brayden** (emit) | Julian (lake ingest) | semver, per domain event | Additive payload fields in minor; major coordinated |

**Frozen-early invariants** (decide once in Phase 1, never revisit): `tenant_id` format (UUIDv7), event envelope shape, timestamp/timezone (UTC ISO-8601), and the identity keys (`anonymous_id`, `lead_id`, `customer_id`).

---

## C. Pre-flight decisions (must be signed off before Phase 1 ends)
Carried from v1 §0.3 + v2 §8. **Blocking** — parallel work forks here.
- **D1** Inertia monolith ✅ (settled).
- **D2** **React + Inertia, not Vue** — recommended: Julian builds POCs, broader AI-tooling ecosystem, ~40% cheaper pilot port, pilot is already React. Decide now; it changes `ui` + every Page.
- **D3** Tailwind v4 tokens ✅.
- **D4** Tiered tenancy (T0 shared / T1 isolated / T2 premium) — replaces v1's pure app-per-client. **This is the most important sign-off**; it determines whether the runtime (Phase 3) gets built.

---

# ROADMAP

## PHASE 0 — FOUNDATIONS
*Goal: both engineers can deploy a "hello" container and run CI independently. No product logic.*

### INFRA-001 — AWS Org & Identity Hygiene
- **Owner:** Brayden · **Repo:** `infra`
- **Purpose:** Safe multi-account base before anything else touches AWS.
- **Deliverables:** AWS Organizations (mgmt + workloads accounts), IAM Identity Center, billing alarms, GuardDuty on, OIDC provider for GitHub.
- **Dependencies:** none.
- **Integration Points:** every future deploy (OIDC role).
- **Acceptance:** GitHub Actions assumes an OIDC role and runs `aws sts get-caller-identity` with zero stored keys.
- **Unblocks:** INFRA-002, SHARED-001.

### INFRA-002 — Terraform Backbone & VPC
- **Owner:** Brayden · **Repo:** `infra`
- **Purpose:** Remote state + network foundation.
- **Deliverables:** S3+DynamoDB state backend, `terraform plan/apply` CI, VPC module (public/private subnets, NAT, SGs), ECR.
- **Dependencies:** INFRA-001.
- **Integration Points:** all infra modules.
- **Acceptance:** `terraform apply` from CI provisions VPC; plan posted as PR comment, apply gated on merge.
- **Unblocks:** INFRA-003, INFRA-004, DATA-002.

### INFRA-003 — Container Base Image & ECR
- **Owner:** Brayden · **Repo:** `infra` (+ `agency-platform/runtime` Dockerfile)
- **Purpose:** One golden runtime image for all PHP apps.
- **Deliverables:** FrankenPHP single-container base (PHP 8.3+, ext: pdo_pgsql, redis, intl), pushed to ECR, SBOM scan in CI.
- **Dependencies:** INFRA-002.
- **Acceptance:** Image runs `php artisan --version`; vulnerability scan clean.
- **Unblocks:** INFRA-004, PLAT-011, all deploys.

### PLAT-001 — `agency-platform` Monorepo Skeleton
- **Owner:** Brayden · **Repo:** `agency-platform`
- **Purpose:** Home of the operational OS layer.
- **Deliverables:** Composer monorepo (path repos or Private Packagist), empty `packages/{core,cms,commerce,booking,forms,ui}`, `runtime/`, `template/`, `docs/`; Pint + PHPStan lvl 6 + Pest + eslint/prettier; reusable CI workflow.
- **Dependencies:** SHARED-001.
- **Acceptance:** `composer test` green on empty packages; CI runs on PR.
- **Unblocks:** all PLAT-0xx.

### DATA-001 — `agency-data` Monorepo Skeleton
- **Owner:** Julian · **Repo:** `agency-data`
- **Purpose:** Home of the intelligence plane.
- **Deliverables:** Python monorepo (uv), `ingest/`, `warehouse/` (dbt project init), `ml/`, `dashboard-api/`, `analytics-sdk-js/`; ruff + mypy + pytest; reusable CI workflow.
- **Dependencies:** SHARED-001.
- **Acceptance:** `pytest` + `dbt parse` green; CI runs on PR.
- **Unblocks:** all DATA-0xx.

### SHARED-001 — Shared CI/CD Templates & Standards
- **Owner:** Shared · **Repo:** `infra` (reusable workflows) + both monorepos
- **Purpose:** Identical CI ergonomics across repos; OIDC everywhere.
- **Deliverables:** Reusable GitHub Actions (lint→test→build→deploy-with-OIDC), branch protection (trunk-based, green-required, small PRs), CODEOWNERS enforcing repo boundaries.
- **Dependencies:** INFRA-001.
- **Acceptance:** A PR in either monorepo runs the shared workflow; CODEOWNERS blocks cross-boundary edits.
- **Unblocks:** PLAT-001, DATA-001.

### SHARED-002 — ADR & Docs Process
- **Owner:** Shared · **Repo:** both `docs/`
- **Purpose:** Record decisions; prevent re-litigation across two solo environments.
- **Deliverables:** ADR template, ADRs for D1–D4, runbook skeleton.
- **Dependencies:** none.
- **Acceptance:** D1–D4 captured as accepted ADRs.
- **Unblocks:** Phase 1.

---

## PHASE 1 — INTEGRATION CONTRACTS
*Goal: define every seam so the two planes can be built in total isolation. **This is the highest-leverage phase** — do not start Phase 2 product work until these are versioned and published. No business logic; pure interfaces + fixtures.*

### CTR-001 — Event Contract & Schema Registry
- **Owner:** Julian · **Repo:** `agency-data/contracts`
- **Purpose:** The master seam between operational sites and the data plane.
- **Deliverables:** JSON Schemas for canonical taxonomy — `page_viewed`, `session_started`, `content_engaged`, `search_performed`, `lead_captured`, `form_submitted`, `appointment_booked`, `checkout_started`, `order_completed`; shared **envelope** (`tenant_id`, `anonymous_id`, `event_id`, `ts`, `source`, `version`); registry version 0.1; golden fixture events.
- **Dependencies:** SHARED-002 (D-decisions); frozen invariants from §B.
- **Integration Points:** analytics-sdk (both), ingestion, runtime, every site.
- **Acceptance:** Schemas validate the golden fixtures; published as `@agency/event-contract@0.1.0`; Brayden can `npm/composer install` it.
- **Unblocks:** CTR-002, CTR-007, DATA-003, PLAT-010, DATA-004.

### CTR-002 — Analytics SDK Contract
- **Owner:** Julian · **Repo:** `agency-data/contracts`
- **Purpose:** Stable emit API so Brayden integrates once and never breaks.
- **Deliverables:** Interface spec for `track(event, props)`, `identify(id, traits)`, batching/retry/consent semantics; PHP + JS signatures.
- **Dependencies:** CTR-001.
- **Acceptance:** Spec reviewed + accepted by Brayden; mock SDK passes contract tests against fixtures.
- **Unblocks:** PLAT-010 (PHP SDK), DATA-004 (JS SDK).

### CTR-003 — Dashboard API Contract
- **Owner:** Julian · **Repo:** `agency-data/contracts`
- **Purpose:** Lets the dashboard UI be built before the data backend exists.
- **Deliverables:** OpenAPI `/v1` (metrics, timeseries, funnels, leads, tenant-scoped); mock server.
- **Dependencies:** CTR-004 (auth claims).
- **Acceptance:** Mock server returns contract-valid responses; UI team can build against it.
- **Unblocks:** DATA-013, dashboard UI.

### CTR-004 — Owner Identity Contract
- **Owner:** Brayden · **Repo:** `agency-platform/contracts`
- **Purpose:** Single cross-fleet identity for business owners (distinct from site end-user auth).
- **Deliverables:** OIDC/JWT claim schema (`sub`, `tenant_ids[]`, `role`, `agency_admin`), token issuance/verification spec.
- **Dependencies:** SHARED-002.
- **Integration Points:** dashboard-api, ml, dashboard UI.
- **Acceptance:** Sample JWT validates against schema; Julian can verify tokens with published JWKS.
- **Unblocks:** CTR-003, DATA-013, PLAT-017.

### CTR-005 — Feature-Store Contract
- **Owner:** Julian · **Repo:** `agency-data/contracts`
- **Purpose:** Stable interface between marts and ML/AI.
- **Deliverables:** Feature definition schema (entity = tenant/visitor/customer), point-in-time read API spec.
- **Dependencies:** CTR-001.
- **Acceptance:** Spec accepted; mock returns contract-valid features.
- **Unblocks:** DATA-017, ai package.

### CTR-006 — Tenant Provisioning Contract
- **Owner:** Shared (Brayden drafts) · **Repo:** `agency-platform/contracts`
- **Purpose:** One definition of "a tenant exists" across both planes.
- **Deliverables:** `tenant_id` = UUIDv7 (frozen); lifecycle events `tenant.provisioned/updated/deprovisioned`; tier field (T0/T1/T2).
- **Dependencies:** D4 sign-off.
- **Integration Points:** runtime, infra, data plane partitioning.
- **Acceptance:** Lifecycle events documented + on the event contract; both planes subscribe.
- **Unblocks:** PLAT-018, DATA-016, INFRA-006.

### CTR-007 — CDC / Domain-Event Contract
- **Owner:** Brayden · **Repo:** `agency-platform/contracts`
- **Purpose:** Authoritative server-side events (revenue/leads) — never trust the browser for money.
- **Deliverables:** Domain-event schemas (`order_completed`, `appointment_booked`, `refund_issued`) emitted server-side from Services layer; mapping to event contract.
- **Dependencies:** CTR-001.
- **Acceptance:** A Service-layer fixture emits a contract-valid domain event Julian can ingest.
- **Unblocks:** DATA-009, accurate revenue marts.

---

## PHASE 2 — PLATFORM CORE ‖ DATA FOUNDATION (fully parallel)
*Brayden builds the OS packages; Julian builds the ingestion + warehouse. They share zero files; they share only CTR-001/002. This is the longest parallel stretch — protect it.*

### Brayden track (`agency-platform`)

#### PLAT-002 — `core` package
- **Owner:** Brayden · **Purpose:** Auth/roles/settings every app needs.
- **Deliverables:** Fortify session auth, `spatie/permission` roles (`agency-admin`,`client-admin`,`client-editor`), settings, audit log.
- **Dependencies:** PLAT-001.
- **Acceptance:** Pest auth/role tests green; package installable.
- **Unblocks:** PLAT-003, PLAT-011.

#### PLAT-003 — `core` Filament panel shell (token-themed)
- **Owner:** Brayden · **Deliverables:** Filament panel scaffold consuming `ui` tokens so client admin matches client brand.
- **Dependencies:** PLAT-002, PLAT-008.
- **Acceptance:** Panel boots with a swapped theme token file.
- **Unblocks:** cms/commerce Filament resources.

#### PLAT-004 — `cms`: pages + block model + block registry
- **Owner:** Brayden · **Deliverables:** `pages`, `block_instances`, `block_types`; block = Filament schema + React renderer + TS type. Blocks: hero, rich-text, image-gallery, cta, faq, testimonials, product-grid, contact-form.
- **Dependencies:** PLAT-002.
- **Acceptance:** A page of 3 block types renders via Inertia; editable in Filament.
- **Unblocks:** PLAT-009, DATA-020 (AI drafting target).

#### PLAT-005 — `cms`: media (medialibrary → S3) + conversions
- **Owner:** Brayden · **Deliverables:** medialibrary on S3, queued thumb/webp/avif conversions, CloudFront serving.
- **Dependencies:** PLAT-004, INFRA-002.
- **Acceptance:** Upload → converted derivatives in S3 → served via CDN URL.

#### PLAT-006 — `cms`: SEO, sitemap, redirects, menus
- **Owner:** Brayden · **Deliverables:** per-page SEO JSON, auto sitemap, redirect map, menu builder.
- **Dependencies:** PLAT-004. · **Acceptance:** Sitemap + 301 map generated; OG tags SSR-rendered.

#### PLAT-007 — `forms` package
- **Owner:** Brayden · **Deliverables:** form builder, submissions, SES notifications, newsletter.
- **Dependencies:** PLAT-002. · **Acceptance:** Form submit → row + queued SES mail (test) + emits `form_submitted` via SDK (after PLAT-010).

#### PLAT-008 — `ui` package (tokens + components + BlockRenderer)
- **Owner:** Brayden · **Deliverables:** `tokens.css` (@theme), Tailwind preset, React component lib, `BlockRenderer`, theme override mechanism.
- **Dependencies:** PLAT-001, D2/D3. · **Acceptance:** Storybook/Histoire gallery; theme swap = token file swap.
- **Unblocks:** PLAT-003, PLAT-009.

#### PLAT-009 — `platform-template` repo
- **Owner:** Brayden · **Repo:** `platform-template` · **Deliverables:** GitHub template wiring core+cms+forms+ui that boots a styled CMS site in <1hr.
- **Dependencies:** PLAT-004/006/008. · **Acceptance:** Julian (as "the other founder") boots a demo site in <1 day without editing package code.
- **Unblocks:** PILOT-001, PLAT-019.

#### PLAT-010 — `analytics-sdk-php` (implements CTR-002)
- **Owner:** Brayden · **Deliverables:** PHP SDK: `track/identify`, batching, consent, queued delivery to ingestion endpoint.
- **Dependencies:** CTR-002, CTR-001.
- **Integration Points:** DATA-003 ingestion.
- **Acceptance:** Emits contract-valid events that pass DATA-008 validation against fixtures (mock endpoint).
- **Unblocks:** PLAT-014.

### Julian track (`agency-data` + `infra` PR)

#### DATA-002 — Provision S3 event lake
- **Owner:** Julian · **Repo:** `infra/modules/data-platform` (PR, Brayden reviews) · **Deliverables:** S3 raw bucket, Parquet, partitioned `tenant_id/date`; Glue catalog.
- **Dependencies:** INFRA-002. · **Acceptance:** `terraform apply` creates lake; a fixture Parquet is queryable.
- **Unblocks:** DATA-003, DATA-006.

#### DATA-003 — Event ingestion endpoint
- **Owner:** Julian · **Repo:** `agency-data/ingest` · **Deliverables:** HTTPS collector (validate vs schema registry, stamp `tenant_id`, buffer) → Kinesis Firehose → S3 lake. Reject invalid events with clear errors.
- **Dependencies:** CTR-001, DATA-002. · **Acceptance:** Golden fixtures land in lake; invalid events rejected + logged.
- **Unblocks:** PLAT-014, DATA-006.

#### DATA-004 — `analytics-sdk-js` (implements CTR-002)
- **Owner:** Julian · **Deliverables:** Browser SDK (track/identify, consent, batching, beacon on unload).
- **Dependencies:** CTR-002. · **Acceptance:** Emits contract-valid events to ingestion; passes contract tests.
- **Unblocks:** PILOT-005.

#### DATA-005 — Warehouse provisioning
- **Owner:** Julian · **Repo:** `infra/modules/data-platform` (PR) · **Deliverables:** Athena + Glue (start) over the lake; (option) single ClickHouse node for event analytics. **No Snowflake/Databricks at this scale.**
- **Dependencies:** DATA-002. · **Acceptance:** SQL over fixture events returns rows.
- **Unblocks:** DATA-006.

#### DATA-006 — dbt staging models
- **Owner:** Julian · **Deliverables:** dbt project: sources + staging models normalizing each canonical event; tests (not-null, accepted-values, uniqueness).
- **Dependencies:** CTR-001, DATA-005. · **Acceptance:** `dbt build` green on fixture data; CI runs dbt tests.
- **Unblocks:** DATA-007, DATA-011.

#### DATA-007 — Identity resolution v0
- **Owner:** Julian · **Deliverables:** stitch `anonymous_id → lead_id → customer_id` per tenant (deterministic first).
- **Dependencies:** DATA-006. · **Acceptance:** Fixture sessions resolve to a single visitor across events.
- **Unblocks:** DATA-011, DATA-017.

#### DATA-008 — Schema-registry CI / contract tests
- **Owner:** Julian · **Deliverables:** Shared contract-test action: validates any emitter's sample events vs registry; fails platform PRs on drift.
- **Dependencies:** CTR-001. · **Acceptance:** A deliberately-broken event fails a platform CI run.
- **Unblocks:** safe parallel evolution of both planes.

---

## PHASE 3 — SHARED RUNTIME & EVENT EMISSION
*Goal: the T0 multi-tenant runtime exists and every site emits canonical events. This is where the two planes first connect in production.*

### PLAT-011 — `runtime`: T0 multi-tenant app
- **Owner:** Brayden · **Repo:** `agency-platform/runtime`
- **Purpose:** Where most clients live as config, not repos.
- **Deliverables:** Laravel app using `stancl/tenancy`; mandatory global `tenant_id` scope via a base model; tenant resolution by host header.
- **Dependencies:** PLAT-002/004/006/008, CTR-006.
- **Integration Points:** ALB host routing, CTR-006 lifecycle.
- **Acceptance:** Two seeded tenants serve isolated content from one app instance.
- **Unblocks:** PLAT-012, PLAT-018, INFRA-004.

### PLAT-012 — Cross-tenant denial test suite (release-blocking)
- **Owner:** Brayden · **Purpose:** The shared runtime's top existential risk (v2 §9).
- **Deliverables:** Pest suite asserting cross-tenant denial on **every** resource/route/query; static-analysis rule forbidding unscoped queries.
- **Dependencies:** PLAT-011.
- **Acceptance:** Suite is a required check; a deliberately unscoped query fails CI.
- **Unblocks:** any T0 client onboarding (gates it).

### PLAT-013 — Tenant-aware cache/queue/connection prefixing
- **Owner:** Brayden · **Deliverables:** Redis cache + Horizon queue + (where used) connection prefixes per tenant.
- **Dependencies:** PLAT-011. · **Acceptance:** No cache/queue bleed across tenants under test.

### INFRA-004 — `shared-runtime` Terraform module
- **Owner:** Brayden · **Repo:** `infra` · **Deliverables:** Fargate service (autoscaling) + ALB host-routing + Horizon worker for the T0 app; CloudFront+WAF; Secrets Manager injection.
- **Dependencies:** INFRA-003, PLAT-011. · **Acceptance:** T0 runtime serves a tenant via CloudFront over HTTPS.
- **Unblocks:** PHASE 6 onboarding.

### INFRA-005 — `client-site` + `database` modules (T1/T2)
- **Owner:** Brayden · **Repo:** `infra` · **Deliverables:** Per-client isolated Fargate service + db-per-client RDS (Multi-AZ from first paying client) + secrets + CloudFront.
- **Dependencies:** INFRA-003. · **Acceptance:** `terraform apply` stands up an isolated client stack from one module instantiation.
- **Unblocks:** PILOT-001 (GlowGirl is T1).

### PLAT-014 — Wire `analytics-sdk-php` into runtime + cms
- **Owner:** Brayden (consumes Julian's ingestion) · **Purpose:** Every page/form/commerce action emits canonical + domain events automatically.
- **Deliverables:** Auto-emit `page_viewed`, `form_submitted`, etc. from core/cms/forms; server-side domain events per CTR-007.
- **Dependencies:** PLAT-010, DATA-003, CTR-007.
- **Integration Points:** **First live cross-plane seam.**
- **Acceptance:** A click on a runtime tenant lands a contract-valid event in the lake end-to-end.
- **Unblocks:** DATA-011 (real data), PILOT-005.

### DATA-009 — CDC pipeline: ops DBs → lake
- **Owner:** Julian · **Repo:** `agency-data/ingest` · **Purpose:** Authoritative revenue/lead events.
- **Deliverables:** Consume CTR-007 domain events (server-emitted) into the lake as the source-of-truth stream; reconcile vs client-side behavior events.
- **Dependencies:** CTR-007, DATA-003. · **Acceptance:** A test order produces a server-authoritative `order_completed` distinct from any browser event.
- **Unblocks:** trustworthy revenue marts (DATA-011).

---

## PHASE 4 — GLOWGIRL PILOT (the proving ground)
*Goal: rebuild GlowGirl on the platform AND prove the event contract end-to-end. GlowGirl is **T1** (the try-on requires bespoke code). File-split so both work the repo without conflict: **Brayden owns `app/`, `packages` usage, Filament, infra; Julian owns `resources/js/analytics`, event instrumentation, and the warehouse side.***

| Parallel | Sequential |
|---|---|
| Brayden ports pages/commerce/booking while Julian builds marts from emitted events | Cutover (PILOT-008) waits on E2E green (PILOT-006) |

### PLAT-015 — `commerce` package (extracted during pilot)
- **Owner:** Brayden · **Deliverables:** products/variants/cart/orders + Cashier Checkout; opt-in. **Dependencies:** PLAT-002. **Acceptance:** Test-mode checkout creates an order + emits CTR-007 `order_completed`.

### PLAT-016 — `booking` package
- **Owner:** Brayden · **Deliverables:** appointments + deposits via Cashier. **Dependencies:** PLAT-002. **Acceptance:** Deposit flow books a slot + emits `appointment_booked`.

### PILOT-001 — GlowGirl T1 app from template
- **Owner:** Shared · **Repo:** `glowgirl` · **Deliverables:** New app from `platform-template`, provisioned via INFRA-005. **Dependencies:** PLAT-009, INFRA-005. **Acceptance:** Boots on a staging domain serving a CMS-managed homepage.

### PILOT-002 — Port pages to CMS blocks + Inertia/React
- **Owner:** Brayden · **Deliverables:** All marketing pages as CMS blocks; content editable in Filament. **Dependencies:** PILOT-001. **Acceptance:** Founder-as-client edits homepage copy unaided.

### PILOT-003 — Port try-on as client-specific code
- **Owner:** Brayden · **Deliverables:** Try-on lives in `glowgirl` only (proves T1 isolation). **Dependencies:** PILOT-001. **Acceptance:** Try-on works; no try-on code leaks into platform packages.

### PILOT-004 — Stripe webhooks + SES + Filament admin
- **Owner:** Brayden · **Deliverables:** Cashier webhooks, SES mailables, admin resources. **Dependencies:** PLAT-015/016. **Acceptance:** Live-mode test transaction; admin sees orders/appointments.

### PILOT-005 — Instrument GlowGirl with analytics SDK
- **Owner:** Julian (+ Brayden hooks) · **Deliverables:** JS SDK on the storefront; verify all canonical events fire with correct `tenant_id`/identity.
- **Dependencies:** DATA-004, PLAT-014. **Integration Points:** lake. **Acceptance:** Full funnel (`page_viewed → checkout_started → order_completed`) visible in the lake for the GlowGirl tenant.

### DATA-010 — GlowGirl = first warehouse source
- **Owner:** Julian · **Deliverables:** dbt marts populated from real GlowGirl events; validate identity resolution on a real funnel. **Dependencies:** PILOT-005, DATA-006/007. **Acceptance:** Event contract proven end-to-end on real data; discrepancies feed CTR-001 v0.2.

### PILOT-006 — E2E + quality gates
- **Owner:** Shared · **Deliverables:** Playwright (browse→cart→Stripe test→order in Filament; booking; forms via SES), Lighthouse ≥ old site. **Dependencies:** PILOT-002/004/005. **Acceptance:** Green E2E on staging; perf parity.

### PILOT-007 — Data-migration playbook dry-run
- **Owner:** Brayden · **Deliverables:** Exercise `import:supabase` + `import:verify` patterns (zero data, but prove the reusable takeover path). **Dependencies:** PILOT-001. **Acceptance:** Importer runs idempotently against a sample dump.

### PILOT-008 — Cutover & Supabase decommission
- **Owner:** Shared · **Deliverables:** Route53 cutover, key rotation, Supabase paused→deleted after 30-day cooling. **Dependencies:** PILOT-006. **Acceptance:** 2 weeks Sentry/CloudWatch-clean prod. **Pilot success = this + a founder editing content unaided + a funnel visible in the dashboard.**

---

## PHASE 5 — OWNER DASHBOARD & SEMANTIC LAYER
*Goal: business owners see trustworthy metrics. Dashboard reads marts only — **never** client DBs.*

### DATA-011 — dbt core/marts (rollups)
- **Owner:** Julian · **Deliverables:** daily/hourly per-tenant rollups (traffic, leads, conversion, revenue, top pages/funnels). **Dependencies:** DATA-006/007/009. **Acceptance:** Marts match hand-computed numbers on GlowGirl fixtures.

### DATA-012 — Semantic / metrics layer
- **Owner:** Julian · **Purpose:** One definition per metric (dashboard == AI prompt). **Deliverables:** metric definitions (dbt metrics or thin service). **Dependencies:** DATA-011. **Acceptance:** "Conversion rate" resolves identically across two consumers.

### DATA-013 — `dashboard-api` service
- **Owner:** Julian · **Repo:** `agency-data/dashboard-api` · **Deliverables:** Implements CTR-003; tenant-scoped via CTR-004 tokens; reads marts/semantic layer. **Dependencies:** CTR-003, CTR-004, DATA-012. **Acceptance:** Contract tests pass against real marts; tenant isolation enforced.

### PLAT-017 — Central owner-identity domain
- **Owner:** Brayden · **Deliverables:** Issues CTR-004 tokens; owner login distinct from site end-user auth; JWKS published. **Dependencies:** CTR-004. **Acceptance:** Owner logs in once, dashboard-api accepts token, scopes to their `tenant_ids`.

### DASH-001 — Owner dashboard UI
- **Owner:** Shared (Julian data, Brayden shell) · **Repo:** could start as a Filament panel or Inertia app consuming `dashboard-api`. **Deliverables:** traffic/leads/conversion/revenue views. **Dependencies:** DATA-013, PLAT-017. **Acceptance:** GlowGirl owner sees real funnel + leads.

### DATA-014 — Near-real-time counters (optional, scoped)
- **Owner:** Julian · **Deliverables:** 1–5 min micro-batch for a small "live today" set only. **Dependencies:** DATA-011. **Acceptance:** Live counter within 5 min of an event. **Debt call-out:** do NOT build streaming analytics now — batch covers 95%; revisit only on demand.

---

## PHASE 6 — CLIENT ONBOARDING SYSTEM
*Goal: a standard client is config, not a repo. This is where the ≤5-ED KPI is won.*

### PLAT-018 — T0 provisioning workflow
- **Owner:** Brayden · **Deliverables:** Provision a tenant = row + theme tokens + CMS content (no repo, no pipeline); emits CTR-006 lifecycle events. **Dependencies:** PLAT-011, INFRA-004, CTR-006. **Acceptance:** New T0 client live on shared runtime via an admin action.
- **Unblocks:** PLAT-020.

### INFRA-006 — Tenant lifecycle automation
- **Owner:** Brayden · **Repo:** `infra` · **Deliverables:** For T1/T2, `terraform apply` from a single module call on `tenant.provisioned`; certs via ACM. **Dependencies:** INFRA-005, CTR-006. **Acceptance:** One command stands up a T1 client end-to-end.

### PLAT-019 — Ejection tooling (T0 → T1)
- **Owner:** Brayden · **Deliverables:** Promote a T0 tenant to a T1 repo from template, migrating content/theme. **Dependencies:** PLAT-009, PLAT-018. **Acceptance:** GlowGirl-like client ejects with content intact.

### DATA-016 — Tenant lifecycle → data plane
- **Owner:** Julian · **Deliverables:** Subscribe to CTR-006 events; create/retire warehouse partitions + dashboard access per tenant. **Dependencies:** CTR-006, DATA-011. **Acceptance:** New tenant appears in dashboard scope automatically; deprovision purges per-tenant data.

### SHARED-003 — Onboarding runbook + KPI tracking
- **Owner:** Shared · **Deliverables:** Checklist + automated **engineer-days-per-site** metric. **Dependencies:** PLAT-018. **Acceptance:** KPI recorded for every client from #2.

### PLAT-020 — Client #2 onboarded as T0 (proof)
- **Owner:** Shared · **Deliverables:** A real second client onboarded config-only. **Dependencies:** PLAT-018, DASH-001. **Acceptance:** **≤5 ED to styled staging**; appears in dashboard with no bespoke code.

---

## PHASE 7 — AI FOUNDATION
*Goal: turn the dataset into intelligence. Designed-in by the Services layer (v1 §2.2) + the data plane.*

### DATA-017 — Feature store
- **Owner:** Julian · **Deliverables:** Implements CTR-005 over marts (entities: tenant/visitor/customer), point-in-time correct. **Dependencies:** CTR-005, DATA-011. **Acceptance:** Mock model reads consistent features.

### DATA-018 — `ai` package: tool-calling contract
- **Owner:** Julian (uses Brayden's Services) · **Repo:** `agency-data/ml` + `agency-platform/packages/ai` stub · **Deliverables:** AI tools bind to existing Services/Actions (`CreatePage`, `UpdateBlock`, `UploadMedia`). **Dependencies:** PLAT services stable. **Acceptance:** An agent drafts a page by calling Services, not freeform HTML.

### DATA-019 — Per-tenant RAG support bot
- **Owner:** Julian · **Deliverables:** pgvector per tenant; embed CMS blocks → site support chat grounded in that client's content. **Dependencies:** PLAT-004, DATA-018. **Acceptance:** Bot answers from one tenant's content only (no cross-tenant leakage).

### DATA-020 — AI page drafting in Filament
- **Owner:** Shared (Julian model, Brayden Filament action) · **Deliverables:** "Draft with AI" → `block[]` validated against block schemas → draft status. **Dependencies:** DATA-018, PLAT-004. **Acceptance:** AI output validates against block schemas; never bypasses CMS structure.

### DATA-021 — AI SEO audit (batch)
- **Owner:** Julian · **Deliverables:** Horizon/queue jobs proposing meta/alt-text/internal links fleet-wide from the SEO JSON + marts. **Dependencies:** PLAT-006, DATA-011. **Acceptance:** Audit report per tenant; proposals land as drafts.

### SHARED-004 — Privacy / data-ownership boundary
- **Owner:** Shared · **Purpose:** v2 §9 — you are a data **processor** per client. **Deliverables:** per-tenant data export + delete; consent capture; explicit opt-in before any cross-tenant model use. **Dependencies:** DATA-011, DATA-016. **Acceptance:** A client's data can be fully exported and deleted; cross-tenant training is gated behind opt-in.
- **Debt call-out:** skipping this creates **legal**, not just technical, debt — do it before aggregating a second client.

---

## PHASE 8 — SCALE TO 100–500
*Goal: the architecture absorbs growth without rewrites. Build these only as thresholds are hit, but design for them now.*

### PLAT-021 — Dependabot fan-out + auto-merge
- **Owner:** Brayden · **Deliverables:** Per-client package-upgrade PRs; auto-merge patch/minor on green CI. **Dependencies:** versioned packages. **Acceptance:** A package patch fans out and auto-merges fleet-wide on green.

### SHARED-005 — Fleet dashboard
- **Owner:** Shared · **Deliverables:** Filament app showing version/health/deploy status across all clients. **Dependencies:** >10 clients. **Acceptance:** One screen shows fleet drift/health. **Build only when >10 clients (v1 §7).**

### INFRA-007 — RDS Proxy + Aurora migration path
- **Owner:** Brayden · **Deliverables:** Connection pooling (critical as db count grows); documented Aurora trigger + snapshot-restore runbook. **Dependencies:** scale signals. **Acceptance:** Connection storms mitigated; Aurora move is a runbook, not a project.
- **Debt call-out:** **500 isolated DBs hit RDS connection/instance limits** — RDS Proxy + keeping most clients on T0 shared DB is mandatory, not optional.

### INFRA-008 — Cost controls
- **Owner:** Brayden · **Deliverables:** T0 autoscaling, T1 idle scale-down, warehouse partition lifecycle (S3 → Glacier), per-tenant cost tags. **Dependencies:** none. **Acceptance:** Cost-per-tenant dashboard; T0 keeps marginal cost ≈ flat.
- **Debt call-out:** without T0, 500 isolated stacks = **$90k–270k/yr idle floor** (v2 §3). The tier decision IS the cost decision.

### DATA-022 — Warehouse scale tiering
- **Owner:** Julian · **Deliverables:** Partition/clustering strategy; promote hot tenants to ClickHouse/Redshift Serverless if Athena latency hurts. **Dependencies:** volume signals. **Acceptance:** Dashboard p95 query < 2s at 100 tenants.

### SHARED-006 — DR drills + observability hardening
- **Owner:** Shared · **Deliverables:** Sentry (PHP+JS) day 1, CloudWatch alarms→SNS→Slack, quarterly restore drill, cross-region backups. **Dependencies:** PILOT-008. **Acceptance:** Quarterly drill restores a client DB to staging; RPO≤24h/RTO≤4h proven.

---

# D. Critical Path Analysis
The longest dependency chain to "can onboard unlimited businesses":

```
INFRA-001 → INFRA-002 → INFRA-003 ─┐
SHARED-001 → PLAT-001 ─────────────┤
CTR-006 (needs D4) ────────────────┤
                                   ▼
PLAT-002 → PLAT-004 → PLAT-008 → PLAT-011 → PLAT-012 → INFRA-004
                                                   │
                                                   ▼
                                   PLAT-018 (T0 onboarding) → PLAT-020 (≤5 ED proof)
```
**Critical path owner: Brayden.** The platform-core → runtime → onboarding chain gates the business model. **Julian's data chain (CTR-001 → DATA-003 → DATA-006 → DATA-011 → DATA-013) runs fully in parallel and is NOT on the critical path to onboarding** — but it IS on the critical path to the *intelligence* value prop, so it must not lag more than one phase behind. **The pacing risk is Brayden being the bottleneck on both runtime and pilot.** Mitigation: Julian takes `analytics-sdk-js`, ingestion, and all infra `data-platform` PRs off Brayden's plate; Brayden never writes Python; Julian never edits platform packages.

**Single biggest schedule risk:** CTR-001 (event contract). It blocks both the SDK and ingestion. Lock v0.1 in week 2–3 even if imperfect; evolve via DATA-010 findings. Late contract = serialized planes = lost parallelism.

---

# E. Parallelization Opportunities
- **Phase 2 is ~6–8 weeks of fully independent work** (PLAT-002…010 ‖ DATA-002…008). Maximize it; it's the cheapest velocity you'll ever get.
- Within Phase 4, Brayden ports GlowGirl while Julian builds marts off the events Brayden's instrumentation emits — file-split by directory.
- Dashboard UI (DASH-001) can be built against the **CTR-003 mock server** before DATA-013 is real.
- Infra modules (INFRA-004/005) build while packages are still in flight, against the hello-container.
- **Anti-parallel (must serialize):** anything touching `runtime` tenant-scoping (PLAT-011/012/013) — one author (Brayden), because a scoping bug is existential.

---

# F. Integration Schedule (when branches/repos must reconnect)
| When | Integration event | Who | Gate |
|---|---|---|---|
| End Phase 1 | All contracts published + mock servers live | Both | D1–D4 signed; contracts semver-tagged |
| Mid Phase 3 | **PLAT-014 ↔ DATA-003**: first live event end-to-end | Both | A real event lands in the lake |
| Phase 4 | **PILOT-005 ↔ DATA-010**: real funnel in warehouse | Both | Contract proven on real data → CTR-001 v0.2 |
| Phase 5 | **DASH-001 ↔ DATA-013 ↔ PLAT-017**: dashboard reads real marts with owner identity | Both | Owner sees trustworthy numbers |
| Phase 6 | **PLAT-018/019 ↔ DATA-016**: tenant lifecycle propagates to data plane | Both | New tenant auto-appears in dashboard |
| Phase 7 | **DATA-020 ↔ PLAT-004**: AI drafts validate against block schemas | Both | No freeform HTML; schema-valid only |

Everywhere else, the two planes evolve independently behind versioned contracts.

---

# G. First 90-Day Execution Plan
| Window | Brayden | Julian | Joint milestone |
|---|---|---|---|
| **Days 1–15** | INFRA-001/002/003, PLAT-001, SHARED-001/002 | DATA-001, draft CTR-001/002/003/005 | D1–D4 signed; both CIs green; **all contracts v0.1 published** |
| **Days 16–45** | PLAT-002/004/005/006/008 (core+cms+ui) | DATA-002/003/004/005/006 (lake+ingest+SDK-js+dbt staging) | Template boots a styled CMS site; ingestion accepts golden events |
| **Days 46–70** | PLAT-007/009/010, PLAT-011/012 (runtime+scoping), INFRA-004/005 | DATA-007/008/009 (identity, contract-CI, CDC) | **PLAT-014 ↔ DATA-003: first live event end-to-end** |
| **Days 71–90** | PLAT-015/016, PILOT-001/002/003/004 (GlowGirl rebuild) | PILOT-005, DATA-010/011 (instrument + first marts) | GlowGirl on staging serving CMS content **and** emitting a visible funnel |
**Day-90 exit:** GlowGirl rebuilt on the platform on a staging domain, fully event-instrumented, with the first marts populated — i.e. **both planes proven on one real site.** (Cutover PILOT-008 + dashboard Phase 5 follow in days 91–120.)

---

# H. Recommended Task Assignments
**Brayden (operational plane, critical path):** all `INFRA-*`, all `PLAT-*`, CTR-004/006/007, GlowGirl `app/`+Filament+commerce/booking, cutover. *You own the chain that unlocks onboarding — guard it; delegate the JS SDK and data-platform Terraform to Julian.*

**Julian (intelligence plane, parallel):** all `DATA-*`, CTR-001/002/003/005, `analytics-sdk-js`, ingestion, warehouse/dbt/semantic, dashboard-api, feature store, AI, GlowGirl instrumentation. *You own the moat (the dataset); keep ≤1 phase behind Brayden so the contract is validated against real data early.*

**Shared (paired, scheduled):** SHARED-001/002/003/004/006, DASH-001, PILOT-006/008, PLAT-020, DATA-020. *These are the reconnection points in §F — calendar them.*

---

# I. Debt & Assumption Challenges (called out per requirement)
- **Pure app-per-client does not reach 500.** The tiered runtime (D4) is non-negotiable for the stated scale; building only T1 isolated apps is the largest latent rewrite risk in v1. **Decided in V2; this roadmap assumes it.**
- **Event contract lateness serializes the whole program.** Treat CTR-001 as the #1 schedule risk.
- **Two engineers cannot operate 500 isolated stacks.** RDS Proxy (INFRA-007) + T0-by-default (PLAT-018) + auto-merge (PLAT-021) are survival features, not nice-to-haves.
- **Skipping the privacy boundary (SHARED-004) is legal debt.** Required before the second client's data is aggregated.
- **Real-time analytics (DATA-014) is premature optimization** at this scale — batch first, called out so no agent over-builds it.
- **Vue vs React (D2):** roadmap assumes React (cheaper pilot, ecosystem). If Vue is chosen, PLAT-008 + every Page task grows ~2–3 weeks — adjust days 16–90 accordingly.

