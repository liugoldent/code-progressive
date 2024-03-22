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




