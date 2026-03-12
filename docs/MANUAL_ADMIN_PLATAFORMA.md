# Manual do Admin - Plataforma Eliane Marques

**Versao:** 1.0  
**Data:** 12/03/2026  
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

### Como entrar
1. Acesse a tela de login.
2. Digite a senha administrativa.
3. Clique em `Entrar no painel`.

### Observacoes importantes
- o painel nao possui usuario e senha separados; o acesso atual e feito por senha unica de admin
- existe rate limit de seguranca no login
- se houver muitas tentativas erradas, o sistema bloqueia temporariamente novas tentativas

---

## 3. Menu do painel

As secoes disponiveis hoje sao:

- `Dashboard`
- `Produtos`
- `Blog`
- `Checklists`
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

## 8. Configuracao

A secao `Configuracao` controla informacoes globais do site.

### Campos atuais
- `WhatsApp (com DDD)`
- `Mensagem padrao WhatsApp`
- `Email de contato`
- `Titulo Hero (Home)`
- `Subtitulo Hero (Home)`
- `Nome da marca`
- `Instagram URL`

### Quando usar
- trocar numero de WhatsApp
- ajustar a mensagem padrao de atendimento
- alterar textos principais da home
- atualizar dados institucionais da marca

### Cuidado
- alteracoes aqui impactam varias paginas ao mesmo tempo
- revise URLs e numero de WhatsApp antes de salvar

---

## 9. Upload de imagens

Uploads sao usados hoje em:

- produtos
- artigos do blog

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

### Limite
- ate 5 MB por arquivo

### Se o upload falhar
Verifique:
- se o arquivo esta dentro do limite
- se o formato e suportado
- se voce ainda esta logado no admin

---

## 10. Busca e filtros no site

O painel admin nao possui hoje filtros complexos de operacao interna, mas o site publico ja permite filtros e busca em listagens.

Isso significa que:
- produtos bem titulados aparecem melhor nas buscas publicas
- slugs, titulos e descricoes influenciam encontrabilidade

---

## 11. Captura de leads

O site possui um formulario alternativo de contato alem do WhatsApp.

### Onde os leads aparecem
- no dashboard admin, como `leads recentes`

### O que e salvo
- nome
- email
- telefone opcional
- interesse
- mensagem

### Observacao
- neste momento, o lead fica salvo no banco
- ainda nao existe integracao automatica com CRM externo

---

## 12. Boas praticas de uso

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
- revise textos da home para evitar quebrar layout

---

## 13. Erros comuns e como resolver

### Nao consigo entrar no painel
- confirme se a senha esta correta
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

## 14. Fluxo recomendado de publicacao

### Produto novo
1. Criar produto
2. Subir imagem
3. Revisar `Slug`
4. Definir CTA
5. Marcar como ativo
6. Salvar
7. Testar no site publico

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

## 15. Limites atuais do painel

Hoje o painel:
- nao troca a senha de admin por interface
- nao envia leads automaticamente para CRM
- nao possui permissao por usuario
- nao possui historico/versionamento de conteudo

---

## 16. Suporte tecnico

Se algo nao funcionar como esperado, o ideal e repassar ao time tecnico:

- a rota onde ocorreu o problema
- o que voce tentou fazer
- se era produto, blog, checklist ou configuracao
- se apareceu mensagem de erro
- se o problema ocorreu no painel ou no site publico
