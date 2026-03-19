# Politica Editorial de Destaques

**Versao:** 1.0  
**Data:** 12/03/2026

---

## 1. Objetivo

Padronizar o uso dos campos `featured` e `bestSeller` para evitar destaque arbitrario ou contraditorio entre home, pricing e listagens.

---

## 2. Regra de cada flag

### `featured`
Use quando a marca quer dar prioridade editorial ou estrategica a uma oferta.

Casos de uso:
- produto novo que precisa ganhar visibilidade
- servico que representa melhor o posicionamento da marca
- oferta que deve aparecer com mais destaque em vitrines e listagens

### `bestSeller`
Use quando existe prova comercial ou prioridade clara de venda.

Casos de uso:
- produto com maior volume de cliques ou vendas
- oferta principal da campanha atual
- produto que deve receber destaque no pricing

---

## 3. Regra visual atual do site

### Home - Secao de servicos
- prioridade do destaque visual:
  1. primeiro item com `featured`
  2. se nao houver, primeiro item com `bestSeller`
  3. se nao houver nenhum, card central
- no mobile, essa secao permanece em pilha vertical para favorecer leitura e comparacao

### Home - Secao de pricing
- prioridade do card principal:
  1. primeiro item com `bestSeller`
  2. se nao houver, primeiro item com `featured`
  3. se nao houver nenhum, card central
- no mobile, essa secao permanece em pilha vertical para favorecer comparacao de investimento

### Listagens publicas
- `featured` e `bestSeller` aparecem como badges
- a ordenacao geral prioriza:
  1. `featured`
  2. `bestSeller`
  3. `createdAt desc`

---

## 4. Regras operacionais

- nao marcar muitos produtos como `featured` ao mesmo tempo
- nao usar `bestSeller` sem justificativa comercial real
- se um produto for os dois ao mesmo tempo, isso sinaliza:
  - prioridade editorial
  - prioridade comercial

---

## 5. Recomendacao pratica

### Consultorias
- use `featured` para a oferta institucional principal
- use `bestSeller` apenas para a oferta com maior tracao real

### Cursos
- use `featured` em lancamentos
- use `bestSeller` no curso com maior conversao

### Materiais
- use `featured` para lead magnet ou item de entrada
- use `bestSeller` apenas quando houver sinal claro de demanda

---

## 6. Onde isso e aplicado no codigo

- regra central: `lib/core/editorial-highlights.ts`
- formulario admin: `app/(admin)/admin/produtos/ProductForm.tsx`
- listagem admin: `app/(admin)/admin/produtos/page.tsx`
- home servicos: `components/features/home/ServicesSection.tsx`
- home pricing: `components/features/home/PricingSection.tsx`
