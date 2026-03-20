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

  const borderClasses = borderY ? 'border-y border-[color:var(--theme-footer-border)]' : '';

  return (
    <section
      id={id}
      className={`py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 ${bgColors[variant]} ${borderClasses} ${className}`}
    >
      {children}
    </section>
  );
};
