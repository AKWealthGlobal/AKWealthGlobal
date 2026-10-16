# Ken 財商試算表：串接 Google 試算表收集資料

訪客在試算表頁面勾選同意並按「送出」後，資料會寫進你的 Google 試算表。沒有設定網址時，表單不會出現，網站也不會傳送任何資料。

## 一、建立收件的 Google 試算表

1. 在 Google 雲端硬碟新增一份空白試算表，命名例如「Ken 試算表收件」。
2. 選單「擴充功能」→「Apps Script」，把編輯器裡原有的程式碼全部刪掉，貼上下面整段程式碼，按存檔。

```js
// 收下網站送來的試算內容，寫成一列。只接受有勾選同意的資料。
const SHEET_NAME = 'Ken試算';
const MAX_CHARS = 20000;

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (raw.length > MAX_CHARS) return reply({ok: false, error: 'too_large'});
    const d = JSON.parse(raw);
    if (d.consent !== true) return reply({ok: false, error: 'no_consent'});
    if (d.website) return reply({ok: true}); // 機器人才會填的隱藏欄位：假裝成功、不寫入

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
      if (sh.getLastRow() === 0) {
        sh.appendRow(['時間', '試算表', '身分', '通膨', '稱呼', '聯絡方式', '輸入數字', '結果摘要', '頁面']);
      }
      sh.appendRow([
        new Date(), safe(d.toolTitle, 80), safe(d.group, 40), Number(d.inflation) || '',
        safe(d.name, 40), safe(d.contact, 80),
        safe(JSON.stringify(d.inputs), 12000), safe(JSON.stringify(d.results), 4000), safe(d.page, 200),
      ]);
    } finally {
      lock.releaseLock();
    }
    return reply({ok: true});
  } catch (err) {
    return reply({ok: false, error: 'server'});
  }
}

// 截斷長度，並避免訪客填的文字被試算表當成公式執行（以 = + - @ 開頭時前面加單引號）。
function safe(v, max) {
  const s = String(v == null ? '' : v).slice(0, max);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

3. 按右上角「部署」→「新增部署作業」→ 類型選「網頁應用程式」。
   - 執行身分：**我**
   - 誰可以存取：**所有人**
4. 第一次會要求授權，依畫面同意。完成後複製「網頁應用程式網址」，格式是 `https://script.google.com/macros/s/....../exec`。

之後若修改了程式碼，要再「管理部署作業」→ 編輯 → 版本選「新版本」→ 部署，網址才會套用新程式。

## 二、設定到網站

在 Vercel 專案的 Settings → Environment Variables 新增：

- 名稱：`NEXT_PUBLIC_KEN_SHEET_URL`
- 值：剛才複製的 `/exec` 網址
- 環境：Production（要先在預覽測試就也勾 Preview）

存檔後，到 Deployments 對最新一次部署按 Redeploy（這個變數在建置時寫進網頁，改了要重新部署才會生效）。

網站只接受 `https://script.google.com/macros/s/.../exec` 格式的網址，其他網址會被忽略，表單不會出現。

## 三、測試

1. 打開 `/resources/ken/`，任一張試算表下方會出現「把我的試算結果送給 AK（選填）」。
2. 勾選同意、按「送出」，頁面顯示「已收到，謝謝你。」，Google 試算表出現一列新資料。
3. 若頁面顯示「已送出，但這個瀏覽器無法確認對方是否收到」，請看試算表有沒有新資料；通常是 Apps Script 回應被瀏覽器擋住，資料本身可能已寫入。

## 四、使用時要注意

- 收到的是個人資料（財務數字，加上選填的聯絡方式）。這份 Google 試算表請只分享給需要的人，不要設成「知道連結的任何人」。
- 網頁應用程式網址會出現在網站的前端程式裡，任何人都能對它送資料（但看不到試算表內容）。程式已限制大小、擋掉機器人欄位與公式注入；若被大量灌垃圾資料，把部署停用或換一個新網址即可。
- 依個資法，要能回應訪客查詢、更正、刪除的要求。隱私說明頁（`/privacy/`）已加入說明，請確認本站有公布可聯絡的管道。
- 想停止蒐集：刪除 Vercel 的 `NEXT_PUBLIC_KEN_SHEET_URL` 並重新部署，表單就會消失。
