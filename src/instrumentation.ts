// Next.js instrumentation hook — called once on server startup.
// Sentry must be initialised here (not in sentry.server.config.ts) for
// Next.js 14+ App Router. The file replaces the legacy sentry.server.config.ts
// and sentry.edge.config.ts approach.

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return; // graceful no-op when DSN is not configured

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn,
      tracesSampleRate: 1.0,
      debug: process.env.NODE_ENV === 'development',
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn,
      tracesSampleRate: 1.0,
      debug: process.env.NODE_ENV === 'development',
    });
  }
}
