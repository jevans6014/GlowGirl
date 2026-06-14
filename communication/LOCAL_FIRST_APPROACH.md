# Local-First Development Strategy

> **Core principle:** Prove the entire platform works locally with visual feedback, complete data capture, and passing tests **before** touching AWS infrastructure.

## Why local-first?

**Business reason:** AWS costs money from day one and adds deployment complexity that slows iteration. A fully-local stack lets you validate the concept, refine the architecture, and catch integration bugs in minutes instead of hours.

**Technical reason:** Local development with docker-compose gives you:
- **Instant feedback loops** — code → refresh → see changes in <5 seconds
- **Zero cloud costs** during development
- **Reproducible environments** — every engineer gets identical infrastructure
- **Visual progress** — live local servers you can click through
- **Complete data inspection** — query the local database, inspect S3-equivalent storage, tail logs
- **Fast testing** — no network latency, no rate limits, no AWS credential juggling

## The local stack (what replaces AWS during development)

| Production (AWS) | Local equivalent | Why |
|:-----------------|:-----------------|:----|
| RDS Postgres | `postgres:16` container | Identical SQL dialect, full feature parity |
| S3 event lake | MinIO (`minio/minio`) | S3-compatible API, browse files in web UI |
| Kinesis Firehose | Direct writes to MinIO | Simpler; Firehose is just a buffer |
| Athena + Glue | DuckDB or local Postgres with dbt | Query Parquet files or tables directly |
| ECS Fargate | `docker-compose` services | Same containers, orchestrated locally |
| ALB + CloudFront | `nginx` or direct ports | Route to multi-tenant runtime |
| ElastiCache Redis | `redis:7` container | Identical API |
| Secrets Manager | `.env` files (gitignored) | Explicit, auditable, no API calls |

## The revised phase sequence

### Phase 0 — Local Foundations
- **What changes:** Skip AWS entirely. Set up `docker-compose.yml` with Postgres, Redis, MinIO, and a local nginx reverse proxy.
- **Success:** `docker-compose up` boots the full stack; you can browse MinIO at `localhost:9001`, query Postgres, and see Redis keys.
- **No AWS:** INFRA-001/002/003 deferred to Phase 9.

### Phase 1 — Contracts (unchanged)
- Contracts are infrastructure-agnostic; local validation works identically.
- **Success:** Contract tests pass locally; mock servers run in docker-compose.

### Phase 2 — Platform Core + Data Foundation (local-only)
- **Operational track (Brayden):** CMS packages run against local Postgres; `php artisan serve` or FrankenPHP in docker.
- **Intelligence track (Julian):**
  - Event collector runs locally (FastAPI or Flask), writes to MinIO.
  - JS SDK posts to `http://localhost:8080/collect`.
  - dbt runs against local Postgres or DuckDB reading Parquet from MinIO.
- **Success:** Golden fixture events flow end-to-end locally; dbt models build; you can query staging tables in a local SQL client.

### Phase 3 — Shared Runtime (local multi-tenancy)
- **What changes:** The T0 runtime runs in docker-compose with `stancl/tenancy` against local Postgres.
- **Success:** Two seeded tenants serve isolated content at `tenant1.localhost:8000` and `tenant2.localhost:8000`; events land in local MinIO; cross-tenant denial tests pass.
- **Visual proof:** Open both tenant URLs in browser tabs, see different content, check MinIO web UI for their events.

### Phase 4 — GlowGirl Pilot (local staging)
- **What changes:** GlowGirl runs locally as a T1 app; try-on feature works at `glowgirl.localhost:8000`.
- **Success:** Founder edits content in Filament running locally; funnel query returns results from local dbt marts; E2E tests (Playwright) pass against `localhost`.
- **Visual proof:** Click through the full customer journey locally, watch events appear in MinIO, query the funnel in local Postgres.

### Phase 5–8 — (local development continues)
- Owner dashboard, onboarding, AI, scale features all built and tested locally first.

### **Phase 9 — AWS Migration (new phase)**
- **When:** Only after Phases 0–4 are proven locally with passing tests and visual confirmation.
- **What:** Lift the local stack to AWS: Terraform provisions RDS, real S3, Kinesis Firehose, ECS, ALB.
- **Success:** The *same codebase* that worked locally now runs in AWS with zero logic changes — only connection strings and IAM roles differ.

## What this means for you (Julian's work)

### Immediate changes to your workflow:
1. **No AWS SSO access needed yet** — Phase 2 starts immediately with local MinIO + Postgres.
2. **Visual feedback from day one:**
   - MinIO web UI at `http://localhost:9001` shows every event file.
   - Local Postgres client (TablePlus, pgAdmin, `psql`) lets you inspect raw events and dbt output.
   - dbt docs (`dbt docs serve`) visualizes the lineage locally.
