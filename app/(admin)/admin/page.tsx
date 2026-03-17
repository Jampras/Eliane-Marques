export const dynamic = 'force-dynamic';

import Link from 'next/link';
import prisma from '@/lib/core/prisma';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ANALYTICS_SOURCES } from '@/lib/analytics/events';
import { getDashboardAnalyticsSummary } from '@/lib/analytics/reporting';
import { requireAdmin } from '@/lib/server/admin-auth';

const quickActions = [
  { label: 'Novo Produto', href: '/admin/produtos/novo', icon: 'add_shopping_cart' },
  { label: 'Publicar Artigo', href: '/admin/conteudos/novo', icon: 'edit_note' },
  { label: 'Criar Checklist', href: '/admin/checklists/novo', icon: 'playlist_add' },
  { label: 'Site Config', href: '/admin/config', icon: 'tune' },
] as const;

const rangeOptions = [
  { value: '7d', label: '7 dias', days: 7 },
  { value: '30d', label: '30 dias', days: 30 },
  { value: '90d', label: '90 dias', days: 90 },
  { value: 'all', label: 'Tudo' },
] as const;

const sourceOptions = [
  { value: 'all', label: 'Todos os canais' },
  { value: ANALYTICS_SOURCES.HOME_PRICING, label: 'Home / pricing' },
  { value: ANALYTICS_SOURCES.HOME_SERVICES, label: 'Home / servicos' },
  { value: ANALYTICS_SOURCES.PRODUCT_DETAIL, label: 'Detalhe de produto' },
  { value: ANALYTICS_SOURCES.PRODUCT_LIST, label: 'Listagens' },
  { value: ANALYTICS_SOURCES.NAVBAR, label: 'Navbar' },
  { value: ANALYTICS_SOURCES.MOBILE_NAV, label: 'Menu mobile' },
  { value: ANALYTICS_SOURCES.FLOATING_WHATSAPP, label: 'WhatsApp flutuante' },
  { value: ANALYTICS_SOURCES.CONTACT_FORM, label: 'Formulario de contato' },
  { value: ANALYTICS_SOURCES.CONTACT_PAGE, label: 'Pagina de contato' },
] as const;

type RangeValue = (typeof rangeOptions)[number]['value'];
type SourceValue = (typeof sourceOptions)[number]['value'];

type AdminDashboardProps = {
  searchParams?: Promise<{ range?: string; source?: string }>;
};

function isRangeValue(value: string | undefined): value is RangeValue {
  return rangeOptions.some((option) => option.value === value);
}

function isSourceValue(value: string | undefined): value is SourceValue {
  return sourceOptions.some((option) => option.value === value);
}

