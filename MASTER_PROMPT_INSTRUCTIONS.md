# Master Prompt Instructions
## Production-Quality Next.js SaaS Platform Standards

> These instructions capture the exact patterns, governance, and standards used to build **Rotawell** (a UK healthcare staffing platform) to production quality. Apply them verbatim to any similar project — staffing, booking, marketplace, or care platform — regardless of domain.

---

## 1. Architecture & Stack

### Canonical Stack
```
Next.js 15 (App Router)  +  React 19  +  TypeScript 5 (strict)
Tailwind CSS             +  Supabase (auth, DB, RLS, storage)
@sentry/nextjs           +  @upstash/ratelimit + @upstash/redis
lucide-react (icons)     +  clsx + tailwind-merge (className util)
```

### Project Layout
```
src/
  app/                    # Next.js App Router pages
    api/                  # Route handlers (server-only)
    (auth)/               # Login, register, forgot-password
    worker/               # Role-scoped dashboard — nurses/workers
    provider/             # Role-scoped dashboard — agencies/orgs
    admin/                # Role-scoped dashboard — platform admins
    legal/                # Privacy, terms, GDPR, NMC, etc.
    layout.tsx            # Root layout with global providers
  components/
    ui/                   # Headless/primitive UI components
    layout/               # Sidebar, topbar, shell wrappers
    *.tsx                 # Feature-level components (avatar, cookie, etc.)
  lib/
    supabase/
      client.ts           # Browser client (createBrowserClient)
      server.ts           # Server client (createServerClient + cookies)
      middleware.ts       # updateSession helper for auth middleware
    types.ts              # All TypeScript interfaces & DB type map
    utils.ts              # cn(), formatCurrency, formatDate, etc.
    rate-limit.ts         # Upstash Redis + in-memory fallback
middleware.ts             # Auth guard, rate limiting, security headers
next.config.js            # Sentry, image patterns, strict mode
sentry.client.config.ts
sentry.server.config.ts
```

### Server / Client Component Split
- **Default to Server Components.** Fetch data on the server; pass serializable props down.
- Add `'use client'` only when you need: `useState`, `useEffect`, event handlers, browser APIs, or third-party client SDKs.
- Never import server-only modules (Supabase server client, `headers()`, `cookies()`) inside a `'use client'` file.
- Dynamic import heavy client components with `{ ssr: false }` to avoid SSR hydration errors:
  ```ts
  const AvatarChat = dynamic(() => import('@/components/avatar-chat'), { ssr: false });
  ```
- Wrap every heavy/optional client component in an error boundary before placing it in the root layout.

### Supabase Client Pattern
```ts
// Browser (client components)
import { createBrowserClient } from '@supabase/ssr';
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

// Server (server components, route handlers)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cs) => cs.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options)),
    },
  });
}
```

---

## 2. Security & Governance

### Security Headers (middleware.ts — every response)
```ts
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
response.headers.set('Content-Security-Policy', [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // Next.js requires these
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
].join('; '));
// HSTS — production only
if (process.env.NODE_ENV === 'production') {
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}
```
> If the app uses third-party scripts (HeyGen CDN, Google Fonts, analytics), add their origins to the appropriate CSP directives. Never use `*` wildcards in production CSP.

### Rate Limiting
Two-tier system — Upstash Redis (production, cross-instance) with automatic in-memory fallback (dev/no-Redis):

```ts
// src/lib/rate-limit.ts
export async function checkRateLimit(
  key: string,     // e.g. "api:<ip>", "heygen:<ip>"
  limit: number,   // max requests
  windowMs: number // window in ms
): Promise<{ allowed: boolean; remaining: number; resetAt: number }>
```

Apply in middleware for all API routes (100 req/min per IP):
```ts
if (pathname.startsWith('/api/')) {
  const result = await checkRateLimit(`api:${ip}`, 100, 60_000);
  if (!result.allowed) {
    return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)) },
    });
  }
}
```

Apply stricter limits inside sensitive route handlers (e.g. HeyGen token: 5 req/min):
```ts
// Per-endpoint in-memory check as a second layer
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;
```

### Auth Middleware Pattern
```
1. Rate limit check (all /api/* routes) → 429 if exceeded
2. updateSession() — refresh Supabase session cookie
3. If protected route (/worker, /provider, /admin) and no user → redirect /login
4. If admin route and role !== 'platform_admin' → redirect to role dashboard
5. If authenticated user on auth/landing pages → redirect to role dashboard
6. Apply security headers to every response
```

Middleware matcher: exclude `_next/static`, `_next/image`, `favicon.ico`, `.svg` files.

