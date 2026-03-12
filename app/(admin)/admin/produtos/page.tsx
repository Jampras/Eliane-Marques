export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/core/prisma';
import { parsePageParam } from '@/lib/core/pagination';
import { PaginationNav } from '@/components/ui/PaginationNav';
import { Heading } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { LinkButton } from '@/components/ui/LinkButton';
import { AdminEmptyState } from '@/components/features/admin/AdminEmptyState';
import { requireAdmin } from '@/lib/server/admin-auth';
import { EDITORIAL_POLICY } from '@/lib/core/editorial-highlights';
import {
  ADMIN_EMPTY_STATE_CLASS,
  ADMIN_EMPTY_STATE_DESKTOP_CLASS,
  ADMIN_MOBILE_CARD_CLASS,
  ADMIN_PAGE_HEADER_CLASS,
  ADMIN_PAGE_WRAPPER_CLASS,
  ADMIN_TABLE_HEAD_ROW_CLASS,
  ADMIN_TABLE_ROW_CLASS,
  ADMIN_TABLE_WRAPPER_CLASS,
} from '@/components/features/admin/listStyles';

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
    orderBy: [{ featured: 'desc' }, { bestSeller: 'desc' }, { createdAt: 'desc' }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className={ADMIN_PAGE_WRAPPER_CLASS}>
      <div className={ADMIN_PAGE_HEADER_CLASS}>
        <div>
          <Badge className="mb-4">Ecosistema</Badge>
          <Heading as="h1" className="text-3xl sm:text-4xl">
            Gestao de Produtos
          </Heading>
          <p className="text-text-secondary mt-3 max-w-2xl text-[12px] leading-6">
            <strong className="text-text-1">Destaque:</strong> {EDITORIAL_POLICY.featured}{' '}
            <strong className="text-text-1">Mais vendido:</strong> {EDITORIAL_POLICY.bestSeller}
          </p>
        </div>
        <LinkButton href="/admin/produtos/novo" className="w-full sm:w-auto">
          Novo Produto
        </LinkButton>
      </div>

      <div className="space-y-3 lg:hidden">
        {products.map((product) => (
          <div key={product.id} className={ADMIN_MOBILE_CARD_CLASS}>
            <div className="flex items-start gap-3">
              {product.coverImage ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-border bg-bg">
                  <Image
                    src={product.coverImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-border bg-bg">
                  <Icon name="image" className="text-text-muted !text-[18px]" />
                </div>
              )}

              <div className="flex-1">
                <p className="leading-tight font-bold text-text-1">{product.title}</p>
                <p className="text-text-secondary mt-1 break-all text-[10px]">{product.slug}</p>
              </div>

              <Badge variant="outline" className="shrink-0 text-[10px]">
                {product.type}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.featured && <Badge variant="outline">Destaque</Badge>}
              {product.bestSeller && <Badge variant="outline">Mais vendido</Badge>}
            </div>

            <p className="font-display text-primary text-lg">
              {currencyFormatter.format(product.price)}
            </p>

            <LinkButton href={`/admin/produtos/${product.id}/editar`} variant="outline" size="sm">
              Editar Produto
            </LinkButton>
          </div>
        ))}

        {products.length === 0 && (
          <div className={ADMIN_EMPTY_STATE_CLASS}>
            <AdminEmptyState
              badge="Catalogo"
              title="Nenhum produto cadastrado"
              description="Crie a primeira oferta para o site publico e para o funil comercial do admin."
              actionLabel="Criar Produto"
              actionHref="/admin/produtos/novo"
            />
          </div>
        )}
      </div>

      <div className={ADMIN_TABLE_WRAPPER_CLASS}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={ADMIN_TABLE_HEAD_ROW_CLASS}>
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
            {products.map((product) => (
              <tr key={product.id} className={ADMIN_TABLE_ROW_CLASS}>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    {product.coverImage ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-border bg-bg">
                        <Image
                          src={product.coverImage}
                          alt={product.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-soft bg-bg">
                        <Icon name="image" className="text-text-muted !text-[18px]" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-text-1">{product.title}</p>
                      <p className="text-text-secondary mt-1 text-[10px]">{product.slug}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.featured && <Badge variant="outline">Destaque</Badge>}
                        {product.bestSeller && <Badge variant="outline">Mais vendido</Badge>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <Badge variant="outline" className="text-[10px]">
                    {product.type}
                  </Badge>
                </td>
                <td className="font-display text-primary p-6">
                  {currencyFormatter.format(product.price)}
                </td>
                <td className="p-6 text-right">
                  <LinkButton
                    href={`/admin/produtos/${product.id}/editar`}
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

        {products.length === 0 && (
          <div className={ADMIN_EMPTY_STATE_DESKTOP_CLASS}>
            <AdminEmptyState
              badge="Catalogo"
              title="Nenhum produto cadastrado"
              description="Crie a primeira oferta para o site publico e para o funil comercial do admin."
              actionLabel="Criar Produto"
              actionHref="/admin/produtos/novo"
            />
          </div>
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
