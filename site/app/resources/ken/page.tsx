import Link from 'next/link';
import ResourceSwitch from '@/components/resource-switch';
import KenToolkit from '@/components/ken-toolkit';
import {groups,tools,REVIEWED} from '@/lib/ken-tools';
import '../resources.css';
import './ken-tools.css';

export const metadata={title:'Ken 財商試算表｜Ken 財商教室工具｜退休、長照、節稅、FIRE、現金流',description:`Ken 財商教室工具：收錄 ${tools.length} 張繁體中文財商試算表（熟齡退休提領、長照醫療、遺產贈與稅、FIRE、XIRR、房貸提前還本、綜所稅、加班費、緊急預備金、企業現金流、損益兩平、碳費與直銷獎金）及「Ken推薦防詐工具懶人包」。`,alternates:{canonical:'/resources/ken/'}};

export default function KenSheets(){return <main className="wrap section ai-resources ken-sheets">
 <ResourceSwitch current="ken" kenSub="sheets"/>
 <header className="resource-hero"><div className="resource-hero-copy"><p className="eyebrow gold">實用AI工具資源｜Ken 財商教室工具｜分類 01</p><h1>Ken 財商試算表</h1><p className="resources-lead">依身分挑選試算表，填入自己的數字，立刻看到缺口與下一步。每張表都有範例數字，可以直接改成自己的；若想查證可疑網址、投資平台、公司訴訟或直銷與房產黑名單，請切換至上方「<Link href="/resources/ken/anti-scam/">Ken推薦防詐工具懶人包</Link>」。</p></div><aside className="resource-hero-note"><span>{groups.length} 種身分・{tools.length} 張試算表</span><p>通膨 5% 起跳，<br/>規劃留足安全邊際。</p><small>法規數字檢視：{REVIEWED.replace(/-/g,'/')}</small></aside></header>
 <KenToolkit/>
 <details className="resource-sources"><summary>設計依據、資料來源與使用界線</summary>
  <p>試算表依「時間換金錢、個人通膨、預算比例、開支縮減、存款與資產、行動計畫」等財商練習的觀念，由 AK Wealth Global 以台灣法規與生活情境重新設計，不重製原練習本內容。財富等級採「台灣財富淨資產 10 等級」常見分類，僅作對照，非官方統計。</p>
  <ul>
   <li>遺產稅、贈與稅（115 年發生案件）：財政部公告免稅額 1,333 萬、贈與免稅額 244 萬，級距維持不變。</li>
   <li>綜合所得稅（115 年度所得、116 年申報）：免稅額 10.1 萬、標準扣除 13.6／27.2 萬、薪資扣除 22.7 萬，級距 61／138／277／519 萬。</li>
   <li>2026 年基本工資：月薪 29,500 元、時薪 196 元；加班費依勞動基準法第 24、39 條。</li>
   <li>碳費：一般費率每公噸 300 元，優惠費率 50／100 元，年排放 2.5 萬公噸以上收費，2026 年 5 月首次繳納。</li>
   <li>勞保老年年金：平均月投保薪資 × 年資 × 0.775% ＋ 3,000，與 × 1.55% 擇優。</li>
  </ul>
  <ul>
   <li><a href="https://www.mof.gov.tw/" target="_blank" rel="noopener noreferrer">財政部</a>・<a href="https://www.ntbt.gov.tw/" target="_blank" rel="noopener noreferrer">財政部各地區國稅局</a></li>
   <li><a href="https://calcr2.mol.gov.tw/Index" target="_blank" rel="noopener noreferrer">勞動部勞動條件及就業平等試算</a>・<a href="https://calcr2.mol.gov.tw/trial" target="_blank" rel="noopener noreferrer">勞保年金試算</a>・<a href="https://calcr2.mol.gov.tw/pension" target="_blank" rel="noopener noreferrer">勞工個人退休金試算</a></li>
   <li><a href="https://www.bli.gov.tw/" target="_blank" rel="noopener noreferrer">勞動部勞工保險局</a>・<a href="https://1966.gov.tw/" target="_blank" rel="noopener noreferrer">衛福部長照專區（1966）</a>・<a href="https://www.moenv.gov.tw/" target="_blank" rel="noopener noreferrer">環境部</a></li>
   <li>延伸參考：<a href="https://rfa.pension.org.tw/RetireComputer-Person/" target="_blank" rel="noopener noreferrer">好命退休計算機</a>・<a href="https://tool.yp-finance.com/coast-fire" target="_blank" rel="noopener noreferrer">COAST FIRE 計算機</a>・<a href="https://www.quantsnote.com/retirement-calculator/" target="_blank" rel="noopener noreferrer">Quants Note 退休計算機</a></li>
  </ul>
  <p className="resources-meta">本頁為教育用途的估算工具，不構成投資、稅務、法律、保險或傳銷收入的建議與保證。稅率與補助會調整，正式申報請以主管機關最新公告及專業人士意見為準。</p>
 </details>
 <p className="resources-back"><Link href="/resources/ken/anti-scam/">前往 Ken推薦防詐工具懶人包 →</Link>・<Link href="/money/">回 Ken 財商教室漫畫</Link>・<Link href="/resources/alice/">看 Alice AI 學院工具箱</Link></p>
</main>}
