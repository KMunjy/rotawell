// Sentry client-side configuration.
// This file is loaded in the browser. It initialises Sentry only when a DSN is
// present, so local development without a DSN works as a graceful no-op.
//
// ──────────────────────────────────────────────────────────────────────────────
// SETUP: Create a free account at https://sentry.io, create a project of type
// "Next.js", then copy the DSN shown in Settings → Projects → <your project> →
// Client Keys (DSN) into NEXT_PUBLIC_SENTRY_DSN in your .env.local file.
// ──────────────────────────────────────────────────────────────────────────────

import * as Sentry from '@sentry/nextjs';

// Required for Sentry to capture client-side navigation transitions.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,

    // Percentage of transactions captured for performance monitoring (0.0–1.0).
    // Reduce in production if you hit quota limits.
    tracesSampleRate: 1.0,

    // Percentage of sessions captured for session replay.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Adds readable stack traces in development.
    debug: process.env.NODE_ENV === 'development',

    integrations: [
      Sentry.replayIntegration(),
    ],
  });
}
