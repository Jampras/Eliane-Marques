import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { clearAdminSession } from '@/lib/server/admin-google';

export async function GET(request: Request) {
  await clearAdminSession();

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Intencional: logout local do admin_session continua valendo mesmo sem OAuth configurado.
  }

  return NextResponse.redirect(new URL('/admin/login', request.url));
}
