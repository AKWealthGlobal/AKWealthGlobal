# 任務 B（新版）：重做 PR #9 的漫畫——Alice 依 IP 重畫、Ken 延續財商教室畫風

> 整份貼給 Codex。**取代**舊任務文件第 6 節「任務 B」的做法。舊做法（修補 PR #9 的六格裁切與疊字）**不要再做**。

## 0. 最新狀態（開工前必讀）

| 項目 | 狀態 |
|---|---|
| GitHub `main` | ✅ 唯一最新版，已含 Ken 第 1～35 篇（PR #11 已合併並上線）。 |
| 本機 `Desktop\AK-sync` | 目前在舊的 `feat/ken-comics-13-35`，**開工前必須切回 main 並更新**（指令見下）。 |
| PR #9（`codex/added-comics-publication-prep`） | **不要在上面開發**。只從它取得原始腳本：`site/lib/added-comics.json`。本任務完成合併後，網站擁有者會關閉 PR #9。 |
| 其他分支（`drafts/*`、`sync/*`、`claude/*`、`ccr-*`） | 不要使用。 |

開工指令（請網站擁有者在**自己的 PowerShell** 執行，Codex 的沙盒連不上 GitHub）：

```powershell
cd $HOME\Desktop\AK-sync
git fetch origin
git checkout main
git pull origin main
git checkout -b feat/pr9-redo-alice-ken
cd site
npm.cmd ci
```

規則：
- 只在 `feat/pr9-redo-alice-ken` 上改，不要推 main，不要部署。
- 這台電腦的 PowerShell 請用 `npm.cmd`，不要用 `npm`。
- 不需要網路的指令照常執行；`git push` 由網站擁有者自己執行。

## 1. 做什麼

| 項目 | 數量 | 格式 | 放在哪裡 |
|---|---|---|---|
| **Ken** | 3 篇（PR #9 的 KA01、KA02、KB09） | **四格、2:3（1024×1536 PNG）**，畫風和 Ken 第 1～35 篇一致 | Ken 財商教室**第 36～38 篇** |
| **Alice** | 8 篇（PR #9 的 Q1、O01～O05、O11、O12） | **六格、2:3（1024×1536 JPG）**，Alice 必須是 Alice IP 本人 | Alice AI學院**第 106～113 個主題** |

- 原本 PR #9 裡的 Ken 角色「像但畫風不同」（扁平粗線條），**全部重畫**成水彩 Q 版。
- 原本 PR #9 裡的「Alice」**完全不像 Alice**（短髮、綠色開襟衫），**全部重畫**。
- **所有對白直接畫進圖裡**。不再使用 PR #9 的六張裁切小圖、`/comics/` 頁面和 `render-added-comics.py` 疊字流程。

## 2. 要改的檔案

| 檔案 | 動作 |
|---|---|
| `site/public/media/ken/comic-36.png`、`comic-37.png`、`comic-38.png` | 新增 3 張 Ken 四格（1024×1536 PNG） |
| `site/lib/ken-episodes.json` | 在第 35 筆後**依序**追加第 4 節的 3 筆（不要加 `imageFile`、不要加 `category`） |
| `site/lib/ken-sources.json` | 追加第 4 節的 2 個來源 `emergencyFund`、`insuranceBasics` |
| `site/scripts/qa-ken.cjs` | 把 35 改成 38（兩處），成功訊息改成「38 comics, 152 dialogues」 |
| `site/public/media/alice/alice-<slug>.jpg` | 新增 8 張 Alice 六格（1024×1536 JPG），`<slug>` 見第 3 節 |
| `site/lib/alice-lessons.json` | 在最後追加第 5 節的 8 筆 |
| `site/lib/alice-topics.json` | 在最後追加第 5 節的 8 筆 |

其他程式不用改：Ken 頁面會自動多出第 36～38 篇（36、37 在「5–8歲」區，38 在「9–12歲」區）；Alice 學院頁與首頁的主題數會自動從 105 變 113；`/learn/<slug>/` 詳情頁與 sitemap 會自動產生。

## 3. 參考圖（每張都要一起給生圖模型）

- Ken：`site/public/media/characters/ken-ip.webp`＋畫風範本 `site/public/media/ken/comic-01.png`、`comic-04.png`、`comic-13.png`
- Alice：`site/public/media/characters/alice-ip.webp`＋畫風範本 `site/public/media/alice/alice-ai-and-my-job.jpg`、`alice-senior-voice-input.jpg`
- 小光（AI 小幫手）：`site/public/media/characters/ai-buddy.webp`

每張完成後檢查：
1. 角色長相和參考圖一致：Alice 長直髮、深藍西裝外套；Ken 刺短髮、方框眼鏡、黑 Polo。
2. 繁體字沒有錯字或亂碼，對白和下面腳本**一字不差**。
3. 畫面中沒有額外文字、真實品牌 Logo 或浮水印。

不合格就重畫。**每完成 3～4 張先給網站擁有者看**，確認畫風後再繼續。

---

## 4. Ken 第 36～38 篇（四格）

### 第 36 篇：小豬的雨傘（5–8歲・緊急預備金）

- 檔案：`site/public/media/ken/comic-36.png`　網址：`/money/ken-36/`　原 PR #9：`ken-ka01-pig-umbrella`

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 晴天的操場，小豬背包上掛著收好的黃色雨傘，小狗好奇地指著。 | 小狗：大太陽，你怎麼帶傘？ |
| 2 | 放學前烏雲密布、下起大雨；小豬撐開黃傘，讓沒帶傘的小兔和小狗一起躲雨。 | 小豬：一起撐，走到屋簷下！ |
| 3 | Ken 指著三個存錢罐：「生活」「想要」「預備金」（預備金罐有盾牌圖示）。 | Ken：預備金像雨傘，突發狀況時用。 |
| 4 | 一家人和小豬一起把硬幣放進預備金罐，旁邊放著小黃傘。 | Ken：從小目標開始，慢慢存！ |

