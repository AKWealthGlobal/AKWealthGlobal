import Link from 'next/link';
import ResourceSwitch from '@/components/resource-switch';
import './resources.css';

export const metadata={title:'實用AI工具資源｜Alice AI 學院工具箱與 Ken 財商教室工具（財商試算表・防詐工具懶人包）',description:'AK Wealth Global 實用AI工具資源：Alice AI 學院工具箱依任務挑選 AI 工具；Ken 財商教室工具分為「Ken 財商試算表」（30 張退休、長照、節稅、FIRE、企業現金流與直銷試算表）與「Ken推薦防詐工具懶人包」（2026 跨國官方防詐、公司訴訟、直銷食藥與房產發展商黑名單查詢）。',alternates:{canonical:'/resources/'}};

export default function Resources(){return <main className="wrap section ai-resources">
 <header className="resource-hero"><div className="resource-hero-copy"><p className="eyebrow gold">AK Wealth Global｜原創整理</p><h1>實用AI工具資源</h1><p className="resources-lead">先選你要的工具箱：用 AI 把事情做得更快，或到「Ken 財商教室工具」用試算表把錢看清楚、用官方防詐工具守住資產安全。</p></div><aside className="resource-hero-note"><span>兩大工具箱・三大主題</span><p>AI 幫你做事，<br/>試算表與防詐幫你守財。</p><small>編輯檢視：2026 年 10 月 18 日</small></aside></header>
 <ResourceSwitch large/>
 <p className="resources-meta">財商試算表與防詐查證指南為教育與輔助用途，不構成投資、稅務、法律或保險建議。<Link href="/resources/ken/#basics">從財商試算表開始 →</Link>・<Link href="/resources/ken/anti-scam/">查驗防詐工具懶人包 →</Link></p>
</main>}
