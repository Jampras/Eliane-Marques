import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Heading, Text } from '@/components/ui/Typography';

const defaultProfileTracks = [
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

interface ProfileTracksSectionProps {
  title?: string | null;
  subtitle?: string | null;
  items?: Array<{
    title: string;
    description: string;
    icon?: string | null;
  }>;
}

export function ProfileTracksSection({
  title,
  subtitle,
  items,
}: ProfileTracksSectionProps) {
  const profileTracks =
    items && items.length > 0
      ? items.map((item, index) => ({
          title: item.title,
          desc: item.description,
          icon: item.icon?.trim() || defaultProfileTracks[index]?.icon || '\u2726',
        }))
      : defaultProfileTracks;

  return (
    <Section id="perfis">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
          <div className="atelier-overline justify-center">Para quem e</div>
          <Heading className="mt-4 text-[2rem] lg:text-[2.7rem]">
            {title?.trim() || 'Quem mais se beneficia desse trabalho'}
          </Heading>
          <Text className="mx-auto mt-4 max-w-[560px] text-[14px] text-[color:var(--taupe)]">
            {subtitle?.trim() ||
              'A orientacao foi pensada para momentos em que presenca, leitura de valor e comportamento fazem diferenca.'}
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {profileTracks.map((track, index) => (
            <Card
              key={track.title}
              className={`fade-up-card h-full border-[color:var(--linho)] px-5 py-5 lg:px-7 lg:py-7 ${
                index === 1 ? 'bg-[color:var(--creme-rosa)]' : 'bg-[color:var(--aveia)]'
              }`}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--linho)] bg-[color:var(--creme-rosa)] text-[15px] text-[color:var(--argila)]">
                {track.icon}
              </div>
              <Heading as="h3" className="max-w-[14ch] text-[1.2rem] leading-[1.12] [text-wrap:balance] sm:text-[1.3rem]">
                {track.title}
              </Heading>
              <Text className="mt-3 max-w-[26ch] text-[12px] leading-[1.72] text-[color:var(--taupe)]">
                {track.desc}
              </Text>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
