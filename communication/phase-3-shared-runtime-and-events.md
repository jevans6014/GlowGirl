# Phase 3 — Shared Runtime & Event Emission

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 3" (`PLAT-011/012/013/014`, `INFRA-004/005`, `DATA-009`).
> **Glossary:** [Tenant](./GLOSSARY.md#core-concepts), [Tier (T0/T1/T2)](./GLOSSARY.md#core-concepts), [stancl/tenancy](./GLOSSARY.md#operational-plane-plumbing), [Fargate](./GLOSSARY.md#infrastructure--delivery), [ALB](./GLOSSARY.md#infrastructure--delivery), [CDC](./GLOSSARY.md#identity--events).

## 5-Question Snapshot
- **What:** One multi-tenant Laravel app (the **T0 shared runtime**) that serves many clients from a single deployment, plus the wiring that makes every page/form/order automatically emit events. This is where the two planes first connect in production.
- **Why:** You can't profitably run hundreds of clients as hundreds of separate apps. T0 makes "a client" mostly config. And until sites emit events, the whole intelligence plane has nothing real to chew on.
- **What code:** *(Brayden)* the `runtime` app + cross-tenant denial tests + tenant-aware cache/queue + Terraform for Fargate/ALB. *(Julian)* the CDC pipeline ingesting authoritative server events.
- **Decisions needed from you:** Confirm **D4** is locked (the runtime is built on it); agree the CTR-007 domain-event payloads with Brayden.
- **Next step (Julian):** `DATA-009` — ingest CTR-007 server events and reconcile them against browser events.

---

## What is this?
The **shared runtime** is a single Laravel application that hosts many clients at once. It uses
[stancl/tenancy](./GLOSSARY.md#operational-plane-plumbing) to scope every database query to a
[`tenant_id`](./GLOSSARY.md#core-concepts), and it figures out which tenant a request belongs to
from the host header (the domain). This is the [T0 tier](./GLOSSARY.md#core-concepts) — where most
clients will live as rows + theme config, not as their own codebase.

Alongside it, **event emission** gets wired in: visiting a page, submitting a form, or completing
an order now automatically fires the canonical events defined in CTR-001 — both from the browser
(JS SDK) and, authoritatively, from the server ([CDC](./GLOSSARY.md#identity--events) / CTR-007).

## Why are we building it?
- **Business reason:** T0 is the unit economics of the whole company. 500 isolated stacks would cost ~$90k–270k/yr just idling; a shared runtime keeps marginal cost per client near-flat.
- **Technical reason:** A single app to patch/deploy beats hundreds. And first live events validate that the Phase 1 contract actually works in production, not just against fixtures.

## What problem does it solve?
- **"How do we run 500 sites with 2 engineers?"** — You don't run 500 apps; you run one app with 500 tenants.
- **The existential multi-tenancy risk:** one client seeing another's data. Phase 3 makes cross-tenant isolation a **release-blocking test suite** (PLAT-012), not a hope.
- **Untrustworthy analytics:** browser events get dropped/blocked. Server-side [CDC](./GLOSSARY.md#identity--events) gives a reliable source of truth for money and leads.

## What does success look like?
- Two seeded tenants serve **isolated** content from one app instance (PLAT-011).
- A deliberately **unscoped query fails CI** — cross-tenant denial is enforced for every route/resource (PLAT-012).
- No cache/queue bleed across tenants (PLAT-013).
- The T0 runtime serves a tenant via CloudFront over HTTPS (INFRA-004).
- **A click on a real runtime tenant lands a contract-valid event in the lake, end-to-end** (PLAT-014) — the first cross-plane production seam.
- A test order produces a server-authoritative `order_completed` that's distinct from any browser event (DATA-009).

## What systems are involved?
| System | Repo / Service | Owner |
|:-------|:---------------|:------|
| `runtime` multi-tenant app | `agency-platform/runtime` | Brayden |
| Cross-tenant denial test suite | `agency-platform` (Pest + static analysis) | Brayden |
| Tenant-aware Redis cache + Horizon queue | `agency-platform/runtime` | Brayden |
| `shared-runtime` Fargate + ALB + CloudFront + WAF | `infra/modules/shared-runtime` | Brayden |
| `client-site` + `database` modules (T1/T2) | `infra` | Brayden |
| `analytics-sdk-php` wired into core/cms/forms | `agency-platform` | Brayden (consumes Julian's ingestion) |
| **CDC pipeline** (server events → lake) | **`agency-data/ingest`** | **Julian** |

## What are we building first?
1. **PLAT-011** — the T0 runtime app (Brayden). Depends on the Phase 2 packages + CTR-006.
2. **PLAT-012** — cross-tenant denial suite. *Gates any client onboarding — non-negotiable.*
3. **INFRA-004/005** — Terraform to actually run the runtime (and the T1/T2 module GlowGirl will use).
4. **PLAT-014** — auto-emit events from the runtime → first live event in the lake.
5. **DATA-009** (Julian) — ingest the authoritative CTR-007 server events and reconcile vs browser events.

## What decisions require my input?
- **D4 must be locked.** The entire runtime is built on the tiered-tenancy decision. If D4 isn't signed, this phase shouldn't start.
- **CTR-007 payloads** — agree with Brayden on the exact server-side domain events (`order_completed`, `appointment_booked`, `refund_issued`) so Julian's ingestion matches what the Services layer emits. This is the mid-Phase-3 integration checkpoint.
- **Reconciliation rules** — how to handle a browser `order_completed` vs the server one (server wins; browser is a behavioral signal).

## What can be ignored for now?
- **The pilot's bespoke try-on code** — that's Phase 4 (GlowGirl is T1).
- **Onboarding automation / self-serve provisioning** — Phase 6.
- **T1/T2 lifecycle automation** beyond standing one up manually — Phase 6 (INFRA-006).
- **Dashboards** — Phase 5. Phase 3 just proves events flow.

---

## Status — what's actually done
- ⚪ **Not started.** This is the first phase where the two planes connect, so it depends on Phase 2 completing on both sides.
- Julian's only deliverable here is **DATA-009** (CDC ingest), detailed in [`../JULIAN_TASK_PLAN.md`](../JULIAN_TASK_PLAN.md) Step 12.
