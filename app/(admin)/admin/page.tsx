export const dynamic = 'force-dynamic';

import Link from 'next/link';
import prisma from '@/lib/core/prisma';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { requireAdmin } from '@/lib/server/admin-auth';

const quickActions = [
  { label: 'Novo Produto', href: '/admin/produtos/novo', icon: 'add_shopping_cart' },
  { label: 'Publicar Artigo', href: '/admin/conteudos/novo', icon: 'edit_note' },
  { label: 'Criar Checklist', href: '/admin/checklists/novo', icon: 'playlist_add' },
  { label: 'Site Config', href: '/admin/config', icon: 'tune' },
] as const;

export default async function AdminDashboard() {
  await requireAdmin();

  const [
    totalProducts,
    activeProducts,
    publishedPosts,
    publishedChecklists,
    totalConfigs,
    totalLeads,
    recentLeads,
    totalEvents,
    whatsappClicks,
    externalCtaClicks,
    productClickEvents,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.post.count({ where: { published: true } }),
    prisma.checklist.count({ where: { published: true } }),
    prisma.siteConfig.count(),
    prisma.lead.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.count({
      where: { name: 'whatsapp_click' },
    }),
    prisma.analyticsEvent.count({
      where: { name: 'cta_click' },
    }),
    prisma.analyticsEvent.findMany({
      where: {
        productSlug: { not: null },
      },
      select: {
        productSlug: true,
        productTitle: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    }),
  ]);

  const topProducts = Array.from(
    productClickEvents.reduce((acc, event) => {
      const key = `${event.productSlug ?? ''}::${event.productTitle ?? ''}`;
      const current = acc.get(key) || {
        productSlug: event.productSlug,
        productTitle: event.productTitle,
        count: 0,
      };

      current.count += 1;
      acc.set(key, current);
      return acc;
    }, new Map<string, { productSlug: string | null; productTitle: string | null; count: number }>())
  )
    .map(([, value]) => value)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const metrics = [
    { label: 'Produtos', value: totalProducts, hint: `${activeProducts} ativos` },
    { label: 'Artigos', value: publishedPosts, hint: 'publicados' },
    { label: 'Checklists', value: publishedChecklists, hint: 'publicados' },
    { label: 'Configs', value: totalConfigs, hint: 'chaves ativas' },
  ];

  const commercialMetrics = [
    { label: 'Eventos', value: totalEvents, hint: 'cliques rastreados' },
    { label: 'WhatsApp', value: whatsappClicks, hint: 'acessos ao canal' },
    { label: 'CTA externo', value: externalCtaClicks, hint: 'checkout ou link externo' },
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
        </div>
      </div>

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
                  {topProducts.length > 0 ? (
                    topProducts.map((item) => (
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
                      Ainda nao ha dados suficientes de clique.
                    </Text>
                  )}
                </div>
              </div>

              <div>
                <Text className="mb-4 text-[10px] tracking-widest uppercase">Leads recentes</Text>
                <div className="space-y-3">
                  {recentLeads.length > 0 ? (
                    recentLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="border border-border-soft px-4 py-3"
                      >
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
                      Nenhum lead registrado ainda.
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
              Ajuda Rapida
            </Heading>
            <ul className="space-y-4 text-xs">
              <li className="text-text-secondary flex gap-3">
                <Icon name="info" className="text-primary text-sm" />
                <span>Use slugs amigaveis para SEO, por exemplo mentoria-presenca.</span>
              </li>
              <li className="text-text-secondary flex gap-3">
                <Icon name="info" className="text-primary text-sm" />
                <span>Marque como destaque ou mais vendido para influenciar a ordem das listagens.</span>
              </li>
              <li className="text-text-secondary flex gap-3">
                <Icon name="info" className="text-primary text-sm" />
                <span>Revise imagem de capa e destino do CTA antes de salvar para evitar retrabalho.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
