'use client';
import {useId,useState} from 'react';
import Link from 'next/link';
import type {Out,Vals} from '@/lib/ken-tools';

// Google 試算表收件網址（Apps Script 網頁應用程式）。沒設定時整個表單不顯示，網站不會傳送任何資料。
// 只接受 script.google.com 的 /exec 網址，避免設定錯誤時把資料送到別處。設定方式見 docs/ken-google-sheet-setup.md。
const RAW_ENDPOINT = process.env.NEXT_PUBLIC_KEN_SHEET_URL?.trim() ?? '';
export const SHEET_ENDPOINT = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(RAW_ENDPOINT) ? RAW_ENDPOINT : '';

const MAX_BODY = 20000;
const TIMEOUT_MS = 15000;

type Status = 'idle' | 'sending' | 'ok' | 'unknown' | 'fail' | 'toolarge';

export type SharePayload = {tool: string; toolTitle: string; group: string; inflation: number; inputs: Vals; results: Out[]};

export default function KenShareForm({payload}: {payload: SharePayload}) {
  const base = useId();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [trap, setTrap] = useState(''); // 給機器人填的隱藏欄位，真人看不到
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  if (!SHEET_ENDPOINT) return null;

  const submit = async () => {
    if (!agree || status === 'sending') return;
    const body = JSON.stringify({
      consent: true,
      website: trap,
      tool: payload.tool,
      toolTitle: payload.toolTitle,
      group: payload.group,
      inflation: payload.inflation,
      name: name.trim(),
      contact: contact.trim(),
      inputs: payload.inputs,
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
      setStatus(data?.ok === true ? 'ok' : data ? 'fail' : 'unknown');
    } catch {
      setStatus('fail');
    } finally {
      clearTimeout(timer);
    }
  };

  const message: Record<Status, string> = {
    idle: '',
    sending: '送出中…',
    ok: '已收到，謝謝你。',
    unknown: '已送出，但這個瀏覽器無法確認對方是否收到。若需要回覆，請改用其他聯絡方式。',
    fail: '送出沒有成功，請稍後再試一次。你填寫的內容還在這個頁面。',
    toolarge: '這張試算表的內容太多，無法送出。請減少列數後再試。',
  };

  const done = status === 'ok';
  const label = status === 'sending' ? '送出中…' : done ? '已送出 ✓' : '送出給 AK';
  return (
    <section className="ken-share" aria-labelledby={base + 't'}>
      <h4 id={base + 't'}>想請 AK 看看你的結果？</h4>
      <p>送出後 AK Wealth Global 會收到這張試算表的內容，方便給你更貼近的建議。<strong>不按「送出給 AK」，什麼都不會上傳。</strong></p>
      <div className="ken-share-fields">
        <label className="ken-field" htmlFor={base + 'n'}><span className="ken-field-label">稱呼<small>（選填）</small></span><input id={base + 'n'} type="text" maxLength={40} value={name} onChange={e => setName(e.target.value)} autoComplete="nickname" disabled={done} /></label>
        <label className="ken-field" htmlFor={base + 'c'}><span className="ken-field-label">聯絡方式<small>（選填：LINE ID、Email 或電話）</small></span><input id={base + 'c'} type="text" maxLength={80} value={contact} onChange={e => setContact(e.target.value)} autoComplete="off" disabled={done} /></label>
      </div>
      <label className="ken-share-trap" aria-hidden="true">請勿填寫<input tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)} /></label>
      <details className="ken-share-scope"><summary>會送出哪些資料？</summary><p>這張試算表的名稱、你填的數字、試算結果、年通膨設定，以及上面你自願填寫的稱呼與聯絡方式。</p></details>
      <label className="ken-share-consent"><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} disabled={done} /><span>我同意 AK Wealth Global 蒐集並使用以上資料，用於改善試算表及提供相關資訊與聯繫。詳見<Link href="/privacy/">隱私說明</Link>。</span></label>
      <button type="button" className={'button primary ken-share-send' + (done ? ' done' : '')} disabled={!agree || status === 'sending' || done} onClick={submit}>{label}</button>
      {!agree && !done && <small className="ken-share-hint">勾選上方同意後才能送出</small>}
      <p role="status" className={'ken-share-status ' + status}>{message[status]}</p>
    </section>
  );
}
