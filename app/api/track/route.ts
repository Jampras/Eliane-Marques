import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  ANALYTICS_EVENT_NAMES,
  ANALYTICS_SOURCE_NAMES,
  type AnalyticsEventPayload,
} from '@/lib/analytics/events';
import { recordAnalyticsEvent } from '@/lib/analytics/server';
import { getRequestClientKey } from '@/lib/server/request-client';
import { checkPublicRateLimit } from '@/lib/server/public-rate-limit';
import { isSameOriginRequest } from '@/lib/server/request-security';
import { toRetryAfterSeconds } from '@/lib/server/public-rate-limit-helpers';

const ANALYTICS_RATE_LIMIT = {
  limit: 120,
  windowMs: 60_000,
} as const;

const analyticsSchema = z.object({
  name: z.enum(ANALYTICS_EVENT_NAMES),
  source: z.enum(ANALYTICS_SOURCE_NAMES),
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
    if (!isSameOriginRequest(new Headers(request.headers))) {
      return NextResponse.json(
        { ok: false, error: 'Origem invalida para envio de analytics.' },
        { status: 403 }
      );
    }

    const clientKey = await getRequestClientKey();
    const rateLimit = await checkPublicRateLimit(`analytics:${clientKey}`, ANALYTICS_RATE_LIMIT);

    if (!rateLimit.allowed) {
      const retryAfter = toRetryAfterSeconds(rateLimit.retryAfterMs);
      return NextResponse.json(
        {
          ok: false,
          error: `Limite temporario de analytics atingido. Tente novamente em ${retryAfter}s.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    const input = analyticsSchema.parse(await request.json()) as AnalyticsEventPayload;
    await recordAnalyticsEvent(input);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Payload de analytics invalido.' },
      { status: 400 }
    );
  }
}
