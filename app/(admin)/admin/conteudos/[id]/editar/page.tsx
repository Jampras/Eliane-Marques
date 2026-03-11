export const dynamic = 'force-dynamic';
import prisma from '@/lib/core/prisma';
import ContentForm from '../../ContentForm';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/server/admin-auth';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return <ContentForm post={post} />;
}
