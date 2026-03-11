export const dynamic = 'force-dynamic';

import Link from 'next/link';
import prisma from '@/lib/core/prisma';
import { parsePageParam } from '@/lib/core/pagination';
import { PaginationNav } from '@/components/ui/PaginationNav';
import { Heading } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/LinkButton';
import { requireAdmin } from '@/lib/server/admin-auth';
import {
  ADMIN_EMPTY_STATE_CLASS,
  ADMIN_EMPTY_STATE_DESKTOP_CLASS,
  ADMIN_MOBILE_CARD_CLASS,
  ADMIN_PAGE_HEADER_CLASS,
  ADMIN_PAGE_WRAPPER_CLASS,
  ADMIN_STATUS_DRAFT_BADGE_CLASS,
  ADMIN_STATUS_PUBLISHED_BADGE_CLASS,
  ADMIN_TABLE_HEAD_ROW_CLASS,
  ADMIN_TABLE_ROW_CLASS,
  ADMIN_TABLE_WRAPPER_CLASS,
} from '@/components/features/admin/listStyles';

const PAGE_SIZE = 12;

type AdminContentsPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

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
    <div className={ADMIN_PAGE_WRAPPER_CLASS}>
      <div className={ADMIN_PAGE_HEADER_CLASS}>
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
          <div key={post.id} className={ADMIN_MOBILE_CARD_CLASS}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="leading-tight font-bold text-text-1">{post.title}</p>
                <p className="text-text-secondary mt-1 line-clamp-2 text-[10px]">
                  {post.excerpt}
                </p>
              </div>
              <Badge
                className={
                  post.published
                    ? ADMIN_STATUS_PUBLISHED_BADGE_CLASS
                    : ADMIN_STATUS_DRAFT_BADGE_CLASS
                }
              >
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
          <div className={ADMIN_EMPTY_STATE_CLASS}>Nenhum conteudo cadastrado.</div>
        )}
      </div>

      <div className={ADMIN_TABLE_WRAPPER_CLASS}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={ADMIN_TABLE_HEAD_ROW_CLASS}>
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
              <tr key={post.id} className={ADMIN_TABLE_ROW_CLASS}>
                <td className="p-6">
                  <p className="font-bold text-text-1">{post.title}</p>
                  <p className="text-text-secondary mt-1 line-clamp-1 text-[10px]">
                    {post.excerpt}
                  </p>
                </td>
                <td className="text-text-secondary p-6 text-[10px] tracking-widest uppercase">
                  {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-6">
                  <Badge
                    className={
                      post.published
                        ? ADMIN_STATUS_PUBLISHED_BADGE_CLASS
                        : ADMIN_STATUS_DRAFT_BADGE_CLASS
                    }
                  >
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
          <div className={ADMIN_EMPTY_STATE_DESKTOP_CLASS}>Nenhum conteudo cadastrado.</div>
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
