'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import type {AgeMode} from './urban-quiz';
import {ROOM_POLL_MS,ROOM_TTL_MS,type PublicRoom,type RoomPreview,type RoomRequest,type RoomResponse} from './room-protocol';

export type FamilyRoomCommand={op:'start'|'roll'|'finishQuiz'|'next'}|{op:'act'|'answer';index:number}|{op:'reset'|'close';confirm:true};
export type RoomConnection='idle'|'connecting'|'connected'|'offline'|'error';
type Session={roomCode:string;token:string};
type Pending={request:Extract<RoomRequest,{op:'create'|'join'}>;createdAt:number};
const ENDPOINT=process.env.NEXT_PUBLIC_CITY_ROOM_URL?.trim()??'';
const PREFIX='ak-city-room:v1:',LAST=PREFIX+'last',PENDING=PREFIX+'pending';
const validCode=(value:string)=>/^[A-HJ-NP-Z2-9]{12}$/.test(value);
const normalize=(value:string)=>value.toUpperCase().replace(/\s/g,'');
const secret=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
const newId=()=>typeof crypto.randomUUID==='function'?crypto.randomUUID():secret();

export function useFamilyRoom(){
 const [snapshot,setSnapshot]=useState<PublicRoom|null>(null),[preview,setPreview]=useState<RoomPreview|null>(null);
 const [busy,setBusy]=useState(false),[connection,setConnection]=useState<RoomConnection>('idle'),[error,setError]=useState('');
 const [online,setOnline]=useState(true),[storageNotice,setStorageNotice]=useState('');
 const [hasSavedSession,setHasSavedSession]=useState(false),[savedRoomCode,setSavedRoomCode]=useState('');
 const [lastSyncedAt,setLastSyncedAt]=useState<number|null>(null);
 const session=useRef<Session|null>(null),current=useRef<PublicRoom|null>(null),mounted=useRef(false),mutation=useRef(false);
 const active=useRef<{controller:AbortController;kind:'poll'|'other';sequence:number}|null>(null),sequence=useRef(0);
 const retryRequest=useRef<RoomRequest|null>(null),pending=useRef<Pending|null>(null);
 const sendRef=useRef<(request:RoomRequest,poll?:boolean)=>Promise<boolean>>(async()=>false);
 const readSaved=useCallback((code:string):Session|null=>{
  try{const raw=localStorage.getItem(PREFIX+code);if(!raw)return null;const value=JSON.parse(raw) as Session;
   return value.roomCode===code&&/^[a-f0-9]{32}$/.test(value.token)?value:null;
  }catch{return null;}
 },[]);
 const remember=useCallback((value:Session)=>{
  try{localStorage.setItem(PREFIX+value.roomCode,JSON.stringify(value));localStorage.setItem(LAST,value.roomCode);localStorage.removeItem(PENDING);}
  catch{setStorageNotice('此瀏覽器無法儲存席位。請保持這個分頁開啟，避免失去返回房間的憑證。');}
  setHasSavedSession(true);setSavedRoomCode(value.roomCode);pending.current=null;
 },[]);
 const applyRoom=useCallback((room:PublicRoom,token?:string)=>{
  if(!validCode(room.roomCode)||!Number.isSafeInteger(room.version))throw new Error('房間回覆格式不正確，請重試。');
  if(current.current?.roomCode===room.roomCode&&room.version<current.current.version)return;
  const same=current.current?.roomCode===room.roomCode&&current.current.version===room.version&&current.current.mySeat===room.mySeat;
  if(!same){current.current=room;setSnapshot(room);}setPreview(null);
  if(token){const changed=session.current?.roomCode!==room.roomCode||session.current?.token!==token;
   session.current={roomCode:room.roomCode,token};if(changed||pending.current)remember(session.current);}
  setLastSyncedAt(Date.now());
 },[remember]);
 const send=useCallback(async(request:RoomRequest,poll=false):Promise<boolean>=>{
  if(!ENDPOINT){setError('跨裝置房間尚未啟用，請先使用同裝置遊戲。');return false;}
  if(!navigator.onLine){setConnection('offline');setOnline(false);if(!poll)setError('目前沒有網路連線，恢復連線後再試。');return false;}
  if(poll&&active.current)return false;
  if(!poll&&mutation.current)return false;
  if(!poll){mutation.current=true;active.current?.controller.abort();setBusy(true);setError('');retryRequest.current=request;}
  const controller=new AbortController(),serial=++sequence.current;
  active.current={controller,kind:poll?'poll':'other',sequence:serial};
  if(!poll)setConnection('connecting');
  const timer=setTimeout(()=>controller.abort(),8000);
  try{
   const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request),signal:controller.signal,cache:'no-store',credentials:'omit'});
   const result=await response.json() as RoomResponse;
   if(!mounted.current||serial!==sequence.current)return false;
   if(!result||typeof result.ok!=='boolean')throw new Error('房間服務暫時無法回應，請重試。');
   if(!result.ok){
    if(result.room)applyRoom(result.room);
    setConnection('error');setError(result.error?.message||'這次操作未完成，請重試。');
    if(result.error.code!=='SERVER_ERROR'){
     if(request.op==='create'||request.op==='join'){
      pending.current=null;try{localStorage.removeItem(PENDING);const last=localStorage.getItem(LAST)??'';const saved=readSaved(last);setHasSavedSession(Boolean(saved));setSavedRoomCode(saved?.roomCode??'');}catch{/* The original operation error is more useful. */}
     }
     retryRequest.current=request.op==='join'&&result.error.code==='SEAT_TAKEN'?{op:'preview',roomCode:request.roomCode}:request.op==='preview'?request:null;
    }
    if(request.op==='join'&&result.error.code==='SEAT_TAKEN')setPreview(null);
    if(request.op==='read'&&['NOT_FOUND','EXPIRED','UNAUTHORIZED'].includes(result.error.code)){
     session.current=null;current.current=null;setSnapshot(null);
     try{localStorage.removeItem(PREFIX+request.roomCode);if(localStorage.getItem(LAST)===request.roomCode){localStorage.removeItem(LAST);setHasSavedSession(false);setSavedRoomCode('');}}catch{/* Recovery is optional when storage is blocked. */}
    }
    return false;
   }
   if('room' in result){
    const token='token' in request?request.token:undefined;applyRoom(result.room,token);
    if(!poll||!retryRequest.current)setError('');
   }else if('preview' in result){setPreview(result.preview);setError('');}
   else throw new Error('房間回覆格式不正確，請重試。');
   setConnection('connected');if(!poll)retryRequest.current=null;return true;
  }catch(cause){
   if(!mounted.current||serial!==sequence.current)return false;
   setConnection(navigator.onLine?'error':'offline');
   setError(controller.signal.aborted?'連線超過 8 秒，結果尚未確認。請按「重新同步／重試」，避免重複操作。':cause instanceof Error&&cause.message.startsWith('房間')?cause.message:'暫時連不上房間。請確認網路，再重新同步／重試。');
   return false;
  }finally{
   clearTimeout(timer);
   if(serial===sequence.current){active.current=null;if(!poll){mutation.current=false;if(mounted.current)setBusy(false);}}
  }
 },[applyRoom,readSaved]);
 sendRef.current=send;
 const savePending=useCallback((request:Pending['request'])=>{
  pending.current={request,createdAt:Date.now()};setHasSavedSession(true);
  if(request.op==='join')setSavedRoomCode(request.roomCode);
  try{localStorage.setItem(PENDING,JSON.stringify(pending.current));}catch{setStorageNotice('此瀏覽器無法儲存席位。請保持這個分頁開啟。');}
 },[]);
 const refresh=useCallback(async()=>{
  const own=session.current;if(!own)return false;
  return send({op:'read',...own},true);
 },[send]);
 const create=useCallback(async(mode:AgeMode,capacity:number,seat:number)=>{
  if(mutation.current)return false;
  if(pending.current){setError('上一個連線結果尚未確認，請先按「重新同步／重試」。');return false;}
  try{const request:Pending['request']={op:'create',token:secret(),requestId:newId(),expectedVersion:0,mode,capacity,seat};
   savePending(request);return send(request);
  }catch{setError('這個瀏覽器無法建立安全席位。請使用最新版 Safari、Chrome 或 Edge，並由正式 HTTPS 網址開啟遊戲。');return false;}
 },[savePending,send]);
 const findRoom=useCallback(async(code:string)=>{
  const roomCode=normalize(code);setPreview(null);
  if(!validCode(roomCode)){setError('請輸入 12 位英文字母或數字房號。');return false;}
  const own=readSaved(roomCode);if(own){session.current=own;return send({op:'read',...own});}
  return send({op:'preview',roomCode});
 },[readSaved,send]);
 const join=useCallback(async(code:string,seat:number)=>{
  if(mutation.current)return false;
  const roomCode=normalize(code);if(!validCode(roomCode)){setError('請輸入 12 位房號。');return false;}
  const own=readSaved(roomCode);
  if(own){session.current=own;return send({op:'read',...own});}
  if(pending.current){setError('上一個連線結果尚未確認，請先按「重新同步／重試」。');return false;}
  try{const request:Pending['request']={op:'join',token:secret(),roomCode,seat,requestId:newId(),expectedVersion:null};
   savePending(request);return send(request);
  }catch{setError('這個瀏覽器無法建立安全席位。請使用最新版 Safari、Chrome 或 Edge，並由正式 HTTPS 網址開啟遊戲。');return false;}
 },[readSaved,savePending,send]);
 const command=useCallback(async(cmd:FamilyRoomCommand)=>{
  // Use the version rendered with the clicked choice, not a newer polling result awaiting React's commit.
  const own=session.current,room=snapshot;
  if(!own||!room||mutation.current)return false;
  if(retryRequest.current&&retryRequest.current.op!=='read'&&retryRequest.current.op!=='preview'){
   setError('上一個操作結果尚未確認，請先按「重新同步／重試」。');return false;
  }
  const request={...cmd,...own,expectedVersion:room.version,requestId:newId()} as RoomRequest;
  return send(request);
 },[send,snapshot]);
 const retry=useCallback(async()=>{
  const request=retryRequest.current??pending.current?.request;
  if(request)return send(request);
  const own=session.current;return own?send({op:'read',...own}):false;
 },[send]);
 const resumeSaved=useCallback(async()=>{
  if(pending.current)return send(pending.current.request);
  let code='';try{code=localStorage.getItem(LAST)??'';}catch{return false;}
  const own=readSaved(code);if(!own){setHasSavedSession(false);setError('這個瀏覽器找不到可恢復的席位，請重新輸入房號。');return false;}
  session.current=own;return send({op:'read',...own});
 },[readSaved,send]);
 const leaveLocal=useCallback(()=>{
  ++sequence.current;active.current?.controller.abort();active.current=null;mutation.current=false;
  session.current=null;current.current=null;retryRequest.current=null;
  setSnapshot(null);setPreview(null);setBusy(false);setConnection('idle');setError('');setLastSyncedAt(null);
 },[]);
 useEffect(()=>{
  mounted.current=true;setOnline(navigator.onLine);
  if(!navigator.onLine)setConnection('offline');
  try{
   const code=localStorage.getItem(LAST)??'';if(validCode(code)&&readSaved(code)){setSavedRoomCode(code);setHasSavedSession(true);}
   const raw=localStorage.getItem(PENDING);
   if(raw){const value=JSON.parse(raw) as Pending;
    if(value&&Date.now()-value.createdAt<ROOM_TTL_MS&&(value.request?.op==='create'||value.request?.op==='join')&&/^[a-f0-9]{32}$/.test(value.request.token)){
     pending.current=value;setHasSavedSession(true);if(value.request.op==='join')setSavedRoomCode(value.request.roomCode);
    }else localStorage.removeItem(PENDING);
   }
  }catch{/* A private browsing session can still join without persisted recovery. */}
  return()=>{mounted.current=false;++sequence.current;active.current?.controller.abort();active.current=null;mutation.current=false;};
 },[readSaved]);
 useEffect(()=>{
  let timer:ReturnType<typeof setTimeout>|undefined,generation=0,stopped=false;
  const poll=async(cycle:number)=>{
   const own=session.current;if(own&&navigator.onLine&&current.current?.status!=='closed')await sendRef.current({op:'read',...own},true);
   if(!stopped&&generation===cycle)timer=setTimeout(()=>void poll(cycle),document.hidden?12000:ROOM_POLL_MS);
  };
  const wake=()=>{
   setOnline(navigator.onLine);if(!navigator.onLine){setConnection('offline');return;}
   if(!document.hidden){clearTimeout(timer);void poll(++generation);}
  };
  timer=setTimeout(()=>void poll(generation),ROOM_POLL_MS);window.addEventListener('online',wake);window.addEventListener('offline',wake);window.addEventListener('focus',wake);document.addEventListener('visibilitychange',wake);
  return()=>{stopped=true;++generation;clearTimeout(timer);window.removeEventListener('online',wake);window.removeEventListener('offline',wake);window.removeEventListener('focus',wake);document.removeEventListener('visibilitychange',wake);};
 },[]);
 return {enabled:Boolean(ENDPOINT),snapshot,preview,game:snapshot?.status==='playing'?snapshot.game:null,mySeat:snapshot?.mySeat??null,isHost:snapshot?.isHost??false,busy,connection,online,error,storageNotice,lastSyncedAt,hasSavedSession,savedRoomCode,canRetry:Boolean(retryRequest.current||pending.current||session.current),create,findRoom,join,start:()=>command({op:'start'}),command,refresh,retry,resumeSaved,leaveLocal};
}

export type FamilyRoomController=ReturnType<typeof useFamilyRoom>;
