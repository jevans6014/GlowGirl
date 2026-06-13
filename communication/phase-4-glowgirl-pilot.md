# Phase 4 — GlowGirl Pilot (the proving ground)

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 4" (`PLAT-015/016`, `PILOT-001…008`, `DATA-010`).
> **Glossary:** [Tier (T1)](./GLOSSARY.md#core-concepts), [Block](./GLOSSARY.md#operational-plane-plumbing), [E2E](./GLOSSARY.md#process--quality), [Mart](./GLOSSARY.md#data-plane-plumbing), [identity resolution](./GLOSSARY.md#identity--events).

## 5-Question Snapshot
- **What:** Rebuild the real GlowGirl site on the new platform and use it to prove the whole event pipeline works on real traffic. GlowGirl is a [T1](./GLOSSARY.md#core-concepts) client (its try-on feature needs custom code).
- **Why:** A pilot on a real site with real traffic is the only honest test of both planes. It also turns the contract from "validated on fixtures" into "validated on production data."
- **What code:** *(Brayden)* port pages to CMS [blocks](./GLOSSARY.md#operational-plane-plumbing), commerce/booking packages, try-on as client-specific code, Stripe/SES. *(Julian)* instrument the storefront with the JS SDK, build the first real [marts](./GLOSSARY.md#data-plane-plumbing).
- **Decisions needed from you:** Confirm the GlowGirl staging domain for the collector allowlist; sign off the cutover criteria.
- **Next step (Julian):** `PILOT-005` — get the JS SDK firing every canonical event on GlowGirl with the correct `tenant_id`.

---

## What is this?
The first real client built on the platform, used deliberately as a test rig. The team works one
repo (`glowgirl`) but **splits by directory to avoid conflicts**: Brayden owns `app/`, package
usage, Filament, and infra; Julian owns `resources/js/analytics`, the event instrumentation, and
everything on the warehouse side.

## Why are we building it?
- **Business reason:** GlowGirl is an existing site with real customers — rebuilding it proves the platform can replace a hand-built site without losing functionality or traffic, which is the sales pitch for every future client.
- **Technical reason:** Fixtures lie. Real traffic exposes the gaps — events that don't fire, identity that doesn't stitch, funnels that don't add up — and those findings sharpen CTR-001 to `v0.2`.

## What problem does it solve?
- **"Does any of this actually work together?"** — Phase 4 is the first time the CMS, commerce, booking, the SDK, ingestion, and the warehouse all run on one live site.
- **De-risks T1 isolation** — the try-on code must live *only* in `glowgirl` and never leak into shared platform packages. If it does, the tiering model is broken.
- **Proves the takeover path** — the data-migration playbook (PILOT-007) rehearses moving a client off their old stack (Supabase) without data loss.

## What does success look like?
The roadmap's explicit definition of pilot success:
1. GlowGirl runs on the platform on a staging domain, **fully event-instrumented**.
2. A founder can **edit homepage content unaided** in Filament.
3. A **funnel is visible in the dashboard** (`page_viewed → checkout_started → order_completed`) for the GlowGirl tenant.
4. [E2E](./GLOSSARY.md#process--quality) tests are green on staging and performance matches the old site.
5. Cutover completes and Supabase is decommissioned after a 30-day cooling period, with 2 weeks of clean production monitoring.

## What systems are involved?
| System | Repo / Service | Owner |
|:-------|:---------------|:------|
| GlowGirl T1 app (from `platform-template`) | `glowgirl` | Shared |
| `commerce` + `booking` packages (extracted during pilot) | `agency-platform/packages` | Brayden |
| Try-on (client-specific code) | `glowgirl` only | Brayden |
| Stripe webhooks + SES + Filament admin | `glowgirl` | Brayden |
| **JS SDK instrumentation** | **`glowgirl/resources/js/analytics`** | **Julian** |
| **First real marts** | **`agency-data/warehouse`** | **Julian** |
| E2E + Lighthouse gates | `glowgirl` (Playwright) | Shared |

## What are we building first?
1. **PILOT-001** — boot GlowGirl from the template, provisioned as a T1 stack.
2. **PILOT-002/003** — port pages to CMS blocks; port try-on as client-specific code (Brayden).
3. **PLAT-015/016 + PILOT-004** — commerce/booking + Stripe/SES (Brayden).
4. **PILOT-005 (Julian)** — instrument the storefront; verify every canonical event fires correctly.
5. **DATA-010 (Julian)** — build the first marts from *real* GlowGirl events; feed discrepancies back into CTR-001 v0.2.
6. **PILOT-006 → PILOT-008** — E2E gates, then cutover + decommission.

## What decisions require my input?
- **Collector CORS/allowlist** — the GlowGirl staging domain must be allowed to POST events (ties back to the Phase 2 collector setup).
- **Cutover go/no-go criteria** — what "clean enough to switch DNS" means (E2E green + perf parity + monitoring quiet).
- **CTR-001 v0.2 changes** — any contract tweaks discovered from real data need your sign-off since they ripple to Brayden.

## What can be ignored for now?
- **The owner-facing dashboard UI polish** — Phase 5. Phase 4 only needs the funnel *visible/queryable*, not a pretty dashboard.
- **Onboarding automation** — Phase 6. GlowGirl is provisioned semi-manually as the first T1.
- **AI features** — Phase 7.
- **Multi-client concerns** — Phase 4 is one tenant; scale is Phase 8.

---

## Status — what's actually done
- ⚪ **Not started.** Depends on Phases 2–3 completing. *(Note: the current `glowgirl_project` files in this workspace are the existing site being rebuilt — the source material for the port, not the platform version.)*
- Julian's deliverables (`PILOT-005`, `DATA-010`) are detailed in [`../JULIAN_TASK_PLAN.md`](../JULIAN_TASK_PLAN.md) Steps 13–14.
