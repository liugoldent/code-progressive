---
tags: 
    - javascript
    - Test
    - 前端效能優化
---
# [FE] 前端效能優化-1
[Web前端效能優化大補帖筆記](https://www.books.com.tw/products/E050147683)

## 程式碼最佳化
### Minify
* 從原始碼中移除不必要的字元的過程。
* 不必要的字元：空白鍵、註解、分號
* 效果最好：usbuild
### Uglify
* 將原本很長的變數或函式名稱、參數替換成簡短的字元，用意在降低檔案大小
* 效果最好：UglifyJS & Terser


### 如何達到Minify & Uglify
* 使用Webpack打包，並且設定bundler的config
```js
plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
```
### 如何Debug
* 使用source.map

## 圖片資源最佳化
* 通常圖片是佔比最多的資源

### 圖片種類
#### JPEG
* 有損壓縮
* 使用只取部分像素資料的方式來壓縮圖片大小
* 適合大背景圖
#### PNG
* 無損壓縮
* 壓縮後不影響圖片品質
* 圖檔最大

#### SVG
* 優點：
    * 放大多少都不會模糊
    * 體積比點陣圖小
    * 可以透過gzip壓縮
* 使用場景：
    * 較小的圖片
    * 不希望產生圖片失真、邊緣有模糊情況
    * 主要由幾何圖形產生
* 可以透過svgomg來降低圖檔大小

#### WebP
* 有較小的優勢
* 無損壓縮
* 支持動圖


### 響應式圖片
* 運用DPR去決定適合的圖片
#### srcset use DPR
```html
<img src="xxxx.jpg"
srcset="yyyy_1x.jpg 1x, yyyy2x.jpg 2x" />
```

#### srcset use w
```html
<img src="xxxx.jpg"
srcset="yyyy_1x.jpg 300w, yyyy2x.jpg 600w" />
```

#### picture
* 可以裝有多個`<source>`element的Wrapper，會由上而下決定選出適合目前的情況的source
```html
<picture>
    <!-- 大於800px的狀況下，會依照DPR的大小去決定要哪個圖片 -->
  <source srcset="/media/cat-240.jpg"
          media="(min-width: 800px)">
  <img src="/media/cat.jpg 1x, /media/dog.jpg 2x">

  <source srcset="/media/cat-240.jpg"
          media="(min-width: 500px)">
  <img src="/media/cat.jpg">
</picture>
```

### image DCN
* 上述說的比較像是設計師有出好尺寸
* 但有時如果設計師沒給圖片，有另外的CDN服務可以使用
    * imgix
    * Cloudinary

### webpack plugins
* url-loader：可以去設定圖片只要在limit以內，就將圖片轉為Base64，就不需要額外的request去拿檔案，直接抓檔案就好（但會限制limit）。
    * 但要注意的是有可能會造成js過於肥大的問題
* file-loader

#### Base64優缺點
* 書中建議：icon or 縮圖較小的圖片可以用
##### 優點
* 直接抓取檔案，這樣可以減少Http Request

##### 缺點
* 平均來說比二位元檔案還大，所以不適用於小圖
* 維護上困難：圖檔若有改動，整個編碼會不同
* 不是圖檔不會被瀏覽器快取
* 檔案會變大。Base64編碼會產生字串，若圖片太大，會導致編碼後字串變得非常長，增加檔案大小

### image Sprites
* 優點
    * 可以減少請求量（因為是多張圖合併為大圖）
* 缺點
    * 不好維護，如果改小圖可能會影響到大圖


## 檔案壓縮
* 圖片、影片、音訊的壓縮，可以減少的檔案大小比文字檔案更多更明顯
### 有損壓縮
* 會對原本數據進行修改，但會以使用者無法察覺的方式進行

### 無損壓縮
* gif、png

### end to end compression
* client端發起壓縮，在server端完成壓縮，直到回傳給client端，才會由client端解壓縮得到原始檔案。中間不管經過幾個代理節點，都不會改變壓縮後的response body
* 方法：gzip、brotli
* how to：在header上加上指令
    * accept-encoding：br, gzip
    * 伺服器在收到header後，依照瀏覽器的優先層級選擇一種壓縮演算法對response body壓縮，並在reponse header中帶入content-encoding，告訴他最後選擇了哪種壓縮演算法，讓瀏覽器知道怎麼解壓縮。
    * 可加入vary的header，並且帶入accept-encoding，如此一來，瀏覽器就可以針對經過不同壓縮演算法的文件進行快取
* 其一說法：壓縮會耗資源，所以建議把壓縮拉到反向代理層級實作（Nginx Web Server）
* nginx：ngx_http_gzip_module

## Adaptive Serving
### Network information API
* 根據使用者的網路狀況來決定要提供高品質or低品質的圖片或影片
* 決定要不要preload一些資源
* 在使用者網路狀況不好時，啟動offline mode
* 搜集一些關於網路使用者網路狀況的analytics資訊
* 如何使用
```js
window.navigator.connection.addEventListener('change', onchangeFunc)
// 物件參數
NetworkInformation = {
    downlink: 10,
    effectiveType: '4g', // 網路狀況
    onchangeFunc: null, // 當網速改變時，觸發這個function
    rtt: 50, // 連線延遲時間
    saveData: false,
}
```

## 渲染流程優化
* render process optimization
### 歷史：Single And Multiple
* 過往的瀏覽器是Single Process
* 現在的是Multiple
    * 解決問題1：不穩定性（因為多個process，所以當頁面失去回應時，只會影響到他們目前所執行的process）
    * 解決問題2：不流暢（同一的原因）
    * 解決問題3：不安全（multiple的會製作出隔離環境）
    * 缺點：更多process，更多記憶體被佔用
    * 缺點：系統架構更複雜：也要考慮是不同的process溝通

### 渲染引擎運作機制
* 每一個Tab都會產生一個獨立的renderer process
* 詳細流程可以參考「渲染流程篇章」
### 控制js的載入時機
* 如果可以css的檔案要盡快引入，js則在css之後，因為js執行會造成網頁載入的暫停
#### async script
* async 會非同步去請求外部腳本，回應後停止解析HTML，馬上執行腳本內容
* example：google ananlytics
#### defer sctipt
* defer也會非同步去請求外部腳本，但是會等執行解析完HTML才執行
* 但要注意就是會照script tag順序去執行（由上往下）

### 優化資源載入時機
* 使用resouce hints（將將來會運用到的資源，預先處理）
#### preload：
* 用來取得「目前頁面」的重要資源，例如縮圖的影片（越快下載越好）
#### prefetch
* 這些資源待會會用到，先幫我下載（不限於此頁面使用）
#### preconnect
* 這個網頁會在不久的將來用到，請先幫我建立好連線
* 通常只會對確定短時間內就會用到的domain做preconnect，因為如果10秒內沒有使用，會自動把連線close
* 如果網站中有很多資源要從CDN拿取，可以preconnect CDN的域名
* streaming 串流媒體
* Dynamic URL request
* 耗費較多頻寬
* 最關鍵的connection使用這個。因為還要解析DNS
#### dns-prefetch
* 支援度較好
* 為preconnect子集
* 建議與preconnect一起使用（原因在於瀏覽器支援度）
* 不會建立連接，而只是告訴瀏覽器在空閒時解析 DNS，以便在需要時更快地建立連接
* DNS-Prefetch可解省第一步DNS Resolution時間
#### prerender
* 盡可能預先渲染下個頁面
* 不僅下載對應資源，還會對資源進行解析
#### as attribute
* 瀏覽器會對於有as屬性的，去判斷是否要先下載
```html
<link rel="preload" as="font" type="font/woff2" href="myfont.woff2">
```

## virtualized list
* 只渲染可視區域的列表元素，根據可視區的offset大小以及所有列表元素的位置，計算在可視區應該渲染哪些元素

### 框架
* react：react-window、react-virtualized
* vue：vue-virtual-scroll-list、vue-virtual-scroller
* svelte：svelte-virtual-list

## 延遲載入
* lazy-loading：要用到時，再載入

### 圖片的lazy load
* 搭配intersection observer web api，偵測目標元素是不是與特定位置交會，交會再去載入新的圖檔
* 瀏覽器原生支援的attribute
* loading屬性
    * auto：等同於沒有加，會採取預設行為
    * lazy：當圖片一開始就在viewport內，或靠近viewport時開始載入
    * eager：不管圖片在哪，就是馬上載入
* 不是每個圖片都適合做lazy loading，如果一開始就在viewport上或很靠近，就不應該，因為要做這個瀏覽器還要先判斷圖片的位置（多做一件事的概念）
* 記得使用這個時，圖片都要先撐開，避免造成版面之後的位移，影響使用者體驗與CLS分數。
* 不用等到真的出現在viewport才載入
```html
<img src="xxx.jpg" loading="lazy" alt="image alt" width="200" />
```

### lazy loading with intersection observer
* intersection observer web api：作用是「監聽目標元素在畫面上出現或離開的時機，並執行我們給予他的call back」
* 不建議滑到一半就載入是因為怕浪費（搞不好使用者根本不想滑）
```js
// 如果要使用
const intersectionObserver = new IntersectionObserver((entries) =>{

})
intersectionObserver.observer(document.querySelector('.demo-box'))

// 如果取消了
intersectionObserver.unobserve(
    document.querySelector('.demo-box')
)
```

## CSS 效能優化
### selector 效能
1. ID selector
2. class selector
3. element selector元素選擇器
4. general sibling combinator兄弟選擇器
5. child combinator子選擇器
6. descendant combinator後代選擇器
7. attribute selector屬性選擇器
8. pseudo element / class selector偽元素選擇器
9. notice不要亂用「*」，因為css是從右到左搜尋，所以會耗效能

### 避免之事
* 並不是都用ID就好：因為在開發時，命名可能不是那麼好維護，除非非常確定是唯一值
* 避免在ID or class 前限定元素
```css
/* 不建議，因為#navbar已經找到元素了，還在找div浪費時間 */
div#navbar {

}
```
* 建議語法
```css
/* 建議用以下，因為只會找一層 */
div>p {

}
/* 不建議用以下，因為子層都會被找 */
div p {

}
```

* 非必要狀況，避免使用昂貴的attributes
    * :nth-child
    * filter
    * opacity
    * box-shadow
    * border-radius

* 減少reflow
    * 改變元素margin or padding
    * 改變元素的width、height、position的left or top
    * 改變font-size or font-family
    * 改變視窗大小
### 可以做
* extract critical css
    * 翻譯：只把可視範圍的css提取出來，直接內聯到HTML的技術
    * 如何使用：critical、critical CSS、pentHouse
* preload resources defined in CSS
* preload CSS files

### CPU GPU Acceleration
[will-change](https://alex-ian.me/will-change)
* 主要是硬體加速
* 再次強調，使用transform，因為他不會觸發reflow、repaint
* 例如說3D的transform，該元素會被提升到一個單獨的圖層
* 一些css屬性，會被歸類於GPU accelerated properties
    * transform
    * filter
    * opacity
* transform Hack
    * 讓二維假裝成三維
    * transform: translate3D(0, 20px, 0)
* will-change
    * 提早通知瀏覽器，有什麼未來對元素做什麼類型的操作，讓它做好加速準備
    * 技巧：不要使用「*」去加上will-change
    * 技巧：變更生效後移除will-change屬性
```css
will-change: transform;
will-change: transform, opacity;
```





