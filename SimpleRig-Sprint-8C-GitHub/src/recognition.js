const D=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0));
const F=(p,v)=>v==="front"?{x:p.x,y:p.z}:v==="left"?{x:p.y,y:p.z}:{x:p.x,y:p.y};
function B(ps){const xs=ps.map(p=>p.x),ys=ps.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);return{minX,maxX,minY,maxY,width:Math.max(.0001,maxX-minX),height:Math.max(.0001,maxY-minY),centre:{x:(minX+maxX)/2,y:(minY+maxY)/2}}}
function L(ps){let n=0;for(let i=1;i<ps.length;i++)n+=D(ps[i-1],ps[i]);return n}
function PLine(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,q=dx*dx+dy*dy;if(!q)return D(p,a);const t=((p.x-a.x)*dx+(p.y-a.y)*dy)/q;return Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy))}
function LS(ps){if(ps.length<2)return 0;const direct=D(ps[0],ps.at(-1)),travel=L(ps);if(!travel)return 0;const b=B(ps),diag=Math.hypot(b.width,b.height),dev=Math.max(...ps.map(p=>PLine(p,ps[0],ps.at(-1))));return Math.max(0,Math.min(1,(direct/travel)*.72+(diag?Math.max(0,1-dev/(diag*.22)):0)*.28))}
function CS(ps){if(ps.length<8)return 0;const b=B(ps),c=b.centre,rs=ps.map(p=>Math.hypot(p.x-c.x,p.y-c.y)),m=rs.reduce((a,v)=>a+v,0)/rs.length;if(!m)return 0;const sd=Math.sqrt(rs.reduce((a,v)=>a+(v-m)**2,0)/rs.length),rad=Math.max(0,1-sd/(m*.48)),close=Math.max(0,1-D(ps[0],ps.at(-1))/(m*1.25)),aspect=Math.min(b.width,b.height)/Math.max(b.width,b.height);return Math.max(0,Math.min(1,rad*.42+close*.38+aspect*.2))}
function RS(ps){if(ps.length<5)return 0;const b=B(ps),close=Math.max(0,1-D(ps[0],ps.at(-1))/Math.max(b.width,b.height)),per=2*(b.width+b.height),fit=Math.max(0,1-Math.abs(L(ps)-per)/per);return Math.max(0,Math.min(1,close*.6+fit*.4))}
function pts(s){return s.points.map(p=>F(p,s.view))}
function gb(ss){return B(ss.flatMap(pts))}
function angle(s){const p=pts(s);return Math.atan2(p.at(-1).y-p[0].y,p.at(-1).x-p[0].x)}
function centre(s){return B(pts(s)).centre}
function ends(s){const p=pts(s);return[p[0],p.at(-1)]}
function minEnd(a,b){return Math.min(...ends(a).flatMap(x=>ends(b).map(y=>D(x,y))))}
function isLine(s,t=.68){return LS(pts(s))>=t}
function isCircle(s,t=.55){return CS(pts(s))>=t}
function isRect(s,t=.5){return RS(pts(s))>=t}

