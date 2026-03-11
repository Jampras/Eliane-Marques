import 'server-only';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const weakSessionSecrets = new Set([
  'super-secret-session-key-change-me',
  'changeme',
  'change-me',
  'admin',
  'defina_um_secret_com_32+_caracteres',
]);

let _key: Uint8Array | null = null;

function getKey(): Uint8Array {
  if (_key) return _key;

  const secretKey = process.env.ADMIN_SESSION_SECRET;
  if (!secretKey) {
    throw new Error('CRITICAL: ADMIN_SESSION_SECRET is not defined in environment variables.');
  }

  if (secretKey.length < 32 || weakSessionSecrets.has(secretKey.trim().toLowerCase())) {
    throw new Error(
      'CRITICAL: ADMIN_SESSION_SECRET is weak. Use a random secret with at least 32 characters.'
    );
  }

  _key = new TextEncoder().encode(secretKey);
  return _key;
}

export const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_ISSUER = 'site-eli';
const SESSION_AUDIENCE = 'admin-panel';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getKey());
}

export async function decrypt(input: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(input, getKey(), {
      algorithms: ['HS256'],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire.
  const parsed = await decrypt(session);
  if (!parsed) {
    return NextResponse.next();
  }

  const expires = new Date(Date.now() + SESSION_TTL_MS);
  const res = NextResponse.next();
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await encrypt({ ...parsed, expires: expires.toISOString() }),
    httpOnly: true,
    path: '/',
    expires,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
