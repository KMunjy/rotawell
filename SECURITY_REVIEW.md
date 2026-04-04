# Security Review — Rotawell (CareOrbit Healthcare Staffing Platform)

> **Reviewed by:** Information Security Officer (ISO) Assessment + Model-as-Judge Evaluation
> **Date:** 2026-04-04
> **Scope:** Full codebase — Next.js 14 frontend, Supabase backend, RLS policies, authentication, file handling, financial flows
> **Regulatory context:** UK GDPR, POPIA (South Africa)
> **Threat level at time of review:** HIGH — one critical issue requires immediate action before this system goes near production data

---

## Executive Summary

Rotawell is a healthcare staffing marketplace handling sensitive worker data (NMC PINs, DBS checks, compliance documents, bank account details), shift bookings, and financial transactions. The application has a **solid architectural foundation** — Supabase RLS is consistently enabled, middleware authentication is structurally sound, and there is no XSS exposure. However, it has **one critical defect** (exposed service-role credentials), **three high-severity defects** (unencrypted financial PII, unauthenticated DB writes, no rate limiting), and a cluster of medium issues that together would fail a GDPR audit.

**This system must not be used with real user data until at minimum the Critical and High findings are resolved.**

---

## Model-as-Judge Ratings

| Dimension | Score | Rationale |
|---|---|---|
| **Codebase Quality** | 6 / 10 | Consistent patterns, clean component structure, TypeScript used throughout. Deducted for pervasive `console.error` with raw DB errors, dead code (unusable `rememberMe`), and no server-side API layer. |
| **Security Posture** | 3 / 10 | RLS is present and mostly correct. Everything else is missing: no rate limiting, no server-side validation, credentials in the repo, unencrypted financial data. The score is not lower only because Supabase's parameterised queries eliminate SQL injection and no XSS vectors exist. |
| **Production Readiness** | 2 / 10 | Credentials are exposed, bank details are stored plaintext, there is no payment processor integration, no audit log, no monitoring. Not production-ready. |
| **GDPR / POPIA Compliance** | 4 / 10 | Registration consent flow is good, cookie consent is present, privacy policy page exists. But: bank details stored unencrypted, no data retention policy enforced, no right-to-erasure mechanism, no data breach detection, no DPA record-of-processing. |

---

## Top 5 Risks That Could Cause Real Harm

| # | Risk | Harm |
|---|---|---|
| 1 | **Service-role key in `.env.local`** | Complete database takeover — all worker PII, credentials, financial data exfiltrated or deleted |
| 2 | **Bank account numbers stored as plaintext JSON** | Regulatory breach (FCA, ICO), financial fraud against workers |
| 3 | **No rate limiting on any endpoint** | Account brute-force, credential stuffing, DoS against a safety-critical staffing platform |
| 4 | **Unauthenticated support ticket insertion (RLS `WITH CHECK (true)`)** | Spam/DoS, plus the `raised_by` column inserted by the app doesn't exist in the schema — silent data loss |
| 5 | **Client-side-only role assignment during registration** | A direct API call with `role: 'platform_admin'` could self-elevate to admin if the `nursly_profiles` INSERT RLS policy doesn't block it |

---

## Findings

### CRITICAL

---

#### CRIT-01 — Live Supabase Credentials Committed to Repository

**File:** `.env.local`
**Severity:** CRITICAL
**OWASP:** A02 Cryptographic Failures / A05 Security Misconfiguration

The file contains live, working credentials for the production Supabase project `ijcwkdjwdxriscqxbrbe`:

```
NEXT_PUBLIC_SUPABASE_URL=https://ijcwkdjwdxriscqxbrbe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...role":"service_role"...
```

The `SERVICE_ROLE_KEY` bypasses **all Row Level Security policies** and grants unrestricted read/write/delete access to every table, every row, every storage bucket. Anyone who has ever cloned this repository or seen this file can:

- Export the full worker database (names, NMC PINs, locations, phone numbers)
- Export all compliance documents from storage
- Delete all shift, booking, and financial records
- Create platform_admin accounts
- Read and modify bank account details

**Required actions — in this order:**

