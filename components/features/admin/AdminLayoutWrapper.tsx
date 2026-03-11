'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/features/admin/AdminSidebar';
import { AdminMobileNav } from '@/components/features/admin/AdminMobileNav';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="bg-[linear-gradient(180deg,rgba(236,227,217,0.96),rgba(228,216,205,0.96))] selection:bg-primary flex min-h-screen text-text-1 selection:text-white">
      {!isLoginPage && (
        <>
          <AdminSidebar />
          <AdminMobileNav />
        </>
      )}
      <main className={`w-full flex-grow overflow-y-auto ${!isLoginPage ? 'pt-14 md:pt-16 lg:pt-0' : ''}`}>
        {children}
      </main>
    </div>
  );
}