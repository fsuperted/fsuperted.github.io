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
     tipo: "clima", "imagem" ou "video".
     - "clima": o fundo muda conforme a hora (dia/noite) e a previsão do tempo
       no local abaixo (sol, nublado ou chuva). Usa a API gratuita Open-Meteo,
       sem chave. Se uma imagem não existir, aparece um degradê no tom do clima.
     - "imagem": sempre a mesma imagem.
     - "video": um .mp4 curto (ideal < 8 MB, sem áudio); a imagem vira "poster". */
  hero: {
    tipo: "clima",
    imagem: "assets/img/hero.jpg",   // reserva (e poster do vídeo)
    video: "",                       // ex.: "assets/video/hero.mp4"
    clima: {
      latitude: -27.5954,            // Florianópolis
      longitude: -48.5480,
      fuso: "America/Sao_Paulo",     // UTC-3
      imagens: {
        "dia-sol":       "assets/img/hero/dia-sol.jpg",
        "dia-nublado":   "assets/img/hero/dia-nublado.jpg",
        "dia-chuva":     "assets/img/hero/dia-chuva.jpg",
        "noite-limpa":   "assets/img/hero/noite-limpa.jpg",
        "noite-nublada": "assets/img/hero/noite-nublada.jpg",
        "noite-chuva":   "assets/img/hero/noite-chuva.jpg"
      }
    },
    titulo: ["Fernando Ted"],        // cada item vira uma linha
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
