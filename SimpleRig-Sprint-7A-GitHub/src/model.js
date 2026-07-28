export const OBJECT_DEFAULTS = {
  pulley:{label:"Pulley",scale:1,colour:"#d9dde3"},
  doublePulley:{label:"Double Pulley",scale:1,colour:"#d9dde3"},
  performer:{label:"Performer",scale:1,colour:"#d9dde3"},
  truss:{label:"Truss",scale:1,colour:"#d9dde3"},
  telehandler:{label:"Telehandler",scale:1,colour:"#d9dde3"},
  rigLine:{label:"Rig Line",scale:1,colour:"#d9dde3"}
};

export function createObject(type, position={x:0,y:0,z:0}) {
  const d=OBJECT_DEFAULTS[type];
  if(!d) throw new Error(`Unknown object type: ${type}`);
  return {
    id:globalThis.crypto?.randomUUID?.()||`obj-${Date.now()}-${Math.random()}`,
    type,label:d.label,
    position:{x:position.x??0,y:position.y??0,z:position.z??0},
    rotation:0,scale:d.scale,colour:d.colour,
    ...(type==="rigLine"?{end:{x:position.x+1,y:position.y,z:position.z}}:{})
  };
}

export function createProject(){
  return {
    version:2,
    meta:{projectName:"Untitled Rig",gagName:""},
    objects:[
      {...createObject("performer",{x:0,y:0,z:0}),label:"Performer 1"},
      {...createObject("truss",{x:0,y:3,z:2.5}),label:"Truss 1"}
    ],
    sketch:{strokes:[]}
  };
}

export function cloneProject(value){return JSON.parse(JSON.stringify(value));}

export function validateProject(data){
  if(!data||typeof data!=="object") throw new Error("Project file is not an object.");
  if(!Array.isArray(data.objects)) throw new Error("Project is missing an objects array.");
  if(data.sketch && !Array.isArray(data.sketch.strokes)) throw new Error("Project sketch layer is invalid.");
  const valid=new Set(Object.keys(OBJECT_DEFAULTS));
  for(const obj of data.objects){
    if(!obj.id||!valid.has(obj.type)) throw new Error("Project contains an invalid object.");
    for(const axis of ["x","y","z"]){
      if(!Number.isFinite(Number(obj.position?.[axis]))) throw new Error(`Invalid ${axis} position.`);
    }
  }
  return true;
}
