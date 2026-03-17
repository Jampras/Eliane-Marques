# Backlog Tecnico Operacional - Eliane Marques Website
**Data:** 12/03/2026
**Origem:** estado atual do codigo em producao
**Arquivo base:** `docs/DOCUMENTACAO_TECNICA_ELIANE_MARQUES.md`

## 1. Backlog Tecnico por Prioridade

### P0 - Executar primeiro

#### BT-011 - Rotacionar credencial sensivel do Supabase
- **Objetivo:** eliminar risco residual operacional associado a chave atual.
- **Impacto:** alto.
- **Risco atual:** credencial sensivel ja exposta anteriormente fora do repositorio.

#### BT-016 - Integrar leads com CRM ou automacao comercial
- **Objetivo:** tirar o processo comercial do modo manual.
- **Impacto:** alto.
- **Risco atual:** leads capturados exigem operacao manual no painel.

### P1 - Executar em seguida

#### BT-013 - Revisar featured comercial por configuracao
- **Objetivo:** decidir regra editorial final para destaque comercial em home e pricing.
- **Impacto:** medio.

#### BT-014 - Formalizar QA visual automatizado de home e admin
- **Objetivo:** reduzir regressao visual em pontos de conversao.
- **Impacto:** medio.

#### BT-018 - Consolidar auth admin apos validacao do Google OAuth
- **Objetivo:** remover o modo dual-stack de login quando o fluxo Google estiver aprovado.
- **Impacto:** medio.

#### BT-019 - Criar schema unificado de ambiente com fail-fast
- **Objetivo:** validar todas as variaveis criticas na inicializacao.
- **Impacto:** medio.

#### BT-020 - Centralizar singletons institucionais em um dominio dedicado
- **Objetivo:** agrupar `Config`, `About` e futuros modulos institucionais sob padrao unico.
- **Impacto:** medio.

### P2 - Backlog de melhoria

#### BT-017 - Dashboard comercial no admin
- **Objetivo:** evoluir o dashboard atual com agregacoes, periodos e funil.

#### BT-021 - Verificacao de migrations em CI Linux
- **Objetivo:** garantir previsibilidade do schema fora do Windows.
- **Impacto:** medio.

#### BT-022 - Politica de retencao/agregacao de analytics
- **Objetivo:** evitar crescimento indefinido da tabela `AnalyticsEvent`.
- **Impacto:** medio.

---

## 2. Itens Ja Executados

Concluidos no codigo:
- upload autenticado endurecido
- storage persistente em producao
- revalidacao de detalhes apos mutacao
- pipeline de imagem
- fontes principais via `next/font`
- fallback resiliente de migrations
- CSP com nonce por request
- obrigatoriedade de Upstash em producao para login
- home componentizada
- intents de WhatsApp centralizadas
- cache explicito de `getSiteIdentity()`
- CTA por produto configuravel
- analytics de conversao
- dashboard comercial no admin
- captura alternativa de lead
- schemas `Product`, `Article` e `FAQPage`
- busca e filtros nas listagens publicas
- flags comerciais por produto
- icones locais em SVG
- politica editorial documentada para `featured` e `bestSeller`
- QA visual automatizado com snapshots Playwright
- auditoria de acessibilidade e performance documentada
- favicon
- limpeza visual e padronizacao do admin
- schema unico de ambiente com fail-fast
- dominio institucional `Config` + `About` centralizado em `lib/institutional`

---

## 3. Ordem Recomendada de Execucao

### Sprint 1
- BT-011
- BT-016

### Sprint 2
- BT-013
- BT-018
- BT-019

### Sprint 3
- BT-014
- BT-020

### Sprint 4
- BT-017
- BT-021
- BT-022

---

## 4. Checklist Operacional Atual
- [ ] rotacionar credencial sensivel do Supabase
- [ ] integrar leads com CRM ou automacao comercial
- [ ] decidir regra editorial definitiva de destaque comercial
- [ ] manter snapshots visuais atualizados quando a UI mudar
- [ ] evoluir dashboard com filtros temporais mais avancados e agregacao
- [ ] concluir rollout do Google OAuth no admin e remover stack legada quando aprovado
- [ ] validar ambiente novo no Vercel e em CI
- [x] consolidar modulos singleton de conteudo institucional
