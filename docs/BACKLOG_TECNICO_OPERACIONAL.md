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

### P1 - Executar em seguida

#### BT-013 - Revisar featured comercial por configuracao
- **Objetivo:** decidir regra editorial final para destaque comercial em home e pricing.
- **Impacto:** medio.

#### BT-014 - Formalizar QA visual automatizado de home e admin
- **Objetivo:** reduzir regressao visual em pontos de conversao.
- **Impacto:** medio.

### P2 - Backlog de melhoria

#### BT-015 - Adicionar schema estruturado adicional
- **Objetivo:** expandir o SEO estruturado para outras areas alem de home e detalhe.

#### BT-016 - CRM ou formulario estruturado
- **Objetivo:** integrar os leads persistidos a um CRM externo ou automacao comercial.

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
- favicon
- limpeza visual e padronizacao do admin

---

## 3. Ordem Recomendada de Execucao

### Sprint 1
- BT-011

### Sprint 2
- BT-013

### Sprint 3
- BT-014
- BT-015

### Sprint 4
- BT-016
- BT-017

---

## 4. Checklist Operacional Atual
- [ ] rotacionar credencial sensivel do Supabase
- [ ] decidir regra editorial definitiva de destaque comercial
- [ ] ampliar suite de QA/E2E nos fluxos de conversao
- [ ] avaliar integracao de leads com CRM externo
