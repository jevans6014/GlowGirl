# Phase 0 — Foundations

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 0 — FOUNDATIONS" (tasks `INFRA-001/002/003`, `PLAT-001`, `DATA-001`, `SHARED-001/002`).
> **Glossary:** [OIDC](./GLOSSARY.md#infrastructure--delivery), [Terraform/IaC](./GLOSSARY.md#infrastructure--delivery), [ECR](./GLOSSARY.md#infrastructure--delivery), [CI](./GLOSSARY.md#process--quality), [ADR](./GLOSSARY.md#process--quality).

## 5-Question Snapshot
- **What:** The empty-but-working skeletons of everything — AWS accounts, networking, container image, both code monorepos, and shared CI. No product features yet.
- **Why:** You can't safely build a platform on an account with no guardrails or repos with no test pipeline. This phase makes every later step deployable and reversible.
- **What code:** Two repo skeletons (`agency-platform` in PHP, `agency-data` in Python), Terraform for AWS base, GitHub Actions CI, CODEOWNERS.
- **Decisions needed from you:** Create the `agency-data` GitHub repo; confirm GitHub org vs personal account; (with Brayden) AWS account structure.
- **Next step:** Push the already-built `agency-data` skeleton once the GitHub repo exists.

---

## What is this?
The "hello world" of the whole company's infrastructure. By the end of Phase 0, both engineers can
independently push code, have it tested by CI, and deploy a trivial container to AWS using **no
stored secret keys**. Nothing here does anything for a customer — it's the safe, automated ground
floor everything else stands on.

## Why are we building it?
- **Business reason:** Every hour later in the project is cheaper and safer if the foundation is automated and access is controlled. Mistakes here (e.g. leaked AWS keys) are the most expensive kind.
- **Technical reason:** Parallel work (Brayden + Julian) only works if both repos have identical CI ergonomics and clear ownership boundaries from line one.

## What problem does it solve?
- No more "works on my machine" — CI runs the same checks for everyone.
- No long-lived AWS keys to leak — GitHub deploys via [OIDC](./GLOSSARY.md#infrastructure--delivery) role assumption.
- No accidental cross-plane edits — [CODEOWNERS](./GLOSSARY.md#process--quality) enforces who reviews what.

## What does success look like?
- A GitHub Action assumes an AWS role and runs `aws sts get-caller-identity` with **zero stored keys** (INFRA-001).
- `terraform apply` from CI provisions a VPC; plans post as PR comments (INFRA-002).
- A golden container image runs `php artisan --version` with a clean vulnerability scan (INFRA-003).
- `composer test` (platform) and `pytest` (data) pass green on empty packages, and CI runs on every PR (PLAT-001, DATA-001).
- D1–D4 are written down as [ADRs](./GLOSSARY.md#process--quality) (SHARED-002).

## What systems are involved?
| System | Repo / Service | Owner | Role in this phase |
|:-------|:---------------|:------|:-------------------|
| AWS Organizations, IAM Identity Center, GuardDuty, billing alarms | AWS (via `infra`) | Brayden | Safe multi-account base |
| Terraform state (S3 + DynamoDB), VPC, ECR | `infra` | Brayden | Network + state backend |
| FrankenPHP base image | `infra` + `agency-platform/runtime` | Brayden | One runtime image for all PHP apps |
| `agency-platform` monorepo | `agency-platform` | Brayden | Home of the operational packages |
| `agency-data` monorepo | `agency-data` | **Julian** | Home of ingestion/warehouse/AI |
| Reusable CI workflows + branch protection | `infra` + both repos | Shared | Identical pipelines everywhere |

## What are we building first?
1. **INFRA-001** — AWS Organizations + Identity Center + OIDC provider (Brayden). *Everything else waits on this for real AWS access.*
2. **SHARED-001** — reusable CI workflow + branch protection + CODEOWNERS.
3. **PLAT-001 / DATA-001** — the two monorepo skeletons (can scaffold locally before CI is shared).
4. **INFRA-002 / 003** — Terraform backbone + VPC, then the container base image.
5. **SHARED-002** — capture D1–D4 as ADRs.

## What decisions require my input?
- **Create the `agency-data` GitHub repo** and tell me **personal account vs agency org** (changes the remote URL and the CODEOWNERS handle). *This is the only thing blocking the push right now.*
- **Branch protection rules** on `main` (require PR + green CI) — confirm you want this enforced.
- With Brayden: the **AWS account layout** (management vs workloads) and that Julian gets an SSO login to the workloads account.

## What can be ignored for now?
- Anything about scaling, cost controls, RDS Proxy, fleet dashboards — that's Phase 8.
- Real product packages (CMS, commerce) — Phase 2.
- The actual data lake/warehouse — Phase 2 (only the empty `agency-data` skeleton exists now).

---

## Status — what's actually done
- 🟢 **DATA-001 (Julian):** `agency-data` monorepo is scaffolded at `~/Desktop/me-be-me/agency-data` — `uv` workspace with `ingest/`, `warehouse/` (dbt), `ml/`, `dashboard-api/`, `analytics-sdk-js/`, plus `ruff` + `mypy --strict` + `pytest` all green and a GitHub Actions CI file. Committed locally (`051de91`).
- 🟡 **Pending:** create the GitHub repo + push; swap the local CI for SHARED-001's reusable workflow once Brayden publishes it.
- ⚪ **Brayden's INFRA/PLAT/SHARED tasks:** tracked in the roadmap; Julian's only dependency on them is AWS SSO access (needed in Phase 2, not yet).
