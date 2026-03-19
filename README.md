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
- Supabase Auth / Storage
- Zod
- JWT via `jose`
- Upstash Redis REST
- Playwright

## Arquitetura resumida
- rotas publicas em `app/(public)`
- backoffice em `app/(admin)/admin`
- leitura de dados em `lib/data`
- mutacoes em `lib/actions`
- dominio institucional em `lib/institutional`
- contrato de ambiente em `lib/env`
- infraestrutura server-side em `lib/server`
- regras de negocio compartilhadas em `lib/core`
- intents de contato em `lib/contact`
- utilitarios genericos em `lib/utils`
- design system em `components/ui`

## Estado tecnico atual
- home componentizada por secao
- home administravel em `/admin/home` para hero, audiencia, leitura de valor, metodo, FAQ e CTA final
- pagina `Sobre` administravel em `/admin/sobre` e publicada em `/sobre`
- catalogos com busca, filtros e detalhe por tipo
- CTA por produto configuravel: WhatsApp ou link externo
- flags comerciais por produto: `featured` e `bestSeller`
- analytics persistidos em `AnalyticsEvent` com agregado diario em `AnalyticsDailyAggregate`
- captura alternativa de lead persistida em `Lead`
- dashboard comercial no admin
- ingestao publica endurecida com same-origin, rate limit e allowlist de sources
- login admin via Google OAuth com whitelist de emails
- upload persistente em Supabase obrigatorio em producao
- CSP dinamica com nonce por request
- fallback resiliente de migrations via `scripts/db-deploy.mjs`
- home publica ligada ao dominio institucional com conteudo administravel no backoffice

## Variaveis de ambiente
Copie `.env.example` para `.env` e preencha:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_SESSION_SECRET`
- `ADMIN_GOOGLE_ALLOWED_EMAILS`
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
npm run analytics:maintain
```

## Seguranca operacional
- CSP aplicada via `proxy.ts` com nonce por request
- `script-src 'unsafe-inline'` removido
- login admin exige Upstash configurado em producao
- upload exige Supabase configurado em producao
- login por senha foi removido; o painel e Google-only
- `SUPABASE_SERVICE_ROLE_KEY` continua sendo credencial sensivel; se for exposta, precisa ser trocada operacionalmente
- analytics e lead capture usam rate limit publico; sem Redis disponivel, o fallback atual e memoria local

## Pontos fracos atuais
- a home publica ainda esta em iteracao, principalmente no mobile
- nao ha suite de testes unitarios para helpers criticos
- o build agora tenta seguir mesmo sem banco acessivel para queries publicas protegidas por fallback
- build continua dependente de banco acessivel e pode sofrer lock do Prisma no Windows

## Estado atual do backlog
Executado:
- endurecimento de upload, auth, CSP e rate limit
- pipeline de imagem
- intents de WhatsApp centralizadas
- cache explicito de identidade do site
- padronizacao do admin
- CTA por produto configuravel
- schema unico de ambiente
- dominio institucional centralizado
- analytics com agregacao diaria

Pendente principal:
- rotacao da credencial sensivel do Supabase
- integracao dos leads com CRM ou automacao comercial
- CI Linux para migrations
- agendamento recorrente de `npm run analytics:maintain`
- fechamento e publicacao da nova rodada visual da home

## Documentacao
- documentacao tecnica principal:
  - `docs/DOCUMENTACAO_TECNICA_ELIANE_MARQUES.md`
- arquitetura:
  - `docs/ARCHITECTURE.md`
- backlog operacional:
  - `docs/BACKLOG_TECNICO_OPERACIONAL.md`
- auditoria de acessibilidade e performance:
  - `docs/AUDITORIA_ACESSIBILIDADE_PERFORMANCE.md`
- manual de uso do admin:
  - `docs/MANUAL_ADMIN_PLATAFORMA.md`
- design tokens:
  - `docs/DESIGN_TOKENS.md`
- politica editorial de destaques:
  - `docs/POLITICA_EDITORIAL_DESTAQUES.md`
- plano de otimizacao da home:
  - `docs/PLANO_OTIMIZACAO_HOME_CONVERSAO.md`
- analise geral do projeto:
  - `docs/ANALISE_GERAL_PROJETO.md`
