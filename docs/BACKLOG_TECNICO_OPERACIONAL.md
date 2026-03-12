# Backlog Tecnico Operacional - Eliane Marques Website
**Data:** 12/03/2026
**Origem:** estado atual do codigo em producao
**Arquivo base:** `docs/DOCUMENTACAO_TECNICA_ELIANE_MARQUES.md`

## 1. Backlog Tecnico por Prioridade

### P0 - Executar primeiro

#### BT-009 - Instrumentar analytics de conversao
- **Objetivo:** medir clique em CTA, navegacao, WhatsApp e links externos.
- **Impacto:** alto.
- **Risco atual:** decisoes de conversao sem telemetria.

#### BT-011 - Rotacionar credencial sensivel do Supabase
- **Objetivo:** eliminar risco residual operacional associado a chave atual.
- **Impacto:** alto.
- **Risco atual:** credencial sensivel ja exposta anteriormente fora do repositorio.

### P1 - Executar em seguida

#### BT-012 - Migrar Material Symbols para bundle local
- **Objetivo:** remover dependencia de CDN para icones.
- **Impacto:** medio.

#### BT-013 - Revisar featured comercial por configuracao
- **Objetivo:** tirar destaque fixo por indice em home e pricing.
- **Impacto:** medio.

#### BT-014 - Formalizar QA visual automatizado de home e admin
- **Objetivo:** reduzir regressao visual em pontos de conversao.
- **Impacto:** medio.

### P2 - Backlog de melhoria

#### BT-015 - Adicionar schema estruturado adicional
- **Objetivo:** enriquecer SEO com `Article`, `Product` e `FAQPage`.

#### BT-016 - CRM ou formulario estruturado
- **Objetivo:** adicionar canal de captura alem de WhatsApp.

#### BT-017 - Dashboard comercial no admin
- **Objetivo:** exibir cliques, origem de leads e desempenho de CTA.

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
- favicon
- limpeza visual e padronizacao do admin

---

## 3. Ordem Recomendada de Execucao

### Sprint 1
- BT-009
- BT-011

### Sprint 2
- BT-012
- BT-013

### Sprint 3
- BT-014
- BT-015

### Sprint 4
- BT-016
- BT-017

---

## 4. Checklist Operacional Atual
- [ ] configurar analytics de conversao
- [ ] rotacionar credencial sensivel do Supabase
- [ ] revisar dependencia externa de icones
- [ ] decidir featured comercial configuravel
- [ ] ampliar suite de QA/E2E nos fluxos de conversao
