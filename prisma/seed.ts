import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import type { Audience, ProductType } from '../lib/core/types';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const shouldReset = process.env.SEED_RESET?.trim().toLowerCase() === 'true';

type SeedProduct = {
  title: string;
  slug: string;
  shortDesc: string;
  longDesc?: string;
  price: number;
  type: ProductType;
  audience: Audience;
  coverImage?: string;
  whatsappMessageTemplate?: string;
};

type SeedChecklist = {
  title: string;
  slug: string;
  description: string;
  published: boolean;
  items: Array<{ label: string; linkUrl?: string }>;
};

const siteConfigs: Array<{ key: string; value: string }> = [
  { key: 'whatsappNumber', value: '5587996103463' },
  {
    key: 'whatsappDefaultMessage',
    value: 'Ola Eliane! Quero iniciar meu processo de posicionamento.',
  },
  { key: 'siteName', value: 'Eliane Marques' },
  { key: 'contactEmail', value: 'contato@elianemarques.com.br' },
  { key: 'heroHeadline', value: 'Sua imagem ja tem valor. Vamos fazer esse valor ser percebido.' },
  {
    key: 'heroSubheadline',
    value: 'Imagem, comunicacao e etiqueta estrategica para ambientes de alta exigencia.',
  },
  { key: 'instagramLink', value: 'https://instagram.com/elianemarques' },
];

