# Backlog Técnico Operacional — Eliane Marques Website
**Data:** 11/03/2026
**Origem:** desdobramento da documentação técnica principal
**Arquivo base:** `docs/DOCUMENTACAO_TECNICA_ELIANE_MARQUES.md`

## 1. Backlog Técnico por Prioridade

### P0 — Executar primeiro

#### BT-001 — Migrar upload local para storage persistente
- **Objetivo:** remover dependência de `public/uploads` como armazenamento de produção.
- **Impacto:** alto.
- **Risco atual:** perda de arquivos em ambiente serverless, inconsistência entre instâncias, limitação de escala.
- **Arquivos-alvo iniciais:**
  - `app/api/upload/route.ts`
  - `components/features/admin/ImageUpload.tsx`
  - `prisma/schema.prisma` se houver necessidade de metadados adicionais
- **Critério de aceite:**
  - upload salva em storage externo persistente
  - URL retornada continua compatível com o admin atual
  - upload sem sessão válida continua retornando `401`
  - fluxo E2E de upload permanece funcional

#### BT-002 — Corrigir encoding quebrado em toda a interface
- **Objetivo:** remover mojibake e padronizar UTF-8.
- **Impacto:** alto.
- **Risco atual:** percepção anti-premium, erro editorial, manutenção confusa.
- **Arquivos-alvo iniciais:**
  - `README.md`
  - `app/(admin)/admin/login/page.tsx`
  - `app/(admin)/admin/config/ConfigForm.tsx`
  - `components/features/admin/ImageUpload.tsx`
  - `components/features/home/ServicesSection.tsx`
  - `components/features/home/PricingSection.tsx`
  - `components/features/checklist/ChecklistItem.tsx`
  - `lib/core/whatsapp.ts`
  - páginas públicas que contenham símbolos/literais corrompidos
- **Critério de aceite:**
  - nenhum texto corrompido visível em site e admin
  - arquivos salvos em UTF-8
  - sem regressão em build/lint/testes

#### BT-003 — Ajustar contraste e legibilidade do sistema visual
- **Objetivo:** atingir contraste aceitável para texto secundário e labels.
- **Impacto:** alto.
- **Risco atual:** falha WCAG AA parcial, leitura ruim em mobile.
- **Arquivos-alvo iniciais:**
  - `app/globals.css`
  - `components/ui/Badge.tsx`
  - `components/ui/Button.tsx`
  - `components/shared/navigation/Navbar.tsx`
  - páginas públicas com microtipografia em `--taupe`
- **Critério de aceite:**
  - texto secundário não usa combinações com contraste abaixo de uso aceitável
  - labels pequenas críticas são revistas em tamanho e cor
  - revisão visual em mobile/tablet/desktop concluída

### P1 — Executar em seguida

#### BT-004 — Corrigir sitemap e estratégia de URLs por tipo de produto
- **Objetivo:** alinhar taxonomia pública, canonical e sitemap.
- **Impacto:** médio-alto.
- **Risco atual:** SEO inconsistente, indexação confusa.
- **Arquivos-alvo iniciais:**
  - `app/sitemap.ts`
  - `app/(public)/cursos/page.tsx`
  - `app/(public)/materiais/[slug]/page.tsx`
  - helpers de produto em `lib/data/products.ts`
- **Critério de aceite:**
  - sitemap reflete a estratégia de rota real escolhida
  - canônicos não entram em conflito
  - links internos seguem a mesma regra

#### BT-005 — Remover `unoptimized` e revisar pipeline de imagem
- **Objetivo:** recuperar ganho de performance das imagens.
- **Impacto:** médio-alto.
- **Risco atual:** LCP pior, maior tráfego, renderização mais lenta no mobile.
- **Arquivos-alvo iniciais:**
  - `app/(public)/cursos/page.tsx`
  - `app/(public)/materiais/page.tsx`
  - `app/(public)/materiais/[slug]/page.tsx`
  - `app/(public)/conteudos/page.tsx`
  - `app/(public)/conteudos/[slug]/page.tsx`
  - `next.config.mjs`
- **Critério de aceite:**
  - imagens passam a usar pipeline normal do Next quando possível
  - domínios remotos necessários estão configurados
  - build continua estável

