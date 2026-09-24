(() => {
'use strict';

/* =====================================================================
   UTILIDADES
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
};
const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const nf1 = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf0 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
const pct = v => nf1.format(v) + '%';
const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const raf = fn => (window.requestAnimationFrame || (f => setTimeout(f, 16)))(fn);
const reflow = n => void n.offsetWidth;

/* =====================================================================
   DATOS  ·  Todo lo marcado "CONFIRMAR" se puede reemplazar por tus cifras
   ===================================================================== */
// Imágenes propias: poné el archivo en /assets y la ruta acá, por ejemplo 'assets/altman.jpg'.
// Si queda en null se ve el recuadro gris.
const ASSETS = { altman: null };

// Instantáneas de participación de visitas web (Similarweb, "Gen AI website traffic share").
// CONFIRMAR: fechas aproximadas y valores exactos con tu fuente definitiva.
const SNAP = ['Ago 2025', 'Dic 2025', 'Ene 2026', 'Feb 2026', 'May 2026', 'Jun 2026', 'Jul 2026'];
const SHARE = {
  ChatGPT:    [73.3, 68.0, 64.5, 56.7, 52.7, 54.2, 55.5],
  Gemini:     [12.9, 18.2, 21.5, 25.4, 27.8, 26.5, 25.6],
  Claude:     [ 1.9,  2.0,  2.0,  6.0,  9.2,  9.5,  9.3],
  Grok:       [ 2.6,  2.9,  3.4,  3.7,  2.5,  2.5,  2.4],
  Copilot:    [ 2.0,  1.2,  1.1,  1.9,  2.0,  1.6,  1.6],
  DeepSeek:   [ 4.0,  3.9,  3.7,  3.4,  3.6,  3.4,  3.4],
  Perplexity: [ 2.0,  2.1,  2.0,  1.6,  1.1,  1.0,  0.9]
};
const NAMES = Object.keys(SHARE);

// Usuarios semanales de ChatGPT por año, en millones.
const YEAR_PTS = [
  { lab: '2022', v: 1,    conf: true, val: '≈ 1 M',   kind: 'Usuarios registrados', title: 'Lanzamiento',
    text: 'El 30 de noviembre sale ChatGPT como “research preview”. En cinco días supera el millón de usuarios registrados: todavía no es una cifra semanal.' },
  { lab: '2023', v: 100,  conf: true, val: '100 M',   kind: 'Usuarios semanales', title: 'Los primeros 100 millones',
    text: 'A principios de noviembre de 2023, menos de un año después del lanzamiento, ChatGPT llega a 100 millones de usuarios activos por semana.' },
  { lab: '2024', v: 300,  conf: true, val: '300 M',   kind: 'Usuarios semanales', title: 'Se triplica en un año',
    text: 'A fines de 2024 ya son unos 300 millones por semana. En febrero de 2025 llegan a 400 millones.' },
  { lab: '2025', v: 800,  conf: true, val: '800 M',   kind: 'Usuarios semanales', title: 'El año del gran salto',
    text: 'En octubre de 2025 Sam Altman habla de 800 millones semanales; en septiembre eran 700 millones.' },
  { lab: '2026', v: 1000, conf: true, val: '1.000 M', kind: 'Usuarios semanales', title: 'Mil millones por semana',
    text: 'En agosto de 2026 OpenAI confirma 1.000 millones de usuarios semanales, tras los 900 millones de febrero. Según The Information, la meta interna era llegar a fines de 2025.' }
];
// Solo hay dos cifras oficiales en 2026 (feb y ago). El resto es interpolación. CONFIRMAR con datos mensuales.
const MONTH_PTS = [
  { lab: 'Ene', v: 870,  conf: false, title: 'Enero', text: 'Sin cifra oficial. Estimado entre los 800 M de octubre de 2025 y los 900 M de febrero.' },
  { lab: 'Feb', v: 900,  conf: true,  title: 'Febrero', text: '27 de febrero: OpenAI informa más de 900 millones de usuarios semanales, junto con su ronda de financiamiento.' },
  { lab: 'Mar', v: 910,  conf: false, title: 'Marzo', text: 'Sin cifra oficial. Valor estimado uniendo los hitos de febrero y agosto.' },
  { lab: 'Abr', v: 930,  conf: false, title: 'Abril', text: 'Sin cifra oficial. Valor estimado uniendo los hitos de febrero y agosto.' },
  { lab: 'May', v: 950,  conf: false, title: 'Mayo', text: 'Sin cifra oficial. Valor estimado. En este mes la app superó 1.000 M de usuarios mensuales según Sensor Tower.' },
  { lab: 'Jun', v: 970,  conf: false, title: 'Junio', text: 'Sin cifra oficial. Valor estimado uniendo los hitos de febrero y agosto.' },
  { lab: 'Jul', v: 990,  conf: false, title: 'Julio', text: 'Sin cifra oficial. A fines de julio The Information reportó que ChatGPT estaba por llegar a los 1.000 M semanales.' },
  { lab: 'Ago', v: 1000, conf: true,  title: 'Agosto', text: '6 de agosto: primera confirmación formal de 1.000 millones de usuarios semanales de ChatGPT.' }
];

// Usos por categoría (NBER WP 34255, muestra 15/05/2024–26/06/2025). Orden = sentido horario desde las 6 en punto.
const USOS = [
  { k: 'guia', name: 'Guía práctica', v: 28.3, c: '#66bb63',
    txt: 'Consejos a medida: aprender un tema, armar un plan, resolver un problema cotidiano. Se mantuvo estable en torno al 29% durante todo el período.',
    subs: [['Tutoría y enseñanza', 10.2], ['Consejos “cómo hacer”', 8.5], ['Ideas creativas, salud y bienestar', 9.6, true]] },
  { k: 'busq', name: 'Búsqueda de información', v: 21.3, c: '#d24545',
    txt: 'El sustituto más directo de un buscador: datos sobre personas, actualidad, productos o recetas. Creció de 14% a 24% entre julio de 2024 y julio de 2025.', subs: null },
  { k: 'tec', name: 'Ayuda técnica', v: 7.5, c: '#ddc020',
    txt: 'Programación, cálculo y análisis de datos. Bajó de 12% a cerca de 5% entre julio de 2024 y julio de 2025; el estudio sugiere que el código migró a la API y a herramientas especializadas.',
    subs: [['Programación', 4.2], ['Cálculo matemático', 3.0], ['Análisis de datos', 0.4]] },
  { k: 'multi', name: 'Multimedia', v: 6.0, c: '#5f86bb',
    txt: 'Crear o analizar imágenes y otros medios. Pasó de 2% a algo más de 7%, con un salto en abril de 2025, cuando ChatGPT lanzó la generación de imágenes.', subs: null },
  { k: 'otro', name: 'Otro / desconocido', v: 4.6, c: '#c8802a',
    txt: 'Preguntas sobre el propio modelo, pedidos poco claros o que no encajan en las otras categorías.', subs: null },
  { k: 'auto', name: 'Autoexpresión', v: 4.3, c: '#7a35c4',
    txt: 'Charla casual, reflexión personal, relaciones y juegos de rol. Es la categoría más chica, pero la mejor valorada por los usuarios según el estudio. Conecta con el Núcleo 2.',
    subs: [['Relaciones y reflexión personal', 1.9], ['Juegos y juego de roles', 0.4], ['Saludos y charla casual', 2.0, true]] },
  { k: 'escr', name: 'Escritura', v: 28.1, c: '#d05aa4',
    txt: 'Es el uso más común en el trabajo: 40% de los mensajes laborales. Dos tercios de los pedidos consisten en modificar un texto propio (corregir, traducir, resumir) y no en escribir desde cero. Bajó de 36% a 24% entre julio de 2024 y julio de 2025.',
    subs: [['Editar o criticar textos', 10.6], ['Traducción', 4.5], ['Mensajes, resúmenes y ficción', 13.0, true]] }
];
const LEGEND_ORDER = ['escr', 'guia', 'busq', 'tec', 'multi', 'otro', 'auto'];

/* =====================================================================
   ÍCONOS / DECORACIÓN
   ===================================================================== */
const ICONS = {
  grok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="7.6"/><path d="M6.4 18.4 17.8 5.6"/></svg>',
  claude: (() => { let l = ''; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; l += `<line x1="${(12 + 3 * Math.sin(a)).toFixed(2)}" y1="${(12 - 3 * Math.cos(a)).toFixed(2)}" x2="${(12 + 10 * Math.sin(a)).toFixed(2)}" y2="${(12 - 10 * Math.cos(a)).toFixed(2)}"/>`; } return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">${l}</svg>`; })(),
  copilot: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3.5" y="5" width="11" height="11" rx="4" transform="rotate(-14 9 10.5)" opacity=".8"/><rect x="9.5" y="9" width="11" height="11" rx="4" transform="rotate(-14 15 14.5)"/></svg>',
  gemini: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5C12.9 8 16 11.1 22.5 12 16 12.9 12.9 16 12 22.5 11.1 16 8 12.9 1.5 12 8 11.1 11.1 8 12 1.5Z"/></svg>',
  perplexity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2.5v19M4.6 7.2 12 12l7.4-4.8M4.6 7.2v9.6l7.4 4.7 7.4-4.7V7.2L12 2.5z"/></svg>'
};
const IMG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5.5-5 4 3.6L16.5 14 20 17.5"/></svg>';

function logo(cls) {
  const svg = el('svg', { viewBox: '0 0 32 32', class: cls || 'logo', 'aria-hidden': 'true' });
  svg.style.color = '#fff';
  const g = el('g', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' }, svg);
  for (let i = 0; i < 6; i++) el('ellipse', { cx: 16, cy: 9.4, rx: 4.1, ry: 6.9, transform: `rotate(${i * 60} 16 16)` }, g);
  return svg;
}
function cluster(colors, seed) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const svg = el('svg', { viewBox: '0 0 64 64', width: 64, height: 64, 'aria-hidden': 'true' });
  for (let i = 0; i < 72; i++) {
    const a = rnd() * Math.PI * 2, d = Math.pow(rnd(), .7) * 29;
    el('circle', { cx: (32 + Math.cos(a) * d).toFixed(1), cy: (32 + Math.sin(a) * d).toFixed(1), r: Math.max(.5, 2.6 - d / 12 + rnd() * .4).toFixed(2), fill: colors[Math.floor(rnd() * colors.length)], opacity: (1 - d / 46).toFixed(2) }, svg);
  }
  el('circle', { cx: 32, cy: 32, r: 4.4, fill: colors[0] }, svg);
  return svg;
}

/* =====================================================================
   TOOLTIP
   ===================================================================== */
const tip = $('#tip');
function showTip(html, x, y) {
  tip.innerHTML = html; tip.classList.add('on');
  const r = tip.getBoundingClientRect();
  let tx = x - r.width / 2, ty = y - r.height - 14;
  if (ty < 8) ty = y + 26;
  tx = Math.max(8, Math.min(tx, innerWidth - r.width - 8));
  tip.style.transform = `translate(${tx}px,${ty}px)`;
}
const hideTip = () => tip.classList.remove('on');
const isMouse = e => !e.pointerType || e.pointerType === 'mouse' || e.pointerType === 'pen';
const swapPanel = (node, html) => { node.innerHTML = html; node.classList.remove('swap'); reflow(node); node.classList.add('swap'); };

/* =====================================================================
   PANTALLAS CON SELECTOR (¿Qué es ChatGPT?, ¿Qué es OpenAI?, Grok y otros)
   ===================================================================== */
const PICKERS = {
  chatgpt: {
    title: '¿Qué es<br>ChatGPT?',
    lead: 'ChatGPT es un modelo de lenguaje de inteligencia artificial desarrollado por OpenAI. Es un asistente conversacional que entiende el lenguaje natural y genera respuestas similares a las de una persona.',
    hint: ['Elegí una opción', 'Cada botón cambia la información de la izquierda.'],
    items: [
      { label: 'Conversa', title: 'Un asistente que conversa', text: 'Le escribís en tu propio idioma y responde en lenguaje natural. Puede seguir el hilo de la charla y ajustar la respuesta a lo que le pidas después.', slot: 'Recurso visual · a incorporar' },
      { label: 'Cómo funciona', title: 'Aprende a predecir texto', text: 'Primero se lo entrena con enormes cantidades de texto para que prediga la palabra siguiente. Después se lo ajusta para que sus respuestas sean útiles y seguras.', slot: 'Recurso visual · a incorporar' },
      { label: 'Qué hace', title: 'Mucho más que chatear', text: 'Redacta y corrige textos, explica temas, traduce, ayuda a programar, analiza imágenes y datos, genera imágenes y puede buscar en la web.', slot: 'Recurso visual · a incorporar' },
      { label: 'Modelos', title: 'Una familia de modelos', text: 'Desde el lanzamiento usó distintos modelos: GPT-3.5, GPT-4, GPT-4o, la serie o y GPT-5. Cada versión amplía lo que puede hacer.', slot: 'Recurso visual · a incorporar' }
    ]
  },
  openai: {
    title: '¿Qué es<br>OpenAI?',
    lead: 'OpenAI es una empresa de investigación y desarrollo de inteligencia artificial, fundada en 2015. Su objetivo declarado es desarrollar IA avanzada procurando que sus beneficios alcancen a toda la humanidad.',
    hint: ['Elegí una opción', 'Cada botón cambia la información de la izquierda.'],
    items: [
      { label: 'Sam Altman', title: 'Sam Altman', text: 'Cofundador y CEO de OpenAI. Antes presidió la aceleradora de startups Y Combinator.', slot: 'Foto de Sam Altman · a incorporar', asset: 'altman' },
      { label: 'Fundación', title: 'Fundada en 2015', text: 'Nació en diciembre de 2015 como laboratorio de investigación sin fines de lucro, impulsado por Sam Altman, Greg Brockman, Ilya Sutskever, Elon Musk y otros.', slot: 'Recurso visual · a incorporar' },
      { label: 'ChatGPT', title: 'El salto al público', text: 'El 30 de noviembre de 2022 lanzó ChatGPT como “research preview”. A los cinco días ya tenía más de un millón de usuarios registrados.', slot: 'Recurso visual · a incorporar' },
      { label: 'Misión', title: 'Una misión declarada', text: 'Que la inteligencia artificial general beneficie a toda la humanidad. Es la frase con la que la empresa resume su objetivo público.', slot: 'Recurso visual · a incorporar' }
    ]
  },
  grok: {
    title: 'Grok y otros<br>modelos',
    lead: 'ChatGPT no está solo. Cinco asistentes se reparten hoy el mismo terreno, cada uno apoyado en el ecosistema de la empresa que lo desarrolla.',
    hint: ['Elegí un asistente', 'Cada botón cambia la información de la izquierda.'],
    iconPick: true,
    items: [
      { icon: 'grok', label: 'Grok', title: 'Grok', text: 'IA desarrollada por xAI, integrada principalmente con X. Se caracteriza por respuestas conversacionales, acceso a información actual y un tono más informal.', meta: [['Desarrolla', 'xAI'], ['Ecosistema', 'X']], slot: 'Captura o video de Grok · a incorporar' },
      { icon: 'claude', label: 'Claude', title: 'Claude', text: 'IA desarrollada por Anthropic. Se la asocia con la escritura, el análisis de documentos largos y la programación.', meta: [['Desarrolla', 'Anthropic'], ['Ecosistema', 'Claude.ai, apps y API']], slot: 'Captura o video de Claude · a incorporar' },
      { icon: 'copilot', label: 'Copilot', title: 'Copilot', text: 'Asistente de Microsoft que vive dentro de las herramientas de trabajo y del sistema operativo.', meta: [['Desarrolla', 'Microsoft'], ['Ecosistema', 'Windows, Edge y Microsoft 365']], slot: 'Captura o video de Copilot · a incorporar' },
      { icon: 'gemini', label: 'Gemini', title: 'Gemini', text: 'Asistente de Google, integrado en sus productos de uso masivo. Su participación en el tráfico web se multiplicó por dos en el último año.', meta: [['Desarrolla', 'Google'], ['Ecosistema', 'Búsqueda, Android y Workspace']], slot: 'Captura o video de Gemini · a incorporar' },
      { icon: 'perplexity', label: 'Perplexity', title: 'Perplexity', text: 'Buscador conversacional: responde con fuentes citadas y está pensado para la búsqueda de información.', meta: [['Desarrolla', 'Perplexity AI'], ['Ecosistema', 'Buscador web y app propios']], slot: 'Captura o video de Perplexity · a incorporar' }
    ]
  }
};

function buildPicker(id, cfg) {
  const s = $('#s-' + id);
  s.innerHTML = `
    <div class="split">
      <div class="left">
        <p class="eyebrow">Núcleo 1</p>
        <h1 class="title">${cfg.title}</h1>
        <p class="lead">${cfg.lead}</p>
        <hr class="rule">
        <div class="item"><span class="bd"></span><div class="body" aria-live="polite"><h3></h3><p class="it"></p><dl class="meta"></dl></div></div>
      </div>
      <div class="right">
        <div class="media"><img alt="" hidden><div class="slot">${IMG_ICON}<span></span></div></div>
        <div class="picker ${cfg.iconPick ? '' : 'txt'}" role="tablist"></div>
      </div>
    </div>`;
  const picker = $('.picker', s), body = $('.body', s), img = $('.media img', s), slot = $('.slot', s), slotTxt = $('.slot span', s);
  const btns = cfg.items.map((it, i) => {
    const b = h(`<button type="button" class="pk" role="tab" aria-selected="false">${cfg.iconPick ? ICONS[it.icon] : ''}<span>${it.label}</span></button>`);
    b.addEventListener('click', () => pick(i));
    picker.appendChild(b); return b;
  });
  function pick(i) {
    const it = cfg.items[i];
    btns.forEach((b, j) => b.setAttribute('aria-selected', j === i ? 'true' : 'false'));
    $('h3', body).textContent = it.title;
    $('.it', body).textContent = it.text;
    $('.meta', body).innerHTML = (it.meta || []).map(m => `<dt>${m[0]}</dt><dd>${m[1]}</dd>`).join('');
    body.classList.remove('swap'); reflow(body); body.classList.add('swap');
    const src = it.asset && ASSETS[it.asset];
    img.hidden = !src; if (src) img.src = src;
    slot.style.display = src ? 'none' : '';
    slotTxt.textContent = it.slot;
  }
  s._pick = pick; pick(0);
}

/* =====================================================================
   COMPETIDORES (barras animadas)
   ===================================================================== */
const ROW = 44, AXIS_MAX = 80;
let snap = SNAP.length - 1, selA = 'ChatGPT', playT = null;
const barsBox = $('#bars'), barSide = $('#barSide');
const barSrc = 'Fuente: <a href="https://www.similarweb.com/blog/marketing/geo/gen-ai-stats/" target="_blank" rel="noopener">Similarweb</a>, tráfico web mundial de siete asistentes. Es participación sobre ese total, no visitas absolutas. Fechas aproximadas.';

function initBars() {
  NAMES.forEach(n => {
    const row = h(`<div class="brow" data-n="${n}" tabindex="0" role="button" aria-label="${n}"><span class="bl">${n}</span><span class="bt"><i class="bf"></i><b class="bv"></b></span></div>`);
    row.addEventListener('pointerenter', e => { if (isMouse(e)) barReadout(n); });
    row.addEventListener('click', () => { selA = n; drawBars(snap); });
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selA = n; drawBars(snap); } });
    barsBox.appendChild(row);
  });
  const chips = $('#snapChips');
  SNAP.forEach((sname, i) => {
    const c = h(`<button type="button" class="chip" aria-pressed="false">${sname}</button>`);
    c.addEventListener('click', () => { stopPlay(); drawBars(i); });
    chips.appendChild(c);
  });
  $('#btnPlay').addEventListener('click', togglePlay);
}
function order(i) { return [...NAMES].sort((a, b) => SHARE[b][i] - SHARE[a][i]); }
function placeRows(i) { order(i).forEach((n, rank) => { $(`.brow[data-n="${n}"]`, barsBox).style.transform = `translateY(${rank * ROW}px)`; }); }
function drawBars(i) {
  snap = i; placeRows(i);
  NAMES.forEach(n => {
    const row = $(`.brow[data-n="${n}"]`, barsBox), v = SHARE[n][i], w = v / AXIS_MAX * 100;
    $('.bf', row).style.width = w + '%';
    const bv = $('.bv', row); bv.style.left = `calc(${w}% + 10px)`; bv.textContent = pct(v);
    row.classList.toggle('me', n === 'ChatGPT'); row.classList.toggle('sel', n === selA);
    row.setAttribute('aria-label', `${n}: ${pct(v)} en ${SNAP[i]}`);
  });
  $$('#snapChips .chip').forEach((c, j) => c.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
  barReadout(selA);
}
function spark(n) {
  const s = SHARE[n], W = 260, Hh = 64, mn = Math.min(...s), mx = Math.max(...s), sp = mx - mn || 1;
  const X = i => 8 + i * (W - 16) / (s.length - 1), Y = v => Hh - 10 - (v - mn) / sp * (Hh - 26);
  const d = s.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
  return `<svg class="spark" viewBox="0 0 ${W} ${Hh}" aria-hidden="true"><path d="${d}" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.6" stroke-linejoin="round"/><circle cx="${X(snap)}" cy="${Y(s[snap])}" r="4.5" fill="#b9a3f4"/><text x="${X(0)}" y="${Hh}" fill="#6d768c" font-size="10" text-anchor="start">${pct(s[0])}</text><text x="${X(s.length - 1)}" y="${Hh}" fill="#6d768c" font-size="10" text-anchor="end">${pct(s[s.length - 1])}</text></svg>`;
}
let lastReadout = '';
function barReadout(n) {
  const s = SHARE[n], v = s[snap], d = v - s[0], rank = order(snap).indexOf(n) + 1;
  const dl = snap === 0 ? '' : `<p class="delta ${d >= 0 ? 'up' : 'dn'}">${d >= 0 ? '+' : '−'}${nf1.format(Math.abs(d))} pts frente a ${SNAP[0]}</p>`;
  const html = `<p class="k">${SNAP[snap]}</p><h3>${n}</h3><p class="big">${pct(v)}</p>${dl}<p class="txt">Puesto ${rank} de 7 en participación de visitas.</p>${spark(n)}<p class="src">${barSrc}</p>`;
  if (html !== lastReadout) { lastReadout = html; swapPanel(barSide, html); }
}
function togglePlay() {
  if (playT) return stopPlay();
  if (snap >= SNAP.length - 1) drawBars(0);
  setPlayIcon(true);
  playT = setInterval(() => { if (snap >= SNAP.length - 1) return stopPlay(); drawBars(snap + 1); if (snap >= SNAP.length - 1) stopPlay(); }, 1500);
}
function stopPlay() { if (playT) { clearInterval(playT); playT = null; } setPlayIcon(false); }
function setPlayIcon(on) {
  $('#btnPlay').innerHTML = on
    ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1.5" width="3" height="9" rx=".8"/><rect x="7" y="1.5" width="3" height="9" rx=".8"/></svg>'
    : '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2.5 1.2v9.6L10.5 6z"/></svg>';
  $('#btnPlay').setAttribute('aria-label', on ? 'Pausar' : 'Reproducir la evolución');
}
function enterBars() {
  stopPlay(); snap = SNAP.length - 1; selA = 'ChatGPT'; lastReadout = '';
  const all = $$('#bars .bf, #bars .bv, #bars .brow');
  all.forEach(n => n.style.transition = 'none');
  $$('#bars .bf').forEach(f => f.style.width = '0%');
  $$('#bars .bv').forEach(v => { v.style.left = '10px'; v.textContent = ''; });
  placeRows(snap); reflow(barsBox);
  all.forEach(n => n.style.transition = '');
  raf(() => raf(() => drawBars(snap)));
}

/* =====================================================================
   PORCENTAJE DE USO (línea, con vista mensual 2026)
   ===================================================================== */
let lineMode = 'years', lineSel = -1;
const lineG = $('#lineG'), lineSide = $('#lineSide');
const fmtM = v => v >= 1000 ? '1.000 M' : nf0.format(v) + ' M';
const lineSrc = 'Fuentes: anuncios de OpenAI, Reuters y The Information; NBER WP 34255 para 2022–2025. Cifras redondeadas.';

function lineDefault() {
  if (lineMode === 'years') {
    return `<p class="k">Usuarios semanales</p><h3>De 1 M a 1.000 M</h3><p class="txt">Posá el mouse o tocá un punto blanco para ver qué pasó ese año.</p><p class="fx">Nov 2022 → Ago 2026: menos de cuatro años para llegar a mil millones de usuarios semanales.</p><p class="src">${lineSrc}</p>`;
  }
  return `<p class="k">2026, mes a mes</p><h3>Dos cifras oficiales</h3><p class="txt">Solo febrero (900 M) y agosto (1.000 M) tienen dato oficial. Los puntos huecos son estimaciones unidas entre esos dos hitos.</p><p class="fx">Provisorio: reemplazar por el registro mensual real.</p><p class="src">${lineSrc}</p>`;
}
function linePanel(i) {
  const p = (lineMode === 'years' ? YEAR_PTS : MONTH_PTS)[i];
  const kind = lineMode === 'years' ? p.kind : 'Usuarios semanales';
  const val = lineMode === 'years' ? p.val : fmtM(p.v);
  const tag = p.conf ? '<span class="tag">Dato oficial</span>' : '<span class="tag est">Estimado · a confirmar</span>';
  swapPanel(lineSide, `<p class="k">${lineMode === 'years' ? p.lab : p.title + ' de 2026'}</p><h3>${lineMode === 'years' ? p.title : kind}</h3><p class="big">${val}</p>${tag}<p class="txt">${p.text}</p><p class="src">${lineSrc}</p>`);
}
function buildLine(animate) {
  const isY = lineMode === 'years', pts = isY ? YEAR_PTS : MONTH_PTS;
  const W = 900, H = 430, L = 76, R = 56, T = 34, B = 64, pw = W - L - R, ph = H - T - B;
  const yMin = isY ? 0 : 850, yMax = isY ? 1100 : 1030;
  const ticks = isY ? [0, 250, 500, 750, 1000] : [850, 900, 950, 1000];
  const X = i => L + i * pw / (pts.length - 1), Y = v => T + ph * (1 - (v - yMin) / (yMax - yMin));
  lineG.textContent = '';
  ticks.forEach(t => {
    el('line', { x1: L, x2: W - R + 8, y1: Y(t), y2: Y(t), class: 'gl' }, lineG);
    const tx = el('text', { x: L - 14, y: Y(t) + 4, 'text-anchor': 'end' }, lineG); tx.textContent = t === 0 ? '0' : fmtM(t);
  });
  el('line', { x1: L, x2: W - R + 14, y1: T + ph, y2: T + ph, class: 'ax' }, lineG);
  el('line', { x1: L, x2: L, y1: T - 10, y2: T + ph, class: 'ax' }, lineG);
  pts.forEach((p, i) => {
    el('line', { x1: X(i), x2: X(i), y1: T + ph, y2: T + ph + 6, class: 'ax' }, lineG);
    const t = el('text', { x: X(i), y: T + ph + 32, class: 'xt', 'text-anchor': 'middle' }, lineG); t.textContent = p.lab;
  });
  const xy = pts.map((p, i) => [X(i), Y(p.v)]);
  el('polygon', { class: 'ar', points: xy.map(a => a.join(',')).concat([X(pts.length - 1) + ',' + (T + ph), X(0) + ',' + (T + ph)]).join(' ') }, lineG);
  const path = el('path', { class: 'ln' + (isY ? '' : ' dash'), d: xy.map((a, i) => (i ? 'L' : 'M') + a[0].toFixed(1) + ' ' + a[1].toFixed(1)).join(' ') }, lineG);
  let len = 2000; try { len = path.getTotalLength(); } catch (e) {}
  if (animate && !reduce && isY) { path.style.strokeDasharray = len; path.style.strokeDashoffset = len; }
  const gs = pts.map((p, i) => {
    const g = el('g', { transform: `translate(${xy[i][0].toFixed(1)} ${xy[i][1].toFixed(1)})`, class: 'pt' + (p.conf ? '' : ' est'), tabindex: 0, role: 'button',
      'aria-label': `${isY ? p.lab : p.title + ' de 2026'}: ${isY ? p.val : fmtM(p.v)}` }, lineG);
    el('circle', { r: 26, fill: 'transparent' }, g);
    const pp = el('g', { class: 'pp' }, g);
    el('circle', { r: 16, class: 'halo' }, pp); el('circle', { r: 7.5, class: 'core' }, pp);
    pp.style.animationDelay = animate && !reduce ? (isY ? (0.25 + i * 0.3) : (0.1 + i * 0.09)).toFixed(2) + 's' : '0s';
    g.addEventListener('pointerenter', e => {
      if (!isMouse(e)) return; const r = g.getBoundingClientRect();
      showTip(`<b>${isY ? p.lab : p.title}</b> · ${isY ? p.val : fmtM(p.v)}<br><em>${p.conf ? 'Dato oficial' : 'Estimado'}</em>`, r.left + r.width / 2, r.top + r.height / 2 - 10);
    });
    g.addEventListener('pointerleave', hideTip);
    g.addEventListener('click', () => selectPt(i));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPt(i); } });
    return g;
  });
  lineG._gs = gs;
  if (animate && !reduce && isY) { reflow(path); path.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.4,.1,.2,1)'; path.style.strokeDashoffset = 0; }
  raf(() => gs.forEach(g => g.classList.add('in')));
  lineSel = -1; swapPanel(lineSide, lineDefault());
}
function selectPt(i) {
  lineSel = i; (lineG._gs || []).forEach((g, j) => g.classList.toggle('sel', j === i)); linePanel(i);
}
function setLineMode(mode, animate = true) {
  lineMode = mode; const m = mode === 'months';
  $('#ctaSmall').textContent = m ? 'Volver' : '2026';
  $('#ctaMain').textContent = m ? 'Ver todos los años' : 'Registro de cada mes';
  $('.ic', $('#btnMonths')).style.transform = m ? 'rotate(180deg)' : '';
  $('#lineTitle').textContent = m ? 'Usuarios semanales en 2026, mes a mes (millones)' : 'Usuarios semanales, en millones';
  $('#hintA').textContent = 'Posá el mouse sobre los puntos blancos';
  $('#hintB').textContent = m ? 'Los huecos son estimaciones, no datos oficiales.' : 'O tocalos para leer más detalles.';
  hideTip();
  if (!animate || reduce) return buildLine(animate);
  lineG.classList.add('out');
  setTimeout(() => { buildLine(true); lineG.classList.remove('out'); }, 280);
}
function enterLine() { setLineMode('years', true); }

