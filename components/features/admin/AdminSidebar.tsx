'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { logoutAction } from '@/lib/actions/admin-auth';
import { adminMenuItems } from './adminMenuItems';

interface AdminSidebarProps {
  currentPath?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPath: propPath }) => {
  const pathname = usePathname();
  const currentPath = propPath || pathname;

  return (
    <aside className="bg-surface sticky top-0 hidden min-h-screen w-64 flex-col border-r border-border lg:flex">
      <div className="border-b border-border p-10 text-center lg:text-left">
        <h2 className="text-primary font-display text-2xl leading-none font-bold tracking-tighter uppercase italic">
          Eliane
        </h2>
        <h2 className="font-display text-2xl leading-none font-bold tracking-tighter text-text-1 uppercase italic">
          Marques
        </h2>
        <p className="text-text-secondary mt-3 text-[9px] tracking-[0.4em] uppercase opacity-50">
          Admin Panel
        </p>
      </div>

      <nav className="flex-grow space-y-1 py-6">
        {adminMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group relative flex items-center gap-3 px-8 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300',
              currentPath === item.href ||
                (item.href !== '/admin' && currentPath?.startsWith(item.href))
                ? 'text-primary'
                : 'text-text-2 hover:text-text-1'
            )}
          >
            {(currentPath === item.href ||
              (item.href !== '/admin' && currentPath?.startsWith(item.href))) && (
              <span className="bg-primary absolute top-0 bottom-0 left-0 w-1 shadow-[0_0_15px_rgba(0,0,0,0.15)]" />
            )}
            <span className="material-symbols-outlined shrink-0 !text-[20px] opacity-70 transition-opacity group-hover:opacity-100">
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-6">
        <button
          onClick={() => logoutAction()}
          className="flex w-full items-center justify-center gap-3 rounded-sm border border-red-500/10 px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-red-500/70 uppercase transition-all hover:bg-red-500/5 hover:text-red-500"
        >
          <span className="material-symbols-outlined !text-[18px]">logout</span>
          Sair
        </button>
      </div>
    </aside>
  );
};
