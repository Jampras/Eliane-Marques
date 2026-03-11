# Eliane Marques Website

Site institucional e comercial da marca Eliane Marques, com foco em consultoria de imagem, etiqueta corporativa, cursos, materiais digitais e checklists.

## Stack
- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
- Zod
- JWT via `jose`
- Playwright

## Arquitetura resumida
- rotas publicas em `app/(public)`
- backoffice em `app/(admin)/admin`
- leitura de dados em `lib/data`
- mutacoes em `lib/actions`
- auth server-side em `lib/server`
- design system em `components/ui`
- secoes da home em `components/features/home`

## Diferenciais tecnicos atuais
- home componentizada por secao
- catalogos paginados
- detalhes de produto com URLs canonicas por tipo
- CTA por produto configuravel: WhatsApp ou link externo
- imagens publicas com pipeline de otimizacao condicional
- fontes principais via `next/font`
- upload com driver `local` ou `supabase`
- revalidacao de listagens e paginas de detalhe apos CRUD no admin

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
- o script `dev` usa `next dev --webpack`
- isso evita o crash de Turbopack observado no Windows deste projeto

## Scripts principais

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
npm run test:e2e
npm run db:generate
npm run db:deploy
npm run db:seed
```

## Upload de imagens
- rota: `app/api/upload/route.ts`
- autenticacao obrigatoria de admin
- tipos aceitos: JPEG, PNG, WebP, AVIF, GIF
- tamanho maximo: 5 MB
- storage:
  - `supabase` quando `SUPABASE_*` estiver configurado
  - `local` como fallback em `public/uploads`

Importante:
- em producao serverless, configure `SUPABASE_*`
- nao dependa de `public/uploads` como persistencia final

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

## Build e ambiente
`npm run build` depende de banco acessivel porque paginas publicas executam queries durante prerender.

Se o banco nao estiver disponivel, o build falha.

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
- backlog operacional:
  - `docs/BACKLOG_TECNICO_OPERACIONAL.md`
- arquitetura:
  - `docs/ARCHITECTURE.md`
- design tokens:
  - `docs/DESIGN_TOKENS.md`

## Estado atual do backlog
Ja executado:
- BT-001 a BT-008
- BT-010

Pendente:
- BT-009 analytics de conversao
