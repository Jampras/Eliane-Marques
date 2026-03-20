export const revalidate = 300;

import { HeroSection } from '@/components/features/home/HeroSection';
import { IdentitySection } from '@/components/features/home/IdentitySection';
import { ProfileTracksSection } from '@/components/features/home/ProfileTracksSection';
import { MethodSection } from '@/components/features/home/MethodSection';
import { AuthoritySection } from '@/components/features/home/AuthoritySection';
import { ServicesSection } from '@/components/features/home/ServicesSection';
import { PricingSection } from '@/components/features/home/PricingSection';
import { FaqSection } from '@/components/features/home/FaqSection';
import { FinalCtaSection } from '@/components/features/home/FinalCtaSection';
import { getHomeServices } from '@/lib/data/home';
import { getWhatsAppConfig } from '@/lib/data/config';
import { getHomePage } from '@/lib/institutional/home';
import { getAboutPage } from '@/lib/institutional/about';

export default async function LandingPage() {
  const [services, wa, about, home] = await Promise.all([
    getHomeServices(),
    getWhatsAppConfig(),
    getAboutPage(),
    getHomePage(),
  ]);

  return (
    <div>
        <HeroSection
        waConfig={wa}
        eyebrow={home.heroEyebrow ?? undefined}
        headline={home.heroTitle}
        subheadline={home.heroSubtitle ?? undefined}
        primaryCtaLabel={home.heroPrimaryCtaLabel ?? undefined}
        secondaryCtaLabel={home.heroSecondaryCtaLabel ?? undefined}
        trustText={home.heroTrustText ?? undefined}
        heroImage={(('heroPanelImage' in home ? home.heroPanelImage : null) ?? undefined)}
        authoritySummary={{
          specializationCount: about.specializations.length,
          credentialCount: about.credentials.length,
          milestoneCount: about.milestones.length,
        }}
      />
      <ProfileTracksSection
        title={home.audienceTitle}
        subtitle={home.audienceSubtitle}
        items={home.audienceItems.map((item) => ({
          title: item.title,
          description: item.description,
          icon: item.icon,
          imageUrl: 'imageUrl' in item ? item.imageUrl : null,
        }))}
      />
      <IdentitySection
        title={home.valueTitle}
        subtitle={home.valueSubtitle}
        ctaLabel={home.valueCtaLabel}
        items={home.valueItems.map((item) => ({
          badge: item.badge,
          title: item.title,
          bullets: Array.isArray(item.bullets) ? item.bullets.map(String) : [],
          tone: item.tone,
          imageUrl: 'imageUrl' in item ? item.imageUrl : null,
        }))}
      />
      <MethodSection
        title={home.methodTitle}
        subtitle={home.methodSubtitle}
        ctaLabel={home.methodCtaLabel}
        steps={home.methodSteps.map((item) => ({
          title: item.title,
          description: item.description,
          imageUrl: 'imageUrl' in item ? item.imageUrl : null,
        }))}
      />
      <AuthoritySection
        specializationCount={about.specializations.length}
        credentialCount={about.credentials.length}
        milestoneCount={about.milestones.length}
        credentials={about.credentials.slice(0, 3).map((item) => ({
          title: item.title,
          issuer: item.issuer,
        }))}
        specializations={about.specializations.slice(0, 3).map((item) => item.title)}
      />
      <PricingSection services={services} waConfig={wa} />
      <ServicesSection services={services} />
      <FaqSection
        title={home.faqTitle}
        subtitle={home.faqSubtitle}
        items={home.faqItems.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))}
      />
      <FinalCtaSection
        waConfig={wa}
        title={home.finalCtaTitle}
        subtitle={home.finalCtaSubtitle}
        scarcityText={home.finalCtaScarcityText}
        ctaLabel={home.finalCtaLabel}
        whatsappMessage={home.finalWhatsappMessage}
      />
    </div>
  );
}
