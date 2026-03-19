# Auditoria de Acessibilidade e Performance

**Versao:** 1.2  
**Data:** 19/03/2026

## 1. Resumo

O projeto esta em estado operacional bom, mas ainda sem automacao formal de acessibilidade e sem budget de performance em CI.

## 2. Pontos positivos

- fontes principais via `next/font`
- icones locais em SVG
- foco visivel global
- `next/image` nas areas principais
- snapshots visuais e E2E para fluxos criticos
- analytics com agregado diario e retencao operacional

## 3. Pontos de atencao

- ainda nao existe auditoria automatica com axe ou Lighthouse CI
- textos secundarios pequenos exigem revisao recorrente de contraste
- build continua dependente de banco acessivel
- no Windows, `prisma generate` ainda pode sofrer lock do engine durante dev/build
- a home publica esta publicada, mas ainda passa por refinamento visual

## 4. Pendencias relevantes

### Alta
- rotacao da credencial sensivel do Supabase

### Media
- integracao de leads com CRM externo
- evolucao do dashboard comercial
- automatizacao recorrente de `analytics:maintain`
- decidir se o fallback em memoria para rate limit publico e aceitavel em producao

### Baixa
- auditoria formal com Lighthouse ou axe em pipeline CI

## 5. Conclusao

Os riscos reais remanescentes hoje sao operacionais, nao de performance bruta:
- credencial sensivel
- manutencao de analytics
- ausencia de testes unitarios
- refinamento continuo da home publicada
