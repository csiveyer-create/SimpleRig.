(()=>{
'use strict';
const byId=id=>document.getElementById(id);
const panel=byId('projectPanel');
const STORAGE_KEY='SimpleRigProjects_v1';
let projects=[];
let activeProjectId=null;
let selectedFileId=null;
let dragInfo=null;
let calendarDate=new Date();

function uid(prefix){return prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
function nowISO(){return new Date().toISOString()}
function activeWorkspace(){
  return byId('workspaceHarness')?.classList.contains('active')?'harness':(byId('workspace3d')?.classList.contains('active')?'3d':'2d');
}
function safeParse(value,fallback){try{return JSON.parse(value)}catch{return fallback}}
function persist(){
  try{
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify({projects,activeProjectId}))}catch(error){throw error};
    setStatus('Saved in this browser.');
  }catch(error){
    setStatus('Browser storage is full. Export the project to keep it safe.');
    console.warn(error);
  }
}
function loadPersisted(){
  let raw=null;try{raw=localStorage.getItem(STORAGE_KEY)}catch(_){}const saved=safeParse(raw,null);
  if(saved&&Array.isArray(saved.projects)){projects=saved.projects;projects.forEach(p=>{if(!Array.isArray(p.events))p.events=[]});activeProjectId=saved.activeProjectId||projects[0]?.id||null}
}
function setStatus(text){const el=byId('projectStatus');if(el)el.textContent=text}
function getActiveProject(){return projects.find(p=>p.id===activeProjectId)||null}
function updateBadge(){
  const project=getActiveProject();
  byId('activeProjectBadge').textContent=project?'Project: '+project.name:'No active project';
}
function capture2DState(){
  const drawing=byId('drawing');
  const fields=['showName','gagName','location','planDate','loadKg','systemRatio','assistRatio','efficiency'];
  const values={};
  fields.forEach(id=>{const el=byId(id);if(el)values[id]=el.value});
  return {
    svg:drawing?drawing.innerHTML:'',
    background:byId('backgroundImage')?.getAttribute('href')||'',
    showNames:!!byId('show2dNames')?.checked,
    fields:values
  };
}
function restore2DState(state){
  if(!state)return;
  const drawing=byId('drawing');
  if(drawing&&typeof state.svg==='string'){
    drawing.innerHTML=state.svg;
    if(typeof window.rebindAll==='function')window.rebindAll();
    else if(typeof rebindAll==='function')rebindAll();
    if(typeof window.update2DObjectNames==='function')window.update2DObjectNames();
    else if(typeof update2DObjectNames==='function')update2DObjectNames();
  }
  const bg=byId('backgroundImage');if(bg&&state.background)bg.setAttribute('href',state.background);
  const toggle=byId('show2dNames');if(toggle){toggle.checked=!!state.showNames;toggle.dispatchEvent(new Event('change'))}
  Object.entries(state.fields||{}).forEach(([id,value])=>{const el=byId(id);if(el){el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}))}});
}
function captureWorkspaceState(workspace){
  if(workspace==='3d'){window.SimpleRig3D?.ensureReady();return window.SimpleRig3D?.getState()||null}
  if(workspace==='harness')return window.SimpleRigHarness?.getState()||null;
  return capture2DState();
}
function restoreWorkspaceFile(file){
  if(!file)return;
  if(file.workspace==='3d'){byId('switch3d')?.click();requestAnimationFrame(()=>window.SimpleRig3D?.setState(file.state))}
  else if(file.workspace==='harness'){byId('switchHarness')?.click();requestAnimationFrame(()=>window.SimpleRigHarness?.setState(file.state))}
  else{byId('switch2d')?.click();restore2DState(file.state)}
  selectedFileId=file.id;
  byId('timelineFileName').value=file.name;
  renderTimeline();
  setStatus('Opened '+file.name+'.');
}
function createProject(){
  const input=byId('newProjectName');
  const name=input.value.trim()||'Untitled project';
  const project={id:uid('project'),name,createdAt:nowISO(),updatedAt:nowISO(),files:[],events:[]};
  projects.push(project);activeProjectId=project.id;selectedFileId=null;input.value='';
  persist();renderAll();
}
function saveCurrentPlan(overwrite=false){
  const project=getActiveProject();
  if(!project){setStatus('Create or select a project first.');return}
  const requested=byId('timelineWorkspace').value;
  const workspace=requested==='current'?activeWorkspace():requested;
  const name=byId('timelineFileName').value.trim()||`${workspace.toUpperCase()} plan ${project.files.length+1}`;
  const state=captureWorkspaceState(workspace);
  if(!state){setStatus('Could not capture the selected workspace.');return}
  if(overwrite&&selectedFileId){
    const file=project.files.find(f=>f.id===selectedFileId);
    if(file){
      file.name=name;file.workspace=workspace;file.state=state;file.updatedAt=nowISO();
      setStatus('Updated '+name+'.');
    }
  }else{
    const maxPosition=project.files.reduce((m,f)=>Math.max(m,Number(f.position)||0),-1);
    const file={id:uid('file'),name,workspace,state,position:maxPosition+1,createdAt:nowISO(),updatedAt:nowISO()};
    project.files.push(file);selectedFileId=file.id;setStatus('Saved '+name+' to the timeline.');
  }
  project.updatedAt=nowISO();persist();renderAll();
}
function deleteSelected(){
  const project=getActiveProject();if(!project||!selectedFileId)return;
  project.files=project.files.filter(f=>f.id!==selectedFileId);
  project.files.sort((a,b)=>a.position-b.position).forEach((f,i)=>f.position=i);
  selectedFileId=null;project.updatedAt=nowISO();persist();renderAll();
}
function renderProjects(){
  const host=byId('projectList');host.innerHTML='';
  projects.forEach(project=>{
    const card=document.createElement('div');card.className='project-card'+(project.id===activeProjectId?' active':'');
    card.innerHTML=`<strong>${escapeHtml(project.name)}</strong><small>${project.files.length} plan${project.files.length===1?'':'s'} · ${new Date(project.updatedAt).toLocaleDateString('en-GB')}</small>`;
    card.addEventListener('click',()=>{activeProjectId=project.id;selectedFileId=null;persist();renderAll()});
    host.appendChild(card);
  });
}
function renderTimeline(){
  const project=getActiveProject(),items=byId('timelineItems'),empty=byId('timelineEmpty');
  items.innerHTML='';
  if(!project||!project.files.length){empty.style.display='grid';return}
  empty.style.display='none';
  const files=[...project.files].sort((a,b)=>a.position-b.position);
  const usable=Math.max(620,files.length*185);
  byId('projectTimeline').style.minWidth=Math.min(usable,1400)+'px';
  files.forEach((file,index)=>{
    const slot=document.createElement('div');slot.className='timeline-slot';slot.dataset.id=file.id;
    const left=files.length===1?50:8+(index/(files.length-1))*84;
    slot.style.left=left+'%';
    slot.innerHTML=`<div class="timeline-card ${file.id===selectedFileId?'active':''}">
      <strong>${escapeHtml(file.name)}</strong>
      <small>${file.workspace.toUpperCase()} workspace</small>
      <small>${new Date(file.updatedAt).toLocaleString('en-GB')}</small>
    </div><div class="timeline-stem"></div><div class="timeline-dot"></div>`;
    slot.addEventListener('click',event=>{if(dragInfo?.moved)return;restoreWorkspaceFile(file)});
    slot.addEventListener('pointerdown',event=>{
      dragInfo={id:file.id,startX:event.clientX,moved:false};
      slot.classList.add('dragging');slot.setPointerCapture(event.pointerId);
    });
    slot.addEventListener('pointermove',event=>{
      if(!dragInfo||dragInfo.id!==file.id)return;
      if(Math.abs(event.clientX-dragInfo.startX)>5)dragInfo.moved=true;
      if(!dragInfo.moved)return;
      const timelineRect=byId('projectTimeline').getBoundingClientRect();
      const pct=Math.max(5,Math.min(95,(event.clientX-timelineRect.left)/timelineRect.width*100));
      slot.style.left=pct+'%';
    });
    slot.addEventListener('pointerup',event=>{
      slot.classList.remove('dragging');
      if(dragInfo?.moved){
        const rect=byId('projectTimeline').getBoundingClientRect();
        const pct=(event.clientX-rect.left)/rect.width;
        const target=Math.max(0,Math.min(files.length-1,Math.round(pct*(files.length-1))));
        const ordered=[...files];const from=ordered.findIndex(f=>f.id===file.id);const [moved]=ordered.splice(from,1);ordered.splice(target,0,moved);
        ordered.forEach((f,i)=>f.position=i);project.files=ordered;project.updatedAt=nowISO();persist();renderTimeline();
      }
      setTimeout(()=>dragInfo=null,0);
    });
    items.appendChild(slot);
  });
}

