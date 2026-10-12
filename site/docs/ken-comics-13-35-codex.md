# AK Wealth Global 漫畫任務（給 Codex）

> 把整份文件貼給 Codex 即可。共兩項任務：
> - **任務 A**：Ken 財商教室第 13～35 篇，改繪成 Ken IP 四格漫畫（第 0～5 節）。
> - **任務 B**：接續 PR #9「追加 Alice 與 Ken 漫畫校稿預覽」（第 6 節）。
>
> 兩項任務**分開兩個分支、兩個 PR**，先做完任務 A 再做任務 B。

---

## 0. 先確認：哪裡才是最新版（很重要）

| 項目 | 狀態 |
|---|---|
| **GitHub `main` 分支** | ✅ **唯一最新版**，與線上 https://ak-wealth-global.vercel.app/ 一致（PR #10 已合併，commit `320c7bf`）。 |
| `drafts/ken-comics-13-35` 分支 | 只保存第 13～35 篇**舊六格版**的原始文字和圖片，**只能參考，不要在上面開發**。 |
| `codex/added-comics-publication-prep`（PR #9） | 以**舊版** main 為基礎（Alice 追加漫畫校稿），不要在上面做這次任務。 |
| `sync/live-site`、`claude/*`、`ccr-*` | 舊的工作分支，不要使用。 |
| 本機 `Desktop\AK-sync` | ✅ 以後**唯一**的本機工作資料夾，但目前停在舊的 `sync/live-site` 分支，**開工前必須先更新到 main**（見下方指令）。 |
| 本機 `Desktop\Ken-money-deploy-20261008` 及其他 `AK-Wealth-Global-*` 資料夾 | ❌ 舊版或備份，**不要修改、不要從這些資料夾部署**。 |

### 開工指令（在 PowerShell 的 `Desktop\AK-sync` 內執行）

```powershell
cd $HOME\Desktop\AK-sync
git fetch origin
git checkout main
git pull origin main
git checkout -b feat/ken-comics-13-35
cd site
npm ci
```

### 規則
- 只在 `feat/ken-comics-13-35` 分支上改，完成後推上 GitHub 並開 PR 到 `main`，**不要直接推 main**。
- **不要執行 `vercel --prod`** 或任何正式部署，等網站擁有者確認 PR 後再部署。
- 不要提交 `site/out/`、`site/.next/`、`node_modules/`、`.env*`（`.gitignore` 已設定）。

---

## 1. 要改哪些檔案

| 檔案 | 要做什麼 |
|---|---|
| `site/public/media/ken/comic-13.png` … `comic-35.png` | **新增** 23 張四格漫畫圖：PNG，**1024×1536（2:3 直式）**，檔名兩位數編號。 |
| `site/lib/ken-episodes.json` | 在現有 12 篇**之後依序追加**本文件第 4 節的 23 筆資料（第 13 篇接在第 12 篇後面）。 |
| 其他檔案 | **不需要改**。`lib/ken-comics.ts` 會自動依順序產生 `ken-13`…`ken-35` 網址，並對應 `/media/ken/comic-13.png`…；`components/ken-classroom.tsx` 會依 `category` 自動顯示「投資詐騙與平台風險／金融史與市場週期／黃金與總體經濟」三個主題區；來源連結已在 `lib/ken-sources.json`。 |

⚠️ 新資料**不要**加 `imageFile` 欄位（那是舊六格版用的，會讓網站把圖片路徑指到已刪除的 `community/` 資料夾，並顯示成「六格漫畫」）。

---

## 2. 畫風規格（每張都要一致）

參考圖（都在 repo 內）：
- **Ken IP 形象**：`site/public/media/characters/ken-ip.webp`
- **畫風範本（親子）**：`site/public/media/ken/comic-01.png`
- **畫風範本（成人）**：`site/public/media/ken/comic-11.png`（第 13～35 篇都是 18 歲＋，以這張為主）

規格：
- 水彩加線稿的 Q 版漫畫、暖色調、米白紙張底色。
- 上方大標題橫幅（繁體中文），2×2 四格，深棕色圓角外框。
- 白色大對話框，格式為「角色：台詞」。
- 底部牌匾寫「Ken財商教室」，旁邊有一本打開的書圖示。
- Ken：短刺黑髮、細長方形深色鏡框眼鏡、黑色 Polo 衫，**每格長相一致**。
- 不畫真實公司 Logo，不畫真實人物（Madoff、OneCoin 創辦人、尼克森等一律用不像任何真人的剪影或路人）。
- 不畫暴力或血腥，不加浮水印。**圖上只放本文件指定的文字和數字**，不要自己加金額、日期或百分比。

### 生成步驟
1. 每篇把第 3 節的「生圖提示詞」**連同三張參考圖**一起交給生圖模型（例如 GPT Image），比例 2:3。
2. 檢查：Ken 長相一致、繁體字沒有錯字或亂碼、台詞與提示詞**完全相同**。不合格就重畫。
3. 輸出後縮放／裁切成 **1024×1536 PNG**，存成 `site/public/media/ken/comic-NN.png`。

### 第 13 篇已有成品（不要重畫）

網站擁有者已確認可用：`C:\Users\user\Desktop\comic-13-higgsfield.png`（688×1024）。請照以下步驟處理：

1. **只修背景兩處，其他一律不動**（文字、角色、構圖都保持原樣）：
   - 標題右上方背景的**台北 101**（2004 年才完工，和 1980 年代的鴻源案時代不符），換成 1980 年代臺灣常見的普通辦公大樓。
   - 標題左上方建築上的**紅色小招牌**是亂碼字，改成沒有文字的空白招牌。
2. 修好後**等比例放大成 1024×1536 PNG**，不要裁切或變形，存成 `site/public/media/ken/comic-13.png`。
3. 圖上文字已核對無誤：標題「高利的誘惑／鴻源案」與四句對話框都和第 3 節一致。修圖後請再確認文字沒有被改壞。
4. 第 14～35 篇以這張第 13 篇作為**畫風標準**，連同第 2 節的參考圖一起使用，讓 23 篇看起來是同一系列。

---

## 3. 23 篇四格分鏡與生圖提示詞

### 第 13 篇：鴻源案：高利為何讓人放下戒心？

- 檔案：`site/public/media/ken/comic-13.png`　網址：`/money/ken-13/`
- 對象：18歲＋　概念：金融詐騙與平台風險　主題區：投資詐騙與平台風險

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 1980年代臺灣街頭，阿明拿著「每月四分利」傳單，同事圍著說大家都在投。 | 阿明：每月四分利，大家都在賺！ |
| 2 | 阿明翻開存摺看到利息入帳，投資公司門口排起長長人龍。 | 阿明：真的有領到，再加碼！ |
| 3 | 投資公司拉下鐵門，貼出「暫停發放」，人群焦急；Ken 在一旁冷靜說明。 | Ken：前期領到錢，也可能是誘餌。 |
| 4 | Ken 指著警訊板：高利保證、熟人推薦、看不懂怎麼賺；阿明與太太點頭。 | Ken：看不懂怎麼賺，就先別投入！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: 1980s Taiwan city street and an investment office, warm retro tones.
Title banner text (exact): 「高利的誘惑」 with a smaller subtitle 「鴻源案」.

Panel 1 (top-left): 1980年代臺灣街頭，阿明拿著「每月四分利」傳單，同事圍著說大家都在投。 Speech bubble (exact): 「阿明：每月四分利，大家都在賺！」
Panel 2 (top-right): 阿明翻開存摺看到利息入帳，投資公司門口排起長長人龍。 Speech bubble (exact): 「阿明：真的有領到，再加碼！」
Panel 3 (bottom-left): 投資公司拉下鐵門，貼出「暫停發放」，人群焦急；Ken 在一旁冷靜說明。 Speech bubble (exact): 「Ken：前期領到錢，也可能是誘餌。」
Panel 4 (bottom-right): Ken 指著警訊板：高利保證、熟人推薦、看不懂怎麼賺；阿明與太太點頭。 Speech bubble (exact): 「Ken：看不懂怎麼賺，就先別投入！」
```
</details>

### 第 14 篇：Madoff 案：名氣與穩定報酬的陷阱

- 檔案：`site/public/media/ken/comic-14.png`　網址：`/money/ken-14/`
- 對象：18歲＋　概念：金融詐騙與平台風險　主題區：投資詐騙與平台風險

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 豪華辦公室裡，投資人稱讚一位知名基金經理，報酬表上的線平穩向上。 | 投資人：他名氣大，報酬又穩！ |
| 2 | 有人順利贖回拿到錢，其他投資人更放心地加碼。 | 投資人：前面的人都領得到錢。 |
| 3 | 2008年新聞看板寫著「龐氏騙局曝光」，投資人震驚；Ken 指著帳戶報表。 | Ken：帳上的數字，不等於真的有錢。 |
| 4 | Ken 展示查核清單：資產由誰保管、有無獨立查核、報酬是否穩得不自然。 | Ken：先查錢放哪、誰在查帳！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a luxurious New York investment office, 2000s; the fund manager is a generic faceless silhouette, NOT resembling any real person.
Title banner text (exact): 「名氣與穩定報酬」 with a smaller subtitle 「Madoff 案」.

Panel 1 (top-left): 豪華辦公室裡，投資人稱讚一位知名基金經理，報酬表上的線平穩向上。 Speech bubble (exact): 「投資人：他名氣大，報酬又穩！」
Panel 2 (top-right): 有人順利贖回拿到錢，其他投資人更放心地加碼。 Speech bubble (exact): 「投資人：前面的人都領得到錢。」
Panel 3 (bottom-left): 2008年新聞看板寫著「龐氏騙局曝光」，投資人震驚；Ken 指著帳戶報表。 Speech bubble (exact): 「Ken：帳上的數字，不等於真的有錢。」
Panel 4 (bottom-right): Ken 展示查核清單：資產由誰保管、有無獨立查核、報酬是否穩得不自然。 Speech bubble (exact): 「Ken：先查錢放哪、誰在查帳！」
```
</details>

