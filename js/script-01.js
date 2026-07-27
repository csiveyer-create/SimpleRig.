(() => {
try {
  const NS='http://www.w3.org/2000/svg',svg=document.getElementById('rigCanvas'),rigLayer=document.getElementById('rigLineLayer'),drawing=document.getElementById('drawingLayer'),selection=document.getElementById('selectionLayer'),background=document.getElementById('backgroundLayer'),status=document.getElementById('status');
  let selected=null,selectedRig=null,drag=null,activeHandle=null;
  let undoStack=[],redoStack=[],gestureBefore=null,controlBefore=null,restoringHistory=false;
  const baseView={x:0,y:0,w:1000,h:750};
  let view={...baseView},zoomLevel=1,panMode=false,panDrag=null;
  const activePointers=new Map();
  let pinchStart=null;
  const SIMPLE_RIG_LIBRARY=[{"id":"pulleys","name":"Pulleys","assets":[{"id":"single_pulley","name":"Single Pulley","icon":"unique-icons/single_pulley.svg","model":"Pulleys/3d/single_pulley.glb","spec":"Pulleys/specs/single_pulley.json","thumbnail":"unique-icons/single_pulley.svg","triangles":10264},{"id":"double_pulley","name":"Double Pulley","icon":"unique-icons/double_pulley.svg","model":"Pulleys/3d/double_pulley.glb","spec":"Pulleys/specs/double_pulley.json","thumbnail":"unique-icons/double_pulley.svg","triangles":15128},{"id":"rescue_pulley","name":"Rescue Pulley","icon":"unique-icons/rescue_pulley.svg","model":"Pulleys/3d/rescue_pulley.glb","spec":"Pulleys/specs/rescue_pulley.json","thumbnail":"unique-icons/rescue_pulley.svg","triangles":10276},{"id":"progress_capture_pulley","name":"Progress Capture Pulley","icon":"unique-icons/progress_capture_pulley.svg","model":"Pulleys/3d/progress_capture_pulley.glb","spec":"Pulleys/specs/progress_capture_pulley.json","thumbnail":"unique-icons/progress_capture_pulley.svg","triangles":10532}]},{"id":"hardware","name":"Hardware","assets":[{"id":"rope_grab","name":"Rope Grab","icon":"unique-icons/rope_grab.svg","model":"Hardware/3d/rope_grab.glb","spec":"Hardware/specs/rope_grab.json","thumbnail":"unique-icons/rope_grab.svg","triangles":7564},{"id":"clutch","name":"Clutch","icon":"unique-icons/clutch.svg","model":"Hardware/3d/clutch.glb","spec":"Hardware/specs/clutch.json","thumbnail":"unique-icons/clutch.svg","triangles":5144},{"id":"bollard","name":"Bollard","icon":"unique-icons/bollard.svg","model":"Hardware/3d/bollard.glb","spec":"Hardware/specs/bollard.json","thumbnail":"unique-icons/bollard.svg","triangles":1024},{"id":"descender","name":"Descender","icon":"unique-icons/descender.svg","model":"Hardware/3d/descender.glb","spec":"Hardware/specs/descender.json","thumbnail":"unique-icons/descender.svg","triangles":5888},{"id":"carabiner","name":"Carabiner","icon":"unique-icons/carabiner.svg","model":"Hardware/3d/carabiner.glb","spec":"Hardware/specs/carabiner.json","thumbnail":"unique-icons/carabiner.svg","triangles":5772},{"id":"shackle","name":"Bow Shackle","icon":"unique-icons/shackle.svg","model":"Hardware/3d/shackle.glb","spec":"Hardware/specs/shackle.json","thumbnail":"unique-icons/shackle.svg","triangles":6016},{"id":"rigging_plate","name":"Rigging Plate","icon":"unique-icons/rigging_plate.svg","model":"Hardware/3d/rigging_plate.glb","spec":"Hardware/specs/rigging_plate.json","thumbnail":"unique-icons/rigging_plate.svg","triangles":1152},{"id":"swivel","name":"Swivel","icon":"unique-icons/swivel.svg","model":"Hardware/3d/swivel.glb","spec":"Hardware/specs/swivel.json","thumbnail":"unique-icons/swivel.svg","triangles":9472}]},{"id":"truss","name":"Truss","assets":[{"id":"truss_1m","name":"Box Truss 1 m","icon":"unique-icons/truss_1m.svg","model":"Truss/3d/truss_1m.glb","spec":"Truss/specs/truss_1m.json","thumbnail":"unique-icons/truss_1m.svg","triangles":896},{"id":"truss_2m","name":"Box Truss 2 m","icon":"unique-icons/truss_2m.svg","model":"Truss/3d/truss_2m.glb","spec":"Truss/specs/truss_2m.json","thumbnail":"unique-icons/truss_2m.svg","triangles":1472},{"id":"truss_3m","name":"Box Truss 3 m","icon":"unique-icons/truss_3m.svg","model":"Truss/3d/truss_3m.glb","spec":"Truss/specs/truss_3m.json","thumbnail":"unique-icons/truss_3m.svg","triangles":2048},{"id":"truss_corner","name":"Box Truss 90\u00b0 Corner","icon":"unique-icons/truss_corner.svg","model":"Truss/3d/truss_corner.glb","spec":"Truss/specs/truss_corner.json","thumbnail":"unique-icons/truss_corner.svg","triangles":1792},{"id":"truss_baseplate","name":"Truss Base Plate","icon":"unique-icons/truss_baseplate.svg","model":"Truss/3d/truss_baseplate.glb","spec":"Truss/specs/truss_baseplate.json","thumbnail":"unique-icons/truss_baseplate.svg","triangles":1036}]},{"id":"scaffold","name":"Scaffold","assets":[{"id":"scaffold_tube_1m","name":"Scaffold Tube 1 m","icon":"unique-icons/scaffold_tube_1m.svg","model":"Scaffold/3d/scaffold_tube_1m.glb","spec":"Scaffold/specs/scaffold_tube_1m.json","thumbnail":"unique-icons/scaffold_tube_1m.svg","triangles":192},{"id":"scaffold_tube_2m","name":"Scaffold Tube 2 m","icon":"unique-icons/scaffold_tube_2m.svg","model":"Scaffold/3d/scaffold_tube_2m.glb","spec":"Scaffold/specs/scaffold_tube_2m.json","thumbnail":"unique-icons/scaffold_tube_2m.svg","triangles":192},{"id":"scaffold_tube_3m","name":"Scaffold Tube 3 m","icon":"unique-icons/scaffold_tube_3m.svg","model":"Scaffold/3d/scaffold_tube_3m.glb","spec":"Scaffold/specs/scaffold_tube_3m.json","thumbnail":"unique-icons/scaffold_tube_3m.svg","triangles":192},{"id":"right_angle_coupler","name":"Right-Angle Coupler","icon":"unique-icons/right_angle_coupler.svg","model":"Scaffold/3d/right_angle_coupler.glb","spec":"Scaffold/specs/right_angle_coupler.json","thumbnail":"unique-icons/right_angle_coupler.svg","triangles":524},{"id":"swivel_coupler","name":"Swivel Coupler","icon":"unique-icons/swivel_coupler.svg","model":"Scaffold/3d/swivel_coupler.glb","spec":"Scaffold/specs/swivel_coupler.json","thumbnail":"unique-icons/swivel_coupler.svg","triangles":524},{"id":"base_jack","name":"Adjustable Base Jack","icon":"unique-icons/base_jack.svg","model":"Scaffold/3d/base_jack.glb","spec":"Scaffold/specs/base_jack.json","thumbnail":"unique-icons/base_jack.svg","triangles":780}]},{"id":"camera","name":"Camera","assets":[{"id":"wirecam","name":"Wirecam Trolley","icon":"unique-icons/wirecam.svg","model":"Camera/3d/wirecam.glb","spec":"Camera/specs/wirecam.json","thumbnail":"unique-icons/wirecam.svg","triangles":1572},{"id":"camera_body","name":"Cinema Camera Body","icon":"unique-icons/camera_body.svg","model":"Camera/3d/camera_body.glb","spec":"Camera/specs/camera_body.json","thumbnail":"unique-icons/camera_body.svg","triangles":280},{"id":"remote_head","name":"Remote Camera Head","icon":"unique-icons/remote_head.svg","model":"Camera/3d/remote_head.glb","spec":"Camera/specs/remote_head.json","thumbnail":"unique-icons/remote_head.svg","triangles":524}]},{"id":"machines","name":"Machines","assets":[{"id":"winch","name":"Stage Winch","icon":"unique-icons/winch.svg","model":"Machines/3d/winch.glb","spec":"Machines/specs/winch.json","thumbnail":"unique-icons/winch.svg","triangles":24112},{"id":"telehandler","name":"Telehandler","icon":"unique-icons/telehandler.svg","model":"Machines/3d/telehandler.glb","spec":"Machines/specs/telehandler.json","thumbnail":"unique-icons/telehandler.svg","triangles":1084},{"id":"telehandler_boom_out","name":"Telehandler \u2014 Boom Extended","icon":"unique-icons/telehandler_boom_out.svg","model":"Machines/3d/telehandler_boom_out.glb","spec":"Machines/specs/telehandler_boom_out.json","thumbnail":"unique-icons/telehandler_boom_out.svg","triangles":1096},{"id":"scissor_lift","name":"Scissor Lift","icon":"unique-icons/scissor_lift.svg","model":"Machines/3d/scissor_lift.glb","spec":"Machines/specs/scissor_lift.json","thumbnail":"unique-icons/scissor_lift.svg","triangles":2072},{"id":"scissor_lift_raised","name":"Scissor Lift \u2014 Raised","icon":"unique-icons/scissor_lift_raised.svg","model":"Machines/3d/scissor_lift_raised.glb","spec":"Machines/specs/scissor_lift_raised.json","thumbnail":"unique-icons/scissor_lift_raised.svg","triangles":2584}]},{"id":"people","name":"People","assets":[{"id":"performer","name":"Performer","icon":"unique-icons/performer.svg","model":"","spec":"","thumbnail":"unique-icons/performer.svg","triangles":0}]}];
  const icons={};
  SIMPLE_RIG_LIBRARY.forEach(category=>category.assets.forEach(asset=>{
    icons[asset.name]={
      photo:asset.icon,
      plan:asset.icon,
      model:asset.model,
      spec:asset.spec,
      category:category.name,
      id:asset.id
    };
  }));
  function applyView(){
    svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`);
    document.getElementById('zoomResetBtn').textContent=Math.round(zoomLevel*100)+'%';
  }
  function clampView(){
    const maxW=baseView.w*2,maxH=baseView.h*2;
    view.w=Math.min(maxW,Math.max(baseView.w/6,view.w));
    view.h=Math.min(maxH,Math.max(baseView.h/6,view.h));
    zoomLevel=baseView.w/view.w;
    const minX=baseView.x-(view.w-baseView.w)/2-(view.w*.15),maxX=baseView.x+baseView.w-view.w+(view.w-baseView.w)/2+(view.w*.15);
    const minY=baseView.y-(view.h-baseView.h)/2-(view.h*.15),maxY=baseView.y+baseView.h-view.h+(view.h-baseView.h)/2+(view.h*.15);
    view.x=Math.min(maxX,Math.max(minX,view.x));
    view.y=Math.min(maxY,Math.max(minY,view.y));
  }
  function zoomAt(factor,cx=baseView.w/2,cy=baseView.h/2){
    const oldW=view.w,oldH=view.h;
    const nextW=oldW/factor,nextH=oldH/factor;
    const rx=(cx-view.x)/oldW,ry=(cy-view.y)/oldH;
    view.w=nextW;view.h=nextH;
    view.x=cx-rx*nextW;view.y=cy-ry*nextH;
    clampView();applyView();
    status.textContent=`Zoom ${Math.round(zoomLevel*100)}%. Use Pan or two fingers to move around.`;
  }
  function resetZoom(){
    view={...baseView};zoomLevel=1;applyView();
    status.textContent='Zoom reset to 100%.';
  }
  function screenToSvg(clientX,clientY){
    const p=svg.createSVGPoint();p.x=clientX;p.y=clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  }
  function pt(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
  function uid(){return Math.random().toString(36).slice(2,9)}
  function ensureObjectHistoryId(el){if(el&&!el.dataset.historyId)el.dataset.historyId='obj-'+uid();return el?.dataset.historyId||null}
  function snapshot(){
    drawing.querySelectorAll('[data-object="true"]').forEach(ensureObjectHistoryId);
    return JSON.stringify({background:background.innerHTML,rig:rigLayer.innerHTML,drawing:drawing.innerHTML,selectedObject:selected?ensureObjectHistoryId(selected):null,selectedRig:selectedRig?selectedRig.dataset.id:null})
  }
  function updateHistoryButtons(){document.getElementById('undoBtn').disabled=!undoStack.length;document.getElementById('redoBtn').disabled=!redoStack.length}
  function commitHistory(before){if(restoringHistory||!before)return;const after=snapshot();if(after!==before){undoStack.push(before);if(undoStack.length>80)undoStack.shift();redoStack=[];updateHistoryButtons()}}
  function recordAction(fn){const before=snapshot();fn();commitHistory(before)}
  function rebindAll(){
    drawing.querySelectorAll('[data-object="true"]').forEach(bindIcon);
    rigLayer.querySelectorAll('[data-rig="true"]').forEach(g=>{
      g.querySelectorAll('polyline').forEach(line=>line.addEventListener('pointerdown',e=>{e.stopPropagation();selectRig(g)}));
      g.querySelectorAll('.rig-handle').forEach(h=>h.addEventListener('pointerdown',e=>{e.stopPropagation();selectRig(g);activeHandle=h;activeHandle._startPoints=JSON.parse(g.dataset.points||'[]');gestureBefore=snapshot();try{svg.setPointerCapture(e.pointerId)}catch(_){}}));
    });
  }
  function restoreSnapshot(state){
    restoringHistory=true;
    try{
      const data=JSON.parse(state);
      background.innerHTML=data.background||'';rigLayer.innerHTML=data.rig||'';drawing.innerHTML=data.drawing||'';
      selection.innerHTML='';selected=null;selectedRig=null;rebindAll();update2DObjectNames();
      if(data.selectedObject){const restored=[...drawing.querySelectorAll('[data-object="true"]')].find(el=>el.dataset.historyId===data.selectedObject);if(restored)select(restored)}
      if(!selected&&data.selectedRig){const rig=rigLayer.querySelector(`[data-id="${data.selectedRig}"]`);if(rig)selectRig(rig)}
    }finally{restoringHistory=false;updateHistoryButtons()}
  }
  function undo(){if(!undoStack.length){status.textContent='Nothing to undo.';return}const current=snapshot();const previous=undoStack.pop();redoStack.push(current);restoreSnapshot(previous);updateHistoryButtons();status.textContent='Undone.'}
  function redo(){if(!redoStack.length){status.textContent='Nothing to redo.';return}const current=snapshot();const next=redoStack.pop();undoStack.push(current);restoreSnapshot(next);updateHistoryButtons();status.textContent='Redone.'}
  function duplicateSelected(){if(!selected){status.textContent='Select an icon to duplicate.';return}const clone=selected.cloneNode(true);clone.dataset.x=String((+selected.dataset.x||0)+35);clone.dataset.y=String((+selected.dataset.y||0)+35);delete clone.dataset.rigId;delete clone.dataset.controlIndex;delete clone.dataset.attachMode;drawing.appendChild(clone);bindIcon(clone);applyTransform(clone);select(clone);status.textContent='Object duplicated.'}
  function deleteSelection(){
    if(selected){
      const target=selected,rigId=target.dataset.rigId,index=Number(target.dataset.controlIndex);
      if(rigId){
        const rig=rigLayer.querySelector(`[data-id="${rigId}"]`);
        if(rig){
          const points=JSON.parse(rig.dataset.points||'[]');
          if(index>0&&index<points.length-1)points.splice(index,1);
          rig.dataset.points=JSON.stringify(points);
          drawing.querySelectorAll(`[data-rig-id="${rigId}"]`).forEach(other=>{if(other!==target&&Number(other.dataset.controlIndex)>index)other.dataset.controlIndex=String(Number(other.dataset.controlIndex)-1)});
          renderRig(rig);
        }
      }
      target.remove();selected=null;selection.innerHTML='';status.textContent='Object deleted.';return;
    }
    if(selectedRig){
      const id=selectedRig.dataset.id;
      drawing.querySelectorAll(`[data-rig-id="${id}"]`).forEach(el=>{delete el.dataset.rigId;delete el.dataset.controlIndex;delete el.dataset.attachMode});
      selectedRig.remove();selectedRig=null;selection.innerHTML='';status.textContent='Rig line deleted.';return;
    }
    status.textContent='Select an object or rig line to delete.';
  }
  function addRigLine(){
    // Hard stop: an object attached to an existing terminal node must never
    // cause another rope, extension or endpoint to be generated.
    if(selected?.dataset?.rigId && selected.dataset.attachMode==='end'){
      const existing=rigLayer.querySelector(`[data-id="${selected.dataset.rigId}"]`);
      if(existing){
        renderRig(existing);
        selectRig(existing);
        status.textContent='This object is already attached to the end of the existing rig line. No new rig line was created.';
        return existing
      }
    }

    // If a selected free object is sitting on an existing terminal node,
    // attach it to that node instead of generating another rope.
    if(selected && !selected.dataset.rigId){
      const end=nearestEndpoint(+selected.dataset.x,+selected.dataset.y);
      if(end && end.d<=70){
        selected.dataset.rigId=end.rig.dataset.id;
        selected.dataset.controlIndex=String(end.index);
        selected.dataset.attachMode='end';
        selected.dataset.x=String(end.p.x);
        selected.dataset.y=String(end.p.y);
        applyTransform(selected);
        renderRig(end.rig);
        drawSelection();
        selectRig(end.rig);
        status.textContent='Object attached to the existing terminal node. No new rig line was created.';
        return end.rig
      }
    }

    const n=rigLayer.querySelectorAll('[data-rig="true"]').length;
    const y=300+n*55;
    const g=document.createElementNS(NS,'g');
    g.dataset.rig='true';
    g.dataset.id=uid();
    g.dataset.colour='#111827';
    g.dataset.points=JSON.stringify([{x:180,y},{x:820,y}]);

    const hit=document.createElementNS(NS,'polyline');
    hit.setAttribute('fill','none');
    hit.setAttribute('stroke','transparent');
    hit.setAttribute('stroke-width','28');
    hit.classList.add('rig-hit');
    hit.addEventListener('pointerdown',e=>{e.stopPropagation();selectRig(g)});

    const path=document.createElementNS(NS,'polyline');
    path.setAttribute('fill','none');
    path.setAttribute('stroke','#111827');
    path.setAttribute('stroke-width','6');
    path.setAttribute('stroke-linecap','round');
    path.setAttribute('stroke-linejoin','round');
    path.dataset.visible='true';
    path.addEventListener('pointerdown',e=>{e.stopPropagation();selectRig(g)});

    g.append(hit,path);
    g.append(makeHandle(g.dataset.id,0,180,y),makeHandle(g.dataset.id,1,820,y));
    rigLayer.appendChild(g);
    renderRig(g);
    selectRig(g);
    return g
  }
  function makeHandle(rid,index,x,y){const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r','15');c.setAttribute('fill','#2563eb');c.setAttribute('stroke','#fff');c.setAttribute('stroke-width','4');c.classList.add('rig-handle');c.dataset.rigId=rid;c.dataset.pointIndex=index;c.addEventListener('pointerdown',e=>{e.stopPropagation();const rig=rigLayer.querySelector(`[data-id="${rid}"]`);selectRig(rig);activeHandle=c;activeHandle._startPoints=JSON.parse(rig.dataset.points||'[]');gestureBefore=snapshot();try{svg.setPointerCapture(e.pointerId)}catch(_){}});return c}
  function selectRig(g){selectedRig=g;document.getElementById('rigLineColour').value=g.dataset.colour||'#111827';rigLayer.querySelectorAll('[data-rig="true"]').forEach(r=>r.querySelectorAll('.rig-handle').forEach(h=>h.setAttribute('fill',r===g?'#2563eb':'#6b7280')));status.textContent='Rig line selected. Drag either end node or change its colour.'}
  function renderRig(g){
    const points=JSON.parse(g.dataset.points),pointString=points.map(p=>`${p.x},${p.y}`).join(' ');
    g.querySelectorAll('polyline').forEach(p=>p.setAttribute('points',pointString));g.querySelector('[data-visible="true"]').setAttribute('stroke',g.dataset.colour||'#111827');
    g.querySelectorAll('.rig-handle').forEach(h=>h.remove());
    if(points.length){g.append(makeHandle(g.dataset.id,0,points[0].x,points[0].y));if(points.length>1)g.append(makeHandle(g.dataset.id,points.length-1,points.at(-1).x,points.at(-1).y))}
    drawing.querySelectorAll(`[data-rig-id="${g.dataset.id}"]`).forEach(el=>{const p=points[+el.dataset.controlIndex];if(p){el.dataset.x=p.x;el.dataset.y=p.y;applyTransform(el)}})
  }

  function rigLength(points){
    let total=0;
    for(let i=0;i<points.length-1;i++)total+=Math.hypot(points[i+1].x-points[i].x,points[i+1].y-points[i].y);
    return total
  }
  function ensureFiniteLength(rig){
    const points=JSON.parse(rig.dataset.points||'[]');
    const current=rigLength(points);
    if(!Number.isFinite(Number(rig.dataset.liveLength))||Number(rig.dataset.liveLength)<=0)rig.dataset.liveLength=String(current);
    return Number(rig.dataset.liveLength)
  }
  function clearFiniteLengths(){
    rigLayer.querySelectorAll('[data-rig="true"]').forEach(rig=>delete rig.dataset.liveLength)
  }
  function setAllFiniteLengths(){
    rigLayer.querySelectorAll('[data-rig="true"]').forEach(rig=>{
      const points=JSON.parse(rig.dataset.points||'[]');
      rig.dataset.liveLength=String(rigLength(points))
    })
  }
  function endpointIsFixed(rig,index){
    const attached=[...drawing.querySelectorAll(`[data-rig-id="${rig.dataset.id}"]`)]
      .filter(obj=>Number(obj.dataset.controlIndex)===index);
    return attached.some(obj=>{
      const role=(obj.dataset.role||'').toLowerCase();
      const name=(obj.dataset.name||'').toLowerCase();
      return role==='fixed'||name.includes('tie-off')||name.includes('anchor')||
        name.includes('truss')||name.includes('bollard')||name.includes('rope grab')
    })
  }

  function terminalSegmentLength(points,index){
    const last=points.length-1;
    if(index===0)return Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y);
    if(index===last)return Math.hypot(points[last].x-points[last-1].x,points[last].y-points[last-1].y);
    return 0
  }

  function moveEndpointAlongItsSegment(points,index,distanceTowardNeighbour){
    const last=points.length-1;
    const neighbourIndex=index===0?1:last-1;
    const endpoint=points[index],neighbour=points[neighbourIndex];
    let dx=neighbour.x-endpoint.x,dy=neighbour.y-endpoint.y;
    const length=Math.hypot(dx,dy)||1;
    dx/=length;dy/=length;
    const travel=Math.max(-length,Math.min(length,distanceTowardNeighbour));
    points[index]={x:endpoint.x+dx*travel,y:endpoint.y+dy*travel}
  }

  function chooseOppositeEndpoint(rig,movedIndex,last){
    const choices=movedIndex===0?[last]:movedIndex===last?[0]:[0,last];
    return choices.find(i=>!endpointIsFixed(rig,i)) ?? choices[0]
  }

  function reactFiniteLine(rig,movedIndex,previousPoints){
    const points=JSON.parse(rig.dataset.points||'[]');
    if(points.length<2)return points;

    const last=points.length-1;
    const target=ensureFiniteLength(rig);
    const opposite=chooseOppositeEndpoint(rig,movedIndex,last);

    if(movedIndex===0||movedIndex===last){
      // Pulling one free end pays out that end and retracts the opposite end.
      const before=previousPoints?.length===points.length
        ?terminalSegmentLength(previousPoints,movedIndex)
        :terminalSegmentLength(points,movedIndex);
      const after=terminalSegmentLength(points,movedIndex);
      const paidOut=after-before;

      if(Math.abs(paidOut)>0.0001){
        // Positive payout means retract the other end toward its neighbour.
        // Negative payout means feed the other end back out.
        moveEndpointAlongItsSegment(points,opposite,paidOut)
      }
    }else{
      // Moving an internal pulley changes both adjacent rope legs. The free
      // terminal end absorbs the net length change.
      const current=rigLength(points);
      const difference=current-target;
      if(Math.abs(difference)>0.0001)moveEndpointAlongItsSegment(points,opposite,difference)
    }

    // Final correction keeps the stored rope length finite.
    const residual=rigLength(points)-target;
    if(Math.abs(residual)>0.0001)moveEndpointAlongItsSegment(points,opposite,residual);

    rig.dataset.points=JSON.stringify(points);
    return points
  }

  function constrainFiniteRig(rig,movedIndex,previousPoints=null){
    const target=ensureFiniteLength(rig);
    reactFiniteLine(rig,movedIndex,previousPoints);
    renderRig(rig);
    updateAttachedEndObjects(rig);

    const solved=JSON.parse(rig.dataset.points||'[]');
    const residual=Math.abs(rigLength(solved)-target);
    rig.dataset.liveResidual=String(residual);
    status.textContent=residual<0.75
      ?'LIVE: pulled end paid out and the opposite end retracted.'
      :'LIVE: movement is constrained by a fixed endpoint.'
  }

  function nearestSegment(x,y){let best=null;rigLayer.querySelectorAll('[data-rig="true"]').forEach(rig=>{const points=JSON.parse(rig.dataset.points);for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],dx=b.x-a.x,dy=b.y-a.y,l2=dx*dx+dy*dy||1;let t=((x-a.x)*dx+(y-a.y)*dy)/l2;t=Math.max(0,Math.min(1,t));const px=a.x+t*dx,py=a.y+t*dy,d=Math.hypot(x-px,y-py);if(!best||d<best.d)best={rig,segmentIndex:i,p:{x:px,y:py},d}}});return best}
  function nearestEndpoint(x,y){let best=null;rigLayer.querySelectorAll('[data-rig="true"]').forEach(rig=>{const points=JSON.parse(rig.dataset.points);[0,points.length-1].forEach(index=>{const p=points[index],d=Math.hypot(x-p.x,y-p.y);if(!best||d<best.d)best={rig,index,p,d}})});return best}
  function attachEndSelected(){
    if(!selected){status.textContent='Select an icon first.';return}
    const near=nearestEndpoint(+selected.dataset.x,+selected.dataset.y);
    if(!near){status.textContent='Add a rig line first.';return}

    // Remove only attachment metadata. Do not alter any rope points.
    delete selected.dataset.rigId;
    delete selected.dataset.controlIndex;
    delete selected.dataset.attachMode;

    selected.dataset.rigId=near.rig.dataset.id;
    selected.dataset.controlIndex=String(near.index);
    selected.dataset.attachMode='end';
    selected.dataset.x=String(near.p.x);
    selected.dataset.y=String(near.p.y);
    applyTransform(selected);
    renderRig(near.rig);
    drawSelection();
    selectRig(near.rig);
    status.textContent='Attached to the existing terminal node. Zero new rope points and zero new rig lines were created.';
    return near.rig
  }
  function snapEndAttachedObject(){if(!selected||selected.dataset.attachMode!=='end')return;const near=nearestEndpoint(+selected.dataset.x,+selected.dataset.y);if(!near)return;selected.dataset.rigId=near.rig.dataset.id;selected.dataset.controlIndex=near.index;selected.dataset.x=near.p.x;selected.dataset.y=near.p.y;applyTransform(selected);drawSelection();selectRig(near.rig);status.textContent='Icon snapped to the nearest rig-line end.'}
  function attachSelected(){
    if(!selected){status.textContent='Select an icon first.';return}
    if(selected.dataset.rigId){status.textContent='This icon is already attached.';return}

    const x=+selected.dataset.x,y=+selected.dataset.y;
    const endpoint=nearestEndpoint(x,y);

    // An object close to a terminal node always attaches to that existing node.
    // It must never insert a new control point or extend the rope.
    if(endpoint && endpoint.d<=90){
      selected.dataset.rigId=endpoint.rig.dataset.id;
      selected.dataset.controlIndex=endpoint.index;
      selected.dataset.attachMode='end';
      selected.dataset.x=endpoint.p.x;
      selected.dataset.y=endpoint.p.y;
      applyTransform(selected);
      renderRig(endpoint.rig);
      drawSelection();
      selectRig(endpoint.rig);
      status.textContent='Object attached to the existing terminal node. The rope was not extended.';
      return
    }

    const near=nearestSegment(x,y);
    if(!near){status.textContent='Add a rig line first.';return}

    // Only insert an internal point when the object is deliberately attached
    // away from both terminal endpoints.
    const points=JSON.parse(near.rig.dataset.points),index=near.segmentIndex+1;
    points.splice(index,0,{x:near.p.x,y:near.p.y});
    near.rig.dataset.points=JSON.stringify(points);
    drawing.querySelectorAll(`[data-rig-id="${near.rig.dataset.id}"]`).forEach(other=>{
      if(+other.dataset.controlIndex>=index)other.dataset.controlIndex=+other.dataset.controlIndex+1
    });
    selected.dataset.rigId=near.rig.dataset.id;
    selected.dataset.controlIndex=index;
    selected.dataset.attachMode='line';
    selected.dataset.x=near.p.x;
    selected.dataset.y=near.p.y;
    renderRig(near.rig);
    drawSelection();
    selectRig(near.rig);
    status.textContent='Object attached to an internal rope point.'
  }
  function detachSelected(){if(!selected||!selected.dataset.rigId){status.textContent='Selected icon is not attached.';return}const rig=rigLayer.querySelector(`[data-id="${selected.dataset.rigId}"]`),index=+selected.dataset.controlIndex;if(rig){const points=JSON.parse(rig.dataset.points);if(index>0&&index<points.length-1)points.splice(index,1);rig.dataset.points=JSON.stringify(points);drawing.querySelectorAll(`[data-rig-id="${rig.dataset.id}"]`).forEach(other=>{if(other!==selected&&+other.dataset.controlIndex>index)other.dataset.controlIndex=+other.dataset.controlIndex-1});renderRig(rig)}delete selected.dataset.rigId;delete selected.dataset.controlIndex;delete selected.dataset.attachMode;status.textContent='Icon detached from rig line.'}
  function addIcon(name,markup,data){
    const g=document.createElementNS(NS,'g');
    Object.assign(g.dataset,{object:'true',historyId:'obj-'+uid(),name,role:'unassigned',weight:'0',x:'500',y:'375',rotation:'0',scale:'0.5'});
    const hit=document.createElementNS(NS,'rect');hit.setAttribute('x','-78');hit.setAttribute('y','-78');hit.setAttribute('width','156');hit.setAttribute('height','156');hit.setAttribute('rx','18');hit.classList.add('touch-target');
    const holder=document.createElementNS(NS,'g');holder.classList.add('icon-visual');holder.setAttribute('transform','translate(-50 -50)');holder.setAttribute('color','#05080c');
    if(data){
      const im=document.createElementNS(NS,'image');
      im.setAttribute('href',data);
      im.setAttributeNS('http://www.w3.org/1999/xlink','href',data);
      im.setAttribute('x','0');im.setAttribute('y','0');
      im.setAttribute('width','100');im.setAttribute('height','100');
      im.setAttribute('preserveAspectRatio','xMidYMid meet');
      im.setAttribute('style','image-rendering:auto;overflow:visible;');
      im.addEventListener('load',()=>{g.dataset.iconLoaded='true';drawSelection()},{once:true});
      im.addEventListener('error',()=>{
        g.dataset.iconLoaded='false';
        im.remove();
        const fallback=document.createElementNS(NS,'g');
        fallback.setAttribute('fill','none');
        fallback.setAttribute('stroke','#263746');
        fallback.setAttribute('stroke-width','4');
        fallback.innerHTML='<circle cx="50" cy="50" r="32"/><path d="M29 50h42M50 29v42"/>';
        holder.appendChild(fallback);
        status.textContent='An icon file could not be loaded; a technical placeholder was shown.';
      },{once:true});
      holder.appendChild(im)
    }
    else{const shape=document.createElementNS(NS,'g');shape.setAttribute('fill','none');shape.setAttribute('stroke','#05080c');shape.setAttribute('stroke-width','5');shape.setAttribute('stroke-linecap','round');shape.setAttribute('stroke-linejoin','round');shape.innerHTML=markup;holder.appendChild(shape)}
    const label=document.createElementNS(NS,'text');label.classList.add('object-name-label');label.setAttribute('x','0');label.setAttribute('y','105');label.textContent=name;label.style.display=document.getElementById('show2dNames')?.checked?'':'none';g.append(hit,holder,label);drawing.appendChild(g);bindIcon(g);select(g);applyTransform(g);status.textContent='Plan object added with its original artwork. Drag it into position or attach it to a rig line.';return g
  }
  function bindIcon(g){g.addEventListener('pointerdown',e=>{e.stopPropagation();select(g);gestureBefore=snapshot();const p=pt(e);drag={start:p,x:+g.dataset.x,y:+g.dataset.y,rigStart:g.dataset.rigId?JSON.parse(rigLayer.querySelector(`[data-id="${g.dataset.rigId}"]`)?.dataset.points||'[]'):null};try{svg.setPointerCapture(e.pointerId)}catch(_){}})}
  function applyTransform(g){g.setAttribute('transform',`translate(${g.dataset.x} ${g.dataset.y}) rotate(${g.dataset.rotation}) scale(${g.dataset.scale})`)}
  function update2DObjectNames(){const show=!!document.getElementById('show2dNames')?.checked;drawing.querySelectorAll('[data-object="true"]').forEach(g=>{let label=g.querySelector('.object-name-label');if(!label){label=document.createElementNS(NS,'text');label.classList.add('object-name-label');label.setAttribute('x','0');label.setAttribute('y','105');g.appendChild(label)}label.textContent=g.dataset.name||'Object';label.style.display=show?'':'none'})}
  function select(g){selected=g;document.getElementById('objectName').value=g.dataset.name||'';document.getElementById('objectRole').value=g.dataset.role||'unassigned';document.getElementById('objectWeight').value=g.dataset.weight||0;document.getElementById('rotation').value=g.dataset.rotation||0;document.getElementById('scale').value=g.dataset.scale||1;document.getElementById('objectOperating').checked=g.dataset.operating==='true';document.getElementById('objectSupportingParts').value=g.dataset.supportingParts||1;document.getElementById('objectForceDirection').value=g.dataset.forceDirection||'up';drawSelection();analyse2DOperatingPoint()}
  function drawSelection(){selection.innerHTML='';if(!selected)return;let b;try{const visual=selected.querySelector('.icon-visual');b=visual?visual.getBBox():selected.getBBox()}catch{return}const r=document.createElementNS(NS,'rect');r.setAttribute('x',b.x-6);r.setAttribute('y',b.y-6);r.setAttribute('width',b.width+12);r.setAttribute('height',b.height+12);r.setAttribute('transform',selected.getAttribute('transform'));r.setAttribute('fill','none');r.setAttribute('stroke','#2563eb');r.setAttribute('stroke-width','3');r.setAttribute('stroke-dasharray','8 6');selection.appendChild(r)}
  svg.addEventListener('pointerdown',e=>{
    activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(activePointers.size===2){
      const pts=[...activePointers.values()];
      const a=screenToSvg(pts[0].x,pts[0].y),b=screenToSvg(pts[1].x,pts[1].y);
      pinchStart={
        distance:Math.hypot(pts[1].x-pts[0].x,pts[1].y-pts[0].y),
        midpoint:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},
        view:{...view}
      };
      drag=null;activeHandle=null;panDrag=null;
      return;
    }
    if(panMode && e.target===svg){
      const p=screenToSvg(e.clientX,e.clientY);
      panDrag={pointerId:e.pointerId,start:p,view:{...view}};
      try{svg.setPointerCapture(e.pointerId)}catch(_){}
      return;
    }
    if(e.target===svg){selection.innerHTML='';selected=null}
  });
  svg.addEventListener('pointermove',e=>{
    if(activePointers.has(e.pointerId))activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(activePointers.size===2 && pinchStart){
      const pts=[...activePointers.values()];
      const distance=Math.hypot(pts[1].x-pts[0].x,pts[1].y-pts[0].y);
      if(distance>0){
        const factor=distance/pinchStart.distance;
        const nextW=pinchStart.view.w/factor,nextH=pinchStart.view.h/factor;
        const rx=(pinchStart.midpoint.x-pinchStart.view.x)/pinchStart.view.w;
        const ry=(pinchStart.midpoint.y-pinchStart.view.y)/pinchStart.view.h;
        view.w=nextW;view.h=nextH;
        view.x=pinchStart.midpoint.x-rx*nextW;
        view.y=pinchStart.midpoint.y-ry*nextH;
        clampView();applyView();
      }
      return;
    }
    if(panDrag && panDrag.pointerId===e.pointerId){
      const p=screenToSvg(e.clientX,e.clientY);
      view.x=panDrag.view.x+(panDrag.start.x-p.x);
      view.y=panDrag.view.y+(panDrag.start.y-p.y);
      clampView();applyView();
      return;
    }
    const p=pt(e);if(activeHandle){
      const rig=rigLayer.querySelector(`[data-id="${activeHandle.dataset.rigId}"]`),points=JSON.parse(rig.dataset.points);
      const movedIndex=+activeHandle.dataset.pointIndex;
      points[movedIndex]={x:p.x,y:p.y};
      rig.dataset.points=JSON.stringify(points);
      if(window.SimpleRigLive?.isLive())constrainFiniteRig(rig,movedIndex,activeHandle._startPoints);else renderRig(rig);
      return
    }if(drag&&selected){
      const x=drag.x+p.x-drag.start.x;
      const y=drag.y+p.y-drag.start.y;

      if(selected.dataset.rigId){
        const rig=rigLayer.querySelector(`[data-id="${selected.dataset.rigId}"]`);
        if(rig){
          const points=JSON.parse(rig.dataset.points||'[]');
          const idx=Number(selected.dataset.controlIndex);

          if(points[idx]){
            points[idx]={x,y};
            rig.dataset.points=JSON.stringify(points);

            if(window.SimpleRigLive?.isLive()){
              // In Live mode the selected attached item becomes the manipulated
              // rope point and the rest of the finite system reacts immediately.
              constrainFiniteRig(rig,idx,drag.rigStart)
            }else if(selected.dataset.attachMode==='end'){
              selected.dataset.x=String(x);
              selected.dataset.y=String(y);
              applyTransform(selected);
              drawSelection()
            }else{
              renderRig(rig);
              updateAttachedEndObjects(rig)
            }
          }
        }
      }else{
        selected.dataset.x=String(x);
        selected.dataset.y=String(y);
        applyTransform(selected);
        drawSelection()
      }
    }});function stopDrag(e){
    if(e&&activePointers.has(e.pointerId))activePointers.delete(e.pointerId);
    if(activePointers.size<2)pinchStart=null;
    if(panDrag&&e&&panDrag.pointerId===e.pointerId)panDrag=null;
    if(drag&&selected){
      if(selected.dataset.attachMode==='end'&&!window.SimpleRigLive?.isLive()){
        snapEndAttachedObject()
      }else if(!selected.dataset.rigId){
        const end=nearestEndpoint(+selected.dataset.x,+selected.dataset.y);
        if(end&&end.d<=45){
          selected.dataset.rigId=end.rig.dataset.id;
          selected.dataset.controlIndex=end.index;
          selected.dataset.attachMode='end';
          selected.dataset.x=end.p.x;
          selected.dataset.y=end.p.y;
          applyTransform(selected);
          renderRig(end.rig);
          drawSelection();
          status.textContent='Object snapped to the existing rope endpoint.'
        }
      }
    }
    if(gestureBefore){commitHistory(gestureBefore);gestureBefore=null}
    drag=null;activeHandle=null;
  }
  svg.addEventListener('pointerup',stopDrag);
  svg.addEventListener('pointercancel',stopDrag);
  window.addEventListener('pointerup',stopDrag)
  document.getElementById('zoomInBtn').addEventListener('click',()=>zoomAt(1.25,view.x+view.w/2,view.y+view.h/2));
  document.getElementById('zoomOutBtn').addEventListener('click',()=>zoomAt(0.8,view.x+view.w/2,view.y+view.h/2));
  document.getElementById('zoomResetBtn').addEventListener('click',resetZoom);
  document.getElementById('panTool').addEventListener('click',()=>{
    panMode=!panMode;
    document.getElementById('panTool').classList.toggle('active',panMode);
    svg.classList.toggle('pan-mode',panMode);
    status.textContent=panMode?'Pan mode on. Drag the blank canvas to move around.':'Pan mode off.';
  });
  svg.addEventListener('wheel',e=>{
    e.preventDefault();
    const centre=screenToSvg(e.clientX,e.clientY);
    zoomAt(e.deltaY<0?1.15:0.87,centre.x,centre.y);
  },{passive:false});
  let lastTap=0;
  svg.addEventListener('pointerup',e=>{
    if(e.pointerType==='touch'){
      const now=Date.now();
      if(now-lastTap<320){
        const centre=screenToSvg(e.clientX,e.clientY);
        zoomAt(1.5,centre.x,centre.y);
        lastTap=0;
      }else lastTap=now;
    }
  });
  
  const equipmentCatalogue=[{"id":"petzl-spin-s1","manufacturer":"Petzl","model":"SPIN S1","category":"Pulley","iconName":"Pulley","wll":5,"wllUnit":"kN","mbs":23,"mbsUnit":"kN","ropeRange":"7–11 mm","efficiency":"91%","verified":true,"source":"Petzl official product specifications"},{"id":"petzl-spin-s1-open","manufacturer":"Petzl","model":"SPIN S1 OPEN","category":"Pulley","iconName":"Pulley","wll":5,"wllUnit":"kN","mbs":23,"mbsUnit":"kN","ropeRange":"7–11 mm","efficiency":"91%","verified":true,"source":"Petzl official product specifications"},{"id":"petzl-spin-l1","manufacturer":"Petzl","model":"SPIN L1","category":"Pulley","iconName":"Pulley","wll":8,"wllUnit":"kN","mbs":36,"mbsUnit":"kN","ropeRange":"7–13 mm","efficiency":"95%","verified":true,"source":"Petzl official product specifications"},{"id":"petzl-spin-l2","manufacturer":"Petzl","model":"SPIN L2","category":"Double pulley","iconName":"Double pulley","wll":8,"wllUnit":"kN","mbs":36,"mbsUnit":"kN","ropeRange":"7–13 mm","efficiency":"95%","verified":true,"source":"Petzl official product specifications"},{"id":"petzl-spin-l1d","manufacturer":"Petzl","model":"SPIN L1D","category":"Progress capture pulley","iconName":"Pulley","wll":6,"wllUnit":"kN","mbs":36,"mbsUnit":"kN","ropeRange":"8–13 mm","efficiency":"93%","verified":true,"source":"Petzl official product specifications"},{"id":"petzl-rescue-s","manufacturer":"Petzl","model":"RESCUE S","category":"Pulley","iconName":"Pulley","wll":5,"wllUnit":"kN","mbs":18,"mbsUnit":"kN","ropeRange":"6–11 mm","efficiency":"91%","verified":true,"source":"Petzl official product specifications"},{"id":"petzl-rescue-m","manufacturer":"Petzl","model":"RESCUE M","category":"Pulley","iconName":"Pulley","wll":8,"wllUnit":"kN","mbs":36,"mbsUnit":"kN","ropeRange":"6–13 mm","efficiency":"95%","verified":true,"source":"Petzl official product specifications"},{"id":"petzl-minder-s1","manufacturer":"Petzl","model":"MINDER S1","category":"Prusik pulley","iconName":"Pulley","wll":5,"wllUnit":"kN","mbs":23,"mbsUnit":"kN","ropeRange":"6–11 mm","efficiency":"91%","verified":true,"source":"Petzl official product specifications"},{"id":"petzl-reeve","manufacturer":"Petzl","model":"REEVE","category":"Carriage pulley","iconName":"Double pulley","wll":8,"wllUnit":"kN","mbs":36,"mbsUnit":"kN","ropeRange":"7–13 mm","efficiency":"95%","verified":true,"source":"Petzl official product specifications"},{"id":"isc-rp248","manufacturer":"ISC","model":"RP248 200-Series Compact","category":"Rigging pulley","iconName":"Pulley","wll":20,"wllUnit":"kN","mbs":100,"mbsUnit":"kN","ropeRange":"≤14 mm","efficiency":"Not published","verified":true,"source":"ISC official product specifications"},{"id":"isc-rp251","manufacturer":"ISC","model":"RP251 200-Series Small","category":"Rigging pulley","iconName":"Pulley","wll":50,"wllUnit":"kN","mbs":250,"mbsUnit":"kN","ropeRange":"≤16 mm","efficiency":"Not published","verified":true,"source":"ISC official product specifications"},{"id":"isc-rp255","manufacturer":"ISC","model":"RP255 200-Series Medium","category":"Rigging pulley","iconName":"Pulley","wll":60,"wllUnit":"kN","mbs":300,"mbsUnit":"kN","ropeRange":"≤20 mm","efficiency":"Not published","verified":true,"source":"ISC official product specifications"},{"id":"isc-rp257","manufacturer":"ISC","model":"RP257 200-Series Large","category":"Rigging pulley","iconName":"Pulley","wll":76,"wllUnit":"kN","mbs":380,"mbsUnit":"kN","ropeRange":"≤26 mm","efficiency":"Not published","verified":true,"source":"ISC official product specifications"},{"id":"rock-omni-11","manufacturer":"Rock Exotica","model":"Omni-Block 1.1 Single","category":"Pulley","iconName":"Pulley","wll":5,"wllUnit":"kN","mbs":23,"mbsUnit":"kN","ropeRange":"≤13 mm","efficiency":"Not published","verified":true,"source":"Rock Exotica official product specifications"},{"id":"rock-omni-11d","manufacturer":"Rock Exotica","model":"Omni-Block 1.1 Double","category":"Double pulley","iconName":"Double pulley","wll":7.5,"wllUnit":"kN","mbs":30,"mbsUnit":"kN","ropeRange":"≤13 mm","efficiency":"Not published","verified":true,"source":"Rock Exotica official product specifications"},{"id":"rock-omni-15","manufacturer":"Rock Exotica","model":"Omni-Block 1.5 Single","category":"Pulley","iconName":"Pulley","wll":8,"wllUnit":"kN","mbs":36,"mbsUnit":"kN","ropeRange":"≤13 mm","efficiency":"Not published","verified":true,"source":"Rock Exotica official product specifications"},{"id":"rock-omni-15d","manufacturer":"Rock Exotica","model":"Omni-Block 1.5 Double","category":"Double pulley","iconName":"Double pulley","wll":8,"wllUnit":"kN","mbs":36,"mbsUnit":"kN","ropeRange":"≤13 mm","efficiency":"Not published","verified":true,"source":"Rock Exotica official product specifications"},{"id":"rock-omni-20","manufacturer":"Rock Exotica","model":"Omni-Block 2.0 Single","category":"Pulley","iconName":"Pulley","wll":8,"wllUnit":"kN","mbs":36,"mbsUnit":"kN","ropeRange":"≤13 mm","efficiency":"Not published","verified":true,"source":"Rock Exotica official product specifications"},{"id":"rock-omni-20d","manufacturer":"Rock Exotica","model":"Omni-Block 2.0 Double","category":"Double pulley","iconName":"Double pulley","wll":10,"wllUnit":"kN","mbs":40,"mbsUnit":"kN","ropeRange":"≤13 mm","efficiency":"Not published","verified":true,"source":"Rock Exotica official product specifications"},{"id":"rock-omni-26","manufacturer":"Rock Exotica","model":"Omni-Block 2.6 Single","category":"Pulley","iconName":"Pulley","wll":20,"wllUnit":"kN","mbs":80,"mbsUnit":"kN","ropeRange":"≤13 mm","efficiency":"Not published","verified":true,"source":"Rock Exotica official product specifications"},{"id":"harken-wingman","manufacturer":"Harken Safety & Rescue","model":"WingMan system","category":"Double pulley haul system","iconName":"Double pulley","wll":2.77,"wllUnit":"kN (282 kg rated load)","mbs":36,"mbsUnit":"kN","ropeRange":"8 mm supplied rope","efficiency":"System dependent","verified":true,"source":"Harken Safety & Rescue official 2026 product overview"}];
  let selectedCatalogueItem=null;
  const equipmentSearch=document.getElementById('equipmentSearch');
  const equipmentSuggestions=document.getElementById('equipmentSuggestions');
  const equipmentPreview=document.getElementById('equipmentPreview');
  const addCatalogueItemBtn=document.getElementById('addCatalogueItemBtn');

  function equipmentLabel(item){return `${item.manufacturer} ${item.model}`}

  function renderEquipmentSuggestions(query){
    const q=query.trim().toLowerCase();
    equipmentSuggestions.innerHTML='';
    if(!q){equipmentSuggestions.classList.remove('open');return}
    const terms=q.split(/\s+/).filter(Boolean);
    const matches=equipmentCatalogue.filter(item=>{
      const hay=[item.manufacturer,item.model,item.category,item.source].join(' ').toLowerCase();
      return terms.every(term=>hay.includes(term));
    }).slice(0,20);
    if(!matches.length){
      const empty=document.createElement('div');
      empty.className='equipment-preview';
      empty.textContent='No catalogue match. Create a custom item instead.';
      equipmentSuggestions.appendChild(empty);
      equipmentSuggestions.classList.add('open');
      return;
    }
    matches.forEach(item=>{
      const button=document.createElement('button');
      button.type='button';
      button.className='equipment-suggestion';
      button.setAttribute('role','option');
      button.innerHTML=`<strong>${equipmentLabel(item)}</strong><span>${item.category} · ${item.wll!=null?'WLL '+item.wll+' '+item.wllUnit:'specification check required'}</span>`;
      button.addEventListener('click',()=>selectCatalogueItem(item));
      equipmentSuggestions.appendChild(button);
    });
    equipmentSuggestions.classList.add('open');
  }

  function selectCatalogueItem(item){
    selectedCatalogueItem=item;
    equipmentSearch.value=equipmentLabel(item);
    equipmentSuggestions.classList.remove('open');
    addCatalogueItemBtn.disabled=false;
    equipmentPreview.innerHTML=`
      <dl>
        <dt>Category</dt><dd>${item.category}</dd>
        <dt>WLL/SWL</dt><dd>${item.wll!=null?item.wll+' '+item.wllUnit:'Check manufacturer data'}</dd>
        <dt>MBS</dt><dd>${item.mbs??'Not recorded'} ${item.mbsUnit}</dd>
        <dt>Rope range</dt><dd>${item.ropeRange}</dd>
        <dt>Efficiency</dt><dd>${item.efficiency}</dd>
        <dt>Status</dt><dd>${item.verified?'Manufacturer verified':'Verify before safety use'}</dd>
      </dl>`;
  }


  function updateAppliedEquipmentPanel(){
    const panel=document.getElementById('appliedEquipment');
    if(!selected){panel.textContent='No object selected.';return}
    if(!selected.dataset.equipmentId){
      panel.innerHTML=`<strong>${selected.dataset.name||'Object'}</strong><br>No catalogue equipment applied.`;
      return;
    }
    panel.innerHTML=`<strong>${selected.dataset.equipmentName||selected.dataset.name}</strong><br>${selected.dataset.equipmentCategory||''}<br>WLL/SWL: ${selected.dataset.wll||'Check data'} ${selected.dataset.wllUnit||''}<br>MBS: ${selected.dataset.mbs||'Check data'} ${selected.dataset.mbsUnit||''}<br><span class="${selected.dataset.verified==='true'?'verified-badge':'warning-badge'}">${selected.dataset.verified==='true'?'Manufacturer values recorded':'Verify exact model/specification'}</span>`;
  }

  function applyEquipmentToSelected(item){
    if(!selected){status.textContent='Select an object on the diagram first.';return}
    const before=snapshot();
    Object.assign(selected.dataset,{
      equipmentId:item.id,
      equipmentName:equipmentLabel(item),
      equipmentManufacturer:item.manufacturer,
      equipmentModel:item.model,
      equipmentCategory:item.category||'Equipment',
      equipmentSource:item.source||'',
      ropeRange:item.ropeRange||'',
      efficiency:item.efficiency||'',
      wll:item.wll==null?'':String(item.wll),
      wllUnit:item.wllUnit||'',
      mbs:item.mbs==null?'':String(item.mbs),
      mbsUnit:item.mbsUnit||'',
      verified:String(!!item.verified),
      name:equipmentLabel(item)
    });
    document.getElementById('objectName').value=selected.dataset.name;
    updateAppliedEquipmentPanel();
    drawSelection();
    commitHistory(before);
    status.textContent=`Applied ${equipmentLabel(item)} to the selected object. Position, scale, rotation and rope attachment were preserved.`;
  }

  function addEquipmentRecord(item,imageData=null){
    const markup=icons[item.iconName]||icons['Anchor']||Object.values(icons)[0];
    const placed=addIcon(equipmentLabel(item),markup,imageData);
    Object.assign(placed.dataset,{
      equipmentId:item.id||`custom-${Date.now()}`,
      equipmentName:equipmentLabel(item),
      equipmentCategory:item.category||'Custom',
      wll:String(item.wll||''),
      wllUnit:item.wllUnit||'',
      mbs:String(item.mbs||''),
      mbsUnit:item.mbsUnit||'',
      verified:String(!!item.verified)
    });
    status.textContent=`Added ${equipmentLabel(item)} to the plan.`;
  }

  equipmentSearch.addEventListener('input',()=>{
    selectedCatalogueItem=null;
    addCatalogueItemBtn.disabled=true;
    equipmentPreview.textContent='Choose a result from the dropdown.';
    renderEquipmentSuggestions(equipmentSearch.value);
  });

  equipmentSearch.addEventListener('keydown',e=>{
    if(e.key==='Escape')equipmentSuggestions.classList.remove('open');
  });

  addCatalogueItemBtn.addEventListener('click',()=>{
    if(selectedCatalogueItem)applyEquipmentToSelected(selectedCatalogueItem);
  });

  document.addEventListener('pointerdown',e=>{
    if(!e.target.closest('.equipment-search-wrap'))equipmentSuggestions.classList.remove('open');
  });

  const customItemPanel=document.getElementById('customItemPanel');
  document.getElementById('openCustomItemBtn').addEventListener('click',()=>{
    customItemPanel.hidden=false;
    document.getElementById('customItemName').focus();
  });
  document.getElementById('cancelCustomItemBtn').addEventListener('click',()=>customItemPanel.hidden=true);

  document.getElementById('saveCustomItemBtn').addEventListener('click',()=>{
    const name=document.getElementById('customItemName').value.trim();
    if(!name){status.textContent='Enter a name for the custom item.';return}
    const category=document.getElementById('customItemCategory').value;
    const wll=Number(document.getElementById('customItemWll').value||0);
    const unit=document.getElementById('customItemUnit').value;
    const mbs=Number(document.getElementById('customItemMbs').value||0);
    const file=document.getElementById('customItemImage').files[0];
    const item={
      id:`custom-${Date.now()}`,
      manufacturer:'Custom',
      model:name,
      category,
      wll,
      wllUnit:unit,
      mbs:mbs||null,
      mbsUnit:mbs?unit:'',
      verified:false,
      iconName:'Anchor'
    };
    if(file){
      const reader=new FileReader();
      reader.onload=()=>{
        addEquipmentRecord(item,reader.result);
        customItemPanel.hidden=true;
      };
      reader.readAsDataURL(file);
    }else{
      addEquipmentRecord(item);
      customItemPanel.hidden=true;
    }
  });


  function infer2DOperatingRole(obj){
    if(!obj)return 'other';
    const role=(obj.dataset.role||'unassigned').toLowerCase();
    const name=(obj.dataset.name||'').toLowerCase();
    if(role==='travelling')return 'movingPulley';
    if(role==='fixed'||role==='redirect')return 'fixedPulley';
    if(role==='assist')return 'haul';
    if(name.includes('winch'))return 'winch';
    if(name.includes('performer')||Number(obj.dataset.weight)>0)return 'load';
    if(name.includes('anchor')||name.includes('tie-off')||name.includes('bollard')||name.includes('truss'))return 'anchor';
    if(name.includes('pulley'))return 'fixedPulley';
    return 'other'
  }

  function analyse2DOperatingPoint(){
    const box=document.getElementById('analysis2d');
    if(!box)return;

    const operating=[...drawing.querySelectorAll('[data-object="true"]')]
      .find(o=>o.dataset.operating==='true')||selected;

    const classEl=document.getElementById('analysis2dClass');
    const ratioEl=document.getElementById('analysis2dRatio');
    const pullEl=document.getElementById('analysis2dPull');
    const travelEl=document.getElementById('analysis2dTravel');
    const effectEl=document.getElementById('analysis2dEffect');
    const messageEl=document.getElementById('analysis2dMessage');

    if(!operating){
      box.className='operating-analysis neutral';
      classEl.textContent='Select an operating point';
      ratioEl.textContent=pullEl.textContent=travelEl.textContent=effectEl.textContent='—';
      messageEl.textContent='Mark an object as the operating point to analyse the system.';
      return
    }

    const role=infer2DOperatingRole(operating);
    const mainRatio=Math.max(.1,Number(document.getElementById('mainRatio')?.value)||1);
    const assistRatio=Math.max(.1,Number(document.getElementById('assistRatio')?.value)||1);
    const efficiency=Math.max(.01,Math.min(1,(Number(document.getElementById('efficiency')?.value)||100)/100));
    const load=Math.max(0,Number(document.getElementById('loadWeight')?.value)||Number(operating.dataset.weight)||0);
    const supporting=Math.max(.1,Number(operating.dataset.supportingParts)||1);

    let effective=1,valid=true,explanation='';
    if(role==='haul'||role==='winch')effective=mainRatio*assistRatio;
    else if(role==='movingPulley'||role==='load')effective=supporting>1?supporting:mainRatio;
    else if(role==='fixedPulley')effective=1;
    else if(role==='anchor'){
      effective=0;valid=false;
      explanation='The selected item is treated as an anchor or tie-off, so it is not a valid pulling point.'
    }else effective=supporting;

    const practical=effective*efficiency;
    let label='Neutral / direction change',css='neutral';
    if(!valid){label='Invalid operating point';css='disadvantage'}
    else if(practical>1.05){label='Mechanical advantage';css='advantage'}
    else if(practical<.95){label='Mechanical disadvantage';css='disadvantage'}

    box.className='operating-analysis '+css;
    classEl.textContent=label;
    ratioEl.textContent=valid?effective.toFixed(2)+' : 1':'—';
    pullEl.textContent=valid&&practical>0?(load/practical).toFixed(1)+' kgf':'—';
    travelEl.textContent=valid&&effective>0?(1/effective).toFixed(2)+' m':'—';
    effectEl.textContent=!valid?'Support disturbed':
      effective>1?effective.toFixed(2)+'× force multiplication':
      effective<1?(1/effective).toFixed(2)+'× more input force':
      'No force multiplication';

    if(!explanation){
      explanation=`Uses ${supporting.toFixed(1)} supporting rope part${supporting===1?'':'s'}, ${Math.round(efficiency*100)}% efficiency and the selected system ratios.`;
      if(role==='fixedPulley')explanation+=' A fixed pulley changes direction only.';
    }
    messageEl.textContent=explanation
  }

  function renderIcons(filter=''){
    const host=document.getElementById('builtins');
    host.innerHTML='';
    const term=filter.trim().toLowerCase();
    SIMPLE_RIG_LIBRARY.forEach((category,categoryIndex)=>{
      const assets=category.assets.filter(asset=>
        !term||asset.name.toLowerCase().includes(term)||category.name.toLowerCase().includes(term)
      );
      if(!assets.length)return;
      const folder=document.createElement('details');
      folder.className='asset-folder';
      folder.open=categoryIndex<2||!!term;
      const summary=document.createElement('summary');
      summary.innerHTML=`<span>${category.name}</span><span class="asset-folder-count">${assets.length}</span>`;
      const grid=document.createElement('div');
      grid.className='asset-folder-grid';
      assets.forEach(asset=>{
        const b=document.createElement('button');
        b.type='button';
        b.className='asset library-item';
        b.title=`Add ${asset.name}`;
        b.innerHTML=`<img src="${asset.icon}" alt=""><span>${asset.name}</span>`;
        b.addEventListener('click',()=>addIcon(asset.name,'',asset.icon));
        grid.appendChild(b);
      });
      folder.append(summary,grid);
      host.appendChild(folder);
    });
  }
    ['deleteBtn','undoBtn','redoBtn','duplicateBtn','attachBtn','attachEndBtn','detachBtn'].forEach(id=>{const b=document.getElementById(id);if(b)b.addEventListener('pointerdown',e=>e.stopPropagation())});
  window.addEventListener('keydown',event=>{
    const tag=(event.target?.tagName||'').toLowerCase(),typing=tag==='input'||tag==='textarea'||tag==='select'||event.target?.isContentEditable;
    if((event.key==='Delete'||event.key==='Backspace')&&!typing){event.preventDefault();recordAction(deleteSelection)}
    if((event.ctrlKey||event.metaKey)&&!event.shiftKey&&event.key.toLowerCase()==='z'){event.preventDefault();undo()}
    if((event.ctrlKey||event.metaKey)&&((event.shiftKey&&event.key.toLowerCase()==='z')||event.key.toLowerCase()==='y')){event.preventDefault();redo()}
  });
  
  document.getElementById('objectOperating').addEventListener('change',e=>{
    if(!selected)return;
    if(e.target.checked)drawing.querySelectorAll('[data-object="true"]').forEach(o=>{if(o!==selected)o.dataset.operating='false'});
    selected.dataset.operating=e.target.checked?'true':'false';
    status.textContent=e.target.checked?'Operating point marked.':'Operating point removed.';
    analyse2DOperatingPoint();window.dispatchEvent(new CustomEvent('simplerig-operating-change'))
  });
  document.getElementById('objectSupportingParts').addEventListener('input',e=>{if(selected)selected.dataset.supportingParts=String(Math.max(.1,Number(e.target.value)||1));analyse2DOperatingPoint()});
  document.getElementById('objectForceDirection').addEventListener('change',e=>{if(selected)selected.dataset.forceDirection=e.target.value;analyse2DOperatingPoint()});

  ['objectRole','objectWeight','mainRatio','assistRatio','efficiency','loadWeight'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.addEventListener('input',analyse2DOperatingPoint)
  });
  document.getElementById('librarySearch2d').addEventListener('input',e=>renderIcons(e.target.value));document.getElementById('show2dNames').addEventListener('change',update2DObjectNames);
  document.getElementById('addRigLineBtn').addEventListener('click',()=>recordAction(addRigLine));document.getElementById('attachBtn').addEventListener('click',()=>recordAction(attachSelected));document.getElementById('attachEndBtn').addEventListener('click',()=>recordAction(attachEndSelected));document.getElementById('detachBtn').addEventListener('click',()=>recordAction(detachSelected));document.getElementById('duplicateBtn').addEventListener('click',()=>recordAction(duplicateSelected));document.getElementById('deleteBtn').addEventListener('click',()=>recordAction(deleteSelection));document.getElementById('undoBtn').addEventListener('click',undo);document.getElementById('redoBtn').addEventListener('click',redo);document.getElementById('rigLineColour').addEventListener('pointerdown',()=>controlBefore=snapshot());document.getElementById('rigLineColour').addEventListener('input',e=>{if(!selectedRig){status.textContent='Select a rig line first.';return}selectedRig.dataset.colour=e.target.value;renderRig(selectedRig)});document.getElementById('rigLineColour').addEventListener('change',()=>{commitHistory(controlBefore);controlBefore=null});
  document.getElementById('addCustomBtn').addEventListener('click',()=>{const name=document.getElementById('customName').value.trim(),file=document.getElementById('customFile').files[0];if(!name||!file)return;const r=new FileReader();r.onload=()=>{const b=document.createElement('button');b.type='button';b.className='asset';b.innerHTML=`<img src="${r.result}" alt=""><span>${name}</span>`;b.addEventListener('click',()=>addIcon(name,'',r.result));document.getElementById('customAssets').appendChild(b)};r.readAsDataURL(file)});
  document.getElementById('backgroundFile').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;const before=snapshot();const r=new FileReader();r.onload=()=>{background.innerHTML=`<image id="backgroundImage" href="${r.result}" x="0" y="0" width="1000" height="750" preserveAspectRatio="xMidYMid slice" pointer-events="none" opacity="${document.getElementById('backgroundOpacity').value}"/>`;status.textContent='Background uploaded.';commitHistory(before)};r.readAsDataURL(file)});document.getElementById('backgroundOpacity').addEventListener('input',e=>document.getElementById('backgroundImage')?.setAttribute('opacity',e.target.value));document.getElementById('removeBackground').addEventListener('click',()=>recordAction(()=>background.innerHTML=''));
  function historyControl(id,event,fn){const el=document.getElementById(id);el.addEventListener('focus',()=>controlBefore=snapshot());el.addEventListener('pointerdown',()=>{if(!controlBefore)controlBefore=snapshot()});el.addEventListener(event,fn);el.addEventListener('change',()=>{commitHistory(controlBefore);controlBefore=null});el.addEventListener('blur',()=>{commitHistory(controlBefore);controlBefore=null})}historyControl('objectName','input',e=>{if(selected){selected.dataset.name=e.target.value;update2DObjectNames()}});historyControl('objectRole','change',e=>{if(selected)selected.dataset.role=e.target.value});historyControl('objectWeight','input',e=>{if(selected)selected.dataset.weight=e.target.value});historyControl('rotation','input',e=>{if(selected){selected.dataset.rotation=e.target.value;applyTransform(selected);drawSelection()}});historyControl('scale','input',e=>{if(selected){selected.dataset.scale=e.target.value;applyTransform(selected);drawSelection()}});
  function cleanExportSvg(){
    const clone=svg.cloneNode(true);clone.setAttribute('viewBox','0 0 1000 750');clone.setAttribute('width','1000');clone.setAttribute('height','750');
    const sel=clone.querySelector('#selectionLayer');if(sel)sel.innerHTML='';
    clone.querySelectorAll('.rig-handle,.rig-hit,.touch-target').forEach(el=>el.remove());clone.querySelectorAll('.object-name-label').forEach(el=>{if(el.style.display==='none')el.remove()});
    clone.querySelectorAll('[data-visible="true"]').forEach(el=>el.setAttribute('vector-effect','non-scaling-stroke'));
    const bgRect=document.createElementNS(NS,'rect');bgRect.setAttribute('x','0');bgRect.setAttribute('y','0');bgRect.setAttribute('width','1000');bgRect.setAttribute('height','750');bgRect.setAttribute('fill','#ffffff');clone.insertBefore(bgRect,clone.firstChild);
    return new XMLSerializer().serializeToString(clone)
  }
  async function diagramCanvas(scaleFactor=2){
    const source=cleanExportSvg(),blob=new Blob([source],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),img=new Image();
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});
    const canvas=document.createElement('canvas');canvas.width=1000*scaleFactor;canvas.height=750*scaleFactor;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);return canvas
  }
  function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
  async function downloadDiagramImage(){try{status.textContent='Creating diagram image...';const canvas=await diagramCanvas(2);canvas.toBlob(blob=>{const base=[document.getElementById('showName').value,document.getElementById('gagName').value].filter(Boolean).join('-').replace(/[^a-z0-9_-]+/gi,'-').replace(/^-|-$/g,'')||'rig-plan';downloadBlob(blob,base+'-diagram.png');status.textContent='Diagram image downloaded.'},'image/png')}catch(err){status.textContent='Image export failed: '+err.message}}
  function pdfEscape(text){return String(text).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[^\x20-\x7E]/g,'-')}
  function base64Bytes(dataUrl){const raw=atob(dataUrl.split(',')[1]),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out}
  function buildSinglePagePdf(jpegBytes,imgW,imgH,equipment,ratio,details){
    const enc=new TextEncoder(),parts=[],offsets=[0];let length=0;
    const push=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);length+=b.length};
    push('%PDF-1.4\n%PDF\n');
    function obj(n,body){offsets[n]=length;push(`${n} 0 obj\n`);push(body);push('\nendobj\n')}
    obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 841.89 595.28] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> /XObject << /Im1 4 0 R >> >> /Contents 7 0 R >>');
    offsets[4]=length;push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);push(jpegBytes);push('\nendstream\nendobj\n');
    obj(5,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');obj(6,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
    const c=[];const t=(x,y,size,text,bold=false)=>c.push(`BT /${bold?'F2':'F1'} ${size} Tf ${x} ${y} Td (${pdfEscape(text)}) Tj ET`);
    t(30,570,18,details.show||'Rig Plan',true);t(710,570,8,new Date().toLocaleDateString('en-GB'));
    if(details.gag)t(30,553,10,`Gag/Move: ${details.gag}`,true);if(details.location)t(410,553,10,`Location: ${details.location}`);
    c.push('0.78 G 30 111 782 430 re S 0 G');c.push('q 782 0 0 430 30 111 cm /Im1 Do Q');
    t(30,94,10,'Calculation summary',true);t(30,78,8,`Load ${ratio.load} kg   Main ${ratio.main}:1   Assist ${ratio.assist}:1   Efficiency ${ratio.eff}%`);
    t(30,64,8,`Main tension ${ratio.tension}   Estimated pull ${ratio.pull}`);
    t(430,94,10,'Equipment used',true);
    const rows=equipment.length?equipment:[{name:'No catalogue equipment recorded',count:1}];let y=79;
    rows.slice(0,4).forEach(r=>{t(430,y,8,`${r.count}x ${r.name}`,true);y-=13});if(rows.length>4)t(430,y,8,`+ ${rows.length-4} additional equipment types`);
    t(30,18,7,'Planning aid only. Verify manufacturer data, configuration ratings and calculations before use.');
    const stream=c.join('\n');obj(7,`<< /Length ${enc.encode(stream).length} >>\nstream\n${stream}\nendstream`);
    const xref=length;push(`xref\n0 8\n0000000000 65535 f \n`);for(let i=1;i<=7;i++)push(String(offsets[i]).padStart(10,'0')+' 00000 n \n');push(`trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
    const out=new Uint8Array(length);let pos=0;parts.forEach(b=>{out.set(b,pos);pos+=b.length});return new Blob([out],{type:'application/pdf'})
  }
  function equipmentSummary(){const map=new Map();drawing.querySelectorAll('[data-object="true"]').forEach(el=>{const name=el.dataset.equipmentName||el.dataset.name||'Unnamed item',key=[name,el.dataset.wll,el.dataset.wllUnit,el.dataset.mbs,el.dataset.mbsUnit].join('|');if(!map.has(key))map.set(key,{name,category:el.dataset.equipmentCategory||el.dataset.role||'',wll:el.dataset.wll?`${el.dataset.wll} ${el.dataset.wllUnit||''}`:'',mbs:el.dataset.mbs?`${el.dataset.mbs} ${el.dataset.mbsUnit||''}`:'',count:0});map.get(key).count++});return [...map.values()]}
  async function downloadRigPdf(){try{status.textContent='Creating single-page PDF...';const canvas=await diagramCanvas(1.5),jpeg=canvas.toDataURL('image/jpeg',0.9),ratio={load:document.getElementById('loadWeight').value||0,main:document.getElementById('mainRatio').value||1,assist:document.getElementById('assistRatio').value||1,eff:document.getElementById('efficiency').value||100,tension:document.getElementById('mainTension').textContent,pull:document.getElementById('practicalPull').textContent},details={show:document.getElementById('showName').value.trim(),gag:document.getElementById('gagName').value.trim(),location:document.getElementById('locationName').value.trim()},pdf=buildSinglePagePdf(base64Bytes(jpeg),canvas.width,canvas.height,equipmentSummary(),ratio,details),base=[details.show,details.gag].filter(Boolean).join('-').replace(/[^a-z0-9_-]+/gi,'-').replace(/^-|-$/g,'')||'rig-plan';downloadBlob(pdf,base+'-report.pdf');status.textContent='Single-page PDF downloaded.'}catch(err){console.error(err);status.textContent='PDF export failed: '+err.message}}
    document.getElementById('downloadImageBtn').addEventListener('click',downloadDiagramImage);document.getElementById('downloadPdfBtn').addEventListener('click',downloadRigPdf);
  ['showName','gagName','locationName'].forEach(id=>{const field=document.getElementById(id);try{field.value=localStorage.getItem('rigPlan.'+id)||''}catch(_){field.value=''}field.addEventListener('input',()=>{try{localStorage.setItem('rigPlan.'+id,field.value)}catch(_){}})});function calc(){const load=+document.getElementById('loadWeight').value||0,main=+document.getElementById('mainRatio').value||1,assist=+document.getElementById('assistRatio').value||1,eff=Math.max(.1,(+document.getElementById('efficiency').value||100)/100),mainTension=load/main,ideal=mainTension/assist,practical=ideal/eff;document.getElementById('mainTension').textContent=mainTension.toFixed(1)+' kgf';document.getElementById('idealPull').textContent=ideal.toFixed(1)+' kgf';document.getElementById('practicalPull').textContent=practical.toFixed(1)+' kgf';document.getElementById('assistPulleyLoad').textContent=(practical*2).toFixed(1)+' kgf'}['loadWeight','mainRatio','assistRatio','efficiency'].forEach(id=>document.getElementById(id).addEventListener('input',calc));applyView();renderIcons();addRigLine();calc();analyse2DOperatingPoint();updateHistoryButtons();
window.rebindAll=rebindAll;window.update2DObjectNames=update2DObjectNames;window.renderSvgToJpeg=async function(){const c=await diagramCanvas(1.5);return c.toDataURL('image/jpeg',0.94)};window.buildSinglePagePdf=buildSinglePagePdf;
window.SimpleRig2D={
  isActive(){return !document.getElementById('workspace2d').classList.contains('hidden-workspace')},
  getState(){return snapshot()},
  setState(json){restoreSnapshot(json)},
  getOperating(){
    return [...drawing.querySelectorAll('[data-object="true"]')].find(o=>o.dataset.operating==='true')||null
  },
  captureFiniteLines(){setAllFiniteLengths()},
  clearFiniteLines(){clearFiniteLengths()},
  simulate(forceKn,duration){
    const op=this.getOperating();
    if(!op)return {ok:false,message:'No 2D operating point is marked.'};
    const ratio=Math.max(.1,Number(document.getElementById('mainRatio').value)||1);
    const assist=Math.max(.1,Number(document.getElementById('assistRatio').value)||1);
    const efficiency=Math.max(.01,(Number(document.getElementById('efficiency').value)||100)/100);
    const parts=Math.max(.1,Number(op.dataset.supportingParts)||ratio);
    const role=op.dataset.role||'unassigned';
    const effective=(role==='fixed'||role==='redirect')?1:(role==='assist'?assist:parts);
    const outputN=forceKn*1000*effective*efficiency;
    const loadKg=Math.max(.1,Number(op.dataset.weight)||Number(document.getElementById('loadWeight').value)||100);
    const loadN=loadKg*9.80665;
    const direction=op.dataset.forceDirection||'up';
    const signedNet=(direction==='up'||direction==='right')?outputN-loadN:outputN+loadN;
    const acceleration=signedNet/loadKg;
    const distance=Math.max(-180,Math.min(180,.5*acceleration*duration*duration*10));
    const dx=direction==='right'?distance:direction==='left'?-distance:0;
    const dy=direction==='up'?-distance:direction==='down'?distance:0;
    const affected=[];
    drawing.querySelectorAll('[data-object="true"]').forEach(obj=>{
      const isLoad=obj===op||obj.dataset.role==='travelling'||Number(obj.dataset.weight)>0;
      if(!isLoad)return;
      const nextX=(Number(obj.dataset.x)||0)+dx,nextY=(Number(obj.dataset.y)||0)+dy;
      if(obj.dataset.rigId){
        const rig=rigLayer.querySelector(`[data-id="${obj.dataset.rigId}"]`);
        if(rig){
          const pts=JSON.parse(rig.dataset.points);
          const idx=Number(obj.dataset.controlIndex);
          if(pts[idx]){
            pts[idx]={x:nextX,y:nextY};
            rig.dataset.points=JSON.stringify(pts);
            const terminal=idx===0||idx===pts.length-1;
            if(terminal)constrainFiniteRig(rig,idx);else{renderRig(rig);updateAttachedEndObjects(rig)}
          }
        }
      }else{
        obj.dataset.x=String(nextX);obj.dataset.y=String(nextY);applyTransform(obj)
      }
      affected.push(obj.dataset.name||'Object')
    });
    drawSelection();
    let arrow=document.getElementById('simForceArrow2d');
    if(!arrow){arrow=document.createElementNS(NS,'g');arrow.id='simForceArrow2d';arrow.classList.add('sim-force-arrow');selection.appendChild(arrow)}
    const x=Number(op.dataset.x)||0,y=Number(op.dataset.y)||0;
    const ax=direction==='right'?70:direction==='left'?-70:0,ay=direction==='up'?-70:direction==='down'?70:0;
    arrow.innerHTML=`<line x1="${x}" y1="${y}" x2="${x+ax}" y2="${y+ay}" stroke="#ef4444" stroke-width="8"/><circle cx="${x+ax}" cy="${y+ay}" r="9" fill="#ef4444"/>`;
    return {ok:true,effective,outputN,loadN,acceleration,distance,affected,message:`${forceKn.toFixed(2)} kN applied. Estimated output ${(outputN/1000).toFixed(2)} kN; movement ${Math.abs(distance/10).toFixed(2)} m preview.`}
  }
};
} catch (error) { console.error(error); const s=document.getElementById('status'); if(s) s.textContent='Startup error: '+error.message; }
})();
