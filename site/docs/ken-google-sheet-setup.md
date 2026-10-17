# Ken 財商諮詢：Google 試算表收件與 Email 通知設定

本網站的諮詢卡片讓訪客選擇只分享結果摘要，或另分享完整輸入數字。只有訪客勾選同意並送出後，資料才會傳送。Apps Script 將資料寫到私人收件表，並寄一封新諮詢通知給 Ken。這個文件是部署操作手冊，不會被網站公開提供下載。

## 一、建立私人收件試算表

1. 在 Google Drive 建立「Ken 財商諮詢收件」試算表。
2. 只把這份試算表分享給 Ken 與實際需要處理諮詢的授權人員；一般存取維持「限制」，不要建立任何人可檢視的連結。
3. 從「擴充功能 → Apps Script」開啟綁定的 Apps Script 專案，貼上以下程式碼並儲存。

```js
/**
 * AK Wealth Global｜Ken 財商試算表線上收件 Web App
 */
const CONFIG = {
  SHEET_NAME: 'Submissions',
  NOTIFY_EMAIL: 'peterwang1018@gmail.com',
  MAX_RAW_BODY_LENGTH: 50000,
  MAX_TEXT_LENGTH: 300,
  MAX_URL_LENGTH: 2048,
  MAX_TOPIC_LENGTH: 2000,
  MAX_JSON_FIELD_LENGTH: 15000,
  MAX_INPUT_KEYS: 100,
  MAX_KEY_LENGTH: 100,
  MAX_INPUT_ROWS: 200,
  MAX_ROW_KEYS: 30,
  MAX_CELL_STRING_LENGTH: 500,
  DEDUPE_SECONDS: 30, // 盡力而為（best-effort）之短時間防重複快取秒數；快取異常時採 fail-open
};

const HEADERS = [
  'timestamp',
  'shareLevel',
  'consent',
  'tool',
  'toolTitle',
  'group',
  'inflation',
  'name',
  'email',
  'topic',
  'inputsJson',
  'resultsJson',
  'page',
  'notified',
  'notifyError'
];

function doPost(e) {
  let rowWritten = false;
  let notified = false;

  try {
    if (!e || !e.postData || typeof e.postData.contents !== 'string') {
      return jsonResponse({ ok: false, error: 'INVALID_REQUEST' });
    }

    const rawBody = e.postData.contents;
    if (rawBody.length === 0 || rawBody.length > CONFIG.MAX_RAW_BODY_LENGTH) {
      return jsonResponse({ ok: false, error: 'PAYLOAD_TOO_LARGE' });
    }

    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseErr) {
      return jsonResponse({ ok: false, error: 'INVALID_JSON' });
    }

    // 1. 蜜罐欄位檢查（website 非空即拒絕）
    if (data.website && String(data.website).trim() !== '') {
      return jsonResponse({ ok: false, error: 'REJECTED' });
    }

    // 2. 明確同意檢查
    if (data.consent !== true) {
      return jsonResponse({ ok: false, error: 'CONSENT_REQUIRED' });
    }

    // 3. shareLevel 驗證（僅允許 summary 或 full）
    const shareLevel = String(data.shareLevel || '').trim();
    if (shareLevel !== 'summary' && shareLevel !== 'full') {
      return jsonResponse({ ok: false, error: 'INVALID_SHARE_LEVEL' });
    }

    // 4. Email 必填與格式驗證（禁止包含換行或空白）
    const email = String(data.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.length > 254 || !emailRegex.test(email)) {
      return jsonResponse({ ok: false, error: 'INVALID_EMAIL' });
    }

    // 5. 基本欄位驗證與長度限制（inflation 為有限數值，單行欄位移除 \t \r \n，topic 允許多行）
    if (typeof data.inflation !== 'number' || !Number.isFinite(data.inflation)) {
      return jsonResponse({ ok: false, error: 'INVALID_INFLATION' });
    }
    const inflation = data.inflation;

    const tool = clampSingleLineText(data.tool, CONFIG.MAX_TEXT_LENGTH);
    const toolTitle = clampSingleLineText(data.toolTitle, CONFIG.MAX_TEXT_LENGTH);
    const group = clampSingleLineText(data.group, CONFIG.MAX_TEXT_LENGTH);
    const name = clampSingleLineText(data.name, CONFIG.MAX_TEXT_LENGTH); // 選填（單行）
    const topic = clampMultiLineText(data.topic, CONFIG.MAX_TOPIC_LENGTH); // 選填（允許多行）
    const page = clampSingleLineText(data.page, CONFIG.MAX_URL_LENGTH);

    // 驗證必填欄位與 results 陣列結構（[{ label, value }]）
    if (!tool || !toolTitle || !group || !page || !isValidLabelValueArray(data.results)) {
      return jsonResponse({ ok: false, error: 'MISSING_OR_INVALID_FIELDS' });
    }

    // 6. summary 模式不寫入 inputs；full 模式逐一驗證 inputs 符合 Vals (Record<string, Cell | Row[]>) 結構
    let inputsString = '';
    if (shareLevel === 'full') {
      if (!isValidInputsVals(data.inputs)) {
        return jsonResponse({ ok: false, error: 'INVALID_INPUTS_STRUCTURE' });
      }
      inputsString = safeStringify(data.inputs, CONFIG.MAX_JSON_FIELD_LENGTH);
      if (inputsString === null) {
        return jsonResponse({ ok: false, error: 'INPUTS_TOO_LARGE' });
      }
    }

    const resultsString = safeStringify(data.results, CONFIG.MAX_JSON_FIELD_LENGTH);
    if (resultsString === null) {
      return jsonResponse({ ok: false, error: 'RESULTS_TOO_LARGE' });
    }

    // 7. 以完整 SHA-256 雜湊產生固定長度（72 字元）之 Cache Key（含 inflation，避免只改通膨假設被誤判重複）
    const dedupeKey = buildDedupeKey([
      email.toLowerCase(),
      tool,
      shareLevel,
      String(inflation),
      inputsString,
      resultsString,
      topic
    ].join('\u001F'));

    // 8. 取得腳本鎖後，在鎖內進行 best-effort 查重與試算表寫入
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    let sheet;
    let rowIndex;
    const timestamp = new Date().toISOString();

    try {
      let isDuplicate = false;
      try {
        const cache = CacheService.getScriptCache();
        if (cache.get(dedupeKey)) {
          isDuplicate = true;
        }
      } catch (_) {
        // CacheService 異常時採取 fail-open，繼續收件以避免漏單
      }

      if (isDuplicate) {
        return jsonResponse({ ok: false, error: 'RATE_LIMITED' });
      }

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
      ensureHeaders(sheet);

      const rowValues = [
        sanitizeCell(timestamp),
        sanitizeCell(shareLevel),
        'TRUE',
        sanitizeCell(tool),
        sanitizeCell(toolTitle),
        sanitizeCell(group),
        inflation,
        sanitizeCell(name),
        sanitizeCell(email),
        sanitizeCell(topic),
        sanitizeCell(inputsString),
        sanitizeCell(resultsString),
        sanitizeCell(page),
        'PENDING',
        ''
      ];

      sheet.appendRow(rowValues);
      rowWritten = true; // 資料列已寫入，後續任何非核心步驟異常皆不可將結果改為 ok: false
      rowIndex = sheet.getLastRow();

      try {
        const cache = CacheService.getScriptCache();
        cache.put(dedupeKey, '1', CONFIG.DEDUPE_SECONDS);
      } catch (_) {}
    } finally {
      try {
        lock.releaseLock();
      } catch (_) {}
    }

    // 9. 寄送通知信（即使失敗也必須回傳 ok: true, notified: false）
    let notifyError = '';
    try {
      sendPrivacySafeNotification({
        timestamp: timestamp,
        shareLevel: shareLevel,
        toolTitle: toolTitle,
        group: group,
        name: name,
        email: email,
        topic: topic,
        page: page
      });
      notified = true;
    } catch (mailErr) {
      notified = false;
      notifyError = String(mailErr && mailErr.message ? mailErr.message : mailErr).slice(0, 300);
    }

    // 10. 回寫通知狀態（獨立保護，失敗不影響回傳結果）
    try {
      const lockUpdate = LockService.getScriptLock();
      if (lockUpdate.tryLock(5000)) {
        try {
          sheet.getRange(rowIndex, 14, 1, 2).setValues([[
            notified ? 'TRUE' : 'FALSE',
            sanitizeCell(notifyError)
          ]]);
        } finally {
          lockUpdate.releaseLock();
        }
      }
    } catch (_) {}

    return jsonResponse({ ok: true, notified: notified });
  } catch (err) {
    if (rowWritten) {
      return jsonResponse({ ok: true, notified: notified });
    }
    return jsonResponse({ ok: false, error: 'INTERNAL_ERROR' });
  }
}

/**
 * 驗證單一 Cell 值：僅允許有限 number 或長度受限之 string（對應專案 Cell = number | string）
 */
function isValidCell(val) {
  if (typeof val === 'number') return Number.isFinite(val);
  if (typeof val === 'string') return val.length <= CONFIG.MAX_CELL_STRING_LENGTH;
  return false;
}

/**
 * 驗證單一 Row 物件：Record<string, Cell>
 */
function isValidRow(row) {
  if (typeof row !== 'object' || row === null || Array.isArray(row)) return false;
  const keys = Object.keys(row);
  if (keys.length === 0 || keys.length > CONFIG.MAX_ROW_KEYS) return false;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!k || k.length > CONFIG.MAX_KEY_LENGTH) return false;
    if (!isValidCell(row[k])) return false;
  }
  return true;
}

/**
 * 驗證網站 Vals 結構：Record<string, Cell | Row[]>
 */
function isValidInputsVals(inputs) {
  if (typeof inputs !== 'object' || inputs === null || Array.isArray(inputs)) return false;
  const keys = Object.keys(inputs);
  if (keys.length === 0 || keys.length > CONFIG.MAX_INPUT_KEYS) return false;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!k || k.length > CONFIG.MAX_KEY_LENGTH) return false;
    const val = inputs[k];

    if (Array.isArray(val)) {
      if (val.length > CONFIG.MAX_INPUT_ROWS) return false;
      for (let j = 0; j < val.length; j++) {
        if (!isValidRow(val[j])) return false;
      }
    } else if (!isValidCell(val)) {
      return false;
    }
  }
  return true;
}

/**
 * 驗證 results 結構：[{ label: string, value: string | number }]
 */
function isValidLabelValueArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0 || arr.length > 100) return false;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    const keys = Object.keys(item);
    if (keys.length !== 2) return false;
    if (typeof item.label !== 'string' || item.label.trim() === '' || item.label.length > CONFIG.MAX_TEXT_LENGTH) {
      return false;
    }
    const v = item.value;
    const isValidVal =
      (typeof v === 'string' && v.length <= CONFIG.MAX_CELL_STRING_LENGTH) ||
      (typeof v === 'number' && Number.isFinite(v));
    if (!isValidVal) return false;
  }
  return true;
}

function buildDedupeKey(raw) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    raw,
    Utilities.Charset.UTF_8
  );
  const hex = digest
    .map(function(b) {
      const v = b < 0 ? b + 256 : b;
      return ('0' + v.toString(16)).slice(-2);
    })
    .join('');
  return 'ken_sub_' + hex;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
}

/**
 * 單行文字清理：將 \t, \r, \n 與所有控制字元移除／轉為單一空白，確保不會帶入換行
 */
function clampSingleLineText(val, maxLen) {
  if (val === undefined || val === null) return '';
  const cleaned = String(val)
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned;
}

/**
 * 多行文字清理（用於 topic）：移除除 \n 外之控制字元
 */
function clampMultiLineText(val, maxLen) {
  if (val === undefined || val === null) return '';
  const cleaned = String(val)
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, '')
    .trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned;
}

function sanitizeSubject(str) {
  return String(str || '')
    .replace(/[\t\r\n\u0000-\u001F\u007F-\u009F]+/g, ' ')
    .trim()
    .slice(0, 200);
}

function safeStringify(val, maxLen) {
  try {
    const str = typeof val === 'string' ? val : JSON.stringify(val);
    if (str.length > maxLen) return null;
    return str;
  } catch (_) {
    return null;
  }
}

function sanitizeCell(val) {
  if (val === undefined || val === null) return '';
  const str = String(val);
  const stripped = str.replace(/^[\s\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]+/, '');
  if (/^[=+\-@|]/.test(stripped) || /^[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function maskEmail(email) {
  const parts = String(email).split('@');
  if (parts.length !== 2) return '***';
  const local = parts[0];
  const maskedLocal = local.length <= 2
    ? local.charAt(0) + '*'
    : local.slice(0, 2) + '***';
  return maskedLocal + '@' + parts[1];
}

function sendPrivacySafeNotification(info) {
  const rawSubject = '[AK Wealth 試算收件] ' + info.toolTitle + '（' + (info.shareLevel === 'full' ? '完整分享' : '摘要分享') + '）';
  const subject = sanitizeSubject(rawSubject);
  const lines = [
    'Ken 您好，網站收到一筆新的財商試算表分享紀錄：',
    '',
    '・收件時間：' + info.timestamp,
    '・試算工具：' + info.toolTitle + (info.group ? '（' + info.group + '）' : ''),
    '・分享範圍：' + (info.shareLevel === 'full' ? 'full（含試算輸入與結果）' : 'summary（僅試算結果摘要）'),
    '・訪客稱呼：' + (info.name || '（未填寫）'),
    '・聯絡信箱（遮罩）：' + maskEmail(info.email),
    '・想討論主題：' + (info.topic ? info.topic.slice(0, 120) + (info.topic.length > 120 ? '...' : '') : '（未填寫）'),
    '・來源頁面：' + (info.page || '（未提供）'),
    '',
    '※ 為保護訪客財務個資與聯絡隱私，完整試算資料與完整 Email 僅儲存於受權限保護的私人 Google 試算表中，請登入授權帳號至試算表查看。'
  ];

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: subject,
    body: lines.join('\n')
  });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
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

儲存後重新部署，因為網址會在建置時寫入前端。網站只接受 `script.google.com/macros/s/.../exec` 格式。沒有有效網址時，網站不會送出背景請求，會顯示「開啟 Email 摘要草稿」備用方式；備用方式只附上結果摘要，不附原始輸入數字。

## 四、驗收

1. 用摘要模式送出測試資料：表格新增一列，`inputsJson` 欄保持空白，Ken 收到遮罩隱私保護版通知 Email。
2. 用完整模式送出測試資料：表格新增一列且只在該列 `inputsJson` 欄出現完整輸入 JSON，Ken 收到通知。
3. 不勾同意或 Email 無效時，網站不送出。
4. 暫停 Apps Script 郵件權限或用測試副本確認失敗處理：資料仍收進表格（`notified` 欄為 `FALSE`），前端顯示「寄送狀態無法確認，請先透過 Ken 的 LINE 聯繫確認，避免重複提交。」，不要顯示通知成功。
5. 確認收件試算表一般存取仍為「限制」，訪客沒有文件連結。

## 資料處理

收件表包含個人聯絡資料，完整分享時另包含財務輸入。限制 Google Sheet 權限，只保留處理諮詢需要的人員；不要把完整財務資料放進公開文件或 Email 群組。依本站公布的聯絡方式受理查詢、更正與刪除要求。若停止收件，移除 Vercel 的 `NEXT_PUBLIC_KEN_SHEET_URL` 並重新部署。
