---
sidebar_position: 13
title: "Day 13｜CSS GPU Acceleration"
description: "前端效能優化第 13 堂：CSS GPU Acceleration 的觀念、實作、驗證與常見誤區。"
---

# Day 13｜CSS GPU Acceleration

> 本篇是對 2021 年原系列第 13 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 瀏覽器可把某些元素提升到獨立 compositor layer，使動畫不必反覆 layout/paint。`transform: translateZ(0)` 等技巧不是免費加速器。

**解答：** 對確定會做 transform/opacity 動畫的元素可適量使用 `will-change`，動畫結束後移除；不要全站強制提升 layer。用 Layers/Performance 檢查合成層數、paint 次數與 GPU 記憶體是否真的改善。

**取捨：** 過多 layer 會增加記憶體、上傳紋理與合成成本。只在確認 repaint 是瓶頸時使用，並檢查 Layers 與 FPS。

## 深入理解

合成層可讓某些動畫繞過重新 layout/paint，但圖層本身需要記憶體與管理成本。GPU 加速是瀏覽器對特定繪製路徑的選擇，不是 CSS 宣告保證的結果。

## 實作與驗證

先在 Performance 確認動畫時有反覆 paint。將動畫改為 transform/opacity，再比較 frame time、paint 次數與 layer 數量；對短時間動畫可在開始前設 will-change，結束後移除。

## 常見誤區與取捨

不要對所有元素套 translateZ(0) 或 will-change；大量提升圖層可能造成記憶體壓力與掉幀。

## 延伸閱讀

- [原系列第 13 篇](https://ithelp.ithome.com.tw/articles/10273656)
- [返回課程總覽](./index.md)
