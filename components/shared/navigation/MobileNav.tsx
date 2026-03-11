import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
  instagramUrl?: string;
  brandName?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  links,
  instagramUrl,
  brandName = 'Eliane Marques',
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <div
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegacao"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-[color:var(--espresso)]" onClick={onClose} />

      <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex h-10 w-10 items-center justify-center text-[color:var(--taupe)]"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[28px]">
            close
          </span>
        </button>

        <Link
          href="/"
          onClick={onClose}
          className="absolute top-4 left-1/2 sm:top-5 -translate-x-1/2 font-display text-[18px] italic tracking-[0.08em] text-[color:var(--mel)]"
        >
          {brandName}
        </Link>

        <nav className="flex flex-col items-center gap-5 sm:gap-6">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="fade-up font-display text-[1.65rem] sm:text-[1.85rem] text-[color:var(--aveia)]"
              style={{ '--delay': `${index * 0.08}s` } as React.CSSProperties}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex w-full max-w-xs flex-col items-center gap-4 sm:mt-10 sm:gap-5">
          <Link
            href="/admin/login"
            onClick={onClose}
            className="text-[10px] font-[300] uppercase tracking-[0.18em] text-[color:var(--taupe)] transition-colors hover:text-[color:var(--aveia)]"
          >
            Painel administrativo
          </Link>

          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/contato');
            }}
            className="w-full rounded-[2px] border border-[color:var(--argila)] px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-[color:var(--argila)]"
          >
            Agendar consultoria
          </button>
          <a
            href={instagramUrl || 'https://instagram.com/elianemarques'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-[300] uppercase tracking-[0.18em] text-[color:var(--taupe)]"
          >
            Instagram oficial
          </a>
        </div>
      </div>
    </div>
  );
};