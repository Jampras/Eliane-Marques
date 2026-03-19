import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { StructuredDataScript } from '@/components/seo/StructuredDataScript';
import { buildFaqJsonLd } from '@/lib/seo/schema';
import { TrackedLinkButton } from '@/components/analytics/TrackedLinkButton';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';
import { HomeFaqAccordion } from './HomeFaqAccordion';

export const faqItems = [
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
    <Section id="faq" variant="surface">
      <StructuredDataScript data={buildFaqJsonLd(faqItems)} />
      <Container size="md">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="atelier-overline justify-center">FAQ</div>
          <Heading className="mt-4 text-[2.2rem] lg:text-[3rem]">
            Duvidas mais comuns
          </Heading>
          <Text className="mx-auto mt-5 max-w-[620px] text-[14px] text-[color:var(--taupe)]">
            Se ainda houver duvida, abra a conversa e receba a recomendacao mais adequada.
          </Text>
        </div>

        <HomeFaqAccordion items={faqItems} />

        <div className="mt-8 flex justify-center">
          <TrackedLinkButton
            href="#cta-final"
            analytics={{
              name: 'cta_click',
              source: ANALYTICS_SOURCES.HOME_FAQ,
              destination: '#cta-final',
              path: '/',
            }}
            size="lg"
          >
            Quero entender meu melhor formato
          </TrackedLinkButton>
        </div>
      </Container>
    </Section>
  );
}
