'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Copy,
  PhoneCall,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import {
  ANTI_SCAM_TOOLS,
  CALLER_ID_COMPARISON,
  DOMAIN_GUIDES,
  EMERGENCY_HOTLINES,
  LINE_2026_STEPS,
  PHISHING_TRAITS,
  REGIONS,
  SCENARIOS,
  type RegionId,
  type ScenarioId,
} from '@/lib/ken-anti-scam';

export default function KenAntiScam() {
  const [region, setRegion] = useState<RegionId>('all');
  const [scenario, setScenario] = useState<ScenarioId>('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string>('');

  useEffect(() => {
    const h = window.location.hash.slice(1);
    const matchedRegion = REGIONS.find(r => r.id === h);
    if (matchedRegion) setRegion(matchedRegion.id);
    const matchedScenario = SCENARIOS.find(s => s.id === h);
    if (matchedScenario) setScenario(matchedScenario.id);
  }, []);

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      setTimeout(() => setCopiedId(prev => (prev === key ? '' : prev)), 2200);
    } catch {}
  };

  const regionCounts = useMemo(() => {
    const map: Record<RegionId, number> = {
      all: ANTI_SCAM_TOOLS.length,
      tw: 0,
      my: 0,
      hk: 0,
      sg: 0,
      global: 0,
    };
    for (const t of ANTI_SCAM_TOOLS) {
      map[t.region] = (map[t.region] || 0) + 1;
    }
    return map;
  }, []);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ANTI_SCAM_TOOLS.filter(t => {
      if (region !== 'all' && t.region !== region) return false;
      if (scenario !== 'all' && t.scenario !== scenario) return false;
      if (!q) return true;
      const haystack = [
        t.title,
        t.org,
        t.summary,
        t.howTo,
        t.regionLabel,
        t.scenarioLabel,
        ...t.keywords,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [region, scenario, query]);

  const activeRegionMeta = REGIONS.find(r => r.id === region) || REGIONS[0];

  return (
    <div className="ken-antiscam">
      {/* 1. 各國黃金救援與反詐緊急專線 */}
      <section className="antiscam-sos" aria-labelledby="antiscam-sos-title">
        <div className="antiscam-sos-head">
          <div className="antiscam-sos-title-wrap">
            <span className="antiscam-sos-badge">
              <ShieldAlert size={18} aria-hidden="true" />
              黃金救援專線
            </span>
            <h2 id="antiscam-sos-title">不小心點了連結或錢已經轉出去？立即撥打官方專線攔截</h2>
          </div>
          <p>
            轉帳後<strong>黃金 24 小時內</strong>通報，警方與反詐中心能最快協同銀行啟動緊急圈存與資金凍結，通話後請務必前往當地警局完成正式報案。
          </p>
        </div>
        <div className="antiscam-sos-grid">
          {EMERGENCY_HOTLINES.map(h => (
            <article className="antiscam-sos-card" key={h.region}>
              <div className="antiscam-sos-top">
                <span className="antiscam-sos-region">{h.region}</span>
                <span className="antiscam-sos-hours">{h.hours}</span>
              </div>
              <div className="antiscam-sos-main">
                <a href={`tel:${h.tel}`} className="antiscam-sos-num" aria-label={`撥打 ${h.region} 反詐專線 ${h.number}`}>
                  <PhoneCall size={20} aria-hidden="true" />
                  <span>{h.number}</span>
                </a>
                <strong>{h.org}</strong>
              </div>
              <p>{h.action}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 2. 快速跳轉錨點導覽 */}
      <nav className="antiscam-jump" aria-label="防詐懶人包章節快速導覽">
        <a href="#antiscam-directory">🔍 跨國查證工具庫（{ANTI_SCAM_TOOLS.length} 項）</a>
        <a href="#guide-phishing">⚠️ 釣魚連結 3 大特徵</a>
        <a href="#guide-line">💬 LINE 防詐 2026 設定</a>
        <a href="#guide-caller">📞 Whoscall vs Truecaller</a>
        <a href="#guide-company-law">⚖️ 台灣公司訴訟與直銷食藥查核</a>
        <a href="#guide-my-property">🏠 大馬房產發展商黑名單</a>
      </nav>

      {/* 3. 國家地區切換 ＋ 情境篩選 ＋ 關鍵字搜尋 */}
      <section id="antiscam-directory" className="antiscam-explorer" aria-labelledby="antiscam-dir-title">
        <div className="antiscam-filter-panel">
          <div className="antiscam-filter-header">
            <div>
              <p className="eyebrow gold">STEP 1｜依國家地區與查證情境篩選</p>
              <h2 id="antiscam-dir-title">免費官方與權威防詐查證工具庫</h2>
            </div>
            <label className="antiscam-search">
              <Search size={19} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="搜尋工具、機關或關鍵字（如：LINE、判決、直銷、Teduh、轉數快、165）"
                aria-label="搜尋防詐與查證工具"
              />
              {query && (
                <button
                  type="button"
                  className="antiscam-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="清除搜尋字詞"
                >
                  清除
                </button>
              )}
            </label>
          </div>

          {/* 國家地區 Tabs */}
          <div className="antiscam-region-tabs" role="tablist" aria-label="選擇國家或地區">
            {REGIONS.map(r => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={region === r.id}
                className={'antiscam-region-tab' + (region === r.id ? ' active' : '')}
                onClick={() => {
                  setRegion(r.id);
                  history.replaceState(null, '', r.id === 'all' ? '#antiscam-directory' : '#' + r.id);
                }}
              >
                <span className="antiscam-region-flag" aria-hidden="true">
                  {r.flag}
                </span>
                <span className="antiscam-region-name">{r.short}</span>
                <small>{regionCounts[r.id]} 個工具</small>
              </button>
            ))}
          </div>

          {/* 查證情境 Pills */}
          <div className="antiscam-scenario-bar" role="group" aria-label="依查證情境過濾">
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                type="button"
                aria-pressed={scenario === s.id}
                className={'antiscam-scenario-pill' + (scenario === s.id ? ' active' : '')}
                onClick={() => setScenario(s.id)}
              >
                <span aria-hidden="true">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* 當前地區說明與篩選狀態 */}
          <div className="antiscam-status-bar">
            <p>
              <strong>{activeRegionMeta.flag} {activeRegionMeta.label}：</strong>
              {activeRegionMeta.desc}
            </p>
            <div className="antiscam-status-meta">
              <span>目前顯示 <b>{filteredTools.length}</b> / {ANTI_SCAM_TOOLS.length} 項工具</span>
              {(region !== 'all' || scenario !== 'all' || query !== '') && (
                <button
                  type="button"
                  className="antiscam-reset-btn"
                  onClick={() => {
                    setRegion('all');
                    setScenario('all');
                    setQuery('');
                  }}
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  重置篩選
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 工具卡片網格 */}
        {filteredTools.length === 0 ? (
          <div className="antiscam-empty" role="status">
            <h3>找不到符合此條件的查證工具</h3>
            <p>請嘗試切換為「全部地區總覽」或「全部查證情境」，也可以試試搜尋「網址」、「投資」、「判決」或「直銷」。</p>
            <button
              type="button"
              className="ken-act"
              onClick={() => {
                setRegion('all');
                setScenario('all');
                setQuery('');
              }}
            >
              顯示全部 {ANTI_SCAM_TOOLS.length} 項查證工具
            </button>
          </div>
        ) : (
          <div className="antiscam-grid">
            {filteredTools.map(tool => {
              const isCopied = copiedId === tool.id;
              return (
                <article className="antiscam-card" key={tool.id} id={tool.id}>
                  <div className="antiscam-card-top">
                    <span className="antiscam-tag-region">{tool.regionLabel}</span>
                    <span className={`antiscam-tag-badge ${tool.badge}`}>
                      <ShieldCheck size={14} aria-hidden="true" />
                      {tool.badgeLabel}
                    </span>
                    <span className="antiscam-tag-scenario">{tool.scenarioLabel}</span>
                  </div>

                  <div className="antiscam-card-body">
                    <h3>{tool.title}</h3>
                    <p className="antiscam-card-org">出品／主管機關：{tool.org}</p>
                    <p className="antiscam-card-summary">{tool.summary}</p>
                    <div className="antiscam-card-howto">
                      <strong>💡 實戰查證怎麼做：</strong>
                      <span>{tool.howTo}</span>
                    </div>
                  </div>

                  <div className="antiscam-card-actions">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="antiscam-btn-primary"
                      aria-label={`${tool.ctaLabel || '前往官方網站'}：${tool.title}（新分頁開啟）`}
                    >
                      <span>{tool.ctaLabel || '前往官方查詢'}</span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </a>

                    {tool.copyValue && (
                      <button
                        type="button"
                        className={'antiscam-btn-secondary' + (isCopied ? ' copied' : '')}
                        onClick={() => copyText(tool.id, tool.copyValue!)}
                      >
                        {isCopied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                        <span>{isCopied ? `已複製 ${tool.copyValue}` : `${tool.copyLabel || '複製'} ${tool.copyValue}`}</span>
                      </button>
                    )}

                    {tool.hotline && (
                      <a href={`tel:${tool.hotline.replace(/[^0-9+]/g, '')}`} className="antiscam-btn-hotline">
                        <PhoneCall size={15} aria-hidden="true" />
                        <span>專線 {tool.hotline}</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. 專題一：辨識詐騙連結的 3 個核心特徵 */}
      <section id="guide-phishing" className="antiscam-section" aria-labelledby="title-phishing">
        <div className="antiscam-section-head">
          <span className="antiscam-section-no">專題 01</span>
          <div>
            <p className="eyebrow gold">點擊任何陌生連結前必看</p>
            <h2 id="title-phishing">🔍 辨識詐騙釣魚連結的 3 個核心特徵</h2>
            <p>無論在台灣、馬來西亞、香港或新加坡，跨國詐騙集團的釣魚網站都脫離不了以下三個技術與心理特徵：</p>
          </div>
        </div>
        <div className="antiscam-traits-grid">
          {PHISHING_TRAITS.map(trait => (
            <article className="antiscam-trait-card" key={trait.no}>
              <div className="antiscam-trait-top">
                <span className="antiscam-trait-no">{trait.no}</span>
                <span className="antiscam-trait-badge">
                  <AlertTriangle size={14} aria-hidden="true" />
                  {trait.badge}
                </span>
              </div>
              <h3>{trait.title}</h3>
              <ul>
                {trait.points.map(pt => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 5. 專題二：LINE 防詐設定與查證四部曲（2026 最新） */}
      <section id="guide-line" className="antiscam-section" aria-labelledby="title-line">
        <div className="antiscam-section-head">
          <span className="antiscam-section-no">專題 02</span>
          <div>
            <p className="eyebrow gold">台灣與亞洲用戶最常遭遇管道</p>
            <h2 id="title-line">💬 LINE 連結與訊息防詐：2026 必開設定與查證四部曲</h2>
            <p>群組收到「免費貼圖下載、幫忙小孩投票、高薪遠距徵才、水電費催繳、朋友急借錢」時，請依序執行這四步防護：</p>
          </div>
        </div>
        <div className="antiscam-steps-grid">
          {LINE_2026_STEPS.map(s => (
            <article className="antiscam-step-card" key={s.step}>
              <span className="antiscam-step-num">{s.step}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="antiscam-quick-copy-row">
          <span>常用 LINE 查證機器人一鍵複製：</span>
          <button
            type="button"
            className={'antiscam-chip-btn' + (copiedId === 'line-fc' ? ' copied' : '')}
            onClick={() => copyText('line-fc', '@linefactchecker')}
          >
            {copiedId === 'line-fc' ? <Check size={15} /> : <Copy size={15} />}
            <span>{copiedId === 'line-fc' ? '已複製 @linefactchecker' : '複製 LINE 訊息查證 @linefactchecker'}</span>
          </button>
          <button
            type="button"
            className={'antiscam-chip-btn' + (copiedId === 'line-tm' ? ' copied' : '')}
            onClick={() => copyText('line-tm', '@jwv3010k')}
          >
            {copiedId === 'line-tm' ? <Check size={15} /> : <Copy size={15} />}
            <span>{copiedId === 'line-tm' ? '已複製 @jwv3010k' : '複製 趨勢科技防詐達人 @jwv3010k'}</span>
          </button>
        </div>
      </section>

      {/* 6. 專題三：Whoscall vs. Truecaller 來電辨識與隱私安全比較 */}
      <section id="guide-caller" className="antiscam-section" aria-labelledby="title-caller">
        <div className="antiscam-section-head">
          <span className="antiscam-section-no">專題 03</span>
          <div>
            <p className="eyebrow gold">來電辨識 App 怎麼挑？</p>
            <h2 id="title-caller">📞 Whoscall 與 Truecaller 深度實測對比（資料庫準確度・個資隱私・廣告體驗）</h2>
            <p>兩款主流防詐來電辨識工具在「在地商家辨識率」、「通訊錄個資上傳風險」與「介面廣告體驗」上有顯著差異：</p>
          </div>
        </div>
        <div className="antiscam-compare-wrap">
          <table className="antiscam-compare-table">
            <caption>Whoscall vs. Truecaller 三大維度客觀比較</caption>
            <thead>
              <tr>
                <th scope="col">評估維度</th>
                <th scope="col">Whoscall（Gogolook 台灣上市公司）</th>
                <th scope="col">Truecaller（瑞典跨國來電辨識平台）</th>
              </tr>
            </thead>
            <tbody>
              {CALLER_ID_COMPARISON.map(row => (
                <tr key={row.dimension}>
                  <th scope="row">{row.dimension}</th>
                  <td>{row.whoscall}</td>
                  <td>{row.truecaller}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. 專題四＆五：台灣公司訴訟／直銷食藥 ＆ 馬來西亞房產發展商黑名單實戰指南 */}
      <section className="antiscam-section" aria-labelledby="title-domain-guides">
        <div className="antiscam-section-head">
          <span className="antiscam-section-no">專題 04</span>
          <div>
            <p className="eyebrow gold">簽約、求職、買保健品與跨國置產前必讀</p>
            <h2 id="title-domain-guides">⚖️ 公司訴訟、直銷食藥安全與海外房產發展商查核攻略</h2>
            <p>除了釣魚簡訊外，大額財務損失往往來自「問題企業合作、違法吸金傳銷、誇大療效商品」與「海外爛尾房產」。以下是專業盡職調查（Due Diligence）步驟：</p>
          </div>
        </div>
        <div className="antiscam-domain-list">
          {DOMAIN_GUIDES.map(g => (
            <article className="antiscam-domain-card" key={g.id} id={g.id}>
              <span className="antiscam-domain-badge">{g.badge}</span>
              <h3>{g.title}</h3>
              <p className="antiscam-domain-sub">{g.subtitle}</p>
              <div className="antiscam-domain-tips">
                {g.tips.map((tip, idx) => (
                  <div className="antiscam-domain-tip" key={tip.head}>
                    <span>0{idx + 1}</span>
                    <div>
                      <strong>{tip.head}</strong>
                      <p>{tip.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
