export const revalidate = 300;

import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { PaginationNav } from '@/components/ui/PaginationNav';
import { shouldOptimizeImage } from '@/lib/core/images';
import { parsePageParam } from '@/lib/core/pagination';
import { getPaginatedPublishedPosts } from '@/lib/data/posts';

export const metadata = {
  title: 'Blog | Eliane Marques',
  description: 'Artigos e reflexoes sobre etiqueta, branding e elegancia.',
};

const PAGE_SIZE = 6;
const BLOG_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80';

type BlogPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentPage = parsePageParam(resolvedSearchParams.page);
  const postsPage = await getPaginatedPublishedPosts(currentPage, PAGE_SIZE);
  const posts = postsPage.items;

  return (
    <Section variant="surface">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="atelier-overline justify-center">Reflexoes & estrategia</div>
          <Heading className="mt-4 text-[2.4rem] lg:text-[3.3rem]">
            Conteudos sobre imagem, etiqueta e leitura de valor
          </Heading>
          <Text className="mx-auto mt-5 max-w-[640px] text-[14px] text-[color:var(--taupe)]">
            Artigos para aprofundar o repertorio de mulheres que desejam comunicar autoridade com refinamento e clareza.
          </Text>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
          {posts.map((post, index) => {
            const imageSrc = post.coverImage || BLOG_FALLBACK_IMAGE;

            return (
              <Link
                key={post.id}
                href={`/conteudos/${post.slug}`}
                className="fade-up group block"
                style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
              >
                <article className="border border-[color:var(--linho)] bg-[color:var(--aveia)] p-3 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] sm:p-4 lg:p-5">
                  <div className="relative aspect-[16/10] overflow-hidden border border-[color:var(--linho)] bg-[color:var(--manteiga)]">
                    <Image
                      src={imageSrc}
                      alt={post.title}
                      fill
                      unoptimized={!shouldOptimizeImage(imageSrc)}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pt-6">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    <Heading
                      as="h2"
                      className="mt-4 text-[1.6rem] transition-colors group-hover:text-[color:var(--argila)] sm:text-[1.8rem]"
                    >
                      {post.title}
                    </Heading>
                    <Text className="mt-4 text-[13px] italic text-[color:var(--taupe)]">{post.excerpt}</Text>
                    <div className="mt-6 text-[9px] uppercase tracking-[0.18em] text-[color:var(--cacau)]">
                      Ler artigo completo
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="mt-12 border border-[color:var(--linho)] bg-[color:var(--manteiga)] py-16 text-center text-[12px] italic text-[color:var(--taupe)]">
            Ainda nao ha publicacoes disponiveis.
          </div>
        )}

        <PaginationNav
          currentPage={postsPage.page}
          totalPages={postsPage.totalPages}
          pathname="/conteudos"
          searchParams={resolvedSearchParams}
        />
      </Container>
    </Section>
  );
}
