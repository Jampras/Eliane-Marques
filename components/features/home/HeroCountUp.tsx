'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  delayMs?: number;
}

/**
 * Animates a number from 0 to `end` with ease-out timing.
 */
export const CountUp: React.FC<CountUpProps> = ({
  end,
  suffix = '',
  duration = 1800,
  delayMs = 0,
}) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      started.current = true;

      const step = (timestamp: number) => {
        if (!startRef.current) startRef.current = timestamp;
        const elapsed = timestamp - startRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * end));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, delayMs]);

  return (
    <span className="font-display tabular-nums">
      {count}{suffix}
    </span>
  );
};

interface HeroCountUpProps {
  delayMs?: number;
}

export const HeroCountUp: React.FC<HeroCountUpProps> = ({ delayMs = 800 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  const metrics = [
    { end: 150, suffix: '+', label: 'clientes' },
    { end: 8, suffix: '', label: 'anos' },
    { end: 12, suffix: '', label: 'cursos' },
  ];

  return (
    <div
      className="flex items-center gap-4 sm:gap-6"
      style={{
        transition: 'opacity 600ms, transform 400ms',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      {metrics.map((m, i) => (
        <React.Fragment key={m.label}>
          {i > 0 && <span className="text-primary-light text-lg select-none">·</span>}
          <div className="flex items-baseline gap-1.5">
            <span className="text-text-1 text-xl font-bold sm:text-2xl">
              {visible && <CountUp end={m.end} suffix={m.suffix} delayMs={i * 200} />}
            </span>
            <span className="text-text-muted text-[10px] tracking-[0.15em] uppercase">
              {m.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