function single(s){
  if(!s?.points||s.points.length<2)return null;
  const p=pts(s),b=B(p); if(Math.max(b.width,b.height)<.12)return null;
  const cand=[
    {type:"rigLine",label:"Rig line",confidence:LS(p),detail:"Single straight stroke"},
    {type:"pulley",label:"Pulley",confidence:CS(p),detail:"Closed circular stroke"},
    {type:"winch",label:"Winch",confidence:RS(p),detail:"Closed rectangular stroke"}
  ].sort((a,b)=>b.confidence-a.confidence)[0];
  if(cand.confidence<.58)return null;
  return{...cand,confidence:Math.round(cand.confidence*100),strokeId:s.id,strokeIds:[s.id],view:s.view,bounds:b}
}
function telehandler(ss){
  const recent=ss.slice(-9),rects=recent.filter(s=>isRect(s,.48)),circles=recent.filter(s=>isCircle(s,.5)),lines=recent.filter(s=>isLine(s,.62));
  if(!rects.length||circles.length<2||!lines.length)return null;
  const body=[...rects].sort((a,b)=>{const ba=gb([a]),bb=gb([b]);return (bb.width*bb.height)-(ba.width*ba.height)})[0],bb=gb([body]);
  const wheels=circles.filter(s=>{const c=centre(s),r=Math.max(gb([s]).width,gb([s]).height);return c.y<bb.centre.y&&c.x>bb.minX-r&&c.x<bb.maxX+r}).slice(-2);
  const boom=lines.filter(s=>{
    const a=Math.abs(angle(s)),ep=ends(s);
    const nearBody=ep.some(p=>p.x>=bb.minX-bb.width*.2&&p.x<=bb.maxX+bb.width*.2&&p.y>=bb.minY-bb.height*.2&&p.y<=bb.maxY+bb.height*.5);
    return a>.25&&a<1.45&&nearBody;
  }).slice(-1);
  if(wheels.length===2&&boom.length===1){const g=[body,...wheels,boom[0]];return{type:"telehandler",label:"Telehandler",confidence:88,detail:"Body, two wheels and raised boom",strokeIds:g.map(s=>s.id),view:body.view,bounds:gb(g)}}
  return null
}
function performer(ss){
  const recent=ss.slice(-7),circles=recent.filter(s=>isCircle(s,.5)),lines=recent.filter(s=>isLine(s,.62));
  if(!circles.length||lines.length<3)return null;
  const head=circles.at(-1),hb=gb([head]),connected=lines.filter(s=>minEnd(s,head)<Math.max(hb.width,hb.height)*2.2);
  const vertical=connected.some(s=>Math.abs(Math.sin(angle(s)))>.72);
  const diagonal=connected.filter(s=>Math.abs(Math.sin(angle(s)))>.22&&Math.abs(Math.cos(angle(s)))>.22);
  if(connected.length>=3&&vertical&&diagonal.length>=2){const g=[head,...connected.slice(-5)];return{type:"performer",label:"Performer",confidence:83,detail:"Circle head with connected body and limbs",strokeIds:g.map(s=>s.id),view:head.view,bounds:gb(g)}}
  return null
}
function truss(ss){
  const lines=ss.slice(-10).filter(s=>isLine(s,.62));if(lines.length<4)return null;
  const horizontal=lines.filter(s=>Math.abs(Math.sin(angle(s)))<.32),diagonal=lines.filter(s=>Math.abs(Math.sin(angle(s)))>.32&&Math.abs(Math.cos(angle(s)))>.32);
  if(horizontal.length>=2&&diagonal.length>=2){const g=[...horizontal.slice(-2),...diagonal.slice(-6)],b=gb(g);if(b.width>b.height*1.45)return{type:"truss",label:"Truss",confidence:86,detail:"Parallel rails with diagonal bracing",strokeIds:g.map(s=>s.id),view:g[0].view,bounds:b}}
  return null
}
function doublePulley(ss){
  const c=ss.slice(-4).filter(s=>isCircle(s,.58));if(c.length<2)return null;
  const a=c.at(-2),b=c.at(-1),ba=gb([a]),bb=gb([b]),sep=D(ba.centre,bb.centre),ra=Math.max(ba.width,ba.height)/2,rb=Math.max(bb.width,bb.height)/2;
  if(sep<(ra+rb)*1.9&&sep>Math.min(ra,rb)*.15)return{type:"doublePulley",label:"Double pulley",confidence:90,detail:"Two nearby circular strokes",strokeIds:[a.id,b.id],view:a.view,bounds:gb([a,b])};
  return null
}
export function recogniseStroke(s){return single(s)}
export function recogniseRecentStrokes(strokes,maxCount=10){if(!strokes?.length)return null;const v=strokes.at(-1).view,ss=strokes.filter(s=>s.view===v).slice(-maxCount);return telehandler(ss)||performer(ss)||truss(ss)||doublePulley(ss)||single(ss.at(-1))}
