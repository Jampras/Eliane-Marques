'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/lib/actions/admin-auth';
import { Button } from '@/components/ui/Button';
import { ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from '@/components/features/admin/formStyles';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={ADMIN_LABEL_CLASS}>Senha de Acesso</label>
            <input
              name="password"
              type="password"
              required
              className={`${ADMIN_INPUT_CLASS} bg-[rgba(249,243,237,0.82)] text-text-1 transition-colors`}
              placeholder="********"
            />
          </div>

          {error && (
            <div className="border border-red-500/20 bg-red-500/10 p-3 text-center text-[10px] tracking-widest text-red-500 uppercase">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Validando...' : 'Entrar no Painel'}
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
