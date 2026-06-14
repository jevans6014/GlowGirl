# Phase 9 — AWS Migration (local → cloud)

> **Roadmap source:** Extracted from original Phase 0 INFRA tasks, now deferred until local validation complete.
> **Glossary:** [OIDC](./GLOSSARY.md#infrastructure--delivery), [Terraform/IaC](./GLOSSARY.md#infrastructure--delivery), [RDS](./GLOSSARY.md#infrastructure--delivery), [S3](./GLOSSARY.md#infrastructure--delivery), [ECS/Fargate](./GLOSSARY.md#infrastructure--delivery), [ALB](./GLOSSARY.md#infrastructure--delivery).

## 5-Question Snapshot
- **What:** Lift the entire platform from local docker-compose to AWS production infrastructure — RDS, S3, Kinesis, ECS, ALB, CloudFront. **The same codebase that worked locally now runs in the cloud.**
- **Why:** Local validation proved the concept works. Now deploy it to production-grade, scalable infrastructure for real traffic and real clients.
- **What code:** Terraform modules (VPC, RDS, S3, ECS, ALB), AWS account setup (Organizations, IAM, OIDC), connection string updates, environment variable changes. **Zero application logic changes.**
- **Decisions needed from you:** AWS account structure (management vs workloads), region, cost guardrails, production domain names.
- **Next step:** INFRA-001 — AWS Organizations + IAM Identity Center + OIDC provider.

---

## What is this?
The infrastructure migration phase. Everything that ran in docker-compose (Postgres, MinIO, Redis, the runtime, the collector) now runs on AWS managed services. The **application code doesn't change** — only connection strings, environment variables, and deployment targets.

## Why are we building it?
- **Business reason:** Local development can't serve real customers. AWS provides production-grade reliability, backups, scaling, and global CDN (CloudFront).
- **Technical reason:** You've already validated the platform works locally. This phase is pure infrastructure — no logic risk, just operational setup.

## What problem does it solve?
- **Local limitations:** docker-compose can't handle real traffic, doesn't have backups, can't scale, isn't globally distributed.
- **Production readiness:** AWS gives you RDS automated backups, S3 durability, ECS auto-scaling, ALB health checks, CloudFront edge caching.
- **Team access:** IAM Identity Center gives both engineers secure, auditable AWS access without shared keys.

## What does success look like?
- GitHub Actions assumes an AWS role via OIDC and runs `aws sts get-caller-identity` with **zero stored keys** (INFRA-001).
- `terraform apply` from CI provisions VPC, RDS, S3, ECS, ALB; plans post as PR comments (INFRA-002).
- The runtime container runs on ECS Fargate, serves traffic via ALB + CloudFront (INFRA-004).
- Events flow from production sites → Kinesis Firehose → S3 → Athena/dbt (DATA-002 production).
- **The GlowGirl pilot cutover:** DNS switches to the AWS-hosted version; Supabase is decommissioned after 30-day cooling period (PILOT-007/008).
- **Zero application code changes** — the same containers/packages that ran locally now run on AWS.

## What systems are involved?
| System | AWS Service | Owner | Role |
|:-------|:------------|:------|:-----|
| AWS Organizations, IAM Identity Center, GuardDuty | AWS | Brayden | Multi-account governance |
| Terraform state backend | S3 + DynamoDB | Brayden | Remote state for all infra |
| VPC, subnets, NAT, security groups | VPC | Brayden | Network foundation |
| Container registry | ECR | Brayden | Docker image storage |
| Database | RDS Postgres | Shared | Replaces local Postgres |
| Cache + queue | ElastiCache Redis | Brayden | Replaces local Redis |
| Event lake | S3 + Glue + Athena | Julian | Replaces local MinIO |
| Event ingestion | Kinesis Firehose → S3 | Julian | Replaces direct MinIO writes |
| Runtime hosting | ECS Fargate + ALB + CloudFront | Brayden | Replaces local docker-compose |
| Secrets | Secrets Manager | Shared | Replaces `.env` files |
| DNS + SSL | Route53 + ACM | Brayden | Production domains |

## What are we building first?
1. **INFRA-001** — AWS Organizations + IAM Identity Center + OIDC provider (Brayden). *Blocks all other AWS work.*
2. **INFRA-002** — Terraform state backend (S3 + DynamoDB) + VPC module (Brayden).
3. **INFRA-003** — ECR + golden FrankenPHP container image (Brayden).
4. **DATA-002-PROD** — S3 event lake + Glue catalog + Kinesis Firehose (Julian). *Replaces local MinIO.*
5. **DATA-003-PROD** — Collector on Lambda or Fargate, writes to Firehose (Julian). *Replaces local collector.*
6. **DATA-005-PROD** — Athena workgroup + dbt connection to Athena or RDS (Julian).
7. **INFRA-004** — ECS cluster + Fargate service + ALB + CloudFront for T0 runtime (Brayden).
8. **INFRA-005** — T1/T2 Terraform modules (Brayden). *For GlowGirl and future isolated clients.*
9. **PILOT-007** — GlowGirl staging deployment on AWS (Shared).
10. **PILOT-008** — Production cutover: DNS switch, Supabase decommission (Shared).

## What decisions require my input?
- **AWS account structure:** Single account vs management + workloads accounts (recommend multi-account).
- **Region:** Default `us-east-1` or closer to your users (affects latency + some service availability).
- **Cost guardrails:** Billing alarms (e.g. alert at $100/month), S3 lifecycle rules, RDS instance size.
- **Production domains:** e.g. `glowgirl.com`, `collect.youragency.com`, `dashboard.youragency.com`.
- **Collector deployment:** Lambda + API Gateway (cheaper, scales to zero) vs Fargate (consistent, easier debugging). Recommend Lambda.
- **dbt warehouse target:** Athena (serverless, pay-per-query) vs RDS Postgres (consistent, easier local parity). Recommend Athena for cost.
- **IAM access:** Confirm Julian gets IAM Identity Center login to workloads account.

## What can be ignored for now?
- **Multi-region / DR:** Phase 8 (DATA-024).
- **Advanced cost controls:** RDS Proxy, connection pooling, reserved instances — Phase 8.
- **Fleet dashboard:** Phase 8 (DATA-023).
- **Real-time streaming:** Still deferred; batch Firehose is enough.

## The migration checklist (what changes from local → AWS)

### Application code changes: **NONE**
The same Docker images, the same packages, the same dbt models run on AWS. Only configuration changes:

### Configuration changes:
| Component | Local | AWS | Change |
|:----------|:------|:----|:-------|
| Database | `postgres://localhost:5432/warehouse` | `postgres://rds-endpoint:5432/warehouse` | Connection string in `.env` / Secrets Manager |
| Redis | `redis://localhost:6379` | `redis://elasticache-endpoint:6379` | Connection string |
| Event storage | MinIO `http://localhost:9000` | S3 `s3://events-raw-bucket` | S3 client config |
| Collector endpoint | `http://localhost:8080/collect` | `https://collect.youragency.com/collect` | SDK config, CORS |
| Runtime URL | `http://tenant1.localhost:8000` | `https://tenant1.youragency.com` | DNS, SSL cert |
| Secrets | `.env` files (gitignored) | AWS Secrets Manager | Fetch at runtime |

### Deployment changes:
| Component | Local | AWS |
|:----------|:------|:----|
| Runtime | `docker-compose up runtime` | ECS Fargate task behind ALB |
| Collector | `docker-compose up collector` | Lambda function or Fargate service |
| dbt | `dbt run` on laptop | ECS scheduled task or GitHub Actions |
| Database migrations | `php artisan migrate` locally | ECS one-off task or CI |

---

## Status — what's actually done
- ⚪ **Not started.** This phase begins only after Phases 0–4 are validated locally (all tests green, visual confirmation, funnel queryable).
- 🔵 **Gate:** Do not start Phase 9 until you can demonstrate the six local success criteria from [`LOCAL_FIRST_APPROACH.md`](./LOCAL_FIRST_APPROACH.md).
- **Estimated timeline:** 2–3 weeks after local validation (INFRA tasks are Brayden-heavy; Julian's DATA-002/003/005-PROD are straightforward lifts).

---

## Post-migration validation (how to confirm AWS works)

After deploying to AWS, re-run the same validation you did locally:

1. ✅ **End-to-end event flow:** Click a button on AWS-hosted GlowGirl → event in S3 → dbt processes it → query the mart in RDS/Athena.
2. ✅ **Multi-tenant isolation:** Two tenants on AWS serve different content; cross-tenant queries fail.
3. ✅ **Dashboard:** AWS-hosted dashboard UI queries the AWS-hosted `dashboard-api` and shows a funnel.
4. ✅ **All tests green:** Contract tests, E2E tests (Playwright against staging URL).
5. ✅ **Identity resolution:** Same stitching logic works on AWS data.
6. ✅ **Performance:** Page loads <2s; dbt full-refresh acceptable on real data volume.

**Only when all six are true on AWS** do you proceed to production cutover (PILOT-008).

---

## Why this phase comes last

**Original plan:** Phase 0 was AWS setup, blocking all later work.

**Revised plan:** Phase 9 is AWS setup, after local validation.

**Why the change:**
- **De-risks the architecture:** If the platform doesn't work locally, you find out in days, not weeks of AWS debugging.
- **Faster iteration:** Local changes take seconds; AWS deployments take minutes.
- **Zero cloud cost during development:** AWS bills start only when you're confident the platform works.
- **Simpler debugging:** Local logs, local database inspection, local network traces beat CloudWatch/X-Ray.
- **Proven migration path:** Hundreds of projects have successfully gone local → AWS with this approach. Very few have gone AWS-first without regrets.

**The contract:** If it works in docker-compose, it works on AWS. The migration is configuration, not code.
