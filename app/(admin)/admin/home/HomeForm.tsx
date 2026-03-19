'use client';

import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui/Typography';
import { useToast } from '@/components/ui/ToastProvider';
import { AdminInlineNotice } from '@/components/features/admin/AdminInlineNotice';
import { AdminMobileFormBar } from '@/components/features/admin/AdminMobileFormBar';
import { ImageUpload } from '@/components/features/admin/ImageUpload';
import {
  ADMIN_FORM_PANEL_CLASS,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SELECT_CLASS,
  ADMIN_TEXTAREA_CLASS,
} from '@/components/features/admin/formStyles';
import { upsertInstitutionalHomePage } from '@/lib/institutional/home-actions';

type ValueTone = 'NEGATIVE' | 'POSITIVE';

interface HomeAudienceItemInput {
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  sortOrder: number;
}

interface HomeValueItemInput {
  badge: string;
  title: string;
  bullets: string[];
  tone: ValueTone;
  imageUrl: string;
  sortOrder: number;
}

interface HomeMethodStepInput {
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

interface HomeFaqItemInput {
  question: string;
  answer: string;
  sortOrder: number;
}

interface HomeFormValue {
  heroEyebrow: string;
  heroPanelImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroSecondaryCtaLabel: string;
  heroTrustText: string;
  audienceTitle: string;
  audienceSubtitle: string;
  valueTitle: string;
  valueSubtitle: string;
  valueCtaLabel: string;
  methodTitle: string;
  methodSubtitle: string;
  methodCtaLabel: string;
  faqTitle: string;
  faqSubtitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  finalCtaScarcityText: string;
  finalCtaLabel: string;
  finalWhatsappMessage: string;
  audienceItems: HomeAudienceItemInput[];
  valueItems: HomeValueItemInput[];
  methodSteps: HomeMethodStepInput[];
  faqItems: HomeFaqItemInput[];
}

function SectionHeader({
  badge,
  title,
  description,
  count,
}: {
  badge: string;
  title: string;
  description: string;
  count?: string;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Badge className="mb-4">{badge}</Badge>
        <Heading as="h2" className="text-2xl sm:text-3xl">
          {title}
        </Heading>
        <Text className="mt-2 max-w-3xl">{description}</Text>
      </div>
      {count ? (
        <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
          {count}
        </div>
      ) : null}
    </div>
  );
}

function bulletsToText(bullets: string[]) {
  return bullets.join('\n');
}

function textToBullets(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeAudienceItems(items: HomeAudienceItemInput[]) {
  return items.map((item, index) => ({
    title: item.title.trim(),
    description: item.description.trim(),
    icon: item.icon.trim() || undefined,
    imageUrl: item.imageUrl.trim() || undefined,
    sortOrder: index,
  }));
}

function normalizeValueItems(items: HomeValueItemInput[]) {
  return items.map((item, index) => ({
    badge: item.badge.trim() || undefined,
    title: item.title.trim(),
    bullets: item.bullets.map((bullet) => bullet.trim()).filter(Boolean),
    tone: item.tone,
    imageUrl: item.imageUrl.trim() || undefined,
    sortOrder: index,
  }));
}

function normalizeMethodSteps(items: HomeMethodStepInput[]) {
  return items.map((item, index) => ({
    title: item.title.trim(),
    description: item.description.trim(),
    imageUrl: item.imageUrl.trim() || undefined,
    sortOrder: index,
  }));
}

function normalizeFaqItems(items: HomeFaqItemInput[]) {
  return items.map((item, index) => ({
    question: item.question.trim(),
    answer: item.answer.trim(),
    sortOrder: index,
  }));
}

export default function HomeForm({ initialValue }: { initialValue: HomeFormValue }) {
  const formId = 'admin-home-form';
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    variant: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);
  const [heroEyebrow, setHeroEyebrow] = useState(initialValue.heroEyebrow);
  const [heroPanelImage, setHeroPanelImage] = useState(initialValue.heroPanelImage);
  const [heroTitle, setHeroTitle] = useState(initialValue.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(initialValue.heroSubtitle);
  const [heroPrimaryCtaLabel, setHeroPrimaryCtaLabel] = useState(initialValue.heroPrimaryCtaLabel);
  const [heroSecondaryCtaLabel, setHeroSecondaryCtaLabel] = useState(
    initialValue.heroSecondaryCtaLabel
  );
  const [heroTrustText, setHeroTrustText] = useState(initialValue.heroTrustText);
  const [audienceTitle, setAudienceTitle] = useState(initialValue.audienceTitle);
  const [audienceSubtitle, setAudienceSubtitle] = useState(initialValue.audienceSubtitle);
  const [valueTitle, setValueTitle] = useState(initialValue.valueTitle);
  const [valueSubtitle, setValueSubtitle] = useState(initialValue.valueSubtitle);
  const [valueCtaLabel, setValueCtaLabel] = useState(initialValue.valueCtaLabel);
  const [methodTitle, setMethodTitle] = useState(initialValue.methodTitle);
  const [methodSubtitle, setMethodSubtitle] = useState(initialValue.methodSubtitle);
  const [methodCtaLabel, setMethodCtaLabel] = useState(initialValue.methodCtaLabel);
  const [faqTitle, setFaqTitle] = useState(initialValue.faqTitle);
  const [faqSubtitle, setFaqSubtitle] = useState(initialValue.faqSubtitle);
  const [finalCtaTitle, setFinalCtaTitle] = useState(initialValue.finalCtaTitle);
  const [finalCtaSubtitle, setFinalCtaSubtitle] = useState(initialValue.finalCtaSubtitle);
  const [finalCtaScarcityText, setFinalCtaScarcityText] = useState(
    initialValue.finalCtaScarcityText
  );
  const [finalCtaLabel, setFinalCtaLabel] = useState(initialValue.finalCtaLabel);
  const [finalWhatsappMessage, setFinalWhatsappMessage] = useState(
    initialValue.finalWhatsappMessage
  );
  const [audienceItems, setAudienceItems] = useState(initialValue.audienceItems);
  const [valueItems, setValueItems] = useState(initialValue.valueItems);
  const [methodSteps, setMethodSteps] = useState(initialValue.methodSteps);
  const [faqItems, setFaqItems] = useState(initialValue.faqItems);

  const totalBlocks = useMemo(
    () => audienceItems.length + valueItems.length + methodSteps.length + faqItems.length,
    [audienceItems.length, valueItems.length, methodSteps.length, faqItems.length]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const result = await upsertInstitutionalHomePage({
        heroEyebrow,
        heroPanelImage,
        heroTitle,
        heroSubtitle,
        heroPrimaryCtaLabel,
        heroSecondaryCtaLabel,
        heroTrustText,
        audienceTitle,
        audienceSubtitle,
        valueTitle,
        valueSubtitle,
        valueCtaLabel,
        methodTitle,
        methodSubtitle,
        methodCtaLabel,
        faqTitle,
        faqSubtitle,
        finalCtaTitle,
        finalCtaSubtitle,
        finalCtaScarcityText,
        finalCtaLabel,
        finalWhatsappMessage,
        audienceItems: normalizeAudienceItems(audienceItems),
        valueItems: normalizeValueItems(valueItems),
        methodSteps: normalizeMethodSteps(methodSteps),
        faqItems: normalizeFaqItems(faqItems),
      });

      if (result.success) {
        const description = 'A home publica ja foi revalidada com o novo conteudo.';
        showToast({ variant: 'success', title: 'Home atualizada', description });
        setFeedback({ variant: 'success', title: 'Home atualizada', description });
        return;
      }

      const description = result.error || 'Revise os campos e tente novamente.';
      showToast({ variant: 'error', title: 'Nao foi possivel salvar', description });
      setFeedback({ variant: 'error', title: 'Nao foi possivel salvar', description });
    } catch (error) {
      console.error(error);
      const description = 'Tente novamente em instantes.';
      showToast({ variant: 'error', title: 'Erro ao salvar home', description });
      setFeedback({ variant: 'error', title: 'Erro ao salvar home', description });
    } finally {
      setLoading(false);
    }
  }

  function updateAudience(index: number, field: keyof HomeAudienceItemInput, value: string | number) {
    setAudienceItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function updateValue(
    index: number,
    field: keyof HomeValueItemInput,
    value: string | string[] | ValueTone
  ) {
    setValueItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function updateStep(index: number, field: keyof HomeMethodStepInput, value: string | number) {
    setMethodSteps((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function updateFaq(index: number, field: keyof HomeFaqItemInput, value: string | number) {
    setFaqItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-12">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <Badge className="mb-4">Home</Badge>
        <Heading as="h1" className="text-3xl sm:text-4xl">
          Conteudo da home
        </Heading>
        <Text className="mt-2 max-w-3xl">
          Edite os textos e blocos principais da pagina inicial sem alterar a estrutura visual.
        </Text>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="border border-border-soft bg-bg px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
            {totalBlocks} bloco(s) editaveis
          </span>
          <span className="border border-border-soft bg-bg px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
            {methodSteps.length} etapa(s) do metodo
          </span>
        </div>
      </div>

      <form id={formId} onSubmit={handleSubmit} className={ADMIN_FORM_PANEL_CLASS}>
        <section className="space-y-6">
          <SectionHeader
            badge="Hero"
            title="Hero"
            description="Defina o texto principal, CTAs e mensagem de confianca do topo da home."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="home-hero-eyebrow" className={ADMIN_LABEL_CLASS}>
                Badge superior
              </label>
              <input
                id="home-hero-eyebrow"
                value={heroEyebrow}
                onChange={(event) => setHeroEyebrow(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-hero-trust" className={ADMIN_LABEL_CLASS}>
                Linha de confianca
              </label>
              <input
                id="home-hero-trust"
                value={heroTrustText}
                onChange={(event) => setHeroTrustText(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="lg:col-span-2">
              <ImageUpload
                name="home-hero-panel-image"
                label="Imagem do card lateral do hero"
                defaultValue={heroPanelImage}
                onValueChange={setHeroPanelImage}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="home-hero-title" className={ADMIN_LABEL_CLASS}>
                Titulo principal
              </label>
              <textarea
                id="home-hero-title"
                rows={3}
                value={heroTitle}
                onChange={(event) => setHeroTitle(event.target.value)}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="home-hero-subtitle" className={ADMIN_LABEL_CLASS}>
                Subtitulo
              </label>
              <textarea
                id="home-hero-subtitle"
                rows={4}
                value={heroSubtitle}
                onChange={(event) => setHeroSubtitle(event.target.value)}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-hero-primary-cta" className={ADMIN_LABEL_CLASS}>
                CTA principal
              </label>
              <input
                id="home-hero-primary-cta"
                value={heroPrimaryCtaLabel}
                onChange={(event) => setHeroPrimaryCtaLabel(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-hero-secondary-cta" className={ADMIN_LABEL_CLASS}>
                CTA secundario
              </label>
              <input
                id="home-hero-secondary-cta"
                value={heroSecondaryCtaLabel}
                onChange={(event) => setHeroSecondaryCtaLabel(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6 border-t border-border-soft pt-8">
          <SectionHeader
            badge="Comparativo"
            title="Leitura de valor"
            description="Controle os dois cards comparativos e o CTA da secao."
            count="2 card(s) fixos"
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="home-value-title" className={ADMIN_LABEL_CLASS}>
                Titulo da secao
              </label>
              <input
                id="home-value-title"
                value={valueTitle}
                onChange={(event) => setValueTitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-value-subtitle" className={ADMIN_LABEL_CLASS}>
                Subtitulo
              </label>
              <input
                id="home-value-subtitle"
                value={valueSubtitle}
                onChange={(event) => setValueSubtitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-value-cta" className={ADMIN_LABEL_CLASS}>
                CTA da secao
              </label>
              <input
                id="home-value-cta"
                value={valueCtaLabel}
                onChange={(event) => setValueCtaLabel(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {valueItems.map((item, index) => (
              <div key={`value-${index}`} className="space-y-4 border border-border-soft bg-bg p-4">
                <div className="grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
                  <div className="space-y-2">
                    <label htmlFor={`value-tone-${index}`} className={ADMIN_LABEL_CLASS}>
                      Tom
                    </label>
                    <select
                      id={`value-tone-${index}`}
                      value={item.tone}
                      onChange={(event) => updateValue(index, 'tone', event.target.value as ValueTone)}
                      className={ADMIN_SELECT_CLASS}
                    >
                      <option value="NEGATIVE">Desalinhamento</option>
                      <option value="POSITIVE">Alinhamento</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`value-badge-${index}`} className={ADMIN_LABEL_CLASS}>
                      Badge
                    </label>
                    <input
                      id={`value-badge-${index}`}
                      value={item.badge}
                      onChange={(event) => updateValue(index, 'badge', event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor={`value-title-${index}`} className={ADMIN_LABEL_CLASS}>
                    Titulo
                  </label>
                  <input
                    id={`value-title-${index}`}
                    value={item.title}
                    onChange={(event) => updateValue(index, 'title', event.target.value)}
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor={`value-bullets-${index}`} className={ADMIN_LABEL_CLASS}>
                    Bullets
                  </label>
                  <textarea
                    id={`value-bullets-${index}`}
                    rows={5}
                    value={bulletsToText(item.bullets)}
                    onChange={(event) => updateValue(index, 'bullets', textToBullets(event.target.value))}
                    className={ADMIN_TEXTAREA_CLASS}
                  />
                </div>
                <ImageUpload
                  name={`home-value-image-${index}`}
                  label="Imagem do card"
                  defaultValue={item.imageUrl}
                  onValueChange={(value) => updateValue(index, 'imageUrl', value)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 border-t border-border-soft pt-8">
          <div className="flex items-center justify-between gap-4">
            <SectionHeader
              badge="Audiencia"
              title="Para quem e"
              description="Cards que apresentam os perfis mais alinhados ao trabalho."
              count={`${audienceItems.length} card(s)`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setAudienceItems((current) => [
                  ...current,
                  {
                    title: '',
                    description: '',
                    icon: '\u2726',
                    imageUrl: '',
                    sortOrder: current.length,
                  },
                ])
              }
            >
              Adicionar card
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="home-audience-title" className={ADMIN_LABEL_CLASS}>
                Titulo da secao
              </label>
              <input
                id="home-audience-title"
                value={audienceTitle}
                onChange={(event) => setAudienceTitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-audience-subtitle" className={ADMIN_LABEL_CLASS}>
                Subtitulo da secao
              </label>
              <input
                id="home-audience-subtitle"
                value={audienceSubtitle}
                onChange={(event) => setAudienceSubtitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
          </div>

          <div className="space-y-4">
            {audienceItems.map((item, index) => (
              <div
                key={`audience-${index}`}
                className="grid gap-4 border border-border-soft bg-bg p-4 lg:grid-cols-[110px_minmax(0,1fr)_auto]"
              >
                <div className="space-y-2">
                  <label htmlFor={`audience-icon-${index}`} className={ADMIN_LABEL_CLASS}>
                    Icone
                  </label>
                  <input
                    id={`audience-icon-${index}`}
                    value={item.icon}
                    onChange={(event) => updateAudience(index, 'icon', event.target.value)}
                    className={ADMIN_INPUT_CLASS}
                    placeholder="◇"
                  />
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label htmlFor={`audience-title-${index}`} className={ADMIN_LABEL_CLASS}>
                      Titulo
                    </label>
                    <input
                      id={`audience-title-${index}`}
                      value={item.title}
                      onChange={(event) => updateAudience(index, 'title', event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`audience-description-${index}`} className={ADMIN_LABEL_CLASS}>
                      Descricao
                    </label>
                    <textarea
                      id={`audience-description-${index}`}
                      rows={3}
                      value={item.description}
                      onChange={(event) => updateAudience(index, 'description', event.target.value)}
                      className={ADMIN_TEXTAREA_CLASS}
                    />
                  </div>
                  <ImageUpload
                    name={`home-audience-image-${index}`}
                    label="Imagem do card"
                    defaultValue={item.imageUrl}
                    onValueChange={(value) => updateAudience(index, 'imageUrl', value)}
                  />
                </div>
                <div className="flex items-start justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setAudienceItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 border-t border-border-soft pt-8">
          <div className="flex items-center justify-between gap-4">
            <SectionHeader
              badge="Metodo"
              title="Metodo"
              description="Controle o bloco de etapas e a chamada para os formatos."
              count={`${methodSteps.length} etapa(s)`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setMethodSteps((current) => [
                  ...current,
                  { title: '', description: '', imageUrl: '', sortOrder: current.length },
                ])
              }
            >
              Adicionar etapa
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="home-method-title" className={ADMIN_LABEL_CLASS}>
                Titulo da secao
              </label>
              <input
                id="home-method-title"
                value={methodTitle}
                onChange={(event) => setMethodTitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-method-subtitle" className={ADMIN_LABEL_CLASS}>
                Subtitulo
              </label>
              <input
                id="home-method-subtitle"
                value={methodSubtitle}
                onChange={(event) => setMethodSubtitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-method-cta" className={ADMIN_LABEL_CLASS}>
                CTA da secao
              </label>
              <input
                id="home-method-cta"
                value={methodCtaLabel}
                onChange={(event) => setMethodCtaLabel(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
          </div>

          <div className="space-y-4">
            {methodSteps.map((item, index) => (
              <div
                key={`step-${index}`}
                className="grid gap-4 border border-border-soft bg-bg p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor={`step-title-${index}`} className={ADMIN_LABEL_CLASS}>
                      Titulo
                    </label>
                    <input
                      id={`step-title-${index}`}
                      value={item.title}
                      onChange={(event) => updateStep(index, 'title', event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label htmlFor={`step-description-${index}`} className={ADMIN_LABEL_CLASS}>
                      Descricao
                    </label>
                    <textarea
                      id={`step-description-${index}`}
                      rows={3}
                      value={item.description}
                      onChange={(event) => updateStep(index, 'description', event.target.value)}
                      className={ADMIN_TEXTAREA_CLASS}
                    />
                  </div>
                  <ImageUpload
                    name={`home-step-image-${index}`}
                    label="Imagem da etapa"
                    defaultValue={item.imageUrl}
                    onValueChange={(value) => updateStep(index, 'imageUrl', value)}
                  />
                </div>
                <div className="flex items-start justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setMethodSteps((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 border-t border-border-soft pt-8">
          <div className="flex items-center justify-between gap-4">
            <SectionHeader
              badge="FAQ"
              title="Perguntas frequentes"
              description="Controle o bloco final de objecoes e esclarecimentos."
              count={`${faqItems.length} pergunta(s)`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setFaqItems((current) => [
                  ...current,
                  { question: '', answer: '', sortOrder: current.length },
                ])
              }
            >
              Adicionar pergunta
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="home-faq-title" className={ADMIN_LABEL_CLASS}>
                Titulo da secao
              </label>
              <input
                id="home-faq-title"
                value={faqTitle}
                onChange={(event) => setFaqTitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-faq-subtitle" className={ADMIN_LABEL_CLASS}>
                Subtitulo
              </label>
              <input
                id="home-faq-subtitle"
                value={faqSubtitle}
                onChange={(event) => setFaqSubtitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={`faq-${index}`}
                className="grid gap-4 border border-border-soft bg-bg p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label htmlFor={`faq-question-${index}`} className={ADMIN_LABEL_CLASS}>
                      Pergunta
                    </label>
                    <input
                      id={`faq-question-${index}`}
                      value={item.question}
                      onChange={(event) => updateFaq(index, 'question', event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`faq-answer-${index}`} className={ADMIN_LABEL_CLASS}>
                      Resposta
                    </label>
                    <textarea
                      id={`faq-answer-${index}`}
                      rows={3}
                      value={item.answer}
                      onChange={(event) => updateFaq(index, 'answer', event.target.value)}
                      className={ADMIN_TEXTAREA_CLASS}
                    />
                  </div>
                </div>
                <div className="flex items-start justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFaqItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 border-t border-border-soft pt-8">
          <SectionHeader
            badge="CTA final"
            title="Fechamento da home"
            description="Controle o ultimo bloco de decisao antes do rodape."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="home-final-title" className={ADMIN_LABEL_CLASS}>
                Titulo final
              </label>
              <textarea
                id="home-final-title"
                rows={3}
                value={finalCtaTitle}
                onChange={(event) => setFinalCtaTitle(event.target.value)}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="home-final-subtitle" className={ADMIN_LABEL_CLASS}>
                Subtitulo
              </label>
              <textarea
                id="home-final-subtitle"
                rows={3}
                value={finalCtaSubtitle}
                onChange={(event) => setFinalCtaSubtitle(event.target.value)}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-final-scarcity" className={ADMIN_LABEL_CLASS}>
                Linha de escassez
              </label>
              <input
                id="home-final-scarcity"
                value={finalCtaScarcityText}
                onChange={(event) => setFinalCtaScarcityText(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="home-final-cta" className={ADMIN_LABEL_CLASS}>
                Texto do CTA
              </label>
              <input
                id="home-final-cta"
                value={finalCtaLabel}
                onChange={(event) => setFinalCtaLabel(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="home-final-whatsapp" className={ADMIN_LABEL_CLASS}>
                Mensagem de WhatsApp
              </label>
              <textarea
                id="home-final-whatsapp"
                rows={4}
                value={finalWhatsappMessage}
                onChange={(event) => setFinalWhatsappMessage(event.target.value)}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>
          </div>
        </section>

        {feedback ? (
          <AdminInlineNotice
            variant={feedback.variant}
            title={feedback.title}
            description={feedback.description}
          />
        ) : null}

        <div className="border-t border-border-soft pt-8">
          <Button type="submit" disabled={loading} className="hidden w-full lg:inline-flex">
            {loading ? 'Salvando...' : 'Publicar home'}
          </Button>
        </div>
      </form>

      <AdminMobileFormBar
        formId={formId}
        loading={loading}
        saveLabel="Salvar"
        savingLabel="Salvando..."
      />
    </div>
  );
}
