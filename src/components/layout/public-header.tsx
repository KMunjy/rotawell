'use client';

import Link from 'next/link';
import { OrbitalHeart } from '@/components/brand/orbital-heart';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <OrbitalHeart />
          <span className="text-lg font-bold tracking-tight text-primary">Rotawell</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/about" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            About
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/careers" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            Careers
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">Join now</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
