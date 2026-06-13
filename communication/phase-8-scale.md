# Phase 8 — Scale to 100–500 Clients

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 8" (`PLAT-021`, `SHARED-005/006`, `INFRA-007/008`, `DATA-022`).
> **Glossary:** [RDS Proxy](./GLOSSARY.md#infrastructure--delivery), [Athena](./GLOSSARY.md#data-plane-plumbing), [RPO/RTO](./GLOSSARY.md#process--quality), [Tier (T0)](./GLOSSARY.md#core-concepts).

## 5-Question Snapshot
- **What:** The hardening work that lets the platform absorb 100–500 clients without rewrites — connection pooling, cost controls, fleet management, warehouse scaling, and disaster recovery.
- **Why:** The architecture is *designed* for scale from day one, but several pieces should only be *built* when real thresholds are hit. This phase is "build as you grow."
- **What code:** *(Brayden)* Dependabot auto-merge, RDS Proxy, cost controls. *(Julian)* warehouse partition/clustering strategy. *(Shared)* fleet dashboard + DR drills.
- **Decisions needed from you:** The query-latency threshold that triggers a warehouse engine upgrade; DR targets (RPO/RTO).
- **Next step (Julian):** `DATA-022` — only when Athena latency actually hurts; otherwise leave it.

---

## What is this?
The "don't fall over at scale" phase. Each task addresses a specific failure mode that only appears
with many clients: too many database connections, runaway costs, no fleet-wide visibility, slow
warehouse queries, and unproven disaster recovery. **Design for these now; build each only as its
threshold is crossed.**

## Why are we building it?
- **Business reason:** Hitting 500 clients is the goal — but only profitable if costs stay flat-ish and outages don't multiply. The tier decision (D4) is fundamentally a cost decision: without [T0](./GLOSSARY.md#core-concepts), 500 isolated stacks = a $90k–270k/yr idle floor.
- **Technical reason:** Hundreds of isolated databases will exhaust connection limits without [RDS Proxy](./GLOSSARY.md#infrastructure--delivery); Athena will eventually slow down on hot tenants. These are predictable walls, so we plan the runbook before we hit them.

## What problem does it solve?
- **Connection storms** — RDS Proxy pools connections so hundreds of DBs don't exhaust limits (INFRA-007).
- **Cost creep** — autoscaling, T1 idle scale-down, S3→Glacier lifecycle, per-tenant cost tags (INFRA-008).
- **Fleet blindness** — one screen showing version/health/deploy status across all clients (SHARED-005).
- **Patch toil** — package upgrades fan out as per-client PRs and auto-merge on green (PLAT-021).
- **Slow dashboards at scale** — promote hot tenants off Athena if needed (DATA-022).
- **Unproven recovery** — quarterly restore drills prove RPO/RTO are real (SHARED-006).

## What does success look like?
- A package patch **fans out and auto-merges fleet-wide on green CI** (PLAT-021).
- One screen shows **fleet drift/health** (SHARED-005) — built only past ~10 clients.
- **Connection storms are mitigated**; moving to Aurora is a runbook, not a project (INFRA-007).
- **Cost-per-tenant dashboard** exists; T0 marginal cost stays roughly flat (INFRA-008).
- Dashboard **p95 query < 2s at 100 tenants** (DATA-022).
- A **quarterly drill restores a client DB to staging**, proving RPO≤24h / RTO≤4h (SHARED-006).

## What systems are involved?
| System | Repo / Service | Owner |
|:-------|:---------------|:------|
| Dependabot fan-out + auto-merge | `agency-platform` + per-client repos | Brayden |
| Fleet dashboard | Filament app | Shared |
| RDS Proxy + Aurora migration path | `infra` | Brayden |
| Cost controls (autoscaling, lifecycle, tags) | `infra` | Brayden |
| **Warehouse scale tiering** | **`agency-data/warehouse`** | **Julian** |
| DR drills + observability (Sentry, CloudWatch→Slack, cross-region backups) | both planes | Shared |

## What are we building first?
There's no fixed order — each task is **threshold-triggered**:
- **SHARED-006 (observability)** — Sentry + CloudWatch alarms should exist from day one of production (it's listed here but pull it forward).
- **INFRA-007 (RDS Proxy)** — before the DB count gets dangerous.
- **DATA-022 (warehouse tiering)** — only when Athena p95 latency actually hurts.
- **SHARED-005 (fleet dashboard)** — only past ~10 clients.
- **PLAT-021 / INFRA-008** — as fleet size and cost justify.

## What decisions require my input?
- **Warehouse upgrade trigger** — the query-latency threshold (e.g. p95 > 2s) that justifies moving hot tenants from Athena to ClickHouse/Redshift Serverless (DATA-022). Default: don't move until it hurts.
- **DR targets** — confirm RPO≤24h / RTO≤4h are the right targets, and the cross-region backup scope.
- **Cost thresholds** — what per-tenant cost number triggers action.

## What can be ignored for now?
- **Premature optimization** — the explicit guidance is to *design for* scale but *build* each piece only at its threshold. Building DATA-022 before latency hurts is wasted effort.
- **Anything not yet justified by client count** — fleet dashboard before 10 clients, auto-merge before there's a fleet to patch, etc.

---

## Status — what's actually done
- ⚪ **Not started.** This phase is intentionally deferred and threshold-driven — though observability (SHARED-006) should be switched on as soon as the pilot goes to production (Phase 4).
- Julian's deliverable (`DATA-022`) is detailed in [`../JULIAN_TASK_PLAN.md`](../JULIAN_TASK_PLAN.md) Step 18.
