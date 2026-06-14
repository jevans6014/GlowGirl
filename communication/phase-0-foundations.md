# Phase 0 — Foundations

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 0 — FOUNDATIONS" (tasks `INFRA-001/002/003`, `PLAT-001`, `DATA-001`, `SHARED-001/002`).
> **Glossary:** [OIDC](./GLOSSARY.md#infrastructure--delivery), [Terraform/IaC](./GLOSSARY.md#infrastructure--delivery), [ECR](./GLOSSARY.md#infrastructure--delivery), [CI](./GLOSSARY.md#process--quality), [ADR](./GLOSSARY.md#process--quality).

## 5-Question Snapshot
- **What:** The local development environment — docker-compose stack (Postgres, Redis, MinIO, nginx), both code monorepos, and shared CI. **AWS setup deferred to Phase 9.**
- **Why:** Prove the entire platform works locally with visual feedback before spending time/money on cloud infrastructure. Local iteration is 10x faster.
- **What code:** Two repo skeletons (`agency-platform` in PHP, `agency-data` in Python), `docker-compose.yml` for local services, GitHub Actions CI, CODEOWNERS.
- **Decisions needed from you:** ✅ Already done — `agency-data` repo created at Up-Keep/agency-data.
- **Next step:** Build the `docker-compose.yml` stack for local Postgres + MinIO + Redis.

---

## What is this?
The "hello world" of the whole company's infrastructure — **running entirely on your local machine**. By the end of Phase 0, both engineers can independently push code, have it tested by CI, and run the full stack locally via `docker-compose up`. You'll see live servers, browse the event storage (MinIO), query the database (Postgres), and visually confirm everything works before touching AWS.

## Why are we building it?
- **Business reason:** Local development costs $0 and iterates 10x faster than cloud. Prove the concept works before paying for AWS. Catch bugs in seconds, not after deployment.
- **Technical reason:** A local docker-compose stack gives both engineers identical, reproducible infrastructure. No "works on my machine" — if it works in docker-compose, it works for everyone.

## What problem does it solve?
- **Slow cloud iteration** — local changes take seconds to test, not minutes waiting for AWS deployments.
- **Expensive experimentation** — AWS costs money from day one; local development is free.
- **Invisible progress** — with local servers and MinIO web UI, you can *see* events flowing, *browse* the data lake, *query* tables instantly.
- **Complex debugging** — local logs, local database inspection, local network traces beat CloudWatch every time.

## What does success look like?
- `docker-compose up` boots Postgres, Redis, MinIO, and nginx — all services healthy.
- MinIO web UI accessible at `http://localhost:9001` (browse the "S3" buckets).
- Local Postgres queryable via `psql -h localhost -U agency_data -d warehouse`.
- `composer test` (platform) and `pytest` (data) pass green on empty packages, and CI runs on every PR (PLAT-001, DATA-001).
- D1–D4 are written down as [ADRs](./GLOSSARY.md#process--quality) (SHARED-002).
- **No AWS setup yet** — that's Phase 9, after local validation.

## What systems are involved?
| System | Repo / Service | Owner | Role in this phase |
|:-------|:---------------|:------|:-------------------|
| **Postgres 16** (local container) | `docker-compose.yml` | Shared | Local database for warehouse + runtime |
| **MinIO** (local S3-compatible storage) | `docker-compose.yml` | Shared | Local event lake (browse at `:9001`) |
| **Redis 7** (local container) | `docker-compose.yml` | Shared | Local cache + queue backend |
| **nginx** (local reverse proxy) | `docker-compose.yml` | Brayden | Routes `*.localhost` to tenants |
| `agency-platform` monorepo | `agency-platform` | Brayden | Home of the operational packages |
| `agency-data` monorepo | `agency-data` | **Julian** | Home of ingestion/warehouse/AI |
| Reusable CI workflows + branch protection | both repos | Shared | Identical pipelines everywhere |

## What are we building first?
1. ✅ **DATA-001** — `agency-data` monorepo skeleton (already done, pushed to Up-Keep/agency-data).
2. **LOCAL-001** — `docker-compose.yml` with Postgres, Redis, MinIO, nginx (Shared).
3. **PLAT-001** — `agency-platform` monorepo skeleton (Brayden).
4. **SHARED-001** — reusable CI workflow + branch protection + CODEOWNERS.
5. **SHARED-002** — capture D1–D4 as ADRs.
6. **AWS deferred to Phase 9** — INFRA-001/002/003 happen after local validation.

## What decisions require my input?
- ✅ **`agency-data` repo created** at Up-Keep/agency-data (done).
- **Branch protection rules** on `main` (require PR + green CI) — confirm you want this enforced.
- **Local service ports** — default Postgres `:5432`, MinIO `:9000`/`:9001`, Redis `:6379` — confirm no conflicts on your machine.
- **AWS decisions deferred** — account layout, SSO, etc. are Phase 9 concerns.

## What can be ignored for now?
- **All AWS infrastructure** — RDS, S3, Kinesis, ECS, ALB, CloudFront, IAM, OIDC — deferred to Phase 9.
- Scaling, cost controls, RDS Proxy, fleet dashboards — Phase 8.
- Real product packages (CMS, commerce) — Phase 2.
- The actual data lake/warehouse logic — Phase 2 (only the empty `agency-data` skeleton exists now).

---

## Status — what's actually done
- 🟢 **DATA-001 (Julian):** `agency-data` monorepo scaffolded and **pushed to Up-Keep/agency-data** — `uv` workspace with `ingest/`, `warehouse/` (dbt), `ml/`, `dashboard-api/`, `analytics-sdk-js/`, plus `ruff` + `mypy --strict` + `pytest` all green and GitHub Actions CI.
- 🟡 **Next:** LOCAL-001 — build the `docker-compose.yml` stack for local Postgres + MinIO + Redis.
- ⚪ **Brayden's PLAT/SHARED tasks:** tracked in the roadmap.
- 🔵 **AWS deferred:** No AWS access needed until Phase 9.