### 第 15 篇：OneCoin 案：下一個比特幣？

- 檔案：`site/public/media/ken/comic-15.png`　網址：`/money/ken-15/`
- 對象：18歲＋　概念：金融詐騙與平台風險　主題區：投資詐騙與平台風險

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 華麗發表會舞台，大螢幕寫著「下一個比特幣」，觀眾熱烈鼓掌。 | 觀眾：聽起來好厲害！ |
| 2 | 朋友拿著不同等級的「套裝方案」價目表，邀人加入。 | 朋友：買套裝，再拉人就能賺！ |
| 3 | 2017年舞台空無一人，投資人拿著手機追問錢的去向；Ken 出現。 | Ken：靠拉人加入，不是投資價值。 |
| 4 | Ken 指著檢查板：能否在公開市場買賣、技術能否查證、收益從哪來。 | Ken：查不到、賣不掉，就要小心！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a flashy launch event stage with big screens, then an empty stage; the presenter is a generic silhouette, NOT any real person.
Title banner text (exact): 「下一個比特幣？」 with a smaller subtitle 「OneCoin 案」.

Panel 1 (top-left): 華麗發表會舞台，大螢幕寫著「下一個比特幣」，觀眾熱烈鼓掌。 Speech bubble (exact): 「觀眾：聽起來好厲害！」
Panel 2 (top-right): 朋友拿著不同等級的「套裝方案」價目表，邀人加入。 Speech bubble (exact): 「朋友：買套裝，再拉人就能賺！」
Panel 3 (bottom-left): 2017年舞台空無一人，投資人拿著手機追問錢的去向；Ken 出現。 Speech bubble (exact): 「Ken：靠拉人加入，不是投資價值。」
Panel 4 (bottom-right): Ken 指著檢查板：能否在公開市場買賣、技術能否查證、收益從哪來。 Speech bubble (exact): 「Ken：查不到、賣不掉，就要小心！」
```
</details>

### 第 16 篇：FTX 案：大平台為什麼也會出事？

- 檔案：`site/public/media/ken/comic-16.png`　網址：`/money/ken-16/`
- 對象：18歲＋　概念：金融詐騙與平台風險　主題區：投資詐騙與平台風險

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 巨大的交易平台大樓與廣告看板，使用者覺得規模大就安全。 | 使用者：平台這麼大，一定沒問題！ |
| 2 | 使用者把加密資產與現金長期放在平台帳戶裡。 | 使用者：錢放這裡最方便。 |
| 3 | 2022年手機畫面顯示「暫停提款」，使用者焦急；Ken 指著「客戶資金應分開保管」的示意圖。 | Ken：要看客戶的錢有沒有分開保管。 |
| 4 | Ken 列出：誰保管資產、能否隨時提款、別把錢全放同一處。 | Ken：規模大，不等於資產安全！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a giant futuristic crypto exchange tower and phone app screens; no real logos.
Title banner text (exact): 「大平台也會出事」 with a smaller subtitle 「FTX 案」.

Panel 1 (top-left): 巨大的交易平台大樓與廣告看板，使用者覺得規模大就安全。 Speech bubble (exact): 「使用者：平台這麼大，一定沒問題！」
Panel 2 (top-right): 使用者把加密資產與現金長期放在平台帳戶裡。 Speech bubble (exact): 「使用者：錢放這裡最方便。」
Panel 3 (bottom-left): 2022年手機畫面顯示「暫停提款」，使用者焦急；Ken 指著「客戶資金應分開保管」的示意圖。 Speech bubble (exact): 「Ken：要看客戶的錢有沒有分開保管。」
Panel 4 (bottom-right): Ken 列出：誰保管資產、能否隨時提款、別把錢全放同一處。 Speech bubble (exact): 「Ken：規模大，不等於資產安全！」
```
</details>

### 第 17 篇：LUNA 案：穩定幣真的穩嗎？

- 檔案：`site/public/media/ken/comic-17.png`　網址：`/money/ken-17/`
- 對象：18歲＋　概念：金融詐騙與平台風險　主題區：投資詐騙與平台風險

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 看板寫著「穩定幣 1:1 美元」與「高收益」，投資人心動。 | 投資人：穩定幣，又有高收益！ |
| 2 | 大量用戶湧入，圖表看起來平穩，大家覺得沒事。 | 投資人：這麼多人在用，應該沒事。 |
| 3 | 2022年5月，穩定幣跌出1美元的線，相關代幣急墜；Ken 在一旁。 | Ken：一脫鉤，價格就可能崩。 |
| 4 | Ken 提出兩個問題：收益從哪裡來？風險由誰承擔？ | Ken：叫「穩定」，不代表不會跌！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a digital finance city with glowing coins and charts; no real logos.
Title banner text (exact): 「穩定幣真的穩嗎？」 with a smaller subtitle 「LUNA 案」.

Panel 1 (top-left): 看板寫著「穩定幣 1:1 美元」與「高收益」，投資人心動。 Speech bubble (exact): 「投資人：穩定幣，又有高收益！」
Panel 2 (top-right): 大量用戶湧入，圖表看起來平穩，大家覺得沒事。 Speech bubble (exact): 「投資人：這麼多人在用，應該沒事。」
Panel 3 (bottom-left): 2022年5月，穩定幣跌出1美元的線，相關代幣急墜；Ken 在一旁。 Speech bubble (exact): 「Ken：一脫鉤，價格就可能崩。」
Panel 4 (bottom-right): Ken 提出兩個問題：收益從哪裡來？風險由誰承擔？ Speech bubble (exact): 「Ken：叫「穩定」，不代表不會跌！」
```
</details>

### 第 18 篇：im.B 案：名字叫銀行，為什麼不是銀行？

- 檔案：`site/public/media/ken/comic-18.png`　網址：`/money/ken-18/`
- 對象：18歲＋　概念：金融詐騙與平台風險　主題區：投資詐騙與平台風險

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 投資人看著介面專業、名稱像銀行的手機 App，覺得很可靠。 | 投資人：名字像銀行，應該很可靠！ |
| 2 | 平台宣稱有房產債權擔保，早期利息準時入帳。 | 投資人：有房子擔保，還有利息入帳！ |
| 3 | 平台出問題，投資人收不回資金；Ken 解釋媒合平台和銀行不同。 | Ken：媒合平台不是銀行。 |
| 4 | Ken 列出：借款人是誰、錢流去哪、違約怎麼處理。 | Ken：說不清錢流向，就先停手！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a modern Taiwan cafe and a phone app with a professional-looking interface; no real logos or brand names.
Title banner text (exact): 「平台不是銀行」 with a smaller subtitle 「im.B 案」.

Panel 1 (top-left): 投資人看著介面專業、名稱像銀行的手機 App，覺得很可靠。 Speech bubble (exact): 「投資人：名字像銀行，應該很可靠！」
Panel 2 (top-right): 平台宣稱有房產債權擔保，早期利息準時入帳。 Speech bubble (exact): 「投資人：有房子擔保，還有利息入帳！」
Panel 3 (bottom-left): 平台出問題，投資人收不回資金；Ken 解釋媒合平台和銀行不同。 Speech bubble (exact): 「Ken：媒合平台不是銀行。」
Panel 4 (bottom-right): Ken 列出：借款人是誰、錢流去哪、違約怎麼處理。 Speech bubble (exact): 「Ken：說不清錢流向，就先停手！」
```
</details>

### 第 19 篇：JPEX 案：為什麼越多人推，反而越危險？

- 檔案：`site/public/media/ken/comic-19.png`　網址：`/money/ken-19/`
- 對象：18歲＋　概念：金融詐騙與平台風險　主題區：投資詐騙與平台風險

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 手機上的網紅和社群都在推薦同一個交易平台。 | 網友：大家都在推，一定可靠！ |
| 2 | 投資人先小額入金，App 顯示高收益。 | 投資人：先放一點試試看。 |
| 3 | 提領卡住，畫面顯示「提款處理中」，投資人向警方求助；Ken 在一旁。 | Ken：人多推薦，不等於有監管。 |
| 4 | Ken 指著檢查清單：查監管名單、看提款條件、別只信推薦。 | Ken：先查監管機構的名單！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: Hong Kong city night, phone screens full of influencer posts; no real logos or real people.
Title banner text (exact): 「越多人推越危險？」 with a smaller subtitle 「JPEX 案」.

Panel 1 (top-left): 手機上的網紅和社群都在推薦同一個交易平台。 Speech bubble (exact): 「網友：大家都在推，一定可靠！」
Panel 2 (top-right): 投資人先小額入金，App 顯示高收益。 Speech bubble (exact): 「投資人：先放一點試試看。」
Panel 3 (bottom-left): 提領卡住，畫面顯示「提款處理中」，投資人向警方求助；Ken 在一旁。 Speech bubble (exact): 「Ken：人多推薦，不等於有監管。」
Panel 4 (bottom-right): Ken 指著檢查清單：查監管名單、看提款條件、別只信推薦。 Speech bubble (exact): 「Ken：先查監管機構的名單！」
```
</details>

### 第 20 篇：1929 股災：當全民都以為股票只會漲

- 檔案：`site/public/media/ken/comic-20.png`　網址：`/money/ken-20/`
- 對象：18歲＋　概念：金融史與市場週期　主題區：金融史與市場週期

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 1920年代紐約，人們拿著報紙歡呼股價大漲。 | 路人：股票只會漲！ |
| 2 | 投資人向經紀人借錢買股，擴大部位。 | 投資人：借錢買，賺更多！ |
| 3 | 1929年10月報價牌急跌，人群驚慌；Ken 指著「借錢」與「虧損」的天平。 | Ken：借錢投資，下跌也加倍痛。 |
| 4 | Ken 和投資人坐下來，看著寫有「上漲≠安全」的筆記板。 | Ken：漲很久，不代表不會跌！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: 1920s New York streets and a stock exchange quote board, sepia-warm tones.
Title banner text (exact): 「股票只會漲？」 with a smaller subtitle 「1929 股災」.

Panel 1 (top-left): 1920年代紐約，人們拿著報紙歡呼股價大漲。 Speech bubble (exact): 「路人：股票只會漲！」
Panel 2 (top-right): 投資人向經紀人借錢買股，擴大部位。 Speech bubble (exact): 「投資人：借錢買，賺更多！」
Panel 3 (bottom-left): 1929年10月報價牌急跌，人群驚慌；Ken 指著「借錢」與「虧損」的天平。 Speech bubble (exact): 「Ken：借錢投資，下跌也加倍痛。」
Panel 4 (bottom-right): Ken 和投資人坐下來，看著寫有「上漲≠安全」的筆記板。 Speech bubble (exact): 「Ken：漲很久，不代表不會跌！」
```
</details>

