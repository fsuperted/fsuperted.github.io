/* =========================================================
   TEXTOS (blog)
   Cada texto tem um arquivo Markdown em conteudo/textos/<slug>.md
   e um registro aqui (o mais recente primeiro).

   Markdown suportado: # títulos, **negrito**, *itálico*, [links](url),
   > citações, listas com - ou 1., `código`, imagens ![alt](url),
   linha --- e blocos de código com ```.
   ========================================================= */
window.FT = window.FT || {};

FT.categorias = ["Política", "Sociedade", "Tecnologia"];

FT.textos = [
  {
    slug: "o-algoritmo-virou-a-praca-publica",
    titulo: "O algoritmo virou a praça pública",
    resumo: "Quando a conversa coletiva depende de quem otimiza atenção, o debate muda de natureza.",
    categoria: "Tecnologia",
    data: "2026-10-12"
  },
  {
    slug: "cidade-para-quem",
    titulo: "Cidade para quem?",
    resumo: "Notas sobre calçadas, ônibus lotados e o direito de simplesmente estar na rua.",
    categoria: "Sociedade",
    data: "2026-10-05"
  },
  {
    slug: "polarizacao-e-cansaco",
    titulo: "Polarização e cansaço",
    resumo: "O esgotamento político talvez seja o sintoma mais subestimado do nosso tempo.",
    categoria: "Política",
    data: "2026-09-28"
  },
  {
    slug: "ia-autoria-e-o-prazer-de-fazer",
    titulo: "IA, autoria e o prazer de fazer",
    resumo: "Se a máquina escreve, por que continuo escrevendo? Uma resposta pessoal.",
    categoria: "Tecnologia",
    data: "2026-09-20"
  },
  {
    slug: "voto-e-memoria-curta",
    titulo: "Voto e memória curta",
    resumo: "Por que esquecemos tão rápido aquilo que nos indignou ontem?",
    categoria: "Política",
    data: "2026-09-10"
  }
];
