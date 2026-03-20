'use client';

import React from 'react';
import { useChecklistProgress } from '@/lib/hooks/useChecklistProgress';
import { ProgressBar } from './ProgressBar';
import { ChecklistItem } from './ChecklistItem';
import { Badge } from '@/components/ui/Badge';
import { Heading, Text } from '@/components/ui/Typography';
import { WhatsAppButton } from '@/components/shared/whatsapp/WhatsAppButton';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

interface ChecklistItemData {
  id: string;
  label: string;
  linkUrl: string | null;
}

interface ChecklistClientProps {
  slug: string;
  title: string;
  items: ChecklistItemData[];
  waConfig: { number: string; defaultMessage: string };
}

export const ChecklistClient: React.FC<ChecklistClientProps> = ({
  slug,
  title,
  items,
  waConfig,
}) => {
  const itemIds = React.useMemo(() => items.map((item) => item.id), [items]);
  const { checkedIds, toggleItem, progress, isCompleted, isLoaded, completedCount } =
    useChecklistProgress(slug, itemIds);

  if (!isLoaded) {
    return (
      <div className="animate-pulse space-y-4 pt-4">
        <div className="h-3 w-1/4 bg-[color:var(--linho)]" />
        <div className="h-[3px] w-full bg-[color:var(--linho)]" />
        <div className="h-20 w-full bg-[color:var(--manteiga)]" />
        <div className="h-20 w-full bg-[color:var(--manteiga)]" />
      </div>
    );
  }

  return (
    <div className="relative space-y-6 sm:space-y-8">
      <ProgressBar progress={progress} count={`${completedCount}/${items.length}`} />

      <div className="space-y-3 pt-2">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            label={item.label}
            linkUrl={item.linkUrl}
            isChecked={checkedIds.includes(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>

      {isCompleted && (
        <div className="mt-10 border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] px-4 py-6 text-center shadow-[var(--theme-card-shadow)] sm:px-6 sm:py-8 lg:px-8">
          <Badge className="mb-5">Checklist concluido</Badge>
          <Heading as="h3" className="text-[2rem] lg:text-[2.4rem]">
            Excelente, voce concluiu esta etapa.
          </Heading>
          <Text className="mx-auto mt-4 max-w-[520px] text-[13px] text-[color:var(--taupe)]">
            Se quiser transformar esse movimento em um plano sob medida, podemos conversar sobre acompanhamento personalizado.
          </Text>
          <div className="mt-8">
            <WhatsAppButton
              number={waConfig.number}
              template={`Ola Eliane! Acabei de concluir o checklist "${title}". Gostaria de conversar sobre ajuda personalizada.`}
              label="Quero ajuda personalizada"
              className="mx-auto w-full sm:w-auto"
              size="lg"
              analyticsSource={ANALYTICS_SOURCES.PRODUCT_DETAIL}
            />
          </div>
        </div>
      )}
    </div>
  );
};
