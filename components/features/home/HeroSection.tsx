'use client';

import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/shared/whatsapp/WhatsAppButton';
import { trackAnalyticsEvent } from '@/lib/analytics/client';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

interface HeroSectionProps {
  waConfig?: { number: string; defaultMessage: string };
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  trustText?: string;
  heroImage?: string | null;
  authoritySummary?: {
    specializationCount: number;
    credentialCount: number;
    milestoneCount: number;
  };
}

const LEGACY_HEADLINE = 'Sua imagem ja tem valor. Vamos fazer esse valor ser percebido.';
const LEGACY_SUBHEADLINE =
  'Consultoria de etiqueta, imagem e presenca para mulheres que desejam transmitir refinamento, confianca e autoridade com suavidade, firmeza e identidade.';
const DEFAULT_HEADLINE =
  'Sua imagem precisa sustentar o nivel que voce ja entrega.';
const DEFAULT_SUBHEADLINE =
  'Consultoria de imagem, etiqueta e presenca para mulheres que precisam de mais clareza, coerencia e leitura de valor.';
const DEFAULT_EYEBROW = 'Imagem . etiqueta . presenca';
const DEFAULT_PRIMARY_CTA = 'Quero meu diagnostico estrategico';
const DEFAULT_SECONDARY_CTA = 'Ver formatos de atendimento';
const DEFAULT_TRUST_TEXT = 'Sem compromisso. Resposta inicial em ate 24h uteis.';

const baseMetrics = [
  { value: '150+', label: 'atendimentos' },
  { value: '8', label: 'anos de atuacao' },
];

const highlightedWords = new Set(['valor', 'subestimado', 'percebido', 'reconhecida']);

