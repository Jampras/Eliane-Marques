import assert from 'node:assert/strict';
import test from 'node:test';
import { buildHomeBaseData, buildHomeNestedCollections } from '@/lib/institutional/home-helpers';

const sampleHomeInput = {
  heroEyebrow: '  Imagem . Presenca  ',
  heroPanelImage: '',
  heroTitle: 'Sua imagem precisa sustentar o nivel que voce ja entrega.',
  heroSubtitle: 'Texto',
  heroPrimaryCtaLabel: 'CTA 1',
  heroSecondaryCtaLabel: 'CTA 2',
  heroTrustText: 'Confianca',
  audienceTitle: 'Para quem',
  audienceSubtitle: 'Sub',
  valueTitle: 'Valor',
  valueSubtitle: 'Sub valor',
  valueCtaLabel: 'Ver formato',
  methodTitle: 'Metodo',
  methodSubtitle: 'Sub metodo',
  methodCtaLabel: 'Aplicar metodo',
  faqTitle: 'FAQ',
  faqSubtitle: 'Sub faq',
  finalCtaTitle: 'Final',
  finalCtaSubtitle: 'Sub final',
  finalCtaScarcityText: 'Poucas vagas',
  finalCtaLabel: 'Conversar',
  finalWhatsappMessage: 'Mensagem',
  audienceItems: [
    { title: 'A', description: 'Descricao A', icon: '✦', imageUrl: '', sortOrder: 99 },
    { title: 'B', description: 'Descricao B', imageUrl: '/uploads/b.png', sortOrder: 7 },
  ],
  valueItems: [
    { badge: 'Antes', title: 'Titulo 1', bullets: ['1', '2'], tone: 'NEGATIVE' as const, imageUrl: '', sortOrder: 9 },
    { badge: 'Depois', title: 'Titulo 2', bullets: ['3', '4'], tone: 'POSITIVE' as const, imageUrl: '/uploads/after.png', sortOrder: 5 },
  ],
  methodSteps: [
    { title: 'Etapa 1', description: 'Descricao 1', imageUrl: '', sortOrder: 4 },
    { title: 'Etapa 2', description: 'Descricao 2', imageUrl: '/uploads/step-2.png', sortOrder: 2 },
    { title: 'Etapa 3', description: 'Descricao 3', imageUrl: '', sortOrder: 0 },
  ],
  faqItems: [
    { question: 'Q1', answer: 'A1', sortOrder: 4 },
    { question: 'Q2', answer: 'A2', sortOrder: 1 },
    { question: 'Q3', answer: 'A3', sortOrder: 0 },
  ],
};

test('buildHomeBaseData normalizes optional empty strings to null', () => {
  const result = buildHomeBaseData(sampleHomeInput);

  assert.equal(result.heroEyebrow, 'Imagem . Presenca');
  assert.equal(result.heroPanelImage, null);
  assert.equal(result.heroTitle, sampleHomeInput.heroTitle);
});

test('buildHomeNestedCollections normalizes images and reindexes sortOrder', () => {
  const result = buildHomeNestedCollections(sampleHomeInput);

  assert.deepEqual(result.audienceItems[0], {
    title: 'A',
    description: 'Descricao A',
    icon: '✦',
    imageUrl: null,
    sortOrder: 0,
  });
  assert.equal(result.audienceItems[1].sortOrder, 1);
  assert.equal(result.valueItems[1].imageUrl, '/uploads/after.png');
  assert.equal(result.methodSteps[1].sortOrder, 1);
  assert.equal(result.faqItems[2].sortOrder, 2);
});
