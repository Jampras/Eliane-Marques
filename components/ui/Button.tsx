import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  type = 'button',
  ...props
}) => {
  const variants = {
    primary:
      'relative overflow-hidden border border-[color:var(--cacau)] bg-[color:var(--cacau)] text-[color:var(--aveia)] shadow-[var(--theme-button-primary-shadow)] after:absolute after:inset-y-0 after:left-[-130%] after:w-[48%] after:-skew-x-12 after:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-text-inverse)_12%,transparent),transparent)] after:transition-[left] after:duration-500 hover:border-[color:var(--espresso)] hover:bg-[color:var(--espresso)] hover:shadow-[var(--theme-button-primary-shadow-strong)] hover:after:left-[130%]',
    outline:
      'border border-[color:var(--argila)]/55 bg-[color:var(--theme-button-outline-bg)] text-[color:var(--cacau)] shadow-[var(--theme-button-outline-shadow)] hover:border-[color:var(--argila)] hover:bg-[color:var(--theme-button-outline-hover-bg)] hover:text-[color:var(--espresso)]',
    ghost:
      'border border-transparent bg-transparent text-text-2 hover:bg-[color:var(--theme-button-ghost-hover)] hover:text-[color:var(--espresso)]',
  };

  const sizes = {
    sm: 'min-h-9 px-4 py-2 text-[10px] sm:min-h-10 sm:px-5',
    md: 'min-h-10 px-5 py-3 text-[11px] sm:min-h-11 sm:px-7',
    lg: 'min-h-[48px] px-6 py-3 text-[11px] sm:min-h-[52px] sm:px-10 sm:py-4',
  };

  return (
    <button
      type={type}
      className={cn(
        'inline-flex touch-manipulation items-center justify-center gap-2 rounded-[1px] font-[500] uppercase tracking-[0.18em] transition-all duration-300 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
    </button>
  );
};