1. **Immediately revoke** both keys in the Supabase dashboard → Settings → API → Regenerate
2. **Audit Supabase logs** for access using the old keys (Dashboard → Logs → API)
3. **Add `.env.local` to `.gitignore`** (verify it is not currently tracked: `git ls-files .env.local`)
4. If it was ever committed to git history, purge with `git filter-repo --path .env.local --invert-paths`
5. Rotate keys in all deployment environments (Vercel, etc.)
6. Use `.env.local.example` (already present) as the template — it correctly uses placeholder values

---

### HIGH

---

#### HIGH-01 — Bank Account Numbers Stored Unencrypted

**File:** `supabase/migrations/20260404100000_add_instant_pay.sql:60`, `src/app/worker/instant-pay/page.tsx:443-484`
**Severity:** HIGH
**Regulatory:** UK GDPR Article 32 (technical measures), FCA PS19/1

Bank account numbers, sort codes, and mobile money numbers are stored as a plaintext `jsonb` column:

```sql
account_details jsonb DEFAULT '{}'::jsonb
```

The UI collects and saves:
- `account_number` (stored as plain text)
- `sort_code`
- `bank_name`
- `mobile_number`

These are financial identifiers. Even with correct RLS policies, they are stored unencrypted at rest in Supabase's PostgreSQL instance. A single misconfigured RLS policy, a compromised admin account, or a Supabase-side breach exposes every worker's banking details.

**Mitigations:**
- Encrypt `account_details` at the application layer before writing (use `libsodium` / `tweetnacl` with a server-side key)
- Better: delegate payment details entirely to a regulated third-party (Stripe Connect, GoCardless, Modulr) — never store raw bank details yourself
- Minimum: add a column-level encryption extension (`pgcrypto`) for the `account_details` field

---

#### HIGH-02 — Unauthenticated Writes to `nursly_support_tickets` + Schema Mismatch

**File:** `supabase/migrations/20260404300000_add_public_and_billing_tables.sql:50-51`, `src/components/chat/chat-widget.tsx:62-71`
**Severity:** HIGH
**OWASP:** A01 Broken Access Control

The RLS INSERT policy allows anyone (including anonymous users) to insert into `nursly_support_tickets`:

```sql
CREATE POLICY "Anyone can create support tickets" ON nursly_support_tickets
  FOR INSERT WITH CHECK (true);
```

The chat widget does check authentication client-side, but client-side checks are trivially bypassed with any HTTP client. This allows:
- Unlimited spam ticket creation
- DoS against the support system

**Additionally**, the chat widget inserts a `raised_by` column (`raised_by: user.id`) that does not exist in the schema. This insert will fail silently — the error is caught and logged, but the user receives no meaningful feedback and tickets from the chat widget are never actually created.

```typescript
// chat-widget.tsx:62-71 — 'raised_by' is not a column in nursly_support_tickets
await supabase.from('nursly_support_tickets').insert({
  ticket_ref: ref,
  category: 'other',
  subject: messageText.slice(0, 100),
  description: messageText,
  priority: 'p4',
  status: 'open',
  raised_by: user.id,  // ← column does not exist
});
```

**Mitigations:**
- Change the RLS policy to require authentication: `FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)`
- Add `raised_by uuid REFERENCES auth.users(id)` to the `nursly_support_tickets` table
- Add rate limiting (max 5 tickets per user per hour) via a database trigger or Edge Function

---

#### HIGH-03 — No Rate Limiting on Any Endpoint

**Severity:** HIGH
**OWASP:** A05 Security Misconfiguration

The application has no rate limiting at any layer:
- Login (`supabase.auth.signInWithPassword`) — unlimited brute-force attempts
- Registration — unlimited account creation
- Password reset — unlimited reset emails
- File uploads — unlimited upload size and frequency
- Support ticket creation — unlimited (see HIGH-02)
- Instant pay requests — unlimited submissions

For a healthcare platform, account takeover via credential stuffing is a real threat — worker credentials are valuable (access to DBS check status, shift history, payment details).

**Mitigations:**
- Supabase Auth has built-in rate limiting — verify it is enabled in the dashboard (Auth → Rate Limits)
- Implement a Next.js middleware rate limiter (e.g., `@upstash/ratelimit` with Redis) for all form submissions
- Add CAPTCHA (hCaptcha or Cloudflare Turnstile) to login and registration
- Enforce file size limits in Supabase Storage bucket settings (currently unlimited)

