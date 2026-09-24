(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const NS='http://www.w3.org/2000/svg';
const svgEl=(tag,attrs={},parent)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(parent)parent.appendChild(n);return n;};
const html=s=>{const t=document.createElement('template');t.innerHTML=s.trim();return t.content.firstElementChild;};
const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const nf1=new Intl.NumberFormat('es-AR',{minimumFractionDigits:1,maximumFractionDigits:1});
const pct=v=>nf1.format(v)+'%';

function logo(cls='logo'){
  const svg=svgEl('svg',{viewBox:'0 0 32 32',class:cls,'aria-hidden':'true'});
  const g=svgEl('g',{fill:'none',stroke:'currentColor','stroke-width':'1.55'},svg);
  for(let i=0;i<6;i++)svgEl('ellipse',{cx:16,cy:9.4,rx:4.1,ry:6.9,transform:`rotate(${i*60} 16 16)`},g);
  return svg;
}
function cluster(colors,seed){
  let s=seed;const rnd=()=>((s=s*16807%2147483647)/2147483647);
  const svg=svgEl('svg',{viewBox:'0 0 64 64','aria-hidden':'true'});
  for(let i=0;i<72;i++){const a=rnd()*Math.PI*2,d=Math.pow(rnd(),.7)*29;svgEl('circle',{cx:(32+Math.cos(a)*d).toFixed(1),cy:(32+Math.sin(a)*d).toFixed(1),r:Math.max(.5,2.6-d/12+rnd()*.4).toFixed(2),fill:colors[Math.floor(rnd()*colors.length)],opacity:(1-d/46).toFixed(2)},svg);}
  svgEl('circle',{cx:32,cy:32,r:4.4,fill:colors[0]},svg);return svg;
}
const tip=$('#tip');
function showTip(text,x,y){tip.textContent=text;tip.classList.add('on');const r=tip.getBoundingClientRect();let tx=x-r.width/2,ty=y-r.height-15;tx=Math.max(8,Math.min(tx,innerWidth-r.width-8));if(ty<8)ty=y+20;tip.style.left=tx+'px';tip.style.top=ty+'px';}
const hideTip=()=>tip.classList.remove('on');

const chatLogo=()=>`<svg class="mini-logo" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.55">${Array.from({length:6},(_,i)=>`<ellipse cx="16" cy="9.4" rx="4.1" ry="6.9" transform="rotate(${i*60} 16 16)"/>`).join('')}</g></svg>`;
const personIcon='<span class="person-icon">○</span>';
const icons={
  grok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><path d="M6 18 18 5"/></svg>',
  claude:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">'+Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<line x1="${12+3*Math.sin(a)}" y1="${12-3*Math.cos(a)}" x2="${12+10*Math.sin(a)}" y2="${12-10*Math.cos(a)}"/>`;}).join('')+'</svg>',
  copilot:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="12" height="11" rx="4" transform="rotate(-14 9 10.5)"/><rect x="10" y="9" width="11" height="11" rx="4" transform="rotate(-14 15 14.5)" opacity=".72"/></svg>',
  gemini:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.8C12.9 8 16 11.1 22.2 12 16 12.9 12.9 16 12 22.2 11.1 16 8 12.9 1.8 12 8 11.1 11.1 8 12 1.8Z"/></svg>',
  perplexity:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2v20M4.5 7 12 12l7.5-5M4.5 7v10l7.5 5 7.5-5V7L12 2z"/></svg>'
};

