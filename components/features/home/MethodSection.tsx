import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Heading, Text } from '@/components/ui/Typography';

const methodSteps = [
  {
    title: 'Diagnostico de Percepcao',
    text: 'Mapeamos como sua imagem, postura e comunicacao estao sendo lidas hoje.',
  },
  {
    title: 'Plano de Ajuste Estrategico',
    text: 'Definimos prioridades praticas para voce elevar sua presenca sem perder autenticidade.',
  },
  {
    title: 'Refinamento com Acompanhamento',
    text: 'Ajustamos detalhes de comportamento e linguagem ate o novo posicionamento virar natural.',
  },
];

export function MethodSection() {
  return (
    <Section variant="surface" className="border-y border-[color:var(--linho)]/70">
      <Container>
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
          <div className="atelier-overline justify-center">Metodo</div>
          <Heading className="mt-4 text-[2.2rem] lg:text-[3rem]">
            Um processo claro para voce evoluir com confianca
          </Heading>
          <Text className="mx-auto mt-5 max-w-[620px] text-[14px] text-[color:var(--taupe)]">
            Clareza reduz ansiedade. Quando voce sabe o proximo passo, fica mais facil agir.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {methodSteps.map((step, index) => (
            <Card
              key={step.title}
              className="fade-up border-[color:var(--linho)] bg-[color:var(--manteiga)] px-6 py-7 lg:px-8 lg:py-9"
              style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
            >
              <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">0{index + 1}</p>
              <Heading as="h3" className="mt-4 text-[1.3rem]">
                {step.title}
              </Heading>
              <Text className="mt-4 text-[12px] text-[color:var(--taupe)]">{step.text}</Text>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
