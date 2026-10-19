/* =========================================================
   CONFIGURAÇÃO GERAL DO SITE
   Edite à vontade. Tudo aqui é texto simples.
   ========================================================= */
window.FT = window.FT || {};

FT.site = {
  nome: "Fernando Ted",
  sigla: "FT",
  descricao: "Fotos, vídeos, ideias e achados — um caderno aberto.",
  url: "https://SEU-USUARIO.github.io",   // troque depois de publicar
  cidade: "Florianópolis, SC",

  /* Tela de entrada.
     tipo: "imagem" ou "video".
     Para vídeo, use um .mp4 curto (ideal < 8 MB, sem áudio) e mantenha a
     imagem como "poster" (aparece enquanto o vídeo carrega e em conexões lentas). */
  hero: {
    tipo: "imagem",
    imagem: "assets/img/hero.jpg",
    video: "",                       // ex.: "assets/video/hero.mp4"
    titulo: ["Fernando", "Ted"],     // cada item vira uma linha
    subtitulo: "Fotos, vídeos, ideias e achados — um caderno aberto."
  },

  redes: [
    { nome: "Instagram", url: "https://instagram.com/" },
    { nome: "YouTube",   url: "https://youtube.com/" },
    { nome: "GitHub",    url: "https://github.com/" },
    { nome: "E-mail",    url: "mailto:voce@exemplo.com" }
  ],

  sobre: {
    destaque: "Sou Fernando. Este é meu caderno aberto — um lugar para guardar o que vejo, penso e encontro. Sem pretensão profissional, mas com cuidado.",
    paragrafos: [
      "Moro em Florianópolis, trabalho com desenvolvimento web e gosto de coisas feitas à mão: código escrito sem pressa, fotos tiradas no caminho, textos que demoram a ficar prontos.",
      "Aqui publico um registro diário em fotografia, vídeos curtos feitos por pura vontade de filmar, ensaios sobre política, sociedade e tecnologia, e links que encontrei e acho que valem o seu tempo."
    ]
  }
};
