# Manual do Admin - Plataforma Eliane Marques

**Versao:** 1.2  
**Data:** 19/03/2026  
**Publico:** administradores de conteudo e operacao comercial

---

## 1. Objetivo

Este documento explica como usar o painel administrativo do site Eliane Marques para:

- acessar o backoffice
- cadastrar e editar produtos
- publicar artigos no blog
- criar checklists
- atualizar configuracoes globais do site
- enviar imagens
- configurar o destino dos botoes de conversao

---

## 2. Acesso ao painel

### URL
- producao: `https://v03-pink.vercel.app/admin/login`
- acesso recomendado: abrir diretamente `/admin/login`

### Como entrar
1. Acesse a tela de login.
2. Clique em `Entrar com Google`.
3. Use uma conta Google autorizada para administracao.

### Observacoes importantes
- o painel usa Google OAuth com whitelist de emails
- apenas contas explicitamente autorizadas entram no backoffice
- existe rate limit de seguranca no login
- se houver muitas tentativas seguidas, o sistema bloqueia temporariamente novas tentativas

---

## 3. Menu do painel

As secoes disponiveis hoje sao:

- `Dashboard`
- `Home`
- `Produtos`
- `Blog`
- `Checklists`
- `Sobre`
- `Configuracao`

---

## 4. Dashboard

O dashboard mostra um resumo operacional do ecossistema.

### O que pode aparecer
- total de produtos
- total de artigos
- total de checklists
- metricas comerciais
- produtos com mais cliques
- leads recentes

### Para que serve
- acompanhar atividade geral do site
- identificar quais produtos estao recebendo mais interesse
- acompanhar contatos enviados pelo formulario alternativo

---

## 5. Produtos

Produtos controlam:

- servicos de consultoria
- cursos
- ebooks
- materiais do tipo checklist

### Como criar um produto
1. Entre em `Produtos`.
2. Clique em `Novo produto`.
3. Preencha os campos.
4. Clique em `Salvar`.

### Campos do formulario

#### Basicos
- `Titulo`
- `Slug (URL)`
- `Tipo`
  - `Consultoria`
  - `Curso`
  - `Ebook`
  - `Checklist`
- `Publico`
  - `Pessoas`
  - `Empresas`
  - `Ambos`
- `Preco (BRL)`
- `Imagem de capa`
- `Descricao curta`
- `Descricao longa (Markdown)`

#### Estado do produto
- `Produto ativo no site`
  - ligado: o produto pode aparecer publicamente
  - desligado: o produto fica fora das listagens publicas

#### Destaque comercial
- `Destacar nas listagens`
  - usado para dar prioridade visual em listagens e secoes comerciais
- `Marcar como mais vendido`
  - usado como destaque comercial adicional

### Destino do CTA

Cada produto pode escolher para onde o botao principal vai levar a usuaria.

#### Opcao 1 - WhatsApp
Use quando a venda ou atendimento sera manual.

Campos:
- `Destino do CTA = WhatsApp`
- `Texto do CTA (opcional)`
- `Mensagem de WhatsApp`

Exemplo de mensagem:
```text
Ola! Gostaria de saber mais sobre {productTitle}.
```

#### Opcao 2 - Link externo
Use para Hotmart, checkout proprio ou qualquer pagina externa.

Campos:
- `Destino do CTA = Link externo`
- `Texto do CTA (opcional)`
- `Link externo do CTA`

Exemplo:
```text
https://checkout.hotmart.com/...
```

### Regras praticas
- se o produto for de venda direta, prefira `Link externo`
- se o produto exigir conversa antes da compra, prefira `WhatsApp`
- sempre revise o `Slug`, porque ele define a URL publica
- use imagem de capa com boa qualidade e proporcao consistente

### Edicao e exclusao
- para editar, entre no item e clique em `Editar`
- para excluir, use o botao `Excluir Produto`
- exclusao remove o item do painel e do site

---

## 6. Blog

A secao `Blog` controla os artigos publicados em `/conteudos`.

### Como criar um artigo
1. Entre em `Blog`.
2. Clique em `Novo artigo`.
3. Preencha:
   - `Titulo`
   - `Slug`
   - `Imagem de capa`
   - `Resumo / Excerpt`
   - `Conteudo completo (Markdown)`
