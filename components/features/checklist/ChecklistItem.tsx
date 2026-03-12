import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ChecklistItemProps {
  id: string;
  label: string;
  linkUrl?: string | null;
  isChecked: boolean;
  onToggle: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  label,
  linkUrl,
  isChecked,
  onToggle,
}) => {
  return (
    <div
      className={cn(
        'group flex items-start gap-3 border px-4 py-4 sm:gap-4 sm:px-5 sm:py-5 transition-colors duration-300',
        isChecked
          ? 'border-[color:var(--argila)] bg-[color:var(--creme-rosa)]/55'
          : 'border-[color:var(--linho)] bg-[color:var(--manteiga)] hover:border-[color:var(--argila)]'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isChecked}
        aria-label={`Marcar item ${label}`}
        className={cn(
          'mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center border transition-all',
          isChecked ? 'border-[color:var(--cacau)] bg-[color:var(--cacau)] text-[color:var(--aveia)]' : 'border-[color:var(--linho)] bg-[color:var(--aveia)]'
        )}
      >
        {isChecked && <span aria-hidden="true" className="text-[11px]">✓</span>}
      </button>

      <div className="flex-grow">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'cursor-pointer text-left text-[13px] sm:text-[14px] font-[300] leading-[1.8] transition-all',
            isChecked ? 'text-[color:var(--taupe)] line-through' : 'text-[color:var(--espresso)]'
          )}
        >
          {label}
        </button>

        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)] transition-colors hover:text-[color:var(--cacau)]"
          >
            Ver recomendado <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  );
};
