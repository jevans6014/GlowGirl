# Phase 7 — AI Foundation

> **Roadmap source:** [`../PLATFORM_ROADMAP.md`](../PLATFORM_ROADMAP.md) → "PHASE 7" (`DATA-017/018/019/020/021`, `SHARED-004`).
> **Glossary:** [Feature store](./GLOSSARY.md#data-plane-plumbing), [RAG](./GLOSSARY.md#data-plane-plumbing), [pgvector](./GLOSSARY.md#data-plane-plumbing), [Services/Actions layer](./GLOSSARY.md#operational-plane-plumbing), [Block](./GLOSSARY.md#operational-plane-plumbing).

## 5-Question Snapshot
- **What:** Turn the accumulated dataset into intelligence — a [feature store](./GLOSSARY.md#data-plane-plumbing) for ML, per-client AI support bots grounded in their own content ([RAG](./GLOSSARY.md#data-plane-plumbing)), AI page drafting, and automated SEO audits.
- **Why:** This is the long-term moat. Once you have clean, contract-validated data across many clients, AI features become a compounding advantage competitors can't copy without the data.
- **What code:** *(Julian)* feature store, `ml` AI package, per-tenant RAG, SEO audit jobs. *(Shared)* AI page drafting wired into Filament. Plus the privacy boundary.
- **Decisions needed from you:** Which LLM provider + spend cap; the privacy/consent policy (SHARED-004); pgvector hosting shape.
- **Next step (Julian):** `DATA-017` — build the feature store over the marts (point-in-time correct).

---

## What is this?
The intelligence layer that sits on top of the warehouse. It has four products:
1. **Feature store (DATA-017)** — serves consistent, point-in-time-correct inputs to ML models, defined over the Phase 5 marts (CTR-005 contract).
2. **AI tool-calling (DATA-018)** — AI agents that perform real actions by calling Brayden's [Services/Actions](./GLOSSARY.md#operational-plane-plumbing) (`CreatePage`, `UpdateBlock`), never by emitting freeform HTML.
3. **Per-tenant RAG support bot (DATA-019)** — a chat bot grounded in *one* client's CMS content via [pgvector](./GLOSSARY.md#data-plane-plumbing), with strict no-cross-tenant-leakage.
4. **AI page drafting (DATA-020) + SEO audit (DATA-021)** — "Draft with AI" produces valid CMS [blocks](./GLOSSARY.md#operational-plane-plumbing); batch jobs propose meta/alt-text/internal-link fixes fleet-wide.

## Why are we building it?
- **Business reason:** AI features (auto-drafting pages, support bots, SEO automation) are high-value upsells and a differentiator. They're only trustworthy *because* the data underneath is clean and contract-validated.
- **Technical reason:** Because AI acts through the Services layer and outputs validated blocks, it can't bypass tenant scoping or corrupt site structure — safety is built in, not bolted on.

## What problem does it solve?
- **"AI that hallucinates and breaks the site."** — Tool-calling through Services + block-schema validation means AI output is always structurally valid and scoped.
- **"A support bot that leaks another client's info."** — Per-tenant pgvector stores guarantee a bot answers only from its own client's content.
- **Manual SEO/content drudgery** — automated, fleet-wide, as reviewable drafts (never auto-published).

## What does success look like?
- A mock model reads **consistent features** from the feature store (DATA-017).
- An agent **drafts a page by calling Services**, not by writing raw HTML (DATA-018).
- The support bot **answers only from one tenant's content** — no cross-tenant leakage (DATA-019).
- AI drafts **validate against block schemas** and never bypass CMS structure (DATA-020).
- An SEO audit produces per-tenant proposals that **land as drafts** (DATA-021).
- A client's data can be **fully exported and deleted**, and cross-tenant training is **gated behind explicit opt-in** (SHARED-004).

## What systems are involved?
| System | Repo / Service | Owner |
|:-------|:---------------|:------|
| Feature store (implements CTR-005) | `agency-data/ml` | Julian |
| `ai` package / tool-calling | `agency-data/ml` + `agency-platform/packages/ai` stub | Julian (uses Brayden's Services) |
| Per-tenant RAG (pgvector) | `agency-data/ml` + Postgres/pgvector | Julian |
| AI page drafting | Filament action (Brayden) + model (Julian) | Shared |
| SEO audit batch jobs | `agency-data/ml` + Horizon/queue | Julian |
| Privacy/data-ownership boundary | both planes | Shared |
| LLM provider | OpenAI / Anthropic API | external |

## What are we building first?
1. **DATA-017** — the feature store over the marts (needs Phase 5 marts).
2. **DATA-018** — the tool-calling contract against Brayden's stable Services layer.
3. **DATA-019** — per-tenant RAG support bot.
4. **DATA-020 / DATA-021** — AI drafting in Filament + SEO audit jobs.
5. **SHARED-004** — the privacy boundary. *Must be done before aggregating a second client's data for any cross-tenant model use.*

## What decisions require my input?
- **LLM provider + spend cap** — OpenAI vs Anthropic; the API key goes in Secrets Manager, never in code; set a hard spend limit.
- **pgvector hosting** — a Postgres+pgvector instance per tenant, or one shared instance with tenant-scoped schemas (infra PR to Brayden).
- **Privacy policy (SHARED-004)** — consent capture, per-tenant export/delete, and the explicit opt-in gate before any cross-tenant model use. This is **legal debt**, not just technical — flag before client #2's data is aggregated.

## What can be ignored for now?
- **Fine-tuning / training custom models** — start with retrieval (RAG) + tool-calling on hosted LLMs; custom training only with opt-in data later.
- **Cross-tenant intelligence** (benchmarks across clients) — explicitly gated behind SHARED-004 opt-in; don't build it speculatively.
- **Real-time AI** — batch jobs are fine for drafting/audits.

---

## Status — what's actually done
- ⚪ **Not started.** Depends on the marts (Phase 5) and stable Services (Phase 2–4).
- Julian's deliverables are detailed in [`../JULIAN_TASK_PLAN.md`](../JULIAN_TASK_PLAN.md) Step 17.
