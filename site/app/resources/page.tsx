import Link from 'next/link';
import ResourceSwitch from '@/components/resource-switch';
import './resources.css';

export const metadata={title:'實用AI工具資源｜Alice AI 學院工具箱與 Ken 財商教室試算表',description:'AK Wealth Global 實用AI工具資源：Alice AI 學院工具箱依任務挑選 AI 工具；Ken 財商教室提供退休、長照、節稅、FIRE、加班費、企業現金流與直銷經營等 30 張試算表。',alternates:{canonical:'/resources/'}};

export default function Resources(){return <main className="wrap section ai-resources">
 <header className="resource-hero"><div className="resource-hero-copy"><p className="eyebrow gold">AK Wealth Global｜原創整理</p><h1>實用AI工具資源</h1><p className="resources-lead">先選你要的工具箱：用 AI 把事情做得更快，或用試算表把錢看得更清楚。</p></div><aside className="resource-hero-note"><span>兩個工具箱</span><p>AI 幫你做事，<br/>試算表幫你看清錢。</p><small>編輯檢視：2026 年 10 月 16 日</small></aside></header>
 <ResourceSwitch large/>
 <p className="resources-meta">財商試算表為教育用途的估算工具，不構成投資、稅務、法律或保險建議。<Link href="/resources/ken/#basics">從財商基礎開始 →</Link></p>
</main>}
