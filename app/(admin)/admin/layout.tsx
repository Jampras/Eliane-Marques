import React from 'react';
import AdminLayoutWrapper from '@/components/features/admin/AdminLayoutWrapper';
import { getSession } from '@/lib/core/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const adminIdentity =
    session?.admin && session.role === 'admin'
      ? {
          name:
            (typeof session.name === 'string' && session.name.trim()) ||
            (typeof session.email === 'string' && session.email.trim()) ||
            'Administrador',
          email: typeof session.email === 'string' ? session.email : null,
        }
      : null;

  return <AdminLayoutWrapper adminIdentity={adminIdentity}>{children}</AdminLayoutWrapper>;
}