4. Marque `Publicar imediatamente` se quiser deixar visivel no site.
5. Salve.

### Observacoes
- se `Publicar imediatamente` estiver desmarcado, o artigo fica salvo sem aparecer publicamente
- o conteudo longo aceita Markdown
- a imagem pode ser enviada por upload, igual ao fluxo de produtos

### Boas praticas
- use titulos claros e objetivos
- mantenha o resumo curto e comercial
- revise o `Slug` antes de publicar

---

## 7. Checklists

A secao `Checklists` controla listas interativas que aparecem no site.

### Como criar uma checklist
1. Entre em `Checklists`.
2. Clique em `Novo checklist`.
3. Preencha:
   - `Titulo`
   - `Slug`
   - `Descricao`
4. Adicione os itens da checklist.
5. Se quiser exibir no site, marque `Publicar no site`.
6. Salve.

### Itens da checklist

Cada item pode ter:
- `Label do item`
- `Link recomendado (opcional)`

### Ordenacao dos itens
- use as setas para mover para cima ou para baixo
- a ordem salva no painel e a ordem exibida no site

### Exclusao
- cada checklist pode ser removida pelo botao `Excluir Checklist`

---

## 8. Home

A secao `Home` controla o conteudo institucional da pagina inicial.

### O que pode ser editado
- hero principal
- imagem lateral do hero
- CTA principal e CTA secundario
- linha de confianca do hero
- cards da secao `Para quem e`
- comparativo da secao `Leitura de valor`
- etapas da secao `Metodo`
- perguntas frequentes
- CTA final da home

### Imagens disponiveis na Home
- imagem lateral do hero
- imagem por card em `Para quem e`
- imagem por item em `Leitura de valor`
- imagem por etapa em `Metodo`

### O que nao e editado aqui
- layout visual
- animacoes
- cards de `Investimentos`
- cards de `Formatos`

Esses elementos continuam controlados pelo codigo para manter consistencia visual.

### Como usar
1. Entre em `Home`.
2. Ajuste os textos das secoes.
3. Atualize os cards e etapas, se necessario.
4. Salve.
5. Revise a pagina inicial publica.

### Observacao importante
- a imagem grande institucional continua podendo ser usada em `Sobre`
- a imagem lateral do hero da home agora e propria da secao `Home`
- se ela nao for definida, o site mostra uma mensagem orientando configurar no painel

---

## 9. Configuracao

A secao `Configuracao` controla informacoes globais do site.

Observacao:
- `Configuracao` e `Sobre` fazem parte do mesmo dominio institucional no sistema e seguem o mesmo fluxo de publicacao e revalidacao.

### Campos atuais
- `WhatsApp (com DDD)`
- `Mensagem padrao WhatsApp`
- `Email de contato`
- `Nome da marca`
- `Instagram URL`
- `Paleta global do site`

### Quando usar
- trocar numero de WhatsApp
- ajustar a mensagem padrao de atendimento
- atualizar dados institucionais da marca
- trocar a paleta visual global do site

### Cuidado
- alteracoes aqui impactam varias paginas ao mesmo tempo
- revise URLs e numero de WhatsApp antes de salvar
- a paleta e global: ela afeta paginas publicas e telas administrativas

### Paletas disponiveis
- `Classico`
- `Brisa Fria`
- `Terracota Editorial`
- `Savia Dourada`
- `Neblina Mineral`

---

## 10. Upload de imagens

Uploads sao usados hoje em:

- produtos
- artigos do blog
- pagina Sobre
- pagina Home

### Como funciona
1. Clique na area de upload.
2. Escolha um arquivo local.
3. Aguarde o envio.
4. O campo `coverImage` sera preenchido automaticamente com a URL final.

### Tipos aceitos
- JPEG
- PNG
- WebP
- AVIF
- GIF

---

## 11. Sobre

A secao `Sobre` controla a pagina institucional publica em `/sobre`.

Observacao:
- `Sobre` e `Configuracao` compartilham a mesma camada institucional no sistema. Isso reduz divergencia entre dados institucionais da marca e a pagina de apresentacao.

