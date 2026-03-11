import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  style?: React.CSSProperties;
}

export const Heading: React.FC<TextProps> = ({ children, className = '', as: Tag = 'h2', style }) => {
  return <Tag style={style} className={`font-display text-text-1 font-normal leading-[1.08] ${className}`}>{children}</Tag>;
};

export const Text: React.FC<TextProps> = ({ children, className = '', as: Tag = 'p', style }) => {
  return <Tag style={style} className={`font-sans text-text-2 font-[300] leading-[1.85] ${className}`}>{children}</Tag>;
};