import React from 'react';
import { cn } from '@/lib/utils/cn';

export const Badge: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}> = ({ children, className = '', variant = 'default' }) => {
  const variantStyles =
    variant === 'outline'
      ? 'border-[color:var(--linho)] bg-transparent text-text-2'
      : 'border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--cacau)]';

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center justify-center rounded-full border px-3 py-1.5 text-center text-[9px] font-[500] tracking-[0.2em] uppercase shadow-[var(--theme-badge-shadow)] sm:px-4 sm:text-[10px]',
        variantStyles,
        className
      )}
    >
      {children}
    </span>
  );
};