function setProjectView(view){
  const calendar=view==='calendar';
  byId('projectTimelineView').hidden=calendar;
  byId('projectCalendarView').hidden=!calendar;
  byId('projectTimelineTab').classList.toggle('active',!calendar);
  byId('projectCalendarTab').classList.toggle('active',calendar);
  if(calendar)renderCalendar()
}
function isoDateLocal(date){
  const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`
}
function addCalendarEvent(dateString){
  const project=getActiveProject();if(!project){setStatus('Create or select a project first.');return}
  const title=prompt('Event title:','Rig build');if(!title)return;
  const type=(prompt('Type: build, shoot, rehearsal, travel, prep, recce, meeting, holiday or note','build')||'note').toLowerCase();
  const location=prompt('Location (optional):','')||'';
  const time=prompt('Time (optional, e.g. 08:00):','')||'';
  project.events=project.events||[];
  project.events.push({id:uid('event'),date:dateString,title:title.trim(),type:['build','shoot','rehearsal','travel','prep','recce','meeting','holiday','note'].includes(type)?type:'note',location,time,createdAt:nowISO()});
  project.updatedAt=nowISO();persist();renderCalendar()
}
function editCalendarEvent(event){
  const project=getActiveProject();if(!project)return;
  const action=prompt(`Edit title, or type DELETE to remove:`,event.title);
  if(action===null)return;
  if(action.trim().toUpperCase()==='DELETE'){
    project.events=project.events.filter(e=>e.id!==event.id)
  }else{
    event.title=action.trim()||event.title;
    const date=prompt('Date (YYYY-MM-DD):',event.date);if(date)event.date=date;
    const location=prompt('Location:',event.location||'');if(location!==null)event.location=location;
    const time=prompt('Time:',event.time||'');if(time!==null)event.time=time
  }
  project.updatedAt=nowISO();persist();renderCalendar()
}
function renderCalendar(){
  const host=byId('projectCalendarGrid'),project=getActiveProject();if(!host)return;
  host.innerHTML='';
  const year=calendarDate.getFullYear(),month=calendarDate.getMonth();
  byId('calendarMonthLabel').textContent=calendarDate.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
  const first=new Date(year,month,1);
  const offset=(first.getDay()+6)%7;
  const start=new Date(year,month,1-offset);
  const today=isoDateLocal(new Date());
  const events=project?.events||[];
  for(let i=0;i<42;i++){
    const date=new Date(start);date.setDate(start.getDate()+i);
    const iso=isoDateLocal(date);
    const cell=document.createElement('div');
    cell.className='calendar-day'+(date.getMonth()!==month?' outside':'')+(iso===today?' today':'');
    cell.innerHTML=`<div class="calendar-date">${date.getDate()}</div>`;
    events.filter(e=>e.date===iso).sort((a,b)=>(a.time||'').localeCompare(b.time||'')).forEach(event=>{
      const button=document.createElement('button');button.type='button';button.className='calendar-event '+event.type;
      button.textContent=(event.time?event.time+' ':'')+event.title;
      button.title=[event.title,event.location,event.time].filter(Boolean).join(' · ');
      button.addEventListener('click',e=>{e.stopPropagation();editCalendarEvent(event)});
      cell.appendChild(button)
    });
    cell.addEventListener('click',()=>addCalendarEvent(iso));
    host.appendChild(cell)
  }
}

function renderAll(){renderProjects();renderTimeline();renderCalendar();updateBadge()}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function exportProject(){
  const project=getActiveProject();if(!project){setStatus('Select a project to export.');return}
  const payload={format:'SimpleRigProject',version:1,exportedAt:nowISO(),project};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(project.name.replace(/[^a-z0-9_-]+/gi,'-')||'project')+'.simplerig';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  setStatus('Project exported.');
}
function importProject(file){
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const payload=JSON.parse(reader.result);
      const project=payload.project||payload;
      if(!project||!Array.isArray(project.files))throw new Error('Invalid project');if(!Array.isArray(project.events))project.events=[];
      project.id=uid('project');project.name=(project.name||'Imported project')+' (imported)';project.updatedAt=nowISO();
      project.files.forEach((f,i)=>{f.id=uid('file');f.position=i});
      projects.push(project);activeProjectId=project.id;selectedFileId=null;persist();renderAll();setStatus('Project imported.');
    }catch(error){setStatus('That file is not a valid SimpleRig project.')}
  };
  reader.readAsText(file);
}

// Active-workspace image for PDF.
window.SimpleRigCaptureActiveWorkspace=async function(){
  const workspace=activeWorkspace();
  if(workspace==='3d'){
    window.SimpleRig3D?.ensureReady();
    return {workspace:'3d',dataUrl:window.SimpleRig3D?.captureDataURL()};
  }
  if(typeof window.renderSvgToJpeg==='function')return {workspace:'2d',dataUrl:await window.renderSvgToJpeg()};
  // Independent fallback capture of 2D SVG.
  const svg=byId('drawing')?.closest('svg')||byId('drawing');
  if(!svg)return {workspace:'2d',dataUrl:null};
  const clone=svg.cloneNode(true);clone.querySelectorAll('.selection,.rig-handle,.rig-hit,.touch-target').forEach(el=>el.remove());
  const data=new XMLSerializer().serializeToString(clone);
  const blob=new Blob([data],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),img=new Image();
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});
  const c=document.createElement('canvas');c.width=1600;c.height=1000;const cx=c.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,c.width,c.height);cx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);
  return {workspace:'2d',dataUrl:c.toDataURL('image/jpeg',.94)};
};

// Replace PDF button behaviour in capture phase so active workspace is always used.
byId('downloadPdfBtn')?.addEventListener('click',async event=>{
  event.preventDefault();event.stopImmediatePropagation();
  const captured=await window.SimpleRigCaptureActiveWorkspace();
  if(!captured.dataUrl){alert('Could not capture the current workspace.');return}
  const bytes=Uint8Array.from(atob(captured.dataUrl.split(',')[1]),c=>c.charCodeAt(0));
  const img=new Image();img.src=captured.dataUrl;await img.decode();
  const equipment=[];
  const ratio={
    load:Number(byId(captured.workspace==='3d'?'sr3Load':'loadKg')?.value)||0,
    main:Number(byId(captured.workspace==='3d'?'sr3Ratio':'systemRatio')?.value)||1,
    assist:Number(byId('assistRatio')?.value)||1,
    eff:Number(byId(captured.workspace==='3d'?'sr3Efficiency':'efficiency')?.value)||100,
    tension:'—',pull:byId(captured.workspace==='3d'?'sr3Pull':'pullResult')?.textContent||'—'
  };
  const details={
    show:byId('showName')?.value||'Rig Plan',
    gag:byId('gagName')?.value||'',
    location:byId('location')?.value||''
  };
  if(typeof window.buildSinglePagePdf!=='function'){alert('PDF generator is unavailable.');return}
  const blob=window.buildSinglePagePdf(bytes,img.naturalWidth||1600,img.naturalHeight||1000,equipment,ratio,details);
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(details.show||'rig-plan').replace(/[^a-z0-9_-]+/gi,'-')+'-'+captured.workspace+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
},true);


byId('projectTimelineTab').addEventListener('click',()=>setProjectView('timeline'));
byId('projectCalendarTab').addEventListener('click',()=>setProjectView('calendar'));
byId('calendarPrev').addEventListener('click',()=>{calendarDate=new Date(calendarDate.getFullYear(),calendarDate.getMonth()-1,1);renderCalendar()});
byId('calendarNext').addEventListener('click',()=>{calendarDate=new Date(calendarDate.getFullYear(),calendarDate.getMonth()+1,1);renderCalendar()});
byId('calendarToday').addEventListener('click',()=>{calendarDate=new Date();renderCalendar()});
byId('calendarAddEvent').addEventListener('click',()=>addCalendarEvent(isoDateLocal(new Date(calendarDate.getFullYear(),calendarDate.getMonth(),1))));
byId('saveCurrentToProjectBtn').addEventListener('click',()=>{if(!getActiveProject()){panel.classList.add('open');panel.setAttribute('aria-hidden','false');renderAll();setStatus('Create or select a project, then press Save current plan.');return}byId('timelineWorkspace').value='current';if(!byId('timelineFileName').value.trim())byId('timelineFileName').value=(activeWorkspace()==='harness'?'Harness reference':activeWorkspace().toUpperCase()+' plan');saveCurrentPlan(false)});
byId('saveHarnessToProject').addEventListener('click',()=>{byId('timelineWorkspace').value='harness';byId('timelineFileName').value=byId('harnessTitle').value.trim()||'Harness Reference';if(!getActiveProject()){panel.classList.add('open');panel.setAttribute('aria-hidden','false');renderAll();setStatus('Create or select a project, then save the harness sheet.')}else saveCurrentPlan(false)});

byId('openProjectsBtn').addEventListener('click',()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');renderAll()});
byId('closeProjectsBtn').addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});
byId('createProjectBtn').addEventListener('click',createProject);
byId('newProjectName').addEventListener('keydown',e=>{if(e.key==='Enter')createProject()});
byId('saveToProjectBtn').addEventListener('click',()=>saveCurrentPlan(false));
byId('overwriteProjectFileBtn').addEventListener('click',()=>saveCurrentPlan(true));
byId('deleteProjectFileBtn').addEventListener('click',deleteSelected);
byId('exportProjectBtn').addEventListener('click',exportProject);
byId('importProjectFile').addEventListener('change',e=>{if(e.target.files[0])importProject(e.target.files[0]);e.target.value=''});
loadPersisted();renderAll();
})();
