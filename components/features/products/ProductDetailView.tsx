import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/LinkButton';
import { WhatsAppButton } from '@/components/shared/whatsapp/WhatsAppButton';
import { shouldOptimizeImage } from '@/lib/core/images';
import { getProductSectionLabel } from '@/lib/core/product-paths';
import { getProductCta } from '@/lib/core/product-cta';

interface ProductDetailViewProps {
  product: {
    title: string;
    slug: string;
    shortDesc: string;
    longDesc: string | null;
    price: number;
    type: string;
    coverImage: string | null;
    ctaMode: string;
    ctaUrl: string | null;
    ctaLabel: string | null;
    whatsappMessageTemplate: string | null;
  };
  waConfig: { number: string; defaultMessage: string };
}

export function ProductDetailView({ product, waConfig }: ProductDetailViewProps) {
  const fallbackIcon = product.type === 'CHECKLIST' ? '✦' : '◇';
  const cta = getProductCta(product, waConfig);
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_minmax(0,1fr)] xl:gap-12">
          <div>
            <div className="border border-[color:var(--linho)] bg-[color:var(--manteiga)] p-4 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] xl:sticky xl:top-28">
              <div className="relative aspect-[3/4] border border-[color:var(--linho)] bg-[color:var(--aveia)]">
                {product.coverImage ? (
                  <Image
                    src={product.coverImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                    unoptimized={!shouldOptimizeImage(product.coverImage)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[2.2rem] text-[color:var(--argila)]">
                    {fallbackIcon}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="atelier-overline">{getProductSectionLabel(product.type)}</div>
            <Badge className="mt-6">{product.type}</Badge>
            <Heading as="h1" className="mt-6 text-[2.2rem] sm:text-[2.6rem] xl:text-[4rem]">
              {product.title}
            </Heading>

            <div className="mt-8 border-y border-[color:var(--linho)] py-5">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
                Investimento
              </p>
              <p className="mt-3 font-ornament text-[2.5rem] leading-none text-[color:var(--cacau)] sm:text-[3rem] xl:text-[3.4rem]">
                <sup className="mr-1 text-[0.35em] opacity-70">R$</sup>
                {formattedPrice.replace('R$', '')}
              </p>
              <Text className="mt-3 text-[12px] text-[color:var(--taupe)]">
                Pagamento unico · acesso vitalicio
              </Text>
            </div>

            <Text className="mt-8 whitespace-pre-wrap text-[14px] text-[color:var(--taupe)]">
              {product.longDesc || product.shortDesc}
            </Text>

            <div className="mt-10">
              {cta.external ? (
                <LinkButton
                  href={cta.href}
                  className="w-full sm:w-auto"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cta.label}
                </LinkButton>
              ) : (
                <WhatsAppButton
                  number={waConfig.number}
                  template={
                    product.whatsappMessageTemplate ||
                    'Ola! Gostaria de saber mais sobre {productTitle}. Vi na pagina {pageUrl}'
                  }
                  productTitle={product.title}
                  label={cta.label}
                  className="w-full sm:w-auto"
                  size="lg"
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
