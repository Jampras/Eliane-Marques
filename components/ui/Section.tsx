import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'surface' | 'black';
  id?: string;
  borderY?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  variant = 'dark',
  id,
  borderY = false,
}) => {
  const bgColors = {
    dark: 'section-shell section-shell--dark',
    surface: 'section-shell section-shell--surface',
    black: 'section-shell section-shell--black theme-dark',
  };

  const borderClasses = borderY ? 'border-y border-white/8' : '';

  return (
    <section
      id={id}
      className={`py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 ${bgColors[variant]} ${borderClasses} ${className}`}
    >
      {children}
    </section>
  );
};