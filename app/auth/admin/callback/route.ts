import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  clearAdminSession,
  isAllowedAdminGoogleEmail,
  issueAdminGoogleSession,
} from '@/lib/server/admin-google';

function getSafeNextPath(input: string | null) {
  if (!input || !input.startsWith('/admin')) {
    return '/admin';
  }

  return input;
}

function buildLoginRedirect(request: NextRequest, error: string) {
  const url = new URL('/admin/login', request.url);
  url.searchParams.set('error', error);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get('next'));
  const code = request.nextUrl.searchParams.get('code');
  const errorDescription = request.nextUrl.searchParams.get('error_description');

  if (errorDescription) {
    return buildLoginRedirect(request, 'Nao foi possivel autenticar com Google.');
  }

  try {
    const supabase = await createSupabaseServerClient();

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        await clearAdminSession();
        return buildLoginRedirect(request, 'Falha ao concluir login com Google.');
      }
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      await clearAdminSession();
      return buildLoginRedirect(request, 'Sessao Google invalida ou expirada.');
    }

    const email = user.email.trim().toLowerCase();

    if (!isAllowedAdminGoogleEmail(email)) {
      await clearAdminSession();
      await supabase.auth.signOut();
      return buildLoginRedirect(request, 'Esta conta Google nao possui acesso administrativo.');
    }

    const displayName =
      (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
      (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
      email;

    await issueAdminGoogleSession({
      email,
      userId: user.id,
      name: displayName,
    });

    return NextResponse.redirect(new URL(nextPath, request.url));
  } catch {
    await clearAdminSession();
    return buildLoginRedirect(request, 'Falha ao validar o login com Google.');
  }
}
