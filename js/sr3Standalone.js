(()=>{
'use strict';
const SIMPLE_RIG_LIBRARY=[{"id":"pulleys","name":"Pulleys","assets":[{"id":"single_pulley","name":"Single Pulley","icon":"unique-icons/single_pulley.svg","model":"Pulleys/3d/single_pulley.glb","spec":"Pulleys/specs/single_pulley.json","thumbnail":"unique-icons/single_pulley.svg","triangles":10264},{"id":"double_pulley","name":"Double Pulley","icon":"unique-icons/double_pulley.svg","model":"Pulleys/3d/double_pulley.glb","spec":"Pulleys/specs/double_pulley.json","thumbnail":"unique-icons/double_pulley.svg","triangles":15128},{"id":"rescue_pulley","name":"Rescue Pulley","icon":"unique-icons/rescue_pulley.svg","model":"Pulleys/3d/rescue_pulley.glb","spec":"Pulleys/specs/rescue_pulley.json","thumbnail":"unique-icons/rescue_pulley.svg","triangles":10276},{"id":"progress_capture_pulley","name":"Progress Capture Pulley","icon":"unique-icons/progress_capture_pulley.svg","model":"Pulleys/3d/progress_capture_pulley.glb","spec":"Pulleys/specs/progress_capture_pulley.json","thumbnail":"unique-icons/progress_capture_pulley.svg","triangles":10532}]},{"id":"hardware","name":"Hardware","assets":[{"id":"rope_grab","name":"Rope Grab","icon":"unique-icons/rope_grab.svg","model":"Hardware/3d/rope_grab.glb","spec":"Hardware/specs/rope_grab.json","thumbnail":"unique-icons/rope_grab.svg","triangles":7564},{"id":"clutch","name":"Clutch","icon":"unique-icons/clutch.svg","model":"Hardware/3d/clutch.glb","spec":"Hardware/specs/clutch.json","thumbnail":"unique-icons/clutch.svg","triangles":5144},{"id":"bollard","name":"Bollard","icon":"unique-icons/bollard.svg","model":"Hardware/3d/bollard.glb","spec":"Hardware/specs/bollard.json","thumbnail":"unique-icons/bollard.svg","triangles":1024},{"id":"descender","name":"Descender","icon":"unique-icons/descender.svg","model":"Hardware/3d/descender.glb","spec":"Hardware/specs/descender.json","thumbnail":"unique-icons/descender.svg","triangles":5888},{"id":"carabiner","name":"Carabiner","icon":"unique-icons/carabiner.svg","model":"Hardware/3d/carabiner.glb","spec":"Hardware/specs/carabiner.json","thumbnail":"unique-icons/carabiner.svg","triangles":5772},{"id":"shackle","name":"Bow Shackle","icon":"unique-icons/shackle.svg","model":"Hardware/3d/shackle.glb","spec":"Hardware/specs/shackle.json","thumbnail":"unique-icons/shackle.svg","triangles":6016},{"id":"rigging_plate","name":"Rigging Plate","icon":"unique-icons/rigging_plate.svg","model":"Hardware/3d/rigging_plate.glb","spec":"Hardware/specs/rigging_plate.json","thumbnail":"unique-icons/rigging_plate.svg","triangles":1152},{"id":"swivel","name":"Swivel","icon":"unique-icons/swivel.svg","model":"Hardware/3d/swivel.glb","spec":"Hardware/specs/swivel.json","thumbnail":"unique-icons/swivel.svg","triangles":9472}]},{"id":"truss","name":"Truss","assets":[{"id":"truss_1m","name":"Box Truss 1 m","icon":"unique-icons/truss_1m.svg","model":"Truss/3d/truss_1m.glb","spec":"Truss/specs/truss_1m.json","thumbnail":"unique-icons/truss_1m.svg","triangles":896},{"id":"truss_2m","name":"Box Truss 2 m","icon":"unique-icons/truss_2m.svg","model":"Truss/3d/truss_2m.glb","spec":"Truss/specs/truss_2m.json","thumbnail":"unique-icons/truss_2m.svg","triangles":1472},{"id":"truss_3m","name":"Box Truss 3 m","icon":"unique-icons/truss_3m.svg","model":"Truss/3d/truss_3m.glb","spec":"Truss/specs/truss_3m.json","thumbnail":"unique-icons/truss_3m.svg","triangles":2048},{"id":"truss_corner","name":"Box Truss 90\u00b0 Corner","icon":"unique-icons/truss_corner.svg","model":"Truss/3d/truss_corner.glb","spec":"Truss/specs/truss_corner.json","thumbnail":"unique-icons/truss_corner.svg","triangles":1792},{"id":"truss_baseplate","name":"Truss Base Plate","icon":"unique-icons/truss_baseplate.svg","model":"Truss/3d/truss_baseplate.glb","spec":"Truss/specs/truss_baseplate.json","thumbnail":"unique-icons/truss_baseplate.svg","triangles":1036}]},{"id":"scaffold","name":"Scaffold","assets":[{"id":"scaffold_tube_1m","name":"Scaffold Tube 1 m","icon":"unique-icons/scaffold_tube_1m.svg","model":"Scaffold/3d/scaffold_tube_1m.glb","spec":"Scaffold/specs/scaffold_tube_1m.json","thumbnail":"unique-icons/scaffold_tube_1m.svg","triangles":192},{"id":"scaffold_tube_2m","name":"Scaffold Tube 2 m","icon":"unique-icons/scaffold_tube_2m.svg","model":"Scaffold/3d/scaffold_tube_2m.glb","spec":"Scaffold/specs/scaffold_tube_2m.json","thumbnail":"unique-icons/scaffold_tube_2m.svg","triangles":192},{"id":"scaffold_tube_3m","name":"Scaffold Tube 3 m","icon":"unique-icons/scaffold_tube_3m.svg","model":"Scaffold/3d/scaffold_tube_3m.glb","spec":"Scaffold/specs/scaffold_tube_3m.json","thumbnail":"unique-icons/scaffold_tube_3m.svg","triangles":192},{"id":"right_angle_coupler","name":"Right-Angle Coupler","icon":"unique-icons/right_angle_coupler.svg","model":"Scaffold/3d/right_angle_coupler.glb","spec":"Scaffold/specs/right_angle_coupler.json","thumbnail":"unique-icons/right_angle_coupler.svg","triangles":524},{"id":"swivel_coupler","name":"Swivel Coupler","icon":"unique-icons/swivel_coupler.svg","model":"Scaffold/3d/swivel_coupler.glb","spec":"Scaffold/specs/swivel_coupler.json","thumbnail":"unique-icons/swivel_coupler.svg","triangles":524},{"id":"base_jack","name":"Adjustable Base Jack","icon":"unique-icons/base_jack.svg","model":"Scaffold/3d/base_jack.glb","spec":"Scaffold/specs/base_jack.json","thumbnail":"unique-icons/base_jack.svg","triangles":780}]},{"id":"camera","name":"Camera","assets":[{"id":"wirecam","name":"Wirecam Trolley","icon":"unique-icons/wirecam.svg","model":"Camera/3d/wirecam.glb","spec":"Camera/specs/wirecam.json","thumbnail":"unique-icons/wirecam.svg","triangles":1572},{"id":"camera_body","name":"Cinema Camera Body","icon":"unique-icons/camera_body.svg","model":"Camera/3d/camera_body.glb","spec":"Camera/specs/camera_body.json","thumbnail":"unique-icons/camera_body.svg","triangles":280},{"id":"remote_head","name":"Remote Camera Head","icon":"unique-icons/remote_head.svg","model":"Camera/3d/remote_head.glb","spec":"Camera/specs/remote_head.json","thumbnail":"unique-icons/remote_head.svg","triangles":524}]},{"id":"machines","name":"Machines","assets":[{"id":"winch","name":"Stage Winch","icon":"unique-icons/winch.svg","model":"Machines/3d/winch.glb","spec":"Machines/specs/winch.json","thumbnail":"unique-icons/winch.svg","triangles":24112},{"id":"telehandler","name":"Telehandler","icon":"unique-icons/telehandler.svg","model":"Machines/3d/telehandler.glb","spec":"Machines/specs/telehandler.json","thumbnail":"unique-icons/telehandler.svg","triangles":1084},{"id":"telehandler_boom_out","name":"Telehandler \u2014 Boom Extended","icon":"unique-icons/telehandler_boom_out.svg","model":"Machines/3d/telehandler_boom_out.glb","spec":"Machines/specs/telehandler_boom_out.json","thumbnail":"unique-icons/telehandler_boom_out.svg","triangles":1096},{"id":"scissor_lift","name":"Scissor Lift","icon":"unique-icons/scissor_lift.svg","model":"Machines/3d/scissor_lift.glb","spec":"Machines/specs/scissor_lift.json","thumbnail":"unique-icons/scissor_lift.svg","triangles":2072},{"id":"scissor_lift_raised","name":"Scissor Lift \u2014 Raised","icon":"unique-icons/scissor_lift_raised.svg","model":"Machines/3d/scissor_lift_raised.glb","spec":"Machines/specs/scissor_lift_raised.json","thumbnail":"unique-icons/scissor_lift_raised.svg","triangles":2584}]},{"id":"people","name":"People","assets":[{"id":"performer","name":"Performer","icon":"unique-icons/performer.svg","model":"","spec":"","thumbnail":"unique-icons/performer.svg","triangles":0}]}];
const ASSETS=SIMPLE_RIG_LIBRARY.flatMap(category=>category.assets.map(asset=>({...asset,category:category.name})));
const q=id=>document.getElementById(id);
const workspace2d=q('workspace2d'),workspace3d=q('workspace3d'),b2=q('switch2d'),b3=q('switch3d');
const host=q('sr3Viewport');
const canvas=document.createElement('canvas');
canvas.setAttribute('aria-label','SimpleRig 3D planning viewport');
host.innerHTML='';
host.appendChild(canvas);
const ctx=canvas.getContext('2d',{alpha:false});

let objects=[],selected=null,seq=1,showNames=false,currentDrawObject=null,layerGroups=[],groupSeq=1;
let camera={yaw:-0.7,pitch:0.42,distance:12,targetX:0,targetY:1,targetZ:0};
let drag=null,started=false,tool='select',mode='position',snap=.05;
const palette={bg:'#07101a',grid:'#26384b',gridMajor:'#40566d',text:'#edf5fc',muted:'#9fb0c0',accent:'#62a7ff',select:'#ffbd59'};

function resize(){
  const r=host.getBoundingClientRect();
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const w=Math.max(320,Math.floor(r.width)),h=Math.max(420,Math.floor(r.height));
  canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);
  canvas.style.width=w+'px';canvas.style.height=h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);draw();
}
function rotatePoint(p){
  let x=p.x-camera.targetX,y=p.y-camera.targetY,z=p.z-camera.targetZ;
  const cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw);
  const x1=cy*x-sy*z,z1=sy*x+cy*z;
  const cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
  const y1=cp*y-sp*z1,z2=sp*y+cp*z1;
  return {x:x1,y:y1,z:z2+camera.distance};
}
function project(p){
  const r=rotatePoint(p),rect=canvas.getBoundingClientRect();
  const f=Math.min(rect.width,rect.height)*0.92;
  const z=Math.max(.25,r.z);
  return {x:rect.width/2+r.x*f/z,y:rect.height/2-r.y*f/z,z,scale:f/z};
}
function line3(a,b,stroke,width=1,dash=[]){
  const A=project(a),B=project(b);ctx.save();ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);
  ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();ctx.restore();
}
function drawGrid(){
  for(let i=-15;i<=15;i++){
    const major=i%5===0;
    line3({x:i,y:0,z:-15},{x:i,y:0,z:15},major?palette.gridMajor:palette.grid,major?1.2:.65);
    line3({x:-15,y:0,z:i},{x:15,y:0,z:i},major?palette.gridMajor:palette.grid,major?1.2:.65);
  }
  line3({x:0,y:0,z:0},{x:2,y:0,z:0},'#d74f4f',2);
  line3({x:0,y:0,z:0},{x:0,y:2,z:0},'#53bb78',2);
  line3({x:0,y:0,z:0},{x:0,y:0,z:2},'#4c8ee8',2);
}
function worldPoint(o,local){
  let x=local.x*o.scale,y=local.y*o.scale,z=local.z*o.scale;
  const rx=(o.rx||0)*Math.PI/180,ry=(o.ry||0)*Math.PI/180,rz=(o.rz||0)*Math.PI/180;
  let c=Math.cos(rx),s=Math.sin(rx),y1=c*y-s*z,z1=s*y+c*z;y=y1;z=z1;
  c=Math.cos(ry);s=Math.sin(ry);let x1=c*x+s*z;z1=-s*x+c*z;x=x1;z=z1;
  c=Math.cos(rz);s=Math.sin(rz);x1=c*x-s*y;y1=s*x+c*y;x=x1;y=y1;
  return{x:o.x+x,y:o.y+y,z:o.z+z}
}
function drawPerformer(o){
  const joints={
    head:{x:0,y:1.85,z:0},neck:{x:0,y:1.62,z:0},hip:{x:0,y:.92,z:0},
    ls:{x:-.25,y:1.52,z:0},rs:{x:.25,y:1.52,z:0},lh:{x:-.48,y:.98,z:0},rh:{x:.48,y:.98,z:0},
    lk:{x:-.13,y:.48,z:0},rk:{x:.13,y:.48,z:0},lf:{x:-.16,y:.03,z:.08},rf:{x:.16,y:.03,z:.08}
  };
  const P=k=>project(worldPoint(o,joints[k]));
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  const seg=(a,b,w,c)=>{const A=P(a),B=P(b);ctx.strokeStyle=c;ctx.lineWidth=Math.max(2,w*((A.scale+B.scale)/2)/55);ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke()};
  seg('neck','hip',18,'#394754');seg('ls','lh',10,'#394754');seg('rs','rh',10,'#394754');
  seg('hip','lk',12,'#394754');seg('hip','rk',12,'#394754');seg('lk','lf',11,'#29343e');seg('rk','rf',11,'#29343e');
  seg('ls','rs',8,'#c43e3e');seg('ls','hip',5,'#c43e3e');seg('rs','hip',5,'#c43e3e');
  const H=P('head');ctx.fillStyle='#c59a7b';ctx.beginPath();ctx.arc(H.x,H.y,Math.max(5,H.scale*.15),0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function drawBox(o,w=1,h=1,d=1,color='#7f8b96'){
  const pts=[
    [-w/2,0,-d/2],[w/2,0,-d/2],[w/2,0,d/2],[-w/2,0,d/2],
    [-w/2,h,-d/2],[w/2,h,-d/2],[w/2,h,d/2],[-w/2,h,d/2]
  ].map(v=>project(worldPoint(o,{x:v[0],y:v[1],z:v[2]})));
  const faces=[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]];
  ctx.save();
  faces.forEach((f,i)=>{ctx.fillStyle=i===4?lighten(color,20):i%2?darken(color,12):color;ctx.strokeStyle='#16202a';ctx.lineWidth=1;ctx.beginPath();f.forEach((n,j)=>j?ctx.lineTo(pts[n].x,pts[n].y):ctx.moveTo(pts[n].x,pts[n].y));ctx.closePath();ctx.fill();ctx.stroke()});
  ctx.restore();
}
function lighten(hex,a){return shade(hex,a)} function darken(hex,a){return shade(hex,-a)}
function shade(hex,amt){const n=parseInt(hex.slice(1),16),r=Math.max(0,Math.min(255,(n>>16)+amt)),g=Math.max(0,Math.min(255,((n>>8)&255)+amt)),b=Math.max(0,Math.min(255,(n&255)+amt));return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function drawPulley(o,double=false){
  const k=o.kind,c=project({x:o.x,y:o.y+.55*o.scale,z:o.z});
  const mainR=(k==='rescue_pulley'?.34:k==='progress_capture_pulley'?.29:.25);
  const r=Math.max(8,c.scale*mainR*o.scale);
  ctx.save();
  ctx.fillStyle=k==='rescue_pulley'?'#d3a133':k==='progress_capture_pulley'?'#6d7d89':'#788793';
  ctx.strokeStyle='#17212b';ctx.lineWidth=3;
  const wheels=double?[-r*.62,r*.62]:[0];
  wheels.forEach(dx=>{
    ctx.beginPath();ctx.arc(c.x+dx,c.y,r,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#dce3e8';ctx.lineWidth=Math.max(2,r*.18);ctx.beginPath();ctx.arc(c.x+dx,c.y,r*.58,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#3a4854';ctx.beginPath();ctx.arc(c.x+dx,c.y,r*.18,0,Math.PI*2);ctx.fill()
  });
  if(k==='progress_capture_pulley'){ctx.fillStyle='#c94141';ctx.beginPath();ctx.moveTo(c.x+r*.7,c.y-r*.7);ctx.lineTo(c.x+r*1.3,c.y);ctx.lineTo(c.x+r*.7,c.y+r*.3);ctx.closePath();ctx.fill()}
  ctx.strokeStyle='#aab5bd';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(c.x-r*.75,c.y-r*.75);ctx.lineTo(c.x-r*.35,c.y-r*1.35);ctx.lineTo(c.x+r*.35,c.y-r*1.35);ctx.lineTo(c.x+r*.75,c.y-r*.75);ctx.stroke();
  ctx.restore()
}
function drawTruss(o){
  if(o.kind==='truss_baseplate'){drawBoxAt(o,{x:0,y:.05,z:0},.9,.1,.9,'#6f7c86');drawBoxAt(o,{x:0,y:.18,z:0},.34,.28,.34,'#929ca4');return}
  if(o.kind==='truss_corner'){
    const a={...o},b={...o,x:o.x+.78*o.scale,z:o.z+.78*o.scale};
    drawTrussSegment(a,1.5);drawTrussSegment(b,1.5,true);return
  }
  const length=o.kind.includes('3m')?3:o.kind.includes('1m')?1:2;drawTrussSegment(o,length)
}
function drawTrussSegment(o,length,turn=false){
  const z=.24,y0=.15,y1=.62;
  const ends=[-length/2,length/2];
  ends.forEach(x=>{line3(worldPoint(o,{x:turn?0:x,y:y0,z:turn?x:-z}),worldPoint(o,{x:turn?0:x,y:y1,z:turn?x:-z}),'#aeb7be',4);line3(worldPoint(o,{x:turn?0:x,y:y0,z:turn?x:z}),worldPoint(o,{x:turn?0:x,y:y1,z:turn?x:z}),'#aeb7be',4)});
  [[y0,-z],[y0,z],[y1,-z],[y1,z]].forEach(([y,zv])=>line3(worldPoint(o,{x:turn?0:-length/2,y,z:turn?-length/2:zv}),worldPoint(o,{x:turn?0:length/2,y,z:turn?length/2:zv}),'#b9c1c7',4));
  for(let i=-length/2;i<length/2-.1;i+=.34){
    line3(worldPoint(o,{x:turn?0:i,y:y0,z:turn?i:-z}),worldPoint(o,{x:turn?0:i+.34,y:y1,z:turn?i+.34:z}),'#88959f',1.6);
    line3(worldPoint(o,{x:turn?0:i,y:y1,z:turn?i:z}),worldPoint(o,{x:turn?0:i+.34,y:y0,z:turn?i+.34:-z}),'#88959f',1.6)
  }
}
function poly3(points,fill,stroke='#17212b',width=1){
  const pts=points.map(p=>project(worldPoint(currentDrawObject,p)));
  ctx.save();ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.beginPath();
  pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()
}
function circle3(o,p,r,fill,stroke='#17212b',width=1){
  const c=project(worldPoint(o,p));ctx.save();ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=width;
  ctx.beginPath();ctx.ellipse(c.x,c.y,Math.max(2,c.scale*r*o.scale),Math.max(2,c.scale*r*.72*o.scale),0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore()
}
function drawTelehandler(o,extended){
  currentDrawObject=o;
  // Four large tyres.
  [[-.72,.28,-.43],[.72,.28,-.43],[-.72,.28,.43],[.72,.28,.43]].forEach(p=>{
    circle3(o,{x:p[0],y:p[1],z:p[2]},.25,'#171d22','#05080b',2);
    circle3(o,{x:p[0],y:p[1],z:p[2]},.11,'#8b969e','#26313a',2)
  });
  // Lower chassis, counterweight, engine cover.
  drawBoxAt(o,{x:0,y:.28,z:0},1.8,.28,.86,'#c99722');
  drawBoxAt(o,{x:-.62,y:.56,z:0},.62,.42,.82,'#d2a32d');
  // Cab frame and glazing.
  drawBoxAt(o,{x:.18,y:.58,z:0},.62,.76,.76,'#d5a72e');
  drawBoxAt(o,{x:.2,y:.75,z:-.395},.48,.47,.025,'#54758a');
  drawBoxAt(o,{x:.2,y:.75,z:.395},.48,.47,.025,'#54758a');
  drawBoxAt(o,{x:.49,y:.75,z:0},.025,.47,.62,'#48687c');
  // Roof and work lights.
  drawBoxAt(o,{x:.18,y:1.02,z:0},.7,.09,.82,'#ba861b');
  circle3(o,{x:.45,y:1.08,z:-.27},.05,'#f0e1a2');
  circle3(o,{x:.45,y:1.08,z:.27},.05,'#f0e1a2');
  // Boom sections and hydraulic ram.
  const boomLen=extended?2.65:1.52, boomX=extended?1.03:.55;
  drawRotatedBox(o,{x:boomX,y:1.13,z:0},boomLen,.22,.3,'#d8a526',-0.28);
  drawRotatedBox(o,{x:extended?1.65:.91,y:1.35,z:0},extended?1.45:.48,.12,.2,'#e0b641',-0.28);
  drawRotatedBox(o,{x:.66,y:.91,z:.29},1.18,.055,.055,'#6b7379',-0.28);
  // Fork carriage and forks.
  const fx=extended?2.55:1.36, fy=extended?1.62:1.28;
  drawBoxAt(o,{x:fx,y:fy,z:0},.13,.52,.72,'#303b44');
  drawRotatedBox(o,{x:fx+.42,y:fy-.18,z:-.24},.85,.055,.08,'#363f46',-.08);
  drawRotatedBox(o,{x:fx+.42,y:fy-.18,z:.24},.85,.055,.08,'#363f46',-.08);
}
function drawScissorLift(o,raised){
  // Base and wheels.
  drawBoxAt(o,{x:0,y:.18,z:0},1.55,.3,.82,'#2e3942');
  [[-.55,.1,-.45],[.55,.1,-.45],[-.55,.1,.45],[.55,.1,.45]].forEach(p=>circle3(o,{x:p[0],y:p[1],z:p[2]},.13,'#171d22'));
  const levels=raised?4:2, total=raised?2.35:1.05;
  for(let i=0;i<levels;i++){
    const y=.35+i*(total/levels);
    line3(worldPoint(o,{x:-.55,y,z:-.26}),worldPoint(o,{x:.55,y:y+total/levels,z:.26}),'#d2a027',6);
    line3(worldPoint(o,{x:.55,y,z:-.26}),worldPoint(o,{x:-.55,y:y+total/levels,z:.26}),'#d2a027',6)
  }
  drawBoxAt(o,{x:0,y:.42+total,z:0},1.45,.12,.82,'#d4a32d');
  const railY=.58+total;
  [[-0.67,-.35],[.67,-.35],[-.67,.35],[.67,.35]].forEach(p=>line3(worldPoint(o,{x:p[0],y:.48+total,z:p[1]}),worldPoint(o,{x:p[0],y:railY+.52,z:p[1]}),'#d6aa3c',3));
  line3(worldPoint(o,{x:-.67,y:railY+.52,z:-.35}),worldPoint(o,{x:.67,y:railY+.52,z:-.35}),'#d6aa3c',3);
  line3(worldPoint(o,{x:-.67,y:railY+.52,z:.35}),worldPoint(o,{x:.67,y:railY+.52,z:.35}),'#d6aa3c',3)
}
function drawWinch(o){
  drawBoxAt(o,{x:0,y:.28,z:0},1.28,.56,.72,'#36434e');
  drawBoxAt(o,{x:-.47,y:.64,z:0},.28,.42,.58,'#485762');
  circle3(o,{x:.15,y:.64,z:-.38},.34,'#758591','#17212b',2);
  circle3(o,{x:.15,y:.64,z:.38},.34,'#758591','#17212b',2);
  circle3(o,{x:.15,y:.64,z:-.39},.19,'#242e36');
  line3(worldPoint(o,{x:.48,y:.64,z:0}),worldPoint(o,{x:1.05,y:.64,z:0}),'#d8dce0',3)
}
function drawHardware(o){
  const k=o.kind;
  if(k==='carabiner'){
    const c=project({x:o.x,y:o.y+.6*o.scale,z:o.z});ctx.save();ctx.strokeStyle='#a8b2ba';ctx.lineWidth=Math.max(5,c.scale*.11*o.scale);
    ctx.beginPath();ctx.ellipse(c.x,c.y,c.scale*.24*o.scale,c.scale*.38*o.scale,.28,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#d8a33b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(c.x-8,c.y-18);ctx.lineTo(c.x+12,c.y+12);ctx.stroke();ctx.restore();return
  }
  if(k==='shackle'){drawPulley(o,false);drawBoxAt(o,{x:0,y:.18,z:0},.62,.1,.18,'#7b8994');return}
  if(k==='bollard'){drawBoxAt(o,{x:0,y:.15,z:0},.74,.18,.58,'#657480');drawCylinderApprox(o,{x:0,y:.58,z:0},.28,.72,'#85939e');return}
  if(k==='rigging_plate'){drawBoxAt(o,{x:0,y:.3,z:0},.72,.08,.52,'#657581');[[-.22,.32,-.14],[.22,.32,-.14],[0,.32,.14]].forEach(p=>circle3(o,{x:p[0],y:p[1],z:p[2]},.07,'#07101a'));return}
  if(k==='swivel'){drawCylinderApprox(o,{x:0,y:.52,z:0},.22,.46,'#778691');circle3(o,{x:0,y:.82,z:0},.13,'#9ba5ad');circle3(o,{x:0,y:.2,z:0},.13,'#9ba5ad');return}
  drawBoxAt(o,{x:0,y:.25,z:0},.52,.7,.32,k==='clutch'||k==='descender'?'#b94b43':'#788893');
  circle3(o,{x:0,y:.55,z:-.18},.13,'#dce2e6')
}
function drawCameraAsset(o){
  if(o.kind==='wirecam'){
    circle3(o,{x:-.35,y:.92,z:0},.14,'#788893');circle3(o,{x:.35,y:.92,z:0},.14,'#788893');
    line3(worldPoint(o,{x:-.35,y:.78,z:0}),worldPoint(o,{x:-.18,y:.43,z:0}),'#687783',4);
    line3(worldPoint(o,{x:.35,y:.78,z:0}),worldPoint(o,{x:.18,y:.43,z:0}),'#687783',4);
    drawBoxAt(o,{x:0,y:.34,z:0},.58,.34,.42,'#29343e');circle3(o,{x:.3,y:.5,z:0},.11,'#6f98b8');return
  }
  if(o.kind==='remote_head'){drawBoxAt(o,{x:0,y:.25,z:0},.72,.12,.58,'#303b45');drawCylinderApprox(o,{x:0,y:.55,z:0},.12,.48,'#5d6d79');drawBoxAt(o,{x:0,y:.83,z:0},.66,.36,.45,'#29343e');circle3(o,{x:.34,y:.98,z:0},.12,'#769bb9');return}
  drawBoxAt(o,{x:0,y:.42,z:0},.74,.58,.48,'#2b3540');circle3(o,{x:.39,y:.7,z:0},.19,'#182028');circle3(o,{x:.4,y:.7,z:0},.1,'#7697b4')
}
function drawBoxAt(o,c,w,h,d,color){
  const temp={...o,x:o.x+c.x*o.scale,y:o.y+c.y*o.scale,z:o.z+c.z*o.scale};
  drawBox(temp,w*o.scale,h*o.scale,d*o.scale,color)
}
function drawRotatedBox(o,c,w,h,d,color,angle){
  // Canvas renderer approximation: detailed articulated component with centreline.
  const a=worldPoint(o,{x:c.x-w/2*Math.cos(angle),y:c.y-w/2*Math.sin(angle),z:c.z});
  const b=worldPoint(o,{x:c.x+w/2*Math.cos(angle),y:c.y+w/2*Math.sin(angle),z:c.z});
  const A=project(a),B=project(b);ctx.save();ctx.strokeStyle=color;ctx.lineWidth=Math.max(3,((A.scale+B.scale)/2)*h*o.scale);ctx.lineCap='square';ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();ctx.strokeStyle='#17212b';ctx.lineWidth=1;ctx.stroke();ctx.restore()
}
function drawCylinderApprox(o,c,r,h,color){
  drawBoxAt(o,c,r*2,h,r*2,color);circle3(o,{x:c.x,y:c.y+h/2,z:c.z},r,color)
}
function drawMachine(o){
  if(o.kind==='telehandler')return drawTelehandler(o,false);
  if(o.kind==='telehandler_boom_out')return drawTelehandler(o,true);
  if(o.kind==='scissor_lift')return drawScissorLift(o,false);
  if(o.kind==='scissor_lift_raised')return drawScissorLift(o,true);
  if(o.kind==='winch')return drawWinch(o)
}

function normaliseImportedGeometry(vertices,faces){
  if(!vertices.length)throw new Error('No vertex data was found in this file.');
  let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
  vertices.forEach(v=>{minX=Math.min(minX,v[0]);minY=Math.min(minY,v[1]);minZ=Math.min(minZ,v[2]);maxX=Math.max(maxX,v[0]);maxY=Math.max(maxY,v[1]);maxZ=Math.max(maxZ,v[2])});
  const cx=(minX+maxX)/2,cz=(minZ+maxZ)/2;
  const span=Math.max(maxX-minX,maxY-minY,maxZ-minZ)||1;
  const scale=3/span;
  return {
    vertices:vertices.map(v=>[(v[0]-cx)*scale,(v[1]-minY)*scale,(v[2]-cz)*scale]),
    faces:faces.slice(0,25000)
  }
}
function parseOBJ(text){
  const vertices=[],faces=[];
  text.split(/\r?\n/).forEach(line=>{
    const p=line.trim().split(/\s+/);
    if(p[0]==='v'&&p.length>=4)vertices.push([Number(p[1]),Number(p[2]),Number(p[3])]);
    if(p[0]==='f'&&p.length>=4){
      const ids=p.slice(1).map(x=>Number(x.split('/')[0])-1);
      for(let i=1;i<ids.length-1;i++)faces.push([ids[0],ids[i],ids[i+1]])
    }
  });
  return normaliseImportedGeometry(vertices,faces)
}
function parseSTL(buffer){
  const view=new DataView(buffer);
  const vertices=[],faces=[],map=new Map();
  const add=(x,y,z)=>{
    const key=`${x.toFixed(6)},${y.toFixed(6)},${z.toFixed(6)}`;
    if(map.has(key))return map.get(key);
    const i=vertices.length;vertices.push([x,y,z]);map.set(key,i);return i
  };
  const binary=buffer.byteLength>=84&&84+view.getUint32(80,true)*50===buffer.byteLength;
  if(binary){
    const count=view.getUint32(80,true);let off=84;
    for(let i=0;i<count;i++,off+=50){
      const ids=[];
      for(let j=0;j<3;j++){
        const p=off+12+j*12;
        ids.push(add(view.getFloat32(p,true),view.getFloat32(p+4,true),view.getFloat32(p+8,true)))
      }
      faces.push(ids)
    }
  }else{
    const text=new TextDecoder().decode(buffer),nums=[...text.matchAll(/vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g)];
    for(let i=0;i+2<nums.length;i+=3)faces.push(nums.slice(i,i+3).map(m=>add(Number(m[1]),Number(m[2]),Number(m[3]))))
  }
  return normaliseImportedGeometry(vertices,faces)
}
function componentInfo(type){return type===5120?[1,1]:type===5121?[1,1]:type===5122?[2,1]:type===5123?[2,1]:type===5125?[4,1]:[4,1]}
function readAccessor(gltf,buffers,index){
  const a=gltf.accessors[index],bv=gltf.bufferViews[a.bufferView],buffer=buffers[bv.buffer];
  const comps={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16}[a.type]||1;
  const [bytes]=componentInfo(a.componentType);
  const stride=bv.byteStride||bytes*comps,offset=(bv.byteOffset||0)+(a.byteOffset||0);
  const view=new DataView(buffer);
  const get=(pos)=>{
    if(a.componentType===5126)return view.getFloat32(pos,true);
    if(a.componentType===5125)return view.getUint32(pos,true);
    if(a.componentType===5123)return view.getUint16(pos,true);
    if(a.componentType===5122)return view.getInt16(pos,true);
    if(a.componentType===5121)return view.getUint8(pos);
    return view.getInt8(pos)
  };
  const out=[];
  for(let i=0;i<a.count;i++){
    const row=[];for(let c=0;c<comps;c++)row.push(get(offset+i*stride+c*bytes));out.push(row)
  }
  return out
}
function gltfToGeometry(gltf,buffers){
  const vertices=[],faces=[];
  (gltf.meshes||[]).forEach(mesh=>(mesh.primitives||[]).forEach(primitive=>{
    if(primitive.attributes?.POSITION===undefined)return;
    const positions=readAccessor(gltf,buffers,primitive.attributes.POSITION),base=vertices.length;
    positions.forEach(p=>vertices.push([p[0],p[1],p[2]]));
    if(primitive.indices!==undefined){
      const indices=readAccessor(gltf,buffers,primitive.indices).flat();
      for(let i=0;i+2<indices.length;i+=3)faces.push([base+indices[i],base+indices[i+1],base+indices[i+2]])
    }else for(let i=0;i+2<positions.length;i+=3)faces.push([base+i,base+i+1,base+i+2])
  }));
  return normaliseImportedGeometry(vertices,faces)
}
function parseGLB(buffer){
  const view=new DataView(buffer);
  if(view.getUint32(0,true)!==0x46546c67)throw new Error('Invalid GLB header.');
  let offset=12,gltf=null,bin=null;
  while(offset<buffer.byteLength){
    const len=view.getUint32(offset,true),type=view.getUint32(offset+4,true),data=buffer.slice(offset+8,offset+8+len);
    if(type===0x4E4F534A)gltf=JSON.parse(new TextDecoder().decode(data));
    if(type===0x004E4942)bin=data;
    offset+=8+len
  }
  if(!gltf)throw new Error('GLB JSON chunk is missing.');
  return gltfToGeometry(gltf,[bin])
}
async function parseGLTF(text){
  const gltf=JSON.parse(text),buffers=[];
  for(const b of gltf.buffers||[]){
    if(!b.uri?.startsWith('data:'))throw new Error('This GLTF uses external .bin files. Use a self-contained GLB or embedded GLTF.');
    const raw=atob(b.uri.split(',')[1]),arr=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)arr[i]=raw.charCodeAt(i);buffers.push(arr.buffer)
  }
  return gltfToGeometry(gltf,buffers)
}
async function import3DFile(file){
  const ext=file.name.split('.').pop().toLowerCase();
  q('sr3EnvStatus').textContent='Importing '+file.name+'…';
  let geometry;
  if(ext==='obj')geometry=parseOBJ(await file.text());
  else if(ext==='stl')geometry=parseSTL(await file.arrayBuffer());
  else if(ext==='glb')geometry=parseGLB(await file.arrayBuffer());
  else if(ext==='gltf')geometry=await parseGLTF(await file.text());
  else throw new Error('Unsupported 3D file type.');
  const o={id:'3D-'+seq++,kind:'imported_mesh',name:file.name,category:'Imported',x:0,y:0,z:0,rx:0,ry:0,rz:0,scale:1,hidden:false,locked:false,model:file.name,wll:'—',mbs:'—',operating:false,operatingRole:'other',supportingParts:1,pullDirection:'haul',mesh:geometry};
  if(!q('sr3GroundSnap')?.checked)o.y=-.5;
  objects.push(o);select(o);renderLayers();draw();
  q('sr3EnvStatus').textContent=`Imported ${file.name}: ${geometry.vertices.length.toLocaleString()} vertices, ${geometry.faces.length.toLocaleString()} faces.`;
  return o
}
function drawImportedMesh(o){
  const mesh=o.mesh;if(!mesh?.vertices?.length)return;
  const projected=mesh.vertices.map(v=>project(worldPoint(o,{x:v[0],y:v[1],z:v[2]})));
  const mode=q('sr3EnvMode')?.value||'shaded';
  const opacity=Math.max(.1,Math.min(1,Number(q('sr3Opacity')?.value)||.7));
  const faces=(mesh.faces||[]).map(f=>({f,z:(projected[f[0]]?.z+projected[f[1]]?.z+projected[f[2]]?.z)/3})).sort((a,b)=>b.z-a.z);
  ctx.save();ctx.globalAlpha=opacity;
  faces.slice(0,25000).forEach(({f})=>{
    const a=projected[f[0]],b=projected[f[1]],c=projected[f[2]];if(!a||!b||!c)return;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();
    if(mode!=='wireframe'){ctx.fillStyle=mode==='textured'?'#80909b':'#71818d';ctx.fill()}
    ctx.strokeStyle='#26343e';ctx.lineWidth=.6;ctx.stroke()
  });
  ctx.restore()
}
let groundPreset='none';
function drawGroundTexture(){
  if(groundPreset==='none')return;
  const colours={concrete:['#71777b','#858b8f'],grass:['#456c3a','#5c814b'],dirt:['#785b3e','#947250'],stage:['#17191c','#292c31'],grid:['#65737e','#8fa0ad']}[groundPreset];
  const size=12,step=1;
  for(let x=-size;x<size;x+=step)for(let z=-size;z<size;z+=step){
    const a=project({x,y:.002,z}),b=project({x:x+step,y:.002,z}),c=project({x:x+step,y:.002,z:z+step}),d=project({x,y:.002,z:z+step});
    ctx.fillStyle=((x+z)&1)?colours[0]:colours[1];ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();
    if(groundPreset==='grid'){ctx.strokeStyle='#d4e0e8';ctx.lineWidth=.35;ctx.stroke()}
  }
}
function drawObject(o){
  if(o.hidden)return;
  currentDrawObject=o;

  const kind=String(o.kind||'').toLowerCase();
  const pulleyKinds=new Set(['single_pulley','double_pulley','rescue_pulley','progress_capture_pulley']);
  const hardwareKinds=new Set(['rope_grab','clutch','bollard','descender','carabiner','shackle','rigging_plate','swivel']);
  const trussKinds=new Set(['truss_1m','truss_2m','truss_3m','truss_corner','truss_baseplate']);
  const machineKinds=new Set(['winch','telehandler','telehandler_boom_out','scissor_lift','scissor_lift_raised']);
  const cameraKinds=new Set(['wirecam','camera_body','remote_head']);
  const scaffoldKinds=new Set(['scaffold_tube_1m','scaffold_tube_2m','scaffold_tube_3m','right_angle_coupler','swivel_coupler','base_jack']);

  // Route by asset ID, not by mutable category text. This prevents valid
  // equipment from falling through to the old generic black box.
  if(kind==='rig_rope_segment'){
    const a=project({x:o.ax,y:o.ay,z:o.az}),b=project({x:o.bx,y:o.by,z:o.bz});
    ctx.save();ctx.strokeStyle='#d7dde2';ctx.lineWidth=Math.max(2,3*((a.scale+b.scale)/2)/60);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();
  }
  else if(kind==='imported_mesh')drawImportedMesh(o);
  else if(kind==='performer')drawPerformer(o);
  else if(pulleyKinds.has(kind))drawPulley(o,kind==='double_pulley');
  else if(hardwareKinds.has(kind))drawHardware(o);
  else if(trussKinds.has(kind))drawTruss(o);
  else if(machineKinds.has(kind))drawMachine(o);
  else if(cameraKinds.has(kind))drawCameraAsset(o);
  else if(scaffoldKinds.has(kind)){
    if(kind==='base_jack'){
      drawBoxAt(o,{x:0,y:.06,z:0},.7,.12,.7,'#7c8993');
      drawCylinderApprox(o,{x:0,y:.55,z:0},.07,1,'#919ba3')
    }else if(kind.includes('coupler')){
      drawCylinderApprox(o,{x:0,y:.48,z:0},.19,.36,'#7a8791');
      drawRotatedBox(o,{x:0,y:.5,z:0},1,.13,.13,'#929ca4',kind==='swivel_coupler'?.55:0)
    }else{
      drawRotatedBox(o,{x:0,y:.5,z:0},kind.includes('3m')?3:kind.includes('1m')?1:2,.12,.12,'#929ca4',0)
    }
  }else{
    // Unknown/custom assets receive a recognisable technical placeholder,
    // not an anonymous black cube.
    drawBoxAt(o,{x:0,y:.34,z:0},.72,.68,.18,'#667886');
    circle3(o,{x:0,y:.72,z:.11},.17,'#aab8c2','#18232d',2);
    const p=project({x:o.x,y:o.y+.35*o.scale,z:o.z});
    ctx.save();ctx.fillStyle='#eef4f8';ctx.font='700 10px Arial';ctx.textAlign='center';
    ctx.fillText((o.name||'CUSTOM').slice(0,14),p.x,p.y);ctx.restore()
  }

  const centre=project({x:o.x,y:o.y+1.05*o.scale,z:o.z});
  if(o.simActive){
    const p1=project({x:o.x,y:o.y+1.3*o.scale,z:o.z}),p2=project({x:o.x,y:o.y+2.2*o.scale,z:o.z});
    ctx.save();ctx.strokeStyle='#ef4444';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();ctx.fillStyle='#ef4444';ctx.beginPath();ctx.arc(p2.x,p2.y,7,0,Math.PI*2);ctx.fill();ctx.font='700 11px Arial';ctx.textAlign='center';ctx.fillText((o.simForceKn||0).toFixed(2)+' kN',p2.x,p2.y-10);ctx.restore()
  }
  if(o.operating){
    ctx.save();ctx.strokeStyle='#f2a540';ctx.lineWidth=4;ctx.setLineDash([9,5]);ctx.strokeRect(centre.x-52,centre.y-72,104,95);
    ctx.setLineDash([]);ctx.fillStyle='#f2a540';ctx.font='700 11px Arial';ctx.textAlign='center';ctx.fillText('OPERATING',centre.x,centre.y-78);ctx.restore()
  }
  if(o===selected){ctx.save();ctx.strokeStyle=palette.select;ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.strokeRect(centre.x-45,centre.y-65,90,82);ctx.restore()}
  if(showNames){ctx.font='700 13px Arial';ctx.textAlign='center';ctx.textBaseline='bottom';const txt=o.name;const w=ctx.measureText(txt).width+14;ctx.fillStyle='rgba(5,12,20,.84)';ctx.fillRect(centre.x-w/2,centre.y-77,w,21);ctx.fillStyle='#fff';ctx.fillText(txt,centre.x,centre.y-61)}
}
function draw(){
  const r=canvas.getBoundingClientRect();ctx.fillStyle=palette.bg;ctx.fillRect(0,0,r.width,r.height);drawGroundTexture();drawGrid();
  [...objects].sort((a,b)=>rotatePoint(b).z-rotatePoint(a).z).forEach(drawObject);
  ctx.fillStyle=palette.muted;ctx.font='12px Arial';ctx.textAlign='left';ctx.fillText('Drag empty space to orbit • Drag an object to move • Wheel to zoom',14,r.height-14);
}
function add(kind){
  const requested=String(kind||'').toLowerCase();const asset=ASSETS.find(a=>String(a.id).toLowerCase()===requested)||ASSETS.find(a=>a.id==='performer');
  const o={id:'3D-'+seq++,kind:asset.id,name:asset.name+' '+seq,category:asset.category,x:0,y:0,z:0,rx:0,ry:0,rz:0,scale:1,hidden:false,locked:false,model:asset.name,wll:'—',mbs:'—',operating:false,operatingRole:'auto',supportingParts:1,pullDirection:'haul'};
  if(objects.length){o.x=((objects.length%5)-2)*1.2;o.z=Math.floor(objects.length/5)*1.1}
  objects.push(o);select(o);renderLayers();draw();q('sr3EnvStatus').textContent='Added '+asset.name+'.';return o
}
function select(o){selected=o;syncUI();renderLayers();draw()}

function inferOperatingRole(o){
  if(!o)return 'other';
  if(o.operatingRole&&o.operatingRole!=='auto')return o.operatingRole;
  const k=(o.kind||'').toLowerCase(),c=(o.category||'').toLowerCase();
  if(k.includes('winch'))return 'winch';
  if(k.includes('performer'))return 'load';
  if(k.includes('bollard')||k.includes('shackle')||k.includes('rigging_plate'))return 'anchor';
  if(k.includes('double_pulley')||k.includes('progress_capture'))return 'movingPulley';
  if(k.includes('pulley'))return 'fixedPulley';
  if(c==='machines')return 'winch';
  return 'other'
}
function suggestedSupportingParts(o,role){
  if(!o)return 1;
  const k=(o.kind||'').toLowerCase();
  if(role==='movingPulley'){
    if(k.includes('double'))return 3;
    if(k.includes('progress_capture'))return 2;
    return 2
  }
  if(role==='haul'||role==='winch')return Math.max(1,Number(q('sr3Ratio')?.value)||1);
  if(role==='fixedPulley')return 1;
  if(role==='load')return Math.max(1,Number(q('sr3Ratio')?.value)||1);
  return Math.max(.1,Number(o.supportingParts)||1)
}
function analyseOperatingPoint(){
  const box=q('sr3OperatingAnalysis'),klass=q('sr3OperatingClass'),ratioEl=q('sr3EffectiveRatio'),pullEl=q('sr3OperatingPull'),travelEl=q('sr3LoadTravel'),effectEl=q('sr3ForceEffect'),message=q('sr3OperatingMessage');
  if(!selected){
    box.className='operating-analysis neutral';klass.textContent='Select an object';ratioEl.textContent=pullEl.textContent=travelEl.textContent=effectEl.textContent='—';message.textContent='Mark one object as operating to analyse what happens when force is applied there.';return
  }
  const role=inferOperatingRole(selected);
  const direction=selected.pullDirection||'haul';
  let parts=Math.max(.1,Number(selected.supportingParts)||suggestedSupportingParts(selected,role));
  const systemRatio=Math.max(.1,Number(q('sr3Ratio')?.value)||1);
  const efficiency=Math.max(.01,Math.min(1,(Number(q('sr3Efficiency')?.value)||100)/100));
  const load=Math.max(0,Number(q('sr3Load')?.value)||0);
  let effective=1,valid=true,warning='';
  if(role==='haul'||role==='winch')effective=systemRatio;
  else if(role==='movingPulley'||role==='load')effective=parts;
  else if(role==='fixedPulley')effective=1;
  else if(role==='anchor'){effective=0;valid=false;warning='This is an anchor or tie-off. Pulling it is treated as disturbing the support, not as a valid operating input.'}
  else effective=parts;
  if(direction==='moveObject'&&effective>0)effective=1/effective;
  const practical=effective*efficiency;
  let classification='Neutral / direction change',cls='neutral';
  if(!valid){classification='Invalid operating point';cls='disadvantage'}
  else if(practical>1.05){classification='Mechanical advantage';cls='advantage'}
  else if(practical<.95){classification='Mechanical disadvantage';cls='disadvantage'}
  box.className='operating-analysis '+cls;
  klass.textContent=classification;
  ratioEl.textContent=valid?`${effective.toFixed(2)} : 1`:'—';
  pullEl.textContent=valid&&practical>0?`${(load/practical).toFixed(1)} kgf`:'—';
  travelEl.textContent=valid&&effective>0?`${(1/effective).toFixed(2)} m`:'—';
  effectEl.textContent=!valid?'Support disturbed':effective>1?`${effective.toFixed(2)}× force multiplication`:effective<1?`${(1/effective).toFixed(2)}× more input force`:'No force multiplication';
  if(!warning){
    const action=direction==='moveObject'?'moving the selected object':'pulling the line at the selected object';
    warning=`Analysis assumes ${parts.toFixed(1)} supporting rope part${parts===1?'':'s'} and ${Math.round(efficiency*100)}% efficiency. When ${action}, the estimated result is ${classification.toLowerCase()}.`;
    if(role==='fixedPulley')warning+=' A fixed pulley normally changes direction only.';
  }
  message.textContent=warning;
}
function setOperatingObject(o,isOperating){
  if(isOperating)objects.forEach(other=>{if(other!==o)other.operating=false});
  if(o)o.operating=!!isOperating;
  renderLayers();analyseOperatingPoint();draw()
}

function syncUI(){
  const ids=['sr3Name','sr3PX','sr3PY','sr3PZ','sr3Model','sr3Wll','sr3Mbs'];
  if(!selected){ids.forEach(id=>q(id).value='');q('sr3Operating').checked=false;analyseOperatingPoint();return}
  q('sr3Name').value=selected.name;q('sr3PX').value=selected.x.toFixed(2);q('sr3PY').value=selected.y.toFixed(2);q('sr3PZ').value=selected.z.toFixed(2);q('sr3Model').value=selected.model;q('sr3Wll').value=selected.wll;q('sr3Mbs').value=selected.mbs;
  q('sr3Operating').checked=!!selected.operating;
  q('sr3OperatingRole').value=selected.operatingRole||'auto';
  const inferred=inferOperatingRole(selected);
  if(!selected.supportingParts||selected.supportingParts===1)selected.supportingParts=suggestedSupportingParts(selected,inferred);
  q('sr3SupportingParts').value=selected.supportingParts;
  q('sr3PullDirection').value=selected.pullDirection||'haul';
  syncSliders();analyseOperatingPoint()
}
function syncSliders(){
  if(!selected)return;
  let vals,labs,ranges;
  if(mode==='position'){vals=[selected.x,selected.y,selected.z];labs=['X position (m)','Y position (m)','Z position (m)'];ranges=[[-10,10,.05],[0,10,.05],[-10,10,.05]]}
  else if(mode==='rotation'){vals=[selected.rx,selected.ry,selected.rz];labs=['X rotation (°)','Y rotation (°)','Z rotation (°)'];ranges=[[-180,180,1],[-180,180,1],[-180,180,1]]}
  else{vals=[selected.scale,selected.scale,selected.scale];labs=['Uniform scale','Uniform scale','Uniform scale'];ranges=[[.1,5,.05],[.1,5,.05],[.1,5,.05]]}
  ['X','Y','Z'].forEach((k,i)=>{const s=q('sr3'+k);s.min=ranges[i][0];s.max=ranges[i][1];s.step=ranges[i][2];s.value=vals[i];q('sr3Out'+k).value=Number(vals[i]).toFixed(mode==='rotation'?0:2);q('sr3Label'+k).textContent=labs[i]})
}

function renderLayers(){
  const host=q('sr3LayersList');if(!host)return;host.innerHTML='';

  const makeObjectRow=o=>{
    const row=document.createElement('div');
    row.className='layer-row'+(o===selected?' active':'')+(o.groupId?' grouped':'');
    const eye=document.createElement('button');eye.type='button';eye.title='Show or hide';eye.textContent=o.hidden?'○':'◉';
    eye.addEventListener('click',e=>{e.stopPropagation();o.hidden=!o.hidden;renderLayers();draw()});
    const lock=document.createElement('button');lock.type='button';lock.title='Lock or unlock';lock.textContent=o.locked?'🔒':'🔓';
    lock.addEventListener('click',e=>{e.stopPropagation();o.locked=!o.locked;renderLayers()});
    const name=document.createElement('div');name.className='layer-name';
    name.innerHTML=o.name+(o.operating?'<span class="operating-layer-badge">OPERATING</span>':'');
    name.addEventListener('click',()=>select(o));
    const up=document.createElement('button');up.type='button';up.title='Move layer up';up.textContent='↑';
    up.addEventListener('click',e=>{e.stopPropagation();const i=objects.indexOf(o);if(i<objects.length-1){objects.splice(i,1);objects.splice(i+1,0,o);renderLayers();draw()}});
    const down=document.createElement('button');down.type='button';down.title='Move layer down';down.textContent='↓';
    down.addEventListener('click',e=>{e.stopPropagation();const i=objects.indexOf(o);if(i>0){objects.splice(i,1);objects.splice(i-1,0,o);renderLayers();draw()}});
    row.append(eye,lock,name,up,down);
    return row
  };

  const groupedIds=new Set();
  layerGroups.forEach(group=>{
    const members=objects.filter(o=>o.groupId===group.id);
    if(!members.length)return;
    members.forEach(o=>groupedIds.add(o.id));

    const groupRow=document.createElement('div');groupRow.className='layer-group-row';
    const eye=document.createElement('button');eye.type='button';eye.title='Show or hide group';
    eye.textContent=members.every(o=>o.hidden)?'○':'◉';
    eye.addEventListener('click',()=>{
      const hide=!members.every(o=>o.hidden);
      members.forEach(o=>o.hidden=hide);renderLayers();draw()
    });
    const lock=document.createElement('button');lock.type='button';lock.title='Lock or unlock group';
    lock.textContent=members.every(o=>o.locked)?'🔒':'🔓';
    lock.addEventListener('click',()=>{
      const lockAll=!members.every(o=>o.locked);
      members.forEach(o=>o.locked=lockAll);renderLayers()
    });
    const name=document.createElement('div');name.className='layer-group-name';
    name.textContent=(group.collapsed?'▸ ':'▾ ')+group.name;
    name.title='Click to collapse or expand';
    name.addEventListener('click',()=>{group.collapsed=!group.collapsed;renderLayers()});
    const remove=document.createElement('button');remove.type='button';remove.title='Remove group';remove.textContent='×';
    remove.addEventListener('click',()=>{
      members.forEach(o=>delete o.groupId);
      layerGroups=layerGroups.filter(g=>g.id!==group.id);
      renderLayers()
    });
    groupRow.append(eye,lock,name,remove);host.appendChild(groupRow);
    if(!group.collapsed)[...members].reverse().forEach(o=>host.appendChild(makeObjectRow(o)))
  });

  [...objects].reverse().filter(o=>!groupedIds.has(o.id)).forEach(o=>host.appendChild(makeObjectRow(o)))
}

function createLayerGroup(){
  const name=prompt('Layer group name:','Rig group');
  if(!name||!name.trim())return;
  const group={id:'group-'+groupSeq++,name:name.trim(),collapsed:false};
  layerGroups.push(group);
  if(selected)selected.groupId=group.id;
  renderLayers();
  q('sr3EnvStatus').textContent=selected
    ?`Created "${group.name}" and added ${selected.name}.`
    :`Created empty group "${group.name}". Add an object by selecting it, then press + Group and choose the existing group in the inspector in a future pass.`
}

function renderLibrary(filter=''){
  const box=q('sr3Equipment');box.innerHTML='';const term=filter.trim().toLowerCase();
  SIMPLE_RIG_LIBRARY.forEach((category,index)=>{
    const items=category.assets.filter(a=>!term||a.name.toLowerCase().includes(term)||category.name.toLowerCase().includes(term));
    if(!items.length)return;
    const details=document.createElement('details');details.className='sr3-folder';details.open=index<2||category.id==='people'||!!term;
    const summary=document.createElement('summary');summary.innerHTML=`<span>${category.name}</span><small>${items.length}</small>`;
    const grid=document.createElement('div');grid.className='sr3-folder-grid';
    items.forEach(a=>{const b=document.createElement('button');b.type='button';b.className='sr3-library-item';b.innerHTML=`<img src="${a.icon}" alt=""><span>${a.name}</span>`;b.addEventListener('click',()=>add(a.id));grid.appendChild(b)});
    details.append(summary,grid);box.appendChild(details)
  })
}
function hitObject(x,y){
  let best=null,bestD=54;
  objects.forEach(o=>{if(o.hidden)return;const p=project({x:o.x,y:o.y+.9*o.scale,z:o.z});const d=Math.hypot(x-p.x,y-p.y);if(d<bestD){best=o;bestD=d}});
  return best
}
function pointerPos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
canvas.addEventListener('pointerdown',e=>{const p=pointerPos(e),hit=hitObject(p.x,p.y);drag={x:p.x,y:p.y,yaw:camera.yaw,pitch:camera.pitch,object:hit,startX:hit?.x,startY:hit?.y,startZ:hit?.z,startRX:hit?.rx||0,startRY:hit?.ry||0,startScale:hit?.scale||1,objectStarts:objects.map(o=>({o,x:o.x,y:o.y,z:o.z}))};if(hit)select(hit);canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{
  if(!drag)return;const p=pointerPos(e),dx=p.x-drag.x,dy=p.y-drag.y;
  if(drag.object&&!drag.object.locked){
    if(tool==='rotate'){drag.object.ry=drag.startRY+dx*.8;drag.object.rx=drag.startRX-dy*.55}
    else if(tool==='scale'){drag.object.scale=Math.max(.1,drag.startScale+(dx-dy)*.008)}
    else{
      drag.object.x=drag.startX+dx*.018;drag.object.z=drag.startZ+dy*.018;
      if(window.SimpleRigLive?.isLive()){
        const role=inferOperatingRole(drag.object);
        const parts=Math.max(1,Number(drag.object.supportingParts)||suggestedSupportingParts(drag.object,role));
        if(role==='movingPulley'||(drag.object.kind||'').toLowerCase().includes('pulley')){
          const deltaX=drag.object.x-drag.startX,deltaZ=drag.object.z-drag.startZ;
          drag.objectStarts.forEach(start=>{
            if(start.o===drag.object)return;
            const linkedRole=inferOperatingRole(start.o);
            if(linkedRole==='load'){
              start.o.x=start.x-deltaX/parts;
              start.o.z=start.z-deltaZ/parts;
            }else if(linkedRole==='movingPulley'){
              start.o.x=start.x-deltaX/(parts*2);
              start.o.z=start.z-deltaZ/(parts*2);
            }
          });
          q('sr3EnvStatus').textContent='LIVE: pulley movement is propagating through the connected-system preview.';
        }
      }
    }
    syncUI();renderLayers()
  }else{camera.yaw=drag.yaw-dx*.007;camera.pitch=Math.max(-1.25,Math.min(1.25,drag.pitch-dy*.006))}
  draw()
});
canvas.addEventListener('pointerup',()=>drag=null);
canvas.addEventListener('wheel',e=>{e.preventDefault();camera.distance=Math.max(4,Math.min(35,camera.distance+e.deltaY*.012));draw()},{passive:false});

function init(){
  if(started)return;started=true;renderLibrary();bind();add('performer');objects[0].name='Performer';select(objects[0]);q('sr3EnvStatus').textContent='3D workspace ready — performer added automatically.';resize()
}
function showMode(modeName){
  const is3=modeName==='3d';workspace2d.classList.toggle('hidden-workspace',is3);workspace3d.classList.toggle('active',is3);b2.classList.toggle('active',!is3);b3.classList.toggle('active',is3);
  if(is3)requestAnimationFrame(()=>{init();resize()})
}
function bind(){
  q('sr3LibrarySearch').addEventListener('input',e=>renderLibrary(e.target.value));

  q('sr3Operating').addEventListener('change',e=>{if(selected)setOperatingObject(selected,e.target.checked)});
  q('sr3OperatingRole').addEventListener('change',e=>{if(!selected)return;selected.operatingRole=e.target.value;selected.supportingParts=suggestedSupportingParts(selected,inferOperatingRole(selected));q('sr3SupportingParts').value=selected.supportingParts;analyseOperatingPoint();renderLayers();draw()});
  q('sr3SupportingParts').addEventListener('input',e=>{if(!selected)return;selected.supportingParts=Math.max(.1,Number(e.target.value)||1);analyseOperatingPoint();draw()});
  q('sr3PullDirection').addEventListener('change',e=>{if(!selected)return;selected.pullDirection=e.target.value;analyseOperatingPoint();draw()});

  q('show3dNames').addEventListener('change',e=>{showNames=e.target.checked;draw()});
  document.querySelectorAll('[data-sr3-tool]').forEach(b=>b.addEventListener('click',()=>{tool=b.dataset.sr3Tool;mode=tool==='rotate'?'rotation':tool==='scale'?'scale':'position';document.querySelectorAll('[data-sr3-tool]').forEach(x=>x.classList.toggle('active',x===b));syncSliders()}));
  document.querySelectorAll('[data-sr3-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.sr3Mode;document.querySelectorAll('[data-sr3-mode]').forEach(x=>x.classList.toggle('active',x===b));syncSliders()}));
  document.querySelectorAll('[data-sr3-snap]').forEach(b=>b.addEventListener('click',()=>{snap=Number(b.dataset.sr3Snap);document.querySelectorAll('[data-sr3-snap]').forEach(x=>x.classList.toggle('active',x===b))}));
  ['X','Y','Z'].forEach((k,i)=>q('sr3'+k).addEventListener('input',e=>{if(!selected||selected.locked)return;let v=Number(e.target.value);if(snap)v=Math.round(v/snap)*snap;if(mode==='position')selected[['x','y','z'][i]]=v;else if(mode==='rotation')selected[['rx','ry','rz'][i]]=v;else selected.scale=v;syncUI();draw()}));
  q('sr3Duplicate').addEventListener('click',()=>{if(!selected)return;const old=selected,n=add(old.kind);Object.assign(n,{x:old.x+.4,y:old.y,z:old.z+.4,scale:old.scale,name:old.name+' copy'});select(n)});
  q('sr3Delete').addEventListener('click',()=>{if(!selected)return;objects=objects.filter(o=>o!==selected);select(null);renderLayers()});
  q('sr3Hide').addEventListener('click',()=>{if(selected){selected.hidden=!selected.hidden;renderLayers();draw()}});
  q('sr3Lock').addEventListener('click',()=>{if(selected){selected.locked=!selected.locked;renderLayers()}});
  document.querySelectorAll('[data-sr3-view]').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.sr3View;if(v==='top'){camera.yaw=0;camera.pitch=1.25}else if(v==='front'){camera.yaw=0;camera.pitch=0}else if(v==='right'){camera.yaw=-Math.PI/2;camera.pitch=0}else{camera.yaw=-.7;camera.pitch=.42}draw()}));
  ['sr3Name','sr3Model','sr3Wll','sr3Mbs'].forEach(id=>q(id).addEventListener('input',e=>{if(!selected)return;const key={sr3Name:'name',sr3Model:'model',sr3Wll:'wll',sr3Mbs:'mbs'}[id];selected[key]=e.target.value;renderLayers();draw()}));
  ['sr3PX','sr3PY','sr3PZ'].forEach((id,i)=>q(id).addEventListener('input',e=>{if(!selected||selected.locked)return;selected[['x','y','z'][i]]=Number(e.target.value)||0;syncSliders();draw()}));
  ['sr3Load','sr3Ratio','sr3Efficiency'].forEach(id=>q(id).addEventListener('input',()=>{const l=Number(q('sr3Load').value)||0,r=Math.max(1,Number(q('sr3Ratio').value)||1),ef=Math.max(1,Number(q('sr3Efficiency').value)||100)/100;q('sr3Pull').textContent=(l/(r*ef)).toFixed(1)+' kg';analyseOperatingPoint()}));
  q('sr3Scan').addEventListener('click',()=>q('sr3ScanDialog').showModal());
  q('sr3CloseScan').addEventListener('click',()=>q('sr3ScanDialog').close());
  q('sr3EnvironmentFile').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{await import3DFile(file)}catch(error){console.error(error);q('sr3EnvStatus').textContent='Import failed: '+error.message}
    e.target.value=''
  });
  const dropZone=q('sr3DropZone');
  ['dragenter','dragover'].forEach(type=>dropZone.addEventListener(type,e=>{e.preventDefault();dropZone.classList.add('dragover')}));
  ['dragleave','drop'].forEach(type=>dropZone.addEventListener(type,e=>{e.preventDefault();dropZone.classList.remove('dragover')}));
  dropZone.addEventListener('drop',async e=>{
    const file=e.dataTransfer.files[0];if(!file)return;
    try{await import3DFile(file)}catch(error){console.error(error);q('sr3EnvStatus').textContent='Import failed: '+error.message}
  });
  document.querySelectorAll('[data-ground-preset]').forEach(button=>button.addEventListener('click',()=>{
    groundPreset=button.dataset.groundPreset;
    q('sr3EnvStatus').textContent=groundPreset==='none'?'Ground texture removed.':button.textContent+' ground added.';
    draw()
  }));
  q('sr3Opacity').addEventListener('input',draw);
  q('sr3EnvMode').addEventListener('change',draw);
  q('sr3EnvHide').addEventListener('click',()=>{objects.filter(o=>o.kind==='imported_mesh').forEach(o=>o.hidden=!o.hidden);renderLayers();draw()});
  q('sr3EnvGround').addEventListener('click',()=>{objects.filter(o=>o.kind==='imported_mesh').forEach(o=>o.y=0);syncUI();draw()});q('sr3AddGroup')?.addEventListener('click',createLayerGroup);
}
b2.addEventListener('click',()=>showMode('2d'));b3.addEventListener('click',()=>showMode('3d'));
window.addEventListener('resize',()=>{if(workspace3d.classList.contains('active'))resize()},{passive:true});

window.SimpleRig3D={
  captureDataURL(){draw();return canvas.toDataURL('image/jpeg',.94)},
  getState(){return {objects:JSON.parse(JSON.stringify(objects)),camera:{...camera},showNames,layerGroups:JSON.parse(JSON.stringify(layerGroups)),groupSeq,groundPreset}},

  getOperating(){return objects.find(o=>o.operating)||null},
  simulate(forceKn,duration){
    const op=objects.find(o=>o.operating);
    if(!op)return {ok:false,message:'No 3D operating point is marked.'};
    const role=inferOperatingRole(op);
    const parts=Math.max(.1,Number(op.supportingParts)||suggestedSupportingParts(op,role));
    const ratio=Math.max(.1,Number(q('sr3Ratio').value)||1);
    const efficiency=Math.max(.01,(Number(q('sr3Efficiency').value)||100)/100);
    const effective=(role==='fixedPulley'||role==='anchor')?1:(role==='haul'||role==='winch'?ratio:parts);
    const forceN=forceKn*1000;
    const outputN=forceN*effective*efficiency;
    const loadKg=Math.max(.1,Number(q('sr3Load').value)||100);
    const loadN=loadKg*9.80665;
    const acceleration=(outputN-loadN)/loadKg;
    const distance=Math.max(-3,Math.min(3,.5*acceleration*duration*duration));
    const moving=objects.filter(o=>inferOperatingRole(o)==='load'||inferOperatingRole(o)==='movingPulley'||o===op);
    moving.forEach(o=>{o.y=Math.max(0,o.y+distance)});
    op.simForceKn=forceKn;op.simActive=true;
    syncUI();renderLayers();draw();
    return {ok:true,effective,outputN,loadN,acceleration,distance,affected:moving.map(o=>o.name),message:`${forceKn.toFixed(2)} kN applied. Estimated output ${(outputN/1000).toFixed(2)} kN; movement ${Math.abs(distance).toFixed(2)} m preview.`}
  },

  setState(state){
    if(!state)return;
    objects=Array.isArray(state.objects)?JSON.parse(JSON.stringify(state.objects)):[];objects.forEach(o=>{if(o.operating===undefined)o.operating=false;if(!o.operatingRole)o.operatingRole='auto';if(!o.supportingParts)o.supportingParts=1;if(!o.pullDirection)o.pullDirection='haul'});
    camera={...camera,...(state.camera||{})};
    showNames=!!state.showNames;groundPreset=state.groundPreset||'none';layerGroups=Array.isArray(state.layerGroups)?JSON.parse(JSON.stringify(state.layerGroups)):[];groupSeq=Math.max(1,Number(state.groupSeq)||1);
    const toggle=q('show3dNames');if(toggle)toggle.checked=showNames;
    selected=objects[0]||null;seq=Math.max(1,...objects.map(o=>Number(String(o.id||'').replace(/\D/g,''))||0))+1;
    syncUI();renderLayers();draw();
  },
  isActive(){return workspace3d.classList.contains('active')},
  ensureReady(){init();resize();draw()},
  draw
};

})();
