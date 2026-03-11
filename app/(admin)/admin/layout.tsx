import React from 'react';
import AdminLayoutWrapper from '@/components/features/admin/AdminLayoutWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
