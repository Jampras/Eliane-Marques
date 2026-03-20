import assert from 'node:assert/strict';
import test from 'node:test';
import { getProductCta, getProductListAction } from '@/lib/core/product-cta';

const waConfig = {
  number: '5511999999999',
  defaultMessage: 'Ola',
};

test('returns external CTA when mode is external and URL exists', () => {
  const result = getProductCta(
    {
      title: 'Consultoria VIP',
      type: 'CONSULTORIA',
      ctaMode: 'EXTERNAL',
      ctaUrl: 'https://checkout.example.com/oferta',
      ctaLabel: 'Comprar agora',
    },
    waConfig
  );

  assert.deepEqual(result, {
    kind: 'external',
    href: 'https://checkout.example.com/oferta',
    label: 'Comprar agora',
    external: true,
  });
});

test('falls back to whatsapp CTA when external mode has no URL', () => {
  const result = getProductCta(
    {
      title: 'Consultoria VIP',
      type: 'CONSULTORIA',
      ctaMode: 'EXTERNAL',
      ctaUrl: '   ',
    },
    waConfig
  );

  assert.equal(result.kind, 'whatsapp');
  assert.match(result.href, /^https:\/\/wa\.me\//);
  assert.equal(result.label, 'Agendar agora via WhatsApp');
});

test('list action keeps internal fallback when product is not external', () => {
  const result = getProductListAction(
    {
      title: 'Curso',
      type: 'CURSO',
      ctaMode: 'WHATSAPP',
    },
    '/cursos/curso',
    'Ver detalhes'
  );

  assert.deepEqual(result, {
    href: '/cursos/curso',
    label: 'Ver detalhes',
    external: false,
  });
});
