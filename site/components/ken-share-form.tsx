'use client';
import {useId,useState} from 'react';
import Link from 'next/link';
import type {Out,Vals} from '@/lib/ken-tools';

// Google 試算表收件網址（Apps Script 網頁應用程式）。沒設定時整個表單不顯示，網站不會傳送任何資料。
// 只接受 script.google.com 的 /exec 網址，避免設定錯誤時把資料送到別處。設定方式見 docs/ken-google-sheet-setup.md。
const RAW_ENDPOINT = process.env.NEXT_PUBLIC_KEN_SHEET_URL?.trim() ?? '';
export const SHEET_ENDPOINT = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(RAW_ENDPOINT) ? RAW_ENDPOINT : '';
const KEN_EMAIL = 'peterwang1018@gmail.com';

const MAX_BODY = 20000;
const TIMEOUT_MS = 15000;
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

type Status = 'idle' | 'sending' | 'ok' | 'unknown' | 'fail' | 'toolarge';
type ShareLevel = 'summary' | 'full';

export type SharePayload = {tool: string; toolTitle: string; group: string; inflation: number; inputs: Vals; results: Out[]};

export default function KenShareForm({payload}: {payload: SharePayload}) {
  const base = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [shareLevel, setShareLevel] = useState<ShareLevel>('summary');
  const [trap, setTrap] = useState(''); // 給機器人填的隱藏欄位，真人看不到
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const submit = async () => {
    if (!SHEET_ENDPOINT || !agree || !validEmail(email) || status === 'sending') return;
    const body = JSON.stringify({
      consent: true,
      website: trap,
      shareLevel,
      tool: payload.tool,
      toolTitle: payload.toolTitle,
      group: payload.group,
      inflation: payload.inflation,
      name: name.trim(),
      email: email.trim(),
      topic: topic.trim(),
      inputs: shareLevel === 'full' ? payload.inputs : undefined,
      results: payload.results.map(o => ({label: o.label, value: o.value})),
      page: location.origin + location.pathname,
    });
    if (body.length > MAX_BODY) { setStatus('toolarge'); return; }
    setStatus('sending');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      // text/plain 屬於「簡單請求」，Apps Script 不需要預檢也能收到。
      const res = await fetch(SHEET_ENDPOINT, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body, signal: ctrl.signal});
      if (!res.ok) { setStatus('fail'); return; }
      const data = await res.json().catch(() => null);
      setStatus(data?.ok === true && data?.notified === true ? 'ok' : data?.ok === true ? 'unknown' : data ? 'fail' : 'unknown');
    } catch {
      setStatus('unknown');
    } finally {
      clearTimeout(timer);
    }
  };

  const message: Record<Status, string> = {
    idle: '',
    sending: '送出中…',
    ok: '已寄出，Ken 已收到通知。請留意 Email；若需要即時聯繫，也可以透過 Ken 的 LINE。',
    unknown: '寄送狀態無法確認，請先透過 Ken 的 LINE 聯繫確認，避免重複提交。',
    fail: '送出沒有成功，請稍後再試一次。你填寫的內容還在這個頁面。',
    toolarge: '這張試算表的內容太多，無法送出。請減少列數後再試。',
  };

  const [copiedDraft, setCopiedDraft] = useState(false);
  const done = status === 'ok';
  const buildDraftBody = () => {
    const summary = payload.results.map(o => `・${o.label}：${o.value}`).join('\n');
    return [`Ken 您好，`, '', `我想討論：${topic || '這份試算結果'}`, `試算表：${payload.toolTitle}（${payload.group}）`, `通膨假設：每年 ${payload.inflation}%`, '', '【試算結果摘要】', summary, '', `稱呼：${name.trim() || '（未填）'}`, `回覆 Email：${email.trim()}`, '', '我同意 AK Wealth Global 使用以上內容回覆這次諮詢。'].join('\n');
  };
  const mailto = () => {
    if (!agree || !validEmail(email)) return;
    const subject = `Ken 財商諮詢｜${payload.toolTitle}`;
    window.location.href = `mailto:${KEN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildDraftBody())}`;
  };
  const copyDraft = async () => {
    if (!agree || !validEmail(email)) return;
    try {
      await navigator.clipboard.writeText(`主旨：Ken 財商諮詢｜${payload.toolTitle}\n收件人：${KEN_EMAIL}\n\n${buildDraftBody()}`);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 3000);
    } catch {}
  };
  const label = status === 'sending' ? '送出中…' : done ? '已寄出 ✓' : '寄送試算摘要給 Ken';
  const canSend = agree && validEmail(email);
  return (
    <section className="ken-share" aria-labelledby={base + 't'}>
      <div className="ken-share-intro">
        <span className="ken-share-kicker">下一步｜和 Ken 討論你的財務問題</span>
        <h4 id={base + 't'}>想知道這份結果可以怎麼行動？</h4>
        <p>把試算結果寄給 Ken，諮詢時就能從你最關心的問題開始。{SHEET_ENDPOINT ? '只有你勾選同意並按下寄送，資料才會傳出。' : '只有你勾選同意、開啟 Email 草稿並在郵件程式按下傳送，資料才會寄出。'}</p>
      </div>
      {SHEET_ENDPOINT ? (
        <fieldset className="ken-share-choice" disabled={done || status === 'sending'}>
          <legend>選擇要分享的內容</legend>
          <label><input type="radio" name={base + 'level'} value="summary" checked={shareLevel === 'summary'} onChange={() => setShareLevel('summary')} /><span><strong>只寄送摘要（推薦）</strong><small>試算表名稱、分類與下方結果摘要；不含你輸入的原始財務明細</small></span></label>
          <label><input type="radio" name={base + 'level'} value="full" checked={shareLevel === 'full'} onChange={() => setShareLevel('full')} /><span><strong>連同完整試算內容</strong><small>另包含你填寫的各項輸入數字，方便 Ken 針對細節精準回覆</small></span></label>
        </fieldset>
      ) : null}
      <div className="ken-share-preview" aria-label="本次將附上的試算結果摘要">
        <div className="ken-share-preview-head">
          <strong>本次將附上的試算結果摘要</strong>
          <span>{SHEET_ENDPOINT && shareLevel === 'full' ? '另含你填寫的輸入明細' : '僅傳送以下摘要・不含原始輸入明細'}</span>
        </div>
        <div className="ken-share-preview-items">
          {payload.results.map(o => <span key={o.label} className="ken-share-chip"><small>{o.label}</small><b>{o.value}</b></span>)}
        </div>
      </div>
      <div className="ken-share-fields">
        <label className="ken-field" htmlFor={base + 'n'}><span className="ken-field-label">怎麼稱呼你 <small>（選填）</small></span><input id={base + 'n'} type="text" placeholder="例如：王先生／Amy" maxLength={40} value={name} onChange={e => setName(e.target.value)} autoComplete="given-name" disabled={done} /></label>
        <label className="ken-field" htmlFor={base + 'e'}><span className="ken-field-label">Email <small>（必填，Ken 用來回覆你）</small></span><input id={base + 'e'} type="email" placeholder="name@example.com" maxLength={120} required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" disabled={done} /></label>
        <label className="ken-field ken-share-topic" htmlFor={base + 'topic'}><span className="ken-field-label">你最想和 Ken 討論什麼？ <small>（選填）</small></span><select id={base + 'topic'} value={topic} onChange={e => setTopic(e.target.value)} disabled={done}><option value="">選擇一個主題（可略過）</option><option>退休與現金流</option><option>家庭預算與債務</option><option>投資與資產配置</option><option>稅務與傳承</option><option>企業財務</option><option>其他財商問題</option></select></label>
      </div>
      <label className="ken-share-trap" aria-hidden="true">請勿填寫<input tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)} /></label>
      <details className="ken-share-scope"><summary>資料會如何使用與保存？</summary><p>摘要模式只會附上試算名稱、分類、結果摘要、通膨設定、Email、稱呼與諮詢主題{SHEET_ENDPOINT ? '；完整模式另含你填寫的數字' : '，不會附加你的原始輸入數字'}。資料只供 Ken 回覆這次諮詢並改善相關試算服務，不公開、不出售。請勿填入身分證字號、帳號或密碼。詳見<Link href="/privacy/">隱私說明</Link>。</p></details>
      <label className="ken-share-consent"><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} disabled={done} /><span>我已閱讀上方資料說明，並同意 AK Wealth Global 將所選試算內容與我的 Email 提供給 Ken，用於回覆這次諮詢。這不代表訂閱行銷訊息。</span></label>
      {SHEET_ENDPOINT ? (
        <button type="button" className={'button primary ken-share-send' + (done ? ' done' : '')} disabled={!canSend || status === 'sending' || done || status === 'unknown'} onClick={submit}>{label}</button>
      ) : (
        <div className="ken-share-mail-actions">
          <button type="button" className="button primary ken-share-send ken-share-mail" disabled={!canSend} onClick={mailto}>開啟 Email 摘要草稿</button>
          <button type="button" className={'ken-act ken-share-copy' + (copiedDraft ? ' copied' : '')} disabled={!canSend} onClick={copyDraft}>{copiedDraft ? '已複製諮詢信內容 ✓（可貼到信箱或 LINE）' : '複製諮詢信內容（無郵件軟體時使用）'}</button>
        </div>
      )}
      {!validEmail(email) && !done && <small className="ken-share-hint">步驟 1：請先填寫有效 Email，並勾選上方同意說明</small>}
      {validEmail(email) && !agree && !done && <small className="ken-share-hint">步驟 2：請勾選上方同意說明後即可傳送</small>}
      {status !== 'idle' && <p role="status" className={'ken-share-status ' + status}>{message[status]}</p>}
    </section>
  );
}
