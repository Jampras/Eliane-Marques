export const dynamic = 'force-dynamic';
import ChecklistForm from '../ChecklistForm';
import { requireAdmin } from '@/lib/server/admin-auth';

export default async function NewChecklistPage() {
  await requireAdmin();
  return <ChecklistForm />;
}
