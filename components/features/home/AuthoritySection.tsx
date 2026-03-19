import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { Heading, Text } from '@/components/ui/Typography';
import { TrackedLinkButton } from '@/components/analytics/TrackedLinkButton';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

interface AuthoritySectionProps {
  specializationCount: number;
  credentialCount: number;
  milestoneCount: number;
  credentials: Array<{ title: string; issuer: string | null }>;
  specializations: string[];
}

export function AuthoritySection({
  specializationCount,
  credentialCount,
  milestoneCount,
  credentials,
  specializations,
}: AuthoritySectionProps) {
  const hasInstitutionalProof =
    specializationCount > 0 || credentialCount > 0 || milestoneCount > 0;

  return (
    <Section id="autoridade" variant="surface">
      <Container>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:items-start">
          <div>
            <Badge className="mb-4">Autoridade</Badge>
            <Heading className="max-w-[16ch] text-[2rem] lg:text-[2.7rem]">
              Base tecnica para orientar com clareza
            </Heading>
            <Text className="mt-4 max-w-[560px] text-[14px] text-[color:var(--taupe)]">
              Esta orientacao nao parte de intuicao. Parte de metodo, repertorio e criterio.
            </Text>

            {hasInstitutionalProof ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                      Especializacoes
                    </p>
                    <Icon name="tune" className="text-[16px] text-[color:var(--argila)]" />
                  </div>
                  <p className="mt-3 font-display text-[1.85rem] leading-none text-[color:var(--espresso)] sm:text-[2rem]">
                    {specializationCount}
                  </p>
                </div>
                <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                      Credenciais
                    </p>
                    <Icon name="check_circle" className="text-[16px] text-[color:var(--argila)]" />
                  </div>
                  <p className="mt-3 font-display text-[1.85rem] leading-none text-[color:var(--espresso)] sm:text-[2rem]">
                    {credentialCount}
                  </p>
                </div>
                <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                      Marcos
                    </p>
                    <Icon
                      name="progress_activity"
                      className="text-[16px] text-[color:var(--argila)]"
                    />
                  </div>
                  <p className="mt-3 font-display text-[1.85rem] leading-none text-[color:var(--espresso)] sm:text-[2rem]">
                    {milestoneCount}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                    Pilar 1
                  </p>
                  <p className="mt-3 text-[12px] font-[400] leading-[1.7] text-[color:var(--espresso)]">
                    Imagem estrategica aplicada a leitura de valor.
                  </p>
                </div>
                <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                    Pilar 2
                  </p>
                  <p className="mt-3 text-[12px] font-[400] leading-[1.7] text-[color:var(--espresso)]">
                    Etiqueta, conduta e comportamento em contexto real.
                  </p>
                </div>
                <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                    Pilar 3
                  </p>
                  <p className="mt-3 text-[12px] font-[400] leading-[1.7] text-[color:var(--espresso)]">
                    Presenca executiva para ambientes de alta exigencia.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-7">
              <TrackedLinkButton
                href="/sobre"
                analytics={{
                  name: 'cta_click',
                  source: ANALYTICS_SOURCES.HOME_AUTHORITY,
                  destination: '/sobre',
                  path: '/',
                }}
                variant="outline"
                size="lg"
              >
                Ver trajetoria e credenciais
              </TrackedLinkButton>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="border border-[color:var(--linho)] bg-[color:var(--manteiga)] p-5 sm:p-6">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                Eixos de autoridade
              </p>
              <div className="mt-5 space-y-3">
                {specializations.length > 0 ? (
                  specializations.map((item) => (
                    <div
                      key={item}
                      className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[12px] font-[400] leading-[1.7] break-words [text-wrap:balance] text-[color:var(--espresso)]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-[2px] inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)]">
                          <Icon name="check_circle" className="text-[14px]" />
                        </span>
                        <span className="min-w-0">{item}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-3">
                    <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[12px] font-[400] leading-[1.7] break-words [text-wrap:balance] text-[color:var(--espresso)]">
                      <div className="flex items-start gap-3">
                        <span className="mt-[2px] inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)]">
                          <Icon name="tune" className="text-[14px]" />
                        </span>
                        <span className="min-w-0">Imagem e leitura de valor</span>
                      </div>
                    </div>
                    <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[12px] font-[400] leading-[1.7] break-words [text-wrap:balance] text-[color:var(--espresso)]">
                      <div className="flex items-start gap-3">
                        <span className="mt-[2px] inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)]">
                          <Icon name="admin_panel_settings" className="text-[14px]" />
                        </span>
                        <span className="min-w-0">Etiqueta e comportamento em ambiente formal</span>
                      </div>
                    </div>
                    <div className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[12px] font-[400] leading-[1.7] break-words [text-wrap:balance] text-[color:var(--espresso)]">
                      <div className="flex items-start gap-3">
                        <span className="mt-[2px] inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[color:var(--argila)]">
                          <Icon name="analytics" className="text-[14px]" />
                        </span>
                        <span className="min-w-0">Presenca executiva e coerencia de posicionamento</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article className="border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] p-5 sm:p-6">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                Credenciais em destaque
              </p>
              <div className="mt-5 space-y-4">
                {credentials.length > 0 ? (
                  credentials.map((item) => (
                    <div key={item.title} className="border-b border-[color:var(--linho)]/70 pb-4 last:border-b-0 last:pb-0">
                      <Heading as="h3" className="max-w-[16ch] text-[1.15rem] leading-[1.14] break-words [text-wrap:balance] sm:text-[1.2rem]">
                        {item.title}
                      </Heading>
                      {item.issuer ? (
                        <Text className="mt-1 break-words text-[11px] uppercase tracking-[0.14em] text-[color:var(--taupe)]">
                          {item.issuer}
                        </Text>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <Text className="text-[12px] text-[color:var(--taupe)]">
                    A pagina Sobre aprofunda a formacao e os marcos que sustentam esse trabalho.
                  </Text>
                )}
              </div>
            </article>
          </div>
        </div>
      </Container>
    </Section>
  );
}
