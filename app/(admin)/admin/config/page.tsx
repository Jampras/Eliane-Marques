export const dynamic = 'force-dynamic';
import { getSiteConfigs } from '@/lib/data/config';
import { requireAdmin } from '@/lib/server/admin-auth';
import ConfigForm from './ConfigForm';

export default async function AdminConfigPage() {
  await requireAdmin();
  const configs = await getSiteConfigs();
  return <ConfigForm initialConfigs={configs} />;
}
