const TAU=Math.PI*2;
export class Renderer{
  constructor(canvas,callbacks){
    this.canvas=canvas;this.ctx=canvas.getContext("2d");this.callbacks=callbacks;
    this.view="2d";this.mode="select";this.project=null;this.selectedId=null;
    this.camera2d={x:0,y:0,zoom:70};this.camera3d={yaw:-.65,pitch:.55,distance:12,panX:0,panY:0};
    this.pointer={down:false,x:0,y:0,mode:null};this.activePointers=new Map();this.lastPinchDistance=null;
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);
    this.bind();this.resize();
  }
  setProject(p){this.project=p;this.draw()} setSelection(id){this.selectedId=id;this.draw()}
  setMode(mode){this.mode=mode;this.pointer.mode=null;this.draw()} setView(view){this.view=view;this.pointer.mode=null;this.draw()}
  resize(){const r=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.max(1,Math.round(r.width*d));this.canvas.height=Math.max(1,Math.round(r.height*d));this.ctx.setTransform(d,0,0,d,0,0);this.width=r.width;this.height=r.height;this.draw()}
  bind(){this.canvas.addEventListener("pointerdown",e=>this.down(e));this.canvas.addEventListener("pointermove",e=>this.move(e));this.canvas.addEventListener("pointerup",e=>this.up(e));this.canvas.addEventListener("pointercancel",e=>this.up(e));this.canvas.addEventListener("wheel",e=>this.wheel(e),{passive:false});this.canvas.addEventListener("contextmenu",e=>e.preventDefault())}
  local(e){const r=this.canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  down(e){
    this.canvas.setPointerCapture(e.pointerId);this.activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(this.activePointers.size===2){this.lastPinchDistance=this.pinchDistance();return}
    const p=this.local(e);this.pointer={down:true,x:p.x,y:p.y,mode:null,startCamera:null,startObject:null,objectId:null,stroke:null};
    if(this.view!=="3d"&&this.mode==="sketch"){
      const w=this.screenToWorld(p.x,p.y);const stroke={id:globalThis.crypto?.randomUUID?.()||`stroke-${Date.now()}`,view:this.view,points:[w],width:Math.max(1.5,Math.min(6,(e.pressure||.5)*5))};
      this.pointer.mode="sketch";this.pointer.stroke=stroke;this.callbacks.beginSketch(stroke);return;
    }
    if(this.view!=="3d"){
      const hit=this.hit(p.x,p.y);
      if(hit){this.pointer.mode="move-object";this.pointer.objectId=hit.id;this.pointer.startObject={...hit.position};this.callbacks.select(hit.id)}
      else{this.pointer.mode="pan-2d";this.pointer.startCamera={...this.camera2d};this.callbacks.select(null)}
    }else{this.pointer.mode=e.shiftKey||e.button===1?"pan-3d":"orbit";this.pointer.startCamera={...this.camera3d}}
  }
  move(e){
    if(this.activePointers.has(e.pointerId))this.activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(this.activePointers.size===2){const d=this.pinchDistance();if(this.lastPinchDistance&&d>0){const ratio=d/this.lastPinchDistance;if(this.view==="3d")this.camera3d.distance=Math.max(3,Math.min(50,this.camera3d.distance/ratio));else this.camera2d.zoom=Math.max(20,Math.min(250,this.camera2d.zoom*ratio));this.lastPinchDistance=d;this.draw()}return}
    if(!this.pointer.down)return;const p=this.local(e),dx=p.x-this.pointer.x,dy=p.y-this.pointer.y;
    if(this.pointer.mode==="sketch"){
      const w=this.screenToWorld(p.x,p.y),pts=this.pointer.stroke.points,last=pts[pts.length-1];
      if(!last||Math.hypot(w.x-last.x,w.y-last.y,w.z-last.z)>.03){pts.push(w);this.callbacks.previewSketch(this.pointer.stroke)}
    }else if(this.pointer.mode==="move-object"){this.callbacks.previewMove(this.pointer.objectId,this.pointer.startObject,this.deltaWorld(dx,dy))}
    else if(this.pointer.mode==="pan-2d"){this.camera2d.x=this.pointer.startCamera.x+dx;this.camera2d.y=this.pointer.startCamera.y+dy;this.draw()}
    else if(this.pointer.mode==="orbit"){this.camera3d.yaw=this.pointer.startCamera.yaw+dx*.008;this.camera3d.pitch=Math.max(-1.25,Math.min(1.25,this.pointer.startCamera.pitch+dy*.008));this.draw()}
    else if(this.pointer.mode==="pan-3d"){this.camera3d.panX=this.pointer.startCamera.panX+dx;this.camera3d.panY=this.pointer.startCamera.panY+dy;this.draw()}
  }
  up(e){this.activePointers.delete(e.pointerId);if(this.activePointers.size<2)this.lastPinchDistance=null;if(!this.pointer.down)return;if(this.pointer.mode==="move-object")this.callbacks.commitPreview();if(this.pointer.mode==="sketch")this.callbacks.commitSketch(this.pointer.stroke);this.pointer.down=false}
  wheel(e){e.preventDefault();const f=Math.exp(-e.deltaY*.0012);if(this.view==="3d")this.camera3d.distance=Math.max(3,Math.min(50,this.camera3d.distance/f));else this.camera2d.zoom=Math.max(20,Math.min(250,this.camera2d.zoom*f));this.draw()}
  pinchDistance(){const p=[...this.activePointers.values()];return p.length<2?0:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)}
  screenToWorld(x,y){const z=this.camera2d.zoom,cx=this.width/2+this.camera2d.x,cy=this.height/2+this.camera2d.y;if(this.view==="front")return{x:(x-cx)/z,y:0,z:-(y-cy)/z};if(this.view==="left")return{x:0,y:(x-cx)/z,z:-(y-cy)/z};return{x:(x-cx)/z,y:-(y-cy)/z,z:0}}
  deltaWorld(dx,dy){const z=this.camera2d.zoom;if(this.view==="front")return{x:dx/z,y:0,z:-dy/z};if(this.view==="left")return{x:0,y:dx/z,z:-dy/z};return{x:dx/z,y:-dy/z,z:0}}
  project2D(p){const z=this.camera2d.zoom;if(this.view==="front")return{x:this.width/2+this.camera2d.x+p.x*z,y:this.height/2+this.camera2d.y-p.z*z};if(this.view==="left")return{x:this.width/2+this.camera2d.x+p.y*z,y:this.height/2+this.camera2d.y-p.z*z};return{x:this.width/2+this.camera2d.x+p.x*z,y:this.height/2+this.camera2d.y-p.y*z}}
  project3D(p){const cy=Math.cos(this.camera3d.yaw),sy=Math.sin(this.camera3d.yaw),cp=Math.cos(this.camera3d.pitch),sp=Math.sin(this.camera3d.pitch),x1=p.x*cy-p.y*sy,y1=p.x*sy+p.y*cy,depth=y1*cp+p.z*sp,vertical=-y1*sp+p.z*cp,k=560/Math.max(2.2,this.camera3d.distance-depth);return{x:this.width/2+this.camera3d.panX+x1*k,y:this.height/2+this.camera3d.panY-vertical*k,scale:k/70,depth}}
  hit(x,y){if(!this.project)return null;for(let i=this.project.objects.length-1;i>=0;i--){const o=this.project.objects[i],p=this.project2D(o.position),r=Math.max(18,(o.type==="truss"?45:o.type==="telehandler"?38:24)*o.scale);if(Math.hypot(x-p.x,y-p.y)<=r)return o}return null}
  draw(){if(!this.ctx||!this.width||!this.height)return;const c=this.ctx;c.clearRect(0,0,this.width,this.height);c.fillStyle="#11151a";c.fillRect(0,0,this.width,this.height);this.view==="3d"?this.draw3D():this.draw2D()}
  draw2D(){this.grid2D();if(!this.project)return;this.drawSketch();for(const o of this.project.objects){const p=this.project2D(o.position);this.symbol(o,p.x,p.y,o.scale,o.rotation)}}
  grid2D(){const c=this.ctx,s=this.camera2d.zoom,ox=((this.width/2+this.camera2d.x)%s+s)%s,oy=((this.height/2+this.camera2d.y)%s+s)%s;c.lineWidth=1;c.strokeStyle="#20262d";c.beginPath();for(let x=ox;x<this.width;x+=s){c.moveTo(x,0);c.lineTo(x,this.height)}for(let y=oy;y<this.height;y+=s){c.moveTo(0,y);c.lineTo(this.width,y)}c.stroke();c.strokeStyle="#39424c";c.beginPath();c.moveTo(0,this.height/2+this.camera2d.y);c.lineTo(this.width,this.height/2+this.camera2d.y);c.moveTo(this.width/2+this.camera2d.x,0);c.lineTo(this.width/2+this.camera2d.x,this.height);c.stroke()}
  drawSketch(){const c=this.ctx;c.save();c.lineCap="round";c.lineJoin="round";for(const s of this.project?.sketch?.strokes||[]){if(s.view!==this.view||!s.points?.length)continue;c.strokeStyle="#f4f6f8";c.lineWidth=s.width||2.5;c.beginPath();s.points.forEach((pt,i)=>{const p=this.project2D(pt);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y)});c.stroke()}c.restore()}
  draw3D(){this.ground();if(!this.project)return;const items=this.project.objects.map(o=>({o,p:this.project3D(o.position)})).sort((a,b)=>a.p.depth-b.p.depth);for(const i of items)this.symbol(i.o,i.p.x,i.p.y,Math.max(.35,i.o.scale*i.p.scale),i.o.rotation)}
  ground(){const c=this.ctx;c.strokeStyle="#26303a";c.lineWidth=1;for(let i=-10;i<=10;i++){let a=this.project3D({x:i,y:-10,z:0}),b=this.project3D({x:i,y:10,z:0});c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();a=this.project3D({x:-10,y:i,z:0});b=this.project3D({x:10,y:i,z:0});c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()}}
  symbol(o,x,y,scale,rot){const c=this.ctx,sel=o.id===this.selectedId;c.save();c.translate(x,y);c.rotate(rot*Math.PI/180);c.scale(scale,scale);c.strokeStyle=sel?"#fff":o.colour;c.fillStyle="#161b21";c.lineWidth=sel?3:2;
    if(o.type==="pulley"){c.beginPath();c.arc(0,0,16,0,TAU);c.fill();c.stroke();c.beginPath();c.arc(0,0,5,0,TAU);c.stroke()}
    else if(o.type==="doublePulley"){for(const dx of[-10,10]){c.beginPath();c.arc(dx,0,13,0,TAU);c.fill();c.stroke()}}
    else if(o.type==="performer"){c.beginPath();c.arc(0,-17,6,0,TAU);c.stroke();c.beginPath();c.moveTo(0,-11);c.lineTo(0,10);c.moveTo(-11,-3);c.lineTo(11,-3);c.moveTo(0,10);c.lineTo(-8,22);c.moveTo(0,10);c.lineTo(8,22);c.stroke()}
    else if(o.type==="truss"){c.strokeRect(-38,-10,76,20);c.beginPath();for(let i=-38;i<38;i+=19){c.moveTo(i,-10);c.lineTo(i+19,10);c.moveTo(i,10);c.lineTo(i+19,-10)}c.stroke()}
    else if(o.type==="telehandler"){c.strokeRect(-27,-12,34,20);c.beginPath();c.arc(-18,12,7,0,TAU);c.arc(10,12,7,0,TAU);c.stroke();c.beginPath();c.moveTo(3,-8);c.lineTo(30,-29);c.lineTo(37,-29);c.stroke()}
    c.restore();c.fillStyle=sel?"#fff":"#aeb6c0";c.font="12px system-ui";c.textAlign="center";c.fillText(o.label,x,y+36*Math.max(.7,scale))}
}
