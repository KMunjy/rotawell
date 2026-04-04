import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { Heart, Shield, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function AboutPage() {
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
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">About Rotawell</p>
            <h1 className="mt-4 text-5xl font-bold text-gray-900">
              Connecting Care That Counts
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Rotawell is a UK healthcare staffing platform built to solve a persistent problem in social care: connecting skilled care workers with the providers who need them, quickly, fairly, and without the agency middleman taking a 30% cut.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-brand-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Our mission</h2>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  The UK social care sector faces a staffing crisis. Over 150,000 vacancies exist across care homes and community services, while care workers are underpaid and undervalued, trapped in rigid agency contracts that take a significant share of their earnings.
                </p>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  We built Rotawell to change that. Our platform lets care workers find shifts on their own terms, get paid fairly and quickly, and build a career they can be proud of — while giving providers a direct, reliable way to fill their rotas without the overhead.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { icon: <Heart className="h-6 w-6" />, title: 'Worker-first', desc: 'Care workers keep more of what they earn. No hidden fees, no arbitrary cuts.' },
                  { icon: <Shield className="h-6 w-6" />, title: 'Safety-led', desc: 'DBS checks, NMC verification, and mandatory training before every placement.' },
                  { icon: <Zap className="h-6 w-6" />, title: 'Fast pay', desc: 'Instant Pay lets workers access earned wages the same day they finish a shift.' },
                  { icon: <Users className="h-6 w-6" />, title: 'Direct match', desc: 'Providers connect directly with workers. No costly agency intermediaries.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {item.icon}
                    </div>
                    <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our values</h2>
              <p className="mt-4 text-gray-600">What guides every decision we make</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Dignity for care workers',
                  desc: 'Care work is skilled, demanding, and essential. We believe the people who do it deserve fair pay, flexible scheduling, and a platform that treats them as professionals — not just labour.',
                },
                {
                  title: 'Transparency above all',
                  desc: 'Our fees are published. Our processes are documented. Workers and providers always know exactly what they\'re paying and what they\'re getting. No fine print.',
                },
                {
                  title: 'Quality of care matters',
                  desc: 'Every verification step we add — DBS, NMC, mandatory training — exists because it protects the people receiving care. We won\'t cut corners on safety, ever.',
                },
              ].map((value) => (
                <div key={value.title} className="rounded-xl border border-gray-200 p-8">
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team vision */}
        <section className="py-20 bg-primary">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Built by people who care about care</h2>
            <p className="mt-6 text-lg text-green-100 leading-relaxed">
              Rotawell was founded by a team with experience in healthcare, technology, and labour markets. We've seen first-hand how broken the staffing system is — and we're building the tools to fix it.
            </p>
            <p className="mt-4 text-lg text-green-100 leading-relaxed">
              We're a small, focused team. We're not trying to be the biggest agency — we're trying to make agencies unnecessary.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register?role=worker" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100">
                I'm a care worker
                <ArrowRight className="inline ml-2 h-4 w-4" />
              </Link>
              <Link href="/register?role=provider" className="rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                I'm a care provider
              </Link>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Get in touch</h2>
            <p className="mt-3 text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
            <Link href="/contact" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90">
              Contact us
            </Link>
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
