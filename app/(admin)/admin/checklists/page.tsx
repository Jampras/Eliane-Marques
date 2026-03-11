export const dynamic = 'force-dynamic';

import Link from 'next/link';
import prisma from '@/lib/core/prisma';
import { parsePageParam } from '@/lib/core/pagination';
import { PaginationNav } from '@/components/ui/PaginationNav';
import { Heading } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/LinkButton';
import { AdminEmptyState } from '@/components/features/admin/AdminEmptyState';
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

type AdminChecklistsPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function AdminChecklistsPage({ searchParams }: AdminChecklistsPageProps) {
  await requireAdmin();
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = parsePageParam(resolvedSearchParams.page);
  const totalItems = await prisma.checklist.count();
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const checklists = await prisma.checklist.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div className={ADMIN_PAGE_WRAPPER_CLASS}>
      <div className={ADMIN_PAGE_HEADER_CLASS}>
        <div>
          <Badge className="mb-4">Metodologia</Badge>
          <Heading as="h1" className="text-3xl sm:text-4xl">
            Checklists
          </Heading>
        </div>
        <LinkButton href="/admin/checklists/novo" className="w-full sm:w-auto">
          Nova Checklist
        </LinkButton>
      </div>

      <div className="space-y-3 lg:hidden">
        {checklists.map((checklist) => (
          <div key={checklist.id} className={ADMIN_MOBILE_CARD_CLASS}>
            <div className="flex items-start justify-between gap-3">
              <p className="leading-tight font-bold text-text-1">{checklist.title}</p>
              <div className="flex shrink-0 items-center gap-2">
                <Badge
                  className={
                    checklist.published
                      ? ADMIN_STATUS_PUBLISHED_BADGE_CLASS
                      : ADMIN_STATUS_DRAFT_BADGE_CLASS
                  }
                >
                  {checklist.published ? 'Publicada' : 'Rascunho'}
                </Badge>
                <div className="text-text-secondary flex items-center gap-1">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary text-sm">
                    checklist
                  </span>
                  <span className="text-sm">{checklist._count.items}</span>
                </div>
              </div>
            </div>

            <p className="text-text-secondary break-all text-[10px] tracking-widest uppercase italic">
              /{checklist.slug}
            </p>

            <LinkButton
              href={`/admin/checklists/${checklist.id}/editar`}
              variant="outline"
              size="sm"
            >
              Editar Checklist
            </LinkButton>
          </div>
        ))}

        {checklists.length === 0 && (
          <div className={ADMIN_EMPTY_STATE_CLASS}>
            <AdminEmptyState
              badge="Metodologia"
              title="Nenhuma checklist cadastrada"
              description="Crie uma checklist para apoiar a jornada da cliente e ampliar o funil de entrada."
              actionLabel="Criar Checklist"
              actionHref="/admin/checklists/novo"
            />
          </div>
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
                Itens
              </th>
              <th className="text-text-secondary p-6 text-[10px] font-bold tracking-widest uppercase">
                Status
              </th>
              <th className="text-text-secondary p-6 text-[10px] font-bold tracking-widest uppercase">
                Slug
              </th>
              <th className="text-text-secondary p-6 text-right text-[10px] font-bold tracking-widest uppercase">
                Acoes
              </th>
            </tr>
          </thead>
          <tbody>
            {checklists.map((checklist) => (
              <tr key={checklist.id} className={ADMIN_TABLE_ROW_CLASS}>
                <td className="p-6">
                  <p className="font-bold text-text-1">{checklist.title}</p>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">checklist</span>
                    <span className="text-text-secondary">{checklist._count.items}</span>
                  </div>
                </td>
                <td className="p-6">
                  <Badge
                    className={
                      checklist.published
                        ? ADMIN_STATUS_PUBLISHED_BADGE_CLASS
                        : ADMIN_STATUS_DRAFT_BADGE_CLASS
                    }
                  >
                    {checklist.published ? 'Publicada' : 'Rascunho'}
                  </Badge>
                </td>
                <td className="text-text-secondary p-6 text-[10px] tracking-widest uppercase italic">
                  /{checklist.slug}
                </td>
                <td className="p-6 text-right">
                  <LinkButton
                    href={`/admin/checklists/${checklist.id}/editar`}
                    variant="outline"
                    size="sm"
                  >
                    Editar
                  </LinkButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {checklists.length === 0 && (
          <div className={ADMIN_EMPTY_STATE_DESKTOP_CLASS}>
            <AdminEmptyState
              badge="Metodologia"
              title="Nenhuma checklist cadastrada"
              description="Crie uma checklist para apoiar a jornada da cliente e ampliar o funil de entrada."
              actionLabel="Criar Checklist"
              actionHref="/admin/checklists/novo"
            />
          </div>
        )}
      </div>

      <PaginationNav
        currentPage={currentPage}
        totalPages={totalPages}
        pathname="/admin/checklists"
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
