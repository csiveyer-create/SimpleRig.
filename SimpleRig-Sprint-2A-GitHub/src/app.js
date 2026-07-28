import{createProject,createObject,cloneProject,validateProject}from"./model.js";
import{Renderer}from"./renderer.js";
const $=id=>document.getElementById(id);
const els={canvas:$("mainCanvas"),projectName:$("projectName"),gagName:$("gagName"),undoBtn:$("undoBtn"),redoBtn:$("redoBtn"),saveBtn:$("saveBtn"),openInput:$("openInput"),sceneList:$("sceneList"),emptySelection:$("emptySelection"),selectionEditor:$("selectionEditor"),objectLabel:$("objectLabel"),objectX:$("objectX"),objectY:$("objectY"),objectZ:$("objectZ"),objectRotation:$("objectRotation"),objectScale:$("objectScale"),duplicateBtn:$("duplicateBtn"),deleteBtn:$("deleteBtn"),status:$("status"),viewBadge:$("viewBadge"),clearSketchBtn:$("clearSketchBtn")};
let project=createProject(),selectedId=null,undo=[],redo=[],preview=null,sketchSnapshot=null;
const renderer=new Renderer(els.canvas,{
  select:id=>select(id),
  previewMove:(id,start,d)=>{if(!preview)preview=cloneProject(project);const o=project.objects.find(x=>x.id===id);if(!o)return;o.position={x:start.x+d.x,y:start.y+d.y,z:start.z+d.z};refresh(false)},
  commitPreview:()=>{if(preview){undo.push(preview);redo=[];preview=null;refresh()}},
  beginSketch:stroke=>{if(!project.sketch)project.sketch={strokes:[]};sketchSnapshot=cloneProject(project);project.sketch.strokes.push(cloneProject(stroke));refresh(false)},
  previewSketch:stroke=>{const s=project.sketch.strokes.find(x=>x.id===stroke.id);if(s)s.points=cloneProject(stroke.points);refresh(false)},
  commitSketch:stroke=>{const s=project.sketch.strokes.find(x=>x.id===stroke.id);if(s)s.points=cloneProject(stroke.points);if(sketchSnapshot){undo.push(sketchSnapshot);redo=[];sketchSnapshot=null}status("Sketch stroke added");refresh()}
});
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
els.clearSketchBtn.addEventListener("click",()=>{if(!(project.sketch?.strokes.length))return;mutate(()=>project.sketch.strokes=[],"Sketch cleared")});
[els.objectLabel,els.objectX,els.objectY,els.objectZ,els.objectRotation,els.objectScale].forEach(i=>i.addEventListener("change",update));
els.duplicateBtn.addEventListener("click",()=>{const o=project.objects.find(x=>x.id===selectedId);if(!o)return;mutate(()=>{const d=cloneProject(o);d.id=globalThis.crypto?.randomUUID?.()||`obj-${Date.now()}`;d.label+=" copy";d.position.x+=.4;d.position.y+=.4;project.objects.push(d);selectedId=d.id},"Object duplicated")});
els.deleteBtn.addEventListener("click",()=>{if(!selectedId)return;mutate(()=>{project.objects=project.objects.filter(o=>o.id!==selectedId);selectedId=null},"Object deleted")});
els.undoBtn.addEventListener("click",()=>{if(!undo.length)return;redo.push(cloneProject(project));project=undo.pop();selectedId=null;refresh();status("Undo")});
els.redoBtn.addEventListener("click",()=>{if(!redo.length)return;undo.push(cloneProject(project));project=redo.pop();selectedId=null;refresh();status("Redo")});
els.saveBtn.addEventListener("click",()=>{const blob=new Blob([JSON.stringify(project,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${(project.meta.projectName||"SimpleRig").replace(/[^a-z0-9_-]+/gi,"-")}.rig`;a.click();URL.revokeObjectURL(url);status("Project saved")});
els.openInput.addEventListener("change",async()=>{const f=els.openInput.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());validateProject(d);if(!d.sketch)d.sketch={strokes:[]};project=d;selectedId=null;undo=[];redo=[];els.projectName.value=d.meta?.projectName||"Untitled Rig";els.gagName.value=d.meta?.gagName||"";refresh();status("Project opened")}catch(e){alert(`Could not open project: ${e.message}`)}finally{els.openInput.value=""}});
window.addEventListener("keydown",e=>{if(["INPUT","TEXTAREA"].includes(document.activeElement?.tagName))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?els.redoBtn.click():els.undoBtn.click()}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){e.preventDefault();els.redoBtn.click()}else if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();els.deleteBtn.click()}});
renderer.setProject(project);refresh();
