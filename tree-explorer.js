(()=>{
'use strict';
const glyphs=['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];
const values=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const hebrewSefirot=['כתר','חכמה','בינה','חסד','גבורה','תפארת','נצח','הוד','יסוד','מלכות'];
const astroGlyphs={'Mercúrio':'☿','Lua':'☽','Vênus':'♀','Áries':'♈','Touro':'♉','Gêmeos':'♊','Câncer':'♋','Libra':'♎','Virgem':'♍','Júpiter':'♃','Leão':'♌','Escorpião':'♏','Sagitário':'♐','Capricórnio':'♑','Marte':'♂','Aquário':'♒','Peixes':'♓','Sol':'☉','Saturno':'♄','Ar':'△','Água':'▽','Fogo':'△'};
const suits=[
 {name:'Paus',element:'Fogo',span:'1 · Kether',y:62,h:108,prompt:'O que inicia a ação?',tone:'fire'},
 {name:'Copas',element:'Água',span:'2–3 · Chokmah e Binah',y:184,h:118,prompt:'O que ganha vínculo e forma?',tone:'water'},
 {name:'Espadas',element:'Ar',span:'4–9 · da tensão à imagem',y:313,h:694,prompt:'Que conflito pede uma decisão?',tone:'air'},
 {name:'Discos',element:'Terra',span:'10 · Malkuth',y:1024,h:113,prompt:'O que se torna concreto?',tone:'earth'}
];
let config,overlay,svg,stage,anchor,focusReturn,scale=1,view={x:0,y:0,w:1000,h:1160},drag=null,opened=false,skipFullscreenChange=false;
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const point=i=>({x:500+(config.sefirot[i][1]-250)*1.45,y:100+(config.sefirot[i][2]-55)*1.12});
function inkLine(a,b,seed,wobble=2.1){
 const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,n=Math.max(5,Math.ceil(len/32));
 let d=`M${a.x.toFixed(1)} ${a.y.toFixed(1)}`;
 for(let j=1;j<n;j++){const t=j/n,noise=(Math.sin(seed*7.31+j*2.47)+Math.sin(seed*1.73+j*5.16)*.42)*wobble*Math.sin(Math.PI*t);d+=` L${(a.x+dx*t-dy/len*noise).toFixed(1)} ${(a.y+dy*t+dx/len*noise).toFixed(1)}`}
 return d+` L${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}
function inkRing(x,y,r,seed){let d='',rough=Math.min(.8,r*.023);for(let k=0;k<=40;k++){const t=k/40*Math.PI*2,v=r+(Math.sin(k*2.91+seed)+Math.sin(k*5.44+seed)*.35)*rough;d+=`${k?'L':'M'}${(x+Math.cos(t)*v).toFixed(1)} ${(y+Math.sin(t)*v).toFixed(1)} `}return d+'Z'}
function preview(opts){
 const xy=i=>({x:155+(opts.sefirot[i][1]-250)*.625,y:27+(opts.sefirot[i][2]-55)*.32});
 const lines=opts.paths.map((path,i)=>`<path d="${inkLine(xy(path[1]),xy(path[2]),i+1,.65)}"/>`).join('');
 const nodes=opts.sefirot.map((_,i)=>{const q=xy(i);return `<path d="${inkRing(q.x,q.y,i===0||i===9?11:9,i+3)}" fill="#eee4cf" stroke="#332b21" stroke-width="1.4"/>`}).join('');
 return `<div class="tree-preview"><div class="tree-preview-paper" aria-hidden="true"><span class="tree-preview-label">UM MAPA · QUATRO LINGUAGENS</span><svg viewBox="0 0 310 330" preserveAspectRatio="xMidYMid meet"><g stroke="#413629" stroke-width="1.15" fill="none">${lines}</g>${nodes}</svg><span class="tree-preview-foot">10 SEPHIROTH · 22 CAMINHOS · 4 NAIPES</span></div><button type="button" class="tree-enter" data-open-tree>Explorar em tela cheia <span aria-hidden="true">↗</span></button></div>`
}
function setup(opts){config=opts;anchor=$('#tree-anchor');if(!anchor)return;overlay?.remove();overlay=null;makeOverlay()}
function makeDiagram(){
 const tags=config.paths.map((p,i)=>{const a=point(p[1]),b=point(p[2]);return {i,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,side:(a.x+b.x)/2<495?'left':(a.x+b.x)/2>505?'right':null}});
 let centers=tags.filter(t=>!t.side).sort((a,b)=>a.my-b.my);centers.forEach((t,j)=>t.side=j%2?'right':'left');
 for(const side of ['left','right'])tags.filter(t=>t.side===side).sort((a,b)=>a.my-b.my).forEach((t,j)=>{t.tx=side==='left'?38:795;t.ty=132+j*89});
 const layer={suits:suits.map((s,i)=>`<g class="atlas-suit ${s.tone}" data-kind="suit" data-index="${i}" aria-hidden="true"><path class="suit-wash" d="M25 ${s.y+4} Q150 ${s.y-2} 290 ${s.y+3} T590 ${s.y+2} T975 ${s.y+1} L975 ${s.y+s.h-2} Q760 ${s.y+s.h+3} 540 ${s.y+s.h-1} T25 ${s.y+s.h} Z"/></g>`).join(''),suitLabels:suits.map((s,i)=>`<g class="atlas-suit-label atlas-hit" data-kind="suit" data-index="${i}" tabindex="0" role="button" aria-label="${s.name}: ${s.element}. ${s.span}"><path d="M36 ${s.y+10} L190 ${s.y+10} L190 ${s.y+55} L36 ${s.y+55} Z"/><text x="42" y="${s.y+25}" class="suit-name">${s.name.toUpperCase()}</text><text x="42" y="${s.y+43}" class="suit-sub">${s.element} · ${['1','2–3','4–9','10'][i]}</text></g>`).join(''),paths:'',letters:'',annotations:'',sefirot:''};
 config.paths.forEach((p,i)=>{
  const a=point(p[1]),b=point(p[2]),mx=(a.x+b.x)/2,my=(a.y+b.y)/2,t=tags[i];
  const astro=config.majors[p[3]][1],major=config.majorNames[p[3]],glyph=(astroGlyphs[astro]||astro)+'\uFE0E';
  const da=inkLine(a,b,i+11),db=inkLine(a,b,i+47,1.2),dest={x:t.side==='left'?t.tx+162:t.tx,y:t.ty+7};
  layer.paths+=`<g class="atlas-path atlas-hit" data-kind="path" data-index="${i}" tabindex="0" role="button" aria-label="Caminho ${p[0]}: ${config.sefirot[p[1]][0]} a ${config.sefirot[p[2]][0]}"><path class="atlas-path-ghost" d="${db}"/><path class="atlas-path-line" d="${da}"/><path class="atlas-path-hit" d="M${a.x} ${a.y}L${b.x} ${b.y}"/></g>`;
  layer.letters+=`<g class="atlas-token atlas-letter atlas-hit" data-kind="letter" data-index="${i}" tabindex="0" role="button" aria-label="Letra ${p[0]}, ${glyphs[i]}"><path d="${inkRing(mx,my,16,i+23)}"/><text x="${mx}" y="${my+7}">${glyphs[i]}</text></g>`;
  layer.annotations+=`<g class="atlas-callout atlas-hit" data-kind="path" data-index="${i}" tabindex="0" role="button" aria-label="Correspondências do caminho ${p[0]}"><path class="callout-leader" d="${inkLine({x:mx,y:my},dest,i+66,1)}"/><path class="callout-frame" d="M${t.tx+3} ${t.ty-27} Q${t.tx+80} ${t.ty-30} ${t.tx+160} ${t.ty-26} L${t.tx+160} ${t.ty+44} Q${t.tx+80} ${t.ty+47} ${t.tx+3} ${t.ty+43} Z"/><text x="${t.tx+10}" y="${t.ty-12}" class="callout-head">${String(i+11).padStart(2,'0')} · ${p[0]}</text><g data-layer-item="tarot" class="atlas-hit" data-kind="tarot" data-index="${i}" tabindex="0" role="button" aria-label="Arcano ${esc(major)}"><text x="${t.tx+10}" y="${t.ty+7}" class="callout-major">${esc(major)}</text></g><g data-layer-item="astrology" class="atlas-hit" data-kind="astro" data-index="${i}" tabindex="0" role="button" aria-label="Correspondência ${esc(astro)}"><text x="${t.tx+10}" y="${t.ty+25}" class="callout-astro">${esc(glyph)}  ${esc(astro)}</text></g><g data-layer-item="gematria" class="atlas-hit" data-kind="value" data-index="${i}" tabindex="0" role="button" aria-label="Valor da letra ${p[0]}: ${values[i]}"><text x="${t.tx+147}" y="${t.ty+38}" class="callout-value">${glyphs[i]} = ${values[i]}</text></g></g>`;
 });
 config.sefirot.forEach((s,i)=>{const p=point(i);layer.sefirot+=`<g class="atlas-node atlas-hit" data-kind="node" data-index="${i}" tabindex="0" role="button" aria-label="Sephirah ${i+1}, ${s[0]}"><path class="node-halo" d="${inkRing(p.x,p.y,45,i+81)}"/><path class="node-ring" d="${inkRing(p.x,p.y,37,i+12)}"/><path class="node-ring-inner" d="${inkRing(p.x,p.y,34,i+47)}"/><text class="node-number" x="${p.x}" y="${p.y-10}">${String(i+1).padStart(2,'0')}</text><text class="node-hebrew" x="${p.x}" y="${p.y+11}">${hebrewSefirot[i]}</text><text class="node-name" x="${p.x}" y="${p.y+63}">${s[0]}</text></g>`});
 return `<svg id="tree-svg" viewBox="0 0 1000 1160" aria-label="Árvore da Vida hermética: dez Sephiroth, vinte e dois caminhos e camadas de tarô, hebraico, gematria, astrologia e naipes" role="group"><defs><filter id="atlas-paper"><feTurbulence type="fractalNoise" baseFrequency=".28" numOctaves="3" seed="5"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer></filter></defs><rect x="0" y="0" width="1000" height="1160" fill="#f5f0e6"/><rect x="0" y="0" width="1000" height="1160" fill="#5d4b39" filter="url(#atlas-paper)" pointer-events="none"/><g data-layer="suits">${layer.suits}</g><g data-layer="paths">${layer.paths}</g><g data-layer="letters">${layer.letters}</g><g data-layer="annotations">${layer.annotations}</g><g data-layer="sefirot">${layer.sefirot}</g><g data-layer="suit-labels">${layer.suitLabels}</g><text x="500" y="1149" class="atlas-imprint">ARCANA NARRATIVA · LEITURA HERMÉTICA DO TAROT DE THOTH</text></svg>`
}
function makeOverlay(){
 overlay=document.createElement('section');overlay.id='tree-explorer';overlay.className='tree-explorer tree-inline-mode';overlay.setAttribute('role','region');overlay.setAttribute('aria-labelledby','tree-title');
 overlay.innerHTML=`<div class="atlas-head"><div><span class="atlas-eyebrow">ARCANA NARRATIVA <i>·</i> MAPA INTERATIVO</span><h2 id="tree-title">A Árvore da Vida</h2><p>Tarô, Cabala hermética, gematria e astrologia: selecione uma camada e toque no mapa.</p></div><div class="atlas-head-actions"><button type="button" class="atlas-expand" data-tree-expand>Explorar em tela cheia <span aria-hidden="true">↗</span></button><button type="button" class="atlas-fullscreen" data-tree-fullscreen>Tela cheia ↗</button><button type="button" class="atlas-close" data-tree-close aria-label="Voltar ao slide da Árvore da Vida">Voltar ao slide <span aria-hidden="true">×</span></button></div></div><div class="atlas-shell"><details class="atlas-controls" open><summary>Camadas e navegação <span aria-hidden="true">⌄</span></summary><div class="atlas-control-body"><p class="atlas-controls-intro">Escolha o que quer comparar. Cada marca no desenho abre uma explicação.</p><fieldset><legend>Mostrar no mapa</legend>${[['suits','Zonas dos naipes',true],['paths','22 caminhos',true],['sefirot','10 Sephiroth',true],['letters','Letras hebraicas',true],['tarot','Arcanos Maiores',false],['astrology','Astrologia',false],['gematria','Valores das letras',false]].map(([key,label,checked])=>`<label class="atlas-check"><input type="checkbox" data-atlas-layer="${key}" ${checked?'checked':''}><span>${label}</span></label>`).join('')}</fieldset><label class="atlas-jump-label" for="atlas-jump">Ir para uma sephirah</label><select id="atlas-jump"><option value="">Escolha um centro</option>${config.sefirot.map((s,i)=>`<option value="${i}">${i+1} · ${s[0]}</option>`).join('')}</select><p class="atlas-note">As faixas dos naipes reúnem duas relações do sistema Thoth: os quatro elementos e os planos da Árvore. Funcionam como uma leitura comparativa, não como territórios exclusivos de cada naipe.</p></div></details><div class="atlas-stage" id="atlas-stage"><div class="atlas-map">${makeDiagram()}</div><div class="atlas-tools"><button type="button" data-tree-zoom="in" aria-label="Aproximar">+</button><button type="button" data-tree-zoom="out" aria-label="Afastar">−</button><button type="button" data-tree-zoom="fit" aria-label="Ver Árvore inteira">Inteira</button><span id="atlas-scale">100%</span></div><p class="atlas-hint">Role para ampliar · arraste o papel para navegar · clique em qualquer símbolo</p></div></div>`;
 anchor.append(overlay);
 svg=$('#tree-svg',overlay);stage=$('#atlas-stage',overlay);
 $$('[data-atlas-layer]',overlay).forEach(input=>input.onchange=()=>setLayer(input.dataset.atlasLayer,input.checked));
 $$('[data-atlas-layer]',overlay).forEach(input=>setLayer(input.dataset.atlasLayer,input.checked));
 $$('[data-tree-zoom]',overlay).forEach(b=>b.onclick=()=>zoom(b.dataset.treeZoom));
 $('[data-tree-close]',overlay).onclick=close;
 $('[data-tree-expand]',overlay).onclick=open;
 $('[data-tree-fullscreen]',overlay).onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen?.({navigationUI:'hide'}).catch(()=>{})};
 $('#atlas-jump',overlay).onchange=e=>{if(e.target.value==='')return;const i=+e.target.value,p=point(i);setView(p.x-250,p.y-290,500,580);showInfo('node',i)};
 overlay.addEventListener('click',e=>{const hit=e.target.closest('[data-kind]');if(hit){showInfo(hit.dataset.kind,+hit.dataset.index)}});
 overlay.addEventListener('keydown',e=>{const hit=e.target.closest('[data-kind]');if(hit&&(e.key==='Enter'||e.key===' ')){e.preventDefault();showInfo(hit.dataset.kind,+hit.dataset.index)}if(e.key==='Escape'&&!$('#knowledge').classList.contains('open')){e.preventDefault();close()}});
 svg.addEventListener('wheel',e=>{e.preventDefault();const rect=svg.getBoundingClientRect(),px=(e.clientX-rect.left)/rect.width,py=(e.clientY-rect.top)/rect.height;zoom(e.deltaY<0?'in':'out',px,py)},{passive:false});
 svg.addEventListener('pointerdown',e=>{if(e.target.closest('[data-kind]'))return;drag={x:e.clientX,y:e.clientY,view:{...view}};svg.setPointerCapture(e.pointerId);svg.classList.add('dragging')});
 svg.addEventListener('pointermove',e=>{if(!drag)return;const r=svg.getBoundingClientRect();setView(drag.view.x-(e.clientX-drag.x)/r.width*view.w,drag.view.y-(e.clientY-drag.y)/r.height*view.h,view.w,view.h)});
 const stop=()=>{drag=null;svg.classList.remove('dragging')};svg.addEventListener('pointerup',stop);svg.addEventListener('pointercancel',stop);
 document.addEventListener('fullscreenchange',()=>{const b=$('[data-tree-fullscreen]',overlay);if(b)b.textContent=document.fullscreenElement?'Sair da tela cheia':'Tela cheia ↗'});
}
function setLayer(name,on){
 const el=$(`[data-layer="${name}"]`,overlay);if(el)el.style.display=on?'':'none';
 if(name==='suits'){const labels=$('[data-layer="suit-labels"]',overlay);if(labels)labels.style.display=on?'':'none'}
 $$(`[data-layer-item="${name}"]`,overlay).forEach(item=>item.style.display=on?'':'none');
 if(['tarot','astrology','gematria'].includes(name)){const any=['tarot','astrology','gematria'].some(key=>$(`[data-atlas-layer="${key}"]`,overlay)?.checked);const notes=$('[data-layer="annotations"]',overlay);if(notes)notes.style.display=any?'':'none'}
}
function setView(x,y,w,h){w=Math.max(300,Math.min(1000,w));h=Math.max(348,Math.min(1160,h));x=Math.max(0,Math.min(1000-w,x));y=Math.max(0,Math.min(1160-h,y));view={x,y,w,h};svg.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);scale=1000/w;$('#atlas-scale',overlay).textContent=`${Math.round(scale*100)}%`}
function zoom(dir,px=.5,py=.5){if(dir==='fit'){setView(0,0,1000,1160);return}const f=dir==='in'?.78:1.28,w=Math.max(300,Math.min(1000,view.w*f)),h=w*1.16,cx=view.x+view.w*px,cy=view.y+view.h*py;setView(cx-w*px,cy-h*py,w,h)}
function open(){if(!config||!overlay||opened)return;focusReturn=document.activeElement;opened=true;document.body.insertBefore(overlay,$('#knowledge'));overlay.classList.replace('tree-inline-mode','tree-full-mode');overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');document.body.style.overflow='hidden';$('#main').inert=true;$('.topbar').inert=true;if(matchMedia('(max-width:760px)').matches)$('.atlas-controls',overlay).open=false;zoom('fit');$('[data-tree-close]',overlay).focus()}
function close(){if(!opened)return;opened=false;overlay.classList.replace('tree-full-mode','tree-inline-mode');overlay.setAttribute('role','region');overlay.removeAttribute('aria-modal');anchor?.append(overlay);document.body.style.overflow='';$('#main').inert=false;$('.topbar').inert=false;$('#atlas-jump',overlay).value='';if(document.fullscreenElement){skipFullscreenChange=true;document.exitFullscreen().finally(()=>{skipFullscreenChange=false})}focusReturn?.focus?.()}
const majorNotes=[
 'O Louco reúne Ar, movimento e possibilidade anterior a uma forma definida.',
 'O Mago concentra a ação mercurial: linguagem, destreza e circulação entre planos.',
 'A Sacerdotisa figura a passagem lunar entre o que se mostra e o que permanece velado.',
 'A Imperatriz articula Vênus, fertilidade, atração e a criação de novas relações.',
 'O Imperador exprime Áries, iniciativa e a força que estabelece uma direção.',
 'O Hierofante liga Touro à transmissão de formas, ritos e ensinamentos.',
 'Os Amantes aproximam Gêmeos de escolhas, diferenças e encontros que transformam.',
 'A Carruagem associa Câncer a proteção, movimento e condução de uma força.',
 'Ajustamento relaciona Libra ao equilíbrio dinâmico entre forças e consequências.',
 'O Eremita atribui a Virgem uma busca de precisão, recolhimento e maturação.',
 'Fortuna põe Júpiter em uma roda de mudança, expansão e ciclos.',
 'Volúpia trata a força de Leão como intensidade vital, desejo e coragem.',
 'O Enforcado, ligado à Água, suspende a ação para inverter o ponto de vista.',
 'Morte e Escorpião mostram transformação por corte, dissolução e renascimento.',
 'Arte, ligada a Sagitário, mistura forças contrárias para produzir uma terceira forma.',
 'O Diabo aproxima Capricórnio de matéria, impulso e limites do desejo.',
 'A Torre vincula Marte à ruptura de estruturas que já não se sustentam.',
 'A Estrela, em Aquário, abre uma imagem de fluxo, horizonte e renovação.',
 'A Lua, em Peixes, atravessa sonho, obscuridade e incerteza.',
 'O Sol ilumina presença, clareza e a vida que se torna visível.',
 'O Aeon associa Fogo a um chamado de passagem e reorientação.',
 'O Universo liga Saturno ao contorno, à conclusão e ao mundo manifestado.'
];
const decans={
 W:['Marte em Áries','Sol em Áries','Vênus em Áries','Saturno em Leão','Júpiter em Leão','Marte em Leão','Mercúrio em Sagitário','Lua em Sagitário','Saturno em Sagitário'],
 C:['Vênus em Câncer','Mercúrio em Câncer','Lua em Câncer','Marte em Escorpião','Sol em Escorpião','Vênus em Escorpião','Saturno em Peixes','Júpiter em Peixes','Marte em Peixes'],
 S:['Lua em Libra','Saturno em Libra','Júpiter em Libra','Vênus em Aquário','Mercúrio em Aquário','Lua em Aquário','Júpiter em Gêmeos','Marte em Gêmeos','Sol em Gêmeos'],
 D:['Júpiter em Capricórnio','Marte em Capricórnio','Sol em Capricórnio','Mercúrio em Touro','Lua em Touro','Saturno em Touro','Sol em Virgem','Vênus em Virgem','Mercúrio em Virgem']
};
const suitCodes=['W','C','S','D'];
const suitElements={W:'Fogo',C:'Água',S:'Ar',D:'Terra'};
const suitNames={W:'Paus',C:'Copas',S:'Espadas',D:'Discos'};
const aceNotes={W:'Harris mostra uma irrupção de chamas que ainda não se organizou como vontade definida.',C:'A taça apresenta a água como receptividade e fonte de vida antes de qualquer relação particular.',S:'A espada concentra a potência do ar em um corte de discernimento, ainda sem conflito determinado.',D:'O disco torna a terra uma força viva e giratória, mais do que matéria parada.'};
const minorNotes={
 W:['A vontade se afirma como força que abre espaço.','O impulso inicial se organiza em direção e continuidade.','A energia encontra um ponto de repouso e conclusão provisória.','Forças rivais disputam a mesma direção.','A vitória dá forma pública ao esforço.','A coragem precisa persistir apesar da resistência.','A ação se acelera e atravessa o espaço.','A força se sustenta contra pressões repetidas.','O excesso de força passa a pesar como obrigação.'],
 C:['A divisão encontra uma resposta no vínculo.','O afeto se multiplica e transborda.','O conforto pode se fechar em si e perder movimento.','Uma expectativa afetiva encontra sua frustração.','A harmonia reaparece depois da perda.','O prazer se dispersa quando perde medida.','O fluxo emocional perde vigor e direção.','A satisfação toma uma forma estável.','A plenitude pode se tornar estagnação.'],
 S:['A tensão do ar alcança uma paz ainda delicada.','Uma lâmina rompe uma relação antes equilibrada.','A pausa organiza o conflito sem encerrá-lo.','A vitória de uma ideia cobra uma derrota concreta.','O intelecto encontra clareza e método.','Uma estratégia falha por falta de força para se sustentar.','Vozes e interferências impedem uma linha de ação.','O pensamento se torna agressão e sofrimento.','Uma estrutura mental chega ao ponto de ruína.'],
 D:['A matéria muda sem perder sua continuidade.','O trabalho ganha forma pela construção paciente.','A estrutura oferece estabilidade e controle.','A segurança material se transforma em preocupação.','Os recursos encontram uma distribuição favorável.','O esforço não produz o resultado esperado.','A prudência observa tempo, método e cultivo.','O ganho aparece como fruto de continuidade.','A riqueza se torna forma acumulada e concluída.']
};
let cardModal,cardFocus;
const majorCode=i=>`T-${String(i).padStart(2,'0')}`;
const numberedCode=(s,n)=>`${s}-${n===1?'10':n===10?'0A':String(n).padStart(2,'0')}`;
function suitCards(s){return [1,2,3,4,5,6,7,8,9,10].map(n=>numberedCode(s,n)).concat(['KN','QU','PN','PS'].map(r=>`${s}-${r}`))}
function related(codes){
 const target=$('#knowledge-cards');if(!target)return;
 const unique=[...new Set(codes)];target.innerHTML=`<h3>CARTAS RELACIONADAS <span>${unique.length}</span></h3><p class="related-card-hint">Passe o cursor para ver o nome. Clique para ampliar.</p><div class="related-card-grid">${unique.map(code=>{const info=config.cardInfo(code),src=config.mediaCard(code);return `<button type="button" class="related-card" data-card-code="${esc(code)}" data-name="${esc(info.name)}" aria-label="Abrir ${esc(info.name)}" title="${esc(info.name)}">${src?`<img src="${esc(src)}" alt="" loading="lazy">`:'<span class="card-missing">✳</span>'}</button>`}).join('')}</div>`;
 $$('[data-card-code]',target).forEach(b=>b.onclick=()=>showCard(b.dataset.cardCode,b));
}
function cardText(code){
 const [s,r]=code.split('-'),info=config.cardInfo(code);
 if(s==='T'){
  const n=+r,p=config.paths.find(path=>path[3]===n),letter=p?.[0]||config.majors[n][0],astro=config.majors[n][1];
  return {association:`Arcano Maior · ${letter} · ${astro}`,body:`<p>${majorNotes[n]}</p><p>No sistema apresentado por Crowley, esta carta ocupa um caminho da Árvore e articula a letra <b>${letter}</b> à correspondência <b>${astro}</b>. Observe como Frieda Harris transforma essas relações em cor, gesto e composição.</p><p><b>Para escrever:</b> ${esc(config.majors[n][2])}. Que acontecimento concreto tornaria essa força visível?</p>`,source:'Aleister Crowley, O Livro de Thoth · seção dos Arcanos Maiores'}
 }
 const rank=r==='10'?1:r==='0A'?10:+r,element=suitElements[s],seph=rank<=10?config.sefirot[rank-1]?.[0]:null,decan=rank>=2&&rank<=10?decans[s][rank-2]:null;
 let association=`${suitNames[s]} · ${element}`;
 if(seph)association+=` · ${rank} · ${seph}`;
 if(decan)association+=` · ${decan}`;
 let body=`<p>No <i>Livro de Thoth</i>, Crowley chama esta carta de <b>${info.name}</b> e a situa no naipe de ${suitNames[s]}, associado a <b>${element}</b>. ${seph?`Seu número corresponde a <b>${seph}</b> na Árvore. `:''}${decan?`O decanato é <b>${decan}</b>. `:''}</p><p>${minorNotes[s]?.[rank-2]||esc(info.keys[2])} Observe como Harris traduz essa relação em formas, direção e cor. Que mudança concreta ela produziria em uma cena?</p>`;
 if(rank===1)body=`<p>Crowley apresenta os ases como <b>raízes dos poderes dos elementos</b>. O Ás de ${suitNames[s]} é a potência inicial de <b>${element}</b>, antes de assumir uma situação ou conflito específico. Na Árvore, essa posição corresponde a <b>Kether</b>.</p><p>${aceNotes[s]} Que ação poderia nascer dessa energia?</p>`;
 if(['KN','QU','PN','PS'].includes(r))body=`<p><b>${info.name}</b> é uma das quatro figuras da corte de ${suitNames[s]}. Crowley descreve essas figuras como modos distintos de manifestação do elemento <b>${element}</b>.</p><p>Na imagem de Frieda Harris, observe postura, direção e objetos. Como pista de escrita, esta figura sugere <b>${esc(info.keys[2])}</b>.</p>`;
 return {association,body,source:'Aleister Crowley, O Livro de Thoth · seção das cartas menores e figuras da corte'}
}
function ensureCardModal(){if(cardModal)return;cardModal=document.createElement('section');cardModal.id='tree-card-modal';cardModal.className='tree-card-modal';cardModal.hidden=true;cardModal.setAttribute('role','dialog');cardModal.setAttribute('aria-modal','true');cardModal.setAttribute('aria-labelledby','tree-card-title');cardModal.innerHTML='<div class="tree-card-shade" data-close-card></div><article class="tree-card-dialog"><button class="tree-card-close" type="button" data-close-card aria-label="Fechar carta">×</button><div class="tree-card-image-wrap" id="tree-card-image"></div><div class="tree-card-copy"><p class="tree-card-eyebrow">TAROT DE THOTH · FRIEDA HARRIS</p><h2 id="tree-card-title"></h2><p id="tree-card-association" class="tree-card-association"></p><div id="tree-card-body" class="tree-card-body"></div><p id="tree-card-source" class="tree-card-source"></p></div></article>';document.body.append(cardModal);$$('[data-close-card]',cardModal).forEach(b=>b.onclick=hideCard);cardModal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();hideCard()}if(e.key==='Tab'){const a=$$('[data-close-card]',cardModal).filter(x=>x!==$('.tree-card-shade',cardModal));if(a.length===1){e.preventDefault();a[0].focus()}}})}
function showCard(code,trigger){ensureCardModal();const info=config.cardInfo(code),src=config.mediaCard(code),detail=cardText(code),entry=config.cardSources?.(code),evidence=[entry,entry?.crowley,entry?.duquette].filter(Boolean);cardFocus=trigger;$('#tree-card-title',cardModal).textContent=info.name;$('#tree-card-association',cardModal).textContent=detail.association;$('#tree-card-body',cardModal).innerHTML=detail.body+(evidence.length?`<div class="tree-card-evidence"><h3>Trechos das fontes</h3>${evidence.map(item=>`<details><summary>${esc(item.book)} · PDF p. ${item.page}${item.pageEnd?`–${item.pageEnd}`:''}</summary><blockquote lang="${esc(item.language||'en')}">${esc(item.excerpt)}</blockquote>${item.translation?`<p class="tree-card-translation">Tradução: ${esc(item.translation)}</p>`:''}${item.note?`<p class="tree-card-note">${esc(item.note)}</p>`:''}</details>`).join('')}</div>`:'');$('#tree-card-source',cardModal).textContent=evidence.length?'Trechos curtos das edições consultadas. A proposta de escrita acima é uma interpretação didática.':detail.source;$('#tree-card-image',cardModal).innerHTML=src?`<img src="${esc(src)}" alt="${esc(info.name)} do Tarot de Thoth">`:'<div class="tree-card-unavailable">Imagem indisponível nesta sessão.</div>';cardModal.hidden=false;$('#knowledge').inert=true;$('.tree-card-close',cardModal).focus()}
function hideCard(){if(!cardModal||cardModal.hidden)return;cardModal.hidden=true;$('#knowledge').inert=false;cardFocus?.focus?.()}
function showInfo(kind,i){
 const {paths,sefirot,majorNames,majors,openKnowledge,sources}=config;
 const present=(title,body,links,category,codes)=>{openKnowledge(title,body,links,category);related(codes)};
 if(kind==='node'){const s=sefirot[i],n=i+1;present(`${n} · ${s[0]}`,`<p><b>${hebrewSefirot[i]} · ${s[0]}</b> é o ${n}º centro da Árvore. Neste mapa, é um ponto de passagem entre caminhos; como pista narrativa, sugere ${esc(s[3])}.</p><p>Nas cartas menores do Thoth, o número ${n} reaparece nos quatro naipes. Compare como Paus, Copas, Espadas e Discos dão formas diferentes à mesma posição numérica. A sephirah organiza o número; o naipe muda a qualidade da cena.</p><p><b>Para escrever:</b> escolha uma carta ${n} de cada naipe. O que muda quando a mesma situação passa de impulso a afeto, conflito ou matéria?</p>`,[sources.crowleyTree,sources.crowleyNumbers,sources.fortune],'SEPHIRAH · NÚMERO · NAIPES',suitCodes.map(suit=>numberedCode(suit,n)));return}
 if(kind==='suit'){const s=suits[i],code={Paus:'W',Copas:'C',Espadas:'S',Discos:'D'}[s.name];present(`${s.name} · ${s.element}`,`<p>No Tarot de Thoth, <b>${s.name}</b> corresponde a <b>${s.element}</b>. Nesta camada, a faixa <b>${s.span}</b> aproxima o naipe da divisão elementar dos planos da Árvore descrita por Crowley.</p><p>É uma <b>comparação visual</b>: as cartas de ${s.name} percorrem todos os números de 1 a 10. A faixa não afirma que o naipe exista apenas nessa parte da Árvore.</p><p><b>Para escrever:</b> ${s.prompt} Como a resposta muda quando você observa outro naipe?</p>`,[sources.crowleySuits,sources.crowleyTree],'NAIPE · ELEMENTO · PLANO',suitCards(code));return}
 const p=paths[i],name=p[0],major=majorNames[p[3]],astro=majors[p[3]][1],a=sefirot[p[1]][0],b=sefirot[p[2]][0],head=`${glyphs[i]} · ${name}`;
 const intro=`<p>O caminho liga <b>${a}</b> a <b>${b}</b>. Na atribuição do Tarot de Thoth, ele reúne a letra <b>${glyphs[i]} (${name})</b>, o Arcano Maior <b>${major}</b> e <b>${astro}</b>.</p>`;
 const value=`<p>Na numeração tradicional das letras hebraicas, <b>${glyphs[i]} vale ${values[i]}</b>. Esse valor pertence à letra na escrita hebraica. A semelhança sonora com uma letra latina, por si só, não estabelece a mesma soma para uma palavra em português.</p>`;
 const nuance=(name==='Heh'||name==='Tzaddi')?'<p>Este par segue a troca Heh–Tzaddi proposta por Crowley: aqui Heh se liga à Estrela e Tzaddi ao Imperador. Outros diagramas herméticos podem apresentar a atribuição anterior.</p>':'';
 const prompt=`<p><b>Para escrever:</b> imagine a passagem entre ${a} e ${b}. O que a carta acrescenta à cena? Que clima ${astro} dá à escolha do personagem?</p>`;
 const body=intro+(kind==='value'||kind==='letter'?value:'')+nuance+prompt;
 const title=kind==='tarot'?major:kind==='astro'?`${astro} · ${major}`:kind==='value'?`${glyphs[i]} = ${values[i]}`:kind==='letter'?head:`${a} → ${b}`;
 const category={path:'CAMINHO · ÁRVORE',letter:'LETRA HEBRAICA · CABALA HERMÉTICA',tarot:'ARCANO MAIOR · TARÔ',astro:'CORRESPONDÊNCIA ASTROLÓGICA',value:'GEMATRIA · VALOR DA LETRA'}[kind]||'ÁRVORE DA VIDA';
 let cards=[majorCode(p[3])];if(kind==='astro')for(const suit of suitCodes){for(let rank=2;rank<=10;rank++){const decan=decans[suit][rank-2];if(decan.includes(astro))cards.push(numberedCode(suit,rank))}}
 present(title,body,[sources.crowleyPaths,sources.crowleyTree,sources.crowleyGematria],category,cards)
}
window.ArcanaTree={preview,setup,configure:(opts)=>{config=opts},showInfo,showCard,related,isOpen:()=>opened};
})();
