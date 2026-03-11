export const revalidate = 300;

import React from 'react';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { PaginationNav } from '@/components/ui/PaginationNav';
import { WhatsAppLink } from '@/components/shared/whatsapp/WhatsAppLink';
import { parsePageParam } from '@/lib/core/pagination';
import { getPaginatedProductsByType } from '@/lib/data/products';
import { buildWhatsAppUrl } from '@/lib/core/whatsapp';
import { getWhatsAppConfig } from '@/lib/data/config';
import { shouldOptimizeImage } from '@/lib/core/images';

export const metadata = {
  title: 'Servicos | Eliane Marques',
  description: 'Consultoria de imagem e etiqueta para profissionais de alto nivel.',
};

const PAGE_SIZE = 4;

type ServicesPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentPage = parsePageParam(resolvedSearchParams.page);
  const [servicesPage, wa] = await Promise.all([
    getPaginatedProductsByType('CONSULTORIA', currentPage, PAGE_SIZE),
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

        <div className="mt-10 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {services.map((service, index) => {
            const waUrl = buildWhatsAppUrl({
              number: wa.number,
              template: 'Ola Eliane! Gostaria de saber mais sobre a consultoria: {productTitle}',
              context: { productTitle: service.title },
            });

            return (
              <article
                key={service.id}
                className="fade-up relative overflow-hidden border border-[color:var(--linho)] bg-[color:var(--aveia)] shadow-[2px_3px_12px_rgba(58,36,24,0.06)]"
                style={{ '--delay': `${index * 0.08}s` } as React.CSSProperties}
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
                        ✦
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge className="mb-5">
                          {service.audience || 'Consultoria privada'}
                        </Badge>
                        <Heading as="h2" className="text-[1.6rem] lg:text-[1.9rem]">
                          {service.title}
                        </Heading>
                        <Text className="mt-5 text-[13px] text-[color:var(--taupe)]">
                          {service.shortDesc}
                        </Text>
                      </div>
                      <span className="hidden h-10 w-10 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)] lg:inline-flex">
                        ✦
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

                      <WhatsAppLink href={waUrl} className="inline-flex w-full sm:w-auto">
                        <span className="inline-flex w-full justify-center rounded-[1px] border border-[color:var(--linho)] px-5 py-3 text-[9px] uppercase tracking-[0.18em] text-[color:var(--cacau)] transition-colors hover:border-[color:var(--argila)] hover:text-[color:var(--argila)] sm:w-auto">
                          Agendar agora
                        </span>
                      </WhatsAppLink>
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
