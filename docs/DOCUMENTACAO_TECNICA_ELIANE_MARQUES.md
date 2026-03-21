# Documentacao Tecnica - Eliane Marques Website

**Versao:** 1.8  
**Data:** 19/03/2026  
**Status:** producao com manutencao ativa e home institucional publicada com edicao via admin

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
- o conteudo institucional da home vem de `lib/institutional/home.ts`
- `/admin/home` controla hero, imagem lateral do hero, audiencia, leitura de valor, metodo, FAQ e CTA final
- cards de audiencia, leitura de valor e metodo aceitam imagem por item
- o card lateral do hero aceita imagem propria configurada em `/admin/home`
- o layout publico injeta uma camada global de ambientacao para manter continuidade visual entre as secoes
- a rota `sitemap.xml` agora usa a camada `lib/data`, sem consulta Prisma direta

### Testes
- `tests/e2e` cobre fluxo funcional e visual
- `tests/unit` cobre helpers criticos de ambiente, seguranca de request, analytics/reporting, CTA de produto, validators do admin, helpers institucionais, `safeDataQuery`, formatacao de rate limit publico, validacao de upload e mapeamento de extensao
- a pipeline de validacao Linux executa lint, unit tests, `db:deploy`, typecheck e build sobre PostgreSQL efemero

### Admin
- painel em `app/(admin)/admin`
- login Google-only
- CRUD de produtos, blog, checklists, sobre e configuracao
- dashboard comercial com agregacao diaria

### Dominio institucional
- `Config` e `About` foram centralizados em `lib/institutional`
- padrao recomendado para futuros singletons do projeto
- `Config` agora tambem controla a paleta global do site via `themePreset`
- as paletas usam tokens semanticos e agora cobrem navbar, hero, footer, overlays, sombras, catalogos publicos, paginas internas, toasts e login admin

## 4. Integracoes externas

### Supabase
- PostgreSQL
- Storage
- Auth com Google OAuth

### Upstash Redis
- rate limit distribuido do login admin
- rate limit publico obrigatorio em producao; se Redis falhar, endpoints publicos sensiveis falham fechado

### WhatsApp
- intents centralizadas em `lib/contact/whatsapp-intents.ts`

## 5. Seguranca e operacao

- CSP com nonce por request em `proxy.ts`
- login admin por Google com whitelist
- lead capture e analytics com same-origin e rate limit
- upload persistente obrigatorio em producao
- fallback de migrations via `scripts/db-deploy.mjs`
- `/api/upload` valida arquivo por helper dedicado e responde `400` com mensagens claras para payload invalido, tipo nao permitido e limite de tamanho

### Pendencias reais
- rotacao da `SUPABASE_SERVICE_ROLE_KEY`
- agendamento recorrente de `analytics:maintain`

## 6. Pontos fracos atuais

- o build ainda depende de um Prisma Client gerado, mas as queries publicas com fallback nao bloqueiam mais a compilacao sem banco
- no Windows, `prisma generate` ainda pode travar o engine DLL
- a cobertura unitaria melhorou, mas ainda nao cobre actions com efeito colateral, integracoes e parte da camada publica
- a home publica foi publicada, mas ainda recebe refinamento visual continuo, principalmente no mobile

## 7. Recomendacoes priorizadas

### Imediato
1. rotacionar a credencial sensivel do Supabase
2. automatizar `analytics:maintain`
3. continuar refinamento visual da home ja publicada

### Em seguida
1. adicionar testes unitarios para modulos criticos
2. validar migrations em CI Linux
3. revisar periodicamente os limites publicos e mensagens de erro

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
