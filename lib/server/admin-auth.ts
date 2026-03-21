import 'server-only';
import { cookies } from 'next/headers';
import { decrypt, SESSION_COOKIE_NAME } from '@/lib/core/auth';
import { clearAdminSession, isAllowedAdminGoogleEmail } from './admin-google';
import { UnauthorizedError } from './errors';
import { getRequestClientKey } from './request-client';
import { isAuthorizedAdminSessionPayload } from './admin-auth-helpers';

export async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) {
    throw new UnauthorizedError();
  }

  const payload = await decrypt(session);
  if (!isAuthorizedAdminSessionPayload(payload, isAllowedAdminGoogleEmail)) {
    await clearAdminSession();
    throw new UnauthorizedError();
  }

  return payload;
}
export { getRequestClientKey };
