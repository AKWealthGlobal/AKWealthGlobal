'use client';
import {useEffect,useRef,useState} from 'react';
import type {UrbanState} from '@/lib/urban-game';
export default function FamilyMediaControls({game}:{game:UrbanState|null}){
 const [sound,setSound]=useState(false),[music,setMusic]=useState(false),[speaking,setSpeaking]=useState(false),[notice,setNotice]=useState('');
 const context=useRef<AudioContext|null>(null),previous=useRef('');
 const openAudio=()=>{try{const Audio=window.AudioContext||(window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext;if(!Audio)throw new Error();if(!context.current)context.current=new Audio();void context.current.resume().catch(()=>setNotice('這台裝置暫時無法播放音效。'));return context.current;}catch{setNotice('這台裝置不支援音效，仍可正常遊玩。');return null;}};
 const tone=(frequencies:number[],volume=.045)=>{const c=context.current;if(!c||c.state!=='running')return;frequencies.forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain(),start=c.currentTime+i*.12;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(volume,start+.015);g.gain.exponentialRampToValueAtTime(.001,start+.25);o.connect(g);g.connect(c.destination);o.start(start);o.stop(start+.27);});};
 useEffect(()=>{const key=game?`${game.round}:${game.turn}:${game.phase}:${game.message}`:'setup';if(previous.current!==key&&sound&&game){if(game.phase==='choose')tone([220,294,330]);else if(game.phase==='feedback')tone([523,659,784]);else if(game.phase==='done')tone([392,523,659,784]);else if(game.phase==='next')tone(game.message.includes('完成「')?[523,659,784,1047]:[330,392]);}previous.current=key;},[game?.phase,game?.message,game?.round,game?.turn,sound]);
 useEffect(()=>{if(!music)return;let i=0;const notes=[262,330,392,330,294,349,440,349];const timer=setInterval(()=>{if(!document.hidden)tone([notes[i++%notes.length]],.018);},1200);return()=>clearInterval(timer);},[music]);
 useEffect(()=>()=>{void context.current?.close();if('speechSynthesis' in window)window.speechSynthesis.cancel();},[]);
 const read=()=>{
  if(!('speechSynthesis' in window)){setNotice('這台裝置不支援朗讀，請由家長閱讀畫面文字。');return;}
  if(speaking){speechSynthesis.cancel();setSpeaking(false);return;}
  const text=game?.quiz?`${game.quiz.title}。${game.quiz.story}。${game.quiz.options.map((s,i)=>`${String.fromCharCode(65+i)}，${s}`).join('。')}`:game?`${game.message}。共同現金 ${game.cash} 枚，備用金 ${game.savings} 枚。`:'歡迎來到 AK 動物都市。二到四位家人共用錢包，一起安排預算、保留備用金，完成兩項公共建設。';
  speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='zh-TW';utterance.rate=.9;const voice=speechSynthesis.getVoices().find(v=>v.lang==='zh-TW')??speechSynthesis.getVoices().find(v=>v.lang.startsWith('zh'));if(voice)utterance.voice=voice;
  utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>{setSpeaking(false);setNotice('朗讀未能完成，可再次點選或由家長閱讀。');};setSpeaking(true);speechSynthesis.speak(utterance);
 };
 return <div className="family-media"><button aria-pressed={sound} onClick={()=>{if(!sound&&openAudio())tone([523]);setSound(v=>!v);}}>音效：{sound?'開啟':'關閉'}</button><button aria-pressed={music} onClick={()=>{if(!music)openAudio();setMusic(v=>!v);}}>背景音樂：{music?'開啟':'關閉'}</button><button onClick={read}>{speaking?'停止朗讀':'家長朗讀'}</button><span>聲音預設關閉，點選後才播放。</span>{notice&&<p role="status">{notice}</p>}</div>;
}
