import { buildWhatsAppUrl } from '@/lib/core/whatsapp';

interface DirectContactInput {
  number?: string;
  message: string;
}

interface ProductInquiryInput {
  number?: string;
  template: string;
  productTitle?: string;
  audience?: string;
  pageUrl?: string;
}

interface PricingInquiryInput {
  number?: string;
  productTitle: string;
}

export function buildDirectContactWhatsAppUrl({ number, message }: DirectContactInput) {
  return buildWhatsAppUrl({
    number,
    template: message,
  });
}

export function buildProductInquiryWhatsAppUrl({
  number,
  template,
  productTitle,
  audience,
  pageUrl,
}: ProductInquiryInput) {
  return buildWhatsAppUrl({
    number,
    template,
    context: { productTitle, audience, pageUrl },
  });
}

export function buildPricingInquiryWhatsAppUrl({
  number,
  productTitle,
}: PricingInquiryInput) {
  return buildWhatsAppUrl({
    number,
    template: 'Ola Eliane! Quero entender se o servico {productTitle} e o ideal para meu momento.',
    context: { productTitle },
  });
}
