(()=>{
'use strict';
const q=id=>document.getElementById(id),svg=q('harnessSvg'),items=q('harnessItems'),figure=q('harnessFigure');
let selected=null,drag=null,seq=1,pendingTool=null,rotation=0,backView=false;
function showHarness(){q('workspace2d').classList.add('hidden-workspace');q('workspace3d').classList.remove('active');q('workspaceHarness').classList.add('active');q('switch2d').classList.remove('active');q('switch3d').classList.remove('active');q('switchHarness').classList.add('active')}
function leaveHarness(){q('workspaceHarness').classList.remove('active');q('switchHarness').classList.remove('active')}
q('switchHarness').addEventListener('click',showHarness);q('switch2d').addEventListener('click',leaveHarness);q('switch3d').addEventListener('click',leaveHarness);
document.querySelectorAll('input[name="harnessSex"]').forEach(r=>r.addEventListener('change',()=>{q('maleFigure').style.display=r.value==='male'&&r.checked?'':'none';q('femaleFigure').style.display=r.value==='female'&&r.checked?'':'none'}));
[['hFullBody','fullBodyHarness'],['hLegCuffs','legCuffs'],['hAnkleCuffs','ankleCuffs'],['hLastResort','lastResortHarness'],['hMartialArts','martialArtsHarness']].forEach(([i,l])=>q(i).addEventListener('change',()=>q(l).style.display=q(i).checked?'':'none'));
function point(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
function bind(g){
  g.classList.add('harness-item');
  g.addEventListener('pointerdown',e=>{
    if(pendingTool)return;
    e.stopPropagation();selected=g;const p=point(e),m=g.transform.baseVal.consolidate()?.matrix;
    drag={g,sx:p.x,sy:p.y,x:m?.e||0,y:m?.f||0};g.classList.add('dragging');g.setPointerCapture(e.pointerId)
  });
  g.addEventListener('pointermove',e=>{if(!drag||drag.g!==g)return;const p=point(e);g.setAttribute('transform',`translate(${drag.x+p.x-drag.sx} ${drag.y+p.y-drag.sy})`)});
  g.addEventListener('pointerup',()=>{g.classList.remove('dragging');drag=null})
}
function setHint(text){q('harnessActionHint').textContent=text}
function setPending(tool){
  pendingTool=tool;svg.classList.toggle('harness-drop-target',!!tool);
  setHint(tool==='shackle'?'Select the harness attachment point. The shackle will drop into place.':tool==='leader'?'Select the performer or harness point where the leader begins.':'Choose a tool, then select a point on the harness.')
}
function shackleMarkup(){
  return '<path d="M-25 9V-10c0-33 50-33 50 0V9" fill="none" stroke="#fff" stroke-width="13"/><path d="M-34 10H34" stroke="#fff" stroke-width="13"/><path d="M-25 9V-10c0-33 50-33 50 0V9" fill="none" stroke="#252a2e" stroke-width="9"/><path d="M-34 10H34" stroke="#252a2e" stroke-width="9"/><circle cx="-27" cy="10" r="7" fill="#aeb5ba" stroke="#fff" stroke-width="2"/><circle cx="27" cy="10" r="7" fill="#aeb5ba" stroke="#fff" stroke-width="2"/>'
}
function createShackleAt(x,y){
  const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.dataset.id='h-'+seq++;g.classList.add('harness-shackle-drop');
  g.setAttribute('transform',`translate(${x} ${y-150})`);g.innerHTML=shackleMarkup();items.appendChild(g);bind(g);selected=g;
  const start=performance.now(),duration=480;
  function step(now){const t=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-t,3),bounce=t<.82?0:Math.sin((t-.82)/.18*Math.PI)*10;g.setAttribute('transform',`translate(${x} ${y-150+150*ease-bounce})`);if(t<1)requestAnimationFrame(step)}
  requestAnimationFrame(step)
}
function createLeaderAt(x,y){
  const width=Number(q('harnessLeaderWidth').value)||3,length=Math.max(.05,Number(q('harnessLeaderLength').value)||.5);
  const dx=x-350,dy=y-430,mag=Math.hypot(dx,dy)||1,visual=Math.max(45,Math.min(230,length*150));
  const ex=x+dx/mag*visual,ey=y+dy/mag*visual;
  const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.dataset.id='h-'+seq++;g.classList.add('harness-leader');
  g.innerHTML=`<line x1="${x}" y1="${y}" x2="${ex}" y2="${ey}" stroke="#fff" stroke-width="${width+3}" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${ex}" y2="${ey}" stroke="#555d64" stroke-width="${width}" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${width+3}" fill="#c9cdd0" stroke="#fff" stroke-width="2"/><circle cx="${ex}" cy="${ey}" r="${width+4}" fill="#111" stroke="#fff" stroke-width="2"/><text x="${ex+9}" y="${ey-7}" fill="#fff" font-size="14" font-family="Arial">${width} mm · ${length.toFixed(2)} m</text>`;
  items.appendChild(g);bind(g);selected=g
}
function esc(v){return String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function addNote(){const text=prompt('Note text:','Attachment point');if(!text)return;const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.dataset.id='h-'+seq++;g.setAttribute('transform','translate(420 260)');g.innerHTML=`<rect x="-10" y="-28" width="180" height="48" rx="8" fill="#15181b" stroke="#fff" stroke-width="2"/><text x="5" y="2" font-family="Arial" font-size="17" fill="#fff">${esc(text.slice(0,22))}</text>`;items.appendChild(g);bind(g);selected=g}
function updateFigureView(){
  const flip=backView?-1:1;
  figure.setAttribute('transform',`translate(350 430) rotate(${rotation}) scale(${flip} 1) translate(0 -392)`);
  q('harnessViewLabel').textContent=`${backView?'Back':'Front'} · ${((rotation%360)+360)%360}°`
}
svg.addEventListener('pointerdown',e=>{
  if(!pendingTool)return;
  const p=point(e);
  if(pendingTool==='shackle')createShackleAt(p.x,p.y);else createLeaderAt(p.x,p.y);
  setPending(null)
});
q('addHarnessShackle').addEventListener('click',()=>setPending('shackle'));
q('addHarnessLeader').addEventListener('click',()=>setPending('leader'));
q('addHarnessNote').addEventListener('click',addNote);
q('deleteHarnessItem').addEventListener('click',()=>{selected?.remove();selected=null});
q('clearHarnessSheet').addEventListener('click',()=>{if(confirm('Remove all shackles, leaders and notes?'))items.innerHTML=''});
q('harnessRotateLeft').addEventListener('click',()=>{rotation-=90;updateFigureView()});
q('harnessRotateRight').addEventListener('click',()=>{rotation+=90;updateFigureView()});
q('harnessFrontBack').addEventListener('click',()=>{backView=!backView;updateFigureView()});
window.SimpleRigHarness={
 getState(){return{sex:document.querySelector('input[name="harnessSex"]:checked')?.value||'male',options:{full:q('hFullBody').checked,legs:q('hLegCuffs').checked,ankles:q('hAnkleCuffs').checked,last:q('hLastResort').checked,martial:q('hMartialArts').checked},title:q('harnessTitle').value,performer:q('harnessPerformerName').value,notes:q('harnessGeneralNotes').value,items:items.innerHTML,rotation,backView}},
 setState(s){if(!s)return;const sex=document.querySelector(`input[name="harnessSex"][value="${s.sex||'male'}"]`);if(sex){sex.checked=true;sex.dispatchEvent(new Event('change'))}const map={full:'hFullBody',legs:'hLegCuffs',ankles:'hAnkleCuffs',last:'hLastResort',martial:'hMartialArts'};Object.entries(map).forEach(([k,id])=>{q(id).checked=!!s.options?.[k];q(id).dispatchEvent(new Event('change'))});q('harnessTitle').value=s.title||'Harness Reference';q('harnessPerformerName').value=s.performer||'';q('harnessGeneralNotes').value=s.notes||'';rotation=Number(s.rotation)||0;backView=!!s.backView;updateFigureView();items.innerHTML=s.items||'';items.querySelectorAll('.harness-item').forEach(bind)},
 isActive(){return q('workspaceHarness').classList.contains('active')},show:showHarness
};
updateFigureView();
})();
