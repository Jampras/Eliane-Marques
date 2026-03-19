# Documentacao Tecnica - Eliane Marques Website

**Versao:** 1.8  
**Data:** 19/03/2026  
**Status:** producao com manutencao ativa e branch local em revisao visual da home

## 1. Visao geral

- site comercial e editorial da marca Eliane Marques
- foco em consultoria de imagem, etiqueta corporativa, cursos, materiais digitais e checklists
- producao em `https://v03-pink.vercel.app`
- stack principal:
  - Next.js 16
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - Prisma + PostgreSQL
  - Supabase Auth / Storage
  - Upstash Redis
  - Playwright

## 2. Estrutura

```text
app/
  (public)/
  (admin)/admin/
  auth/admin/
  api/
components/
  ui/
  shared/
  features/home/
  features/admin/
  features/products/
  features/checklist/
lib/
  actions/
  analytics/
  contact/
  core/
  data/
  env/
  institutional/
  server/
  supabase/
  utils/
  validators/
prisma/
  schema.prisma
  migrations/
  seed.ts
scripts/
  db-deploy.mjs
  analytics-maintenance.mjs
docs/
  *.md
```

## 3. Areas principais

### Home publica
- home composta por:
  - `HeroSection`
  - `ProfileTracksSection`
  - `IdentitySection`
  - `MethodSection`
  - `AuthoritySection`
  - `PricingSection`
  - `ServicesSection`
  - `FaqSection`
- `FinalCtaSection`
- o desktop esta mais estavel do que o mobile no branch atual

### Admin
- painel em `app/(admin)/admin`
- login Google-only
- CRUD de produtos, blog, checklists, sobre e configuracao
- dashboard comercial com agregacao diaria

### Dominio institucional
- `Config` e `About` foram centralizados em `lib/institutional`
- padrao recomendado para futuros singletons do projeto

## 4. Integracoes externas

### Supabase
- PostgreSQL
- Storage
- Auth com Google OAuth

### Upstash Redis
- rate limit distribuido do login admin
- suporte ao rate limit publico quando disponivel

### WhatsApp
- intents centralizadas em `lib/contact/whatsapp-intents.ts`

## 5. Seguranca e operacao

- CSP com nonce por request em `proxy.ts`
- login admin por Google com whitelist
- lead capture e analytics com same-origin e rate limit
- upload persistente obrigatorio em producao
- fallback de migrations via `scripts/db-deploy.mjs`

### Pendencias reais
- rotacao da `SUPABASE_SERVICE_ROLE_KEY`
- agendamento recorrente de `analytics:maintain`
- definicao da estrategia para fallback do rate limit publico sem Redis

## 6. Pontos fracos atuais

- o build ainda depende de um Prisma Client gerado, mas as queries publicas com fallback nao bloqueiam mais a compilacao sem banco
- no Windows, `prisma generate` ainda pode travar o engine DLL
- nao ha testes unitarios para regras criticas
- a home publica ainda esta em iteracao, principalmente no mobile

## 7. Recomendacoes priorizadas

### Imediato
1. rotacionar a credencial sensivel do Supabase
2. fechar a direcao final da home antes de publicar
3. automatizar `analytics:maintain`

### Em seguida
1. adicionar testes unitarios para modulos criticos
2. validar migrations em CI Linux
3. decidir politica do fallback de rate limit publico

### Depois
1. integrar leads com CRM ou automacao
2. aprofundar dashboard comercial

## 8. Guia de manutencao

- texto e ordem da home: `components/features/home/*`
- CTA por produto: `lib/core/product-cta.ts`
- WhatsApp: `lib/contact/whatsapp-intents.ts`
- singletons institucionais: `lib/institutional/*`
- auth admin: `app/auth/admin/*`, `lib/server/admin-google.ts`, `lib/supabase/*`
- ambiente: `lib/env/*`

Comandos de validacao:
```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```
