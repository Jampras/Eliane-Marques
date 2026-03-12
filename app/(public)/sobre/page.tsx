export const revalidate = 300;

import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { LinkButton } from '@/components/ui/LinkButton';
import { Section } from '@/components/ui/Section';
import { TrackedLinkButton } from '@/components/analytics/TrackedLinkButton';
import { getAboutPage } from '@/lib/data/about';
import { getSiteIdentity } from '@/lib/data/site';
import { getWhatsAppConfig } from '@/lib/data/config';
import { buildDirectContactWhatsAppUrl } from '@/lib/contact/whatsapp-intents';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

function normalizeCtaMode(value: string): 'WHATSAPP' | 'EXTERNAL' {
  return value === 'EXTERNAL' ? 'EXTERNAL' : 'WHATSAPP';
}

export async function generateMetadata() {
  const site = await getSiteIdentity();

  return {
    title: `Sobre | ${site.siteName}`,
    description:
      'Conheca a trajetoria, especializacoes e credenciais que sustentam a consultoria de Eliane Marques.',
  };
}

function renderCta(
  ctaMode: 'WHATSAPP' | 'EXTERNAL',
  ctaLabel: string,
  ctaUrl: string | null,
  whatsAppUrl: string
) {
  if (ctaMode === 'EXTERNAL' && ctaUrl) {
    return (
      <TrackedLinkButton
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        analytics={{
          name: 'cta_click',
          source: ANALYTICS_SOURCES.ABOUT_PAGE,
          path: '/sobre',
          destination: ctaUrl,
        }}
        size="lg"
      >
        {ctaLabel}
      </TrackedLinkButton>
    );
  }

  return (
    <TrackedLinkButton
      href={whatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      analytics={{
        name: 'whatsapp_click',
        source: ANALYTICS_SOURCES.ABOUT_PAGE,
        path: '/sobre',
        destination: whatsAppUrl,
      }}
      size="lg"
    >
      {ctaLabel}
    </TrackedLinkButton>
  );
}

export default async function AboutPage() {
  const [about, wa] = await Promise.all([getAboutPage(), getWhatsAppConfig()]);
  const milestoneCount = about.milestones.length;
  const specializationCount = about.specializations.length;
  const credentialCount = about.credentials.length;

  const whatsAppUrl = buildDirectContactWhatsAppUrl({
    number: wa.number,
    message:
      about.whatsappMessageTemplate ||
      'Ola Eliane! Quero conhecer melhor sua trajetoria e entender como voce pode me orientar.',
  });

  return (
    <>
      <Section className="!pt-10 sm:!pt-12 lg:!pt-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,460px)] lg:items-center lg:gap-14">
            <div>
              <Badge className="mb-6">Sobre Eliane Marques</Badge>
              <Heading
                as="h1"
                className="max-w-[12ch] text-[2.7rem] leading-[1.02] sm:text-[3.4rem] lg:text-[5rem]"
              >
                {about.heroTitle}
              </Heading>
              <Text className="mt-6 max-w-[44rem] text-[14px] text-[color:var(--taupe)] sm:text-[15px]">
                {about.heroSubtitle}
              </Text>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {renderCta(
                  normalizeCtaMode(about.ctaMode),
                  about.ctaLabel || 'Agendar consultoria',
                  about.ctaUrl,
                  whatsAppUrl
                )}
                <LinkButton href="/servicos" variant="outline" size="lg">
                  Ver servicos
                </LinkButton>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4 shadow-[2px_3px_12px_rgba(58,36,24,0.06)]">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                    Especializacoes
                  </p>
                  <p className="mt-3 font-display text-[2rem] text-[color:var(--espresso)]">
                    {specializationCount}
                  </p>
                </div>
                <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4 shadow-[2px_3px_12px_rgba(58,36,24,0.06)]">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                    Credenciais
                  </p>
                  <p className="mt-3 font-display text-[2rem] text-[color:var(--espresso)]">
                    {credentialCount}
                  </p>
                </div>
                <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4 shadow-[2px_3px_12px_rgba(58,36,24,0.06)]">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                    Marcos
                  </p>
                  <p className="mt-3 font-display text-[2rem] text-[color:var(--espresso)]">
                    {milestoneCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border border-[color:var(--linho)] bg-[color:var(--manteiga)] p-5 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] sm:p-6">
              <div className="pointer-events-none absolute top-0 right-0 h-28 w-28 translate-x-10 -translate-y-10 bg-[radial-gradient(circle,rgba(184,132,90,0.18),transparent_70%)] blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--linho)] bg-[color:var(--aveia)]">
                {about.heroImage ? (
                  <Image
                    src={about.heroImage}
                    alt="Retrato institucional de Eliane Marques"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-8 text-center text-[12px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                    Adicione uma imagem principal no painel admin
                  </div>
                )}
              </div>

              <div className="mt-5 border border-[color:var(--linho)] bg-[color:var(--aveia)] p-5">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                  Assinatura profissional
                </p>
                <Text className="mt-3 text-[13px] text-[color:var(--taupe)]">
                  Esta pagina organiza a autoridade institucional em um formato claro: tese, base
                  tecnica, marcos e provas visuais.
                </Text>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="surface" className="border-y border-[color:var(--linho)]/60">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <article className="border border-[color:var(--linho)] bg-[color:var(--aveia)] p-6 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] sm:p-8">
              <Badge className="mb-4">Introducao</Badge>
              <Heading as="h2" className="text-[2rem] sm:text-[2.4rem]">
                {about.introTitle || 'Quem esta por tras da assinatura'}
              </Heading>
              <Text className="mt-4 text-[14px] text-[color:var(--taupe)]">{about.introBody}</Text>
            </article>

            <article className="border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] p-6 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] sm:p-8">
              <Badge className="mb-4">Manifesto</Badge>
              <Heading as="h2" className="text-[2rem] sm:text-[2.4rem]">
                {about.manifestoTitle || 'Base tecnica e visao'}
              </Heading>
              <Text className="mt-4 text-[14px] text-[color:var(--taupe)]">
                {about.manifestoBody}
              </Text>
            </article>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-8 max-w-3xl">
            <Badge className="mb-4">Especializacoes</Badge>
            <Heading as="h2" className="text-[2.2rem] sm:text-[2.8rem]">
              Areas de atuacao e profundidade tecnica
            </Heading>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {specializationCount === 0 ? (
              <div className="border border-dashed border-[color:var(--linho)] bg-[color:var(--aveia)] p-8 text-center text-[12px] uppercase tracking-[0.18em] text-[color:var(--taupe)] md:col-span-2 xl:col-span-3">
                Cadastre especializacoes no admin para preencher esta secao
              </div>
            ) : null}
            {about.specializations.map((item, index) => (
              <article
                key={`${item.title}-${item.sortOrder}`}
                className="relative border border-[color:var(--linho)] bg-[color:var(--aveia)] p-6 shadow-[2px_3px_12px_rgba(58,36,24,0.06)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                    Especializacao
                  </p>
                  <span className="font-display text-[1.6rem] text-[color:var(--linho)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                  Eixo de autoridade
                </p>
                <Heading as="h3" className="mt-4 text-[1.6rem]">
                  {item.title}
                </Heading>
                <Text className="mt-3 text-[13px] text-[color:var(--taupe)]">
                  {item.description}
                </Text>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="surface">
        <Container>
          <div className="mb-8 max-w-3xl">
            <Badge className="mb-4">Trajetoria</Badge>
            <Heading as="h2" className="text-[2.2rem] sm:text-[2.8rem]">
              Marcos que sustentam a autoridade da marca
            </Heading>
          </div>

          <div className="space-y-4">
            {milestoneCount === 0 ? (
              <div className="border border-dashed border-[color:var(--linho)] bg-[color:var(--aveia)] p-8 text-center text-[12px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Cadastre marcos no admin para preencher esta secao
              </div>
            ) : null}
            {about.milestones.map((item, index) => (
              <article
                key={`${item.title}-${item.sortOrder}`}
                className="grid gap-4 border border-[color:var(--linho)] bg-[color:var(--aveia)] p-5 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] lg:grid-cols-[140px_minmax(0,1fr)] lg:items-start"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                  {item.year || `Marco ${index + 1}`}
                </div>
                <div>
                  <Heading as="h3" className="text-[1.6rem]">
                    {item.title}
                  </Heading>
                  <Text className="mt-3 text-[13px] text-[color:var(--taupe)]">
                    {item.description}
                  </Text>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-8 max-w-3xl">
            <Badge className="mb-4">Credenciais</Badge>
            <Heading as="h2" className="text-[2.2rem] sm:text-[2.8rem]">
              Certificados, selos e especializacoes reconhecidas
            </Heading>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {credentialCount === 0 ? (
              <div className="border border-dashed border-[color:var(--linho)] bg-[color:var(--manteiga)] p-8 text-center text-[12px] uppercase tracking-[0.18em] text-[color:var(--taupe)] sm:col-span-2 xl:col-span-3">
                Cadastre certificados e selos no admin para preencher esta secao
              </div>
            ) : null}
            {about.credentials.map((item) => (
              <article
                key={`${item.title}-${item.sortOrder}`}
                className="overflow-hidden border border-[color:var(--linho)] bg-[color:var(--manteiga)] shadow-[2px_3px_12px_rgba(58,36,24,0.06)]"
              >
                <div className="relative aspect-[4/3] border-b border-[color:var(--linho)] bg-[color:var(--aveia)]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-[10px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                      Imagem nao cadastrada
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                    {item.kind === 'SEAL'
                      ? 'Selo'
                      : item.kind === 'SPECIALIZATION'
                        ? 'Especializacao'
                        : 'Certificado'}
                  </p>
                  <Heading as="h3" className="text-[1.5rem]">
                    {item.title}
                  </Heading>
                  {(item.issuer || item.year) && (
                    <Text className="text-[12px] text-[color:var(--taupe)]">
                      {[item.issuer, item.year].filter(Boolean).join(' - ')}
                    </Text>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="black" className="border-y border-white/8">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-5 border-[color:var(--mel)] bg-transparent text-[color:var(--mel)]">
              Conversa inicial
            </Badge>
            <Heading as="h2" className="text-[2.4rem] text-[color:var(--aveia)] sm:text-[3.1rem]">
              Se sua presenca precisa refletir sua ambicao com mais nitidez, este e o momento de
              conversar.
            </Heading>
            <Text className="mx-auto mt-5 max-w-[42rem] text-[14px] text-white/70 sm:text-[15px]">
              A pagina Sobre deve reforcar a autoridade. O proximo passo precisa abrir a conversa
              certa para o seu momento profissional.
            </Text>

            <div className="mt-8 flex justify-center">
              {renderCta(
                normalizeCtaMode(about.ctaMode),
                about.ctaLabel || 'Agendar consultoria',
                about.ctaUrl,
                whatsAppUrl
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