```ts
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};
```

### IP Detection (middleware & route handlers)
```ts
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
```

### Environment Variables
Required variables — never commit to git, always document in `.env.example`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server-only; never expose to browser

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=              # for source map uploads
SENTRY_ORG=
SENTRY_PROJECT=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# AI features
HEYGEN_API_KEY=                 # server-only; never NEXT_PUBLIC_
NEXT_PUBLIC_HEYGEN_AVATAR_ID=   # public avatar ID only
```

### Supabase RLS
- Every table must have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`.
- Minimum policies: `SELECT` (own rows only), `INSERT` (own rows), `UPDATE` (own rows), `DELETE` (own rows or admin).
- Platform admins get `FOR ALL` policies with `role = 'platform_admin'` check via profile join.
- Never use `service_role` key in browser code. Only use it in server-side admin route handlers.

### API Route Protection
Every route handler must:
1. Authenticate the request: `const { data: { user } } = await supabase.auth.getUser()`
2. Authorise by role where needed: query `profiles` table for `role`
3. Validate all inputs before touching the DB
4. Return structured error responses: `{ error: 'message' }` with appropriate HTTP status

---

## 3. Compliance — GDPR + POPIA

### Cookie Consent Banner
Implemented as a client component shown globally from the root layout. Four categories:

| Category | Examples | Can reject? |
|---|---|---|
| Essential | Auth session, CSRF | No |
| Functional | Preferences, language | Yes |
| Analytics | Page views, events | Yes |
| Marketing | Retargeting pixels | Yes |

Persistence: `localStorage` key (e.g. `rotawell_cookie_consent`).
Actions: "Accept all", "Reject non-essential", "Manage preferences" (accordion).
Links: `/legal/privacy` and `/legal/cookie-policy`.

```tsx
// Pattern: read stored consent before rendering; never show on SSR
const [visible, setVisible] = useState(false);
useEffect(() => {
  const stored = localStorage.getItem(CONSENT_KEY);
  if (!stored) setVisible(true);
}, []);
```

### Privacy Policy — Dual Jurisdiction (UK GDPR + POPIA)
Structure your privacy policy to address both:

**UK GDPR (England & Wales)**
- Data Controller name, ICO registration number, contact email
- Six lawful bases: consent, contract, legal obligation, vital interests, public task, legitimate interests
- Data subject rights: access, rectification, erasure, portability, restriction, objection
- 72-hour breach notification requirement
- International transfer safeguards (SCCs for non-UK recipients)

**POPIA (South Africa)**
- Information Officer name and contact
- Eight conditions for lawful processing
- Data subject rights: access, correction, deletion, objection
- POPIA Section 11 consent requirements
- Cross-border transfer restrictions

### Compliance Pages Required
```
/legal/privacy          # Full privacy policy
/legal/terms            # Terms of service
/legal/gdpr             # GDPR-specific rights & procedures
/legal/cookie-policy    # Cookie categories and management
/legal/data-request     # SAR (Subject Access Request) form
/legal/erasure          # Right to erasure request form
```

### Data Minimisation Rules
- Never store full financial account numbers in the application database. Only last 4 digits for display. Full details must go through a regulated payment processor (Stripe Connect, GoCardless).
- Passwords are never stored — always delegate to Supabase Auth.
- PII in logs should be redacted or anonymised.
- Session tokens are managed by `@supabase/ssr` cookie handling — never store in localStorage.

---

## 4. AI Features

### HeyGen Streaming Avatar — Complete Integration

**Architecture:**
```
Browser                          Server                     HeyGen
  |                                |                           |
  |-- POST /api/heygen/token ------>|                           |
  |                                |-- POST streaming.create_token -->|
  |                                |<-- { token } -------------|
  |<-- { token } ------------------|                           |
  |                                |                           |
  |-- new StreamingAvatar({ token }) (client SDK)              |
  |-- avatar.createStartAvatar()  --------------------------->|
  |<-- STREAM_READY event (MediaStream) -----------------------|
  |-- videoRef.srcObject = stream                              |
```

**Token endpoint** (`/api/heygen/token` — POST, no auth required but rate-limited):
```ts
// 5 requests/min per IP (in-memory, no Redis dependency)
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

export async function POST() {
  // 1. Rate limit check
  // 2. Validate HEYGEN_API_KEY env var exists
  // 3. POST https://api.heygen.com/v1/streaming.create_token
  // 4. Return { token } — never expose the API key
}
```

