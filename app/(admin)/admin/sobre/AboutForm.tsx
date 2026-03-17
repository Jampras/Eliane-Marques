'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
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
import { upsertInstitutionalAboutPage } from '@/lib/institutional/about-actions';

type CtaMode = 'WHATSAPP' | 'EXTERNAL';
type CredentialKind = 'CERTIFICATE' | 'SEAL' | 'SPECIALIZATION';

interface AboutMilestoneInput {
  title: string;
  description: string;
  year: string;
  sortOrder: number;
}

interface AboutSpecializationInput {
  title: string;
  description: string;
  sortOrder: number;
}

interface AboutCredentialInput {
  title: string;
  issuer: string;
  year: string;
  imageUrl: string;
  kind: CredentialKind;
  sortOrder: number;
}

interface AboutFormValue {
  heroTitle: string;
  heroSubtitle: string;
  introTitle: string;
  introBody: string;
  manifestoTitle: string;
  manifestoBody: string;
  heroImage: string;
  ctaMode: CtaMode;
  ctaUrl: string;
  ctaLabel: string;
  whatsappMessageTemplate: string;
  milestones: AboutMilestoneInput[];
  specializations: AboutSpecializationInput[];
  credentials: AboutCredentialInput[];
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

function normalizeMilestones(items: AboutMilestoneInput[]) {
  return items.map((item, index) => ({
    title: item.title.trim(),
    description: item.description.trim(),
    year: item.year.trim() || undefined,
    sortOrder: index,
  }));
}

function normalizeSpecializations(items: AboutSpecializationInput[]) {
  return items.map((item, index) => ({
    title: item.title.trim(),
    description: item.description.trim(),
    sortOrder: index,
  }));
}

function normalizeCredentials(items: AboutCredentialInput[]) {
  return items.map((item, index) => ({
    title: item.title.trim(),
    issuer: item.issuer.trim() || undefined,
    year: item.year.trim() || undefined,
    imageUrl: item.imageUrl.trim() || undefined,
    kind: item.kind,
    sortOrder: index,
  }));
}

export default function AboutForm({ initialValue }: { initialValue: AboutFormValue }) {
  const formId = 'admin-about-form';
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    variant: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);
  const [heroTitle, setHeroTitle] = useState(initialValue.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(initialValue.heroSubtitle);
  const [introTitle, setIntroTitle] = useState(initialValue.introTitle);
  const [introBody, setIntroBody] = useState(initialValue.introBody);
  const [manifestoTitle, setManifestoTitle] = useState(initialValue.manifestoTitle);
  const [manifestoBody, setManifestoBody] = useState(initialValue.manifestoBody);
  const [heroImage, setHeroImage] = useState(initialValue.heroImage);
  const [ctaMode, setCtaMode] = useState<CtaMode>(initialValue.ctaMode);
  const [ctaUrl, setCtaUrl] = useState(initialValue.ctaUrl);
  const [ctaLabel, setCtaLabel] = useState(initialValue.ctaLabel);
  const [whatsAppMessageTemplate, setWhatsAppMessageTemplate] = useState(
    initialValue.whatsappMessageTemplate
  );
  const [milestones, setMilestones] = useState(initialValue.milestones);
  const [specializations, setSpecializations] = useState(initialValue.specializations);
  const [credentials, setCredentials] = useState(initialValue.credentials);

  const totalItems = useMemo(
    () => milestones.length + specializations.length + credentials.length,
    [milestones.length, specializations.length, credentials.length]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const result = await upsertInstitutionalAboutPage({
        heroTitle,
        heroSubtitle,
        introTitle,
        introBody,
        manifestoTitle,
        manifestoBody,
        heroImage,
        ctaMode,
        ctaUrl: ctaMode === 'EXTERNAL' ? ctaUrl : '',
        ctaLabel,
        whatsappMessageTemplate: ctaMode === 'WHATSAPP' ? whatsAppMessageTemplate : '',
        milestones: normalizeMilestones(milestones),
        specializations: normalizeSpecializations(specializations),
        credentials: normalizeCredentials(credentials),
      });

      if (result.success) {
        showToast({
          variant: 'success',
          title: 'Pagina Sobre atualizada',
          description: 'A apresentacao institucional ja foi publicada.',
        });
        setFeedback({
          variant: 'success',
          title: 'Pagina Sobre atualizada',
          description: 'A apresentacao institucional ja foi publicada.',
        });
        return;
      }

      const description = result.error || 'Revise os campos e tente novamente.';
      showToast({
        variant: 'error',
        title: 'Nao foi possivel salvar',
        description,
      });
      setFeedback({
        variant: 'error',
        title: 'Nao foi possivel salvar',
        description,
      });
    } catch (error) {
      console.error(error);
      showToast({
        variant: 'error',
        title: 'Erro ao salvar pagina Sobre',
        description: 'Tente novamente em instantes.',
      });
      setFeedback({
        variant: 'error',
        title: 'Erro ao salvar pagina Sobre',
        description: 'Tente novamente em instantes.',
      });
    } finally {
      setLoading(false);
    }
  }