const PICKERS={
  chatgpt:{
    title:'¿Que es chatGPT?',
    lead:'ChatGPT es un modelo de lenguaje de inteligencia artificial desarrollado por OpenAI.\nEs un asistente conversacional que entiende el lenguaje natural y genera respuestas similares a las de una persona.',
    media:'assets/media/chatgpt-overview.jpg',
    intro:{title:'Sus distintos modelos',text:'Hubo modelos principales, versiones pequeñas, modelos de razonamiento y variantes especializadas.\nTe contamos sobre los 5 más destacados:'},
    cls:'models',
    hint:['Deslizá, hacé zoom y explorá','Cada punto revela una capa de información.'],
    items:[
      {label:'GPT-3.5',media:'assets/media/gpt35.jpg',title:'GPT-3.5',text:'ChatGPT fue lanzado el 30 de noviembre de 2022 con este mismo modelo. Lo revolucionario fue que los usuarios podían mantener una conversación, su única limitación era que se equivocaba con bastante facilidad.\nHizo que la IA generativa pasara de ser algo bastante especializado a convertirse en una herramienta utilizada masivamente por el público.'},
      {label:'GPT-4',media:'assets/media/gpt4.jpg',title:'GPT-4',text:'Este modelo llegó a ChatGPT el 14 de marzo de 2023. OpenAI informó que, en sus evaluaciones internas, GPT-4 era 40% más propenso a producir respuestas objetivas que GPT-3.5 y considerablemente menos propenso a responder a solicitudes de contenido prohibido.'},
      {label:'GPT-4o',media:'assets/media/gpt4o.jpg',title:'GPT-4o',text:'Este modelo apareció el 13 de mayo de 2024 y llevó la idea de ChatGPT mucho más allá del texto. Permitió que se pudiera trabajar de manera integrada con “texto + imágenes + video + voz”. Esto convirtió la interacción con ChatGPT en algo más parecido a hablar con una persona que a utilizar un buscador.'},
      {label:'o1',media:'assets/media/o1.jpg',title:'o1',text:'Este modelo apareció en ChatGPT en septiembre de 2024.\nEn vez de intentar simplemente responder rápido, los modelos o1 fueron diseñados para dedicar más tiempo de cómputo al razonamiento antes de dar una respuesta, resultando más útil para problemas de muchos pasos o más complejos.'},
      {label:'GPT-5',media:'assets/media/gpt5.jpg',title:'GPT-5',text:'Este modelo llegó el 7 de agosto de 2025, lo nuevo de esta versión fue que incorporó el razonamiento directamente en el sistema: podía decidir cuándo convenía responder rápidamente y cuándo dedicar más tiempo a pensar. Además unificó razonamiento, multimodalidad y herramientas.'}
    ]
  },
  openai:{
    title:'¿Que es OpenAI?',
    lead:'OpenAI es una empresa de investigación y desarrollo de inteligencia artificial, fundada en 2015. Su objetivo declarado es desarrollar IA avanzada procurando que sus beneficios alcancen a toda la humanidad.',
    cls:'people',
    hint:['Deslizá, hacé zoom y explorá','Cada punto revela una capa de información.'],
    items:[
      {label:'CEO',media:'assets/media/sam-altman.jpg',title:'Sam Altman',text:'Samuel Harris Altman, conocido como Sam Altman, es un empresario, inversionista, programador y bloguero estadounidense. Es director ejecutivo de OpenAI y expresidente de Y Combinator, y se le considera una de las figuras principales en el desarrollo de la inteligencia artificial.'},
      {label:'Presidente',media:'assets/media/greg-brockman.jpg',title:'Greg Brockman',text:'Gregory Brockman es un emprendedor e ingeniero de software estadounidense. Es cofundador y presidente de OpenAI. Comenzó su carrera en Stripe en 2010, tras graduarse del MIT, y se convirtió en director de tecnología (CTO) en 2013.'},
      {label:'Cofundador',media:'assets/media/ilya-sutskever.jpg',title:'Ilya Sutskever',text:'Ilya Sutskever FRS es un informático teórico israelí-canadiense nacido en la RSFS de Rusia, Unión Soviética, que trabajó en aprendizaje automático, fue cofundador y exjefe científico de OpenAI. Abandonó la compañía en 2024.'}
    ]
  },
  grok:{
    title:'Grok y otros<br>modelos',
    lead:'ChatGPT no está solo. Cinco asistentes se reparten hoy el mismo terreno, cada uno apoyado en el ecosistema de la empresa que lo desarrolla.',
    cls:'models',
    hint:['Deslizá, hacé zoom y explorá','Cada punto revela una capa de información.'],
    items:[
      {icon:'grok',label:'Grok',media:'assets/media/grok.jpg',title:'Grok',text:'IA desarrollada por xAI, integrada principalmente con X. Se caracteriza por respuestas conversacionales, acceso a información actual y un tono más informal.'},
      {icon:'claude',label:'Claude',media:'assets/media/claude.jpg',title:'Claude',text:'IA desarrollada por Anthropic. Se la asocia con la escritura, el análisis de documentos largos y la programación.'},
      {icon:'copilot',label:'Copilot',media:'assets/media/copilot.jpg',title:'Copilot',text:'Asistente de Microsoft que vive dentro de las herramientas de trabajo y del sistema operativo.'},
      {icon:'gemini',label:'Gemini',media:'assets/media/gemini.jpg',title:'Gemini',text:'Asistente de Google, integrado en sus productos de uso masivo y en su ecosistema de búsqueda, Android y Workspace.'},
      {icon:'perplexity',label:'Perplexity',media:'assets/media/perplexity.jpg',title:'Perplexity',text:'Buscador conversacional pensado para la búsqueda de información y para responder con fuentes citadas.'}
    ]
  }
};