/* =====================================================================
   USOS (dona)
   ===================================================================== */
const DC = { cx: 280, cy: 205, R: 140, r: 68 };
const donutSvg = $('#donutSvg'), donutSide = $('#donutSide');
let donutSel = null;
const nfSrc = 'Fuente: <a href="https://www.nber.org/papers/w34255" target="_blank" rel="noopener">NBER WP 34255</a> (Chatterji, Deming y otros, 2025) y <a href="https://openai.com/index/how-people-are-using-chatgpt/" target="_blank" rel="noopener">OpenAI</a>. Los valores “calculados” son el resto de cada categoría.';
const P = (a, rad) => [DC.cx + rad * Math.sin(a), DC.cy - rad * Math.cos(a)];
function arcPath(a0, a1) {
  const lg = (a1 - a0) > Math.PI ? 1 : 0, f = n => n.toFixed(2);
  const p0 = P(a0, DC.R), p1 = P(a1, DC.R), q1 = P(a1, DC.r), q0 = P(a0, DC.r);
  return `M${f(p0[0])} ${f(p0[1])}A${DC.R} ${DC.R} 0 ${lg} 1 ${f(p1[0])} ${f(p1[1])}L${f(q1[0])} ${f(q1[1])}A${DC.r} ${DC.r} 0 ${lg} 0 ${f(q0[0])} ${f(q0[1])}Z`;
}
function initDonut() {
  donutSvg.textContent = '';
  const total = USOS.reduce((s, u) => s + u.v, 0);
  const defs = el('defs', {}, donutSvg);
  const mask = el('mask', { id: 'dmask' }, defs);
  const mr = (DC.R + DC.r) / 2, circ = 2 * Math.PI * mr;
  const mc = el('circle', { cx: DC.cx, cy: DC.cy, r: mr, fill: 'none', stroke: '#fff', 'stroke-width': DC.R - DC.r + 60, transform: `rotate(90 ${DC.cx} ${DC.cy})` }, mask);
  mc.style.strokeDasharray = circ; mc.style.strokeDashoffset = circ; donutSvg._mc = mc; donutSvg._circ = circ;
  const ring = el('g', { mask: 'url(#dmask)' }, donutSvg); donutSvg._ring = ring;
  let a = Math.PI;
  USOS.forEach(u => {
    const span = u.v / total * Math.PI * 2, a0 = a, a1 = a + span, mid = (a0 + a1) / 2; a = a1; u._mid = mid;
    const seg = el('path', { d: arcPath(a0, a1), fill: u.c, class: 'seg', tabindex: 0, role: 'button', 'aria-label': `${u.name}: ${pct(u.v)}` }, ring);
    seg.style.setProperty('--tx', (Math.sin(mid) * 12).toFixed(1) + 'px'); seg.style.setProperty('--ty', (-Math.cos(mid) * 12).toFixed(1) + 'px');
    seg.addEventListener('pointerenter', e => { if (isMouse(e)) showTip(`<b>${u.name}</b> · ${pct(u.v)}`, e.clientX, e.clientY - 4); });
    seg.addEventListener('pointermove', e => { if (isMouse(e)) showTip(`<b>${u.name}</b> · ${pct(u.v)}`, e.clientX, e.clientY - 4); });
    seg.addEventListener('pointerleave', hideTip);
    seg.addEventListener('click', () => selectUso(u.k));
    seg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectUso(u.k); } });
    u._seg = seg;
    // etiqueta que aparece al seleccionar
    const w = u.name.length * 6.5 + 38, sx = Math.sin(mid), cy2 = -Math.cos(mid);
    const ax = DC.cx + (DC.R + 24) * sx, ay = DC.cy + (DC.R + 24) * cy2;
    let x = Math.abs(sx) < .3 ? ax - w / 2 : (sx > 0 ? ax : ax - w);
    x = Math.max(4, Math.min(x, 556 - w)); const y = ay + (cy2 < -.3 ? -26 : cy2 > .3 ? 2 : -13);
    const g = el('g', { class: 'chipg' }, donutSvg);
    el('rect', { x: x.toFixed(1), y: y.toFixed(1), width: w.toFixed(1), height: 26, rx: 8, fill: '#d9d9d9' }, g);
    el('circle', { cx: (x + 15).toFixed(1), cy: (y + 13).toFixed(1), r: 5.5, fill: u.c }, g);
    const t = el('text', { x: (x + 28).toFixed(1), y: (y + 17).toFixed(1) }, g); t.textContent = u.name;
    u._chip = g;
  });
  const c = el('g', { class: 'center', 'pointer-events': 'none' }, donutSvg); donutSvg._center = c;
  // leyenda
  const lg = $('#legend'); lg.textContent = '';
  LEGEND_ORDER.forEach(k => {
    const u = USOS.find(x => x.k === k);
    const b = h(`<button type="button" class="lg" style="--c:${u.c}" aria-pressed="false"><i></i>${u.name}</button>`);
    b.dataset.k = k; b.addEventListener('click', () => selectUso(k)); lg.appendChild(b);
  });
  centerText('1,1 M', 'conversaciones analizadas');
}
function centerText(a, b) {
  const c = donutSvg._center; c.textContent = '';
  const t1 = el('text', { x: DC.cx, y: DC.cy + 6, class: 'c1', 'text-anchor': 'middle' }, c); t1.textContent = a;
  const t2 = el('text', { x: DC.cx, y: DC.cy + 26, class: 'c2', 'text-anchor': 'middle' }, c); t2.textContent = b;
}
function donutDefault() {
  return `<p class="k">Cómo leerlo</p><h3>7 categorías de uso</h3><p class="txt">Cada sección es el porcentaje de mensajes que cae en ese tipo de uso. Hacé clic en una para ver el detalle.</p><p class="fx">73% de los mensajes de junio de 2025 no eran de trabajo, frente a 53% un año antes.</p><p class="txt">Muestra de unos 1,1 millones de conversaciones de los planes Free, Plus y Pro. Ninguna persona leyó los mensajes: los clasificó un modelo de IA.</p><p class="src">${nfSrc}</p>`;
}
function selectUso(k) {
  donutSel = donutSel === k ? null : k;
  USOS.forEach(u => { const on = u.k === donutSel; u._seg.classList.toggle('sel', on); u._chip.classList.toggle('on', on); });
  donutSvg.classList.toggle('has-sel', !!donutSel);
  $$('#legend .lg').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === donutSel ? 'true' : 'false'));
  if (!donutSel) { centerText('1,1 M', 'conversaciones analizadas'); swapPanel(donutSide, donutDefault()); return; }
  const u = USOS.find(x => x.k === donutSel);
  centerText(pct(u.v), u.name);
  const subs = u.subs ? `<ul class="subs">${u.subs.map(s => `<li class="${s[2] ? 'calc' : ''}"><span class="row"><span>${s[2] ? '≈ ' : ''}${s[0]}</span><b>${pct(s[1])}</b></span><span class="tr"><i style="--c:${u.c}" data-w="${(s[1] / u.v * 100).toFixed(1)}"></i></span></li>`).join('')}</ul>` : '';
  swapPanel(donutSide, `<p class="k">Del total de mensajes</p><h3>${u.name}</h3><p class="big" style="color:${u.c}">${pct(u.v)}</p><p class="txt">${u.txt}</p>${subs}<p class="src">${nfSrc}</p>`);
  raf(() => raf(() => $$('.subs .tr i', donutSide).forEach(i => i.style.width = i.dataset.w + '%')));
}
function enterDonut() {
  donutSel = null; USOS.forEach(u => { u._seg.classList.remove('sel'); u._chip.classList.remove('on'); });
  donutSvg.classList.remove('has-sel'); $$('#legend .lg').forEach(b => b.setAttribute('aria-pressed', 'false'));
  centerText('1,1 M', 'conversaciones analizadas'); swapPanel(donutSide, donutDefault());
  const mc = donutSvg._mc;
  if (reduce) { mc.style.transition = 'none'; mc.style.strokeDashoffset = 0; return; }
  mc.style.transition = 'none'; mc.style.strokeDashoffset = donutSvg._circ; reflow(mc);
  mc.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(.4,.1,.2,1)'; mc.style.strokeDashoffset = 0;
}

