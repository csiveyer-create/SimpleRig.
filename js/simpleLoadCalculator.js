(()=>{
'use strict';
const q=id=>document.getElementById(id);
let travellingAnswer=null;
function visible2DItems(){
  return [...document.querySelectorAll('#drawingLayer g, #drawing g')].filter(el=>{
    const text=((el.dataset.name||'')+' '+(el.dataset.assetId||'')+' '+(el.dataset.role||'')+' '+(el.id||'')).toLowerCase();
    return text && !el.closest('#selectionLayer') && !el.closest('defs')
  })
}
function itemKind(el){
  const t=((el.dataset.name||'')+' '+(el.dataset.assetId||'')+' '+(el.dataset.role||'')+' '+(el.id||'')).toLowerCase();
  if(t.includes('performer')||t.includes('load'))return 'load';
  if(t.includes('winch'))return 'winch';
  if(t.includes('anchor')||t.includes('tie')||t.includes('truss'))return 'anchor';
  if(t.includes('pulley'))return el.dataset.operatingRole==='movingPulley'||el.dataset.moving==='true'?'movingPulley':'pulley';
  if(t.includes('shackle')||t.includes('carabiner'))return 'connector';
  return 'other'
}
function parseWll(el){
  const raw=el.dataset.wll||el.dataset.WLL||'';
  const m=String(raw).match(/[\d.]+/);return m?Number(m[0]):0
}
function inferRatio(items){
  const moving=items.filter(el=>itemKind(el)==='movingPulley').length;
  const selectedOperating=items.find(el=>el.dataset.operating==='true');
  const supporting=Number(selectedOperating?.dataset.supportingParts)||0;
  if(supporting>1)return Math.max(1,Math.round(supporting));
  if(moving>0)return Math.min(6,Math.max(2,moving*2));
  const pulleyCount=items.filter(el=>itemKind(el)==='pulley').length;
  if(pulleyCount===0)return 1;
  if(travellingAnswer===true)return Math.min(6,Math.max(2,pulleyCount+1));
  if(travellingAnswer===false)return 1;
  q('simpleRecognitionQuestion').hidden=false;
  return null
}
function statusFor(load,wll){
  if(!wll)return {label:'UNRATED',level:'caution'};
  const pct=load/wll;
  if(pct>1)return {label:'OVER WLL',level:'over'};
  if(pct>.8)return {label:'NEAR WLL',level:'caution'};
  return {label:'SAFE',level:'safe'}
}
function componentName(el,index){
  return el.dataset.name||el.getAttribute('aria-label')||el.id||`Component ${index+1}`
}
function syncLegacy(load,ratio,pull){
  if(q('loadWeight'))q('loadWeight').value=load;
  if(q('mainRatio'))q('mainRatio').value=String(ratio);
  if(q('assistRatio'))q('assistRatio').value='1';
  if(q('efficiency'))q('efficiency').value='85';
  if(q('sr3Load'))q('sr3Load').value=load;
  if(q('sr3Ratio'))q('sr3Ratio').value=ratio;
  if(q('sr3Efficiency'))q('sr3Efficiency').value='85';
  if(q('practicalPull'))q('practicalPull').textContent=pull.toFixed(1)+' kgf';
  if(q('sr3Pull'))q('sr3Pull').textContent=pull.toFixed(1)+' kg';
}
function calculate(){
  const load=Math.max(0,Number(q('simpleLoadKg').value)||0);
  const items=visible2DItems();
  const manual=q('simpleRecognitionMode').value==='manual';
  let ratio=manual?Number(q('simpleManualRatio').value)||1:inferRatio(items);
  if(ratio===null)return;
  q('simpleRecognitionQuestion').hidden=true;
  const efficiency=.85;
  const tension=load/(ratio*efficiency);
  const pullingEnd=q('simplePullEnd').value;
  const rows=[];
  rows.push({name:'Pull line',load:tension,wll:0,level:'safe',label:'CALCULATED'});
  rows.push({name:'Load / performer',load,wll:0,level:'safe',label:'APPLIED LOAD'});
  items.forEach((el,index)=>{
    const kind=itemKind(el);if(kind==='other'||kind==='load')return;
    let componentLoad=tension;
    if(kind==='pulley'||kind==='anchor'||kind==='winch')componentLoad=tension*2;
    if(kind==='movingPulley')componentLoad=load;
    if(kind==='connector')componentLoad=Math.max(tension,load/Math.max(1,ratio));
    const wll=parseWll(el),status=statusFor(componentLoad,wll);
    rows.push({name:componentName(el,index),load:componentLoad,wll,level:status.level,label:status.label,el})
  });
  if(pullingEnd==='anchor')rows.push({name:'Fixed pulling end',load:tension,wll:0,level:'caution',label:'CHECK DIRECTION'});
  const highest=Math.max(...rows.map(r=>r.load),0);
  const rated=rows.filter(r=>r.wll);
  const overall=rated.some(r=>r.load>r.wll)?{label:'OVERLOADED',level:'over'}:
    rated.some(r=>r.load/r.wll>.8)?{label:'CHECK MARGINS',level:'caution'}:{label:rated.length?'SAFE':'LOADS CALCULATED',level:'safe'};
  q('simpleResultLoad').textContent=load.toFixed(1)+' kg';
  q('simpleResultMA').textContent=ratio.toFixed(0)+' : 1';
  q('simpleResultPull').textContent=tension.toFixed(1)+' kgf';
  q('simpleResultHighest').textContent=highest.toFixed(1)+' kgf';
  q('simpleResultStatus').textContent=overall.label;
  const statusCard=q('simpleResultStatus').closest('.simple-status-card');statusCard.className='simple-status-card '+overall.level;
  const host=q('simpleDistributionList');host.innerHTML='<strong>Weight distribution</strong>';
  rows.forEach(row=>{
    const div=document.createElement('button');div.type='button';div.className='force-row';
    div.innerHTML=`<span>${row.name}${row.wll?`<small> WLL ${row.wll} kg</small>`:''}</span><strong>${row.load.toFixed(1)} kgf</strong><span class="force-chip ${row.level}">${row.label}</span>`;
    if(row.el)div.addEventListener('click',()=>{row.el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:0,clientY:0}));row.el.dataset.forceLevel=row.level});
    host.appendChild(div);
    if(row.el)row.el.dataset.forceLevel=row.level
  });
  q('simple3dLoad').textContent=load.toFixed(1)+' kg';
  q('simple3dMA').textContent=ratio.toFixed(0)+' : 1';
  q('simple3dPull').textContent=tension.toFixed(1)+' kgf';
  syncLegacy(load,ratio,tension);
  window.dispatchEvent(new CustomEvent('simplerig-simple-load-calculated',{detail:{load,ratio,tension,rows}}))
}
q('simpleRecognitionMode').addEventListener('change',e=>{q('simpleManualRatioRow').hidden=e.target.value!=='manual';q('simpleRecognitionQuestion').hidden=true});
q('simpleCalculateBtn').addEventListener('click',calculate);
q('simpleLoadKg').addEventListener('keydown',e=>{if(e.key==='Enter')calculate()});
document.querySelectorAll('[data-travelling]').forEach(b=>b.addEventListener('click',()=>{travellingAnswer=b.dataset.travelling==='yes';calculate()}));
q('openSimpleCalculator3d')?.addEventListener('click',()=>{q('switch2d')?.click();const panel=q('simpleLoadCalculator')?.closest('.collapsible-panel');if(panel?.classList.contains('collapsed'))panel.querySelector('.collapsible-titlebar button')?.click();q('simpleLoadKg')?.focus()});
calculate();
})();
