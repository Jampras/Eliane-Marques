'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '@/lib/actions/admin-auth';
import { Button } from '@/components/ui/Button';
import { isSupabaseOAuthConfigured } from '@/lib/supabase/env';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from '@/components/features/admin/formStyles';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleConfigured = isSupabaseOAuthConfigured();
  const oauthError = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setPasswordLoading(false);
    }
  };

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
      <div className="w-full max-w-md border border-[color:var(--linho)] bg-[color:rgba(243,233,223,0.92)] p-10 shadow-[0_18px_42px_rgba(88,69,52,0.12)] transition-all duration-500">
        <div className="mb-10 text-center">
          <h1 className="font-display text-primary mb-2 text-3xl tracking-tighter uppercase">
            Eliane Marques
          </h1>
          <p className="text-text-muted text-[10px] tracking-[0.3em] uppercase">
            Acesso Restrito
          </p>
        </div>

        <div className="space-y-5">
          <div className="border border-[color:var(--linho)] bg-[color:rgba(249,243,237,0.7)] p-5 text-center">
            <p className="text-text-muted text-[10px] tracking-[0.28em] uppercase">
              Acesso principal
            </p>
            <p className="mt-3 text-sm text-text-1">
              Entre com Google. Somente contas autorizadas entram no painel administrativo.
            </p>
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={!googleConfigured || googleLoading || passwordLoading}
              className="mt-5 w-full"
            >
              {googleLoading ? 'Redirecionando...' : 'Entrar com Google'}
            </Button>
            {!googleConfigured ? (
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-red-500">
                OAuth Google ainda nao configurado nas variaveis publicas do Supabase
              </p>
            ) : null}
          </div>

          <div className="border-t border-[color:var(--linho)] pt-5">
            <p className="text-text-muted text-center text-[10px] tracking-[0.28em] uppercase">
              Contingencia por senha
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          <div className="space-y-2">
            <label htmlFor="admin-password" className={ADMIN_LABEL_CLASS}>
              Senha de Acesso
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              className={`${ADMIN_INPUT_CLASS} bg-[rgba(249,243,237,0.82)] text-text-1 transition-colors`}
              placeholder="********"
            />
          </div>

          {(oauthError || error) && (
            <div className="border border-red-500/20 bg-red-500/10 p-3 text-center text-[10px] tracking-widest text-red-500 uppercase">
              {oauthError || error}
            </div>
          )}

          <Button type="submit" disabled={passwordLoading || googleLoading} className="w-full">
            {passwordLoading ? 'Validando...' : 'Entrar com senha'}
          </Button>
        </form>

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
