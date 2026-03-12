export const revalidate = 300;

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { LeadCaptureForm } from '@/components/features/contact/LeadCaptureForm';
import { WhatsAppButton } from '@/components/shared/whatsapp/WhatsAppButton';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';
import { getSiteConfigs, getWhatsAppConfig } from '@/lib/data/config';
import { BRAND } from '@/lib/core/constants';

export const metadata = {
  title: 'Contato | Eliane Marques',
  description: 'Entre em contato e inicie sua jornada de refinamento.',
};

export default async function ContactPage() {
  const [wa, configs] = await Promise.all([getWhatsAppConfig(), getSiteConfigs()]);

  const contactEmail = configs.contactEmail || BRAND.email;
  const instagramUrl = configs.instagramLink || BRAND.instagram;

  let instagramLabel = '@instagram';
  try {
    const instagramPath = new URL(instagramUrl).pathname.replace(/^\/+|\/+$/g, '');
    if (instagramPath) {
      instagramLabel = `@${instagramPath.split('/')[0]}`;
    }
  } catch {
    instagramLabel = '@instagram';
  }

  return (
    <Section className="!py-10 sm:!py-12 lg:!py-16">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:gap-14 xl:gap-20">
            <div>
              <Badge className="mb-6">Entre em contato</Badge>
              <Heading as="h1" className="max-w-[12ch] text-[2.4rem] leading-[1.04] sm:text-[3.1rem] lg:text-[4.6rem]">
                Inicie seu <span className="italic text-[color:var(--argila)]">refinamento</span>
              </Heading>
              <Text className="mt-6 max-w-[560px] text-[14px] text-[color:var(--taupe)] sm:text-[15px]">
                Estou a disposicao para agendar sessoes, tirar duvidas sobre cursos e orientar o melhor formato para o seu momento profissional.
              </Text>

              <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
                <div className="flex items-start gap-4 border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] sm:px-5 sm:py-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)]">
                    <Icon name="mail" className="!text-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">Email</p>
                    <p className="mt-2 break-words text-[14px] font-[400] text-[color:var(--espresso)]">{contactEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] sm:px-5 sm:py-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)]">
                    <Icon name="alternate_email" className="!text-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">Instagram</p>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex break-all text-[14px] font-[400] text-[color:var(--espresso)] transition-colors hover:text-[color:var(--argila)]"
                    >
                      {instagramLabel}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border border-[color:var(--linho)] bg-[color:var(--manteiga)] px-4 py-6 text-center shadow-[2px_3px_12px_rgba(58,36,24,0.06)] sm:px-6 sm:py-8 lg:px-8 lg:py-10">
              <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 bg-[radial-gradient(circle,rgba(184,132,90,0.18),transparent_70%)] blur-2xl" />

              <Heading as="h2" className="text-[1.9rem] sm:text-[2.3rem]">
                Canal direto
              </Heading>
              <Text className="mx-auto mt-4 max-w-[28rem] text-[13px] text-[color:var(--taupe)]">
                Para uma resposta mais rapida e orientacao inicial, use o canal oficial no WhatsApp.
              </Text>

              <div className="mt-8">
                <WhatsAppButton
                  number={wa.number}
                  template={wa.defaultMessage}
                  label="Chamar no WhatsApp"
                  className="w-full"
                  size="lg"
                  analyticsSource={ANALYTICS_SOURCES.CONTACT_PAGE}
                />
              </div>

              <p className="mt-6 text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Atendimento em horario comercial
              </p>

              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