3. **Faster iteration:**
   - Change a dbt model → `dbt run` → query results in <10 seconds.
   - Change the collector → restart container → test with `curl` in <5 seconds.
4. **Complete local testing:**
   - Contract validation, ingestion, warehouse, identity resolution, marts — all testable without internet.

### What gets deferred to Phase 9:
- Terraform (INFRA-001/002/003)
- AWS SSO, OIDC, IAM roles
- Real S3, Kinesis Firehose, Athena, Glue
- ECS/Fargate, ALB, CloudFront
- RDS, ElastiCache (managed services)

### What stays the same:
- The event contract (CTR-001) — same JSON schemas.
- The SDK APIs (CTR-002) — same `track()` / `identify()`.
- The dbt models — same SQL, just different connection target.
- The ingestion logic — same validation, just writes to MinIO instead of S3.

## The local development loop (what your day looks like)

```bash
# Morning: start the stack
cd ~/Desktop/me-be-me/agency-data
docker-compose up -d

# Check everything is healthy
docker-compose ps  # all services "Up"
open http://localhost:9001  # MinIO web UI (user: minioadmin / pass: minioadmin)

# Work on the event collector
cd ingest/
# edit collector code
docker-compose restart collector
curl -X POST http://localhost:8080/collect -d @../contracts/fixtures/valid/page_viewed.json
# check MinIO UI → see the new event file

# Work on dbt models
cd ../warehouse/
# edit a model
dbt run --select staging
# query the output
psql -h localhost -U agency_data -d warehouse -c "SELECT * FROM staging.stg_page_viewed LIMIT 5;"

# Run tests
pytest  # all contract + ingestion tests
dbt test  # all schema tests

# Evening: shut down (or leave running)
docker-compose down
```

## The docker-compose stack (what gets built in Phase 0)

```yaml
# docker-compose.yml (simplified)
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: warehouse
      POSTGRES_USER: agency_data
      POSTGRES_PASSWORD: local_dev_only
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"  # S3 API
      - "9001:9001"  # Web UI
    volumes:
      - minio_data:/data

  collector:
    build: ./ingest
    ports:
      - "8080:8080"
    environment:
      S3_ENDPOINT: http://minio:9000
      S3_BUCKET: events-raw
    depends_on:
      - minio

  # (Brayden's services: runtime, nginx, etc.)

volumes:
  postgres_data:
  minio_data:
```

## Success criteria before AWS migration (Phase 9 gate)

You must be able to demonstrate **all of these locally**:

1. ✅ **End-to-end event flow:** Click a button in the local GlowGirl site → event appears in MinIO → dbt processes it → query the mart in local Postgres.
2. ✅ **Multi-tenant isolation:** Two tenants running locally serve different content; their events are partitioned; cross-tenant queries fail.
3. ✅ **Visual dashboard:** A local dashboard UI queries the local `dashboard-api` and shows a funnel chart.
4. ✅ **All tests green:** Contract tests, ingestion tests, dbt schema tests, E2E tests (Playwright against localhost).
5. ✅ **Identity resolution works:** Anonymous visitor → lead capture → customer order stitches into one timeline in local warehouse.
6. ✅ **Performance acceptable:** Page loads <2s locally; dbt full-refresh <5 minutes on fixture data.

**Only when all six are true** do you proceed to Phase 9 and provision AWS infrastructure.

---

## FAQ

**Q: Doesn't this delay "real" deployment?**  
A: No — it *accelerates* it. You'll deploy a battle-tested, visually-verified system to AWS in days instead of debugging AWS-specific issues for weeks.

**Q: What if local and AWS behave differently?**  
A: MinIO is S3-compatible (same API). Postgres is Postgres. Docker containers are identical in docker-compose and ECS. The *only* differences are connection strings and IAM, which Phase 9 handles explicitly.

**Q: How do we test "real" scale?**  
A: You don't, locally. Phase 9 includes load testing in AWS. But **logic bugs** (90% of issues) are caught locally.

**Q: What about Brayden's work?**  
A: Same approach — his Laravel apps run locally via `php artisan serve` or FrankenPHP in docker-compose, against local Postgres/Redis. The shared runtime's multi-tenancy is fully testable locally.

---

**Bottom line:** This approach trades a few extra days of local setup (Phase 0) for **weeks of faster iteration** in Phases 1–4, and a **much higher confidence** deployment to AWS in Phase 9.
