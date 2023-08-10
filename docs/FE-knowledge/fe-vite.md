---
description: Vite
tags: 
    - Vite
    - frontend
---

#  [FE] Vite
## 概念
* 為了解決開發伺服器啟動很慢，大一點甚至高達幾秒或幾分鐘
* 熱重啟、熱更新Hot Module Replacement 緩慢
* Webpack需要將全部程式碼打包，Vite則是將原始碼丟給瀏覽器，省略了打包編譯的那一段。
* Vite在你請求特定頁面時，再去向devServer請求，透過devServer做一點簡單的處理後，就傳給瀏覽器，不用每次編輯or整包編譯
## 過往的JS開發 - 各種模組化標準
* AMD：Asynchronous Module Definition。主要依賴requireJS
* CMD：Common Module Definition。從AMD改良而來
* UMD：Universal Module Definition，主要為了解決前後端共用
* CommonJS：主流用於Node.js，但Node.js 13.x之後，開始支援可以用ESM

## Vite主要技術
* 開發時：使用ESM(ES6 Modules) + Koa.js + esBuild
* 打包時：使用Rollup

## 文章來源
1. [終究都要學 React 何不現在學呢？ - React Vite - Vite 淺談與 GitHub 部署 - (23)](https://ithelp.ithome.com.tw/articles/10303608)