---

#### HIGH-04 — Role Escalation Risk During Registration

**File:** `src/app/register/page.tsx:16-17, 108-115`
**Severity:** HIGH
**OWASP:** A01 Broken Access Control

The registration form lets users select their role (`nurse` or `agency_admin`) client-side, then inserts this directly into `nursly_profiles`:

```typescript
const [role, setRole] = useState<'nurse' | 'agency_admin'>(initialRole);
// ...
await supabase.from('nursly_profiles').insert({
  id: data.user.id,
  role: role,  // ← comes entirely from client state
  ...
});
```

A malicious actor calling the Supabase API directly (bypassing the UI) could attempt to insert `role: 'platform_admin'`. Whether this succeeds depends entirely on the `nursly_profiles` INSERT RLS policy, which is **not visible in the provided migrations** — meaning it may not restrict the `role` field values at all.

**Mitigations:**
- Verify the `nursly_profiles` INSERT RLS policy has a `WITH CHECK` that restricts `role` to `('nurse', 'agency_admin')`
- If not, add: `WITH CHECK (role IN ('nurse', 'agency_admin'))`
- Alternatively, assign roles exclusively via a server-side function (Supabase Edge Function or Next.js API route using the service role) and never allow client-supplied role values

---

### MEDIUM

---

#### MED-01 — Instant Pay Amount Validation Is Client-Side Only

**File:** `src/app/worker/instant-pay/page.tsx:136-137, 157-165`
**Severity:** MEDIUM
**OWASP:** A03 Injection (Business Logic)

The maximum cashout amount (`displayMaxCashOut`) is computed entirely in the browser. The actual database insert has no server-side validation:

```typescript
if (cashOutAmount <= 0 || cashOutAmount > displayMaxCashOut) return;  // client check only
// ...
await supabase.from('nursly_instant_pay_requests').insert({
  amount: cashOutAmount,  // any value accepted by DB
  fee: parseFloat(fee.toFixed(2)),
  ...
});
```

The database CHECK constraint only enforces `amount > 0`. A user who manipulates the DOM or calls the Supabase API directly can request any amount, including amounts exceeding their actual earnings.

**Mitigations:**
- Add a `BEFORE INSERT` trigger that validates the requested amount against the worker's actual completed shifts and existing advance requests
- Or move the cashout to a Supabase Edge Function that performs server-side validation using the service role

---

#### MED-02 — `getSession()` Used in Middleware Session Refresh (Should Be `getUser()`)

**File:** `src/lib/supabase/middleware.ts:33`
**Severity:** MEDIUM
**OWASP:** A07 Identification and Authentication Failures

The `updateSession` middleware calls `supabase.auth.getSession()` to refresh tokens:

```typescript
await supabase.auth.getSession();  // reads from cookie, no server re-validation
```

`getSession()` trusts the cookie contents without verifying them against Supabase's auth server. `getUser()` makes a network call to validate the JWT. The main middleware does use `getUser()` correctly, but the session-refresh layer using `getSession()` means a tampered or replayed cookie may refresh without being validated.

**Mitigation:** Change `supabase/middleware.ts:33` to `await supabase.auth.getUser()`.

---

#### MED-03 — File Upload Has No Server-Side Validation

**File:** `src/app/worker/compliance/page.tsx:56-64`
**Severity:** MEDIUM
**OWASP:** A04 Insecure Design

Compliance document uploads go directly from the browser to Supabase Storage with no server-side validation:

```typescript
// Client-side only:
accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"  // HTML attribute — trivially bypassed

// No server-side checks before upload:
await supabase.storage.from('credentials').upload(storagePath, file, { upsert: true });
```

Issues:
1. **No MIME type validation** — the `accept` attribute is informational only; any file type can be uploaded
2. **Original filename used in path** — `${userId}/${docType}/${file.name}` allows path traversal if `file.name` contains `../`
3. **No file size limit** — Supabase Storage has configurable limits; verify they are set
4. **`upsert: true`** — allows silently overwriting previously verified documents (a compliance bypass attack)

**Mitigations:**
- Validate MIME type server-side (use a Supabase Edge Function or Next.js API route to check magic bytes)
- Sanitise the filename: `const safeName = \`\${crypto.randomUUID()}\${path.extname(file.name)}\``
- Remove `upsert: true` — require explicit re-upload workflow
- Set max file size in Supabase Storage bucket settings (recommended: 10 MB)

