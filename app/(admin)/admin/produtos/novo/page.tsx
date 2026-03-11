export const dynamic = 'force-dynamic';
import ProductForm from '../ProductForm';
import { requireAdmin } from '@/lib/server/admin-auth';

export default async function NewProductPage() {
  await requireAdmin();
  return <ProductForm />;
}
