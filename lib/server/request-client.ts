import 'server-only';
import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export async function getRequestClientKey() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = requestHeaders.get('x-real-ip')?.trim();
  const userAgent = requestHeaders.get('user-agent')?.trim() || '';
  const rawIdentity = forwardedFor || realIp;

  if (!rawIdentity) {
    return userAgent ? `ua:${sha256(userAgent).slice(0, 24)}` : 'local';
  }

  return `client:${sha256(`${rawIdentity}:${userAgent}`).slice(0, 24)}`;
}