### 第 21 篇：1989 日本泡沫：房子、股票與信心一起漲

- 檔案：`site/public/media/ken/comic-21.png`　網址：`/money/ken-21/`
- 對象：18歲＋　概念：金融史與市場週期　主題區：金融史與市場週期

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 1980年代東京，股價看板和房價牌一路上漲，上班族興奮。 | 上班族：股票和房子都在漲！ |
| 2 | 人們到銀行借錢買地買股，排起長隊。 | 投資人：再借一點，再買一點！ |
| 3 | 1989年底日經指數創高後回落，大泡泡破掉；Ken 在一旁。 | Ken：借錢推高的價格，也會回頭。 |
| 4 | Ken 指著「負債」和「價格」兩個儀表，提醒兩者要一起看。 | Ken：資產會跌，別借到撐不住！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: late-1980s Tokyo skyline at night with neon and stock boards.
Title banner text (exact): 「泡沫一起漲」 with a smaller subtitle 「1989 日本」.

Panel 1 (top-left): 1980年代東京，股價看板和房價牌一路上漲，上班族興奮。 Speech bubble (exact): 「上班族：股票和房子都在漲！」
Panel 2 (top-right): 人們到銀行借錢買地買股，排起長隊。 Speech bubble (exact): 「投資人：再借一點，再買一點！」
Panel 3 (bottom-left): 1989年底日經指數創高後回落，大泡泡破掉；Ken 在一旁。 Speech bubble (exact): 「Ken：借錢推高的價格，也會回頭。」
Panel 4 (bottom-right): Ken 指著「負債」和「價格」兩個儀表，提醒兩者要一起看。 Speech bubble (exact): 「Ken：資產會跌，別借到撐不住！」
```
</details>

### 第 22 篇：1997 亞洲金融風暴：資金為什麼突然撤走？

- 檔案：`site/public/media/ken/comic-22.png`　網址：`/money/ken-22/`
- 對象：18歲＋　概念：金融史與市場週期　主題區：金融史與市場週期

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 亞洲城市高樓林立，外資資金像河流一樣湧入。 | 企業主：外資一直進來！ |
| 2 | 企業主借美元擴張，但營收是本地貨幣。 | 企業主：借美元比較便宜！ |
| 3 | 1997年7月泰銖改為浮動，匯率牌急變，還款金額變大；Ken 在一旁。 | Ken：匯率一變，外幣債就變重。 |
| 4 | Ken 指著地圖示意危機擴散，提醒外幣負債和短期借款的風險。 | Ken：收入和負債的幣別要對上！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a 1990s Southeast Asian city with construction cranes and currency exchange boards.
Title banner text (exact): 「資金突然撤走」 with a smaller subtitle 「1997 亞洲金融風暴」.

Panel 1 (top-left): 亞洲城市高樓林立，外資資金像河流一樣湧入。 Speech bubble (exact): 「企業主：外資一直進來！」
Panel 2 (top-right): 企業主借美元擴張，但營收是本地貨幣。 Speech bubble (exact): 「企業主：借美元比較便宜！」
Panel 3 (bottom-left): 1997年7月泰銖改為浮動，匯率牌急變，還款金額變大；Ken 在一旁。 Speech bubble (exact): 「Ken：匯率一變，外幣債就變重。」
Panel 4 (bottom-right): Ken 指著地圖示意危機擴散，提醒外幣負債和短期借款的風險。 Speech bubble (exact): 「Ken：收入和負債的幣別要對上！」
```
</details>

### 第 23 篇：2000 網路泡沫：有 .com 就有人買？

- 檔案：`site/public/media/ken/comic-23.png`　網址：`/money/ken-23/`
- 對象：18歲＋　概念：金融史與市場週期　主題區：金融史與市場週期

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 網路熱潮中，公司名稱加上「.com」，投資人搶著買。 | 投資人：名字有 .com，先買再說！ |
| 2 | Ken 指著兩個儀表：「故事」很高，「營收」很低。 | Ken：故事跑得比獲利快。 |
| 3 | 2000年科技股看板一路下跌，投資人驚慌。 | 投資人：怎麼一直跌？ |
| 4 | Ken 提醒看商業模式、獲利與買入價格。 | Ken：好技術，也要看買入價格！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: late-1990s tech office and stock screens with glowing .com signs; no real logos.
Title banner text (exact): 「有 .com 就有人買？」 with a smaller subtitle 「2000 網路泡沫」.

Panel 1 (top-left): 網路熱潮中，公司名稱加上「.com」，投資人搶著買。 Speech bubble (exact): 「投資人：名字有 .com，先買再說！」
Panel 2 (top-right): Ken 指著兩個儀表：「故事」很高，「營收」很低。 Speech bubble (exact): 「Ken：故事跑得比獲利快。」
Panel 3 (bottom-left): 2000年科技股看板一路下跌，投資人驚慌。 Speech bubble (exact): 「投資人：怎麼一直跌？」
Panel 4 (bottom-right): Ken 提醒看商業模式、獲利與買入價格。 Speech bubble (exact): 「Ken：好技術，也要看買入價格！」
```
</details>

### 第 24 篇：2008 金融海嘯：房貸風險如何擴散？

- 檔案：`site/public/media/ken/comic-24.png`　網址：`/money/ken-24/`
- 對象：18歲＋　概念：金融史與市場週期　主題區：金融史與市場週期

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 美國住宅區房價上漲，人們借貸買房。 | 屋主：房價一直漲，借錢也安心！ |
| 2 | 房貸被裝進一個個盒子，層層打包成金融商品送往各地。 | 銀行員：打包好，風險就分散了！ |
| 3 | 2008年房價下跌，盒子裂開，金融機構大樓搖晃；Ken 在一旁。 | Ken：打包之後，風險還在。 |
| 4 | Ken 指著鏈條圖：房貸 → 打包商品 → 槓桿 → 金融機構。 | Ken：先看清風險傳到誰手上！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: an American suburb and a stylized Wall Street; no real logos or bank names.
Title banner text (exact): 「房貸風險怎麼擴散」 with a smaller subtitle 「2008 金融海嘯」.

Panel 1 (top-left): 美國住宅區房價上漲，人們借貸買房。 Speech bubble (exact): 「屋主：房價一直漲，借錢也安心！」
Panel 2 (top-right): 房貸被裝進一個個盒子，層層打包成金融商品送往各地。 Speech bubble (exact): 「銀行員：打包好，風險就分散了！」
Panel 3 (bottom-left): 2008年房價下跌，盒子裂開，金融機構大樓搖晃；Ken 在一旁。 Speech bubble (exact): 「Ken：打包之後，風險還在。」
Panel 4 (bottom-right): Ken 指著鏈條圖：房貸 → 打包商品 → 槓桿 → 金融機構。 Speech bubble (exact): 「Ken：先看清風險傳到誰手上！」
```
</details>

### 第 25 篇：2020 疫情暴跌：一個月市場像按了快轉

- 檔案：`site/public/media/ken/comic-25.png`　網址：`/money/ken-25/`
- 對象：18歲＋　概念：金融史與市場週期　主題區：金融史與市場週期

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 2020年初，市場看板接近高點，投資人安心。 | 投資人：市場還在創新高！ |
| 2 | 疫情擴散，機場空蕩、商店關門，人們戴著口罩。 | 投資人：怎麼突然這麼多壞消息？ |
| 3 | 看板顯示標普500指數「約一個月 跌約34%」，投資人想全部賣掉；Ken 冷靜示意。 | Ken：最慌的時候，最容易做錯決定。 |
| 4 | Ken 展示準備清單：緊急預備金、分散、事先寫好計畫；背景市場慢慢回升。 | Ken：先留好備用金，再談投資！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: 2020 city scenes: busy then empty airport and closed shops, people in masks.
Title banner text (exact): 「一個月像按了快轉」 with a smaller subtitle 「2020 疫情暴跌」.

Panel 1 (top-left): 2020年初，市場看板接近高點，投資人安心。 Speech bubble (exact): 「投資人：市場還在創新高！」
Panel 2 (top-right): 疫情擴散，機場空蕩、商店關門，人們戴著口罩。 Speech bubble (exact): 「投資人：怎麼突然這麼多壞消息？」
Panel 3 (bottom-left): 看板顯示標普500指數「約一個月 跌約34%」，投資人想全部賣掉；Ken 冷靜示意。 Speech bubble (exact): 「Ken：最慌的時候，最容易做錯決定。」
Panel 4 (bottom-right): Ken 展示準備清單：緊急預備金、分散、事先寫好計畫；背景市場慢慢回升。 Speech bubble (exact): 「Ken：先留好備用金，再談投資！」
```
</details>

### 第 26 篇：1970年代：通膨升溫，黃金走勢也有回檔

- 檔案：`site/public/media/ken/comic-26.png`　網址：`/money/ken-26/`
- 對象：18歲＋　概念：黃金、通膨與歷史週期　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 1970年代商店價格牌上漲，一家人皺眉。 | 媽媽：東西怎麼越來越貴？ |
| 2 | 1973年石油衝擊，加油站大排長龍。 | 路人：油價也漲翻了！ |
| 3 | 金價長線往上，但中間有明顯大回檔的折線；Ken 指著回檔處。 | Ken：黃金漲，中間也會大跌。 |
| 4 | Ken 提醒要看完整期間，並做好配置。 | Ken：看完整段時間，別只看一段！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: 1970s grocery store and gas station, warm retro colors.
Title banner text (exact): 「通膨與黃金」 with a smaller subtitle 「1970 年代」.

Panel 1 (top-left): 1970年代商店價格牌上漲，一家人皺眉。 Speech bubble (exact): 「媽媽：東西怎麼越來越貴？」
Panel 2 (top-right): 1973年石油衝擊，加油站大排長龍。 Speech bubble (exact): 「路人：油價也漲翻了！」
Panel 3 (bottom-left): 金價長線往上，但中間有明顯大回檔的折線；Ken 指著回檔處。 Speech bubble (exact): 「Ken：黃金漲，中間也會大跌。」
Panel 4 (bottom-right): Ken 提醒要看完整期間，並做好配置。 Speech bubble (exact): 「Ken：看完整段時間，別只看一段！」
```
</details>

