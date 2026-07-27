(()=>{
'use strict';
const q=id=>document.getElementById(id);
let live=false,snapshot2d=null,snapshot3d=null,workspaceAtStart=null;
function workspace(){
  if(q('workspaceHarness')?.classList.contains('active'))return 'harness';
  return q('workspace3d')?.classList.contains('active')?'3d':'2d'
}
function apiFor(ws){return ws==='3d'?window.SimpleRig3D:ws==='2d'?window.SimpleRig2D:null}
function update(){
  const bar=q('liveBar'),text=q('liveStateText'),toggle=q('toggleLiveBtn'),apply=q('applyLiveForceBtn'),reset=q('resetLiveBtn');
  bar.classList.toggle('live',live);text.textContent=live?'LIVE — simulation armed':'Live mode off';toggle.textContent=live?'Exit live':'Go live';
  apply.disabled=!live;reset.disabled=!live;
}
function enter(){
  const ws=workspace();if(ws==='harness'){q('liveReadout').textContent='Live simulation is available in the 2D and 3D workspaces.';return}
  workspaceAtStart=ws;
  snapshot2d=window.SimpleRig2D?.getState()||null;
  snapshot3d=window.SimpleRig3D?.getState()||null;
  live=true;
  window.SimpleRig2D?.captureFiniteLines?.();
  update();
  q('liveReadout').textContent=`${ws.toUpperCase()} simulation armed. Rope lengths are now finite and the current rig state has been captured for reset.`
}
function reset(){
  if(snapshot2d)window.SimpleRig2D?.setState(snapshot2d);
  if(snapshot3d)window.SimpleRig3D?.setState(snapshot3d);
  q('liveReadout').textContent='Rig restored to its pre-simulation state.'
}
function exit(){
  live=false;window.SimpleRig2D?.clearFiniteLines?.();update();q('liveReadout').textContent='Live mode off. Use Reset before exiting if you want to undo the simulation.'
}
q('toggleLiveBtn').addEventListener('click',()=>live?exit():enter());
q('resetLiveBtn').addEventListener('click',reset);
q('applyLiveForceBtn').addEventListener('click',()=>{
  if(!live)return;
  const ws=workspace(),api=apiFor(ws),force=Math.max(0,Number(q('liveForceKn').value)||0),duration=Math.max(.05,Number(q('liveDuration').value)||.5);
  if(!api){q('liveReadout').textContent='Live simulation is only available in 2D and 3D.';return}
  const result=api.simulate(force,duration);
  q('liveReadout').textContent=result.message;
});
['switch2d','switch3d','switchHarness'].forEach(id=>q(id)?.addEventListener('click',()=>{if(live)q('liveReadout').textContent='Live mode remains armed. Apply force in the current 2D or 3D workspace, or reset the captured rig.'}));
window.addEventListener('simplerig-operating-change',()=>{if(!live)q('liveReadout').textContent='Operating point updated. Go live to apply force.'});
window.SimpleRigLive={isLive(){return live},reset,enter,exit};
update();
})();
