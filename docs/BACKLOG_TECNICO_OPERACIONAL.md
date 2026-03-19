# Backlog Tecnico Operacional - Eliane Marques Website

**Data:** 19/03/2026  
**Origem:** estado atual do codigo no repositorio

## 1. Prioridade

### P0

#### BT-011 - Rotacionar credencial sensivel do Supabase
- **Objetivo:** eliminar o principal risco operacional remanescente.
- **Impacto:** alto.

#### BT-022 - Operacionalizar `analytics:maintain`
- **Objetivo:** garantir retencao/agregacao recorrente sem depender de execucao manual.
- **Impacto:** alto.

### P1

#### BT-016 - Integrar leads com CRM ou automacao comercial
- **Objetivo:** tirar o processo comercial do modo manual.
- **Impacto:** alto.

#### BT-021 - Validar migrations em CI Linux
- **Objetivo:** garantir previsibilidade do schema fora do Windows.
- **Impacto:** medio.

#### BT-024 - Definir estrategia de fallback do rate limit publico
- **Objetivo:** decidir se analytics e lead capture podem continuar degradando para memoria local quando Redis falhar.
- **Impacto:** medio.

#### BT-025 - Adicionar testes unitarios para modulos criticos
- **Objetivo:** cobrir `lib/env`, `lib/core/product-cta`, analytics e seguranca de requests.
- **Impacto:** medio.

### P2

#### BT-013 - Revisar featured comercial por configuracao
- **Objetivo:** decidir regra editorial final para destaque comercial em home e pricing.
- **Impacto:** medio.

#### BT-026 - Refinar visual e usabilidade da home publicada
- **Objetivo:** continuar ajustes de composicao, legibilidade e mobile sem reabrir a base estrutural.
- **Impacto:** medio.

#### BT-017 - Evoluir dashboard comercial
- **Objetivo:** ampliar filtros temporais, comparativos e funil.
- **Impacto:** medio.

## 2. Itens ja executados

- upload autenticado endurecido
- storage persistente em producao
- CSP com nonce por request
- auth admin Google-only
- schema unico de ambiente
- dominio institucional `Config` + `About`
- CTA por produto configuravel
- analytics com agregado diario
- lead capture com honeypot, same-origin e rate limit
- dashboard comercial inicial
- home componentizada
- home publicada com conteudo administravel em `/admin/home`

## 3. Checklist atual

- [ ] rotacionar credencial sensivel do Supabase
- [ ] automatizar `npm run analytics:maintain`
- [ ] integrar leads com CRM ou automacao comercial
- [ ] validar migrations em CI Linux
- [ ] decidir estrategia do fallback de rate limit publico
- [ ] adicionar testes unitarios para modulos criticos
- [ ] evoluir dashboard com filtros temporais mais avancados
- [ ] refinar visual e usabilidade da home publicada
