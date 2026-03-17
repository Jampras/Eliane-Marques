import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { decrypt, SESSION_COOKIE_NAME, updateSession } from '@/lib/core/auth';

function getSupabaseHost() {
  try {
    return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
}

function buildContentSecurityPolicy(nonce: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  const supabaseHost = getSupabaseHost();
  const imageSrcHosts = ["'self'", 'data:', 'blob:', 'https://images.unsplash.com'];

  if (supabaseHost) {
    imageSrcHosts.push(`https://${supabaseHost}`);
  }

  const connectSrc = isProduction
    ? "connect-src 'self' https://vitals.vercel-insights.com"
    : "connect-src 'self' ws: http: https:";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src 'self' 'nonce-${nonce}'${isProduction ? '' : " 'unsafe-eval'"}`,
    "style-src 'self' https://fonts.googleapis.com",
    "style-src-elem 'self' https://fonts.googleapis.com",
    "style-src-attr 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com data:",
    `img-src ${imageSrcHosts.join(' ')}`,
    connectSrc,
    "frame-src 'none'",
    ...(isProduction ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
}

function applySecurityHeaders(
  response: NextResponse,
  nonce: string,
  pathname: string
) {
  response.headers.set('x-nonce', nonce);
  response.headers.set('Content-Security-Policy', buildContentSecurityPolicy(nonce));
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'no-store');
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const nonce = crypto.randomBytes(16).toString('base64');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL('/admin/login', request.url)),
        nonce,
        pathname
      );
    }

    const payload = await decrypt(session);
    if (!payload || !payload.admin || payload.role !== 'admin') {
      return applySecurityHeaders(
        NextResponse.redirect(new URL('/admin/login', request.url)),
        nonce,
        pathname
      );
    }

    return applySecurityHeaders(
      (await updateSession(request, requestHeaders)) ??
        NextResponse.next({ request: { headers: requestHeaders } }),
      nonce,
      pathname
    );
  }

  if (pathname === '/admin/login') {
    if (session) {
      const payload = await decrypt(session);
      if (payload?.admin && payload.role === 'admin') {
        return applySecurityHeaders(
          NextResponse.redirect(new URL('/admin', request.url)),
          nonce,
          pathname
        );
      }
    }

    return applySecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }), nonce, pathname);
  }

  return applySecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }), nonce, pathname);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
