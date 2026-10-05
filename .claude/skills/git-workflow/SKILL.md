---
name: git-workflow
description: 開發工作流程規範：commit 訊息格式、分支命名、PR 描述範本、推送前檢查清單、程式碼審查清單。在 commit、開 PR、review 程式碼時使用。
---

# 開發工作流程

## 分支命名

`<type>/<簡短描述>`，例如 `feat/market-dashboard`、`fix/readme-badge`。
type：`feat` `fix` `docs` `refactor` `chore` `test`

## Commit 訊息（Conventional Commits）

```
<type>(<scope>): <摘要，祈使句，≤ 72 字元>

<為什麼要改，必要時說明怎麼改>
```

範例：`docs(readme): add skills badges to profile`

- 一個 commit 做一件事。
- 摘要說「做了什麼」，內文說「為什麼」。

## 推送前檢查

1. `git status` / `git diff --staged` 確認只包含預期變更。
2. 沒有提交機密（API key、token、`.env`、私鑰）。
3. 專案若有 lint / format / test 指令，先在本機跑過且通過。
4. 推送到功能分支，不直接推 `main`。

## PR 描述範本

```markdown
## 變更內容
- ...

## 原因
- ...

## 測試方式
- [ ] ...

## 備註 / 截圖
```

## 程式碼審查清單

- 正確性：邊界條件、錯誤處理、空值
- 安全性：輸入驗證、機密外洩、權限
- 可讀性：命名清楚、函式單一職責、與周邊程式風格一致
- 範圍：PR 只做描述中的事，沒有夾帶無關修改
