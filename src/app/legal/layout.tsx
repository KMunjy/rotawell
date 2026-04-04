import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = [
    { name: 'Employment Law', href: '/legal/employment', description: 'Worker rights and protections' },
    { name: 'CQC Regulations', href: '/legal/cqc', description: 'Care quality standards' },
    { name: 'Safeguarding', href: '/legal/safeguarding', description: 'Duty of care and protection' },
    { name: 'GDPR & Data Protection', href: '/legal/gdpr', description: 'Data handling and privacy' },
    { name: 'Privacy Policy', href: '/legal/privacy', description: 'How we use your data (GDPR & POPIA)' },
    { name: 'Right to Work', href: '/legal/right-to-work', description: 'Immigration and employment checks' },
    { name: 'NMC Standards', href: '/legal/nmc', description: 'Nursing professional standards' },
    { name: 'Health & Safety', href: '/legal/health-safety', description: 'Workplace safety requirements' },
    { name: 'Whistleblowing', href: '/legal/whistleblowing', description: 'Speaking up safely' },
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Legal Information Hub</h1>
          <p className="mt-2 text-gray-600">UK care sector legislation and compliance guidance</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-2">
              <h2 className="text-sm font-semibold text-gray-900 px-4">Categories</h2>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="group flex items-center justify-between px-4 py-3 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                      {category.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Category Links */}
          <div className="lg:hidden mb-8">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-white transition-all"
                >
                  <p className="font-semibold text-gray-900 text-sm">{category.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
