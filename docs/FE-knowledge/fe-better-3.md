---
tags: 
    - javascript
    - Test
    - 前端效能優化
---
# [FE] 前端效能優化-3
[Web前端效能優化大補帖筆記](https://www.books.com.tw/products/E050147683)

## 快取與網路機制
## 5-1 Http Cache
### 基本觀念
* 快取：像是提供一個額外的儲存空間，將可能透過請求得到的資料放在裡面，當之後要再請求資料時，先別急著發出需求，確認如果快取沒有，就再去發送要求取得。
* 適合被快取的資料特性：
    * 很常被使用到
    * 資料不常變動
* 快取優點：
    * 降低延遲
    * 減少bandwidth
    * 減輕server壓力
### cache hit vs cache miss
* cache hit：
    * 代表發出請求時在快取就找到想要的資源
* cache miss：
    * 快取中找不到想要的資源，必須再去跟origin server拿
### public cache vs private cache
#### public cache
* 指快取伺服器上存的回覆能給好幾個不同的請求者服務，例如經過代理伺服器（Proxy server）的快取，這個快取的資料可以提供給多個使用者使用。
#### private cache
* 只有這台電腦使用者可以使用的快取資源
### Http caching
* 例如電商網站的圖片，不可能一樣的照片每次都要重load，這時就會把圖片資源放到快取中，只有第一次進入網頁需要load，其他時間就使用快取資料
* 關鍵字：from『disk cache』，就表示來自瀏覽器的快取
* 是避免瀏覽器向伺服器發送不必要請求的一道防線，要啟用HTTP Cache需要伺服器端與瀏覽器端事先經過協商，判斷這資料是否過期，需要重新向伺服器抓取之類的

#### expires
* 較舊的技術
* 伺服器在Response Header加入Expires屬性（後續有對相同資源做請求時，瀏覽器就會去檢查使用者現在的時間是否有超過expires的過期時間）
* 但資料過期與否，是根據使用者電腦的時間決定，如果使用者亂調，那所有快取都會被認定為過期

#### cache-control
* 通常會搭配max-age給一個相對時間
```shell
# 代表使用者在收到response的60秒內，如果再對相同資源發出請求，就會得到快取的版本
# 超過則再發出請求
cache-control: max-age=60

# 不要保留在Client端，而是每次都到Server抓取
cache-control: no-store

# 會對該資源做快取，但之後如果有對資源請求，會額外詢問伺服器是否有新版本要提供
cache-control: no-cache

# 只可以被瀏覽器儲存起來
cache-control: private

# 可以被任何快取儲存起來
cache-control: public

# 覆寫max-age or expires標頭，不過只對nginx有效
cache-control: s-maxage
```

### （快取過期）last-modified && if-modified-since
#### last-modified
* 出現在response header中，告訴瀏覽器這個檔案上次改是何時
#### if-modified-since
* 出現在request header中，用來跟伺服器確認檔案在某個時間點後是否有被更改
* 如果沒改過，伺服器就會回傳一個304的status code，代表not modified
#### 問題
* 因為是根據檔案的編輯時間來做判斷，所以如果只是打開重新存擋，內容沒變更，因為編輯時間改動，伺服器會認為此檔案有經過改變。更好的做法是判斷檔案有無被修改

### （快取過期）etag & if-none-match
* etag：相同內容的檔案產生獨一無二的etag，就算是加一個空白or標點符號也會導致etag改變
* 在response header帶入etag，並讓瀏覽器存起來
```shell
cache-control: max-age=86400
Etag: 'xxxxxxx'
```
* 等快取時效過後，使用者又請求相同資源，讓瀏覽器在request header中帶入。伺服器去檢驗瀏覽器帶過來的etag是否相符，相同代表檔案沒變
```shell
if-none-match: 'xxxxxxx'
```
#### 避免mid-air Collisions
* 避免同時有多人編輯的狀況，也可以用etag
* 當view mode切換成 edit mode時，可以先記錄起etag。然後修改完再去檢查etag是否相同

### cache busting
* 一種為檔案建立一個獨立識別的檔名，只要檔名改變了，瀏覽器就認為這是一個新的檔案，需要重新跟伺服器抓取

### memory cache vs disk cache
* memory cache：把資源放在memory上，效能會比disk快，但缺點是存在裡面的資料缺乏持久性，當關閉瀏覽器時，存在內的memory cache會被清空

## 5-2 Service workers cache
### service workers 基本：
* 是一層在瀏覽器與network之間的proxy，擁有攔截使用者發出請求的能力（透過監聽fetch事件），可以攔截請求後，決定要不要回傳快取的內容
* 優先級別高於上面的Http Caching，為前端可控範圍的第一道防線
* service workers 無法操作DOM，並且需要依賴postMessage來與頁面溝通
* 自己撰寫較難，建議配合workbox
### service workers 應用：
* service workers的cache實現離線瀏覽功能
* 像native App一樣的推播功能
* Background sync

### service workers 限制：
* 網站必須支援localhost or https
* 第二個參數為可作用範圍
* 靠事件監聽機制，來控制SW的生命週期

### install
* sw註冊成功之後，瀏覽器會在背景啟動一個service worker並開始安裝，這邊對應到install事件，通常在安裝階段會快取一些靜態資源，以供離線瀏覽使用，如果指定快取都成功，就會進入到activate
* 如果有快取失敗，整個安裝都會失敗，就會進入error狀態，並等待下一次重新install
```js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/main.css',
        '/scripts/main.js'
        // 其他要缓存的资源
      ]);
    })
  );
});
```

### activate
* 在這階段，開發者可以指定sw做一些事，例如清除舊的快取
```js
self.addEventListener('activate', event => {
  // 在这里执行一些初始化操作，如清理旧缓存

  // 获取所有缓存的名称
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // 对于所有缓存
      return Promise.all(
        cacheNames.map(cacheName => {
          // 如果缓存的名称不是当前缓存名称
          if (cacheName !== 'my-cache') {
            // 删除该缓存
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```
### fetch
* 擁有攔截使用者發出請求的能力，而這個攔截能力就來自於fetch事件（去快取看有沒有使用者要的資源，如果有就快娶回傳，沒有就再發出網路請求）
```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

### 為何要使用service workers
* 因為可以用程式碼來攔截網路請求後要做什麼處理
* 更細粒度的控制
* 可以做offline離線瀏覽功能
    * cache-control：本身設計不是針對離線瀏覽
    * http cache需要經過伺服器與瀏覽器的協商，如果在離線前沒有造訪過一些頁面，就不會有那些頁面的快取。而service workers可以透過程式決定要快取哪些資源，不一定造訪過才能將資源存到快取。

### cache strategies
#### 常見的五種策略
##### cache only
* 無論如何，只回傳快取版本
##### network only
* 無論如何，直接發出網路請求
##### cache falling back to network
* 常見，如果cache失敗，則去找網路。適合offline first。
##### network falling back to cache
* 強調使用網路優先，如果資源變化頻率很高，就適合發出網路請求以確保拿到最新資料。如果網路失敗則使用快取
* 適用於使用者體驗（但還是要考慮到如果使用者的連線很慢，對體驗者不好）
##### cache then network
* 適用於變化頻率高的內容
* 當使用者對資源發出請求時，先直接回傳快取版本，同時去網路抓新的內容，當有新的內容時或資料時再更新快取

## 5-3 CDN
* 使用CDN加快網站存取速度（對域名加速）
* 優點：
    * 跨地域的全網覆蓋與有效節省頻寬：所有使用者向不同伺服器讀取資料，充分利用頻寬資源與平衡網站流量
    * 節省成本：透過第三方Provider。幫我們處理了不同節點伺服器之間的狀態與資料同步
    * 異地備援：當某個伺服器故障時，系統會自動切到另一個鄰近的節點來處理請求，讓系統做到永不中斷服務
    * 提高安全：Load Balancing與分散式儲存技術可以加強網站的可靠性
* 適合放長時間不會變動的資源，如圖片or影音串流or一些CSS與js檔案
* 如何處理內容更新的狀況：提供URL推送的功能，通知CDN節點某些資料更新了，要把對應資源快取清除
* 如何區分需要被快取與不需要被快取的資源？
    * 變動性或即時性較高的資源，放到沒有使用CDN的域名
    * 也是要分成兩個域名

## 5-3-1 前端快取優先層級
* memory cache -> service workers cache -> disk cache -> cdn cache

## 5-4 application shell architecture
* 為PWA的要素之一，除了提升使用者體驗與載入速度外，也是實現離線瀏覽的一個關鍵
* app shell：
    * 把UI上不變動的部分（navbar、footer）與需要動態抓取（dynamic content）的部分拆分開來
    * 至少把大架構分出來。即使沒有網路，使用者仍然可以看見app shell 建立出的骨幹畫面，剩下畫面都是透過網路動態抓取
    * 第一次渲染會比較久，因為要註冊service worker


## 5-5 stale while revalidate
```shell
cache-control: max-age=1, stale-while-revalidate=59
```
* 概念：第一次發出request時，瀏覽器會將回傳的資料存到快取裡，當又有相同的request時，瀏覽器優先回傳快取版本，以提升使用者體驗。並且在background去驗證快取的資料是否已經過期，如果需要更新就會抓取最新資料並更新快取，當下次又有請求時，就可以拿剛剛更新過並存到快取的資料

## 5-6 HTTP升級
* 盡可能將HTTP升級
### HTTP1.1的限制
#### head-of-line blocking
* 只能透過串行的方式處理請求，代表每個請求必須等排在前面的需求處理完才能發送出去
* 只有get & head請求才能使用
#### 連線限制

#### header無法壓縮

### HTTP2
* 解決了HTTP1的pipelining head-of-line-blocking
* 解決header無法壓縮
* HTTP2沒有解決TCP HOL問題
* 優點：
    * 並行發送多個請求，且請求間互相不影響
    * 並行發送多個回應，且回應之間不影響
    * 使用單一connection並行發送多個request & response
    * 提高網路頻寬的使用效率
* 多了server push：可以從client端請求得知客戶端可能還會需要哪些資源，主動將這些資源發給client
* 如何升級
    * 使用HTTPS
    * web server支援升級

### HTTP3
* 使用以UDP為基礎的QUIC機制來解決TCP head-of-line blocking問題
















































