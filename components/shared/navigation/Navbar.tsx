'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';
import { MobileNav } from './MobileNav';

interface NavbarProps {
  brandName?: string;
  instagramUrl?: string;
}

const navLinks = [
  { name: 'Sobre', href: '/sobre' },
  { name: 'Servicos', href: '/servicos' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'Checklists', href: '/checklists' },
  { name: 'Materiais', href: '/materiais' },
  { name: 'Blog', href: '/conteudos' },
];

export const Navbar: React.FC<NavbarProps> = ({ brandName = 'Eliane Marques', instagramUrl }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    [...navLinks.map((link) => link.href), '/contato'].forEach((href) => router.prefetch(href));
  }, [router]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`transition-all duration-300 ${
            scrolled ? 'bg-[rgba(58,36,24,0.96)] shadow-[0_2px_20px_rgba(0,0,0,0.15)] backdrop-blur-[8px]' : 'bg-[color:var(--espresso)]'
          }`}
        >
          <Container className="relative flex h-[56px] items-center justify-between md:h-[64px]">
            <Link href="/" className="hidden xl:block font-display text-[18px] italic tracking-[0.08em] text-[color:var(--mel)]">
              {brandName}
            </Link>

            <nav className="hidden items-center gap-6 xl:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-active={active}
                    onClick={() =>
                      trackAnalyticsEvent({
                        name: 'nav_click',
                        source: ANALYTICS_SOURCES.NAVBAR,
                        destination: link.href,
                      })
                    }
                    className="nav-underline text-[11px] font-[300] uppercase tracking-[0.18em] text-[color:var(--taupe)] transition-colors hover:text-[color:var(--aveia)]"
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 xl:flex">
              <Link
                href="/admin/login"
                aria-label="Entrar no painel administrativo"
                className="inline-flex h-9 min-w-9 items-center justify-center border border-[color:var(--linho)] text-[color:var(--taupe)] transition-colors hover:border-[color:var(--argila)] hover:text-[color:var(--argila)]"
              >
                <Icon name="admin_panel_settings" className="text-[18px]" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  trackAnalyticsEvent({
                    name: 'cta_click',
                    source: ANALYTICS_SOURCES.NAVBAR,
                    destination: '/contato',
                  });
                  router.push('/contato');
                }}
                className="inline-flex rounded-[2px] border border-[color:var(--argila)] px-[18px] py-[8px] text-[11px] font-[400] uppercase tracking-[0.18em] text-[color:var(--argila)] transition-colors hover:bg-[rgba(184,132,90,0.08)]"
              >
                Agendar consultoria
              </button>
            </div>

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 font-display text-[16px] italic tracking-[0.08em] text-[color:var(--mel)] md:text-[17px] xl:hidden"
            >
              {brandName}
            </Link>

            <button
              type="button"
              className="ml-auto inline-flex h-10 w-10 flex-col items-center justify-center gap-[5px] xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <span className="h-px w-5 bg-[color:var(--taupe)]" />
              <span className="h-px w-5 bg-[color:var(--taupe)]" />
              <span className="h-px w-5 bg-[color:var(--taupe)]" />
            </button>
          </Container>
          <div className="h-px bg-[linear-gradient(to_right,transparent,rgba(200,146,58,0.3),transparent)]" />
        </div>
      </header>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
        instagramUrl={instagramUrl}
        brandName={brandName}
      />
    </>
  );
};
