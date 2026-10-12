'use client';
import {useEffect,useRef,useState} from 'react';
import FamilyBoard from './family-scene-view';
import FamilyMediaControls from './family-media-controls';
import FamilyOnlineRoom from './family-online-room';
import {useFamilyRoom,type FamilyRoomCommand} from '@/lib/use-family-room';
import {type AgeMode} from '@/lib/urban-quiz';
import {configs,animals,tiles,zones,startCity,moveCity,actCity,answerCity,finishQuiz,nextCity,canAct,wonCity,type UrbanState} from '@/lib/urban-game';
function random(max:number){const limit=Math.floor(4294967296/max)*max;const n=new Uint32Array(1);do{crypto.getRandomValues(n);}while(n[0]>=limit);return n[0]%max;}
function FamilyPlayers({players,current,started=false,mySeat}:{players:number;current?:number;started?:boolean;mySeat?:number}){
  return <div className={'city-player-map'+(started?' city-player-map-playing':'')}>
    <h3>{started?'本局玩家與角色':'先認識自己的角色'}</h3>
    {!started&&<p>先約好每位家人的玩家編號，再依照下方順序輪流操作同一台裝置。</p>}
    <ol className="city-player-cards" aria-label="玩家與角色對照">
      {animals.slice(0,players).map((animal,index)=><li key={animal} aria-current={current===index?'true':undefined}>
        <span className="city-player-number">玩家 {index+1}</span>
        <strong>{animal}{mySeat===index?'（你）':''}</strong>
        {current===index&&<span className="city-player-current"><span aria-hidden="true">▶ </span>{mySeat===undefined||mySeat===index?'輪到你':'正在行動'}</span>}
      </li>)}
    </ol>
  </div>;
}
export default function FamilyAdventure(){
const [mode,setMode]=useState<AgeMode>('little'),[players,setPlayers]=useState(2),[localGame,setGame]=useState<UrbanState|null>(null),[reset,setReset]=useState(false),[moving,setMoving]=useState(false);
const [playMode,setPlayMode]=useState<'local'|'online'>('local');
const room=useFamilyRoom();
const isOnline=playMode==='online';
const game=isOnline?room.game:localGame;
const config=configs[game?.mode??(isOnline?room.snapshot?.mode??mode:mode)];
const blocked=isOnline&&(room.busy||room.connection!=='connected'||!room.online||game?.turn!==room.mySeat);
function act(command:FamilyRoomCommand){
 if(isOnline){void room.command(command);return;}
 setGame(s=>{
  if(!s)return s;
  switch(command.op){
   case 'roll':return moveCity(s,random(6)+1);
   case 'act':return actCity(s,command.index,random(2)===0);
   case 'answer':return answerCity(s,command.index);
   case 'finishQuiz':return finishQuiz(s);
   case 'next':return nextCity(s);
   default:return s;
  }
 });
}
function restart(){
 if(isOnline){void room.command({op:'reset',confirm:true}).then(ok=>{if(ok)setReset(false);});}
 else {setGame(null);setReset(false);}
}
const sectionRef=useRef<HTMLElement>(null);
const phase=game?.phase??'setup',round=game?.round??0,turn=game?.turn??0;
const previousFocusState=useRef({phase,round,turn,reset,isOnline});
useEffect(()=>{
  const previous=previousFocusState.current;
  previousFocusState.current={phase,round,turn,reset,isOnline};
  // Skip the initial render and passive animation/hint changes.
  if(previous.phase===phase&&previous.round===round&&previous.turn===turn&&previous.reset===reset&&previous.isOnline===isOnline)return;
  if(isOnline&&game&&game.turn!==room.mySeat&&previous.turn!==room.mySeat&&previous.phase!=='setup'&&phase!=='done'&&previous.reset===reset)return;
  const section=sectionRef.current;
  if(!section)return;
  let target:HTMLElement|null=null;
  if(previous.isOnline!==isOnline)target=section.querySelector('.city-play-mode button[aria-pressed="true"]');
  else if(phase==='setup')target=isOnline?section.querySelector('[data-room-focus="lobby"]'):section.querySelector('.city-modes button[aria-pressed="true"]');
  else if(reset&&!previous.reset)target=section.querySelector('[data-game-focus="reset-cancel"]');
  else if(!reset&&previous.reset&&previous.phase===phase&&previous.round===round&&previous.turn===turn)target=section.querySelector('[data-game-focus="reset-open"]');
  else target=section.querySelector('[data-game-focus="phase"]');
  // Keep the dice action's smooth scroll to the board uninterrupted.
  target?.focus({preventScroll:previous.phase==='roll'&&phase==='choose'});
},[phase,round,turn,reset,isOnline,room.mySeat,game]);
return <section className="ak-city" ref={sectionRef}><FamilyMediaControls game={game}/><div className="city-banner"><div><span>AK 動物都市</span><h2>小小選擇，<br/>一起建造更好的城市。</h2><p>阿橙、米米、暖暖和悠悠，邀請全家一起安排預算、留好備用金。</p></div><div className="city-pass">{isOnline?'每人一台裝置，一起連線':'全家共用一台裝置'}<br/><strong>2–4 人合作</strong><span>免註冊・不用填姓名</span></div></div>{!localGame&&!room.snapshot&&<div className="city-play-mode" role="group" aria-label="選擇連線方式"><button aria-pressed={!isOnline} onClick={()=>setPlayMode('local')}>同一台裝置輪流玩</button><button aria-pressed={isOnline} onClick={()=>setPlayMode('online')}>不同手機一起玩</button></div>}{isOnline&&<FamilyOnlineRoom room={room} onBackToLocal={()=>{room.leaveLocal();setPlayMode('local');setReset(false)}}/>}{!game?isOnline?null:<><FamilyBoard positions={[0,6,12,18]} turn={0}/><div className="city-setup"><div className="city-modes" role="group" aria-label="選擇分齡模式">{(Object.keys(configs) as AgeMode[]).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}><b>{configs[m].name}</b><span>{configs[m].age}</span><small>{m==='little'?'需要、找零與分享':m==='junior'?'預算、創業與防詐':'現金流、複利與風險'}</small></button>)}</div><FamilyPlayers players={players}/><div className="city-start"><label>一起玩的家人<select value={players} onChange={e=>setPlayers(Number(e.target.value))}>{[2,3,4].map(p=><option key={p} value={p}>{p} 位家人</option>)}</select></label><div><p>{config.rounds} 輪，每人每輪行動一次。年齡是設計參考，可依孩子理解程度選擇。</p><button className="button gold-button" onClick={()=>setGame(startCity(mode,players))}>開始城市冒險</button></div></div></div></>:<><header className="city-dashboard"><span>{config.name}<b>第 {game.round}／{config.rounds} 輪</b></span><span>共同現金<b>{game.cash} 枚</b></span><span>備用金<b>{game.savings} 枚</b></span><span>學習星<b>{game.knowledge} 顆</b></span></header><div className="city-goals"><span className={game.projects.length>=2?'complete':''}>公共建設 {game.projects.length}／2</span><span className={game.savings>=config.reserve?'complete':''}>備用金 {game.savings}／{config.reserve}</span><span className={game.knowledge>=config.knowledge?'complete':''}>學習星 {game.knowledge}／{config.knowledge}</span></div><FamilyPlayers players={game.players} current={game.phase==='done'?undefined:game.turn} mySeat={isOnline?room.mySeat??undefined:undefined} started/><FamilyBoard positions={game.positions} turn={game.turn} playing projects={game.projects} onMovingChange={setMoving} reaction={game.phase==='feedback'?'celebrate':game.hint?'encourage':'wave'} reactionKey={`${game.turn}:${game.phase}:${game.message}:${game.knowledge}`}/><div className="family-play" aria-live="polite">{isOnline&&game.phase!=='done'&&<p className="city-online-turn">{game.turn===room.mySeat?'輪到你，和家人討論後再操作。':`等待玩家 ${game.turn+1} · ${animals[game.turn]}，你可以一起討論。`}</p>}<p className="family-turn">{game.phase==='done'?'全家回顧':`玩家 ${game.turn+1} · ${animals[game.turn]} 的回合`}{game.dice>0&&<span>🎲 {game.dice} 點 · {tiles[game.positions[game.turn]]}</span>}</p>{game.phase==='choose'&&<div className="city-dice-result" key={`${game.round}:${game.turn}`} aria-label={`擲骰結果 ${game.dice} 點`}><span aria-hidden="true">{['','⚀','⚁','⚂','⚃','⚄','⚅'][game.dice]}</span><div><b>前進 {game.dice} 格</b><p>{moving?'城市夥伴正在出發…':'已抵達，一起決定下一步。'}</p></div></div>}<h2 data-game-focus="phase" tabIndex={-1}>{game.quiz?game.quiz.title:game.phase==='done'?'我們的城市計畫':zones[Math.floor(game.positions[game.turn]/6)]}</h2>{(!game.quiz||game.message!==game.quiz.story)&&<p>{game.message}</p>}{game.phase==='roll'&&<button className="button gold-button family-roll" disabled={blocked} onClick={()=>{document.querySelector('.ak-city .city-view-tabs')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});act({op:'roll'});}}>🎲 擲骰子，出發</button>}{game.phase==='choose'&&<div className="family-choices" aria-busy={moving}><p className="city-decision-guide">先討論：這筆支出解決什麼需要？做完之後，還留得下備用金嗎？</p>{moving&&<p role="status">棋子正在逐格前進…</p>}{game.choices.map((choice,i)=><button key={choice.action} disabled={blocked||moving||!canAct(game,choice)} onClick={()=>act({op:'act',index:i})}>{choice.label}<small>{choice.action==='project'?`現金 ${game.cash} → ${Math.max(0,game.cash-config.project)} 枚；建設不會自動賺錢。`:choice.action==='save'?`現金 ${game.cash} → ${Math.max(0,game.cash-4)}；備用金 ${game.savings} → ${game.savings+4}；總資金不變。`:choice.action==='withdraw'?`從備用金取回 4 枚；總資金不變。`:choice.action==='quiz'?'一起解釋原因，答錯不扣錢。':choice.action==='rest'?'保留現金，不扣學習星。':choice.action==='work'?'完成約定任務後，現金增加 6 枚。':'遊戲風險示例，可以不參加。'}</small>{!canAct(game,choice)&&<small>{choice.action==='withdraw'?'備用金不足':game.projects.includes(choice.amount??-1)&&choice.action==='project'?'已完成這項建設':'現金不足，先選其他行動'}</small>}</button>)}</div>}{game.quiz&&<div className="city-quiz"><p>{game.quiz.story}</p>{game.phase==='quiz'&&<div className="family-choices">{game.quiz.options.map((option,i)=><button key={option} disabled={blocked} onClick={()=>act({op:'answer',index:i})}>{String.fromCharCode(65+i)}. {option}</button>)}</div>}{game.hint&&game.phase==='quiz'&&<p className="city-explanation"><b>一起想想：</b>{game.quiz.talk}</p>}{game.phase==='feedback'&&<div className="city-explanation"><p><b>為什麼？</b>{game.quiz.why}</p><p><b>聊一聊：</b>{game.quiz.talk}</p><button className="button primary" disabled={blocked} onClick={()=>act({op:'finishQuiz'})}>我們聊好了</button></div>}</div>}{game.phase==='next'&&<button className="button primary" disabled={blocked} onClick={()=>act({op:'next'})}>{game.turn===game.players-1?game.round===config.rounds?'結算最後一輪':'結算這一輪':'換下一位家人'}</button>}{game.phase==='done'&&<div className={'family-review city-finale '+(wonCity(game)?'city-finale-won':'')}><div className="city-medal" aria-hidden="true">{wonCity(game)?'🏆':'🌱'}</div><h3>{wonCity(game)?'城市守護隊，共同計畫完成！':'城市冒險完成，一起帶走新發現'}</h3><p>{wonCity(game)?'你們一起安排建設、保留備用金，也累積了學習星。每位家人的選擇都讓城市向前一步。':'這次的選擇留下了經驗。看看哪個目標已完成，再一起想想下次的計畫。'}</p><div className="city-achievements"><span>{game.projects.length>=2?'✓':'○'} 社區建造者：{game.projects.length}／2 項建設</span><span>{game.savings>=config.reserve?'✓':'○'} 預備金守護者：{game.savings}／{config.reserve} 枚</span><span>{game.knowledge>=config.knowledge?'✓':'○'} 共學探索者：{game.knowledge}／{config.knowledge} 顆學習星</span></div><p>完成建設：{game.projects.map(p=>tiles[p]).join('、')||'下次一起規劃'}。</p><p>現金 {game.cash} 枚 + 備用金 {game.savings} 枚 = 可用資金 {game.cash+game.savings} 枚。</p><ol><li>哪個選擇最符合全家的計畫？</li><li>如果重玩，你會調整哪筆支出？</li><li>本週要練習記帳、存錢，還是查證訊息？</li></ol>{isOnline?<p>由房主按下「重新設定遊戲」，全家可回房間大廳再玩一局。</p>:<button className="button gold-button" onClick={restart}>重新選擇模式</button>}</div>}</div><details className="family-record"><summary>查看收支與學習紀錄</summary><ul>{game.log.map((line,i)=><li key={i}>{line}</li>)}</ul>{!game.log.length&&<p>第一次行動後會留下紀錄。</p>}</details>{(!isOnline||room.isHost)&&<div className="family-reset">{reset?<><p>{isOnline?'要結束所有玩家的這一局，回到房間大廳嗎？':'要結束這局並回到設定嗎？'}</p><button disabled={isOnline&&(room.busy||room.connection!=='connected')} onClick={restart}>確認重新開始</button><button data-game-focus="reset-cancel" onClick={()=>setReset(false)}>繼續這局</button></>:<button data-game-focus="reset-open" onClick={()=>setReset(true)}>重新設定遊戲</button>}</div>}</>}<details className="city-rules"><summary>先看玩法與收支規則</summary><ol><li>一輪是每位家人各行動一次，共同錢包、一起達成三個目標。</li><li>擲骰後選一個行動。建設隊可跨區施工，因此各格也能安排下一項公共建設。</li><li>每輪結算工作收入 {config.income} 枚、生活支出 {config.expense} 枚。經過起點不重複領錢。</li><li>存取備用金只是移動金錢，沒有自動利息。答題成功得一顆學習星，不增加金幣。</li><li>進階版工坊可試作：成本 4 枚，50% 收入 6 枚、50% 收入 0 枚；可不參加。這是風險示例，不是真實投資。</li><li>每個模式有 12 題。本局答過的題目不重複；答錯可看提示再試。</li><li>{isOnline?'連線房間有效 6 小時。同一瀏覽器可恢復席位；關閉網頁不會釋放角色，輪到離線家人時請等待他返回。':'同裝置模式重新整理會重設本局。'}可用收支紀錄回顧。</li></ol></details><p className="family-note">金幣是遊戲代幣。這是親子共學遊戲，不是財務、職涯或學習成效測驗。建議家長陪玩。</p></section>}


