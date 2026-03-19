import type { Service } from '@/lib/core/types';

export function inferServiceCategory(service: Service) {
  if (service.type === 'CONSULTORIA') return 'Consultoria';
  if (service.type === 'CURSO') return 'Curso';
  if (service.type === 'EBOOK') return 'Ebook';

  const lower = service.title.toLowerCase();
  if (lower.includes('consultoria')) return 'Consultoria';
  if (lower.includes('curso')) return 'Curso';
  if (lower.includes('ebook')) return 'Ebook';
  return 'Atelier';
}

export function inferServiceLabel(service: Service) {
  if (service.type === 'CONSULTORIA') return 'Consultoria privada';
  if (service.type === 'CURSO') return 'Experiencia formativa';
  if (service.type === 'EBOOK') return 'Material autoral';

  const lower = service.title.toLowerCase();
  if (lower.includes('consultoria')) return 'Consultoria privada';
  if (lower.includes('curso')) return 'Experiencia formativa';
  if (lower.includes('ebook')) return 'Material autoral';
  return 'Atelier signature';
}

export function extractServicePrice(price: string) {
  const clean = price.replace('A partir de ', '').trim();
  const match = clean.match(/^R\$\s*(.+)$/);

  return {
    prefix: price.startsWith('A partir de') ? 'A partir de' : null,
    value: match ? match[1] : clean,
  };
}

export function parseServicePriceValue(price: string) {
  const pricing = extractServicePrice(price);
  const numeric = pricing.value.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.');
  const value = Number.parseFloat(numeric);
  return Number.isFinite(value) ? value : null;
}
