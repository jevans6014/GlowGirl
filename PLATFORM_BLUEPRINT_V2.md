# Platform Blueprint V2 — Principal-Level Review & Revised Architecture
**Companion + correction to `PLATFORM_BLUEPRINT.md`**
*Status: critical review. Read alongside v1, not instead of it.*

---

## 0. The one thing v1 gets structurally wrong

V1 is an excellent blueprint for **"build and host many isolated, beautifully-branded marketing/commerce sites."** It is *not* a blueprint for **"an operating system for small businesses with a trustworthy longitudinal data layer and an AI intelligence tier."** Those are the words in your brief, and they pull the architecture in the **opposite direction** from v1's core decision.

> **v1's central decision — database-per-client, app-per-client, total isolation — is the single best thing you can do for the operational plane and the single worst thing you can do for the intelligence plane.** Isolation is the enemy of aggregation. Intelligence requires aggregation.

V1 treats data/AI as **Phase 9** — an afterthought enabled "near-zero cost" by good service hygiene. That is wrong for your vision. If the long-term moat is *"a trustworthy representation of each business over time"* and cross-business intelligence, then the **data platform is not Phase 9. It is a Phase-0 foundation that runs in parallel to the sites from day one.** Retrofitting an analytics/event backbone onto 50 already-live isolated apps is a painful, multi-month project; designing it in now is cheap.

### The fix: two planes, designed separately, on purpose

| Plane | Purpose | Isolation model | Tech | Owner |
|---|---|---|---|---|
| **Operational plane** | Run each client's website, commerce, booking, CMS, admin | **Isolated** per client (security, blast radius) — keep v1 here | Laravel/Inertia/Filament, RDS db-per-client | Brayden |
| **Intelligence plane** | Capture events, build the longitudinal dataset, compute metrics, power the owner dashboard + AI | **Centralized**, multi-tenant by `tenant_id` (aggregation is the point) | Event bus → warehouse → semantic layer → dashboard/ML | Julian |

Everything else in this document follows from separating these two planes and connecting them with **one well-defined event contract**. V1 stays almost entirely intact as the operational plane. V2's new content is the intelligence plane and the scaling model.

---

## 1. Repository Strategy

### What v1 / your draft proposes
- v1: monorepo of `platform/*` Composer packages + `template/` + **one git repo per client** + `infra/`.
- Your draft: core platform repo + per-site repos + tooling repos.

These are basically the same idea and it's directionally right. But there are two real problems.

