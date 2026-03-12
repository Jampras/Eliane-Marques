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
      'border border-[color:var(--cacau)] bg-[color:var(--cacau)] text-[color:var(--aveia)] hover:bg-[color:var(--espresso)]',
    outline:
      'border border-[color:var(--linho)] bg-transparent text-text-2 hover:border-[color:var(--argila)] hover:text-[color:var(--argila)]',
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
        'inline-flex items-center justify-center rounded-[1px] font-[400] uppercase tracking-[0.18em] transition-all duration-300',
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