/* =====================================================================
   NAVEGACIÓN
   ===================================================================== */
const SCREENS = ['home', 'hub', 'chatgpt', 'openai', 'competidores', 'grok', 'uso', 'usos', 'n2'];
const N1 = ['hub', 'chatgpt', 'openai', 'competidores', 'grok', 'uso', 'usos'];
const N1_NAMES = ['Inicio del Núcleo 1', '¿Qué es ChatGPT?', '¿Qué es OpenAI?', 'Competidores principales', 'Grok y otros modelos', 'Porcentaje del uso', '¿Para qué usa el usuario ChatGPT?'];
const HINTS = {
  hub: ['Ver más.', 'Hacé clic para recorrer y ver la información completa.'],
  chatgpt: PICKERS.chatgpt.hint, openai: PICKERS.openai.hint, grok: PICKERS.grok.hint,
  competidores: ['Elegí un período', 'O tocá ▶ para ver cómo cambia el reparto.'],
  uso: ['Posá el mouse sobre los puntos blancos', 'O tocalos para leer más detalles.'],
  usos: ['Hacé clic en cada sección', 'Para leer más información en cada una.']
};
const ENTER = {
  hub: () => hubPage(0), competidores: enterBars, uso: enterLine, usos: enterDonut,
  chatgpt: () => $('#s-chatgpt')._pick(0), openai: () => $('#s-openai')._pick(0), grok: () => $('#s-grok')._pick(0)
};
const EXIT = { competidores: stopPlay };
const app = $('#app');
let cur = null, hubIdx = 0;

