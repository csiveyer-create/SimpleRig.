import{createProject,createObject,cloneProject,validateProject}from"./model.js";
import{Renderer}from"./renderer.js";
import{recogniseStroke,recogniseRecentStrokes}from"./recognition.js";
const $=id=>document.getElementById(id);
const els={canvas:$("mainCanvas"),projectName:$("projectName"),gagName:$("gagName"),undoBtn:$("undoBtn"),redoBtn:$("redoBtn"),saveBtn:$("saveBtn"),openInput:$("openInput"),sceneList:$("sceneList"),emptySelection:$("emptySelection"),selectionEditor:$("selectionEditor"),objectLabel:$("objectLabel"),objectX:$("objectX"),objectY:$("objectY"),objectZ:$("objectZ"),objectRotation:$("objectRotation"),objectScale:$("objectScale"),duplicateBtn:$("duplicateBtn"),deleteBtn:$("deleteBtn"),status:$("status"),viewBadge:$("viewBadge"),clearSketchBtn:$("clearSketchBtn"),recognitionToggle:$("recognitionToggle"),recognitionCard:$("recognitionCard"),recognitionLabel:$("recognitionLabel"),recognitionConfidence:$("recognitionConfidence"),recognitionDetail:$("recognitionDetail"),convertRecognitionBtn:$("convertRecognitionBtn"),keepRecognitionBtn:$("keepRecognitionBtn")};
let project=createProject(),selectedId=null,undo=[],redo=[],preview=null,sketchSnapshot=null,pendingRecognition=null,lastEraseSnapshot=null;
const renderer=new Renderer(els.canvas,{
  select:id=>select(id),
  previewMove:(id,start,d)=>{if(!preview)preview=cloneProject(project);const o=project.objects.find(x=>x.id===id);if(!o)return;o.position={x:start.x+d.x,y:start.y+d.y,z:start.z+d.z};refresh(false)},
  commitPreview:()=>{if(preview){undo.push(preview);redo=[];preview=null;refresh()}},
  beginSketch:stroke=>{if(!project.sketch)project.sketch={strokes:[]};sketchSnapshot=cloneProject(project);project.sketch.strokes.push(cloneProject(stroke));refresh(false)},
  previewSketch:stroke=>{const s=project.sketch.strokes.find(x=>x.id===stroke.id);if(s)s.points=cloneProject(stroke.points);refresh(false)},
  commitSketch:stroke=>{
    const s=project.sketch.strokes.find(x=>x.id===stroke.id);
    if(s)s.points=cloneProject(stroke.points);
    if(sketchSnapshot){undo.push(sketchSnapshot);redo=[];sketchSnapshot=null}
    if(els.recognitionToggle.checked){
      pendingRecognition=recogniseRecentStrokes(project.sketch.strokes)||recogniseStroke(s);
      showRecognition();
    }
    status("Sketch stroke added");
    refresh();
  },
  eraseAt:(view,point)=>{
    const hit=findStrokeAt(view,point);
    if(!hit)return;
    if(!lastEraseSnapshot){lastEraseSnapshot=cloneProject(project);setTimeout(()=>lastEraseSnapshot=null,250)}
    project.sketch.strokes=project.sketch.strokes.filter(s=>s.id!==hit.id);
    pendingRecognition=null;hideRecognition();refresh();
  }
});

