export function snapValue(value, increment=0.25){
  if(!increment) return value;
  const result=Math.round(value/increment)*increment;
  return Object.is(result,-0)?0:result;
}
export function snapPoint(point, increment=0.25){
  return {x:snapValue(point.x,increment),y:snapValue(point.y,increment),z:snapValue(point.z,increment)};
}
export function angleDegrees(a,b){return Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI}
export function distance2D(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
export function scaleFromDrag(origin,start,current,startScale){
  const base=Math.max(.001,distance2D(origin,start));
  return Math.max(.2,Math.min(5,startScale*(distance2D(origin,current)/base)));
}
