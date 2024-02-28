---
tags: 
    - CSS
    - Test
---
# [FE] CSS 
## CSS 權重
* !important > inline style > id > class > element > *

## RWD
* 瀏覽區域的寬度小於600像素，則下方的CSS描述就會立即被套用
```CSS
@media screen and (max-width: 600px){
    .class{
        background: #ccc;
    }
}
```
* 瀏覽區域的寬度大於900像素，則下方的CSS描述就會立即被套用：
```CSS
@media screen and (min-width: 900px) {
    .class {
        background: #666; 
    } 
}
```
* 瀏覽區域寬度範圍在321px~768px，則下方CSS描述會立即被套用：
```CSS
@media only screen and (min-width: 321px) and (max-width: 768px) {
    .class {
        background: #666; 
    } 
} 
```
[CSS media屬性判別使用](https://www.ucamc.com/articles/102-rwd-css-media-type)

## animate、keyframes
* @keyframes: 需要呈現的狀態（錄影帶）
* animation: 實際演出時的播放方式，包含速率、正反轉都可以調整（播放器，可使其正轉倒轉快轉）
```css
@keyframe rotate-a {
  from {
    transform: translateX(0%); 
  }

  to {
    transform: translateX(100%);
  }
}

div {
  /* 你要告訴CSS，你要播放的狀態為何（必要） */
  animate-name: rotate-a;
  /* 然後要告訴CSS，持續幾秒（必要） */
  animation-duration: 3s;
}
```

## title vs alt
* title：為滑鼠hover時的提示
* alt：圖片不能正常顯示時的本文提示

## CSS box-model
* content + border + padding

## CSS box-sizing
* content-box：設定的width / height = content（padding & border 會另外加上去）
* border-box：你設定的width / height = border + padding + content

## 如何讓div水平居中
```css
div {
  /* relative */
  margin: 0 auto;
}
```

## 如何垂直居中
```css
div {
  display: flex;
  align-items: center;
  justify-content: center;
}


div {
  position: relative;
  height: 300px;
  /* 上方50% */
  top: 50%;
  /* 高度的一半 */
  margin-top: 150px;
}
```

## display:none vs visibility: hidden
* display:none -> 在HTML不會給他空間
* visibility:hidden -> 在HTML還是會保留原來空間

## absolute vs fixed vs relative
* position：fixed -> 當滾動網頁時，元素與瀏覽器視窗間的位置不會被改變
* position：absolute -> 相對於父元素的定位，對上層有設定relative / absolute / fixed 的父元素進行定位，若都沒有則往body左上角靠近。
* position：relative -> 相對於自己位置移動

## content-box
* W3C：指的是content的高/寬
* border-box：border + padding + content

## overflow
* scroll：必定出現滾動條
* auto：子元素大於父元素時出現滾動條
* visible：溢出內容出現在父元素之外
* hidden：溢出隱藏

## flex vs block vs inline
* flex：無方向限制可自由排列
* block：主要是垂直排列
* inline：主要是水平排列

## reset 意義
* 主要是針對每個瀏覽器的不同初始化

## 浮動
### 浮動的問題
* 父元素高度無法被撐開，影響與父元素同級的元素
* 與浮動元素同級的非浮動元素會跟隨其後

### 清除浮動
* 父級div定義height
* 最後一個浮動元素後面加div元素
```css
div {
  clear: both;
}
```

## margin & padding
### margin
* 需要在border外側添加空白時
* 空白處不需要背景色
* 上下相連的兩個盒子之間的空白，需要相互抵消時
### padding
* 需要在border內側增加空白時
* 需要背景色
* 上下相連的兩個盒子的空白為相加時

## 單冒號：偽類。雙冒號：偽元素
* :before -> 不存在於dom中

## inline-height
* 具體來說是兩行文字基線之間的距離

## 動畫最小區間是16.7m
* 1/60*1000ms = 16.7ms

## style寫在body前後有什麼差別
* 主要是加載前後的問題，先寫先加載

## jpg、png、gif、webp
* jpg：破壞性的壓縮，主要用來儲存或傳輸照片
* png：壓縮比高、色彩好，無損壓縮
* gif：以8位元色現真色彩的圖像，可實現動畫效果
* webp：壓縮時間更久，但是壓縮率只有jpg的2/3、大小比png小45%

## px vs em vs rem vs %
* px：絕對單位，代表螢幕中的每個px
* em：相對單位，每個子元素透過倍數乘以父元素的「px」值。
* rem：相對單位，每個子元素透過倍數乘以根元素的「px」值。
* %：相對單位，子元素透過「百分比」乘以父元素的px值。


## 聖杯佈局與雙飛翼佈局的理解與差別
[q2](https://github.com/haizlin/fe-interview/issues/2)
* 相同
  * 理解：兩者同樣解決左右定寬以及中間自適應的三欄佈局。並且中間攔優先渲染
  * 但是低於最小寬度都會造成破版
  * 皆是用float
* 不同
  * 聖杯：用容器包裹三列，雙飛翼：3列分開佈局
  * 聖杯：使用position防遮罩，雙飛翼CSS使用負的邊距定位即可
#### 聖杯
* 核心是使用父盒子用padding預留區域，然後center設置寬100%，並且把中左右3個盒子做浮動。
由於浮動的效果且中間center寬度佔滿了全部，所以左右盒子被擠下去。
* 再來我們要把左右盒子放到padding給他們預留的地方
  * 左盒子：使用margin-right:-100%，移動到父盒子中心
  * 右盒子：直接margin-right:負值（父盒子預留的大小）
```html
<div class="wrapper1">
      <div class="main">
        <p>bilibili</p>
      </div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
```
```css
* {
    padding: 0;
    margin: 0;
  }
  .wrapper1 {
    padding: 0 60px 0 30px;
  }
  .wrapper1 .main {
    float: left;
    width: 100%;
    height: 300px;
    background: red;
  }
  .wrapper1 .left {
    float: left; /** 重要 */
    width: 30px;
    margin-left: -100%; /** 重要 */
    background: blue;
    height: 100px;
    position: relative;
    right: 30px;
  }
  .wrapper1 .right {
    float: left; /** 重要 */
    width: 60px;
    margin-left: -60px; /** 重要 */
    background: yellow;
    height: 200px;
    position: relative;
    left: 60px;
  }
```
#### 雙飛翼
* 核心：center通過包裹一個父元素(container)，給父元素設置width：100%與浮動
* 子元素用margin撐出其他兩塊的預留空間，然後在left & right上，拖過margin移動到對應位置上。
```html
<div class="wrapper2">
      <div class="container">
        <div class="main">
          <p>bilibili</p>
        </div>
      </div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
```
```css
* {
    padding: 0;
    margin: 0;
  }
  .wrapper2 {
    min-width: 630px;
  }
  .wrapper2 .container {
    float: left; /** 重要 */
    width: 100%; /** 重要 */
  }
  .wrapper2 .container .main {
    height: 300px;
    background: red;
    margin: 0 600px 0 30px; /** 重要 */
  }
  .wrapper2 .left {
    float: left; /** 重要 */
    width: 30px; /** 重要 */
    background: blue;
    height: 100px;
    margin-left: -100%; /** 重要 */
  }
  .wrapper2 .right {
    float: left; /** 重要 */
    width: 600px; /** 重要 */
    background: yellow;
    height: 200px;
    margin-left: -600px; /** 重要 */
  }
```




## 為什麼獲取clientWidth時，瀏覽器會重排與重繪
[q5387](https://github.com/haizlin/fe-interview/issues/5387)
在獲取`clientWidth`屬性時，瀏覽器會對當前元素進行重排與重繪  
`clientWidth`是元素的可見寬度（包含padding），但是不包含border、margin、滾動條寬度，當獲取`clientWidth`時，瀏覽器需要計算元素可見寬度，這個過程包含了瀏覽器的重繪。
注意：因為重排和重繪會佔用大量CPU資源，尤其頁面中有大量元素需要重排時，就會造成頁面性能下降。  
因此為了減少頁面的重排與重繪，建議盡量減少對`clientWidth`的繁複訪問或修改。


## CSS Module vs CSS Scope
[文章](https://segmentfault.com/a/1190000021670036)
### CSS Scope：
  * 優點：易於使用、不需要額外配置工具
  * 缺點：全局樣式仍然存在（因為class沒有被改變），有可能發生樣式衝突
  * 如果子組件某元素有一個類在父組件被定義過，那麼父組件的樣式就會被洩露到子組件中
  * 渲染變慢
### CSS Module
* 是一種用於JS應用中的模塊化管理CSS的方式。他將CSS樣式與組件綁在一起，確保每個組件樣式只有針對該組件有效，可以避免全局污染
  * 優點：
    * 避免全局樣式衝突
    * 樣式與組件綁定，提高代碼的可維護性與可讀性
    * 支持局部作用域，允許使用普通的CSS代碼，並將其限制在特定的範圍內
  * 缺點：
    * 需要額外的工作or庫（例如webpack or rollup）進行配置or編譯
    * 需要學習並遵循特定的CSS Module的語法和規範
總的來說，CSS Scope 是一種瀏覽器原生的樣式作用範圍管理方法，適合簡單的樣式隔離需求。而 CSS Module 是一種更強大且較為複雜的模塊化 CSS 方案，適合需要更高級的樣式封裝和組件級別樣式管理的場景。



