import { Service } from '../core/types';
import prisma from '../core/prisma';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { safeDataQuery } from './safe-query';

const FALLBACK_SERVICES: Service[] = [
  {
    title: 'Consultoria 1:1',
    desc: 'O apice da personalizacao. Um acompanhamento estrategico para refinar sua imagem e presenca.',
    price: 'R$ 1.997',
  },
  {
    title: 'Masterclasses',
    desc: 'Imersoes em grupo que abordam desde etiqueta social de luxo ate a psicologia da primeira impressao.',
    price: 'A partir de R$ 497',
  },
  {
    title: 'Ebooks Digitais',
    desc: 'Guias praticos e profundos para quem busca iniciar sua jornada de refinamento com autonomia.',
    price: 'R$ 97',
  },
];

const getHomeServicesEntries = unstable_cache(
  async () =>
    prisma.product.findMany({
      where: {
        active: true,
        type: { in: ['CONSULTORIA', 'CURSO', 'EBOOK'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ['home-services'],
  { revalidate: 300, tags: ['home-services'] }
);

export const getHomeServices = cache(async (): Promise<Service[]> => {
  const products = await safeDataQuery('getHomeServices', getHomeServicesEntries, []);

  if (products.length === 0) {
    return FALLBACK_SERVICES;
  }

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return products.map((product) => ({
    title: product.title,
    desc: product.shortDesc,
    price: formatter.format(product.price),
    slug: product.slug,
  }));
});