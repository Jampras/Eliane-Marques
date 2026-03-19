import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Heading, Text } from '@/components/ui/Typography';
import { TrackedLinkButton } from '@/components/analytics/TrackedLinkButton';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

const defaultMethodSteps = [
  {
    title: 'Leitura atual',
    text: 'Mapeamos como imagem, comportamento e comunicacao estao sendo percebidos hoje.',
  },
  {
    title: 'Reposicionamento visual',
    text: 'Definimos ajustes de imagem que aumentam coerencia, refinamento e leitura de valor.',
  },
  {
    title: 'Refinamento de conduta',
    text: 'Ajustamos postura, etiqueta e comportamento para sustentar a nova presenca em contexto real.',
  },
  {
    title: 'Sustentacao da presenca',
    text: 'Transformamos o ajuste em consistencia para que sua imagem pare de depender de esforco extra.',
  },
];

interface MethodSectionProps {
  title?: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  steps?: Array<{
    title: string;
    description: string;
  }>;
}

export function MethodSection({ title, subtitle, ctaLabel, steps }: MethodSectionProps) {
  const methodSteps =
    steps && steps.length > 0
      ? steps.map((item) => ({
          title: item.title,
          text: item.description,
        }))
      : defaultMethodSteps;

  return (
    <Section id="metodo" variant="surface">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
          <div className="atelier-overline justify-center">Como funciona</div>
          <Heading className="mt-4 text-[2rem] lg:text-[2.7rem]">
            {title?.trim() || 'Quatro etapas claras'}
          </Heading>
          <Text className="mx-auto mt-4 max-w-[560px] text-[14px] text-[color:var(--taupe)]">
            {subtitle?.trim() ||
              'O foco nao e mudar quem voce e. E alinhar leitura, imagem e comportamento.'}
          </Text>
          <div className="mt-7 flex justify-center">
            <TrackedLinkButton
              href="#formatos"
              analytics={{
                name: 'cta_click',
                source: ANALYTICS_SOURCES.HOME_METHOD,
                destination: '#formatos',
                path: '/',
              }}
              variant="outline"
              size="lg"
              className="border-[color:var(--argila)] bg-[color:var(--creme-rosa)] text-[color:var(--espresso)] shadow-[0_8px_18px_rgba(58,36,24,0.08)] hover:border-[color:var(--cacau)] hover:bg-[color:var(--manteiga)]"
            >
              {ctaLabel?.trim() || 'Ver formatos que aplicam esse metodo'}
            </TrackedLinkButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {methodSteps.map((step, index) => (
            <Card
              key={step.title}
              className="fade-up-card h-full border-[color:var(--linho)] bg-[color:var(--manteiga)] px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7"
            >
              <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">0{index + 1}</p>
              <Heading
                as="h3"
                className="mt-4 max-w-[14ch] text-[1.15rem] leading-[1.12] [text-wrap:balance] sm:text-[1.2rem]"
              >
                {step.title}
              </Heading>
              <Text className="mt-3 max-w-[25ch] text-[12px] leading-[1.72] text-[color:var(--taupe)]">
                {step.text}
              </Text>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
