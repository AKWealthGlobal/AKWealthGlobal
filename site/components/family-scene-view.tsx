'use client';
import {useState,useEffect} from 'react';
import Image from 'next/image';
import ModelBoard from './family-model-board';
import {animals,zones,tiles} from '@/lib/urban-game';
type Props={positions:number[];turn:number;projects?:number[];onMovingChange?:(v:boolean)=>void;reaction?:'wave'|'celebrate'|'encourage';reactionKey?:string;playing?:boolean;dice?:number;onStart?:()=>void;modeName?:string;players?:number};
const art=['lightbridge','sand','snow','forest'];
export default function FamilySceneView(props:Props){
 const [view,setView]=useState<'art'|'model'>('art'),[district,setDistrict]=useState<number|null>(null);
 useEffect(()=>{if(props.playing)setView('model');},[props.playing]);
 const zone=district??Math.floor(props.positions[props.turn]/6);
 const canClickCover=!props.playing&&Boolean(props.onStart);
 return <div className="city-art-view">
  <div className="city-view-tabs" role="group" aria-label="棋盤顯示方式">
   <button aria-pressed={view==='art'} onClick={()=>setView('art')}>精細城市主視覺</button>
   <button aria-pressed={view==='model'} onClick={()=>setView('model')}>互動 3D 模型</button>
   {canClickCover&&<button className="city-quick-play-tab" onClick={props.onStart}>▶ 立即開始 3D 遊戲</button>}
  </div>
  {view==='art'?<>
   <div
    className={'city-hero-art'+(canClickCover?' city-hero-clickable':'')}
    onClick={canClickCover?props.onStart:undefined}
    onKeyDown={canClickCover?e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();props.onStart?.();}}:undefined}
    role={canClickCover?'button':undefined}
    tabIndex={canClickCover?0:undefined}
    aria-label={canClickCover?`點擊封面直接開始 3D 遊戲（目前設定：${props.modeName??'幼兒版'}，${props.players??2} 位家人）`:undefined}
   >
    <Image src="/media/city/city-hero.webp" alt="AK 動物都市精細主視覺：四區城市圍繞中央轉運站" width={2688} height={1520} sizes="(max-width:700px) 100vw,1120px" priority/>
    {canClickCover&&<div className="city-cover-cta" aria-hidden="true">
     <div className="city-cover-badge">
      <span className="city-cover-pill">🎲 {props.modeName??'幼兒版'} · {props.players??2} 位家人</span>
      <strong>▶ 點擊封面直接開始遊戲</strong>
      <small>手機觸控・電腦滑鼠皆可 360° 旋轉立體棋盤</small>
     </div>
    </div>}
    <div className="city-art-turn" role="status">{animals[props.turn]} · 第 {props.positions[props.turn]+1} 格 · {tiles[props.positions[props.turn]]}</div>
   </div>
   <div className="city-district-tabs" role="group" aria-label="探索四個城區">{zones.map((name,i)=><button key={name} aria-pressed={zone===i} onClick={()=>setDistrict(i)}>{name}</button>)}</div>
   <div className="city-showcase-grid">
    <div className="city-district-art"><Image src={'/media/city/'+art[zone]+'.webp'} alt={zones[zone]+'場景'} width={1376} height={768} sizes="(max-width:700px) 100vw,800px"/><div><h3>{zones[zone]}</h3><p>{['在城市裡練習工作、預算與公共建設。','把創意做成小作品，也理解投入與風險。','保留備用金，為生活中的變化做好準備。','分享知識、合作學習，讓社區一起成長。'][zone]}</p></div></div>
    <div className="city-character-art"><Image src="/media/city/characters.webp" alt="阿橙、米米、暖暖和悠悠的原始角色設計" width={1376} height={768} sizes="(max-width:700px) 100vw,800px"/><p role="status">{props.reaction==='celebrate'?'一起找到答案了！':props.reaction==='encourage'?'沒關係，和家人一起再想想。':'四位城市夥伴，陪全家一起做選擇。'}</p></div>
   </div>
   <details className="city-art-positions"><summary>查看家人目前位置與建設</summary><ul>{props.positions.map((p,i)=><li key={i}>{animals[i]}：第 {p+1} 格 · {tiles[p]}</li>)}</ul><p>已完成建設：{props.projects?.map(p=>tiles[p]).join('、')||'尚未建設'}</p></details>
  </>:<ModelBoard {...props}/>}
 </div>;
}


