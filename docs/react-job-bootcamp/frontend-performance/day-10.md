---
sidebar_position: 10
title: "Day 10｜Virtualized List"
description: "前端效能優化第 10 堂：Virtualized List 的觀念、實作、驗證與常見誤區。"
---

# Day 10｜Virtualized List

> 本篇是對 2021 年原系列第 10 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 長列表不應一次建立所有 DOM。Windowing 只渲染可視區及少量 overscan，以占位高度維持捲動感。

**解答：** 計算目前 scroll offset 對應的起訖索引，只 render 可視資料加少量 overscan，外層保留完整總高度，內容以位移放到正確位置。實務上優先選用 `react-window` 等套件，並為每列提供穩定 key。

**實務：** 處理固定／動態列高、鍵盤焦點、捲動位置與無障礙；React 可使用成熟虛擬列表套件，不必每次重造輪子。

## 深入理解

虛擬列表用較少 DOM 表示大量資料，總資料量不會因此減少。固定列高容易計算位置；動態列高需要量測與位置修正，還要照顧捲動錨點及鍵盤導航。

## 實作與驗證

先用 Performance 比較 100、1000、10000 筆的初次渲染與捲動幀率。只有在 DOM、layout 或記憶體成為瓶頸時加入 virtualization；設定合理 overscan，測試快速捲動、搜尋定位和展開列。

## 常見誤區與取捨

無限載入是分頁資料策略，虛擬列表是渲染策略。兩者可以併用，也可能只需其中一種。

## 延伸閱讀

- [原系列第 10 篇](https://ithelp.ithome.com.tw/articles/10271764)
- [返回課程總覽](./index.md)
