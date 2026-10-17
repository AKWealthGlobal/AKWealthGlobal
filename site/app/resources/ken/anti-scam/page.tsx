import Link from 'next/link';
import ResourceSwitch from '@/components/resource-switch';
import KenAntiScam from '@/components/ken-anti-scam';
import { ANTI_SCAM_REVIEWED, ANTI_SCAM_TOOLS, REGIONS } from '@/lib/ken-anti-scam';
import '../../resources.css';
import '../ken-tools.css';

export const metadata = {
  title: 'Ken推薦防詐工具懶人包｜Ken 財商教室工具｜跨國官方防詐、公司訴訟與房產查證',
  description: `2026 最新整理 ${ANTI_SCAM_TOOLS.length} 項免費官方與權威防詐查證工具：涵蓋台灣（165、數發部、LINE 查證、司法院裁判書、LawPlayer、公平會直銷、食藥署、標檢局）、馬來西亞（PDRM Semak Mule、NSRC 997、KPKT Teduh 發展商黑名單、LPPEH 房仲執照）、香港（防騙視伏器 Scameter、證監會 SFC）、新加坡（ScamShield、MAS）與國際通用（IOSCO、DFPI、FCA、ASIC、VirusTotal）。`,
  alternates: { canonical: '/resources/ken/anti-scam/' },
};

export default function KenAntiScamPage() {
  const countryCount = REGIONS.length - 1;
  return (
    <main className="wrap section ai-resources ken-sheets ken-antiscam-page">
      <ResourceSwitch current="ken" kenSub="anti-scam" />
      <header className="resource-hero">
        <div className="resource-hero-copy">
          <p className="eyebrow gold">實用AI工具資源｜Ken 財商教室工具｜分類 02</p>
          <h1>Ken推薦防詐工具懶人包</h1>
          <p className="resources-lead">
            在點擊陌生連結、匯款轉帳、加入投資群組、簽署商業合約、參與直銷或跨境置產前，先花 30 秒用各國政府官方與權威資料庫交叉查證，守住辛苦累積的資產。
          </p>
        </div>
        <aside className="resource-hero-note">
          <span>
            {countryCount} 大國家地區・{ANTI_SCAM_TOOLS.length} 項權威工具
          </span>
          <p>
            先查證再點擊，
            <br />
            轉帳前必核對官方名錄。
          </p>
          <small>官方連結與資訊檢視：{ANTI_SCAM_REVIEWED.replace(/-/g, '/')}</small>
        </aside>
      </header>

      <KenAntiScam />

      <details className="resource-sources">
        <summary>官方資料來源、查證原則與免責聲明</summary>
        <p>
          本頁由 AK Wealth Global 依各國政府主管機關、司法機關、警政防詐中心、金融監管機構及國際資安組織公開之免費查證管道整理，所有連結均指向官方或權威機構原始網站，絕無編造。
        </p>
        <ul>
          <li>
            <strong>台灣官方機構：</strong>
            <a href="https://165.npa.gov.tw/" target="_blank" rel="noopener noreferrer">內政部警政署 165 全民防騙網</a>・
            <a href="https://fraudbuster.digiat.org.tw/accessibility/" target="_blank" rel="noopener noreferrer">數位發展部網路詐騙通報查詢網</a>・
            <a href="https://moneywise.fsc.gov.tw/" target="_blank" rel="noopener noreferrer">金管會金融智慧網</a>・
            <a href="https://judgment.judicial.gov.tw/" target="_blank" rel="noopener noreferrer">司法院裁判書查詢系統</a>・
            <a href="https://announcement.mol.gov.tw/" target="_blank" rel="noopener noreferrer">勞動部違反勞動法令事業單位查詢系統</a>・
            <a href="https://fair.ftc.gov.tw/fair/report/report_search.aspx" target="_blank" rel="noopener noreferrer">公平會多層次傳銷透明查詢平臺</a>・
            <a href="https://pmds.fda.gov.tw/illegalad/" target="_blank" rel="noopener noreferrer">衛福部食藥署違規廣告查詢系統</a>・
            <a href="https://safety.bsmi.gov.tw/" target="_blank" rel="noopener noreferrer">經濟部標檢局商品安全資訊網</a>
          </li>
          <li>
            <strong>馬來西亞官方機構：</strong>
            <a href="https://semakmule.rmp.gov.my/" target="_blank" rel="noopener noreferrer">皇家警察 PDRM Semak Mule</a>・
            <a href="https://www.bnm.gov.my/fca" target="_blank" rel="noopener noreferrer">馬來西亞國家銀行 BNM Financial Consumer Alert</a>・
            <a href="https://www.sc.com.my/regulation/enforcement/investor-alert-list" target="_blank" rel="noopener noreferrer">大馬證監會 SC Investor Alert List</a>・
            <a href="https://teduh.kpkt.gov.my/" target="_blank" rel="noopener noreferrer">房政部 KPKT Teduh 系統</a>・
            <a href="https://search.lppeh.gov.my/" target="_blank" rel="noopener noreferrer">房產董事局 LPPEH 執照查詢</a>
          </li>
          <li>
            <strong>香港、新加坡與國際官方監管：</strong>
            <a href="https://cyberdefender.hk/scameter/" target="_blank" rel="noopener noreferrer">香港警務處防騙視伏器 Scameter</a>・
            <a href="https://www.sfc.hk/tc/alert-list" target="_blank" rel="noopener noreferrer">香港證監會 SFC 無牌公司及可疑網站名單</a>・
            <a href="https://www.scamshield.gov.sg/" target="_blank" rel="noopener noreferrer">新加坡政府 ScamShield</a>・
            <a href="https://www.mas.gov.sg/investor-alert-list" target="_blank" rel="noopener noreferrer">新加坡金管局 MAS Investor Alert List</a>・
            <a href="https://www.iosco.org/i-scan/" target="_blank" rel="noopener noreferrer">國際證管會組織 IOSCO I-SCAN</a>・
            <a href="https://dfpi.ca.gov/consumers/crypto/crypto-scam-tracker/" target="_blank" rel="noopener noreferrer">美國加州 DFPI Crypto Scam Tracker</a>
          </li>
        </ul>
        <p className="resources-meta">
          使用界線：詐騙網域與手法每日翻新，「未列於黑名單」不代表絕對安全；本頁資訊僅供防詐教育與查證輔助，不構成法律、投資或置產建議。遇疑似犯罪或資金受損，請立即撥打當地警政反詐專線並親自報案。
        </p>
      </details>

      <p className="resources-back">
        <Link href="/resources/ken/">← 切換至 Ken 財商試算表（30 張）</Link>・
        <Link href="/money/">回 Ken 財商教室漫畫</Link>・
        <Link href="/resources/alice/">看 Alice AI 學院工具箱</Link>
      </p>
    </main>
  );
}
