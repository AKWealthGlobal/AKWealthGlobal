'use client';
import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {Check,Copy,Printer,RotateCcw} from 'lucide-react';
import {groups,tools,toolDefaults,MIN_INFLATION,type Tool,type Vals,type Row,type Field,type GroupId,type Out} from '@/lib/ken-tools';
import KenShareForm,{SHEET_ENDPOINT} from '@/components/ken-share-form';

const STORE='ak-ken-tools-v1';
const INFL_VERSION=2; // 通膨下限改為 5% 後，舊的通膨設定不再沿用
const INFL_PRESETS:[number,string][]=[[5,'5% 保守底線'],[6,'6% 醫療外食'],[8,'8% 高通膨'],[10,'10% 壓力測試']];
const TEXT_COLS=new Set(['生活樣貌','定義','說明','計算方式','客戶','產品','狀態','燈號']);

function load():{inflation?:number;inflationVersion?:number;vals?:Record<string,Vals>}{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}}
function save(d:object){try{localStorage.setItem(STORE,JSON.stringify(d))}catch{}}

function Input({f,value,onChange,compact=false}:{f:Field;value:unknown;onChange:(x:string|number)=>void;compact?:boolean}){
 const id=useId();
 const label=<span className={compact?'sr-only':'ken-field-label'}>{f.label}{f.unit&&!compact?<small>（{f.unit}）</small>:null}</span>;
 let ctrl;
 if(f.type==='select')ctrl=<select id={id} value={String(value??'')} onChange={e=>onChange(e.target.value)}>{f.options!.map(o=><option key={o}>{o}</option>)}</select>;
 else if(f.type==='text'||f.type==='date')ctrl=<input id={id} type={f.type} value={String(value??'')} onChange={e=>onChange(e.target.value)}/>;
 else ctrl=<input id={id} type="number" inputMode="decimal" step={f.step??'any'} min={f.min} max={f.max} value={value===''||value===undefined?'':Number(value)} onChange={e=>onChange(e.target.value===''?'':Number(e.target.value))}/>;
 return <label htmlFor={id} className={'ken-field'+(f.wide?' wide':'')}>{label}{ctrl}{f.hint&&!compact&&<small className="ken-field-hint">{f.hint}</small>}</label>;
}

// 恢復範例數字會清掉使用者填的內容，所以要按兩次：第一次變成「確定恢復？」，4 秒內再按一次才執行。
function ActionRow({onReset,toolTitle,groupName,inflation,outs}:{onReset:()=>void;toolTitle:string;groupName:string;inflation:number;outs:Out[]}){
 const [armed,setArmed]=useState(false);
 const [copied,setCopied]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>>(undefined);
 const copyTimer=useRef<ReturnType<typeof setTimeout>>(undefined);
 useEffect(()=>()=>{clearTimeout(timer.current);clearTimeout(copyTimer.current)},[]);
 const reset=()=>{if(!armed){setArmed(true);clearTimeout(timer.current);timer.current=setTimeout(()=>setArmed(false),4000);return}clearTimeout(timer.current);setArmed(false);onReset()};
 const copySummary=async()=>{
  const text=[`【Ken 財商試算表｜${toolTitle}（${groupName}）】`,`通膨假設：每年 ${Math.max(MIN_INFLATION,inflation)}%`,'',...outs.map(o=>`・${o.label}：${o.value}${o.hint?`（${o.hint}）`:''}`)].join('\n');
  try{await navigator.clipboard.writeText(text);setCopied(true);clearTimeout(copyTimer.current);copyTimer.current=setTimeout(()=>setCopied(false),2500)}catch{}
 };
 return <div className="ken-actions" role="group" aria-label="試算表工具">
  <button type="button" className={'ken-act'+(copied?' copied':'')} onClick={copySummary}>{copied?<Check size={20} aria-hidden="true"/>:<Copy size={20} aria-hidden="true"/>}<span>{copied?'已複製試算摘要':'複製試算摘要'}</span></button>
  <button type="button" className={'ken-act'+(armed?' armed':'')} onClick={reset} onBlur={()=>setArmed(false)}><RotateCcw size={20} aria-hidden="true"/><span>{armed?'再按一次確定恢復':'恢復範例數字'}</span></button>
  <button type="button" className="ken-act" onClick={()=>window.print()}><Printer size={20} aria-hidden="true"/><span>列印／存 PDF</span></button>
  <span className="sr-only" role="status">{armed?'將清除你填的數字，再按一次確認':copied?'已複製試算摘要到剪貼簿':''}</span>
 </div>;
}

