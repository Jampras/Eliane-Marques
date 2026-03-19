import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Heading, Text } from '@/components/ui/Typography';
import { TrackedLinkButton } from '@/components/analytics/TrackedLinkButton';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';

export function IdentitySection() {
  return (
    <Section id="leitura-valor" variant="surface">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
          <div className="atelier-overline justify-center">Leitura de valor</div>
          <Heading className="mt-4 text-[2rem] lg:text-[2.7rem]">
            Quando a imagem nao acompanha o nivel da entrega
          </Heading>
          <Text className="mx-auto mt-4 max-w-[560px] text-[14px] text-[color:var(--taupe)]">
            O problema costuma aparecer em respeito, clareza e leitura de valor.
          </Text>
          <div className="mt-7 flex justify-center">
            <TrackedLinkButton
              href="#investimentos"
              analytics={{
                name: 'cta_click',
                source: ANALYTICS_SOURCES.HOME_IDENTITY,
                destination: '#investimentos',
                path: '/',
              }}
              variant="outline"
              size="lg"
              className="border-[color:var(--argila)] bg-[color:var(--creme-rosa)] text-[color:var(--espresso)] shadow-[0_8px_18px_rgba(58,36,24,0.08)] hover:border-[color:var(--cacau)] hover:bg-[color:var(--manteiga)]"
            >
              Ver qual formato responde a isso
            </TrackedLinkButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
          <Card className="border-[color:var(--linho)] bg-[color:var(--aveia)] px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
            <Badge className="mb-4">Sinais de desalinhamento</Badge>
            <Heading
              as="h3"
              className="max-w-[15ch] text-[1.3rem] leading-[1.1] [text-wrap:balance] sm:text-[1.55rem]"
            >
              Seu nivel nao fica claro
            </Heading>
            <ul className="mt-5 space-y-2.5 text-[12px] font-[300] leading-[1.72] text-[color:var(--taupe)]">
              <li>Voce sente que precisa provar valor em toda reuniao</li>
              <li>Preco, fala ou postura geram duvida</li>
              <li>Oportunidades travam por percepcao</li>
            </ul>
          </Card>

          <Card className="border-[color:var(--linho)] bg-[color:var(--creme-rosa)] px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
            <Badge className="mb-4">Quando isso se organiza</Badge>
            <Heading
              as="h3"
              className="max-w-[15ch] text-[1.3rem] leading-[1.1] [text-wrap:balance] sm:text-[1.55rem]"
            >
              Sua presenca sustenta seu valor
            </Heading>
            <ul className="mt-5 space-y-2.5 text-[12px] font-[300] leading-[1.72] text-[color:var(--taupe)]">
              <li>Mais consistencia e peso profissional</li>
              <li>Mais escuta, respeito e clareza</li>
              <li>Mais coerencia entre imagem e posicionamento</li>
            </ul>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
