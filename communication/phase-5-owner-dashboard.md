# Phase 5 — Owner Dashboard & Semantic Layer

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 5" (`DATA-011/012/013/014`, `PLAT-017`, `DASH-001`).
> **Glossary:** [Mart](./GLOSSARY.md#data-plane-plumbing), [Semantic/metrics layer](./GLOSSARY.md#data-plane-plumbing), [CTR-004 (Owner Identity)](./phase-1-contracts.md), [JWT/JWKS](./GLOSSARY.md#infrastructure--delivery).

## 5-Question Snapshot
- **What:** The screen a business owner logs into to see their traffic, leads, conversion, and revenue — backed by a metrics layer that guarantees every number means exactly one thing.
- **Why:** This is the visible payoff of the entire intelligence plane. Until now, data existed but no human could see it. It's also the moment "trust" becomes the product.
- **What code:** *(Julian)* aggregation [marts](./GLOSSARY.md#data-plane-plumbing), a [semantic layer](./GLOSSARY.md#data-plane-plumbing), and the `dashboard-api` service. *(Brayden)* owner login issuing identity tokens. *(Shared)* the dashboard UI.
- **Decisions needed from you:** Where the dashboard lives (Filament panel vs standalone app); the first metric set to ship; Brayden's CTR-004 token/JWKS details.
- **Next step (Julian):** `DATA-011` — build the per-tenant rollup marts and check them against hand-computed GlowGirl numbers.

---

## What is this?
The owner-facing analytics product. Three layers:
1. **Marts (DATA-011)** — daily/hourly per-tenant rollups: traffic, leads, conversion, revenue, top pages/funnels.
2. **Semantic layer (DATA-012)** — one canonical definition per metric so "conversion rate" is computed identically whether it's the dashboard or an AI prompt asking.
3. **`dashboard-api` (DATA-013)** — a service implementing the CTR-003 contract, scoped to the logged-in owner's tenants via CTR-004 tokens, reading only the marts (never client databases).

A critical rule: **the dashboard reads marts only — never the clients' operational databases.** That
separation is what keeps the planes decoupled and the data safe.

## Why are we building it?
- **Business reason:** Owners pay for insight, not raw events. A trustworthy dashboard is the difference between "a website vendor" and "a growth partner." It's also what makes the data moat tangible to the customer.
- **Technical reason:** Without a [semantic layer](./GLOSSARY.md#data-plane-plumbing), every consumer reinvents "conversion rate" slightly differently and the numbers stop matching — which destroys trust instantly.

## What problem does it solve?
- **"Two reports, two different revenue numbers."** — A single metric definition kills this class of bug.
- **"Can owner A see owner B's data?"** — The `dashboard-api` enforces tenant scoping from the identity token on every request.
- **Build order** — because CTR-003 shipped a mock server in Phase 1, the UI can be built before/while the real API is finished.

## What does success look like?
- Marts match **hand-computed numbers** on GlowGirl (DATA-011) — the trust check.
- "Conversion rate" resolves **identically** across two different consumers (DATA-012).
- `dashboard-api` passes its contract tests against real marts and **enforces tenant isolation** (DATA-013).
- An owner logs in once, and the API scopes them to exactly their `tenant_ids` (PLAT-017).
- The **GlowGirl owner sees their real funnel + leads** in the UI (DASH-001).

## What systems are involved?
| System | Repo / Service | Owner |
|:-------|:---------------|:------|
| Rollup marts | `agency-data/warehouse` | Julian |
| Semantic / metrics layer | `agency-data/warehouse` | Julian |
| `dashboard-api` (FastAPI, implements CTR-003) | `agency-data/dashboard-api` | Julian |
| Owner-identity domain (issues CTR-004 tokens, publishes JWKS) | `agency-platform` | Brayden |
| Dashboard UI | Filament panel or Inertia app consuming `dashboard-api` | Shared (Julian data, Brayden shell) |

## What are we building first?
1. **DATA-011** — the marts (needs DATA-006/007 staging+identity and DATA-009 revenue from Phase 3).
2. **DATA-012** — the semantic layer on top of the marts.
3. **PLAT-017 + CTR-004** (Brayden) — owner login + token issuance + published JWKS.
4. **DATA-013** — the `dashboard-api`, verifying tokens against Brayden's JWKS and scoping to marts.
5. **DASH-001** — the UI, against the real API.

## What decisions require my input?
- **Dashboard home** — does the owner dashboard start as a **Filament panel** (fast, inside the platform) or a **standalone Inertia app** consuming `dashboard-api`? Affects DASH-001 scope.
- **CTR-004 details from Brayden** — the JWKS URL and claim shape (`sub`, `tenant_ids[]`, `role`, `agency_admin`) so `dashboard-api` can verify tokens.
- **First metric set** — which views ship first (traffic, leads, conversion, revenue) for the GlowGirl owner.
- **DATA-014 (near-real-time counters)** — do we want a small "live today" counter at all? It's **optional**; default is no.

## What can be ignored for now?
- **Streaming/real-time analytics** — explicitly a debt call-out: batch covers ~95%; do **not** build streaming now (DATA-014 is a tiny optional micro-batch at most).
- **Fleet-wide dashboards** (all clients at once) — Phase 8 (SHARED-005), only past ~10 clients.
- **AI-driven insights** — Phase 7.

---

## Status — what's actually done
- ⚪ **Not started.** Depends on the warehouse (Phase 2) and real pilot data (Phase 4).
- Julian's deliverables are detailed in [`../JULIAN_TASK_PLAN.md`](../JULIAN_TASK_PLAN.md) Step 15.
