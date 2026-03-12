export const dynamic = 'force-dynamic';

import { requireAdmin } from '@/lib/server/admin-auth';
import { getAboutPage } from '@/lib/data/about';
import AboutForm from './AboutForm';

function normalizeCtaMode(value: string): 'WHATSAPP' | 'EXTERNAL' {
  return value === 'EXTERNAL' ? 'EXTERNAL' : 'WHATSAPP';
}

function normalizeCredentialKind(value: string): 'CERTIFICATE' | 'SEAL' | 'SPECIALIZATION' {
  if (value === 'SEAL') return 'SEAL';
  if (value === 'SPECIALIZATION') return 'SPECIALIZATION';
  return 'CERTIFICATE';
}

export default async function AdminAboutPage() {
  await requireAdmin();
  const about = await getAboutPage();

  return (
    <AboutForm
      initialValue={{
        heroTitle: about.heroTitle,
        heroSubtitle: about.heroSubtitle ?? '',
        introTitle: about.introTitle ?? '',
        introBody: about.introBody ?? '',
        manifestoTitle: about.manifestoTitle ?? '',
        manifestoBody: about.manifestoBody ?? '',
        heroImage: about.heroImage ?? '',
        ctaMode: normalizeCtaMode(about.ctaMode),
        ctaUrl: about.ctaUrl ?? '',
        ctaLabel: about.ctaLabel ?? '',
        whatsappMessageTemplate: about.whatsappMessageTemplate ?? '',
        milestones: about.milestones.map((item) => ({
          title: item.title,
          description: item.description,
          year: item.year ?? '',
          sortOrder: item.sortOrder,
        })),
        specializations: about.specializations.map((item) => ({
          title: item.title,
          description: item.description,
          sortOrder: item.sortOrder,
        })),
        credentials: about.credentials.map((item) => ({
          title: item.title,
          issuer: item.issuer ?? '',
          year: item.year ?? '',
          imageUrl: item.imageUrl ?? '',
          kind: normalizeCredentialKind(item.kind),
          sortOrder: item.sortOrder,
        })),
      }}
    />
  );
}
