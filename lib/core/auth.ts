import 'server-only';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionSecret, isProductionEnv } from '@/lib/env/server';

let _key: Uint8Array | null = null;

function getKey(): Uint8Array {
  if (_key) return _key;

  const secretKey = getAdminSessionSecret();

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

export async function updateSession(request: NextRequest, requestHeaders?: Headers) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire.
  const parsed = await decrypt(session);
  if (!parsed) {
    return NextResponse.next();
  }

  const expires = new Date(Date.now() + SESSION_TTL_MS);
  const res = requestHeaders
    ? NextResponse.next({ request: { headers: requestHeaders } })
    : NextResponse.next();
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await encrypt({ ...parsed, expires: expires.toISOString() }),
    httpOnly: true,
    path: '/',
    expires,
    sameSite: 'lax',
    secure: isProductionEnv(),
  });
  return res;
}
