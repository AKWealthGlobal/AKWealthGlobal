# 萬獸城：3D 親子財商棋盤遊戲設計（原創版）

整理日期：2026-10-06。依使用者提供的企劃改寫為原創世界觀：不使用任何電影角色、地名、店名或商業桌遊名稱，可公開放在網站上。

## 世界觀

「萬獸城」是一座讓不同體型動物一起生活的現代都市，中心是萬獸中央車站。24 格方形環狀棋盤，每 6 格一個區域：

| 格數 | 區域 | 視覺 | 財商主題 |
| --- | --- | --- | --- |
| 1–6 | 莽原中心區 | 玻璃高樓、河馬供水管、倉鼠透明通道、大象甜品店 | 日常預算、需要與想要、薪水 |
| 7–12 | 金沙廣場 | 沙色尖塔飯店、仙人掌玻璃大樓、霓虹看板 | 投資風險、供需、防詐 |
| 13–18 | 冰晶鎮 | 冰雕高樓、溜冰大道、冰晶銀行 | 儲蓄、複利、保險 |
| 19–24 | 雨林樹屋區 | 巨木樹屋、吊橋、纜車站、霧氣 | 創業、綠色經濟、職涯 |

經過中央車站時結算一圈的現金流：薪水 + 租金 + 利息 − 生活費。

## 原創角色（全家棋子）

| 角色 | 動物 | 天賦 | 弱點 |
| --- | --- | --- | --- |
| 小跳 | 兔子警員 | 自律，經過警局得勤奮獎金 | 太熱心，急難格要捐款 |
| 阿狸 | 狐狸商人 | 談判，買小店打折 | 愛冒險，金沙廣場要抽風險卡 |
| 豹豹 | 獵豹警員 | 人緣好，幸福點數加成 | 衝動消費，經過甜品店想買甜點 |
| 慢慢 | 樹懶職員 | 長線思維，冰晶銀行利息加成 | 時間成本，辦事要多等一回合 |

其他配角：小耳狐阿福、大象波波（甜品店）、白熊爺爺（冰晶銀行）、黃鼠狼滑頭（詐騙）、羚羊歌手星羚、水牛局長牛隊長、獅子市長、旅鼠三兄弟、水獺先生。

## 已上線

- 遊戲四「萬獸城財商問答」：30 題（`lib/animal-city-quiz.ts`），5～8 歲、9～12 歲、12 歲以上各 10 題。

## 下一步：24 格多人棋盤（尚未製作）

依企劃：多人輪流（親子同玩）、每圈現金流結算、購買店鋪收租、冰晶銀行存款生息、問答格接題庫、風險事件卡、幸福點數與夢想卡雙目標。

## AI 美術提示詞（原創版，可貼到 Higgsfield）

不要寫入任何電影、公司或角色名稱，避免生成出近似侵權的畫面。

```text
Board & world:
Cinematic 3D isometric board game environment of an original animal metropolis called "Wanshou City".
A square 24-tile floating track, 6 tiles per side, surrounded by 4 districts:
1. Savanna downtown: sleek glass skyscrapers, giant water pipes sized for hippos, translucent hamster transit tubes, warm afternoon light.
2. Golden sand plaza: sand-textured hotel spires, glass cactus towers, neon signs, golden sunset.
3. Crystal ice town: ice-sculpted towers, skating avenues, an ice bank with a vault door, cool cyan light.
4. Rainforest treehouse district: giant treehouses, rope bridges, cable cars, soft volumetric mist.
Centerpiece: a grand glass-domed central train station with a maglev train.
Style: original stylized 3D cartoon, family friendly, soft PBR materials, vibrant colors, high detail.
```

```text
Character pawns:
Original stylized 3D cartoon animal pawns, vinyl toy look, clay-gloss shader, soft studio light:
- a cheerful rabbit police officer in a navy uniform with a round gold badge
- a clever red fox shopkeeper in a teal shirt holding a small ice pop
- a friendly cheetah officer holding a donut and a walkie-talkie
- a calm sloth office clerk in a short-sleeve shirt and tie, slowly waving
Do not resemble any existing film characters.
```

## Topview 30 秒介紹影片腳本

- 0–3 秒：「如果動物城市也玩財商棋盤，誰能先存到夢想？」
- 4–15 秒：鏡頭穿過四大區域：兔子在冰晶銀行存錢、狐狸在金沙廣場開店。
- 16–25 秒：親子一起回答問答題，討論需要與想要。
- 26–30 秒：「今晚全家一起，開啟萬獸城財商冒險！」
