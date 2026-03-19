export const dynamic = 'force-dynamic';

import { requireAdmin } from '@/lib/server/admin-auth';
import { getHomePage } from '@/lib/institutional/home';
import HomeForm from './HomeForm';

export default async function AdminHomePage() {
  await requireAdmin();
  const home = await getHomePage();

  return (
    <HomeForm
      initialValue={{
        heroEyebrow: home.heroEyebrow ?? '',
        heroPanelImage: ('heroPanelImage' in home ? home.heroPanelImage : null) ?? '',
        heroTitle: home.heroTitle,
        heroSubtitle: home.heroSubtitle ?? '',
        heroPrimaryCtaLabel: home.heroPrimaryCtaLabel ?? '',
        heroSecondaryCtaLabel: home.heroSecondaryCtaLabel ?? '',
        heroTrustText: home.heroTrustText ?? '',
        audienceTitle: home.audienceTitle ?? '',
        audienceSubtitle: home.audienceSubtitle ?? '',
        valueTitle: home.valueTitle ?? '',
        valueSubtitle: home.valueSubtitle ?? '',
        valueCtaLabel: home.valueCtaLabel ?? '',
        methodTitle: home.methodTitle ?? '',
        methodSubtitle: home.methodSubtitle ?? '',
        methodCtaLabel: home.methodCtaLabel ?? '',
        faqTitle: home.faqTitle ?? '',
        faqSubtitle: home.faqSubtitle ?? '',
        finalCtaTitle: home.finalCtaTitle ?? '',
        finalCtaSubtitle: home.finalCtaSubtitle ?? '',
        finalCtaScarcityText: home.finalCtaScarcityText ?? '',
        finalCtaLabel: home.finalCtaLabel ?? '',
        finalWhatsappMessage: home.finalWhatsappMessage ?? '',
        audienceItems: home.audienceItems.map((item) => ({
          title: item.title,
          description: item.description,
          icon: item.icon ?? '',
          imageUrl: ('imageUrl' in item ? item.imageUrl : null) ?? '',
          sortOrder: item.sortOrder,
        })),
        valueItems: home.valueItems.map((item) => ({
          badge: item.badge ?? '',
          title: item.title,
          bullets: Array.isArray(item.bullets) ? item.bullets.map(String) : [],
          tone: item.tone === 'POSITIVE' ? 'POSITIVE' : 'NEGATIVE',
          imageUrl: ('imageUrl' in item ? item.imageUrl : null) ?? '',
          sortOrder: item.sortOrder,
        })),
        methodSteps: home.methodSteps.map((item) => ({
          title: item.title,
          description: item.description,
          imageUrl: ('imageUrl' in item ? item.imageUrl : null) ?? '',
          sortOrder: item.sortOrder,
        })),
        faqItems: home.faqItems.map((item) => ({
          question: item.question,
          answer: item.answer,
          sortOrder: item.sortOrder,
        })),
      }}
    />
  );
}
