# Communication Layer — Human-Readable Execution Guide

> **🔵 LOCAL-FIRST APPROACH:** The entire platform is built and validated locally (docker-compose) before touching AWS. See [`LOCAL_FIRST_APPROACH.md`](./LOCAL_FIRST_APPROACH.md) for the strategy.

This directory is the **plain-English execution layer** for the platform. It translates the
architecture in [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) into build plans an engineer
can act on today.

- **`PLATFORM_ROADMAP.md`** = the architectural source of truth (acronyms, systems thinking, the full task graph). Don't simplify it.
- **`/communication`** = how we actually talk about and execute the work, one document per phase.

> If a doc here doesn't let you answer these five questions in the first few minutes, it's too
> abstract and should be rewritten:
> **1.** What are we building? **2.** Why? **3.** What code gets written? **4.** What decisions are needed? **5.** What's the next step?

---

## How to read these docs

Every phase doc opens with a **5-Question Snapshot** (the five questions above), then expands into:

- **What is this?** — the feature/system in simple terms.
- **Why are we building it?** — business + technical reason.
- **What problem does it solve?** — the actual pain point.
- **What does success look like?** — concrete, testable outcome.
- **What systems are involved?** — real repos, services, DBs, infra, files.
- **What are we building first?** — exact implementation sequence.
- **What decisions require my input?** — sign-offs blocking progress.
- **What can be ignored for now?** — future-state we deliberately skip.

Acronyms are defined once in **[`GLOSSARY.md`](./GLOSSARY.md)** and linked from each doc.

---

## The two planes (the one mental model that explains everything)

The whole platform splits into two halves that talk **only through versioned contracts**:

- **Operational plane** — owner: **Brayden** · repos: `infra`, `agency-platform`, `platform-template`.
  The websites, the CMS, commerce/booking, the multi-tenant runtime, deployments. *Emits events.*
- **Intelligence plane** — owner: **Julian** · repo: `agency-data`.
  Ingestion, the data warehouse, the dashboard API, AI. *Consumes events.*

They never read each other's databases. The **event contract** and the other contracts are the
only seams. This is why both people can build in parallel without stepping on each other.

---

## Phase index

| Phase | Doc | One-line goal | Status |
|:------|:----|:--------------|:-------|
| 0 | [phase-0-foundations.md](./phase-0-foundations.md) | **Local docker-compose stack** (Postgres, MinIO, Redis) — no AWS yet | � **Complete** |
| 1 | [phase-1-contracts.md](./phase-1-contracts.md) | Lock every contract so the two planes can build in isolation | 🟡 In progress |
| 2 | [phase-2-platform-core-and-data-foundation.md](./phase-2-platform-core-and-data-foundation.md) | Build CMS packages + **local** ingestion/warehouse in parallel | ⚪ Not started |
| 3 | [phase-3-shared-runtime-and-events.md](./phase-3-shared-runtime-and-events.md) | Multi-tenant runtime + events — **all running locally** | ⚪ Not started |
| 4 | [phase-4-glowgirl-pilot.md](./phase-4-glowgirl-pilot.md) | GlowGirl pilot **validated locally** before production | ⚪ Not started |
| 5 | [phase-5-owner-dashboard.md](./phase-5-owner-dashboard.md) | Business owners see trustworthy metrics (local dev) | ⚪ Not started |
| 6 | [phase-6-client-onboarding.md](./phase-6-client-onboarding.md) | A new client is config, not a new codebase | ⚪ Not started |
| 7 | [phase-7-ai-foundation.md](./phase-7-ai-foundation.md) | Turn the dataset into features, RAG support bots, AI drafting | ⚪ Not started |
| 8 | [phase-8-scale.md](./phase-8-scale.md) | Absorb 100–500 clients without rewrites | ⚪ Not started |
| **9** | **[phase-9-aws-migration.md](./phase-9-aws-migration.md)** | **Lift local stack to AWS** (RDS, S3, ECS, ALB) — production deployment | ⚪ **Not started** |

**Status legend:** 🟢 Done · 🟡 In progress · ⚪ Not started · 🔴 Blocked

---

## What's actually done right now (June 2026)

- ✅ **Phase 0 COMPLETE** — Local development stack ready:
  - DATA-001: `agency-data` monorepo pushed to Up-Keep/agency-data
  - LOCAL-001: docker-compose stack (Postgres, MinIO, Redis, event collector)
  - Event collector validates CTR-001, writes to MinIO
  - LOCAL_DEVELOPMENT.md guide created
- 🟡 **Phase 1 (in progress)** — CTR-001 drafted as `v0.1.0-draft` (9 event schemas + envelope + validator + 20 passing tests). *Pending: D4 sign-off before publishing.*
- 📋 **Next: Phase 2** — dbt staging models, identity resolution, JS SDK implementation

See [phase-0-foundations.md](./phase-0-foundations.md) and [phase-1-contracts.md](./phase-1-contracts.md) for the blow-by-blow, and
[`../JULIAN_TASK_PLAN.md`](../JULIAN_TASK_PLAN.md) for Julian's full ordered build book.

---

## The 4 decisions that gate everything (read this before building)

These are the "pre-flight decisions" from the roadmap. Until they're signed off, parallel work
can fork in the wrong direction. Full detail in [phase-1-contracts.md](./phase-1-contracts.md).

| ID | Decision | Status | Why it matters |
|:---|:---------|:-------|:---------------|
| **D1** | Inertia monolith (server-driven React, no separate API for sites) | ✅ Settled | Sets the whole app shape |
| **D2** | React + Inertia (not Vue) | ⏳ Needs sign-off | Changes the `ui` package + every page; ~40% cheaper pilot in React |
| **D3** | Tailwind v4 design tokens | ✅ Settled | How per-client theming works |
| **D4** | Tiered tenancy: T0 shared / T1 isolated / T2 premium | ⏳ **Most important** | Decides whether the shared runtime gets built at all; freezes `tenant_id` format |

---

## 🔵 Local-first development (read this first)

**The entire platform is built locally before AWS deployment.** This means:

- **Phases 0–8:** Everything runs in docker-compose (Postgres, MinIO, Redis, runtime, collector, dbt).
- **Phase 9:** Only after local validation, lift the stack to AWS (RDS, S3, ECS, ALB).
- **Why:** Faster iteration (seconds vs minutes), zero cloud cost during development, visual feedback (MinIO web UI, local database queries), simpler debugging.
- **The contract:** If it works locally, it works on AWS. Migration is configuration, not code.

See **[`LOCAL_FIRST_APPROACH.md`](./LOCAL_FIRST_APPROACH.md)** for the full strategy, local stack details, and success criteria.
