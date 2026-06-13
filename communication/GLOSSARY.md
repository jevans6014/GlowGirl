# Glossary — every acronym and term, defined once

When a phase doc uses one of these, it links here. Each entry says **what it is**, **why it
matters**, and **where it shows up in our system**.

---

## Core concepts

**Operational plane** — The half of the platform that runs the websites: the CMS, commerce,
booking, the multi-tenant runtime, and deployments. Owned by Brayden. Repos: `infra`,
`agency-platform`, `platform-template`. *It emits events.*

**Intelligence plane** — The half that turns behavior into insight: ingestion, the warehouse,
the dashboard API, AI. Owned by Julian. Repo: `agency-data`. *It consumes events.*

**Contract** — A versioned, published interface between the two planes (a JSON Schema, an OpenAPI
spec, etc.). Both sides depend on the contract, not on each other's code. This is what lets us
build in parallel. Contracts live in a repo's `/contracts` folder and are semver-versioned.

**Tenant** — One client business on the platform (e.g. GlowGirl). Everything is scoped by a
`tenant_id` so one client can never see another's data.

**Tier (T0/T1/T2)** — How much isolation a tenant gets (decision **D4**):
- **T0** = shared runtime. The client is just rows + theme config in one shared app. Cheapest; most clients live here.
- **T1** = isolated app + isolated database. For clients needing custom code (GlowGirl's try-on).
- **T2** = premium isolated (dedicated resources/SLAs).
Why it matters: 500 fully-isolated stacks would cost ~$90k–270k/yr just sitting idle, so T0 is mandatory, not optional.

**ED (Engineer-Days)** — The KPI for onboarding cost. Goal: a standard new client reaches styled
staging in **≤5 engineer-days**, with no bespoke code.

---

## Identity & events

**Event** — A single recorded user/system action (e.g. `page_viewed`, `order_completed`) in a
standard JSON shape. The raw material of the entire intelligence plane.

**Envelope** — The common fields on every event: `tenant_id`, `anonymous_id`, `event_id`, `ts`
(UTC timestamp), `source` (`web`/`server`), `version`, `event` name. Frozen after Phase 1.

**`anonymous_id` → `lead_id` → `customer_id`** — The identity ladder. A visitor starts anonymous,
becomes a known lead (gave contact info), then a paying customer. **Identity resolution** stitches
these so one person's whole journey is a single timeline.

**UUIDv7** — A time-ordered universally-unique ID format. We use it for `tenant_id` and `event_id`
because it sorts by creation time (good for partitioning the lake by time). Frozen by **D4/CTR-006**.

**CDC (Change Data Capture)** — Capturing authoritative server-side events (real orders, refunds)
rather than trusting the browser. Used so revenue numbers are correct even if a browser event is
lost or faked. Lives in `agency-data/ingest`, driven by contract **CTR-007**.

---

## Data plane plumbing

**Event lake / data lake** — Raw events stored cheaply as Parquet files in **S3**, partitioned by
`tenant_id/date`. The append-only source of truth before any transformation.

**Parquet** — A compressed, columnar file format that's cheap to store and fast to query for
analytics. What the lake is made of.

**Kinesis Firehose** — AWS managed service that buffers incoming events and writes them to S3 in
batches. Sits between the ingestion endpoint and the lake so we don't need to run Kafka.

**Glue catalog** — AWS's table metadata layer that makes the S3 Parquet files look like SQL tables.

**Athena** — AWS serverless SQL engine that queries the Parquet files in S3 directly. Our starting
query engine (no Snowflake/Databricks at this scale).

**dbt (data build tool)** — A framework for writing SQL transformations as version-controlled,
tested models. We use it to turn raw events into clean **staging** models, then **marts**.

**Staging model** — A dbt model that cleans/normalizes one raw event type. First transform layer.

**Mart** — A dbt model that aggregates staging data into business-ready tables (daily traffic,
conversion, revenue per tenant). What the dashboard reads.

**Semantic / metrics layer** — One canonical definition per metric (e.g. "conversion rate") so the
dashboard and an AI prompt compute it identically. Prevents two "truths" for the same number.

**Feature store** — A place that serves consistent, point-in-time-correct inputs ("features") to
ML models, defined over the marts. Contract **CTR-005**.

**RAG (Retrieval-Augmented Generation)** — An AI pattern where the model answers using retrieved
documents (here: a client's own CMS content) instead of guessing. Powers the per-tenant support bot.

**pgvector** — A PostgreSQL extension for storing/searching vector embeddings. Backs RAG, one store
per tenant so content never leaks across clients.

---

## Operational plane plumbing

**Laravel** — The PHP web framework the operational plane is built on.

**Inertia** — A library that lets a Laravel backend drive a React frontend without building a
separate API. "Inertia monolith" (D1) = one app, server-rendered React pages.

**Filament** — A Laravel admin-panel framework. The CMS editing UI (where a client edits their
site content) is built with Filament.

**Block / block registry** — A CMS page is built from reusable **blocks** (hero, gallery, FAQ,
product-grid…). Each block = a Filament editor schema + a React renderer + a TypeScript type. The
registry is the list of available block types. AI drafting must output valid blocks, never raw HTML.

**FrankenPHP** — A modern PHP application server packaged as a single container; our "golden"
runtime image for every PHP app.

**stancl/tenancy** — The Laravel package that enforces multi-tenancy (scoping every query to a
`tenant_id`) in the shared T0 runtime.

**Services / Actions layer** — Brayden's pattern where business operations (`CreatePage`,
`UpdateBlock`, `UploadMedia`) are first-class classes. AI tools call these, so the AI can't bypass
validation or tenant scoping.

---

## Infrastructure & delivery

**Terraform / IaC (Infrastructure as Code)** — Infrastructure defined in version-controlled files
and applied via CI, not clicked together by hand. Lives in `infra`.

**OIDC (OpenID Connect)** — Lets GitHub Actions assume an AWS role to deploy **without any stored
secret keys**. The keyless-deploy mechanism for both repos.

**AWS SSO / IAM Identity Center** — How humans log into AWS (with MFA) instead of long-lived access
keys. Julian gets console + CLI access this way.

**VPC** — A private AWS network the services run inside.

**ECR** — AWS's container image registry; where the FrankenPHP base image is pushed.

**ECS / Fargate** — AWS's serverless container runtime; where the apps actually run.

**ALB (Application Load Balancer)** — Routes incoming web requests; uses the host header to send
each client's domain to the right tenant.

**RDS** — AWS managed PostgreSQL. T1/T2 clients get their own database here; T0 clients share one.

**RDS Proxy** — Connection pooler in front of RDS; mandatory at scale because hundreds of databases
would otherwise exhaust connection limits.

**CloudFront** — AWS CDN that caches and serves sites/media fast and over HTTPS.

**WAF (Web Application Firewall)** — Filters malicious web traffic in front of CloudFront/ALB.

**SES** — AWS email-sending service (form notifications, mailables).

**ACM** — AWS Certificate Manager; issues the HTTPS certificates per client domain.

**Secrets Manager** — Where credentials live in AWS (never in code or `.env` committed to git).

---

## Process & quality

**ADR (Architecture Decision Record)** — A short markdown doc capturing one decision and its
rationale, so we don't re-litigate it later. D1–D4 each become an ADR.

**CI (Continuous Integration)** — Automated lint/type/test/build that runs on every PR. Must be
green to merge.

**CODEOWNERS** — A GitHub file that enforces who must review which paths — used to stop one engineer
from accidentally editing the other plane's code.

**Semver (semantic versioning)** — `MAJOR.MINOR.PATCH`. Breaking changes bump MAJOR; that's how
contracts evolve safely.

**E2E (end-to-end) test** — A test driving the real app like a user (via Playwright): browse → cart
→ checkout → see the order in admin.

**RPO / RTO** — Disaster-recovery targets. **RPO** = max acceptable data loss (≤24h). **RTO** = max
acceptable downtime to restore (≤4h).

**SBOM (Software Bill of Materials)** — A list of everything inside a container image, scanned for
vulnerabilities in CI.
