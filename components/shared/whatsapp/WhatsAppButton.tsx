'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { buildProductInquiryWhatsAppUrl } from '@/lib/contact/whatsapp-intents';
import { useToast } from '@/components/ui/ToastProvider';
import { Icon } from '@/components/ui/Icon';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { openWhatsAppUrl } from './openWhatsApp';

interface WhatsAppButtonProps {
  number: string;
  template: string;
  productTitle?: string;
  audience?: string;
  label?: string;
  variant?: 'primary' | 'outline';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  analyticsSource?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  number,
  template,
  productTitle,
  audience,
  label = 'Falar no WhatsApp',
  variant = 'primary',
  className = '',
  size = 'md',
  analyticsSource = 'whatsapp-button',
}) => {
  const { showToast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const whatsappUrl = buildProductInquiryWhatsAppUrl({
      number,
      template,
      productTitle,
      audience,
      pageUrl,
    });

    const mode = openWhatsAppUrl(whatsappUrl);

    trackAnalyticsEvent({
      name: 'whatsapp_click',
      source: analyticsSource,
      destination: 'whatsapp',
      productTitle,
      metadata: {
        audience: audience || null,
        mode,
      },
    });

    showToast({
      variant: 'success',
      title: 'Abrindo WhatsApp',
      description:
        mode === 'popup'
          ? 'Voce sera atendida no canal oficial.'
          : 'O navegador abriu o link diretamente porque o popup foi bloqueado.',
      duration: 2600,
    });
  };

  return (
    <Button variant={variant} size={size} className={`gap-3 ${className}`} onClick={handleClick}>
      <Icon name="chat" className="text-lg" />
      {label}
    </Button>
  );
};