function render(id) {
  if (!SCREENS.includes(id)) id = 'home';
  if (id === cur) return;
  hideTip();
  if (cur && EXIT[cur]) EXIT[cur]();
  const idx = SCREENS.indexOf(id);
  $$('.screen').forEach(s => { const i = SCREENS.indexOf(s.dataset.id); s.classList.toggle('on', i === idx); s.classList.toggle('before', i < idx); });
  cur = id;
  app.dataset.view = id === 'home' ? 'home' : id === 'n2' ? 'n2' : 'n1';
  $$('.seg button').forEach(b => b.classList.toggle('on', b.dataset.nuc === (id === 'n2' ? '2' : '1')));
  const hi = HINTS[id]; if (hi) { $('#hintA').textContent = hi[0]; $('#hintB').textContent = hi[1]; }
  $$('#dots button').forEach((b, i) => b.setAttribute('aria-current', N1[i] === id ? 'true' : 'false'));
  if (ENTER[id]) ENTER[id]();
  const scr = $('.screen.on'); scr.scrollTop = 0;
  try { history.replaceState(null, '', '#' + id); } catch (e) {}
  scr.setAttribute('tabindex', '-1'); try { scr.focus({ preventScroll: true }); } catch (e) {}
}
const go = id => render(id);
function back() { if (cur === 'hub' || cur === 'n2') go('home'); else if (N1.includes(cur)) go('hub'); }
function step(dir) {
  const i = N1.indexOf(cur); if (i < 0) return;
  if (cur === 'hub' && dir > 0 && hubIdx === 0) return hubPage(1);
  if (cur === 'hub' && dir < 0 && hubIdx === 1) return hubPage(0);
  const n = N1[i + dir]; if (n) go(n);
}
function hubPage(i) {
  hubIdx = i; $('#hubTrack').style.transform = `translateX(-${i * 100}%)`;
  $('#hubPrev').hidden = i === 0; $('#hubNext').hidden = i === 1;
  $('#hubP0').inert = i === 1; $('#hubP1').inert = i === 0;
}