**Client component key patterns:**
```ts
// Dynamic import — never SSR the avatar SDK
const AvatarChat = dynamic(() => import('@/components/avatar-chat'), { ssr: false });

// Session timeout constants
const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const WARNING_BEFORE_MS  =  2 * 60 * 1000; // warn at 8 minutes

// State machine
type ChatState = 'idle' | 'connecting' | 'connected' | 'error';

// SDK import inside startSession() — graceful failure if not installed
try {
  const sdk = await import('@heygen/streaming-avatar');
  // use sdk.default, sdk.AvatarQuality, sdk.StreamingEvents
} catch {
  setSdkMissing(true); // show install instructions, don't crash
}
```

**Session lifecycle:**
1. `startSession()` → fetch token → dynamic-import SDK → `createStartAvatar()`
2. On `STREAM_READY` event → attach `MediaStream` to `<video>` ref → `setState('connected')` → start inactivity timer
3. On `STREAM_DISCONNECTED` event → clear timers → `setState('idle')`
4. Warning timer fires at T-2min → show amber banner with `role="alert"`
5. Timeout timer fires at T-0 → call `stopAvatar()` → stop all `MediaStreamTrack`s → `setState('error')` with inactivity message
6. `endSession()` / unmount cleanup → `stopAvatar()` + `getTracks().forEach(t.stop())`

**Accessibility on avatar component:**
```tsx
<div role="region" aria-label="AI Care Assistant">
  {/* Screen reader live region */}
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {state === 'connecting' && 'Connecting to AI assistant...'}
    {state === 'connected' && 'Connected. You can now type or speak.'}
    {timeoutWarning && 'Session will end in 2 minutes...'}
  </div>
  <video aria-label="AI assistant video stream" />
  <div role="toolbar" aria-label="Chat controls">
    <button aria-label="Mute microphone" aria-pressed={micEnabled} />
    <input aria-label="Message input" />
    <button aria-label="Send message" />
  </div>
</div>
```

**Error boundary wrapper** — always wrap the avatar widget:
```tsx
// Class component with getDerivedStateFromError
// Fallback UI with "Try Again" button
// Never crash the entire page on avatar failure
```

### Text Chat Widget
Floating action button (bottom-right, `z-50`), toggles chat panel. Must:
- Be lazy-loaded (dynamic import)
- Not block page interaction when collapsed
- Respect reduced-motion preferences

### AI Endpoint Hardening Rules
1. Never expose API keys as `NEXT_PUBLIC_` variables
2. Always proxy AI API calls through a Next.js route handler
3. Rate limit every AI endpoint (tighter than general API limits)
4. Never log request bodies that may contain PII
5. Always validate that the upstream AI service returned a non-error response before passing to client

---

## 5. TypeScript Standards

### Strict Mode (tsconfig.json)
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Types File (`src/lib/types.ts`)
- Define a single `Database` interface that mirrors all Supabase tables
- Export all row types: `type Profile = Database['public']['Tables']['profiles']['Row']`
- Define domain enums as string union types, not TypeScript `enum`
- Keep API response shapes typed — no `any` on API boundaries
- Type all component props explicitly; avoid spreading unknown objects

### className Utility
```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 6. Accessibility (WCAG 2.1 AA)

Every interactive element, every modal, every dynamic region must follow these rules:

### Aria Patterns
```tsx
// Buttons with icons only
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

// Toggle buttons
<button aria-pressed={isActive} aria-label="Toggle microphone">

// Live regions for async state changes
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>

// Landmark roles
<div role="region" aria-label="Section name">
<div role="toolbar" aria-label="Controls">
<div role="alert">  {/* for error messages */}
```

### Focus Management
- Modals/dialogs: trap focus inside, return focus to trigger on close
- Skip links at top of page: `<a href="#main-content" className="sr-only focus:not-sr-only">`
- Keyboard navigation: all interactive elements reachable via Tab/Shift-Tab
- Visible focus ring: `focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`

### Form Labels
```tsx
// Always associate label with input
<label htmlFor="email-input">Email</label>
<input id="email-input" type="email" />

// Or use sr-only for visually icon-only inputs
<label htmlFor="search" className="sr-only">Search</label>
<input id="search" type="search" />
```

### Colour Contrast
- Text on background: minimum 4.5:1 (normal text), 3:1 (large text)
- Interactive components: minimum 3:1 against adjacent colours
- Never rely on colour alone to convey state — combine with icon or text

---

## 7. Component Quality Standards

### Loading States
Every async data fetch needs a skeleton or spinner:
```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
```

### Empty States
Every list/table needs a zero-state:
```tsx
{items.length === 0 && (
  <div className="text-center py-8">
    <IconComponent className="h-12 w-12 text-gray-300 mx-auto mb-3" />
    <p className="text-gray-500">No items yet</p>
    <p className="text-sm text-gray-400 mt-1">Descriptive help text here</p>
  </div>
)}
```

### Error States
Use `role="alert"` for error messages that appear dynamically. Provide actionable recovery:
```tsx
<div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
  <p className="text-red-800">{error}</p>
  <Button onClick={retry}>Try Again</Button>
