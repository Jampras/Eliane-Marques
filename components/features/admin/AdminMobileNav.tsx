'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Icon, type IconName } from '@/components/ui/Icon';
import { logoutAction } from '@/lib/actions/admin-auth';
import { adminMenuItems } from './adminMenuItems';

const pageTitleByPrefix: Record<string, string> = {
  '/admin/produtos': 'Produtos',
  '/admin/conteudos': 'Conteudo',
  '/admin/checklists': 'Checklists',
  '/admin/config': 'Configuracoes',
};

export const AdminMobileNav: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentTitle = useMemo(() => {
    if (pathname === '/admin') return 'Dashboard';

    const match = Object.entries(pageTitleByPrefix).find(([prefix]) => pathname.startsWith(prefix));
    return match?.[1] ?? 'Painel';
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="bg-bg/95 fixed inset-x-0 top-0 z-40 border-b border-border backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-5">
          <div className="min-w-0">
            <p className="text-text-secondary text-[9px] tracking-[0.28em] uppercase">Admin</p>
            <p className="truncate text-sm font-bold text-text-1">{currentTitle}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="admin-mobile-menu"
            aria-label="Abrir menu administrativo"
            className="bg-surface hover:text-primary grid h-10 w-10 place-items-center border border-border text-text-1 transition-colors"
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300 lg:hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <button
          type="button"
          aria-label="Fechar menu administrativo"
          onClick={() => setIsOpen(false)}
          className={cn(
            'absolute inset-0 bg-text-1/30 backdrop-blur-sm transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
        />

        <aside
          id="admin-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu administrativo"
          className={cn(
            'bg-bg absolute top-0 left-0 flex h-full w-[90%] max-w-[20rem] flex-col border-r border-border p-5 transition-transform duration-300 sm:max-w-sm sm:p-6',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-primary font-display text-2xl leading-none font-bold tracking-tighter uppercase italic">
                Eliane
              </p>
              <p className="font-display text-2xl leading-none font-bold tracking-tighter text-text-1 uppercase italic">
                Marques
              </p>
              <p className="text-text-secondary mt-3 text-[9px] tracking-[0.35em] uppercase opacity-50">
                Admin Panel
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
              className="hover:text-primary text-text-muted shrink-0 transition-colors"
            >
              <Icon name="close" className="text-3xl" />
            </button>
          </div>

          <nav className="space-y-1 overflow-y-auto pr-1">
            {adminMenuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 border border-transparent px-4 py-3 text-[10px] font-bold tracking-[0.18em] uppercase transition-colors sm:text-[11px] sm:tracking-[0.2em]',
                    isActive
                      ? 'text-primary border-primary/30 bg-primary/5'
                      : 'text-text-2 hover:bg-primary/5 hover:text-text-1'
                  )}
                >
                  <Icon name={item.icon as IconName} className="!text-[20px]" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-3 border border-red-500/15 px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-red-500/80 uppercase transition-all hover:bg-red-500/5 hover:text-red-400"
            >
              <Icon name="logout" className="!text-[18px]" />
              Sair
            </button>
          </form>
        </aside>
      </div>
    </>
  );
};
