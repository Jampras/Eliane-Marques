export const revalidate = 300;

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { PaginationNav } from '@/components/ui/PaginationNav';
import { CatalogFilters } from '@/components/features/catalog/CatalogFilters';
import { TrackedLinkButton } from '@/components/analytics/TrackedLinkButton';
import { WhatsAppLink } from '@/components/shared/whatsapp/WhatsAppLink';
import { parsePageParam, parseQueryParam } from '@/lib/core/pagination';
import { getPaginatedProductsByType } from '@/lib/data/products';
import { getWhatsAppConfig } from '@/lib/data/config';
import { shouldOptimizeImage } from '@/lib/core/images';
import { getProductCta } from '@/lib/core/product-cta';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

export const metadata = {
  title: 'Servicos | Eliane Marques',
  description: 'Consultoria de imagem e etiqueta para profissionais de alto nivel.',
};

const PAGE_SIZE = 4;

type ServicesPageProps = {
  searchParams?: Promise<{ page?: string; q?: string; audience?: string; featured?: string }>;
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentPage = parsePageParam(resolvedSearchParams.page);
  const query = parseQueryParam(resolvedSearchParams.q);
  const audience = parseQueryParam(resolvedSearchParams.audience);
  const featuredOnly = parseQueryParam(resolvedSearchParams.featured) === '1';

  const [servicesPage, wa] = await Promise.all([
    getPaginatedProductsByType('CONSULTORIA', currentPage, PAGE_SIZE, {
      q: query,
      audience:
        audience === 'PESSOAS' || audience === 'EMPRESAS' || audience === 'AMBOS'
          ? audience
          : undefined,
      featured: featuredOnly,
    }),
    getWhatsAppConfig(),
  ]);

  const services = servicesPage.items;

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="atelier-overline justify-center">Consultoria estrategica</div>
          <Heading className="mt-4 text-[2.4rem] lg:text-[3.3rem]">
            Servicos assinados para imagem, postura e autoridade
          </Heading>
          <Text className="mx-auto mt-5 max-w-[640px] text-[14px] text-[color:var(--taupe)]">
            Acompanhamentos privados para mulheres que desejam alinhar presenca,
            narrativa e comportamento ao nivel de valor que ja carregam.
          </Text>
        </div>

        <CatalogFilters
          clearHref="/servicos"
          searchPlaceholder="Busque por consultoria, presenca, imagem..."
          defaultQuery={query}
          defaultAudience={audience}
          defaultFeatured={featuredOnly}
          showAudience
          showFeatured
        />

        <div className="mt-10 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {services.map((service, index) => {
            const cta = getProductCta(service, wa);

            return (
              <article
                key={service.id}
                className="fade-up relative overflow-hidden border border-[color:var(--linho)] bg-[color:var(--aveia)] shadow-[var(--theme-card-shadow)]"
                style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
              >
                <span className="absolute inset-x-0 top-0 h-[3px] bg-[color:var(--argila)]" />

                <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="relative min-h-[220px] border-b border-[color:var(--linho)] bg-[color:var(--manteiga)] lg:min-h-full lg:border-r lg:border-b-0">
                    {service.coverImage ? (
                      <Image
                        src={service.coverImage}
                        alt={service.title}
                        fill
                        className="object-cover"
                        unoptimized={!shouldOptimizeImage(service.coverImage)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[2rem] text-[color:var(--argila)]">
                        {'\u2726'}
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                          <Badge>{service.audience || 'Consultoria privada'}</Badge>
                          {service.bestSeller && <Badge variant="outline">Mais vendida</Badge>}
                          {service.featured && <Badge variant="outline">Destaque</Badge>}
                        </div>
                        <Heading as="h2" className="text-[1.6rem] lg:text-[1.9rem]">
                          {service.title}
                        </Heading>
                        <Text className="mt-5 text-[13px] text-[color:var(--taupe)]">
                          {service.shortDesc}
                        </Text>
                      </div>
                      <span className="hidden h-10 w-10 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)] lg:inline-flex">
                        {'\u2726'}
                      </span>
                    </div>

                    <div className="mt-7 flex flex-col gap-4 border-t border-[color:var(--linho)] pt-5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                          Investimento
                        </p>
                        <p className="mt-2 font-ornament text-[2.6rem] leading-none text-[color:var(--cacau)]">
                          <sup className="mr-1 text-[0.35em] opacity-70">R$</sup>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                            .format(service.price)
                            .replace('R$', '')}
                        </p>
                      </div>

                      {cta.kind === 'external' ? (
                        <TrackedLinkButton
                          href={cta.href}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          target="_blank"
                          rel="noopener noreferrer"
                          analytics={{
                            name: 'cta_click',
                            source: ANALYTICS_SOURCES.PRODUCT_LIST,
                            destination: cta.href,
                            productId: service.id,
                            productSlug: service.slug,
                            productTitle: service.title,
                          }}
                        >
                          {cta.label}
                        </TrackedLinkButton>
                      ) : (
                        <WhatsAppLink
                          href={cta.href}
                          className="inline-flex w-full sm:w-auto"
                          analyticsSource={ANALYTICS_SOURCES.PRODUCT_LIST}
                          productTitle={service.title}
                        >
                          <span className="inline-flex w-full justify-center rounded-[1px] border border-[color:var(--linho)] px-5 py-3 text-[9px] uppercase tracking-[0.18em] text-[color:var(--cacau)] transition-colors hover:border-[color:var(--argila)] hover:text-[color:var(--argila)] sm:w-auto">
                            {cta.label}
                          </span>
                        </WhatsAppLink>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {services.length === 0 && (
          <div className="mt-12 border border-[color:var(--linho)] bg-[color:var(--manteiga)] py-16 text-center text-[12px] italic text-[color:var(--taupe)]">
            Nenhuma consultoria disponivel no momento.
          </div>
        )}

        <PaginationNav
          currentPage={servicesPage.page}
          totalPages={servicesPage.totalPages}
          pathname="/servicos"
          searchParams={resolvedSearchParams}
        />
      </Container>
    </Section>
  );
}
