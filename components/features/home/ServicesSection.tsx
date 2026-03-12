import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Heading, Text } from '@/components/ui/Typography';
import type { Service } from '@/lib/core/types';

interface ServicesSectionProps {
  services: Service[];
}

const ornaments = ['\u2726', '\u25c8', '\u25c7'];

function inferCategory(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes('consultoria')) return 'Consultoria';
  if (lower.includes('curso')) return 'Curso';
  if (lower.includes('ebook')) return 'Ebook';
  return 'Atelier';
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <Section className="bg-[color:var(--aveia)]">
      <Container>
        <div className="mb-8 grid gap-4 md:mb-10 lg:mb-12 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-end">
          <div className="fade-up" style={{ '--delay': '0s' } as CSSProperties}>
            <Badge className="mb-4">Servicos</Badge>
            <Heading className="max-w-[720px] text-[2.4rem] lg:text-[3rem]">
              Solucoes desenhadas para sofisticacao, confianca e presenca
            </Heading>
          </div>
          <Text
            className="fade-up max-w-none text-[12px] text-[color:var(--taupe)] xl:max-w-[220px]"
            style={{ '--delay': '0.1s' } as CSSProperties}
          >
            Cada formato responde a um momento da sua jornada, com o mesmo nivel de cuidado e assinatura.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const featured = index === 1;

            return (
              <article
                key={service.slug ?? service.title}
                className={`fade-up relative border border-[color:var(--linho)] px-5 py-6 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] transition-all duration-300 sm:px-6 sm:py-7 lg:px-7 lg:py-8 ${
                  featured
                    ? 'bg-[color:var(--creme-rosa)]'
                    : 'bg-[color:var(--aveia)] lg:hover:shadow-[2px_8px_18px_rgba(58,36,24,0.08)] xl:hover:-translate-y-[5px] xl:hover:rotate-[-0.3deg]'
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
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[color:var(--taupe)]">
                    {inferCategory(service.title)}
                  </span>
                </div>

                <Heading as="h3" className="text-[1.1rem] text-[color:var(--espresso)]">
                  {service.title}
                </Heading>
                <Text className="mt-4 text-[12px] text-[color:var(--taupe)]">{service.desc}</Text>

                <div className="mt-7 flex flex-col gap-4 border-t border-[color:var(--linho)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex rounded-full bg-[color:var(--creme-rosa)] px-4 py-1 text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                    {inferCategory(service.title)}
                  </span>
                  <Link
                    href="#investimentos"
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[color:var(--argila)] transition-colors hover:text-[color:var(--cacau)]"
                  >
                    Ver valores <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
