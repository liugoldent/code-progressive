---
sidebar_position: 22
title: "Day 22｜Web Workers"
description: "前端效能優化第 22 堂：Web Workers 的觀念、實作、驗證與常見誤區。"
---

# Day 22｜Web Workers

> 本篇是對 2021 年原系列第 22 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** Worker 在背景執行緒處理 CPU 密集任務，避免阻塞 UI；透過 `postMessage` 傳遞資料，不能直接操作 DOM。

**解答：** 把純計算封裝進 Worker，主執行緒只傳入資料並接收結果；大量二進位資料用 transferable objects 避免完整複製。Worker 內回報進度與錯誤，元件卸載或任務取消時呼叫 `terminate()`。

**適合：** 大量計算、資料解析、影像處理。短小工作可能不值得支付啟動與序列化成本；大型資料可研究 transferable objects。

## 深入理解

Worker 與主執行緒之間傳訊，適合可獨立運算的 CPU 工作；它無法直接存取 DOM。結構化複製可能昂貴，ArrayBuffer transferable 可移交所有權以減少複製。

## 實作與驗證

挑選可重現的重計算操作，先量主執行緒 long task 與互動延遲。把純計算移至 Worker，加入任務 ID、取消、錯誤與進度訊息；比較總完成時間與主執行緒阻塞時間。

## 常見誤區與取捨

Worker 不保證總耗時更短；啟動、傳輸、複製及背景 CPU 競爭都有成本。小型同步工作先切片可能更簡單。

## 範例：把純計算移出主執行緒

```js
// main.js
const worker = new Worker(new URL('./calculate.worker.js', import.meta.url), { type: 'module' });
worker.postMessage({ id: 1, numbers: [1, 2, 3] });
worker.onmessage = ({ data }) => console.log(data.id, data.total);
// 頁面或功能不再需要時：worker.terminate();

// calculate.worker.js
self.onmessage = ({ data }) => {
  const total = data.numbers.reduce((sum, value) => sum + value, 0);
  self.postMessage({ id: data.id, total });
};
```

例子刻意簡短，實際上三個數字直接在主執行緒計算更划算。只有當計算造成可量測的長任務，且移轉後互動保持流暢，Worker 才值得引入。

## 延伸閱讀

- [原系列第 22 篇](https://ithelp.ithome.com.tw/articles/10278559)
- [返回課程總覽](./index.md)