---

#### MED-04 — Raw Database Errors Logged to Browser Console

**Severity:** MEDIUM
**OWASP:** A09 Security Logging and Monitoring Failures / A05

There are 80+ `console.error` calls across the codebase that pass raw Supabase error objects to the browser console. Examples:

```typescript
// compliance/page.tsx:67
console.error('Upload error:', uploadError);
// compliance/page.tsx:88
console.error('DB update error:', dbError);
// register/page.tsx:135
console.error('Failed to create nurse profile:', nurseError);
// admin/users/page.tsx:54
console.error('Error:', listRes.error);
```

These errors can reveal: table names, column names, constraint names, and query structure. In an authenticated admin context, this is lower risk; in user-facing pages it provides a schema map to potential attackers.

**Mitigation:** Replace all `console.error` with a structured logging utility that sends to a server-side log sink (e.g., Axiom, Sentry) and shows only generic messages to the user. Remove console logging entirely from production builds.

---

#### MED-05 — `Remember Me` Checkbox Is a No-Op (Deceptive UX)

**File:** `src/app/login/page.tsx:19, 119-128`
**Severity:** MEDIUM (UX/Compliance)

The "Remember me" checkbox sets state but the value is never passed to `signInWithPassword`:

```typescript
const [rememberMe, setRememberMe] = useState(true);
// ...
await supabase.auth.signInWithPassword({ email, password });
// rememberMe is never used
```

This misleads users about session persistence, which has GDPR implications (users cannot meaningfully consent to session duration if the control has no effect).

**Mitigation:** Either implement session duration control via Supabase's `options.expiresIn` parameter, or remove the checkbox.

---

#### MED-06 — Admin Header Shows Static Hardcoded Email

**File:** `src/app/admin/layout.tsx:57-59`
**Severity:** MEDIUM (Information Disclosure)

```typescript
user={{
  name: 'Administrator',
  email: 'admin@rotawell.uk',
}}
```

This hardcodes an internal email address into the admin UI. If the page is ever accidentally rendered to an unauthorised user, or if screenshots are shared, this email becomes a social engineering target. It also does not reflect the actual logged-in admin's identity.

**Mitigation:** Fetch the real user's name/email from `useUser()` hook and render it dynamically.

---

#### MED-07 — Login Page Exposes Implementation Detail

**File:** `src/app/login/page.tsx:146`
**Severity:** MEDIUM (Information Disclosure)

```tsx
<p className="text-center text-xs text-gray-600">
  Use your Supabase credentials to sign in
</p>
```

This text reveals the backend infrastructure (Supabase) to any user who views the login page. This aids targeted attacks against the infrastructure.

**Mitigation:** Remove this line before any public-facing deployment.

---

#### MED-08 — Wildcard Image Remote Pattern

**File:** `next.config.js:8-10`
**Severity:** MEDIUM
**OWASP:** A05 Security Misconfiguration

```javascript
hostname: '**.supabase.co',
```

This allows Next.js to proxy images from **any** Supabase project, not just this one. If a user crafts a URL pointing to a malicious Supabase-hosted image, Next.js will fetch and serve it.

**Mitigation:** Restrict to the specific project: `hostname: 'ijcwkdjwdxriscqxbrbe.supabase.co'` (update after rotating credentials).

---

### LOW

---

#### LOW-01 — Instant Pay Fee Hardcoded in Client

**File:** `src/app/worker/instant-pay/page.tsx:13`
```typescript
const FEE_PERCENTAGE = 0.025;
```
Fee is computed and displayed client-side. A user can manipulate the displayed fee to mislead themselves but cannot change what is actually recorded (the fee is calculated and inserted by the client). Still, fee configuration should be server-controlled.

---

#### LOW-02 — Shift Duration Calculation Ignores DST

**File:** `src/app/worker/instant-pay/page.tsx:77`
```typescript
const hours = (new Date(shift.end_time).getTime() - new Date(shift.start_time).getTime()) / (1000 * 60 * 60);
```
During DST transitions (UK clocks spring forward/back), this calculation can be off by ±1 hour, affecting both worker pay calculations and instant pay limits.

