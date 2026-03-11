import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';

const faqItems = [
  {
    question: 'Isso serve para quem esta comecando?',
    answer:
      'Sim. O trabalho e personalizado para seu momento atual, com passos objetivos para evolucao consistente.',
  },
  {
    question: 'Quanto tempo para sentir resultado?',
    answer:
      'Os primeiros ajustes de percepcao costumam ser sentidos nas primeiras semanas, com evolucao progressiva nas interacoes reais.',
  },
  {
    question: 'Preciso mudar meu estilo inteiro?',
    answer:
      'Nao. O foco nao e descaracterizar voce, e sim alinhar sua imagem ao nivel de valor que voce ja entrega.',
  },
  {
    question: 'Como funciona o primeiro contato?',
    answer:
      'Voce chama no WhatsApp, responde algumas perguntas e recebe a recomendacao de formato mais adequado para seu objetivo.',
  },
];

export function FaqSection() {
  return (
    <Section variant="surface" className="border-y border-[color:var(--linho)]/70">
      <Container size="md">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="atelier-overline justify-center">FAQ</div>
          <Heading className="mt-4 text-[2.2rem] lg:text-[3rem]">
            Duvidas que costumam travar a decisao
          </Heading>
          <Text className="mx-auto mt-5 max-w-[620px] text-[14px] text-[color:var(--taupe)]">
            Se algo ainda estiver em aberto, eu te ajudo a clarear no WhatsApp.
          </Text>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              className="fade-up border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-4 sm:px-5 sm:py-5 lg:px-6"
              style={{ '--delay': `${index * 0.06}s` } as CSSProperties}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[11px] font-[400] uppercase tracking-[0.12em] text-[color:var(--espresso)] sm:text-[13px]">
                <span>{item.question}</span>
                <span className="text-[color:var(--argila)]">+</span>
              </summary>
              <p className="mt-4 text-[12px] font-[300] leading-[1.85] text-[color:var(--taupe)]">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
