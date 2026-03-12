'use client';

import React from 'react';
import { LinkButton } from '@/components/ui/LinkButton';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import type { AnalyticsEventPayload } from '@/lib/analytics/events';

interface TrackedLinkButtonProps extends React.ComponentProps<typeof LinkButton> {
  analytics: AnalyticsEventPayload;
}

export function TrackedLinkButton({ analytics, onClick, ...props }: TrackedLinkButtonProps) {
  return (
    <LinkButton
      {...props}
      onClick={(event) => {
        trackAnalyticsEvent(analytics);
        onClick?.(event);
      }}
    />
  );
}
