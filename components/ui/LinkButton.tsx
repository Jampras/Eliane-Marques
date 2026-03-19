import React from 'react';
import Link, { type LinkProps } from 'next/link';
import { cn } from '@/lib/utils/cn';

interface LinkButtonProps extends LinkProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary:
      'border border-[color:var(--cacau)] bg-[color:var(--cacau)] text-[color:var(--aveia)] shadow-[0_8px_18px_rgba(122,78,56,0.14)] hover:border-[color:var(--espresso)] hover:bg-[color:var(--espresso)] hover:shadow-[0_12px_24px_rgba(58,36,24,0.2)]',
    outline:
      'border border-[color:var(--argila)]/55 bg-[color:var(--manteiga)]/72 text-[color:var(--cacau)] shadow-[0_4px_12px_rgba(58,36,24,0.05)] hover:border-[color:var(--argila)] hover:bg-[color:var(--creme-rosa)] hover:text-[color:var(--espresso)]',
    ghost: 'border border-transparent text-text-2 hover:text-[color:var(--espresso)]',
  };

  const sizes = {
    sm: 'px-5 py-2 text-[9px]',
    md: 'px-7 py-3 text-[10px]',
    lg: 'px-10 py-4 text-[10px]',
  };

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex touch-manipulation items-center justify-center rounded-[1px] font-[500] uppercase tracking-[0.18em] transition-all duration-300 active:scale-[0.985]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
