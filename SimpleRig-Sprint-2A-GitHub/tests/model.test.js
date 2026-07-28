import assert from "node:assert/strict";
import{createObject,createProject,cloneProject,validateProject}from"../src/model.js";
const p=createObject("pulley",{x:1,y:2,z:3});
assert.equal(p.type,"pulley");assert.deepEqual(p.position,{x:1,y:2,z:3});
const project=createProject();assert.equal(project.version,2);assert.ok(project.objects.length>=2);assert.ok(Array.isArray(project.sketch.strokes));assert.equal(validateProject(project),true);
const clone=cloneProject(project);clone.objects[0].position.x=99;assert.notEqual(project.objects[0].position.x,99);
assert.throws(()=>createObject("invalid"));assert.throws(()=>validateProject({objects:[{id:"x",type:"invalid",position:{x:0,y:0,z:0}}]}));assert.throws(()=>validateProject({objects:[],sketch:{strokes:"bad"}}));
console.log("Model tests passed.");
