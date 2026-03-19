import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import prisma from '@/lib/core/prisma';
import { safeDataQuery } from '@/lib/data/safe-query';
import { HOME_PAGE_TAG, HOME_SINGLETON_KEY } from '@/lib/institutional/shared';

const getHomePageEntry = unstable_cache(
  async () =>
    prisma.homePage.findUnique({
      where: { singletonKey: HOME_SINGLETON_KEY },
      include: {
        audienceItems: { orderBy: { sortOrder: 'asc' } },
        valueItems: { orderBy: { sortOrder: 'asc' } },
        methodSteps: { orderBy: { sortOrder: 'asc' } },
        faqItems: { orderBy: { sortOrder: 'asc' } },
      },
    }),
  ['home-page'],
  { revalidate: 300, tags: [HOME_PAGE_TAG] }
);

export const getHomePage = cache(async () => {
  const page = await safeDataQuery('getHomePage', getHomePageEntry, null);

  if (page) {
    return page;
  }

  return {
    id: 'draft',
    singletonKey: HOME_SINGLETON_KEY,
    heroEyebrow: 'Imagem . Etiqueta . Presenca',
    heroPanelImage: null,
    heroTitle: 'Sua imagem precisa sustentar o nivel que voce ja entrega.',
    heroSubtitle:
      'Consultoria de imagem, etiqueta e presenca para mulheres que precisam de mais clareza, coerencia e leitura de valor.',
    heroPrimaryCtaLabel: 'Quero meu diagnostico estrategico',
    heroSecondaryCtaLabel: 'Ver formatos de atendimento',
    heroTrustText: 'Sem compromisso. Resposta inicial em ate 24h uteis.',
    audienceTitle: 'Quem mais se beneficia desse trabalho',
    audienceSubtitle:
      'A orientacao foi pensada para momentos em que presenca, leitura de valor e comportamento fazem diferenca.',
    valueTitle: 'Quando a imagem nao acompanha o nivel da entrega',
    valueSubtitle: 'O problema costuma aparecer em respeito, clareza e leitura de valor.',
    valueCtaLabel: 'Ver qual formato responde a isso',
    methodTitle: 'Quatro etapas claras',
    methodSubtitle:
      'O foco nao e mudar quem voce e. E alinhar leitura, imagem e comportamento.',
    methodCtaLabel: 'Ver formatos que aplicam esse metodo',
    faqTitle: 'Duvidas mais comuns',
    faqSubtitle: 'Se ainda houver duvida, abra a conversa e receba a recomendacao mais adequada.',
    finalCtaTitle: 'Se sua imagem ainda nao sustenta seu valor, este e o momento de corrigir isso.',
    finalCtaSubtitle: 'Uma conversa curta ja define o formato mais adequado para seu momento.',
    finalCtaScarcityText: 'Poucos acompanhamentos por ciclo.',
    finalCtaLabel: 'Quero conversar sobre meu caso',
    finalWhatsappMessage:
      'Ola Eliane! Quero entender o formato mais adequado para alinhar minha imagem, minha presenca e a forma como meu valor esta sendo percebido.',
    createdAt: new Date(0),
    updatedAt: new Date(0),
    audienceItems: [
      {
        id: 'draft-audience-1',
        title: 'Executivas em ascensao',
        description:
          'Para quem quer liderar com presenca, firmeza e etiqueta em ambientes de alta exigencia.',
        icon: '\u25c7',
        imageUrl: null,
        sortOrder: 0,
      },
      {
        id: 'draft-audience-2',
        title: 'Empreendedoras e marcas pessoais',
        description:
          'Para quem precisa alinhar imagem e comunicacao para cobrar melhor e atrair clientes certos.',
        icon: '\u2726',
        imageUrl: null,
        sortOrder: 1,
      },
      {
        id: 'draft-audience-3',
        title: 'Empresas e equipes',
        description:
          'Para negocios que desejam padrao de atendimento premium e comportamento coerente com a marca.',
        icon: '\u25c8',
        imageUrl: null,
        sortOrder: 2,
      },
    ],
    valueItems: [
      {
        id: 'draft-value-1',
        badge: 'Sinais de desalinhamento',
        title: 'Seu nivel nao fica claro',
        bullets: [
          'Voce sente que precisa provar valor em toda reuniao',
          'Preco, fala ou postura geram duvida',
          'Oportunidades travam por percepcao',
        ],
        tone: 'NEGATIVE',
        imageUrl: null,
        sortOrder: 0,
      },
      {
        id: 'draft-value-2',
        badge: 'Quando isso se organiza',
        title: 'Sua presenca sustenta seu valor',
        bullets: [
          'Mais consistencia e peso profissional',
          'Mais escuta, respeito e clareza',
          'Mais coerencia entre imagem e posicionamento',
        ],
        tone: 'POSITIVE',
        imageUrl: null,
        sortOrder: 1,
      },
    ],
    methodSteps: [
      {
        id: 'draft-step-1',
        title: 'Leitura atual',
        description:
          'Mapeamos como imagem, comportamento e comunicacao estao sendo percebidos hoje.',
        imageUrl: null,
        sortOrder: 0,
      },
      {
        id: 'draft-step-2',
        title: 'Reposicionamento visual',
        description:
          'Definimos ajustes de imagem que aumentam coerencia, refinamento e leitura de valor.',
        imageUrl: null,
        sortOrder: 1,
      },
      {
        id: 'draft-step-3',
        title: 'Refinamento de conduta',
        description:
          'Ajustamos postura, etiqueta e comportamento para sustentar a nova presenca em contexto real.',
        imageUrl: null,
        sortOrder: 2,
      },
      {
        id: 'draft-step-4',
        title: 'Sustentacao da presenca',
        description:
          'Transformamos o ajuste em consistencia para que sua imagem pare de depender de esforco extra.',
        imageUrl: null,
        sortOrder: 3,
      },
    ],
    faqItems: [
      {
        id: 'draft-faq-1',
        question: 'Isso serve para quem esta comecando?',
        answer:
          'Sim. O trabalho e personalizado para seu momento atual, com passos objetivos para evolucao consistente.',
        sortOrder: 0,
      },
      {
        id: 'draft-faq-2',
        question: 'Quanto tempo para sentir resultado?',
        answer:
          'Os primeiros ajustes de percepcao costumam ser sentidos nas primeiras semanas, com evolucao progressiva nas interacoes reais.',
        sortOrder: 1,
      },
      {
        id: 'draft-faq-3',
        question: 'Preciso mudar meu estilo inteiro?',
        answer:
          'Nao. O foco nao e descaracterizar voce, e sim alinhar sua imagem ao nivel de valor que voce ja entrega.',
        sortOrder: 2,
      },
      {
        id: 'draft-faq-4',
        question: 'Como funciona o primeiro contato?',
        answer:
          'Voce chama no WhatsApp, responde algumas perguntas e recebe a recomendacao de formato mais adequado para seu objetivo.',
        sortOrder: 3,
      },
    ],
  };
});
