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
import { getSiteConfigs, getWhatsAppConfig } from '@/lib/data/config';
import { getAboutPage } from '@/lib/institutional/about';

export default async function LandingPage() {
  const [services, wa, configs, about] = await Promise.all([
    getHomeServices(),
    getWhatsAppConfig(),
    getSiteConfigs(),
    getAboutPage(),
  ]);

  return (
    <div>
      <HeroSection
        waConfig={wa}
        headline={configs.heroHeadline}
        subheadline={configs.heroSubheadline}
        heroImage={about.heroImage}
        authoritySummary={{
          specializationCount: about.specializations.length,
          credentialCount: about.credentials.length,
          milestoneCount: about.milestones.length,
        }}
      />
      <ProfileTracksSection />
      <IdentitySection />
      <MethodSection />
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
      <FaqSection />
      <FinalCtaSection waConfig={wa} />
    </div>
  );
}
