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
import { shouldOptimizeImage } from '@/lib/core/images';
import { getProductListAction } from '@/lib/core/product-cta';
import { parsePageParam, parseQueryParam } from '@/lib/core/pagination';
import { getPaginatedProductsByTypes } from '@/lib/data/products';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

export const metadata = {
  title: 'Materiais | Eliane Marques',
  description: 'E-books e checklists exclusivos para sua jornada.',
};

const PAGE_SIZE = 6;

type MaterialsPageProps = {
  searchParams?: Promise<{ page?: string; q?: string; audience?: string; featured?: string }>;
};

export default async function MaterialsPage({ searchParams }: MaterialsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentPage = parsePageParam(resolvedSearchParams.page);
  const query = parseQueryParam(resolvedSearchParams.q);
  const audience = parseQueryParam(resolvedSearchParams.audience);
  const featuredOnly = parseQueryParam(resolvedSearchParams.featured) === '1';
  const materialsPage = await getPaginatedProductsByTypes(
    ['EBOOK', 'CHECKLIST'],
    currentPage,
    PAGE_SIZE,
    {
      q: query,
      audience:
        audience === 'PESSOAS' || audience === 'EMPRESAS' || audience === 'AMBOS'
          ? audience
          : undefined,
      featured: featuredOnly,
    }
  );
  const materials = materialsPage.items;

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="atelier-overline justify-center">Materiais autorais</div>
          <Heading className="mt-4 text-[2.4rem] lg:text-[3.3rem]">
            E-books e checklists para lapidar sua presenca com autonomia
          </Heading>
          <Text className="mx-auto mt-5 max-w-[640px] text-[14px] text-[color:var(--taupe)]">
            Recursos praticos e refinados para apoiar sua jornada entre um encontro e outro,
            com aplicacao direta no cotidiano.
          </Text>
        </div>

        <CatalogFilters
          clearHref="/materiais"
          searchPlaceholder="Busque por ebook, checklist, impressao..."
          defaultQuery={query}
          defaultAudience={audience}
          defaultFeatured={featuredOnly}
          showAudience
          showFeatured
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {materials.map((item, index) => {
            const action = getProductListAction(item, `/materiais/${item.slug}`, 'Acessar');

            return (
              <article
                key={item.id}
                className="fade-up flex h-full flex-col border border-[color:var(--linho)] bg-[color:var(--aveia)] shadow-[var(--theme-card-shadow)]"
                style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
              >
                <div className="relative aspect-[3/4] border-b border-[color:var(--linho)] bg-[color:var(--manteiga)]">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized={!shouldOptimizeImage(item.coverImage)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[2rem] text-[color:var(--argila)]">
                      {item.type === 'EBOOK' ? '\u25c7' : '\u2726'}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-5 py-6 sm:px-6 sm:py-7 lg:px-7 lg:py-8">
                  <div className="mb-5 flex flex-wrap gap-3">
                    <Badge className="w-fit">{item.type}</Badge>
                    {item.bestSeller && <Badge variant="outline">Mais vendido</Badge>}
                    {item.featured && <Badge variant="outline">Destaque</Badge>}
                  </div>
                  <Heading as="h2" className="text-[1.35rem]">
                    {item.title}
                  </Heading>
                  <Text className="mt-4 flex-1 text-[12px] text-[color:var(--taupe)]">
                    {item.shortDesc}
                  </Text>
                  <div className="mt-7 flex flex-col gap-4 border-t border-[color:var(--linho)] pt-5 sm:flex-row sm:items-end sm:justify-between">
                    <p className="font-ornament text-[2.2rem] leading-none text-[color:var(--cacau)]">
                      <sup className="mr-1 text-[0.35em] opacity-70">R$</sup>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(item.price)
                        .replace('R$', '')}
                    </p>
                    <TrackedLinkButton
                      href={action.href}
                      variant="outline"
                      size="sm"
                      target={action.external ? '_blank' : undefined}
                      rel={action.external ? 'noopener noreferrer' : undefined}
                      analytics={{
                        name: action.external ? 'cta_click' : 'product_click',
                        source: ANALYTICS_SOURCES.PRODUCT_LIST,
                        destination: action.href,
                        productId: item.id,
                        productSlug: item.slug,
                        productTitle: item.title,
                      }}
                    >
                      {action.label}
                    </TrackedLinkButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {materials.length === 0 && (
          <div className="mt-12 border border-[color:var(--linho)] bg-[color:var(--manteiga)] py-16 text-center text-[12px] italic text-[color:var(--taupe)]">
            Nenhum material disponivel no momento.
          </div>
        )}

        <PaginationNav
          currentPage={materialsPage.page}
          totalPages={materialsPage.totalPages}
          pathname="/materiais"
          searchParams={resolvedSearchParams}
        />
      </Container>
    </Section>
  );
}
