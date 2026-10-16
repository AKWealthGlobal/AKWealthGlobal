import Image from 'next/image';
import Link from 'next/link';
import {kenComics} from '@/lib/ken-comics';

const ages=['5–8歲','9–12歲','18歲＋'];
const ageIds=['young','junior','adult'];
const ageThemes=['童話冒險','模擬經營','科幻與商業'];
const ageDescriptions=['從具體的生活選擇開始，適合家長陪伴共讀。','用因果、任務與策略，理解選擇的代價。','保持可愛畫風，深入探討價格、制度與風險。'];
const collections=[
  {name:'投資詐騙與平台風險',description:'從高報酬話術、熟人推薦到提款困難，練習查核平台與資金風險。'},
  {name:'金融史與市場週期',description:'用歷史案例理解繁榮、槓桿與危機如何交替，避免把過去當成必然預測。'},
  {name:'黃金與總體經濟',description:'認識貨幣制度、通膨、美元與黃金價格週期，分清避險用途和價格風險。'},
  {name:'世界政策與市場',description:'看懂政策、利率與國際局勢，如何透過價格、匯率與成本傳到日常生活。'},
  {name:'家庭世代與生活成本',description:'從人口變化、住房、長照到物價，整理家庭長期的支出與責任分工。'},
  {name:'科技工作與收入',description:'AI、自動化與平台工作如何改變任務、收入與風險，先拆解再判斷。'},
  {name:'跨境資產與法律',description:'匯款、海外房產、遺產與監管規則因地而異，學會知道該向哪裡查。'},
  {name:'氣候能源與生活風險',description:'高溫、水災、能源與供應鏈，如何影響保費、電費與家庭預算。'},
  {name:'資產配置與風險基礎',description:'目標、期限、費用與風險承受度，建立看懂配置的基本問題，不提供個別建議。'},
];
const collectionIds=['fraud','history','gold','world','family','tech','crossborder','climate','allocation'];

export default function KenClassroom(){
 const regular=(age:string)=>kenComics.filter(c=>c.age===age&&!c.category);
 const themed=(category:string)=>kenComics.filter(c=>c.category===category);
 const shown=collections.filter(group=>themed(group.name).length>0);
 const cards=(items:typeof kenComics)=> <div className="ken-grid">{items.map(c=><article key={c.slug} className="ken-card"><Link href={`/money/${c.slug}/`} aria-label={`閱讀${c.title}`}><img src={c.image} alt={c.imageFile?`${c.title}六格漫畫，Ken老師帶領讀者理解${c.concept}`:`${c.title}四格漫畫，Ken老師帶領學員理解${c.concept}`} width={1024} height={'imageFile' in c?1280:1536} loading="lazy"/><div className="ken-card-copy"><p className="ken-tag">{c.concept}</p><h3>{c.title}</h3><p>{c.question}</p><span className="ken-read">閱讀故事 →</span></div></Link></article>)}</div>;
 return <div className="wrap section ken-classroom"><header className="ken-home-hero"><div className="ken-home-copy"><p className="eyebrow gold">Ken 季秉澤 · 漫畫學財商</p><h1>Ken 財商教室</h1><p className="lead">從糖果攤到未來城市，和 Ken 一起看懂錢的冒險。讀漫畫故事，聊一個生活問題，練習做自己的選擇。</p><p>目前收錄 <strong>{kenComics.length}</strong> 篇漫畫，依年齡和主題一起探索。</p></div><div className="ken-home-art"><Image src="/media/characters/ken-ip.webp" alt="Ken 季秉澤漫畫形象" width={320} height={350} priority/></div></header><nav className="ken-age-nav" aria-label="選擇年齡與主題"><a href="#young">🎒 5–8歲</a><a href="#junior">🏫 9–12歲</a><a href="#adult">👔 18歲＋</a><Link href="/resources/ken/">🧮 財商試算表</Link>{shown.map(group=><a key={group.name} href={`#${collectionIds[collections.indexOf(group)]}`}>{group.name}</a>)}</nav>{ages.map((age,i)=><section key={age} id={ageIds[i]} className="ken-age-section"><h2 className="ken-section-title"><Image src="/media/characters/ken-ip.webp" alt="" width={58} height={58}/>{age} · {ageThemes[i]}</h2><p>{ageDescriptions[i]}</p>{cards(regular(age))}</section>)}{shown.map(group=><section key={group.name} id={collectionIds[collections.indexOf(group)]} className="ken-age-section"><h2>{group.name}</h2><p>{group.description}</p>{cards(themed(group.name))}</section>)}<aside className="ken-note">故事與數字是教學示意，並非市場預測或個別投資建議。投資可能虧損；{shown.length?'涉及即時行情、統計與法律案件時，請查看各篇官方來源及查閱日期。':'幼小內容以認識金錢與生活選擇為主。'}</aside></div>
}
