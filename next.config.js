// @ts-check
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

module.exports = withSentryConfig(nextConfig, {
  // ──────────────────────────────────────────────────────────────────────────
  // Sentry build-time options.
  //
  // SETUP: Create a free account at https://sentry.io, create a project of
  // type "Next.js", then:
  //  1. Copy the DSN into NEXT_PUBLIC_SENTRY_DSN in .env.local
  //  2. Generate an auth token (Settings → Auth Tokens) and add it as
  //     SENTRY_AUTH_TOKEN in .env.local to enable source map uploads.
  // ──────────────────────────────────────────────────────────────────────────

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps when an auth token is present.
  // This keeps local dev and CI builds without credentials working fine.
  silent: !process.env.SENTRY_AUTH_TOKEN,

  // Upload source maps to Sentry so stack traces show original code.
  // Disabled when SENTRY_AUTH_TOKEN is not set.
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Hides source maps from the browser bundle (they are uploaded to Sentry).
  hideSourceMaps: true,

  webpack: {
    // Wrap route handlers and middleware to capture request context.
    autoInstrumentServerFunctions: true,
    autoInstrumentMiddleware: true,
    autoInstrumentAppDirectory: true,

    // Tree-shake Sentry logger statements in production.
    treeshake: {
      removeDebugLogging: true,
    },
  },

  // Suppress the Sentry CLI wizard prompt.
  telemetry: false,
});