</div>
```

### Multi-Step Forms
Use a state machine pattern, not boolean flags:
```ts
type Step = 'idle' | 'selecting' | 'confirming' | 'submitting' | 'success' | 'error';
const [step, setStep] = useState<Step>('idle');
```

### Responsive Design
- Mobile-first: base styles are mobile, `sm:` / `md:` / `lg:` for larger screens
- Grid columns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Text scaling: never use fixed px for body text — use Tailwind's rem-based scale
- Touch targets: minimum 44×44px for all interactive elements

---

## 8. Performance

### Dynamic Imports for Heavy Components
```ts
import dynamic from 'next/dynamic';

// AI/video components
const AvatarChat = dynamic(() => import('@/components/avatar-chat'), { ssr: false });

// Charts, maps, rich editors
const Chart = dynamic(() => import('@/components/chart'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded" />,
});
```

### Image Optimisation
```tsx
import Image from 'next/image';
<Image
  src={url}
  alt="Descriptive alt text"
  width={800}
  height={600}
  priority={isAboveFold}  // only for LCP images
/>
```

Configure allowed remote image hosts in `next.config.js`:
```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**.supabase.co' },
  ],
},
```

### Bundle Splitting
- Avoid barrel files (`index.ts` that re-exports everything) — they defeat tree-shaking
- Import icons individually: `import { Zap } from 'lucide-react'` (lucide-react v3+ is tree-shakeable)
- Large one-time utils (e.g. Haversine formula, heavy formatters) belong in `src/lib/utils.ts`, not inlined in components

---

## 9. Monitoring & Error Tracking (Sentry)

### Setup (`next.config.js`)
```js
module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.SENTRY_AUTH_TOKEN,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  hideSourceMaps: true,
  webpack: {
    autoInstrumentServerFunctions: true,
    autoInstrumentMiddleware: true,
    autoInstrumentAppDirectory: true,
    treeshake: { removeDebugLogging: true },
  },
  telemetry: false,
});
```

### Root Error Boundary
```tsx
// src/components/sentry-error-boundary.tsx
// Renders Sentry.ErrorBoundary when DSN is set; plain children when not
// Fallback UI with error message + "Try again" button
// Wraps entire <body> in root layout.tsx
```

### Feature-Level Error Boundaries
Wrap each major UI region independently so one failure doesn't kill the whole dashboard:
```tsx
<SentryErrorBoundary>
  <AvatarChatWidget />
</SentryErrorBoundary>
```

---

## 10. SEO & Metadata

Every page must export a `generateMetadata` function or static `metadata` object:
```tsx
export const metadata: Metadata = {
  title: 'Page Title | App Name',
  description: 'Clear, keyword-rich description under 160 characters.',
  openGraph: {
    title: 'Page Title | App Name',
    description: '...',
    type: 'website',
  },
};
```

Root layout sets canonical app name and description:
```tsx
export const metadata: Metadata = {
  title: { default: 'App Name', template: '%s | App Name' },
  description: 'App tagline',
};
```

---

## 11. Database Conventions

### Table Naming
- Prefix all tables with a project-specific namespace to avoid conflicts: `nursly_profiles`, `nursly_shifts`, etc.
- Use `snake_case` for all column names
- Every table has: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`, `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()`

### Standard RLS Pattern
```sql
-- Enable RLS
ALTER TABLE app_table ENABLE ROW LEVEL SECURITY;

-- Users see only their own rows
CREATE POLICY "users_select_own" ON app_table
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own" ON app_table
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own" ON app_table
  FOR UPDATE USING (auth.uid() = user_id);

-- Platform admins see everything
CREATE POLICY "admins_all" ON app_table
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'platform_admin'
    )
  );
```

### Financial Data
- Never store full account numbers, card numbers, or sort codes in application tables
- Store only last-4 digits for display
- Route all payment data through a regulated processor (Stripe, GoCardless)
- Comment this clearly in the code:
  ```ts
  // SECURITY: Never store full account numbers.
  // Only persist the last 4 digits for display purposes.
  // Full details must be handled by a payment processor.
  ```

---

