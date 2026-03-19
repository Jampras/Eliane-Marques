'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface FaqItem {
  question: string;
  answer: string;
}

interface HomeFaqAccordionProps {
  items: FaqItem[];
}

export function HomeFaqAccordion({ items }: HomeFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className={cn(
              'fade-up overflow-hidden border border-[color:var(--linho)] bg-[color:var(--aveia)] transition-all duration-300',
              isOpen
                ? 'shadow-[2px_8px_18px_rgba(58,36,24,0.08)]'
                : 'hover:border-[color:var(--argila)]/55'
            )}
            style={{ '--delay': `${index * 0.06}s` } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => setOpenIndex((current) => (current === index ? null : index))}
              className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5 lg:px-6"
              aria-expanded={isOpen}
            >
              <span className="text-[11px] font-[500] uppercase tracking-[0.12em] text-[color:var(--espresso)] sm:text-[13px]">
                {item.question}
              </span>
              <span
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                  isOpen
                    ? 'border-[color:var(--argila)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)]'
                    : 'border-[color:var(--linho)] text-[color:var(--taupe)]'
                )}
              >
                <Icon
                  name="expand_more"
                  className={cn('text-[15px] transition-transform duration-300', isOpen && 'rotate-180')}
                />
              </span>
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-5 text-[12px] font-[300] leading-[1.85] text-[color:var(--taupe)] sm:px-5 lg:px-6">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
