# AK Wealth Global

繁體中文、手機優先的 AI 與財商教育網站。Next.js 16、React、TypeScript、Three.js。

## 本機執行

```sh
npm ci
npm run dev
```

## 正式建置

```sh
npm run build
npm run typecheck
```

靜態輸出位於 `out/`。內容資料在 `lib/content.ts`；自有下載資源位於 `public/downloads/`；原作漫畫與讀圖裁切位於 `public/media/comics/`。

## Vercel 部署

1. 將此專案推送到你有權限的 GitHub 原始碼庫。
2. 在 Vercel 匯入專案，框架選 Next.js，使用 `npm ci`、`npm run build`。
3. 將 `NEXT_PUBLIC_SITE_URL` 設為正式 HTTPS 網域。第一次預覽可以不填；確認網址後設定並重新部署，以產生正確 canonical、sitemap 與 robots 連結。
4. 本版無資料庫、無登入、不需要 AI API 金鑰。

目前使用靜態輸出，圖片預先壓縮，3D 在訪客主動開啟後才載入。

## 已完成

- 首頁、Alice AI 學院、Ken 財商教室、知識庫、親子區、關於與隱私說明。
- 10 篇六格漫畫，逐格／完整原圖切換與滑動閱讀。
- 6 篇繁體中文教學、搜尋與分類。
- 5 份工具包：原版 AI 地圖、6 款影片提示詞、金錢觀察表、親子學習單、自動化規劃表。
- 提示詞修改、複製與下載；實際 PDF 下載、失敗時可開啟原檔。
- 三維夢想島與金幣分配遊戲；減少動態偏好、裝置不支援時的文字替代。
- HTML 語系、頁面標題、canonical、Article/FAQ/Organization 結構化資料、sitemap、robots、llms.txt。

## 尚未接入

- Topview Unlimited 影片生成：本次未有可用連線，不使用假影片或假播放按鈕。
- Canva：本次不需要額外封面，使用原作 PDF 與漫畫。
- GitHub 推送／Vercel 部署：需可存取的原始碼庫與團隊；本次連線查詢未回傳可用項目。
- Claude Code：未有可直接呼叫的執行環境。請從 `AGENTS.md` 與 `HANDOFF.md` 接手。

來源編輯紀錄見 `docs/content-sources.md`。私人檔案識別碼不包含在公開網站中。
