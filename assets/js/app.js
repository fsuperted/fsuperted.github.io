/* =========================================================
   FT. — script único, sem dependências.
   Cada página declara <body data-page="..."> e este arquivo
   monta o conteúdo a partir de /dados/*.js
   ========================================================= */
(() => {
  "use strict";
  const FT = window.FT || {};
  const site = FT.site || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const page = document.body.dataset.page;
  document.documentElement.classList.remove("no-js");

  /* ---------- utilidades ---------- */
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MESES = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
  const MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const parseDate = iso => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const fmtDate = iso => { const d = parseDate(iso); return `${String(d.getDate()).padStart(2, "0")} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; };
  const norm = s => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const slugify = s => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const byDate = (a, b) => b.data.localeCompare(a.data);
  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
  const SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

  const fotos = (FT.fotos || []).slice().sort(byDate);
  const videos = (FT.videos || []).slice().sort(byDate);
  const textos = (FT.textos || []).slice().sort(byDate);
  const links = (FT.links || []).slice().sort(byDate);

  /* ---------- navegação + rodapé ---------- */
  const NAV = [
    ["foto", "foto-do-dia.html", "Foto do dia"],
    ["videos", "videos.html", "Vídeos"],
    ["textos", "textos.html", "Textos"],
    ["links", "links.html", "Links"],
    ["sobre", "sobre.html", "Sobre"]
  ];
  const current = page === "texto" ? "textos" : page;
  const sigla = esc(site.sigla || "FT");

  const header = document.createElement("header");
  header.className = "nav";
  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="Início">${sigla}<span class="dot">.</span></a>
    <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
    <ul class="nav-links" id="menu">
      ${NAV.map(([k, h, t]) => `<li><a href="${h}"${k === current ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}
    </ul>`;
  document.body.prepend(header);
  const skip = document.createElement("a");
  skip.className = "skip"; skip.href = "#conteudo"; skip.textContent = "Pular para o conteúdo";
  document.body.prepend(skip);

  const toggle = $(".nav-toggle", header);
  const setMenu = open => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  $$(".nav-links a", header).forEach(a => a.addEventListener("click", () => setMenu(false)));
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `<div class="wrap">
      <div class="footer-top">
        <p class="sign">${sigla}<span class="dot">.</span></p>
        <nav aria-label="Rodapé">
          ${NAV.map(([, h, t]) => `<a href="${h}">${t}</a>`).join("")}
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${esc(site.nome || "")} · ${esc(site.cidade || "")}</span>
        <span>${(site.redes || []).map(r => `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.nome)}</a>`).join(" · ")}</span>
      </div>
    </div>`;
  document.body.append(footer);

  /* ---------- revelar ao rolar ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" })
    : null;
  const reveal = (root = document) => $$(".reveal:not(.in)", root).forEach((el, i) => {
    if (!io) return el.classList.add("in");
    el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    io.observe(el);
  });

  /* ---------- player de vídeo (modal) ---------- */
  const embedHTML = (v, autoplay = true) => {
    const ap = autoplay ? 1 : 0;
    if (v.youtube) return `<iframe src="https://www.youtube-nocookie.com/embed/${esc(v.youtube)}?autoplay=${ap}&rel=0&modestbranding=1" title="${esc(v.titulo)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    if (v.vimeo) return `<iframe src="https://player.vimeo.com/video/${esc(v.vimeo)}?autoplay=${ap}&dnt=1" title="${esc(v.titulo)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    if (v.arquivo) return `<video src="${esc(v.arquivo)}" poster="${esc(v.capa || "")}" controls playsinline ${autoplay ? "autoplay" : ""}></video>`;
    return "";
  };
  let modal;
  const openVideo = v => {
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true");
      modal.innerHTML = `<button class="lb-btn lb-close" aria-label="Fechar">✕</button><div class="frame"></div>`;
      document.body.append(modal);
      const close = () => { modal.classList.remove("open"); $(".frame", modal).innerHTML = ""; document.body.style.overflow = ""; modal._ret?.focus(); };
      modal._close = close;
      $(".lb-close", modal).addEventListener("click", close);
      modal.addEventListener("click", e => { if (e.target === modal) close(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
    }
    modal._ret = document.activeElement;
    modal.setAttribute("aria-label", v.titulo);
    $(".frame", modal).innerHTML = embedHTML(v);
    modal.classList.add("open"); document.body.style.overflow = "hidden";
    $(".lb-close", modal).focus();
  };

  /* ---------- Markdown mínimo ---------- */
  const inline = s => esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|\W)_([^_\n]+)_(?=\W|$)/g, "$1<em>$2</em>");
  const markdown = src => {
    const lines = src.replace(/\r\n?/g, "\n").split("\n");
    const out = []; let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) { i++; continue; }
      if (/^```/.test(l)) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`); continue; }
      let m;
      if ((m = l.match(/^(#{1,4})\s+(.*)/))) { const n = Math.max(2, m[1].length); out.push(`<h${n}>${inline(m[2])}</h${n}>`); i++; continue; }
      if (/^(-{3,}|\*{3,})\s*$/.test(l)) { out.push("<hr>"); i++; continue; }
      if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, "")); out.push(`<blockquote><p>${inline(buf.join(" "))}</p></blockquote>`); continue; }
      if (/^\s*[-*]\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) buf.push(`<li>${inline(lines[i++].replace(/^\s*[-*]\s+/, ""))}</li>`); out.push(`<ul>${buf.join("")}</ul>`); continue; }
      if (/^\s*\d+\.\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) buf.push(`<li>${inline(lines[i++].replace(/^\s*\d+\.\s+/, ""))}</li>`); out.push(`<ol>${buf.join("")}</ol>`); continue; }
      if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(l)) { out.push(inline(l)); i++; continue; }
      const buf = []; while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>|```|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) buf.push(lines[i++]);
      out.push(`<p>${inline(buf.join(" "))}</p>`);
    }
    return out.join("\n");
  };

  /* ---------- componentes ---------- */
  const postCard = (t, featured = false, q = "") => {
    const hl = s => q ? esc(s).replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>") : esc(s);
    return `<a class="card post-card reveal${featured ? " featured" : ""}" href="texto.html?t=${encodeURIComponent(t.slug)}">
      <div class="meta-row"><span class="eyebrow">${esc(t.categoria)}</span><span class="meta">${fmtDate(t.data)}${t._min ? ` · ${t._min} min` : ""}</span></div>
      <h3 class="h3">${hl(t.titulo)}</h3>
      <p>${hl(t.resumo)}</p>
    </a>`;
  };
  const rowItem = t => `<li class="reveal"><a href="texto.html?t=${encodeURIComponent(t.slug)}"><span class="h3">${esc(t.titulo)}</span><span class="meta">${esc(t.categoria)} · ${fmtDate(t.data)}</span></a></li>`;

  /* tempo de leitura: tenta ler o .md (funciona online/servidor local) */
  const mdCache = {};
  const loadMd = slug => mdCache[slug] ||= fetch(`conteudo/textos/${slug}.md`).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); });
  const readMinutes = md => Math.max(1, Math.round(md.split(/\s+/).length / 200));

  /* =========================================================
     PÁGINAS
     ========================================================= */
  const pages = {};

  /* ---------- Início ---------- */
  pages.home = () => {
    const h = site.hero || {};
    const hero = $("#hero");
    const media = h.tipo === "video" && h.video
      ? `<video src="${esc(h.video)}" poster="${esc(h.imagem)}" autoplay muted loop playsinline aria-hidden="true"></video>`
      : `<img src="${esc(h.imagem)}" alt="" fetchpriority="high">`;
    const linhas = h.titulo || [site.nome];
    hero.innerHTML = `
      <div class="hero-media">${media}</div>
      <div class="wrap hero-inner">
        <h1 class="hero-title">${linhas.map((l, i) => `<span>${esc(l)}${i === linhas.length - 1 ? '<i class="sq" aria-hidden="true"></i>' : ""}</span>`).join("")}</h1>
        <p class="hero-sub">${esc(h.subtitulo || "")}</p>
      </div>
      <span class="hero-scroll" aria-hidden="true">Role</span>`;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) $("video", hero)?.pause();

    const f = fotos[0], t = textos[0], v = videos[0];
    $("#bento").innerHTML = `
      ${f ? `<a class="card card-media b-photo reveal" href="foto-do-dia.html">
        <img src="${esc(f.arquivo)}" alt="${esc(f.titulo)}" loading="lazy">
        <div class="card-body"><p class="eyebrow">Foto do dia</p><h2 class="h2">${esc(f.titulo)}</h2></div></a>` : ""}
      ${t ? `<a class="card b-text reveal" href="texto.html?t=${encodeURIComponent(t.slug)}">
        <p class="eyebrow">Último texto · ${esc(t.categoria)}</p>
        <h2 class="h2" style="margin-top:28px">${esc(t.titulo)}</h2><p style="font-size:19px">${esc(t.resumo)}</p></a>` : ""}
      ${v ? `<a class="card card-media b-video reveal" href="videos.html">
        <img src="${esc(v.capa)}" alt="" loading="lazy"><span class="play">${PLAY}</span>
        <div class="card-body"><p class="eyebrow" style="font-size:11px">Vídeo</p><h3 class="h3" style="font-size:22px">${esc(v.titulo)}</h3></div></a>` : ""}
      <a class="card b-links reveal" href="links.html">
        <p class="eyebrow">Achados</p>
        <div><span class="big">${links.length}</span><p>links que valem seu tempo →</p></div></a>
      <div class="card b-topics reveal">
        <p class="eyebrow">Escrevendo sobre</p>
        <h2 class="h2">${(FT.categorias || []).map(c => `<a href="textos.html?c=${encodeURIComponent(slugify(c))}" style="white-space:nowrap">${esc(c)}</a>`).join(' <span class="dot">·</span> ')}</h2>
      </div>
      <a class="card b-about reveal" href="sobre.html"><h3 class="h3">Quem<br>escreve? →</h3></a>`;
    $("#recentes").innerHTML = textos.slice(0, 5).map(rowItem).join("");
  };

  /* ---------- Foto do dia ---------- */
  pages.foto = () => {
    if (!fotos.length) return;
    const f = fotos[0], d = parseDate(f.data);
    $("#hoje").innerHTML = `
      <figure class="reveal" data-i="0" tabindex="0" role="button" aria-label="Ampliar foto: ${esc(f.titulo)}"><img src="${esc(f.arquivo)}" alt="${esc(f.titulo)}"></figure>
      <div class="info reveal">
        <div class="date-big">${String(d.getDate()).padStart(2, "0")}<small>${MESES_LONGOS[d.getMonth()]} ${d.getFullYear()}</small></div>
        <h2 class="h2" style="margin-top:40px">${esc(f.titulo)}</h2>
        <p class="lead" style="margin-top:14px">${esc(f.legenda || "")}</p>
        ${f.local ? `<p class="meta" style="margin-top:18px">📍 ${esc(f.local)}</p>` : ""}
      </div>`;
    $("#arquivo").innerHTML = fotos.slice(1).map((p, i) => `
      <button class="thumb reveal" data-i="${i + 1}" aria-label="Ampliar: ${esc(p.titulo)}">
        <img src="${esc(p.arquivo)}" alt="${esc(p.titulo)}" loading="lazy">
        <span class="cap"><b>${esc(p.titulo)}</b><span>${fmtDate(p.data).replace(/ de \d{4}$/, "")}</span></span>
      </button>`).join("");
    $("#arquivo-count").textContent = `${fotos.length} fotos desde ${fmtDate(fotos[fotos.length - 1].data)}`;

    /* lightbox */
    const lb = document.createElement("div");
    lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
    lb.innerHTML = `<div class="stage"><img alt=""></div><div class="lb-cap"><h3 class="h3"></h3><p class="meta"></p></div>
      <button class="lb-btn lb-close" aria-label="Fechar">✕</button>
      <button class="lb-btn lb-prev" aria-label="Anterior">←</button>
      <button class="lb-btn lb-next" aria-label="Próxima">→</button>`;
    document.body.append(lb);
    let idx = 0, ret;
    const show = i => {
      idx = (i + fotos.length) % fotos.length; const p = fotos[idx];
      $("img", lb).src = p.arquivo; $("img", lb).alt = p.titulo;
      $(".h3", lb).textContent = p.titulo;
      $(".meta", lb).textContent = [fmtDate(p.data), p.local, p.legenda].filter(Boolean).join(" · ");
    };
    const open = i => { ret = document.activeElement; show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; $(".lb-close", lb).focus(); };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; ret?.focus(); };
    document.addEventListener("click", e => { const el = e.target.closest("[data-i]"); if (el) open(+el.dataset.i); });
    $("#hoje figure").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(0); } });
    $(".lb-close", lb).onclick = close;
    $(".lb-prev", lb).onclick = () => show(idx - 1);
    $(".lb-next", lb).onclick = () => show(idx + 1);
    lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("stage")) close(); });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1);
    });
    let x0 = null;
    lb.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
    lb.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });
  };

  /* ---------- Vídeos ---------- */
  pages.videos = () => {
    if (!videos.length) return;
    const v = videos[0], box = $("#destaque");
    box.innerHTML = `<img src="${esc(v.capa)}" alt="">
      <button class="poster-btn" aria-label="Assistir: ${esc(v.titulo)}"><span class="play play-lg">${PLAY}</span></button>
      <div class="vh-cap"><p class="eyebrow">Mais recente · ${esc(v.duracao || "")}</p><h2 class="h2">${esc(v.titulo)}</h2><p>${esc(v.descricao || "")}</p></div>`;
    $(".poster-btn", box).addEventListener("click", () => { box.innerHTML = embedHTML(v); });
    $("#lista").innerHTML = videos.slice(1).map((x, i) => `
      <button class="card vcard reveal" data-v="${i + 1}">
        <span class="vthumb"><img src="${esc(x.capa)}" alt="" loading="lazy"><span class="dur">${esc(x.duracao || "")}</span></span>
        <span class="vbody"><span class="h3" style="display:block">${esc(x.titulo)}</span><p>${esc(x.descricao || "")}</p></span>
      </button>`).join("");
    $("#lista").addEventListener("click", e => { const b = e.target.closest("[data-v]"); if (b) openVideo(videos[+b.dataset.v]); });
  };

  /* ---------- Textos (blog) ---------- */
  pages.textos = () => {
    const cats = FT.categorias || [...new Set(textos.map(t => t.categoria))];
    const params = new URLSearchParams(location.search);
    let cat = cats.find(c => slugify(c) === params.get("c")) || "Todos";
    let q = params.get("q") || "";
    const count = c => c === "Todos" ? textos.length : textos.filter(t => t.categoria === c).length;
    $("#filtros").innerHTML = ["Todos", ...cats].map(c => `<button class="chip" data-c="${esc(c)}" aria-pressed="${c === cat}">${esc(c)}<span class="n">${count(c)}</span></button>`).join("");
    const input = $("#busca"); input.value = q;
    $("#busca-ico").innerHTML = SEARCH;

    const render = () => {
      const nq = norm(q.trim());
      const list = textos.filter(t => (cat === "Todos" || t.categoria === cat) && (!nq || norm(`${t.titulo} ${t.resumo} ${t.categoria}`).includes(nq)));
      const featured = cat === "Todos" && !nq;
      $("#posts").innerHTML = list.length
        ? list.map((t, i) => postCard(t, featured && i === 0, q.trim())).join("")
        : `<p class="empty">Nenhum texto encontrado${q ? ` para “${esc(q)}”` : ""}.</p>`;
      $("#resultado").textContent = `${list.length} ${list.length === 1 ? "texto" : "textos"}`;
      reveal($("#posts"));
      const u = new URL(location); u.searchParams.delete("c"); u.searchParams.delete("q");
      if (cat !== "Todos") u.searchParams.set("c", slugify(cat)); if (q) u.searchParams.set("q", q);
      history.replaceState(null, "", u);
    };
    $("#filtros").addEventListener("click", e => {
      const b = e.target.closest("[data-c]"); if (!b) return;
      cat = b.dataset.c; $$(".chip").forEach(x => x.setAttribute("aria-pressed", x === b)); render();
    });
    let tmr; input.addEventListener("input", () => { clearTimeout(tmr); tmr = setTimeout(() => { q = input.value; render(); }, 120); });
    render();

    /* tempo de leitura assíncrono (silencioso se offline) */
    Promise.all(textos.map(t => loadMd(t.slug).then(md => t._min = readMinutes(md)).catch(() => {}))).then(() => {
      if (textos.some(t => t._min)) render();
    });
  };

  /* ---------- Texto individual ---------- */
  pages.texto = () => {
    const slug = new URLSearchParams(location.search).get("t");
    const i = textos.findIndex(t => t.slug === slug);
    const t = textos[i];
    const head = $("#post-head"), body = $("#post-body");
    if (!t) {
      head.innerHTML = `<a class="back" href="textos.html">← Todos os textos</a><h1 class="h2">Texto não encontrado.</h1>`;
      body.innerHTML = ""; return;
    }
    document.title = `${t.titulo} — ${site.nome}`;
    $('meta[name="description"]')?.setAttribute("content", t.resumo);
    head.innerHTML = `<a class="back" href="textos.html">← Todos os textos</a>
      <a class="eyebrow" href="textos.html?c=${slugify(t.categoria)}" style="display:inline-block">${esc(t.categoria)}</a>
      <h1 class="h2">${esc(t.titulo)}</h1>
      <p class="lead">${esc(t.resumo)}</p>
      <div class="meta"><span>${fmtDate(t.data)}</span><span id="mins"></span><span>por ${esc(site.nome)}</span></div>`;
    body.innerHTML = `<p class="muted">Carregando…</p>`;
    loadMd(t.slug).then(md => {
      body.innerHTML = markdown(md);
      $("#mins").textContent = `· ${readMinutes(md)} min de leitura`;
    }).catch(() => {
      body.innerHTML = `<p class="muted">Não consegui carregar este texto. Se você abriu o arquivo direto do computador (file://), rode um servidor local — veja o LEIA-ME.</p>`;
    });

    const url = location.href;
    $("#share").innerHTML = `
      <a href="https://wa.me/?text=${encodeURIComponent(t.titulo + " " + url)}" target="_blank" rel="noopener">WhatsApp</a>
      <a href="https://bsky.app/intent/compose?text=${encodeURIComponent(t.titulo + " " + url)}" target="_blank" rel="noopener">Bluesky</a>
      <button type="button" id="copy">Copiar link</button>`;
    $("#copy").onclick = async e => { try { await navigator.clipboard.writeText(url); e.target.textContent = "Copiado ✓"; } catch { prompt("Copie o link:", url); } };

    const next = textos[i + 1] || textos[0];
    if (next && next !== t) $("#next").innerHTML = `<p class="eyebrow">Próxima leitura</p><div class="grid-2">${postCard(next)}${textos[i - 1] && textos[i - 1] !== next ? postCard(textos[i - 1]) : ""}</div>`;

    const bar = $(".progress");
    const prog = () => { const h = document.documentElement; bar.style.width = `${Math.min(100, (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100)}%`; };
    addEventListener("scroll", prog, { passive: true }); prog();
  };

  /* ---------- Links ---------- */
  pages.links = () => {
    const cats = [...new Set(links.map(l => l.categoria))];
    let cat = "Todos";
    $("#filtros").innerHTML = ["Todos", ...cats].map(c => `<button class="chip" data-c="${esc(c)}" aria-pressed="${c === cat}">${esc(c)}</button>`).join("");
    const render = () => {
      const list = links.filter(l => cat === "Todos" || l.categoria === cat);
      $("#links").innerHTML = list.map(l => `
        <a class="card link-card reveal${l.destaque && cat === "Todos" ? " wide" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener">
          <div class="meta-row"><span class="eyebrow">${esc(l.categoria)}</span><span class="src">${esc(l.fonte || new URL(l.url).hostname.replace("www.", ""))} ↗</span></div>
          <h3 class="h3">${esc(l.titulo)}</h3>
          <p>${esc(l.descricao || "")}</p>
        </a>`).join("");
      reveal($("#links"));
    };
    $("#filtros").addEventListener("click", e => {
      const b = e.target.closest("[data-c]"); if (!b) return;
      cat = b.dataset.c; $$(".chip").forEach(x => x.setAttribute("aria-pressed", x === b)); render();
    });
    render();
  };

  /* ---------- Sobre ---------- */
  pages.sobre = () => {
    const s = site.sobre || {};
    $("#sobre").innerHTML = `
      <div class="reveal">
        <p class="big">${esc(s.destaque || "")}</p>
        <div class="more">${(s.paragrafos || []).map(p => `<p>${esc(p)}</p>`).join("")}</div>
        <div class="socials">${(site.redes || []).map(r => `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.nome)} ↗</a>`).join("")}</div>
      </div>
      <div class="pillars">
        <a class="card reveal" href="foto-do-dia.html"><h3 class="h3">Foto do dia</h3><p>Um registro diário${fotos.length ? `, desde ${parseDate(fotos[fotos.length - 1].data).getFullYear()}` : ""}.</p></a>
        <a class="card reveal" href="videos.html"><h3 class="h3">Vídeos curtos</h3><p>Experimentos visuais sem roteiro.</p></a>
        <a class="card reveal" href="textos.html"><h3 class="h3">Ensaios</h3><p>${esc((FT.categorias || []).join(", ").replace(/, ([^,]*)$/, " e $1"))}.</p></a>
        <a class="card reveal" href="links.html"><h3 class="h3">Curadoria</h3><p>Links que valem compartilhar.</p></a>
      </div>`;
  };

  (pages[page] || (() => {}))();
  reveal();
})();
