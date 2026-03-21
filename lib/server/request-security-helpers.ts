function normalizeOrigin(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getDerivedRequestOrigin(requestHeaders: Headers) {
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');

  if (!host) {
    return null;
  }

  return normalizeOrigin(`${protocol}://${host}`);
}

export function isSameOriginRequest(requestHeaders: Headers, configuredSiteUrl?: string | null) {
  const allowedOrigins = new Set<string>();
  const configuredOrigin = normalizeOrigin(configuredSiteUrl ?? null);
  const derivedOrigin = getDerivedRequestOrigin(requestHeaders);

  if (configuredOrigin) {
    allowedOrigins.add(configuredOrigin);
  }

  if (derivedOrigin) {
    allowedOrigins.add(derivedOrigin);
  }

  if (allowedOrigins.size === 0) {
    return false;
  }

  const requestOrigin = normalizeOrigin(requestHeaders.get('origin'));
  if (requestOrigin) {
    return allowedOrigins.has(requestOrigin);
  }

  const referrerOrigin = normalizeOrigin(requestHeaders.get('referer'));
  if (referrerOrigin) {
    return allowedOrigins.has(referrerOrigin);
  }

  return false;
}