function flatten(point,view){
  if(view==="front")return{x:point.x,y:point.z};
  if(view==="left")return{x:point.y,y:point.z};
  return{x:point.x,y:point.y};
}
function segmentDistance(p,a,b){
  const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
  if(!den)return Math.hypot(p.x-a.x,p.y-a.y);
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/den));
  const x=a.x+t*dx,y=a.y+t*dy;
  return Math.hypot(p.x-x,p.y-y);
}
function findStrokeAt(view,point){
  const target=flatten(point,view);
  const strokes=(project.sketch?.strokes||[]).filter(s=>s.view===view);
  for(let i=strokes.length-1;i>=0;i--){
    const s=strokes[i],pts=s.points.map(p=>flatten(p,view));
    for(let j=1;j<pts.length;j++)if(segmentDistance(target,pts[j-1],pts[j])<0.18)return s;
    if(pts.length===1&&Math.hypot(target.x-pts[0].x,target.y-pts[0].y)<0.18)return s;
  }
  return null;
}
function showRecognition(){
  if(!pendingRecognition){hideRecognition();return}
  els.recognitionLabel.textContent=pendingRecognition.label;
  els.recognitionConfidence.textContent=`${pendingRecognition.confidence}% confidence`;
  els.recognitionDetail.textContent=pendingRecognition.detail||"";
  els.recognitionCard.classList.remove("hidden");
}
function hideRecognition(){els.recognitionCard.classList.add("hidden")}
function getRecognitionStrokeIds(){
  if(!pendingRecognition)return[];
  return pendingRecognition.strokeIds||[pendingRecognition.strokeId];
}
function strokeCentre(stroke){
  const pts=stroke.points||[];
  if(!pts.length)return{x:0,y:0,z:0};
  const sum=pts.reduce((a,p)=>({x:a.x+p.x,y:a.y+p.y,z:a.z+p.z}),{x:0,y:0,z:0});
  return{x:sum.x/pts.length,y:sum.y/pts.length,z:sum.z/pts.length};
}
function convertPendingRecognition(){
  if(!pendingRecognition)return;
  const ids=getRecognitionStrokeIds();
  const strokes=project.sketch.strokes.filter(s=>ids.includes(s.id));
  if(!strokes.length)return;
  mutate(()=>{
    let obj;
    if(pendingRecognition.type==="rigLine"){
      const stroke=strokes[0],start=stroke.points[0],end=stroke.points[stroke.points.length-1];
      obj=createObject("rigLine",start);obj.end={...end};obj.label="Rig Line";
    }else{
      const centres=strokes.map(strokeCentre);
      const pos=centres.reduce((a,p)=>({x:a.x+p.x,y:a.y+p.y,z:a.z+p.z}),{x:0,y:0,z:0});
      pos.x/=centres.length;pos.y/=centres.length;pos.z/=centres.length;
      obj=createObject(pendingRecognition.type,pos);
      obj.label=pendingRecognition.label;
      if(pendingRecognition.bounds){
        const w=Math.max(.2,pendingRecognition.bounds.width||1),h=Math.max(.2,pendingRecognition.bounds.height||1);
        if(pendingRecognition.type==="truss")obj.scale=Math.max(.5,Math.min(3,w/1.2));
        else if(pendingRecognition.type==="telehandler")obj.scale=Math.max(.55,Math.min(2.5,Math.max(w,h)/1.8));
        else if(pendingRecognition.type==="performer")obj.scale=Math.max(.5,Math.min(2.2,h/1.8));
        else obj.scale=Math.max(.5,Math.min(2.5,Math.max(w,h)));
      }
    }
    project.objects.push(obj);
    project.sketch.strokes=project.sketch.strokes.filter(s=>!ids.includes(s.id));
    selectedId=obj.id;
    pendingRecognition=null;
  },"Sketch converted");
  hideRecognition();
}

