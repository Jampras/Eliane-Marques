export const dynamic = 'force-dynamic';

import Link from 'next/link';
import prisma from '@/lib/core/prisma';
import { parsePageParam } from '@/lib/core/pagination';
import { PaginationNav } from '@/components/ui/PaginationNav';
import { Heading } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/LinkButton';
import { requireAdmin } from '@/lib/server/admin-auth';

const PAGE_SIZE = 12;

type AdminContentsPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

const publishedBadgeClass =
  'border-[color:var(--sage)]/30 bg-[color:var(--sage)]/15 text-[color:var(--espresso)]';
const draftBadgeClass =
  'border-[color:var(--linho)] bg-[color:var(--manteiga)] text-[color:var(--taupe)]';

export default async function AdminContentsPage({ searchParams }: AdminContentsPageProps) {
  await requireAdmin();
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = parsePageParam(resolvedSearchParams.page);
  const totalItems = await prisma.post.count();
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-12">
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
        <div>
          <Badge className="mb-4">Editorial</Badge>
          <Heading as="h1" className="text-3xl sm:text-4xl">
            Gestao de Conteudo
          </Heading>
        </div>
        <LinkButton href="/admin/conteudos/novo" className="w-full sm:w-auto">
          Novo Artigo
        </LinkButton>
      </div>

      <div className="space-y-3 lg:hidden">
        {posts.map((post) => (
          <div
            key={post.id}
            className="space-y-3 border border-[color:var(--linho)] bg-[color:var(--aveia)] p-4 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] transition-transform active:scale-[0.995]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="leading-tight font-bold text-text-1">{post.title}</p>
                <p className="text-text-secondary mt-1 line-clamp-2 text-[10px]">{post.excerpt}</p>
              </div>
              <Badge className={post.published ? publishedBadgeClass : draftBadgeClass}>
                {post.published ? 'Publicado' : 'Rascunho'}
              </Badge>
            </div>

            <p className="text-text-secondary text-[10px] tracking-widest uppercase">
              {new Date(post.createdAt).toLocaleDateString('pt-BR')}
            </p>

            <Link
              href={`/admin/conteudos/${post.id}/editar`}
              className="text-primary inline-flex items-center text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-primary"
            >
              Editar Artigo
            </Link>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="border border-[color:var(--linho)] bg-[color:var(--manteiga)] p-10 text-center italic text-[color:var(--taupe)]">
            Nenhum conteudo cadastrado.
          </div>
        )}
      </div>

      <div className="hidden border border-[color:var(--linho)] bg-[color:var(--aveia)] lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--linho)]">
              <th className="text-text-secondary p-6 text-[10px] font-bold tracking-widest uppercase">
                Titulo
              </th>
              <th className="text-text-secondary p-6 text-[10px] font-bold tracking-widest uppercase">
                Data
              </th>
              <th className="text-text-secondary p-6 text-[10px] font-bold tracking-widest uppercase">
                Status
              </th>
              <th className="text-text-secondary p-6 text-right text-[10px] font-bold tracking-widest uppercase">
                Acoes
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-[color:var(--linho)] transition-colors hover:bg-[color:var(--manteiga)]"
              >
                <td className="p-6">
                  <p className="font-bold text-text-1">{post.title}</p>
                  <p className="text-text-secondary mt-1 line-clamp-1 text-[10px]">{post.excerpt}</p>
                </td>
                <td className="text-text-secondary p-6 text-[10px] tracking-widest uppercase">
                  {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-6">
                  <Badge className={post.published ? publishedBadgeClass : draftBadgeClass}>
                    {post.published ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </td>
                <td className="p-6 text-right">
                  <Link
                    href={`/admin/conteudos/${post.id}/editar`}
                    className="text-primary text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-primary"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="p-20 text-center italic text-[color:var(--taupe)]">
            Nenhum conteudo cadastrado.
          </div>
        )}
      </div>

      <PaginationNav
        currentPage={currentPage}
        totalPages={totalPages}
        pathname="/admin/conteudos"
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
