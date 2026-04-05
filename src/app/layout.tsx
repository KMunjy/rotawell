import type { Metadata } from 'next';
import './globals.css';
import { ChatWidget } from '@/components/chat/chat-widget';
import { AvatarChatWidget } from '@/components/avatar-chat-widget';
import { TickerBar } from '@/components/layout/ticker-bar';
import { Providers } from '@/components/providers';
import { CookieConsent } from '@/components/cookie-consent';
import { SentryErrorBoundary } from '@/components/sentry-error-boundary';

export const metadata: Metadata = {
  title: 'Rotawell - Connecting Care That Counts',
  description: 'Rotawell connects care workers with flexible opportunities. Connecting Care That Counts — a modern, trusted platform for UK care staffing.',
  keywords: ['care', 'staffing', 'healthcare', 'UK', 'workers', 'providers'],
  robots: 'index, follow',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A6B5A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-sans bg-brand-cream text-brand-dark">
        <SentryErrorBoundary>
          <Providers>
            <main>{children}</main>
            <TickerBar />
            <ChatWidget />
            <AvatarChatWidget />
            <CookieConsent />
          </Providers>
        </SentryErrorBoundary>
      </body>
    </html>
  );
}
