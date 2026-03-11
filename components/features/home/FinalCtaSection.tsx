import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { WhatsAppButton } from '@/components/shared/whatsapp/WhatsAppButton';

interface FinalCtaSectionProps {
  waConfig: { number: string; defaultMessage: string };
}

export function FinalCtaSection({ waConfig }: FinalCtaSectionProps) {
  return (
    <Section variant="black" className="relative">
      <Container className="text-center">
        <div className="mx-auto max-w-3xl">
          <div className="fade-up inline-flex" style={{ '--delay': '0s' } as CSSProperties}>
            <div className="h-px w-full bg-[linear-gradient(to_right,transparent,rgba(200,146,58,1),transparent)]" />
          </div>
          <Heading
            className="fade-up mt-8 text-[2.4rem] text-[color:var(--aveia)] lg:text-[3rem]"
            style={{ '--delay': '0.1s' } as CSSProperties}
          >
            Se sua imagem ainda nao representa seu nivel, este e o momento de{' '}
            <span className="italic text-[color:var(--mel)]">ajustar</span>.
          </Heading>
          <p
            className="fade-up mt-5 font-ornament text-[1.05rem] italic text-[color:var(--taupe)]"
            style={{ '--delay': '0.2s' } as CSSProperties}
          >
            Atendo poucas pessoas por ciclo para manter acompanhamento de alta qualidade.
          </p>
          <div className="fade-up mt-8" style={{ '--delay': '0.3s' } as CSSProperties}>
            <WhatsAppButton
              number={waConfig.number}
              template="Ola Eliane! Quero garantir uma vaga neste ciclo e entender o melhor formato para mim."
              label="Quero garantir minha vaga"
              className="!border-[color:var(--argila)] !bg-[color:var(--argila)] !text-[color:var(--aveia)] hover:!bg-[color:var(--cacau)]"
              size="lg"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