<details><summary>生圖提示詞</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and layout as the reference Ken comics (site/public/media/ken/comic-01.png, comic-04.png and comic-13.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm light, cream paper background, big decorative bold Traditional Chinese title banner at the top, 2x2 panels with rounded dark-brown borders, large white speech bubbles (speaker name, full-width colon, line), and a bottom plaque with an open-book icon reading 「Ken財商教室」. Portrait 2:3, final size 1024x1536.
Ken must match site/public/media/characters/ken-ip.webp drawn as the same chibi Ken used in comics 1–35: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly smile. Identical in every panel.
Children-friendly, cute animal characters drawn in the same watercolor chibi style as comic-01 to comic-04 (NOT flat thick-outline cartoon). No real logos, nothing scary, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Setting: a sunny kindergarten playground, then a rainy afternoon; cute animal kids (piglet, puppy, bunny).
Title banner text (exact): 「小豬的雨傘」.

Panel 1 (top-left): 晴天的操場，小豬背包上掛著收好的黃色雨傘，小狗好奇地指著。 Speech bubble (exact): 「小狗：大太陽，你怎麼帶傘？」
Panel 2 (top-right): 放學前烏雲密布、下起大雨；小豬撐開黃傘，讓沒帶傘的小兔和小狗一起躲雨。 Speech bubble (exact): 「小豬：一起撐，走到屋簷下！」
Panel 3 (bottom-left): Ken 指著三個存錢罐：「生活」「想要」「預備金」（預備金罐有盾牌圖示）。 Speech bubble (exact): 「Ken：預備金像雨傘，突發狀況時用。」
Panel 4 (bottom-right): 一家人和小豬一起把硬幣放進預備金罐，旁邊放著小黃傘。 Speech bubble (exact): 「Ken：從小目標開始，慢慢存！」
```
</details>

### 第 37 篇：雞蛋別放同一個籃子（5–8歲・分散與風險）

- 檔案：`site/public/media/ken/comic-37.png`　網址：`/money/ken-37/`　原 PR #9：`ken-ka02-basket-eggs`

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 小雞把所有雞蛋放進同一個籃子，開心地提起來。 | 小雞：全部放一起，最方便！ |
| 2 | 小雞絆到小石頭，籃子翻倒，好幾顆蛋破了（畫面可愛、不嚇人）。 | 小雞：哎呀！蛋都破了！ |
| 3 | 小鴨把雞蛋分到三個籃子；其中一籃翻倒，另外兩籃穩穩放在桌上。 | 小鴨：分開放，只影響一籃。 |
| 4 | Ken 指著三個籃子，小雞和小鴨小心地分提籃子。 | Ken：分開放，也要小心保管！ |

<details><summary>生圖提示詞</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and layout as the reference Ken comics (site/public/media/ken/comic-01.png, comic-04.png and comic-13.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm light, cream paper background, big decorative bold Traditional Chinese title banner at the top, 2x2 panels with rounded dark-brown borders, large white speech bubbles (speaker name, full-width colon, line), and a bottom plaque with an open-book icon reading 「Ken財商教室」. Portrait 2:3, final size 1024x1536.
Ken must match site/public/media/characters/ken-ip.webp drawn as the same chibi Ken used in comics 1–35: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly smile. Identical in every panel.
Children-friendly, cute animal characters drawn in the same watercolor chibi style as comic-01 to comic-04 (NOT flat thick-outline cartoon). No real logos, nothing scary, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Setting: a warm farm kitchen and yard; cute animal kids (chick, duckling, piglet); nothing scary.
Title banner text (exact): 「雞蛋別放同一個籃子」.

Panel 1 (top-left): 小雞把所有雞蛋放進同一個籃子，開心地提起來。 Speech bubble (exact): 「小雞：全部放一起，最方便！」
Panel 2 (top-right): 小雞絆到小石頭，籃子翻倒，好幾顆蛋破了（畫面可愛、不嚇人）。 Speech bubble (exact): 「小雞：哎呀！蛋都破了！」
Panel 3 (bottom-left): 小鴨把雞蛋分到三個籃子；其中一籃翻倒，另外兩籃穩穩放在桌上。 Speech bubble (exact): 「小鴨：分開放，只影響一籃。」
Panel 4 (bottom-right): Ken 指著三個籃子，小雞和小鴨小心地分提籃子。 Speech bubble (exact): 「Ken：分開放，也要小心保管！」
```
</details>

### 第 38 篇：全班合買一顆球（9–12歲・分擔風險與保險條款）

- 檔案：`site/public/media/ken/comic-38.png`　網址：`/money/ken-38/`　原 PR #9：`ken-kb09-class-ball`

| 格 | 畫面 | 對話框（一字不差） |
|---|---|---|
| 1 | 動物同學在操場傳球，球撞到圍欄後漏氣，大家都沒有受傷。 | 小狗：球壞了，不能玩了！ |
| 2 | Ken 和同學圍著「班級共用罐」，每人自願放一點錢，旁邊有寫好的規則卡。 | Ken：先說好規則，再一起出一點。 |
| 3 | 用班費罐裡的錢買回一顆新球，大家開心歡呼。 | 兔子：靠大家的班費，買回新球！ |
| 4 | Ken 用三張圖卡說明「保費」「保障範圍」「不保的情況」，同學認真聽。 | Ken：真的保險，要先看契約寫什麼。 |

<details><summary>生圖提示詞</summary>

```text
Create a NEW four-panel educational comic page in EXACTLY the same art style and layout as the reference Ken comics (site/public/media/ken/comic-01.png, comic-04.png and comic-13.png): warm hand-painted watercolor-and-ink chibi (Q-version) comic, soft warm light, cream paper background, big decorative bold Traditional Chinese title banner at the top, 2x2 panels with rounded dark-brown borders, large white speech bubbles (speaker name, full-width colon, line), and a bottom plaque with an open-book icon reading 「Ken財商教室」. Portrait 2:3, final size 1024x1536.
Ken must match site/public/media/characters/ken-ip.webp drawn as the same chibi Ken used in comics 1–35: short spiky black hair, thin rectangular dark-framed glasses, black polo shirt, friendly smile. Identical in every panel.
Children-friendly, cute animal characters drawn in the same watercolor chibi style as comic-01 to comic-04 (NOT flat thick-outline cartoon). No real logos, nothing scary, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Setting: a primary-school playground and classroom; cute animal classmates (bunny, puppy, elephant, piglet); nobody gets hurt.
Title banner text (exact): 「全班合買一顆球」.

Panel 1 (top-left): 動物同學在操場傳球，球撞到圍欄後漏氣，大家都沒有受傷。 Speech bubble (exact): 「小狗：球壞了，不能玩了！」
Panel 2 (top-right): Ken 和同學圍著「班級共用罐」，每人自願放一點錢，旁邊有寫好的規則卡。 Speech bubble (exact): 「Ken：先說好規則，再一起出一點。」
Panel 3 (bottom-left): 用班費罐裡的錢買回一顆新球，大家開心歡呼。 Speech bubble (exact): 「兔子：靠大家的班費，買回新球！」
Panel 4 (bottom-right): Ken 用三張圖卡說明「保費」「保障範圍」「不保的情況」，同學認真聽。 Speech bubble (exact): 「Ken：真的保險，要先看契約寫什麼。」
```
</details>

#### 追加到 `ken-episodes.json`（接在第 35 筆後）與 `ken-sources.json`

```json
{
  "episodes": [
    {
      "title": "小豬的雨傘",
      "age": "5–8歲",
      "concept": "緊急預備金",
      "scenes": [
        "晴天的操場，小豬背包上掛著收好的黃色雨傘，小狗好奇地指著。",
        "放學前烏雲密布、下起大雨；小豬撐開黃傘，讓沒帶傘的小兔和小狗一起躲雨。",
        "Ken 指著三個存錢罐：「生活」「想要」「預備金」（預備金罐有盾牌圖示）。",
        "一家人和小豬一起把硬幣放進預備金罐，旁邊放著小黃傘。"
      ],
      "lines": [
        "小狗：大太陽，你怎麼帶傘？",
        "小豬：一起撐，走到屋簷下！",
        "Ken：預備金像雨傘，突發狀況時用。",
        "Ken：從小目標開始，慢慢存！"
      ],
      "lesson": "緊急預備金是為突發開支預留的錢，不是投資產品，也不代表要存到某個固定金額；目標可依家庭收支慢慢調整。本篇是一般財商教育，不構成個人化理財建議。",
      "question": "家裡可能遇到哪些突發狀況，需要先準備一點錢？",
      "source": [
        "emergencyFund"
      ]
    },
    {
      "title": "雞蛋別放同一個籃子",
      "age": "5–8歲",
      "concept": "分散與風險",
      "scenes": [
        "小雞把所有雞蛋放進同一個籃子，開心地提起來。",
        "小雞絆到小石頭，籃子翻倒，好幾顆蛋破了（畫面可愛、不嚇人）。",
        "小鴨把雞蛋分到三個籃子；其中一籃翻倒，另外兩籃穩穩放在桌上。",
        "Ken 指著三個籃子，小雞和小鴨小心地分提籃子。"
      ],
      "lines": [
        "小雞：全部放一起，最方便！",
        "小雞：哎呀！蛋都破了！",
        "小鴨：分開放，只影響一籃。",
        "Ken：分開放，也要小心保管！"
      ],
      "lesson": "把東西分開安排，有時能減少一次意外造成的影響，但不能保證完全不會損失。本篇用生活物品說明概念，沒有談任何金融商品或個人化投資配置。",
      "question": "你有哪些重要的東西，適合分開放或分開安排？",
      "source": [
        "allocation"
      ]
    },
    {
      "title": "全班合買一顆球",
      "age": "9–12歲",
      "concept": "分擔風險與保險條款",
      "scenes": [
        "動物同學在操場傳球，球撞到圍欄後漏氣，大家都沒有受傷。",
        "Ken 和同學圍著「班級共用罐」，每人自願放一點錢，旁邊有寫好的規則卡。",
        "用班費罐裡的錢買回一顆新球，大家開心歡呼。",
        "Ken 用三張圖卡說明「保費」「保障範圍」「不保的情況」，同學認真聽。"
      ],
      "lines": [
        "小狗：球壞了，不能玩了！",
        "Ken：先說好規則，再一起出一點。",
        "兔子：靠大家的班費，買回新球！",
        "Ken：真的保險，要先看契約寫什麼。"
      ],
      "lesson": "保險透過保費與契約約定，在符合條件時分擔特定風險；是否理賠取決於契約內容與實際情況。班費罐只是幫助理解「分攤風險」的比喻，不等同保險契約。",
      "question": "如果要和朋友一起準備共用的錢，你們會先約定哪些規則？",
      "source": [
        "insuranceBasics"
      ]
    }
  ],
  "sources": {
    "emergencyFund": {
      "name": "美國消費者金融保護局：建立緊急預備金指南",
      "url": "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/"
    },
    "insuranceBasics": {
      "name": "美國密蘇里州保險局：如何讀懂保單（保障與除外條款）",
      "url": "https://insurance.mo.gov/understanding-your-automobile-insurance-policy"
    }
  }
}
```

---

## 5. Alice 第 106～113 個主題（六格）

對白沿用 PR #9 已校稿的腳本（來自三份追加漫畫 Markdown），**不要改字**。只有 Alice 和小光的造型要依參考圖重畫。

### 第 106 個主題：家裡藏了幾個 AI？（N32・9–12 歲｜AI 公民課）

- 檔案：`site/public/media/alice/alice-civics-find-ai.jpg`　網址：`/learn/civics-find-ai/`

| 格 | 畫面 | 對白／旁白（一字不差） |
|---|---|---|
| 1 任務出現 | 客廳，孩子看著探索任務卡 | 小凱：家裡哪來的 AI？我連機器人都沒看到！<br>Alice：AI 不一定長得像機器人，我們來找找看。 |
| 2 開始觀察 | Alice 把放大鏡交給小凱 | Alice：先看看家裡的電器和手機，哪些會自己辨認或推薦？<br>小凱：那台掃地機器人算嗎？它會躲開拖鞋耶！ |
| 3 找到例子 | 掃地機器人、手機辨識、影片推薦 | Alice：很好！手機的人臉辨識、影片推薦，也可能用到 AI。<br>小凱：所以它們會根據看到的資料，做出判斷？ |
| 4 分辨規則 | 固定步驟計算機與學習模型圖示 | 小凱：那計算機也會算答案，它也是 AI 嗎？<br>Alice：一般計算機多半照固定公式計算；AI 則會從資料中找規律，再依任務作判斷。 |
| 5 練習判斷 | 孩子回想家中設備 | 小凱：原來不能只看它會不會動，要看它怎麼完成任務！<br>Alice：對，也要問：它用了什麼資料？判斷可能有錯嗎？ |
| 6 任務收尾 | 全家貼上發現徽章 | 小凱：我找到五個可能用到 AI 的地方了！<br>Alice：記得先查清楚功能，也別隨便把家人的照片或資料交給陌生工具。 |

<details><summary>生圖提示詞</summary>

```text
Create a NEW six-panel educational comic page in EXACTLY the same art style and layout as the existing Alice comics (site/public/media/alice/alice-ai-and-my-job.jpg and alice-senior-voice-input.jpg): soft, warm, clean hand-drawn anime chibi style, bright natural light, 2 columns x 3 rows of panels with rounded borders and small numbered circles ①–⑥ in the top-left corner of each panel, white rounded speech bubbles, Traditional Chinese text. Portrait 2:3, final size 1024x1536.
ALICE must match site/public/media/characters/alice-ip.webp exactly, drawn as the same chibi Alice used in the existing Alice comics: long straight dark-brown hair past the shoulders, gentle smile, navy-blue blazer over a white top, small stud earrings; often holding a pen or a notebook. Keep Alice identical in every panel she appears in. Do NOT draw Alice with short hair, a bob, or a green/teal cardigan.
小光 is the AI helper robot from site/public/media/characters/ai-buddy.webp (white-and-navy round robot with a glowing blue face screen); draw it small, appearing on a phone/tablet screen or floating beside the user.
Narration lines (旁白) go in a rectangular caption box, not a speech bubble. No real logos or real people, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Story title (for context only, do not draw as a banner): 家裡藏了幾個 AI？

Panel ① — 客廳，孩子看著探索任務卡. Text (exact, one bubble/caption per line): 「小凱：家裡哪來的 AI？我連機器人都沒看到！」 / 「Alice：AI 不一定長得像機器人，我們來找找看。」
Panel ② — Alice 把放大鏡交給小凱. Text (exact, one bubble/caption per line): 「Alice：先看看家裡的電器和手機，哪些會自己辨認或推薦？」 / 「小凱：那台掃地機器人算嗎？它會躲開拖鞋耶！」
Panel ③ — 掃地機器人、手機辨識、影片推薦. Text (exact, one bubble/caption per line): 「Alice：很好！手機的人臉辨識、影片推薦，也可能用到 AI。」 / 「小凱：所以它們會根據看到的資料，做出判斷？」
Panel ④ — 固定步驟計算機與學習模型圖示. Text (exact, one bubble/caption per line): 「小凱：那計算機也會算答案，它也是 AI 嗎？」 / 「Alice：一般計算機多半照固定公式計算；AI 則會從資料中找規律，再依任務作判斷。」
Panel ⑤ — 孩子回想家中設備. Text (exact, one bubble/caption per line): 「小凱：原來不能只看它會不會動，要看它怎麼完成任務！」 / 「Alice：對，也要問：它用了什麼資料？判斷可能有錯嗎？」
Panel ⑥ — 全家貼上發現徽章. Text (exact, one bubble/caption per line): 「小凱：我找到五個可能用到 AI 的地方了！」 / 「Alice：記得先查清楚功能，也別隨便把家人的照片或資料交給陌生工具。」
```
</details>

### 第 107 個主題：五十年前沒拍的婚紗照（E8・中老年人｜樂齡學堂）

- 檔案：`site/public/media/alice/alice-oasis-golden-wedding-photo.jpg`　網址：`/learn/oasis-golden-wedding-photo/`

| 格 | 畫面 | 對白／旁白（一字不差） |
|---|---|---|
| 1 相簿裡的空位 | 奶奶翻看舊相簿 | 奶奶：那時候忙著過日子，結婚時沒有拍婚紗照。<br>旁白：一張沒留下的照片，藏著奶奶好多年的心願。 |
| 2 先聽她的想法 | 孫子和 Alice 陪奶奶聊天 | 孫子：奶奶，如果妳願意，我們可以一起做一張紀念照。<br>Alice：由奶奶決定要不要做、想怎麼呈現，才是第一步。 |
| 3 一起挑參考 | 家人共同挑選照片與服裝背景 | 奶奶：我想穿紅色，也想保留我們現在的樣子。<br>Alice：好，我們只用妳同意的照片和描述，先看草稿再決定。 |
| 4 保護照片 | 平板顯示鎖、同意、刪除圖示 | Alice：先看工具如何保存和使用照片；不清楚就不要上傳。<br>孫子：做完後，我們也確認怎麼刪除照片和生成檔。 |
| 5 完成紀念照 | 奶奶與爺爺一起看成品 | 奶奶：這張照片沒有改掉我們的故事，還留下了今天的笑容。<br>爺爺：最重要的是，這是我們一起同意留下的紀念。 |
| 6 分享前再確認 | 社區活動中展示相片 | 奶奶：我想和朋友分享這張照片，也先問問大家願不願意入鏡。<br>Alice：分享前再確認本人同意，也別公開不必要的個人資料。 |

<details><summary>生圖提示詞</summary>

```text
Create a NEW six-panel educational comic page in EXACTLY the same art style and layout as the existing Alice comics (site/public/media/alice/alice-ai-and-my-job.jpg and alice-senior-voice-input.jpg): soft, warm, clean hand-drawn anime chibi style, bright natural light, 2 columns x 3 rows of panels with rounded borders and small numbered circles ①–⑥ in the top-left corner of each panel, white rounded speech bubbles, Traditional Chinese text. Portrait 2:3, final size 1024x1536.
ALICE must match site/public/media/characters/alice-ip.webp exactly, drawn as the same chibi Alice used in the existing Alice comics: long straight dark-brown hair past the shoulders, gentle smile, navy-blue blazer over a white top, small stud earrings; often holding a pen or a notebook. Keep Alice identical in every panel she appears in. Do NOT draw Alice with short hair, a bob, or a green/teal cardigan.
小光 is the AI helper robot from site/public/media/characters/ai-buddy.webp (white-and-navy round robot with a glowing blue face screen); draw it small, appearing on a phone/tablet screen or floating beside the user.
Narration lines (旁白) go in a rectangular caption box, not a speech bubble. No real logos or real people, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Story title (for context only, do not draw as a banner): 五十年前沒拍的婚紗照

Panel ① — 奶奶翻看舊相簿. Text (exact, one bubble/caption per line): 「奶奶：那時候忙著過日子，結婚時沒有拍婚紗照。」 / 「旁白：一張沒留下的照片，藏著奶奶好多年的心願。」
Panel ② — 孫子和 Alice 陪奶奶聊天. Text (exact, one bubble/caption per line): 「孫子：奶奶，如果妳願意，我們可以一起做一張紀念照。」 / 「Alice：由奶奶決定要不要做、想怎麼呈現，才是第一步。」
Panel ③ — 家人共同挑選照片與服裝背景. Text (exact, one bubble/caption per line): 「奶奶：我想穿紅色，也想保留我們現在的樣子。」 / 「Alice：好，我們只用妳同意的照片和描述，先看草稿再決定。」
Panel ④ — 平板顯示鎖、同意、刪除圖示. Text (exact, one bubble/caption per line): 「Alice：先看工具如何保存和使用照片；不清楚就不要上傳。」 / 「孫子：做完後，我們也確認怎麼刪除照片和生成檔。」
Panel ⑤ — 奶奶與爺爺一起看成品. Text (exact, one bubble/caption per line): 「奶奶：這張照片沒有改掉我們的故事，還留下了今天的笑容。」 / 「爺爺：最重要的是，這是我們一起同意留下的紀念。」
Panel ⑥ — 社區活動中展示相片. Text (exact, one bubble/caption per line): 「奶奶：我想和朋友分享這張照片，也先問問大家願不願意入鏡。」 / 「Alice：分享前再確認本人同意，也別公開不必要的個人資料。」
```
</details>

### 第 108 個主題：寫一封信給老伴（E9・中老年人｜樂齡學堂）

- 檔案：`site/public/media/alice/alice-oasis-letter-to-late-spouse.jpg`　網址：`/learn/oasis-letter-to-late-spouse/`

| 格 | 畫面 | 對白／旁白（一字不差） |
|---|---|---|
| 1 有些話還沒說完 | 陳奶奶坐在老伴照片前，桌上兩杯茶 | 陳奶奶：老伴走了一年，還有好多話沒說。 |
| 2 看到一則廣告 | 女兒拿手機給 Alice 看 | 女兒：網路上說可以讓爸爸的照片動起來、跟媽媽說話……妳覺得呢？ |
| 3 分清楚真實與生成 | Alice 溫柔地搖頭 | Alice：AI 生成的話不是爸爸真正說的，可能讓人更難放下。 |
| 4 用自己的聲音說出來 | 陳奶奶對手機慢慢說 | Alice：我們可以把妳想說的話整理成一封信。<br>陳奶奶：謝謝你，陪我走了五十年…… |
| 5 保留原意 | 小光顯示整理後的信，女兒在旁陪伴 | 小光：我只整理順序，沒有改您的意思。<br>陳奶奶：這些都是我想說的話。 |
| 6 有人陪在身邊 | 清明節，陳奶奶和女兒在墓前唸信 | 陳奶奶：說出來，心裡就輕一點了。<br>旁白：若悲傷難以承受，可以找信任的人陪伴，或尋求專業協助。 |

<details><summary>生圖提示詞</summary>

```text
Create a NEW six-panel educational comic page in EXACTLY the same art style and layout as the existing Alice comics (site/public/media/alice/alice-ai-and-my-job.jpg and alice-senior-voice-input.jpg): soft, warm, clean hand-drawn anime chibi style, bright natural light, 2 columns x 3 rows of panels with rounded borders and small numbered circles ①–⑥ in the top-left corner of each panel, white rounded speech bubbles, Traditional Chinese text. Portrait 2:3, final size 1024x1536.
ALICE must match site/public/media/characters/alice-ip.webp exactly, drawn as the same chibi Alice used in the existing Alice comics: long straight dark-brown hair past the shoulders, gentle smile, navy-blue blazer over a white top, small stud earrings; often holding a pen or a notebook. Keep Alice identical in every panel she appears in. Do NOT draw Alice with short hair, a bob, or a green/teal cardigan.
小光 is the AI helper robot from site/public/media/characters/ai-buddy.webp (white-and-navy round robot with a glowing blue face screen); draw it small, appearing on a phone/tablet screen or floating beside the user.
Narration lines (旁白) go in a rectangular caption box, not a speech bubble. No real logos or real people, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Story title (for context only, do not draw as a banner): 寫一封信給老伴

Panel ① — 陳奶奶坐在老伴照片前，桌上兩杯茶. Text (exact, one bubble/caption per line): 「陳奶奶：老伴走了一年，還有好多話沒說。」
Panel ② — 女兒拿手機給 Alice 看. Text (exact, one bubble/caption per line): 「女兒：網路上說可以讓爸爸的照片動起來、跟媽媽說話……妳覺得呢？」
Panel ③ — Alice 溫柔地搖頭. Text (exact, one bubble/caption per line): 「Alice：AI 生成的話不是爸爸真正說的，可能讓人更難放下。」
Panel ④ — 陳奶奶對手機慢慢說. Text (exact, one bubble/caption per line): 「Alice：我們可以把妳想說的話整理成一封信。」 / 「陳奶奶：謝謝你，陪我走了五十年……」
Panel ⑤ — 小光顯示整理後的信，女兒在旁陪伴. Text (exact, one bubble/caption per line): 「小光：我只整理順序，沒有改您的意思。」 / 「陳奶奶：這些都是我想說的話。」
Panel ⑥ — 清明節，陳奶奶和女兒在墓前唸信. Text (exact, one bubble/caption per line): 「陳奶奶：說出來，心裡就輕一點了。」 / 「旁白：若悲傷難以承受，可以找信任的人陪伴，或尋求專業協助。」
```
</details>

### 第 109 個主題：網路上的溫柔醫生（E10・中老年人｜樂齡學堂）

- 檔案：`site/public/media/alice/alice-oasis-romance-scam.jpg`　網址：`/learn/oasis-romance-scam/`

| 格 | 畫面 | 對白／旁白（一字不差） |
|---|---|---|
| 1 陌生人來訊 | 陳奶奶收到一位自稱海外醫生的交友訊息 | 假醫生：您好，我在國外當醫生，看到您的照片覺得很親切。 |
| 2 每天噓寒問暖 | 幾週後，陳奶奶和對方聊天 | 陳奶奶：好久沒人這樣關心我了。<br>旁白：網路上的關心可能是真誠的，也可能是騙局的開場。 |
| 3 突然要匯款 | 對方說禮物卡在海關 | 假醫生：禮物卡在海關，請先匯一筆錢付關稅。<br>陳奶奶：我們從沒見過面，為什麼要我先匯錢？ |
| 4 先核實，不急著下結論 | 女兒和 Alice 陪奶奶看訊息與照片 | Alice：照片有些地方看起來不自然，但光看照片不能確定真假。<br>Alice：真正要注意的是：對方要錢、催你保密，或不讓你核實身分。 |
| 5 保護自己、尋求協助 | 女兒抱著奶奶，一起打反詐諮詢電話 | 女兒：媽，不是妳的錯。我們先不要匯款，一起問專業人員。<br>陳奶奶：好，我先把訊息留著，請你陪我處理。 |
| 6 回到真實的人群 | 陳奶奶和社區朋友跳舞 | Alice：沒見過面就要你匯款、買點數或付費，先停下來找家人商量。<br>旁白：在台灣可撥 165 反詐騙諮詢專線；發布前核對官方最新服務方式。 |

<details><summary>生圖提示詞</summary>

```text
Create a NEW six-panel educational comic page in EXACTLY the same art style and layout as the existing Alice comics (site/public/media/alice/alice-ai-and-my-job.jpg and alice-senior-voice-input.jpg): soft, warm, clean hand-drawn anime chibi style, bright natural light, 2 columns x 3 rows of panels with rounded borders and small numbered circles ①–⑥ in the top-left corner of each panel, white rounded speech bubbles, Traditional Chinese text. Portrait 2:3, final size 1024x1536.
ALICE must match site/public/media/characters/alice-ip.webp exactly, drawn as the same chibi Alice used in the existing Alice comics: long straight dark-brown hair past the shoulders, gentle smile, navy-blue blazer over a white top, small stud earrings; often holding a pen or a notebook. Keep Alice identical in every panel she appears in. Do NOT draw Alice with short hair, a bob, or a green/teal cardigan.
小光 is the AI helper robot from site/public/media/characters/ai-buddy.webp (white-and-navy round robot with a glowing blue face screen); draw it small, appearing on a phone/tablet screen or floating beside the user.
Narration lines (旁白) go in a rectangular caption box, not a speech bubble. No real logos or real people, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Story title (for context only, do not draw as a banner): 網路上的溫柔醫生

Panel ① — 陳奶奶收到一位自稱海外醫生的交友訊息. Text (exact, one bubble/caption per line): 「假醫生：您好，我在國外當醫生，看到您的照片覺得很親切。」
Panel ② — 幾週後，陳奶奶和對方聊天. Text (exact, one bubble/caption per line): 「陳奶奶：好久沒人這樣關心我了。」 / 「旁白：網路上的關心可能是真誠的，也可能是騙局的開場。」
Panel ③ — 對方說禮物卡在海關. Text (exact, one bubble/caption per line): 「假醫生：禮物卡在海關，請先匯一筆錢付關稅。」 / 「陳奶奶：我們從沒見過面，為什麼要我先匯錢？」
Panel ④ — 女兒和 Alice 陪奶奶看訊息與照片. Text (exact, one bubble/caption per line): 「Alice：照片有些地方看起來不自然，但光看照片不能確定真假。」 / 「Alice：真正要注意的是：對方要錢、催你保密，或不讓你核實身分。」
Panel ⑤ — 女兒抱著奶奶，一起打反詐諮詢電話. Text (exact, one bubble/caption per line): 「女兒：媽，不是妳的錯。我們先不要匯款，一起問專業人員。」 / 「陳奶奶：好，我先把訊息留著，請你陪我處理。」
Panel ⑥ — 陳奶奶和社區朋友跳舞. Text (exact, one bubble/caption per line): 「Alice：沒見過面就要你匯款、買點數或付費，先停下來找家人商量。」 / 「旁白：在台灣可撥 165 反詐騙諮詢專線；發布前核對官方最新服務方式。」
```
</details>

### 第 110 個主題：阿公的人生錦囊（E11・中老年人｜樂齡學堂）

- 檔案：`site/public/media/alice/alice-oasis-life-advice-capsule.jpg`　網址：`/learn/oasis-life-advice-capsule/`

| 格 | 畫面 | 對白／旁白（一字不差） |
|---|---|---|
| 1 畢業典禮的感觸 | 王伯伯看著孫女畢業 | 王伯伯：等她長大，我不知道還能不能親口給她祝福…… |
| 2 把心意留下來 | Alice 提議錄下祝福 | Alice：可以先把想對她說的話錄下來，留給未來的她。 |
| 3 用自己的話錄音 | 王伯伯對手機錄音，桌上放著不同圖案的信封 | 王伯伯：找工作不要只看薪水，也要找一個讓你每天想早起的地方。 |
| 4 整理成信，不代替阿公說話 | 女兒和孫女一起整理錄音 | 小光：我把錄音整理成文字，會保留阿公原本的口吻和俗語。<br>女兒：整理好再請阿公確認，檔案也由我們妥善保管。 |
| 5 約定何時打開 | 王伯伯把信和錄音交給女兒 | 王伯伯：等她遇到人生大事，再陪她一起打開。<br>女兒：我會照你的心意保管，也會尊重她想不想聽。 |
| 6 未來收到祝福 | 想像中的未來婚禮，孫女聽錄音；阿公以回憶畫面呈現 | 孫女：阿公，你的祝福我收到了。<br>旁白：一段錄音，留住的是阿公親口說出的心意。 |

<details><summary>生圖提示詞</summary>

```text
Create a NEW six-panel educational comic page in EXACTLY the same art style and layout as the existing Alice comics (site/public/media/alice/alice-ai-and-my-job.jpg and alice-senior-voice-input.jpg): soft, warm, clean hand-drawn anime chibi style, bright natural light, 2 columns x 3 rows of panels with rounded borders and small numbered circles ①–⑥ in the top-left corner of each panel, white rounded speech bubbles, Traditional Chinese text. Portrait 2:3, final size 1024x1536.
ALICE must match site/public/media/characters/alice-ip.webp exactly, drawn as the same chibi Alice used in the existing Alice comics: long straight dark-brown hair past the shoulders, gentle smile, navy-blue blazer over a white top, small stud earrings; often holding a pen or a notebook. Keep Alice identical in every panel she appears in. Do NOT draw Alice with short hair, a bob, or a green/teal cardigan.
小光 is the AI helper robot from site/public/media/characters/ai-buddy.webp (white-and-navy round robot with a glowing blue face screen); draw it small, appearing on a phone/tablet screen or floating beside the user.
Narration lines (旁白) go in a rectangular caption box, not a speech bubble. No real logos or real people, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Story title (for context only, do not draw as a banner): 阿公的人生錦囊

Panel ① — 王伯伯看著孫女畢業. Text (exact, one bubble/caption per line): 「王伯伯：等她長大，我不知道還能不能親口給她祝福……」
Panel ② — Alice 提議錄下祝福. Text (exact, one bubble/caption per line): 「Alice：可以先把想對她說的話錄下來，留給未來的她。」
Panel ③ — 王伯伯對手機錄音，桌上放著不同圖案的信封. Text (exact, one bubble/caption per line): 「王伯伯：找工作不要只看薪水，也要找一個讓你每天想早起的地方。」
Panel ④ — 女兒和孫女一起整理錄音. Text (exact, one bubble/caption per line): 「小光：我把錄音整理成文字，會保留阿公原本的口吻和俗語。」 / 「女兒：整理好再請阿公確認，檔案也由我們妥善保管。」
Panel ⑤ — 王伯伯把信和錄音交給女兒. Text (exact, one bubble/caption per line): 「王伯伯：等她遇到人生大事，再陪她一起打開。」 / 「女兒：我會照你的心意保管，也會尊重她想不想聽。」
Panel ⑥ — 想像中的未來婚禮，孫女聽錄音；阿公以回憶畫面呈現. Text (exact, one bubble/caption per line): 「孫女：阿公，你的祝福我收到了。」 / 「旁白：一段錄音，留住的是阿公親口說出的心意。」
```
</details>

### 第 111 個主題：當年沒走的那條路（E12・中老年人｜樂齡學堂）

- 檔案：`site/public/media/alice/alice-oasis-dream-career-photo.jpg`　網址：`/learn/oasis-dream-career-photo/`

| 格 | 畫面 | 對白／旁白（一字不差） |
|---|---|---|
| 1 說起年輕時的夢想 | 社區教室裡，老師提問，王伯伯舉手 | 老師：年輕時，你最想做什麼工作？<br>王伯伯：我想當飛行員！可是家裡要我去種田。 |
| 2 大家分享各自的夢 | 長輩們輪流說 | 陳奶奶：我想當歌星呢！<br>林阿姨：我以前最想開一間麵包店。 |
| 3 先取得同意 | Alice 向大家介紹夢想照 | Alice：如果大家願意，我們可以用你們同意的照片，做一張想像中的夢想照。<br>王伯伯：好啊，我想看看自己穿飛行員制服的樣子。 |
| 4 看見想像中的自己 | 王伯伯穿機長制服站在飛機前；陳奶奶拿著麥克風 | 小光：夢想照完成了！這是創作的想像畫面。<br>陳奶奶：這樣看起來，我好像真的站上舞台了！ |
| 5 也看見走過的路 | 王伯伯看著照片，想起自己種田養家的日子 | 王伯伯：沒當成飛行員，可是我種的米，養大了三個孩子。 |
| 6 彼此鼓掌 | 教室貼滿夢想照，也寫著每個人的真實故事 | Alice：沒走的路很美，走過的路也很了不起。<br>長輩們：為我們的夢想，也為走過的人生，拍拍手！ |

<details><summary>生圖提示詞</summary>

```text
Create a NEW six-panel educational comic page in EXACTLY the same art style and layout as the existing Alice comics (site/public/media/alice/alice-ai-and-my-job.jpg and alice-senior-voice-input.jpg): soft, warm, clean hand-drawn anime chibi style, bright natural light, 2 columns x 3 rows of panels with rounded borders and small numbered circles ①–⑥ in the top-left corner of each panel, white rounded speech bubbles, Traditional Chinese text. Portrait 2:3, final size 1024x1536.
ALICE must match site/public/media/characters/alice-ip.webp exactly, drawn as the same chibi Alice used in the existing Alice comics: long straight dark-brown hair past the shoulders, gentle smile, navy-blue blazer over a white top, small stud earrings; often holding a pen or a notebook. Keep Alice identical in every panel she appears in. Do NOT draw Alice with short hair, a bob, or a green/teal cardigan.
小光 is the AI helper robot from site/public/media/characters/ai-buddy.webp (white-and-navy round robot with a glowing blue face screen); draw it small, appearing on a phone/tablet screen or floating beside the user.
Narration lines (旁白) go in a rectangular caption box, not a speech bubble. No real logos or real people, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Story title (for context only, do not draw as a banner): 當年沒走的那條路

Panel ① — 社區教室裡，老師提問，王伯伯舉手. Text (exact, one bubble/caption per line): 「老師：年輕時，你最想做什麼工作？」 / 「王伯伯：我想當飛行員！可是家裡要我去種田。」
Panel ② — 長輩們輪流說. Text (exact, one bubble/caption per line): 「陳奶奶：我想當歌星呢！」 / 「林阿姨：我以前最想開一間麵包店。」
Panel ③ — Alice 向大家介紹夢想照. Text (exact, one bubble/caption per line): 「Alice：如果大家願意，我們可以用你們同意的照片，做一張想像中的夢想照。」 / 「王伯伯：好啊，我想看看自己穿飛行員制服的樣子。」
Panel ④ — 王伯伯穿機長制服站在飛機前；陳奶奶拿著麥克風. Text (exact, one bubble/caption per line): 「小光：夢想照完成了！這是創作的想像畫面。」 / 「陳奶奶：這樣看起來，我好像真的站上舞台了！」
Panel ⑤ — 王伯伯看著照片，想起自己種田養家的日子. Text (exact, one bubble/caption per line): 「王伯伯：沒當成飛行員，可是我種的米，養大了三個孩子。」
Panel ⑥ — 教室貼滿夢想照，也寫著每個人的真實故事. Text (exact, one bubble/caption per line): 「Alice：沒走的路很美，走過的路也很了不起。」 / 「長輩們：為我們的夢想，也為走過的人生，拍拍手！」
```
</details>

### 第 112 個主題：點點老歌房（E13・中老年人｜樂齡學堂）

- 檔案：`site/public/media/alice/alice-oasis-oldies-room.jpg`　網址：`/learn/oasis-oldies-room/`

| 格 | 畫面 | 對白／旁白（一字不差） |
|---|---|---|
| 1 想起以前的歌 | 陳奶奶在家，電視開著但沒有看 | 陳奶奶：好久沒聽以前的歌了…… |
| 2 用說的就可以 | Alice 來訪，展示通用音樂 App | Alice：想聽什麼，可以試著直接跟手機說。 |
| 3 試著語音點歌 | 陳奶奶對手機說話 | 陳奶奶：我想聽……七〇年代的老歌。<br>手機助理：我來幫您搜尋符合條件的歌曲。 |
| 4 跟著旋律哼唱 | 音樂播放，陳奶奶輕輕哼歌 | 陳奶奶：這個旋律一出來，我就想起以前的朋友。 |
| 5 打電話給老朋友 | 陳奶奶撥電話給阿玉 | 陳奶奶：阿玉，我們以前常唱的那首歌，妳還記得嗎？<br>阿玉：記得！下次一起唱給大家聽。 |
| 6 在社區重聚 | 社區活動中心，朋友們圍著手機唱歌、打拍子 | 陳奶奶：一首歌，把大家都找回來了！<br>旁白：使用有授權的音樂平台；部分歌曲可能需要訂閱或含有廣告。 |

<details><summary>生圖提示詞</summary>

```text
Create a NEW six-panel educational comic page in EXACTLY the same art style and layout as the existing Alice comics (site/public/media/alice/alice-ai-and-my-job.jpg and alice-senior-voice-input.jpg): soft, warm, clean hand-drawn anime chibi style, bright natural light, 2 columns x 3 rows of panels with rounded borders and small numbered circles ①–⑥ in the top-left corner of each panel, white rounded speech bubbles, Traditional Chinese text. Portrait 2:3, final size 1024x1536.
ALICE must match site/public/media/characters/alice-ip.webp exactly, drawn as the same chibi Alice used in the existing Alice comics: long straight dark-brown hair past the shoulders, gentle smile, navy-blue blazer over a white top, small stud earrings; often holding a pen or a notebook. Keep Alice identical in every panel she appears in. Do NOT draw Alice with short hair, a bob, or a green/teal cardigan.
小光 is the AI helper robot from site/public/media/characters/ai-buddy.webp (white-and-navy round robot with a glowing blue face screen); draw it small, appearing on a phone/tablet screen or floating beside the user.
Narration lines (旁白) go in a rectangular caption box, not a speech bubble. No real logos or real people, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Story title (for context only, do not draw as a banner): 點點老歌房

Panel ① — 陳奶奶在家，電視開著但沒有看. Text (exact, one bubble/caption per line): 「陳奶奶：好久沒聽以前的歌了……」
Panel ② — Alice 來訪，展示通用音樂 App. Text (exact, one bubble/caption per line): 「Alice：想聽什麼，可以試著直接跟手機說。」
Panel ③ — 陳奶奶對手機說話. Text (exact, one bubble/caption per line): 「陳奶奶：我想聽……七〇年代的老歌。」 / 「手機助理：我來幫您搜尋符合條件的歌曲。」
Panel ④ — 音樂播放，陳奶奶輕輕哼歌. Text (exact, one bubble/caption per line): 「陳奶奶：這個旋律一出來，我就想起以前的朋友。」
Panel ⑤ — 陳奶奶撥電話給阿玉. Text (exact, one bubble/caption per line): 「陳奶奶：阿玉，我們以前常唱的那首歌，妳還記得嗎？」 / 「阿玉：記得！下次一起唱給大家聽。」
Panel ⑥ — 社區活動中心，朋友們圍著手機唱歌、打拍子. Text (exact, one bubble/caption per line): 「陳奶奶：一首歌，把大家都找回來了！」 / 「旁白：使用有授權的音樂平台；部分歌曲可能需要訂閱或含有廣告。」
```
</details>

### 第 113 個主題：我的專屬旋律（E14・中老年人｜樂齡學堂）

- 檔案：`site/public/media/alice/alice-oasis-my-melody.jpg`　網址：`/learn/oasis-my-melody/`

| 格 | 畫面 | 對白／旁白（一字不差） |
|---|---|---|
| 1 想起老家的小路 | 回憶中的田埂、稻田與夕陽 | 王伯伯：好想念老家的那條小路。 |
| 2 孫子提出點子 | 回到現在，小寶拿著平板 | 小寶：阿公，我們試著用 AI 把這種感覺做成音樂！ |
| 3 挑選三個元素 | Alice 展示心情、地方、樂器圖卡 | Alice：說出三個詞就好。<br>王伯伯：思鄉、稻田、口琴。 |
| 4 聽聽第一版 | 平板播放溫柔的口琴旋律 | 小光：這是一段依照這些描述生成的旋律。<br>王伯伯：聽起來像傍晚走在田邊。 |
| 5 依自己的感覺修改 | 王伯伯請小寶把節奏調慢 | 王伯伯：再慢一點，像傍晚走回家那樣。<br>Alice：你可以繼續調整，直到更接近自己的想法。 |
| 6 和家人分享 | 家族聚會一起聽旋律 | 王伯伯：這是我用自己的回憶和想法，完成的〈稻田小路〉。<br>旁白：描述心情和場景即可；不必要求 AI 模仿特定歌手或現有歌曲。 |

<details><summary>生圖提示詞</summary>

```text
Create a NEW six-panel educational comic page in EXACTLY the same art style and layout as the existing Alice comics (site/public/media/alice/alice-ai-and-my-job.jpg and alice-senior-voice-input.jpg): soft, warm, clean hand-drawn anime chibi style, bright natural light, 2 columns x 3 rows of panels with rounded borders and small numbered circles ①–⑥ in the top-left corner of each panel, white rounded speech bubbles, Traditional Chinese text. Portrait 2:3, final size 1024x1536.
ALICE must match site/public/media/characters/alice-ip.webp exactly, drawn as the same chibi Alice used in the existing Alice comics: long straight dark-brown hair past the shoulders, gentle smile, navy-blue blazer over a white top, small stud earrings; often holding a pen or a notebook. Keep Alice identical in every panel she appears in. Do NOT draw Alice with short hair, a bob, or a green/teal cardigan.
小光 is the AI helper robot from site/public/media/characters/ai-buddy.webp (white-and-navy round robot with a glowing blue face screen); draw it small, appearing on a phone/tablet screen or floating beside the user.
Narration lines (旁白) go in a rectangular caption box, not a speech bubble. No real logos or real people, no extra text, no watermark. Render all Chinese text crisply in Traditional Chinese exactly as given.

Story title (for context only, do not draw as a banner): 我的專屬旋律

Panel ① — 回憶中的田埂、稻田與夕陽. Text (exact, one bubble/caption per line): 「王伯伯：好想念老家的那條小路。」
Panel ② — 回到現在，小寶拿著平板. Text (exact, one bubble/caption per line): 「小寶：阿公，我們試著用 AI 把這種感覺做成音樂！」
Panel ③ — Alice 展示心情、地方、樂器圖卡. Text (exact, one bubble/caption per line): 「Alice：說出三個詞就好。」 / 「王伯伯：思鄉、稻田、口琴。」
Panel ④ — 平板播放溫柔的口琴旋律. Text (exact, one bubble/caption per line): 「小光：這是一段依照這些描述生成的旋律。」 / 「王伯伯：聽起來像傍晚走在田邊。」
Panel ⑤ — 王伯伯請小寶把節奏調慢. Text (exact, one bubble/caption per line): 「王伯伯：再慢一點，像傍晚走回家那樣。」 / 「Alice：你可以繼續調整，直到更接近自己的想法。」
Panel ⑥ — 家族聚會一起聽旋律. Text (exact, one bubble/caption per line): 「王伯伯：這是我用自己的回憶和想法，完成的〈稻田小路〉。」 / 「旁白：描述心情和場景即可；不必要求 AI 模仿特定歌手或現有歌曲。」
```
</details>

#### 追加到 `alice-lessons.json`（接在最後）

```json
[
  {
    "slug": "civics-find-ai",
    "code": "N32",
    "title": "家裡藏了幾個 AI？",
    "group": "9–12 歲｜AI 公民課",
    "focus": "從家中常見設備找出 AI，分辨「照固定規則」和「從資料找規律」。",
    "lesson": "AI 不一定長得像機器人。掃地機器人避障、手機人臉辨識、影片推薦都可能用到 AI；一般計算機多半照固定公式計算。判斷時可以問：它用了什麼資料？判斷可能出錯嗎？",
    "practice": "和家人一起在家裡找出三樣可能用到 AI 的東西，寫下它們用了什麼資料、可能在哪裡出錯。",
    "caveat": "文中產品只是常見例子，實際功能依產品而異；使用照片或個人資料前，先了解工具的用途與規則。"
  },
  {
    "slug": "oasis-golden-wedding-photo",
    "code": "E8",
    "title": "五十年前沒拍的婚紗照",
    "group": "中老年人｜樂齡學堂",
    "focus": "用生成式影像完成一張金婚紀念照，先取得同意，也保護臉部照片。",
    "lesson": "AI 可以協助創作紀念影像，但不能代替當事人同意。上傳照片前，先了解服務如何保存、使用和刪除照片；不清楚就不上傳，也可以改用文字描述或手繪創作。",
    "practice": "和長輩一起決定要不要做、想怎麼呈現；只使用本人同意的照片，看過草稿再決定是否完成與分享。",
    "caveat": "圖中平板畫面是插畫示意，不代表任何特定工具的隱私功能或刪除保證；請以各服務條款與隱私設定為準。"
  },
  {
    "slug": "oasis-letter-to-late-spouse",
    "code": "E9",
    "title": "寫一封信給老伴",
    "group": "中老年人｜樂齡學堂",
    "focus": "陪伴長輩整理思念，分清 AI 生成的話與逝者真正說過的話。",
    "lesson": "AI 生成的話不是逝者本人說的，可能讓人更難放下。可以請 AI 只整理長輩自己說出的話，不加入沒說過的內容，再由本人確認。",
    "practice": "提示語範例：「我想寫一封信給【對象】，我會說出想說的話，請幫我整理成一封信，只用我說的內容，不要加入我沒說過的話。」",
    "caveat": "若悲傷難以承受，可以找信任的人陪伴或尋求專業協助；專線資訊以官方頁面最新公告為準。",
    "supports": [
      {
        "label": "1925 安心專線（衛生福利部，24 小時）",
        "href": "https://www.mohw.gov.tw/cp-23-135-1.html"
      }
    ]
  },
  {
    "slug": "oasis-romance-scam",
    "code": "E10",
    "title": "網路上的溫柔醫生",
    "group": "中老年人｜樂齡學堂",
    "focus": "認識網路交友詐騙的金錢要求警訊，練習先停下來、和家人一起查證。",
    "lesson": "光看照片是否「像 AI 做的」不能確定真假。真正的警訊是：沒見過面就要求匯款、買點數或付費，催你保密，或不讓你核實身分。",
    "practice": "收到這類要求時，先不要匯款，保留訊息，和家人一起打 165 反詐騙諮詢專線查證。",
    "caveat": "受騙不是當事人的錯；專線資訊以官方頁面最新公告為準。",
    "supports": [
      {
        "label": "165 反詐騙諮詢專線（內政部警政署）",
        "href": "https://safemyhome.npa.gov.tw/ch/app/artwebsite/view?id=1358&module=artwebsite&serno=f1512793-602e-4977-beaa-356fbeba6bd6"
      }
    ]
  },
  {
    "slug": "oasis-life-advice-capsule",
    "code": "E11",
    "title": "阿公的人生錦囊",
    "group": "中老年人｜樂齡學堂",
    "focus": "把阿公親口說的人生建議錄下來，經本人確認後交由家人保管。",
    "lesson": "AI 可以把錄音轉成文字、整理順序，但不應模仿長輩的聲音，或補寫他沒說過的話。整理好後請本人確認，再妥善保管檔案。",
    "practice": "錄一段長輩想對家人說的祝福，轉成文字後一起確認內容，約定由誰保管、什麼時候打開。",
    "caveat": "錄音或轉錄前先取得同意，確認雲端服務的保存方式；重要檔案另外備份並限制存取。"
  },
  {
    "slug": "oasis-dream-career-photo",
    "code": "E12",
    "title": "當年沒走的那條路",
    "group": "中老年人｜樂齡學堂",
    "focus": "用夢想照回顧長輩年輕時的夢想，也看見真實走過的路。",
    "lesson": "生成的夢想照是想像畫面，要清楚標示是創作，不冒充真實經歷。使用他人照片前，先取得本人同意。",
    "practice": "提示語範例：「請保留這張照片的臉，讓他穿上【夢想職業】的制服，在【工作場景】裡，自信地微笑。」",
    "caveat": "分享前再確認本人同意；生成圖不代表真實經歷。"
  },
  {
    "slug": "oasis-oldies-room",
    "code": "E13",
    "title": "點點老歌房",
    "group": "中老年人｜樂齡學堂",
    "focus": "用語音搜尋老歌，再邀請老朋友一起分享回憶。",
    "lesson": "不用打字，直接對手機說想聽什麼歌，就能請語音助理幫忙搜尋。音樂要透過有授權的音樂平台播放。",
    "practice": "試著說：「播放 1970 年代的【語言】老歌」「播放【歌手名字】的歌」「這首歌叫什麼名字？」",
    "caveat": "可播放的內容依各服務而異，部分歌曲可能需要訂閱或含有廣告。"
  },
  {
    "slug": "oasis-my-melody",
    "code": "E14",
    "title": "我的專屬旋律",
    "group": "中老年人｜樂齡學堂",
    "focus": "把心情、地方和樂器變成原創音樂的靈感，再依自己的感覺調整。",
    "lesson": "只要描述心情、場景和樂器，就能請 AI 生成一段原創旋律，再依自己的感覺慢慢調整；不必要求 AI 模仿特定歌手或現有歌曲。",
    "practice": "提示語範例：「請用【心情】、【地方】、【樂器】作為靈感，創作一段原創旋律。」",
    "caveat": "不同生成服務對音樂的使用與授權方式不同，分享或商用前請確認服務條款。"
  }
]
```

#### 追加到 `alice-topics.json`（接在最後）

```json
[
  {
    "key": "added-n32",
    "code": "N32",
    "group": "9–12 歲｜AI 公民課",
    "title": "家裡藏了幾個 AI？",
    "focus": "從家中常見設備找出 AI，分辨「照固定規則」和「從資料找規律」。",
    "source": "追加主題",
    "status": "漫畫已完成",
    "href": "/learn/civics-find-ai/"
  },
  {
    "key": "added-e8",
    "code": "E8",
    "group": "中老年人｜樂齡學堂",
    "title": "五十年前沒拍的婚紗照",
    "focus": "用生成式影像完成一張金婚紀念照，先取得同意，也保護臉部照片。",
    "source": "追加主題",
    "status": "漫畫已完成",
    "href": "/learn/oasis-golden-wedding-photo/"
  },
  {
    "key": "added-e9",
    "code": "E9",
    "group": "中老年人｜樂齡學堂",
    "title": "寫一封信給老伴",
    "focus": "陪伴長輩整理思念，分清 AI 生成的話與逝者真正說過的話。",
    "source": "追加主題",
    "status": "漫畫已完成",
    "href": "/learn/oasis-letter-to-late-spouse/"
  },
  {
    "key": "added-e10",
    "code": "E10",
    "group": "中老年人｜樂齡學堂",
    "title": "網路上的溫柔醫生",
    "focus": "認識網路交友詐騙的金錢要求警訊，練習先停下來、和家人一起查證。",
    "source": "追加主題",
    "status": "漫畫已完成",
    "href": "/learn/oasis-romance-scam/"
  },
  {
    "key": "added-e11",
    "code": "E11",
    "group": "中老年人｜樂齡學堂",
    "title": "阿公的人生錦囊",
    "focus": "把阿公親口說的人生建議錄下來，經本人確認後交由家人保管。",
    "source": "追加主題",
    "status": "漫畫已完成",
    "href": "/learn/oasis-life-advice-capsule/"
  },
  {
    "key": "added-e12",
    "code": "E12",
    "group": "中老年人｜樂齡學堂",
    "title": "當年沒走的那條路",
    "focus": "用夢想照回顧長輩年輕時的夢想，也看見真實走過的路。",
    "source": "追加主題",
    "status": "漫畫已完成",
    "href": "/learn/oasis-dream-career-photo/"
  },
  {
    "key": "added-e13",
    "code": "E13",
    "group": "中老年人｜樂齡學堂",
    "title": "點點老歌房",
    "focus": "用語音搜尋老歌，再邀請老朋友一起分享回憶。",
    "source": "追加主題",
    "status": "漫畫已完成",
    "href": "/learn/oasis-oldies-room/"
  },
  {
    "key": "added-e14",
    "code": "E14",
    "group": "中老年人｜樂齡學堂",
    "title": "我的專屬旋律",
    "focus": "把心情、地方和樂器變成原創音樂的靈感，再依自己的感覺調整。",
    "source": "追加主題",
    "status": "漫畫已完成",
    "href": "/learn/oasis-my-melody/"
  }
]
```

---

## 6. 完成後檢查（全部通過才通知網站擁有者推送）

```powershell
cd $HOME\Desktop\AK-sync\site
npm.cmd run typecheck
npm.cmd run build
node scripts/qa-ken.cjs
```

- `node scripts/qa-ken.cjs` 顯示 `PASS: 38 comics, 152 dialogues`。
- `out/money/` 有 `ken-01`～`ken-38`；`out/learn/` 有 8 個新 slug 資料夾。
- 首頁顯示「113 個主題」「38 篇漫畫」。
- `/learn/oasis-letter-to-late-spouse/` 和 `/learn/oasis-romance-scam/` 底部有「參考來源與求助資源」（1925、165）。
- 如果 `npm.cmd run build` 出現 `EPERM`（Windows 鎖檔），通常是防毒或預覽伺服器占用 `.next`。可以略過，推送後由 Claude 在雲端完整建置。

## 7. 推送（由網站擁有者在 PowerShell 執行）

```powershell
cd $HOME\Desktop\AK-sync
git status --short
git add site/public/media/ken site/public/media/alice site/lib site/scripts/qa-ken.cjs
git -c user.name="AKWealthGlobal" -c user.email="yanhongq1996@gmail.com" commit -m "feat(comics): PR #9 重做——Ken 第 36～38 篇四格、Alice 第 106～113 主題"
git push -u origin feat/pr9-redo-alice-ken
```

推上去後告訴 Claude，由 Claude 開 PR、核對圖片文字並完整建置，確認後再合併上線，最後關閉 PR #9。
