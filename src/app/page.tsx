'use client';

import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Heart, MapPin, Zap, Shield, TrendingUp, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-2">
              <OrbitalHeart />
              <h1 className="text-2xl font-bold text-primary">Rotawell</h1>
              <p className="text-xs text-gray-500 font-medium">Connecting Care That Counts</p>
            </div>
            <nav className="hidden gap-8 md:flex">
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                How it works
              </a>
              <a href="#trust" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Why trust us
              </a>
              <a href="#cta" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Get started
              </a>
            </nav>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Join now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
                Care work that <span className="text-primary">fits your life</span>
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Rotawell connects dedicated care workers with UK providers who need flexible staffing. Work when you want, earn what you're worth.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/register?role=worker">
                  <Button variant="primary" size="lg">
                    Find shifts
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register?role=provider">
                  <Button variant="outline" size="lg">
                    Post a shift
                  </Button>
                </Link>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-3">
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-gray-900">DBS verified</p>
                    <p className="text-sm text-gray-600">All workers screened</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-gray-900">Instant pay</p>
                    <p className="text-sm text-gray-600">Get paid same day</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-gray-900">24/7 support</p>
                    <p className="text-sm text-gray-600">Always here for you</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-96 w-96">
                <div className="absolute inset-0 animate-orbital-rotation">
                  <div className="absolute top-0 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="absolute right-0 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="absolute left-0 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-red-100 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center animate-pulse-scale">
                    <Heart className="h-16 w-16 text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">A growing community of care professionals</p>
            <p className="mt-3 text-gray-600">
              Connecting dedicated care workers with trusted UK providers every day.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-5 w-5 text-primary" />
                DBS-verified workers
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-5 w-5 text-primary" />
                Regulated care providers
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-5 w-5 text-primary" />
                Transparent pay rates
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-5 w-5 text-primary" />
                Same-day instant pay
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">How it works</h2>
            <p className="mt-4 text-lg text-gray-600">Simple, transparent, and fair.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Create your profile',
                description: 'Tell us about your experience and qualifications.',
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: 'Find shifts',
                description: 'Browse available shifts that match your skills.',
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: 'Apply and work',
                description: 'Apply for shifts and start earning immediately.',
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: 'Build your career',
                description: 'Earn ratings and unlock better opportunities.',
              },
            ].map((step, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto">
                  {step.icon}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="border-y border-gray-200 bg-gray-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">Why trust Rotawell</h2>
            <p className="mt-4 text-lg text-gray-600">Built on safety, transparency, and fair practices.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Verified workers',
                description: 'All workers are DBS checked and verified before they can work.',
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: 'Fair pricing',
                description: 'Workers set their own rates. No hidden fees or surprises.',
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: 'Transparent',
                description: 'Clear policies, honest communication, and real support.',
              },
            ].map((trust, idx) => (
              <div key={idx} className="rounded-lg bg-white p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  {trust.icon}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{trust.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{trust.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="bg-primary py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Ready to get started?</h2>
          <p className="mt-4 text-lg text-green-100">Join thousands of care workers and providers already using Rotawell.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/register?role=worker">
              <Button variant="primary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                I'm a care worker
              </Button>
            </Link>
            <Link href="/register?role=provider">
              <Button size="lg" className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10">
                I'm a care provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="font-semibold text-gray-900">Company</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900">Careers</Link></li>
                <li><Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">For workers</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/register?role=worker" className="text-sm text-gray-600 hover:text-gray-900">Find shifts</Link></li>
                <li><Link href="/legal/health-safety" className="text-sm text-gray-600 hover:text-gray-900">Safety</Link></li>
                <li><Link href="/legal" className="text-sm text-gray-600 hover:text-gray-900">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">For providers</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/register?role=provider" className="text-sm text-gray-600 hover:text-gray-900">Post shifts</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/api-docs" className="text-sm text-gray-600 hover:text-gray-900">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/legal/gdpr" className="text-sm text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/legal" className="text-sm text-gray-600 hover:text-gray-900">Terms</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-gray-400">
                <a href="/legal/privacy" className="hover:text-gray-600">Privacy Policy</a>
                <a href="/legal/gdpr" className="hover:text-gray-600">GDPR & Data</a>
                <a href="/contact" className="hover:text-gray-600">Contact</a>
                <a href="/careers" className="hover:text-gray-600">Careers</a>
                <a href="/api-docs" className="hover:text-gray-600">API Docs</a>
              </div>
              <p className="text-xs text-gray-400">
                POPIA Information Officer: <a href="mailto:privacy@rotawell.co.uk" className="hover:text-gray-600">privacy@rotawell.co.uk</a>
              </p>
              <p className="text-sm text-gray-600">
                Copyright © {new Date().getFullYear()} Rotawell Ltd. All rights reserved. &middot; Connecting Care That Counts
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
