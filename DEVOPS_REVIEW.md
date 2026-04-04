# Rotawell — DevOps, DevSecOps & CI/CD Pipeline Review

**Date:** 2026-04-04
**Reviewed by:** Claude (AI Assistant)
**App:** Rotawell (careorbit-app) — Next.js 14 + Supabase + Vercel
**Audience:** Founder / solo maintainer. Claude handles ongoing model maintenance.

---

## Executive Summary

| Area | Current State | Risk Level |
|------|--------------|------------|
| CI/CD Pipeline | None — Vercel auto-deploy from local push only | 🔴 Critical |
| Dependency Vulnerabilities | 4 High, 2 Low (Next.js CVEs active) | 🔴 Critical |
| Secret Scanning | No git history to scan (not a git repo yet) | 🟡 Medium |
| Monitoring & Observability | None — no Sentry, Datadog, or APM | 🔴 Critical |
| Error Tracking | None | 🔴 Critical |
| Pre-commit Hooks | None (no Husky/lint-staged) | 🟡 Medium |
| Infrastructure as Code | None | 🟡 Medium |
| Database Backup Strategy | Supabase built-in only, no documented policy | 🟡 Medium |
| SAST | ESLint only (no security rules) | 🟠 High |
| Environment Management | dev/prod only, no staging | 🟠 High |

---

## Part 1: DevOps Review

### 1.1 Current Deployment Architecture

```
Developer Machine
      │
      │  manual push / Vercel CLI
      ▼
Vercel (Production)
  - Next.js 14 serverless functions
  - Edge middleware (auth routing)
  - CDN for static assets
  - Automatic HTTPS
      │
      │  supabase-js client (anon key + service role key)
      ▼
Supabase (Production)
  - PostgreSQL database (managed)
  - Auth (JWT + cookie sessions)
  - Row Level Security on all tables
  - Realtime subscriptions (available)
  - Storage (Supabase CDN)
```

**What's working well:**
- Vercel + Supabase is a solid production-grade pairing for this scale
- RLS is enabled on all tables — strong security baseline
- Next.js middleware handles role-based routing server-side
- SWC minification + React Strict Mode enabled

**Critical gaps:**
- No staging environment — every change ships directly to production users
- No git repository initialised — deployment history is lost
- No rollback mechanism documented

---

### 1.2 Environment Management

**Current state:** Two implied environments (local dev + Vercel production). No staging.

**Recommended three-tier model:**

| Environment | Purpose | Vercel Project | Supabase Project |
|-------------|---------|---------------|-----------------|
| `development` | Local dev | `next dev` | Supabase local CLI |
| `staging` | Pre-prod validation | `rotawell-staging` (separate Vercel project) | Separate Supabase project |
| `production` | Live users | `rotawell-prod` | Existing production project |

**Action items:**
1. Create a second Supabase project for staging (free tier is fine)
2. Create a `rotawell-staging` Vercel project linked to the `staging` branch
3. Add environment-specific variables to each Vercel project dashboard
4. Add `NEXT_PUBLIC_ENVIRONMENT=staging` to staging env — use this to show a staging banner

**Environment variables to add:**
```bash
# Add to all environments
NEXT_PUBLIC_ENVIRONMENT=development|staging|production
SENTRY_DSN=<from Sentry>
SENTRY_AUTH_TOKEN=<for source maps>
NEXT_PUBLIC_SENTRY_DSN=<same DSN, public>
```

---

### 1.3 Infrastructure as Code

**Current state:** Zero IaC. All infrastructure configured through Vercel and Supabase dashboards.

**Recommendation:** For a solo-maintained app at this stage, full Terraform is overkill. Prioritise:

1. **Vercel config-as-code via `vercel.json`** — commit deployment rules, headers, redirects
2. **Supabase migrations in version control** — already started (3 migration files in `supabase/migrations/`) — continue this pattern
3. **`supabase/config.toml`** — initialise Supabase CLI locally to lock project config

**Create `vercel.json`:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

---

### 1.4 Monitoring and Observability

**Current state:** Zero monitoring. No error tracking, no APM, no uptime monitoring.

**This is the highest-priority gap for a production app serving real users.**

#### Recommended Stack (all have generous free tiers)

