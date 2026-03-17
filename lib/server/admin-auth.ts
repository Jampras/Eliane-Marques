import 'server-only';
import { cookies } from 'next/headers';
import { decrypt, SESSION_COOKIE_NAME } from '@/lib/core/auth';
import { UnauthorizedError } from './errors';
import { getRequestClientKey } from './request-client';

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
export { getRequestClientKey };
