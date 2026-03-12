import prisma from '@/lib/core/prisma';
import type { AnalyticsEventPayload } from './events';

function normalizeMetadata(metadata?: AnalyticsEventPayload['metadata']) {
  if (!metadata) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => value !== undefined)
  );
}

export async function recordAnalyticsEvent(payload: AnalyticsEventPayload) {
  return prisma.analyticsEvent.create({
    data: {
      name: payload.name,
      source: payload.source,
      path: payload.path,
      productId: payload.productId,
      productSlug: payload.productSlug,
      productTitle: payload.productTitle,
      destination: payload.destination,
      metadata: normalizeMetadata(payload.metadata),
    },
  });
}
