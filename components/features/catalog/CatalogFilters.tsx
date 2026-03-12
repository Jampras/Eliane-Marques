import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface CatalogFiltersProps {
  clearHref: string;
  searchPlaceholder: string;
  defaultQuery?: string;
  defaultAudience?: string;
  defaultFeatured?: boolean;
  showAudience?: boolean;
  showFeatured?: boolean;
}

export function CatalogFilters({
  clearHref,
  searchPlaceholder,
  defaultQuery = '',
  defaultAudience = '',
  defaultFeatured = false,
  showAudience = false,
  showFeatured = false,
}: CatalogFiltersProps) {
  return (
    <form method="get" className="mt-8 border border-[color:var(--linho)] bg-[color:var(--manteiga)] p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder={searchPlaceholder}
          className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[12px] text-[color:var(--espresso)] outline-none transition-colors placeholder:text-[color:var(--taupe)] focus:border-[color:var(--argila)]"
        />

        {showAudience ? (
          <select
            name="audience"
            defaultValue={defaultAudience}
            className="border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[color:var(--espresso)] outline-none transition-colors focus:border-[color:var(--argila)]"
          >
            <option value="">Todos os publicos</option>
            <option value="PESSOAS">Pessoas</option>
            <option value="EMPRESAS">Empresas</option>
            <option value="AMBOS">Ambos</option>
          </select>
        ) : (
          <input type="hidden" name="audience" value="" />
        )}

        {showFeatured ? (
          <label className="flex items-center gap-3 border border-[color:var(--linho)] bg-[color:var(--aveia)] px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-[color:var(--taupe)]">
            <input
              type="checkbox"
              name="featured"
              value="1"
              defaultChecked={defaultFeatured}
              className="accent-[color:var(--argila)] h-4 w-4"
            />
            Apenas destaques
          </label>
        ) : (
          <input type="hidden" name="featured" value="" />
        )}

        <div className="flex gap-3">
          <Button type="submit" className="w-full lg:w-auto">
            Filtrar
          </Button>
          <Link
            href={clearHref}
            className="inline-flex w-full items-center justify-center rounded-[1px] border border-[color:var(--linho)] px-7 py-3 text-[10px] font-[400] uppercase tracking-[0.18em] text-text-2 transition-all duration-300 hover:border-[color:var(--argila)] hover:text-[color:var(--argila)] lg:w-auto"
          >
            Limpar
          </Link>
        </div>
      </div>
    </form>
  );
}
