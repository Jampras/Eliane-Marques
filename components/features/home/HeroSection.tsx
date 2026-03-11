'use client';

import type { CSSProperties } from 'react';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/shared/whatsapp/WhatsAppButton';

interface HeroSectionProps {
  waConfig?: { number: string; defaultMessage: string };
  headline?: string;
  subheadline?: string;
}

const DEFAULT_HEADLINE = 'Sua imagem ja tem valor. Vamos fazer esse valor ser percebido.';
const DEFAULT_SUBHEADLINE =
  'Consultoria de etiqueta, imagem e presenca para mulheres que desejam transmitir refinamento, confianca e autoridade com suavidade, firmeza e identidade.';

const metrics = [
  { value: '150+', label: 'clientes' },
  { value: '8', label: 'anos' },
  { value: '12', label: 'cursos' },
];

const highlightedWords = new Set(['valor', 'percebido', 'reconhecida']);

function renderHeadline(text: string) {
  return text.split(/(\s+)/).map((token, index) => {
    const normalized = token.toLowerCase().replace(/[^a-zà-ÿ]/gi, '');

    if (highlightedWords.has(normalized)) {
      return (
        <span key={`${token}-${index}`} className="italic text-[color:var(--argila)]">
          {token}
        </span>
      );
    }

    return <React.Fragment key={`${token}-${index}`}>{token}</React.Fragment>;
  });
}

export function HeroSection({ waConfig, headline, subheadline }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_at_80%_20%,#E8D5C4,transparent_55%),radial-gradient(ellipse_at_10%_80%,rgba(168,184,154,0.15),transparent_50%),var(--aveia)]"
    >
      <div className="relative mx-auto max-w-[920px] px-4 py-[40px] sm:px-5 sm:py-[44px] md:px-8 md:py-[48px] lg:px-10 lg:py-[60px] xl:px-12 xl:py-[76px]">
        <div
          className="fade-up absolute right-[-7rem] top-1/2 hidden -translate-y-1/2 rotate-[-90deg] whitespace-nowrap font-ornament text-[6rem] leading-none text-[color:var(--linho)]/70 xl:block"
          style={{ '--delay': '0.35s' } as CSSProperties}
        >
          ELIANE MARQUES
        </div>

        <div className="fade-up" style={{ '--delay': '0s' } as CSSProperties}>
          <div className="inline-flex w-full max-w-full items-center justify-center gap-3 border border-[color:var(--linho)] px-4 py-3 text-center sm:w-auto sm:justify-start sm:px-5">
            <span className="h-[6px] w-[6px] rounded-full bg-[color:var(--argila)]" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-[color:var(--taupe)]">
              Etiqueta . imagem . presenca social
            </span>
          </div>
        </div>

        <h1
          className="fade-up mt-8 max-w-[16ch] text-[clamp(2.5rem,11vw,5.2rem)] font-normal leading-[1.05] text-[color:var(--espresso)] sm:max-w-[14ch] lg:mt-10"
          style={{ '--delay': '0.1s' } as CSSProperties}
        >
          {renderHeadline(headline || DEFAULT_HEADLINE)}
        </h1>

        <div className="fade-up mt-7 inline-flex" style={{ '--delay': '0.2s' } as CSSProperties}>
          <div className="atelier-divider">
            <span />
          </div>
        </div>

        <p
          className="fade-up mt-7 max-w-[520px] text-[14px] font-[300] leading-[1.85] text-[color:var(--taupe)]"
          style={{ '--delay': '0.3s' } as CSSProperties}
        >
          {subheadline || DEFAULT_SUBHEADLINE}
        </p>

        <div
          className="fade-up mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10"
          style={{ '--delay': '0.4s' } as CSSProperties}
        >
          <WhatsAppButton
            number={waConfig?.number || ''}
            template="Ola Eliane! Quero meu diagnostico de posicionamento para alinhar minha imagem ao meu nivel atual."
            label="Quero meu diagnostico"
            className="w-full sm:w-auto"
            size="lg"
          />
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() =>
              document.getElementById('investimentos')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
          >
            Ver opcoes
          </Button>
        </div>

        <div
          className="fade-up mt-9 border-t border-[color:var(--linho)] pt-6"
          style={{ '--delay': '0.5s' } as CSSProperties}
        >
          <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-8 md:gap-10">
            {metrics.map((item) => (
              <div key={item.label} className="min-w-0">
                <div className="font-display text-[2rem] leading-none text-[color:var(--espresso)] md:text-[2.2rem]">
                  {item.value}
                </div>
                <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
