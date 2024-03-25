---
tags: 
    - javascript
    - Test
    - 前端效能優化
---
# [FE] 前端效能優化-2
[Web前端效能優化大補帖筆記](https://www.books.com.tw/products/E050147683)

## build process optimization（組建流程優化）
## 4-1 拆分應用的bundle - code splitting & dinamic import
### code splitting
* 為了要解決單一JS Bundle過於肥大的問題，將原本單一的bundle切分成數個小chunks，可以搭配平行載入，或者是有需要時才載入某些特定的chunks，又或是對一些不常變動的chunks個別做快取來達到載入效能的優化
* 常見的code splitting 
    * 獨立抽離第三方套件
    * 動態載入模組：Dynamic import
### webpack bundle analyzer
* 可以視覺化分析專案有哪些bundle chunks，以及各個bundle chunks的組成為何
* 可以清楚看出專案哪些需要優化
### 抽離第三方套件
#### 將所有第三方套件打包為單一檔案
* Application Bundle：UI畫面與商業邏輯，跟我們寫的程式有關，是經常變動的部分
* Vendor Bundle：第三方套件（node_modules），不太會變動。拆分出來主要是因為他變動頻率較低，可以被快取，因此加快了網站載入速度。優點為邏輯簡單、缺點為更新第三方套件會使快取失效
#### 將第三方套件打包成多個檔案
* 優點為可以根據套件的關聯性打包，減少更新的延遲。缺點為需要處理的邏輯複雜許多。

### Dynamic Import
* 需要用到某段程式碼時，才透過網路載入JS Bundle

#### 根據路徑做Dynamic import
* 當使用到其component，才lazy import
```js
const Home = lazy(() => import('./routes/Home'))
```
#### 根據肥大套件做Dynamic Import
* 先用webpack bundle analyzer分析後，將最肥大的做dynamic import

## 4-2 移除用不到的程式碼tree-shaking
* 將用不到的程式碼遙落下來。讓打包工具在打包階段就可以分析哪些程式碼或哪些函式用不到，而把他們從最終的bundle移除，確保最後的bundle不會包含無用或多餘的程式碼與資源，以此減少bundle size。
### 如何做到tree shaking
* 歸功於es6模組化匯入與匯出的幫助
* es6 module
    * 只能在module頂層的陳述式出現（Dynamic Import 不算）
    * import的module name不能是動態的
    * import binding是immutable的
#### 訣竅
* 使用babel時，不要transpile成commonJS
    * babel預設將import export轉譯成commonJS，這樣會讓tree shaking失效
* 盡量讓exports的模組保持原子性
    * 避免：export一個擁有許多屬性與方法的物件
    * 避免：export default一次加入許多東西
    * 避免：export一個有許多屬性與方法的類別

### 為什麼dynamic imports無法做tree shaking
* 因為打包工具不會知道這個module會不會被載入

### 使用第三方套件時，小心謹慎
* 如果我們只需要第三方套件的少許功能，卻把整包套件打包進最後的bundle就得不償失了
* 例如過往loadsh在打包時會整包進入，但後來官方建議使用lodash-es，來改善tree-shaking功能。

### 如何製作一個具有tree shakingk功能的模組
#### package.json
```json
{
  "name": "your-module",
  "version": "1.0.0",
  "main": "index.js",
  "module": "index.mjs",
  "sideEffects": false // false，代表告訴bundler這個modules沒有side effect，可以勇敢tree shaking
}
// or
// 把確認沒有side effects的檔案才加入讓他做tree shaking
{
    "sideEffects": [
        "dist/*",
        "es/components/**/style/*",
        "lib/components/**/style/*",
        "*.less"
    ]
}
```

#### module 
```json
{
    "main": "src/index.js",
    "module": "es/index.js"
}
```
#### webpack
```js
// webpack.config.js
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    // Set the export mode to "module" to produce ES6 modules
    // This will help tree shaking to work effectively
    module: true
  }
};

```

## 4-3 犧牲支援度減少Bundle Size
* Polyfill-less Bundling Script
* 能夠被大約95%左右瀏覽器支援的新語法or功能，就可以稱為modern JS
### transpilation
* 主要是為了讓舊瀏覽器可以支援新的JS。例如把js code丟進babel這樣的transpiler裡轉譯成較舊版本的JS

### 為了效能要犧牲舊版瀏覽器的用戶？
* 可以兼顧，但就必須要打包成兩份bundle.js
* 根據使用者的瀏覽器版本，來決定要載入哪個版本的js bundle
```html
<!-- 編譯成es2017版本 -->
<script type="module" src="modern_module.js"></script>
<!-- 編譯成es5版本 -->
<script nomodule src="fallback.js"></script> 
```

### 如果是一個node專案呢
* 在package.json中設定不同進入點
* exports：modern.js
* main：給舊版本的使用
```json
{
    "name": "foo",
    "exports": "./modern.js",
    "main": "./legacy.cjs"
}
```

### 檢測modernJS對網站效能的影響
* Estimator.dev，可以貼上寫要檢測的網址






































