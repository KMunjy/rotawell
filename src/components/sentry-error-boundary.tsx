'use client';

import * as Sentry from '@sentry/nextjs';
import type { ReactNode } from 'react';

// Wraps the app in Sentry's React error boundary so unhandled client-side
// errors are captured and reported. Falls back to re-throwing when no DSN is
// configured (graceful no-op in local dev).
export function SentryErrorBoundary({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return <>{children}</>;
  }

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Something went wrong
          </h2>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            {(error as Error)?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={resetError}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#1A6B5A',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
