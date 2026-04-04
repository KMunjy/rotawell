'use client';

import { useState } from 'react';
import { Users, AlertTriangle, FileText, Settings, BarChart3, Shield, Zap, TrendingDown, Banknote } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { OrbitalHeart } from '@/components/brand/orbital-heart';

const sidebarItems = [
  { label: 'User Management', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { label: 'Escalations', href: '/admin/escalations', icon: <AlertTriangle className="h-5 w-5" /> },
  { label: 'Compliance', href: '/admin/compliance', icon: <FileText className="h-5 w-5" /> },
  { label: 'Disputes', href: '/admin/disputes', icon: <Shield className="h-5 w-5" /> },
  { label: 'Moderation', href: '/admin/moderation', icon: <Zap className="h-5 w-5" /> },
  { label: 'Instant Pay', href: '/admin/instant-pay', icon: <Banknote className="h-5 w-5" /> },
  { label: 'Skills Gap', href: '/admin/skills-gap', icon: <TrendingDown className="h-5 w-5" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
];

const mobileNavItems = [
  { label: 'Users', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { label: 'Escalations', href: '/admin/escalations', icon: <AlertTriangle className="h-5 w-5" /> },
  { label: 'Disputes', href: '/admin/disputes', icon: <Shield className="h-5 w-5" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
];

export default function AdminLayout({
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
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:pb-0 pb-16">
        <Header
          title="Admin Dashboard"
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          user={{
            name: 'Administrator',
            email: 'admin@rotawell.uk',
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
