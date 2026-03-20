export const revalidate = 300;

import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { StructuredDataScript } from '@/components/seo/StructuredDataScript';
import { WhatsAppButton } from '@/components/shared/whatsapp/WhatsAppButton';
import { shouldOptimizeImage } from '@/lib/core/images';
import { getPostBySlug } from '@/lib/data/posts';
import { getWhatsAppConfig } from '@/lib/data/config';
import { buildArticleJsonLd } from '@/lib/seo/schema';

type PostPageProps = { params: Promise<{ slug: string }> };

const BLOG_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post nao encontrado' };
  }

  return {
    title: `${post.title} | Eliane Marques`,
    description: post.excerpt,
    alternates: { canonical: `/conteudos/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/conteudos/${post.slug}`,
    },
  };
}

export default async function PostDetail({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const wa = await getWhatsAppConfig();

  if (!post) {
    notFound();
  }

  const imageSrc = post.coverImage || BLOG_FALLBACK_IMAGE;

  return (
    <article>
      <StructuredDataScript
        data={buildArticleJsonLd({
          title: post.title,
          description: post.excerpt,
          path: `/conteudos/${post.slug}`,
          createdAt: post.createdAt,
          image: post.coverImage,
        })}
      />
      <Section variant="surface">
        <Container size="md">
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
              {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <Heading as="h1" className="mx-auto mt-5 max-w-[900px] text-[2.1rem] sm:text-[2.6rem] xl:text-[4.2rem]">
              {post.title}
            </Heading>
            <p className="mx-auto mt-5 max-w-[620px] font-ornament text-[1rem] italic text-[color:var(--taupe)] sm:text-[1.1rem]">
              {post.excerpt}
            </p>
          </div>
        </Container>

        <Container className="mt-8 md:mt-10 lg:mt-12">
          <div className="relative aspect-[16/9] overflow-hidden border border-[color:var(--linho)] bg-[color:var(--manteiga)] shadow-[var(--theme-card-shadow)]">
            <Image
              src={imageSrc}
              alt={post.title}
              fill
              unoptimized={!shouldOptimizeImage(imageSrc)}
              priority
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>

        <Container size="md" className="mt-8 md:mt-10 lg:mt-12">
          <div className="border-t border-[color:var(--linho)] pt-8">
            <Text className="whitespace-pre-wrap text-[14px] leading-[1.9] text-[color:var(--taupe)] sm:text-[15px] sm:leading-[1.95]">
              {post.content}
            </Text>
          </div>

          <div className="mt-12 border-t border-[color:var(--linho)] pt-10 text-center">
            <Badge className="mb-5">Proximo passo</Badge>
            <Heading className="text-[2rem] lg:text-[2.6rem]">Deseja elevar seu posicionamento?</Heading>
            <Text className="mx-auto mt-4 max-w-[560px] text-[13px] text-[color:var(--taupe)]">
              Agende uma sessao estrategica para discutir seus objetivos de imagem, etiqueta e presenca profissional.
            </Text>
            <div className="mt-8">
              <WhatsAppButton
                number={wa.number}
                template={`Ola Eliane! Li seu artigo "${post.title}" e gostaria de conversar sobre consultoria.`}
                label="Falar com Eliane"
                className="mx-auto w-full sm:w-auto"
                size="lg"
                analyticsSource="post-detail"
              />
            </div>
          </div>
        </Container>
      </Section>
    </article>
  );
}
