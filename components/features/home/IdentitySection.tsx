import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Heading, Text } from '@/components/ui/Typography';

export function IdentitySection() {
  return (
    <Section variant="surface" className="border-y border-[color:var(--linho)]/70">
      <Container>
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
          <div className="atelier-overline justify-center">Identificacao e acolhimento</div>
          <Heading className="mt-4 text-[2.2rem] lg:text-[3rem]">
            Voce nao precisa virar outra pessoa para ser{' '}
            <span className="italic text-[color:var(--argila)]">reconhecida</span>
          </Heading>
          <Text className="mx-auto mt-5 max-w-[620px] text-[14px] text-[color:var(--taupe)]">
            Ajustamos sinais de imagem e comportamento para que sua presenca traduza com clareza o valor que voce ja carrega.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <Card className="border-[color:var(--linho)] bg-[color:var(--aveia)] px-6 py-7 lg:px-8 lg:py-9">
            <Badge className="mb-5">Quando esta desalinhado</Badge>
            <Heading as="h3" className="text-[1.7rem]">
              Voce se esforca muito e recebe pouco retorno
            </Heading>
            <ul className="mt-6 space-y-3 text-[12px] font-[300] leading-[1.8] text-[color:var(--taupe)]">
              <li>Hesita em reunioes importantes</li>
              <li>Sente que precisa provar valor o tempo todo</li>
              <li>Perde oportunidades por detalhes de percepcao</li>
              <li>Nao se sente confortavel em ambientes formais</li>
            </ul>
          </Card>

          <Card className="border-[color:var(--linho)] bg-[color:var(--creme-rosa)] px-6 py-7 lg:px-8 lg:py-9">
            <Badge className="mb-5">Quando esta alinhado</Badge>
            <Heading as="h3" className="text-[1.7rem]">
              Sua presenca transmite seguranca e autoridade
            </Heading>
            <ul className="mt-6 space-y-3 text-[12px] font-[300] leading-[1.8] text-[color:var(--taupe)]">
              <li>Voce e percebida como referencia com naturalidade</li>
              <li>As conversas passam a ter mais respeito e escuta</li>
              <li>Sua imagem sustenta seus precos e seu posicionamento</li>
              <li>Aparecem convites e oportunidades mais qualificadas</li>
            </ul>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
