import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Heart, Shield, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VALUES = [
  {
    title: 'Dignity for care workers',
    desc: 'Care work is skilled, demanding, and essential. We believe the people who do it deserve fair pay, flexible scheduling, and a platform that treats them as professionals\u2014not just labour.',
  },
  {
    title: 'Transparency above all',
    desc: 'Our fees are published. Our processes are documented. Workers and providers always know exactly what they\u2019re paying and what they\u2019re getting. No fine print.',
  },
  {
    title: 'Quality of care matters',
    desc: 'Every verification step we add\u2014DBS, NMC, mandatory training\u2014exists because it protects the people receiving care. We won\u2019t cut corners on safety, ever.',
  },
];

const PILLARS = [
  { icon: Heart, title: 'Worker-first', desc: 'Care workers keep more of what they earn. No hidden fees, no arbitrary cuts.' },
  { icon: Shield, title: 'Safety-led', desc: 'DBS checks, NMC verification, and mandatory training before every placement.' },
  { icon: Zap, title: 'Fast pay', desc: 'Instant Pay lets workers access earned wages the same day they finish a shift.' },
  { icon: Users, title: 'Direct match', desc: 'Providers connect directly with workers. No costly agency intermediaries.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">About Rotawell</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Connecting Care That Counts
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Rotawell is a UK healthcare staffing platform built to solve a persistent problem in social care: connecting skilled care workers with the providers who need them, quickly, fairly, and without the agency middleman taking a 30% cut.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our mission</h2>
                <p className="mt-4 text-lg leading-relaxed text-gray-600">
                  The UK social care sector faces a staffing crisis. Over 150,000 vacancies exist across care homes and community services, while care workers are underpaid and undervalued, trapped in rigid agency contracts that take a significant share of their earnings.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-gray-600">
                  We built Rotawell to change that. Our platform lets care workers find shifts on their own terms, get paid fairly and quickly, and build a career they can be proud of\u2014while giving providers a direct, reliable way to fill their rotas without the overhead.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {PILLARS.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-gray-200/80 bg-white p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-semibold tracking-tight text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our values</h2>
              <p className="mt-4 text-gray-600">What guides every decision we make</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {VALUES.map((value) => (
                <div key={value.title} className="rounded-2xl border border-gray-200/80 bg-cream-100 p-8">
                  <CheckCircle className="h-7 w-7 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-gray-900">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team vision */}
        <section className="bg-primary-900 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white">Built by people who care about care</h2>
            <p className="mt-6 text-lg leading-relaxed text-primary-200">
              Rotawell was founded by a team with experience in healthcare, technology, and labour markets. We{'\u2019'}ve seen first-hand how broken the staffing system is\u2014and we{'\u2019'}re building the tools to fix it.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-primary-200">
              We{'\u2019'}re a small, focused team. We{'\u2019'}re not trying to be the biggest agency\u2014we{'\u2019'}re trying to make agencies unnecessary.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register?role=worker">
                <Button size="lg" className="bg-white text-primary-900 hover:bg-cream-200">
                  I{'\u2019'}m a care worker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register?role=provider">
                <Button size="lg" className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10">
                  I{'\u2019'}m a care provider
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Get in touch</h2>
            <p className="mt-3 text-gray-600">Have questions? We{'\u2019'}d love to hear from you.</p>
            <Link href="/contact" className="mt-6 inline-block">
              <Button>Contact us</Button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
