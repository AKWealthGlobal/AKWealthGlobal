import Link from 'next/link';

export const metadata = {
  title: '認識 Alice 與 Ken',
  description: 'AK Wealth Global 的品牌理念、Ken 與 Alice 的背景、公開認證、作品方向與免費資源整理。',
  alternates: { canonical: '/about/' },
};

const BRAND = 'https://ak-wealth-global.kit.com/';

const principles = [
  { title: '先看風險，再談機會', text: '先弄清楚可能的代價與底線，再討論值得投入的方向。' },
  { title: '善用科技，提升效率', text: '把 AI 當成放大生產力的工具，而不是取代判斷。' },
  { title: '放眼全球，增加選擇', text: '用更寬的視野比較資訊與資源，讓自己多一些選項。' },
  { title: '不教你一夜致富', text: '陪你看懂下一步，建立帶得走的真實能力與底氣。' },
];

const kenFacts = [
  '曾經歷逾 70 萬美元的負債低谷，在翻身過程中重建對收入、資產與風險的底層認知。',
  '2018 至 2026 年擔任國際財商系統的亞洲區教練與講師，累積破千場大型演講經驗。',
  '超過 8 年金融市場實務投資經驗、超過 12 年團隊行銷發展策略經驗。',
  '持續分享全球市場趨勢，協助更多人看清財務本質與人生選擇。',
];

const aliceFacts = [
  '具備台北企業資訊部行銷經理的管理與溝通經驗，擅長把流程講清楚、做出來。',
  '專注 AI 實戰流程自動化：把複雜的 AI 變現工具化，把繁瑣的海外落地本地化。',
  '長期整理馬來西亞在地資源：公司設立與廠房選址、法規與產業資源、第二家園（MM2H）與在地專業人士對接。',
  '擁有多項 AI 與數位行銷相關國際認證，證書均可點擊連到官方頁面查證。',
];

const certs = [
  { title: 'AI and Digital Transformation in Government', by: 'UNESCO × 牛津大學賽德商學院', href: 'https://certify.sbs.ox.ac.uk/24122657-1a3c-451a-a910-ae1a78dd68f9#acc.QBOJ476y' },
  { title: 'AI, Justice, and the Rule of Law', by: 'UNESCO × 牛津大學', href: 'https://certify.sbs.ox.ac.uk/33967362-cc96-4f0b-aa2c-8f9a80b582d3#acc.2rH3oXMb' },
  { title: 'One Million Prompters', by: '杜拜未來基金會 × 杜拜人工智慧中心', href: 'https://omp.dub.ai/certificate/9dUpc25MxA3O' },
  { title: 'Google AI Professional Certificate', by: 'Google × Coursera', href: 'https://coursera.org/share/0d355332006657814b005e3b117c88b2' },
  { title: '生成式引擎最佳化（GEO）專業資格', by: 'Coursera', href: 'https://coursera.org/share/bb2dce1b6a463a98405af84de4c336db' },
  { title: 'Introduction to Virtual Reality', by: '倫敦大學 × Coursera', href: 'https://coursera.org/share/c87a30ab6834d2c885a6e381b84adf66' },
  { title: 'OpenAI Academy 結業證書', by: 'OpenAI Academy', href: 'https://academy.openai.com/public/certificate/q3e3yvlk0d' },
  { title: 'Claude Code in Action', by: 'Anthropic × Coursera', href: 'https://coursera.org/share/3aa8882c99b01d1220d1ee0805277016' },
  { title: 'Rakyat Digital 結業證書（一）', by: '微軟、Google 與馬來西亞政府', href: 'https://pepper-s-site-1c7b.thinkific.com/certificates/nj1jpuxhsr' },
  { title: 'Rakyat Digital 結業證書（二）', by: '微軟、Google 與馬來西亞政府', href: 'https://pepper-s-site-1c7b.thinkific.com/certificates/mp9gljkabq' },
  { title: 'Rakyat Digital 結業證書（三）', by: '微軟與馬來西亞政府', href: 'https://app.kajabi.com/certificates/603a560d' },
  { title: 'Rakyat Digital 結業證書（四）', by: '微軟與馬來西亞政府', href: 'https://app.kajabi.com/certificates/4d9db751' },
];

const workThemes = [
  '真實感人像與專業運鏡：自然光影、表情與五官，不要塑膠磨皮感。',
  '懷舊情感與行銷風格影片：從馬來西亞老咖啡店到美食、景區介紹與產品形象。',
  '品牌與 IP 影片：Ken 的 IP 短影片、綠能科技減碳系統行銷影片、AIGC 行銷觀念。',
  '玄幻短劇風格特效、3D 場景與原創 AI 主題曲 MV。',
];

