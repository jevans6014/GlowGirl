# Julian — Intelligence Plane Execution Plan
**Companion to `PLATFORM_ROADMAP.md`. This is *my* (Julian's) build book.**
*Scope: everything in the data/intelligence plane — contracts I own, ingestion, warehouse, dashboard-api, feature store, AI, and GlowGirl instrumentation. Brayden's operational-plane tasks are referenced only where they block or unblock me.*

---

## 0. How to use this document

- Tasks are listed **in the exact order I should execute them**, not in roadmap-phase order. Where a roadmap task can start earlier than its phase, it's been pulled forward.
- Each task has: **Goal · Why · Subtasks · Deliverables · Manual steps (✋) · Depends on · Unblocks · Acceptance · Definition of Done.**
- **✋ MANUAL STEP** = something only a human can do (log into AWS, create an account, copy a key). These are written so I can follow them click-by-click. Cascade cannot do these for me.
- **🤖 CASCADE** = work Cascade can do with me in the editor/terminal.
- A task is not "done" until its **Acceptance** check passes in CI, not just locally.

---

## 1. My stack (locked decisions for the data plane)

| Layer | Choice | Notes |
|:------|:-------|:------|
| Language | Python 3.12 | one runtime for ingestion, dbt orchestration, ml, dashboard-api |
| Package/env manager | `uv` | fast, lockfile-based; one venv per package in the monorepo |
| Monorepo layout | `uv` workspace | `ingest/`, `warehouse/`, `ml/`, `dashboard-api/`, `analytics-sdk-js/`, `contracts/` |
| Lint / type / test | `ruff` + `mypy` + `pytest` | gates every PR |
| Contracts (events) | **JSON Schema (2020-12)** | published as `@agency/event-contract` (npm) + `agency-event-contract` (PyPI) |
| Event transport | HTTPS collector → **Kinesis Firehose** → S3 | serverless, no Kafka at this scale |
| Lake | **S3 + Parquet**, partitioned `tenant_id/date` | Glue catalog over it |
| Query engine | **Athena** (start) → ClickHouse only if Athena p95 hurts | no Snowflake/Databricks at this scale |
| Transform | **dbt-athena** | staging → marts → semantic |
| Dashboard API | **FastAPI** | implements CTR-003 OpenAPI; JWT verify via CTR-004 JWKS |
| Browser SDK | **TypeScript** (`analytics-sdk-js`) | built/published as npm package |
| Feature store | dbt marts + point-in-time read API | start simple; no Feast unless needed |
| RAG / AI | **pgvector** per tenant + an LLM API | Phase 7 |
| IaC | I write Terraform **only** in `infra/modules/data-platform` and open PRs; Brayden reviews/merges | I never touch his modules |

---

## 2. Accounts, keys & credentials I will personally need (master checklist)

These are gathered once. I'll fill in the "Status" column as I go. **Never commit any of these to git** — they live in `.env` (gitignored) locally and in AWS Secrets Manager / GitHub Actions secrets in CI.

| # | Thing | Where to get it | Used for | Status |
|:--|:------|:----------------|:---------|:-------|
| 1 | GitHub account + access to `agency-data` repo | github.com | all my code | ☐ |
| 2 | AWS IAM Identity Center login (SSO) | Brayden creates via INFRA-001, sends me an invite email | console + CLI access to the workloads account | ☐ |
| 3 | AWS CLI v2 installed + `aws configure sso` | local install | terraform + manual checks | ☐ |
| 4 | A GitHub Actions OIDC role ARN for `agency-data` | Brayden outputs from INFRA-001 | keyless CI deploys | ☐ |
| 5 | LLM API key (OpenAI / Anthropic) | platform.openai.com or console.anthropic.com | Phase 7 AI tasks only | ☐ (defer) |
| 6 | A test domain / subdomain for the ingestion collector | Route53 (Brayden) | `collect.agency-data...` | ☐ |

> **Important:** I do **not** need long-lived AWS access keys. We use SSO + OIDC. If anyone suggests pasting an `AKIA...` key into a file, stop — that's the wrong path.

---

## 3. Pre-flight decisions that block me (from roadmap §C)

I can't finalize contracts until these are signed off with Brayden:

- **D1 Inertia monolith** ✅ settled — doesn't affect me much.
- **D2 React vs Vue** — affects the SDK auto-init snippet I ship and the dashboard UI later. **I should build the React+Inertia POCs** to make the case (roadmap says I own this POC).
- **D3 Tailwind tokens** ✅ — dashboard UI styling later.
- **D4 Tiered tenancy (T0/T1/T2)** — **critical for me**: it defines whether `tenant_id` partitioning in the lake has to handle shared-runtime tenants. **`tenant_id` format (UUIDv7) is frozen after Phase 1 — I must not design the lake before this is locked.**

**Frozen-early invariants I co-own (roadmap §B):** `tenant_id` = UUIDv7; event envelope shape; UTC ISO-8601 timestamps; identity keys `anonymous_id` / `lead_id` / `customer_id`. **Once I publish CTR-001 v0.1 these are effectively frozen — get them right.**

---

# EXECUTION ORDER

The order below is what I actually do, accounting for what unblocks Brayden fastest (he's on the critical path, so I front-load the contracts he consumes).

---

## ▶ STEP 1 — DATA-001 · `agency-data` monorepo skeleton
*Roadmap Phase 0. This is the first thing I build.*

**Goal:** A clean Python monorepo where every future package lives, with lint/type/test/CI green on empty packages.

**Why first:** Everything else commits into this repo. Getting CI green on an empty repo means every later PR has a working safety net from line one.

**Depends on:** SHARED-001 (shared CI templates) ideally, but I can scaffold locally **without waiting** and wire the reusable workflow in once Brayden publishes it. Repo creation (#1 above) is the only hard blocker.

**Unblocks:** every `DATA-*` and `CTR-*` task.

### Subtasks
1. 🤖 Create the repo structure (uv workspace):
   ```
   agency-data/
   ├─ pyproject.toml            # workspace root, shared dev deps
   ├─ uv.lock
   ├─ contracts/               # CTR-001/002/003/005 live here
   ├─ ingest/                  # DATA-003, DATA-009 collector
   ├─ warehouse/               # dbt project (DATA-005/006/011/012)
   ├─ ml/                      # DATA-017/018/019 feature store + AI
   ├─ dashboard-api/           # DATA-013 FastAPI service
   ├─ analytics-sdk-js/        # DATA-004 TS browser SDK (npm subproject)
   ├─ .github/workflows/       # CI (calls Brayden's reusable workflow)
   ├─ ruff.toml, mypy.ini
   └─ README.md
   ```
2. 🤖 Root `pyproject.toml` with `ruff`, `mypy`, `pytest` as dev deps; one trivial test per Python package so `pytest` has something green to run.
3. 🤖 `dbt` project init inside `warehouse/` (`dbt init`, adapter `dbt-athena-community`) — just `dbt parse` must pass; no models yet.
4. 🤖 `analytics-sdk-js/` as a separate npm workspace (its own `package.json`, `tsconfig`, `vitest`) — empty `track()`/`identify()` stubs.
5. 🤖 CI workflow: lint → type → test for Python; lint → test → build for the TS SDK. Initially run them directly; swap to Brayden's reusable workflow when SHARED-001 lands.

### ✋ MANUAL STEPS
- **M1.1 — Create the GitHub repo.** Go to `github.com/new` → owner `jevans6014` (or the agency org) → name `agency-data` → Private → no README (we push our own). Copy the remote URL.
- **M1.2 — Local tooling install (one time):**
  - Install `uv`: `curl -LsSf https://astral.sh/uv/install.sh | sh`
  - Confirm Node ≥ 20 for the SDK subproject: `node -v`
  - *(Cascade will run the project-specific commands; these installs are machine-level so I run them.)*
- **M1.3 — Branch protection:** GitHub → repo → Settings → Branches → add rule for `main`: require PR, require status checks (CI), no direct pushes. (Mirrors SHARED-001.)

**Acceptance:** `uv run pytest` + `uv run ruff check` + `uv run mypy` + `dbt parse` + SDK `npm test` all green; CI runs on a PR.
**Definition of Done:** A "hello" PR opens, CI passes, merges to protected `main`.

---

## ▶ STEP 2 — CTR-001 · Event contract & schema registry
*Roadmap Phase 1. The single highest-leverage thing I do. Brayden is blocked on this for his SDK + ingestion.*

**Goal:** Canonical, versioned JSON Schemas for every event + a shared envelope, published as a package Brayden can install.

**Why now:** It's the #1 schedule risk in the whole program (roadmap §I). Lock v0.1 in week 2–3 even if imperfect; evolve later via DATA-010 findings. A late contract serializes both planes.

**Depends on:** SHARED-002 (D-decisions, esp. D4 for `tenant_id`), frozen invariants (§3 above). DATA-001.

**Unblocks:** CTR-002, CTR-007, DATA-003, PLAT-010 (Brayden's PHP SDK), DATA-004.

### Subtasks
1. 🤖 Define the **envelope** schema (every event has it): `tenant_id` (UUIDv7), `anonymous_id`, `event_id` (UUIDv7), `ts` (UTC ISO-8601), `source`, `version`, plus optional `lead_id`/`customer_id`.
2. 🤖 Define the **canonical event taxonomy** schemas (v0.1):
   `page_viewed`, `session_started`, `content_engaged`, `search_performed`, `lead_captured`, `form_submitted`, `appointment_booked`, `checkout_started`, `order_completed`.
3. 🤖 Write **golden fixture events** (valid + deliberately-invalid) for each.
4. 🤖 Build a tiny validator (Python `jsonschema`) that asserts fixtures validate; this becomes the seed of DATA-008.
5. 🤖 Set up **publishing**: registry version `0.1.0`; publish `@agency/event-contract@0.1.0` (npm) so Brayden can `npm install` it, and the PyPI/git-tag equivalent for my Python side.
6. 🤖 Document the **breaking-change process** in `contracts/README.md` (new major = parallel emit, deprecate old for 2 cycles, consumer CI fails on unknown/invalid events).

### ✋ MANUAL STEPS
- **M2.1 — npm publish access.** To publish `@agency/event-contract` I need an npm org + token, OR we publish via GitHub Packages (preferred — no extra account).
  - **Option A (recommended): GitHub Packages.** No new account. I'll add a `publishConfig` pointing at GitHub Packages; CI publishes using the built-in `GITHUB_TOKEN`. Nothing to copy manually.
  - **Option B: npmjs.com org.** Create org at npmjs.com → generate an automation token → add as repo secret `NPM_TOKEN`. Only if Brayden's repo can't read GitHub Packages.
  - **Decision to confirm with Brayden:** which registry. I'll default to GitHub Packages.
- **M2.2 — Confirm `tenant_id` format with Brayden** in writing (ADR) *before* publishing. Once published it's frozen.

**Acceptance:** Schemas validate the golden fixtures; `@agency/event-contract@0.1.0` published; Brayden can install it in `agency-platform`.
**Definition of Done:** Brayden confirms he can `composer/npm install` the contract and validate a sample event.

---

## ▶ STEP 3 — CTR-002 · Analytics SDK contract
*Roadmap Phase 1.*

**Goal:** A stable interface spec for `track(event, props)` / `identify(id, traits)` + batching/retry/consent semantics, with PHP **and** JS signatures, so Brayden integrates once and never breaks.

**Depends on:** CTR-001.
**Unblocks:** PLAT-010 (Brayden's PHP SDK), DATA-004 (my JS SDK).

### Subtasks
1. 🤖 Spec `track`, `identify`, batching strategy, retry/backoff, consent gating (no events before consent), and the wire format (the CTR-001 envelope).
2. 🤖 Write PHP + JS signatures (interface only, no impl).
3. 🤖 Provide a **mock SDK** + contract tests that prove a conforming SDK emits fixture-valid events.

**✋ MANUAL STEPS:** none (pure spec). Just a review sync with Brayden to accept the spec.
**Acceptance:** Brayden accepts the spec; mock SDK passes contract tests against CTR-001 fixtures.

---

## ▶ STEP 4 — CTR-003 · Dashboard API contract  &  CTR-005 · Feature-store contract
*Roadmap Phase 1. Grouped because both are spec-only and both unblock later me-only work.*

### CTR-003 — Dashboard API contract
**Goal:** OpenAPI `/v1` (metrics, timeseries, funnels, leads — all tenant-scoped) + a mock server, so the dashboard UI can be built before the real backend exists.
**Depends on:** CTR-004 (Brayden's owner-identity claim schema — I consume it). **I may be blocked here until Brayden drafts CTR-004; if so, stub the auth and proceed.**
**Subtasks:** 🤖 author OpenAPI spec; 🤖 stand up a mock server (e.g. Prism or a tiny FastAPI) returning contract-valid responses.
**Acceptance:** Mock server returns contract-valid responses; UI can build against it.

### CTR-005 — Feature-store contract
**Goal:** Feature-definition schema (entity = tenant/visitor/customer) + point-in-time read API spec.
**Depends on:** CTR-001.
**Acceptance:** Spec accepted; mock returns contract-valid features.

**✋ MANUAL STEPS:** none for these. **Coordination:** I need Brayden's CTR-004 claim schema to finalize CTR-003 auth — flag early.

> **End of Phase 1 gate:** all my contracts (001/002/003/005) published + mock servers live; D1–D4 signed. This is the §F integration checkpoint.

---

## ▶ STEP 5 — DATA-002 · Provision S3 event lake
*Roadmap Phase 2. First infra I touch. This needs AWS.*

**Goal:** S3 raw bucket storing Parquet, partitioned by `tenant_id/date`, with a Glue catalog over it.

**Depends on:** INFRA-002 (Brayden's Terraform backbone + VPC must exist). **Hard AWS blocker.**
**Unblocks:** DATA-003, DATA-006.

### Subtasks
1. 🤖 Write Terraform in `infra/modules/data-platform`: raw S3 bucket (versioned, encrypted, lifecycle rules), Glue database + crawler/catalog, partition scheme `tenant_id=.../date=...`.
2. 🤖 Open a PR to `infra` for Brayden to review/merge (I don't merge infra).
3. 🤖 Add a fixture Parquet file and confirm it's queryable via Athena.

### ✋ MANUAL STEPS
- **M5.1 — Get AWS SSO access (depends on Brayden's INFRA-001).** I'll receive an AWS IAM Identity Center invite email. Steps:
  1. Click the invite → set up my SSO user + MFA (authenticator app).
  2. Install AWS CLI v2 locally.
  3. Run `aws configure sso` → enter the SSO start URL Brayden gives me → pick the workloads account + my permission set → name the profile `agency-data`.
  4. Test: `aws sts get-caller-identity --profile agency-data` returns my identity.
- **M5.2 — Confirm Terraform state backend** with Brayden (the S3+DynamoDB backend from INFRA-002) so my module uses the shared state, not a local one.
- **M5.3 — PR review handoff:** I open the `data-platform` module PR; Brayden reviews and runs `terraform apply` from CI (apply is gated on merge in their setup).

**Acceptance:** `terraform apply` (via CI on merge) creates the lake; a fixture Parquet is queryable in Athena.

---

## ▶ STEP 6 — DATA-003 · Event ingestion endpoint
*Roadmap Phase 2. The live seam Brayden's SDK will hit.*

**Goal:** An HTTPS collector that validates incoming events against the schema registry, stamps/derives `tenant_id`, buffers, and writes via Kinesis Firehose → S3 lake. Invalid events rejected with clear errors.

**Depends on:** CTR-001, DATA-002.
**Unblocks:** PLAT-014 (Brayden wires his SDK to this), DATA-006.

### Subtasks
1. 🤖 Build the collector (FastAPI on Lambda+API Gateway, or a small Fargate service — decide with Brayden re: infra symmetry). Validate each event vs CTR-001 registry.
2. 🤖 On valid: enrich envelope, push to Kinesis Firehose → Parquet → S3 partitioned path.
3. 🤖 On invalid: 4xx with a structured error; log to a dead-letter location.
4. 🤖 Terraform for Firehose + delivery role in `data-platform` module (PR to Brayden).

### ✋ MANUAL STEPS
- **M6.1 — Public endpoint DNS.** I need a subdomain like `collect.<agencydomain>` pointing at the API Gateway/ALB. Route53 is Brayden's; I give him the target and he adds the record + ACM cert.
- **M6.2 — Confirm CORS origins** (which site domains may POST events) with Brayden so the collector only accepts our tenants.

**Acceptance:** Golden fixtures land in the lake; invalid events are rejected + logged.

---

## ▶ STEP 7 — DATA-004 · `analytics-sdk-js` (implements CTR-002)
*Roadmap Phase 2.*

**Goal:** Browser SDK: `track`/`identify`, consent gating, batching, `sendBeacon` on unload. Emits contract-valid events to the collector.

**Depends on:** CTR-002 (+ DATA-003 to test against a real endpoint).
**Unblocks:** PILOT-005 (GlowGirl instrumentation).

### Subtasks
1. 🤖 Implement the SDK in TS in `analytics-sdk-js/`; build to ESM + a `<script>` snippet.
2. 🤖 Consent gate (no events before consent), batch queue, retry, beacon-on-unload.
3. 🤖 Contract tests against CTR-001 fixtures + a local mock collector.
4. 🤖 Publish the npm package (same registry decision as M2.1).

**✋ MANUAL STEPS:** none beyond the npm/GitHub Packages publish path already set in M2.1.
**Acceptance:** Emits contract-valid events to ingestion; passes contract tests.

---

## ▶ STEP 8 — DATA-005 · Warehouse provisioning
*Roadmap Phase 2.*

**Goal:** Athena + Glue over the lake (start). Option: a single ClickHouse node later if event-analytics latency hurts. **No Snowflake/Databricks at this scale.**

**Depends on:** DATA-002.
**Unblocks:** DATA-006.

### Subtasks
1. 🤖 Terraform: Athena workgroup, results bucket, Glue tables over the lake partitions (PR to `data-platform`).
2. 🤖 Confirm SQL over fixture events returns rows.

**✋ MANUAL STEPS:** M5.1 SSO access (already done). Athena query results bucket cost/lifecycle confirmed with Brayden.
**Acceptance:** SQL over fixture events returns rows.

---

## ▶ STEP 9 — DATA-006 · dbt staging models
*Roadmap Phase 2.*

**Goal:** dbt project with sources + staging models that normalize each canonical event, with tests (not-null, accepted-values, uniqueness).

**Depends on:** CTR-001, DATA-005.
**Unblocks:** DATA-007, DATA-011.

### Subtasks
1. 🤖 `dbt-athena` profile wired to the Athena workgroup + Glue db.
2. 🤖 `sources.yml` over the raw lake tables; one `stg_<event>` model per canonical event.
3. 🤖 Schema tests; `dbt build` green on fixture data; dbt tests in CI.

**✋ MANUAL STEPS:** dbt profile needs AWS creds — uses my SSO profile locally and the OIDC role in CI (no static keys).
**Acceptance:** `dbt build` green on fixtures; CI runs dbt tests.

---

## ▶ STEP 10 — DATA-007 · Identity resolution v0
*Roadmap Phase 2.*

**Goal:** Stitch `anonymous_id → lead_id → customer_id` per tenant (deterministic first).
**Depends on:** DATA-006. **Unblocks:** DATA-011, DATA-017.
**Subtasks:** 🤖 deterministic stitching model + tests on fixture sessions.
**Acceptance:** Fixture sessions resolve to a single visitor across events.

---

## ▶ STEP 11 — DATA-008 · Schema-registry CI / contract tests
*Roadmap Phase 2. Protects parallel evolution of both planes.*

**Goal:** A shared contract-test GitHub Action that validates any emitter's sample events vs the registry and **fails platform PRs on drift** (runs in Brayden's repo too).
**Depends on:** CTR-001.
**Subtasks:** 🤖 package the validator as a reusable action; 🤖 wire it into both repos' CI.

### ✋ MANUAL STEPS
- **M11.1 — Add the action to Brayden's `agency-platform` CI.** Coordinate a PR; he owns that repo, so I open a PR and he merges. This is a §F coordination point.

**Acceptance:** A deliberately-broken event fails a platform CI run.

> **End of Phase 2:** ingestion accepts golden events; dbt staging green; identity v0 works; contract-CI guards both planes. This is the longest fully-parallel stretch — protect it.

---

## ▶ STEP 12 — DATA-009 · CDC pipeline: ops DBs → lake
*Roadmap Phase 3. Authoritative revenue/lead events — never trust the browser for money.*

**Goal:** Consume Brayden's server-emitted CTR-007 domain events (`order_completed`, etc.) into the lake as the source-of-truth stream; reconcile against client-side behavior events.
**Depends on:** CTR-007 (Brayden owns/emits), DATA-003.
**Unblocks:** trustworthy revenue marts (DATA-011).
**Subtasks:** 🤖 ingestion path for domain events; 🤖 reconciliation logic vs browser events.

### ✋ MANUAL STEPS
- **M12.1 — Align with Brayden on CTR-007 emission** (Service-layer fixture that emits a contract-valid domain event). §F coordination — "first live event end-to-end" is the mid-Phase-3 gate.

**Acceptance:** A test order produces a server-authoritative `order_completed` distinct from any browser event.

---

## ▶ STEP 13 — PILOT-005 · Instrument GlowGirl with the analytics SDK
*Roadmap Phase 4. Shared task — I lead instrumentation; Brayden provides hooks.*

**Goal:** JS SDK live on the GlowGirl storefront; verify every canonical event fires with correct `tenant_id`/identity.
**Depends on:** DATA-004, PLAT-014 (Brayden's runtime wiring).
**Unblocks:** DATA-010.

### File-split rule (Phase 4 — avoid conflicts with Brayden):
- **I own:** `resources/js/analytics`, event instrumentation, warehouse side.
- **Brayden owns:** `app/`, package usage, Filament, infra, commerce/booking.

**Subtasks:** 🤖 mount the SDK; 🤖 verify funnel `page_viewed → checkout_started → order_completed` lands in the lake for the GlowGirl tenant.
**✋ MANUAL STEPS:** confirm the GlowGirl staging domain is allowed in the collector CORS list (ties to M6.2).
**Acceptance:** Full funnel visible in the lake for the GlowGirl tenant.

---

## ▶ STEP 14 — DATA-010 · GlowGirl = first warehouse source
*Roadmap Phase 4. Proves the contract on real data.*

**Goal:** dbt marts populated from real GlowGirl events; validate identity resolution on a real funnel.
**Depends on:** PILOT-005, DATA-006/007.
**Subtasks:** 🤖 build marts on real events; 🤖 feed discrepancies back into **CTR-001 v0.2**.
**Acceptance:** Event contract proven end-to-end on real data.

> **§F gate:** PILOT-005 ↔ DATA-010 — real funnel in warehouse → bump CTR-001 to v0.2.

---

## ▶ STEP 15 — Phase 5 · Owner dashboard & semantic layer
*Dashboard reads marts only — never client DBs.*

- **DATA-011 — dbt core/marts (rollups):** daily/hourly per-tenant rollups (traffic, leads, conversion, revenue, top pages/funnels). *Depends:* DATA-006/007/009. *Acceptance:* marts match hand-computed numbers on GlowGirl.
- **DATA-012 — Semantic / metrics layer:** one definition per metric (dashboard == AI prompt). *Depends:* DATA-011.
- **DATA-013 — `dashboard-api` service:** FastAPI implementing CTR-003; tenant-scoped via CTR-004 tokens; reads marts/semantic. *Depends:* CTR-003, CTR-004, DATA-012.
- **DATA-014 — Near-real-time counters (OPTIONAL, scoped):** 1–5 min micro-batch for a tiny "live today" set only. **Do NOT build streaming analytics now — batch covers 95%.** (Roadmap §I flags over-building this.)

### ✋ MANUAL STEPS (Phase 5)
- **M15.1 — CTR-004 JWKS endpoint** from Brayden (owner-identity tokens). I verify tokens against his published JWKS — I need the JWKS URL + claim schema.
- **M15.2 — Dashboard hosting/domain** decision with Brayden (Filament panel vs Inertia app consuming `dashboard-api`). DASH-001 is a shared task.

**Joint:** DASH-001 (owner dashboard UI) — Julian data, Brayden shell. §F gate: dashboard reads real marts with owner identity.

---

## ▶ STEP 16 — Phase 6 · DATA-016 · Tenant lifecycle → data plane
**Goal:** Subscribe to CTR-006 lifecycle events; create/retire warehouse partitions + dashboard access per tenant; deprovision purges per-tenant data.
**Depends on:** CTR-006 (Shared/Brayden drafts), DATA-011.
**Acceptance:** New tenant auto-appears in dashboard scope; deprovision purges its data.

---

## ▶ STEP 17 — Phase 7 · AI foundation
*Turn the dataset into intelligence. This is the moat.*

- **DATA-017 — Feature store:** implements CTR-005 over marts (entities tenant/visitor/customer), point-in-time correct. *Depends:* CTR-005, DATA-011.
- **DATA-018 — `ai` package, tool-calling contract:** AI tools bind to Brayden's existing Services/Actions (`CreatePage`, `UpdateBlock`, `UploadMedia`) — agents call Services, never emit freeform HTML. *Depends:* PLAT services stable.
- **DATA-019 — Per-tenant RAG support bot:** pgvector per tenant; embed CMS blocks → grounded site support chat. **No cross-tenant leakage.** *Depends:* PLAT-004, DATA-018.
- **DATA-020 — AI page drafting in Filament (Shared):** "Draft with AI" → `block[]` validated against block schemas → draft status. *Depends:* DATA-018, PLAT-004.
- **DATA-021 — AI SEO audit (batch):** queue jobs proposing meta/alt-text/internal links fleet-wide. *Depends:* PLAT-006, DATA-011.

### ✋ MANUAL STEPS (Phase 7)
- **M17.1 — LLM API key** (checklist #5). Create at OpenAI/Anthropic → store in Secrets Manager, never in code. Set a spend cap.
- **M17.2 — pgvector**: a Postgres-with-pgvector instance per tenant (or a shared instance with tenant-scoped schemas) — infra PR to Brayden.
- **M17.3 — SHARED-004 privacy boundary** must be done before aggregating a *second* client's data for any cross-tenant model use. **Legal debt, not just technical.**

---

## ▶ STEP 18 — Phase 8 · DATA-022 · Warehouse scale tiering
**Goal:** Partition/clustering strategy; promote hot tenants to ClickHouse/Redshift Serverless only if Athena latency hurts.
**Depends on:** volume signals. *Acceptance:* dashboard p95 query < 2s at 100 tenants.
**Build only when the metrics say so — not before.**

---

# Shared tasks I participate in (calendar these with Brayden — roadmap §F)
- **SHARED-001** — shared CI templates (I consume in DATA-001).
- **SHARED-002** — ADR & docs process (capture D1–D4; I co-author the data-plane ADRs).
- **SHARED-004** — privacy / data-ownership boundary (per-tenant export + delete; consent; opt-in before cross-tenant model use). **Before client #2 aggregation.**
- **SHARED-006** — DR drills + observability (Sentry PHP+JS day 1, CloudWatch alarms, quarterly restore drills).
- **DASH-001** — owner dashboard UI (my data, Brayden's shell).
- **DATA-020** — AI drafting (my model, Brayden's Filament action).

---

# My critical-path note
My chain **CTR-001 → DATA-003 → DATA-006 → DATA-011 → DATA-013** runs fully parallel to Brayden and is **not** on the critical path to *onboarding* — but it **is** the critical path to the *intelligence* value prop. **Rule: stay ≤1 phase behind Brayden** so the event contract is validated against real data early. I also take the JS SDK, ingestion, and all `data-platform` Terraform PRs off Brayden's plate so I'm never his bottleneck. **I never edit platform packages; Brayden never writes Python.**

---

# Immediate next action
**STEP 1 (DATA-001).** The only hard blocker is creating the `agency-data` GitHub repo (M1.1) and installing `uv`/Node (M1.2). Everything else in Step 1 is local scaffolding Cascade can build now. Once the repo exists, we scaffold the monorepo, get CI green, and merge the first PR — then move to CTR-001.
