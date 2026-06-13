# Phase 1 — Integration Contracts

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 1 — INTEGRATION CONTRACTS" (`CTR-001`…`CTR-007`) + section B (Contract Ownership) + section C (pre-flight decisions).
> **Glossary:** [Contract](./GLOSSARY.md#core-concepts), [Envelope](./GLOSSARY.md#identity--events), [Event](./GLOSSARY.md#identity--events), [Semver](./GLOSSARY.md#process--quality), [CDC](./GLOSSARY.md#identity--events), [UUIDv7](./GLOSSARY.md#identity--events).

## 5-Question Snapshot
- **What:** The set of versioned "API agreements" between the two planes — event shapes, the SDK API, the dashboard API, identity tokens, tenant lifecycle, and server-side domain events.
- **Why:** Once these are locked, Brayden and Julian can build their halves in total isolation for months without breaking each other. This is the **highest-leverage phase**.
- **What code:** JSON Schemas, an OpenAPI spec, mock servers, and golden fixture files — but **no business logic**. Pure interfaces + examples.
- **Decisions needed from you:** **D4 (tiered tenancy)** sign-off, **D2 (React vs Vue)**, and which package registry we publish contracts to.
- **Next step:** Get D4 confirmed so CTR-001 can be tagged/published `v0.1.0` (it's already drafted).

---

## What is this?
A [contract](./GLOSSARY.md#core-concepts) is a published, versioned interface that both planes
depend on instead of depending on each other's code. Think of it like an API spec you can `npm
install`. Phase 1 defines all seven of them. The most important is **CTR-001, the event contract**:
the exact JSON shape of every tracked action (`page_viewed`, `order_completed`, …).

## Why are we building it?
- **Business reason:** Two people can only move fast in parallel if the boundary between their work is frozen and explicit. A late or fuzzy contract forces them to wait on each other — the single biggest schedule risk in the whole program.
- **Technical reason:** Versioned contracts mean either side can change internals freely as long as the contract holds. Breaking changes follow a [semver](./GLOSSARY.md#process--quality) process with a deprecation window, so nothing breaks silently.

## What problem does it solve?
- **"Whose fault is this bug?"** — With a contract + [CI](./GLOSSARY.md#process--quality) validation, a malformed event fails the *emitter's* PR, not three weeks later in the warehouse.
- **Build-order deadlock** — The dashboard UI can be built against a **mock server** before the real backend exists (CTR-003). The PHP and JS SDKs can be built against the same event schemas in parallel (CTR-002).
- **Money you can trust** — Revenue is captured server-side via [CDC](./GLOSSARY.md#identity--events) (CTR-007), never from a browser that can drop or fake events.

## What does success look like?
- All Julian-owned contracts (CTR-001/002/003/005) published with **mock servers live**.
- The event schemas validate the golden fixture events; `@agency/event-contract` is installable by Brayden.
- A deliberately-broken event **fails CI** in *both* repos.
- D1–D4 signed off. This is the gate before any Phase 2 product work starts.

## The seven contracts (who owns what)
| Contract | What it defines | Owner | Who consumes it |
|:---------|:----------------|:------|:----------------|
| **CTR-001** Event Contract | JSON shape of every event + the shared [envelope](./GLOSSARY.md#identity--events) | **Julian** | Both SDKs, ingestion, runtime, every site |
| **CTR-002** Analytics SDK | The `track()` / `identify()` API, batching, consent | **Julian** | Brayden's PHP SDK + the JS SDK |
| **CTR-003** Dashboard API | OpenAPI for metrics/funnels/leads, tenant-scoped | **Julian** | The owner dashboard UI |
| **CTR-004** Owner Identity | The login token (JWT) claim shape for business owners | **Brayden** | dashboard-api, AI, dashboard UI |
| **CTR-005** Feature-Store | How marts expose features to ML | **Julian** | The `ml`/AI package |
| **CTR-006** Tenant Provisioning | What "a tenant exists" means + lifecycle events; freezes `tenant_id` | **Shared** (Brayden drafts) | runtime, infra, data plane |
| **CTR-007** CDC / Domain-Event | Authoritative server-side events (orders, refunds) | **Brayden** | Julian's lake ingestion |

## What systems are involved?
- **`agency-data/contracts`** — Julian's contracts (CTR-001/002/003/005): JSON Schema files, `validate.py`, golden fixtures, contract tests.
- **`agency-platform/contracts`** — Brayden's contracts (CTR-004/006/007).
- **Mock servers** — small stand-ins (e.g. Prism or a tiny FastAPI) that return contract-valid responses so UI/SDK work can start early.
- **Published packages** — `@agency/event-contract` on a package registry (GitHub Packages recommended) so both repos install the *same* version.

## What are we building first?
1. **CTR-001** (event contract) — it blocks Brayden's SDK *and* ingestion. Lock `v0.1` even if imperfect; refine later from real pilot data.
2. **CTR-002** (SDK API) — depends on CTR-001; unblocks both SDKs.
3. **CTR-003 + CTR-005** — dashboard API spec + feature-store spec (CTR-003's auth section needs Brayden's CTR-004).
4. Brayden drafts **CTR-004/006/007** in parallel.

## What decisions require my input?
- **D4 — tiered tenancy (T0/T1/T2).** *The most important sign-off.* It decides whether the shared runtime gets built and **freezes the `tenant_id` format** (we're assuming [UUIDv7](./GLOSSARY.md#identity--events)). CTR-001 cannot be safely published until this is confirmed.
- **D2 — React + Inertia vs Vue.** Affects the SDK auto-init snippet and the later dashboard UI.
- **Package registry** — GitHub Packages (no extra account, recommended) vs npmjs.com (needs an org + token). Needed before publishing CTR-001.

## What can be ignored for now?
- Any *implementation* behind these contracts — ingestion, the warehouse, the real dashboard backend are all Phase 2+. Phase 1 is interfaces and examples only.
- Real-time/streaming concerns — explicitly deferred (batch covers it).
- The full PII/consent legal boundary (SHARED-004) — that's Phase 7, before client #2's data is aggregated.

---

## Status — what's actually done
- 🟡 **CTR-001 (Julian): drafted as `v0.1.0-draft`, not yet published.** In `agency-data/contracts`:
  - `schemas/envelope.schema.json` + 9 event schemas: `page_viewed`, `session_started`, `content_engaged`, `search_performed`, `lead_captured`, `form_submitted`, `appointment_booked`, `checkout_started`, `order_completed`.
  - `lead_captured` uses `has_email`/`has_phone` booleans — **no raw PII** at the contract level (privacy-by-design).
  - `order_completed` is marked authoritative when `source='server'` (the CTR-007 / CDC path).
  - `validate.py` — a reusable validator (the seed for **DATA-008**, the cross-repo contract CI).
  - Golden fixtures: 9 valid + 6 deliberately-invalid; the test suite asserts valid pass / invalid fail. **20/20 tests green**, plus `ruff` + `mypy --strict` clean.
- 🔴 **Blocked on you:** publishing `v0.1.0` waits on **D4 sign-off** + the registry decision.
- ⚪ **Not started:** CTR-002/003/005 (next up), and Brayden's CTR-004/006/007.
- See [`../JULIAN_TASK_PLAN.md`](../JULIAN_TASK_PLAN.md) Steps 2–4 for the detailed build order.