| Tool | Purpose | Cost |
|------|---------|------|
| **Sentry** | Error tracking + performance | Free up to 5k errors/month |
| **Vercel Analytics** | Core Web Vitals + page performance | Free (built-in) |
| **BetterUptime** or **UptimeRobot** | Uptime monitoring + alerting | Free tier available |
| **Supabase Dashboard** | DB query performance, connection pool | Built-in |

#### Sentry Setup (Next.js 14)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  // ... existing config
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: "rotawell",
  project: "rotawell-nextjs",
  hideSourceMaps: true,
});
```

Create `sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});
```

#### Enable Vercel Analytics

```bash
npm install @vercel/analytics @vercel/speed-insights
```

Add to `src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// In the root layout:
<Analytics />
<SpeedInsights />
```

---

### 1.5 Backup and Disaster Recovery

**Current state:** Supabase manages PostgreSQL backups. Free tier: daily backups, 7-day retention. Pro tier: PITR (Point-in-Time Recovery).

**Recommendations:**

| Tier | Backup Policy | RTO | RPO |
|------|-------------|-----|-----|
| Current (Free) | Supabase daily backup | ~4 hours | 24 hours |
| Recommended (Pro) | Supabase PITR | ~1 hour | 5 minutes |

**Action items:**
1. Upgrade to Supabase Pro ($25/month) when live users are present — enables PITR
2. Document a recovery runbook — what steps to restore, who has access, test quarterly
3. Export critical data (user profiles, shifts, billing) weekly via Supabase scheduled function to cloud storage
4. Store `supabase/migrations/` in git — this IS your schema recovery path

**Recovery runbook outline:**
```
1. Supabase dashboard → Settings → Backups → Restore to point in time
2. Vercel → Deployments → Redeploy last known-good deployment
3. Update DNS if needed
4. Notify users via status page
5. Post-incident review within 48 hours
```

---

### 1.6 Uptime Monitoring and Alerting

**Current state:** None.

**Setup BetterUptime (free tier):**
1. Create account at betteruptime.com
2. Add monitor: `https://rotawell.com` (or your Vercel domain) — check every 3 minutes
3. Add monitor: `https://rotawell.com/api/health` — create this health endpoint
4. Configure email + Slack/SMS alerts on downtime
5. Create a public status page for users

**Create `src/app/api/health/route.ts`:**
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    // Lightweight query to verify DB connectivity
    const { error } = await supabase.from('nursly_profiles').select('id').limit(1);

    if (error) throw error;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
      db: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', db: 'disconnected' },
      { status: 503 }
    );
  }
}
```

---

### 1.7 Performance Optimization

**Current state:** Vercel CDN serves static assets. No additional caching layer.

**Already implemented:**
- SWC minification
- Next.js automatic code splitting
- Supabase CDN for images (`*.supabase.co` in remotePatterns)
- Tailwind CSS purging (unused styles stripped at build)

**Recommended additions:**

1. **Vercel Edge Config** — store feature flags and config at the edge (zero latency reads)
2. **`next/image` optimisation** — ensure all user-uploaded images route through `next/image` for lazy loading + WebP conversion
3. **React Server Components** — audit data-fetching components; move Supabase queries server-side where possible to reduce client bundle size
4. **Cache-Control headers** — add to API routes:
   ```typescript
   // For public, infrequently changing data
   return NextResponse.json(data, {
     headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
   });
   ```
5. **Supabase connection pooling** — enable PgBouncer in Supabase dashboard (critical as user count grows)

---

### 1.8 Database Management

**Current state:** 3 migration files in `supabase/migrations/`. No CLI tooling configured. No automated migration runner.

**Migration workflow to adopt:**

```bash
# Local development
supabase init                          # one-time setup
supabase start                         # start local Supabase instance
supabase db diff -f new_feature        # auto-generate migration from schema diff
supabase db push                       # apply to remote (staging/prod)

