import type { CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Heading, Text } from '@/components/ui/Typography';

const profileTracks = [
  {
    title: 'Executivas em ascensao',
    desc: 'Para quem quer liderar com presenca, firmeza e etiqueta em ambientes de alta exigencia.',
    icon: '\u25c7',
  },
  {
    title: 'Empreendedoras e marcas pessoais',
    desc: 'Para quem precisa alinhar imagem e comunicacao para cobrar melhor e atrair clientes certos.',
    icon: '\u2726',
  },
  {
    title: 'Empresas e equipes',
    desc: 'Para negocios que desejam padrao de atendimento premium e comportamento coerente com a marca.',
    icon: '\u25c8',
  },
];

export function ProfileTracksSection() {
  return (
    <Section>
      <Container>
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
          <div className="atelier-overline justify-center">Perfis atendidos</div>
          <Heading className="mt-4 text-[2.2rem] lg:text-[3rem]">
            Escolha o caminho que combina com seu momento
          </Heading>
          <Text className="mx-auto mt-5 max-w-[620px] text-[14px] text-[color:var(--taupe)]">
            Voce recebe orientacao personalizada para seu contexto, sem receita generica.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {profileTracks.map((track, index) => (
            <Card
              key={track.title}
              className={`fade-up border-[color:var(--linho)] px-6 py-7 lg:px-8 lg:py-9 ${
                index === 1 ? 'bg-[color:var(--creme-rosa)]' : 'bg-[color:var(--aveia)]'
              }`}
              style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
            >
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[15px] text-[color:var(--argila)]">
                {track.icon}
              </div>
              <Heading as="h3" className="text-[1.3rem]">
                {track.title}
              </Heading>
              <Text className="mt-4 text-[12px] text-[color:var(--taupe)]">{track.desc}</Text>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
