---
description: Safely back up and protect the Supabase database for this project
---

# Supabase Backup & Safety

Goal: always be able to answer "what if I lose my database?" Never ship a live
service with real users without a recovery path.

## Safety rules (read first)
- NEVER run destructive commands casually. `supabase db reset` WIPES all data.
- Do NOT run `supabase link` until you understand what each command does.
- Always warn before any destructive DB operation and confirm a fresh backup exists.
- Keep secrets out of git. Database password and connection strings must never be committed.

## Option 1 — Easiest: Supabase Pro
- Pro includes automatic daily backups with 7-day retention.
- Best low-effort insurance for a live project.

## Option 2 — Free manual backup (Supabase CLI)
1. Install the Supabase CLI: https://supabase.com/docs/guides/local-development/cli/getting-started
2. Create a dated backup (replace `[PASSWORD]` and `[PROJECT_REF]`):

```bash
supabase db dump \
  --db-url "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  -f "backup_$(date +%Y%m%d).sql"
```

- `[PASSWORD]` = the database password (set at project signup, NOT your account password).
- `[PROJECT_REF]` = the project ID found in project settings.
- Keep dated copies somewhere safe (NOT committed to git).

## Option 3 — Recommended: automated backups via GitHub Actions
- Set up scheduled backups so you don't rely on remembering.
- Docs: https://supabase.com/docs/guides/deployment/ci/backups

## Long-term proper workflow (adopt gradually)
- Run Supabase locally with Docker.
- Manage schema with migration files.
- Use a staging environment.
- Promote changes with `supabase db push` and `supabase migrations up`.

## Project shell goal
- This backup setup should be part of the reusable website "shell" / boilerplate,
  so every new plug-and-play site inherits backup safety from day one.
