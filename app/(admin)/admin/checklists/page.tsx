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

type AdminChecklistsPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

const publishedBadgeClass =
  'border-[color:var(--sage)]/30 bg-[color:var(--sage)]/15 text-[color:var(--espresso)]';
const draftBadgeClass =
  'border-[color:var(--linho)] bg-[color:var(--manteiga)] text-[color:var(--taupe)]';

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
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-12">
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
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
          <div
            key={checklist.id}
            className="space-y-3 border border-[color:var(--linho)] bg-[color:var(--aveia)] p-4 shadow-[2px_3px_12px_rgba(58,36,24,0.06)] transition-transform active:scale-[0.995]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="leading-tight font-bold text-text-1">{checklist.title}</p>
              <div className="flex shrink-0 items-center gap-2">
                <Badge className={checklist.published ? publishedBadgeClass : draftBadgeClass}>
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

            <Link
              href={`/admin/checklists/${checklist.id}/editar`}
              className="text-primary inline-flex items-center text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-primary"
            >
              Editar Checklist
            </Link>
          </div>
        ))}

        {checklists.length === 0 && (
          <div className="border border-[color:var(--linho)] bg-[color:var(--manteiga)] p-10 text-center italic text-[color:var(--taupe)]">
            Nenhuma checklist cadastrada.
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
              <tr
                key={checklist.id}
                className="border-b border-[color:var(--linho)] transition-colors hover:bg-[color:var(--manteiga)]"
              >
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
                  <Badge className={checklist.published ? publishedBadgeClass : draftBadgeClass}>
                    {checklist.published ? 'Publicada' : 'Rascunho'}
                  </Badge>
                </td>
                <td className="text-text-secondary p-6 text-[10px] tracking-widest uppercase italic">
                  /{checklist.slug}
                </td>
                <td className="p-6 text-right">
                  <Link
                    href={`/admin/checklists/${checklist.id}/editar`}
                    className="text-primary text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-primary"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {checklists.length === 0 && (
          <div className="p-20 text-center italic text-[color:var(--taupe)]">
            Nenhuma checklist cadastrada.
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