### 第 27 篇：1971 美元與黃金脫鉤：規則如何改變？

- 檔案：`site/public/media/ken/comic-27.png`　網址：`/money/ken-27/`
- 對象：18歲＋　概念：貨幣制度與黃金　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 天平一端是美元、一端是金條，牌子寫著「美元可兌黃金」；Ken 講解。 | Ken：以前，美元可以換黃金。 |
| 2 | 各國央行代表排隊，想把美元換成黃金，金庫壓力變大。 | 央行代表：我們想換成黃金！ |
| 3 | 1971年，金庫大門關上，牌子寫著「暫停兌換」。 | Ken：1971年，美國暫停美元兌金。 |
| 4 | Ken 指著分開的美元與黃金走勢圖。 | Ken：規則改了，價格看市場。 |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a grand vault and an international meeting hall; no real politicians.
Title banner text (exact): 「美元和黃金分家」 with a smaller subtitle 「1971」.

Panel 1 (top-left): 天平一端是美元、一端是金條，牌子寫著「美元可兌黃金」；Ken 講解。 Speech bubble (exact): 「Ken：以前，美元可以換黃金。」
Panel 2 (top-right): 各國央行代表排隊，想把美元換成黃金，金庫壓力變大。 Speech bubble (exact): 「央行代表：我們想換成黃金！」
Panel 3 (bottom-left): 1971年，金庫大門關上，牌子寫著「暫停兌換」。 Speech bubble (exact): 「Ken：1971年，美國暫停美元兌金。」
Panel 4 (bottom-right): Ken 指著分開的美元與黃金走勢圖。 Speech bubble (exact): 「Ken：規則改了，價格看市場。」
```
</details>

### 第 28 篇：1980 黃金高點：最熱的時候也要看回檔

- 檔案：`site/public/media/ken/comic-28.png`　網址：`/money/ken-28/`
- 對象：18歲＋　概念：黃金價格週期　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 通膨與局勢緊張的新聞看板，人們搶買金條金飾。 | 投資人：快買黃金避險！ |
| 2 | 金價折線急速上升，人群追高。 | 投資人：再不買就來不及！ |
| 3 | 1980年前後金價創高後快速回落，投資人驚訝；Ken 在一旁。 | Ken：最熱的時候，也可能是高點。 |
| 4 | Ken 提醒追高前，先想好能承受多少下跌。 | Ken：先想好能承受多少下跌！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a late-1970s/1980 jewelry street and news boards.
Title banner text (exact): 「最熱的時候」 with a smaller subtitle 「1980 黃金高點」.

Panel 1 (top-left): 通膨與局勢緊張的新聞看板，人們搶買金條金飾。 Speech bubble (exact): 「投資人：快買黃金避險！」
Panel 2 (top-right): 金價折線急速上升，人群追高。 Speech bubble (exact): 「投資人：再不買就來不及！」
Panel 3 (bottom-left): 1980年前後金價創高後快速回落，投資人驚訝；Ken 在一旁。 Speech bubble (exact): 「Ken：最熱的時候，也可能是高點。」
Panel 4 (bottom-right): Ken 提醒追高前，先想好能承受多少下跌。 Speech bubble (exact): 「Ken：先想好能承受多少下跌！」
```
</details>

### 第 29 篇：黃金沉寂20年：一個高點可能要很久消化

- 檔案：`site/public/media/ken/comic-29.png`　網址：`/money/ken-29/`
- 對象：18歲＋　概念：黃金價格週期　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 金價折線像一座山，1980年前後的山頂插著旗子；Ken 講解。 | Ken：1980年前後，金價衝上高點。 |
| 2 | 之後金價長期低迷，持有人坐在山谷裡等待，日曆一頁頁翻過。 | 投資人：怎麼等了這麼多年？ |
| 3 | 天平一端是「存款有利息」、一端是「黃金沒利息」。 | Ken：黃金沒利息，等待也有成本。 |
| 4 | Ken 提醒：價格、時間和持有成本都要算。 | Ken：高點可能要很久才消化！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a stylized mountain-and-valley landscape made of a gold price line, with calendars.
Title banner text (exact): 「一等二十年」 with a smaller subtitle 「黃金的沉寂」.

Panel 1 (top-left): 金價折線像一座山，1980年前後的山頂插著旗子；Ken 講解。 Speech bubble (exact): 「Ken：1980年前後，金價衝上高點。」
Panel 2 (top-right): 之後金價長期低迷，持有人坐在山谷裡等待，日曆一頁頁翻過。 Speech bubble (exact): 「投資人：怎麼等了這麼多年？」
Panel 3 (bottom-left): 天平一端是「存款有利息」、一端是「黃金沒利息」。 Speech bubble (exact): 「Ken：黃金沒利息，等待也有成本。」
Panel 4 (bottom-right): Ken 提醒：價格、時間和持有成本都要算。 Speech bubble (exact): 「Ken：高點可能要很久才消化！」
```
</details>

### 第 30 篇：2008之後，黃金的角色變了嗎？

- 檔案：`site/public/media/ken/comic-30.png`　網址：`/money/ken-30/`
- 對象：18歲＋　概念：黃金、危機與配置　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 2008年銀行危機，人們急著換現金。 | 投資人：先換成現金再說！ |
| 2 | 連黃金也被賣出，金價一度下跌，投資人驚訝。 | 投資人：黃金也跌了？ |
| 3 | 央行推出政策工具，金價之後回升但仍上下波動；Ken 在一旁。 | Ken：危機中，黃金也可能先被賣。 |
| 4 | Ken 提醒：避險資產也有價格與流動性風險。 | Ken：避險資產，也會波動！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a 2008 financial district under stormy sky, then calmer skies.
Title banner text (exact): 「黃金的角色變了嗎？」 with a smaller subtitle 「2008 之後」.

Panel 1 (top-left): 2008年銀行危機，人們急著換現金。 Speech bubble (exact): 「投資人：先換成現金再說！」
Panel 2 (top-right): 連黃金也被賣出，金價一度下跌，投資人驚訝。 Speech bubble (exact): 「投資人：黃金也跌了？」
Panel 3 (bottom-left): 央行推出政策工具，金價之後回升但仍上下波動；Ken 在一旁。 Speech bubble (exact): 「Ken：危機中，黃金也可能先被賣。」
Panel 4 (bottom-right): Ken 提醒：避險資產也有價格與流動性風險。 Speech bubble (exact): 「Ken：避險資產，也會波動！」
```
</details>

### 第 31 篇：央行為什麼買黃金？

- 檔案：`site/public/media/ken/comic-31.png`　網址：`/money/ken-31/`
- 對象：18歲＋　概念：央行儲備與黃金　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 央行儲備金庫裡分成美元、其他外匯、債券、黃金幾格；Ken 講解。 | Ken：央行的儲備，不只放一種。 |
| 2 | 金條旁標示「沒有單一發行人」與「價格會波動」。 | Ken：黃金沒發行人，但價格會動。 |
| 3 | 央行代表在危機中評估流動性與分散。 | 央行代表：要分散，也要用得上。 |
| 4 | Ken 對一家人說明：央行和家庭的目標不同。 | Ken：央行在買，不等於你該買！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a central bank reserve vault with labeled shelves; no real bank names.
Title banner text (exact): 「央行為什麼買黃金？」.

Panel 1 (top-left): 央行儲備金庫裡分成美元、其他外匯、債券、黃金幾格；Ken 講解。 Speech bubble (exact): 「Ken：央行的儲備，不只放一種。」
Panel 2 (top-right): 金條旁標示「沒有單一發行人」與「價格會波動」。 Speech bubble (exact): 「Ken：黃金沒發行人，但價格會動。」
Panel 3 (bottom-left): 央行代表在危機中評估流動性與分散。 Speech bubble (exact): 「央行代表：要分散，也要用得上。」
Panel 4 (bottom-right): Ken 對一家人說明：央行和家庭的目標不同。 Speech bubble (exact): 「Ken：央行在買，不等於你該買！」
```
</details>

### 第 32 篇：黃金到底能不能保值？

- 檔案：`site/public/media/ken/comic-32.png`　網址：`/money/ken-32/`
- 對象：18歲＋　概念：購買力與黃金價格　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 短期：物價折線往上，金價折線卻往下，投資人困惑。 | 投資人：物價漲，金價卻跌？ |
| 2 | Ken 拉出一條很長的時間軸，說明要看持有多久。 | Ken：保值要看持有多久。 |
| 3 | 時間軸中間有長長的低谷，投資人等得很辛苦。 | 投資人：中間好難熬…… |
| 4 | Ken 提醒：保值不等於保證漲，買入價格很重要。 | Ken：保值，不等於保證漲！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a cozy study room with charts on the wall.
Title banner text (exact): 「黃金能不能保值？」.

Panel 1 (top-left): 短期：物價折線往上，金價折線卻往下，投資人困惑。 Speech bubble (exact): 「投資人：物價漲，金價卻跌？」
Panel 2 (top-right): Ken 拉出一條很長的時間軸，說明要看持有多久。 Speech bubble (exact): 「Ken：保值要看持有多久。」
Panel 3 (bottom-left): 時間軸中間有長長的低谷，投資人等得很辛苦。 Speech bubble (exact): 「投資人：中間好難熬……」
Panel 4 (bottom-right): Ken 提醒：保值不等於保證漲，買入價格很重要。 Speech bubble (exact): 「Ken：保值，不等於保證漲！」
```
</details>

