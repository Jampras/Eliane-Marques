import assert from 'node:assert/strict';
import test from 'node:test';
import { configSchema, homePageSchema } from '@/lib/validators/admin';

test('configSchema accepts valid theme preset and strips only declared fields', () => {
  const parsed = configSchema.parse({
    siteName: 'Eliane Marques',
    themePreset: 'classico',
  });

  assert.deepEqual(parsed, {
    siteName: 'Eliane Marques',
    themePreset: 'classico',
  });
});

test('configSchema rejects unknown keys', () => {
  assert.throws(
    () =>
      configSchema.parse({
        siteName: 'Eliane',
        unexpected: 'value',
      }),
    /unrecognized key/i
  );
});

test('homePageSchema requires exactly two value comparison items', () => {
  assert.throws(
    () =>
      homePageSchema.parse({
        heroTitle: 'Titulo',
        audienceItems: [
          { title: 'A', description: 'Descricao valida', sortOrder: 0 },
          { title: 'B', description: 'Outra descricao valida', sortOrder: 1 },
        ],
        valueItems: [
          {
            title: 'Somente um',
            bullets: ['Item um', 'Item dois'],
            tone: 'NEGATIVE',
            sortOrder: 0,
          },
        ],
        methodSteps: [
          { title: 'Etapa 1', description: 'Descricao 1', sortOrder: 0 },
          { title: 'Etapa 2', description: 'Descricao 2', sortOrder: 1 },
          { title: 'Etapa 3', description: 'Descricao 3', sortOrder: 2 },
        ],
        faqItems: [
          { question: 'Q1', answer: 'A1', sortOrder: 0 },
          { question: 'Q2', answer: 'A2', sortOrder: 1 },
          { question: 'Q3', answer: 'A3', sortOrder: 2 },
        ],
      }),
    /expected array to have >=2 items/i
  );
});

test('homePageSchema accepts local upload paths for item images', () => {
  const parsed = homePageSchema.parse({
    heroTitle: 'Titulo',
    audienceItems: [
      {
        title: 'A',
        description: 'Descricao valida',
        imageUrl: '/uploads/audience.png',
        sortOrder: 0,
      },
      { title: 'B', description: 'Outra descricao valida', sortOrder: 1 },
    ],
    valueItems: [
      {
        title: 'Antes',
        bullets: ['Item um', 'Item dois'],
        tone: 'NEGATIVE',
        imageUrl: '/uploads/value-before.png',
        sortOrder: 0,
      },
      {
        title: 'Depois',
        bullets: ['Item tres', 'Item quatro'],
        tone: 'POSITIVE',
        imageUrl: '/uploads/value-after.png',
        sortOrder: 1,
      },
    ],
    methodSteps: [
      { title: 'Etapa 1', description: 'Descricao 1', imageUrl: '/uploads/step1.png', sortOrder: 0 },
      { title: 'Etapa 2', description: 'Descricao 2', sortOrder: 1 },
      { title: 'Etapa 3', description: 'Descricao 3', sortOrder: 2 },
    ],
    faqItems: [
      { question: 'Q1', answer: 'A1', sortOrder: 0 },
      { question: 'Q2', answer: 'A2', sortOrder: 1 },
      { question: 'Q3', answer: 'A3', sortOrder: 2 },
    ],
  });

  assert.equal(parsed.audienceItems[0].imageUrl, '/uploads/audience.png');
  assert.equal(parsed.valueItems[0].imageUrl, '/uploads/value-before.png');
  assert.equal(parsed.methodSteps[0].imageUrl, '/uploads/step1.png');
});
