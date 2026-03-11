export const dynamic = 'force-dynamic';
import prisma from '@/lib/core/prisma';
import ChecklistForm from '../../ChecklistForm';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/server/admin-auth';

export default async function EditChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const checklist = await prisma.checklist.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!checklist) notFound();

  return <ChecklistForm checklist={checklist} />;
}
