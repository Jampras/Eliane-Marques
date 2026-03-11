import { NextRequest, NextResponse } from 'next/server';
import { decrypt, SESSION_COOKIE_NAME, updateSession } from '@/lib/core/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const withAdminHeaders = (response: NextResponse) => {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'no-store');
    return response;
  };

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await decrypt(session);
    if (!payload || !payload.admin || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return withAdminHeaders((await updateSession(request)) ?? NextResponse.next());
  }

  if (pathname === '/admin/login') {
    if (session) {
      const payload = await decrypt(session);
      if (payload?.admin && payload.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }

    return withAdminHeaders(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
