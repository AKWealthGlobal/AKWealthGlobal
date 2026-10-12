'use client';

import {useEffect,useRef,useState} from 'react';
import {animals,configs} from '@/lib/urban-game';
import type {AgeMode} from '@/lib/urban-quiz';
import type {FamilyRoomController} from '@/lib/use-family-room';

type Props={room:FamilyRoomController;onBackToLocal:()=>void};
export default function FamilyOnlineRoom({room,onBackToLocal}:Props){
 const [tab,setTab]=useState<'create'|'join'>('create'),[mode,setMode]=useState<AgeMode>('little');
 const [capacity,setCapacity]=useState(2),[seat,setSeat]=useState(0),[code,setCode]=useState('');
 const [joinSeat,setJoinSeat]=useState<number|null>(null),[copyStatus,setCopyStatus]=useState('');
 const [confirm,setConfirm]=useState<'leave'|'close'|null>(null);
 const codeRef=useRef<HTMLInputElement>(null);
 const headingRef=useRef<HTMLHeadingElement>(null),cancelRef=useRef<HTMLButtonElement>(null),returnFocus=useRef<HTMLElement|null>(null),hadConfirm=useRef(false);
 const priorRoom=useRef<{code:string;status:string}|null>(room.snapshot?{code:room.snapshot.roomCode,status:room.snapshot.status}:null);
 const previewHeading=useRef<HTMLHeadingElement>(null),errorRef=useRef<HTMLDivElement>(null);
 const disabled=room.busy||!room.online;
 const snapshot=room.snapshot;
 useEffect(()=>{setJoinSeat(room.preview?.freeSeats[0]??null);},[room.preview]);
 useEffect(()=>{if(room.preview)previewHeading.current?.focus();},[room.preview]);
 useEffect(()=>{if(room.error&&!snapshot&&!room.busy)errorRef.current?.focus();},[room.error,room.busy,snapshot]);
 useEffect(()=>{setConfirm(null);setCopyStatus('');},[snapshot?.roomCode,snapshot?.status]);
 useEffect(()=>{
  const before=priorRoom.current;
  if(snapshot&&snapshot.status!=='playing'&&(!before||before.code!==snapshot.roomCode||before.status!==snapshot.status))headingRef.current?.focus();
  priorRoom.current=snapshot?{code:snapshot.roomCode,status:snapshot.status}:null;
 },[snapshot?.roomCode,snapshot?.status]);
 useEffect(()=>{
  if(confirm){hadConfirm.current=true;cancelRef.current?.focus();}
  else if(hadConfirm.current){hadConfirm.current=false;(returnFocus.current?.isConnected?returnFocus.current:headingRef.current)?.focus();}
 },[confirm]);
 const ask=(kind:'leave'|'close')=>{returnFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setConfirm(kind);};
 const connectionText=!room.online?'已離線，操作暫停':room.connection==='connecting'?'正在連線…':room.connection==='error'?'連線需要確認':snapshot&&room.connection==='connected'?'房間已同步':'準備連線';
 const back=()=>{
  if(snapshot){ask('leave');return;}
  room.leaveLocal();onBackToLocal();
 };
 const copy=async()=>{
  if(!snapshot)return;
  try{await navigator.clipboard.writeText(snapshot.roomCode);setCopyStatus('已複製房號，請傳給家人。');}
  catch{codeRef.current?.focus();codeRef.current?.select();setCopyStatus('請長按或選取上方房號，再選擇複製。');}
 };
 const connection=<div className={'family-room-connection '+(!room.online?'is-offline':'')} role="status"><span aria-hidden="true">{!room.online?'○':room.connection==='connected'?'●':'◌'}</span> {connectionText}</div>;
 const feedback=<>{room.error&&<div ref={errorRef} tabIndex={-1} className="family-room-error" role="alert"><p>{room.error}</p>{room.canRetry&&<button type="button" disabled={disabled} onClick={()=>void room.retry()}>重新同步／重試</button>}</div>}{room.storageNotice&&<p className="family-room-notice" role="status">{room.storageNotice}</p>}</>;
 if(!room.enabled)return <section className="family-online-room"><h2>跨裝置家庭房間</h2><p>房間連線服務尚未啟用。目前可以在同一台手機或電腦，輪流完成親子冒險。</p><button type="button" onClick={onBackToLocal}>回到同裝置遊戲</button></section>;
 return <section className={'family-online-room '+(snapshot?.status==='playing'?'is-playing':'')} aria-label="跨裝置家庭房間">
  <div className="family-room-heading"><div><p className="family-room-kicker">各自一台裝置，一起完成計畫</p><h2 ref={headingRef} data-room-focus="lobby" tabIndex={-1}>{snapshot?.status==='playing'?'家庭連線中':'跨裝置家庭房間'}</h2></div>{connection}</div>
  {feedback}
  {!snapshot?<>
   {room.hasSavedSession&&<div className="family-room-recover"><div><b>繼續上次的房間</b><p>{room.savedRoomCode?`房號 ${room.savedRoomCode}`:'上一次連線結果尚待確認。'}，使用這個瀏覽器恢復自己的席位。</p></div><button type="button" disabled={disabled} onClick={()=>void room.resumeSaved()}>恢復上次房間</button></div>}
   <div className="family-room-tabs" role="group" aria-label="選擇建立或加入房間"><button type="button" aria-pressed={tab==='create'} onClick={()=>setTab('create')}>建立房間</button><button type="button" aria-pressed={tab==='join'} onClick={()=>setTab('join')}>加入家人</button></div>
   {tab==='create'?<form onSubmit={event=>{event.preventDefault();void room.create(mode,capacity,seat);}}>
    <div className="family-room-form-grid"><label>適合全家的題目<select value={mode} disabled={disabled} onChange={event=>setMode(event.target.value as AgeMode)}>{(Object.keys(configs) as AgeMode[]).map(key=><option key={key} value={key}>{configs[key].name} · {configs[key].age}</option>)}</select></label><label>一起遊玩的人數<select value={capacity} disabled={disabled} onChange={event=>{const count=Number(event.target.value);setCapacity(count);setSeat(value=>Math.min(value,count-1));}}>{[2,3,4].map(count=><option key={count} value={count}>{count} 人 · 每人一台裝置</option>)}</select></label></div>
    <fieldset><legend>選擇你的角色</legend><div className="family-room-seats">{Array.from({length:capacity},(_,index)=><button type="button" key={index} aria-pressed={seat===index} disabled={disabled} onClick={()=>setSeat(index)}><span>玩家 {index+1}</span><b>{animals[index]}</b></button>)}</div></fieldset>
    <p>你會成為房主。分享房號，等家人都到齊後，由你開始遊戲。</p><button type="submit" className="family-room-primary" disabled={disabled}>{room.busy?'連線中…':'建立家庭房間'}</button>
   </form>:<>
    <form onSubmit={event=>{event.preventDefault();void room.findRoom(code);}}><label>輸入家人分享的 12 位房號<input value={code} onChange={event=>{setCode(event.target.value.toUpperCase());setJoinSeat(null);}} autoCapitalize="characters" autoComplete="off" spellCheck={false} inputMode="text" placeholder="例如 ABCD EFGH 2345" maxLength={18} disabled={disabled} /></label><button type="submit" className="family-room-primary" disabled={disabled||code.replace(/\s/g,'').length!==12}>查詢房間</button></form>
    {room.preview&&room.preview.roomCode===code.replace(/\s/g,'').toUpperCase()&&<div className="family-room-preview"><h3 ref={previewHeading} tabIndex={-1}>{configs[room.preview.mode].name} · {room.preview.capacity} 人房間</h3>{room.preview.status!=='lobby'?<p>這個房間{room.preview.status==='closed'?'已關閉':'已開始遊戲'}。若你之前已加入，請使用原本的瀏覽器恢復席位。</p>:room.preview.freeSeats.length===0?<p>家人已到齊，這個房間目前沒有空位。</p>:<><fieldset><legend>選擇一個空位</legend><div className="family-room-seats">{Array.from({length:room.preview.capacity},(_,index)=>{const free=room.preview!.freeSeats.includes(index);return <button type="button" key={index} aria-pressed={joinSeat===index} disabled={!free||disabled} onClick={()=>setJoinSeat(index)}><span>玩家 {index+1} · {free?'可加入':'已有家人'}</span><b>{animals[index]}</b></button>;})}</div></fieldset><button type="button" className="family-room-primary" disabled={disabled||joinSeat===null} onClick={()=>{if(joinSeat!==null)void room.join(room.preview!.roomCode,joinSeat);}}>以 {joinSeat===null?'此角色':animals[joinSeat]} 加入</button></>}</div>}
   </>}
   <button type="button" className="family-room-back" disabled={room.busy} onClick={back}>返回同裝置遊戲</button>
  </>:<>
   <div className="family-room-identity"><div><span>這台裝置是</span><strong>玩家 {snapshot.mySeat+1} · {animals[snapshot.mySeat]}</strong><span>{snapshot.isHost?'你是房主':'你是家庭成員'}{snapshot.game&&snapshot.status==='playing'?(snapshot.game.turn===snapshot.mySeat?' · 現在輪到你':' · 等待家人操作'):''}</span></div><div className="family-room-code"><label htmlFor="family-room-code">分享房號</label><div><input ref={codeRef} id="family-room-code" readOnly value={snapshot.roomCode} onFocus={event=>event.target.select()} aria-label="家庭房間房號" /><button type="button" onClick={()=>void copy()}>複製</button></div>{copyStatus&&<p role="status">{copyStatus}</p>}</div></div>
   <ol className="family-room-members" aria-label="房間成員">{Array.from({length:snapshot.capacity},(_,index)=>{const occupied=snapshot.members.some(member=>member.seat===index);return <li key={index} className={index===snapshot.mySeat?'is-me':''}><b>{animals[index]}</b><span>玩家 {index+1} · {index===snapshot.mySeat?'你':occupied?'已加入':'等待加入'}</span></li>;})}</ol>
   {snapshot.status==='lobby'&&<div className="family-room-lobby-action"><p>{snapshot.members.length===snapshot.capacity?'家人都到齊了，可以開始冒險。':`目前 ${snapshot.members.length}／${snapshot.capacity} 人，等待家人選擇角色。`}</p>{snapshot.isHost?<button type="button" className="family-room-primary" disabled={disabled||snapshot.members.length!==snapshot.capacity||room.connection!=='connected'} onClick={()=>void room.start()}>全家到齊，開始遊戲</button>:<p>由房主開始遊戲，畫面會自動同步。</p>}</div>}
   {snapshot.status==='closed'&&<p className="family-room-error" role="status">房主已關閉這個房間。你可以返回建立新房間，或繼續同裝置遊戲。</p>}
   <div className="family-room-actions"><button type="button" disabled={room.busy} onClick={back}>離開此畫面</button>{snapshot.isHost&&snapshot.status==='lobby'&&<button type="button" disabled={disabled} onClick={()=>ask('close')}>關閉房間</button>}</div>
  </>}
  {confirm&&<div className="family-room-confirm" role="group" aria-label={confirm==='leave'?'確認離開畫面':'確認關閉房間'}><h3>{confirm==='leave'?'先離開這個畫面？':'關閉整個家庭房間？'}</h3><p>{confirm==='leave'?'你的席位會保留，其他家人仍會等你輪流操作。請告訴家人，並用這個瀏覽器的「恢復上次房間」回來；這不會把你從房間移除。':'關閉後，所有家人都無法繼續這個房間。若只是暫時離開，請選擇取消。'}</p><div><button ref={cancelRef} type="button" onClick={()=>setConfirm(null)}>取消</button><button type="button" disabled={room.busy||(confirm==='close'&&!room.online)} onClick={()=>{if(confirm==='leave'){room.leaveLocal();setConfirm(null);onBackToLocal();}else void room.command({op:'close',confirm:true}).then(ok=>{if(ok)setConfirm(null);});}}>{confirm==='leave'?'確認離開畫面':'確認關閉房間'}</button></div></div>}
  <p className="family-room-note">房間自建立起 6 小時有效。每人使用同一個瀏覽器，可在重新整理後恢復席位；關閉網頁仍會保留席位。無需姓名或帳號，請只把房號分享給一起玩的家人。</p>
 </section>;
}
