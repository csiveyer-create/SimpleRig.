(()=>{
'use strict';
const q=id=>document.getElementById(id);
function setupCollapsibles(){
  document.querySelectorAll('.collapsible-panel').forEach((panel,index)=>{
    if(panel.querySelector(':scope > .collapsible-titlebar'))return;
    const content=document.createElement('div');content.className='collapsible-content';
    [...panel.children].forEach(child=>content.appendChild(child));
    const bar=document.createElement('div');bar.className='collapsible-titlebar';
    const title=document.createElement('strong');title.textContent=panel.dataset.panelTitle||`Panel ${index+1}`;
    const toggle=document.createElement('button');toggle.type='button';toggle.textContent='+';
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',()=>{const closed=panel.classList.toggle('collapsed');toggle.textContent=closed?'+':'−';toggle.setAttribute('aria-expanded',String(!closed))});
    bar.append(title,toggle);panel.append(bar,content);panel.classList.add('collapsed')
  })
}
q('openProjectsTopBtn')?.addEventListener('click',()=>q('openProjectsBtn')?.click());
q('saveCurrentTopBtn')?.addEventListener('click',()=>q('saveCurrentToProjectBtn')?.click());
const sourceBadge=q('activeProjectBadge'),topBadge=q('activeProjectTopBadge');
if(sourceBadge&&topBadge)new MutationObserver(()=>topBadge.textContent=sourceBadge.textContent).observe(sourceBadge,{childList:true,subtree:true});

const tutorialSteps=[
 {title:'Projects first',body:'<ol><li>Open <strong>Projects</strong> from the left side of the top bar.</li><li>Create or select a project.</li><li>Save the current 2D, 3D or harness workspace.</li><li>Use Timeline and Monthly calendar to organise the production.</li></ol>'},
 {title:'2D planning',body:'<ol><li>Open a collapsed title bar when you need its tools.</li><li>Add equipment, rig lines and attachment roles.</li><li>Mark the operating point and enter the load and ratio.</li><li>Export the drawing or save it into the project.</li></ol>'},
 {title:'3D visualisation',body:'<ol><li>Import GLB, GLTF, OBJ or STL files from the 3D library panel.</li><li>Select objects and use move, rotate and scale.</li><li>Add a sample ground and organise objects in Layers.</li><li>Save the complete scene into your project.</li></ol>'},
 {title:'Harness reference',body:'<ol><li>Choose the performer and harness configuration.</li><li>Select <strong>Add shackle</strong>, then click the attachment point.</li><li>For a leader, choose 3 mm or 6 mm and enter its length before selecting the point.</li><li>Use Front / Back and Rotate controls to document rear or side attachments.</li></ol>'}
];
let tutorialIndex=0;
function renderTutorial(){
 const step=tutorialSteps[tutorialIndex],host=q('tutorialContent');host.innerHTML=`<h3>${step.title}</h3>${step.body}`;
 document.querySelectorAll('[data-tutorial-step]').forEach((b,i)=>b.classList.toggle('active',i===tutorialIndex));
 q('tutorialPrev').disabled=tutorialIndex===0;q('tutorialNext').textContent=tutorialIndex===tutorialSteps.length-1?'Finish':'Next'
}
q('tutorialBtn')?.addEventListener('click',()=>{tutorialIndex=0;renderTutorial();q('tutorialDialog').showModal()});
q('closeTutorialBtn')?.addEventListener('click',()=>q('tutorialDialog').close());
q('tutorialPrev')?.addEventListener('click',()=>{tutorialIndex=Math.max(0,tutorialIndex-1);renderTutorial()});
q('tutorialNext')?.addEventListener('click',()=>{if(tutorialIndex===tutorialSteps.length-1)q('tutorialDialog').close();else{tutorialIndex++;renderTutorial()}});
document.querySelectorAll('[data-tutorial-step]').forEach(b=>b.addEventListener('click',()=>{tutorialIndex=Number(b.dataset.tutorialStep);renderTutorial()}));

const dictionaries={
 en:{projects:'Projects',saveCurrent:'Save current',plan2d:'2D Plan',visual3d:'3D Visualisation',harnessReference:'Harness Reference',language:'Language',tutorial:'Tutorial',addShackle:'Add shackle',addLeader:'Add leader',addNote:'Add note',deleteSelected:'Delete selected',clearSheet:'Clear sheet'},
 fr:{projects:'Projets',saveCurrent:'Enregistrer',plan2d:'Plan 2D',visual3d:'Visualisation 3D',harnessReference:'Référence harnais',language:'Langue',tutorial:'Tutoriel',addShackle:'Ajouter une manille',addLeader:'Ajouter une longe',addNote:'Ajouter une note',deleteSelected:'Supprimer la sélection',clearSheet:'Effacer la fiche'},
 es:{projects:'Proyectos',saveCurrent:'Guardar actual',plan2d:'Plano 2D',visual3d:'Visualización 3D',harnessReference:'Referencia de arnés',language:'Idioma',tutorial:'Tutorial',addShackle:'Añadir grillete',addLeader:'Añadir línea guía',addNote:'Añadir nota',deleteSelected:'Eliminar selección',clearSheet:'Limpiar hoja'},
 th:{projects:'โครงการ',saveCurrent:'บันทึกปัจจุบัน',plan2d:'แผน 2D',visual3d:'ภาพ 3D',harnessReference:'อ้างอิงสายรัด',language:'ภาษา',tutorial:'บทช่วยสอน',addShackle:'เพิ่มแช็กเคิล',addLeader:'เพิ่มลีดเดอร์',addNote:'เพิ่มหมายเหตุ',deleteSelected:'ลบที่เลือก',clearSheet:'ล้างแผ่นงาน'},
 zh:{projects:'项目',saveCurrent:'保存当前',plan2d:'2D 平面图',visual3d:'3D 可视化',harnessReference:'安全带参考',language:'语言',tutorial:'教程',addShackle:'添加卸扣',addLeader:'添加连接绳',addNote:'添加备注',deleteSelected:'删除所选',clearSheet:'清空表格'},
 ja:{projects:'プロジェクト',saveCurrent:'現在を保存',plan2d:'2D プラン',visual3d:'3D 表示',harnessReference:'ハーネス参照',language:'言語',tutorial:'チュートリアル',addShackle:'シャックルを追加',addLeader:'リーダーを追加',addNote:'メモを追加',deleteSelected:'選択を削除',clearSheet:'シートを消去'},
 de:{projects:'Projekte',saveCurrent:'Aktuelles speichern',plan2d:'2D-Plan',visual3d:'3D-Visualisierung',harnessReference:'Gurtzeug-Referenz',language:'Sprache',tutorial:'Anleitung',addShackle:'Schäkel hinzufügen',addLeader:'Leader hinzufügen',addNote:'Notiz hinzufügen',deleteSelected:'Auswahl löschen',clearSheet:'Blatt leeren'}
};
function setLanguage(lang){
 const d=dictionaries[lang]||dictionaries.en;document.documentElement.lang=lang;
 document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(d[key])el.textContent=d[key]});
 try{localStorage.setItem('SimpleRigLanguage',lang)}catch(_){}
}
q('languageSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
let saved='en';try{saved=localStorage.getItem('SimpleRigLanguage')||'en'}catch(_){}
q('languageSelect').value=saved;setLanguage(saved);
setupCollapsibles();
})();
