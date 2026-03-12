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

### P2 - Backlog de melhoria

#### BT-017 - Dashboard comercial no admin
- **Objetivo:** evoluir o dashboard atual com agregacoes, periodos e funil.

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

---

## 3. Ordem Recomendada de Execucao

### Sprint 1
- BT-011
- BT-016

### Sprint 2
- BT-013

### Sprint 3
- BT-014

### Sprint 4
- BT-017

---

## 4. Checklist Operacional Atual
- [ ] rotacionar credencial sensivel do Supabase
- [ ] integrar leads com CRM ou automacao comercial
- [ ] decidir regra editorial definitiva de destaque comercial
- [ ] manter snapshots visuais atualizados quando a UI mudar
- [ ] evoluir dashboard com filtros temporais mais avancados e agregacao
