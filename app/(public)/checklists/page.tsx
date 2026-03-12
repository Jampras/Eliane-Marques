export const revalidate = 300;

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { PaginationNav } from '@/components/ui/PaginationNav';
import { CatalogFilters } from '@/components/features/catalog/CatalogFilters';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { parsePageParam, parseQueryParam } from '@/lib/core/pagination';
import { getPaginatedChecklists } from '@/lib/data/checklists';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

export const metadata = {
  title: 'Checklists | Eliane Marques',
  description: 'Protocolos praticos para elevar sua presenca profissional e social.',
};

const PAGE_SIZE = 6;

type ChecklistsPageProps = {
  searchParams?: Promise<{ page?: string; q?: string }>;
};

export default async function ChecklistsPage({ searchParams }: ChecklistsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentPage = parsePageParam(resolvedSearchParams.page);
  const query = parseQueryParam(resolvedSearchParams.q);
  const checklistsPage = await getPaginatedChecklists(currentPage, PAGE_SIZE, query);
  const checklists = checklistsPage.items;

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="atelier-overline justify-center">Protocolos praticos</div>
          <Heading className="mt-4 text-[2.4rem] lg:text-[3.3rem]">
            Biblioteca de checklists para consistencia e presenca profissional
          </Heading>
          <Text className="mx-auto mt-5 max-w-[640px] text-[14px] text-[color:var(--taupe)]">
            Rotinas aplicaveis para transformar comportamento em autoridade com clareza, ritmo e repeticao consciente.
          </Text>
        </div>

        <CatalogFilters clearHref="/checklists" searchPlaceholder="Busque por checklist, reuniao, etiqueta..." defaultQuery={query} />

        <div className="mt-10 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {checklists.map((checklist, index) => (
            <TrackedLink
              key={checklist.id}
              href={`/checklists/${checklist.slug}`}
              analytics={{
                name: 'product_click',
                source: ANALYTICS_SOURCES.PRODUCT_LIST,
                destination: `/checklists/${checklist.slug}`,
                productId: checklist.id,
                productSlug: checklist.slug,
                productTitle: checklist.title,
              }}
              className="fade-up block"
              style={{ '--delay': `${index * 0.08}s` } as React.CSSProperties}
            >
              <article className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-5 py-6 sm:px-6 sm:py-7 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] transition-colors hover:border-[color:var(--argila)] lg:px-8 lg:py-9">
                <Badge variant="outline" className="mb-5">
                  {checklist._count.items} itens
                </Badge>
                <Heading as="h2" className="text-[1.6rem]">
                  {checklist.title}
                </Heading>
                <Text className="mt-4 text-[13px] text-[color:var(--taupe)]">
                  {checklist.description || 'Checklist estrategico para elevar sua presenca com passos objetivos.'}
                </Text>
                <div className="mt-7 border-t border-[color:var(--linho)] pt-5 text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                  Abrir checklist
                </div>
              </article>
            </TrackedLink>
          ))}
        </div>

        {checklists.length === 0 && (
          <div className="mt-12 border border-[color:var(--linho)] bg-[color:var(--manteiga)] py-16 text-center text-[12px] italic text-[color:var(--taupe)]">
            Nenhuma checklist publicada no momento.
          </div>
        )}

        <PaginationNav
          currentPage={checklistsPage.page}
          totalPages={checklistsPage.totalPages}
          pathname="/checklists"
          searchParams={resolvedSearchParams}
        />
      </Container>
    </Section>
  );
}
