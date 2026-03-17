# Arquitetura do Sistema - Eliane Marques

Documento resumido da arquitetura atual do projeto apos estabilizacao tecnica, ajustes de seguranca, endurecimento de CSP e agregacao operacional de analytics.

## 1. Visao Geral

O projeto segue um modelo server-first com Next.js App Router:
- leitura de dados no servidor
- mutacoes via Server Actions
- client components apenas em pontos de interatividade real
- proxy centralizando auth e headers de seguranca

```mermaid
flowchart TD
    U["Usuario / Admin"] --> APP["Next.js App Router"]
    APP --> PUB["Rotas publicas"]
    APP --> ADM["Rotas admin"]
    APP --> PROXY["proxy.ts"]
    PROXY --> SEC["CSP + security headers + nonce"]
    PUB --> DATA["lib/data"]
    ADM --> ACT["lib/actions"]
    ACT --> AUTH["JWT + requireAdmin"]
    AUTH --> OAUTH["Supabase Google OAuth + whitelist"]
    ACT --> CACHE["revalidatePath / revalidateTag"]
    DATA --> PRISMA["Prisma"]
    ACT --> PRISMA
    PRISMA --> DB["PostgreSQL / Supabase"]
    PUB --> TRACK["/api/track"]
    TRACK --> PRISMA
    PRISMA --> AGG["AnalyticsDailyAggregate"]
    PUB --> LEAD["Lead capture form"]
    LEAD --> ACT
    ACT --> UP["/api/upload"]
    UP --> STORAGE["upload-storage"]
    STORAGE --> SUPA["Supabase Storage"]
    PUB --> WA["WhatsApp intents"]
    PUB --> EXT["Links externos de conversao"]
    PUB --> SEO["JSON-LD Product / Article / FAQPage"]
    PUB --> ABOUT["About page content"]
```

## 2. Camadas da Aplicacao

### Frontend
- `app/(public)` contem as rotas publicas
- `components/ui` concentra o design system
- `components/shared` contem navegacao e componentes de contato
- `components/features/home` contem as secoes da home
- `components/analytics` contem wrappers de tracking
- `app/(public)/sobre` contem a pagina institucional administravel

### Backoffice
- `app/(admin)/admin` contem login, dashboard e CRUD
- protecao de sessao por cookie JWT
- login exige Upstash configurado em producao
- login admin usa Google OAuth via Supabase com whitelist de emails

### Dados
- `lib/data` centraliza queries e cache
- `lib/institutional` concentra os singletons de conteudo institucional
- `safeDataQuery` trata falhas com fallback controlado
- `getSiteConfigs()` usa `unstable_cache`
- `getSiteIdentity()` usa `cache`
- `getAboutPage()` centraliza a pagina institucional singleton
- listagens publicas aceitam filtros por query string

### Mutacoes
- `lib/actions/admin-crud.ts` centraliza upsert/delete de produto, post e checklist
- `lib/institutional/config-actions.ts` centraliza configuracoes singleton
- `lib/institutional/about-actions.ts` centraliza o singleton da pagina Sobre
- apos mutacao, listagens e paginas de detalhe sao revalidadas
- produtos persistem estrategia de conversao:
  - `ctaMode`
  - `ctaUrl`
  - `ctaLabel`
  - `featured`
  - `bestSeller`

### Analytics e leads
- eventos de conversao entram por `app/api/track/route.ts`
- persistencia em `AnalyticsEvent`
- agregacao diaria historica em `AnalyticsDailyAggregate`
- manutencao operacional via `scripts/analytics-maintenance.mjs`
- formulario alternativo de contato persiste em `Lead`
- dashboard admin combina eventos recentes + historico agregado e leads recentes

### Midia
- upload autenticado em `app/api/upload/route.ts`
- provider em `lib/server/upload-storage.ts`
- drivers:
  - `supabase` em producao
  - `local` apenas fora de producao

### Seguranca
- `proxy.ts` aplica:
  - CSP dinamica com nonce
  - `style-src` endurecida sem `unsafe-inline` em blocos de estilo
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - HSTS em producao
- `lib/server/production-guards.ts` valida requisitos de producao

## 3. Estrutura Atual

```text
app/
  layout.tsx
  globals.css
  icon.svg
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
  institutional/
  supabase/
  server/
  utils/
  validators/
prisma/
  schema.prisma
  migrations/
  seed.ts
scripts/
  db-deploy.mjs
docs/
  *.md
```

## 4. Decisoes Tecnicas Relevantes

