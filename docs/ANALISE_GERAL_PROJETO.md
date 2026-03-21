# Analise Geral do Projeto

**Versao:** 1.1  
**Data:** 20/03/2026  
**Escopo:** estrutura de pastas, codigo, seguranca, operacao e manutencao

## 1. Resumo

O projeto esta funcional, publicado e mais previsivel do que no inicio, mas ainda depende de fechamento operacional e de aumento gradual da cobertura de testes para estabilizacao real.

## 2. Pontos fortes

- separacao razoavel entre `app`, `components`, `lib`, `prisma` e `docs`
- `lib/env` centraliza o contrato de ambiente
- `lib/institutional` centraliza o conteudo singleton
- auth admin migrado para Google-only
- ingestao publica endurecida em analytics, leads e upload
- dashboard comercial com agregado diario
- paletas globais e ambientacao visual agora cobrem o site inteiro de forma coerente

## 3. Pontos fracos reais

### Operacao
- `SUPABASE_SERVICE_ROLE_KEY` continua como pendencia operacional
- o build ainda depende de um Prisma Client gerado, mas as queries publicas com fallback nao bloqueiam mais a compilacao sem banco
- no Windows, `prisma generate` ainda pode travar o engine DLL
- `analytics:maintain` ainda depende de execucao manual

### Backend
- a cobertura unitaria dos modulos criticos, validators do admin, helpers institucionais, `safeDataQuery`, rate limit publico e upload avancou, mas ainda esta longe do ideal
- rate limit publico agora falha fechado em producao quando Redis falha
- metadata publica auxiliar ja esta menos acoplada ao Prisma direto
- endpoints publicos criticos passaram a responder com erros e retry mais previsiveis
- upload administrativo agora usa validacao centralizada com mensagens consistentes do endpoint ate a UI

### Frontend publico
- a home publica ja esta em producao e agora e administravel via painel
- o desktop segue mais consistente do que o mobile
- a secao `Home` do admin ja controla textos, CTA, imagem lateral do hero e imagens por bloco
- o layout publico agora usa uma camada global de ambientacao para reduzir a sensacao de secoes soltas

### Documentacao
- a documentacao esta mais alinhada do que antes, mas continua exigindo manutencao frequente porque o projeto segue em iteracao intensa

## 4. Prioridade recomendada

### P0
1. rotacionar a credencial sensivel do Supabase
2. automatizar `analytics:maintain`
3. continuar refinamento visual da home publicada

### P1
1. adicionar testes unitarios para modulos criticos com efeito colateral
2. evoluir a validacao de migrations em CI Linux para incluir cenarios de rollback/erro controlado
3. revisar limites e mensagens dos endpoints publicos
4. ampliar a cobertura da nova suite unitaria para actions e validadores com persistencia

### P2
1. integrar leads com CRM ou automacao
2. aprofundar dashboard comercial

## 5. Conclusao

O problema principal hoje nao e falta de feature. E previsibilidade operacional, cobertura de testes e coerencia final da experiencia publica.