#### BT-006 — Migrar fontes para `next/font`
- **Objetivo:** reduzir dependência externa e melhorar carregamento tipográfico.
- **Impacto:** médio.
- **Arquivos-alvo iniciais:**
  - `app/layout.tsx`
  - `app/globals.css`
- **Critério de aceite:**
  - fontes são carregadas por `next/font`
  - classes/variáveis continuam compatíveis com o design system
  - sem mudança visual inesperada

#### BT-007 — Revalidar páginas de detalhe nas mutações admin
- **Objetivo:** evitar stale content após edição de produto/post/checklist.
- **Impacto:** médio.
- **Arquivos-alvo iniciais:**
  - `lib/actions/admin-crud.ts`
  - eventualmente helpers de slug/rota por tipo
- **Critério de aceite:**
  - editar conteúdo no admin atualiza também a rota de detalhe correspondente

### P2 — Backlog de melhoria estruturante

#### BT-008 — Extrair seções da home em componentes dedicados
- **Objetivo:** reduzir acoplamento de `app/(public)/page.tsx`.
- **Impacto:** médio.
- **Arquivos-alvo iniciais:**
  - `app/(public)/page.tsx`
  - novos componentes em `components/features/home/`
- **Critério de aceite:**
  - home dividida em componentes por seção
  - arquivo principal da rota fica orientado por composição

#### BT-009 — Instrumentar analytics de conversão
- **Objetivo:** medir clique em CTA, navegação e comportamento de funil.
- **Impacto:** médio-alto.
- **Arquivos-alvo iniciais:**
  - `app/layout.tsx`
  - `components/shared/whatsapp/*`
  - `components/shared/navigation/Navbar.tsx`
- **Critério de aceite:**
  - eventos principais documentados
  - solução respeita consentimento e política adotada

#### BT-010 — Revisar toasts e skeletons para aderência visual
- **Objetivo:** alinhar UI auxiliar ao sistema visual atual.
- **Impacto:** médio-baixo.
- **Arquivos-alvo iniciais:**
  - `components/ui/ToastProvider.tsx`
  - `app/(public)/loading.tsx`
- **Critério de aceite:**
  - toasts e loading seguem a paleta atual
  - sem fundo branco destoante

---

## 2. Issues Separadas por Área

### Área: Infraestrutura

#### ISSUE-INFRA-01 — Storage persistente para uploads do admin
- **Problema:** uploads dependem de filesystem local.
- **Escopo:** trocar backend de upload por object storage.
- **Arquivos principais:** `app/api/upload/route.ts`, `components/features/admin/ImageUpload.tsx`.
- **Definition of Done:**
  - provider definido
  - upload persistente funcional
  - retorno de URL mantido
  - autenticação preservada
  - testes ajustados

#### ISSUE-INFRA-02 — Higienização do repositório e artefatos locais
- **Problema:** workspace contém ruído operacional além do app.
- **Escopo:** revisar `.gitignore`, separar artefatos e confirmar o que deve ser versionado.
- **Arquivos principais:** `.gitignore`, diretórios auxiliares na raiz.
- **Definition of Done:**
  - artefatos não essenciais fora do fluxo do app deixam de poluir o projeto

### Área: Frontend / Design System

#### ISSUE-FE-01 — Correção global de contraste
- **Problema:** texto secundário falha contraste em vários cenários.
- **Escopo:** revisar tokens e componentes base.
- **Arquivos principais:** `app/globals.css`, `components/ui/*`, `components/shared/navigation/Navbar.tsx`.
- **Definition of Done:**
  - contraste revisado
  - labels críticas legíveis em mobile
  - QA visual concluído

#### ISSUE-FE-02 — Revisão de encoding e conteúdo textual
- **Problema:** há textos corrompidos em múltiplos componentes.
- **Escopo:** normalização UTF-8 e revisão editorial técnica.
- **Arquivos principais:** home, admin, checklist, helpers e docs.
- **Definition of Done:**
  - sem mojibake no produto
  - docs principais legíveis

#### ISSUE-FE-03 — Refatoração estrutural da home
- **Problema:** muitas seções embutidas em uma única rota.
- **Escopo:** extrair componentes por seção.
- **Arquivos principais:** `app/(public)/page.tsx`, `components/features/home/*`.
- **Definition of Done:**
  - composição clara por seções
  - sem mudança funcional

