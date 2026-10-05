---
sidebar_position: 12
title: "Day 12｜高效能 CSS"
description: "前端效能優化第 12 堂：高效能 CSS 的觀念、實作、驗證與常見誤區。"
---

# Day 12｜高效能 CSS

> 本篇是對 2021 年原系列第 12 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** CSS 效能不只取決於 selector；更大的成本常來自大量 DOM、頻繁 style recalculation、layout 與 paint。

**解答：** 減少無用 DOM 與影響範圍過大的樣式變更；事件中先讀取所有尺寸，再一次寫入 class/style，避免 read → write → read 造成強制同步 layout。動畫用 class 切換並優先採用 transform/opacity。

**實務：** 降低 DOM 複雜度、避免 layout thrashing、批次讀寫 DOM、動畫優先使用 transform/opacity，並以 DevTools Performance 驗證瓶頸。

## 深入理解

樣式計算成本與受影響元素範圍、DOM 規模和更新頻率有關。強制同步 layout 常發生在寫入樣式後立即讀 offsetWidth、getBoundingClientRect 等幾何資訊。

## 實作與驗證

錄製互動並搜尋 Forced reflow 或長時間 Layout。把一輪事件中的尺寸讀取集中在前、DOM 寫入集中在後；必要時用 requestAnimationFrame 安排視覺更新。比較每幀 style/layout 時間。

## 常見誤區與取捨

過度追求短 selector 通常收益有限；若真正瓶頸是大量節點或重複渲染，改 selector 不會解決。

## 延伸閱讀

- [原系列第 12 篇](https://ithelp.ithome.com.tw/articles/10272938)
- [返回課程總覽](./index.md)
