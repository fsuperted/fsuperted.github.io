# FT. — site pessoal de Fernando Ted

HTML5 + CSS3 + JavaScript puro. Sem framework, sem build, sem banco de dados, sem custo.
Hospedagem gratuita no **GitHub Pages**.

## Estrutura

```
index.html            Início (tela de entrada + destaques + recentes)
foto-do-dia.html      Foto de hoje + arquivo com ampliação (lightbox)
videos.html           Vídeo em destaque + lista
textos.html           Blog: filtros por categoria + busca
texto.html            Leitura de um texto (texto.html?t=slug)
links.html            Achados, com filtro por tipo
sobre.html            Sobre você
404.html              Página de erro

dados/                ← É AQUI QUE VOCÊ EDITA O CONTEÚDO
  site.js             nome, tela de entrada, redes, texto do "Sobre"
  fotos.js            foto do dia
  videos.js           vídeos (YouTube, Vimeo ou .mp4)
  textos.js           lista de textos e categorias
  links.js            achados
conteudo/textos/      um arquivo .md por texto
assets/css/estilo.css visual (cores e fontes no topo, em :root)
assets/js/app.js      lógica (não precisa mexer)
assets/img/           imagens
```

## Publicar no dia a dia

**Foto do dia** — salve o JPG em `assets/img/fotos/` (lado maior ~1800 px, qualidade ~80)
e adicione um bloco no topo de `dados/fotos.js`.

**Texto novo** — crie `conteudo/textos/meu-texto.md` e adicione em `dados/textos.js`:
```js
{ slug: "meu-texto", titulo: "...", resumo: "...", categoria: "Política", data: "2026-10-20" },
```
O `slug` precisa ser igual ao nome do arquivo `.md`. Para uma nova categoria, inclua o nome em `FT.categorias`.

**Vídeo** — prefira subir no YouTube (ou Vimeo) e usar só o ID. Arquivos `.mp4` no repositório
funcionam, mas o GitHub recusa arquivos acima de 100 MB e o Pages fica pesado com vídeos grandes.

**Link** — adicione no topo de `dados/links.js`. `destaque: true` deixa o card mais largo.

**Tela de entrada conforme o clima** — com `hero.tipo: "clima"` (o padrão), o fundo muda conforme
a hora e o tempo em Florianópolis: dia ou noite, com sol, nublado ou chuva. Coloque as seis fotos em
`assets/img/hero/` com os nomes listados em `hero.clima.imagens` (ideal: 2400 px de largura, JPG
abaixo de 400 KB). Enquanto uma foto não existir, aparece um degradê no tom daquele clima.

**Tela de entrada em vídeo** — em `dados/site.js`, mude `hero.tipo` para `"video"` e aponte
`hero.video` para um `.mp4` curto, sem áudio, de preferência abaixo de 8 MB.

Dá para fazer tudo isso pelo próprio site do GitHub (botão **Add file → Upload files** e o editor
de texto), inclusive pelo celular.

## Publicar no GitHub Pages (uma vez)

1. Crie um repositório público chamado **`seu-usuario.github.io`** (assim o endereço fica
   `https://seu-usuario.github.io`). Qualquer outro nome também funciona, o site fica em
   `https://seu-usuario.github.io/nome-do-repo/`.
2. Envie todos os arquivos desta pasta para a raiz do repositório (incluindo o arquivo oculto `.nojekyll`).
3. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.
4. Em um ou dois minutos o site está no ar. Atualize `url` em `dados/site.js`.

Domínio próprio é opcional (e é o único item que teria custo, o registro do domínio).

## Testar no computador

Os textos `.md` são carregados via `fetch`, que o navegador bloqueia ao abrir arquivos com
duplo clique (`file://`). Rode um servidor local na pasta do site:

```
python3 -m http.server 8000
```
e abra http://localhost:8000. (No VS Code, a extensão *Live Server* faz o mesmo.)

## Antes de publicar

- Troque as imagens de exemplo em `assets/img/` pelas suas (inclusive `hero.jpg` e `og.jpg`,
  a imagem que aparece ao compartilhar o link — 1200×630).
- Os vídeos de exemplo usam um ID público de teste do YouTube; troque pelos seus.
- Os cinco textos em `conteudo/textos/` são exemplos.
- Ajuste redes sociais e e-mail em `dados/site.js`.
