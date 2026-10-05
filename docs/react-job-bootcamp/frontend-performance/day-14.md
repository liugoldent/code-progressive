---
sidebar_position: 14
title: "Day 14｜Code Splitting 與 Dynamic Import"
description: "前端效能優化第 14 堂：Code Splitting 與 Dynamic Import 的觀念、實作、驗證與常見誤區。"
---

# Day 14｜Code Splitting 與 Dynamic Import

> 本篇是對 2021 年原系列第 14 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 將大型 bundle 依路由或功能切割，讓使用者先下載當下需要的程式碼。`import()` 會建立非同步 chunk，React 可搭配 `lazy` 與 `Suspense`。

**解答：** 以路由、大型編輯器、圖表或低頻功能作為切割邊界：`const Page = lazy(() => import('./Page'))`，外層提供 `Suspense` fallback。避免每個小元件都切 chunk；高機率下一步會用到的功能可在閒置或 hover 時預載。

**取捨：** 切得太碎會增加請求、瀑布與 loading 狀態。應依使用路徑切割，並預載高機率即將使用的 chunk。

## 深入理解

切割邊界通常是路由、大型依賴或低頻功能。首屏所需程式碼越少越容易提早可見，但 chunk 之間若有串行依賴，也可能形成新的 waterfall。

## 實作與驗證

用 bundle analyzer 找最大模組，對低頻圖表或編輯器建立 dynamic import。測量初次載入 JS bytes、LCP、TBT，以及切換到該功能的等待時間。為 Suspense 提供尺寸穩定的 fallback，必要時在 hover 或閒置時預載。

## 常見誤區與取捨

React.lazy 只拆元件程式碼，不會自動拆 API 資料請求。切太細會增加載入狀態和請求管理成本。

## 範例：按功能拆分

```jsx
import { lazy, Suspense } from 'react';

const ChartPanel = lazy(() => import('./ChartPanel'));

function AnalyticsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: 320 }}>圖表載入中…</div>}>
      <ChartPanel />
    </Suspense>
  );
}
```

這段只在需要 `ChartPanel` 時下載其 chunk。驗證時同時比較首次進站的 JS 總量與第一次打開圖表的等待時間；fallback 保留高度以減少版面跳動。若圖表是首屏必要內容，切割可能反而增加瀑布延遲。

## 延伸閱讀

- [原系列第 14 篇](https://ithelp.ithome.com.tw/articles/10274467)
- [返回課程總覽](./index.md)
