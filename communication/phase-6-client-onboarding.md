# Phase 6 — Client Onboarding System

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 6" (`PLAT-018/019/020`, `INFRA-006`, `DATA-016`, `SHARED-003`).
> **Glossary:** [Tier (T0/T1)](./GLOSSARY.md#core-concepts), [ED (Engineer-Days)](./GLOSSARY.md#core-concepts), [CTR-006 (Tenant Provisioning)](./phase-1-contracts.md), [ACM](./GLOSSARY.md#infrastructure--delivery).

## 5-Question Snapshot
- **What:** The system that turns "onboard a new client" from a software project into an admin action. A standard client becomes **config, not a repo**.
- **Why:** This is where the core business KPI is won — a new client live on styled staging in **≤5 [engineer-days](./GLOSSARY.md#core-concepts)** with zero bespoke code.
- **What code:** *(Brayden)* a provisioning workflow that creates a tenant from a form, lifecycle automation for T1, and T0→T1 ejection tooling. *(Julian)* subscribe to tenant lifecycle events and auto-create/retire warehouse partitions + dashboard access.
- **Decisions needed from you:** Confirm the CTR-006 lifecycle event shape; the data-retention/purge policy on deprovision.
- **Next step (Julian):** `DATA-016` — make a new tenant appear in the dashboard automatically, and a deprovisioned one purge cleanly.

---

## What is this?
The onboarding machine. Provisioning a [T0](./GLOSSARY.md#core-concepts) client becomes: create a
row + theme tokens + starter CMS content, and it's live on the shared runtime — no new repo, no new
pipeline. Provisioning a [T1](./GLOSSARY.md#core-concepts) client becomes a single Terraform module
call triggered by a lifecycle event. Both emit standard [CTR-006](./phase-1-contracts.md) events
that the data plane listens to.

## Why are we building it?
- **Business reason:** The entire company thesis is "onboard businesses cheaply at scale." If onboarding is manual, the model doesn't work past a handful of clients. The ≤5-ED KPI *is* the business.
- **Technical reason:** Lifecycle events ([CTR-006](./phase-1-contracts.md)) let both planes react to a new tenant without anyone manually wiring up warehouse partitions or dashboard access.

## What problem does it solve?
- **"Every new client is a week of engineering."** — Phase 6 makes the common case a few hours of config.
- **Drift between planes** — when a tenant is created operationally, the data plane must *automatically* know about it (new partition, dashboard scope). Manual sync would rot immediately.
- **Clean exits** — deprovisioning a client must purge their data everywhere (legal + cost), driven by the same lifecycle event.

## What does success look like?
- A new **T0 client is live on the shared runtime via an admin action** (PLAT-018) — no repo, no pipeline.
- **One command stands up a T1 client end-to-end**, certs and all (INFRA-006).
- A GlowGirl-like client can **eject from T0 to its own T1 repo** with content intact (PLAT-019).
- A new tenant **auto-appears in the dashboard**; deprovision **purges per-tenant data** (DATA-016).
- **Client #2 is onboarded config-only in ≤5 engineer-days** and shows up in the dashboard with no bespoke code (PLAT-020) — the KPI proof.

## What systems are involved?
| System | Repo / Service | Owner |
|:-------|:---------------|:------|
| T0 provisioning workflow (emits CTR-006 events) | `agency-platform` | Brayden |
| Tenant lifecycle automation (T1 via Terraform on `tenant.provisioned`) | `infra` | Brayden |
| T0→T1 ejection tooling | `agency-platform` + `platform-template` | Brayden |
| **Lifecycle → data plane** (partitions, dashboard access, purge) | **`agency-data`** | **Julian** |
| Onboarding runbook + ED KPI tracking | docs | Shared |

## What are we building first?
1. **PLAT-018** (Brayden) — T0 provisioning workflow + CTR-006 lifecycle events.
2. **DATA-016** (Julian) — subscribe to those events; create/retire warehouse partitions + dashboard access; purge on deprovision.
3. **INFRA-006 / PLAT-019** (Brayden) — T1 automation + ejection tooling.
4. **PLAT-020** (Shared) — onboard a real client #2 as the ≤5-ED proof.

## What decisions require my input?
- **CTR-006 event shape** — confirm `tenant.provisioned/updated/deprovisioned` payloads (incl. the tier field) so Julian's subscriber matches.
- **Deprovision data policy** — what "purge per-tenant data" means exactly (immediate vs cooling period; what's retained for legal/billing). Ties to SHARED-004 in Phase 7.
- **Dashboard access provisioning** — how a new tenant's owner gets dashboard access automatically.

## What can be ignored for now?
- **Self-serve signup** (clients onboarding themselves) — this phase is *operator*-driven onboarding; public self-serve is later, if ever.
- **Fleet-scale tooling** (auto-merge, fleet dashboard) — Phase 8.
- **Cross-tenant analytics/training** — gated behind the privacy boundary (SHARED-004, Phase 7).

---

## Status — what's actually done
- ⚪ **Not started.** Depends on the runtime (Phase 3) and dashboard (Phase 5).
- Julian's deliverable (`DATA-016`) is detailed in [`../JULIAN_TASK_PLAN.md`](../JULIAN_TASK_PLAN.md) Step 16.
