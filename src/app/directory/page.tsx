'use client';

import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Building2, Users, ArrowRight } from 'lucide-react';

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <PublicHeader />

      <main>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Rotawell Directory</h1>
            <p className="mt-3 text-lg text-gray-600">Find verified care homes, nursing professionals, and support workers across the UK</p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 grid gap-8 md:grid-cols-2">
              {/* Care Homes Card */}
              <Link href="/directory/care-homes" className="group">
                <div className="rounded-2xl border border-gray-200/80 bg-white p-8 transition-all hover:border-primary hover:shadow-md">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-xl bg-primary-50 p-3 transition-colors group-hover:bg-primary-100">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Care Homes</h2>
                  </div>
                  <p className="text-gray-600">
                    Browse and search verified care homes across the UK. Filter by location, CQC rating, specialties, and capacity.
                  </p>
                  <div className="mt-4 flex items-center gap-2 font-medium text-primary transition-all group-hover:gap-3">
                    View Directory
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>

              {/* Professionals Card */}
              <Link href="/directory/professionals" className="group">
                <div className="rounded-2xl border border-gray-200/80 bg-white p-8 transition-all hover:border-primary hover:shadow-md">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-xl bg-primary-50 p-3 transition-colors group-hover:bg-primary-100">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Professionals</h2>
                  </div>
                  <p className="text-gray-600">
                    Search verified nurses, care workers, and healthcare professionals. Filter by role, specialties, location, and availability.
                  </p>
                  <div className="mt-4 flex items-center gap-2 font-medium text-primary transition-all group-hover:gap-3">
                    View Directory
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Info Section */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-8">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Why Use Rotawell Directory?</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Verified Data</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    All professionals are DBS-checked and verified. Care homes include current CQC ratings and compliance information.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Advanced Search</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Filter by location, specialties, ratings, availability, and more to find the right match for your needs.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Real-Time Updates</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Information is updated regularly. Professional ratings and reviews reflect actual experience on Rotawell.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
