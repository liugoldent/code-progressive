---
sidebar_position: 2
title: "CSS 中高階面試實戰題"
description: "以 stacking context、Grid、container query、cascade layer、樣式隔離與渲染效能為核心的 CSS 中高階面試題。"
tags:
  - CSS
  - Interview
  - Web Platform
keywords: ["CSS 中高階面試題", "stacking context", "container query", "cascade layer", "CSS 效能"]
---

# CSS 中高階面試實戰題

[回到 Web Platform 題庫](./index.md)

每題先回答「結果、原因、修法」，再展開參考答案。

## 1. `z-index: 999999` 為什麼仍被蓋住？

```html
<header class="header">Header</header>
<main class="page">
  <div class="modal">Modal</div>
</main>
```

```css
.header { position: fixed; z-index: 10; }
.page { transform: translateZ(0); }
.modal { position: fixed; z-index: 999999; }
```

`modal` 為什麼可能仍在 `header` 下方？你會怎麼修？

<details>
<summary>參考答案</summary>

`transform` 會讓 `.page` 建立新的 stacking context，也會讓後代的 `position: fixed` 以該元素為 containing block。`.modal` 的巨大 `z-index` 只在 `.page` 這個局部 stacking context 裡比較，無法跨出去壓過外層的 `.header`。

通常會把 modal portal 到 `body` 下的共用 overlay root，並集中管理 layer token。若是原生 modal，也可評估 `<dialog>.showModal()`，讓它進入 top layer。移除無必要的 `transform` 也可能解決，但要先確認它是否承擔動畫或效能用途。

</details>

## 2. Flex item 明明設定 `overflow: hidden`，為什麼文字仍把版面撐爆？

```css
.row { display: flex; width: 320px; }
.title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.actions { flex: none; }
```

<details>
<summary>參考答案</summary>

Flex item 預設 `min-width: auto`，最小尺寸會受內容的 intrinsic size 影響，因此 `.title` 不一定願意縮到容器剩餘空間。常見修法是：

```css
.title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Grid 也有同類問題，欄位常要從 `1fr` 改成 `minmax(0, 1fr)`。面試時只說「加 ellipsis」不夠，要能指出最小內容尺寸才是根因。

</details>

## 3. 什麼時候該用 container query，而不是 media query？

同一張商品卡會出現在全寬首頁、窄側欄與 modal 中。請設計它的響應式策略。

<details>
<summary>參考答案</summary>

如果元件外觀取決於「自己獲得多少空間」，用 container query 比 viewport media query 更能維持元件封裝。父層建立 query container，卡片根據容器 inline size 切版：

```css
.card-slot { container: product / inline-size; }

@container product (width >= 32rem) {
  .product-card { grid-template-columns: 10rem 1fr; }
}
```

Media query 仍適合整頁導覽、輸入裝置能力、列印模式等 viewport 或 device 層級的決策。兩者不是互斥；頁面骨架可用 media query，可重用元件用 container query。

</details>

## 4. 第三方 CSS 權重很高時，如何避免一路加 `!important`？

你的 reset、設計系統、第三方元件與產品頁樣式互相覆蓋，請提出可維護的層疊策略。

<details>
<summary>參考答案</summary>

可先用 cascade layers 明確定義來源優先級：

```css
@layer reset, vendor, tokens, components, utilities, overrides;

@import url("vendor.css") layer(vendor);
```

正常宣告中，後面的 layer 優先於前面的 layer，讓產品覆寫不需要和第三方 selector 比 specificity。元件內仍應保持低權重，例如搭配 `:where()`；臨時修補集中在 `overrides`，避免散落。

要注意 `!important` 在 layers 間的順序會反轉，用意是保護較早、較基礎的 layer，因此不能只把所有舊規則包 layer 就假設結果不變。導入前要用 computed styles 與視覺回歸測試確認。

</details>

## 5. `position: sticky` 沒有效果，你會按什麼順序排查？

<details>
<summary>參考答案</summary>

我會依序確認：

1. 是否設定 `top`、`bottom` 等 inset。
2. 真正的 scroll container 是誰；祖先的 `overflow: auto/hidden/scroll` 可能改變 sticky 參照範圍。
3. 父層是否沒有足夠的可滾動距離，sticky 會受 containing block 邊界限制。
4. Grid/Flex 的 stretch 是否讓 sticky item 和容器一樣高，可用 `align-self: start` 檢查。
5. 是否只是被其他 layer 蓋住，而不是沒有 sticky。

重點是 sticky 同時受 scroll container 與 containing block 約束，不能只盯著元素本身。

</details>

## 6. `content-visibility: auto` 可以隨便加在長頁面的每個 section 嗎？

<details>
<summary>參考答案</summary>

它可讓瀏覽器跳過螢幕外 subtree 的 layout 與 paint，適合內容彼此相對獨立的長列表或長文章；但不是免費優化。若瀏覽器尚未計算真實尺寸，捲動條可能跳動，因此通常搭配 `contain-intrinsic-size` 提供預估尺寸。

還要測試 fragment navigation、尋找頁面文字、focus 移動、可訪問性樹與量測 DOM 尺寸的程式。虛擬列表與 `content-visibility` 解決的層級不同：前者減少 DOM 數量，後者讓既有 DOM 的部分渲染工作延後。應用 Performance panel 與真實互動驗證，而不是全域套用。

</details>

## 7. 如何讓父層根據「是否含有錯誤欄位」改樣式？有什麼風險？

<details>
<summary>參考答案</summary>

可以用 `:has()`：

```css
.field-group:has(:user-invalid) {
  border-color: var(--color-danger);
}
```

它讓某些原本要靠 JavaScript 加 class 的 UI state 可以宣告式處理。不過 selector 範圍應具體，避免在大型 document 上寫過度寬泛、頻繁失效的條件。還要區分 `:invalid` 與 `:user-invalid` 的 UX：前者可能在使用者尚未互動前就顯示錯誤。

若錯誤狀態還牽涉送出流程、server validation 或輔助文字，仍要由應用狀態管理 `aria-invalid`、錯誤訊息關聯等語意，不能只改紅框。

</details>

## 8. 實作題：不靠固定高度做兩欄 dashboard

需求：左側工具列固定寬度，右側內容可縮；表格只能在自己的區域水平捲動，不能撐爆整頁；頁首 sticky。

<details>
<summary>評分重點與一種解法</summary>

```css
.dashboard {
  display: grid;
  grid-template-columns: 16rem minmax(0, 1fr);
  min-height: 100dvh;
}

.main { min-width: 0; }
.table-scroller { max-width: 100%; overflow-x: auto; }
.page-header { position: sticky; top: 0; z-index: 1; }

@media (width < 48rem) {
  .dashboard { grid-template-columns: 1fr; }
}
```

評分不只看寫出 Grid，也看能否解釋 `minmax(0, 1fr)`、overflow owner、sticky 的 scroll container，以及 `100dvh` 相對於舊 `100vh` 在行動瀏覽器動態工具列下的差異。

</details>

## 面試追問清單

- 這個問題是 cascade、formatting context、containing block，還是 stacking context？
- 修法是否會建立新的 stacking context 或 scroll container？
- 你如何用 DevTools 證明根因，而不是碰運氣改 CSS？
- 支援範圍不足時，fallback 是功能降級還是載入 polyfill？

## 延伸查證

- [MDN：Stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_context)
- [MDN：CSS containment 與 container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment)