function Calculator({tool,vals,setVals,inflation,groupName}:{tool:Tool;vals:Vals;setVals:(v:Vals)=>void;inflation:number;groupName:string}){
 const effInfl=Math.max(MIN_INFLATION,inflation);
 const res=useMemo(()=>{try{return tool.compute(vals,{inflation,today:new Date()})}catch{return {outs:[{label:'計算錯誤',value:'請檢查輸入內容',tone:'bad' as const}]}}},[tool,vals,inflation]);
 const setField=(k:string,x:string|number)=>setVals({...vals,[k]:x});
 const rowsOf=(k:string)=>(vals[k] as Row[])||[];
 const setRow=(k:string,i:number,fk:string,x:string|number)=>setVals({...vals,[k]:rowsOf(k).map((r,j)=>j===i?{...r,[fk]:x}:r)});
 return <div className="ken-calc">
  {tool.fields.length>0&&<div className="ken-fields">{tool.fields.map(f=><Input key={f.key} f={f} value={vals[f.key]} onChange={x=>setField(f.key,x)}/>)}</div>}
  {tool.rows?.map(spec=><fieldset className="ken-rows" key={spec.key}><legend>{spec.label}</legend>
   <div className="ken-row-table" role="table" aria-label={spec.label}>
    <div className="ken-row head" role="row">{spec.fields.map(f=><span role="columnheader" key={f.key} className={f.wide?'wide':''}>{f.label}{f.unit?`（${f.unit}）`:''}</span>)}<span aria-hidden="true"/></div>
    {rowsOf(spec.key).map((r,i)=><div className="ken-row" role="row" key={i}>{spec.fields.map(f=><div role="cell" key={f.key} className={f.wide?'wide':''} data-label={f.label}><Input compact f={f} value={r[f.key]} onChange={x=>setRow(spec.key,i,f.key,x)}/></div>)}<button type="button" className="ken-del" aria-label={`刪除第 ${i+1} 列`} onClick={()=>setVals({...vals,[spec.key]:rowsOf(spec.key).filter((_,j)=>j!==i)})}>刪除</button></div>)}
   </div>
   <button type="button" className="ken-add" onClick={()=>setVals({...vals,[spec.key]:[...rowsOf(spec.key),Object.fromEntries(spec.fields.map(f=>[f.key,f.def]))]})}>＋ {spec.addLabel||'新增一列'}</button>
  </fieldset>)}
  <section className="ken-results" aria-live="polite" aria-label="試算結果">
   <div className="ken-results-head">
    <h4>試算結果</h4>
    <span className="ken-results-meta">通膨假設：每年 {effInfl}%・修改上方欄位即時更新</span>
   </div>
   <div className="ken-outs">{res.outs.map(o=><div key={o.label} className={'ken-out '+(o.tone||'')}><span>{o.label}</span><strong>{o.value}</strong>{o.hint&&<small>{o.hint}</small>}</div>)}</div>
   {res.tables?.map(t=><div className="ken-table-wrap" key={t.caption}><table><caption>{t.caption}</caption><thead><tr>{t.head.map((h,j)=><th key={h} scope="col" className={j===0||TEXT_COLS.has(h)?'col-text':''}>{h}</th>)}</tr></thead><tbody>{t.rows.map((r,i)=>{const tone=t.tones?.[i]||'';return <tr key={i} className={tone}>{r.map((c,j)=>j===0?<th scope="row" key={j}>{c}{tone==='key'&&<span className="ken-row-badge">目前位置</span>}</th>:<td key={j} className={TEXT_COLS.has(t.head[j])?'col-text':''}>{c}</td>)}</tr>})}</tbody></table></div>)}
   {res.notes&&<ul className="ken-notes">{res.notes.map(n=><li key={n}>{n}</li>)}</ul>}
  </section>
  <ActionRow onReset={()=>setVals(toolDefaults(tool))} toolTitle={tool.title} groupName={groupName} inflation={effInfl} outs={res.outs}/>
  <KenShareForm payload={{tool:tool.id,toolTitle:tool.title,group:groupName,inflation:effInfl,inputs:vals,results:res.outs}}/>
 </div>;
}