function buildPicker(id,cfg){
  const s=$('#s-'+id);s.classList.add('picker-screen');
  s.innerHTML=`<div class="split"><div class="left"><p class="eyebrow">Núcleo 1</p><h1 class="title">${cfg.title}</h1><p class="lead"></p><hr class="rule"><div class="item"><span class="bd"></span><div class="body" aria-live="polite"><h3></h3><p class="it"></p></div></div></div><div class="right"><div class="media"><img alt=""></div><div class="picker ${cfg.cls||''}" role="tablist"></div></div></div>`;
  $('.lead',s).textContent=cfg.lead;
  const picker=$('.picker',s),img=$('.media img',s),body=$('.body',s),btns=[];
  cfg.items.forEach((it,i)=>{
    let ico='';
    if(id==='chatgpt') ico=chatLogo(); else if(id==='openai') ico=personIcon; else if(it.icon) ico=icons[it.icon];
    const b=html(`<button type="button" class="pk" role="tab" aria-selected="false">${ico}<span>${it.label}</span></button>`);
    b.addEventListener('click',()=>pick(i));picker.appendChild(b);btns.push(b);
  });
  function paint(title,text,media,index){
    btns.forEach((b,i)=>b.setAttribute('aria-selected',String(i===index)));
    $('h3',body).textContent=title;$('.it',body).textContent=text;img.src=media;img.alt=title;
    body.classList.remove('swap');void body.offsetWidth;body.classList.add('swap');
  }
  function pick(i){const it=cfg.items[i];paint(it.title,it.text,it.media,i)}
  function enter(){if(cfg.intro)paint(cfg.intro.title,cfg.intro.text,cfg.media,-1);else pick(0)}
  s._pick=pick;s._enter=enter;enter();
}

