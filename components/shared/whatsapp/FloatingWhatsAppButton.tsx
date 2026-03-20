'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { buildDirectContactWhatsAppUrl } from '@/lib/contact/whatsapp-intents';
import { useToast } from '@/components/ui/ToastProvider';
import { Icon } from '@/components/ui/Icon';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';
import { cn } from '@/lib/utils/cn';
import { openWhatsAppUrl } from './openWhatsApp';

export const FloatingWhatsAppButton: React.FC<{ phone: string; message: string }> = ({
  phone,
  message,
}) => {
  const pathname = usePathname();
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
      className={cn(
        'fixed right-5 bottom-5 z-[60] inline-flex h-12 w-12 items-center justify-center rounded-[2px] border border-[color:var(--theme-footer-border)] bg-[color:var(--cacau)] text-[color:var(--aveia)] shadow-[var(--theme-card-shadow-strong)] transition-colors hover:bg-[color:var(--espresso)] md:right-6 md:bottom-6',
        pathname === '/' && 'hidden md:inline-flex'
      )}
    >
      <Icon name="chat" className="text-[22px]" />
    </button>
  );
};
