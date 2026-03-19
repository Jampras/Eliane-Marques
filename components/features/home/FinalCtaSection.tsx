import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { WhatsAppButton } from '@/components/shared/whatsapp/WhatsAppButton';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

interface FinalCtaSectionProps {
  waConfig: { number: string; defaultMessage: string };
  title?: string | null;
  subtitle?: string | null;
  scarcityText?: string | null;
  ctaLabel?: string | null;
  whatsappMessage?: string | null;
}

export function FinalCtaSection({
  waConfig,
  title,
  subtitle,
  scarcityText,
  ctaLabel,
  whatsappMessage,
}: FinalCtaSectionProps) {
  return (
    <Section id="cta-final" variant="black" className="relative">
      <Container className="text-center">
        <div className="mx-auto max-w-3xl border border-white/8 bg-[rgba(247,240,230,0.03)] px-6 py-10 shadow-[0_16px_42px_rgba(0,0,0,0.12)] sm:px-8 sm:py-12">
          <div className="fade-up inline-flex" style={{ '--delay': '0s' } as CSSProperties}>
            <div className="h-px w-full bg-[linear-gradient(to_right,transparent,rgba(200,146,58,1),transparent)]" />
          </div>
          <Heading
            className="fade-up mt-7 mx-auto max-w-[13ch] text-[2rem] !text-[color:var(--aveia)] lg:text-[2.7rem]"
            style={{ '--delay': '0.1s' } as CSSProperties}
          >
            {title?.trim() ||
              'Se sua imagem ainda nao sustenta seu valor, este e o momento de corrigir isso.'}
          </Heading>
          <p
            className="fade-up mx-auto mt-4 max-w-[34ch] text-[13px] leading-[1.8] text-white/68"
            style={{ '--delay': '0.16s' } as CSSProperties}
          >
            {subtitle?.trim() || 'Uma conversa curta ja define o formato mais adequado para seu momento.'}
          </p>
          <p
            className="fade-up mt-4 font-ornament text-[1rem] italic text-[color:var(--taupe)]"
            style={{ '--delay': '0.2s' } as CSSProperties}
          >
            {scarcityText?.trim() || 'Poucos acompanhamentos por ciclo.'}
          </p>
          <div className="fade-up mt-8" style={{ '--delay': '0.3s' } as CSSProperties}>
            <WhatsAppButton
              number={waConfig.number}
              template={
                whatsappMessage?.trim() ||
                'Ola Eliane! Quero entender o formato mais adequado para alinhar minha imagem, minha presenca e a forma como meu valor esta sendo percebido.'
              }
              label={ctaLabel?.trim() || 'Quero conversar sobre meu caso'}
              className="!border-[color:var(--argila)] !bg-[color:var(--argila)] !text-[color:var(--aveia)] hover:!bg-[color:var(--cacau)]"
              size="lg"
              analyticsSource={ANALYTICS_SOURCES.HOME_PRICING}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