const products: SeedProduct[] = [
  // CONSULTORIA (5)
  {
    title: 'Consultoria de Posicionamento Executivo',
    slug: 'consultoria-posicionamento-executivo',
    shortDesc:
      'Plano individual para alinhar presenca, comunicacao e autoridade em ambientes decisivos.',
    longDesc:
      'Diagnostico completo de imagem e comportamento com plano de acao personalizado para posicionamento de alto valor.',
    price: 3900,
    type: 'CONSULTORIA',
    audience: 'PESSOAS',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
  },
  {
    title: 'Consultoria de Lideranca Feminina',
    slug: 'consultoria-lideranca-feminina',
    shortDesc:
      'Refinamento de postura e narrativa para mulheres em cargos de lideranca e transicao de carreira.',
    price: 4200,
    type: 'CONSULTORIA',
    audience: 'PESSOAS',
  },
  {
    title: 'Consultoria de Comunicacao com Presenca',
    slug: 'consultoria-comunicacao-com-presenca',
    shortDesc:
      'Ajustes praticos para voce conduzir conversas de alto impacto com clareza e seguranca.',
    price: 3500,
    type: 'CONSULTORIA',
    audience: 'AMBOS',
  },
  {
    title: 'Consultoria VIP de Etiqueta Corporativa',
    slug: 'consultoria-vip-etiqueta-corporativa',
    shortDesc: 'Protocolo de comportamento para reunioes, eventos e jantares de negocios.',
    price: 4800,
    type: 'CONSULTORIA',
    audience: 'AMBOS',
  },
  {
    title: 'Consultoria de Reposicionamento de Marca Pessoal',
    slug: 'consultoria-reposicionamento-marca-pessoal',
    shortDesc: 'Estruturacao de imagem e linguagem para reposicionar percepcao de mercado.',
    price: 5300,
    type: 'CONSULTORIA',
    audience: 'PESSOAS',
  },

  // CURSO (5)
  {
    title: 'Curso Presenca Executiva 360',
    slug: 'curso-presenca-executiva-360',
    shortDesc:
      'Formacao completa para elevar postura profissional, leitura de ambiente e influencia.',
    price: 997,
    type: 'CURSO',
    audience: 'AMBOS',
  },
  {
    title: 'Curso de Etiqueta para Negocios Internacionais',
    slug: 'curso-etiqueta-negocios-internacionais',
    shortDesc: 'Regras de etiqueta e protocolo para reunioes com clientes e parceiros globais.',
    price: 1197,
    type: 'CURSO',
    audience: 'EMPRESAS',
  },
  {
    title: 'Curso Comunicacao de Alto Impacto',
    slug: 'curso-comunicacao-alto-impacto',
    shortDesc: 'Tecnicas praticas para apresentar ideias com firmeza, elegancia e persuasao.',
    price: 897,
    type: 'CURSO',
    audience: 'AMBOS',
  },
  {
    title: 'Curso Networking Estrategico com Classe',
    slug: 'curso-networking-estrategico-com-classe',
    shortDesc: 'Aprenda a criar conexoes relevantes com naturalidade em eventos profissionais.',
    price: 847,
    type: 'CURSO',
    audience: 'PESSOAS',
  },
  {
    title: 'Curso Imagem e Autoridade Digital',
    slug: 'curso-imagem-autoridade-digital',
    shortDesc:
      'Ajuste sua comunicacao visual e verbal para aumentar credibilidade no ambiente digital.',
    price: 1097,
    type: 'CURSO',
    audience: 'AMBOS',
  },

  // EBOOK (5)
  {
    title: 'Ebook Closet Inteligente Premium',
    slug: 'ebook-closet-inteligente-premium',
    shortDesc: 'Guia para montar um guarda-roupa estrategico sem excessos e com sofisticacao.',
    price: 97,
    type: 'EBOOK',
    audience: 'PESSOAS',
  },
  {
    title: 'Ebook Primeira Impressao de Alto Valor',
    slug: 'ebook-primeira-impressao-alto-valor',
    shortDesc: 'Checklist essencial para causar impacto positivo nos primeiros minutos de contato.',
    price: 117,
    type: 'EBOOK',
    audience: 'AMBOS',
  },
  {
    title: 'Ebook Guia de Etiqueta Corporativa',
    slug: 'ebook-guia-etiqueta-corporativa',
    shortDesc: 'Regras e boas praticas para ambientes empresariais e encontros formais.',
    price: 87,
    type: 'EBOOK',
    audience: 'AMBOS',
  },
  {
    title: 'Ebook Roteiro de Networking com Classe',
    slug: 'ebook-roteiro-networking-com-classe',
    shortDesc: 'Passo a passo para iniciar, manter e aprofundar relacoes profissionais relevantes.',
    price: 77,
    type: 'EBOOK',
    audience: 'PESSOAS',
  },
  {
    title: 'Ebook Manual de Posicionamento Pessoal',
    slug: 'ebook-manual-posicionamento-pessoal',
    shortDesc: 'Estrutura para traduzir seu valor em sinais claros de autoridade e consistencia.',
    price: 127,
    type: 'EBOOK',
    audience: 'AMBOS',
  },

  // CHECKLIST (5)
  {
    title: 'Checklist Reunioes Decisivas',
    slug: 'checklist-reunioes-decisivas',
    shortDesc: 'Rotina objetiva para chegar preparada e segura em reunioes de alto impacto.',
    price: 67,
    type: 'CHECKLIST',
    audience: 'AMBOS',
  },
  {
    title: 'Checklist para Eventos Corporativos',
    slug: 'checklist-eventos-corporativos',
    shortDesc:
      'Itens praticos para se portar com naturalidade e elegancia em eventos profissionais.',
    price: 57,
    type: 'CHECKLIST',
    audience: 'PESSOAS',
  },
  {
    title: 'Checklist Imagem da Semana Executiva',
    slug: 'checklist-imagem-semana-executiva',
    shortDesc: 'Organizacao semanal de imagem para manter consistencia e autoridade.',
    price: 49,
    type: 'CHECKLIST',
    audience: 'PESSOAS',
  },
  {
    title: 'Checklist Apresentacao para Clientes Premium',
    slug: 'checklist-apresentacao-clientes-premium',
    shortDesc: 'Sequencia de validacao para apresentar propostas com alto nivel de confianca.',
    price: 79,
    type: 'CHECKLIST',
    audience: 'EMPRESAS',
  },
  {
    title: 'Checklist Rotina de Posicionamento Diario',
    slug: 'checklist-rotina-posicionamento-diario',
    shortDesc: 'Pequenas acoes diarias que sustentam uma imagem forte e coerente.',
    price: 59,
    type: 'CHECKLIST',
    audience: 'AMBOS',
  },
];

