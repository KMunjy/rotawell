import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';

export function PublicFooter() {
  return (
    <footer className="border-t border-gray-200/60 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <OrbitalHeart />
              <span className="text-lg font-bold tracking-tight text-primary">Rotawell</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
              Connecting dedicated care workers with UK providers. Fairer staffing, faster fills, better care.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/about" className="text-sm text-gray-500 transition-colors hover:text-gray-900">About</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Careers</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>

          {/* Workers */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Workers</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/register?role=worker" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Find shifts</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Pricing</Link></li>
              <li><Link href="/legal/health-safety" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Safety</Link></li>
              <li><Link href="/legal" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Support</Link></li>
            </ul>
          </div>

          {/* Providers */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Providers</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/register?role=provider" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Post shifts</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Plans</Link></li>
              <li><Link href="/api-docs" className="text-sm text-gray-500 transition-colors hover:text-gray-900">API</Link></li>
              <li><Link href="/directory" className="text-sm text-gray-500 transition-colors hover:text-gray-900">Directory</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200/60 pt-8 sm:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Rotawell Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gray-400">
            <Link href="/legal/privacy" className="transition-colors hover:text-gray-600">Privacy</Link>
            <Link href="/legal/gdpr" className="transition-colors hover:text-gray-600">Terms</Link>
            <Link href="/contact" className="transition-colors hover:text-gray-600">Cookies</Link>
          </div>
        </div>

        <p className="mt-4 text-center text-2xs text-gray-400 sm:text-left">
          POPIA Information Officer:{' '}
          <a href="mailto:privacy@rotawell.co.uk" className="underline transition-colors hover:text-gray-600">
            privacy@rotawell.co.uk
          </a>
        </p>
      </div>
    </footer>
  );
}
