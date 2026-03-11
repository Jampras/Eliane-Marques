import { CONTACT } from './constants';

interface WhatsAppContext {
  productTitle?: string;
  audience?: string;
  pageUrl?: string;
}

interface BuildWhatsAppUrlParams {
  number?: string;
  template?: string;
  context?: WhatsAppContext;
}

/**
 * Constrói URLs de WhatsApp de forma resiliente.
 * Remove caracteres não numéricos e injeta variáveis de contexto no template.
 */
export function buildWhatsAppUrl({
  number = CONTACT.defaultPhone,
  template = CONTACT.defaultMessage,
  context = {},
}: BuildWhatsAppUrlParams = {}): string {
  let message = template;

  if (context.productTitle) {
    message = message.replace(/{productTitle}/g, context.productTitle);
  }
  if (context.audience) {
    message = message.replace(/{audience}/g, context.audience);
  }
  if (context.pageUrl) {
    message = message.replace(/{pageUrl}/g, context.pageUrl);
  }

  const cleanNumber = number.replace(/\D/g, '');

  // Garante que o número tenha o código do país se faltar
  const finalNumber = cleanNumber.length === 11 ? `55${cleanNumber}` : cleanNumber;

  return `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;
}
