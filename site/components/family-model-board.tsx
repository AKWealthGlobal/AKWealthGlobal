'use client';
import {useEffect,useRef,useState} from 'react';
import type * as Three from 'three';
import {tiles,zones,animals} from '@/lib/urban-game';
const colors=['#64c7db','#efba61','#a7d8ed','#75c597'];
const noProjects:number[]=[];
type Props={positions:number[];turn:number;projects?:number[];onMovingChange?:(v:boolean)=>void;reaction?:'wave'|'celebrate'|'encourage';reactionKey?:string;playing?:boolean;dice?:number};
export function boardPoint(p:number){const s=Math.floor(p/6),t=p%6,d=10/6;return [[-5+t*d,-5],[5,-5+t*d],[5-t*d,5],[-5,5-t*d]][s];}
const DICE_ROTATIONS:Record<number,[number,number,number]>={
 1:[0,0,0],
 2:[Math.PI/2,0,0],
 3:[0,0,Math.PI/2],
 4:[0,0,-Math.PI/2],
 5:[-Math.PI/2,0,0],
 6:[Math.PI,0,0],
};
export default function FamilyModelBoard({positions,turn,projects=noProjects,onMovingChange,reaction='wave',reactionKey,playing=false,dice=0}:Props){
 const root=useRef<HTMLDivElement>(null),api=useRef<{update:(p:number[],t:number,b:number[],d?:number)=>void;rotate:(d:number)=>void;react:(kind:string,slot:number)=>void;resetCamera:()=>void;focusPlayer:()=>void;setQuality:(detailed:boolean)=>void}|null>(null);
 const latest=useRef({positions,turn,projects,onMovingChange,playing,dice});latest.current={positions,turn,projects,onMovingChange,playing,dice};
 const [status,setStatus]=useState<'loading'|'ready'|'failed'>('loading');
 const [detailed,setDetailed]=useState(false);
 useEffect(()=>{
  let disposed=false,cleanup=()=>{};
  (async()=>{
   const [T,{GLTFLoader},{OrbitControls},{createCityStudio},{createCityEffects},{batchCityGeometry}]=await Promise.all([import('three'),import('three/addons/loaders/GLTFLoader.js'),import('three/addons/controls/OrbitControls.js'),import('@/lib/city-studio'),import('@/lib/city-effects'),import('@/lib/city-static-batch')]);
   if(disposed||!root.current)return;
   const host=root.current,scene=new T.Scene(),world=new T.Group();scene.add(world);
   const camera=new T.PerspectiveCamera(38,1,.1,80);
   let renderer:Three.WebGLRenderer;
   try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{setStatus('failed');return;}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
   const studio=createCityStudio(scene,renderer),effects=createCityEffects(renderer,scene,camera);
   renderer.info.autoReset=false;
   const setQuality=(requested:boolean)=>{const enabled=effects.setQuality(requested);studio.setQuality(enabled);setDetailed(enabled);host.dataset.lighting=enabled?'detailed':'balanced';draw();};
   host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','AK 動物都市立體棋盤');
   const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,endTimer:ReturnType<typeof setTimeout>|undefined,animations:{pawn:Three.Group;path:number[];start:number;from:Three.Vector3;slot:number}[]=[];
   const pawns:Three.Group[]=[],built=new Map<number,Three.Group>();let current:number[]=[];
   const buildingStarts=new Map<number,number>();
   let diceAnim:{start:number;targetRot:[number,number,number]}|null=null;
   const diceGroup=new T.Group();diceGroup.name='Dice3D';diceGroup.visible=false;
   const tileBeacon=new T.Mesh(new T.RingGeometry(.52,.68,4),new T.MeshBasicMaterial({color:0xffd167,side:T.DoubleSide}));
   tileBeacon.name='TileBeacon';tileBeacon.rotation.x=-Math.PI/2;tileBeacon.rotation.z=Math.PI/4;tileBeacon.position.y=.23;
   const mixers:{mixer:Three.AnimationMixer;idle:Three.AnimationAction;walk:Three.AnimationAction;wave:Three.AnimationAction;celebrate:Three.AnimationAction;encourage:Three.AnimationAction}[]=[];
   let lastTime=performance.now(),inView=true,ready=false;
   const disposeObject=(object:Three.Object3D)=>object.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if('map' in m)(m as Three.MeshBasicMaterial).map?.dispose();m.dispose();});}});
   const at=(p:number,i:number)=>{const [x,z]=boardPoint(p);return new T.Vector3(x+(i%2-.5)*.38,.2,z+(Math.floor(i/2)-.5)*.38);};
   const draw=()=>{effects.render();host.dataset.drawCalls=String(renderer.info.render.calls);host.dataset.triangles=String(renderer.info.render.triangles);};
   let inTick=false;
   const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.4,0);controls.enableDamping=!reduced.matches;controls.dampingFactor=.09;controls.enablePan=false;controls.minDistance=8.5;controls.maxDistance=36;controls.minPolarAngle=.32;controls.maxPolarAngle=1.12;controls.rotateSpeed=.65;controls.zoomSpeed=.65;
   // Damping fires change during update; the animation loop already draws that frame.
   const onCameraChange=()=>{if(!inTick)draw();};controls.addEventListener('change',onCameraChange);
   const framingPoints:Three.Vector3[]=[];
   const fitCamera=()=>{
    const direction=new T.Vector3(1,1.25,1.35).normalize();controls.target.set(0,.4,0);
    let distance=23;
    // Fit occupied geometry, rather than the empty upper corners of one giant box.
    for(let attempt=0;attempt<12;attempt++){
     camera.position.copy(controls.target).addScaledVector(direction,distance);camera.lookAt(controls.target);camera.updateMatrixWorld();
     if(!framingPoints.length)break;
     let left=Infinity,right=-Infinity,top=-Infinity,bottom=Infinity;
     for(const point of framingPoints){const p=point.clone().project(camera);left=Math.min(left,p.x);right=Math.max(right,p.x);bottom=Math.min(bottom,p.y);top=Math.max(top,p.y);}
     const halfHeight=distance*Math.tan(T.MathUtils.degToRad(camera.fov/2));
     controls.target.addScaledVector(new T.Vector3(1,0,0).applyQuaternion(camera.quaternion),(left+right)/2*halfHeight*camera.aspect);
     controls.target.addScaledVector(new T.Vector3(0,1,0).applyQuaternion(camera.quaternion),(top+bottom)/2*halfHeight);
     const factor=Math.max((right-left)/1.84,(top-bottom)/1.8);distance*=T.MathUtils.clamp(factor,.75,1.3);
     if(Math.abs(factor-1)<.002)break;
    }
    camera.position.copy(controls.target).addScaledVector(direction,distance);camera.lookAt(controls.target);
    controls.update();controls.saveState();
   };
   const resize=()=>{const w=host.clientWidth;if(!w)return;const h=w<600?(latest.current.playing?Math.max(250,Math.min(330,w*.82)):Math.max(290,Math.min(390,w*.96))):Math.max(460,Math.min(600,w*.58));renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();effects.resize(w,h);fitCamera();draw();};
   const observer=new ResizeObserver(resize);observer.observe(host);
   const finish=()=>{clearTimeout(endTimer);animations.forEach(a=>a.pawn.position.copy(at(a.path[a.path.length-1],a.slot)));animations=[];if(diceAnim){diceGroup.position.set(0,1.68,0);diceGroup.rotation.set(...diceAnim.targetRot);diceAnim=null;}mixers.forEach(m=>{m.walk.fadeOut(.18);m.idle.reset().fadeIn(.18).play();});draw();latest.current.onMovingChange?.(false);};
   const tick=(now:number)=>{
    if(disposed)return;
    const hadMoves=animations.length>0;
    if(diceAnim){
     const p=Math.min(1,Math.max(0,(now-diceAnim.start)/480));
     const bounce=Math.abs(Math.sin(p*Math.PI*2.5))*(1-p)*1.25;
     diceGroup.position.set(0,1.68+bounce,0);
     const spin=(1-p)*Math.PI*4;
     diceGroup.rotation.set(diceAnim.targetRot[0]+spin,diceAnim.targetRot[1]+spin*.7,diceAnim.targetRot[2]+spin*.5);
     if(p>=1)diceAnim=null;
    }
    animations=animations.filter(a=>{const elapsed=Math.max(0,(now-a.start)/340),index=Math.floor(elapsed),fraction=elapsed-index;
     if(index>=a.path.length){a.pawn.position.copy(at(a.path[a.path.length-1],a.slot));mixers[a.slot]?.walk.fadeOut(.18);mixers[a.slot]?.idle.reset().fadeIn(.18).play();return false;}
     const from=index===0?a.from:at(a.path[index-1],a.slot),to=at(a.path[index],a.slot);const eased=fraction*fraction*(3-2*fraction);a.pawn.position.lerpVectors(from,to,eased);a.pawn.position.y+=Math.sin(fraction*Math.PI)*.06;const targetAngle=Math.atan2(to.x-from.x,to.z-from.z);const angleDelta=Math.atan2(Math.sin(targetAngle-a.pawn.rotation.y),Math.cos(targetAngle-a.pawn.rotation.y));a.pawn.rotation.y+=angleDelta*(1-Math.exp(-16*Math.max(0,(now-lastTime)/1000)));return true;
    });const delta=Math.max(0,Math.min((now-lastTime)/1000,.05));lastTime=now;if(!reduced.matches)mixers.forEach((m,i)=>{if(pawns[i].visible)m.mixer.update(delta);});buildingStarts.forEach((start,key)=>{const progress=Math.min(1,Math.max(.01,(now-start)/450));built.get(key)?.scale.setScalar(progress);if(progress===1)buildingStarts.delete(key);});inTick=true;controls.update();inTick=false;draw();if(hadMoves&&!animations.length)latest.current.onMovingChange?.(false);if(ready&&!reduced.matches&&!document.hidden&&inView)frame=requestAnimationFrame(tick);
   };
   const resume=()=>{cancelAnimationFrame(frame);if(ready&&!reduced.matches&&!document.hidden&&inView){lastTime=performance.now();frame=requestAnimationFrame(tick);}};
   const onPreference=()=>{controls.enableDamping=!reduced.matches;if(reduced.matches){finish();cancelAnimationFrame(frame);built.forEach(o=>o.scale.setScalar(1));buildingStarts.clear();mixers.forEach(m=>m.mixer.update(0));draw();}else resume();};reduced.addEventListener('change',onPreference);
   const visibility=()=>{if(document.hidden){finish();cancelAnimationFrame(frame);}else resume();};document.addEventListener('visibilitychange',visibility);
   const intersection=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView){cancelAnimationFrame(frame);}else resume();});intersection.observe(host);
   const onLost=(event:Event)=>{event.preventDefault();ready=false;cancelAnimationFrame(frame);finish();api.current=null;setStatus('failed');};renderer.domElement.addEventListener('webglcontextlost',onLost);
   const update=(p:number[],t:number,projects:number[],d=latest.current.dice)=>{
    finish();
    const activeTile=p[t]??0;
    const [tx,tz]=boardPoint(activeTile);
    tileBeacon.position.set(tx,.23,tz);
    (tileBeacon.material as Three.MeshBasicMaterial).color.set(colors[Math.floor(activeTile/6)]||'#ffd167');
    if(d&&d>=1&&d<=6){
     diceGroup.visible=true;
     const targetRot=DICE_ROTATIONS[d]||[0,0,0];
     if(reduced.matches){diceGroup.position.set(0,1.68,0);diceGroup.rotation.set(...targetRot);}
     else{diceAnim={start:performance.now(),targetRot};resume();}
    }else{diceGroup.visible=false;diceAnim=null;}
    pawns.forEach((pawn,i)=>{pawn.visible=i<p.length;if(i>=p.length)return;const ring=pawn.getObjectByName('TurnRing');if(ring)ring.visible=i===t;
     const before=current[i],after=p[i];if(before===undefined||before===after||reduced.matches)pawn.position.copy(at(after,i));
     else{const steps=(after-before+24)%24,path=Array.from({length:steps},(_,n)=>(before+n+1)%24);animations.push({pawn,path,start:performance.now(),from:pawn.position.clone(),slot:i});mixers[i]?.idle.fadeOut(.18);mixers[i]?.walk.reset().fadeIn(.18).play();}
    });current=[...p];
    built.forEach((o,key)=>{if(!projects.includes(key)){world.remove(o);disposeObject(o);built.delete(key);buildingStarts.delete(key);}});
    projects.forEach(p=>{if(built.has(p))return;const group=new T.Group();group.name='Project_'+p;const anchors:Record<number,number[]>={4:[-3.8,-.65],10:[3.8,-.65],16:[.85,3.8],22:[-.85,3.8]};const [x,z]=anchors[p];group.position.set(x,.15,z);
     const part=(geometry:Three.BufferGeometry,color:number,px:number,py:number,pz:number)=>{const m=new T.Mesh(geometry,new T.MeshStandardMaterial({color}));m.position.set(px,py,pz);m.castShadow=true;m.receiveShadow=true;group.add(m);return m;};
     part(new T.BoxGeometry(1,.12,.75),0xffd167,0,0,0);
     if(p===4){const ramp=part(new T.BoxGeometry(.65,.09,.7),0x64c7db,0,.17,0);ramp.rotation.x=-.18;part(new T.CylinderGeometry(.07,.07,.5,12),0xf8f0d8,.3,.34,0);part(new T.SphereGeometry(.1,12,8),0x64c7db,.3,.62,0);}
     if(p===10){[-.38,.38].forEach(a=>part(new T.CylinderGeometry(.04,.04,.8,8),0x8b5931,a,.4,0));part(new T.BoxGeometry(1,.12,.7),0xeeb458,0,.86,0);part(new T.BoxGeometry(.7,.15,.3),0x1a6479,0,.26,0);}
     if(p===16){part(new T.BoxGeometry(.75,.7,.55),0x8e5f3d,0,.4,0);const roof=part(new T.ConeGeometry(.62,.4,4),0xe9f6fa,0,.95,0);roof.rotation.y=Math.PI/4;part(new T.BoxGeometry(.22,.25,.025),0xffd167,0,.5,.29);}
     if(p===22){part(new T.BoxGeometry(.75,.85,.25),0x895b35,0,.49,0);[-.3,0,.3].forEach(a=>part(new T.BoxGeometry(.65,.035,.30),0xe3cc93,0,.5+a,.03));for(let j=0;j<6;j++)part(new T.BoxGeometry(.07,.19,.18),[0x64c7db,0xeeb458,0x78b67e][j%3],-.25+j*.1,.32,.04);}
     studio.decorate(group);world.add(group);built.set(p,group);if(!reduced.matches){group.scale.setScalar(.01);buildingStarts.set(p,performance.now());resume();}
    });draw();if(animations.length){latest.current.onMovingChange?.(true);if(document.hidden)finish();else{resume();endTimer=setTimeout(finish,Math.max(...animations.map(a=>a.path.length))*340+250);}}
   };
   cleanup=()=>{controls.removeEventListener('change',onCameraChange);controls.dispose();ready=false;clearTimeout(endTimer);cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',onPreference);renderer.domElement.removeEventListener('webglcontextlost',onLost);mixers.forEach(m=>{m.mixer.stopAllAction();m.mixer.uncacheRoot(m.mixer.getRoot());});effects.dispose();studio.dispose();disposeObject(scene);renderer.dispose();renderer.domElement.remove();api.current=null;latest.current.onMovingChange?.(false);};
   try{
    const gltf=await new GLTFLoader().loadAsync('/models/ak-animal-metropolis.glb');
    if(disposed){disposeObject(gltf.scene);return;}
    const samples:Three.Object3D[]=[];gltf.scene.traverse(o=>{if(o.name.startsWith('Player_'))samples.push(o);});samples.forEach(o=>{o.removeFromParent();disposeObject(o);});gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});studio.decorate(gltf.scene);gltf.scene.updateWorldMatrix(true,true);gltf.scene.traverse(object=>{if(!(object instanceof T.Mesh))return;object.geometry.computeBoundingBox();const box=object.geometry.boundingBox;if(!box)return;for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new T.Vector3(x,y,z).applyMatrix4(object.matrixWorld);p.y=Math.max(-.5,p.y);framingPoints.push(p);}});for(const x of [-5.3,5.3])for(const z of [-5.3,5.3])framingPoints.push(new T.Vector3(x,1.6,z));const batch=batchCityGeometry(gltf.scene);host.dataset.boardMeshes=String(batch.after);host.dataset.originalBoardMeshes=String(batch.before);world.add(gltf.scene);
    // Add 3D die and active tile beacon after static board batching
    const dieBody=new T.Mesh(new T.BoxGeometry(.56,.56,.56),new T.MeshStandardMaterial({color:0xfffaf0,roughness:.35}));
    dieBody.castShadow=true;dieBody.receiveShadow=true;diceGroup.add(dieBody);
    const pipMat=new T.MeshStandardMaterial({color:0x173a4b,roughness:.3}),pipRed=new T.MeshStandardMaterial({color:0xd94e34,roughness:.3});
    const pipGeo=new T.SphereGeometry(.052,10,8);
    const addPip=(x:number,y:number,z:number,red=false)=>{const m=new T.Mesh(pipGeo,red?pipRed:pipMat);m.position.set(x,y,z);diceGroup.add(m);};
    // 1 (+Y), 6 (-Y), 2 (-Z), 5 (+Z), 3 (-X), 4 (+X)
    addPip(0,.285,0,true);
    for(const sx of [-.13,.13])for(const sz of [-.14,0,.14])addPip(sx,-.285,sz);
    for(const s of [-.12,.12])addPip(s,s,-.285);
    for(const sx of [-.13,.13])for(const sy of [-.13,.13])addPip(sx,sy,.285);addPip(0,0,.285);
    for(const s of [-.14,0,.14])addPip(-.285,s,s);
    for(const sy of [-.13,.13])for(const sz of [-.13,.13])addPip(.285,sy,sz,true);
    diceGroup.position.set(0,1.68,0);
    world.add(diceGroup);
    world.add(tileBeacon);
    const characters=await Promise.all(['a-cheng','mimi','nuan-nuan','you-you'].map(name=>new GLTFLoader().loadAsync('/models/'+name+'.glb')));
    if(disposed){characters.forEach(c=>disposeObject(c.scene));return;}
    for(let i=0;i<4;i++){
     const pawn=new T.Group(),actor=characters[i].scene;actor.scale.setScalar(.72);actor.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});studio.decorate(actor,true);pawn.add(actor);
     const mixer=new T.AnimationMixer(actor),tracks:Three.KeyframeTrack[]=[];
     actor.traverse(o=>{if(/^(Arm|Foot)_[LR]/.test(o.name)){const side=o.name.includes('_L')?1:-1;tracks.push(new T.NumberKeyframeTrack(o.uuid+'.rotation[x]',[0,.18,.36,.54,.72],[0,side*.35,0,-side*.35,0]));}});
     const idle=mixer.clipAction(new T.AnimationClip('Idle',2,[new T.NumberKeyframeTrack(actor.uuid+'.position[y]',[0,1,2],[0,.018,0])]));
     const walk=mixer.clipAction(new T.AnimationClip('Walk',.72,tracks));const reactionTracks=(kind:string)=>{const keys:Three.KeyframeTrack[]=[];actor.traverse(o=>{if(/^Arm_[LR]/.test(o.name)){const side=o.name.includes('_L')?1:-1;keys.push(new T.NumberKeyframeTrack(o.uuid+'.rotation[z]',[0,.25,.5,.75,1,1.25,1.5],kind==='celebrate'?[0,side*1,side*.7,side*1,side*.7,side*1,0]:kind==='wave'&&side<0?[0,-.9,-.5,-1,-.5,-.9,0]:[0,side*.2,0,side*.2,0,side*.2,0]));}});keys.push(new T.NumberKeyframeTrack(actor.uuid+'.position[y]',[0,.3,.6,.9,1.2,1.5],kind==='celebrate'?[0,.14,0,.14,0,0]:[0,.018,0,.018,0,0]));return keys;};
     const wave=mixer.clipAction(new T.AnimationClip('Wave',1.5,reactionTracks('wave'))),celebrate=mixer.clipAction(new T.AnimationClip('Celebrate',1.5,reactionTracks('celebrate'))),encourage=mixer.clipAction(new T.AnimationClip('Encourage',1.5,reactionTracks('encourage')));[wave,celebrate,encourage].forEach(a=>{a.setLoop(T.LoopOnce,1);a.clampWhenFinished=true;});mixer.addEventListener('finished',event=>{idle.reset().play().crossFadeFrom(event.action,.22,false);});idle.play();mixers.push({mixer,idle,walk,wave,celebrate,encourage});
     const ring=new T.Mesh(new T.TorusGeometry(.42,.05,8,24),new T.MeshBasicMaterial({color:0xffd167}));ring.name='TurnRing';ring.rotation.x=-Math.PI/2;ring.position.y=.04;pawn.add(ring);world.add(pawn);pawns.push(pawn);
    }
    const react=(kind:string,slot:number)=>{if(reduced.matches||!inView||document.hidden||animations.length)return;const m=mixers[slot];if(!m)return;const previous=[m.idle,m.walk,m.wave,m.celebrate,m.encourage].find(a=>a.isRunning()&&a.getEffectiveWeight()>.1);const next=kind==='celebrate'?m.celebrate:kind==='encourage'?m.encourage:m.wave;next.reset().play();if(previous&&previous!==next)next.crossFadeFrom(previous,.2,false);resume();};
    const focusPlayer=()=>{
     const activePawn=pawns[latest.current.turn];
     if(!activePawn)return;
     const pos=activePawn.position;
     controls.target.set(pos.x*.55,.45,pos.z*.55);
     const dir=new T.Vector3(pos.x>=0?1:-.8,1.15,pos.z>=0?1.1:-.9).normalize();
     camera.position.copy(controls.target).addScaledVector(dir,13.5);
     camera.lookAt(controls.target);
     controls.update();draw();resume();
    };
    setQuality(!matchMedia('(max-width: 700px)').matches);ready=true;api.current={update,react,setQuality,focusPlayer,resetCamera:()=>{controls.reset();controls.update();draw();resume();},rotate:d=>{controls.rotateLeft(d);controls.update();resume();draw();}};update(latest.current.positions,latest.current.turn,latest.current.projects,latest.current.dice);resize();resume();setStatus('ready');
   }catch{if(!disposed){setStatus('failed');latest.current.onMovingChange?.(false);}}
  })().catch(()=>{if(!disposed)setStatus('failed');});
  return()=>{disposed=true;cleanup();};
 },[]);
 useEffect(()=>{api.current?.update(positions,turn,projects,dice);},[positions,turn,projects,dice]);
 useEffect(()=>{if(status==='ready')api.current?.react(reaction,turn);},[reactionKey,reaction,turn,status]);
 return <div className="family-scene city-scene"><div className="city-model-viewport" ref={root} hidden={status==='failed'}/>{status==='loading'&&<p role="status">正在載入立體城市…</p>}{status==='failed'&&<p role="status">目前使用文字棋盤，可以繼續完成所有遊戲操作。</p>}<div className="city-zone-legend">{zones.map((z,i)=><span key={z} style={{borderColor:colors[i]}}>{z}</span>)}</div>{status==='ready'&&<div className="family-camera"><button onClick={()=>api.current?.rotate(-.35)} aria-label="棋盤向左旋轉">向左看</button><button onClick={()=>api.current?.react('wave',turn)}>和角色打招呼</button><button onClick={()=>api.current?.focusPlayer()}>聚焦角色</button><button onClick={()=>api.current?.resetCamera()}>回到全景</button><button aria-pressed={detailed} onClick={()=>api.current?.setQuality(!detailed)}>{detailed?'細緻光影':'流暢模式'}</button><span>拖曳轉動、雙指縮放 · 金色光圈是目前的家人</span><button onClick={()=>api.current?.rotate(.35)} aria-label="棋盤向右旋轉">向右看</button></div>}<details open={status==='failed'}><summary>查看 24 格與家人位置</summary><ol className="family-tile-list">{tiles.map((name,i)=><li key={name}><span>{i+1}. {name}{projects.includes(i)&&' ✓ 已建設'}</span><b>{positions.flatMap((p,k)=>p===i?[animals[k]]:[]).join(' ')}</b></li>)}</ol></details></div>;
}

