---
sidebar_position: 7
title: "Day 07｜Image Sprites"
description: "前端效能優化第 7 堂：Image Sprites 的觀念、實作、驗證與常見誤區。"
---

# Day 07｜Image Sprites

> 本篇是對 2021 年原系列第 7 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** Sprite 將多張小圖合併，藉此減少 HTTP 請求；透過 background position 顯示其中一塊。

**解答：** 若專案仍有大量不常變動的小型點陣圖，可合成 sprite 並以 `background-position` 顯示；現代圖示則優先使用 SVG sprite 或元件。先從 Network 面板確認請求數真的是瓶頸，再決定是否採用。

**取捨：** HTTP/2 之後多請求成本下降，加上 SVG icon、字型圖示與元件化工具成熟，Sprite 不再是所有專案的預設答案。它仍適合大量固定小圖，但會增加維護與快取失效成本。

## 深入理解

Sprite 的原始收益是減少 HTTP/1.1 多請求的連線成本；HTTP/2／3 下仍可能有請求與解碼成本，但合併所有圖也會產生快取與更新耦合。

## 實作與驗證

在 Network 找大量小圖造成的等待，再比較 SVG sprite、單獨 SVG、CSS 圖示與現有元件庫。若採用 sprite，記錄每個圖示的尺寸與定位，替互動圖示提供文字名稱與焦點樣式。

## 常見誤區與取捨

不要因為使用 sprite 就省略無障礙標籤。單一圖示更新導致整張 sprite 重新下載，可能抵消部分收益。

## 延伸閱讀

- [原系列第 7 篇](https://ithelp.ithome.com.tw/articles/10269639)
- [返回課程總覽](./index.md)
