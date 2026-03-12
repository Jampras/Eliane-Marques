'use server';

import prisma from '@/lib/core/prisma';
import { recordAnalyticsEvent } from '@/lib/analytics/server';
import { leadSchema } from '@/lib/validators/lead';
import { mapServerErrorToMessage, logServerError } from '@/lib/server/errors';

export type LeadActionResponse = {
  success: boolean;
  error?: string;
};

export async function createLead(data: unknown): Promise<LeadActionResponse> {
  try {
    const input = leadSchema.parse(data);

    await prisma.lead.create({
      data: {
        name: input.name,
        email: input.email,
        message: input.message,
        source: input.source,
      },
    });

    await recordAnalyticsEvent({
      name: 'lead_submit',
      source: input.source,
      destination: 'lead-db',
      metadata: {
        hasMessage: input.message.length > 0,
      },
    });

    return { success: true };
  } catch (error) {
    logServerError('createLead', error);
    return { success: false, error: mapServerErrorToMessage(error) };
  }
}
