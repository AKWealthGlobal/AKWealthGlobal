---
name: profile-readme
description: 維護 GitHub 個人主頁（AKWealthGlobal/AKWealthGlobal 的 README.md）：撰寫或更新自我介紹、技能徽章、專案列表、聯絡方式。當使用者提到「個人頁」「profile README」「更新 GitHub 首頁」時使用。
---

# GitHub 個人主頁維護

此 repo 名稱與帳號同名，根目錄 `README.md` 會直接顯示在 https://github.com/AKWealthGlobal 。

## 流程

1. 先讀取現有 `README.md`，保留使用者已寫的內容。
2. 詢問或確認要更新的區塊；缺的資訊**留空或用註解標示 TODO**，不要編造經歷、數據或聯絡方式。
3. 依下方結構修改，維持簡潔（建議一個螢幕內看完重點）。
4. 改完後在對話中列出變更摘要，再 commit（訊息格式見 `git-workflow` skill）。

## 建議結構

```markdown
# Hi, I'm {名稱} 👋

{一句話介紹：做什麼、為誰創造價值}

## 🔭 目前專注
- ...

## 🛠 技能 / 工具
<!-- 使用 shields.io 徽章，例如： -->
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)

## 📌 精選專案
| 專案 | 說明 |
|------|------|
| [名稱](連結) | 一句話 |

## 📫 聯絡
- Website: ...
- LinkedIn: ...
```

## 規則

- 徽章只用 shields.io 等穩定服務，不嵌入需要額外 token 的動態卡片。
- 不放個人電話、住址等敏感資訊，除非使用者明確要求。
- 中英文擇一為主；若雙語，英文在前、中文在後。
