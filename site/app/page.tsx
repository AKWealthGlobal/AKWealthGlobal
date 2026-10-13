import Link from 'next/link';
import Image from 'next/image';
import {ArrowRight,ChevronRight,Clapperboard,BookOpen,Sparkles,Download,Compass} from 'lucide-react';
import {faq} from '@/lib/content';
import BrandMethod from '@/components/brand-method';
import topics from '@/lib/alice-topics.json';
import {kenComics} from '@/lib/ken-comics';
export default function Home(){return <>
<section className="hero wrap"><div className="hero-copy"><p className="eyebrow"><span/> 每一次學習，都向前一點</p><h1>學 <em>AI</em>，<br/>懂<span className="gold">金錢。</span></h1><p className="hero-sub">從一個小練習開始。<span className="desktop-only"><br/>把未來的能力，帶進今天的生活。</span></p><div className="hero-choices"><Link className="button hero-choice hero-choice-alice" href="/learn/">我想學 AI · Alice<ArrowRight size={20}/></Link><Link className="button hero-choice hero-choice-ken" href="/money/">我想懂財商 · Ken<ArrowRight size={20}/></Link></div></div><div className="hero-art"><Image src="/media/characters/ai-buddy.webp" alt="AK 的 AI 小夥伴機器人，揮手歡迎你開始學習" fill sizes="(max-width: 700px) 50vw, 520px" priority/></div></section>
<section className="gateways wrap" aria-label="選擇學習方向"><Link href="/ai/" className="gateway cyan"><Image className="ken-avatar ip-avatar" src="/media/characters/alice-ip.webp" width={85} height={96} alt="Alice AI學院 Q 版形象"/><div><p className="eyebrow">把想法，做成作品</p><h2><em>Alice</em> AI 學院</h2><p>{topics.length} 個主題 · 漫畫與生活實作</p></div><ChevronRight/></Link><Link href="/money/" className="gateway amber"><Image className="ken-avatar ip-avatar" src="/media/characters/ken-ip.webp" width={85} height={96} alt="Ken 季秉澤 Q 版形象"/><div><p className="eyebrow">把故事，變成判斷力</p><h2><span className="gold">Ken 季秉澤</span> · 財商教室</h2><p>{kenComics.length} 篇漫畫 · 親子與成人共讀</p></div><ChevronRight/></Link></section><BrandMethod/>



<section className="section wrap"><p className="eyebrow">Alice AI學院</p><h2>{topics.length} 個主題，從 AI 入門到生活實作</h2><p>依年齡與需求瀏覽完整主題與已上架的六格漫畫。</p><Link className="button primary" href="/learn/">瀏覽 Alice AI學院<ArrowRight size={20}/></Link></section>
<section className="kids-banner wrap"><div><p className="eyebrow gold"><Compass size={17}/> 全家一起探索</p><h2>3D 親子財商大富翁</h2><p>一起探索四區動物都市。<br/>選擇分齡模式，練習預算與生活取捨。</p><Link className="button gold-button" href="/kids/">開始合作冒險<ArrowRight size={20}/></Link><small>免登入 · 不收集孩子的個人資料</small></div><div className="kids-number" aria-hidden="true">24<span>格冒險<br/>全家一起選擇</span></div></section>
<section className="section wrap about-strip"><Sparkles size={30}/><div><h2>認識 Alice 與 Ken</h2><p>從 AI 創作到財商思考，陪你把學到的用出來。</p></div><Link href="/about/" className="icon-button" aria-label="認識 Alice 與 Ken"><ArrowRight/></Link></section>
<section className="section wrap faq"><p className="eyebrow">開始之前，你可能想問</p><h2>常見問題</h2>{faq.map(f=><details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))})}}/>
</>}




