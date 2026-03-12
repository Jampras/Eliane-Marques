import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ANALYTICS_EVENT_NAMES, type AnalyticsEventPayload } from '@/lib/analytics/events';
import { recordAnalyticsEvent } from '@/lib/analytics/server';

const analyticsSchema = z.object({
  name: z.enum(ANALYTICS_EVENT_NAMES),
  source: z.string().trim().min(1).max(100),
  path: z.string().trim().max(300).optional(),
  productId: z.string().trim().max(64).optional(),
  productSlug: z.string().trim().max(160).optional(),
  productTitle: z.string().trim().max(160).optional(),
  destination: z.string().trim().max(300).optional(),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
});

export async function POST(request: Request) {
  try {
    const input = analyticsSchema.parse(await request.json()) as AnalyticsEventPayload;
    await recordAnalyticsEvent(input);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