# CI/CD (automated)
supabase db push --db-url $SUPABASE_DB_URL   # runs in GitHub Actions
```

**Database health checklist:**
- [ ] Enable PgBouncer (connection pooling) in Supabase dashboard
- [ ] Set up slow query alerting (Supabase Pro: query performance advisor)
- [ ] Review index coverage — ensure `nursly_profiles(user_id)`, shift tables on `provider_id`/`worker_id` are indexed
- [ ] Review RLS policy performance — complex RLS can cause slow queries
- [ ] Set `statement_timeout` to prevent runaway queries

---

## Part 2: DevSecOps Review

### 2.1 Dependency Vulnerability Scan (npm audit)

**Scan date:** 2026-04-04
**Registry:** registry.npmjs.org

#### Results: 6 vulnerabilities (4 High, 2 Low)

| Package | Severity | CVE/Advisory | Description | Fix |
|---------|---------|-------------|-------------|-----|
| `next` 14.0.0 | **HIGH** | GHSA-9g9p-9gw9-jx7f | DoS via Image Optimizer remotePatterns misconfiguration | Upgrade to Next.js 15.x |
| `next` 14.0.0 | **HIGH** | GHSA-h25m-26qc-wcjf | HTTP request deserialization DoS via insecure RSC | Upgrade to Next.js 15.x |
| `next` 14.0.0 | **HIGH** | GHSA-ggv3-7p47-pfv8 | HTTP request smuggling via rewrites | Upgrade to Next.js 15.x |
| `next` 14.0.0 | **HIGH** | GHSA-3x4c-7xq6-9pq8 | Unbounded `next/image` disk cache growth | Upgrade to Next.js 15.x |
| `glob` 10.2.0 | **HIGH** | GHSA-5j98-mcp5-4vw2 | CLI command injection via `-c/--cmd` flag | `npm audit fix` |
| `eslint-config-next` | **LOW** | (transitive via glob) | Depends on vulnerable glob | Fixed with glob fix |

> **Note:** `npm audit fix --force` would upgrade to Next.js 16.x (breaking change). The correct path is a **controlled Next.js 15 upgrade** — test thoroughly on staging first.

**Immediate actions:**
1. `npm audit fix` — fixes glob (non-breaking)
2. Plan Next.js 15 upgrade: test App Router compatibility, review breaking changes at nextjs.org/docs/upgrading
3. Add `npm audit --audit-level=high` as a CI gate (blocks deployments on high/critical vulns)

---

### 2.2 SAST — Static Application Security Testing

**Current state:** `eslint` + `eslint-config-next` only. No security-focused lint rules.

**Recommended tools:**

| Tool | Type | Integration |
|------|------|------------|
| `eslint-plugin-security` | ESLint security rules | Add to `.eslintrc` |
| `eslint-plugin-no-secrets` | Detects hardcoded secrets | Add to `.eslintrc` |
| **Semgrep** (free) | Pattern-based SAST | GitHub Actions step |
| **CodeQL** (free for public repos) | Deep semantic analysis | GitHub Actions |
| **Snyk** (free tier) | Dep + SAST combined | GitHub Actions + IDE |

**Install ESLint security plugins:**
```bash
npm install --save-dev eslint-plugin-security eslint-plugin-no-secrets
```

**Update `.eslintrc.json`:**
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:security/recommended"
  ],
  "plugins": ["security", "no-secrets"],
  "rules": {
    "no-secrets/no-secrets": "error",
    "security/detect-object-injection": "warn",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-possible-timing-attacks": "error"
  }
}
```

---

### 2.3 DAST — Dynamic Application Security Testing

**Current state:** None.

For a Vercel-deployed app, container-based DAST tools (OWASP ZAP Docker) can run against the staging URL in CI.

**Recommended approach:**
```yaml
# In GitHub Actions CI (staging only, not every PR)
- name: OWASP ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.11.0
  with:
    target: 'https://rotawell-staging.vercel.app'
    rules_file_name: '.zap/rules.tsv'
    fail_action: false  # warn only, don't block
```