  function updateMilestone(index: number, field: keyof AboutMilestoneInput, value: string | number) {
    setMilestones((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  function updateSpecialization(
    index: number,
    field: keyof AboutSpecializationInput,
    value: string | number
  ) {
    setSpecializations((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  function updateCredential(
    index: number,
    field: keyof AboutCredentialInput,
    value: string | number
  ) {
    setCredentials((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-12">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <Badge className="mb-4">Institucional</Badge>
        <Heading as="h1" className="text-3xl sm:text-4xl">
          Pagina Sobre
        </Heading>
        <Text className="mt-2 max-w-3xl">
          Edite a apresentacao institucional, especializacoes e certificados da marca. Esta
          pagina sustenta autoridade e contexto comercial fora das paginas de produto.
        </Text>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="border border-border-soft bg-bg px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
            {totalItems} bloco(s) institucionais
          </span>
          <span className="border border-border-soft bg-bg px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
            {credentials.length} credencial(is)
          </span>
          <Link
            href="/sobre"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[color:var(--linho)] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--argila)] transition-colors hover:border-[color:var(--argila)]"
          >
            Abrir pagina publica
          </Link>
        </div>
      </div>

      <form id={formId} onSubmit={handleSubmit} className={ADMIN_FORM_PANEL_CLASS}>
        <section className="space-y-6">
          <SectionHeader
            badge="Hero"
            title="Hero e posicionamento"
            description="Este bloco apresenta Eliane, a tese principal e a imagem institucional da pagina."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="about-hero-title" className={ADMIN_LABEL_CLASS}>
                Titulo principal
              </label>
              <textarea
                id="about-hero-title"
                rows={3}
                value={heroTitle}
                onChange={(event) => setHeroTitle(event.target.value)}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="about-hero-subtitle" className={ADMIN_LABEL_CLASS}>
                Subtitulo / resumo
              </label>
              <textarea
                id="about-hero-subtitle"
                rows={4}
                value={heroSubtitle}
                onChange={(event) => setHeroSubtitle(event.target.value)}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>

            <div className="lg:col-span-2">
              <ImageUpload
                name="about-hero-image"
                label="Imagem principal"
                defaultValue={heroImage}
                onValueChange={setHeroImage}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6 border-t border-border-soft pt-8">
          <SectionHeader
            badge="Narrativa"
            title="Introducao e manifesto"
            description="Use estes textos para contextualizar experiencia, visao e posicionamento."
          />

          <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
              <label htmlFor="about-intro-title" className={ADMIN_LABEL_CLASS}>
                Titulo da introducao
              </label>
              <input
                id="about-intro-title"
                value={introTitle}
                onChange={(event) => setIntroTitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="about-manifesto-title" className={ADMIN_LABEL_CLASS}>
                Titulo do manifesto
              </label>
              <input
                id="about-manifesto-title"
                value={manifestoTitle}
                onChange={(event) => setManifestoTitle(event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="about-intro-body" className={ADMIN_LABEL_CLASS}>
                Texto da introducao
              </label>
              <textarea
                id="about-intro-body"
                rows={5}
                value={introBody}
                onChange={(event) => setIntroBody(event.target.value)}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="about-manifesto-body" className={ADMIN_LABEL_CLASS}>
                Texto do manifesto
              </label>
              <textarea
                id="about-manifesto-body"
                rows={5}
                value={manifestoBody}
                onChange={(event) => setManifestoBody(event.target.value)}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6 border-t border-border-soft pt-8">
          <div className="flex items-center justify-between gap-4">
            <SectionHeader
              badge="Trajetoria"
              title="Trajetoria"
              description="Marcos relevantes da experiencia profissional, formacao e consolidacao da marca."
              count={`${milestones.length} marco(s)`}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setMilestones((current) => [
                  ...current,
                  { title: '', description: '', year: '', sortOrder: current.length },
                ])
              }
            >
              Adicionar marco
            </Button>
          </div>

          <div className="space-y-4">
            {milestones.length === 0 ? (
              <div className="border border-dashed border-border p-6 text-center text-[12px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Nenhum marco cadastrado ainda
              </div>
            ) : null}
            {milestones.map((item, index) => (
              <div
                key={`milestone-${index}`}
                className="grid gap-4 border border-border-soft bg-bg p-4 lg:grid-cols-[160px_minmax(0,1fr)_auto]"
              >
                  <div className="space-y-2">
                    <label htmlFor={`milestone-year-${index}`} className={ADMIN_LABEL_CLASS}>
                      Ano
                    </label>
                    <input
                      id={`milestone-year-${index}`}
                      value={item.year}
                      onChange={(event) => updateMilestone(index, 'year', event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    placeholder="2026"
                  />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor={`milestone-title-${index}`} className={ADMIN_LABEL_CLASS}>
                      Titulo
                    </label>
                    <input
                      id={`milestone-title-${index}`}
                      value={item.title}
                      onChange={(event) => updateMilestone(index, 'title', event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label
                      htmlFor={`milestone-description-${index}`}
                      className={ADMIN_LABEL_CLASS}
                    >
                      Descricao
                    </label>
                    <textarea
                      id={`milestone-description-${index}`}
                      rows={3}
                      value={item.description}
                      onChange={(event) =>
                        updateMilestone(index, 'description', event.target.value)
                      }
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
                      setMilestones((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index)
                      )
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
              badge="Expertise"
              title="Especializacoes"
              description="Liste os pilares de expertise que sustentam a proposta da consultoria."
              count={`${specializations.length} item(ns)`}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setSpecializations((current) => [
                  ...current,
                  { title: '', description: '', sortOrder: current.length },
                ])
              }
            >
              Adicionar especializacao
            </Button>
          </div>

          <div className="space-y-4">
            {specializations.length === 0 ? (
              <div className="border border-dashed border-border p-6 text-center text-[12px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Nenhuma especializacao cadastrada ainda
              </div>
            ) : null}
            {specializations.map((item, index) => (
              <div
                key={`specialization-${index}`}
                className="grid gap-4 border border-border-soft bg-bg p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor={`specialization-title-${index}`}
                      className={ADMIN_LABEL_CLASS}
                    >
                      Titulo
                    </label>
                    <input
                      id={`specialization-title-${index}`}
                      value={item.title}
                      onChange={(event) =>
                        updateSpecialization(index, 'title', event.target.value)
                      }
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label
                      htmlFor={`specialization-description-${index}`}
                      className={ADMIN_LABEL_CLASS}
                    >
                      Descricao
                    </label>
                    <textarea
                      id={`specialization-description-${index}`}
                      rows={3}
                      value={item.description}
                      onChange={(event) =>
                        updateSpecialization(index, 'description', event.target.value)
                      }
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
                      setSpecializations((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index)
                      )
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
              badge="Credenciais"
              title="Certificados, selos e provas institucionais"
              description="Cadastre certificados, selos ou credenciais com imagem e dados institucionais."
              count={`${credentials.length} credencial(is)`}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setCredentials((current) => [
                  ...current,
                  {
                    title: '',
                    issuer: '',
                    year: '',
                    imageUrl: '',
                    kind: 'CERTIFICATE',
                    sortOrder: current.length,
                  },
                ])
              }
            >
              Adicionar credencial
            </Button>
          </div>

          <div className="space-y-4">
            {credentials.length === 0 ? (
              <div className="border border-dashed border-border p-6 text-center text-[12px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Nenhum certificado ou selo cadastrado ainda
              </div>
            ) : null}
            {credentials.map((item, index) => (
              <div
                key={`credential-${index}`}
                className="space-y-4 border border-border-soft bg-bg p-4"
              >
                <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)_120px_auto]">
                  <div className="space-y-2">
                    <label htmlFor={`credential-kind-${index}`} className={ADMIN_LABEL_CLASS}>
                      Tipo
                    </label>
                    <select
                      id={`credential-kind-${index}`}
                      value={item.kind}
                      onChange={(event) =>
                        updateCredential(index, 'kind', event.target.value as CredentialKind)
                      }
                      className={ADMIN_SELECT_CLASS}
                    >
                      <option value="CERTIFICATE">Certificado</option>
                      <option value="SEAL">Selo</option>
                      <option value="SPECIALIZATION">Especializacao</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`credential-title-${index}`} className={ADMIN_LABEL_CLASS}>
                      Titulo
                    </label>
                    <input
                      id={`credential-title-${index}`}
                      value={item.title}
                      onChange={(event) => updateCredential(index, 'title', event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`credential-issuer-${index}`} className={ADMIN_LABEL_CLASS}>
                      Instituicao
                    </label>
                    <input
                      id={`credential-issuer-${index}`}
                      value={item.issuer}
                      onChange={(event) => updateCredential(index, 'issuer', event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`credential-year-${index}`} className={ADMIN_LABEL_CLASS}>
                      Ano
                    </label>
                    <input
                      id={`credential-year-${index}`}
                      value={item.year}
                      onChange={(event) => updateCredential(index, 'year', event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>
                  <div className="flex items-start justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCredentials((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                    >
                      Remover
                    </Button>
                  </div>
                </div>

                <ImageUpload
                  name={`about-credential-${index}`}
                  label="Imagem / arquivo visual"
                  defaultValue={item.imageUrl}
                  onValueChange={(value) => updateCredential(index, 'imageUrl', value)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 border-t border-border-soft pt-8">
          <SectionHeader
            badge="CTA"
            title="CTA final"
            description="Defina se a pagina termina em WhatsApp ou em um link externo, como agenda, checkout ou formulario."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="about-cta-mode" className={ADMIN_LABEL_CLASS}>
                Destino do CTA
              </label>
              <select
                id="about-cta-mode"
                value={ctaMode}
                onChange={(event) => setCtaMode(event.target.value as CtaMode)}
                className={ADMIN_SELECT_CLASS}
              >
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EXTERNAL">Link externo</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="about-cta-label" className={ADMIN_LABEL_CLASS}>
                Texto do botao
              </label>
              <input
                id="about-cta-label"
                value={ctaLabel}
                onChange={(event) => setCtaLabel(event.target.value)}
                className={ADMIN_INPUT_CLASS}
                placeholder="Agendar consultoria"
              />
            </div>

            {ctaMode === 'EXTERNAL' ? (
              <div className="space-y-2 lg:col-span-2">
                <label htmlFor="about-cta-url" className={ADMIN_LABEL_CLASS}>
                  URL externa
                </label>
                <input
                  id="about-cta-url"
                  value={ctaUrl}
                  onChange={(event) => setCtaUrl(event.target.value)}
                  className={ADMIN_INPUT_CLASS}
                  placeholder="https://..."
                />
              </div>
            ) : (
              <div className="space-y-2 lg:col-span-2">
                <label htmlFor="about-whatsapp-message" className={ADMIN_LABEL_CLASS}>
                  Mensagem padrao de WhatsApp
                </label>
                <textarea
                  id="about-whatsapp-message"
                  rows={3}
                  value={whatsAppMessageTemplate}
                  onChange={(event) => setWhatsAppMessageTemplate(event.target.value)}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="Ola Eliane! Gostaria de conhecer melhor sua trajetoria e entender como voce pode me orientar."
                />
              </div>
            )}
          </div>
        </section>

        {feedback && (
          <AdminInlineNotice
            variant={feedback.variant}
            title={feedback.title}
            description={feedback.description}
          />
        )}

        <div className="border-t border-border-soft pt-8">
          <Button type="submit" disabled={loading} className="hidden w-full lg:inline-flex">
            {loading ? 'Salvando...' : 'Publicar pagina Sobre'}
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
