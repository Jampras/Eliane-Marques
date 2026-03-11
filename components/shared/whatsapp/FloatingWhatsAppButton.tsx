'use client';

import React from 'react';
import { buildWhatsAppUrl } from '@/lib/core/whatsapp';
import { useToast } from '@/components/ui/ToastProvider';
import { openWhatsAppUrl } from './openWhatsApp';

export const FloatingWhatsAppButton: React.FC<{ phone: string; message: string }> = ({
  phone,
  message,
}) => {
  const { showToast } = useToast();
  const whatsappUrl = buildWhatsAppUrl({ number: phone, template: message });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const mode = openWhatsAppUrl(whatsappUrl);

    showToast({
      variant: 'success',
      title: 'Abrindo WhatsApp',
      description:
        mode === 'popup'
          ? 'Canal direto com o atendimento.'
          : 'O navegador abriu o link diretamente porque o popup foi bloqueado.',
      duration: 2400,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Falar no WhatsApp"
      className="fixed right-5 bottom-5 z-[60] inline-flex h-12 w-12 items-center justify-center rounded-[2px] border border-[rgba(221,208,188,0.3)] bg-[color:var(--cacau)] text-[color:var(--aveia)] shadow-[2px_6px_18px_rgba(58,36,24,0.18)] transition-colors hover:bg-[color:var(--espresso)] md:right-6 md:bottom-6"
    >
      <span className="material-symbols-outlined text-[22px]">chat</span>
    </button>
  );
};