const links = [
  { label: '3D 六合院（互動作品）', href: 'https://claude.ai/artifact/PtX5qALKaRNMAiW2HT2aYB' },
  { label: '《白虎鈴》AI 主題曲', href: 'https://suno.com/song/0ff7d0f9-05f8-4800-afa7-9b5adcc1d06b' },
];

const videos = [
  { label: '負債 70 萬美金的真相（Part 1）', href: 'https://www.youtube.com/watch?v=pxuZLjq1MCY' },
  { label: '負債 70 萬美金的真相（Part 2）', href: 'https://www.youtube.com/watch?v=NYexJY5Z85M' },
  { label: '穿越回過去，你真的賺得到錢？', href: 'https://www.youtube.com/watch?v=oDDnzFfRoh0' },
  { label: 'AI 時代的陌生開發', href: 'https://www.youtube.com/watch?v=2TkZWUXBLWw' },
];

export default function About() {
  return (
    <section className="wrap section about-page">
      <p className="eyebrow">AK Wealth Global</p>
      <h1>用 AI 放大效率，<br />用全球分散風險。</h1>
      <p className="lead">連結 AI 科技，布局全球資產。Connect AI. Build Global Wealth.</p>
      <p>
        在 AI 時代，技術的普及讓「生產力」變得便宜；真正拉開差距的，是資產配置的決策力與抗風險的財務思維。
        我們把複雜的 AI、財商、跨境資產與全球機會，整理成更容易理解、更能實際運用的方法。
      </p>

      <section className="section">
        <h2>我們的四個原則</h2>
        <div className="about-principles">
          {principles.map((p) => (
            <article className="about-card" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>關於 Ken 與 Alice</h2>
        <div className="bio-grid">
          <article className="bio">
            <span className="tag">Ken 季秉澤 · 財商認知與資產配置思考者</span>
            <h3>讓故事成為判斷的練習</h3>
            <ul className="about-list">
              {kenFacts.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <Link className="text-link" href="/money/">進入 Ken 財商教室 →</Link>
          </article>
          <article className="bio">
            <span className="tag">Alice Q 郭芷錡 · AI 實戰流程自動化顧問</span>
            <h3>讓你的想法有畫面，也能落地</h3>
            <ul className="about-list">
              {aliceFacts.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <Link className="text-link" href="/ai/">進入 Alice AI 學院 →</Link>
          </article>
        </div>
        <p className="meta">以上資歷依 AK Wealth Global 品牌頁的自述整理；證書可點擊下方連結，到發證單位頁面自行查證。</p>
      </section>

      <section className="section">
        <h2>Alice 的 AI 相關認證</h2>
        <div className="about-certs">
          {certs.map((c) => (
            <a className="about-cert" key={c.href} href={c.href} target="_blank" rel="noreferrer">
              <strong>{c.title}</strong>
              <span>{c.by}</span>
              <em>查看證書 ↗</em>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Alice 的 AI 作品方向</h2>
        <p>從 2024 年的實驗到 2026 年的作品，Alice 追求的是真實感、專業運鏡與自然的表情五官，並把行銷話術與創意腳本交給 AI 流程運作。</p>
        <ul className="about-list">
          {workThemes.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <div className="about-actions">
          {links.map((l) => (
            <a className="button secondary" key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Ken 的影音分享</h2>
        <p>頻道「Ken 季秉澤負債翻身學」分享人生故事、財商觀念與 AI 時代的行銷思維。</p>
        <div className="about-actions">
          {videos.map((v) => (
            <a className="button secondary" key={v.href} href={v.href} target="_blank" rel="noreferrer">{v.label} ↗</a>
          ))}
        </div>
      </section>

      <section className="section about-free">
        <h2>免費領取實用工具包</h2>
        <p>《2026 AI 新手實戰地圖》與《2027 全球資產韌性地圖》（精華懶人包），可在品牌頁訂閱領取。我們尊重你的隱私，你可以隨時取消訂閱。</p>
        <a className="button primary" href={BRAND} target="_blank" rel="noreferrer">前往 AK 品牌頁領取</a>
      </section>

      <section className="section">
        <h2>我們怎麼整理內容</h2>
        <p>以自有教材、實作筆記和可追溯的參考資料為基礎。原創內容、編輯摘要與延伸閱讀分別標示；工具包提供實際可用的練習，而非保證成果。</p>
        <p className="meta">本站內容僅供教育與資訊分享，不構成個別投資建議，也不承諾報酬。涉及投資、跨境資產或法規的決定，請自行查證並諮詢合格的專業人士。</p>
        <a className="button secondary" href={BRAND} target="_blank" rel="noreferrer">前往 AK 品牌頁</a>
      </section>
    </section>
  );
}