const checklists: SeedChecklist[] = [
  {
    title: 'Protocolo de Reunioes de Alto Nivel',
    slug: 'protocolo-reunioes-alto-nivel',
    description:
      'Passo a passo para transmitir seguranca, preparo e autoridade em reunioes importantes.',
    published: true,
    items: [
      { label: 'Revise objetivo da reuniao e resultado esperado' },
      { label: 'Defina vestuario e postura para o contexto' },
      { label: 'Prepare 3 argumentos de autoridade' },
    ],
  },
  {
    title: 'Checklist de Eventos Profissionais',
    slug: 'checklist-eventos-profissionais',
    description:
      'Itens essenciais para comportamento elegante em eventos corporativos e networking.',
    published: true,
    items: [
      { label: 'Mapeie participantes-chave antes do evento' },
      { label: 'Pratique apresentacao curta pessoal (30s)' },
      { label: 'Planeje follow-up em ate 24 horas' },
    ],
  },
  {
    title: 'Preparacao para Apresentacoes Estrategicas',
    slug: 'preparacao-apresentacoes-estrategicas',
    description: 'Sequencia pratica para organizar mensagem, postura e impacto em apresentacoes.',
    published: true,
    items: [
      { label: 'Estruture abertura, desenvolvimento e fechamento' },
      { label: 'Ajuste tom de voz e ritmo da fala' },
      { label: 'Defina chamada para proximo passo ao final' },
    ],
  },
];

const posts = [
  {
    title: 'Primeira Impressao: como ser lembrada pelo valor',
    slug: 'primeira-impressao-valor',
    excerpt: 'A primeira percepcao define abertura de portas. Entenda os sinais que mais pesam.',
    content:
      'Conteudo editorial sobre primeira impressao, leitura de contexto e sinais de autoridade.',
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1487309078313-fe80c3e15dd0',
  },
  {
    title: 'Etiqueta corporativa sem rigidez',
    slug: 'etiqueta-corporativa-sem-rigidez',
    excerpt:
      'Elegancia profissional nao e sobre formalidade excessiva, e sobre adequacao inteligente.',
    content: 'Conteudo editorial sobre etiqueta aplicada a rotina corporativa com naturalidade.',
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
  },
  {
    title: 'Posicionamento para quem quer cobrar melhor',
    slug: 'posicionamento-para-cobrar-melhor',
    excerpt: 'Quando sua imagem comunica valor, negociar preco deixa de ser conflito.',
    content: 'Conteudo editorial sobre coerencia entre entrega, comunicacao e percepcao de valor.',
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1552581234-26160f608093',
  },
];

async function resetDataIfRequested() {
  if (!shouldReset) {
    return;
  }

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED_RESET !== 'true') {
    throw new Error('SEED_RESET em producao exige ALLOW_PROD_SEED_RESET=true.');
  }

  await prisma.$transaction([
    prisma.checklistItem.deleteMany({}),
    prisma.checklist.deleteMany({}),
    prisma.product.deleteMany({}),
    prisma.post.deleteMany({}),
    prisma.siteConfig.deleteMany({}),
  ]);
}

async function seedSiteConfigs() {
  await prisma.siteConfig.createMany({
    data: siteConfigs,
    skipDuplicates: true,
  });
}

async function seedProducts() {
  await prisma.product.createMany({
    data: products.map((product) => ({
      ...product,
      whatsappMessageTemplate:
        product.whatsappMessageTemplate ||
        'Ola Eliane! Quero saber mais sobre {productTitle}. Vi essa opcao na pagina {pageUrl}.',
      active: true,
    })),
    skipDuplicates: true,
  });
}

async function seedChecklists() {
  for (const checklist of checklists) {
    const existing = await prisma.checklist.findUnique({
      where: { slug: checklist.slug },
      select: { id: true },
    });

    if (existing) {
      continue;
    }

    await prisma.checklist.create({
      data: {
        title: checklist.title,
        slug: checklist.slug,
        description: checklist.description,
        published: checklist.published,
        items: {
          create: checklist.items.map((item, index) => ({
            label: item.label,
            linkUrl: item.linkUrl || null,
            sortOrder: index,
          })),
        },
      },
    });
  }
}

async function seedPosts() {
  await prisma.post.createMany({
    data: posts,
    skipDuplicates: true,
  });
}

async function main() {
  await resetDataIfRequested();
  await seedSiteConfigs();
  await seedProducts();
  await seedChecklists();
  await seedPosts();

  const mode = shouldReset ? 'reset' : 'safe';
  console.log(
    `Seed finalizado (${mode} mode): ${products.length} produtos, ${checklists.length} checklists, ${posts.length} posts e configs base.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

