'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { isSupabaseOAuthConfigured } from '@/lib/supabase/env';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleConfigured = isSupabaseOAuthConfigured();
  const oauthError = searchParams.get('error');

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();

      const redirectTo = `${window.location.origin}/auth/admin/callback?next=/admin`;
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (signInError) {
        setError(signInError.message);
        setGoogleLoading(false);
      }
    } catch (caughtError) {
      console.error(caughtError);
      setError('Nao foi possivel iniciar o login com Google.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,rgba(236,227,217,0.98),rgba(226,214,203,0.96))] p-6">
      <div className="w-full max-w-[560px] border border-[color:var(--linho)] bg-[rgba(243,233,223,0.94)] p-6 shadow-[0_18px_42px_rgba(88,69,52,0.12)] transition-all duration-500 sm:p-8 lg:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)]">
            <Icon name="admin_panel_settings" className="text-[24px]" />
          </div>
          <h1 className="font-display text-primary mb-2 text-3xl tracking-tighter uppercase">
            Eliane Marques
          </h1>
          <p className="text-text-muted text-[10px] tracking-[0.3em] uppercase">
            Acesso Restrito
          </p>
        </div>

        <div className="grid gap-5">
          <div className="border border-[color:var(--linho)] bg-[rgba(249,243,237,0.7)] p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--aveia)] text-[color:var(--argila)]">
                <Icon name="check_circle" className="text-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-text-muted text-[10px] tracking-[0.28em] uppercase">
                  Acesso principal
                </p>
                <h2 className="mt-2 font-display text-[1.7rem] leading-[1.04] text-[color:var(--espresso)]">
                  Entrar com Google
                </h2>
                <p className="mt-3 text-sm leading-[1.75] text-text-1">
                  Somente contas autorizadas entram no painel administrativo.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={!googleConfigured || googleLoading}
              className="mt-6 w-full"
            >
              <Icon name="alternate_email" className="text-[16px]" />
              {googleLoading ? 'Redirecionando...' : 'Entrar com Google'}
            </Button>
            {!googleConfigured ? (
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-red-500">
                OAuth Google ainda nao configurado nas variaveis publicas do Supabase
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-[color:var(--linho)] bg-[rgba(249,243,237,0.66)] px-4 py-4 text-center">
              <Icon name="admin_panel_settings" className="text-[18px] text-[color:var(--argila)]" />
              <p className="mt-3 text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Contas liberadas
              </p>
            </div>
            <div className="border border-[color:var(--linho)] bg-[rgba(249,243,237,0.66)] px-4 py-4 text-center">
              <Icon name="check_circle" className="text-[18px] text-[color:var(--argila)]" />
              <p className="mt-3 text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Sessao validada
              </p>
            </div>
            <div className="border border-[color:var(--linho)] bg-[rgba(249,243,237,0.66)] px-4 py-4 text-center">
              <Icon name="settings" className="text-[18px] text-[color:var(--argila)]" />
              <p className="mt-3 text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Ambiente interno
              </p>
            </div>
          </div>
        </div>

        {(oauthError || error) && (
          <div className="mt-5 border border-red-500/20 bg-red-500/10 p-3 text-center text-[10px] tracking-widest text-red-500 uppercase">
            {oauthError || error}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-text-muted text-[9px] tracking-widest uppercase transition-colors hover:text-primary"
          >
            Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}
