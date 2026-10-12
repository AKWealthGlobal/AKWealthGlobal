import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

type Surface = 'wood'|'cloth'|'snow'|'foliage'|'gold'|'glass'|'water'|'metal'|'eyes'|'fur'|'tile'|'stone'|'plain';

/** A small, self-contained studio for the miniature city. No network textures are needed. */
export function createCityStudio(scene:THREE.Scene, renderer:THREE.WebGLRenderer){
 const previous={environment:scene.environment,environmentIntensity:scene.environmentIntensity,background:scene.background,fog:scene.fog};
 const studio=new THREE.Group();studio.name='CityStudio';scene.add(studio);
 const textures=new Set<THREE.Texture>(),originals=new Set<THREE.Material>();
 const materialCache=new Map<string,THREE.MeshStandardMaterial>();
 let disposed=false,quality:boolean|undefined;
 const noise=(x:number,y:number)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
 const texture=(paint:(x:number,y:number)=>number, color=false,repeat=1)=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('City studio texture canvas unavailable');
  const image=ctx.createImageData(256,256);
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
   const at=(y*256+x)*4,v=Math.max(0,Math.min(255,Math.round(paint(x,y))));
   image.data[at]=image.data[at+1]=image.data[at+2]=v;image.data[at+3]=255;
  }
  ctx.putImageData(image,0,0);const map=new THREE.CanvasTexture(canvas);
  map.colorSpace=color?THREE.SRGBColorSpace:THREE.NoColorSpace;
  map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(repeat,repeat);
  map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.add(map);return map;
 };
 // Low-contrast colour grain and a separate height map keep the model's authored colours intact.
 const grain=(x:number,y:number)=>Math.sin(y*.48+Math.sin(x*.032)*1.8)+.35*Math.sin(y*1.4+Math.sin(x*.05));
 const woodColor=texture((x,y)=>248+grain(x,y)*3.3,true);
 const woodBump=texture((x,y)=>128+grain(x,y)*15+noise(x,y)*5);
 const knit=texture((x,y)=>128+Math.sin((x+Math.sin(y*.4)*2)*.8)*Math.cos(y*.8)*22, false,3);
 const fine=texture((x,y)=>118+noise(x,y)*20,false,2);

 const room=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer);
 const environment=pmrem.fromScene(room,.035);room.dispose();pmrem.dispose();
 scene.environment=environment.texture;scene.environmentIntensity=.48;
 scene.background=new THREE.Color('#e9dfcf');scene.fog=new THREE.Fog('#e9dfcf',38,78);

 const hemi=new THREE.HemisphereLight('#f7faff','#ad8b68',.3);studio.add(hemi);
 const key=new THREE.DirectionalLight('#fff0d8',1.85);key.position.set(-7,14,8);key.target.position.set(0,.4,0);
 key.castShadow=true;key.shadow.camera.left=-8.5;key.shadow.camera.right=8.5;key.shadow.camera.top=8.5;key.shadow.camera.bottom=-8.5;
 key.shadow.camera.near=1;key.shadow.camera.far=34;key.shadow.normalBias=.018;key.shadow.bias=-.00015;key.shadow.radius=3;
 studio.add(key,key.target);
 const fill=new THREE.DirectionalLight('#d9ecff',.3);fill.position.set(7,6,-6);studio.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:'#e2d5bd',roughness:.95,metalness:0}));
 floor.name='StudioGround';floor.rotation.x=-Math.PI/2;floor.position.y=-.515;floor.receiveShadow=true;studio.add(floor);

 const surface=(object:THREE.Mesh,material:THREE.MeshStandardMaterial,character:boolean):Surface=>{
  const name=object.name.toLowerCase(),mat=material.name.toLowerCase();
  if(character){
   if(/eye highlights|eyes and nose/.test(mat)&&!/smile|relaxedeye/.test(name))return 'eyes';
   if(/backpack|scarf|vest|satchel/.test(mat+' '+name))return 'cloth';
   return 'fur';
  }
  // Classify mesh names first: the GLB intentionally shares colours between unrelated objects.
  if(/goldendome/.test(name))return 'gold';
  if(/centraltransitdome|glasswindow|metrowindows/.test(name))return 'glass';
  if(/frozenpond/.test(name))return 'water';
  if(/domerib|skyrail|railsupport/.test(name))return 'metal';
  if(/shadecanopy/.test(name))return 'cloth';
  if(/tile_/.test(name)||/ivory tiles/.test(mat))return 'tile';
  if(/snow|pinesnow/.test(name+' '+mat))return 'snow';
  if(/treecrown|forestbush|winterpines?|foliage|rainforest green/.test(name+' '+mat))return 'foliage';
  if(/board_base|woodenrim|bridgeplank|librarybridge|treehouselibrary|wintercabin|pinetrunk|rainforesttrunk|marketcounter/.test(name)||/warm wood|tree trunks/.test(mat))return 'wood';
  if(/sands gold|terracotta|slate streets/.test(mat))return 'stone';
  return 'plain';
 };
 const decorate=(root:THREE.Object3D,character=false)=>{
  root.traverse(object=>{
   if(!(object instanceof THREE.Mesh))return;
   object.castShadow=true;object.receiveShadow=true;
   const apply=(source:THREE.Material)=>{
    if(!(source instanceof THREE.MeshStandardMaterial))return source;
    if(source.userData.cityStudioMaterial)return source;
    const category=surface(object,source,character),id=source.uuid+':'+category;
    let material=materialCache.get(id);if(material)return material;
    material=source.clone();material.userData={...source.userData,cityStudioMaterial:true};
    material.metalness=0;material.roughness=.62;material.envMapIntensity=1;
    const canTexture=Boolean(object.geometry.getAttribute('uv'));
    switch(category){
     case 'wood':material.roughness=.72;if(canTexture){material.map=woodColor;material.bumpMap=woodBump;material.bumpScale=.016;}break;
     case 'cloth':material.roughness=.93;if(canTexture){material.bumpMap=knit;material.bumpScale=.006;}break;
     case 'fur':material.roughness=.82;if(canTexture){material.bumpMap=fine;material.bumpScale=.002;}break;
     case 'snow':material.roughness=.86;if(canTexture){material.bumpMap=fine;material.bumpScale=.008;}break;
     case 'foliage':material.roughness=.82;break;
     case 'gold':material.metalness=.65;material.roughness=.29;break;
     case 'glass':material.metalness=.16;material.roughness=.2;material.envMapIntensity=1.15;break;
     case 'water':material.metalness=.12;material.roughness=.23;material.envMapIntensity=1.1;break;
     case 'metal':material.metalness=.48;material.roughness=.32;break;
     case 'eyes':material.roughness=.14;material.envMapIntensity=1.25;break;
     case 'tile':material.roughness=.48;break;
     case 'stone':material.roughness=.83;if(canTexture){material.bumpMap=fine;material.bumpScale=.008;}break;
    }
    originals.add(source);materialCache.set(id,material);return material;
   };
   object.material=Array.isArray(object.material)?object.material.map(apply):apply(object.material);
  });
 };
 const setQuality=(detailed:boolean)=>{
  if(disposed||quality===detailed)return;quality=detailed;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  const size=detailed?2048:1024;key.shadow.mapSize.set(size,size);
  if(key.shadow.map){key.shadow.map.dispose();key.shadow.map=null;}
  if(key.shadow.mapPass){key.shadow.mapPass.dispose();key.shadow.mapPass=null;}
  key.shadow.needsUpdate=true;
 };
 setQuality(false);
 const dispose=()=>{
  if(disposed)return;disposed=true;studio.removeFromParent();
  floor.geometry.dispose();floor.material.dispose();key.shadow.dispose();environment.dispose();
  textures.forEach(t=>t.dispose());originals.forEach(m=>m.dispose());
  // Decorated meshes own the cached material clones; the caller disposes its models.
  materialCache.clear();originals.clear();textures.clear();
  scene.environment=previous.environment;scene.environmentIntensity=previous.environmentIntensity;
  scene.background=previous.background;scene.fog=previous.fog;
 };
 return {decorate,setQuality,dispose};
}
