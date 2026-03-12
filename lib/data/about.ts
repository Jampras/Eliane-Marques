import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import prisma from '@/lib/core/prisma';
import { safeDataQuery } from './safe-query';

const getAboutPageEntry = unstable_cache(
  async () =>
    prisma.aboutPage.findUnique({
      where: { singletonKey: 'main' },
      include: {
        milestones: { orderBy: { sortOrder: 'asc' } },
        specializations: { orderBy: { sortOrder: 'asc' } },
        credentials: { orderBy: { sortOrder: 'asc' } },
      },
    }),
  ['about-page'],
  { revalidate: 300, tags: ['about-page'] }
);

export const getAboutPage = cache(async () => {
  const page = await safeDataQuery('getAboutPage', getAboutPageEntry, null);

  if (page) {
    return page;
  }

  return {
    id: 'draft',
    singletonKey: 'main',
    heroTitle: 'Uma trajetoria dedicada a imagem, presenca e refinamento.',
    heroSubtitle:
      'Apresente sua visao, formacao e credenciais de forma clara, elegante e confiavel.',
    introTitle: 'Quem esta por tras da assinatura',
    introBody:
      'Use este espaco para contar sua historia, seu posicionamento e o tipo de transformacao que voce entrega.',
    manifestoTitle: 'Especializacoes e base tecnica',
    manifestoBody:
      'Mostre aqui o que sustenta sua autoridade: repertorio, especializacoes, metodo e visao de trabalho.',
    heroImage: null,
    ctaMode: 'WHATSAPP',
    ctaUrl: null,
    ctaLabel: 'Falar com Eliane',
    whatsappMessageTemplate:
      'Ola Eliane! Gostaria de saber mais sobre sua trajetoria e como funciona sua consultoria.',
    createdAt: new Date(0),
    updatedAt: new Date(0),
    milestones: [],
    specializations: [],
    credentials: [],
  };
});
