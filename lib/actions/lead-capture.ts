'use server';

import { headers } from 'next/headers';
import prisma from '@/lib/core/prisma';
import { recordAnalyticsEvent } from '@/lib/analytics/server';
import { leadSchema } from '@/lib/validators/lead';
import { mapServerErrorToMessage, logServerError } from '@/lib/server/errors';
import { checkPublicRateLimit } from '@/lib/server/public-rate-limit';
import { getRequestClientKey } from '@/lib/server/request-client';
import { isSameOriginRequest } from '@/lib/server/request-security';

export type LeadActionResponse = {
  success: boolean;
  error?: string;
};

export async function createLead(data: unknown): Promise<LeadActionResponse> {
  try {
    const input = leadSchema.parse(data);
    const requestHeaders = new Headers(await headers());

    if (!isSameOriginRequest(requestHeaders)) {
      return { success: false, error: 'Origem invalida' };
    }

    if (input.website) {
      return { success: true };
    }

    const clientKey = await getRequestClientKey();
    const rateLimit = await checkPublicRateLimit(`lead:${clientKey}`, {
      limit: 4,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Muitas tentativas. Aguarde ${Math.ceil(rateLimit.retryAfterMs / 1000)}s.`,
      };
    }

    await prisma.lead.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        message: input.message,
        source: input.source,
      },
    });

    try {
      await recordAnalyticsEvent({
        name: 'lead_submit',
        source: input.source,
        destination: 'lead-db',
        metadata: {
          hasMessage: input.message.length > 0,
        },
      });
    } catch (analyticsError) {
      logServerError('createLead.analytics', analyticsError);
    }

    return { success: true };
  } catch (error) {
    logServerError('createLead', error);
    return { success: false, error: mapServerErrorToMessage(error) };
  }
}
