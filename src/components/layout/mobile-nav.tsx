'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface MobileNavProps {
  items: MobileNavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white lg:hidden">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors duration-200',
                isActive
                  ? 'border-t-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {item.icon}
              <span className="hidden xs:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