### 第 33 篇：黃金創新高了，現在還能買嗎？

- 檔案：`site/public/media/ken/comic-33.png`　網址：`/money/ken-33/`
- 對象：18歲＋　概念：投資心理與風險管理　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 新聞標題寫著「金價創新高」，人們興奮。 | 投資人：創新高了，快追！ |
| 2 | Ken 指出：高點之後也可能回落的示意圖。 | Ken：高點之後，也可能回落。 |
| 3 | 投資人很怕錯過，內心掙扎。 | 投資人：可是不買怕錯過…… |
| 4 | Ken 列出三個問題：目標是什麼？能放多久？跌兩成還受得了嗎？ | Ken：先問自己三件事！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a modern city with news screens showing gold headlines; no specific prices or dates.
Title banner text (exact): 「創新高還能買嗎？」.

Panel 1 (top-left): 新聞標題寫著「金價創新高」，人們興奮。 Speech bubble (exact): 「投資人：創新高了，快追！」
Panel 2 (top-right): Ken 指出：高點之後也可能回落的示意圖。 Speech bubble (exact): 「Ken：高點之後，也可能回落。」
Panel 3 (bottom-left): 投資人很怕錯過，內心掙扎。 Speech bubble (exact): 「投資人：可是不買怕錯過……」
Panel 4 (bottom-right): Ken 列出三個問題：目標是什麼？能放多久？跌兩成還受得了嗎？ Speech bubble (exact): 「Ken：先問自己三件事！」
```
</details>

### 第 34 篇：黃金沒利息，央行為什麼還買？

- 檔案：`site/public/media/ken/comic-34.png`　網址：`/money/ken-34/`
- 對象：18歲＋　概念：央行儲備與黃金　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 存款和債券會配息，金條旁寫著「不配息」，投資人疑惑。 | 投資人：黃金又沒利息？ |
| 2 | 央行的儲備櫃裡仍放著黃金；Ken 講解。 | Ken：央行看的是儲備，不是利息。 |
| 3 | 黃金、美元、債券放在不同籃子裡，風險各不相同。 | Ken：不同資產，風險不一樣。 |
| 4 | Ken 提醒：調查意向不等於實際買入，個人目標也和央行不同。 | Ken：別把央行動作當買進訊號！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a bank counter and a central bank reserve room; no real bank names or numbers.
Title banner text (exact): 「黃金沒利息，央行為什麼還買？」.

Panel 1 (top-left): 存款和債券會配息，金條旁寫著「不配息」，投資人疑惑。 Speech bubble (exact): 「投資人：黃金又沒利息？」
Panel 2 (top-right): 央行的儲備櫃裡仍放著黃金；Ken 講解。 Speech bubble (exact): 「Ken：央行看的是儲備，不是利息。」
Panel 3 (bottom-left): 黃金、美元、債券放在不同籃子裡，風險各不相同。 Speech bubble (exact): 「Ken：不同資產，風險不一樣。」
Panel 4 (bottom-right): Ken 提醒：調查意向不等於實際買入，個人目標也和央行不同。 Speech bubble (exact): 「Ken：別把央行動作當買進訊號！」
```
</details>

### 第 35 篇：美元漲，黃金一定跌嗎？

- 檔案：`site/public/media/ken/comic-35.png`　網址：`/money/ken-35/`
- 對象：18歲＋　概念：美元、利率與金價　主題區：黃金與總體經濟

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 蹺蹺板一端是美元往上，一端是黃金往下，投資人以為是固定規律。 | 投資人：美元漲，黃金就跌？ |
| 2 | Ken 解釋：黃金用美元計價，美元強時其他貨幣買金變貴。 | Ken：黃金用美元計價，常常反向。 |
| 3 | 畫面中也出現美元和黃金一起往上的時候。 | Ken：但這不是鐵律。 |
| 4 | Ken 指出利率、風險偏好、央行需求等其他力量。 | Ken：別只用一個指標猜價格！ |