### 4.1 Home componentizada
A rota `app/(public)/page.tsx` e composicao de:
- `HeroSection`
- `IdentitySection`
- `ProfileTracksSection`
- `MethodSection`
- `ServicesSection`
- `PricingSection`
- `FaqSection`
- `FinalCtaSection`

### 4.2 URLs de produto centralizadas
As URLs publicas de detalhe de produto sao definidas por `lib/core/product-paths.ts`.

Regra atual:
- `CONSULTORIA` -> `/servicos/[slug]`
- `CURSO` -> `/cursos/[slug]`
- `EBOOK` e `CHECKLIST` -> `/materiais/[slug]`

### 4.3 CTA de produto centralizado
O destino principal de conversao por produto foi centralizado em `lib/core/product-cta.ts`.

### 4.4 Intent layer para WhatsApp
Componentes nao montam mais URLs de WhatsApp diretamente via helper bruto.

Camada atual:
- `lib/contact/whatsapp-intents.ts`

### 4.5 Pipeline de imagem
As imagens publicas usam `next/image` com otimizacao quando a origem permite.

Helper central:
- `lib/core/images.ts`

### 4.6 Migrations resilientes
`npm run db:deploy` usa `scripts/db-deploy.mjs`.

Fluxo:
1. tenta `prisma migrate deploy`
2. em falha do schema engine local, aplica fallback SQL controlado

### 4.7 Tipografia e icones
- fontes principais em `next/font`
- icones locais em SVG via `components/ui/Icon.tsx`

### 4.8 Telemetria comercial
- tracking client-side centralizado em `lib/analytics/client.ts`
- ingestao server-side em `lib/analytics/server.ts`
- agregacao e retencao em `lib/analytics/aggregation.ts`
- consultas de dashboard em `lib/analytics/reporting.ts`
- componentes tracked em `components/analytics/*`

### 4.9 SEO estruturado
- `lib/seo/schema.ts` centraliza geracao de JSON-LD
- `components/seo/StructuredDataScript.tsx` injeta scripts com nonce

### 4.10 Auth admin
- auth atual em producao: Google OAuth via Supabase + whitelist por `ADMIN_GOOGLE_ALLOWED_EMAILS`
- o painel continua usando `admin_session` como cookie interno de sessao administrativa
- logout invalida a sessao local do painel e a sessao Supabase

### 4.11 Dominio institucional unificado
- `lib/institutional/config.ts` e `config-actions.ts` concentram leitura e mutacao de configuracoes singleton
- `lib/institutional/about.ts` e `about-actions.ts` concentram leitura e mutacao da pagina Sobre
- `lib/data/*` e `lib/actions/*` mantem reexports de compatibilidade onde ainda ha dependencias antigas

## 5. Riscos Arquiteturais Atuais

### Criticos
- a credencial de storage do Supabase continua sendo pendencia operacional se houver exposicao previa
- build continua dependente de banco acessivel

### Importantes
- a credencial sensivel do Supabase segue como pendencia operacional se nao for rotacionada
- build e testes E2E seguem dependentes de banco acessivel e browser instalado
- analytics exige manutencao periodica para manter custo e volume sob controle

## 6. Regras de Evolucao
- manter Server Components por padrao
- usar Client Components apenas quando houver estado/efeito real
- nao espalhar regra de URL de produto fora de `getProductDetailPath()`
- nao espalhar regra de CTA fora de `lib/core/product-cta.ts`
- nao espalhar montagem de WhatsApp fora de `lib/contact/whatsapp-intents.ts`
- nao depender de `public/uploads` como storage final em producao
- concentrar futuros singletons institucionais no mesmo padrao de `lib/institutional/*`

## 7. Estado Atual

Resolvido na rodada recente:
- contraste e legibilidade base
- pipeline de imagem
- favicon
- endurecimento de CSP
- obrigatoriedade de storage persistente em producao
- obrigatoriedade de rate limit distribuido em producao
- fallback resiliente de migrations
- home componentizada
- intents de WhatsApp centralizadas
- cache explicito de identidade do site
- CTA por produto configuravel no admin
- busca e filtros nas listagens
- flags comerciais por produto
- analytics de conversao
- agregacao diaria e retencao operacional de analytics
- dashboard comercial
- captura alternativa de lead
- schemas estruturados de SEO
- migracao de icones para bundle local

Pendente:
- rotacao da credencial sensivel do Supabase
- ampliar cobertura de QA visual se o time quiser regressao visual automatizada
