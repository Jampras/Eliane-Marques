import 'server-only';

import { cookies } from 'next/headers';
import { encrypt, SESSION_COOKIE_NAME } from '@/lib/core/auth';
import {
  getAllowedAdminGoogleEmails as getAllowedAdminGoogleEmailsFromEnv,
  isProductionEnv,
} from '@/lib/env/server';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function getAllowedAdminGoogleEmails() {
  return getAllowedAdminGoogleEmailsFromEnv();
}

export function isAllowedAdminGoogleEmail(email: string) {
  return getAllowedAdminGoogleEmails().includes(email.trim().toLowerCase());
}

export async function issueAdminGoogleSession(input: {
  email: string;
  userId: string;
  name?: string | null;
}) {
  const expires = new Date(Date.now() + SESSION_TTL_MS);
  const session = await encrypt({
    admin: true,
    role: 'admin',
    email: input.email,
    name: input.name ?? undefined,
    sub: input.userId,
    provider: 'google',
    expires: expires.toISOString(),
  });

  (await cookies()).set(SESSION_COOKIE_NAME, session, {
    expires,
    httpOnly: true,
    sameSite: 'lax',
    secure: isProductionEnv(),
    path: '/',
  });
}

export async function clearAdminSession() {
  (await cookies()).set(SESSION_COOKIE_NAME, '', {
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: isProductionEnv(),
  });
}
