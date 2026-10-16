// Ken 財商教室試算表：欄位定義與計算邏輯（純函式，網頁與測試共用）
// 通膨假設：台灣個人／家庭通膨每年 10% 起跳，低於 10% 一律以 10% 計算。

export const MIN_INFLATION=10;
export const REVIEWED='2026-10-16';

export type Cell=number|string;
export type Row=Record<string,Cell>;
export type Field={key:string;label:string;def:Cell;unit?:string;step?:number;min?:number;max?:number;type?:'number'|'text'|'date'|'select';options?:string[];hint?:string;wide?:boolean};
export type RowSpec={key:string;label:string;fields:Field[];defaults:Row[];addLabel?:string};
export type Vals=Record<string,Cell|Row[]>;
export type Out={label:string;value:string;tone?:'key'|'good'|'warn'|'bad';hint?:string};
export type Table={caption:string;head:string[];rows:string[][];tones?:(Out['tone']|undefined)[]};
export type Result={outs:Out[];tables?:Table[];notes?:string[]};
export type Ctx={inflation:number;today:Date};
export type Tool={id:string;group:GroupId;title:string;need:string;source?:string;fields:Field[];rows?:RowSpec[];compute:(v:Vals,c:Ctx)=>Result};
export type GroupId='basics'|'seniors'|'white'|'blue'|'business'|'sales';

export type Group={id:GroupId;title:string;short:string;core:string;maslow:string;pestle:string;tier:string;file:string;sheets:string[]};

export const groups:Group[]=[
 {id:'basics',title:'財商基礎｜先看懂自己的位置',short:'財商基礎',core:'時間換金錢的真相、個人通膨、預算比例與開支縮減',maslow:'安全需求：先確認自己撐得了多久，再談成長與自我實現。',pestle:'經濟：物價與房租上漲侵蝕購買力；社會：比較心理推高生活開銷。',tier:'用淨資產對照十個財富等級，找到現在的位置與下一個目標。',file:'ken-basics.xlsx',sheets:['時薪真相','財務階段','個人通膨','薪資分配','開支縮減','存款vs資產','行動計畫']},
 {id:'seniors',title:'熟齡退休｜資產保全與醫療風險',short:'熟齡退休',core:'資產保全、穩定現金流、醫療與長照風險控管',maslow:'聚焦「安全需求」（健康、財務穩定）與「自我實現／超越需求」（資產傳承、人生圓滿）。',pestle:'經濟：通膨侵蝕購買力；社會：高齡化與少子化造成照護人力短缺；法律：遺產稅法與長照法規。',tier:'多希望晚年維持在「小康（第五等）」至「普通（第六等）」，避免因重大傷病落入「中低產（第七等）」以下。',file:'ken-seniors.xlsx',sheets:['退休提領','長照醫療','保單總表','簡易收支','遺產贈與稅']},
 {id:'white',title:'白領上班族｜薪資放大與資產累積',short:'白領上班族',core:'薪資放大、債務清償、資產累積與節稅',maslow:'遊走於「安全需求」（財務獨立）與「尊重／社交需求」（職場晉升、同儕生活品質比較）。',pestle:'經濟：利率影響房貸、股市波動；科技：遠距與 AI 提高生產力標準；社會：晚婚與雙薪無孩（DINK）趨勢。',tier:'多為「小康（第五等）」的專業人士或雙薪家庭，目標晉升「中高產（第四等）」。',file:'ken-white-collar.xlsx',sheets:['FIRE路徑','XIRR報酬','貸款還本','綜所稅','再平衡']},
 {id:'blue',title:'藍領職人｜權益保障與緊急預備金',short:'藍領職人',core:'加班權益、生存底線、技能轉型',maslow:'核心在「生理需求」（基本溫飽）與「安全需求」（工作保障、職災防護、緊急預備金）。',pestle:'經濟：物價上漲、實質薪資停滯；法律：勞基法工時與工安法規；科技：AI 與自動化取代基層勞動的風險。',tier:'多處於「普通（第六等）」至「低收入（第八等）」，面臨房貸或租屋壓力。',file:'ken-blue-collar.xlsx',sheets:['加班費','預備金水庫','證照投資']},
 {id:'business',title:'企業公司｜現金流與利潤',short:'企業公司',core:'現金流健康、利潤極大化、營運成本與碳費衝擊',maslow:'組織視角：底層是生存（正向現金流），中層是歸屬與尊重（文化與市佔），頂層是自我實現（ESG 與產業領導）。',pestle:'政治：關稅與貿易戰；經濟：供應鏈成本；環境：淨零碳排；法律：勞動與資安法規。',tier:'創辦人或大股東多為「富豪（第二等）」至「富裕（第三等）」。',file:'ken-business.xlsx',sheets:['滾動現金流','損益兩平','多維度損益','員工產值','碳費試算']},
 {id:'sales',title:'直銷經營｜獎金、回購與真實利潤',short:'直銷經營',core:'獎金試算、客戶回購、庫存與行銷成本',maslow:'集中在「尊重需求」（晉升聘階、團隊認可）與「自我實現」（財富自由）。',pestle:'社會：人際網絡與社群信任；科技：社群演算法與線上工具；經濟：獎金制度與消費降級。',tier:'多從「中低產（第七等）」或「低收入（第八等）」起步，期望躍升「中高產（第四等）」以上。',file:'ken-direct-sales.xlsx',sheets:['獎金晉升','回購CRM','進銷存','行銷ROI','組織成長']},
];

export const tiers:{rank:string;name:string;min:number;life:string}[]=[
 {rank:'第一等',name:'極富裕',min:100e8,life:'私人飛機、遊艇、家族基金會，全球物業'},
 {rank:'第二等',name:'富豪',min:20e8,life:'企業集團創辦人、上市公司大股東'},
 {rank:'第三等',name:'富裕',min:5e8,life:'成功企業家、高階專業人士，擁有多處資產'},
 {rank:'第四等',name:'中高產',min:1e8,life:'中小企業主、資深經理人、投資成功者'},
 {rank:'第五等',name:'小康',min:2000e4,life:'專業人士、穩定雙薪家庭、積極投資'},
 {rank:'第六等',name:'普通',min:500e4,life:'穩定受薪、小型自營，自住舊公寓或貸款新房'},
 {rank:'第七等',name:'中低產',min:100e4,life:'一般受薪、臨時工，無房產或高額房貸'},
 {rank:'第八等',name:'低收入',min:0,life:'低薪、不穩定收入，廉價租房、大眾交通'},
 {rank:'第九等',name:'貧困',min:-500e4,life:'負債累累，生活困難，依賴補助'},
 {rank:'第十等',name:'赤貧',min:-Infinity,life:'破產、嚴重債務'},
];
export function tierOf(net:number){return tiers.find(t=>net>=t.min)||tiers[tiers.length-1]}

// ---------- helpers ----------
const num=(v:Vals,k:string)=>{const x=Number(v[k]);return Number.isFinite(x)?x:0};
const str=(v:Vals,k:string)=>String(v[k]??'');
const rows=(v:Vals,k:string)=>(Array.isArray(v[k])?v[k]:[]) as Row[];
const rn=(r:Row,k:string)=>{const x=Number(r[k]);return Number.isFinite(x)?x:0};
export function money(x:number){if(!Number.isFinite(x))return '—';const s=(x<0?'−':'')+'NT$ '+Math.round(Math.abs(x)).toLocaleString('zh-TW');return Math.abs(x)>=1e6?`${s}（約 ${(x/1e4).toLocaleString('zh-TW',{maximumFractionDigits:0})} 萬）`:s}
export function short(x:number){if(!Number.isFinite(x))return '—';return Math.abs(x)>=1e5?(x/1e4).toLocaleString('zh-TW',{maximumFractionDigits:1})+' 萬':Math.round(x).toLocaleString('zh-TW')}
export const pct=(x:number,d=1)=>Number.isFinite(x)?(x*100).toFixed(d)+'%':'—';
const yrs=(x:number)=>Number.isFinite(x)?(x>=100?'100 年以上':x.toFixed(1)+' 年'):'無法達成';
const months=(x:number)=>Number.isFinite(x)?(x>=1200?'超過 100 年':Math.ceil(x)+' 個月'):'無法還清';
export function infl(c:Ctx){return Math.max(MIN_INFLATION,c.inflation)/100}
// 每年支出 M×12，逐年依通膨成長，共 n 年的名目總額
function growSum(monthly:number,n:number,i:number){if(n<=0)return 0;const whole=Math.floor(n),frac=n-whole;let s=0;for(let t=0;t<whole;t++)s+=monthly*12*Math.pow(1+i,t);s+=monthly*12*frac*Math.pow(1+i,whole);return s}
function nper(rate:number,pay:number,pv:number){if(pay<=0)return Infinity;if(rate===0)return pv/pay;if(pay<=pv*rate)return Infinity;return -Math.log(1-pv*rate/pay)/Math.log(1+rate)}
function pmt(rate:number,n:number,pv:number){if(n<=0)return 0;return rate===0?pv/n:pv*rate/(1-Math.pow(1+rate,-n))}
function fvAnnuity(rate:number,n:number,pay:number){return rate===0?pay*n:pay*(Math.pow(1+rate,n)-1)/rate}
function progressive(x:number,brackets:[number,number][]){let tax=0,prev=0;for(const [cap,rate] of brackets){if(x<=prev)break;tax+=(Math.min(x,cap)-prev)*rate;prev=cap}return Math.max(0,tax)}
const day=86400000;
function parseDate(s:Cell){const d=new Date(String(s)+'T00:00:00');return isNaN(d.getTime())?null:d}
const fmtDate=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const inflNote=(c:Ctx)=>`通膨以每年 ${pct(infl(c),0)} 計算（本工具假設台灣個人通膨 10% 起跳）。`;

const nameRow=(label='項目'):Field=>({key:'name',label,def:'',type:'text',wide:true});
const valRow=(label='金額',unit='元'):Field=>({key:'value',label,def:0,unit});

