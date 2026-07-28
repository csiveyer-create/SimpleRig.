import assert from "node:assert/strict";
import{createObject,createProject,cloneProject,validateProject}from"../src/model.js";
const p=createObject("pulley",{x:1,y:2,z:3});
assert.equal(p.type,"pulley");assert.deepEqual(p.position,{x:1,y:2,z:3});
const project=createProject();assert.equal(project.version,2);assert.ok(project.objects.length>=2);assert.ok(Array.isArray(project.sketch.strokes));assert.equal(validateProject(project),true);
const clone=cloneProject(project);clone.objects[0].position.x=99;assert.notEqual(project.objects[0].position.x,99);
assert.throws(()=>createObject("invalid"));assert.throws(()=>validateProject({objects:[{id:"x",type:"invalid",position:{x:0,y:0,z:0}}]}));assert.throws(()=>validateProject({objects:[],sketch:{strokes:"bad"}}));
console.log("Model tests passed.");

import { recogniseStroke, recogniseRecentStrokes } from "../src/recognition.js";

const lineStroke = {
  id: "line",
  view: "2d",
  points: [
    {x:0,y:0,z:0},{x:.5,y:.01,z:0},{x:1,y:0,z:0},{x:1.5,y:-.01,z:0},{x:2,y:0,z:0}
  ]
};
const lineRecognition = recogniseStroke(lineStroke);
assert.equal(lineRecognition.type, "rigLine");
assert.ok(lineRecognition.confidence >= 80);

const circlePoints = [];
for (let i = 0; i <= 32; i++) {
  const a = (Math.PI * 2 * i) / 32;
  circlePoints.push({x:Math.cos(a), y:Math.sin(a), z:0});
}
const circleRecognition = recogniseStroke({id:"circle",view:"2d",points:circlePoints});
assert.equal(circleRecognition.type, "pulley");
assert.ok(circleRecognition.confidence >= 65);

const circle2 = circlePoints.map(p => ({x:p.x + 1.5,y:p.y,z:0}));
const doubleRecognition = recogniseRecentStrokes([
  {id:"c1",view:"2d",points:circlePoints},
  {id:"c2",view:"2d",points:circle2}
]);
assert.equal(doubleRecognition.type, "doublePulley");
console.log("Recognition tests passed.");