function getRangeStart(range: RangeValue) {
  let days: number | undefined;

  switch (range) {
    case '7d':
      days = 7;
      break;
    case '30d':
      days = 30;
      break;
    case '90d':
      days = 90;
      break;
    default:
      days = undefined;
  }

  if (days === undefined) return undefined;

  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function getDashboardHref(range: RangeValue, source: SourceValue) {
  const params = new URLSearchParams();

  if (range !== 'all') {
    params.set('range', range);
  }

  if (source !== 'all') {
    params.set('source', source);
  }

  const query = params.toString();
  return query ? `/admin?${query}` : '/admin';
}

function getButtonClass(active: boolean) {
  return active
    ? 'border-primary bg-primary/10 text-primary'
    : 'border-border-soft text-text-secondary hover:border-primary/40 hover:text-text-1';
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  await requireAdmin();

  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedRange: RangeValue = isRangeValue(resolvedSearchParams.range)
    ? resolvedSearchParams.range
    : '30d';
  const selectedSource: SourceValue = isSourceValue(resolvedSearchParams.source)
    ? resolvedSearchParams.source
    : 'all';

  const rangeStart = getRangeStart(selectedRange);
  const leadsWhere = {
    ...(rangeStart ? { createdAt: { gte: rangeStart } } : {}),
    ...(selectedSource !== 'all' ? { source: selectedSource } : {}),
  };

  const [
    totalProducts,
    activeProducts,
    publishedPosts,
    publishedChecklists,
    totalConfigs,
    totalLeads,
    recentLeads,
    analyticsSummary,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.post.count({ where: { published: true } }),
    prisma.checklist.count({ where: { published: true } }),
    prisma.siteConfig.count(),
    prisma.lead.count({ where: leadsWhere }),
    prisma.lead.findMany({
      where: leadsWhere,
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    getDashboardAnalyticsSummary({
      rangeStart,
      source: selectedSource !== 'all' ? selectedSource : undefined,
    }),
  ]);

  const metrics = [
    { label: 'Produtos', value: totalProducts, hint: `${activeProducts} ativos` },
    { label: 'Artigos', value: publishedPosts, hint: 'publicados' },
    { label: 'Checklists', value: publishedChecklists, hint: 'publicados' },
    { label: 'Configs', value: totalConfigs, hint: 'chaves ativas' },
  ];

  const commercialMetrics = [
    { label: 'Eventos', value: analyticsSummary.totalEvents, hint: 'cliques rastreados' },
    { label: 'WhatsApp', value: analyticsSummary.whatsappClicks, hint: 'acessos ao canal' },
    { label: 'CTA externo', value: analyticsSummary.externalCtaClicks, hint: 'checkout ou link externo' },
    { label: 'Leads', value: totalLeads, hint: 'capturas por email' },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-12">
      <div className="mb-10 flex items-center justify-between sm:mb-12 lg:mb-16">
        <div>
          <Badge className="mb-4">Visao Geral</Badge>
          <Heading as="h1" className="font-display text-3xl sm:text-4xl lg:text-5xl">
            Dashboard Administrativo
          </Heading>
          <Text className="mt-3 max-w-2xl text-[12px] leading-6">
            Use os filtros para analisar a tracao comercial por periodo e origem, sem misturar comportamento de home, listagens e formulario.
          </Text>
        </div>
      </div>

      <Card className="mb-8 border-border-soft !p-5 sm:!p-6 lg:!p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <div>
            <Text className="mb-3 text-[10px] tracking-widest uppercase">Periodo</Text>
            <div className="flex flex-wrap gap-2">
              {rangeOptions.map((option) => (
                <Link
                  key={option.value}
                  href={getDashboardHref(option.value, selectedSource)}
                  className={`inline-flex min-h-10 items-center border px-4 py-2 text-[10px] font-bold tracking-[0.18em] uppercase transition-colors ${getButtonClass(
                    selectedRange === option.value
                  )}`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <Text className="mb-3 text-[10px] tracking-widest uppercase">Origem</Text>
            <div className="flex flex-wrap gap-2">
              {sourceOptions.map((option) => (
                <Link
                  key={option.value}
                  href={getDashboardHref(selectedRange, option.value)}
                  className={`inline-flex min-h-10 items-center border px-4 py-2 text-[10px] font-bold tracking-[0.18em] uppercase transition-colors ${getButtonClass(
                    selectedSource === option.value
                  )}`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/admin"
            className="inline-flex min-h-10 items-center justify-center border border-border-soft px-4 py-2 text-[10px] font-bold tracking-[0.18em] uppercase text-text-secondary transition-colors hover:border-primary/40 hover:text-text-1"
          >
            Limpar filtros
          </Link>
        </div>
      </Card>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:mb-12 sm:gap-4 lg:mb-16 lg:grid-cols-4 lg:gap-6">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="group">
            <Card className="group-hover:bg-primary/5 flex h-full items-center justify-start gap-3 border-border-soft p-4 transition-all active:scale-[0.99] sm:gap-4 sm:p-5 lg:p-6">
              <Icon
                name={action.icon as IconName}
                className="text-primary text-xl transition-transform group-hover:scale-110 sm:text-2xl"
              />
              <p className="group-hover:text-primary text-left text-[9px] font-bold tracking-[0.12em] text-text-1 uppercase transition-colors sm:text-[10px] sm:tracking-[0.15em]">
                {action.label}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-8 lg:col-span-8">
          <Card className="border-border-soft !p-5 sm:!p-7 lg:!p-12">
            <Heading as="h3" className="mb-6 flex items-center gap-3 text-lg sm:mb-8 sm:text-xl">
              <Icon name="analytics" className="text-primary text-lg" />
              Status do Ecossistema
            </Heading>
            <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <Text className="mb-1 text-[10px] tracking-widest uppercase">{metric.label}</Text>
                  <p className="font-display text-2xl text-text-1 sm:text-3xl">{metric.value}</p>
                  <Text className="mt-1 text-[10px] uppercase opacity-70">{metric.hint}</Text>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-border-soft !p-5 sm:!p-7 lg:!p-12">
            <Heading as="h3" className="mb-6 flex items-center gap-3 text-lg sm:mb-8 sm:text-xl">
              <Icon name="analytics" className="text-primary text-lg" />
              Comercial e Conversao
            </Heading>
            <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4">
              {commercialMetrics.map((metric) => (
                <div key={metric.label}>
                  <Text className="mb-1 text-[10px] tracking-widest uppercase">{metric.label}</Text>
                  <p className="font-display text-2xl text-text-1 sm:text-3xl">{metric.value}</p>
                  <Text className="mt-1 text-[10px] uppercase opacity-70">{metric.hint}</Text>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 border-t border-border-soft pt-8 lg:grid-cols-2">
              <div>
                <Text className="mb-4 text-[10px] tracking-widest uppercase">Produtos mais clicados</Text>
                <div className="space-y-3">
                  {analyticsSummary.topProducts.length > 0 ? (
                    analyticsSummary.topProducts.map((item) => (
                      <div
                        key={`${item.productSlug}-${item.productTitle}`}
                        className="flex items-center justify-between border border-border-soft px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text-1">
                            {item.productTitle || item.productSlug}
                          </p>
                          <p className="text-text-secondary text-[10px] uppercase tracking-[0.16em]">
                            /{item.productSlug}
                          </p>
                        </div>
                        <Badge variant="outline">{item.count} cliques</Badge>
                      </div>
                    ))
                  ) : (
                    <Text className="text-[12px] text-text-secondary">
                      Ainda nao ha dados suficientes para os filtros aplicados.
                    </Text>
                  )}
                </div>
              </div>

              <div>
                <Text className="mb-4 text-[10px] tracking-widest uppercase">Leads recentes</Text>
                <div className="space-y-3">
                  {recentLeads.length > 0 ? (
                    recentLeads.map((lead) => (
                      <div key={lead.id} className="border border-border-soft px-4 py-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-text-1">{lead.name}</p>
                            <p className="text-text-secondary truncate text-[11px]">{lead.email}</p>
                          </div>
                          <Badge variant="outline">{lead.status}</Badge>
                        </div>
                        <p className="text-text-secondary mt-3 line-clamp-2 text-[12px]">
                          {lead.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <Text className="text-[12px] text-text-secondary">
                      Nenhum lead encontrado para os filtros aplicados.
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="h-full border-border-soft !p-5 sm:!p-6 lg:!p-8">
            <Heading as="h3" className="mb-6 text-xl">
              Leitura dos dados
            </Heading>
            <ul className="space-y-4 text-xs">
              <li className="text-text-secondary flex gap-3">
                <Icon name="info" className="text-primary text-sm" />
                <span>
                  <strong className="text-text-1">Featured</strong> prioriza vitrine editorial. Use para empurrar a oferta nas listagens e na home.
                </span>
              </li>
              <li className="text-text-secondary flex gap-3">
                <Icon name="info" className="text-primary text-sm" />
                <span>
                  <strong className="text-text-1">Mais vendido</strong> deve sinalizar prova comercial real e recebe prioridade no pricing.
                </span>
              </li>
              <li className="text-text-secondary flex gap-3">
                <Icon name="info" className="text-primary text-sm" />
                <span>Compare periodo e origem para separar clique de home, detalhe, menu e formulario.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