**Mitigation:** Store times as UTC in the database (verify Supabase `timestamptz` columns are doing this) and use `date-fns-tz` or `luxon` for display.

---

#### LOW-03 — Support Ticket Ref Is Timestamp-Based and Predictable

**File:** `src/components/chat/chat-widget.tsx:60`
```typescript
const ref = `CHAT-${Date.now()}`;
```
Ticket references are predictable from the creation timestamp. This allows enumeration of ticket references if any lookup endpoint exists.

**Mitigation:** Use `crypto.randomUUID()` or a nanoid for ticket references.

---

#### LOW-04 — No Audit Trail for Financial Operations

**Severity:** LOW (Compliance)
No audit log records who approved or rejected instant pay requests, when compliance documents were verified, or who changed user account status. This is required for FCA compliance and for GDPR's accountability principle.

**Mitigation:** Add `created_by`, `updated_by`, and `audit_log` fields or a separate audit table for all financial and compliance state changes.

---

#### LOW-05 — No Data Retention Policy Enforcement

**Severity:** LOW (GDPR/POPIA)
GDPR Article 5(1)(e) requires data to be kept only as long as necessary. There are no deletion schedules or retention rules visible for support tickets, shift history, compliance documents, or user profiles.

**Mitigation:** Implement a scheduled Supabase function that purges or anonymises data beyond the retention period (e.g., resolved support tickets after 90 days, closed shifts after 7 years for tax purposes).

---

## Threat Model

### Attack Surface Map

```
[Public Internet]
      │
      ├─ /login, /register, /forgot-password  ← no rate limiting
      ├─ /contact, /careers                   ← unauthenticated DB writes
      ├─ /.env.local                          ← EXPOSED (critical)
      │
[Supabase API] ← anon key is public (NEXT_PUBLIC_*)
      │
      ├─ auth.users                           ← managed by Supabase Auth
      ├─ nursly_profiles                      ← INSERT policy may allow role escalation
      ├─ nursly_support_tickets               ← RLS allows unauthenticated insert
      ├─ nursly_instant_pay_requests          ← no server-side amount validation
      ├─ nursly_instant_pay_settings          ← plaintext bank details in jsonb
      ├─ nursly_credentials                   ← compliance docs, no file validation
      │
[Supabase Storage] credentials bucket
      ├─ {userId}/{docType}/{filename}        ← original filename, potential path traversal
      └─ upsert=true                          ← can overwrite verified documents
```

### STRIDE Analysis

| Threat | Category | Finding | Severity |
|---|---|---|---|
| Attacker uses stolen service-role key to dump all data | **S**poofing / **T**ampering | CRIT-01 exposed credentials | Critical |
| Attacker self-assigns `platform_admin` role at registration | **E**levation of Privilege | HIGH-04 client-controlled role | High |
| Brute-force login to take over a worker account | **S**poofing | HIGH-03 no rate limiting | High |
| Attacker submits instant pay request for amount > actual earnings | **T**ampering | MED-01 client-side amount validation | Medium |
| Attacker uploads malicious file disguised as a PDF | **T**ampering | MED-03 no MIME validation | Medium |
| Attacker floods support ticket system to deny service | **D**enial of Service | HIGH-02/HIGH-03 | High |
| DB error messages in console reveal schema structure | **I**nformation Disclosure | MED-04 raw errors in console | Medium |
| No audit trail for admin actions on instant pay | **R**epudiation | LOW-04 | Low |
| Bank account data breached from Supabase | **I**nformation Disclosure | HIGH-01 plaintext financial data | High |
| Session cookie replayed after logout via `getSession()` | **S**poofing | MED-02 | Medium |

---

## Positive Findings

The following are genuinely well-implemented and should be preserved:

