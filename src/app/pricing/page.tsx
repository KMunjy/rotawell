import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { CheckCircle, X, ArrowRight, Zap } from 'lucide-react';

const workerFeatures = [
  'Create your profile and browse all available shifts',
  'Apply for unlimited shifts',
  'DBS & credential verification support',
  'Mandatory training modules (when available)',
  'Earnings tracking and payment history',
  'Instant Pay — access wages same day (2.5% fee)',
  'Referral rewards programme',
  '24/7 support',
];

const providerPlansPay = [
  'Post unlimited shifts',
  'Access to all verified care workers',
  'Applicant review and approval tools',
  'Worker profiles and history',
  'Performance benchmarking',
  'Monthly invoicing',
  'Email support',
];

const providerPlansSub = [
  'Everything in Pay-per-shift',
  'Priority shift matching',
  'Dedicated account manager',
  'Bulk shift posting tools',
  'Advanced analytics dashboard',
  'Phone support',
  'Custom onboarding for your team',
];

export default function PricingPage() {
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

      <main>
        {/* Hero */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Simple, transparent pricing</h1>
            <p className="mt-4 text-xl text-gray-600">
              Free for care workers. Providers pay only when shifts are filled.
            </p>
          </div>
        </section>

        {/* Care Workers — Free */}
        <section className="py-16 bg-brand-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg rounded-2xl border-2 border-primary bg-white p-10 text-center shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">For Care Workers</p>
              <p className="mt-4 text-6xl font-bold text-gray-900">Free</p>
              <p className="mt-2 text-gray-500">Always</p>
              <p className="mt-4 text-gray-600">
                Rotawell is completely free to use for care workers. We take a 10% platform fee from the shift rate — you always know exactly what you'll earn before you apply.
              </p>
              <ul className="mt-8 space-y-3 text-left">
                {workerFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register?role=worker"
                className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Create your free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Providers */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">For Care Providers</h2>
              <p className="mt-3 text-gray-600">Choose how you want to work with us</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
              {/* Pay per shift */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Pay-per-shift</p>
                <p className="mt-4 text-4xl font-bold text-gray-900">10%</p>
                <p className="mt-1 text-gray-500">of each shift value, billed monthly</p>
                <p className="mt-4 text-gray-600 text-sm">
                  Only pay when a shift is filled. No minimum commitment. Perfect for organisations with variable staffing needs.
                </p>
                <ul className="mt-6 space-y-3">
                  {providerPlansPay.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register?role=provider"
                  className="mt-8 block rounded-lg border border-primary px-6 py-3 text-center text-sm font-semibold text-primary hover:bg-primary/5"
                >
                  Get started free
                </Link>
              </div>

              {/* Monthly subscription */}
              <div className="rounded-2xl border-2 border-primary bg-primary/5 p-8 relative">
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Monthly subscription</p>
                <p className="mt-4 text-4xl font-bold text-gray-900">£299</p>
                <p className="mt-1 text-gray-500">per month + 5% per shift</p>
                <p className="mt-4 text-gray-600 text-sm">
                  Flat monthly fee with a reduced per-shift rate. Best for care homes and agencies with consistent, high-volume staffing needs.
                </p>
                <ul className="mt-6 space-y-3">
                  {providerPlansSub.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-8 block rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Instant Pay explainer */}
        <section className="py-12 bg-yellow-50 border-y border-yellow-200">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto" />
            <h2 className="mt-3 text-2xl font-bold text-gray-900">Instant Pay for workers</h2>
            <p className="mt-3 text-gray-600">
              Workers can access up to 70% of their earned balance on the same day they finish a shift.
              A small 2.5% fee applies to instant access. The remaining balance is paid in the regular weekly cycle.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Common questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Is Rotawell really free for care workers?',
                  a: 'Yes. There are no subscription fees, sign-up fees, or placement fees for workers. Rotawell charges providers a 10% fee on the shift value — workers keep the remaining 90% of what providers pay.',
                },
                {
                  q: 'How does the 10% platform fee work for providers?',
                  a: 'When a shift is filled, providers pay the agreed shift rate plus a 10% Rotawell fee. This replaces traditional agency margins which often run 20–35%.',
                },
                {
                  q: 'Are there any setup or cancellation fees?',
                  a: 'No setup fees. No cancellation fees. Pay-per-shift providers only pay when shifts are actually filled. Monthly subscribers can cancel with 30 days notice.',
                },
                {
                  q: 'What is Instant Pay?',
                  a: 'Instant Pay lets workers access up to 70% of their earned wages immediately after completing a shift, instead of waiting for the regular pay cycle. A 2.5% fee applies to instant withdrawals.',
                },
              ].map((item) => (
                <div key={item.q} className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-gray-900">{item.q}</h3>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
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
