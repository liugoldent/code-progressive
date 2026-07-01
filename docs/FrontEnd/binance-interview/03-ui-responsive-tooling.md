---
title: "UI 品質 / Responsive / Tooling"
description: "高品質 UI、響應式版面、CSS 架構、Webpack 與現代前端工具鏈面試筆記。"
tags:
  - CSS
  - Responsive
  - Tooling
  - Webpack
keywords: ["Responsive UI", "Tailwind CSS", "styled-system", "Webpack", "UI quality"]
sidebar_position: 4
---

# UI 品質 / Responsive / Tooling

## 高品質 UI 的定義

職缺寫「high-quality UI」時，面試官通常不是只看畫面好不好看，而是看你是否能穩定交付完整狀態。

必備狀態：

- loading。
- empty。
- error。
- success。
- disabled。
- submitting。
- optimistic / pending。
- partial data。
- permission denied。
- offline / reconnecting。

交易產品 UI 特別重視：

- 價格、數量、百分比格式正確。
- 漲跌顏色一致且可辨識。
- 數字對齊，方便掃描。
- 高頻更新時不閃爍、不跳版。
- 錯誤提示不能讓使用者誤下單。
- mobile 下關鍵操作不容易誤觸。

## Responsive Web

職缺明確提到 desktop 到 small footprint mobile devices，因此需要能講實務策略。

### 常見斷點思維

- desktop：資訊密度高，多欄 layout，例如 chart + order book + trade form。
- tablet：保留主要兩欄，次要內容改 tab。
- mobile：單欄、底部操作、表格轉卡片或橫向 scroll。

### CSS layout 必會

- Flexbox：一維排列、工具列、表單 row。
- Grid：二維頁面區塊、dashboard layout。
- `minmax()`：避免欄位被壓到不可讀。
- `clamp()`：限制尺寸上下限。
- container query：元件依容器大小調整，而不是只看 viewport。

交易頁 layout 例子：

```css
.trading-page {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(320px, 420px);
  gap: 16px;
}

@media (max-width: 768px) {
  .trading-page {
    grid-template-columns: 1fr;
  }
}
```

## CSS 架構

你要能說出團隊如何避免 CSS 失控。

常見方案：

- CSS Modules：檔案級 scoped class，簡單可靠。
- Tailwind CSS：utility-first，適合快速組裝、一致 spacing/token。
- styled-components / emotion：CSS-in-JS，適合 dynamic style。
- styled-system：用 design token / style props 統一 theme。
- Sass：適合傳統變數、mixin、巢狀整理。

回答重點：

- 不要只說「我用過 Tailwind」。
- 要說如何管理 design token、dark mode、responsive、component variant。
- 要說如何避免 className 太長或樣式邏輯分散。

## Tailwind CSS 面試點

必會：

- utility-first 的優缺點。
- responsive prefix，例如 `md:grid-cols-2`。
- pseudo state，例如 `hover:`、`focus:`、`disabled:`。
- dark mode。
- theme token 客製化。
- `@apply` 的使用邊界。

優點：

- 樣式限制在設計系統 token 內。
- 不容易產生命名衝突。
- 刪元件時樣式也一起刪除。
- production purge 後 bundle 較可控。

缺點：

- className 可讀性可能下降。
- 複雜 variant 需要抽 component。
- 團隊沒有規範時容易變成 utility 堆疊。

## styled-system 面試點

styled-system 常見於 design system，把 spacing、color、typography、layout 都映射到 theme token。

回答方向：

- 元件用 token，而不是任意 pixel。
- 讓 responsive style props 更一致。
- 可建立 `Button`、`Box`、`Flex`、`Text` 等 primitive。
- 風險是 style props 過多時，component API 變得不清楚。

## Webpack 必會

即使現在很多專案用 Vite，職缺寫 Webpack 時仍要能講核心概念。

必會：

- entry：打包入口。
- output：輸出檔案。
- loader：轉換非 JS 或新語法，例如 Babel、CSS、image。
- plugin：參與打包流程，例如 HTML、DefinePlugin、MiniCssExtractPlugin。
- mode：development / production。
- devServer：本地開發。
- source map：debug 產物。
- code splitting：切 chunk。
- tree shaking：移除未使用 ESM export。

### Loader vs Plugin

一句話：

Loader 負責把某類檔案轉成 Webpack 能處理的 module；plugin 負責擴充整個 build 流程。

### Code Splitting

常見方式：

- route-level lazy loading。
- dynamic import。
- vendor chunk。
- shared chunk。

```tsx
const TradingPage = lazy(() => import("./pages/TradingPage"));
```

面試補充：

要搭配 loading fallback、error boundary、preload 策略，不能只會切 chunk。

## Babel / Transpilation

要能說：

- Babel 把新語法轉成目標環境支援的 JavaScript。
- polyfill 補 runtime API，例如 `Promise`、`Array.prototype.flat`。
- `@babel/preset-env` 可根據 browserslist 轉換。
- TypeScript type checking 和 Babel transpile 是不同事情。

## Lint / Format / CI

高品質 production code 需要工具約束。

建議回答：

- ESLint 抓 bug pattern 和團隊規範。
- Prettier 統一格式，減少 code review 噪音。
- TypeScript compiler 檢查型別。
- Husky / lint-staged 在 commit 前跑快速檢查。
- CI 跑 test、typecheck、lint、build。

## Accessibility

前端 Senior 面試常會加問 a11y。

必會：

- semantic HTML 優先。
- button / link 不混用。
- input 要有 label。
- modal 要 focus trap。
- keyboard navigation。
- aria 是補充，不是取代語意 HTML。
- 顏色不能是唯一資訊來源。

交易 UI 例子：

漲跌不能只用紅綠色，還應該有正負號、百分比與文字，避免色弱使用者無法辨識。

## 高機率口試題

- 如何把 desktop trading dashboard 改成 mobile？
- Flexbox 和 Grid 如何選？
- Tailwind 的優缺點是什麼？
- CSS-in-JS 和 CSS Modules 的 trade-off？
- Webpack loader 和 plugin 差在哪？
- Tree shaking 需要哪些條件？
- 你如何確保 UI 品質？
- 怎麼處理 loading / empty / error state？
- 如何做 dark mode？
- Modal 的 accessibility 要注意什麼？

