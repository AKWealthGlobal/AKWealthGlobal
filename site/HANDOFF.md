# Codex／Claude Code 接手說明

## 2026-10-07 多人房間最新交接

**多人房間後端與正式網站已部署。** Supabase 專案 `ak-animal-city`（`jlwlboykrkblbtxaeykl`，東京）已建立資料表、限流 RPC、15 分鐘清理排程，Edge Function `ak-city-room` 目前版本 2、ACTIVE。房間 API 為 `https://jlwlboykrkblbtxaeykl.supabase.co/functions/v1/ak-city-room`。

主工作回報 Vercel 部署 `dpl_5paJnvWtXjHWLrZ3vGY8no6DqRx1` 為 READY，alias 為 `https://ak-wealth-global.vercel.app`，`NEXT_PUBLIC_CITY_ROOM_URL` 已指向正式 API。接手時先讀本節，再看下方保留的歷史交接。

已讀取 `C:/Users/user/Desktop/3D亲子财商游戏/AK_Supabase_四人三分齡_API測試.txt`：四份獨立席位憑證使用真實 Edge／PostgreSQL，825 請求，幼兒 24／兒童 32／進階 40 回合，合計 96 回合、396 一致快照、96 次非本人操作拒絕、12 次身分恢復，3 局共同目標成功。這是 API 測試，不是瀏覽器或實機測試。

後端 v2 已移除臨時 3191／3193／3194／3195 CORS 來源；實測它們全部 403、正式來源 204。兩表 RLS 與權限已查證，security advisors 無 WARN／ERROR，清理 job 1 已實際 succeeded。詳見 `C:/Users/user/Desktop/3D亲子财商游戏/AK_Supabase_房間部署紀錄.md`。

這次已有真正 Claude Code 獨立審查與執行測試，不能沿用歷史段落「Claude Code 尚未直接參與」作為目前狀態。

- 審查結果：`C:/Users/user/Desktop/AK-Claude-Game-QA/rooms/claude-review-complete.json`。
- SHA-256 快照：`C:/Users/user/Desktop/AK-Claude-Game-QA/rooms/snapshot.json`，建立於台北時間 2026-10-07 20:51:18。
- Claude session：`277b60bb-7050-4584-a909-13dad78008bc`；結果 UUID：`2b720bdb-0eb7-4d97-ac52-dec2dd0f45f1`。
- 執行 `node scripts/qa-city-rooms.cjs`：10 組通過，含 9 種分齡／人數完整局、216 個玩家回合、版本 CAS、重送去重、HTTP／CORS／限速與 REST store 版本過濾。
- 環境是本機真實 HTTP＋記憶體 CAS store；**不是真 Supabase、不是真瀏覽器完整操作、不是真 Android／iOS 實機**。SQL／RLS／Edge Function 為靜態閱讀範圍。
- 最新焦點小修已使 `components/family-adventure.tsx` 與受審查快照不同；本次 Claude 結論不涵蓋該次小修。撰寫本節時，其餘快照列出的 11 個檔案仍相符。

使用者最新要求：以 **4 個獨立 browser storage × 3 種分齡** 各跑完整遊戲。主工作已回報本機 3192 後端的幼兒版 24 回合通過；兒童／進階瀏覽器完整局仍在執行，不可用任何 API 測試代替，也不能提前標成三局全部完成。

主工作另已在正式網站使用 IAB 與 Brave 獨立瀏覽器資料，驗證阿橙／米米兩個席位、現金 36／備用金 4 與換人同步；重新整理恢復驗收仍在進行。後續補齊其餘瀏覽器完整局、最新焦點回歸、正式站恢復測試及實體 Android／iOS 試玩。

完整易讀報告：`C:/Users/user/Desktop/3D亲子财商游戏/AK_Claude_Code_多人房間審查.md`。細部驗證界線見 `docs/verification.md`。

## 歷史交接（多人房間工作之前，原文保留）

本版由 Codex 實作，另有 Codex 工作代理進行靜態檢查。Claude Code 尚未直接參與。

1. 先讀 AGENTS.md、README.md、docs/content-sources.md。
2. 執行 npm ci、npm run build、npm run typecheck。
3. 保留既有手機首頁方向、繁體中文內容及原作 Ken 漫畫。
4. 確認 GitHub 存取與 Vercel 團隊後，建立獨立分支並先部署預覽；不可覆蓋未知的既有正式網站。
5. 真實示範影片到位後，在 Alice 區加入影片、繁體中文字幕與文字逐字稿。不要用生成示意圖宣稱已完成影片。
6. 新教材先確認來源、摘要方式與時效，再加入 lib/content.ts。