### Critique
1. **"One repo per client" is correct for the first ~10–20 hand-built clients and a liability beyond that.** If the vision is 100–500 SMBs, the majority will be 80–90% standard. A standard client should be **a row of configuration + a theme file + CMS content — not a git repository, a CI pipeline, and a Dockerfile.** Repo-per-client should be reserved for the long tail that genuinely needs bespoke code (GlowGirl's try-on). See §2 — this is the tenancy spectrum.
2. **Composer path/VCS packages get painful around a dozen packages and two engineers.** Private Packagist is fine; just budget for it now and don't hand-roll path repos across many client repos.

### Recommended structure
A **two-monorepo + thin-client-repo** model:

```
agency-platform/            (MONOREPO — the OS layer; Brayden-owned)
├── packages/               core, cms, commerce, booking, forms, ui, analytics-sdk, ai
├── runtime/                the SHARED multi-tenant Laravel app (standard-tier sites) ← NEW
├── template/               platform-template for TIER-1 (custom) client repos
└── docs/                   ADRs, runbooks

agency-data/                (MONOREPO — the intelligence plane; Julian-owned) ← NEW
├── ingest/                 event collector / API (or Kinesis Firehose config)
├── warehouse/              dbt models, schemas, identity-resolution, metrics/semantic layer
├── ml/                     feature pipelines, model training, AI services (Python)
└── dashboard-api/          read API the owner dashboard consumes

infra/                      (Terraform: cluster, shared-runtime, client-site, database, data-platform)

clients/                    (THIN repos — ONLY for tier-1 custom clients)
└── glowgirl/, client-x/    consume platform packages, hold bespoke code only
```

**Why two monorepos, not one mega-repo and not many small ones:** the platform plane is PHP and the data plane is Python with completely different toolchains, release cadences, and owners. Splitting them along the language/ownership boundary lets Brayden and Julian move independently without stepping on each other. Thin client repos exist only where bespoke code does.

---

## 2. Multi-Tenant Strategy

### Critique of v1's "Option C, never Option B"
V1 evaluates A (isolated) vs B (shared multi-tenant) vs C (hybrid app-per-client + shared packages) and picks C, explicitly saying *"don't build the multi-tenant product unless you pivot."* **At your stated target scale (100–500), that conclusion is wrong, or at least too binary.**

- App-per-client at 500 = **500 ECS services + ~500 databases**. Two engineers cannot operate, patch, on-call, and upgrade-wave 500 isolated stacks, even with Dependabot auto-merge. "Merge 500 green PRs" is not an operating model; it's a backlog.
- RDS practical limits bite: connection limits, max databases per instance, snapshot/maintenance windows, parameter-group changes fanning across many instances. You'll be forced into many RDS instances, multiplying cost and ops.
- **Tenancy is a spectrum, not a binary.** The honest architecture is **tiered**:

| Tier | Who | Runtime | Database | When |
|---|---|---|---|---|
| **T0 — Standard (the 80%)** | Cookie-cutter brochure/commerce SMBs | **Shared multi-tenant runtime** (`agency-platform/runtime`) | Shared cluster, **schema- or row-per-tenant** | Default for almost every new client |
| **T1 — Custom (the 20%)** | Clients needing bespoke features (try-on, integrations) | **Isolated app** (v1's Option C) | **db-per-client** | Promote from T0 when a feature can't be a block/config |
| **T2 — Premium/regulated** | High-traffic or compliance-sensitive | Isolated app + isolated infra | db-per-client, dedicated | Rare, by exception |

**Promotion path:** a client starts as T0 config-only. When they need bespoke code, you "eject" them to a T1 repo from the template, importing their content/theme. Demotion is rarely needed. This caps the number of isolated stacks to the *genuinely custom* subset — likely tens, not hundreds.

This directly resolves the §0 tension: **T0 shared runtime is also the cleanest source of standardized events** for the intelligence plane, because all standard sites emit through one codepath.

### Security
- **Operational isolation:** T1/T2 keep v1's strong isolation. T0 shared runtime needs the discipline v1 rightly fears — a single authz/tenant-scope bug = cross-tenant exposure. Mitigate with: a mandatory global `tenant_id` scope on every model (enforced by a base model + a static-analysis rule), tenant-aware connection/cache prefixes, and a dedicated Pest test suite that asserts cross-tenant denial on **every** resource. This is a solved problem (`stancl/tenancy`), but it must be treated as the highest-severity test surface in the codebase.
- **Intelligence plane** is multi-tenant by design; enforce `tenant_id` partitioning + row-level filtering at the query/semantic layer, and treat each client's raw data as **their** data (you are a processor — see §9 privacy).

---

## 3. Infrastructure Strategy

V1's operational infra (Fargate shared cluster, one ALB host-routing, CloudFront+WAF, S3, ElastiCache, Secrets Manager, Terraform, OIDC) is **solid — keep it for T1/T2.** Additions and corrections:

### Centralize
- **Shared T0 runtime** as a single autoscaling Fargate service (or a small set), not one-service-per-client. This is where most clients live and where infra cost stays flat as client count grows.
- **One event-ingestion path** (see §4) — centralized, not per-client.
- **Central warehouse** + dashboard-API service.
- **Central identity for business OWNERS** (the people logging into dashboards across the fleet). This is the one place **Cognito or a central Laravel identity service is justified** — and it's a *different* identity domain than site end-users. V1 says "no Cognito"; that's correct for **site end-user auth** but you do need a single owner-identity domain for the cross-fleet dashboard. Don't conflate the two.

### Isolate
- T1/T2 client app + database + secrets (v1's model).
- Per-client media buckets and CloudFront distributions (v1) — keep.

### Cost reality (the number v1 omits)
- v1: "~$15–45/client/mo." At 500 isolated clients that's **$90k–270k/yr in idle compute + DB floor alone**, before traffic. The tiered model collapses this: 500 T0 clients ride a handful of shared services; only the tens of T1/T2 clients carry per-client infra cost. **This is the difference between a viable and an unviable business at scale** — make the tier decision explicitly, not implicitly.
- Warehouse: start cheap (Postgres or **ClickHouse** for events, or **Redshift Serverless / Athena-on-S3**). Do **not** start on Snowflake/Databricks at 5 clients — over-spend. The data volume at <50 SMB sites is small; Athena + S3 (Parquet) or a single ClickHouse node handles it for ~tens of dollars/month.

---

## 4. Data Architecture (the new core — v1's biggest gap)

This is where most of the long-term value lives and where v1 says almost nothing. Treat the dataset as the product.

### 4.1 Event-driven backbone
```
[ site / app / Filament action ]
        │  emit canonical event (analytics-sdk)
        ▼
[ Ingestion API or Kinesis Firehose ]   ← one central endpoint, tenant_id stamped
        │  buffer + validate against schema registry
        ▼
[ S3 raw event lake (Parquet, partitioned by tenant/date) ]
        │  dbt / Glue transforms
        ▼
[ Warehouse: staging → core → marts ]   ← identity resolution, sessionization
        │
        ├─► [ Semantic / metrics layer ]  → Owner Dashboard API
        ├─► [ Feature store ]             → ML / AI
        └─► [ Reverse-ETL (optional) ]    → push insights back into Filament
```

### 4.2 What to collect (canonical event taxonomy — design this first)
Define a **versioned event contract** (a schema registry) so every site emits the same shapes. Minimum taxonomy:
- **Page/traffic:** `page_viewed`, `session_started`, referrer/UTM, device, geo (privacy-safe).
- **Engagement:** `content_engaged` (scroll/dwell), `search_performed`, `media_played`.
- **Conversion:** `lead_captured`, `form_submitted`, `appointment_booked`, `checkout_started`, `order_completed`, revenue.
- **Operational (server-side, authoritative):** order/booking/form rows replicated from operational DBs via CDC or domain events — **server-side events are the source of truth for revenue/leads; client-side events are for behavior.** Never trust the browser for money.

**Identity resolution** is the hard, valuable part: stitch `anonymous_id` → `lead` → `customer` across sessions and devices per tenant. Design the identity graph early; it's expensive to backfill.

### 4.3 Architectural rules
- **Operational DBs stay isolated; analytics is fed by events + CDC, NOT by the dashboard querying client DBs.** The owner dashboard must never run live queries against 50 production databases — that couples blast radius, kills isolation, and won't scale. Decouple via the event lake.
- **One definition of every metric** lives in the semantic/metrics layer (e.g. dbt metrics or a thin metrics service). "Conversion rate" must mean the same thing in the dashboard and in the AI prompt. This prevents the classic "every chart disagrees" failure.
- **Polyglot is fine and expected:** PHP emits events; Python (Julian) owns transforms + ML. The event lake is the contract between them.

---

## 5. Owner Dashboard Architecture

### Data modeling & computation
- Dashboard reads from **pre-aggregated marts** (daily/hourly rollups per tenant), never from raw events live and never from operational DBs.
- **Real-time vs batch:** **batch by default** (hourly/daily rollups cover 95% of SMB-owner needs — "how many leads this week," "top pages," "revenue this month"). Add **near-real-time** (1–5 min micro-batch or a streaming counter) only for a small set of "live today" counters. **Do not build a real-time streaming analytics system at 5 clients** — it's the most common premature-scaling mistake in this exact domain.
- Serve via a dedicated **dashboard read-API** (`agency-data/dashboard-api`) with tenant-scoped auth (central owner identity, §3). The Inertia/Vue dashboard app (could be a Filament panel early) consumes it.

### Scalability
- Pre-aggregation makes dashboard cost independent of query load and roughly linear in tenants × metrics, not in event volume × users. This scales to 500 clients trivially.

---

## 6. Engineering Workflow (two engineers — be realistic)

V1's roadmap quietly assumes a lot of senior platform engineering. With **two part-time engineers**, the honest risks are scope and timeline. Recommendations:

- **Split by plane, not by feature.** Brayden owns `agency-platform` (operational). Julian owns `agency-data` (intelligence) + AI. The **event contract** is the interface; agree it early and version it. This lets you parallelize and minimizes merge contention.
- **Trunk-based + short-lived branches + PR review.** Two people do **not** need Gitflow; long-lived branches will hurt you. Protect `main`, require green CI, small PRs.
- **CI/CD:** keep v1's OIDC/no-stored-keys design. Add the data plane: dbt CI (compile + test models on PR), and contract tests that fail a platform PR if it emits an event that violates the schema registry. **The schema registry is the thing that keeps the two planes from drifting.**
- **Environments:** v1's prod+staging per client is too heavy once you have T0. For T0, one shared staging + one shared prod. Per-client staging only for T1/T2.
- **Ruthlessly prefer managed services early.** With two people, every self-hosted thing is a tax. The v1 "Forge stepping stone" note is right — honor it longer than v1 implies. Don't stand up Reverb, a fleet dashboard, or streaming analytics until a paying need exists.

---

## 7. Future Scaling — what today's decisions do at 10 / 50 / 100 / 500

| Decision | 10 | 50 | 100 | 500 |
|---|---|---|---|---|
| **App-per-client (v1 pure)** | fine | strained | painful | **breaks** (ops + cost) |
| **Tiered runtime (V2)** | fine | fine | fine | **fine** (only tens isolated) |
| **Dashboard queries client DBs** | works | slow/fragile | **breaks** | n/a |
| **Event lake + marts (V2)** | slight over-build | paying off | essential | essential |
| **db-per-client operational** | great | great | great (T1/T2) | great (T1/T2 only) |
| **No central event contract** | invisible debt | hurts | **very expensive to retrofit** | catastrophic |
| **Manual upgrade waves** | fine | tolerable | needs automation | needs T0 (one deploy) |
| **Real-time analytics built early** | wasted effort | wasted effort | maybe useful | useful |

**The decisions that help you later if made now:** the event contract/schema registry, the operational/intelligence plane split, and a shared T0 runtime path. **The decisions that hurt you later if not corrected now:** pure app-per-client as the only model, and any dashboard/AI design that reaches into operational DBs.

---

## 8. Proposed V2 Blueprint (the deltas to apply to v1)

Keep all of v1 as the **operational plane** with these changes:

1. **Add a tenancy tier model** (§2). New clients default to **T0 shared runtime**; eject to **T1 isolated repo** only for bespoke code. Build the shared multi-tenant runtime as `agency-platform/runtime` using `stancl/tenancy`, with cross-tenant denial as the top test priority.
2. **Add the intelligence plane** (`agency-data` monorepo, §4): central event ingestion → S3 lake → warehouse → semantic layer → dashboard-API + feature store. Ship a thin `analytics-sdk` package in M1 so **every site emits canonical events from day one** (this is the cheap, high-leverage move).
3. **Define the event contract / schema registry in M0–M1**, before the second client. This is the new highest-priority foundational artifact alongside the CMS block model.
4. **Decouple the owner dashboard from operational DBs** entirely; it reads marts only.
5. **Add a central owner-identity domain** (separate from site end-user auth) for cross-fleet dashboard access.
6. **Accept polyglot:** PHP operational plane, Python data/ML plane, connected by the event lake.
7. **Reconsider D2 (Vue vs React):** given Julian builds POCs, the broader React talent/AI-tooling ecosystem, and v1's own ~40%-cheaper-pilot note — **React + Inertia is the lower-risk default** unless Brayden has a strong Vue preference he'll hold for a decade. Decide once, but decide with the data-plane/POC reality in mind.
8. **Right-size cost:** tiered runtime + cheap warehouse (Athena/S3 or single ClickHouse) early; defer Snowflake/Datadog/Reverb/streaming until a paying need exists.

### Revised plane diagram
```
                         ┌───────────────────────────────────────────┐
                         │            INTELLIGENCE PLANE               │
   events (sdk) ───────► │  ingest → S3 lake → warehouse → semantic    │
   CDC from ops DBs ───► │            → dashboard-API + feature store  │
                         │            → AI services (Python)           │
                         └───────────────▲───────────────┬────────────┘
                                         │ events/CDC     │ insights (reverse-ETL)
   ┌─────────────────────────────────────┴───────────────▼────────────┐
   │                       OPERATIONAL PLANE                            │
   │  T0 shared runtime (most clients)   T1/T2 isolated apps (custom)   │
   │  RDS shared (row/schema tenant)     RDS db-per-client              │
   │  ── all built from agency-platform/* packages ──                  │
   └───────────────────────────────────────────────────────────────────┘
   Owner Dashboard ──reads marts via dashboard-API (central owner identity)──┘
```

### Revised milestone deltas
- **M0:** + define event contract v0.1 + schema registry; + provision the data lake (S3 + Athena/ClickHouse) skeleton.
- **M1:** + `analytics-sdk` package (emit canonical events); + shared T0 runtime skeleton with tenant-scoping + cross-tenant test suite.
- **M2 (GlowGirl):** instrument the pilot to emit events; pilot becomes the first warehouse data source and proves the event contract end-to-end.
- **M4+ (client #2):** onboard as **T0 config-only** to prove the no-repo path and the ≤5-ED KPI; reserve T1 ejection for proven bespoke need.
- **Months 4–6:** owner dashboard v0 reading marts; identity-resolution v0.
- **Months 7–12:** `ai` package consumes the feature store (per-site RAG via per-tenant pgvector is fine; cross-business intelligence reads central features).

---

## 9. Risks v1 under-weights

- **Privacy / data ownership.** A central cross-business dataset makes you a **data processor** for each client and raises real questions: consent, per-client data export/deletion, and whether you may use one client's data to train models that benefit others. Decide the contractual + technical boundary **before** you aggregate. Partition hard by `tenant_id`; make cross-tenant model use an explicit, opt-in, contractual decision.
- **The shared-runtime authz bug** is now your top existential risk (it wasn't in pure v1). Treat tenant-scope tests as release-blocking.
- **Two-engineer bandwidth.** V1 + the data plane is a lot. Sequence ruthlessly: operational plane + event emission first (you can't backfill events), warehouse/dashboard/AI pulled by paying demand. Emit early, analyze later.
- **The dataset is the moat, the sites are the cost of acquiring it.** Frame priorities accordingly: anything that protects event quality/coverage outranks most site-side polish.

---

## 10. What v1 got right (keep, don't touch)
Inertia monolith over SPA+API; Tailwind v4 tokens over SCSS; the lean block-based CMS; service/action layer discipline (which is also what makes AI tool-calling cheap); Terraform + OIDC; db-per-client **for the operational plane**; the zero-risk GlowGirl pilot strategy; the migration roadmap shape; the engineer-days-per-site KPI. The operational engineering in v1 is genuinely strong — V2 doesn't replace it, it adds the plane v1 left out and caps the scaling model v1 left open-ended.
