import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

const workerFeatures = [
  'Create your profile and browse all available shifts',
  'Apply for unlimited shifts',
  'DBS & credential verification support',
  'Mandatory training modules (when available)',
  'Earnings tracking and payment history',
  'Instant Pay \u2014 access wages same day (2.5% fee)',
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
    <div className="min-h-screen bg-cream-100">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Simple, transparent pricing</h1>
            <p className="mt-4 text-lg text-gray-600">
              Free for care workers. Providers pay only when shifts are filled.
            </p>
          </div>
        </section>

        {/* Care Workers \u2014 Free */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg rounded-2xl border-2 border-primary bg-white p-10 text-center shadow-md">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">For Care Workers</p>
              <p className="mt-4 text-6xl font-bold tracking-tight text-gray-900">Free</p>
              <p className="mt-2 text-gray-500">Always</p>
              <p className="mt-4 text-gray-600">
                Rotawell is completely free to use for care workers. We take a 10% platform fee from the shift rate\u2014you always know exactly what you{'\u2019'}ll earn before you apply.
              </p>
              <ul className="mt-8 space-y-3 text-left">
                {workerFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register?role=worker" className="mt-8 block">
                <Button className="w-full">
                  Create your free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Providers */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">For Care Providers</h2>
              <p className="mt-3 text-gray-600">Choose how you want to work with us</p>
            </div>

            <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
              {/* Pay per shift */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Pay-per-shift</p>
                <p className="mt-4 text-4xl font-bold tracking-tight text-gray-900">10%</p>
                <p className="mt-1 text-gray-500">of each shift value, billed monthly</p>
                <p className="mt-4 text-sm text-gray-600">
                  Only pay when a shift is filled. No minimum commitment. Perfect for organisations with variable staffing needs.
                </p>
                <ul className="mt-6 space-y-3">
                  {providerPlansPay.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register?role=provider" className="mt-8 block">
                  <Button variant="outline" className="w-full">Get started free</Button>
                </Link>
              </div>

              {/* Monthly subscription */}
              <div className="relative rounded-2xl border-2 border-primary bg-primary-50/30 p-8 shadow-md">
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Monthly subscription</p>
                <p className="mt-4 text-4xl font-bold tracking-tight text-gray-900">{'\u00A3'}299</p>
                <p className="mt-1 text-gray-500">per month + 5% per shift</p>
                <p className="mt-4 text-sm text-gray-600">
                  Flat monthly fee with a reduced per-shift rate. Best for care homes and agencies with consistent, high-volume staffing needs.
                </p>
                <ul className="mt-6 space-y-3">
                  {providerPlansSub.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="mt-8 block">
                  <Button className="w-full">Contact sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Instant Pay explainer */}
        <section className="border-y border-yellow-200 bg-yellow-50 py-12">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <Zap className="mx-auto h-8 w-8 text-yellow-500" />
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">Instant Pay for workers</h2>
            <p className="mt-3 text-gray-600">
              Workers can access up to 70% of their earned balance on the same day they finish a shift.
              A small 2.5% fee applies to instant access. The remaining balance is paid in the regular weekly cycle.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">Common questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Is Rotawell really free for care workers?',
                  a: 'Yes. There are no subscription fees, sign-up fees, or placement fees for workers. Rotawell charges providers a 10% fee on the shift value\u2014workers keep the remaining 90% of what providers pay.',
                },
                {
                  q: 'How does the 10% platform fee work for providers?',
                  a: 'When a shift is filled, providers pay the agreed shift rate plus a 10% Rotawell fee. This replaces traditional agency margins which often run 20\u201335%.',
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
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
