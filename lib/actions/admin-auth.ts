'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, timingSafeEqual } from 'node:crypto';
import { encrypt, SESSION_COOKIE_NAME } from '@/lib/core/auth';
import { getRequestClientKey } from '@/lib/server/admin-auth';
import { clearAdminSession } from '@/lib/server/admin-google';
import {
  clearLoginFailures,
  getLoginBlockRemainingMs,
  registerLoginFailure,
} from '@/lib/server/rate-limit';
import { logServerError } from '@/lib/server/errors';
import { ensureDistributedRateLimitConfigured } from '@/lib/server/production-guards';
import { getAdminPassword, isProductionEnv } from '@/lib/env/server';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const LOGIN_DELAY_MS = 350;
const WEAK_ADMIN_PASSWORDS = new Set([
  'admin',
  '123456',
  'password',
  'changeme',
  'defina_uma_senha_forte',
]);

function isStrongAdminPassword(password: string) {
  return password.length >= 6 && !WEAK_ADMIN_PASSWORDS.has(password.trim().toLowerCase());
}

function hashString(value: string) {
  return createHash('sha256').update(value).digest();
}

function safeCompareStrings(input: string, expected: string) {
  const inputHash = hashString(input);
  const expectedHash = hashString(expected);
  return timingSafeEqual(inputHash, expectedHash);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginAction(formData: FormData) {
  try {
    ensureDistributedRateLimitConfigured();
  } catch (error) {
    logServerError('loginAction', error);
    return { error: 'Erro de configuracao do servidor. Contate o suporte.' };
  }

  const expectedPassword = getAdminPassword();

  if (!expectedPassword) {
    logServerError('loginAction', 'ADMIN_PASSWORD is not defined in environment variables.');
    return { error: 'Erro de configuracao do servidor. Contate o suporte.' };
  }

  if (!isStrongAdminPassword(expectedPassword)) {
    logServerError(
      'loginAction',
      'ADMIN_PASSWORD is weak. Rotate to a strong password with at least 12 characters.'
    );
    return { error: 'Erro de configuracao do servidor. Contate o suporte.' };
  }

  const passwordValue = formData.get('password');
  const password = typeof passwordValue === 'string' ? passwordValue : '';

  const clientKey = `admin-login:${await getRequestClientKey()}`;
  const blockedForMs = await getLoginBlockRemainingMs(clientKey);

  if (blockedForMs > 0) {
    return { error: `Muitas tentativas. Aguarde ${Math.ceil(blockedForMs / 1000)}s.` };
  }

  await sleep(LOGIN_DELAY_MS);

  if (!password || !safeCompareStrings(password, expectedPassword)) {
    await registerLoginFailure(clientKey);

    const retryAfterMs = await getLoginBlockRemainingMs(clientKey);
    if (retryAfterMs > 0) {
      return { error: `Muitas tentativas. Aguarde ${Math.ceil(retryAfterMs / 1000)}s.` };
    }

    return { error: 'Senha incorreta' };
  }

  await clearLoginFailures(clientKey);

  const expires = new Date(Date.now() + SESSION_TTL_MS);
  const session = await encrypt({ admin: true, role: 'admin', expires: expires.toISOString() });

  (await cookies()).set(SESSION_COOKIE_NAME, session, {
    expires,
    httpOnly: true,
    sameSite: 'lax',
    secure: isProductionEnv(),
    path: '/',
  });

  redirect('/admin');
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/auth/admin/logout');
}
