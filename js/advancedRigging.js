(()=>{
'use strict';
const NS='http://www.w3.org/2000/svg';
const q=id=>document.getElementById(id);
const svg=q('rigCanvas'),rigLayer=q('rigLineLayer'),drawLayer=q('drawingLayer');
if(!svg||!rigLayer||!drawLayer)return;
let snapping=true,routeMode=false,routePoints=[],physicsActive=false,ropeLocked=false,ropeLength=0,arStream=null;
const state={objects:[],rope:null};
function pt(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
function status(s){q('advancedStatus').textContent=s}
function el(name,attrs={}){const n=document.createElementNS(NS,name);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n}
function openDialog(title,body){q('advancedDialogTitle').textContent=title;q('advancedDialogBody').innerHTML=body;q('advancedToolDialog').showModal()}
q('advancedDialogClose').onclick=()=>q('advancedToolDialog').close();
q('advancedToolsBtn').onclick=()=>q('advancedRigDock').scrollIntoView({behavior:'smooth',block:'start'});
q('collapseAdvancedDock').onclick=()=>{const d=q('advancedRigDock');d.classList.toggle('collapsed');q('collapseAdvancedDock').textContent=d.classList.contains('collapsed')?'+':'−'};

function addPoint(x,y,type='point',label=''){
 const g=el('g',{'class':'advanced-object physics-node','data-advanced-type':type,transform:`translate(${x} ${y})`});
 g.innerHTML=`<circle r="13" fill="#242a2f" stroke="#fff" stroke-width="3"/><circle r="4" fill="#fff"/>${label?`<text x="18" y="5" class="advanced-label">${label}</text>`:''}`;
 drawLayer.appendChild(g);makeDraggable(g);state.objects.push(g);return g
}
function center(g){const m=g.transform.baseVal.consolidate()?.matrix;return{x:m?.e||0,y:m?.f||0}}
function nearestSnap(x,y,exclude){
 let best=null,dist=28;
 document.querySelectorAll('.advanced-object').forEach(g=>{if(g===exclude)return;const c=center(g),d=Math.hypot(c.x-x,c.y-y);if(d<dist){dist=d;best=c}});
 return best
}
function makeDraggable(g){
 let drag=null;
 g.addEventListener('pointerdown',e=>{if(routeMode)return;e.stopPropagation();const p=pt(e),c=center(g);drag={dx:p.x-c.x,dy:p.y-c.y};g.classList.add('dragging');g.setPointerCapture(e.pointerId)});
 g.addEventListener('pointermove',e=>{if(!drag)return;let p=pt(e),x=p.x-drag.dx,y=p.y-drag.dy;const snap=snapping?nearestSnap(x,y,g):null;if(snap){x=snap.x;y=snap.y;g.classList.add('snap-highlight')}else g.classList.remove('snap-highlight');g.setAttribute('transform',`translate(${x} ${y})`);solveRope()});
 g.addEventListener('pointerup',()=>{drag=null;g.classList.remove('dragging','snap-highlight')})
}
function ropePath(points){if(points.length<2)return'';return 'M '+points.map(p=>`${p.x} ${p.y}`).join(' L ')}
function totalLength(points){let n=0;for(let i=1;i<points.length;i++)n+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);return n}
function createRope(nodes){
 if(state.rope)state.rope.group.remove();
 const group=el('g',{'data-advanced-type':'fixed-rope'});
 const path=el('path',{class:'rope-physics'}),label=el('text',{class:'rope-length-label'});
 group.append(path,label);rigLayer.appendChild(group);
 state.rope={group,path,label,nodes};ropeLength=totalLength(nodes.map(center));ropeLocked=true;q('lockRopeLengthBtn').classList.add('active');q('lockRopeLengthBtn').textContent='Rope Locked';
 solveRope();status(`Fixed rope created: ${(ropeLength/50).toFixed(2)} m`)
}
function solveRope(){
 if(!state.rope)return;const pts=state.rope.nodes.map(center);
 if(ropeLocked&&pts.length>2){
   // Preserve total length by moving the final free-end node along the final segment.
   const before=totalLength(pts.slice(0,-1));const remaining=Math.max(5,ropeLength-before),a=pts[pts.length-2],b=pts[pts.length-1];
   const dx=b.x-a.x,dy=b.y-a.y,m=Math.hypot(dx,dy)||1;
   const nx=a.x+dx/m*remaining,ny=a.y+dy/m*remaining;
   state.rope.nodes.at(-1).setAttribute('transform',`translate(${nx} ${ny})`);pts[pts.length-1]={x:nx,y:ny}
 }
 state.rope.path.setAttribute('d',ropePath(pts));
 state.rope.label.setAttribute('x',pts[0].x+8);state.rope.label.setAttribute('y',pts[0].y-10);
 state.rope.label.textContent=`Rope ${(ropeLength/50).toFixed(2)} m · fixed length`
}
q('snapToggleBtn').onclick=()=>{snapping=!snapping;q('snapToggleBtn').classList.toggle('active',snapping);q('snapToggleBtn').textContent=`Snapping: ${snapping?'On':'Off'}`};
q('lockRopeLengthBtn').onclick=()=>{ropeLocked=!ropeLocked;q('lockRopeLengthBtn').classList.toggle('active',ropeLocked);q('lockRopeLengthBtn').textContent=ropeLocked?'Rope Locked':'Lock Rope Length';if(state.rope&&!ropeLocked)ropeLength=totalLength(state.rope.nodes.map(center));solveRope()};
q('autoRouteBtn').onclick=()=>{routeMode=true;routePoints=[];status('Auto route: click start, pulleys/redirects, then double-click the end')};
svg.addEventListener('click',e=>{if(!routeMode)return;const p=pt(e),node=addPoint(p.x,p.y,routePoints.length===0?'rope-start':'route-point',routePoints.length===0?'Start':'');routePoints.push(node);status(`${routePoints.length} route point${routePoints.length===1?'':'s'} selected`)});
svg.addEventListener('dblclick',e=>{if(!routeMode||routePoints.length<2)return;e.preventDefault();createRope(routePoints);routeMode=false;routePoints=[]});

q('physicsSandboxBtn').onclick=()=>{
 physicsActive=!physicsActive;q('physicsSandboxBtn').classList.toggle('active',physicsActive);
 if(!state.rope){status('Create a routed rope first');q('autoRouteBtn').click();return}
 ropeLocked=physicsActive;solveRope();status(physicsActive?'Physics Sandbox active — drag connected nodes':'Physics Sandbox paused')
};

function addPerformer(x=500,y=480){
 const g=el('g',{'class':'advanced-object physics-node','data-advanced-type':'performer',transform:`translate(${x} ${y})`});
 g.innerHTML='<circle cy="-58" r="18" fill="#555d63" stroke="#fff" stroke-width="2"/><path d="M0-40 L0 20 M0-20 L-28 0 M0-20 L28 0 M0 20 L-20 65 M0 20 L20 65" stroke="#242a2f" stroke-width="12" stroke-linecap="round"/><ellipse class="performer-envelope" cx="0" cy="-5" rx="85" ry="130"/><text x="26" y="-55" class="advanced-label">Performer envelope</text>';
 drawLayer.appendChild(g);makeDraggable(g);state.objects.push(g);return g
}
q('performerEnvelopeBtn').onclick=()=>openDialog('Performer Envelope',`<div class="tool-form"><label>Horizontal clearance (m)<input id="envWidth" type="number" value="3" step=".1"></label><label>Vertical clearance (m)<input id="envHeight" type="number" value="5" step=".1"></label></div><button id="addEnvelopeNow" class="primary">Add performer envelope</button>`);
q('advancedDialogBody').addEventListener('click',e=>{
 if(e.target.id==='addEnvelopeNow'){const g=addPerformer();const rx=Number(q('envWidth').value)*25,ry=Number(q('envHeight').value)*25;g.querySelector('ellipse').setAttribute('rx',rx);g.querySelector('ellipse').setAttribute('ry',ry);q('advancedToolDialog').close();status('Performer envelope added')}
});

function addCamera(x=250,y=450,fov=70,range=8){
 const g=el('g',{'class':'advanced-object physics-node','data-advanced-type':'camera',transform:`translate(${x} ${y})`});
 const r=range*40,half=Math.tan(fov*Math.PI/360)*r;
 g.innerHTML=`<path class="camera-fov" d="M20 0 L${r} ${-half} L${r} ${half} Z"/><rect class="camera-body" x="-22" y="-16" width="44" height="32" rx="5"/><circle cx="18" r="10" fill="#111" stroke="#fff" stroke-width="2"/><text x="-20" y="-25" class="advanced-label">Camera · ${fov}°</text>`;
 drawLayer.appendChild(g);makeDraggable(g);state.objects.push(g);return g
}
q('cameraModeBtn').onclick=()=>openDialog('Camera Mode',`<div class="tool-form"><label>Horizontal FOV (°)<input id="camFov" type="number" value="70"></label><label>Visible range (m)<input id="camRange" type="number" value="8"></label></div><button id="addCameraNow" class="primary">Add camera and viewing cone</button>`);
q('advancedDialogBody').addEventListener('click',e=>{if(e.target.id==='addCameraNow'){addCamera(250,450,Number(q('camFov').value),Number(q('camRange').value));q('advancedToolDialog').close();status('Camera mode object added')}});

const telehandlers=[
 {name:'JCB 540-170',reach:12.5,height:16.7,capacity:4000},
 {name:'Manitou MT 1840',reach:13.1,height:17.5,capacity:4000},
 {name:'Merlo P40.17',reach:12.5,height:16.6,capacity:4000},
 {name:'JCB 535-125',reach:8.1,height:12.3,capacity:3500}
];
function addTelehandler(model,x=180,y=600){
 const g=el('g',{'class':'advanced-object physics-node','data-advanced-type':'telehandler',transform:`translate(${x} ${y})`});
 g.dataset.model=model.name;g.dataset.wll=String(model.capacity);
 g.innerHTML=`<rect class="telehandler-body" x="-65" y="-35" width="125" height="48" rx="7"/><circle cx="-38" cy="19" r="20" fill="#24292d" stroke="#fff" stroke-width="3"/><circle cx="38" cy="19" r="20" fill="#24292d" stroke="#fff" stroke-width="3"/><path d="M25-28 L180-150" stroke="#bfc5ca" stroke-width="18" stroke-linecap="round"/><circle cx="180" cy="-150" r="8" fill="#111" stroke="#fff" stroke-width="3"/><text x="-60" y="-45" class="advanced-label">${model.name} · ${model.height}m</text>`;
 drawLayer.appendChild(g);makeDraggable(g);state.objects.push(g);return g
}
q('telehandlerLibraryBtn').onclick=()=>openDialog('Telehandler Library','<div class="tool-grid">'+telehandlers.map((t,i)=>`<div class="tool-card"><strong>${t.name}</strong><span>Lift height: ${t.height} m</span><span>Forward reach: ${t.reach} m</span><span>Capacity: ${t.capacity} kg</span><button data-add-telehandler="${i}">Add to plan</button></div>`).join('')+'</div>');
q('advancedDialogBody').addEventListener('click',e=>{const i=e.target.dataset.addTelehandler;if(i!==undefined){addTelehandler(telehandlers[Number(i)]);q('advancedToolDialog').close();status(`${telehandlers[Number(i)].name} added`)}});

q('arModeBtn').onclick=async()=>{
 if(arStream){arStream.getTracks().forEach(t=>t.stop());arStream=null;q('arVideo').hidden=true;svg.classList.remove('ar-active');status('AR overlay stopped');return}
 try{
  arStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
  const v=q('arVideo'),rect=svg.getBoundingClientRect();v.srcObject=arStream;await v.play();v.hidden=false;
  Object.assign(v.style,{left:`${rect.left+scrollX}px`,top:`${rect.top+scrollY}px`,width:`${rect.width}px`,height:`${rect.height}px`});
  svg.classList.add('ar-active');status('AR overlay active — align the plan over the live camera view')
 }catch(err){openDialog('Augmented Reality','<p>Camera access was unavailable. AR works best from the installed web app on a phone or tablet served over HTTPS.</p><p>You can still upload a site photograph as the 2D background and align the plan manually.</p>')}
};

function buildThis(text){
 const t=text.toLowerCase();drawLayer.querySelectorAll('[data-advanced-type]').forEach(n=>n.remove());rigLayer.querySelectorAll('[data-advanced-type]').forEach(n=>n.remove());state.objects=[];state.rope=null;
 let ratio=1;const m=t.match(/(\d+)\s*:\s*(\d+)/);if(m)ratio=Number(m[1])/Number(m[2]);
 const performer=addPerformer(700,500);
 const count=(t.match(/two|2 pulleys/) ? 2 : t.match(/three|3 pulleys/) ? 3 : Math.max(1,Math.round(Math.abs(ratio))));
 const nodes=[addPoint(160,180,'anchor','Anchor')];
 for(let i=0;i<count;i++)nodes.push(addPoint(300+i*150,230+(i%2)*170,'pulley',`Pulley ${i+1}`));
 nodes.push(addPoint(700,430,'load-point','Load'));nodes.push(addPoint(880,180,'free-end','Pull'));
 createRope(nodes);status(`Built ${m?m[0]:'basic'} system with ${count} pulley${count===1?'':'s'}`)
}
q('buildThisBtn').onclick=()=>{const text=q('buildThisInput').value.trim();if(!text){status('Describe the system to build');return}buildThis(text)};
q('buildThisInput').addEventListener('keydown',e=>{if(e.key==='Enter')q('buildThisBtn').click()});
})();
