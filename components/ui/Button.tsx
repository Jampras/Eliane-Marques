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
      'relative overflow-hidden border border-[color:var(--cacau)] bg-[color:var(--cacau)] text-[color:var(--aveia)] after:absolute after:inset-y-0 after:left-[-130%] after:w-[48%] after:-skew-x-12 after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] after:transition-[left] after:duration-500 hover:bg-[color:var(--espresso)] hover:after:left-[130%]',
    outline:
      'border border-[color:var(--linho)] bg-transparent text-text-2 hover:border-[color:var(--argila)] hover:text-[color:var(--argila)]',
    ghost:
      'border border-transparent bg-transparent text-text-2 hover:text-[color:var(--espresso)]',
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
        'inline-flex items-center justify-center gap-2 rounded-[1px] font-[400] uppercase tracking-[0.18em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
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
