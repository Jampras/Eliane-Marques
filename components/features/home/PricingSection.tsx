import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { WhatsAppLink } from '@/components/shared/whatsapp/WhatsAppLink';
import { buildPricingInquiryWhatsAppUrl } from '@/lib/contact/whatsapp-intents';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';
import type { Service } from '@/lib/core/types';
import {
  extractServicePrice,
  inferServiceLabel,
  parseServicePriceValue,
} from '@/lib/core/home-offers';
import { getPricingFeaturedIndex, isPricingFeatured } from '@/lib/core/editorial-highlights';

interface PricingSectionProps {
  services: Service[];
  waConfig?: { number: string; defaultMessage: string };
}

function inferPricingRole(services: Service[], service: Service, index: number) {
  const featuredIndex = getPricingFeaturedIndex(services);
  const pricedServices = services
    .map((item, itemIndex) => ({
      index: itemIndex,
      price: parseServicePriceValue(item.price),
    }))
    .filter((item): item is { index: number; price: number } => item.price !== null)
    .sort((a, b) => a.price - b.price);
  const lowestIndex = pricedServices[0]?.index;
  const highestIndex = pricedServices[pricedServices.length - 1]?.index;

  if (index === featuredIndex) {
    return {
      label: 'Melhor ponto de decisao',
      note: 'Indicado para quem quer orientacao com mais impacto no curto prazo.',
    };
  }

  if (index === lowestIndex) {
    return {
      label: 'Porta de entrada',
      note: 'Opcao para iniciar o ajuste com menor investimento e boa objetividade.',
    };
  }

  if (index === highestIndex) {
    return {
      label: 'Maior personalizacao',
      note: 'Para quem precisa de proximidade maior e refinamento mais individualizado.',
    };
  }

  return {
    label: 'Ajuste prioritario',
    note: 'Para quem quer um reposicionamento mais direto sem ir para o formato mais extenso.',
  };
}

