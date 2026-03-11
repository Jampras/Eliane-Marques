import 'server-only';
import { cookies, headers } from 'next/headers';
import { decrypt, SESSION_COOKIE_NAME } from '@/lib/core/auth';
import { UnauthorizedError } from './errors';

export async function requireAdmin() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!session) {
    throw new UnauthorizedError();
  }

  const payload = await decrypt(session);
  if (!payload || !payload.admin || payload.role !== 'admin') {
    throw new UnauthorizedError();
  }

  return payload;
}

export async function getRequestClientKey() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = requestHeaders.get('x-real-ip')?.trim();

  return forwardedFor || realIp || 'local';
}
