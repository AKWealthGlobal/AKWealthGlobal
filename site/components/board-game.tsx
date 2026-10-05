'use client';import {useState} from 'react';import {Dices,PiggyBank,RotateCcw} from 'lucide-react';import Board3D from './board-3d';
type Square={type:'start'|'save'|'spend'|'share'|'chance';text?:string;amount?:number;kind?:string};
const squares:Square[]=[{type:'start'},
{type:'save',text:'幫忙澆花，媽媽給你 1 枚金幣。',amount:1},{type:'spend',text:'文具店有閃亮的貼紙，一張 1 枚金幣。',amount:1},{type:'share',text:'同學忘了帶點心，看起來肚子好餓。',kind:'分一半自己的點心'},{type:'chance'},
{type:'save',text:'把玩具收拾整齊，得到 1 枚金幣。',amount:1},{type:'spend',text:'夜市有好玩的撈魚，一次 1 枚金幣。',amount:1},{type:'share',text:'社區圖書角在募集故事書。',kind:'捐一本看完的書'},{type:'chance'},
{type:'save',text:'幫鄰居遛狗，得到 2 枚金幣。',amount:2},{type:'spend',text:'口好渴，一瓶果汁要 1 枚金幣。',amount:1},{type:'share',text:'弟弟的鉛筆斷了，他很著急。',kind:'借他一支鉛筆'},{type:'chance'},
{type:'save',text:'整理舊衣服，家人給你 1 枚金幣。',amount:1},{type:'spend',text:'書店有一本新漫畫，要 2 枚金幣。',amount:2},{type:'share',text:'好朋友生病請假了。',kind:'畫一張早日康復卡片'}];
const types=squares.map(s=>s.type);
const chances:{text:string;pocket:number}[]=[{text:'奶奶給你 2 枚金幣，鼓勵你認真上課。',pocket:2},{text:'撿到同學掉的錢包，你交給了老師。老師說你很誠實！',pocket:0},{text:'跳蚤市場賣掉一個舊玩具，得到 1 枚金幣。',pocket:1},{text:'不小心弄壞同學的尺，要賠 1 枚金幣。',pocket:-1},{text:'下雨了，出遊改成在家玩桌遊，省下 1 枚金幣。',pocket:1}];
const label:Record<Square['type'],string>={start:'起點',save:'存錢格',spend:'花費格',share:'分享格',chance:'機會格'};const short:Record<Square['type'],string>={start:'起',save:'存',spend:'花',share:'享',chance:'★'};
const GOAL=5,LAPS=2,START_POCKET=3;
type Wallet={pocket:number;saved:number;spent:number;shared:number;kind:number};
type Choice={label:string;ok:boolean;apply:(w:Wallet)=>Wallet;note:string};
const choicesFor=(s:Square,w:Wallet):Choice[]=>{const a=s.amount??1;
if(s.type==='save')return [{label:`存進存錢罐（+${a}）`,ok:true,apply:w=>({...w,saved:w.saved+a}),note:'存錢罐又多了一點！'},{label:`放進口袋（+${a}）`,ok:true,apply:w=>({...w,pocket:w.pocket+a}),note:'口袋的金幣，之後也可以再存起來。'}];
if(s.type==='spend')return [{label:`買（口袋 −${a}）`,ok:w.pocket>=a,apply:w=>({...w,pocket:w.pocket-a,spent:w.spent+a}),note:'買到喜歡的東西了。'},{label:'先不買',ok:true,apply:w=>w,note:'等一等，也是一種選擇。'}];
return [{label:'分享 1 枚金幣',ok:w.pocket>=1,apply:w=>({...w,pocket:w.pocket-1,shared:w.shared+1}),note:'你的心意幫到別人了。'},{label:s.kind!,ok:true,apply:w=>({...w,kind:w.kind+1}),note:'不用花錢，也能送出心意。'}]};
const fresh:Wallet={pocket:START_POCKET,saved:0,spent:0,shared:0,kind:0};
export default function BoardGame(){const [on,setOn]=useState(false);const [failed,setFailed]=useState(false);const [pos,setPos]=useState(0);const [lap,setLap]=useState(1);const [w,setW]=useState<Wallet>(fresh);const [dice,setDice]=useState<number|null>(null);const [event,setEvent]=useState<{sq:Square;card?:typeof chances[number]}|null>(null);const [note,setNote]=useState('');const [over,setOver]=useState(false);
const roll=()=>{const d=1+Math.floor(Math.random()*6);setDice(d);setNote('');const next=pos+d;if(next>=16&&lap>=LAPS){setPos(0);setOver(true);setEvent(null);return}if(next>=16)setLap(lap+1);const p=next%16;setPos(p);const sq=squares[p];if(sq.type==='start'){setEvent(null);setNote('回到起點，繼續下一圈！');return}setEvent({sq,card:sq.type==='chance'?chances[Math.floor(Math.random()*chances.length)]:undefined})};
const choose=(c:Choice)=>{setW(c.apply(w));setNote(c.note);setEvent(null)};
const takeCard=(pocket:number)=>{setEvent(null);if(pocket>=0){setW({...w,pocket:w.pocket+pocket});setNote('');return}if(w.pocket>0){setW({...w,pocket:w.pocket-1});setNote('')}else if(w.saved>0){setW({...w,saved:w.saved-1});setNote('口袋沒有金幣，只好從存錢罐拿出 1 枚。')}else setNote('口袋和存錢罐都空空的，好好跟對方道歉也很重要。')};
const deposit=()=>{setW({...w,pocket:w.pocket-1,saved:w.saved+1});setNote('放了 1 枚到存錢罐。')};
const restart=()=>{setPos(0);setLap(1);setW(fresh);setDice(null);setEvent(null);setNote('');setOver(false)};
if(!on)return <div className="island-box"><div className="island-intro"><span className="tag">遊戲二 · 3D 棋盤</span><h2>存存環島大冒險</h2><p>擲骰子繞島兩圈，每一格都是一個小選擇。<br/>回到起點時，存錢罐有 {GOAL} 枚金幣，就能買到夢想禮物。</p><button className="button gold-button" onClick={()=>setOn(true)}>開始冒險</button></div></div>;
return <div className="board-game"><div className="island-box">{!failed&&<Board3D types={types} pos={pos} onFail={()=>setFailed(true)}/>}{failed&&<p className="notice">這台裝置暫時無法顯示 3D，下方的格子路線一樣可以玩。</p>}
<ol className="track" aria-label="棋盤路線">{squares.map((s,i)=><li key={i} className={'cell '+s.type+(i===pos?' here':'')} aria-current={i===pos?'step':undefined}><span aria-hidden="true">{short[s.type]}</span><span className="sr-only">{`第 ${i+1} 格，${label[s.type]}`}</span></li>)}</ol><p className="small muted legend">起＝起點　存＝存錢格　花＝花費格　享＝分享格　★＝機會格</p></div>
<div className="wallet" aria-live="polite"><span>第 <b>{Math.min(lap,LAPS)}</b> / {LAPS} 圈</span><span>口袋 <b>{w.pocket}</b></span><span>存錢罐 <b>{w.saved}</b> / {GOAL}</span></div>
{!over&&<div className="board-actions"><button className="button gold-button" onClick={roll} disabled={!!event}><Dices size={22}/>{dice===null?'擲骰子':'再擲一次'}</button><button className="button secondary" onClick={deposit} disabled={w.pocket===0||!!event}><PiggyBank size={20}/>口袋 1 枚存進存錢罐</button></div>}
{dice!==null&&!over&&<p className="dice-result" aria-live="polite">擲出 <b>{dice}</b> 點，走到第 {pos+1} 格：{label[squares[pos].type]}</p>}
{event&&<div className="event-card" role="dialog" aria-label={label[event.sq.type]}><span className={'tag event-'+event.sq.type}>{label[event.sq.type]}</span>{event.card?<><p>{event.card.text}</p><button className="button primary" onClick={()=>takeCard(event.card!.pocket)}>知道了</button></>:<><p>{event.sq.text}</p><div className="event-choices">{choicesFor(event.sq,w).map(c=><button key={c.label} className="button secondary" disabled={!c.ok} onClick={()=>choose(c)}>{c.label}</button>)}</div>{choicesFor(event.sq,w).some(c=>!c.ok)&&<p className="small">口袋的金幣不夠，可以選另一個方式。</p>}</>}</div>}
{note&&!event&&!over&&<p className="board-note" role="status">{note}</p>}
{over&&<div className="completion" role="status"><h3>{w.saved>=GOAL?'環島完成，買到夢想禮物了！':`環島完成！存錢罐還差 ${GOAL-w.saved} 枚。`}</h3><p>這一輪：存錢罐 {w.saved} 枚、花費 {w.spent} 枚、分享 {w.shared} 枚、不花錢的心意 {w.kind} 次，口袋還有 {w.pocket} 枚。</p><p>{w.saved>=GOAL?'跟家人說說：哪一次選擇，讓你最快存到目標？':w.saved+w.pocket>=GOAL?`口袋還有 ${w.pocket} 枚！如果早一點存進存錢罐，就買得到了。下次記得邊走邊存。`:'想一想：哪幾次的選擇，可以讓存錢罐多一點？再玩一次試試看。'}</p><button className="button primary" onClick={restart}>再玩一次<RotateCcw size={18}/></button></div>}
<p className="small muted">骰子點數隨機，每一局都不一樣。學習用的虛擬金幣，不涉及金錢交易，也不記錄任何資料。</p></div>}