export function PricingSection({ services, waConfig }: PricingSectionProps) {
  return (
    <Section
      id="investimentos"
      className="bg-[radial-gradient(ellipse_at_50%_100%,var(--theme-section-surface-glow),transparent_70%),var(--aveia)]"
    >
      <Container>
        <div className="mb-8 grid gap-4 md:mb-10 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-end">
          <div className="fade-up" style={{ '--delay': '0s' } as CSSProperties}>
            <div className="atelier-overline">Investimentos</div>
            <Heading className="mt-4 max-w-[13ch] text-[2rem] lg:text-[2.7rem]">
              Escolha o nivel de profundidade que voce precisa agora
            </Heading>
          </div>
          <Text
            className="fade-up max-w-none border-l border-[color:var(--linho)]/80 pl-4 text-[12px] leading-[1.85] text-[color:var(--taupe)] xl:max-w-[240px]"
            style={{ '--delay': '0.1s' } as CSSProperties}
          >
            O formato certo nao e o mais longo. E o que resolve seu momento com mais precisao.
          </Text>
          <div
            className="fade-up border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] px-5 py-4 shadow-[var(--theme-card-shadow)]"
            style={{ '--delay': '0.14s' } as CSSProperties}
          >
            <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
              Agenda limitada
            </p>
            <p className="mt-3 text-[12px] leading-[1.8] text-[color:var(--taupe)]">
              Atendimentos individuais nao ficam abertos o tempo todo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const featured = isPricingFeatured(services, index);
            const role = inferPricingRole(services, service, index);
            const pricing = extractServicePrice(service.price);
            const waUrl = buildPricingInquiryWhatsAppUrl({
              number: waConfig?.number,
              productTitle: service.title,
            });

            return (
              <article
                key={service.slug ?? service.title}
                className={`fade-up-card relative flex h-full flex-col border px-6 py-7 shadow-[var(--theme-card-shadow)] transition-transform duration-300 sm:px-6 sm:py-7 lg:px-7 lg:py-8 ${
                  featured
                    ? 'border-[color:var(--theme-footer-border)] bg-[color:var(--theme-footer-bg)] text-[color:var(--theme-footer-strong)] xl:mt-2 xl:-translate-y-1'
                    : 'border-[color:var(--linho)] bg-[color:var(--manteiga)] lg:hover:-translate-y-1'
                }`}
                style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
              >
                {featured && (
                  <div className="mb-4 inline-flex self-start bg-[color:var(--mel)] px-[18px] py-[5px] text-[9px] uppercase tracking-[0.18em] text-[color:var(--espresso)] md:absolute md:left-1/2 md:top-0 md:mb-0 md:-translate-x-1/2 md:-translate-y-1/2">
                    {'\u2726'} Formato recomendado {'\u2726'}
                  </div>
                )}

                <div
                  className={`border-b pb-4 text-[9px] uppercase tracking-[0.18em] ${
                    featured
                      ? 'border-[color:var(--theme-footer-border)] text-[color:var(--theme-footer-muted)]'
                      : 'border-[color:var(--linho)] text-[color:var(--taupe)]'
                  }`}
                >
                  {inferServiceLabel(service)}
                </div>

                <Heading
                  as="h3"
                  className={`mt-6 max-w-[15ch] text-[1.3rem] leading-[1.08] [text-wrap:balance] ${
                    featured ? 'text-[color:var(--aveia)]' : 'text-[color:var(--espresso)]'
                  }`}
                >
                  {service.title}
                </Heading>

                <p
                  className={`mt-3 text-[10px] uppercase tracking-[0.16em] ${
                    featured ? 'text-[color:var(--mel)]' : 'text-[color:var(--argila)]'
                  }`}
                >
                  {role.label}
                </p>
                <p className="mt-3 font-ornament text-[11px] italic text-[color:var(--taupe)]">
                  {role.note}
                </p>
                <Text
                  className={`mt-4 max-w-[28ch] text-[12px] ${
                    featured ? 'text-[color:var(--theme-footer-text)]' : 'text-[color:var(--taupe)]'
                  }`}
                >
                  {service.desc}
                </Text>

                <div className="mt-3 flex flex-wrap gap-2">
                  {service.featured && <Badge variant="outline">Destaque</Badge>}
                  {service.bestSeller && <Badge variant="outline">Mais vendido</Badge>}
                </div>

                <div className="mt-8">
                  {pricing.prefix && (
                    <p className="mb-2 text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                      {pricing.prefix}
                    </p>
                  )}
                  <div
                    className={`font-ornament text-[3rem] leading-none lg:text-[3.2rem] ${
                      featured ? 'text-[color:var(--mel)]' : 'text-[color:var(--cacau)]'
                    }`}
                  >
                    <sup className="mr-1 text-[0.35em] opacity-70">R$</sup>
                    {pricing.value.replace(/^R\$\s*/, '')}
                  </div>
                </div>

                <div className="mt-8 border-t border-[color:var(--linho)]/50 pt-6">
                  <WhatsAppLink
                    href={waUrl}
                    analyticsSource={ANALYTICS_SOURCES.HOME_PRICING}
                    productTitle={service.title}
                    className="inline-flex w-full sm:w-auto"
                  >
                    <span
                      className={`inline-flex w-full justify-center rounded-[1px] border px-5 py-3 text-[9px] uppercase tracking-[0.18em] transition-colors sm:w-auto ${
                        featured
                          ? 'border-[color:var(--mel)] bg-[color:var(--theme-button-ghost-hover)] text-[color:var(--mel)] hover:bg-[color:var(--theme-button-outline-hover-bg)]'
                          : 'border-[color:var(--argila)] bg-[color:var(--creme-rosa)] text-[color:var(--espresso)] hover:border-[color:var(--cacau)] hover:bg-[color:var(--manteiga)]'
                      }`}
                    >
                      Falar sobre este formato
                    </span>
                  </WhatsAppLink>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
