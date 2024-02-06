---
description: vue 面試常見問題
tags: 
    - javascript
    - Test
    - Vue
    - Vue2
    - Vue3
---
# [面試] Vue3

## Vue 與 React 對比
### 相同點
* 都有組件化思想
* 都有支持SSR渲染
* 都有Virtual DOM
* 數據驅動視圖
* 都有支持native的方案。`Vue`：`weex`、`React`：`React Native`。
* 都有自己的建構工具：`Vue`：`vue-cli`。`React`：`create-react-app`

### 差異點
* 數據變化的實現原理不同。`react`是不可變的數據、`Vue`是可變的數據
* 組件通信不同。`React`是透過回調函數來進行通信。`Vue`是事件or回調函數
* diff算法不同。`React`是用diff演算法來看需要更新哪些DOM，得到patch樹，再統一操作批量更新DOM。`Vue`是透過雙指針邊對比邊更新DOM。

## 雙向綁定是什麼
* 當用戶與UI進行交互，改變UI的值之後，數據模型會跟著改變。
* 反過來，當數據模型的值發生改變，UI也會自動更新反應
## 響應式
* 當數據發生變化時，相關的UI會自動去更新反應這些變化，而不需要透過手動編寫代碼來處理數據和UI之間的同步

## SPA vs MPA
### SPA
* 一個主頁和多個頁面片段
* 局部刷新
* url mode：hash mode
* SEO：難以實現，可使用SSR改善
* 數據傳遞：容易
* 頁面切換：速度快、用戶體驗良好
* 維護成本：容易
### MPA
* 多個主頁面
* 整頁刷新
* url mode：history mode
* SEO：容易實現
* 數據傳遞：通過url、cookie、localStorage實現
* 頁面切換：切換加載資源、速度慢、用戶體驗差
* 維護成本：複雜

## history mode vs hash mode
### history mode
* 透過 HTML5 history API 裏的 `pushState()` 和`replaceState()` 方法，以及瀏覽器的 `popstate` 事件來實現
* 優點：對url更加友好，更符合傳統網站的URL格式，對SEO更加有利
* 缺點：需要伺服器的特殊配置，並且在刷新頁面時會向服務器發送新的HTTP請求，可能會增加服務器的負擔與網路流量
* 缺點解釋：必須確認後端有相對應的配置才行，如果沒有後端的配置，使用者直接輸入網址，就會被導到404 error頁面

### hash mode
* 用`#`後面的網址來當作路由。路由的切換不會向伺服器發送新的HTTP請求，所有切換都是在客戶端進行，不會影響伺服器
* 優點：不需要server端特殊配置，所以對SPA較簡單，可以在不刷新頁面之下，實現路由切換。
* 缺點：對URL看起來不太友好、在SEO優化方面也有一定局限性。（在爬蟲時，不會讀取到`#`之後的內容，因為會把`#`當作錨點）

## v-if vs v-show
### 編譯時機
* v-if：在DOM上會真正的消失
* v-show：只是在CSS上加上display: none的CSS屬性

### 性能表現
* v-if：在頻繁切換的場景，性能表現較好
* v-show：在頻繁切換且元素結構穩定的場景，v-show更適合

## Vue實例掛載的過程中發生了什麼?
1. 初始化實例
2. 模板編譯
3. 創建虛擬DOM
4. 掛載（mount）:在這階段Vue將虛擬DOM掛載到真正的DOM上。這過程發生在beforeMount & mounted之間
5. 數據響應式
6. 完成掛載（mounted）

## 生命週期
### 資料請求放在created or mounted的區別
* 在mounted時，有可能會造成頁面閃動（頁面DOM已經完成）
* created：是在組建實例一旦完成立刻調用，這時候節點尚未生成
* mounted：是在頁面dom渲染完成之後就立刻執行。