/* Competitors: visual recreation of the Figma screen. Values are used only to position the lines in the supplied design. */
const COMP_YEARS=[2022,2023,2024,2025,2026];
const COMP={
  ChatGPT:{c:'#f4f4f4',v:[160,16000,30000,50000,15000]},
  Gemini:{c:'#59b85e',v:[1,550,3000,12000,2700]},
  Perplexity:{c:'#d8423f',v:[5,180,1200,1700,300]},
  Claude:{c:'#dfbc1d',v:[1,40,350,1300,850]},
  DeepSeek:{c:'#ce56a3',v:[1,1,80,1900,430]},
  Grok:{c:'#cb7a1e',v:[1,20,600,2200,650]},
  Copilot:{c:'#6d37b8',v:[1,350,1600,3200,400]}
};
let compVisible=new Set(Object.keys(COMP));
function initCompetitors(){
  const legend=$('#compLegend');Object.entries(COMP).forEach(([name,d])=>{const b=html(`<button type="button" class="comp-pill" style="--c:${d.c}"><i></i><span>${name}</span></button>`);b.addEventListener('click',()=>{if(compVisible.has(name)&&compVisible.size>1)compVisible.delete(name);else compVisible.add(name);b.classList.toggle('off',!compVisible.has(name));drawCompetitors();});legend.appendChild(b);});drawCompetitors();
}
function drawCompetitors(){
  const svg=$('#compSvg');svg.textContent='';const W=1120,H=450,L=105,R=25,T=27,B=42,pw=W-L-R,ph=H-T-B;
  const yVals=[1,10,100,1000,10000,100000],yLab=['1M','10M','100M','1000M','10.000M','100.000M'];
  const X=i=>L+i*pw/(COMP_YEARS.length-1),Y=v=>T+ph*(1-(Math.log10(Math.max(1,v))/5));
  yVals.forEach((v,i)=>{const y=Y(v);svgEl('line',{x1:L,x2:W-R,y1:y,y2:y,class:'comp-grid'},svg);const t=svgEl('text',{x:L-12,y:y+6,'text-anchor':'end',class:'comp-label'},svg);t.textContent=yLab[i];});
  COMP_YEARS.forEach((yr,i)=>{const x=X(i);svgEl('line',{x1:x,x2:x,y1:T,y2:T+ph,class:'comp-vgrid'},svg);svgEl('line',{x1:x,x2:x,y1:T+ph-7,y2:T+ph+7,class:'comp-axis'},svg);const t=svgEl('text',{x,y:T+ph+29,'text-anchor':'middle',class:'comp-x'},svg);t.textContent=yr;});
  svgEl('line',{x1:L,x2:W-R+14,y1:T+ph,y2:T+ph,class:'comp-axis'},svg);svgEl('line',{x1:L,x2:L,y1:T-12,y2:T+ph,class:'comp-axis'},svg);
  Object.entries(COMP).forEach(([name,d])=>{
    const pts=d.v.map((v,i)=>[X(i),Y(v)]);const path=svgEl('path',{d:pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' '),stroke:d.c,class:'comp-line'+(name==='ChatGPT'?' active':'')},svg);path.style.opacity=compVisible.has(name)?(name==='ChatGPT'?'.72':'.56'):'0.08';
    pts.forEach((p,i)=>{const c=svgEl('circle',{cx:p[0],cy:p[1],r:name==='ChatGPT'?5.5:4.2,fill:d.c,class:'comp-dot'},svg);c.style.opacity=compVisible.has(name)?'1':'.12';c.addEventListener('pointerenter',e=>{const r=svg.getBoundingClientRect(),sx=r.width/W,sy=r.height/H;showTip(`${name} · ${COMP_YEARS[i]} · ${d.v[i].toLocaleString('es-AR')} M`,r.left+p[0]*sx,r.top+p[1]*sy)});c.addEventListener('pointerleave',hideTip);});
  });
}

