function getExpectedOrigin(requestHeaders: Headers) {
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');

  if (!host) {
    return null;
  }

  return `${protocol}://${host}`;
}

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

export function isSameOriginRequest(requestHeaders: Headers) {
  const expectedOrigin = getExpectedOrigin(requestHeaders);
  if (!expectedOrigin) {
    return false;
  }

  const requestOrigin = normalizeOrigin(requestHeaders.get('origin'));
  if (requestOrigin) {
    return requestOrigin === expectedOrigin;
  }

  const referrerOrigin = normalizeOrigin(requestHeaders.get('referer'));
  if (referrerOrigin) {
    return referrerOrigin === expectedOrigin;
  }

  return false;
}
