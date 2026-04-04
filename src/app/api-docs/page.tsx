import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { Lock, Code, Zap, AlertCircle } from 'lucide-react';

const endpoints = [
  {
    group: 'Shifts',
    items: [
      { method: 'GET', path: '/v1/shifts', desc: 'List available shifts. Supports filters: location, specialty, date_from, date_to, min_rate.' },
      { method: 'GET', path: '/v1/shifts/:id', desc: 'Get a single shift by ID.' },
      { method: 'POST', path: '/v1/shifts', desc: 'Create a new shift. Requires provider credentials. Body: title, specialty, start_time, end_time, rate, location.' },
      { method: 'PATCH', path: '/v1/shifts/:id', desc: 'Update a shift. Only the creating org can update.' },
      { method: 'DELETE', path: '/v1/shifts/:id', desc: 'Cancel a shift. Cannot be cancelled if a worker has already been confirmed.' },
    ],
  },
  {
    group: 'Applications',
    items: [
      { method: 'GET', path: '/v1/applications', desc: 'List applications for your shifts (providers) or your own applications (workers).' },
      { method: 'POST', path: '/v1/applications', desc: 'Apply for a shift. Body: shift_id.' },
      { method: 'PATCH', path: '/v1/applications/:id', desc: 'Approve or reject an application. Body: status (approved | rejected).' },
    ],
  },
  {
    group: 'Workers',
    items: [
      { method: 'GET', path: '/v1/workers', desc: 'List workers who have completed shifts for your organisation.' },
      { method: 'GET', path: '/v1/workers/:id', desc: 'Get a worker\'s public profile, credentials, and shift history with your org.' },
    ],
  },
  {
    group: 'Invoices',
    items: [
      { method: 'GET', path: '/v1/invoices', desc: 'List invoices for your organisation. Supports filters: status, period_start, period_end.' },
      { method: 'GET', path: '/v1/invoices/:id', desc: 'Get invoice details including line items.' },
    ],
  },
  {
    group: 'Webhooks',
    items: [
      { method: 'POST', path: '/v1/webhooks', desc: 'Register a webhook endpoint to receive real-time events.' },
      { method: 'GET', path: '/v1/webhooks', desc: 'List registered webhooks for your organisation.' },
      { method: 'DELETE', path: '/v1/webhooks/:id', desc: 'Remove a registered webhook.' },
    ],
  },
];

const events = [
  { event: 'shift.created', desc: 'A new shift was posted.' },
  { event: 'shift.filled', desc: 'A worker was confirmed for a shift.' },
  { event: 'shift.cancelled', desc: 'A shift was cancelled.' },
  { event: 'application.received', desc: 'A worker applied to one of your shifts.' },
  { event: 'invoice.issued', desc: 'A new invoice was generated for your organisation.' },
  { event: 'invoice.paid', desc: 'An invoice was marked as paid.' },
];

const methodColors: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-800',
  POST: 'bg-green-100 text-green-800',
  PATCH: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2">
              <OrbitalHeart />
              <span className="text-2xl font-bold text-primary">Rotawell</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
              <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">API Documentation</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            The Rotawell API allows care providers to integrate shift management directly into your own systems — your rota software, HR platform, or bespoke tooling.
          </p>

          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              The Rotawell API is currently in <strong>private beta</strong> and available to selected partners on the Monthly Subscription plan.{' '}
              <Link href="/contact" className="underline hover:no-underline">Contact us</Link> to request API access.
            </p>
          </div>
        </div>

        {/* Authentication */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <p className="text-gray-600">
              All API requests must include your API key in the <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">Authorization</code> header as a Bearer token.
            </p>
            <div className="rounded-lg bg-gray-900 p-4">
              <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`Authorization: Bearer rw_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              Keep your API key secret. Do not expose it in client-side code. Rotate it immediately from your account settings if it is compromised.
            </p>

            <div className="border-t border-gray-100 pt-4">
              <p className="font-medium text-gray-900 mb-2">Base URL</p>
              <div className="rounded-lg bg-gray-900 p-4">
                <pre className="text-sm text-green-400 font-mono">
{`https://api.rotawell.co.uk`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Getting started */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Zap className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Quick start</h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <p className="text-gray-600">List available shifts in your area:</p>
            <div className="rounded-lg bg-gray-900 p-4">
              <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`curl https://api.rotawell.co.uk/v1/shifts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -G \\
  --data-urlencode "location=London" \\
  --data-urlencode "specialty=care_assistant"`}
              </pre>
            </div>

            <p className="text-gray-600">Example response:</p>
            <div className="rounded-lg bg-gray-900 p-4">
              <pre className="text-sm text-blue-300 font-mono overflow-x-auto text-xs">
{`{
  "data": [
    {
      "id": "shift_abc123",
      "title": "Night Care Assistant",
      "specialty": "care_assistant",
      "start_time": "2026-04-05T22:00:00Z",
      "end_time": "2026-04-06T08:00:00Z",
      "rate": 14.50,
      "location": "Hammersmith, London",
      "status": "open",
      "applications_count": 3
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Code className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Endpoints</h2>
          </div>

          <div className="space-y-8">
            {endpoints.map((group) => (
              <div key={group.group}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{group.group}</h3>
                <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
                  {group.items.map((item) => (
                    <div key={item.path} className="flex items-start gap-4 p-4">
                      <span className={`rounded px-2 py-0.5 text-xs font-bold font-mono flex-shrink-0 mt-0.5 ${methodColors[item.method]}`}>
                        {item.method}
                      </span>
                      <div>
                        <code className="text-sm font-mono text-gray-800">{item.path}</code>
                        <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Webhooks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Webhook events</h2>
          <p className="text-gray-600 mb-4">
            Register a webhook URL to receive POST requests when events occur on your account. Each event payload includes the event type, timestamp, and a data object specific to that event.
          </p>
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {events.map((e) => (
              <div key={e.event} className="flex items-start gap-4 p-4">
                <code className="text-sm font-mono text-primary flex-shrink-0 min-w-[180px]">{e.event}</code>
                <p className="text-sm text-gray-600">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rate limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate limits</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
            <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
              <span className="text-gray-600">Requests per minute</span>
              <span className="font-semibold text-gray-900">60</span>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
              <span className="text-gray-600">Requests per hour</span>
              <span className="font-semibold text-gray-900">1,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Requests per day</span>
              <span className="font-semibold text-gray-900">10,000</span>
            </div>
            <p className="text-sm text-gray-500 pt-2">
              Rate limit headers are returned on every response:{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">X-RateLimit-Limit</code>,{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">X-RateLimit-Remaining</code>,{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">X-RateLimit-Reset</code>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-primary p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Ready to integrate?</h2>
          <p className="mt-3 text-green-100">
            API access is available to Monthly Subscription providers. Get in touch to request your API key.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100"
          >
            Request API access
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-gray-400">
              <a href="/legal/privacy" className="hover:text-gray-600">Privacy Policy</a>
              <a href="/legal/gdpr" className="hover:text-gray-600">GDPR & Data</a>
              <a href="/contact" className="hover:text-gray-600">Contact</a>
              <a href="/careers" className="hover:text-gray-600">Careers</a>
            </div>
            <p className="text-xs text-gray-400">
              POPIA Information Officer: <a href="mailto:privacy@rotawell.co.uk" className="hover:text-gray-600">privacy@rotawell.co.uk</a>
            </p>
            <p className="text-sm text-gray-500">
              Copyright © {new Date().getFullYear()} Rotawell Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