### O que pode ser editado
- hero principal
- imagem institucional
- introducao
- manifesto
- marcos de trajetoria
- especializacoes
- certificados, selos e credenciais
- CTA final

### Como usar
1. Entre em `Sobre`.
2. Preencha os textos principais.
3. Envie a imagem principal.
4. Adicione marcos, especializacoes e credenciais.
5. Clique em `Publicar pagina Sobre`.
6. Use o link `Abrir pagina publica` para revisar o resultado.

### Limite
- ate 5 MB por arquivo

### Se o upload falhar
Verifique:
- se o arquivo esta dentro do limite
- se o formato e suportado
- se voce ainda esta logado no admin

---

## 12. Busca e filtros no site

O painel admin nao possui hoje filtros complexos de operacao interna, mas o site publico ja permite filtros e busca em listagens.

Isso significa que:
- produtos bem titulados aparecem melhor nas buscas publicas
- slugs, titulos e descricoes influenciam encontrabilidade

---

## 13. Captura de leads

O site possui um formulario alternativo de contato alem do WhatsApp.

### Onde os leads aparecem
- no dashboard admin, como `leads recentes`

### O que e salvo
- nome
- email
- mensagem
- origem do formulario

### Observacao
- neste momento, o lead fica salvo no banco
- ainda nao existe integracao automatica com CRM externo

---

## 14. Boas praticas de uso

### Ao cadastrar produtos
- use titulos objetivos
- mantenha preco correto
- confira se o CTA esta no modo certo
- teste o link externo se usar Hotmart ou checkout

### Ao publicar blog
- revise o resumo
- valide o slug
- use imagem de capa com boa leitura

### Ao editar configuracoes
- altere com cuidado o WhatsApp e links sociais
- revise a paleta e os dados institucionais antes de salvar

### Ao editar a home
- prefira frases curtas e claras
- mantenha o hero objetivo
- use bullets curtos no comparativo
- revise se o CTA final continua coerente com a oferta

---

## 15. Erros comuns e como resolver

### Nao consigo entrar no painel
- confirme se esta usando uma conta Google autorizada
- evite muitas tentativas seguidas
- tente novamente apos alguns minutos se houver bloqueio

### A imagem nao aparece no site
- confirme se o upload terminou
- salve novamente o formulario
- verifique se o produto ou artigo esta publicado/ativo

### O produto nao aparece no site
- verifique se `Produto ativo no site` esta marcado
- confira se o tipo e o publico estao corretos
- confira se o slug nao conflita com outro item

### O botao nao vai para Hotmart
- abra o produto
- confira se `Destino do CTA` esta em `Link externo`
- revise o campo `Link externo do CTA`

### O artigo nao aparece no blog
- verifique se `Publicar imediatamente` esta marcado

### A checklist nao aparece
- verifique se `Publicar no site` esta marcado

---

## 16. Fluxo recomendado de publicacao

### Produto novo
1. Criar produto
2. Subir imagem
3. Revisar `Slug`
4. Definir CTA
5. Marcar como ativo
6. Salvar
7. Testar no site publico

### Ajuste da home
1. Editar a secao `Home`
2. Salvar
3. Revisar `/`
4. Se precisar trocar a imagem lateral do hero ou imagens dos cards, fazer isso na propria secao `Home`

### Artigo novo
1. Criar artigo
2. Subir imagem
3. Escrever resumo
4. Colar conteudo em Markdown
5. Marcar como publicado
6. Salvar
7. Revisar a pagina publica

### Checklist nova
1. Criar checklist
2. Adicionar itens
3. Revisar ordem
4. Marcar como publicada
5. Salvar
6. Testar no site

---

## 17. Limites atuais do painel

Hoje o painel:
- nao gerencia permissoes por usuario via interface
- nao envia leads automaticamente para CRM
- nao possui historico/versionamento de conteudo

---

## 18. Suporte tecnico

Se algo nao funcionar como esperado, o ideal e repassar ao time tecnico:

- a rota onde ocorreu o problema
- o que voce tentou fazer
- se era produto, blog, checklist ou configuracao
- se apareceu mensagem de erro
- se o problema ocorreu no painel ou no site publico
