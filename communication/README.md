# Communication Layer — Human-Readable Execution Guide

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
| 0 | [phase-0-foundations.md](./phase-0-foundations.md) | Both engineers can deploy a "hello" container and run CI | 🟡 In progress |
| 1 | [phase-1-contracts.md](./phase-1-contracts.md) | Lock every contract so the two planes can build in isolation | 🟡 In progress |
| 2 | [phase-2-platform-core-and-data-foundation.md](./phase-2-platform-core-and-data-foundation.md) | Build CMS packages (Brayden) + ingestion/warehouse (Julian) in parallel | ⚪ Not started |
| 3 | [phase-3-shared-runtime-and-events.md](./phase-3-shared-runtime-and-events.md) | One multi-tenant app serves many clients; every site emits events | ⚪ Not started |
| 4 | [phase-4-glowgirl-pilot.md](./phase-4-glowgirl-pilot.md) | Rebuild GlowGirl on the platform; prove the event pipeline on real traffic | ⚪ Not started |
| 5 | [phase-5-owner-dashboard.md](./phase-5-owner-dashboard.md) | Business owners see trustworthy traffic/leads/revenue metrics | ⚪ Not started |
| 6 | [phase-6-client-onboarding.md](./phase-6-client-onboarding.md) | A new client is config, not a new codebase (the ≤5-engineer-days goal) | ⚪ Not started |
| 7 | [phase-7-ai-foundation.md](./phase-7-ai-foundation.md) | Turn the dataset into features, RAG support bots, and AI page drafting | ⚪ Not started |
| 8 | [phase-8-scale.md](./phase-8-scale.md) | Absorb 100–500 clients without rewrites | ⚪ Not started |

**Status legend:** 🟢 Done · 🟡 In progress · ⚪ Not started · 🔴 Blocked

---

## What's actually done right now (June 2026)

- **DATA-001 (Phase 0)** — `agency-data` monorepo scaffolded, CI green locally, committed. *Pending: create the GitHub repo + push.*
- **CTR-001 (Phase 1)** — event contract drafted as `v0.1.0-draft` (9 event schemas + envelope + validator + 20 passing tests). *Pending: D4 sign-off before publishing.*

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
