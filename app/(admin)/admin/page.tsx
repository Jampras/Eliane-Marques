export const dynamic = 'force-dynamic';

import Link from 'next/link';
import prisma from '@/lib/core/prisma';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { requireAdmin } from '@/lib/server/admin-auth';

const quickActions = [
  { label: 'Novo Produto', href: '/admin/produtos/novo', icon: 'add_shopping_cart' },
  { label: 'Publicar Artigo', href: '/admin/conteudos/novo', icon: 'edit_note' },
  { label: 'Criar Checklist', href: '/admin/checklists/novo', icon: 'playlist_add' },
  { label: 'Site Config', href: '/admin/config', icon: 'tune' },
];

export default async function AdminDashboard() {
  await requireAdmin();

  const [totalProducts, activeProducts, publishedPosts, publishedChecklists, totalConfigs] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.post.count({ where: { published: true } }),
      prisma.checklist.count({ where: { published: true } }),
      prisma.siteConfig.count(),
    ]);

  const metrics = [
    { label: 'Produtos', value: totalProducts, hint: `${activeProducts} ativos` },
    { label: 'Artigos', value: publishedPosts, hint: 'publicados' },
    { label: 'Checklists', value: publishedChecklists, hint: 'publicados' },
    { label: 'Configs', value: totalConfigs, hint: 'chaves ativas' },
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
              <span className="material-symbols-outlined text-primary text-xl transition-transform group-hover:scale-110 sm:text-2xl">
                {action.icon}
              </span>
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
              <span className="material-symbols-outlined text-primary text-lg">analytics</span>
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
        </div>

        <div className="lg:col-span-4">
          <Card className="h-full border-border-soft !p-5 sm:!p-6 lg:!p-8">
            <Heading as="h3" className="mb-6 text-xl">
              Ajuda Rapida
            </Heading>
            <ul className="space-y-4 text-xs">
              <li className="text-text-secondary flex gap-3">
                <span className="material-symbols-outlined text-primary text-sm">info</span>
                <span>Use slugs amigaveis para SEO, por exemplo mentoria-presenca.</span>
              </li>
              <li className="text-text-secondary flex gap-3">
                <span className="material-symbols-outlined text-primary text-sm">info</span>
                <span>Publique apenas o que estiver pronto para aparecer nas paginas publicas.</span>
              </li>
              <li className="text-text-secondary flex gap-3">
                <span className="material-symbols-outlined text-primary text-sm">info</span>
                <span>Revise imagem de capa e WhatsApp antes de salvar para evitar retrabalho.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
