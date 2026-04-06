import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Shield,
  BadgePoundSterling,
  ClipboardCheck,
  Users,
  Clock,
  Star,
  UserCheck,
  Search,
  Handshake,
  Banknote,
} from 'lucide-react';

const PROOF_STATS = [
  { value: '3,200+', label: 'Care professionals', icon: Users },
  { value: '\u00A312.71', label: 'NLW guaranteed', icon: BadgePoundSterling },
  { value: '<4 hrs', label: 'Average fill time', icon: Clock },
  { value: '98%', label: 'Satisfaction rate', icon: Star },
];

const STEPS = [
  {
    num: '01',
    title: 'Create your profile',
    desc: 'Add your qualifications, DBS status, and preferred locations. Takes under five minutes.',
    icon: UserCheck,
  },
  {
    num: '02',
    title: 'Browse available shifts',
    desc: 'Filter by specialty, location, pay rate, and schedule. See exactly what you\u2019ll earn.',
    icon: Search,
  },
  {
    num: '03',
    title: 'Get matched',
    desc: 'Apply to shifts that fit. Providers review your profile and confirm directly\u2014no agency middleman.',
    icon: Handshake,
  },
  {
    num: '04',
    title: 'Start earning',
    desc: 'Complete shifts and get paid weekly\u2014or access up to 70% of earnings same-day with Instant Pay.',
    icon: Banknote,
  },
];

const TRUST_POINTS = [
  {
    title: 'DBS-verified workforce',
    desc: 'Every care worker on Rotawell holds a valid DBS check. We verify credentials before any shift can be booked\u2014no exceptions.',
    icon: Shield,
  },
  {
    title: 'Fair pay guarantee',
    desc: 'Workers keep 90% of the shift rate. No hidden deductions, no surprise fees. You always see exactly what you\u2019ll earn before you apply.',
    icon: BadgePoundSterling,
  },
  {
    title: 'CQC-aligned standards',
    desc: 'Our compliance framework follows Care Quality Commission guidelines. Mandatory training, safeguarding protocols, and ongoing quality audits.',
    icon: ClipboardCheck,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <PublicHeader />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50/40 to-cream-100 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-700">
              UK care staffing, simplified
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              The smarter way to staff&nbsp;
              <span className="text-primary">social care</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Rotawell connects verified care professionals directly with providers who need them\u2014no agency markup, no guesswork, no delays.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register?role=worker">
                <Button size="lg">
                  Find shifts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register?role=provider">
                <Button variant="outline" size="lg">
                  Post a shift
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof strip ── */}
      <section className="border-y border-gray-200/60 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 sm:px-6 lg:px-8">
          {PROOF_STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <s.icon className="h-5 w-5 text-primary-400" />
              <div>
                <p className="text-lg font-bold tracking-tight text-gray-900">{s.value}</p>
                <p className="text-2xs font-medium uppercase tracking-wide text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Four steps to your next shift
            </h2>
            <p className="mt-4 text-gray-600">
              No agencies, no middlemen. Create a profile, find a shift, and start earning\u2014all in one place.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group rounded-2xl border border-gray-200/80 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary-200">{step.num}</span>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Why trust Rotawell</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built on safety, transparency, and fair pay
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {TRUST_POINTS.map((t) => (
              <div key={t.title} className="rounded-2xl border border-gray-200/80 bg-cream-100 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <t.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-gray-900">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary-900 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-primary-200">
            Join thousands of care professionals and providers already using Rotawell.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register?role=worker">
              <Button size="lg" className="bg-white text-primary-900 hover:bg-cream-200">
                I{'\u2019'}m a care worker
              </Button>
            </Link>
            <Link href="/register?role=provider">
              <Button
                size="lg"
                className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                I{'\u2019'}m a care provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
