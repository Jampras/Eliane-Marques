import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAboutBaseData, buildAboutNestedCollections } from '@/lib/institutional/about-helpers';

const sampleAboutInput = {
  heroTitle: 'Uma trajetoria dedicada a imagem.',
  heroSubtitle: '',
  introTitle: 'Quem esta por tras',
  introBody: 'Texto',
  manifestoTitle: 'Manifesto',
  manifestoBody: 'Corpo',
  heroImage: '/uploads/hero.png',
  ctaMode: 'WHATSAPP' as const,
  ctaUrl: '',
  ctaLabel: 'Falar',
  whatsappMessageTemplate: '',
  milestones: [
    { title: 'Marco 1', description: 'Descricao 1', year: '2024', sortOrder: 9 },
  ],
  specializations: [
    { title: 'Especializacao', description: 'Descricao', sortOrder: 3 },
  ],
  credentials: [
    {
      title: 'Certificado',
      issuer: '',
      year: '2025',
      imageUrl: '/uploads/cert.png',
      kind: 'CERTIFICATE' as const,
      sortOrder: 8,
    },
  ],
};

test('buildAboutBaseData normalizes optional strings', () => {
  const result = buildAboutBaseData(sampleAboutInput);

  assert.equal(result.heroSubtitle, null);
  assert.equal(result.heroImage, '/uploads/hero.png');
  assert.equal(result.ctaUrl, null);
  assert.equal(result.whatsappMessageTemplate, null);
});

test('buildAboutNestedCollections reindexes collections and normalizes optional fields', () => {
  const result = buildAboutNestedCollections(sampleAboutInput);

  assert.deepEqual(result.milestones[0], {
    title: 'Marco 1',
    description: 'Descricao 1',
    year: '2024',
    sortOrder: 0,
  });
  assert.equal(result.specializations[0].sortOrder, 0);
  assert.equal(result.credentials[0].issuer, null);
  assert.equal(result.credentials[0].sortOrder, 0);
});
