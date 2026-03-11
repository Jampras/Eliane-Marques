export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/core/prisma';
import { parsePageParam } from '@/lib/core/pagination';
import { PaginationNav } from '@/components/ui/PaginationNav';
import { Heading } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/LinkButton';
import { requireAdmin } from '@/lib/server/admin-auth';

const PAGE_SIZE = 12;

type AdminProductsPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  await requireAdmin();
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPage = parsePageParam(resolvedSearchParams.page);
  const totalItems = await prisma.product.count();
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-12">
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
        <div>
          <Badge className="mb-4">Ecosistema</Badge>
          <Heading as="h1" className="text-3xl sm:text-4xl">
            Gestao de Produtos
          </Heading>
        </div>
        <LinkButton href="/admin/produtos/novo" className="w-full sm:w-auto">
          Novo Produto
        </LinkButton>
      </div>

      <div className="space-y-3 lg:hidden">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-surface space-y-3 border border-border-soft p-4 transition-transform active:scale-[0.995]"
          >
            <div className="flex items-start gap-3">
              {p.coverImage && (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-border bg-bg">
                  <Image src={p.coverImage} alt={p.title} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="flex-1">
                <p className="leading-tight font-bold text-text-1">{p.title}</p>
                <p className="text-text-secondary mt-1 text-[10px] break-all">{p.slug}</p>
              </div>
              <Badge variant="outline" className="shrink-0 text-[10px]">
                {p.type}
              </Badge>
            </div>

            <p className="font-display text-primary text-lg">{currencyFormatter.format(p.price)}</p>

            <Link
              href={`/admin/produtos/${p.id}/editar`}
              className="text-primary inline-flex items-center text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-primary"
            >
              Editar Produto
            </Link>
          </div>
        ))}

        {products.length === 0 && (
          <div className="bg-surface border border-border-soft p-10 text-center italic opacity-30">
            Nenhum produto cadastrado.
          </div>
        )}
      </div>

      <div className="bg-surface hidden border border-border-soft lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft">
              <th className="text-text-secondary p-6 text-[10px] font-bold tracking-widest uppercase">
                Produto
              </th>
              <th className="text-text-secondary p-6 text-[10px] font-bold tracking-widest uppercase">
                Tipo
              </th>
              <th className="text-text-secondary p-6 text-[10px] font-bold tracking-widest uppercase">
                Preco
              </th>
              <th className="text-text-secondary p-6 text-right text-[10px] font-bold tracking-widest uppercase">
                Acoes
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border-soft transition-colors hover:bg-primary/5">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    {p.coverImage ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-border bg-bg">
                        <Image src={p.coverImage} alt={p.title} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-soft bg-bg">
                        <span className="material-symbols-outlined text-text-muted !text-[18px]">image</span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-text-1">{p.title}</p>
                      <p className="text-text-secondary mt-1 text-[10px]">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <Badge variant="outline" className="text-[10px]">
                    {p.type}
                  </Badge>
                </td>
                <td className="font-display text-primary p-6">
                  {currencyFormatter.format(p.price)}
                </td>
                <td className="p-6 text-right">
                  <Link
                    href={`/admin/produtos/${p.id}/editar`}
                    className="text-primary text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-primary"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-20 text-center italic opacity-30">Nenhum produto cadastrado.</div>
        )}
      </div>

      <PaginationNav
        currentPage={currentPage}
        totalPages={totalPages}
        pathname="/admin/produtos"
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}