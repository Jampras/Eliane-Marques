export const revalidate = 300;

import { HeroSection } from '@/components/features/home/HeroSection';
import { IdentitySection } from '@/components/features/home/IdentitySection';
import { ProfileTracksSection } from '@/components/features/home/ProfileTracksSection';
import { MethodSection } from '@/components/features/home/MethodSection';
import { ServicesSection } from '@/components/features/home/ServicesSection';
import { PricingSection } from '@/components/features/home/PricingSection';
import { FaqSection } from '@/components/features/home/FaqSection';
import { FinalCtaSection } from '@/components/features/home/FinalCtaSection';
import { getHomeServices } from '@/lib/data/home';
import { getSiteConfigs, getWhatsAppConfig } from '@/lib/data/config';

export default async function LandingPage() {
  const [services, wa, configs] = await Promise.all([
    getHomeServices(),
    getWhatsAppConfig(),
    getSiteConfigs(),
  ]);

  return (
    <div>
      <HeroSection
        waConfig={wa}
        headline={configs.heroHeadline}
        subheadline={configs.heroSubheadline}
      />
      <IdentitySection />
      <ProfileTracksSection />
      <MethodSection />
      <ServicesSection services={services} />
      <PricingSection services={services} waConfig={wa} />
      <FaqSection />
      <FinalCtaSection waConfig={wa} />
    </div>
  );
}
