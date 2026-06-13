# Phase 2 — Platform Core ‖ Data Foundation (fully parallel)

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 2" (Brayden track `PLAT-002…010`, Julian track `DATA-002…008`).
> **Glossary:** [Block](./GLOSSARY.md#operational-plane-plumbing), [Filament](./GLOSSARY.md#operational-plane-plumbing), [data lake](./GLOSSARY.md#data-plane-plumbing), [Parquet](./GLOSSARY.md#data-plane-plumbing), [Kinesis Firehose](./GLOSSARY.md#data-plane-plumbing), [Athena](./GLOSSARY.md#data-plane-plumbing), [dbt](./GLOSSARY.md#data-plane-plumbing), [identity resolution](./GLOSSARY.md#identity--events).

## 5-Question Snapshot
- **What:** The longest parallel stretch. Brayden builds the reusable CMS/website packages; Julian builds the pipeline that ingests events and turns them into queryable tables. They share **zero files** — only the Phase 1 contracts.
- **Why:** This is the cheapest velocity you'll ever get — two people building non-overlapping halves at full speed.
- **What code:** *(Brayden)* `core`, `cms`, `ui`, `forms` PHP packages + the PHP SDK. *(Julian)* S3 lake, ingestion endpoint, JS SDK, Athena/dbt warehouse, identity resolution, contract CI.
- **Decisions needed from you:** AWS region/cost confirmations for the lake/warehouse; ingestion deployment shape (Lambda vs Fargate); the collector's public domain.
- **Next step (Julian):** `DATA-002` — provision the S3 event lake (needs AWS SSO access first).

---

## What is this?
Two independent build tracks running at the same time:
- **Operational track (Brayden):** the Lego bricks of a client website — authentication/roles (`core`), the page+[block](./GLOSSARY.md#operational-plane-plumbing) CMS (`cms`), the design-token component library (`ui`), forms, and a starter template repo that boots a styled site in under an hour.
- **Intelligence track (Julian):** the plumbing that catches events and makes them analyzable — a raw [data lake](./GLOSSARY.md#data-plane-plumbing) in S3, an HTTPS ingestion endpoint, the browser SDK, an [Athena](./GLOSSARY.md#data-plane-plumbing)+[dbt](./GLOSSARY.md#data-plane-plumbing) warehouse, and identity stitching.

## Why are we building it?
- **Business reason:** The operational packages are the product you sell (websites you can spin up cheaply). The data pipeline is the moat (insight no competitor has). Both need to exist before the pilot.
- **Technical reason:** Because Phase 1 froze the contracts, these two tracks genuinely don't need to talk. Protecting that isolation is what keeps the timeline short.

## What problem does it solve?
- *(Operational)* Stops every client site from being hand-built — pages become editable [block](./GLOSSARY.md#operational-plane-plumbing) content in [Filament](./GLOSSARY.md#operational-plane-plumbing), themed by swapping a token file.
- *(Intelligence)* Gives events a permanent, cheap, queryable home. Raw events land as [Parquet](./GLOSSARY.md#data-plane-plumbing) in S3; [dbt](./GLOSSARY.md#data-plane-plumbing) turns them into clean tables; [identity resolution](./GLOSSARY.md#identity--events) ties one person's actions into one timeline.

## What does success look like?
- *(Brayden)* A page of 3 block types renders via Inertia and is editable in Filament; the template boots a styled CMS site in <1 day without touching package code; the PHP SDK emits contract-valid events.
- *(Julian)* Golden fixture events land in the lake; invalid events are rejected with clear errors; `dbt build` is green on fixture data; fixture sessions resolve to a single visitor; a deliberately-broken event fails platform CI.

## What systems are involved?
**Julian's track (the part you implement):**
| Task | What it builds | Repo / Service |
|:-----|:---------------|:---------------|
| DATA-002 | S3 raw bucket (Parquet, partitioned `tenant_id/date`) + Glue catalog | `infra/modules/data-platform` (PR → Brayden) |
| DATA-003 | HTTPS event collector → Kinesis Firehose → S3 | `agency-data/ingest` |
| DATA-004 | Browser SDK (`track`/`identify`, consent, batching) | `agency-data/analytics-sdk-js` |
| DATA-005 | Athena workgroup + Glue tables over the lake | `infra/modules/data-platform` (PR) |
| DATA-006 | dbt staging models (one per event) + schema tests | `agency-data/warehouse` |
| DATA-007 | Identity resolution v0 (`anonymous_id → lead_id → customer_id`) | `agency-data/warehouse` |
| DATA-008 | Cross-repo contract-test CI action | `agency-data` + Brayden's CI |

**Brayden's track (context, not your code):** `agency-platform/packages/{core,cms,ui,forms}`, `platform-template`, `analytics-sdk-php`.

## What are we building first? (Julian's order)
1. **DATA-002** — the S3 lake. *Hard blocker: needs AWS access + Brayden's VPC/state backend from Phase 0.*
2. **DATA-003** — ingestion endpoint (validates against CTR-001, writes to the lake).
3. **DATA-004** — the JS SDK (test it against the live endpoint).
4. **DATA-005 → DATA-006 → DATA-007** — warehouse, then dbt staging, then identity.
5. **DATA-008** — wire the contract test into both repos' CI.

## What decisions require my input?
- **AWS SSO access** — Julian needs an IAM Identity Center login to the workloads account (Brayden provisions it). Blocks everything in this phase.
- **Ingestion deployment shape** — collector on **Lambda + API Gateway** vs a small **Fargate** service. Pick for symmetry with Brayden's infra.
- **Collector public domain** — e.g. `collect.<agencydomain>` (Brayden adds the Route53 record + cert).
- **Region + cost guardrails** — S3 lifecycle rules, Athena results-bucket lifecycle.

## What can be ignored for now?
- **Real-time/streaming** ingestion — batch via Firehose is enough; streaming is explicitly deferred (Phase 5/8).
- **Snowflake/Databricks/ClickHouse** — start on Athena; only revisit if query latency hurts (Phase 8 / DATA-022).
- **Marts and dashboards** — Phase 5. Phase 2 stops at clean staging + identity.
- **The pilot's real data** — Phase 2 runs entirely on golden fixtures; real GlowGirl data arrives in Phase 4.

---

## Status — what's actually done
- ⚪ **Not started.** Phase 2 begins once AWS SSO access exists. Note the JS SDK (`DATA-004`) already has a stubbed `track`/`identify` interface scaffolded in `agency-data/analytics-sdk-js` from Phase 0.
- Detailed step-by-step build order for Julian's track is in [`../JULIAN_TASK_PLAN.md`](../JULIAN_TASK_PLAN.md) Steps 5–11.
