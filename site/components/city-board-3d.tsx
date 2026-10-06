'use client';
import {useEffect,useRef} from 'react';import {tiles,districtColor} from '@/lib/city-game';
const D=1.15;
// 7×7 外圈：0 在左前角，順時針
export const tileXZ=(i:number)=>{const k=i%6;const p=[[-3+k,3],[3,3-k],[3-k,-3],[-3,-3+k]][Math.floor(i/6)%4];return [p[0]*D,p[1]*D] as const};
export type Pawn={pos:number;color:number};
export default function CityBoard3D({pawns,active,owners,onFail}:{pawns:Pawn[];active:number;owners:(number|null)[];onFail:()=>void}){const root=useRef<HTMLDivElement>(null);const pawnRef=useRef(pawns);const activeRef=useRef(active);const setOwners=useRef<(o:(number|null)[])=>void>(()=>{});const ownersRef=useRef(owners);const failRef=useRef(onFail);failRef.current=onFail;
useEffect(()=>{pawnRef.current=pawns},[pawns]);useEffect(()=>{activeRef.current=active},[active]);useEffect(()=>{ownersRef.current=owners;setOwners.current(owners)},[owners]);
const count=pawns.length;
useEffect(()=>{if(!root.current)return;let disposed=false;let cleanup=()=>{};import('three').then(T=>{if(disposed||!root.current)return;let renderer:import('three').WebGLRenderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true})}catch{failRef.current();return;}const host=root.current;const H=Math.max(340,Math.min(460,host.clientWidth*.75));renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(host.clientWidth,H);host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','萬獸城三維棋盤');
const scene=new T.Scene();const camera=new T.PerspectiveCamera(38,host.clientWidth/H,.1,100);const fit=()=>{const a=host.clientWidth/H;const dist=a<1?15.5:12.5;camera.position.set(0,dist*.82,dist*.78);camera.lookAt(0,-.4,.2)};fit();
scene.add(new T.HemisphereLight(0xcfeeff,0x1a3550,2.6));const sun=new T.DirectionalLight(0xffe0b0,3.6);sun.position.set(5,10,6);scene.add(sun);const group=new T.Group();scene.add(group);
const mats:import('three').Material[]=[];const geos:import('three').BufferGeometry[]=[];
const mat=(c:number,o:Partial<import('three').MeshStandardMaterialParameters>={})=>{const m=new T.MeshStandardMaterial({color:c,roughness:.5,metalness:.1,...o});mats.push(m);return m};
const add=(g:import('three').BufferGeometry,m:import('three').Material,x:number,y:number,z:number,parent:import('three').Object3D=group)=>{geos.push(g);const me=new T.Mesh(g,m);me.position.set(x,y,z);parent.add(me);return me};
add(new T.BoxGeometry(8.6,.5,8.6),mat(0x1d4258),0,-.45,0);add(new T.BoxGeometry(5.6,.1,5.6),mat(0x2c5a6e),0,-.17,0);
// 四區裝飾（內圈，靠近各自那一邊）
const towers=(n:number,fn:(i:number)=>void)=>{for(let i=0;i<n;i++)fn(i)};
towers(4,i=>{const h=.8+((i*37)%5)*.25;add(new T.BoxGeometry(.42,h,.42),mat(0x7fb7d9,{metalness:.4,roughness:.2}),-1.9+i*.9,h/2-.12,1.9)});// 莽原：玻璃高樓
add(new T.CylinderGeometry(.08,.08,3.2,10),mat(0x8a9ba8),0,.55,1.35).rotation.z=Math.PI/2;// 河馬供水管
towers(3,i=>{add(new T.ConeGeometry(.32,1.1+i*.2,6),mat(0xe9c27a),1.9,.42+i*.1,-1.5+i*1.1)});// 金沙：沙色尖塔
add(new T.CylinderGeometry(.12,.16,.9,8),mat(0x5d9a63),2.05,.33,1.6);// 仙人掌
towers(3,i=>{add(new T.BoxGeometry(.38,.9+i*.3,.38),mat(0xd6f4ff,{transparent:true,opacity:.85,metalness:.2,roughness:.05}),-1.4+i*1.1,.35+i*.15,-1.95)});// 冰晶：冰雕樓
towers(3,i=>{const z=-1.4+i*1.2;add(new T.CylinderGeometry(.09,.12,.7,7),mat(0x8b6b4a),-1.95,.2,z);add(new T.ConeGeometry(.4,1,8),mat(0x3f8a5c),-1.95,.95,z)});// 雨林：大樹
// 中央車站：玻璃穹頂＋環形列車
add(new T.CylinderGeometry(1.05,1.15,.35,32),mat(0xe8e2d4),0,-.02,0);const dome=add(new T.SphereGeometry(.95,32,16,0,Math.PI*2,0,Math.PI/2),mat(0xa8e6f5,{transparent:true,opacity:.45,metalness:.3,roughness:.05}),0,.15,0);dome.scale.y=.8;
const rail=add(new T.TorusGeometry(1.45,.03,8,64),mat(0x63e4ef),0,.05,0);rail.rotation.x=Math.PI/2;const train=new T.Group();group.add(train);add(new T.BoxGeometry(.5,.18,.22),mat(0xf6edda),1.45,.16,0,train);add(new T.BoxGeometry(.3,.16,.2),mat(0xe46f7a),1.45,.16,-.42,train);
// 格子
const ownerFlags:import('three').Group[]=[];
tiles.forEach((t,i)=>{const [x,z]=tileXZ(i);const corner=i%6===0;add(new T.BoxGeometry(corner?1.1:1.05,.16,corner?1.1:1.05),mat(districtColor[t.district],{roughness:.6}),x,-.1,z);
if(t.type==='shop'){const h=.35+(t.price!/300)*.45;add(new T.BoxGeometry(.5,h,.5),mat(0xf6f1e6),x,h/2,z);}
else if(t.type==='start'){add(new T.CylinderGeometry(.35,.35,.08,24),mat(0x63e4ef,{emissive:0x1b6f78}),x,.02,z)}
else if(t.type==='quiz'){const o=add(new T.OctahedronGeometry(.2),mat(0x63e4ef,{emissive:0x0d4d55}),x,.35,z);o.userData.spin=1}
else if(t.type==='chance'){const o=add(new T.OctahedronGeometry(.2),mat(0xf1bd62,{emissive:0x5a3a00}),x,.35,z);o.userData.spin=1}
else if(t.type==='risk'){add(new T.ConeGeometry(.22,.4,3),mat(0xe46f7a),x,.2,z)}
else if(t.type==='bank'){add(new T.CylinderGeometry(.32,.32,.16,24),mat(0xd8dde2,{metalness:.7,roughness:.25}),x,.08,z).rotation.x=Math.PI/2}
else if(t.type==='insure'){add(new T.BoxGeometry(.36,.36,.1),mat(0x7fd9f0),x,.2,z)}
else if(t.type==='share'){add(new T.SphereGeometry(.18,16,12),mat(0xff8fa3),x,.2,z)}
else if(t.type==='green'){add(new T.ConeGeometry(.25,.5,8),mat(0x3f8a5c),x,.25,z)}
else if(t.type==='work'){add(new T.BoxGeometry(.5,.45,.5),mat(0x3d5a80),x,.22,z)}
else if(t.type==='bill'){add(new T.CylinderGeometry(.2,.2,.06,20),mat(0x9aa7b0),x,.03,z)}
const flag=new T.Group();flag.position.set(x+.32,0,z-.32);flag.visible=false;group.add(flag);ownerFlags[i]=flag;});
const flagMats:Record<number,import('three').Material>={};
setOwners.current=o=>{o.forEach((c,i)=>{const f=ownerFlags[i];if(!f)return;f.clear();f.visible=c!==null;if(c===null)return;const pole=new T.Mesh(new T.CylinderGeometry(.02,.02,.7,6),mat(0xeeeeee));geos.push(pole.geometry);pole.position.y=.35;const fm=flagMats[c]??(flagMats[c]=mat(c));const cloth=new T.Mesh(new T.BoxGeometry(.28,.18,.02),fm);geos.push(cloth.geometry);cloth.position.set(.14,.6,0);f.add(pole,cloth)})};setOwners.current(ownersRef.current);
// 棋子
const pawnObjs=pawnRef.current.map(p=>{const g=new T.Group();const m=mat(p.color,{roughness:.3,metalness:.35});add(new T.CylinderGeometry(.12,.2,.38,16),m,0,.19,0,g);add(new T.SphereGeometry(.13,16,12),m,0,.46,0,g);group.add(g);return g});
const offs=(n:number,k:number)=>n===1?[0,0]:[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]][k];
const state=pawnRef.current.map(p=>({shown:p.pos,from:tileXZ(p.pos),to:tileXZ(p.pos),t0:0}));
const observer=new ResizeObserver(()=>{renderer.setSize(host.clientWidth,H);camera.aspect=host.clientWidth/H;fit();camera.updateProjectionMatrix()});observer.observe(host);let visible=true;const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting});io.observe(host);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let id=0;
const draw=(time:number)=>{const ps=pawnRef.current;state.forEach((s,k)=>{const target=ps[k]?.pos??s.shown;if(s.shown!==target&&time-s.t0>230){if(reduced){s.shown=target;s.from=s.to=tileXZ(target)}else{s.from=s.to;s.shown=(s.shown+1)%24;s.to=tileXZ(s.shown)}s.t0=time}const p=reduced?1:Math.min(1,(time-s.t0)/230);const [ox,oz]=offs(ps.length,k);const bob=k===activeRef.current&&!reduced?Math.abs(Math.sin(time*.004))*.12:0;pawnObjs[k].position.set(s.from[0]+(s.to[0]-s.from[0])*p+ox,.0+Math.sin(p*Math.PI)*.45+bob,s.from[1]+(s.to[1]-s.from[1])*p+oz)});
if(!reduced){train.rotation.y=time*.0006;group.children.forEach(c=>{if(c.userData.spin)c.rotation.y=time*.002})}
if(visible&&!document.hidden)renderer.render(scene,camera);id=requestAnimationFrame(draw)};id=requestAnimationFrame(draw);
cleanup=()=>{cancelAnimationFrame(id);observer.disconnect();io.disconnect();geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove()}}).catch(()=>failRef.current());return()=>{disposed=true;cleanup()}},[count]);
return <div ref={root} className="island-canvas city-canvas"/>}