| # | Finding |
|---|---|
| ✅ | **RLS enabled on all tables** — Every table in the migrations has `ENABLE ROW LEVEL SECURITY`. This is the single most important Supabase security control and it is consistently applied. |
| ✅ | **`getUser()` used in middleware** — The main `middleware.ts` correctly calls `supabase.auth.getUser()` (server-validated) rather than `getSession()` (cookie-only). |
| ✅ | **No `dangerouslySetInnerHTML` anywhere** — Zero XSS injection vectors found across the entire codebase. |
| ✅ | **Parameterised queries throughout** — The Supabase client library escapes all inputs; SQL injection is not possible through normal usage patterns. |
| ✅ | **GDPR consent at registration** — Separate required/optional consent checkboxes with clear language, properly blocking registration when required consent is withheld. |
| ✅ | **Cookie consent component** — `cookie-consent.tsx` is present and functional. |
| ✅ | **Admin route protection at middleware layer** — Role check in middleware prevents unauthorised access to `/admin/*` before any page code runs. |
| ✅ | **Signed URLs for document access** — `createSignedUrl` with 1-hour expiry (`compliance/page.tsx:126`) rather than public URLs for compliance documents. |
| ✅ | **Password hashing delegated to Supabase** — No home-grown password hashing; Supabase Auth uses bcrypt internally. |

---

## GDPR / POPIA Compliance Gap Analysis

| Requirement | Status | Finding |
|---|---|---|
| Lawful basis for processing | ⚠️ Partial | Consent captured at registration but not stored/linked to a `user_consents` table for auditability |
| Right of access (Article 15) | ❌ Missing | No data export feature for users to download their own data |
| Right to erasure (Article 17) | ❌ Missing | No account deletion flow visible |
| Data minimisation (Article 5) | ⚠️ Partial | `select('*')` used widely — fetches more columns than needed |
| Data retention limits (Article 5(1)(e)) | ❌ Missing | No retention schedules or purge mechanisms |
| Technical security measures (Article 32) | ❌ Failing | Plaintext financial data, exposed credentials, no encryption at rest for sensitive fields |
| Data breach notification (Article 33) | ❌ Missing | No breach detection or alerting mechanism |
| Records of processing activities (Article 30) | ❌ Missing | No ROPA visible |
| POPIA Information Officer | ❓ Unknown | Not assessed (out of code scope) |
| POPIA cross-border transfer safeguards | ⚠️ Needs review | SA workers' data stored in Supabase (likely EU region) — requires adequacy assessment |

---

## Remediation Roadmap

### Immediate (before any production data is handled)

1. **[CRIT-01]** Revoke and rotate Supabase credentials. Remove `.env.local` from git history.
2. **[HIGH-01]** Migrate bank account storage to an encrypted vault or a regulated third-party payment processor. Do not store raw account numbers.
3. **[HIGH-04]** Audit and fix the `nursly_profiles` INSERT RLS policy to restrict `role` values to `('nurse', 'agency_admin')`.

### Within 1 Week

4. **[HIGH-02]** Fix the `nursly_support_tickets` RLS INSERT policy to require `auth.uid() IS NOT NULL`. Add the missing `raised_by` column.
5. **[HIGH-03]** Enable Supabase Auth rate limiting. Add middleware-level rate limiting via Upstash Redis or equivalent.
6. **[MED-01]** Move instant pay amount validation to a server-side Edge Function.
7. **[MED-02]** Replace `getSession()` with `getUser()` in `supabase/middleware.ts:33`.
8. **[MED-03]** Remove `upsert: true` from credential uploads. Sanitise filenames. Set storage bucket size limits.
9. **[MED-07]** Remove "Use your Supabase credentials to sign in" from the login page.

### Within 2 Weeks

10. **[MED-04]** Replace all `console.error` with a server-side logging sink. Strip error details from client output.
11. **[MED-05]** Remove the non-functional `rememberMe` checkbox or implement it properly.
12. **[MED-06]** Fetch and display the actual admin user's identity in the admin layout.
13. **[MED-08]** Restrict `remotePatterns` to the specific Supabase project hostname.
14. **[LOW-01-04]** Address DST handling, predictable ticket refs, audit trail, and data retention.

### Within 30 Days (GDPR compliance)

15. Implement right-to-access data export
16. Implement account deletion (right to erasure)
17. Create a `user_consents` table and link consent records to users
18. Document Records of Processing Activities (ROPA)
19. Establish a data retention and automated purge schedule
20. Configure Sentry or equivalent for error monitoring and breach detection

---

*This report was produced through static analysis of the complete source tree. Dynamic testing (penetration testing, fuzzing, authenticated session testing) was not performed. A full penetration test by a qualified security firm is recommended before public launch, particularly targeting the Supabase RLS policies under adversarial conditions.*