function init() {
  $$('[data-logo]').forEach(n => n.appendChild(logo(n.dataset.logo)));
  $$('[data-cluster]').forEach(n => n.appendChild(n.dataset.cluster === 'blue' ? cluster(['#4aa3ff', '#2fd0c4', '#5ed67e', '#9bd6ff'], 11) : cluster(['#ff5c84', '#ff9f5a', '#ffd166', '#ff7ab6'], 29)));
  Object.keys(PICKERS).forEach(id => buildPicker(id, PICKERS[id]));
  initBars(); initDonut(); setPlayIcon(false);
  // puntos de paradas
  const dots = $('#dots');
  N1.forEach((id, i) => { const b = h(`<button type="button" aria-label="${N1_NAMES[i]}" aria-current="false"></button>`); b.addEventListener('click', () => go(id)); dots.appendChild(b); });
  // eventos globales
  document.addEventListener('click', e => { const t = e.target.closest('[data-go]'); if (t) go(t.dataset.go); });
  $('#brand').addEventListener('click', e => { e.preventDefault(); go('home'); });
  $('#btnClose').addEventListener('click', () => go('home'));
  $('#btnBack').addEventListener('click', back);
  $$('.seg button').forEach(b => b.addEventListener('click', () => go(b.dataset.nuc === '2' ? 'n2' : 'hub')));
  $('#hubNext').addEventListener('click', () => hubPage(1));
  $('#hubPrev').addEventListener('click', () => hubPage(0));
  $('#btnMonths').addEventListener('click', () => setLineMode(lineMode === 'years' ? 'months' : 'years'));
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'Escape') back();
  });
  // deslizar en pantallas táctiles
  let sx = 0, sy = 0;
  $('#stage').addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  $('#stage').addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });
  document.addEventListener('scroll', hideTip, true);
  const start = (location.hash || '').slice(1);
  render(SCREENS.includes(start) ? start : 'home');
}
init();
})();
