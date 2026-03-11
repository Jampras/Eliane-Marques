import Link from 'next/link';
import { getPageWindow } from '@/lib/core/pagination';

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  pathname: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

function buildPageHref(
  pathname: string,
  searchParams: Record<string, string | string[] | undefined>,
  page: number
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'page' || value == null) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
      continue;
    }
    params.set(key, value);
  }

  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function PaginationNav({
  currentPage,
  totalPages,
  pathname,
  searchParams = {},
}: PaginationNavProps) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(currentPage, totalPages);
  const lastPageInWindow = pages[pages.length - 1];

  return (
    <nav aria-label="Paginacao" className="mt-10 border-t border-[color:var(--linho)] pt-6 lg:mt-14">
      <div className="mb-5 text-center text-[10px] uppercase tracking-[0.18em] text-[color:var(--taupe)]">
        Pagina {currentPage} de {totalPages}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <Link
          href={buildPageHref(pathname, searchParams, currentPage - 1)}
          aria-disabled={currentPage === 1}
          className={`inline-flex min-h-10 items-center justify-center border px-4 text-[9px] sm:px-5 uppercase tracking-[0.18em] ${
            currentPage === 1
              ? 'pointer-events-none border-[color:var(--linho)]/60 text-[color:var(--taupe)]/50'
              : 'border-[color:var(--linho)] text-[color:var(--cacau)] transition-colors hover:border-[color:var(--argila)] hover:text-[color:var(--argila)]'
          }`}
        >
          Anterior
        </Link>

        {pages[0] > 1 && (
          <>
            <Link
              href={buildPageHref(pathname, searchParams, 1)}
              className="inline-flex h-9 min-w-9 sm:h-10 sm:min-w-10 items-center justify-center border border-[color:var(--linho)] text-[11px] text-[color:var(--cacau)] transition-colors hover:border-[color:var(--argila)] hover:text-[color:var(--argila)]"
            >
              1
            </Link>
            {pages[0] > 2 && <span className="px-1 text-[color:var(--taupe)]">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Link
            key={page}
            href={buildPageHref(pathname, searchParams, page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`inline-flex h-9 min-w-9 sm:h-10 sm:min-w-10 items-center justify-center border px-2.5 text-[10px] sm:px-3 sm:text-[11px] ${
              page === currentPage
                ? 'border-[color:var(--cacau)] bg-[color:var(--cacau)] text-[color:var(--aveia)]'
                : 'border-[color:var(--linho)] text-[color:var(--cacau)] transition-colors hover:border-[color:var(--argila)] hover:text-[color:var(--argila)]'
            }`}
          >
            {page}
          </Link>
        ))}

        {lastPageInWindow < totalPages && (
          <>
            {lastPageInWindow < totalPages - 1 && <span className="px-1 text-[color:var(--taupe)]">...</span>}
            <Link
              href={buildPageHref(pathname, searchParams, totalPages)}
              className="inline-flex h-9 min-w-9 sm:h-10 sm:min-w-10 items-center justify-center border border-[color:var(--linho)] text-[11px] text-[color:var(--cacau)] transition-colors hover:border-[color:var(--argila)] hover:text-[color:var(--argila)]"
            >
              {totalPages}
            </Link>
          </>
        )}

        <Link
          href={buildPageHref(pathname, searchParams, currentPage + 1)}
          aria-disabled={currentPage === totalPages}
          className={`inline-flex min-h-10 items-center justify-center border px-4 text-[9px] sm:px-5 uppercase tracking-[0.18em] ${
            currentPage === totalPages
              ? 'pointer-events-none border-[color:var(--linho)]/60 text-[color:var(--taupe)]/50'
              : 'border-[color:var(--linho)] text-[color:var(--cacau)] transition-colors hover:border-[color:var(--argila)] hover:text-[color:var(--argila)]'
          }`}
        >
          Proxima
        </Link>
      </div>
    </nav>
  );
}