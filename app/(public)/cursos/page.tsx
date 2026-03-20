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
import { getProductDetailPath } from '@/lib/core/product-paths';
import { getProductListAction } from '@/lib/core/product-cta';
import { parsePageParam, parseQueryParam } from '@/lib/core/pagination';
import { getPaginatedProductsByType } from '@/lib/data/products';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

export const metadata = {
  title: 'Cursos | Eliane Marques',
  description: 'Imersoes e treinamentos em etiqueta e branding.',
};

const PAGE_SIZE = 6;

type CoursesPageProps = {
  searchParams?: Promise<{ page?: string; q?: string; audience?: string; featured?: string }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentPage = parsePageParam(resolvedSearchParams.page);
  const query = parseQueryParam(resolvedSearchParams.q);
  const audience = parseQueryParam(resolvedSearchParams.audience);
  const featuredOnly = parseQueryParam(resolvedSearchParams.featured) === '1';
  const coursesPage = await getPaginatedProductsByType('CURSO', currentPage, PAGE_SIZE, {
    q: query,
    audience:
      audience === 'PESSOAS' || audience === 'EMPRESAS' || audience === 'AMBOS'
        ? audience
        : undefined,
    featured: featuredOnly,
  });
  const courses = coursesPage.items;

  return (
    <Section variant="surface">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="atelier-overline justify-center">Educacao & refinamento</div>
          <Heading className="mt-4 text-[2.4rem] lg:text-[3.3rem]">
            Cursos e imersoes para presenca profissional de alto valor
          </Heading>
          <Text className="mx-auto mt-5 max-w-[640px] text-[14px] text-[color:var(--taupe)]">
            Formatos autorais para desenvolver repertorio, comportamento e seguranca em
            ambientes corporativos e sociais de maior exigencia.
          </Text>
        </div>

        <CatalogFilters
          clearHref="/cursos"
          searchPlaceholder="Busque por curso, networking, imagem..."
          defaultQuery={query}
          defaultAudience={audience}
          defaultFeatured={featuredOnly}
          showAudience
          showFeatured
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => {
            const detailHref = getProductDetailPath(course.type, course.slug);
            const action = getProductListAction(course, detailHref, 'Ver detalhes');
            const highlighted = course.featured || (index === 1 && !courses.some((item) => item.featured));

            return (
              <article
                key={course.id}
                className={`fade-up relative flex h-full flex-col border px-0 py-0 shadow-[var(--theme-card-shadow)] ${
                  highlighted ? 'bg-[color:var(--creme-rosa)]' : 'bg-[color:var(--aveia)]'
                }`}
                style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-[3px] ${
                    highlighted ? 'bg-[color:var(--argila)]' : 'bg-[color:var(--linho)]'
                  }`}
                />
                <div className="relative aspect-[4/3] border-b border-[color:var(--linho)] bg-[color:var(--manteiga)]">
                  {course.coverImage ? (
                    <Image
                      src={course.coverImage}
                      alt={course.title}
                      fill
                      className="object-cover"
                      unoptimized={!shouldOptimizeImage(course.coverImage)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[2rem] text-[color:var(--argila)]">
                      {'\u25c8'}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-5 py-6 sm:px-6 sm:py-7 lg:px-7 lg:py-8">
                  <div className="mb-5 flex flex-wrap gap-3">
                    <Badge className="w-fit">{course.audience || 'Imersao privada'}</Badge>
                    {course.bestSeller && <Badge variant="outline">Mais vendido</Badge>}
                    {course.featured && <Badge variant="outline">Destaque</Badge>}
                  </div>
                  <Heading as="h2" className="text-[1.3rem]">
                    {course.title}
                  </Heading>
                  <Text className="mt-4 flex-1 text-[12px] text-[color:var(--taupe)]">
                    {course.shortDesc}
                  </Text>
                  <div className="mt-7 flex flex-col gap-4 border-t border-[color:var(--linho)] pt-5 sm:flex-row sm:items-end sm:justify-between">
                    <p className="font-ornament text-[2.2rem] leading-none text-[color:var(--cacau)]">
                      <sup className="mr-1 text-[0.35em] opacity-70">R$</sup>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(course.price)
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
                        productId: course.id,
                        productSlug: course.slug,
                        productTitle: course.title,
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

        {courses.length === 0 && (
          <div className="mt-12 border border-[color:var(--linho)] bg-[color:var(--manteiga)] py-16 text-center text-[12px] italic text-[color:var(--taupe)]">
            Nenhum curso disponivel no momento.
          </div>
        )}

        <PaginationNav
          currentPage={coursesPage.page}
          totalPages={coursesPage.totalPages}
          pathname="/cursos"
          searchParams={resolvedSearchParams}
        />
      </Container>
    </Section>
  );
}