/* Weekly users line chart */
const YEAR_PTS=[{lab:'2022',v:30,txt:'Lanzamiento de ChatGPT.'},{lab:'2023',v:170,txt:'Crecimiento acelerado durante el primer año.'},{lab:'2024',v:315,txt:'La base semanal siguió expandiéndose.'},{lab:'2025',v:825,txt:'El salto más fuerte de la serie.'},{lab:'2026',v:990,txt:'Alcanza aproximadamente mil millones de usuarios semanales.'}];
const MONTH_PTS=[{lab:'Ene',v:881},{lab:'Feb',v:886},{lab:'Mar',v:891},{lab:'Abr',v:894},{lab:'May',v:900},{lab:'Jun',v:903},{lab:'Jul',v:903},{lab:'Ago',v:1000}];
let lineMode='years';
function drawLine(){
  const svg=$('#lineSvg');svg.textContent='';const pts=lineMode==='years'?YEAR_PTS:MONTH_PTS;const W=1120,H=470,L=110,R=70,T=38,B=50,pw=W-L-R,ph=H-T-B;const yMin=lineMode==='years'?0:865,yMax=lineMode==='years'?1000:1005;const ticks=lineMode==='years'?[0,200,400,600,800,1000]:[880,900,920,940,960,980,1000];const X=i=>L+i*pw/(pts.length-1),Y=v=>T+ph*(1-(v-yMin)/(yMax-yMin));
  const defs=svgEl('defs',{},svg),g=svgEl('linearGradient',{id:'usageArea',x1:0,y1:0,x2:0,y2:1},defs);svgEl('stop',{offset:'0','stop-color':'#475777','stop-opacity':'.22'},g);svgEl('stop',{offset:'1','stop-color':'#1b2435','stop-opacity':'.02'},g);
  ticks.forEach(v=>{const y=Y(v);svgEl('line',{x1:L,x2:W-R,y1:y,y2:y,class:'line-grid'},svg);const t=svgEl('text',{x:L-12,y:y+6,'text-anchor':'end',class:'line-txt'},svg);t.textContent=v;});
  pts.forEach((p,i)=>{const x=X(i);svgEl('line',{x1:x,x2:x,y1:T+ph-8,y2:T+ph+8,class:'line-axis'},svg);const t=svgEl('text',{x,y:T+ph+31,'text-anchor':'middle',class:'line-txt'},svg);t.textContent=p.lab;});
  svgEl('line',{x1:L,x2:W-R+18,y1:T+ph,y2:T+ph,class:'line-axis'},svg);svgEl('line',{x1:L,x2:L,y1:T-12,y2:T+ph,class:'line-axis'},svg);
  const xy=pts.map((p,i)=>[X(i),Y(p.v)]);svgEl('polygon',{points:xy.concat([[X(pts.length-1),T+ph],[X(0),T+ph]]).map(p=>p.join(',')).join(' '),class:'line-area'},svg);const path=svgEl('path',{d:xy.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' '),class:'line-path'},svg);
  if(!reduce){try{const len=path.getTotalLength();path.style.strokeDasharray=len;path.style.strokeDashoffset=len;requestAnimationFrame(()=>{path.style.transition='stroke-dashoffset .8s ease';path.style.strokeDashoffset=0;});}catch(e){}}
  xy.forEach((p,i)=>{const gg=svgEl('g',{class:'usage-point',tabindex:'0',role:'button','aria-label':`${pts[i].lab}: ${pts[i].v} millones`},svg);svgEl('circle',{cx:p[0],cy:p[1],r:17,class:'hit'},gg);svgEl('circle',{cx:p[0],cy:p[1],r:8,class:'core'},gg);const show=()=>{const r=svg.getBoundingClientRect(),sx=r.width/W,sy=r.height/H;showTip(`${pts[i].lab}: ${pts[i].v.toLocaleString('es-AR')} M`,r.left+p[0]*sx,r.top+p[1]*sy)};gg.addEventListener('pointerenter',show);gg.addEventListener('pointerleave',hideTip);gg.addEventListener('focus',show);gg.addEventListener('blur',hideTip);});
  $('#usageLead').innerHTML=lineMode==='years'?'Te mostramos los usuarios semanales de ChatGPT<br>durante los años.':'Te mostramos los usuarios semanales de ChatGPT<br>durante este último año.';
  $('#ctaSmall').textContent=lineMode==='years'?'2026':'';$('#ctaMain').textContent=lineMode==='years'?'Registro de cada mes.':'Volver';$('#ctaIcon').textContent=lineMode==='years'?'≫':'≪';
}

