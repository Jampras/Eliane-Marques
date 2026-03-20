export function getWindowBounds(rangeStart?: Date, rawCutoff = new Date()) {
  const resolvedRawCutoff = rawCutoff;

  if (!rangeStart) {
    return {
      aggregateStartInclusive: undefined as Date | undefined,
      aggregateEndExclusive: resolvedRawCutoff,
      rawStartInclusive: resolvedRawCutoff,
    };
  }

  return {
    aggregateStartInclusive: rangeStart < resolvedRawCutoff ? rangeStart : undefined,
    aggregateEndExclusive: resolvedRawCutoff,
    rawStartInclusive: rangeStart > resolvedRawCutoff ? rangeStart : resolvedRawCutoff,
  };
}

type AggregateProductRow = {
  productSlugKey: string;
  productTitleKey: string;
  _sum: { count: number | null };
};

type RawProductRow = {
  productSlug: string | null;
  productTitle: string | null;
  _count?: { _all?: number | null };
};

export function mergeTopProductCounts(
  aggregateRows: AggregateProductRow[],
  rawRows: RawProductRow[]
) {
  const combined = new Map<string, { productSlug: string | null; productTitle: string | null; count: number }>();

  for (const row of aggregateRows
    .sort((a, b) => (b._sum.count ?? 0) - (a._sum.count ?? 0))
    .slice(0, 20)) {
    const key = `${row.productSlugKey}::${row.productTitleKey}`;
    combined.set(key, {
      productSlug: row.productSlugKey || null,
      productTitle: row.productTitleKey || null,
      count: row._sum.count ?? 0,
    });
  }

  for (const row of rawRows
    .sort((a, b) => (b._count?._all ?? 0) - (a._count?._all ?? 0))
    .slice(0, 20)) {
    const key = `${row.productSlug ?? ''}::${row.productTitle ?? ''}`;
    const current = combined.get(key);

    if (current) {
      current.count += row._count?._all ?? 0;
      continue;
    }

    combined.set(key, {
      productSlug: row.productSlug,
      productTitle: row.productTitle,
      count: row._count?._all ?? 0,
    });
  }

  return [...combined.values()].sort((a, b) => b.count - a.count).slice(0, 5);
}