function snap(){undo.push(cloneProject(project));if(undo.length>100)undo.shift();redo=[]}
function mutate(fn,msg){snap();fn();status(msg);refresh()}
function refresh(render=true){project.meta.projectName=els.projectName.value;project.meta.gagName=els.gagName.value;if(render)renderer.setProject(project);renderer.setSelection(selectedId);list();editor();els.undoBtn.disabled=!undo.length;els.redoBtn.disabled=!redo.length}
function select(id){selectedId=id;renderer.setSelection(id);list();editor()}
function list(){els.sceneList.innerHTML="";for(const o of project.objects){const r=document.createElement("div");r.className=`scene-item ${o.id===selectedId?"selected":""}`;const n=document.createElement("div");n.textContent=o.label;const b=document.createElement("button");b.textContent="Select";b.addEventListener("click",()=>select(o.id));r.append(n,b);els.sceneList.append(r)}}
function editor(){const o=project.objects.find(x=>x.id===selectedId);els.emptySelection.classList.toggle("hidden",!!o);els.selectionEditor.classList.toggle("hidden",!o);if(!o)return;els.objectLabel.value=o.label;els.objectX.value=o.position.x.toFixed(2);els.objectY.value=o.position.y.toFixed(2);els.objectZ.value=o.position.z.toFixed(2);els.objectRotation.value=o.rotation;els.objectScale.value=o.scale}
function update(){const o=project.objects.find(x=>x.id===selectedId);if(!o)return;mutate(()=>{o.label=els.objectLabel.value.trim()||o.label;o.position.x=Number(els.objectX.value)||0;o.position.y=Number(els.objectY.value)||0;o.position.z=Number(els.objectZ.value)||0;o.rotation=Number(els.objectRotation.value)||0;o.scale=Math.max(.2,Number(els.objectScale.value)||1)},"Object updated")}
function status(m){els.status.textContent=m;clearTimeout(status.t);status.t=setTimeout(()=>els.status.textContent="Ready",1600)}
document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>mutate(()=>{const o=createObject(b.dataset.add,{x:project.objects.length*.35-1,y:0,z:0});project.objects.push(o);selectedId=o.id},`${b.textContent.trim()} added`)));
document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("active",x===b));renderer.setMode(b.dataset.mode);status(`${b.textContent.trim()} mode`)}));
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-view]").forEach(x=>x.classList.toggle("active",x===b));renderer.setView(b.dataset.view);els.viewBadge.textContent=b.textContent;status(`${b.textContent} view`)}));
els.clearSketchBtn.addEventListener("click",()=>{if(!(project.sketch?.strokes.length))return;mutate(()=>project.sketch.strokes=[],"Sketch cleared");pendingRecognition=null;hideRecognition()});
els.convertRecognitionBtn.addEventListener("click",convertPendingRecognition);
els.keepRecognitionBtn.addEventListener("click",()=>{pendingRecognition=null;hideRecognition();status("Sketch kept")});
els.recognitionToggle.addEventListener("change",()=>{if(!els.recognitionToggle.checked){pendingRecognition=null;hideRecognition()}status(els.recognitionToggle.checked?"Recognition on":"Recognition off")});
[els.objectLabel,els.objectX,els.objectY,els.objectZ,els.objectRotation,els.objectScale].forEach(i=>i.addEventListener("change",update));
els.duplicateBtn.addEventListener("click",()=>{const o=project.objects.find(x=>x.id===selectedId);if(!o)return;mutate(()=>{const d=cloneProject(o);d.id=globalThis.crypto?.randomUUID?.()||`obj-${Date.now()}`;d.label+=" copy";d.position.x+=.4;d.position.y+=.4;project.objects.push(d);selectedId=d.id},"Object duplicated")});
els.deleteBtn.addEventListener("click",()=>{if(!selectedId)return;mutate(()=>{project.objects=project.objects.filter(o=>o.id!==selectedId);selectedId=null},"Object deleted")});
els.undoBtn.addEventListener("click",()=>{if(lastEraseSnapshot){undo.push(lastEraseSnapshot);lastEraseSnapshot=null}if(!undo.length)return;redo.push(cloneProject(project));project=undo.pop();selectedId=null;pendingRecognition=null;hideRecognition();refresh();status("Undo")});
els.redoBtn.addEventListener("click",()=>{if(!redo.length)return;undo.push(cloneProject(project));project=redo.pop();selectedId=null;pendingRecognition=null;hideRecognition();refresh();status("Redo")});
els.saveBtn.addEventListener("click",()=>{const blob=new Blob([JSON.stringify(project,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${(project.meta.projectName||"SimpleRig").replace(/[^a-z0-9_-]+/gi,"-")}.rig`;a.click();URL.revokeObjectURL(url);status("Project saved")});
els.openInput.addEventListener("change",async()=>{const f=els.openInput.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());validateProject(d);if(!d.sketch)d.sketch={strokes:[]};project=d;selectedId=null;undo=[];redo=[];pendingRecognition=null;hideRecognition();els.projectName.value=d.meta?.projectName||"Untitled Rig";els.gagName.value=d.meta?.gagName||"";refresh();status("Project opened")}catch(e){alert(`Could not open project: ${e.message}`)}finally{els.openInput.value=""}});
window.addEventListener("keydown",e=>{if(["INPUT","TEXTAREA"].includes(document.activeElement?.tagName))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?els.redoBtn.click():els.undoBtn.click()}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){e.preventDefault();els.redoBtn.click()}else if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();els.deleteBtn.click()}});
renderer.setProject(project);refresh();
