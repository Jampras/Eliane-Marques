import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
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
    <Section id="cta-final" variant="black" className="relative !py-8 sm:!py-10 lg:!py-12">
      <Container>
        <div className="mx-auto max-w-4xl border border-[color:var(--theme-footer-border)] bg-[color:var(--theme-overlay-surface)] px-6 py-8 shadow-[var(--theme-dark-shadow)] sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:items-center">
            <div>
              <div className="fade-up" style={{ '--delay': '0s' } as CSSProperties}>
                <Badge className="border-[color:var(--theme-footer-border)] bg-[color:var(--theme-overlay-surface)] !text-[color:var(--theme-footer-accent)]">
                  Proximo passo
                </Badge>
              </div>
              <Heading
                className="fade-up mt-5 max-w-[12ch] text-[1.8rem] !text-[color:var(--theme-footer-strong)] lg:text-[2.35rem]"
                style={{ '--delay': '0.1s' } as CSSProperties}
              >
                {title?.trim() ||
                  'Se sua imagem ainda nao sustenta seu valor, este e o momento de corrigir isso.'}
              </Heading>
              <p
                className="fade-up mt-3 max-w-[40ch] text-[12px] leading-[1.85] text-[color:var(--theme-footer-text)] lg:text-[13px]"
                style={{ '--delay': '0.16s' } as CSSProperties}
              >
                {subtitle?.trim() ||
                  'Uma conversa curta ja define o formato mais adequado para seu momento.'}
              </p>
              <p
                className="fade-up mt-4 font-ornament text-[0.98rem] italic text-[color:var(--theme-footer-muted)]"
                style={{ '--delay': '0.2s' } as CSSProperties}
              >
                {scarcityText?.trim() || 'Poucos acompanhamentos por ciclo.'}
              </p>
            </div>

            <div
              className="fade-up border border-[color:var(--theme-footer-border)] bg-[color:var(--theme-overlay-surface)] px-5 py-5"
              style={{ '--delay': '0.24s' } as CSSProperties}
            >
              <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--theme-footer-accent)]">
                Conversa inicial
              </p>
              <div className="mt-4 space-y-3 text-[12px] leading-[1.75] text-[color:var(--theme-footer-text)]">
                <p>Voce explica seu momento.</p>
                <p>Eu indico o formato mais coerente.</p>
                <p>Sem excesso de etapa antes da decisao.</p>
              </div>
              <div className="mt-6">
                <WhatsAppButton
                  number={waConfig.number}
                  template={
                    whatsappMessage?.trim() ||
                    'Ola Eliane! Quero entender o formato mais adequado para alinhar minha imagem, minha presenca e a forma como meu valor esta sendo percebido.'
                  }
                  label={ctaLabel?.trim() || 'Quero conversar sobre meu caso'}
                  className="!flex !w-full !justify-center !border-[color:var(--argila)] !bg-[color:var(--argila)] !text-[color:var(--aveia)] hover:!bg-[color:var(--cacau)]"
                  size="lg"
                  analyticsSource={ANALYTICS_SOURCES.HOME_PRICING}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
