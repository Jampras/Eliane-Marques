import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
  instagramUrl?: string;
  brandName?: string;
}

const mobileNavMeta: Record<
  string,
  { icon: React.ComponentProps<typeof Icon>['name']; eyebrow: string; description: string }
> = {
  '/sobre': {
    icon: 'info',
    eyebrow: 'Trajetoria',
    description: 'Conheca a assinatura, a base tecnica e o posicionamento.',
  },
  '/servicos': {
    icon: 'shopping_bag',
    eyebrow: 'Consultoria',
    description: 'Formatos de atendimento com foco em imagem e presenca.',
  },
  '/cursos': {
    icon: 'article',
    eyebrow: 'Formacao',
    description: 'Programas e experiencias guiadas para aprofundamento.',
  },
  '/checklists': {
    icon: 'checklist',
    eyebrow: 'Aplicacao',
    description: 'Materiais prontos para orientar rotina e padrao.',
  },
  '/materiais': {
    icon: 'image',
    eyebrow: 'Acervo',
    description: 'Conteudos autorais para consulta e repertorio.',
  },
  '/conteudos': {
    icon: 'edit_note',
    eyebrow: 'Conteudo',
    description: 'Artigos para leitura, contexto e educacao de mercado.',
  },
};

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
      <div
        className="absolute inset-0 bg-[image:var(--theme-overlay-strong)]"
        onClick={onClose}
      />

      <div className="relative flex h-full flex-col overflow-y-auto px-5 pb-8 pt-4 text-left sm:px-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--theme-overlay-border)] bg-[color:var(--theme-overlay-surface)] text-[color:var(--taupe)] transition-colors hover:border-[color:var(--argila)] hover:text-[color:var(--aveia)] sm:right-5 sm:top-5"
        >
          <Icon name="close" className="text-[24px]" />
        </button>

        <Link
          href="/"
          onClick={onClose}
          aria-label="Voltar para a pagina inicial"
          className="mx-auto mt-1 font-display text-[18px] italic tracking-[0.08em] text-[color:var(--mel)]"
        >
          {brandName}
        </Link>

        <div className="mt-7 shrink-0 border border-[color:var(--theme-overlay-border)] bg-[color:var(--theme-overlay-surface)] px-4 py-4 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[color:var(--taupe)]">
            Navegacao principal
          </p>
          <p className="mt-2 text-[12px] leading-[1.75] text-[color:var(--theme-footer-text)]">
            Acesse rapidamente o conteudo institucional, formatos e materiais.
          </p>
        </div>

        <nav className="mt-5 grid shrink-0 gap-3">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                trackAnalyticsEvent({
                  name: 'nav_click',
                  source: ANALYTICS_SOURCES.MOBILE_NAV,
                  destination: link.href,
                });
                onClose();
              }}
              className="fade-up group border border-[color:var(--theme-overlay-border)] bg-[color:var(--theme-overlay-surface)] px-4 py-4 transition-all duration-300 hover:border-[color:var(--argila)] hover:bg-[color:var(--theme-surface-overlay-soft)]"
              style={{ '--delay': `${index * 0.08}s` } as React.CSSProperties}
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--theme-overlay-border)] bg-[color:var(--theme-overlay-surface)] text-[color:var(--argila)] transition-colors group-hover:border-[color:var(--argila)] group-hover:text-[color:var(--mel)]">
                  <Icon name={mobileNavMeta[link.href]?.icon ?? 'info'} className="text-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                    {mobileNavMeta[link.href]?.eyebrow ?? 'Navegacao'}
                  </span>
                  <span className="mt-1 block font-display text-[1.45rem] leading-[1.05] text-[color:var(--aveia)]">
                    {link.name}
                  </span>
                  <span className="mt-2 block text-[11px] leading-[1.65] text-[color:var(--theme-footer-text)]">
                    {mobileNavMeta[link.href]?.description ?? ''}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-6 shrink-0 border border-[color:var(--theme-overlay-border)] bg-[color:var(--theme-overlay-surface)] px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--theme-overlay-border)] bg-[color:var(--theme-overlay-surface)] text-[color:var(--argila)]">
              <Icon name="admin_panel_settings" className="text-[17px]" />
            </span>
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Acesso rapido
              </p>
              <p className="mt-1 text-[12px] text-[color:var(--aveia)]">Painel administrativo</p>
            </div>
          </div>

          <Link
            href="/admin/login"
            onClick={onClose}
            className="mt-4 inline-flex w-full items-center justify-center rounded-[2px] border border-[color:var(--theme-overlay-border)] bg-[color:var(--theme-overlay-surface)] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[color:var(--aveia)] transition-all hover:border-[color:var(--argila)] hover:text-[color:var(--mel)]"
          >
            Entrar no painel
          </Link>
        </div>

        <div className="mt-6 grid shrink-0 gap-3 pb-4">
          <button
            type="button"
            onClick={() => {
              trackAnalyticsEvent({
                name: 'cta_click',
                source: ANALYTICS_SOURCES.MOBILE_NAV,
                destination: '/contato',
              });
              onClose();
              router.push('/contato');
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] border border-[color:var(--argila)] bg-[color:var(--theme-button-ghost-hover)] px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-[color:var(--mel)] transition-all hover:bg-[color:var(--theme-button-outline-hover-bg)]"
          >
            <Icon name="chat" className="text-[16px]" />
            Agendar consultoria
          </button>
          <a
            href={instagramUrl || 'https://instagram.com/elianemarques'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-[10px] font-[300] uppercase tracking-[0.18em] text-[color:var(--taupe)] transition-colors hover:text-[color:var(--aveia)]"
          >
            <Icon name="alternate_email" className="text-[15px]" />
            Instagram oficial
          </a>
        </div>
      </div>
    </div>
  );
};
