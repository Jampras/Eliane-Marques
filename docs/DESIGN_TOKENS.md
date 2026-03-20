# Design Tokens - Eliane Marques

Documento de referencia rapida para o sistema visual atual.

## 1. Fonte de verdade
- tokens visuais: `app/globals.css`
- mapeamento Tailwind: `tailwind.config.js`
- fontes principais: `app/layout.tsx`
- icones locais: `components/ui/Icon.tsx`

## 2. Paleta atual

| Variavel | Hex | Papel |
|---|---|---|
| `--aveia` | `#F7F0E6` | fundo principal |
| `--manteiga` | `#EFE5D3` | superficies claras |
| `--linho` | `#DDD0BC` | bordas e divisores |
| `--taupe` | `#7E6654` | texto secundario |
| `--creme-rosa` | `#E8D5C4` | destaque suave |
| `--argila` | `#B8845A` | acento quente |
| `--mel` | `#C8923A` | assinatura premium |
| `--cacau` | `#7A4E38` | CTA principal |
| `--espresso` | `#3A2418` | texto principal e fundos escuros |
| `--sage` | `#A8B89A` | equilibrio frio e estado positivo |

## 3. Fontes

| Fonte | Uso |
|---|---|
| Playfair Display | titulos e marca |
| Jost | corpo, labels, navegacao e botoes |
| Cormorant Garamond | ornamentos, subtitulos e precos |

## 4. Regras visuais
- evitar branco puro como fundo base
- manter contraste sob controle em `--taupe`, `--argila` e `--linho`
- priorizar composicao continua em vez de excesso de caixas
- manter a home mobile coerente com o desktop
- a home mobile atual favorece grids/cards estaveis em vez de dock fixo e carrossel persistente
- textos auxiliares pequenos em colunas laterais devem usar algum detalhe de apoio discreto, como linha vertical ou divisor curto

## 5. Estado atual

- identidade atual baseada na paleta quente do projeto
- icones locais em SVG
- tipografia carregada via `next/font`
- direcao da home mais homogenea entre desktop e mobile, com refinamento continuo em producao

## 6. Paletas globais

O site agora trabalha com paletas fechadas selecionadas no admin:

- `classico`
- `brisa-fria`
- `terracota-editorial`
- `savia-dourada`
- `neblina-mineral`

Regras:
- as paletas trocam CSS variables globais e tokens semanticos de superficie
- layout e comportamento visual continuam no codigo
- o admin nao escolhe cor livre por secao ou item

Cobertura atual:
- fundo base e glows globais
- navbar e navbar em scroll
- overlay do menu mobile
- hero e paines auxiliares
- cards, badges, botoes e sombras principais
- footer e secoes escuras
- login admin e wrappers institucionais
- toasts, tabelas/admin notices e barras fixas do admin
- catalogos publicos, detalhe de produto, contato, blog, checklists e pagina Sobre