/* Donut / use categories */
const USOS=[
  {k:'escr',name:'Escritura',v:28.1,c:'#cc53a1',subs:[[10.6,'Fue utilizado para editar, o critica de un texto.'],[8.6,'Para escritura personal y comunicación.'],[4.5,'Usado para Traducción.'],[3.6,'Generación de argumentos o resumenes.'],[1.4,'Escritura de fanfiction.']]},
  {k:'guia',name:'Guía practica',v:28.3,c:'#67b95f',subs:[[10.2,'Fue utilizado para tutoría o enseñanza.'],[8.5,'Se pidió consejos para hacer algo.'],[5.7,'Usado para salud, fitness, belleza o autocuidado'],[3.9,'Ideación creativa']]},
  {k:'busq',name:'Busqueda de información',v:21.3,c:'#d74140',subs:[[18.3,'Fue utilizado para información especifica.'],[2.1,'Se uso para la compra de un producto.'],[0.9,'Usado para cocina y recetas.']]},
  {k:'tec',name:'Ayuda tecnica',v:7.5,c:'#e5c21c',subs:[[4.2,'Fue utilizado para programación en computadoras.'],[3.0,'Se uso para cálculos matemáticos.'],[0.4,'Usado para análisis de data.']]},
  {k:'multi',name:'Multimedia',v:6.0,c:'#5d88c2',subs:[[4.2,'Fue utilizado para crear una imagen.'],[1.1,'Se uso para generar u obtener otros medios.'],[0.4,'Usado para analizar una imagen.']]},
  {k:'otro',name:'Otro / Desconocido',v:4.6,c:'#ca7a22',subs:[[4.1,'Fue utilizado para otro / desconocido.'],[0.4,'Se pregunto sobre el modelo de IA.']]},
  {k:'auto',name:'Autoexpresión',v:4.3,c:'#7037c6',subs:[[2.0,'Fue utilizado para saludos y charla.'],[1.9,'Para relaciones y reflejo personal.'],[0.4,'Se uso para juegos y roleplay.']]}
];
let donutSel=null;
function arcPath(cx,cy,r0,r1,a0,a1){const p=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)],A=p(r1,a0),B=p(r1,a1),C=p(r0,a1),D=p(r0,a0),large=a1-a0>Math.PI?1:0;return `M${A[0]} ${A[1]} A${r1} ${r1} 0 ${large} 1 ${B[0]} ${B[1]} L${C[0]} ${C[1]} A${r0} ${r0} 0 ${large} 0 ${D[0]} ${D[1]}Z`;}
function initDonut(){
  const svg=$('#donutSvg'),legend=$('#legend');svg.textContent='';legend.textContent='';const cx=260,cy=180,r1=148,r0=83;let a=-Math.PI/2;
  USOS.forEach(u=>{const da=u.v/100*Math.PI*2,p=svgEl('path',{d:arcPath(cx,cy,r0,r1,a,a+da),fill:u.c,class:'donut-seg',tabindex:'0',role:'button','aria-label':`${u.name}: ${pct(u.v)}`},svg);u.el=p;p.addEventListener('click',()=>selectUso(u.k));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectUso(u.k);}});a+=da;const b=html(`<button type="button" class="lg" data-k="${u.k}" style="--c:${u.c}" aria-pressed="false"><i></i><span>${u.name}</span></button>`);b.addEventListener('click',()=>selectUso(u.k));legend.appendChild(b);});
  const txt=svgEl('text',{x:cx,y:cy+12,'text-anchor':'middle',class:'donut-center',fill:'#fff'},svg);txt.id='donutCenter';selectUso(null,true);
}
function selectUso(k,force=false){if(!force&&donutSel===k)k=null;donutSel=k;const svg=$('#donutSvg');svg.classList.toggle('has-sel',!!k);USOS.forEach(u=>u.el?.classList.toggle('sel',u.k===k));$$('#legend .lg').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));const center=$('#donutCenter'),copy=$('#usageCopy');
  if(!k){center.textContent='';copy.innerHTML='';copy.className='usage-copy empty';return;}
  const u=USOS.find(x=>x.k===k);center.textContent=pct(u.v);center.setAttribute('fill',u.c);copy.className='usage-copy';copy.innerHTML=`<h2 class="u-title">${u.name}</h2><p class="u-intro">Se registró que un ${pct(u.v)} de los prompts fueron de esta categoría.</p><div class="u-bars">${u.subs.map(s=>`<div class="u-row"><b>${pct(s[0])}</b><span class="rail"><i style="--w:${Math.min(100,s[0]/Math.max(...u.subs.map(x=>x[0]))*100)}%"></i></span><p>${s[1]}</p></div>`).join('')}</div>`;
}

