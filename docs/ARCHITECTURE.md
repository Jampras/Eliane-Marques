# Arquitetura do Sistema - Eliane Marques

Documento resumido da arquitetura atual do projeto.

## 1. Visao Geral

```mermaid
flowchart TD
    U["Usuario / Admin"] --> APP["Next.js App Router"]
    APP --> PROXY["proxy.ts"]
    PROXY --> SEC["CSP + security headers + nonce"]
    APP --> PUB["Rotas publicas"]
    APP --> ADM["Rotas admin"]
    PUB --> DATA["lib/data"]
    ADM --> ACT["lib/actions"]
    ACT --> AUTH["JWT + requireAdmin"]
    AUTH --> OAUTH["Supabase Google OAuth + whitelist"]
    DATA --> PRISMA["Prisma"]
    ACT --> PRISMA
    PRISMA --> DB["PostgreSQL / Supabase"]
    PUB --> TRACK["/api/track"]
    TRACK --> PRISMA
    ACT --> UP["/api/upload"]
    UP --> STORAGE["Supabase Storage"]
```

## 2. Camadas

### Frontend
- `app/(public)` contem as rotas publicas
- `components/ui` concentra o design system
- `components/shared` concentra navegacao e contato
- `components/features/home` concentra a home
- `components/features/home/HomeFaqAccordion.tsx` concentra o FAQ interativo

### Backoffice
- `app/(admin)/admin` contem login, dashboard e CRUD
- auth administrativa e Google-only
- sessao interna continua em `admin_session`

### Dados
- `lib/data` centraliza queries e cache
- `lib/institutional` centraliza `Config`, `About` e `Home`
- `lib/env` centraliza o contrato de ambiente

### Mutacoes
- `lib/actions/admin-crud.ts` centraliza produto, post e checklist
- `lib/institutional/*-actions.ts` centraliza singletons institucionais

### Analytics e leads
- eventos entram por `app/api/track/route.ts`
- persistencia em `AnalyticsEvent`
- historico agregado em `AnalyticsDailyAggregate`
- manutencao por `scripts/analytics-maintenance.mjs`
- lead capture persiste em `Lead`

### Midia
- upload autenticado em `app/api/upload/route.ts`
- producao usa Supabase Storage
- fallback local so fora de producao

## 3. Estrutura

```text
app/
  layout.tsx
  globals.css
  (public)/
  (admin)/admin/
  auth/admin/
  api/upload/
components/
  ui/
  shared/
  features/home/
  features/admin/
  features/checklist/
  features/products/
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

## 4. Decisoes tecnicas relevantes

### Home publica
- `app/(public)/page.tsx` compoe a home por secoes
- o conteudo institucional da home vem de `lib/institutional/home.ts`
- `Investimentos` e `Formatos` continuam dinamicos a partir de produtos ativos

### CTA de produto
- regra central em `lib/core/product-cta.ts`
- nao espalhar regra comercial fora desse modulo

### WhatsApp
- regra central em `lib/contact/whatsapp-intents.ts`
- componentes nao devem montar links diretamente

### Migrations
- `npm run db:deploy` usa `scripts/db-deploy.mjs`
- tenta `prisma migrate deploy`
- cai para fallback SQL controlado se o engine falhar localmente

### Auth admin
- Google OAuth via Supabase
- whitelist por `ADMIN_GOOGLE_ALLOWED_EMAILS`
- sem fallback por senha

## 5. Riscos arquiteturais atuais

### Criticos
- a credencial de storage do Supabase continua sendo pendencia operacional se houve exposicao previa
- o build ainda depende de um Prisma Client gerado, mas as queries publicas protegidas por fallback nao bloqueiam mais a compilacao sem banco

### Importantes
- endpoints publicos degradam para rate limit em memoria se Redis estiver indisponivel
- nao existe suite de testes unitarios para regras criticas
- a home publica ainda depende de validacao visual/comercial antes de publicacao

## 6. Regras de evolucao
- manter Server Components por padrao
- usar Client Components apenas quando houver estado ou efeito real
- nao espalhar regra de produto fora de `lib/core/product-cta.ts`
- nao espalhar links de WhatsApp fora de `lib/contact/whatsapp-intents.ts`
- nao depender de `public/uploads` como storage final em producao
- concentrar futuros singletons institucionais em `lib/institutional/*`
- manter a home CMS-driven apenas para conteudo; layout e comportamento visual continuam no codigo
