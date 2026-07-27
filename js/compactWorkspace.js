
(()=>{
'use strict';
window.SR_COMPACT_BUILD='3.3.1';
const q=id=>document.getElementById(id);
const body=document.body;
const svg=q('rigCanvas');
if(!svg)return;

/* Remove non-working automatic calculator surfaces from the DOM. */
['simpleLoadCalculator','simpleLoadSummary','simpleDistributionList'].forEach(id=>q(id)?.remove());
document.querySelectorAll('.simple-3d-load,.operating-panel').forEach(el=>el.remove());

/* Compact top commands. */
const command=document.createElement('div');
command.className='compact-command';
command.innerHTML=`
  <button id="compactProjectBtn" type="button" title="Project and production details">Project</button>
  <button id="compactBuildBtn" type="button" title="Build This">Build This</button>
  <button id="compactBackgroundBtn" type="button" title="Background and scale">Background</button>
  <button id="compactLiveBtn" type="button" title="Toggle live rope">Edit</button>
  <button id="compactExportBtn" type="button" title="Export">Export</button>`;
document.querySelector('.workspace-mode-switch')?.before(command);

function popover(id,title,content){
  const p=document.createElement('section');
  p.id=id;p.className='workspace-popover';p.hidden=true;
  p.innerHTML=`<div class="popover-head"><h3>${title}</h3><button type="button" data-close-popover="${id}">Close</button></div>${content}`;
  body.appendChild(p);return p
}
function togglePopover(id){
  document.querySelectorAll('.workspace-popover').forEach(p=>{if(p.id!==id)p.hidden=true});
  const p=q(id);if(p)p.hidden=!p.hidden
}
body.addEventListener('click',e=>{
  const id=e.target?.dataset?.closePopover;if(id)q(id).hidden=true
});

/* Project popover reuses original fields without breaking their listeners. */
const projectPopover=popover('projectPopover','Project',`
  <div id="projectPopoverHost"></div>
  <div class="popover-actions">
    <button id="projectOpenProxy" type="button">Projects & Timeline</button>
    <button id="projectSaveProxy" class="primary" type="button">Save current</button>
  </div>`);
const prod=q('rigApp')?.querySelector('.production-details');
if(prod){prod.style.display='grid';q('projectPopoverHost').appendChild(prod)}
q('projectOpenProxy').onclick=()=>q('openProjectsTopBtn')?.click();
q('projectSaveProxy').onclick=()=>q('saveCurrentTopBtn')?.click();

/* Build This popover reuses existing controls. */
const buildPopover=popover('buildPopover','Build This','<div id="buildPopoverHost"></div>');
const buildDock=q('buildThisDock');
if(buildDock){buildDock.style.display='block';q('buildPopoverHost').appendChild(buildDock)}

/* Export popover. */
popover('exportPopover','Export',`
  <div class="popover-actions">
    <button id="exportImageProxy" type="button">Download image</button>
    <button id="exportPdfProxy" class="primary" type="button">Download PDF</button>
  </div>`);
q('exportImageProxy').onclick=()=>q('downloadImageBtn')?.click();
q('exportPdfProxy').onclick=()=>q('downloadPdfBtn')?.click();

q('compactProjectBtn').onclick=()=>togglePopover('projectPopover');
q('compactBuildBtn').onclick=()=>togglePopover('buildPopover');
q('compactExportBtn').onclick=()=>togglePopover('exportPopover');

/* Floating 2D toolbar using the original working controls. */
const wrap=document.querySelector('.canvasWrap');
const float=document.createElement('div');float.className='floating-2d-toolbar';
const toolDefs=[
 ['selectTool','tool-select'],['lineTool','tool-line'],['addRigLineBtn','tool-rig'],
 ['arrowTool','tool-arrow'],['textTool','tool-text'],['measure2dBtn','tool-measure'],
 ['panTool','tool-pan'],['deleteBtn','tool-delete'],['undoBtn','tool-undo'],['redoBtn','tool-redo']
];
toolDefs.forEach(([id,cls])=>{
 const original=q(id);if(!original)return;
 original.classList.add(cls);original.title=original.textContent.trim();float.appendChild(original)
});
const liveMeasureLabel=document.createElement('label');
liveMeasureLabel.className='live-measure-toggle';
liveMeasureLabel.innerHTML='<input id="showLiveLineMeasure" type="checkbox" checked> Length';
float.appendChild(liveMeasureLabel);
wrap?.appendChild(float);

/* Compact live mode: use the existing constraint-rope toggle. */
function updateLiveCompact(){
 const on=(q('liveRopeToggle')?.textContent||'').includes('On');
 q('compactLiveBtn').textContent=on?'Live':'Edit';
 q('compactLiveBtn').classList.toggle('primary',on)
}
q('compactLiveBtn').onclick=()=>{q('liveRopeToggle')?.click();setTimeout(updateLiveCompact,0)};
q('liveRopeToggle')?.addEventListener('click',()=>setTimeout(updateLiveCompact,0));
updateLiveCompact();

/* Live line length readout while an original rig-line endpoint is dragged. */
const readout=document.createElement('div');readout.id='liveLineMeasure';readout.hidden=true;wrap?.appendChild(readout);
function formatLength(canvasLength){
 const scale=Number(q('metresPerCanvasUnit')?.value)||.02;
 const unit=q('metricUnit')?.value||'m';
 const metres=canvasLength*scale;
 const value=unit==='mm'?metres*1000:unit==='cm'?metres*100:metres;
 return `${value.toFixed(unit==='m'?2:1)} ${unit}`
}
function selectedRig(){
 return [...q('rigLineLayer').querySelectorAll('[data-rig="true"]')].find(g=>
   [...g.querySelectorAll('.rig-handle')].some(h=>h.getAttribute('fill')==='#2563eb'||h.matches(':active'))
 ) || [...q('rigLineLayer').querySelectorAll('[data-rig="true"]')].at(-1)
}
function lengthOf(points){let d=0;for(let i=1;i<points.length;i++)d+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);return d}
let endpointDragging=false;
svg.addEventListener('pointerdown',e=>{
 if(e.target?.classList?.contains('rig-handle'))endpointDragging=true
},true);
svg.addEventListener('pointermove',e=>{
 if(!endpointDragging||!q('showLiveLineMeasure')?.checked){readout.hidden=true;return}
 const rig=q('rigLineLayer').querySelector(`[data-id="${e.target?.dataset?.rigId||''}"]`)||selectedRig();
 if(!rig)return;
 let points=[];try{points=JSON.parse(rig.dataset.points||'[]')}catch(_){}
 if(points.length<2)return;
 const rect=wrap.getBoundingClientRect();
 readout.textContent=formatLength(lengthOf(points));
 readout.style.left=`${Math.max(8,Math.min(rect.width-100,e.clientX-rect.left+12))}px`;
 readout.style.top=`${Math.max(8,Math.min(rect.height-35,e.clientY-rect.top+12))}px`;
 readout.hidden=false
},true);
function stopLineMeasure(){endpointDragging=false;readout.hidden=true}
window.addEventListener('pointerup',stopLineMeasure,true);
window.addEventListener('pointercancel',stopLineMeasure,true);

/* Keep all 2D rig lines white, including new lines and colour edits. */
function whiten2D(){
 q('rigLineLayer')?.querySelectorAll('[data-rig="true"]').forEach(g=>{
   g.dataset.colour='#ffffff';
   g.querySelectorAll('[data-visible="true"]').forEach(p=>p.setAttribute('stroke','#ffffff'))
 });
 q('rigLineColour') && (q('rigLineColour').value='#ffffff')
}
new MutationObserver(()=>requestAnimationFrame(whiten2D)).observe(q('rigLineLayer'),{childList:true,subtree:true});
q('rigLineColour')?.addEventListener('input',()=>setTimeout(whiten2D,0));
whiten2D();

/* Background setup and compulsory scale calibration before locking. */
const backgroundPopover=popover('backgroundPopover','Background & Scale',`
  <div id="backgroundOriginalHost"></div>
  <hr>
  <strong>Calibrate background</strong>
  <p>Upload and position the background, select two known points, enter their real distance, then lock the layer.</p>
  <div class="popover-actions">
    <button id="startBackgroundCalibration" type="button">Choose two points</button>
    <label>Known distance <input id="backgroundKnownDistance" type="number" min="0.001" step="0.01" value="1"></label>
    <select id="backgroundKnownUnit"><option value="m">m</option><option value="cm">cm</option><option value="mm">mm</option></select>
    <button id="applyBackgroundScale" type="button" disabled>Apply scale</button>
    <button id="lockBackgroundLayer" class="primary" type="button" disabled>Lock background</button>
  </div>
  <div id="backgroundScaleStatus">Upload a background to begin.</div>`);
q('compactBackgroundBtn').onclick=()=>togglePopover('backgroundPopover');

const bgTitle=[...document.querySelectorAll('#workspace2d aside .title')].find(e=>e.textContent.trim()==='Background');
if(bgTitle){
 const group=bgTitle.nextElementSibling;
 const host=q('backgroundOriginalHost');host.append(bgTitle);if(group)host.append(group)
}

const bgOverlay=document.createElement('div');bgOverlay.className='background-calibration';bgOverlay.hidden=true;
bgOverlay.innerHTML=`<strong>Background calibration</strong><p id="bgOverlayText">Choose two points with a known distance.</p>
<div class="row"><button id="bgOverlayOpen" type="button">Open settings</button><span id="bgLockState"></span></div>`;
wrap?.appendChild(bgOverlay);
q('bgOverlayOpen').onclick=()=>togglePopover('backgroundPopover');

let calibration=false,calibrationPts=[],calibrationGroup=null,backgroundLocked=false;
const NS='http://www.w3.org/2000/svg';
function svgPoint(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
function clearCalibrationGraphic(){calibrationGroup?.remove();calibrationGroup=null}
function drawCalibration(){
 clearCalibrationGraphic();if(!calibrationPts.length)return;
 calibrationGroup=document.createElementNS(NS,'g');calibrationGroup.dataset.backgroundCalibration='1';
 calibrationPts.forEach(p=>{const c=document.createElementNS(NS,'circle');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',7);c.setAttribute('class','calibration-point');calibrationGroup.append(c)});
 if(calibrationPts.length===2){const l=document.createElementNS(NS,'line');Object.entries({x1:calibrationPts[0].x,y1:calibrationPts[0].y,x2:calibrationPts[1].x,y2:calibrationPts[1].y,class:'calibration-line'}).forEach(([k,v])=>l.setAttribute(k,v));calibrationGroup.prepend(l)}
 q('selectionLayer').append(calibrationGroup)
}
q('startBackgroundCalibration').onclick=()=>{
 if(!q('backgroundImage')){q('backgroundScaleStatus').textContent='Upload a background first.';return}
 calibration=true;calibrationPts=[];clearCalibrationGraphic();q('applyBackgroundScale').disabled=true;
 q('backgroundScaleStatus').textContent='Click two points on the background.';q('backgroundPopover').hidden=true
};
svg.addEventListener('click',e=>{
 if(!calibration)return;
 e.preventDefault();e.stopImmediatePropagation();
 calibrationPts.push(svgPoint(e));drawCalibration();
 if(calibrationPts.length===2){
   calibration=false;q('applyBackgroundScale').disabled=false;
   const d=Math.hypot(calibrationPts[1].x-calibrationPts[0].x,calibrationPts[1].y-calibrationPts[0].y);
   q('backgroundScaleStatus').textContent=`Selected span: ${d.toFixed(1)} canvas units. Enter its known distance.`;
   togglePopover('backgroundPopover')
 }
},true);
q('applyBackgroundScale').onclick=()=>{
 if(calibrationPts.length!==2)return;
 const raw=Number(q('backgroundKnownDistance').value);if(!(raw>0))return;
 const unit=q('backgroundKnownUnit').value;
 const metres=unit==='mm'?raw/1000:unit==='cm'?raw/100:raw;
 const canvasDistance=Math.hypot(calibrationPts[1].x-calibrationPts[0].x,calibrationPts[1].y-calibrationPts[0].y);
 const scale=metres/canvasDistance;
 q('metresPerCanvasUnit').value=scale.toFixed(6);
 q('metresPerCanvasUnit').dispatchEvent(new Event('change',{bubbles:true}));
 q('lockBackgroundLayer').disabled=false;
 q('backgroundScaleStatus').textContent=`Scale set: ${scale.toFixed(6)} metres per canvas unit. Lock the background to continue.`;
};
q('lockBackgroundLayer').onclick=()=>{
 if(q('lockBackgroundLayer').disabled)return;
 backgroundLocked=true;
 const img=q('backgroundImage');img?.classList.remove('background-unlocked');img?.setAttribute('pointer-events','none');
 q('lockBackgroundLayer').disabled=true;q('startBackgroundCalibration').disabled=true;
 q('backgroundScaleStatus').innerHTML='<span class="locked">Background scaled and locked.</span>';
 q('bgLockState').textContent='Locked';clearCalibrationGraphic();bgOverlay.hidden=true
};
q('backgroundFile')?.addEventListener('change',()=>{
 setTimeout(()=>{
   const img=q('backgroundImage');if(!img)return;
   backgroundLocked=false;img.classList.add('background-unlocked');img.setAttribute('pointer-events','auto');
   q('startBackgroundCalibration').disabled=false;q('lockBackgroundLayer').disabled=true;
   q('backgroundScaleStatus').textContent='Background loaded. Choose two known points before locking.';
   q('bgOverlayText').textContent='Scale is required before this background can be locked.';
   q('bgLockState').textContent='Unlocked';bgOverlay.hidden=false
 },50)
});
q('removeBackground')?.addEventListener('click',()=>{
 backgroundLocked=false;calibrationPts=[];clearCalibrationGraphic();bgOverlay.hidden=true;
 q('backgroundScaleStatus').textContent='Upload a background to begin.'
});

/* Drag unlocked background. */
let bgDrag=null;
svg.addEventListener('pointerdown',e=>{
 if(backgroundLocked||e.target?.id!=='backgroundImage')return;
 const img=e.target,p=svgPoint(e);bgDrag={img,p,x:+img.getAttribute('x')||0,y:+img.getAttribute('y')||0};
 e.preventDefault();e.stopPropagation();svg.setPointerCapture?.(e.pointerId)
},true);
svg.addEventListener('pointermove',e=>{
 if(!bgDrag)return;const p=svgPoint(e);
 bgDrag.img.setAttribute('x',bgDrag.x+p.x-bgDrag.p.x);bgDrag.img.setAttribute('y',bgDrag.y+p.y-bgDrag.p.y)
},true);
window.addEventListener('pointerup',()=>bgDrag=null,true);

/* Convert 3D inspector and measurements into popovers controlled from the header. */
const view3dBtn=document.createElement('button');view3dBtn.id='compact3dDetailsBtn';view3dBtn.textContent='3D Details';view3dBtn.hidden=true;command.appendChild(view3dBtn);
const detailPopover=popover('details3dPopover','3D Details','<div id="details3dHost"></div>');
[q('sr3MeasurePanel'),q('sr3Inspector')].forEach(el=>{if(el){el.style.display='block';q('details3dHost').appendChild(el)}});
view3dBtn.onclick=()=>togglePopover('details3dPopover');
function syncModeButtons(){
 const is3d=!q('workspace3d').hidden && getComputedStyle(q('workspace3d')).display!=='none';
 view3dBtn.hidden=!is3d
}
q('switch2d')?.addEventListener('click',()=>setTimeout(syncModeButtons,20));
q('switch3d')?.addEventListener('click',()=>setTimeout(syncModeButtons,20));
syncModeButtons();

/* Preserve compact layout if legacy collapse logic runs. */
window.addEventListener('resize',()=>{readout.hidden=true});
})();
