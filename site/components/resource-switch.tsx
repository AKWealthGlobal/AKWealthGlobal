import Link from 'next/link';

const options=[
 {id:'alice',href:'/resources/alice/',title:'Alice AI 學院工具箱',desc:'依任務挑選 AI 工具：搜尋研究、翻譯、語音筆記、簡報與 AI Agent，附查證與安全檢查。',tag:'AI 工具箱'},
 {id:'ken',href:'/resources/ken/',title:'Ken 財商教室工具',desc:'內含「Ken 財商試算表」（30 張退休、長照、節稅、FIRE、現金流與直銷試算）與「Ken推薦防詐工具懶人包」（跨國官方防詐、訴訟、直銷食藥與海外房產查證）。',tag:'Ken 財商教室工具'},
] as const;

const kenSubOptions=[
 {id:'sheets',href:'/resources/ken/',badge:'分類 01｜互動試算',title:'🧮 Ken 財商試算表',desc:'6 種身分・30 張繁體中文試算表（退休提領、長照、遺產稅、FIRE、加班費、企業現金流、直銷獎金），通膨以 5% 起跳。'},
 {id:'anti-scam',href:'/resources/ken/anti-scam/',badge:'分類 02｜跨國查證',title:'🛡️ Ken推薦防詐工具懶人包',desc:'2026 最新台灣、馬來西亞、香港、新加坡與國際官方防詐、LINE 查證、司法院判決、直銷食藥與大馬房產發展商黑名單查詢。'},
] as const;

export default function ResourceSwitch({
 current,
 kenSub,
 large=false,
}:{
 current?:'alice'|'ken';
 kenSub?:'sheets'|'anti-scam';
 large?:boolean;
}){
 return (
  <div className="resource-switch-wrap">
   <nav className={'resource-switch'+(large?' large':'')} aria-label="實用AI工具資源分類">
    {options.map(o=>(
     <div key={o.id} className={'resource-switch-box '+o.id+(current===o.id?' active':'')}>
      <Link href={o.href} className={'resource-switch-item '+o.id} aria-current={current===o.id?'page':undefined}>
       <span className="resource-switch-tag">{o.tag}</span>
       <strong>{o.title}</strong>
       {large&&<span className="resource-switch-desc">{o.desc}</span>}
       <span className="resource-switch-go" aria-hidden="true">{current===o.id?'目前所在工具箱':'進入工具箱 →'}</span>
      </Link>
      {large&&o.id==='ken'&&(
       <div className="resource-ken-subcards" aria-label="Ken 財商教室工具子分類">
        {kenSubOptions.map(sub=>(
         <Link key={sub.id} href={sub.href} className="resource-ken-subcard">
          <span className="resource-ken-subbadge">{sub.badge}</span>
          <strong>{sub.title}</strong>
          <p>{sub.desc}</p>
          <span className="resource-ken-subgo">立即前往 →</span>
         </Link>
        ))}
       </div>
      )}
     </div>
    ))}
   </nav>

   {current==='ken'&&(
    <nav className="ken-sub-switch" aria-label="Ken 財商教室工具分類切換">
     <div className="ken-sub-switch-head">
      <span className="ken-sub-switch-kicker">Ken 財商教室工具・2 大分類</span>
      <span>先算清財務缺口，再守住資產安全</span>
     </div>
     <div className="ken-sub-switch-grid">
      {kenSubOptions.map(sub=>{
       const active=kenSub===sub.id;
       return (
        <Link
         key={sub.id}
         href={sub.href}
         className={'ken-sub-switch-item'+(active?' active':'')}
         aria-current={active?'page':undefined}
        >
         <div className="ken-sub-switch-top">
          <span className="ken-sub-switch-badge">{sub.badge}</span>
          <span className="ken-sub-switch-state">{active?'目前開啟中':'切換至此工具 →'}</span>
         </div>
         <strong>{sub.title}</strong>
         <p>{sub.desc}</p>
        </Link>
       );
      })}
     </div>
    </nav>
   )}
  </div>
 );
}
