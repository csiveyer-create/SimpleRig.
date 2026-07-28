import assert from"node:assert/strict";
import{createObject,createProject,cloneProject,validateProject}from"../src/model.js";
import{recogniseStroke,recogniseRecentStrokes}from"../src/recognition.js";
const p=createObject("pulley",{x:1,y:2,z:3});assert.equal(p.type,"pulley");assert.deepEqual(p.position,{x:1,y:2,z:3});
const project=createProject();assert.ok(project.objects.length>=2);assert.ok(Array.isArray(project.sketch.strokes));assert.equal(validateProject(project),true);
const copy=cloneProject(project);copy.objects[0].position.x=99;assert.notEqual(project.objects[0].position.x,99);
assert.throws(()=>createObject("invalid"));assert.throws(()=>validateProject({objects:[],sketch:{strokes:"bad"}}));
function line(id,x1,y1,x2,y2){return{id,view:"2d",points:[{x:x1,y:y1,z:0},{x:(x1+x2)/2,y:(y1+y2)/2,z:0},{x:x2,y:y2,z:0}]}}
function circle(id,cx,cy,r=.35){const a=[];for(let i=0;i<=28;i++){const q=Math.PI*2*i/28;a.push({x:cx+Math.cos(q)*r,y:cy+Math.sin(q)*r,z:0})}return{id,view:"2d",points:a}}
function rect(id,x,y,w,h){return{id,view:"2d",points:[{x,y,z:0},{x:x+w,y,z:0},{x:x+w,y:y+h,z:0},{x,y:y+h,z:0},{x,y,z:0}]}}
assert.equal(recogniseStroke(line("l",0,0,2,0)).type,"rigLine");
assert.equal(recogniseStroke(circle("c",0,0,1)).type,"pulley");
assert.equal(recogniseRecentStrokes([circle("c1",0,0,1),circle("c2",1.5,0,1)]).type,"doublePulley");
assert.equal(recogniseRecentStrokes([circle("h",0,1.6,.25),line("b",0,1.3,0,.3),line("a1",0,1,-.55,.7),line("a2",0,1,.55,.7),line("g1",0,.3,-.45,-.5),line("g2",0,.3,.45,-.5)]).type,"performer");
assert.equal(recogniseRecentStrokes([line("t",-2,.5,2,.5),line("b",-2,-.5,2,-.5),line("d1",-2,-.5,-1,.5),line("d2",-1,.5,0,-.5),line("d3",0,-.5,1,.5),line("d4",1,.5,2,-.5)]).type,"truss");
assert.equal(recogniseRecentStrokes([rect("body",-1,-.2,1.8,.7),circle("w1",-.65,-.45,.22),circle("w2",.45,-.45,.22),line("boom",.55,.35,1.8,1.2)]).type,"telehandler");
console.log("Model and complex recognition tests passed.");
