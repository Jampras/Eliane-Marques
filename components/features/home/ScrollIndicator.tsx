'use client';

import React, { useEffect, useState } from 'react';

/**
 * Bouncing scroll chevron that fades out after user scrolls 100px.
 * Click scrolls to the next section smoothly.
 */
export const ScrollIndicator: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [faded, setFaded] = useState(false);

  // Appear after 1000ms delay
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fade out after scrolling 100px
  useEffect(() => {
    const handleScroll = () => {
      setFaded(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      const nextSection = heroEl.nextElementSibling;
      nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Rolar para a proxima secao"
      className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500"
      style={{
        opacity: visible && !faded ? 1 : 0,
        pointerEvents: visible && !faded ? 'auto' : 'none',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-text-muted text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <svg
          width="20"
          height="32"
          viewBox="0 0 20 32"
          fill="none"
          className="hero-bounce text-border"
        >
          {/* Mouse outline */}
          <rect x="1" y="1" width="18" height="30" rx="9" stroke="currentColor" strokeWidth="1.5" />
          {/* Scroll dot */}
          <circle cx="10" cy="10" r="2" fill="currentColor" className="hero-scroll-dot" />
        </svg>
      </div>

    </button>
  );
};
