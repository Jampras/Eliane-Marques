# Eliane Marques Website

Site institucional e comercial da marca Eliane Marques, com foco em consultoria de imagem, etiqueta corporativa, cursos, materiais digitais e checklists.

## Producao
- URL publica: `https://v03-pink.vercel.app`
- Hospedagem: Vercel
- Banco e storage: Supabase / PostgreSQL

## Stack
- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
- Zod
- JWT via `jose`
- Upstash Redis REST
- Playwright

## Arquitetura resumida
- rotas publicas em `app/(public)`
- backoffice em `app/(admin)/admin`
- leitura de dados em `lib/data`
- mutacoes em `lib/actions`
- infraestrutura server-side em `lib/server`
- regras de negocio compartilhadas em `lib/core`
- intents de contato em `lib/contact`
- utilitarios genericos em `lib/utils`
- design system em `components/ui`

## Estado tecnico atual
- home componentizada por secao
- catalogos paginados
- catalogos com busca e filtros
- detalhes de produto com URL por tipo
- CTA por produto configuravel: WhatsApp ou link externo
- flags comerciais por produto: `featured` e `bestSeller`
- analytics de conversao persistidos em `AnalyticsEvent`
- captura alternativa de lead persistida em `Lead`
- dashboard comercial no admin
- SEO estruturado com `FAQPage`, `Article` e `Product`
- `getSiteIdentity()` com cache explicito
- intents de WhatsApp centralizadas em `lib/contact/whatsapp-intents.ts`
- fontes principais via `next/font`
- icones locais em SVG via `components/ui/Icon.tsx`
- politica editorial centralizada para `featured` e `bestSeller`
- QA visual automatizado com snapshots Playwright
- upload persistente em Supabase obrigatorio em producao
- rate limit distribuido obrigatorio em producao
- CSP dinamica com nonce por request
- fallback de migrations via `scripts/db-deploy.mjs`

## Variaveis de ambiente
Copie `.env.example` para `.env` e preencha:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `DATA_QUERY_FAIL_FAST`

## Setup local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Banco local ou remoto
Opcao A - banco local via Docker:

```bash
docker compose up -d
```

Opcao B - Supabase/PostgreSQL remoto:
- configure `DATABASE_URL` e `DIRECT_URL` no `.env`

### 3. Prisma
```bash
npm run db:generate
npm run db:deploy
npm run db:seed
```

### 4. Desenvolvimento
```bash
npm run dev
```

Observacao:
- `dev` usa `next dev --webpack`
- isso evita o crash de Turbopack observado no Windows deste projeto

## Scripts principais

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
npm run test:e2e
npm run test:e2e:visual
npm run db:generate
npm run db:deploy
npm run db:deploy:prisma
npm run db:seed
```

## Prisma e migrations
- `db:deploy` usa `node scripts/db-deploy.mjs`
- fluxo:
  1. tenta `prisma migrate deploy`
  2. se o engine falhar no ambiente local, cai para um runner SQL controlado

## Upload de imagens
- rota: `app/api/upload/route.ts`
- autenticacao obrigatoria de admin
- tipos aceitos: JPEG, PNG, WebP, AVIF, GIF
- tamanho maximo: 5 MB
- storage:
  - producao: Supabase obrigatorio
  - desenvolvimento: Supabase ou fallback local em `public/uploads`

Importante:
- em producao serverless, configure `SUPABASE_*`
- nao dependa de `public/uploads` como persistencia final

## Analytics e leads
- tracking centralizado em `app/api/track/route.ts`
- eventos persistidos em `AnalyticsEvent`
- formulario de contato alternativo persistido em `Lead`
- dashboard admin mostra metricas comerciais, top produtos e leads recentes

## Seguranca operacional
- CSP aplicada via `proxy.ts` com nonce por request
- `script-src 'unsafe-inline'` removido
- login admin exige Upstash configurado em producao
- upload exige Supabase configurado em producao
- `SUPABASE_SERVICE_ROLE_KEY` continua sendo credencial sensivel; se for exposta, precisa ser trocada operacionalmente

## CTA por produto
- configuracao no admin em `/admin/produtos`
- cada produto pode usar:
  - `WHATSAPP`
  - `EXTERNAL`
- campos persistidos em banco:
  - `ctaMode`
  - `ctaUrl`
  - `ctaLabel`
- regra central em:
  - `lib/core/product-cta.ts`

Comportamento:
- `servicos`: CTA do card e da pagina de detalhe respeitam o modo configurado
- `cursos`: card abre link externo quando configurado; caso contrario segue para detalhe
- `materiais`: card abre link externo quando configurado; caso contrario segue para detalhe

## Testes
- E2E com Playwright em `tests/e2e`
- o `webServer` usa `next dev --webpack`
- para rodar os E2E no Windows, instale os browsers:

```bash
npx playwright install chromium
```

## Documentacao
- documentacao tecnica principal:
  - `docs/DOCUMENTACAO_TECNICA_ELIANE_MARQUES.md`
- manual de uso do admin:
  - `docs/MANUAL_ADMIN_PLATAFORMA.md`
- politica editorial de destaques:
  - `docs/POLITICA_EDITORIAL_DESTAQUES.md`
- auditoria de acessibilidade e performance:
  - `docs/AUDITORIA_ACESSIBILIDADE_PERFORMANCE.md`
- backlog operacional:
  - `docs/BACKLOG_TECNICO_OPERACIONAL.md`
- arquitetura:
  - `docs/ARCHITECTURE.md`
- design tokens:
  - `docs/DESIGN_TOKENS.md`

## Estado atual do backlog
Executado:
- endurecimento de upload, auth, CSP e rate limit
- pipeline de imagem
- home componentizada
- intents de WhatsApp centralizadas
- cache explicito de identidade do site
- padronizacao do admin
- CTA por produto configuravel
- favicon e limpeza visual final da home

Pendente principal:
- rotacao da credencial sensivel do Supabase
- integracao dos leads com CRM ou automacao comercial
