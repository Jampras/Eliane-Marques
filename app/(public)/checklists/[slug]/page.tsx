export const revalidate = 300;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { ChecklistClient } from '@/components/features/checklist/ChecklistClient';
import { getChecklistBySlug } from '@/lib/data/checklists';
import { getWhatsAppConfig } from '@/lib/data/config';

type ChecklistPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ChecklistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const checklist = await getChecklistBySlug(slug);

  if (!checklist) return { title: 'Checklist nao encontrada' };

  return {
    title: `${checklist.title} | Eliane Marques`,
    description: checklist.description || 'Checklist pratica para elevar sua presenca e comportamento profissional.',
    alternates: { canonical: `/checklists/${checklist.slug}` },
    openGraph: {
      title: checklist.title,
      description: checklist.description || 'Checklist pratica para elevar sua presenca e comportamento profissional.',
      url: `/checklists/${checklist.slug}`,
    },
  };
}

export default async function ChecklistDetailPage({ params }: ChecklistPageProps) {
  const { slug } = await params;
  const [checklist, waConfig] = await Promise.all([getChecklistBySlug(slug), getWhatsAppConfig()]);

  if (!checklist) notFound();

  return (
    <Section>
      <Container size="md">
        <div className="text-center">
          <div className="atelier-overline justify-center">Checklist interativa</div>
          <Badge className="mt-5">{checklist.items.length} etapas</Badge>
          <Heading as="h1" className="mt-6 text-[2.4rem] lg:text-[3.8rem]">
            {checklist.title}
          </Heading>
          <Text className="mx-auto mt-5 max-w-[680px] text-[14px] text-[color:var(--taupe)]">
            {checklist.description || 'Siga cada etapa e acompanhe seu progresso em tempo real.'}
          </Text>
        </div>

        <div className="mt-10 border border-[color:var(--linho)] bg-[color:var(--aveia)] px-5 py-6 shadow-[var(--theme-card-shadow)] lg:px-8 lg:py-8">
          <ChecklistClient
            slug={checklist.slug}
            title={checklist.title}
            items={checklist.items}
            waConfig={waConfig}
          />
        </div>
      </Container>
    </Section>
  );
}
