export type Mode='starter'|'explorer';
export type Choice={label:string;action:'work'|'save'|'withdraw'|'buy'|'want'|'wait'|'risk';amount?:number;goal?:number;explanation:string};
export type GameState={mode:Mode;players:number;positions:number[];turn:number;round:number;cash:number;savings:number;goals:boolean[];phase:'roll'|'choose'|'next'|'done';dice:number;choices:Choice[];title:string;message:string;log:string[];decisions:number};
export const tileNames=['出發廣場','幫忙整理','需要與想要','日常採買','小小修繕','一起工作','儲蓄站','等一等','目標清單','備用金','閱讀休息','時間累積','創作工坊','材料預算','合作採買','成果分享','意外支出','檢查計畫','森林書屋','社區任務','生活選擇','補充物資','風險觀察','回家分享'];
export const goalNames=['閱讀坐墊','修好書屋屋頂','補齊故事書'];
export const costs=(mode:Mode)=>mode==='starter'?[6,8,10]:[8,10,12];
export const rounds=(mode:Mode)=>mode==='starter'?6:8;
export function initialGame(mode:Mode,players:number):GameState{return {mode,players,positions:Array(players).fill(0),turn:0,round:1,cash:mode==='starter'?16:20,savings:0,goals:[false,false,false],phase:'roll',dice:0,choices:[],title:'一起修好森林書屋',message:'先討論：哪些物品要先準備？留多少金幣應付意外？',log:[],decisions:0};}
const wait:Choice={label:'先保留金幣',action:'wait',explanation:'保留資金也是一種選擇。說說你正在等待什麼。'};
export function rollGame(s:GameState,dice:number):GameState{
 if(s.phase!=='roll'||!Number.isInteger(dice)||dice<1||dice>6)return s;
 const positions=[...s.positions];positions[s.turn]=(positions[s.turn]+dice)%24;const tile=positions[s.turn];let cash=s.cash+2;let message='本回合完成社區值日，共同錢包增加 2 枚。';let choices:Choice[]=[];
 if([1,5,19].includes(tile)){choices=[{label:'幫忙完成任務，領 3 枚',action:'work',amount:3,explanation:'付出時間與努力，完成任務後取得報酬。'},wait];}
 else if([6,7,9,11].includes(tile)){choices=[{label:'存入 2 枚備用金',action:'save',amount:2,explanation:'這筆錢仍屬於我們，只是先留給未來。'},{label:'取回 2 枚備用金',action:'withdraw',amount:2,explanation:'目標或情況改變時，可以重新安排自己的錢。'},wait];}
 else if([16,22].includes(tile)){const expense=2;const fromSavings=Math.min(s.savings,expense);const fromCash=Math.min(cash,expense-fromSavings);message+=` 書屋需要修補工具，支出 ${fromSavings+fromCash} 枚，先使用 ${fromSavings} 枚備用金。`;return {...s,positions,dice,cash:cash-fromCash,savings:s.savings-fromSavings,phase:'next',title:tileNames[tile],message:message+' 預先留下餘裕，能讓遇到意外時更從容。',choices:[],log:[message,...s.log].slice(0,30)};}
 else if([12,13,15].includes(tile)&&s.mode==='explorer'){choices=[{label:'接明確任務，取得 2 枚',action:'work',amount:2,explanation:'先看清要做的事與約定，再開始工作。'},{label:'花 3 枚試做作品（可能成功或失敗）',action:'risk',amount:3,explanation:'這次試作可能沒有回收，先想想是否能承受支出。'},wait];}
 else {choices=s.goals.flatMap((done,i)=>done?[]:[{label:`準備${goalNames[i]}，花 ${costs(s.mode)[i]} 枚`,action:'buy' as const,goal:i,amount:costs(s.mode)[i],explanation:'先依共同目標安排支出，準備一項物品就少一件待辦。'}]);choices.push({label:'買裝飾貼紙，花 2 枚',action:'want',amount:2,explanation:'喜歡的東西也有價值；這次花費會讓目標可用的錢少 2 枚。'},wait);}
 return {...s,positions,dice,cash,phase:'choose',title:tileNames[tile],message,choices};
}
export function canChoose(s:GameState,c:Choice){if(s.phase!=='choose')return false;if(c.action==='withdraw')return s.savings>=(c.amount||0);if(['save','buy','want','risk'].includes(c.action))return s.cash>=(c.amount||0)&&!(c.action==='buy'&&s.goals[c.goal!]);return true;}
export function chooseGame(s:GameState,index:number,riskSuccess:boolean):GameState{const c=s.choices[index];if(!c||!canChoose(s,c))return s;let cash=s.cash,savings=s.savings,goals=[...s.goals],outcome=c.explanation;const amount=c.amount||0;
 if(c.action==='work')cash+=amount;
 if(c.action==='save'){cash-=amount;savings+=amount;}
 if(c.action==='withdraw'){cash+=amount;savings-=amount;}
 if(c.action==='buy'){cash-=amount;goals[c.goal!]=true;}
 if(c.action==='want')cash-=amount;
 if(c.action==='risk'){cash-=amount;if(riskSuccess){cash+=5;outcome='作品試作成功，收到 5 枚，扣除成本後增加 2 枚。這是遊戲情境，現實結果沒有保證。';}else outcome='作品試作沒有收到報酬，已花的 3 枚無法取回。我們可以檢查原因，調整下一次的計畫。';}
 const message=c.label+'。'+outcome;return {...s,cash,savings,goals,phase:'next',choices:[],message,decisions:s.decisions+1,log:[message,...s.log].slice(0,30)};
}
export function nextGame(s:GameState):GameState{if(s.phase!=='next')return s;const endRound=s.turn===s.players-1;if(endRound&&s.round===rounds(s.mode))return {...s,phase:'done',title:'一起回顧今天的選擇',message:s.goals.every(Boolean)&&s.savings>=4?'書屋準備完成，也留了備用金！':'這次仍有可以調整的地方。一起看看哪些選擇幫助了目標。'};const bonus=endRound&&s.savings>=4?1:0;return {...s,turn:(s.turn+1)%s.players,round:s.round+(endRound?1:0),savings:s.savings+bonus,phase:'roll',choices:[],title:'換下一位家人',message:bonus?'回合結束，備用金達到 4 枚，獲得 1 枚遊戲耐心獎勵。這不是銀行利息。':'輪流擲骰，先跟家人說說這一回合的計畫。'};}