// ---------- tools ----------
export const tools:Tool[]=[
// ===== 財商基礎 =====
{id:'hours',group:'basics',title:'時薪真相與財富等級',need:'把工作至今的總工時和淨資產放在一起：每工作 1 小時，究竟替自己留下多少錢？再對照十個財富等級。',source:'改寫自「時間換金錢」練習',
 fields:[{key:'years',label:'已工作年數（扣除失業、育嬰等）',def:20,unit:'年'},{key:'week',label:'平均每週工時',def:45,unit:'小時'}],
 rows:[{key:'assets',label:'資產：如果今天全部變賣，能換多少錢？',fields:[nameRow('資產'),valRow('估計價值')],defaults:[{name:'房地產（自住、套房、土地）',value:12000000},{name:'汽機車',value:400000},{name:'存款、股票、基金、保單價值',value:1500000},{name:'家具家電、3C、收藏',value:100000}],addLabel:'新增資產'},
  {key:'debts',label:'負債：所有還沒還完的錢',fields:[nameRow('負債'),valRow('尚欠金額')],defaults:[{name:'房貸',value:7000000},{name:'車貸',value:200000},{name:'信用卡、分期',value:0},{name:'信貸、學貸、親友借款',value:0}],addLabel:'新增負債'}],
 compute(v,c){const A=rows(v,'assets').reduce((s,r)=>s+rn(r,'value'),0),D=rows(v,'debts').reduce((s,r)=>s+rn(r,'value'),0),net=A-D,h=num(v,'years')*52*num(v,'week'),per=h>0?net/h:NaN,t=tierOf(net),i=infl(c),idx=tiers.indexOf(t),next=idx>0?tiers[idx-1]:null;
  return {outs:[{label:'淨資產',value:money(net),tone:'key'},{label:'工作至今總工時',value:Math.round(h).toLocaleString('zh-TW')+' 小時'},{label:'每工作 1 小時留下的淨資產',value:Number.isFinite(per)?money(per):'—',tone:per<196?'bad':'key',hint:'對照 2026 年基本工資時薪 NT$196'},{label:'目前財富等級',value:`${t.rank}：${t.name}`,tone:'key',hint:t.life},{label:next?`距離${next.rank}「${next.name}」`:'已在最高等級',value:next?money(next.min-net):'—'},{label:'若淨資產不增加，10 年後的實質購買力',value:money(net/Math.pow(1+i,10)),tone:'warn'}],
   tables:[{caption:'台灣財富淨資產 10 等級對照',head:['等級','淨資產範圍','生活樣貌'],rows:tiers.map((x,k)=>[`${x.rank} ${x.name}`,k===0?'> 100 億':k===tiers.length-1?'< 負 500 萬':`${short(x.min)} ～ ${short(tiers[k-1].min)}`,x.life]),tones:tiers.map(x=>x===t?'key':undefined)}],
   notes:['只靠時間換金錢，收入會隨體力與工時封頂；這個數字幫你判斷是否需要第二收入或收入型資產。',inflNote(c)]}}},
{id:'stages',group:'basics',title:'財務階段與資本缺口',need:'假設從今天起不再有工作收入，你的資本能撐多久？從「財務安全」到「財務傳承」，每一階需要多少錢（含通膨）。',source:'改寫自「財務旅程」練習',
 fields:[{key:'monthly',label:'每月基本生活開銷（今日幣值）',def:40000,unit:'元'},{key:'dream',label:'理想生活每月所需',def:80000,unit:'元'},{key:'capital',label:'現在可動用的資本',def:2000000,unit:'元'},{key:'life',label:'預計還會活幾年',def:30,unit:'年'},{key:'save',label:'目前每年能存下',def:200000,unit:'元'},{key:'legacy',label:'想留給家人或公益（今日幣值）',def:5000000,unit:'元'}],
 compute(v,c){const i=infl(c),M=num(v,'monthly'),N=num(v,'life'),cap=num(v,'capital'),save=num(v,'save');
  let left=cap,m=0;while(left>0&&m<1200){left-=M*Math.pow(1+i,Math.floor(m/12));m++}
  const st=[['財務安全','36 個月基本開銷',growSum(M,3,i)],['財務穩定','基本開銷撐到終老',growSum(M,N,i)],['財務獨立','基本開銷 +20% 寬裕撐到終老',growSum(M*1.2,N,i)],['財務自由','理想生活撐到終老',growSum(num(v,'dream'),N,i)],['財務傳承','理想生活＋留給下一代',growSum(num(v,'dream'),N,i)+num(v,'legacy')*Math.pow(1+i,N)]] as [string,string,number][];
  let now='財務掙扎期';st.forEach(s=>{if(cap>=s[2])now=s[0]});
  return {outs:[{label:'目前資本可撐',value:m>=1200?'100 年以上':`${Math.floor(m/12)} 年 ${m%12} 個月`,tone:m<36?'bad':'key'},{label:'目前所在階段',value:now,tone:now==='財務掙扎期'?'bad':'good',hint:'撐不過 36 個月即屬財務掙扎期'},{label:'財務自由所需資本（含通膨）',value:money(st[3][2]),tone:'key'},{label:'財務自由缺口',value:money(Math.max(0,st[3][2]-cap)),tone:'warn'}],
   tables:[{caption:'五個財務階段（所需資本已計入通膨）',head:['階段','定義','所需資本','缺口','照目前存錢速度'],rows:st.map(s=>{const gap=Math.max(0,s[2]-cap);return [s[0],s[1],short(s[2]),gap?short(gap):'已達成',gap?yrs(save>0?gap/save:Infinity):'—']}),tones:st.map(s=>cap>=s[2]?'good':undefined)}],
   notes:['「照目前存錢速度」只算存錢、不含投資報酬，用來看清只靠工作儲蓄要多久。',inflNote(c)]}}},
{id:'inflation',group:'basics',title:'個人通膨與購買力貶值',need:'官方 CPI 不等於你的生活成本。輸入常買品項 5 年前與現在的價格，算出自己的家庭通膨，看薪水的購買力怎麼縮水。',source:'改寫自「購買力貶值」練習',
 fields:[{key:'span',label:'價格比較間隔',def:5,unit:'年'},{key:'salary',label:'目前月薪',def:50000,unit:'元'}],
 rows:[{key:'items',label:'常買品項（食、行、必需、娛樂各挑幾樣）',fields:[{key:'cat',label:'類別',def:'食物雜貨',type:'select',options:['食物雜貨','交通','生活必需','娛樂社交']},nameRow('品項'),{key:'old',label:'當年價格',def:0,unit:'元'},{key:'now',label:'現在價格',def:0,unit:'元'}],defaults:[{cat:'食物雜貨',name:'便當',old:80,now:120},{cat:'食物雜貨',name:'雞蛋一盒',old:60,now:85},{cat:'交通',name:'機車加滿油',old:150,now:190},{cat:'生活必需',name:'套房月租',old:12000,now:16000},{cat:'生活必需',name:'電費（月）',old:900,now:1200},{cat:'娛樂社交',name:'外帶咖啡',old:50,now:70},{cat:'娛樂社交',name:'電影票',old:280,now:350}],addLabel:'新增品項'}],
 compute(v,c){const span=Math.max(1,num(v,'span')),items=rows(v,'items').filter(r=>rn(r,'old')>0&&rn(r,'now')>0),g=(r:Row)=>Math.pow(rn(r,'now')/rn(r,'old'),1/span)-1;
  const cats=['食物雜貨','交通','生活必需','娛樂社交'],avg=(a:Row[])=>a.length?a.reduce((s,r)=>s+g(r),0)/a.length:NaN,all=avg(items),used=Math.max(infl(c),Number.isFinite(all)?all:0),S=num(v,'salary');
  return {outs:[{label:'你的個人通膨（年化）',value:pct(all),tone:'key'},{label:'本工具採用的通膨',value:pct(used),tone:'warn',hint:'取「實測值」與「10% 起跳」的較高者'},{label:'10 年後薪水的實質購買力',value:money(S/Math.pow(1+used,10)),tone:'bad'},{label:'10 年後要維持同樣生活需要月薪',value:money(S*Math.pow(1+used,10)),tone:'key'}],
   tables:[{caption:'各類別年化漲幅',head:['類別','品項數','年化通膨'],rows:cats.map(k=>{const a=items.filter(r=>r.cat===k);return [k,String(a.length),pct(avg(a))]})},{caption:'月薪購買力時間表',head:['第幾年','實質購買力','維持生活所需月薪'],rows:[1,2,3,5,10,15,20].map(y=>[`第 ${y} 年`,money(S/Math.pow(1+used,y)),money(S*Math.pow(1+used,y))])}],
   notes:['年化通膨＝（現價 ÷ 當年價格）^(1/間隔年數) − 1。','購買力受影響最大的類別，就是最該優先處理的開支。']}}},
{id:'budget',group:'basics',title:'薪資自動分配（6 罐／631／532）',need:'發薪日輸入總薪資，自動拆出生活開銷、投資理財、緊急預備金等絕對金額，並對照目前實際花費。',
 fields:[{key:'income',label:'本月實拿薪資',def:60000,unit:'元'},{key:'living',label:'目前每月生活開銷',def:42000,unit:'元'},{key:'invest',label:'目前每月投資／存款',def:6000,unit:'元'}],
 compute(v,c){const I=num(v,'income'),L=num(v,'living'),i=infl(c);
  const plans:[string,[string,number][]][]=[['6 罐理財食譜',[['生活開銷',.4],['收入型資產',.2],['自我教育',.1],['玩樂夢想',.1],['感恩回饋',.1],['債務清償',.1]]],['631 法則',[['生活開銷',.6],['投資理財',.3],['緊急預備金',.1]]],['532 法則',[['必要生活',.5],['想要／享受',.3],['儲蓄投資',.2]]]];
  return {outs:[{label:'目前生活開銷占比',value:pct(I?L/I:NaN),tone:L/I>.6?'bad':'good',hint:'6 罐建議 30–50%，631 上限 60%'},{label:'目前投資儲蓄占比',value:pct(I?num(v,'invest')/I:NaN),tone:num(v,'invest')/I<.2?'warn':'good'},{label:'明年同樣生活要花',value:money(L*(1+i)),tone:'warn',hint:'若收入沒有同步成長，可投資的錢會被擠壓'},{label:'6 罐法每日生活費上限',value:money(I*.4/30)}],
   tables:plans.map(([name,parts])=>({caption:name,head:['用途','比例','本月金額'],rows:parts.map(([k,p])=>[k,pct(p,0),money(I*p)])})),
   notes:['6 罐理財食譜目標比例：生活 30–50%、收入型資產 10–30%、教育 10%、玩樂 10%、感恩 10%、債務 <10%。','建議發薪當天先轉出投資與預備金，剩下的才是生活費。']}}},
{id:'reduce',group:'basics',title:'開支縮減計畫',need:'列出每一項可以降低的支出，算出每月、每年省下多少，若把省下的錢投入收入型資產，5 年後會累積多少。',source:'改寫自「開支縮減計畫」練習',
 fields:[{key:'rate',label:'省下的錢投資年報酬（假設）',def:6,unit:'%'},{key:'years',label:'持續年數',def:5,unit:'年'}],
 rows:[{key:'items',label:'可以調整的支出',fields:[nameRow('支出項目'),{key:'now',label:'目前每月',def:0,unit:'元'},{key:'next',label:'調整後每月',def:0,unit:'元'},{key:'date',label:'開始日期',def:'',type:'date'}],defaults:[{name:'手機資費',now:1399,next:599,date:''},{name:'串流與訂閱',now:990,next:390,date:''},{name:'外食與飲料',now:9000,next:6500,date:''},{name:'保險（重複保障）',now:5000,next:3500,date:''},{name:'交通（改通勤方式）',now:4000,next:2800,date:''}],addLabel:'新增支出'}],
 compute(v,c){const it=rows(v,'items'),save=it.reduce((s,r)=>s+(rn(r,'now')-rn(r,'next')),0),r=num(v,'rate')/100/12,n=num(v,'years')*12,fv=fvAnnuity(r,n,save),i=infl(c);
  return {outs:[{label:'每月省下',value:money(save),tone:'key'},{label:'每年省下',value:money(save*12),tone:'key'},{label:`投入 ${num(v,'years')} 年後累積`,value:money(fv),tone:'good'},{label:'換算今日購買力',value:money(fv/Math.pow(1+i,num(v,'years'))),tone:'warn'}],
   tables:[{caption:'逐項縮減',head:['項目','目前','調整後','每月省下','開始日'],rows:it.map(x=>[String(x.name),money(rn(x,'now')),money(rn(x,'next')),money(rn(x,'now')-rn(x,'next')),String(x.date||'—')])}],
   notes:['縮減開支不是一次性的；每個月檢視一次，連續 60 個月，效果最明顯。',inflNote(c)]}}},
{id:'store',group:'basics',title:'存款 vs 抗通膨資產',need:'同一筆錢放定存或放進會增值的資產（如黃金），20 年後名目金額與實質購買力差多少？',source:'改寫自「美元 vs 黃金」對照',
 fields:[{key:'p',label:'本金',def:1000000,unit:'元'},{key:'dep',label:'定存年利率',def:1.7,unit:'%',step:.1},{key:'asset',label:'資產年增值（假設）',def:7.5,unit:'%',step:.1},{key:'n',label:'比較年數',def:20,unit:'年'}],
 compute(v,c){const P=num(v,'p'),d=num(v,'dep')/100,a=num(v,'asset')/100,i=infl(c),N=num(v,'n'),ys=[1,3,5,10,15,20,25,30].filter(y=>y<=N);
  return {outs:[{label:`定存 ${N} 年後實質購買力`,value:money(P*Math.pow((1+d)/(1+i),N)),tone:'bad'},{label:`資產 ${N} 年後實質購買力`,value:money(P*Math.pow((1+a)/(1+i),N)),tone:a>i?'good':'warn'},{label:'定存實質年報酬',value:pct((1+d)/(1+i)-1),tone:'bad'},{label:'資產實質年報酬',value:pct((1+a)/(1+i)-1)}],
   tables:[{caption:'名目金額與實質購買力',head:['年','定存名目','定存實質','資產名目','資產實質'],rows:ys.map(y=>[String(y),short(P*Math.pow(1+d,y)),short(P*Math.pow((1+d)/(1+i),y)),short(P*Math.pow(1+a,y)),short(P*Math.pow((1+a)/(1+i),y))])}],
   notes:['資產增值率是假設值；黃金、股票、房地產過去的表現不代表未來，價格也可能大幅下跌。','實質購買力＝名目金額 ÷ (1+通膨)^年數。'+inflNote(c)]}}},
{id:'plan',group:'basics',title:'債務清償與五年行動計畫',need:'每筆債務多久還清、總共付多少利息；再算出想要的每月被動收入需要多少資本、每月要投入多少。',source:'改寫自「修正行動計畫」練習',
 fields:[{key:'passive',label:'目標每月被動收入（今日幣值）',def:50000,unit:'元'},{key:'yield',label:'收入型資產年收益率（假設）',def:5,unit:'%',step:.1},{key:'years',label:'希望幾年內達成',def:5,unit:'年'},{key:'start',label:'目前已有可投資資本',def:300000,unit:'元'}],
 rows:[{key:'debts',label:'債務清單',fields:[nameRow('債務'),{key:'bal',label:'餘額',def:0,unit:'元'},{key:'rate',label:'年利率',def:0,unit:'%',step:.1},{key:'pay',label:'每月還款',def:0,unit:'元'}],defaults:[{name:'信用卡循環',bal:80000,rate:15,pay:5000},{name:'信貸',bal:300000,rate:6,pay:9000},{name:'車貸',bal:200000,rate:3,pay:6000}],addLabel:'新增債務'}],
 compute(v,c){const i=infl(c),Y=num(v,'years'),y=num(v,'yield')/100,ds=rows(v,'debts');const detail=ds.map(d=>{const n=nper(rn(d,'rate')/100/12,rn(d,'pay'),rn(d,'bal'));return {d,n,interest:Number.isFinite(n)?rn(d,'pay')*n-rn(d,'bal'):Infinity}});
  const target=num(v,'passive')*Math.pow(1+i,Y),need=y>0?target*12/y:Infinity,gap=Math.max(0,need-num(v,'start')*Math.pow(1+y,Y)),monthly=gap>0?gap/fvAnnuity(y/12,Y*12,1):0,longest=Math.max(0,...detail.map(x=>x.n));
  return {outs:[{label:'全部債務還清需要',value:months(longest),tone:Number.isFinite(longest)?'key':'bad'},{label:'債務總利息',value:money(detail.reduce((s,x)=>s+x.interest,0)),tone:'warn'},{label:`${Y} 年後目標月收入（含通膨）`,value:money(target)},{label:'需要的收入型資本',value:money(need),tone:'key'},{label:'每月需投入',value:money(monthly),tone:'key',hint:'假設投入的資本也以同樣收益率複利成長'}],
   tables:[{caption:'債務清償時間表（建議先還利率最高的）',head:['債務','餘額','年利率','每月還款','還清','總利息'],rows:[...detail].sort((a,b)=>rn(b.d,'rate')-rn(a.d,'rate')).map(x=>[String(x.d.name),money(rn(x.d,'bal')),rn(x.d,'rate')+'%',money(rn(x.d,'pay')),months(x.n),Number.isFinite(x.interest)?money(x.interest):'還款不足以支付利息'])}],
   notes:['12–24 個月、24–48 個月、48–60 個月各寫下一個具體目標，並安排每月檢視。',inflNote(c)]}}},

// ===== 熟齡退休 =====
{id:'retire',group:'seniors',title:'退休金安全提領率',need:'整合勞保年金、勞退、股息與存款，計算每年最多能提領多少而不在規劃年齡前耗盡本金，以及資產何時用完。',
 fields:[{key:'age',label:'現在年齡',def:65,unit:'歲'},{key:'to',label:'規劃到幾歲（預期壽命再加 5–10 年）',def:90,unit:'歲'},{key:'monthly',label:'每月生活費（今日幣值）',def:50000,unit:'元'},{key:'assets',label:'存款與投資總額',def:5000000,unit:'元'},{key:'ret',label:'資產年報酬（保守估）',def:4,unit:'%',step:.1},{key:'labor',label:'勞保老年年金每月（填 0 用下方估算）',def:0,unit:'元'},{key:'insured',label:'勞保平均月投保薪資',def:45800,unit:'元',hint:'目前最高 45,800'},{key:'seniority',label:'勞保年資',def:30,unit:'年'},{key:'pension',label:'勞退個人專戶月領',def:8000,unit:'元'},{key:'div',label:'每年股息、租金等固定收入',def:80000,unit:'元',hint:'產生股息的持股價值不要重複算進上方資產'}],
 compute(v,c){const i=infl(c),r=num(v,'ret')/100,age=num(v,'age'),n=Math.max(1,num(v,'to')-age),A0=num(v,'assets'),ins=num(v,'insured'),sen=num(v,'seniority'),est=Math.max(ins*sen*.00775+3000,ins*sen*.0155),labor=num(v,'labor')||est,fixed=(labor+num(v,'pension'))*12+num(v,'div');
  let A=A0,dead=0,pv=0;const tbl:string[][]=[];for(let t=0;t<n;t++){const exp=num(v,'monthly')*12*Math.pow(1+i,t),w=Math.max(0,exp-fixed);pv+=w/Math.pow(1+r,t);const start=A;A=(A-w)*(1+r);if(A<0&&!dead)dead=age+t;if(t%5===0||t===n-1)tbl.push([`${age+t} 歲`,short(exp),short(fixed),short(w),short(Math.max(0,start)),A<0?'已耗盡':short(A)])}
  let sum=0;for(let t=0;t<n;t++)sum+=Math.pow((1+i)/(1+r),t);const W=A0/sum;
  return {outs:[{label:'資產耗盡年齡',value:dead?`約 ${dead} 歲`:`撐得過 ${age+n} 歲`,tone:dead?'bad':'good'},{label:'首年安全提領額（逐年隨通膨調升）',value:money(W),tone:'key',hint:`安全提領率 ${pct(W/A0)}`},{label:'4% 法則首年可提領',value:money(A0*.04),hint:'4% 法則以 2–3% 通膨為前提，10% 通膨下明顯偏樂觀'},{label:'每月安全總支出（固定收入＋提領）',value:money((fixed+W)/12),tone:'key'},{label:'勞保年金估算（月）',value:money(est),hint:'第一式 ×0.775%＋3,000 與第二式 ×1.55% 取高'},{label:'資金缺口（今日需補足）',value:money(Math.max(0,pv-A0)),tone:pv>A0?'bad':'good'}],
   tables:[{caption:'逐年現金流（每 5 年列一次）',head:['年齡','年支出','固定收入','需提領','期初資產','期末資產'],rows:tbl}],
   notes:['固定收入以不調整計算；勞保年金實際會依 CPI 累計成長 5% 調整，請以勞保局試算為準。','缺口的解方：延後退休、降低開銷、提高穩健收入，或把部分資產轉為終身年金。',inflNote(c)]}}},
{id:'ltc',group:'seniors',title:'長照與重大醫療現金流',need:'估算未來看護費、耗材、自費醫療在通膨下的總額，扣掉保險理賠與政府補助後，還差多少、現在每月要準備多少。',
 fields:[{key:'until',label:'距離可能需要照護',def:15,unit:'年'},{key:'years',label:'照護年數',def:7.3,unit:'年',step:.1,hint:'衛福部常引用國人平均長照需求約 7.3 年'},{key:'care',label:'看護費每月（今日幣值）',def:50000,unit:'元',hint:'外籍看護約 3 萬起、居家或機構常見 4–6 萬'},{key:'supply',label:'耗材、營養品每月',def:8000,unit:'元'},{key:'medical',label:'一次性自費醫療（標靶、自費醫材）',def:1000000,unit:'元'},{key:'home',label:'居家無障礙改裝、輔具',def:200000,unit:'元'},{key:'lump',label:'長照／失能險一次給付',def:500000,unit:'元'},{key:'monthlyPay',label:'長照／失能險每月給付',def:20000,unit:'元'},{key:'critical',label:'重大傷病、癌症險一次給付',def:300000,unit:'元'},{key:'gov',label:'長照 2.0 等補助每月（估）',def:10000,unit:'元'},{key:'rate',label:'準備金投資年報酬',def:4,unit:'%',step:.1}],
 compute(v,c){const i=infl(c),U=num(v,'until'),Y=num(v,'years'),m=Math.round(Y*12);let care=0;for(let k=0;k<m;k++)care+=(num(v,'care')+num(v,'supply'))*Math.pow(1+i,U+k/12);
  const once=(num(v,'medical')+num(v,'home'))*Math.pow(1+i,U),need=care+once,cover=num(v,'lump')+num(v,'critical')+(num(v,'monthlyPay')+num(v,'gov'))*m,gap=Math.max(0,need-cover),r=num(v,'rate')/100/12,save=U>0?gap/fvAnnuity(r,U*12,1):gap;
  return {outs:[{label:'未來照護與醫療總需求',value:money(need),tone:'key'},{label:'換算今日幣值',value:money(need/Math.pow(1+i,U))},{label:'保險理賠＋補助合計',value:money(cover),tone:'good'},{label:'資金缺口',value:money(gap),tone:gap?'bad':'good'},{label:'從今天起每月需準備',value:money(save),tone:'key'},{label:'開始照護時每月總花費',value:money((num(v,'care')+num(v,'supply'))*Math.pow(1+i,U)),tone:'warn'}],
   tables:[{caption:'需求與保障拆解',head:['項目','金額'],rows:[['看護＋耗材（照護期間合計）',money(care)],['自費醫療＋居家改裝',money(once)],['長照險一次＋重大傷病險',money(num(v,'lump')+num(v,'critical'))],['長照險月給付＋政府補助（照護期間）',money((num(v,'monthlyPay')+num(v,'gov'))*m)]]}],
   notes:['保險給付多為固定金額，不會隨通膨增加；保單條款以保險公司為準。','政府長照 2.0 補助依失能等級與收入資格而定，可撥打 1966 長照專線查詢。',inflNote(c)]}}},
{id:'policies',group:'seniors',title:'全家保單總表',need:'把全家保單集中一張表：保費、保額、繳費與保障期滿日，突發疾病時一眼看清能動用的資源。',
 fields:[{key:'income',label:'家庭年收入',def:1200000,unit:'元'}],
 rows:[{key:'list',label:'保單明細',fields:[{key:'who',label:'被保險人',def:'',type:'text'},{key:'name',label:'保險公司／保單名稱',def:'',type:'text',wide:true},{key:'type',label:'類型',def:'醫療',type:'select',options:['壽險','醫療','癌症／重大傷病','意外','長照／失能','儲蓄／年金']},{key:'premium',label:'年繳保費',def:0,unit:'元'},{key:'cover',label:'保額或日額',def:0,unit:'元'},{key:'payEnd',label:'繳費期滿',def:'',type:'date'},{key:'end',label:'保障期滿',def:'',type:'date'}],defaults:[{who:'爸爸',name:'○○人壽 終身醫療',type:'醫療',premium:28000,cover:2000,payEnd:'2030-06-30',end:'2060-06-30'},{who:'爸爸',name:'○○人壽 長照險',type:'長照／失能',premium:36000,cover:20000,payEnd:'2032-03-31',end:'2070-03-31'},{who:'媽媽',name:'○○產險 意外險',type:'意外',premium:3500,cover:3000000,payEnd:'2027-01-31',end:'2027-01-31'},{who:'媽媽',name:'○○人壽 癌症險',type:'癌症／重大傷病',premium:15000,cover:300000,payEnd:'2029-12-31',end:'2050-12-31'}],addLabel:'新增保單'}],
 compute(v,c){const L=rows(v,'list'),tot=L.reduce((s,r)=>s+rn(r,'premium'),0),inc=num(v,'income'),types=[...new Set(L.map(r=>String(r.type)))],soon=L.filter(r=>{const d=parseDate(r.payEnd);return d&&d.getTime()-c.today.getTime()<365*day&&d>=c.today});
  return {outs:[{label:'每年保費合計',value:money(tot),tone:'key'},{label:'保費占家庭年收入',value:pct(inc?tot/inc:NaN),tone:tot/inc>.15?'warn':'good',hint:'常見參考：10–15% 以內'},{label:'一年內繳費期滿',value:soon.length?soon.map(r=>`${r.who}・${r.name}`).join('、'):'無'},{label:'保單數',value:String(L.length)}],
   tables:[{caption:'依類型統計',head:['類型','張數','年繳保費'],rows:types.map(t=>{const a=L.filter(r=>r.type===t);return [t,String(a.length),money(a.reduce((s,r)=>s+rn(r,'premium'),0))]})},{caption:'依被保險人統計',head:['被保險人','張數','年繳保費'],rows:[...new Set(L.map(r=>String(r.who)))].map(w=>{const a=L.filter(r=>r.who===w);return [w||'未填',String(a.length),money(a.reduce((s,r)=>s+rn(r,'premium'),0))]})}],
   notes:['保額多為固定金額：20 年後在 10% 通膨下，同樣保額的購買力只剩約 15%。','保單正本、要保人與受益人資料請另存於家人知道的位置。']}}},
{id:'simple',group:'seniors',title:'簡易生活收支表（長輩版）',need:'只分三類：日常基本開銷、醫療保健、休閒娛樂。每次花錢記一筆，月底一眼看出哪一類超支。',
 fields:[{key:'b1',label:'日常基本開銷預算（月）',def:25000,unit:'元'},{key:'b2',label:'醫療保健預算（月）',def:6000,unit:'元'},{key:'b3',label:'休閒娛樂預算（月）',def:5000,unit:'元'}],
 rows:[{key:'list',label:'記帳',fields:[{key:'date',label:'日期',def:'',type:'date'},{key:'cat',label:'類別',def:'日常基本開銷',type:'select',options:['日常基本開銷','醫療保健','休閒娛樂']},{key:'note',label:'說明',def:'',type:'text',wide:true},{key:'amt',label:'金額',def:0,unit:'元'}],defaults:[{date:'2026-10-01',cat:'日常基本開銷',note:'菜市場',amt:1200},{date:'2026-10-02',cat:'醫療保健',note:'門診與藥',amt:450},{date:'2026-10-05',cat:'休閒娛樂',note:'和老同學聚餐',amt:800},{date:'2026-10-06',cat:'日常基本開銷',note:'水電瓦斯',amt:2100}],addLabel:'記一筆'}],
 compute(v,c){const L=rows(v,'list'),cats:[string,number][]=[['日常基本開銷',num(v,'b1')],['醫療保健',num(v,'b2')],['休閒娛樂',num(v,'b3')]],sum=(k:string)=>L.filter(r=>r.cat===k).reduce((s,r)=>s+rn(r,'amt'),0),tot=L.reduce((s,r)=>s+rn(r,'amt'),0),budget=cats.reduce((s,x)=>s+x[1],0);
  return {outs:[{label:'本月已花',value:money(tot),tone:'key'},{label:'本月還可以花',value:money(budget-tot),tone:budget-tot<0?'bad':'good'},{label:'明年同樣預算需要',value:money(budget*(1+infl(c))),tone:'warn'}],
   tables:[{caption:'三類花費',head:['類別','已花','預算','剩餘','占比'],rows:cats.map(([k,b])=>{const s=sum(k);return [k,money(s),money(b),money(b-s),pct(tot?s/tot:0,0)]}),tones:cats.map(([k,b])=>sum(k)>b?'bad':undefined)}],
   notes:['列印時建議用 A4 橫式；Excel 版已設定大字體與下拉選單。',inflNote(c)]}}},
{id:'estate',group:'seniors',title:'遺產稅與贈與稅節稅試算',need:'針對房地產與現金，比較「一次繼承」與「分年贈與」的稅務成本（115 年／2026 年發生案件適用標準）。',
 fields:[{key:'land',label:'土地（公告土地現值）',def:12000000,unit:'元',hint:'遺產以公告現值計，通常低於市價'},{key:'house',label:'房屋（評定標準價格）',def:1500000,unit:'元'},{key:'cash',label:'現金、存款',def:8000000,unit:'元'},{key:'stock',label:'股票、基金（時價）',def:6000000,unit:'元'},{key:'other',label:'其他財產',def:0,unit:'元'},{key:'debt',label:'未償債務',def:0,unit:'元'},{key:'spouse',label:'配偶在世（1＝是，0＝否）',def:1,min:0,max:1},{key:'kids',label:'直系血親卑親屬人數',def:2,unit:'人'},{key:'parents',label:'在世父母人數',def:0,unit:'人'},{key:'disabled',label:'身心障礙繼承人數',def:0,unit:'人'},{key:'transfer',label:'打算生前贈與的總額',def:10000000,unit:'元'},{key:'donors',label:'贈與人數（父母各自贈與＝2）',def:2,unit:'人'},{key:'gyears',label:'分幾年贈與',def:3,unit:'年'}],
 compute(v,c){const gross=['land','house','cash','stock','other'].reduce((s,k)=>s+num(v,k),0),ded=13330000+num(v,'spouse')*5530000+num(v,'kids')*560000+num(v,'parents')*1380000+1380000+num(v,'disabled')*6930000+num(v,'debt'),netE=Math.max(0,gross-ded);
  const eb:[number,number][]=[[56210000,.1],[112420000,.15],[Infinity,.2]],gb:[number,number][]=[[28110000,.1],[56210000,.15],[Infinity,.2]],et=progressive(netE,eb);
  const T=num(v,'transfer'),dn=Math.max(1,num(v,'donors')),gy=Math.max(1,num(v,'gyears')),once=dn*progressive(Math.max(0,T/dn-2440000),gb),spread=gy*dn*progressive(Math.max(0,T/dn/gy-2440000),gb);
  const after=Math.max(0,gross-T),et2=progressive(Math.max(0,after-ded),eb);
  return {outs:[{label:'遺產總額',value:money(gross)},{label:'免稅額＋扣除額',value:money(ded)},{label:'課稅遺產淨額',value:money(netE)},{label:'預估遺產稅',value:money(et),tone:et?'bad':'good'},{label:`一年內贈與 ${short(T)} 的贈與稅`,value:money(once),tone:'warn'},{label:`分 ${gy} 年贈與的贈與稅`,value:money(spread),tone:'good'},{label:'先分年贈與、其餘繼承：總稅負',value:money(spread+et2),tone:'key',hint:'未計入死亡前 2 年內贈與需併入遺產的規定'}],
   tables:[{caption:'115 年（2026）遺產稅與贈與稅標準',head:['項目','金額／稅率'],rows:[['遺產稅免稅額','1,333 萬'],['配偶／父母／喪葬費扣除','553 萬／每人 138 萬／138 萬'],['直系血親卑親屬扣除','每人 56 萬（未成年另依年數加扣）'],['遺產淨額 5,621 萬以下','10%'],['5,621 萬～1 億 1,242 萬','15%'],['超過 1 億 1,242 萬','20%'],['贈與稅免稅額','每位贈與人每年 244 萬'],['贈與淨額 2,811 萬／5,621 萬級距','10%／15%／20%']]}],
   notes:['被繼承人死亡前 2 年內贈與配偶、子女等的財產，仍要併入遺產課稅；分年贈與要及早規劃。','不動產移轉另有土地增值稅、契稅、房地合一稅；以房屋贈與子女，未來出售時的房地合一稅可能比繼承更高。','數字依財政部公告的 115 年標準；實際申報請洽地政士、會計師或國稅局。']}}},

// ===== 白領 =====
{id:'fire',group:'white',title:'FIRE 財務獨立路徑',need:'結合儲蓄率、年化報酬與通膨，推算資產何時足以用提領支應生活，真正脫離職場。',
 fields:[{key:'age',label:'現在年齡',def:32,unit:'歲'},{key:'assets',label:'目前投資資產',def:1500000,unit:'元'},{key:'income',label:'稅後年收入',def:1000000,unit:'元'},{key:'grow',label:'年收入成長率',def:3,unit:'%',step:.1},{key:'expense',label:'年生活支出',def:600000,unit:'元'},{key:'ret',label:'投資年報酬（假設）',def:7,unit:'%',step:.1},{key:'wr',label:'退休後提領率',def:4,unit:'%',step:.1}],
 compute(v,c){const i=infl(c),r=num(v,'ret')/100,g=num(v,'grow')/100,wr=num(v,'wr')/100,age=num(v,'age');let A=num(v,'assets'),hit=-1;const tbl:string[][]=[];
  for(let t=0;t<=50;t++){const exp=num(v,'expense')*Math.pow(1+i,t),target=wr>0?exp/wr:Infinity,inc=num(v,'income')*Math.pow(1+g,t);if(hit<0&&A>=target)hit=t;if(t%5===0)tbl.push([`${age+t} 歲`,short(inc),short(exp),short(target),short(A),A>=target?'達成':'—']);A=A*(1+r)+inc-exp}
  const rate=num(v,'income')?1-num(v,'expense')/num(v,'income'):NaN;
  return {outs:[{label:'財務獨立年齡',value:hit>=0?`${age+hit} 歲（${hit} 年後）`:'50 年內無法達成',tone:hit>=0?'good':'bad'},{label:'目前儲蓄率',value:pct(rate),tone:rate<.3?'warn':'good'},{label:'今天的 FIRE 目標本金',value:money(num(v,'expense')/wr),hint:'年支出 ÷ 提領率'},{label:'實質報酬率',value:pct((1+r)/(1+i)-1),tone:r<i?'bad':'good',hint:'報酬低於通膨時，資產實質上在縮水'}],
   tables:[{caption:'每 5 年進度',head:['年齡','年收入','年支出','目標本金','資產','狀態'],rows:tbl}],
   notes:['在 10% 通膨假設下，支出與目標本金增加很快：提高收入成長與儲蓄率，比追求高報酬更可靠。',inflNote(c)]}}},
{id:'xirr',group:'white',title:'資產配置真實年化報酬（XIRR）',need:'把跨帳戶的股票、ETF、外幣、基金每次投入與贖回列出，用 XIRR 算出考慮時間的真實年化報酬，並扣掉通膨。',
 fields:[{key:'value',label:'今日總市值',def:620000,unit:'元'},{key:'date',label:'市值日期',def:'2026-10-16',type:'date'}],
 rows:[{key:'flows',label:'現金流（投入填正數，贖回或配息填負數）',fields:[{key:'date',label:'日期',def:'',type:'date'},{key:'name',label:'帳戶／標的',def:'',type:'text',wide:true},{key:'amt',label:'投入金額',def:0,unit:'元'}],defaults:[{date:'2023-01-10',name:'台股 0050 定期定額',amt:120000},{date:'2023-07-10',name:'美股 VT',amt:100000},{date:'2024-01-10',name:'台股 0050 定期定額',amt:120000},{date:'2024-08-20',name:'0056 配息（領回）',amt:-8000},{date:'2025-01-10',name:'美元定存轉 ETF',amt:100000},{date:'2025-09-01',name:'加密貨幣',amt:50000},{date:'2026-01-10',name:'台股 0050 定期定額',amt:60000}],addLabel:'新增一筆'}],
 compute(v,c){const end=parseDate(v.date as Cell)||c.today,fl=rows(v,'flows').map(r=>({d:parseDate(r.date),a:-rn(r,'amt')})).filter(x=>x.d&&x.a!==0) as {d:Date;a:number}[];fl.push({d:end,a:num(v,'value')});
  const t0=Math.min(...fl.map(x=>x.d.getTime())),f=(r:number)=>fl.reduce((s,x)=>s+x.a/Math.pow(1+r,(x.d.getTime()-t0)/day/365),0);
  let lo=-.99,hi=10,x=NaN;if(f(lo)*f(hi)<0){for(let k=0;k<200;k++){const m=(lo+hi)/2;if(f(lo)*f(m)<=0)hi=m;else lo=m}x=(lo+hi)/2}
  const inv=fl.filter(q=>q.a<0).reduce((s,q)=>s-q.a,0),out=fl.filter(q=>q.a>0).reduce((s,q)=>s+q.a,0),i=infl(c);
  return {outs:[{label:'XIRR 年化報酬',value:pct(x,2),tone:'key'},{label:'扣除通膨後實質年報酬',value:pct((1+x)/(1+i)-1,2),tone:(1+x)/(1+i)<1?'bad':'good'},{label:'累計投入',value:money(inv)},{label:'市值＋已領回',value:money(out)},{label:'總損益',value:money(out-inv),tone:out>=inv?'good':'bad'},{label:'簡單報酬率（不看時間）',value:pct(inv?out/inv-1:NaN)}],
   notes:['XIRR 把每筆錢投入的時間長短算進去，比「總報酬率」更能比較不同帳戶與策略。','Excel 版可直接用 =XIRR(金額範圍, 日期範圍)。',inflNote(c)]}}},
{id:'loan',group:'white',title:'貸款攤還與提前還本',need:'比較房貸或信貸在不同利率下的月付金，並試算每月多還本金能縮短幾年、省下多少利息。',
 fields:[{key:'p',label:'貸款金額',def:10000000,unit:'元'},{key:'rate',label:'年利率',def:2.2,unit:'%',step:.01},{key:'years',label:'貸款年數',def:30,unit:'年'},{key:'extra',label:'每月額外多還本金',def:5000,unit:'元'}],
 compute(v,c){const P=num(v,'p'),r=num(v,'rate')/100/12,n=num(v,'years')*12,m=pmt(r,n,P),E=num(v,'extra');let B=P,k=0,interest=0;while(B>0.5&&k<n){const it=B*r;interest+=it;B=B+it-(m+E);k++}
  const base=m*n-P,i=infl(c);
  return {outs:[{label:'每月本息攤還',value:money(m),tone:'key'},{label:'原本總利息',value:money(base)},{label:'多還本金後還清',value:`${Math.floor(k/12)} 年 ${k%12} 個月`,tone:'good'},{label:'縮短期間',value:`${((n-k)/12).toFixed(1)} 年`,tone:'good'},{label:'省下利息',value:money(base-interest),tone:'key'},{label:'最後一期月付的實質負擔',value:money(m/Math.pow(1+i,num(v,'years'))),hint:'高通膨下，固定月付的實質負擔會逐年下降'}],
   tables:[{caption:'不同利率的月付金比較',head:['年利率','月付金','總利息'],rows:[-0.4,-0.2,0,0.2,0.4,0.8].map(d=>{const rr=num(v,'rate')+d,mm=pmt(rr/100/12,n,P);return [rr.toFixed(2)+'%',money(mm),money(mm*n-P)]})}],
   notes:['在 10% 通膨、2% 房貸利率下，提前還本的「實質報酬」只有房貸利率；先確認緊急預備金與保障足夠，再決定是否多還。','本表以本息平均攤還計；寬限期、指數型房貸請另行計算。']}}},
{id:'tax',group:'white',title:'綜合所得稅節稅試算',need:'精算扶養親屬、列舉扣除、房租、長照與自提勞退的組合，看哪種安排最省稅（115 年度所得、116 年 5 月申報標準）。',
 fields:[{key:'s1',label:'本人薪資收入',def:900000,unit:'元'},{key:'s2',label:'配偶薪資收入（無配偶填 0）',def:0,unit:'元'},{key:'married',label:'有配偶合併申報（1＝是）',def:0,min:0,max:1},{key:'other',label:'其他所得（利息、股利、租金等）',def:50000,unit:'元'},{key:'savings',label:'其中：利息等儲蓄投資所得',def:20000,unit:'元'},{key:'deps',label:'扶養親屬（未滿 70 歲）',def:0,unit:'人'},{key:'deps70',label:'扶養 70 歲以上直系尊親屬',def:0,unit:'人'},{key:'itemized',label:'列舉扣除合計（保險費、醫藥、捐贈、房貸利息）',def:0,unit:'元'},{key:'rent',label:'房屋租金支出（特別扣除上限 18 萬）',def:120000,unit:'元'},{key:'ltc',label:'長照特別扣除人數',def:0,unit:'人'},{key:'kids',label:'6 歲以下子女',def:0,unit:'人'},{key:'self',label:'勞退自提比例（0–6%）',def:6,unit:'%',min:0,max:6},{key:'basic',label:'每人基本生活費（待財政部公告）',def:213000,unit:'元',hint:'114 年度為 21.3 萬'}],
 compute(v,c){const B:[number,number][]=[[610000,.05],[1380000,.12],[2770000,.2],[5190000,.3],[Infinity,.4]],married=num(v,'married')>0;
  const calc=(selfPct:number)=>{const p=Math.min(6,Math.max(0,selfPct))/100,w1=num(v,'s1')*(1-p),w2=num(v,'s2')*(1-p),gross=w1+w2+num(v,'other'),persons=1+(married?1:0)+num(v,'deps')+num(v,'deps70'),ex=101000*(1+(married?1:0)+num(v,'deps'))+151500*num(v,'deps70'),gen=Math.max(married?272000:136000,num(v,'itemized')),sal=Math.min(w1,227000)+Math.min(w2,227000),sav=Math.min(num(v,'savings'),270000),spec=sav+num(v,'ltc')*180000+num(v,'kids')*150000,rent=num(v,'itemized')>0?0:Math.min(num(v,'rent'),180000),gap=Math.max(0,persons*num(v,'basic')-(ex+gen+spec)),net=Math.max(0,gross-ex-gen-sal-spec-rent-gap);return {net,tax:progressive(net,B),gap,gen,ex}};
  const a=calc(num(v,'self')),b=calc(0);
  return {outs:[{label:'綜合所得淨額',value:money(a.net)},{label:'預估應納稅額',value:money(a.tax),tone:'key'},{label:'適用最高稅率',value:a.net>5190000?'40%':a.net>2770000?'30%':a.net>1380000?'20%':a.net>610000?'12%':'5%'},{label:'自提勞退省下的稅',value:money(b.tax-a.tax),tone:'good'},{label:'基本生活費差額（可再減除）',value:money(a.gap)},{label:'一般扣除採用',value:a.gen>(married?272000:136000)?'列舉':'標準扣除'}],
   tables:[{caption:'115 年度所得適用標準（116 年 5 月申報）',head:['項目','金額'],rows:[['免稅額','每人 10.1 萬；70 歲以上 15.15 萬'],['標準扣除額','單身 13.6 萬／有配偶 27.2 萬'],['薪資特別扣除','每人上限 22.7 萬'],['儲蓄投資／長照／幼兒學前','27 萬／每人 18 萬／每人 15 萬起'],['房屋租金特別扣除','上限 18 萬（擇列舉時不可同時用租金列舉）'],['課稅級距','61 萬 5%｜138 萬 12%｜277 萬 20%｜519 萬 30%｜以上 40%']]}],
   notes:['這是簡化估算：未含分開計稅、股利 28% 分開課稅、最低稅負制與房租特別扣除的排富條件。','今年 5 月申報的是 114 年度所得：免稅額 9.7 萬、標準扣除 13.1 萬、薪資扣除 21.8 萬、級距 59／133／266／498 萬。','正式數字以財政部公告與報稅軟體為準。']}}},
{id:'rebalance',group:'white',title:'投資組合再平衡',need:'管理台股、美股 ETF、債券、加密貨幣與現金的比例：輸入目前市值與目標比例，算出每項該買或該賣多少。',
 fields:[{key:'add',label:'本次新投入資金',def:30000,unit:'元'}],
 rows:[{key:'list',label:'資產類別',fields:[nameRow('資產'),{key:'value',label:'目前市值',def:0,unit:'元'},{key:'target',label:'目標比例',def:0,unit:'%'}],defaults:[{name:'台股 ETF',value:420000,target:40},{name:'美股／全球 ETF',value:260000,target:30},{name:'債券 ETF',value:80000,target:15},{name:'加密貨幣',value:90000,target:5},{name:'現金／定存',value:60000,target:10}],addLabel:'新增類別'}],
 compute(v,c){const L=rows(v,'list'),tot=L.reduce((s,r)=>s+rn(r,'value'),0)+num(v,'add'),tsum=L.reduce((s,r)=>s+rn(r,'target'),0),cur=tot-num(v,'add');
  return {outs:[{label:'再平衡後總資產',value:money(tot),tone:'key'},{label:'目標比例合計',value:tsum+'%',tone:tsum===100?'good':'bad',hint:tsum===100?'':'請調整到 100%'},{label:'偏離最大的類別',value:L.length?String([...L].sort((a,b)=>Math.abs(rn(b,'value')/cur-rn(b,'target')/100)-Math.abs(rn(a,'value')/cur-rn(a,'target')/100))[0].name):'—'}],
   tables:[{caption:'買賣建議',head:['資產','目前市值','目前比例','目標比例','目標金額','應買（+）／賣（−）'],rows:L.map(r=>{const t=tot*rn(r,'target')/100;return [String(r.name),money(rn(r,'value')),pct(cur?rn(r,'value')/cur:0),rn(r,'target')+'%',money(t),money(t-rn(r,'value'))]})}],
   notes:['常見做法：每年固定一次，或任一類別偏離目標 5 個百分點以上時再平衡。','優先用新投入資金補足偏低的類別，可減少賣出的交易成本與稅負。']}}},

// ===== 藍領 =====
{id:'overtime',group:'blue',title:'加班費與工時權益核算',need:'依勞基法計算平日延長工時、休息日與國定假日出勤的法定加班費，確認領到的錢沒有少。',
 fields:[{key:'monthly',label:'月薪（時薪制填 0）',def:36000,unit:'元'},{key:'hourly',label:'時薪（月薪制可留 0）',def:0,unit:'元'}],
 rows:[{key:'list',label:'本月加班紀錄',fields:[{key:'date',label:'日期',def:'',type:'date'},{key:'type',label:'類型',def:'平日加班',type:'select',options:['平日加班','休息日出勤','國定假日出勤']},{key:'h',label:'時數',def:2,unit:'小時',step:.5}],defaults:[{date:'2026-10-02',type:'平日加班',h:2},{date:'2026-10-06',type:'平日加班',h:3},{date:'2026-10-10',type:'國定假日出勤',h:8},{date:'2026-10-17',type:'休息日出勤',h:6},{date:'2026-10-21',type:'平日加班',h:4}],addLabel:'新增加班'}],
 compute(v,c){const M=num(v,'monthly'),H=num(v,'hourly')||M/240,pay=(r:Row)=>{const h=rn(r,'h');if(r.type==='平日加班')return H*(Math.min(h,2)*4/3+Math.max(0,Math.min(h,4)-2)*5/3);if(r.type==='休息日出勤')return H*(Math.min(h,2)*4/3+Math.max(0,Math.min(h,8)-2)*5/3+Math.max(0,Math.min(h,12)-8)*8/3);return H*(8+Math.max(0,Math.min(h,10)-8)*4/3+Math.max(0,Math.min(h,12)-10)*5/3)};
  const L=rows(v,'list'),tot=L.reduce((s,r)=>s+pay(r),0),capH=L.filter(r=>r.type!=='國定假日出勤').reduce((s,r)=>s+rn(r,'h'),0);
  return {outs:[{label:'加班費計算用時薪',value:money(H),tone:'key',hint:num(v,'hourly')?'時薪制':'月薪 ÷ 240'},{label:'本月法定加班費',value:money(tot),tone:'key'},{label:'延長工時合計',value:capH+' 小時',tone:capH>46?'bad':'good',hint:'每月上限 46 小時（經勞資協議可放寬至 54，三個月 138）'},{label:'是否低於 2026 年基本工資',value:num(v,'hourly')?(H<196?'時薪低於 196 元':'符合'):(M<29500?'月薪低於 29,500 元':'符合'),tone:(num(v,'hourly')?H<196:M<29500)?'bad':'good'}],
   tables:[{caption:'逐筆計算',head:['日期','類型','時數','加班費'],rows:L.map(r=>[String(r.date||'—'),String(r.type),String(rn(r,'h')),money(pay(r))])},{caption:'勞基法加給規則',head:['情況','計算方式'],rows:[['平日延長工時','前 2 小時 ×4/3；第 3–4 小時 ×5/3'],['休息日出勤','前 2 小時 ×4/3；3–8 小時 ×5/3；9–12 小時 ×8/3'],['國定假日出勤','8 小時內加發一日工資；超過 8 小時依延長工時加給'],['例假日','除天災等緊急情況外不得出勤，並應補假']]}],
   notes:['國定假日出勤以「加發一日工資」計算，部分個案（如出勤未滿 8 小時）的認定可再向勞動部確認。','實際以勞動契約、工資清冊與勞動部勞動條件試算為準。']}}},
{id:'reserve',group:'blue',title:'家庭硬性支出與緊急預備金水庫',need:'把薪水強制拆成生活必需、債務攤還與儲蓄，算出 3–6 個月沒有收入時的生存底線，以及多久能存滿。',
 fields:[{key:'income',label:'每月實拿收入',def:38000,unit:'元'},{key:'rent',label:'房租／房貸',def:10000,unit:'元'},{key:'food',label:'伙食',def:9000,unit:'元'},{key:'move',label:'交通',def:2500,unit:'元'},{key:'ins',label:'保險',def:2000,unit:'元'},{key:'home',label:'水電、電信、家用',def:3500,unit:'元'},{key:'kids',label:'孝親、子女',def:3000,unit:'元'},{key:'debt',label:'債務每月攤還',def:3000,unit:'元'},{key:'saved',label:'目前已存預備金',def:30000,unit:'元'},{key:'target',label:'目標月數（建議 3–6）',def:6,unit:'個月'}],
 compute(v,c){const need=['rent','food','move','ins','home','kids','debt'].reduce((s,k)=>s+num(v,k),0),left=num(v,'income')-need,goal=need*num(v,'target'),s=num(v,'saved'),i=infl(c);
  return {outs:[{label:'每月生存底線',value:money(need),tone:'key'},{label:'目前預備金可撐',value:(need?s/need:0).toFixed(1)+' 個月',tone:s/need<3?'bad':'good'},{label:`${num(v,'target')} 個月目標預備金`,value:money(goal)},{label:'每月可存',value:money(left),tone:left>0?'good':'bad'},{label:'存滿需要',value:left>0?months(Math.max(0,goal-s)/left):'收支已透支，先縮減支出',tone:'warn'},{label:'明年生存底線（含通膨）',value:money(need*(1+i)),tone:'warn'}],
   tables:[{caption:'建議的薪水拆分',head:['用途','金額','占收入'],rows:[['生活必需',money(need-num(v,'debt')),pct((need-num(v,'debt'))/num(v,'income'))],['債務攤還',money(num(v,'debt')),pct(num(v,'debt')/num(v,'income'))],['預備金（先存）',money(Math.max(0,left)),pct(Math.max(0,left)/num(v,'income'))]]}],
   notes:['預備金放在可隨時提領、與日常帳戶分開的帳戶；存滿之前不投資高風險商品。','職災或失業時，可查詢勞保職災給付與就業保險失業給付。',inflNote(c)]}}},
{id:'license',group:'blue',title:'技能轉型與考照投資回報',need:'比較堆高機、電銲、重機具等證照的學費、時間與薪資增幅，算出幾個月回本與 10 年淨效益。',
 fields:[{key:'years',label:'評估年數',def:10,unit:'年'}],
 rows:[{key:'list',label:'證照選項',fields:[nameRow('證照'),{key:'fee',label:'學費與報名費',def:0,unit:'元'},{key:'hours',label:'訓練時數',def:0,unit:'小時'},{key:'lost',label:'請假少領收入',def:0,unit:'元'},{key:'raise',label:'取得後每月加薪',def:0,unit:'元'}],defaults:[{name:'堆高機操作技術士',fee:9000,hours:18,lost:3000,raise:3000},{name:'電銲技術士（乙級）',fee:30000,hours:120,lost:12000,raise:8000},{name:'移動式起重機操作',fee:25000,hours:38,lost:6000,raise:6000}],addLabel:'新增證照'}],
 compute(v,c){const i=infl(c),Y=num(v,'years'),L=rows(v,'list').map(r=>{const cost=rn(r,'fee')+rn(r,'lost'),R=rn(r,'raise');let pv=0;for(let m=1;m<=Y*12;m++)pv+=R/Math.pow(1+i,m/12);return {r,cost,pay:R?cost/R:Infinity,net:R*12*Y-cost,real:pv-cost}}),best=[...L].sort((a,b)=>b.real-a.real)[0];
  return {outs:[{label:'實質效益最高',value:best?String(best.r.name):'—',tone:'good'},{label:'最快回本',value:L.length?months(Math.min(...L.map(x=>x.pay))):'—',tone:'key'}],
   tables:[{caption:`${Y} 年投資回報`,head:['證照','總成本','回本','名目淨效益','扣通膨淨效益'],rows:L.map(x=>[String(x.r.name),money(x.cost),months(x.pay),money(x.net),money(x.real)])}],
   notes:['可先查勞動部勞動力發展署的職前、在職訓練補助，學費可能大幅降低。','扣通膨淨效益：把未來的加薪折算成今天的購買力，加薪若不跟著通膨調整，實際效益會縮小。']}}},

// ===== 企業 =====
{id:'cashflow',group:'business',title:'滾動式現金流預測與壓力測試',need:'預估未來 6 個月應收入帳、應付與固定開銷，掌握資金枯竭日（Runway），並模擬收款延遲、營收下滑、突發支出。',
 fields:[{key:'open',label:'期初現金',def:3000000,unit:'元'},{key:'safe',label:'安全水位（最低現金）',def:1000000,unit:'元'},{key:'drop',label:'壓力測試：營收下降',def:0,unit:'%'},{key:'delay',label:'壓力測試：收款延遲',def:0,unit:'個月',min:0,max:3},{key:'shock',label:'壓力測試：第 1 個月突發支出',def:0,unit:'元'},{key:'costUp',label:'成本隨通膨上升（1＝是）',def:1,min:0,max:1}],
 rows:[{key:'months',label:'每月預估（應收入帳日所在月份）',fields:[{key:'name',label:'月份',def:'',type:'text'},{key:'ar',label:'應收帳款入帳',def:0,unit:'元'},{key:'otherIn',label:'其他收入',def:0,unit:'元'},{key:'ap',label:'應付帳款',def:0,unit:'元'},{key:'pay',label:'薪資',def:0,unit:'元'},{key:'fixed',label:'租金與固定開銷',def:0,unit:'元'},{key:'loan',label:'貸款還款',def:0,unit:'元'}],defaults:['11 月','12 月','1 月','2 月','3 月','4 月'].map((name,k)=>({name,ar:[1800000,2000000,1600000,1200000,1900000,2000000][k],otherIn:50000,ap:[900000,1000000,800000,700000,950000,1000000][k],pay:650000,fixed:220000,loan:80000})),addLabel:'新增月份'}],
 compute(v,c){const L=rows(v,'months'),d=Math.round(num(v,'delay')),drop=1-num(v,'drop')/100,mi=num(v,'costUp')?Math.pow(1+infl(c),1/12):1;let cash=num(v,'open'),firstLow='',neg=0;const tbl:string[][]=[],tones:(Out['tone'])[]=[];
  L.forEach((r,k)=>{const src=L[k-d],inflow=(src&&k-d>=0?rn(src,'ar'):0)*drop+rn(r,'otherIn')*drop,g=Math.pow(mi,k),out=(rn(r,'ap')+rn(r,'pay')+rn(r,'fixed'))*g+rn(r,'loan')+(k===0?num(v,'shock'):0),net=inflow-out;cash+=net;if(net<0)neg+=net;if(!firstLow&&cash<num(v,'safe'))firstLow=String(r.name);tbl.push([String(r.name),short(inflow),short(out),short(net),short(cash),cash<0?'⚠ 資金斷鏈':cash<num(v,'safe')?'⚠ 低於安全水位':'正常']);tones.push(cash<0?'bad':cash<num(v,'safe')?'warn':undefined)});
  const avg=L.length?neg/L.length:0,runway=avg<0?cash/-avg:Infinity;
  return {outs:[{label:'期末現金',value:money(cash),tone:cash<0?'bad':'key'},{label:'首次低於安全水位',value:firstLow||'未發生',tone:firstLow?'bad':'good'},{label:'Runway（以虧損月平均估）',value:Number.isFinite(runway)?`${Math.max(0,runway).toFixed(1)} 個月`:'現金流為正',tone:Number.isFinite(runway)&&runway<6?'bad':'good'}],
   tables:[{caption:'逐月現金流',head:['月份','入帳','流出','淨現金流','期末現金','狀態'],rows:tbl,tones}],
   notes:['每月月初更新一次：已發生的月份換成實際數字，再往後補一個月，維持 6 個月滾動。','成本隨通膨上升時，應付、薪資與固定開銷每月以年 10% 起跳換算的月增幅成長。']}}},
{id:'breakeven',group:'business',title:'專案損益兩平（Break-Even）',need:'新產品或大型活動的固定成本、變動成本與售價，推算最低銷售量、損益兩平營收，以及達成目標利潤要賣多少。',
 fields:[{key:'fixed',label:'固定成本（開發、場地、人事、廣告）',def:500000,unit:'元'},{key:'price',label:'單價',def:1200,unit:'元'},{key:'vc',label:'單位變動成本',def:700,unit:'元'},{key:'profit',label:'目標利潤',def:200000,unit:'元'},{key:'expect',label:'預估銷量',def:1200,unit:'件'}],
 compute(v,c){const F=num(v,'fixed'),P=num(v,'price'),V=num(v,'vc'),cm=P-V,be=cm>0?Math.ceil(F/cm):Infinity,i=infl(c),V2=V*(1+i),be2=P-V2>0?Math.ceil(F/(P-V2)):Infinity;
  return {outs:[{label:'單位邊際貢獻',value:money(cm),hint:'邊際貢獻率 '+pct(P?cm/P:NaN)},{label:'損益兩平銷量',value:Number.isFinite(be)?be.toLocaleString('zh-TW')+' 件':'售價低於變動成本',tone:'key'},{label:'損益兩平營收',value:money(be*P)},{label:'達成目標利潤需賣',value:cm>0?Math.ceil((F+num(v,'profit'))/cm).toLocaleString('zh-TW')+' 件':'—',tone:'key'},{label:'預估銷量下的利潤',value:money(num(v,'expect')*cm-F),tone:num(v,'expect')*cm-F>=0?'good':'bad'},{label:'明年變動成本漲價後損益兩平',value:Number.isFinite(be2)?be2.toLocaleString('zh-TW')+' 件':'虧損',tone:'warn'}],
   tables:[{caption:'售價敏感度',head:['售價','邊際貢獻','損益兩平銷量','預估銷量利潤'],rows:[-.2,-.1,0,.1,.2].map(d=>{const p=P*(1+d),m=p-V;return [money(p),money(m),m>0?Math.ceil(F/m).toLocaleString('zh-TW'):'—',money(num(v,'expect')*m-F)]})}],
   notes:['降價前先看敏感度表：售價降 10%，損益兩平銷量常常要增加三成以上。',inflNote(c)]}}},
{id:'pnl',group:'business',title:'多維度損益表（P&L）',need:'拆解不同產品線或部門的營收、營業成本與營業費用，找出真正的獲利引擎與隱形虧損黑洞。',
 fields:[],
 rows:[{key:'list',label:'產品線／部門',fields:[nameRow('產品線或部門'),{key:'rev',label:'營收',def:0,unit:'元'},{key:'cogs',label:'營業成本',def:0,unit:'元'},{key:'opex',label:'直接營業費用',def:0,unit:'元'},{key:'alloc',label:'分攤管銷',def:0,unit:'元'}],defaults:[{name:'A 產品線（主力）',rev:12000000,cogs:6500000,opex:1800000,alloc:1200000},{name:'B 產品線（新品）',rev:3000000,cogs:2100000,opex:900000,alloc:300000},{name:'C 服務（維修保養）',rev:2500000,cogs:800000,opex:500000,alloc:250000},{name:'D 電商通路',rev:4000000,cogs:2600000,opex:1300000,alloc:400000}],addLabel:'新增一列'}],
 compute(v,c){const L=rows(v,'list').map(r=>{const rev=rn(r,'rev'),gp=rev-rn(r,'cogs'),op=gp-rn(r,'opex')-rn(r,'alloc');return {r,rev,gp,op}}),R=L.reduce((s,x)=>s+x.rev,0),G=L.reduce((s,x)=>s+x.gp,0),O=L.reduce((s,x)=>s+x.op,0),best=[...L].sort((a,b)=>b.op-a.op)[0],holes=L.filter(x=>x.op<0);
  return {outs:[{label:'總營收',value:money(R)},{label:'整體毛利率',value:pct(R?G/R:NaN)},{label:'營業利益',value:money(O),tone:O>=0?'key':'bad'},{label:'獲利引擎',value:best?String(best.r.name):'—',tone:'good'},{label:'隱形虧損',value:holes.length?holes.map(x=>x.r.name).join('、'):'無',tone:holes.length?'bad':'good'}],
   tables:[{caption:'各產品線損益',head:['名稱','營收','營收占比','毛利率','營業利益','營業利益率','利潤占比'],rows:L.map(x=>[String(x.r.name),short(x.rev),pct(R?x.rev/R:0),pct(x.rev?x.gp/x.rev:0),short(x.op),pct(x.rev?x.op/x.rev:0),pct(O?x.op/O:0)]),tones:L.map(x=>x.op<0?'bad':undefined)}],
   notes:['毛利為正、營業利益為負的產品線，通常是費用或分攤過重；先檢視直接費用，再討論分攤基準是否合理。']}}},
{id:'people',group:'business',title:'員工產值與獎金分配',need:'量化各部門人事成本與產出比，設計與 KPI 掛鉤的年終獎金分配。',
 fields:[{key:'profit',label:'公司稅前淨利',def:10000000,unit:'元'},{key:'pool',label:'獎金提撥比例',def:15,unit:'%'}],
 rows:[{key:'list',label:'部門',fields:[nameRow('部門'),{key:'heads',label:'人數',def:0,unit:'人'},{key:'rev',label:'營收或毛利貢獻',def:0,unit:'元'},{key:'cost',label:'年人事成本',def:0,unit:'元'},{key:'kpi',label:'KPI 達成率',def:100,unit:'%'}],defaults:[{name:'業務部',heads:8,rev:30000000,cost:8000000,kpi:110},{name:'產品研發',heads:6,rev:12000000,cost:7200000,kpi:95},{name:'客服營運',heads:5,rev:5000000,cost:3500000,kpi:100},{name:'行政管理',heads:3,rev:2000000,cost:2400000,kpi:90}],addLabel:'新增部門'}],
 compute(v,c){const pool=num(v,'profit')*num(v,'pool')/100,L=rows(v,'list').map(r=>({r,w:Math.max(0,rn(r,'rev')-rn(r,'cost'))*rn(r,'kpi')/100})),W=L.reduce((s,x)=>s+x.w,0),H=L.reduce((s,x)=>s+rn(x.r,'heads'),0),R=L.reduce((s,x)=>s+rn(x.r,'rev'),0),i=infl(c);
  return {outs:[{label:'獎金池',value:money(pool),tone:'key'},{label:'全公司人均產值',value:money(H?R/H:NaN)},{label:'明年維持實質薪資需調薪',value:pct(i),tone:'warn',hint:'未調薪等於實質減薪'}],
   tables:[{caption:'部門產值與獎金',head:['部門','人均產值','人事成本率','KPI','部門獎金','人均獎金'],rows:L.map(x=>{const b=W?pool*x.w/W:0,h=rn(x.r,'heads');return [String(x.r.name),short(h?rn(x.r,'rev')/h:0),pct(rn(x.r,'rev')?rn(x.r,'cost')/rn(x.r,'rev'):0),rn(x.r,'kpi')+'%',short(b),short(h?b/h:0)]})}],
   notes:['分配權重＝（貢獻 − 人事成本）× KPI 達成率。行政等支援部門可另設保底比例，避免只獎勵前線。']}}},
{id:'carbon',group:'business',title:'碳費與綠色轉型成本',need:'因應碳費制度與供應鏈減碳要求，估算應繳碳費、減量後節省多少，以及節能設備的回收年數。',
 fields:[{key:'e',label:'年排放量（直接＋間接）',def:40000,unit:'公噸 CO2e'},{key:'rate',label:'適用費率',def:'一般費率 300 元',type:'select',options:['一般費率 300 元','優惠費率 A 50 元','優惠費率 B 100 元']},{key:'leak',label:'高碳洩漏風險係數（一般 1，適用者 0.2）',def:1,step:.1},{key:'cut',label:'減量計畫：減少排放',def:10,unit:'%'},{key:'capex',label:'節能設備投資',def:20000000,unit:'元'},{key:'saving',label:'每年節省能源費用',def:3000000,unit:'元'}],
 compute(v,c){const r=str(v,'rate'),price=r.includes('A')?50:r.includes('B')?100:300,general=price===300,fee=(e:number)=>e<25000?0:(general?Math.max(0,e-25000):e)*num(v,'leak')*price,E=num(v,'e'),now=fee(E),after=fee(E*(1-num(v,'cut')/100)),yearly=num(v,'saving')*(1+infl(c))+now-after;
  return {outs:[{label:'是否為收費對象',value:E>=25000?'是（年排放 ≥ 2.5 萬公噸）':'否',tone:E>=25000?'warn':'good'},{label:'目前年碳費',value:money(now),tone:'key'},{label:'減量後年碳費',value:money(after),tone:'good'},{label:'第一年總節省（能源＋碳費）',value:money(yearly)},{label:'設備投資回收',value:yearly>0?yrs(num(v,'capex')/yearly):'無法回收',tone:'key'}],
   tables:[{caption:'碳費規則重點',head:['項目','說明'],rows:[['收費對象','電力、燃氣供應業及製造業，年排放 2.5 萬公噸 CO2e 以上'],['一般費率','每公噸 300 元，收費排放量可扣除 2.5 萬公噸'],['優惠費率 A／B','50／100 元，需自主減量計畫核定，不得扣除 2.5 萬公噸'],['時程','2025 年排放量起算，2026 年 5 月首次繳納']]}],
   notes:['能源費用節省以通膨假設調升第一年；電價調漲時，節能投資回收會更快。','費率、係數與適用條件依環境部最新公告為準。']}}},

// ===== 直銷 =====
{id:'bonus',group:'sales',title:'階梯式獎金與晉升差額',need:'輸入個人與下線團隊業績，依公司聘階制度推算本月獎金與下一個晉升門檻的差額。',
 fields:[{key:'personal',label:'本月個人業績',def:30000,unit:'元'}],
 rows:[{key:'ranks',label:'聘階制度（請依所屬公司正式制度修改）',fields:[nameRow('聘階'),{key:'p',label:'個人業績門檻',def:0,unit:'元'},{key:'t',label:'團隊業績門檻',def:0,unit:'元'},{key:'rate',label:'獎金比例',def:0,unit:'%'}],defaults:[{name:'會員',p:0,t:0,rate:3},{name:'銀級',p:20000,t:100000,rate:6},{name:'金級',p:30000,t:300000,rate:9},{name:'鑽石',p:40000,t:800000,rate:12}],addLabel:'新增聘階'},
  {key:'team',label:'下線團隊本月業績',fields:[nameRow('夥伴'),{key:'sales',label:'業績',def:0,unit:'元'}],defaults:[{name:'夥伴 A',sales:60000},{name:'夥伴 B',sales:45000},{name:'夥伴 C',sales:30000},{name:'夥伴 D',sales:25000}],addLabel:'新增夥伴'}],
 compute(v,c){const P=num(v,'personal'),T=P+rows(v,'team').reduce((s,r)=>s+rn(r,'sales'),0),R=[...rows(v,'ranks')].sort((a,b)=>rn(a,'t')-rn(b,'t')),met=R.filter(r=>P>=rn(r,'p')&&T>=rn(r,'t')),cur=met[met.length-1],next=R.find(r=>!met.includes(r)),bonus=cur?T*rn(cur,'rate')/100:0;
  return {outs:[{label:'團隊總業績（含個人）',value:money(T)},{label:'目前聘階',value:cur?String(cur.name):'未達任何聘階',tone:'key'},{label:'本月預估獎金',value:money(bonus),tone:'key',hint:'以團隊業績 × 聘階比例簡化估算'},{label:next?`晉升「${next.name}」還差`:'已達最高聘階',value:next?`個人 ${money(Math.max(0,rn(next,'p')-P))}；團隊 ${money(Math.max(0,rn(next,'t')-T))}`:'—',tone:'warn'},{label:'獎金實質購買力（一年後）',value:money(bonus/(1+infl(c)))}],
   tables:[{caption:'各聘階獎金對照（同樣業績）',head:['聘階','個人門檻','團隊門檻','比例','本月可領'],rows:R.map(r=>[String(r.name),money(rn(r,'p')),money(rn(r,'t')),rn(r,'rate')+'%',met.includes(r)?money(T*rn(r,'rate')/100):'未達'])}],
   notes:['雙軌制、太陽線、代數獎金的算法不同；本表為通用模板，請依公司正式獎金辦法調整。','獎金不等於利潤：還要扣掉自用進貨、試用品、交通與行銷成本（見「進銷存」與「行銷 ROI」）。']}}},
{id:'crm',group:'sales',title:'客戶回購週期與 LTV',need:'記錄客戶購買品項與消耗速度，產品快用完時自動亮燈提醒跟進，並計算顧客終身價值與維繫成本報酬。',
 fields:[{key:'remind',label:'提前幾天提醒',def:5,unit:'天'},{key:'avg',label:'平均客單價',def:3600,unit:'元'},{key:'times',label:'每年回購次數',def:6,unit:'次'},{key:'years',label:'預期維繫年數',def:3,unit:'年'},{key:'margin',label:'毛利率',def:30,unit:'%'},{key:'care',label:'每位客戶每年維繫成本（送禮、咖啡）',def:1500,unit:'元'}],
 rows:[{key:'list',label:'客戶購買紀錄',fields:[{key:'name',label:'客戶',def:'',type:'text'},{key:'item',label:'產品',def:'',type:'text',wide:true},{key:'date',label:'購買日',def:'',type:'date'},{key:'qty',label:'數量',def:1},{key:'days',label:'每份可用天數',def:30,unit:'天'}],defaults:[{name:'王姐',item:'保健食品 A',date:'2026-09-20',qty:1,days:30},{name:'陳大哥',item:'保養組',date:'2026-08-30',qty:2,days:30},{name:'林阿姨',item:'保健食品 B',date:'2026-10-01',qty:1,days:20},{name:'張小姐',item:'洗沐組',date:'2026-07-15',qty:3,days:30}],addLabel:'新增客戶'}],
 compute(v,c){const today=new Date(c.today.getFullYear(),c.today.getMonth(),c.today.getDate()),rem=num(v,'remind'),L=rows(v,'list').map(r=>{const d=parseDate(r.date);const end=d?new Date(d.getTime()+rn(r,'qty')*rn(r,'days')*day):null;const left=end?Math.round((end.getTime()-today.getTime())/day):NaN;return {r,end,left}}).sort((a,b)=>a.left-b.left);
  const ltv=num(v,'avg')*num(v,'times')*num(v,'years')*num(v,'margin')/100,cost=num(v,'care')*num(v,'years'),red=L.filter(x=>x.left<=rem).length;
  return {outs:[{label:'今天該聯絡',value:red+' 位',tone:red?'bad':'good'},{label:'顧客終身毛利（LTV）',value:money(ltv),tone:'key'},{label:'維繫成本',value:money(cost)},{label:'維繫投資報酬率',value:pct(cost?(ltv-cost)/cost:NaN,0),tone:ltv>cost?'good':'bad'}],
   tables:[{caption:'回購提醒（依剩餘天數排序）',head:['燈號','客戶','產品','預計用完','剩餘天數'],rows:L.map(x=>[x.left<=rem?'🔴 該聯絡':x.left<=rem+7?'🟡 一週內':'🟢 正常',String(x.r.name),String(x.r.item),x.end?fmtDate(x.end):'—',Number.isFinite(x.left)?String(x.left):'—']),tones:L.map(x=>x.left<=rem?'bad':x.left<=rem+7?'warn':undefined)}],
   notes:['跟進時先關心使用感受，再談回購；客戶個資請妥善保存，不轉傳他人。']}}},
{id:'stock',group:'sales',title:'進銷存與真實利潤（含試用品）',need:'控管庫存、進貨成本與零售利潤，並把送出的試用品、體驗包成本獨立記錄，避免賺了業績卻賠了本金。',
 fields:[],
 rows:[{key:'list',label:'品項',fields:[nameRow('品項'),{key:'open',label:'期初庫存',def:0},{key:'in',label:'本期進貨',def:0},{key:'cost',label:'進貨單價',def:0,unit:'元'},{key:'sold',label:'售出',def:0},{key:'price',label:'售價',def:0,unit:'元'},{key:'sample',label:'送出試用',def:0}],defaults:[{name:'保健食品 A',open:5,in:10,cost:1200,sold:9,price:1680,sample:2},{name:'保養組',open:3,in:6,cost:2100,sold:5,price:2980,sample:1},{name:'體驗包',open:0,in:20,cost:150,sold:0,price:0,sample:18}],addLabel:'新增品項'}],
 compute(v,c){const L=rows(v,'list').map(r=>{const end=rn(r,'open')+rn(r,'in')-rn(r,'sold')-rn(r,'sample'),rev=rn(r,'sold')*rn(r,'price'),cogs=rn(r,'sold')*rn(r,'cost'),smp=rn(r,'sample')*rn(r,'cost');return {r,end,rev,cogs,smp,profit:rev-cogs-smp,stock:end*rn(r,'cost')}}),S=(k:'rev'|'cogs'|'smp'|'profit'|'stock')=>L.reduce((s,x)=>s+x[k],0);
  return {outs:[{label:'銷售額',value:money(S('rev'))},{label:'試用品成本',value:money(S('smp')),tone:'warn'},{label:'真實利潤（扣試用品）',value:money(S('profit')),tone:S('profit')>=0?'key':'bad'},{label:'庫存積壓金額',value:money(S('stock')),hint:'高通膨下，庫存不會生利息，但可能過期'}],
   tables:[{caption:'品項明細',head:['品項','期末庫存','銷售額','銷貨成本','試用品成本','真實利潤'],rows:L.map(x=>[String(x.r.name),String(x.end),money(x.rev),money(x.cogs),money(x.smp),money(x.profit)]),tones:L.map(x=>x.end<0?'bad':x.profit<0?'warn':undefined)}],
   notes:['期末庫存為負數代表紀錄有誤或有未登記的進貨。','試用品是行銷費用：搭配「行銷 ROI」追蹤送出後的成交率。']}}},
{id:'roi',group:'sales',title:'個人品牌行銷 ROI',need:'計算社群廣告、線下說明會、試用包等管道的獲客成本、轉化率與報酬，把預算留給真正有效的管道。',
 fields:[],
 rows:[{key:'list',label:'行銷管道',fields:[nameRow('管道'),{key:'spend',label:'花費',def:0,unit:'元'},{key:'leads',label:'名單數',def:0},{key:'deals',label:'成交數',def:0},{key:'first',label:'平均首單',def:0,unit:'元'},{key:'ltv',label:'預期終身毛利',def:0,unit:'元'}],defaults:[{name:'FB／IG 廣告',spend:15000,leads:60,deals:4,first:3600,ltv:6480},{name:'線下說明會',spend:12000,leads:25,deals:5,first:4200,ltv:7500},{name:'試用包',spend:6000,leads:30,deals:3,first:2500,ltv:4500},{name:'朋友轉介紹',spend:2000,leads:8,deals:3,first:3600,ltv:6480}],addLabel:'新增管道'}],
 compute(v,c){const L=rows(v,'list').map(r=>{const s=rn(r,'spend'),d=rn(r,'deals');return {r,cpl:rn(r,'leads')?s/rn(r,'leads'):NaN,cr:rn(r,'leads')?d/rn(r,'leads'):NaN,cac:d?s/d:Infinity,ratio:s?d*rn(r,'ltv')/s:NaN}}),best=[...L].filter(x=>Number.isFinite(x.ratio)).sort((a,b)=>b.ratio-a.ratio)[0],sp=L.reduce((s,x)=>s+rn(x.r,'spend'),0),dl=L.reduce((s,x)=>s+rn(x.r,'deals'),0);
  return {outs:[{label:'總花費',value:money(sp)},{label:'平均獲客成本（CAC）',value:money(dl?sp/dl:NaN),tone:'key'},{label:'效益最好的管道',value:best?String(best.r.name):'—',tone:'good'}],
   tables:[{caption:'各管道成效',head:['管道','名單成本','轉換率','獲客成本','首單 ROI','LTV ÷ CAC'],rows:L.map(x=>[String(x.r.name),money(x.cpl),pct(x.cr,0),Number.isFinite(x.cac)?money(x.cac):'未成交',pct(rn(x.r,'spend')?(rn(x.r,'deals')*rn(x.r,'first')-rn(x.r,'spend'))/rn(x.r,'spend'):NaN,0),Number.isFinite(x.ratio)?x.ratio.toFixed(1)+' 倍':'—']),tones:L.map(x=>x.ratio<1?'bad':x.ratio>=3?'good':undefined)}],
   notes:['LTV ÷ CAC 小於 1 代表越做越賠；3 倍以上通常才算健康。','首單 ROI 用首單營收計算，未扣產品成本，實際利潤更低。']}}},
{id:'growth',group:'sales',title:'組織成長現實檢查',need:'「每人找 2 人、每月倍增」只是理想。加入留存率與活躍率，看看團隊與獎金實際可能怎麼成長，並和傳統兼差比較。',
 fields:[{key:'start',label:'起始團隊人數（含自己）',def:1,unit:'人'},{key:'invite',label:'每位活躍夥伴每月帶進',def:1,unit:'人',step:.1},{key:'keep',label:'每月留存率',def:70,unit:'%'},{key:'active',label:'活躍率',def:40,unit:'%'},{key:'sales',label:'每位活躍者月業績',def:3000,unit:'元'},{key:'rate',label:'團隊獎金比例',def:8,unit:'%'},{key:'hours',label:'每月投入時數',def:40,unit:'小時'},{key:'m',label:'模擬月數',def:12,unit:'個月'}],
 compute(v,c){let N=num(v,'start');const k=num(v,'keep')/100,a=num(v,'active')/100,M=Math.min(36,num(v,'m')),tbl:string[][]=[];let ideal=num(v,'start'),last=0;
  for(let m=1;m<=M;m++){const act=Math.max(1,N*a);N=N*k+act*num(v,'invite');ideal*=2;const team=Math.max(1,N*a)*num(v,'sales'),b=team*num(v,'rate')/100;last=b;tbl.push([`第 ${m} 月`,Math.round(N).toLocaleString('zh-TW'),Math.round(Math.max(1,N*a)).toLocaleString('zh-TW'),short(team),money(b),Math.round(ideal).toLocaleString('zh-TW')])}
  const hourly=num(v,'hours')?last/num(v,'hours'):NaN;
  return {outs:[{label:`第 ${M} 月預估團隊人數`,value:Math.round(N).toLocaleString('zh-TW')+' 人',tone:'key'},{label:`第 ${M} 月預估獎金`,value:money(last),tone:'key'},{label:'換算時薪',value:money(hourly),tone:hourly<196?'bad':'good',hint:'對照 2026 年基本工資時薪 196 元'},{label:'同樣時數做時薪兼差',value:money(num(v,'hours')*196)}],
   tables:[{caption:'逐月模擬（最後一欄為「每月倍增」的理想值）',head:['月份','團隊人數','活躍人數','團隊業績','預估獎金','理想倍增人數'],rows:tbl}],
   notes:['實際成長取決於留存與活躍；理想倍增在現實中很少發生，請勿用倍增數字向他人保證收入。','直銷應依《多層次傳銷管理法》運作：收入來自商品實際銷售，而非招募入會費。']}}},
];

export const toolById=(id:string)=>tools.find(t=>t.id===id);
export function toolDefaults(t:Tool):Vals{const v:Vals={};t.fields.forEach(f=>v[f.key]=f.def);t.rows?.forEach(r=>v[r.key]=r.defaults.map(x=>({...x})));return v}
