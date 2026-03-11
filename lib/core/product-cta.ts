import { buildWhatsAppUrl } from './whatsapp';
import { getProductCtaLabel } from './product-paths';

interface ProductCtaInput {
  title: string;
  type: string;
  slug?: string;
  ctaMode?: string | null;
  ctaUrl?: string | null;
  ctaLabel?: string | null;
  whatsappMessageTemplate?: string | null;
}

interface WhatsAppConfig {
  number: string;
  defaultMessage: string;
}

export function getProductListAction(
  product: ProductCtaInput,
  fallbackHref: string,
  fallbackLabel: string
) {
  const trimmedExternalUrl = product.ctaUrl?.trim() || '';
  const ctaMode = product.ctaMode || 'WHATSAPP';

  if (ctaMode === 'EXTERNAL' && trimmedExternalUrl) {
    return {
      href: trimmedExternalUrl,
      label: product.ctaLabel?.trim() || fallbackLabel,
      external: /^https?:\/\//i.test(trimmedExternalUrl),
    };
  }

  return {
    href: fallbackHref,
    label: fallbackLabel,
    external: false,
  };
}

export function getProductCta(product: ProductCtaInput, waConfig: WhatsAppConfig) {
  const trimmedExternalUrl = product.ctaUrl?.trim() || '';
  const label = product.ctaLabel?.trim() || getProductCtaLabel(product.type);
  const ctaMode = product.ctaMode || 'WHATSAPP';

  if (ctaMode === 'EXTERNAL' && trimmedExternalUrl) {
    return {
      href: trimmedExternalUrl,
      label,
      external: /^https?:\/\//i.test(trimmedExternalUrl),
    };
  }

  return {
    href: buildWhatsAppUrl({
      number: waConfig.number,
      template:
        product.whatsappMessageTemplate ||
        'Ola! Gostaria de saber mais sobre {productTitle}. Vi na pagina {pageUrl}',
      context: { productTitle: product.title },
    }),
    label,
    external: true,
  };
}
