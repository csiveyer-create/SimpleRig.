(()=>{
'use strict';
const NS='http://www.w3.org/2000/svg';
const q=id=>document.getElementById(id);
const svg=q('rigCanvas'), drawLayer=q('drawingLayer'), rigLayer=q('rigLineLayer');
if(!svg||!drawLayer||!rigLayer)return;
const state={nodes:[],rope:null,live:false,unit:'m',scale:.02,measureMode:false,measurePts:[],measureGroup:null,pointA:null,pointB:null};
const E={anchor:'Anchor',pulley:'Pulley',travellingPulley:'Travelling pulley',freeEnd:'Free end',haulEnd:'Hauling end',performer:'Performer',load:'Load'};
const svgel=(n,a={})=>{const e=document.createElementNS(NS,n);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));return e};
function pxy(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
function pos(n){const m=n.g.transform.baseVal.consolidate()?.matrix;return{x:m?.e||0,y:m?.f||0}}
function setPos(n,x,y){n.x=x;n.y=y;n.g.setAttribute('transform',`translate(${x} ${y})`)}
function metres(v){return v*state.scale}
function fmt(m){const f=state.unit==='mm'?m*1000:state.unit==='cm'?m*100:m;return `${f.toFixed(state.unit==='m'?2:1)} ${state.unit}`}
function nodeById(id){return state.nodes.find(n=>n.id===id)}
function makeNode(type,x,y,label,group=null){
 const id='N'+(state.nodes.length+1),g=svgel('g',{class:'constraint-object','data-id':id,'data-role':type,transform:`translate(${x} ${y})`});
 if(type==='performer'||type==='load')g.innerHTML=`<circle cy="-45" r="15" class="constraint-node"/><path d="M0-28 L0 25 M0-10 L-24 8 M0-10 L24 8 M0 25 L-18 60 M0 25 L18 60" class="constraint-performer"/><text x="22" y="-42" class="constraint-label">${label}</text>`;
 else g.innerHTML=`<circle r="14" class="constraint-node"/><circle r="4" fill="#fff"/><text x="20" y="5" class="constraint-label">${label}</text>`;
 drawLayer.appendChild(g);const n={id,type,label,x,y,g,group,axis:type==='performer'||type==='load'||type==='travellingPulley'?'y':'free'};state.nodes.push(n);bindDrag(n);return n
}
function pathLength(points){let L=0;for(let i=1;i<points.length;i++)L+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);return L}
function updateRope(){if(!state.rope)return;const pts=state.rope.order.map(id=>pos(nodeById(id)));state.rope.path.setAttribute('d','M '+pts.map(p=>`${p.x} ${p.y}`).join(' L '));state.rope.label.setAttribute('x',pts[0].x+8);state.rope.label.setAttribute('y',pts[0].y-14);state.rope.label.textContent=`${fmt(metres(state.rope.length))} fixed rope`;sync3D()}
function makeRope(order){if(state.rope?.group)state.rope.group.remove();const group=svgel('g',{'data-core-rope':'1'}),path=svgel('path',{class:'constraint-rope'}),label=svgel('text',{class:'constraint-label'});group.append(path,label);rigLayer.appendChild(group);const pts=order.map(id=>pos(nodeById(id)));state.rope={order,length:pathLength(pts),group,path,label};updateRope()}
function chooseResponse(driver){
 const nodes=state.nodes;
 if(driver.type==='freeEnd'||driver.type==='haulEnd')return nodes.find(n=>['performer','load','travellingPulley'].includes(n.type)&&n!==driver)||nodes.find(n=>n.type==='freeEnd'&&n!==driver);
 return nodes.find(n=>n.type==='freeEnd'&&n!==driver)||nodes.find(n=>n.type==='haulEnd'&&n!==driver)||nodes.find(n=>['performer','load'].includes(n.type)&&n!==driver);
}
function lengthAt(response,value){const old=response.y;response.y=value;const pts=state.rope.order.map(id=>{const n=nodeById(id);return n===response?{x:n.x,y:value}:{x:n.x,y:n.y}});response.y=old;return pathLength(pts)}
function solve(driver,oldPositions){
 if(!state.live||!state.rope)return;
 const target=state.rope.length,response=chooseResponse(driver);if(!response)return;
 // Connected objects sharing a group move together. Solver varies the group's vertical displacement.
 const groupNodes=response.group?state.nodes.filter(n=>n.group===response.group):[response];const initial=groupNodes.map(n=>({n,y:n.y}));
 const calc=d=>{groupNodes.forEach((o,i)=>o.y=initial[i].y+d);const L=pathLength(state.rope.order.map(id=>{const n=nodeById(id);return{x:n.x,y:n.y}}));groupNodes.forEach((o,i)=>o.y=initial[i].y);return L-target};
 let lo=-1000,hi=1000,flo=calc(lo),fhi=calc(hi);if(flo*fhi>0){ // Newton fallback
   let d=0;for(let i=0;i<25;i++){const f=calc(d),eps=.1,df=(calc(d+eps)-f)/eps;if(Math.abs(df)<1e-7)break;d-=f/df;if(!Number.isFinite(d))break}groupNodes.forEach((o,i)=>setPos(o,o.x,initial[i].y+d));updateRope();return;
 }
 for(let i=0;i<50;i++){const mid=(lo+hi)/2,f=calc(mid);if(flo*f<=0){hi=mid;fhi=f}else{lo=mid;flo=f}}
 const d=(lo+hi)/2;groupNodes.forEach((o,i)=>setPos(o,o.x,initial[i].y+d));updateRope();
}
function bindDrag(n){let drag=null,old=null;n.g.addEventListener('pointerdown',e=>{if(state.measureMode)return;e.stopPropagation();const p=pxy(e);drag={dx:p.x-n.x,dy:p.y-n.y};old=state.nodes.map(o=>({o,x:o.x,y:o.y}));n.g.classList.add('dragging');n.g.setPointerCapture(e.pointerId)});n.g.addEventListener('pointermove',e=>{if(!drag)return;const p=pxy(e),nx=p.x-drag.dx,ny=p.y-drag.dy;const dx=nx-n.x,dy=ny-n.y;if(n.group){state.nodes.filter(o=>o.group===n.group).forEach(o=>setPos(o,o.x+dx,o.y+dy))}else setPos(n,nx,ny);solve(n,old);updateRope()});n.g.addEventListener('pointerup',()=>{drag=null;n.g.classList.remove('dragging')})}
function clearCore(){state.nodes.forEach(n=>n.g.remove());state.nodes=[];state.rope?.group?.remove();state.rope=null}
function parseRatio(t){const m=t.match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/);return m?[+m[1],+m[2]]:[1,1]}
function build(text){clearCore();const [a,b]=parseRatio(text);const advantage=a/b;const pulleyCount=Math.max(1,Math.min(6,Math.round(advantage>=1?a:b)));const performer=makeNode('performer',720,520,'Performer','moving-load');const travelling=makeNode('travellingPulley',720,405,'Travelling pulley','moving-load');const anchor=makeNode('anchor',170,150,'Anchor');const order=[anchor.id];for(let i=0;i<pulleyCount;i++){const p=makeNode(i===pulleyCount-1?'travellingPulley':'pulley',310+i*105,180+(i%2)*160,`Pulley ${i+1}`,i===pulleyCount-1?'moving-load':null);order.push(p.id)}order.push(travelling.id);const free=makeNode('freeEnd',900,180,'Pull end');order.push(free.id);makeRope(order);q('metricReadout').textContent=`Built ${a}:${b} · rope ${fmt(metres(state.rope.length))}`;sync3D()}
q('buildThisBtn')?.addEventListener('click',()=>{const t=q('buildThisInput').value.trim();if(t)build(t)});q('buildThisInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')q('buildThisBtn').click()});
q('metricUnit')?.addEventListener('change',e=>{state.unit=e.target.value;updateRope();update3DMeasure()});q('metresPerCanvasUnit')?.addEventListener('change',e=>{state.scale=Math.max(.0001,+e.target.value||.02);updateRope()});
q('liveRopeToggle')?.addEventListener('click',()=>{state.live=!state.live;q('liveRopeToggle').classList.toggle('primary',state.live);q('liveRopeToggle').textContent=state.live?'Live Rope: On':'Live Rope: Off';window.dispatchEvent(new CustomEvent('simplerig-language-refresh'))});
function measureClick(e){if(!state.measureMode)return;const p=pxy(e);state.measurePts.push(p);if(state.measurePts.length===2){const [a,b]=state.measurePts,d=Math.hypot(b.x-a.x,b.y-a.y),g=svgel('g');g.innerHTML=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="measurement-line"/><circle cx="${a.x}" cy="${a.y}" r="5" class="measurement-end"/><circle cx="${b.x}" cy="${b.y}" r="5" class="measurement-end"/><text x="${(a.x+b.x)/2}" y="${(a.y+b.y)/2-8}" class="constraint-label">${fmt(metres(d))}</text>`;q('selectionLayer').appendChild(g);state.measureMode=false;state.measurePts=[];q('measure2dBtn').classList.remove('primary');q('metricReadout').textContent=`Distance ${fmt(metres(d))}`}}
svg.addEventListener('click',measureClick);q('measure2dBtn')?.addEventListener('click',()=>{state.measureMode=true;state.measurePts=[];q('measure2dBtn').classList.add('primary');q('metricReadout').textContent='Click two points'});
function sync3D(){if(!window.SimpleRig3D)return;const existing=window.SimpleRig3D.getState();const keep=(existing.objects||[]).filter(o=>!String(o.id).startsWith('SYNC-'));const objs=state.nodes.map(n=>({id:'SYNC-'+n.id,kind:n.type==='performer'||n.type==='load'?'performer':n.type.includes('pulley')?'single_pulley':n.type==='anchor'?'shackle':'rope_grab',name:n.label,category:'Synced 2D',x:(n.x-500)*state.scale,y:Math.max(0,(750-n.y)*state.scale),z:0,rx:0,ry:0,rz:0,scale:1,hidden:false,locked:false,model:n.label,wll:'—',mbs:'—',operating:false,operatingRole:n.type==='travellingPulley'?'movingPulley':n.type==='performer'||n.type==='load'?'load':n.type==='anchor'?'anchor':'haul',supportingParts:1,pullDirection:'haul'}));
 const ropeObjs=[];if(state.rope){for(let i=1;i<state.rope.order.length;i++){const a=nodeById(state.rope.order[i-1]),b=nodeById(state.rope.order[i]);ropeObjs.push({id:`SYNC-ROPE-${i}`,kind:'rig_rope_segment',name:`Rope segment ${i}`,category:'Synced 2D',ax:(a.x-500)*state.scale,ay:Math.max(0,(750-a.y)*state.scale),az:0,bx:(b.x-500)*state.scale,by:Math.max(0,(750-b.y)*state.scale),bz:0,x:0,y:0,z:0,rx:0,ry:0,rz:0,scale:1,hidden:false,locked:true,model:'Fixed rope',wll:'—',mbs:'—',operating:false,operatingRole:'other',supportingParts:1,pullDirection:'haul'})}}
 window.SimpleRig3D.setState({...existing,objects:[...keep,...ropeObjs,...objs]})}
q('switch3d')?.addEventListener('click',()=>setTimeout(sync3D,50));
function current3DPoint(){return{x:+q('sr3PX')?.value||0,y:+q('sr3PY')?.value||0,z:+q('sr3PZ')?.value||0}}
function update3DMeasure(){const r=q('measure3dReadout');if(!r)return;if(!state.pointA||!state.pointB){r.textContent=`A: ${state.pointA?JSON.stringify(state.pointA):'—'} · B: ${state.pointB?JSON.stringify(state.pointB):'—'}`;return}const dx=state.pointB.x-state.pointA.x,dy=state.pointB.y-state.pointA.y,dz=state.pointB.z-state.pointA.z;const trueD=Math.hypot(dx,dy,dz),horizontal=Math.hypot(dx,dz);r.innerHTML=`True distance: <strong>${fmt(trueD)}</strong><br>Horizontal: ${fmt(horizontal)}<br>Height difference: ${fmt(Math.abs(dy))}<br>Depth difference: ${fmt(Math.abs(dz))}`}
q('setMeasureA')?.addEventListener('click',()=>{state.pointA=current3DPoint();update3DMeasure()});q('setMeasureB')?.addEventListener('click',()=>{state.pointB=current3DPoint();update3DMeasure()});q('clearMeasure')?.addEventListener('click',()=>{state.pointA=state.pointB=null;update3DMeasure()});
window.SimpleRigCore={getState:()=>({nodes:state.nodes.map(n=>({id:n.id,type:n.type,label:n.label,x:n.x,y:n.y,group:n.group})),rope:state.rope?{order:[...state.rope.order],length:state.rope.length}:null,scale:state.scale,unit:state.unit}),build};
})();