## 12. Testing & Build Verification

Before every deployment:

```bash
# 1. TypeScript — zero errors
npx tsc --noEmit

# 2. Build — must complete without errors
npm run build

# 3. Route completeness check
# Manually verify every role's navigation links return 200
# Worker, Provider, Admin dashboards
# All /legal/* pages
# Auth flow: register → login → forgot-password

# 4. Rate limiting test
# Hit an API endpoint >5 times in 60s → confirm 429 response
# Confirm Retry-After header is present

# 5. Auth guard test
# Visit /worker/shifts unauthenticated → confirm redirect to /login
# Visit /admin/users as a worker → confirm redirect to /worker/shifts
```

---

## 13. Deployment (Vercel)

### Pre-deployment Checklist
```
[ ] npm run build passes cleanly (0 type errors, 0 lint errors)
[ ] All env vars added in Vercel project settings (not .env.local)
[ ] Supabase RLS enabled on every table
[ ] Sentry DSN and auth token configured
[ ] Upstash Redis REST URL and token configured
[ ] HeyGen API key added (server-only)
[ ] NEXT_PUBLIC_* vars contain NO secrets
[ ] .env.local is in .gitignore
```

### Vercel CLI Deploy
```bash
npx vercel --prod
```

### Branch / Git Workflow
```
main          — production branch, deploys automatically to Vercel
feature/*     — feature branches, PR into main
hotfix/*      — critical fixes, PR into main with expedited review
```

Never force-push to `main`. Never commit `.env.local`, `*.pem`, or any credentials.

---

## 14. Reusable Utility Patterns

### Currency Formatting
```ts
export function formatCurrency(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency', currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
```

### Date / Time Formatting
```ts
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date));
}
```

### Initials / Avatar Fallback
```ts
export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
```

### Status Colour Mapping
```ts
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'text-green-700 bg-green-100',
    pending: 'text-yellow-700 bg-yellow-100',
    completed: 'text-blue-700 bg-blue-100',
    cancelled: 'text-red-700 bg-red-100',
    failed: 'text-red-700 bg-red-100',
  };
  return map[status] ?? 'text-gray-700 bg-gray-100';
}
```

---

## 15. Anti-Patterns to Avoid

| Anti-pattern | Correct approach |
|---|---|
| Storing session tokens in `localStorage` | Use `@supabase/ssr` cookie-based sessions |
| `NEXT_PUBLIC_` prefix on API keys | Server-only env vars, proxied through route handlers |
| `import * from 'lucide-react'` | Named imports only |
| `useEffect` for every data fetch | Fetch on server in Server Components; `useCallback` + single `useEffect` on client |
| `any` on API response shapes | Define typed interfaces in `types.ts` |
| Error boundary around entire app only | Error boundaries at feature level too |
| Inline CSP `unsafe-eval` in production | Fine for Next.js dev; ensure it's documented as a known trade-off |
| Skipping `aria-label` on icon buttons | Every icon-only button needs an accessible label |
| `window is not defined` SSR crashes | `ssr: false` dynamic import or `typeof window !== 'undefined'` guard |
| Storing account numbers in app DB | Last 4 digits only; full details through payment processor |
| Rate limiting only in middleware | Add per-endpoint rate limiting for sensitive AI/payment endpoints as a second layer |
| `git add -A` with secrets in working dir | Stage files by name; verify `.gitignore` covers `.env*` |

---

## 16. Quick-Start Checklist for a New Project

```
[ ] Create Next.js 15 app with App Router + TypeScript strict
[ ] Install: @supabase/ssr @sentry/nextjs @upstash/ratelimit @upstash/redis lucide-react clsx tailwind-merge
[ ] Copy middleware.ts (security headers + rate limit + auth guard)
[ ] Copy src/lib/rate-limit.ts (Upstash + in-memory fallback)
[ ] Copy src/lib/supabase/client.ts + server.ts + middleware.ts
[ ] Copy src/components/cookie-consent.tsx (GDPR + POPIA)
[ ] Copy src/components/sentry-error-boundary.tsx
[ ] Add SentryErrorBoundary + CookieConsent to root layout.tsx
[ ] Configure next.config.js with withSentryConfig
[ ] Configure tsconfig.json strict mode
[ ] Add .env.example documenting all required variables
[ ] Create /legal/privacy, /legal/terms, /legal/gdpr pages
[ ] Enable RLS on all Supabase tables
[ ] Run tsc --noEmit + npm run build before first deployment
```

---

*Generated from the Rotawell production codebase — April 2026. Apply to any Next.js + Supabase SaaS platform.*
