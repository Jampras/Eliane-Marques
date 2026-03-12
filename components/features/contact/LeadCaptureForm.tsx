'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createLead } from '@/lib/actions/lead-capture';
import { useToast } from '@/components/ui/ToastProvider';

export function LeadCaptureForm() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  return (
    <form
      className="mt-8 border-t border-[color:var(--linho)] pt-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);
        const response = await createLead(payload);

        if (response.success) {
          form.reset();
          showToast({
            variant: 'success',
            title: 'Solicitacao enviada',
            description: 'Seu contato foi registrado. Retornaremos por email.',
          });
        } else {
          showToast({
            variant: 'error',
            title: 'Nao foi possivel enviar',
            description: response.error || 'Tente novamente em instantes.',
          });
        }

        setLoading(false);
      }}
    >
      <input type="hidden" name="source" value="contact-form" />
      <div className="grid grid-cols-1 gap-3">
        <input
          name="name"
          required
          placeholder="Seu nome"
          className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[12px] text-[color:var(--espresso)] outline-none transition-colors placeholder:text-[color:var(--taupe)] focus:border-[color:var(--argila)]"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Seu email"
          className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[12px] text-[color:var(--espresso)] outline-none transition-colors placeholder:text-[color:var(--taupe)] focus:border-[color:var(--argila)]"
        />
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Descreva seu objetivo, contexto ou o tipo de ajuda que procura."
          className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[12px] text-[color:var(--espresso)] outline-none transition-colors placeholder:text-[color:var(--taupe)] focus:border-[color:var(--argila)]"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Enviando...' : 'Registrar interesse por email'}
        </Button>
        <p className="text-center text-[10px] uppercase tracking-[0.16em] text-[color:var(--taupe)]">
          Fallback ao WhatsApp para quem prefere retorno por email
        </p>
      </div>
    </form>
  );
}
