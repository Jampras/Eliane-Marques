# Design Tokens - Eliane Marques

Documento de referencia rapida para o sistema visual atual.

## 1. Fonte de verdade
- tokens visuais: `app/globals.css`
- mapeamento Tailwind: `tailwind.config.js`
- fontes principais: `app/layout.tsx`
- icones externos: `components/shared/MaterialSymbolsStylesheet.tsx`

Nao altere cores globais em varios componentes ao mesmo tempo. Ajuste primeiro `globals.css`.

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

## 3. Tokens semanticos

```css
--color-bg: var(--aveia);
--color-surface: var(--manteiga);
--color-primary: var(--cacau);
--color-primary-hover: var(--espresso);
--color-primary-light: var(--sage);
--color-accent: var(--creme-rosa);
--color-accent-soft: var(--manteiga);
--color-accent-warm: var(--argila);
--color-gold: var(--mel);
--color-text-1: var(--espresso);
--color-text-2: var(--taupe);
--color-text-muted: var(--taupe);
--color-border: var(--linho);
--color-border-soft: rgba(196, 176, 154, 0.32);
```

## 4. Fontes

Fontes principais carregadas com `next/font`:

| Fonte | Uso |
|---|---|
| Playfair Display | titulos e marca |
| Jost | corpo, labels, navegacao e botoes |
| Cormorant Garamond | ornamentos, subtitulos e precos |

Fonte externa residual:

| Fonte | Uso |
|---|---|
| Material Symbols Outlined | icones de interface |

## 5. Classes Tailwind principais

| Token | Classe util |
|---|---|
| `--color-bg` | `bg-bg` |
| `--color-surface` | `bg-surface` |
| `--color-primary` | `bg-primary`, `text-primary`, `border-primary` |
| `--color-text-1` | `text-text-1`, `text-text-primary` |
| `--color-text-2` | `text-text-2`, `text-text-secondary` |
| `--color-text-muted` | `text-text-muted` |
| `--color-border` | `border-border` |
| `--color-border-soft` | `border-border-soft` |

## 6. Tipografia e escala
- labels pequenas: evitar abaixo de `9px`
- corpo padrao: `12px` a `15px`
- titulos: Playfair Display com `line-height` curto
- uppercase: `letter-spacing` alto, normalmente entre `0.16em` e `0.22em`

## 7. Componentes-base
- `Button.tsx`
- `Badge.tsx`
- `Card.tsx`
- `Container.tsx`
- `Section.tsx`
- `Typography.tsx`
- `ToastProvider.tsx`

## 8. Texturas e efeitos
- background com grain suave em `body::after`
- `fade-up` como animacao padrao de entrada
- `nav-underline` para links da navbar
- sombras suaves, sem glassmorphism

## 9. Regras de manutencao
- nao usar branco puro como fundo base
- nao criar nova cor sem necessidade real
- nao quebrar a hierarquia de fontes atual
- nao reintroduzir dark mode generico
- validar contraste ao mudar `--taupe`, `--argila` e `--linho`

## 10. Estado atual

Atualizado para refletir:
- contraste revisado
- fontes via `next/font`
- `Material Symbols` com preload e injecao client-side
- loading e toasts alinhados ao sistema visual
- identidade atual baseada na paleta quente do projeto
