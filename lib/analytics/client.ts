'use client';

import type { AnalyticsEventPayload } from './events';

export function trackAnalyticsEvent(payload: AnalyticsEventPayload) {
  const body = JSON.stringify({
    ...payload,
    path: payload.path || (typeof window !== 'undefined' ? window.location.pathname : undefined),
  });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/track', blob);
    return;
  }

  void fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  });
}
