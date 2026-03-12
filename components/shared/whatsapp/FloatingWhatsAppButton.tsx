'use client';

import React from 'react';
import { buildDirectContactWhatsAppUrl } from '@/lib/contact/whatsapp-intents';
import { useToast } from '@/components/ui/ToastProvider';
import { Icon } from '@/components/ui/Icon';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';
import { openWhatsAppUrl } from './openWhatsApp';

export const FloatingWhatsAppButton: React.FC<{ phone: string; message: string }> = ({
  phone,
  message,
}) => {
  const { showToast } = useToast();
  const whatsappUrl = buildDirectContactWhatsAppUrl({ number: phone, message });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const mode = openWhatsAppUrl(whatsappUrl);

    trackAnalyticsEvent({
      name: 'whatsapp_click',
      source: ANALYTICS_SOURCES.FLOATING_WHATSAPP,
      destination: 'whatsapp',
      metadata: { mode },
    });

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
      <Icon name="chat" className="text-[22px]" />
    </button>
  );
};
