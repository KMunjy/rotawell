'use client';

import Link from 'next/link';
import { Building2, Users, ArrowRight } from 'lucide-react';

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Rotawell Directory</h1>
          <p className="mt-2 text-gray-600">Find verified care homes, nursing professionals, and support workers across the UK</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {/* Care Homes Card */}
          <Link href="/directory/care-homes" className="group">
            <div className="rounded-lg border border-gray-200 bg-white p-8 hover:border-primary hover:shadow-lg transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Care Homes</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Browse and search verified care homes across the UK. Filter by location, CQC rating, specialties, and capacity.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                View Directory
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </Link>

          {/* Professionals Card */}
          <Link href="/directory/professionals" className="group">
            <div className="rounded-lg border border-gray-200 bg-white p-8 hover:border-primary hover:shadow-lg transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Professionals</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Search verified nurses, care workers, and healthcare professionals. Filter by role, specialties, location, and availability.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                View Directory
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use Rotawell Directory?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Data</h3>
              <p className="text-sm text-gray-600">
                All professionals are DBS-checked and verified. Care homes include current CQC ratings and compliance information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Search</h3>
              <p className="text-sm text-gray-600">
                Filter by location, specialties, ratings, availability, and more to find the right match for your needs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-sm text-gray-600">
                Information is updated regularly. Professional ratings and reviews reflect actual experience on Rotawell.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
