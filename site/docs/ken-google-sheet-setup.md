# Ken 財商諮詢：Google 試算表收件與 Email 通知設定

本網站的諮詢卡片讓訪客選擇只分享結果摘要，或另分享完整輸入數字。只有訪客勾選同意並送出後，資料才會傳送。Apps Script 將資料寫到私人收件表，並寄一封新諮詢通知給 Ken。這個文件是部署操作手冊，不會被網站公開提供下載。

## 一、建立私人收件試算表

1. 在 Google Drive 建立「Ken 財商諮詢收件」試算表。
2. 只把這份試算表分享給 Ken 與實際需要處理諮詢的授權人員；一般存取維持「限制」，不要建立任何人可檢視的連結。
3. 從「擴充功能 → Apps Script」開啟綁定的 Apps Script 專案，貼上以下程式碼並儲存。

```js
const SHEET_NAME = '諮詢收件';
const KEN_EMAIL = 'peterwang1018@gmail.com';
const MAX_CHARS = 20000;

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (raw.length > MAX_CHARS) return reply({ok: false, error: 'too_large'});
    const d = JSON.parse(raw);
    if (d.consent !== true || d.website) return reply({ok: false, error: 'invalid_submission'});
    if (!['summary', 'full'].includes(d.shareLevel)) return reply({ok: false, error: 'invalid_share_level'});
    if (!/^\S+@\S+\.\S+$/.test(String(d.email || ''))) return reply({ok: false, error: 'invalid_email'});
    const emailHash = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(d.email).toLowerCase())).slice(0, 32);
    const cache = CacheService.getScriptCache();
    const rateKey = `submission:${emailHash}`;
    const count = Number(cache.get(rateKey) || 0);
    if (count >= 3) return reply({ok: false, error: 'rate_limited'});
    cache.put(rateKey, String(count + 1), 3600);

    const inputs = d.shareLevel === 'full' ? JSON.stringify(d.inputs || {}) : '';
    const results = JSON.stringify(Array.isArray(d.results) ? d.results : []);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let sheetUrl;
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
      if (sh.getLastRow() === 0) {
        sh.appendRow(['時間', '分享範圍', '試算表', '分類', '通膨', '稱呼', 'Email', '諮詢主題', '輸入數字（僅完整分享）', '結果摘要', '來源頁面']);
        sh.setFrozenRows(1);
      }
      sh.appendRow([
        new Date(), d.shareLevel === 'full' ? '完整試算' : '結果摘要', safe(d.toolTitle, 100), safe(d.group, 50),
        Number(d.inflation) || '', safe(d.name, 60), safe(d.email, 120), safe(d.topic, 100),
        safe(inputs, 12000), safe(results, 5000), safe(d.page, 300),
      ]);
      sheetUrl = ss.getUrl();
    } finally {
      lock.releaseLock();
    }

    let notified = false;
    try {
      const summary = (Array.isArray(d.results) ? d.results : [])
        .map(x => `${safe(x.label, 100)}：${safe(x.value, 300)}`).join('\n');
      const detail = d.shareLevel === 'full' ? `\n\n訪客同意分享完整輸入數字：\n${safe(inputs, 12000)}` : '\n\n訪客只分享結果摘要，未傳送輸入數字。';
      MailApp.sendEmail({
        to: KEN_EMAIL,
        replyTo: safe(d.email, 120),
        subject: `新財商諮詢｜${safe(d.toolTitle, 100)}`,
        body: [
          `稱呼：${safe(d.name, 60) || '未填'}`,
          `訪客 Email：${safe(d.email, 120)}`,
          `諮詢主題：${safe(d.topic, 100) || '未選'}`,
          `分享範圍：${d.shareLevel === 'full' ? '完整試算' : '結果摘要'}`,
          `試算表：${safe(d.toolTitle, 100)}（${safe(d.group, 50)}）`,
          `通膨假設：${Number(d.inflation) || 0}%`,
          '', '試算結果：', summary, detail,
          '', `收件表：${sheetUrl}`,
          `來源頁面：${safe(d.page, 300)}`,
        ].join('\n'),
      });
      notified = true;
    } catch (mailError) {
      // 資料已寫入收件表；讓前端如實顯示通知未確認，避免訪客重複提交。
      console.error('Ken notification email failed', mailError);
    }
    return reply({ok: true, notified});
  } catch (err) {
    console.error('Ken consultation submission failed', err);
    return reply({ok: false, error: 'server'});
  }
}

function safe(value, max) {
  const s = String(value == null ? '' : value).slice(0, max);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

## 二、部署 Apps Script

1. 選「部署 → 新增部署作業」，類型選「網頁應用程式」。
2. 執行身分選「我」；存取權選「所有人」。訪客只能呼叫程式，不能因此檢視收件試算表。
3. 首次部署時授權試算表寫入與寄信權限。
4. 複製網頁應用程式網址，網址格式為 `https://script.google.com/macros/s/.../exec`。
5. 程式更新後，從「管理部署作業」編輯既有部署並選「新版本」。

## 三、啟用網站收件

在 Vercel 專案 Settings → Environment Variables 設定：

- 名稱：`NEXT_PUBLIC_KEN_SHEET_URL`
- 值：Apps Script `/exec` 網址
- 環境：Production；驗收時可另啟用 Preview

儲存後重新部署，因為網址會在建置時寫入前端。網站只接受 `script.google.com/macros/s/.../exec` 格式。沒有有效網址時，網站不會送出背景請求，會顯示「使用 Email 傳送摘要」備用方式；備用方式只附上結果摘要，不附原始輸入數字。

## 四、驗收

1. 用摘要模式送出測試資料：表格新增一列，輸入數字欄保持空白，Ken 收到通知 Email。
2. 用完整模式送出測試資料：表格新增一列且只在該列完整分享欄出現數字，Ken 收到通知。
3. 不勾同意或 Email 無效時，網站不送出。
4. 暫停 Apps Script 郵件權限或用測試副本確認失敗處理：資料仍收進表格，前端顯示「資料已收進收件表、通知狀態無法確認」，不要顯示通知成功。
5. 確認收件試算表一般存取仍為「限制」，訪客沒有文件連結。

## 資料處理

收件表包含個人聯絡資料，完整分享時另包含財務輸入。限制 Google Sheet 權限，只保留處理諮詢需要的人員；不要把完整財務資料放進公開文件或 Email 群組。依本站公布的聯絡方式受理查詢、更正與刪除要求。若停止收件，移除 Vercel 的 `NEXT_PUBLIC_KEN_SHEET_URL` 並重新部署。
