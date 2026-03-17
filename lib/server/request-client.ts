import 'server-only';
import { headers } from 'next/headers';

export async function getRequestClientKey() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = requestHeaders.get('x-real-ip')?.trim();

  return forwardedFor || realIp || 'local';
}
