'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Calendar, DollarSign, FileCheck, GraduationCap, User, Heart, Gift, Bell, Zap, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { OrbitalHeart } from '@/components/brand/orbital-heart';

const sidebarItems = [
  { label: 'Available Shifts', href: '/worker/shifts', icon: <Calendar className="h-5 w-5" /> },
  { label: 'My Bookings', href: '/worker/bookings', icon: <Briefcase className="h-5 w-5" /> },
  { label: 'Saved Searches', href: '/worker/saved-searches', icon: <Heart className="h-5 w-5" /> },
  { label: 'Earnings', href: '/worker/earnings', icon: <DollarSign className="h-5 w-5" /> },
  { label: 'Instant Pay', href: '/worker/instant-pay', icon: <Zap className="h-5 w-5" /> },
  { label: 'Compliance', href: '/worker/compliance', icon: <FileCheck className="h-5 w-5" /> },
  { label: 'Training', href: '/worker/training', icon: <GraduationCap className="h-5 w-5" /> },
  { label: 'Profile', href: '/worker/profile', icon: <User className="h-5 w-5" /> },
  { label: 'Referrals', href: '/referrals', icon: <Gift className="h-5 w-5" /> },
  { label: 'Notifications', href: '/settings/notifications', icon: <Bell className="h-5 w-5" /> },
  { label: 'Privacy & Data', href: '/settings/privacy', icon: <Shield className="h-5 w-5" /> },
];

const mobileNavItems = [
  { label: 'Shifts', href: '/worker/shifts', icon: <Calendar className="h-5 w-5" /> },
  { label: 'Bookings', href: '/worker/bookings', icon: <Briefcase className="h-5 w-5" /> },
  { label: 'Earnings', href: '/worker/earnings', icon: <DollarSign className="h-5 w-5" /> },
  { label: 'Profile', href: '/worker/profile', icon: <User className="h-5 w-5" /> },
];

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('nursly_profiles')
          .select('full_name')
          .eq('id', authUser.id)
          .single();
        setUser({
          name: profile?.full_name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
        });
      }
    };
    fetchUser();
  }, []);

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
              <p className="text-xs text-gray-500">Worker</p>
            </div>
          </>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:pb-0 pb-16">
        <Header
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          user={user || undefined}
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