#### ISSUE-FE-04 — Alinhamento visual de toasts e loading
- **Problema:** UI auxiliar não acompanha o visual do site.
- **Escopo:** redesenhar toast e skeleton.
- **Arquivos principais:** `components/ui/ToastProvider.tsx`, `app/(public)/loading.tsx`.
- **Definition of Done:**
  - componentes auxiliares aderentes ao design system

### Área: SEO / Conteúdo

#### ISSUE-SEO-01 — Consolidar estratégia de URL de produto
- **Problema:** sitemap, links internos e taxonomia não estão totalmente alinhados.
- **Escopo:** definir regra única por tipo de produto e refletir isso em sitemap/canonical/links.
- **Arquivos principais:** `app/sitemap.ts`, páginas públicas de catálogo/detalhe, `lib/data/products.ts`.
- **Definition of Done:**
  - regra documentada
  - sitemap coerente
  - links internos consistentes

#### ISSUE-SEO-02 — Estruturar dados adicionais para conteúdo e produto
- **Problema:** apenas `Organization` JSON-LD está presente.
- **Escopo:** avaliar `Article`, `Product`, `FAQPage`, `BreadcrumbList`.
- **Arquivos principais:** `app/layout.tsx`, rotas de detalhe, home.
- **Definition of Done:**
  - schemas estruturados inseridos onde fizer sentido

### Área: Performance

#### ISSUE-PERF-01 — Pipeline de imagens do Next
- **Problema:** uso recorrente de `unoptimized`.
- **Escopo:** revisar origem das imagens e otimização.
- **Arquivos principais:** rotas públicas com `Image`, `next.config.mjs`.
- **Definition of Done:**
  - `unoptimized` removido onde possível
  - imagens remotas compatíveis com config

#### ISSUE-PERF-02 — Migração de fontes para `next/font`
- **Problema:** fontes externas ainda bloqueiam renderização e dependem de CDN.
- **Escopo:** migrar carregamento tipográfico.
- **Arquivos principais:** `app/layout.tsx`, `app/globals.css`.
- **Definition of Done:**
  - `next/font` implementado
  - visual preservado

### Área: CMS / Admin

#### ISSUE-ADMIN-01 — Revalidação completa de páginas de detalhe
- **Problema:** edições podem não refletir imediatamente em detalhes públicos.
- **Escopo:** ampliar `revalidatePath`/`revalidateTag` nas server actions.
- **Arquivos principais:** `lib/actions/admin-crud.ts`.
- **Definition of Done:**
  - detalhe público atualizado após CRUD

#### ISSUE-ADMIN-02 — Revisão de copy e UX do painel
- **Problema:** o admin ainda tem textos quebrados e inconsistências visuais.
- **Escopo:** revisão textual e visual do backoffice.
- **Arquivos principais:** `app/(admin)/admin/*`, `components/features/admin/*`.
- **Definition of Done:**
  - interface admin estável, legível e coerente com o restante do sistema

---

## 3. Plano de Correção — Ordem de Implementação Arquivo por Arquivo

### Etapa 1 — Segurança operacional e qualidade visível
1. `app/api/upload/route.ts`
- Trocar backend de persistência de arquivo.
- Manter autenticação atual e validação MIME/tamanho.

2. `components/features/admin/ImageUpload.tsx`
- Ajustar integração com novo backend de upload.
- Corrigir strings com encoding quebrado.

3. `app/(admin)/admin/login/page.tsx`
- Corrigir texto corrompido.
- Revisar labels e placeholders.

4. `app/(admin)/admin/config/ConfigForm.tsx`
- Corrigir encoding dos labels.
- Revisar consistência de cópia.

5. `components/features/home/ServicesSection.tsx`
- Corrigir símbolos quebrados.
- Revisar contraste de microtextos.

6. `components/features/home/PricingSection.tsx`
- Corrigir texto/símbolos quebrados.
- Revisar contraste e featured state.

7. `components/features/checklist/ChecklistItem.tsx`
- Corrigir símbolos quebrados.
- Validar texto e hit area.

8. `lib/core/whatsapp.ts`
- Corrigir comentários/strings com encoding ruim.
- Preservar comportamento atual.

