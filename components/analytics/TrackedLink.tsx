'use client';

import Link from 'next/link';
import React from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import type { AnalyticsEventPayload } from '@/lib/analytics/events';

interface TrackedLinkProps extends React.ComponentProps<typeof Link> {
  analytics: AnalyticsEventPayload;
}

export function TrackedLink({ analytics, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackAnalyticsEvent(analytics);
        onClick?.(event);
      }}
    />
  );
}
