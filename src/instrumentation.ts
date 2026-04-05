// Next.js instrumentation hook — called once on server startup.
// Sentry must be initialised here for Next.js 14+ App Router.
// This replaces the legacy sentry.server.config.ts / sentry.edge.config.ts files.

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

// Captures errors thrown in nested React Server Components and passes them to
// Sentry. No-op when Sentry has not been initialised (DSN not set).
export const onRequestError = async (
  err: unknown,
  request: { path: string; method: string; headers: Record<string, string | string[] | undefined> },
  context: { routerKind: string; routePath: string; routeType: string },
) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  const Sentry = await import('@sentry/nextjs');
  Sentry.captureRequestError(err, request, context);
};