### Etapa 2 — Design system e acessibilidade
9. `app/globals.css`
- Revisar `--color-text-2`, `--color-text-muted`, tamanhos mínimos e contraste.
- Revisar tokens semânticos para texto secundário.

10. `components/ui/Badge.tsx`
- Ajustar contraste e leitura de labels pequenas.

11. `components/ui/Button.tsx`
- Confirmar contraste das variantes e estados.

12. `components/shared/navigation/Navbar.tsx`
- Ajustar tamanho/cor dos links se necessário.
- Revisar breakpoint `xl` caso a validação manual mostre problema.

13. `components/ui/ToastProvider.tsx`
- Alinhar visual do toast à paleta do site.

14. `app/(public)/loading.tsx`
- Atualizar skeleton para o tema atual.

### Etapa 3 — SEO e rotas de catálogo
15. `app/sitemap.ts`
- Definir e implementar regra correta de URL por tipo de produto.

16. `app/(public)/cursos/page.tsx`
- Ajustar link de detalhe conforme regra oficial.
- Remover `unoptimized` se a origem permitir.

17. `app/(public)/materiais/page.tsx`
- Revisar estratégia de detalhes e otimização de imagem.

18. `app/(public)/materiais/[slug]/page.tsx`
- Confirmar canonical e função da rota dentro da taxonomia escolhida.
- Revisar `unoptimized`.

19. `app/(public)/conteudos/page.tsx`
- Revisar `unoptimized` e fallback de imagem.

20. `app/(public)/conteudos/[slug]/page.tsx`
- Revisar `priority`/`sizes`/`unoptimized` e manter SEO consistente.

### Etapa 4 — Cache, manutenção e refino estrutural
21. `lib/actions/admin-crud.ts`
- Adicionar revalidação das páginas de detalhe.

22. `app/layout.tsx`
- Migrar fontes para `next/font`.
- Manter metadata/JSON-LD intactos.

23. `app/(public)/page.tsx`
- Extrair seções estáticas em componentes dedicados.

24. `components/features/home/IdentitySection.tsx` (novo)
- Receber bloco “Você não precisa virar outra pessoa”.

25. `components/features/home/MethodSection.tsx` (novo)
- Receber bloco de método/processo.

26. `components/features/home/FaqSection.tsx` (novo)
- Receber FAQ da home.

27. `components/features/home/FinalCtaSection.tsx` (novo)
- Receber CTA final reutilizável.

### Etapa 5 — Documentação e governança
28. `README.md`
- Atualizar para refletir arquitetura e visual atuais.

29. `docs/ARCHITECTURE.md`
- Alinhar ao estado real do projeto.

30. `docs/DESIGN_TOKENS.md`
- Atualizar fontes, paleta e princípios atuais.

31. `.gitignore`
- Revisar artefatos de ambiente e ruído operacional.

---

## 4. Ordem Recomendada de Execução por Sprint

### Sprint 1
- BT-001
- BT-002
- BT-003

### Sprint 2
- BT-004
- BT-005
- BT-007

### Sprint 3
- BT-006
- BT-010
- BT-008

### Sprint 4
- BT-009
- revisão de documentação e governança

---

## 5. Dependências entre Itens
- **BT-001** deve acontecer antes de uma otimização séria de mídia.
- **BT-003** deve acontecer antes de QA final de responsividade/acessibilidade.
- **BT-004** precisa ser decidido antes de ajustes finos de canonical e analytics por tipo de produto.
- **BT-005** depende parcialmente da decisão de storage/origem de imagem.
- **BT-006** idealmente acontece depois da estabilização visual básica, para facilitar comparação.

---

## 6. Checklist de Execução do Time
- [ ] Definir provider de storage para uploads
- [ ] Corrigir todos os arquivos com mojibake
- [ ] Ajustar contraste do design system
- [ ] Definir regra oficial de URL por tipo de produto
- [ ] Revisar pipeline de imagens
- [ ] Migrar fontes para `next/font`
- [ ] Ampliar revalidação de páginas de detalhe
- [ ] Refatorar home em componentes menores
- [ ] Atualizar documentação antiga do repositório
- [ ] Rodar lint, typecheck, build e E2E após cada bloco maior
