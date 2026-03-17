import { getPublicSiteUrl } from '@/lib/env/server';

const SITE_URL = getPublicSiteUrl();

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildProductJsonLd(input: {
  name: string;
  description: string;
  path: string;
  image?: string | null;
  price: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    image: input.image ? [input.image] : undefined,
    url: absoluteUrl(input.path),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(input.path),
      priceCurrency: 'BRL',
      price: input.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  };
}

export function buildArticleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  createdAt: Date;
  image?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    datePublished: input.createdAt.toISOString(),
    dateModified: input.createdAt.toISOString(),
    image: input.image ? [input.image] : undefined,
    mainEntityOfPage: absoluteUrl(input.path),
    author: {
      '@type': 'Person',
      name: 'Eliane Marques',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eliane Marques',
    },
  };
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