Focus areas for manual DAST:
- Authentication bypass attempts (worker accessing provider routes)
- IDOR vulnerabilities (can worker A view worker B's data via API?)
- SQL injection through Supabase query parameters
- XSS in user-generated content (shift descriptions, notes)

---

### 2.4 Container/Image Scanning

**Current state:** Not applicable. App is deployed serverless via Vercel — no Docker containers.

If containerisation is added in future (e.g., self-hosted Supabase, worker services), use:
- **Trivy** (free, fast): `trivy image rotawell:latest`
- **Docker Scout** (free tier): integrated into Docker Hub

---

### 2.5 Secret Scanning in Git History

**Current state:** **No git repository** — the project directory is not a git repo. This is both a risk and an opportunity.

**Risk:** No version control means no audit trail, no rollback, no collaboration history.

**Opportunity:** Start clean — no secrets have been committed yet.

**Immediate actions:**
1. Initialise git: `git init && git add . && git commit -m "Initial commit"`
2. Verify `.gitignore` excludes secrets before first commit:
   ```
   .env.local
   .env.*.local
   .vercel
   .next
   node_modules
   ```
3. **After** pushing to GitHub, install **git-secrets** or use **GitHub Secret Scanning** (automatic on all repos)
4. Add **gitleaks** to pre-commit hooks (see CI/CD section)

**`.gitignore` audit — check these are present:**
```
# Should be in .gitignore:
.env.local          ✓ (verify)
.env.production     ✓ (add if not present)
*.pem
.vercel             ✓ (verify)
```

---

### 2.6 License Compliance

**Current state:** All dependencies appear to be MIT or Apache 2.0 licensed. No audit tooling in place.

**Dependency licenses:**

| Package | License | Commercial Use |
|---------|---------|---------------|
| next | MIT | ✅ |
| react / react-dom | MIT | ✅ |
| @supabase/supabase-js | MIT | ✅ |
| @supabase/ssr | MIT | ✅ |
| tailwindcss | MIT | ✅ |
| lucide-react | ISC | ✅ |
| clsx | MIT | ✅ |
| tailwind-merge | MIT | ✅ |

**Add license checking to CI:**
```bash
npm install --save-dev license-checker
npx license-checker --onlyAllow 'MIT;Apache-2.0;ISC;BSD-2-Clause;BSD-3-Clause;0BSD'
```

---

### 2.7 Supply Chain Security

**Current state:** No supply chain protections in place.

**Recommendations:**

1. **Lock file integrity** — `package-lock.json` exists, which pins exact versions. Never delete it.

2. **`npm ci` instead of `npm install` in CI** — `npm ci` is deterministic and validates against lock file:
   ```yaml
   - run: npm ci  # NOT npm install
   ```

3. **Dependabot** (free, GitHub) — enable in `.github/dependabot.yml`:
   ```yaml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
       open-pull-requests-limit: 5
       groups:
         minor-and-patch:
           update-types:
             - "minor"
             - "patch"
   ```

4. **Verify package integrity** — npm verifies package checksums automatically; no extra config needed.

5. **Avoid `^` (caret) ranges for critical dependencies** — pin exact versions for `next`, `@supabase/supabase-js` to prevent surprise upgrades:
   ```json
   "next": "15.1.0",
   "@supabase/supabase-js": "2.39.0"
   ```

---

## Part 3: CI/CD Pipeline Review

### 3.1 Current Pipeline

**Status: None.**

The current deployment flow:
```
Local machine → npm run build (manual) → Vercel CLI push / git push → auto-deploy
```

There is:
- No automated testing before deploy
- No linting gate
- No security scanning
- No staging deployment
- No rollback process

---

### 3.2 Recommended Pipeline Design

#### Overview

```
┌──────────────────────────────────────────────────────────────────┐
│ PRE-COMMIT (local, fast, <30s)                                   │
│  gitleaks → lint → type-check → format                          │
└──────────────┬───────────────────────────────────────────────────┘
               │ git push
               ▼
┌──────────────────────────────────────────────────────────────────┐
│ CI — PULL REQUEST (GitHub Actions, ~5 min)                      │
│  lint → type-check → build → unit tests → npm audit →          │
│  Semgrep SAST → bundle size check                               │
└──────────────┬───────────────────────────────────────────────────┘
               │ merge to staging
               ▼
┌──────────────────────────────────────────────────────────────────┐
│ STAGING DEPLOY (GitHub Actions, ~3 min)                         │
│  deploy to Vercel staging → smoke tests → OWASP ZAP scan        │
└──────────────┬───────────────────────────────────────────────────┘
               │ merge to main (manual approval)
               ▼
┌──────────────────────────────────────────────────────────────────┐
│ PRODUCTION DEPLOY (GitHub Actions, ~3 min)                      │
│  deploy to Vercel prod → health check → Sentry release tag      │
└──────────────────────────────────────────────────────────────────┘
```

#### Pre-commit Hooks (Husky + lint-staged)

```bash
npm install --save-dev husky lint-staged
npx husky init
```

`.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

`.husky/commit-msg`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
# Enforce conventional commits
npx commitlint --edit $1
```

`package.json` additions:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

**Add gitleaks for secret detection:**
```bash
# Install: brew install gitleaks
# .husky/pre-commit — add before lint-staged:
gitleaks protect --staged --no-banner
```

---

### 3.3 Branch Strategy

**Recommended: GitHub Flow (simplified GitFlow)**

```
main (production)
  │
  ├── staging (pre-prod, auto-deploys to staging Vercel)
  │
  └── feature/*, fix/*, chore/* (short-lived branches)
```

**Rules:**
- `main` — protected, requires PR + CI pass + manual review (by Claude or founder)
- `staging` — protected, auto-merges from `feature/*` after CI passes
- Feature branches — named `feature/shift-rating`, `fix/auth-loop`, etc.
- Direct commits to `main` forbidden except hotfixes (with `fix/hotfix-*` branch + expedited PR)

**Commit message convention (Conventional Commits):**
```
feat: add instant pay request flow
fix: resolve RLS policy for agency staff shift access
chore: upgrade Next.js to 15.1.0
security: bump glob to address GHSA-5j98-mcp5-4vw2
```

---

### 3.4 Release Management

**Versioning:** Semantic Versioning (semver) via automated releases

```bash
npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/git
```

**Release process:**
1. Feature merged to `staging` → auto-deploys to staging Vercel project
2. Staging verified (smoke tests pass, no Sentry errors for 30 min)
3. PR from `staging` → `main` opened (auto-generated by CI)
4. Claude or founder reviews diff, approves, merges
5. CI deploys to production Vercel, creates GitHub Release with changelog, tags Sentry release

**Rollback procedure:**
- Vercel: Dashboard → Deployments → select previous deployment → "Promote to Production" (instant, ~10 seconds)
- Database: Supabase PITR restore (if schema migration was the issue)
- Never roll back a DB migration without a `down` migration script prepared

---

### 3.5 Feature Flags Strategy

Feature flags allow Claude to merge incomplete features to `main` without exposing them to users.

**Recommended: Vercel Edge Config** (zero-latency, no extra service)

```typescript
// lib/flags.ts
import { createClient } from '@vercel/edge-config';

export const flags = {
  INSTANT_PAY_ENABLED: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
    ? false  // controlled via Edge Config
    : true,  // always on in dev/staging
};
```

For more complex scenarios, **PostHog** (open-source, generous free tier) provides:
- Feature flags with rollout percentages
- A/B testing
- Session replay (privacy-preserving)
- Product analytics

---

## Part 4: AI-Assisted Model Maintenance Plan

Since Claude (this AI assistant) handles ongoing code maintenance, the following safeguards ensure changes are safe, auditable, and reversible.

### 4.1 Code Review Structure for Claude

**Before any code change, Claude must:**
1. Read the affected files in full — never make changes based on memory alone
2. State the current behaviour and the intended change
3. Identify all files that will be touched
4. Flag any database schema changes (require separate migration file)
5. Flag any changes to auth middleware or RLS policies (high-risk)

**Change categories and approval requirements:**

| Category | Examples | Review Required |
|----------|---------|----------------|
| **UI/UX** | Styling, layout, copy | Claude autonomous |
| **Logic** | Business rules, data processing | Claude + founder spot-check |
| **Auth/RLS** | Middleware, policies, roles | Founder approval required |
| **Schema** | New tables, column changes | Founder approval + migration review |
| **Dependencies** | npm install/upgrade | Vulnerability scan first |
| **Secrets/Config** | Env vars, API keys | Founder only |

**Claude code review checklist:**
```
[ ] Read all affected files before editing
[ ] No hardcoded secrets, URLs, or environment-specific values
[ ] TypeScript types updated to match any schema changes
[ ] RLS policies cover the new feature (if DB change)
[ ] No console.log left in production code
[ ] Error states handled (loading, empty, error)
[ ] Mobile responsive (Tailwind responsive classes)
[ ] Existing tests still pass (npm run build succeeds as minimum)
```

---

### 4.2 Automated Checks Before Claude Makes Changes

The CI pipeline (`.github/workflows/ci.yml`) provides automated gates. Claude should additionally verify locally:

```bash
# Run before proposing any change:
npm run lint          # ESLint — catches code quality issues
npm run build         # Full Next.js build — catches type errors + broken imports
npm audit --registry https://registry.npmjs.org  # Check for new vulns
```

**Pre-flight for database changes:**
```bash
# Validate migration syntax locally
supabase db reset              # Apply all migrations to local DB
supabase db diff               # Verify no unintended schema drift
```

---

### 4.3 Database Migrations — Safe Handling

**Migration rules (non-negotiable):**

1. **Always forward-only** — write `up` migration only; if rollback needed, write a new `down` migration file
2. **One concern per file** — don't mix schema changes with data migrations
3. **Non-destructive by default** — prefer `ADD COLUMN` over `ALTER COLUMN`; never `DROP COLUMN` in the same migration that stops using it
4. **Test on staging first** — apply to staging Supabase project, verify app works, then apply to production
5. **Backup before risky migrations** — trigger a manual Supabase backup before running `DROP`, `ALTER TYPE`, or large `UPDATE` statements

**Migration naming convention:**
```
supabase/migrations/
  YYYYMMDDHHMMSS_description_in_snake_case.sql

Examples:
  20260404000000_add_missing_tables.sql      ✅ existing
  20260405120000_add_shift_ratings.sql
  20260406090000_add_instant_pay_billing.sql
```

**Migration template:**
```sql
-- Migration: add_shift_ratings
-- Date: 2026-04-05
-- Description: Adds worker rating system for completed shifts

-- Up migration
CREATE TABLE IF NOT EXISTS nursly_shift_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shift_id UUID NOT NULL REFERENCES nursly_shifts(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE nursly_shift_ratings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Workers can view own ratings"
  ON nursly_shift_ratings FOR SELECT
  USING (auth.uid() = worker_id);

-- Indexes
CREATE INDEX idx_shift_ratings_worker_id ON nursly_shift_ratings(worker_id);
CREATE INDEX idx_shift_ratings_shift_id ON nursly_shift_ratings(shift_id);
```

---

### 4.4 Monitoring and Alerting Claude Should Watch

Once Sentry is installed, Claude should check the following before and after deployments:

**Sentry dashboard — check for:**
- New error events in the last 24 hours
- Error rate increase after a deploy (Sentry marks deploys automatically)
- Unhandled promise rejections
- Auth-related errors (login failures, JWT expiry)

**Vercel dashboard — check for:**
- Build failures (check build logs)
- Function execution errors (Runtime Logs → filter by errors)
- Core Web Vitals regressions (Analytics tab)

**Supabase dashboard — check for:**
- Database connection count approaching limit (free tier: 60 connections)
- Slow queries (Query Performance tab — Pro feature)
- Auth errors (Authentication → Logs)
- RLS policy failures (API → Logs → filter `400` errors)

**Uptime monitor:**
- `GET /api/health` must return `200` within 2 seconds
- Any downtime alert → immediate investigation before any other work

---

### 4.5 Incident Response Playbook

#### Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|--------------|---------|
| P1 — Critical | Production down, data breach | Immediate | Login broken, DB unreachable, auth compromised |
| P2 — High | Core feature broken | < 2 hours | Shifts not loading, payments failing |
| P3 — Medium | Degraded experience | < 24 hours | Slow performance, minor UI bugs |
| P4 — Low | Cosmetic or edge case | Next sprint | Layout issue, typo |

#### P1 Incident Response Steps

```
1. DETECT
   - Uptime monitor alerts OR user reports via support channel
   - Verify: open app in incognito browser

2. ASSESS (5 min)
   - Check Vercel logs: is the deployment healthy?
   - Check Supabase status: status.supabase.com
   - Check Sentry: spike in errors?
   - Identify last deployment time

3. CONTAIN
   - If caused by recent deploy: Vercel → Deployments → Promote previous deployment
   - If DB issue: Supabase dashboard → check connection counts, active queries
   - If auth broken: check middleware.ts and Supabase Auth settings

4. COMMUNICATE
   - If users are affected: post to status page
   - Update stakeholders

5. RESOLVE
   - Apply targeted fix on feature branch
   - Deploy to staging, verify fix
   - Deploy to production
   - Verify resolution

6. POST-INCIDENT (within 48h)
   - Root cause analysis
   - What monitoring would have caught this earlier?
   - Add regression test
   - Update runbooks
```

#### Useful Diagnostic Commands

```bash
# Check recent Vercel deployments
vercel list

# Check Vercel environment variables
vercel env ls

# Check Supabase migration status
supabase db status --db-url $SUPABASE_DB_URL

# Run build locally to reproduce errors
npm run build 2>&1 | grep -i error
```

---

## Part 5: Recommended Immediate Actions (Priority Order)

### Week 1 — Critical

| # | Action | Why | Effort |
|---|--------|-----|--------|
| 1 | **Initialise git repo** — `git init && git add . && git commit` | No version control = no rollback, no collaboration | 30 min |
| 2 | **Push to GitHub** (private repo) | Enables CI/CD, Dependabot, Secret Scanning | 15 min |
| 3 | **Install Sentry** | Flying blind in production — errors are invisible | 2 hours |
| 4 | **Run `npm audit fix`** | Fix glob vulnerability (non-breaking) | 15 min |
| 5 | **Plan Next.js 15 upgrade** | 4 high-severity CVEs in current Next.js 14 | 1 day |
| 6 | **Create `vercel.json`** with security headers | Missing security headers on all responses | 30 min |

### Week 2 — High

| # | Action | Why | Effort |
|---|--------|-----|--------|
| 7 | **Set up GitHub Actions CI** (use the `ci.yml` in this repo) | No automated testing gate before deploy | 2 hours |
| 8 | **Set up staging environment** | Every change goes straight to prod currently | 2 hours |
| 9 | **Enable Vercel Analytics** | Zero cost, immediate Web Vitals data | 30 min |
| 10 | **Create `/api/health` endpoint** | Prerequisite for uptime monitoring | 1 hour |
| 11 | **Set up BetterUptime** | No alerting if site goes down | 30 min |

### Week 3 — Medium

| # | Action | Why | Effort |
|---|--------|-----|--------|
| 12 | **Install Husky + lint-staged** | Catch issues before they reach CI | 1 hour |
| 13 | **Add `.github/dependabot.yml`** | Automated dependency update PRs | 30 min |
| 14 | **Add Semgrep to CI** | SAST — catch security issues in code review | 1 hour |
| 15 | **Initialise Supabase CLI** | Enables local dev + migration tooling | 1 hour |

### Month 2 — Important

| # | Action | Why | Effort |
|---|--------|-----|--------|
| 16 | **Upgrade to Supabase Pro** | PITR backups, better support | Ongoing cost |
| 17 | **Implement feature flags** | Safe rollout of new features | 2 hours |
| 18 | **Add integration tests** | Verify critical flows (auth, shift booking) | 1 week |
| 19 | **OWASP ZAP scan** on staging | Dynamic security testing | 2 hours |
| 20 | **Write E2E tests** (Playwright) | Catch regressions before users do | 1-2 weeks |

---

## Appendix A: Security Headers Checklist

Add these via `vercel.json` headers config:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=()` | Restrict browser APIs |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Force HTTPS |
| `Content-Security-Policy` | (complex — define after audit) | Prevent XSS/injection |

---

## Appendix B: Tools Summary

| Category | Tool | Cost | Priority |
|----------|------|------|---------|
| Error Tracking | Sentry | Free | P1 |
| Uptime Monitoring | BetterUptime | Free | P1 |
| Performance | Vercel Analytics | Free | P2 |
| Dependency Security | npm audit + Dependabot | Free | P1 |
| SAST | Semgrep | Free | P2 |
| DAST | OWASP ZAP | Free | P3 |
| Secret Scanning | GitHub Secret Scanning | Free | P1 |
| Pre-commit | Husky + gitleaks | Free | P2 |
| Feature Flags | PostHog or Vercel Edge Config | Free | P3 |
| License Compliance | license-checker | Free | P3 |

---

*Report generated: 2026-04-04. Review quarterly or after significant architecture changes.*
