import type { ProductType } from './types';

export function getProductDetailPath(type: ProductType | string, slug: string) {
  switch (type) {
    case 'CONSULTORIA':
      return `/servicos/${slug}`;
    case 'CURSO':
      return `/cursos/${slug}`;
    case 'EBOOK':
    case 'CHECKLIST':
    default:
      return `/materiais/${slug}`;
  }
}

export function isMaterialProductType(type: ProductType | string) {
  return type === 'EBOOK' || type === 'CHECKLIST';
}

export function getProductSectionLabel(type: ProductType | string) {
  switch (type) {
    case 'CONSULTORIA':
      return 'Consultoria privada';
    case 'CURSO':
      return 'Curso autoral';
    case 'CHECKLIST':
      return 'Checklist aplicavel';
    case 'EBOOK':
    default:
      return 'Material autoral';
  }
}

export function getProductCtaLabel(type: ProductType | string) {
  switch (type) {
    case 'CONSULTORIA':
      return 'Agendar agora via WhatsApp';
    case 'CURSO':
      return 'Quero saber mais via WhatsApp';
    case 'CHECKLIST':
    case 'EBOOK':
    default:
      return 'Adquirir agora via WhatsApp';
  }
}
