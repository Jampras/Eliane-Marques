import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { WhatsAppLink } from '@/components/shared/whatsapp/WhatsAppLink';
import { buildPricingInquiryWhatsAppUrl } from '@/lib/contact/whatsapp-intents';
import type { Service } from '@/lib/core/types';

interface PricingSectionProps {
  services: Service[];
  waConfig?: { number: string; defaultMessage: string };
}

function inferLabel(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes('consultoria')) return 'Consultoria privada';
  if (lower.includes('curso')) return 'Experiencia formativa';
  if (lower.includes('ebook')) return 'Material autoral';
  return 'Atelier signature';
}

function extractPrice(price: string) {
  const clean = price.replace('A partir de ', '').trim();
  const match = clean.match(/^R\$\s*(.+)$/);
  return {
    prefix: price.startsWith('A partir de') ? 'A partir de' : null,
    value: match ? match[1] : clean,
  };
}

export function PricingSection({ services, waConfig }: PricingSectionProps) {
  return (
    <Section
      id="investimentos"
      className="bg-[radial-gradient(ellipse_at_50%_100%,rgba(232,213,196,0.3),transparent_70%),var(--aveia)]"
    >
      <Container>
        <div className="mb-8 grid gap-4 md:mb-10 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-end">
          <div className="fade-up" style={{ '--delay': '0s' } as CSSProperties}>
            <div className="atelier-overline">Investimentos</div>
            <Heading className="mt-4 text-[2.4rem] lg:text-[2.9rem]">
              Solucoes desenhadas para sofisticacao, confianca e presenca
            </Heading>
          </div>
          <Text className="fade-up text-[12px] text-[color:var(--taupe)]" style={{ '--delay': '0.1s' } as CSSProperties}>
            Escolha o formato mais aderente ao seu momento. Cada proposta preserva o mesmo cuidado de atelier.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const featured = index === 1;
            const pricing = extractPrice(service.price);
            const waUrl = buildPricingInquiryWhatsAppUrl({
              number: waConfig?.number,
              productTitle: service.title,
            });

            return (
              <article
                key={service.slug ?? service.title}
                className={`fade-up relative flex h-full flex-col border px-6 py-7 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] transition-transform duration-300 sm:px-6 sm:py-7 lg:px-7 lg:py-8 ${
                  featured
                    ? 'border-[rgba(221,208,188,0.18)] bg-[color:var(--espresso)] text-[color:var(--aveia)] xl:mt-2 xl:-translate-y-1'
                    : 'border-[color:var(--linho)] bg-[color:var(--manteiga)] lg:hover:-translate-y-1'
                }`}
                style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
              >
                {featured && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-[color:var(--mel)] px-[18px] py-[5px] text-[9px] uppercase tracking-[0.18em] text-[color:var(--espresso)]">
                    ✦ Mais procurado ✦
                  </div>
                )}

                <div
                  className={`border-b pb-4 text-[9px] uppercase tracking-[0.18em] ${
                    featured
                      ? 'border-[rgba(221,208,188,0.18)] text-[color:var(--taupe)]'
                      : 'border-[color:var(--linho)] text-[color:var(--taupe)]'
                  }`}
                >
                  {inferLabel(service.title)}
                </div>

                <Heading
                  as="h3"
                  className={`mt-6 text-[1.4rem] ${
                    featured ? 'text-[color:var(--aveia)]' : 'text-[color:var(--espresso)]'
                  }`}
                >
                  {service.title}
                </Heading>

                <p className="mt-2 font-ornament text-[11px] italic text-[color:var(--taupe)]">{service.desc}</p>

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

                <div className="mt-8 pt-6">
                  <WhatsAppLink href={waUrl} className="inline-flex w-full sm:w-auto">
                    <span
                      className={`inline-flex w-full justify-center rounded-[1px] border px-5 py-3 text-[9px] uppercase tracking-[0.18em] transition-colors sm:w-auto ${
                        featured
                          ? 'border-[color:var(--mel)] text-[color:var(--mel)] hover:bg-[rgba(200,146,58,0.08)]'
                          : 'border-[color:var(--linho)] text-[color:var(--cacau)] hover:border-[color:var(--argila)] hover:text-[color:var(--argila)]'
                      }`}
                    >
                      Agendar agora
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
