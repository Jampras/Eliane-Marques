import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = true, style }) => {
  return (
    <div
      style={style}
      className={cn(
        'paper-card rounded-[2px] p-8',
        hoverEffect && 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-[2px_6px_16px_rgba(58,36,24,0.08)]',
        className
      )}
    >
      {children}
    </div>
  );
};
