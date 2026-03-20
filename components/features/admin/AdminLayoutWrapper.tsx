'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/features/admin/AdminSidebar';
import { AdminMobileNav } from '@/components/features/admin/AdminMobileNav';

type AdminIdentity = {
  name: string;
  email: string | null;
} | null;

export default function AdminLayoutWrapper({
  children,
  adminIdentity,
}: {
  children: React.ReactNode;
  adminIdentity: AdminIdentity;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="bg-[image:var(--theme-admin-login-bg)] selection:bg-primary flex min-h-screen text-text-1 selection:text-white">
      {!isLoginPage && (
        <>
          <AdminSidebar adminIdentity={adminIdentity} />
          <AdminMobileNav adminIdentity={adminIdentity} />
        </>
      )}
      <main className={`w-full flex-grow overflow-y-auto ${!isLoginPage ? 'pt-14 md:pt-16 lg:pt-0' : ''}`}>
        {children}
      </main>
    </div>
  );
}