<details><summary>生圖提示詞（整段複製）</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and page layout as the reference comics (site/public/media/ken/comic-01.png and comic-11.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm lighting, cream paper background, a big decorative bold Traditional Chinese title banner at the top, 2x2 grid of panels with rounded dark-brown borders, large white speech bubbles with black Traditional Chinese text (speaker name, full-width colon, then the line), and a bottom plaque with a small open-book icon that reads 「Ken財商教室」.
Ken (the teacher) must look exactly like the Ken IP reference (site/public/media/characters/ken-ip.webp), drawn as the same chibi character used in the reference comics: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly face. Keep Ken identical in every panel he appears in.
Adult audience (18+), cute but grown-up characters. No real company logos, no real people besides Ken, no violence or blood, no watermark. Render ALL Chinese text crisply in Traditional Chinese exactly as given; no extra text; no English except the name Ken and text given below.

Setting: a playful park with a seesaw labeled with a dollar sign and a gold bar.
Title banner text (exact): 「美元漲，黃金一定跌？」.

Panel 1 (top-left): 蹺蹺板一端是美元往上，一端是黃金往下，投資人以為是固定規律。 Speech bubble (exact): 「投資人：美元漲，黃金就跌？」
Panel 2 (top-right): Ken 解釋：黃金用美元計價，美元強時其他貨幣買金變貴。 Speech bubble (exact): 「Ken：黃金用美元計價，常常反向。」
Panel 3 (bottom-left): 畫面中也出現美元和黃金一起往上的時候。 Speech bubble (exact): 「Ken：但這不是鐵律。」
Panel 4 (bottom-right): Ken 指出利率、風險偏好、央行需求等其他力量。 Speech bubble (exact): 「Ken：別只用一個指標猜價格！」
```
</details>

---

## 4. 追加到 `site/lib/ken-episodes.json` 的資料

把下面陣列裡的 23 個物件，**依順序**接在現有第 12 個物件後面，並保持 JSON 格式正確（兩格縮排）。

```json
[
  {
    "title": "鴻源案：高利為何讓人放下戒心？",
    "age": "18歲＋",
    "concept": "金融詐騙與平台風險",
    "category": "投資詐騙與平台風險",
    "scenes": [
      "1980年代臺灣街頭，阿明拿著「每月四分利」傳單，同事圍著說大家都在投。",
      "阿明翻開存摺看到利息入帳，投資公司門口排起長長人龍。",
      "投資公司拉下鐵門，貼出「暫停發放」，人群焦急；Ken 在一旁冷靜說明。",
      "Ken 指著警訊板：高利保證、熟人推薦、看不懂怎麼賺；阿明與太太點頭。"
    ],
    "lines": [
      "阿明：每月四分利，大家都在賺！",
      "阿明：真的有領到，再加碼！",
      "Ken：前期領到錢，也可能是誘餌。",
      "Ken：看不懂怎麼賺，就先別投入！"
    ],
    "lesson": "臺灣高等檢察署資料記載，鴻源機構以高利吸收資金，包含介紹獎金，後因資金不足倒閉。圖中「每月四分利」應視為歷史案例描述，不是任何投資產品的正常報酬。",
    "question": "若有人用高報酬和熟人背書邀你投資，你會先查哪些資料？",
    "source": [
      "hongyuan"
    ],
    "editorialNote": "歷史金額與受害人數請以檢察機關資料為準；案例用於風險教育，不指涉現行公司。"
  },
  {
    "title": "Madoff 案：名氣與穩定報酬的陷阱",
    "age": "18歲＋",
    "concept": "金融詐騙與平台風險",
    "category": "投資詐騙與平台風險",
    "scenes": [
      "豪華辦公室裡，投資人稱讚一位知名基金經理，報酬表上的線平穩向上。",
      "有人順利贖回拿到錢，其他投資人更放心地加碼。",
      "2008年新聞看板寫著「龐氏騙局曝光」，投資人震驚；Ken 指著帳戶報表。",
      "Ken 展示查核清單：資產由誰保管、有無獨立查核、報酬是否穩得不自然。"
    ],
    "lines": [
      "投資人：他名氣大，報酬又穩！",
      "投資人：前面的人都領得到錢。",
      "Ken：帳上的數字，不等於真的有錢。",
      "Ken：先查錢放哪、誰在查帳！"
    ],
    "lesson": "Bernard Madoff 於2009年承認其財富管理業務是龐氏騙局。常被引用的約650億美元，是客戶帳戶所顯示的虛構餘額，不應直接說成實際淨損失。",
    "question": "除了名氣和過往報酬，你還會要求看哪些獨立證據？",
    "source": [
      "madoff"
    ],
    "editorialNote": "漫畫中的穩定年報酬是詐騙呈現出的假象；650億美元為帳面虛構餘額的常見表述，實際損失估算與計算口徑不同。"
  },
  {
    "title": "OneCoin 案：下一個比特幣？",
    "age": "18歲＋",
    "concept": "金融詐騙與平台風險",
    "category": "投資詐騙與平台風險",
    "scenes": [
      "華麗發表會舞台，大螢幕寫著「下一個比特幣」，觀眾熱烈鼓掌。",
      "朋友拿著不同等級的「套裝方案」價目表，邀人加入。",
      "2017年舞台空無一人，投資人拿著手機追問錢的去向；Ken 出現。",
      "Ken 指著檢查板：能否在公開市場買賣、技術能否查證、收益從哪來。"
    ],
    "lines": [
      "觀眾：聽起來好厲害！",
      "朋友：買套裝，再拉人就能賺！",
      "Ken：靠拉人加入，不是投資價值。",
      "Ken：查不到、賣不掉，就要小心！"
    ],
    "lesson": "美國司法部資料指出，OneCoin 以多層次行銷方式推廣，受害者在2014至2019年間投入逾40億美元；共同創辦人 Karl Sebastian Greenwood 已認罪並被判刑。",
    "question": "一項投資若主要靠招募新成員維持，你會先追問什麼？",
    "source": [
      "onecoin"
    ],
    "editorialNote": "案件金額、涉案人及司法進度以司法部原始資料為準；避免將所有參與者一概描述為知情共犯。"
  },
  {
    "title": "FTX 案：大平台為什麼也會出事？",
    "age": "18歲＋",
    "concept": "金融詐騙與平台風險",
    "category": "投資詐騙與平台風險",
    "scenes": [
      "巨大的交易平台大樓與廣告看板，使用者覺得規模大就安全。",
      "使用者把加密資產與現金長期放在平台帳戶裡。",
      "2022年手機畫面顯示「暫停提款」，使用者焦急；Ken 指著「客戶資金應分開保管」的示意圖。",
      "Ken 列出：誰保管資產、能否隨時提款、別把錢全放同一處。"
    ],
    "lines": [
      "使用者：平台這麼大，一定沒問題！",
      "使用者：錢放這裡最方便。",
      "Ken：要看客戶的錢有沒有分開保管。",
      "Ken：規模大，不等於資產安全！"
    ],
    "lesson": "美國司法部指出，FTX 創辦人 Sam Bankman-Fried 挪用客戶資金，並於2024年被判處25年徒刑。平台規模、名氣與方便性都不能取代對資產保管和風險的了解。",
    "question": "使用交易平台前，你會確認哪些資產保管和提款規則？",
    "source": [
      "ftx"
    ]
  },
  {
    "title": "LUNA 案：穩定幣真的穩嗎？",
    "age": "18歲＋",
    "concept": "金融詐騙與平台風險",
    "category": "投資詐騙與平台風險",
    "scenes": [
      "看板寫著「穩定幣 1:1 美元」與「高收益」，投資人心動。",
      "大量用戶湧入，圖表看起來平穩，大家覺得沒事。",
      "2022年5月，穩定幣跌出1美元的線，相關代幣急墜；Ken 在一旁。",
      "Ken 提出兩個問題：收益從哪裡來？風險由誰承擔？"
    ],
    "lines": [
      "投資人：穩定幣，又有高收益！",
      "投資人：這麼多人在用，應該沒事。",
      "Ken：一脫鉤，價格就可能崩。",
      "Ken：叫「穩定」，不代表不會跌！"
    ],
    "lesson": "SEC資料指出，UST曾被宣傳可透過Anchor取得最高約20%的收益；2022年5月脫鉤後，UST與相關資產價格暴跌。穩定幣名稱不等於本金或價格穩定。",
    "question": "看到高收益承諾時，你會先問收益從哪裡來、風險由誰承擔嗎？",
    "source": [
      "terra"
    ],
    "editorialNote": "圖中百分比是當時宣傳內容，不是保證收益；本篇用於解釋機制與風險，不構成對任何代幣的投資建議。"
  },
  {
    "title": "im.B 案：名字叫銀行，為什麼不是銀行？",
    "age": "18歲＋",
    "concept": "金融詐騙與平台風險",
    "category": "投資詐騙與平台風險",
    "scenes": [
      "投資人看著介面專業、名稱像銀行的手機 App，覺得很可靠。",
      "平台宣稱有房產債權擔保，早期利息準時入帳。",
      "平台出問題，投資人收不回資金；Ken 解釋媒合平台和銀行不同。",
      "Ken 列出：借款人是誰、錢流去哪、違約怎麼處理。"
    ],
    "lines": [
      "投資人：名字像銀行，應該很可靠！",
      "投資人：有房子擔保，還有利息入帳！",
      "Ken：媒合平台不是銀行。",
      "Ken：說不清錢流向，就先停手！"
    ],
    "lesson": "監察院與最高法院資料顯示，im.B案件涉及假債權、非法吸收資金等問題。借貸媒合平台和銀行是不同業務型態，平台名稱、抵押物或前期利息都不能單獨證明資金安全。",
    "question": "投資前，你能清楚說出借款人、債權、資金流向和違約處理方式嗎？",
    "source": [
      "imb"
    ],
    "editorialNote": "案件的指控、判決與不同被告責任須分別看待；本篇只整理官方已公開的制度與案件資料。"
  },
  {
    "title": "JPEX 案：為什麼越多人推，反而越危險？",
    "age": "18歲＋",
    "concept": "金融詐騙與平台風險",
    "category": "投資詐騙與平台風險",
    "scenes": [
      "手機上的網紅和社群都在推薦同一個交易平台。",
      "投資人先小額入金，App 顯示高收益。",
      "提領卡住，畫面顯示「提款處理中」，投資人向警方求助；Ken 在一旁。",
      "Ken 指著檢查清單：查監管名單、看提款條件、別只信推薦。"
    ],
    "lines": [
      "網友：大家都在推，一定可靠！",
      "投資人：先放一點試試看。",
      "Ken：人多推薦，不等於有監管。",
      "Ken：先查監管機構的名單！"
    ],
    "lesson": "香港警方公開資料將JPEX列為網上投資騙案案例，並持續更新報案與調查進度。報案、拘捕和定罪是不同法律階段，應依警方及法院最新資料表述。",
    "question": "看到網紅推薦平台，你會如何自行確認監管資格與提款規則？",
    "source": [
      "jpex"
    ],
    "editorialNote": "案件調查和司法程序會變動；本文不把報案人數、被捕人數等同於定罪人數。"
  },
  {
    "title": "1929 股災：當全民都以為股票只會漲",
    "age": "18歲＋",
    "concept": "金融史與市場週期",
    "category": "金融史與市場週期",
    "scenes": [
      "1920年代紐約，人們拿著報紙歡呼股價大漲。",
      "投資人向經紀人借錢買股，擴大部位。",
      "1929年10月報價牌急跌，人群驚慌；Ken 指著「借錢」與「虧損」的天平。",
      "Ken 和投資人坐下來，看著寫有「上漲≠安全」的筆記板。"
    ],
    "lines": [
      "路人：股票只會漲！",
      "投資人：借錢買，賺更多！",
      "Ken：借錢投資，下跌也加倍痛。",
      "Ken：漲很久，不代表不會跌！"
    ],
    "lesson": "美聯儲歷史資料記載，1929年10月28日道瓊指數下跌近13%，隔日再跌近12%；保證金交易讓投資者可借款買股。圖片中的跌幅數字若無明確指數和日期，不應當成精確歷史數據。",
    "question": "借錢投資會怎樣改變你承受下跌的能力？",
    "source": [
      "crash1929"
    ],
    "editorialNote": "漫畫為教學示意；不同指數、交易日與起訖日期會產生不同跌幅。"
  },
  {
    "title": "1989 日本泡沫：房子、股票與信心一起漲",
    "age": "18歲＋",
    "concept": "金融史與市場週期",
    "category": "金融史與市場週期",
    "scenes": [
      "1980年代東京，股價看板和房價牌一路上漲，上班族興奮。",
      "人們到銀行借錢買地買股，排起長隊。",
      "1989年底日經指數創高後回落，大泡泡破掉；Ken 在一旁。",
      "Ken 指著「負債」和「價格」兩個儀表，提醒兩者要一起看。"
    ],
    "lines": [
      "上班族：股票和房子都在漲！",
      "投資人：再借一點，再買一點！",
      "Ken：借錢推高的價格，也會回頭。",
      "Ken：資產會跌，別借到撐不住！"
    ],
    "lesson": "日本銀行研究記載，日經225指數於1989年底創當時高點38,915點，之後大幅回落。泡沫形成與破裂涉及多重因素，不能簡化為「資產漲就一定會崩」。",
    "question": "若資產價格主要靠借款推高，最需要追蹤哪些風險？",
    "source": [
      "japanBubble"
    ],
    "editorialNote": "1989年高點為名目指數資料，請以日本銀行或日經原始資料核對。"
  },
  {
    "title": "1997 亞洲金融風暴：資金為什麼突然撤走？",
    "age": "18歲＋",
    "concept": "金融史與市場週期",
    "category": "金融史與市場週期",
    "scenes": [
      "亞洲城市高樓林立，外資資金像河流一樣湧入。",
      "企業主借美元擴張，但營收是本地貨幣。",
      "1997年7月泰銖改為浮動，匯率牌急變，還款金額變大；Ken 在一旁。",
      "Ken 指著地圖示意危機擴散，提醒外幣負債和短期借款的風險。"
    ],
    "lines": [
      "企業主：外資一直進來！",
      "企業主：借美元比較便宜！",
      "Ken：匯率一變，外幣債就變重。",
      "Ken：收入和負債的幣別要對上！"
    ],
    "lesson": "IMF資料記載，泰國於1997年7月2日放棄泰銖盯住美元並讓其浮動，壓力隨後傳至其他亞洲經濟體。各地情況不同，危機不能只歸因於單一因素。",
    "question": "用外幣借款但收入是本幣，匯率變動會帶來什麼風險？",
    "source": [
      "asia1997"
    ],
    "editorialNote": "亞洲各地危機的發生時間、原因與政策回應並不完全相同。"
  },
  {
    "title": "2000 網路泡沫：有 .com 就有人買？",
    "age": "18歲＋",
    "concept": "金融史與市場週期",
    "category": "金融史與市場週期",
    "scenes": [
      "網路熱潮中，公司名稱加上「.com」，投資人搶著買。",
      "Ken 指著兩個儀表：「故事」很高，「營收」很低。",
      "2000年科技股看板一路下跌，投資人驚慌。",
      "Ken 提醒看商業模式、獲利與買入價格。"
    ],
    "lines": [
      "投資人：名字有 .com，先買再說！",
      "Ken：故事跑得比獲利快。",
      "投資人：怎麼一直跌？",
      "Ken：好技術，也要看買入價格！"
    ],
    "lesson": "美國證券交易委員會回顧指出，網路公司和新經濟帶動市場大幅上漲，泡沫於2000年春季開始破裂，股價隨後下跌。網路技術帶來真實改變，不代表每家公司都能建立可持續的商業模式，也不代表任何價格都合理。",
    "question": "評估一家公司時，除了市場故事，你會如何檢查營收、獲利與估值？",
    "source": [
      "dotcomBubble"
    ],
    "editorialNote": "泡沫破裂時間以美國證券交易委員會資料為準；漫畫不引用精確漲跌幅。"
  },
  {
    "title": "2008 金融海嘯：房貸風險如何擴散？",
    "age": "18歲＋",
    "concept": "金融史與市場週期",
    "category": "金融史與市場週期",
    "scenes": [
      "美國住宅區房價上漲，人們借貸買房。",
      "房貸被裝進一個個盒子，層層打包成金融商品送往各地。",
      "2008年房價下跌，盒子裂開，金融機構大樓搖晃；Ken 在一旁。",
      "Ken 指著鏈條圖：房貸 → 打包商品 → 槓桿 → 金融機構。"
    ],
    "lines": [
      "屋主：房價一直漲，借錢也安心！",
      "銀行員：打包好，風險就分散了！",
      "Ken：打包之後，風險還在。",
      "Ken：先看清風險傳到誰手上！"
    ],
    "lesson": "金融危機調查委員會的報告記載，次級房貸、證券化、槓桿和監管失靈等因素相互作用，引發2008年金融危機。圖中把複雜危機簡化為房貸鏈條，適合入門理解，不是完整因果解釋。",
    "question": "把貸款包裝成金融商品後，風險會消失還是轉移？",
    "source": [
      "fcic"
    ],
    "editorialNote": "歷史事件包含多個制度和市場因素；漫畫情節是概念示意，避免把單一原因當成完整解釋。"
  },
  {
    "title": "2020 疫情暴跌：一個月市場像按了快轉",
    "age": "18歲＋",
    "concept": "金融史與市場週期",
    "category": "金融史與市場週期",
    "scenes": [
      "2020年初，市場看板接近高點，投資人安心。",
      "疫情擴散，機場空蕩、商店關門，人們戴著口罩。",
      "看板顯示標普500指數「約一個月 跌約34%」，投資人想全部賣掉；Ken 冷靜示意。",
      "Ken 展示準備清單：緊急預備金、分散、事先寫好計畫；背景市場慢慢回升。"
    ],
    "lines": [
      "投資人：市場還在創新高！",
      "投資人：怎麼突然這麼多壞消息？",
      "Ken：最慌的時候，最容易做錯決定。",
      "Ken：先留好備用金，再談投資！"
    ],
    "lesson": "聖路易聯準銀行資料指出，標普500指數在2020年2月19日見高後，到3月23日下跌至高點的約66%，跌幅約34%。之後市場快速反彈，但產業和個人的復原情況並不一致；單一指數不代表每種資產或每個人的經驗。",
    "question": "市場快速下跌時，哪些準備能讓你避免在最慌張時被迫做決定？",
    "source": [
      "covidCrash"
    ],
    "editorialNote": "跌幅依聖路易聯準銀行標普500收盤資料；不同日期、盤中／收盤價會造成差異。市場反彈不代表各產業或投資人同步復原。"
  },
  {
    "title": "1970年代：通膨升溫，黃金走勢也有回檔",
    "age": "18歲＋",
    "concept": "黃金、通膨與歷史週期",
    "category": "黃金與總體經濟",
    "scenes": [
      "1970年代商店價格牌上漲，一家人皺眉。",
      "1973年石油衝擊，加油站大排長龍。",
      "金價長線往上，但中間有明顯大回檔的折線；Ken 指著回檔處。",
      "Ken 提醒要看完整期間，並做好配置。"
    ],
    "lines": [
      "媽媽：東西怎麼越來越貴？",
      "路人：油價也漲翻了！",
      "Ken：黃金漲，中間也會大跌。",
      "Ken：看完整段時間，別只看一段！"
    ],
    "lesson": "1970年代包含多輪能源與通膨衝擊；黃金價格也受貨幣制度、利率與市場供需影響。單一區間的金價表現不能直接推出未來保值結果。",
    "question": "物價上升時，為什麼不同資產未必同步上漲？",
    "source": [
      "oil1970s",
      "goldPrice"
    ],
    "editorialNote": "漫畫中的金價折線為示意，不代表精確價格序列。"
  },
  {
    "title": "1971 美元與黃金脫鉤：規則如何改變？",
    "age": "18歲＋",
    "concept": "貨幣制度與黃金",
    "category": "黃金與總體經濟",
    "scenes": [
      "天平一端是美元、一端是金條，牌子寫著「美元可兌黃金」；Ken 講解。",
      "各國央行代表排隊，想把美元換成黃金，金庫壓力變大。",
      "1971年，金庫大門關上，牌子寫著「暫停兌換」。",
      "Ken 指著分開的美元與黃金走勢圖。"
    ],
    "lines": [
      "Ken：以前，美元可以換黃金。",
      "央行代表：我們想換成黃金！",
      "Ken：1971年，美國暫停美元兌金。",
      "Ken：規則改了，價格看市場。"
    ],
    "lesson": "美聯儲歷史資料指出，1971年美國停止美元對黃金的官方兌換，是布雷頓森林體系瓦解的重要轉折；不是全球貨幣規則在同一天全部完成切換。",
    "question": "固定兌換制度取消後，黃金和貨幣價格由什麼因素影響？",
    "source": [
      "goldConvertibility"
    ],
    "editorialNote": "尼克森於1971年宣布暫停美元兌金；其後國際貨幣制度的轉變仍經過多個階段。"
  },
  {
    "title": "1980 黃金高點：最熱的時候也要看回檔",
    "age": "18歲＋",
    "concept": "黃金價格週期",
    "category": "黃金與總體經濟",
    "scenes": [
      "通膨與局勢緊張的新聞看板，人們搶買金條金飾。",
      "金價折線急速上升，人群追高。",
      "1980年前後金價創高後快速回落，投資人驚訝；Ken 在一旁。",
      "Ken 提醒追高前，先想好能承受多少下跌。"
    ],
    "lines": [
      "投資人：快買黃金避險！",
      "投資人：再不買就來不及！",
      "Ken：最熱的時候，也可能是高點。",
      "Ken：先想好能承受多少下跌！"
    ],
    "lesson": "歷史金價序列顯示，黃金在1980年前後曾大幅上漲並於其後回落。高點數字會因每日、盤中或收盤價格口徑而不同。",
    "question": "價格創新高時，你會用哪些條件判斷自己的風險承受度？",
    "source": [
      "goldPrice"
    ],
    "editorialNote": "金價為名目美元價格且未調整通膨；盤中高點和收盤價可能不同。"
  },
  {
    "title": "黃金沉寂20年：一個高點可能要很久消化",
    "age": "18歲＋",
    "concept": "黃金價格週期",
    "category": "黃金與總體經濟",
    "scenes": [
      "金價折線像一座山，1980年前後的山頂插著旗子；Ken 講解。",
      "之後金價長期低迷，持有人坐在山谷裡等待，日曆一頁頁翻過。",
      "天平一端是「存款有利息」、一端是「黃金沒利息」。",
      "Ken 提醒：價格、時間和持有成本都要算。"
    ],
    "lines": [
      "Ken：1980年前後，金價衝上高點。",
      "投資人：怎麼等了這麼多年？",
      "Ken：黃金沒利息，等待也有成本。",
      "Ken：高點可能要很久才消化！"
    ],
    "lesson": "黃金價格從1980高點到1999低點的幅度和年數，會因每日或年度價格、通膨調整和幣別而不同。這段歷史提醒讀者：黃金可能經歷長期低迷，不保證短中期保值。",
    "question": "一項資產長期沒有利息，持有多年需要考慮哪些成本？",
    "source": [
      "goldPrice"
    ],
    "editorialNote": "漫畫不引用低點價格；名目美元價格不能直接等同購買力或報酬率。"
  },
  {
    "title": "2008之後，黃金的角色變了嗎？",
    "age": "18歲＋",
    "concept": "黃金、危機與配置",
    "category": "黃金與總體經濟",
    "scenes": [
      "2008年銀行危機，人們急著換現金。",
      "連黃金也被賣出，金價一度下跌，投資人驚訝。",
      "央行推出政策工具，金價之後回升但仍上下波動；Ken 在一旁。",
      "Ken 提醒：避險資產也有價格與流動性風險。"
    ],
    "lines": [
      "投資人：先換成現金再說！",
      "投資人：黃金也跌了？",
      "Ken：危機中，黃金也可能先被賣。",
      "Ken：避險資產，也會波動！"
    ],
    "lesson": "危機期間黃金並非必然上漲；市場急需現金時，黃金也可能先被賣出。",
    "question": "市場急跌時，為什麼投資人可能出售黃金換取現金？",
    "source": [
      "goldPrice",
      "fcic"
    ],
    "editorialNote": "本篇介紹資產配置中的可能角色，不表示黃金在每次危機都避險成功或必然升值。"
  },
  {
    "title": "央行為什麼買黃金？",
    "age": "18歲＋",
    "concept": "央行儲備與黃金",
    "category": "黃金與總體經濟",
    "scenes": [
      "央行儲備金庫裡分成美元、其他外匯、債券、黃金幾格；Ken 講解。",
      "金條旁標示「沒有單一發行人」與「價格會波動」。",
      "央行代表在危機中評估流動性與分散。",
      "Ken 對一家人說明：央行和家庭的目標不同。"
    ],
    "lines": [
      "Ken：央行的儲備，不只放一種。",
      "Ken：黃金沒發行人，但價格會動。",
      "央行代表：要分散，也要用得上。",
      "Ken：央行在買，不等於你該買！"
    ],
    "lesson": "央行持有黃金可能出於儲備分散、歷史制度和風險管理等考量。央行購金不代表黃金沒有波動，也不構成個人投資建議。",
    "question": "央行的儲備目標和個人家庭的理財目標有什麼不同？",
    "source": [
      "imfReserves",
      "centralBankGold"
    ],
    "editorialNote": "央行配置不能直接類比個人資產配置；年度購金統計請以最新官方資料為準。"
  },
  {
    "title": "黃金到底能不能保值？",
    "age": "18歲＋",
    "concept": "購買力與黃金價格",
    "category": "黃金與總體經濟",
    "scenes": [
      "短期：物價折線往上，金價折線卻往下，投資人困惑。",
      "Ken 拉出一條很長的時間軸，說明要看持有多久。",
      "時間軸中間有長長的低谷，投資人等得很辛苦。",
      "Ken 提醒：保值不等於保證漲，買入價格很重要。"
    ],
    "lines": [
      "投資人：物價漲，金價卻跌？",
      "Ken：保值要看持有多久。",
      "投資人：中間好難熬……",
      "Ken：保值，不等於保證漲！"
    ],
    "lesson": "黃金是否保值取決於持有期間、買入價格、通膨、匯率和交易成本。歷史比較須使用一致幣別、起訖日期和通膨口徑，不能推導未來回報。",
    "question": "你說的保值是保本金、維持購買力，還是短期不下跌？",
    "source": [
      "goldPrice",
      "inflationCPI"
    ],
    "editorialNote": "歷史比較須使用一致的價格序列和基期；漫畫折線為示意。"
  },
  {
    "title": "黃金創新高了，現在還能買嗎？",
    "age": "18歲＋",
    "concept": "投資心理與風險管理",
    "category": "黃金與總體經濟",
    "scenes": [
      "新聞標題寫著「金價創新高」，人們興奮。",
      "Ken 指出：高點之後也可能回落的示意圖。",
      "投資人很怕錯過，內心掙扎。",
      "Ken 列出三個問題：目標是什麼？能放多久？跌兩成還受得了嗎？"
    ],
    "lines": [
      "投資人：創新高了，快追！",
      "Ken：高點之後，也可能回落。",
      "投資人：可是不買怕錯過……",
      "Ken：先問自己三件事！"
    ],
    "lesson": "是否買進應考慮目標、期限、集中度和承受損失能力，不能只看短期漲勢或新聞標題。",
    "question": "若買入後下跌20%，你會如何評估是否仍符合原先計畫？",
    "source": [
      "goldPrice"
    ],
    "editorialNote": "本篇刻意不放即時金價；發布時不需核對價格，但不可加入未核實數字。"
  },
  {
    "title": "黃金沒利息，央行為什麼還買？",
    "age": "18歲＋",
    "concept": "央行儲備與黃金",
    "category": "黃金與總體經濟",
    "scenes": [
      "存款和債券會配息，金條旁寫著「不配息」，投資人疑惑。",
      "央行的儲備櫃裡仍放著黃金；Ken 講解。",
      "黃金、美元、債券放在不同籃子裡，風險各不相同。",
      "Ken 提醒：調查意向不等於實際買入，個人目標也和央行不同。"
    ],
    "lines": [
      "投資人：黃金又沒利息？",
      "Ken：央行看的是儲備，不是利息。",
      "Ken：不同資產，風險不一樣。",
      "Ken：別把央行動作當買進訊號！"
    ],
    "lesson": "央行持有黃金可能出於儲備分散、歷史制度和風險管理等考量，但黃金沒有利息，且價格會波動。調查中的購金意向，不等於實際買入。",
    "question": "央行的儲備目標和個人家庭的理財目標有什麼不同？",
    "source": [
      "centralBankGold",
      "imfReserves"
    ],
    "editorialNote": "本篇不引用年度購金量或調查比例；如需加入，須先核對最新原始資料。"
  },
  {
    "title": "美元漲，黃金一定跌嗎？",
    "age": "18歲＋",
    "concept": "美元、利率與金價",
    "category": "黃金與總體經濟",
    "scenes": [
      "蹺蹺板一端是美元往上，一端是黃金往下，投資人以為是固定規律。",
      "Ken 解釋：黃金用美元計價，美元強時其他貨幣買金變貴。",
      "畫面中也出現美元和黃金一起往上的時候。",
      "Ken 指出利率、風險偏好、央行需求等其他力量。"
    ],
    "lines": [
      "投資人：美元漲，黃金就跌？",
      "Ken：黃金用美元計價，常常反向。",
      "Ken：但這不是鐵律。",
      "Ken：別只用一個指標猜價格！"
    ],
    "lesson": "美元和黃金的關係會隨利率、實質利率、風險偏好和市場流動性改變；歷史相關性不能當作固定交易公式。",
    "question": "除了美元指數，你還會觀察哪些因素來理解金價？",
    "source": [
      "goldDollar"
    ],
    "editorialNote": "漫畫為概念示意，不引用特定交易日的匯率或金價。"
  }
]
```

---

## 5. 完成後的檢查（全部通過才開 PR）

```powershell
cd $HOME\Desktop\AK-sync\site
npm run typecheck
npm run build
```

- `out/money/` 裡要有 `ken-01` 到 `ken-35` 共 35 個資料夾。
- 本機預覽 `npm run dev`，打開 `/money/`：上方有三個主題按鈕，三個主題區各自顯示漫畫，圖片都能載入。
- 打開 `/money/ken-13/`：標題行顯示「18歲＋ · 金融詐騙與平台風險」，「四格漫畫」區塊有圖，「逐格閱讀」有 4 格文字，資料來源連結可點。
- 首頁「Ken 季秉澤 · 財商教室」顯示 **35 篇漫畫**。
- `git status` 確認沒有 `out/`、`.next/`、`.env`。

```powershell
cd $HOME\Desktop\AK-sync
git add site/public/media/ken site/lib/ken-episodes.json
git commit -m "feat(ken): 第 13～35 篇改繪為 Ken IP 四格漫畫"
git push -u origin feat/ken-comics-13-35
```

推上去後，在 GitHub 開 PR：`feat/ken-comics-13-35` → `main`，交給網站擁有者確認。**合併前不要部署。**

---

## 6. 任務 B：接續 PR #9「追加 Alice 與 Ken 漫畫校稿預覽」

- PR：https://github.com/AKWealthGlobal/AKWealthGlobal/pull/9（草稿）
- 分支：`codex/added-comics-publication-prep`
- 內容：11 篇六格漫畫、66 格。
  - Alice AI 學院 1 篇：`civics-find-ai`。
  - Alice 樂齡學堂 7 篇：`oasis-*`。
  - Ken 財商教室 3 篇：`ken-ka01-pig-umbrella`、`ken-ka02-basket-eggs`、`ken-kb09-class-ball`。
- 相關檔案：
  - 資料：`site/lib/added-comics.json`
  - 圖片：`site/public/media/comics/added/*.webp`
  - 頁面：`site/app/comics/`、`site/components/added-comics.tsx`、`site/app/added-comics.css`
  - 腳本：`site/scripts/render-added-comics.py`
  - 校稿紀錄：`site/docs/added-comics-publication-review.md`

### B-1. 先把 PR #9 更新到最新 main（目前有衝突）

PR #9 是用**舊的** main 做的。現在 main 已換成線上版，以下 4 個檔案會衝突：
- `site/app/ai/page.tsx`
- `site/app/layout.tsx`
- `site/app/money/page.tsx`
- `site/app/sitemap.ts`

```powershell
cd $HOME\Desktop\AK-sync
git fetch origin
git checkout -B codex/added-comics-publication-prep origin/codex/added-comics-publication-prep
git merge origin/main
```

解衝突原則：**一律以 main（線上版）的內容為底**，只把 PR #9 新增的那一小段補回去，不要把舊版頁面帶回來。
- `site/app/layout.tsx`：保留 main 的版本，只加回一行 `import './added-comics.css';`。`NEXT_PUBLIC_SITE_URL` 的寫法照 main，不要改。
- `site/app/money/page.tsx`：保留 main 的版本（目前只是載入 `KenClassroom` 元件）。若要放「追加漫畫」入口，請加在 `site/components/ken-classroom.tsx` 的主題區下方，用 `AddedComicLink`，不要換回舊的 `comics` 版面。
- `site/app/ai/page.tsx`：保留 main 的版本，只在合適位置加回 `import {AddedComicLink} from '@/components/added-comics';` 和對應的入口連結。
- `site/app/sitemap.ts`：保留 main 的版本（已含 `prompts`、`kenComics`、`kids/city` 等），只加回 `import addedComics from '@/lib/added-comics.json';`，以及 `'comics'` 和每篇 `comics/<slug>` 的網址。

完成後執行 `npm run typecheck`、`npm run build`，兩個都要通過。

> 這個分支是別人（Codex 之前）建立的，請用 **merge**，不要 rebase、不要 force-push。

### B-2. 完成校稿紀錄裡「尚待人工處理」的項目

1. **補畫對話框**：O11 第 1、4、5、6 格與 O02 第 4 格沒有留白對話框。
   - 請用同一畫風重畫這幾格，留出對話框，再用 `scripts/render-added-comics.py` 排字。
   - 如果重畫後畫風對不上，改成「圖下對白」呈現，並在校稿紀錄寫明原因。
2. **多角色對白**：有兩位以上角色說話的格子，把所有台詞都排進對應的對話框，並確認氣泡尾巴指向正確的說話者。
3. **Ken 肖像統一**：3 篇 Ken 漫畫（`ken-ka01`、`ken-ka02`、`ken-kb09`）裡的 Ken，改成和 `site/public/media/characters/ken-ip.webp` 一致：
   - Q 版、短刺黑髮、細長方形深色鏡框眼鏡、黑色 Polo 衫。
   - 畫風比照第 2 節（水彩 Q 版、暖色調）。
   - 重畫後更新 `site/public/media/comics/added/ken-*.webp`。
4. 更新 `site/docs/added-comics-publication-review.md`，把已完成的項目移到「已核對項目」。

### B-3. 檢查與提交

- `npm run typecheck`、`npm run build` 都要通過。
- 本機打開 `/comics/` 和每一篇詳情頁，確認圖片、對話框文字和逐格文字稿一致。
- 用手機寬度 390px 和 320px 檢查，畫面不能左右捲動。

```powershell
git add -A site
git commit -m "fix(comics): 合併最新 main，補齊追加漫畫對白與 Ken 肖像"
git push origin codex/added-comics-publication-prep
```

- PR #9 維持**草稿**狀態，交給網站擁有者校稿。**未經確認不要合併、不要部署。**
