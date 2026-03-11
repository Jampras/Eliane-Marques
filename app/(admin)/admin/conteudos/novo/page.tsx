export const dynamic = 'force-dynamic';
import ContentForm from '../ContentForm';
import { requireAdmin } from '@/lib/server/admin-auth';

export default async function NewPostPage() {
  await requireAdmin();
  return <ContentForm />;
}
