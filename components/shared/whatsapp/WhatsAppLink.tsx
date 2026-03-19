'use client';

import React from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { ANALYTICS_SOURCES, type AnalyticsSource } from '@/lib/analytics/events';
import { openWhatsAppUrl } from './openWhatsApp';

interface WhatsAppLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  analyticsSource?: AnalyticsSource;
  productTitle?: string;
}

export const WhatsAppLink: React.FC<WhatsAppLinkProps> = ({
  href,
  children,
  className,
  analyticsSource = ANALYTICS_SOURCES.WHATSAPP_LINK,
  productTitle,
}) => {
  const { showToast } = useToast();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const mode = openWhatsAppUrl(href);

    trackAnalyticsEvent({
      name: 'whatsapp_click',
      source: analyticsSource,
      destination: 'whatsapp',
      productTitle,
      metadata: { mode },
    });

    showToast({
      variant: 'success',
      title: 'Abrindo WhatsApp',
      description:
        mode === 'popup'
          ? 'Se o app nao abrir, verifique seu navegador.'
          : 'O navegador abriu o link diretamente porque o popup foi bloqueado.',
      duration: 2600,
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
};
