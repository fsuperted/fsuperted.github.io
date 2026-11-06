/* =========================================================
   BANNER DA TELA DE ENTRADA
   Título e subtítulo do banner, que mudam conforme o que você publica.

   AUTOMÁTICO (padrão): deixe "itens" vazio. O banner alterna entre a
   última foto, o último vídeo, o último texto e o último link publicados,
   começando pelo mais recente deles.

   ESCOLHIDO A DEDO: liste em "itens" o que deve aparecer, na ordem.
   Cada item aponta para algo já publicado em dados/*.js:

     { tipo: "texto", qual: "cidade-para-quem" }   → o slug do texto
     { tipo: "foto",  qual: "2026-10-17" }         → a data ou o título da foto
     { tipo: "video", qual: "Noite molhada" }      → a data ou o título do vídeo
     { tipo: "link",  qual: "https://www.are.na/" } → o endereço ou o título

   Em qualquer item dá para trocar o texto que aparece no banner:
     titulo:    "Outro título"
     subtitulo: "Outra frase de apoio"

   Também dá para criar um item livre, sem conteúdo publicado por trás:
     { rotulo: "Aviso", titulo: "Exposição no sábado", subtitulo: "...", link: "https://..." }

   Para um item sair sozinho depois de uma data, use ate: "2026-11-05"
   (ele aparece até esse dia, inclusive). Quando todos os itens
   escolhidos vencerem, o banner volta para o modo automático.
   ========================================================= */
window.FT = window.FT || {};

FT.banner = {
  itens: [],

  quantidade: 4,   // no modo automático, quantos tipos de conteúdo alternar (1 a 4)
  intervalo: 8     // segundos entre um e outro; 0 deixa parado no primeiro
};
