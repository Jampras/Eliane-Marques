import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Heading, Text } from '@/components/ui/Typography';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';
import type { Service } from '@/lib/core/types';
import { inferServiceCategory, parseServicePriceValue } from '@/lib/core/home-offers';
import { getServicesFeaturedIndex, isServicesFeatured } from '@/lib/core/editorial-highlights';

interface ServicesSectionProps {
  services: Service[];
}

const ornaments = ['\u2726', '\u25c8', '\u25c7'];

function inferOfferRole(services: Service[], service: Service, index: number) {
  const featuredIndex = getServicesFeaturedIndex(services);
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
      label: 'Escolha principal',
      description: 'Melhor equilibrio entre impacto imediato e profundidade de acompanhamento.',
    };
  }

  if (index === lowestIndex) {
    return {
      label: 'Entrada estrategica',
      description: 'Passo inicial para corrigir percepcao com menor complexidade de agenda.',
    };
  }

  if (index === highestIndex) {
    return {
      label: 'Acompanhamento premium',
      description: 'Para quem precisa de proximidade, refinamento e alta personalizacao.',
    };
  }

  return {
    label: 'Ajuste prioritario',
    description: 'Para quem ja reconhece o ponto de ajuste e quer acelerar a mudanca.',
  };
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <Section id="formatos" className="bg-[color:var(--aveia)]">
      <Container>
        <div className="mb-8 grid gap-4 md:mb-10 lg:mb-12 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-end">
          <div className="fade-up" style={{ '--delay': '0s' } as CSSProperties}>
            <Badge className="mb-4">Formatos</Badge>
            <Heading className="max-w-[16ch] text-[2rem] lg:text-[2.7rem]">
              Escolha o formato mais adequado para seu momento
            </Heading>
          </div>
          <Text
            className="fade-up max-w-none border-l border-[color:var(--linho)]/80 pl-4 text-[12px] leading-[1.85] text-[color:var(--taupe)] xl:max-w-[240px]"
            style={{ '--delay': '0.1s' } as CSSProperties}
          >
            Cada formato responde a um nivel diferente de necessidade.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const featured = isServicesFeatured(services, index);
            const role = inferOfferRole(services, service, index);

            return (
              <article
                key={service.slug ?? service.title}
                className={`fade-up-card relative border border-[color:var(--linho)] px-5 py-6 shadow-[var(--theme-card-shadow)] transition-all duration-300 sm:px-6 sm:py-7 lg:px-7 lg:py-8 ${
                  featured
                    ? 'bg-[color:var(--creme-rosa)]'
                    : 'bg-[color:var(--aveia)] lg:hover:shadow-[var(--theme-card-shadow-hover)] xl:hover:-translate-y-[5px] xl:hover:rotate-[-0.3deg]'
                }`}
                style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-[3px] ${
                    featured ? 'bg-[color:var(--argila)]' : 'bg-[color:var(--linho)]'
                  }`}
                />
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[15px] text-[color:var(--argila)]">
                    {ornaments[index] ?? '\u2726'}
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="rounded-full border border-[color:var(--linho)] px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                      {role.label}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[color:var(--taupe)]">
                      {inferServiceCategory(service)}
                    </span>
                    {service.bestSeller && <Badge variant="outline">Mais vendido</Badge>}
                  </div>
                </div>

                <Heading as="h3" className="max-w-[16ch] text-[1.15rem] leading-[1.14] [text-wrap:balance] text-[color:var(--espresso)]">
                  {service.title}
                </Heading>
                <p className="mt-3 max-w-[26ch] text-[10px] uppercase tracking-[0.16em] text-[color:var(--argila)]">
                  {role.description}
                </p>
                <Text className="mt-4 max-w-[28ch] text-[12px] leading-[1.75] text-[color:var(--taupe)]">
                  {service.desc}
                </Text>

                <div className="mt-7 flex flex-col gap-4 border-t border-[color:var(--linho)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex rounded-full bg-[color:var(--creme-rosa)] px-4 py-1 text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                    {inferServiceCategory(service)}
                  </span>
                  <TrackedLink
                    href="#investimentos"
                    analytics={{
                      name: 'cta_click',
                      source: ANALYTICS_SOURCES.HOME_SERVICES,
                      destination: '#investimentos',
                      productSlug: service.slug,
                      productTitle: service.title,
                    }}
                    className="inline-flex items-center gap-2 rounded-[1px] border border-[color:var(--argila)] bg-[color:var(--creme-rosa)] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[color:var(--espresso)] transition-all hover:border-[color:var(--cacau)] hover:bg-[color:var(--manteiga)]"
                  >
                    Comparar investimento <span aria-hidden="true">&rarr;</span>
                  </TrackedLink>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