function renderHeadlineTokens(text: string) {
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

function renderHeadline(text: string) {
  return text
    .split(', ')
    .filter(Boolean)
    .map((line, index, lines) => (
      <span
        key={`${line}-${index}`}
        className="hero-line-reveal block overflow-hidden"
        style={{ ['--line-delay' as string]: `${0.12 + index * 0.08}s` }}
      >
        <span className="hero-line-reveal-inner block">
          {renderHeadlineTokens(index < lines.length - 1 ? `${line},` : line)}
        </span>
      </span>
    ));
}

function resolveHeroCopy(headline?: string, subheadline?: string) {
  const normalizedHeadline = headline?.trim() || '';
  const normalizedSubheadline = subheadline?.trim() || '';
  const headlineHasStrategicSpecificity =
    normalizedHeadline.length >= 55 &&
    /(imagem|presenca|valor|autoridade|percepcao)/i.test(normalizedHeadline);
  const subheadlineHasStrategicSpecificity =
    normalizedSubheadline.length >= 110 &&
    /(executivas|empresarias|liderancas|mulheres|autoridade|valor)/i.test(
      normalizedSubheadline
    );

  return {
    headline:
      !headline ||
      normalizedHeadline === '' ||
      normalizedHeadline === LEGACY_HEADLINE ||
      !headlineHasStrategicSpecificity
        ? DEFAULT_HEADLINE
        : headline,
    subheadline:
      !subheadline ||
      normalizedSubheadline === '' ||
      normalizedSubheadline === LEGACY_SUBHEADLINE ||
      !subheadlineHasStrategicSpecificity
        ? DEFAULT_SUBHEADLINE
        : subheadline,
  };
}

function AnimatedMetric({ value }: { value: string }) {
  const numeric = Number.parseInt(value.replace(/[^\d]/g, ''), 10);
  const suffix = value.replace(/[\d]/g, '');
  const [displayValue, setDisplayValue] = useState(numeric > 0 ? 0 : value);

  useEffect(() => {
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setDisplayValue(value);
      return;
    }

    const duration = 900;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const nextValue = Math.max(1, Math.round(numeric * eased));
      setDisplayValue(`${nextValue}${suffix}`);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [numeric, suffix, value]);

  return <>{displayValue}</>;
}

export function HeroSection({
  waConfig,
  eyebrow,
  headline,
  subheadline,
  primaryCtaLabel,
  secondaryCtaLabel,
  trustText,
  heroImage,
  authoritySummary,
}: HeroSectionProps) {
  const heroCopy = resolveHeroCopy(headline, subheadline);
  const metrics = [
    ...baseMetrics,
    {
      value:
        authoritySummary && authoritySummary.credentialCount > 0
          ? String(authoritySummary.credentialCount)
          : '3',
      label:
        authoritySummary && authoritySummary.credentialCount > 0 ? 'credenciais' : 'eixos tecnicos',
    },
  ];
  const resolvedEyebrow = eyebrow?.trim() || DEFAULT_EYEBROW;
  const resolvedPrimaryCtaLabel = primaryCtaLabel?.trim() || DEFAULT_PRIMARY_CTA;
  const resolvedSecondaryCtaLabel = secondaryCtaLabel?.trim() || DEFAULT_SECONDARY_CTA;
  const resolvedTrustText = trustText?.trim() || DEFAULT_TRUST_TEXT;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[image:var(--theme-hero-bg)]"
    >
      <div className="relative mx-auto max-w-[1160px] px-4 py-[28px] sm:px-5 sm:py-[34px] md:px-8 md:py-[44px] lg:px-10 lg:py-[56px] xl:px-12 xl:py-[72px]">
        <div
          className="fade-up absolute right-[-7rem] top-1/2 hidden -translate-y-1/2 rotate-[-90deg] whitespace-nowrap font-ornament text-[6rem] leading-none text-[color:var(--linho)]/70 xl:block"
          style={{ '--delay': '0.35s' } as CSSProperties}
        >
          ELIANE MARQUES
        </div>

        <div className="grid gap-6 lg:hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_132px] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_176px] sm:gap-5">
            <div className="fade-up" style={{ '--delay': '0s' } as CSSProperties}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--linho)] bg-[color:var(--theme-panel-soft)] px-3 py-2 text-center sm:gap-3 sm:px-4">
                <span className="h-[6px] w-[6px] rounded-full bg-[color:var(--argila)]" />
                <span className="text-[8px] uppercase tracking-[0.16em] text-[color:var(--taupe)] sm:text-[9px] sm:tracking-[0.18em]">
                  {resolvedEyebrow}
                </span>
              </div>

              <h1 className="mt-4 max-w-[7.2ch] text-[clamp(1.2rem,8.7vw,3.6rem)] font-normal leading-[0.98] text-[color:var(--espresso)] sm:mt-5 sm:max-w-[8.2ch] sm:text-[clamp(1.9rem,8vw,4.4rem)]">
                {renderHeadline(heroCopy.headline)}
              </h1>
            </div>

            <div className="fade-up min-w-0" style={{ '--delay': '0.18s' } as CSSProperties}>
              <div className="relative ml-auto w-full overflow-hidden border border-[color:var(--linho)] bg-[color:var(--manteiga)] p-2.5 shadow-[var(--theme-card-shadow-strong)] sm:p-4">
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 bg-[radial-gradient(circle,var(--theme-hero-image-glow),transparent_68%)] blur-2xl" />
                <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--linho)] bg-[color:var(--aveia)]">
                  {heroImage ? (
                    <Image
                      src={heroImage}
                      alt="Retrato profissional de Eliane Marques"
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[image:var(--theme-hero-image-bg)] px-4 text-center">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                          Presenca executiva
                        </p>
                        <p className="mt-3 max-w-[12ch] text-[11px] uppercase tracking-[0.16em] text-[color:var(--taupe)]">
                          Defina uma imagem no painel Home
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2.5 border border-[color:var(--linho)] bg-[color:var(--theme-panel-soft)] px-3 py-3 sm:mt-4 sm:px-4 sm:py-4">
                  <p className="text-[8px] uppercase tracking-[0.16em] text-[color:var(--argila)] sm:text-[9px] sm:tracking-[0.18em]">
                    Consultoria autoral
                  </p>
                  <p className="mt-2 text-[10px] leading-[1.65] text-[color:var(--taupe)] sm:mt-3 sm:text-[12px] sm:leading-[1.8]">
                    Clareza, criterio e presenca alinhados ao seu momento profissional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="fade-up mt-4 inline-flex lg:mt-6" style={{ '--delay': '0.2s' } as CSSProperties}>
              <div className="atelier-divider">
                <span />
              </div>
            </div>

            <p
              className="fade-up mt-4 max-w-[44ch] text-[11px] font-[300] leading-[1.75] text-[color:var(--taupe)] sm:text-[13px] lg:mt-5 lg:max-w-[520px] lg:text-[14px]"
              style={{ '--delay': '0.3s' } as CSSProperties}
            >
              {heroCopy.subheadline}
            </p>

            <div
              className="fade-up mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3 lg:mt-8"
              style={{ '--delay': '0.4s' } as CSSProperties}
            >
              <WhatsAppButton
                number={waConfig?.number || ''}
                template="Ola Eliane! Quero entender qual formato faz mais sentido para alinhar minha imagem, minha presenca e a forma como meu valor esta sendo percebido."
                label={resolvedPrimaryCtaLabel}
                className="w-full sm:w-auto"
                size="lg"
                analyticsSource={ANALYTICS_SOURCES.HOME_HERO}
              />
              <Button
                variant="outline"
                size="lg"
                className="w-full border-[color:var(--argila)] bg-[color:var(--creme-rosa)] text-[color:var(--espresso)] shadow-[var(--theme-button-outline-shadow)] hover:border-[color:var(--cacau)] hover:bg-[color:var(--manteiga)] sm:w-auto"
                onClick={() => {
                  trackAnalyticsEvent({
                    name: 'cta_click',
                    source: ANALYTICS_SOURCES.HOME_HERO,
                    destination: '#formatos',
                  });
                  document.getElementById('formatos')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
              >
                {resolvedSecondaryCtaLabel}
              </Button>
            </div>

            <p
              className="fade-up mt-3 max-w-[42ch] text-[9px] uppercase tracking-[0.12em] text-[color:var(--taupe)] sm:text-[10px] sm:tracking-[0.14em] lg:max-w-[520px]"
              style={{ '--delay': '0.45s' } as CSSProperties}
            >
              {resolvedTrustText}
            </p>

            <div
              className="fade-up mt-6 border-t border-[color:var(--linho)] pt-4"
              style={{ '--delay': '0.5s' } as CSSProperties}
            >
              <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-8 md:gap-10">
                {metrics.map((item) => (
                  <div key={item.label} className="min-w-0">
                    <div className="font-display text-[2rem] leading-none text-[color:var(--espresso)] md:text-[2.2rem]">
                      <AnimatedMetric value={item.value} />
                    </div>
                    <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(360px,460px)]">
          <div className="min-w-0">
            <div className="fade-up" style={{ '--delay': '0s' } as CSSProperties}>
              <div className="inline-flex items-center gap-3 rounded-full border border-[color:var(--linho)] bg-[color:var(--theme-panel-soft)] px-4 py-2 text-center">
                <span className="h-[6px] w-[6px] rounded-full bg-[color:var(--argila)]" />
                <span className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                  {resolvedEyebrow}
                </span>
              </div>
            </div>

            <h1 className="mt-7 max-w-[12ch] text-[clamp(3.2rem,5.6vw,5rem)] font-normal leading-[0.98] text-[color:var(--espresso)]">
              {renderHeadline(heroCopy.headline)}
            </h1>

            <div className="fade-up mt-6 inline-flex" style={{ '--delay': '0.2s' } as CSSProperties}>
              <div className="atelier-divider">
                <span />
              </div>
            </div>

            <p
              className="fade-up mt-5 max-w-[520px] text-[14px] font-[300] leading-[1.8] text-[color:var(--taupe)]"
              style={{ '--delay': '0.3s' } as CSSProperties}
            >
              {heroCopy.subheadline}
            </p>

            <div
              className="fade-up mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ '--delay': '0.4s' } as CSSProperties}
            >
              <WhatsAppButton
                number={waConfig?.number || ''}
                template="Ola Eliane! Quero entender qual formato faz mais sentido para alinhar minha imagem, minha presenca e a forma como meu valor esta sendo percebido."
                label={resolvedPrimaryCtaLabel}
                className="w-full sm:w-auto"
                size="lg"
                analyticsSource={ANALYTICS_SOURCES.HOME_HERO}
              />
              <Button
                variant="outline"
                size="lg"
                className="w-full border-[color:var(--argila)] bg-[color:var(--creme-rosa)] text-[color:var(--espresso)] shadow-[var(--theme-button-outline-shadow)] hover:border-[color:var(--cacau)] hover:bg-[color:var(--manteiga)] sm:w-auto"
                onClick={() => {
                  trackAnalyticsEvent({
                    name: 'cta_click',
                    source: ANALYTICS_SOURCES.HOME_HERO,
                    destination: '#formatos',
                  });
                  document.getElementById('formatos')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
              >
                {resolvedSecondaryCtaLabel}
              </Button>
            </div>

            <p
              className="fade-up mt-3 max-w-[520px] text-[10px] uppercase tracking-[0.14em] text-[color:var(--taupe)]"
              style={{ '--delay': '0.45s' } as CSSProperties}
            >
              {resolvedTrustText}
            </p>

            <div
              className="fade-up mt-6 border-t border-[color:var(--linho)] pt-4"
              style={{ '--delay': '0.5s' } as CSSProperties}
            >
              <div className="grid grid-cols-3 gap-4 md:gap-10">
                {metrics.map((item) => (
                  <div key={item.label} className="min-w-0">
                    <div className="font-display text-[2.2rem] leading-none text-[color:var(--espresso)]">
                      <AnimatedMetric value={item.value} />
                    </div>
                    <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fade-up min-w-0" style={{ '--delay': '0.18s' } as CSSProperties}>
            <div className="relative ml-auto w-full max-w-[420px] overflow-hidden border border-[color:var(--linho)] bg-[color:var(--manteiga)] p-5 shadow-[var(--theme-card-shadow-strong)]">
              <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 bg-[radial-gradient(circle,var(--theme-hero-image-glow),transparent_68%)] blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--linho)] bg-[color:var(--aveia)]">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt="Retrato profissional de Eliane Marques"
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[image:var(--theme-hero-image-bg)] px-8 text-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                        Presenca executiva
                      </p>
                      <p className="mt-4 max-w-[14ch] text-[12px] uppercase tracking-[0.16em] text-[color:var(--taupe)]">
                        Defina uma imagem no painel Home
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 border border-[color:var(--linho)] bg-[color:var(--theme-panel-soft)] px-4 py-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                  Consultoria autoral
                </p>
                <p className="mt-3 text-[12px] leading-[1.8] text-[color:var(--taupe)]">
                  Clareza, criterio e presenca alinhados ao seu momento profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
