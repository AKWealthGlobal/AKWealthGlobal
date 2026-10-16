import Link from 'next/link';

const options=[
 {id:'alice',href:'/resources/alice/',title:'Alice AI 學院工具箱',desc:'依任務挑選 AI 工具：搜尋研究、翻譯、語音筆記、簡報與 AI Agent，附查證與安全檢查。',tag:'AI 工具'},
 {id:'ken',href:'/resources/ken/',title:'Ken 財商教室',desc:'30 張財商試算表：退休提領、長照、遺產稅、FIRE、加班費、現金流、直銷獎金，通膨以 5% 起跳。',tag:'財商試算表'},
] as const;

export default function ResourceSwitch({current,large=false}:{current?:'alice'|'ken';large?:boolean}){
 return <nav className={'resource-switch'+(large?' large':'')} aria-label="實用AI工具資源分類">{options.map(o=><Link key={o.id} href={o.href} className={'resource-switch-item '+o.id} aria-current={current===o.id?'page':undefined}><span className="resource-switch-tag">{o.tag}</span><strong>{o.title}</strong>{large&&<span className="resource-switch-desc">{o.desc}</span>}<span className="resource-switch-go" aria-hidden="true">{current===o.id?'目前位置':'前往 →'}</span></Link>)}</nav>;
}
