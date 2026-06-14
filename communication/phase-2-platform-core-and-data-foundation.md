# Phase 2 — Platform Core ‖ Data Foundation (fully parallel)

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 2" (Brayden track `PLAT-002…010`, Julian track `DATA-002…008`).
> **Glossary:** [Block](./GLOSSARY.md#operational-plane-plumbing), [Filament](./GLOSSARY.md#operational-plane-plumbing), [data lake](./GLOSSARY.md#data-plane-plumbing), [Parquet](./GLOSSARY.md#data-plane-plumbing), [Kinesis Firehose](./GLOSSARY.md#data-plane-plumbing), [Athena](./GLOSSARY.md#data-plane-plumbing), [dbt](./GLOSSARY.md#data-plane-plumbing), [identity resolution](./GLOSSARY.md#identity--events).

## 5-Question Snapshot
- **What:** The longest parallel stretch. Brayden builds the reusable CMS/website packages; Julian builds the pipeline that ingests events and turns them into queryable tables. They share **zero files** — only the Phase 1 contracts. **Everything runs locally.**
- **Why:** This is the cheapest velocity you'll ever get — two people building non-overlapping halves at full speed, with instant local feedback.
- **What code:** *(Brayden)* `core`, `cms`, `ui`, `forms` PHP packages + the PHP SDK. *(Julian)* **Local MinIO lake**, ingestion endpoint, JS SDK, **local dbt warehouse**, identity resolution, contract CI.
- **Decisions needed from you:** Collector local port (default `:8080`); dbt target (local Postgres vs DuckDB).
- **Next step (Julian):** `DATA-002` — configure MinIO buckets + local Postgres warehouse database.

---

## What is this?
Two independent build tracks running at the same time:
- **Operational track (Brayden):** the Lego bricks of a client website — authentication/roles (`core`), the page+[block](./GLOSSARY.md#operational-plane-plumbing) CMS (`cms`), the design-token component library (`ui`), forms, and a starter template repo that boots a styled site in under an hour. **Runs locally via `php artisan serve` or docker-compose.**
- **Intelligence track (Julian):** the plumbing that catches events and makes them analyzable — a raw [data lake](./GLOSSARY.md#data-plane-plumbing) in **local MinIO**, an HTTP ingestion endpoint (local FastAPI/Flask), the browser SDK, a **local Postgres + [dbt](./GLOSSARY.md#data-plane-plumbing) warehouse**, and identity stitching. **All queryable locally in seconds.**

## Why are we building it?
- **Business reason:** The operational packages are the product you sell (websites you can spin up cheaply). The data pipeline is the moat (insight no competitor has). Both need to exist before the pilot.
- **Technical reason:** Because Phase 1 froze the contracts, these two tracks genuinely don't need to talk. Protecting that isolation is what keeps the timeline short.

## What problem does it solve?
- *(Operational)* Stops every client site from being hand-built — pages become editable [block](./GLOSSARY.md#operational-plane-plumbing) content in [Filament](./GLOSSARY.md#operational-plane-plumbing), themed by swapping a token file.
- *(Intelligence)* Gives events a permanent, cheap, queryable home. Raw events land as [Parquet](./GLOSSARY.md#data-plane-plumbing) in S3; [dbt](./GLOSSARY.md#data-plane-plumbing) turns them into clean tables; [identity resolution](./GLOSSARY.md#identity--events) ties one person's actions into one timeline.

## What does success look like?
- *(Brayden)* A page of 3 block types renders via Inertia and is editable in Filament; the template boots a styled CMS site in <1 day without touching package code; the PHP SDK emits contract-valid events **to the local collector**.
- *(Julian)* Golden fixture events land in **MinIO** (visible in web UI at `:9001`); invalid events are rejected with clear errors; `dbt build` is green on fixture data **running against local Postgres**; fixture sessions resolve to a single visitor; a deliberately-broken event fails platform CI. **You can query staging tables locally via `psql` or TablePlus.**

## What systems are involved?
**Julian's track (the part you implement) — all local:**
| Task | What it builds | Repo / Service |
|:-----|:---------------|:---------------|
| DATA-002 | **MinIO buckets** (Parquet, partitioned `tenant_id/date`) + local Postgres warehouse DB | `docker-compose.yml` + `agency-data/warehouse` |
| DATA-003 | **Local HTTP collector** (FastAPI/Flask) → writes to MinIO | `agency-data/ingest` (runs in docker-compose) |
| DATA-004 | Browser SDK (`track`/`identify`, consent, batching) → posts to `localhost:8080` | `agency-data/analytics-sdk-js` |
| DATA-005 | **Local dbt connection** to Postgres (or DuckDB reading MinIO Parquet) | `agency-data/warehouse/profiles.yml` |
| DATA-006 | dbt staging models (one per event) + schema tests | `agency-data/warehouse` |
| DATA-007 | Identity resolution v0 (`anonymous_id → lead_id → customer_id`) | `agency-data/warehouse` |
| DATA-008 | Cross-repo contract-test CI action | `agency-data` + Brayden's CI |

**Brayden's track (context, not your code):** `agency-platform/packages/{core,cms,ui,forms}`, `platform-template`, `analytics-sdk-php`.

## What are we building first? (Julian's order)
1. **DATA-002** — MinIO buckets + local Postgres warehouse DB. *No AWS needed — runs in docker-compose.*
2. **DATA-003** — local ingestion endpoint (validates against CTR-001, writes Parquet to MinIO).
3. **DATA-004** — the JS SDK (test it against `http://localhost:8080/collect`).
4. **DATA-005 → DATA-006 → DATA-007** — dbt local connection, then staging models, then identity.
5. **DATA-008** — wire the contract test into both repos' CI.

## What decisions require my input?
- **Collector local port** — default `:8080` (confirm no conflict on your machine).
- **dbt target** — local Postgres (simpler, same as production) vs DuckDB (faster for Parquet, different SQL dialect). Recommend Postgres for consistency.
- **MinIO bucket names** — default `events-raw` and `events-processed` (arbitrary, local-only).
- **AWS decisions deferred to Phase 9** — no SSO, no Lambda vs Fargate, no public domain needed yet.

## What can be ignored for now?
- **Real-time/streaming** ingestion — batch writes to MinIO are enough; streaming is explicitly deferred (Phase 5/8).
- **Cloud warehouses** — Snowflake/Databricks/ClickHouse/Athena are Phase 9 concerns. Local Postgres or DuckDB prove the concept.
- **Marts and dashboards** — Phase 5. Phase 2 stops at clean staging + identity.
- **The pilot's real data** — Phase 2 runs entirely on golden fixtures; real GlowGirl data arrives in Phase 4.
- **AWS anything** — S3, Kinesis, Glue, Athena, IAM — all deferred to Phase 9.

---

## Status — what's actually done
- 🟢 **Phase 2 COMPLETE (Julian's track)** — All DATA tasks finished:
  - ✅ DATA-002: MinIO buckets + Postgres warehouse DB (docker-compose)
  - ✅ DATA-003: Event collector (FastAPI, validates CTR-001, writes to MinIO)
  - ✅ DATA-004: Browser SDK (batching, consent, retry, sendBeacon, UUIDv7)
  - ✅ DATA-005: dbt profiles.yml (local Postgres connection)
  - ✅ DATA-006: dbt staging models (5 event types: page_viewed, session_started, form_submitted, lead_captured, order_completed)
  - ✅ DATA-007: Identity resolution (identity_graph mart stitching anonymous_id → lead_id → customer_id)
  - 📋 DATA-008: Cross-repo contract CI (deferred to Phase 3 integration)
- **Verification:** See `agency-data/PHASE2_VERIFICATION.md` for end-to-end testing guide
- **No AWS dependencies** — entire pipeline runs locally
- ⚪ **Brayden's track:** CMS packages, PHP SDK (tracked separately)

**Ready for Phase 3:** Multi-tenant runtime + event emission integration
