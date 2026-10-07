# Codex／Claude Code 接手說明

本版由 Codex 實作，另有 Codex 工作代理進行靜態檢查。Claude Code 已於 2026-10-07 完成遊戲三到五的瀏覽器測試（遊戲一、二尚未測），結果與待確認事項見 docs/verification.md 最後一節。

1. 先讀 AGENTS.md、README.md、docs/content-sources.md。
2. 執行 npm ci、npm run build、npm run typecheck。
3. 保留既有手機首頁方向、繁體中文內容及原作 Ken 漫畫。
4. 確認 GitHub 存取與 Vercel 團隊後，建立獨立分支並先部署預覽；不可覆蓋未知的既有正式網站。
5. 真實示範影片到位後，在 Alice 區加入影片、繁體中文字幕與文字逐字稿。不要用生成示意圖宣稱已完成影片。
6. 新教材先確認來源、摘要方式與時效，再加入 lib/content.ts。