export default function KenToolkit(){
 const [group,setGroup]=useState<GroupId>('basics');
 const [open,setOpen]=useState<string>('hours');
 const [inflation,setInflation]=useState(MIN_INFLATION);
 const [draft,setDraft]=useState(String(MIN_INFLATION));
 const [vals,setValsAll]=useState<Record<string,Vals>>({});
 const [ready,setReady]=useState(false);
 useEffect(()=>{const d=load();if(d.inflationVersion===INFL_VERSION&&d.inflation&&d.inflation>=MIN_INFLATION){setInflation(d.inflation);setDraft(String(d.inflation))}if(d.vals)setValsAll(d.vals);const h=location.hash.slice(1),t=tools.find(x=>x.id===h),g=groups.find(x=>x.id===h);if(t){setGroup(t.group);setOpen(t.id)}else if(g){setGroup(g.id);setOpen(tools.find(x=>x.group===g.id)!.id)}setReady(true)},[]);
 useEffect(()=>{if(ready)save({inflation,inflationVersion:INFL_VERSION,vals})},[inflation,vals,ready]);
 const g=groups.find(x=>x.id===group)!,list=tools.filter(t=>t.group===group);
 const applyInflation=(val:number)=>{const ok=Number.isFinite(val)?Math.min(50,Math.max(MIN_INFLATION,val)):MIN_INFLATION;setInflation(ok);setDraft(String(ok))};
 const commitInflation=()=>applyInflation(Number(draft));
 return <div className="ken-toolkit">
  <div className="ken-inflation" role="group" aria-labelledby="ken-infl-title">
   <div>
    <strong id="ken-infl-title">全站通膨假設</strong>
    <p>台灣個人／家庭通膨每年 <b>{MIN_INFLATION}% 起跳</b>。官方 CPI 約 2%，但房租、外食、醫療與照護的實際漲幅常遠高於此；所有試算統一採用這個保守數字，留足安全邊際。</p>
    <div className="ken-infl-presets" role="group" aria-label="快速切換通膨假設">
     {INFL_PRESETS.map(([v,label])=><button key={v} type="button" className={'ken-infl-chip'+(inflation===v?' active':'')} onClick={()=>applyInflation(v)}>{label}</button>)}
    </div>
   </div>
   <label className="ken-infl-input"><span>年通膨</span><input type="number" min={MIN_INFLATION} max={50} step={0.5} value={draft} onChange={e=>setDraft(e.target.value)} onBlur={commitInflation} onKeyDown={e=>{if(e.key==='Enter')commitInflation()}} aria-describedby="ken-infl-note"/><span>%</span></label>
   <small id="ken-infl-note">可自行輸入或點上方按鈕快速切換（最低 {MIN_INFLATION}%）。{inflation!==MIN_INFLATION&&<>目前以 <b>{inflation}%</b> 計算中・<button type="button" className="ken-infl-reset" onClick={()=>applyInflation(MIN_INFLATION)}>恢復 {MIN_INFLATION}% 預設</button></>}</small>
  </div>
  <div className="ken-groups" role="tablist" aria-label="依身分選擇試算表">{groups.map(x=><button key={x.id} role="tab" aria-selected={x.id===group} className={x.id===group?'active':''} onClick={()=>{setGroup(x.id);setOpen(tools.find(t=>t.group===x.id)!.id);history.replaceState(null,'','#'+x.id)}}>{x.short}<small>{tools.filter(t=>t.group===x.id).length} 張</small></button>)}</div>
  <section className="ken-group" role="tabpanel" aria-label={g.title}>
   <header className="ken-group-head"><h2>{g.title}</h2><p className="ken-core">核心需求：{g.core}</p>
    <div className="ken-analysis"><div><span>馬斯洛需求</span><p>{g.maslow}</p></div><div><span>PESTLE 影響</span><p>{g.pestle}</p></div><div><span>財富階層</span><p>{g.tier}</p></div></div>
    <nav className="ken-quick-nav" aria-label={`${g.short}試算表快速切換`}>{list.map((t,i)=><button key={t.id} type="button" className={'ken-quick-pill'+(open===t.id?' active':'')} onClick={()=>{setOpen(t.id);history.replaceState(null,'','#'+t.id);document.getElementById(t.id)?.scrollIntoView({behavior:'smooth',block:'start'})}}><span>{String(i+1).padStart(2,'0')}</span>{t.title}</button>)}</nav>
   </header>
   <div className="ken-tool-list">{list.map((t,i)=>{const isOpen=open===t.id;return <article className={'ken-tool'+(isOpen?' open':'')} key={t.id} id={t.id}>
    <h3><button type="button" aria-expanded={isOpen} aria-controls={'panel-'+t.id} onClick={()=>{setOpen(isOpen?'':t.id);if(!isOpen)history.replaceState(null,'','#'+t.id)}}><span className="ken-tool-no">{String(i+1).padStart(2,'0')}</span><span className="ken-tool-title">{t.title}<small>{t.need}</small></span><span className="ken-tool-toggle" aria-hidden="true">{isOpen?'收合':'開始試算'}</span></button></h3>
    {isOpen&&<div id={'panel-'+t.id}>{t.source&&<p className="ken-source">{t.source}，AK Wealth Global 依台灣情境重新設計</p>}<Calculator tool={t} groupName={g.short} inflation={inflation} vals={vals[t.id]||toolDefaults(t)} setVals={v=>setValsAll(all=>({...all,[t.id]:v}))}/></div>}
   </article>})}</div>
  </section>
  <p className="ken-privacy">{SHEET_ENDPOINT?'你輸入的數字預設只存在這台裝置的瀏覽器；只有你勾選同意並按下「送出」，才會傳給 AK Wealth Global。':'你輸入的數字只存在這台裝置的瀏覽器，不會自動上傳。'}</p>
 </div>;
}
