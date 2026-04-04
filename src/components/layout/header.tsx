'use client';

import { Menu, X, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  showNav?: boolean;
}

export function Header({ title, onMenuClick, user, showNav }: HeaderProps) {
  const { toast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    router.push('/worker/profile');
  };

  const handleSettingsClick = () => {
    setDropdownOpen(false);
    toast('Settings page coming soon', 'info');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
        </div>

        <div className="flex items-center gap-6">
          {showNav && (
            <nav className="hidden gap-6 md:flex">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/worker" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Worker
              </Link>
              <Link href="/provider" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Provider
              </Link>
              <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Admin
              </Link>
              <Link href="/directory" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Directory
              </Link>
              <Link href="/legal" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Legal
              </Link>
            </nav>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                )}
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <button onClick={handleProfileClick} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button onClick={handleSettingsClick} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
