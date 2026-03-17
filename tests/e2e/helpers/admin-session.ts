import { type Page } from '@playwright/test';
import { SignJWT } from 'jose';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_ISSUER = 'site-eli';
const SESSION_AUDIENCE = 'admin-panel';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? '';
const BASE_URL = 'http://localhost:3000';

function getAdminSessionKey() {
  if (!ADMIN_SESSION_SECRET || ADMIN_SESSION_SECRET.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET is required for E2E admin session seeding.');
  }

  return new TextEncoder().encode(ADMIN_SESSION_SECRET);
}

async function buildAdminSessionToken() {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return new SignJWT({
    admin: true,
    role: 'admin',
    email: 'e2e-admin@example.com',
    name: 'E2E Admin',
    provider: 'google',
    expires: expires.toISOString(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getAdminSessionKey());
}

export async function seedAdminSession(page: Page) {
  const token = await buildAdminSessionToken();

  await page.context().addCookies([
    {
      name: SESSION_COOKIE_NAME,
      value: token,
      url: BASE_URL,
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}
