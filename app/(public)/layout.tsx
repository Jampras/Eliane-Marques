import React from 'react';
import Link from 'next/link';
import { SiteAmbientCanvas } from '@/components/shared/layout/SiteAmbientCanvas';
import { Navbar } from '@/components/shared/navigation/Navbar';
import { FloatingWhatsAppButton } from '@/components/shared/whatsapp/FloatingWhatsAppButton';
import { Icon } from '@/components/ui/Icon';
import { buildDirectContactWhatsAppUrl } from '@/lib/contact/whatsapp-intents';
import { CONTACT } from '@/lib/core/constants';
import { getWhatsAppConfig } from '@/lib/data/config';
import { getSiteIdentity } from '@/lib/data/site';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [site, waConfig] = await Promise.all([getSiteIdentity(), getWhatsAppConfig()]);
  const whatsappUrl = buildDirectContactWhatsAppUrl({
    number: waConfig.number || CONTACT.defaultPhone,
    message: waConfig.defaultMessage || CONTACT.defaultMessage,
  });

  return (
    <div className="relative isolate bg-bg text-text-primary selection:bg-primary min-h-screen font-sans antialiased selection:text-white">
      <SiteAmbientCanvas />
      <div className="relative z-[1] flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:border focus:border-[color:var(--linho)] focus:bg-[color:var(--aveia)] focus:px-4 focus:py-2 focus:text-[10px] focus:uppercase focus:tracking-[0.18em] focus:text-[color:var(--espresso)]"
      >
        Pular para o conteudo
      </a>
      <Navbar brandName={site.siteName} instagramUrl={site.instagramUrl} />
      <main id="main-content" className="flex-grow pt-[56px] md:pt-[64px]">
        {children}
      </main>
      <footer className="relative mt-auto bg-[color:var(--theme-footer-bg)] px-4 pb-10 pt-10 text-[color:var(--theme-footer-text)] sm:px-5 md:px-6 lg:px-8 lg:pt-12 xl:px-12 xl:pt-14">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,var(--theme-footer-divider),transparent)]" />
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-10 xl:gap-12">
            <div className="pr-0 lg:pr-8">
              <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-[color:var(--theme-footer-muted)]">
                Consultoria de imagem e etiqueta corporativa
              </p>
              <h2 className="font-display text-[2rem] italic text-[color:var(--theme-footer-accent)]">
                {site.siteName}
              </h2>
              <p className="mt-4 max-w-md text-[13px] font-[300] leading-[1.85] text-[color:var(--theme-footer-text)]">
                Refinamento de imagem, comportamento e etiqueta para construir uma presenca coerente, sofisticada e confiavel no ambiente profissional.
              </p>
            </div>

            <div className="border-t border-[color:var(--theme-footer-border)] pt-6 md:border-t-0 md:border-l md:pl-6 md:pt-0 lg:pl-8">
              <h5 className="mb-4 text-[10px] uppercase tracking-[0.18em] text-[color:var(--theme-footer-strong)]">
                Navegacao
              </h5>
              <ul className="space-y-3 text-[11px] font-[300] uppercase tracking-[0.16em]">
                <li><Link href="/servicos" className="transition-colors hover:text-[color:var(--theme-footer-strong)]">Servicos</Link></li>
                <li><Link href="/cursos" className="transition-colors hover:text-[color:var(--theme-footer-strong)]">Cursos</Link></li>
                <li><Link href="/checklists" className="transition-colors hover:text-[color:var(--theme-footer-strong)]">Checklists</Link></li>
                <li><Link href="/materiais" className="transition-colors hover:text-[color:var(--theme-footer-strong)]">Materiais</Link></li>
                <li><Link href="/conteudos" className="transition-colors hover:text-[color:var(--theme-footer-strong)]">Blog</Link></li>
              </ul>
            </div>

            <div className="border-t border-[color:var(--theme-footer-border)] pt-6 md:border-t-0 md:border-l md:pl-6 md:pt-0 lg:pl-8">
              <h5 className="mb-4 text-[10px] uppercase tracking-[0.18em] text-[color:var(--theme-footer-strong)]">
                Contato
              </h5>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--theme-footer-border)] bg-[color:var(--theme-overlay-surface)] text-[color:var(--theme-footer-strong)] transition-all hover:border-[color:var(--theme-footer-accent)] hover:text-[color:var(--theme-footer-accent)]"
                >
                  <Icon name="chat" className="text-[18px]" />
                </a>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram oficial"
                  className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--theme-footer-border)] bg-[color:var(--theme-overlay-surface)] text-[color:var(--theme-footer-strong)] transition-all hover:border-[color:var(--theme-footer-accent)] hover:text-[color:var(--theme-footer-accent)]"
                >
                  <Icon name="alternate_email" className="text-[18px]" />
                </a>
                <a
                  href={`mailto:${site.contactEmail}`}
                  aria-label="Enviar email"
                  className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--theme-footer-border)] bg-[color:var(--theme-overlay-surface)] text-[color:var(--theme-footer-strong)] transition-all hover:border-[color:var(--theme-footer-accent)] hover:text-[color:var(--theme-footer-accent)]"
                >
                  <Icon name="mail" className="text-[18px]" />
                </a>
              </div>
              <p className="mt-4 max-w-[240px] text-[11px] font-[300] leading-[1.8] text-[color:var(--theme-footer-text)]">
                Prefira WhatsApp ou Instagram para a primeira conversa. O email continua disponivel,
                mas deixa de ser o ponto principal da pagina.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-[color:var(--theme-footer-border)] pt-5 text-[10px] font-[200] uppercase tracking-[0.16em] text-[color:var(--theme-footer-muted)]">
            &copy; {new Date().getFullYear()} {site.siteName.toUpperCase()}. Todos os direitos reservados.
          </div>
        </div>
      </footer>
      <FloatingWhatsAppButton
        phone={waConfig.number || CONTACT.defaultPhone}
        message={waConfig.defaultMessage || CONTACT.defaultMessage}
      />
      </div>
    </div>
  );
}