/* Navigation */
const SCREENS=['home','hub','chatgpt','openai','competidores','grok','uso','usos','n2'];
const N1=['hub','chatgpt','openai','competidores','grok','uso','usos'];
const N1_NAMES=['Inicio del Núcleo 1','¿Qué es ChatGPT?','¿Qué es OpenAI?','Competidores principales','Grok y otros modelos','Porcentaje del uso','¿Para qué usa el usuario ChatGPT?'];
const HINTS={hub:['Ver más.','Haz click para recorrer y ver la información completa.'],chatgpt:PICKERS.chatgpt.hint,openai:PICKERS.openai.hint,grok:PICKERS.grok.hint,competidores:['Posa el mouse sobre las lineas punteadas para leer más detalles.','Presiona los botones para comparar a los distintos competidores'],uso:['Posa el mouse sobre los puntos blancos para leer más detalles.',''],usos:['Haz click en cada sección','Para leer más información en cada una']};
let cur=null,hubIdx=0;
const app=$('#app');
function hubPage(i){hubIdx=i;$('#hubTrack').style.transform=`translateX(-${i*100}%)`;$('#hubPrev').hidden=i===0;$('#hubNext').hidden=i===1;$('#hubP0').inert=i===1;$('#hubP1').inert=i===0;}
function render(id){if(!SCREENS.includes(id))id='home';if(id===cur)return;hideTip();const idx=SCREENS.indexOf(id);$$('.screen').forEach(s=>{const i=SCREENS.indexOf(s.dataset.id);s.classList.toggle('on',i===idx);s.classList.toggle('before',i<idx);});cur=id;app.dataset.view=id==='home'?'home':id==='n2'?'n2':'n1';$$('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.nuc===(id==='n2'?'2':'1')));const hi=HINTS[id];if(hi){$('#hintA').textContent=hi[0];$('#hintB').textContent=hi[1];}$$('#dots button').forEach((b,i)=>b.setAttribute('aria-current',String(N1[i]===id)));if(id==='hub')hubPage(0);if(id==='chatgpt'||id==='openai'||id==='grok')$('#s-'+id)._enter();if(id==='competidores')drawCompetitors();if(id==='uso')drawLine();if(id==='usos')selectUso(null,true);try{history.replaceState(null,'','#'+id);}catch(e){}
}
function go(id){render(id)}
function back(){if(cur==='hub'||cur==='n2')go('home');else if(N1.includes(cur))go('hub');}
function step(dir){const i=N1.indexOf(cur);if(i<0)return;if(cur==='hub'&&dir>0&&hubIdx===0)return hubPage(1);if(cur==='hub'&&dir<0&&hubIdx===1)return hubPage(0);const n=N1[i+dir];if(n)go(n);}
function init(){
  $$('[data-logo]').forEach(n=>n.appendChild(logo(n.dataset.logo)));
  $$('[data-cluster]').forEach(n=>n.appendChild(n.dataset.cluster==='blue'?cluster(['#44a4ff','#31d0c1','#5fd674','#9bd6ff'],11):cluster(['#ff355f','#ff8c45','#ffd166','#ff638f'],29)));
  Object.entries(PICKERS).forEach(([id,cfg])=>buildPicker(id,cfg));
  initCompetitors();initDonut();drawLine();
  const dots=$('#dots');N1.forEach((id,i)=>{const b=html(`<button type="button" aria-label="${N1_NAMES[i]}" aria-current="false"></button>`);b.addEventListener('click',()=>go(id));dots.appendChild(b);});
  document.addEventListener('click',e=>{const t=e.target.closest('[data-go]');if(t)go(t.dataset.go);});
  $('#brand').addEventListener('click',e=>{e.preventDefault();go('home')});$('#btnClose').addEventListener('click',()=>go('home'));$('#btnBack').addEventListener('click',back);$$('.seg button').forEach(b=>b.addEventListener('click',()=>go(b.dataset.nuc==='2'?'n2':'hub')));$('#hubNext').addEventListener('click',()=>hubPage(1));$('#hubPrev').addEventListener('click',()=>hubPage(0));$('#btnMonths').addEventListener('click',()=>{lineMode=lineMode==='years'?'months':'years';drawLine();});
  document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1);if(e.key==='Escape')back();});
  let sx=0,sy=0;$('#stage').addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});$('#stage').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>70&&Math.abs(dy)<50)step(dx<0?1:-1);},{passive:true});
  const start=(location.hash||'').slice(1);render(SCREENS.includes(start)?start:'home');
}
init();
})();
