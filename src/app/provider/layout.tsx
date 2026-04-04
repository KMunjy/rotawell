'use client';

import { useState } from 'react';
import { Users, BarChart3, DollarSign, FileText, Clock, TrendingUp, Zap, Shield } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { OrbitalHeart } from '@/components/brand/orbital-heart';

const sidebarItems = [
  { label: 'Shifts', href: '/provider/shifts', icon: <Clock className="h-5 w-5" /> },
  { label: 'Find Workers', href: '/provider/workers', icon: <Users className="h-5 w-5" /> },
  { label: 'Applications', href: '/provider/applicants', icon: <FileText className="h-5 w-5" /> },
  { label: 'Manage Bookings', href: '/provider/bookings', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Demand Forecast', href: '/provider/demand', icon: <TrendingUp className="h-5 w-5" /> },
  { label: 'Benchmarking', href: '/provider/benchmarking', icon: <Zap className="h-5 w-5" /> },
  { label: 'Invoices & Billing', href: '/provider/invoices', icon: <DollarSign className="h-5 w-5" /> },
  { label: 'Analytics', href: '/provider/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Privacy & Data', href: '/settings/privacy', icon: <Shield className="h-5 w-5" /> },
];

const mobileNavItems = [
  { label: 'Shifts', href: '/provider/shifts', icon: <Clock className="h-5 w-5" /> },
  { label: 'Workers', href: '/provider/workers', icon: <Users className="h-5 w-5" /> },
  { label: 'Bookings', href: '/provider/bookings', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Analytics', href: '/provider/analytics', icon: <BarChart3 className="h-5 w-5" /> },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-cream">
      <Sidebar
        items={sidebarItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        logo={
          <>
            <OrbitalHeart />
            <div>
              <p className="text-sm font-bold text-primary">Rotawell</p>
              <p className="text-xs text-gray-500">Provider</p>
            </div>
          </>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:pb-0 pb-16">
        <Header
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          user={{
            name: 'Oakwood Care Home',
            email: 'admin@oakwood.uk',
          }}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      <MobileNav items={mobileNavItems} />
    </div>
  );
}
