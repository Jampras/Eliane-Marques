import assert from 'node:assert/strict';
import test from 'node:test';
import { getWindowBounds, mergeTopProductCounts } from '@/lib/analytics/reporting-helpers';

test('getWindowBounds splits historical and raw windows around cutoff', () => {
  const cutoff = new Date('2026-03-10T00:00:00.000Z');
  const rangeStart = new Date('2026-03-01T00:00:00.000Z');

  const result = getWindowBounds(rangeStart, cutoff);

  assert.deepEqual(result, {
    aggregateStartInclusive: rangeStart,
    aggregateEndExclusive: cutoff,
    rawStartInclusive: cutoff,
  });
});

test('getWindowBounds keeps only raw window when range starts after cutoff', () => {
  const cutoff = new Date('2026-03-10T00:00:00.000Z');
  const rangeStart = new Date('2026-03-15T00:00:00.000Z');

  const result = getWindowBounds(rangeStart, cutoff);

  assert.deepEqual(result, {
    aggregateStartInclusive: undefined,
    aggregateEndExclusive: cutoff,
    rawStartInclusive: rangeStart,
  });
});

test('mergeTopProductCounts combines aggregate and raw counts for same product', () => {
  const result = mergeTopProductCounts(
    [
      {
        productSlugKey: 'consultoria-vip',
        productTitleKey: 'Consultoria VIP',
        _sum: { count: 4 },
      },
    ],
    [
      {
        productSlug: 'consultoria-vip',
        productTitle: 'Consultoria VIP',
        _count: { _all: 3 },
      },
      {
        productSlug: 'curso-presenca',
        productTitle: 'Curso Presenca',
        _count: { _all: 5 },
      },
    ]
  );

  assert.deepEqual(result, [
    {
      productSlug: 'consultoria-vip',
      productTitle: 'Consultoria VIP',
      count: 7,
    },
    {
      productSlug: 'curso-presenca',
      productTitle: 'Curso Presenca',
      count: 5,
    },
  ]);
});
