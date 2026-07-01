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

## 高機率口試題與答案

### 如何把 desktop trading dashboard 改成 mobile？

我會先做資訊優先級排序，而不是直接把 desktop 壓縮。Desktop 可以同時顯示 chart、order book、trade form、open orders；mobile 應改成單欄或 tab，讓 chart、order book、下單表單分區呈現。下單 CTA 要放在容易找到但不易誤觸的位置，表格欄位要減少或改成卡片/橫向 scroll，數字仍要對齊。也要處理鍵盤彈出、safe area、touch target、loading/error state，避免小螢幕下產生高風險操作錯誤。

### Flexbox 和 Grid 如何選？

Flexbox 適合一維排列，例如 toolbar、button group、表單 row、水平/垂直置中。Grid 適合二維 layout，例如 trading dashboard 的 chart、order book、trade form、orders panel。簡單說，內容主要沿著一條軸排列用 Flexbox；需要同時控制列與欄，用 Grid。實務上常混用：頁面骨架用 Grid，元件內部排列用 Flexbox。

### Tailwind 的優缺點是什麼？

Tailwind 的優點是 utility-first、樣式靠近 markup、token 一致、不容易 class 命名衝突，刪元件時樣式也一起刪掉。缺點是 className 容易變長，複雜 variant 會讓 JSX 可讀性下降，團隊沒有規範時容易堆 utility。我的做法是把重複 UI 抽成 component，theme token 集中管理，複雜互動狀態不要硬塞在單一 className 裡。

### CSS-in-JS 和 CSS Modules 的 trade-off？

CSS Modules 簡單、接近原生 CSS、build-time scope class，適合樣式相對穩定的 component。CSS-in-JS 適合樣式依 props/theme 動態變化、design system variant 多的場景，但 runtime cost、SSR 設定、debug className、bundle size 都要注意。大型專案我會依設計系統需求選型，不會只因為流行就導入 CSS-in-JS。

### Webpack loader 和 plugin 差在哪？

Loader 負責把某類檔案轉成 Webpack 能處理的 module，例如 Babel loader 轉 JS/TS，CSS loader 處理 CSS import，file/asset loader 處理圖片。Plugin 則擴充整個 build lifecycle，例如產生 HTML、抽 CSS、注入 env、壓縮、分析 bundle。簡單說：loader 是單檔轉換，plugin 是全局建置流程擴充。

### Tree shaking 需要哪些條件？

Tree shaking 主要依賴 ESM 的靜態 import/export，讓 bundler 能分析哪些 export 沒被使用。package 需要正確標示 `sideEffects`，程式也要避免在 module top-level 做不可移除的副作用。若使用 CommonJS、動態 require、整包 import、或 library 沒有 ESM build，tree shaking 效果會變差。最後要用 production mode/minifier 才會真正移除 dead code。

### 你如何確保 UI 品質？

我會從狀態完整性、視覺一致性、互動可靠性、可訪問性和測試幾個面向看。每個資料區塊都要有 loading、empty、error、success、disabled、pending 狀態；表單要有 validation 和防重複提交；responsive 下不能破版；鍵盤操作和 focus 要合理。交易產品還要特別檢查數字格式、漲跌顏色、錯誤提示、下單確認與資產狀態同步。

### 怎麼處理 loading / empty / error state？

Loading 要分初次載入和背景更新：初次載入可以 skeleton，背景更新不應把既有資料整個清掉。Empty state 要說明目前沒有資料，例如沒有 open orders，而不是看起來像壞掉。Error state 要區分可重試和不可重試，提供 retry，並顯示使用者能理解的訊息。對交易頁來說，資產或訂單資料錯誤時要保守處理，避免讓使用者基於不可信資料操作。

### 如何做 dark mode？

我會先把顏色抽成 semantic token，例如 `bg-surface`、`text-primary`、`border-muted`、`danger`、`success`，而不是直接到處寫 hex。切換 dark mode 時改 token 值，可以透過 CSS variables、Tailwind dark variant 或 theme provider。交易產品還要注意紅綠漲跌色在深色背景上的 contrast，圖表、陰影、border、skeleton、tooltip 都要一起驗證。

### Modal 的 accessibility 要注意什麼？

Modal 開啟時 focus 要移進 modal，Tab 需要被 trap 在 modal 內，Esc 可關閉時要支援 Esc，關閉後 focus 應回到原本觸發元素。底層內容要避免被螢幕閱讀器讀到，可用 `aria-modal` 或 inert 策略；標題要用 `aria-labelledby`，描述可用 `aria-describedby`。如果是下單確認 modal，還要避免 Enter 誤送出，並清楚標示高風險操作。
