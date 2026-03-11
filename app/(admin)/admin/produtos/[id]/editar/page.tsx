export const dynamic = 'force-dynamic';
import prisma from '@/lib/core/prisma';
import ProductForm from '../../ProductForm';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/server/admin-auth';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return <ProductForm product={product} />;
}
