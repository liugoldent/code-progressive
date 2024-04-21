---
tags:
  - CSS
  - Test
---

# [FE] CSS

## CSS 權重

- !important > (綁定元素) > inline style > id > class > element > \*

## RWD

- 瀏覽區域的寬度小於 600 像素，則下方的 CSS 描述就會立即被套用

```CSS
@media screen and (max-width: 600px){
    .class{
        background: #ccc;
    }
}
```

- 瀏覽區域的寬度大於 900 像素，則下方的 CSS 描述就會立即被套用：

```CSS
@media screen and (min-width: 900px) {
    .class {
        background: #666;
    }
}
```

- 瀏覽區域寬度範圍在 321px~768px，則下方 CSS 描述會立即被套用：

```CSS
@media only screen and (min-width: 321px) and (max-width: 768px) {
    .class {
        background: #666;
    }
}
```

[CSS media 屬性判別使用](https://www.ucamc.com/articles/102-rwd-css-media-type)

## animate、keyframes

- @keyframes: 需要呈現的狀態（錄影帶）
- animation: 實際演出時的播放方式，包含速率、正反轉都可以調整（播放器，可使其正轉倒轉快轉）

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

- title：為滑鼠 hover 時的提示
- alt：圖片不能正常顯示時的本文提示

## CSS box-model

- content + border + padding

## CSS box-sizing

- content-box：設定的 width / height = content（padding & border 會另外加上去）
- border-box：你設定的 width / height = border + padding + content

## 如何讓 div 水平居中

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

- display:none -> 在 HTML 不會給他空間
- visibility:hidden -> 在 HTML 還是會保留原來空間

## absolute vs fixed vs relative

- position：fixed -> 當滾動網頁時，元素與瀏覽器視窗間的位置不會被改變
- position：absolute -> 相對於父元素的定位，對上層有設定 relative / absolute / fixed 的父元素進行定位，若都沒有則往 body 左上角靠近。
- position：relative -> 相對於自己位置移動

## content-box

- W3C：指的是 content 的高/寬
- border-box：border + padding + content

## overflow

- scroll：必定出現滾動條
- auto：子元素大於父元素時出現滾動條
- visible：溢出內容出現在父元素之外
- hidden：溢出隱藏

## flex vs block vs inline

- flex：無方向限制可自由排列
- block：主要是垂直排列
- inline：主要是水平排列

## reset 意義

- 主要是針對每個瀏覽器的不同初始化

## 浮動

### 浮動的問題

- 父元素高度無法被撐開，影響與父元素同級的元素
- 與浮動元素同級的非浮動元素會跟隨其後

### 清除浮動

- 父級 div 定義 height
- 最後一個浮動元素後面加 div 元素

```css
div {
  clear: both;
}
```

## margin & padding

### margin

- 需要在 border 外側添加空白時
- 空白處不需要背景色
- 上下相連的兩個盒子之間的空白，需要相互抵消時

### padding

- 需要在 border 內側增加空白時
- 需要背景色
- 上下相連的兩個盒子的空白為相加時

## 單冒號：偽類。雙冒號：偽元素
### 偽類：選擇元素的特定狀態與位置
- :hover - 鼠标悬停在元素上时应用的样式。
- :active - 元素被激活时（例如鼠标点击）应用的样式。
- :focus - 元素获得焦点时应用的样式。
- :first-child - 选择元素的第一个子元素。
- :last-child - 选择元素的最后一个子元素。
- :nth-child() - 选择元素的特定位置的子元素
- :before -> 不存在於 dom 中

### 偽元素：為元素特定部分加上樣式，例如元素的首字母
- ::before - 在元素内容之前插入生成的内容。
- ::after - 在元素内容之后插入生成的内容。
- ::first-letter - 选择元素的第一个字母。
- ::first-line - 选择元素的第一行。
- ::selection - 选择用户选择的文本部分。

### >>> /deep/
* div >>> p，它将匹配在所有 div 元素的 Shadow DOM 中的 p 元素
* x /deep/ y 将匹配在 Shadow DOM 中和 Shadow DOM 之外的 y 元素，其中 x 是 Shadow DOM 的宿主元素(Web Components 规范的一部分)

## inline-height

- 具體來說是兩行文字基線之間的距離

## 動畫最小區間是 16.7m

- 1/60\*1000ms = 16.7ms

## style 寫在 body 前後有什麼差別

- 主要是加載前後的問題，先寫先加載

## jpg、png、gif、webp

- jpg：破壞性的壓縮，主要用來儲存或傳輸照片
- png：壓縮比高、色彩好，無損壓縮
- gif：以 8 位元色現真色彩的圖像，可實現動畫效果
- webp：壓縮時間更久，但是壓縮率只有 jpg 的 2/3、大小比 png 小 45%

## px vs em vs rem vs %

- px：絕對單位，代表螢幕中的每個 px
- em：相對單位，每個子元素透過倍數乘以父元素的「px」值。
- rem：相對單位，每個子元素透過倍數乘以根元素的「px」值。
- %：相對單位，子元素透過「百分比」乘以父元素的 px 值。

## 聖杯佈局與雙飛翼佈局的理解與差別

[q2](https://github.com/haizlin/fe-interview/issues/2)

- 相同
  - 理解：兩者同樣解決左右定寬以及中間自適應的三欄佈局。並且中間攔優先渲染
  - 但是低於最小寬度都會造成破版
  - 皆是用 float
- 不同
  - 聖杯：用容器包裹三列，雙飛翼：3 列分開佈局
  - 聖杯：使用 position 防遮罩，雙飛翼 CSS 使用負的邊距定位即可

#### 聖杯

- 核心是使用父盒子用 padding 預留區域，然後 center 設置寬 100%，並且把中左右 3 個盒子做浮動。
  由於浮動的效果且中間 center 寬度佔滿了全部，所以左右盒子被擠下去。
- 再來我們要把左右盒子放到 padding 給他們預留的地方
  - 左盒子：使用 margin-right:-100%，移動到父盒子中心
  - 右盒子：直接 margin-right:負值（父盒子預留的大小）

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

- 核心：center 通過包裹一個父元素(container)，給父元素設置 width：100%與浮動
- 子元素用 margin 撐出其他兩塊的預留空間，然後在 left & right 上，拖過 margin 移動到對應位置上。

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

## 為什麼獲取 clientWidth 時，瀏覽器會重排與重繪

[q5387](https://github.com/haizlin/fe-interview/issues/5387)
在獲取`clientWidth`屬性時，瀏覽器會對當前元素進行重排與重繪  
`clientWidth`是元素的可見寬度（包含 padding），但是不包含 border、margin、滾動條寬度，當獲取`clientWidth`時，瀏覽器需要計算元素可見寬度，這個過程包含了瀏覽器的重繪。
注意：因為重排和重繪會佔用大量 CPU 資源，尤其頁面中有大量元素需要重排時，就會造成頁面性能下降。  
因此為了減少頁面的重排與重繪，建議盡量減少對`clientWidth`的繁複訪問或修改。

## CSS Module vs CSS Scope

[文章](https://segmentfault.com/a/1190000021670036)

### CSS Scope：

- 優點：易於使用、不需要額外配置工具
- 缺點：全局樣式仍然存在（因為 class 沒有被改變），有可能發生樣式衝突
- 如果子組件某元素有一個類在父組件被定義過，那麼父組件的樣式就會被洩露到子組件中
- 渲染變慢
- vue 的 single file component 裡，css 可以加上 scoped，讓該 css 只在該 component 裡有效

### CSS Module

- 是一種用於 JS 應用中的模塊化管理 CSS 的方式。他將 CSS 樣式與組件綁在一起，確保每個組件樣式只有針對該組件有效，可以避免全局污染
  - 優點：
    - 避免全局樣式衝突
    - 樣式與組件綁定，提高代碼的可維護性與可讀性
    - 支持局部作用域，允許使用普通的 CSS 代碼，並將其限制在特定的範圍內
  - 缺點：
    _ 需要額外的工作 or 庫（例如 webpack or rollup）進行配置 or 編譯
    _ 需要學習並遵循特定的 CSS Module 的語法和規範
    總的來說，CSS Scope 是一種瀏覽器原生的樣式作用範圍管理方法，適合簡單的樣式隔離需求。而 CSS Module 是一種更強大且較為複雜的模塊化 CSS 方案，適合需要更高級的樣式封裝和組件級別樣式管理的場景。

### Vue deep

- 在父組件如果是 scoped 的狀態下，如果想要連同子組件的顏色一起改，那要使用 deep 來選取其元素

```html
<style lang="scss" scoped>
  /deep/ p {
    color: red;
  }
</style>
```

## nth-child nth-of-type

[九宮格教學與 nth](https://tw511.com/a/01/42373.html)

### nth-of-type

- 找到兄弟節點，此節點是只有自己類型的 tag 才可以算進去

### nth-child

- 為所有兄弟元素排序後的第 n 個節點（其他非自己 tag 也要算在數量內），當然也限制要同樣的元素

## sticky

- 定位在離其最近的滾動父層空間

- 須指定 top, right, bottom 或 left 四個閾值其中之一，才可使粘性定位生效。否則其行為與相對定位相同。

- 並且 top 和 bottom 同時設置時，top 生效的優先級高，left 和 right 同時設置時，left 的優先級高。

- 設定為 position:sticky 元素的任意父節點的 overflow 屬性必須是 visible，否則 position:sticky 不會生效。這里需要解釋一下：

  - 如果 position:sticky 元素的任意父節點定位設置為 overflow:hidden，則父容器無法進行滾動，所以 position:sticky 元素也不會有滾動然後固定的情況。
  - 如果 position:sticky 元素的任意父節點定位設置為 position:relative | absolute | fixed，則元素相對父元素進行定位，而不會相對 viewprot 定位。

## css 九宮格佈局

```html
<div class="box">
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
    <li>8</li>
    <li>9</li>
  </ul>
</div>
```

### flex

- 注意父元素要用`flex-wrap`

```css
.box {
  width: 100%;
  overflow: hidden;
}

ul {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.box li {
  width: 30%;
  height: 30%;
  margin-right: 5%;
  margin-bottom: 5%;
}

.box li:nth-of-type(3n) {
  margin-right: 0;
}

.box li:nth-of-type(n + 7) {
  margin-bottom: 0;
}
```

### float

```css
.box {
  width: 100%;
  overflow: hidden;
}

ul {
  width: 100%;
  height: 100%;
}

.box li {
  width: 30%;
  height: 30%;
  margin-right: 5%;
  margin-bottom: 5%;
  float: left;
}

.box li:nth-of-type(3n) {
  margin-right: 0;
}

.box li:nth-of-type(n + 7) {
  margin-bottom: 0;
}
```

### grid

```css
box {
  background: #e4f7fd61;
  border: 2px solid #0786ada1;
  border-radius: 8px;
}

.grid {
  display: grid;
  width: 100%;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5%;
  grid-auto-flow: row;
}

.grid > div {
  list-style: none;
  text-align: center;
  line-height: 200px;
  background: skyblue;
  border-radius: 8px;
  font-size: 20px;
  color: black;
}
```

### table

```html
<div class="box">
  <ul>
    <li>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </li>
    <li>
      <div>4</div>
      <div>5</div>
      <div>6</div>
    </li>
    <li>
      <div>7</div>
      <div>8</div>
      <div>9</div>
    </li>
  </ul>
</div>
```

```css
.box {
  width: 100%;
  overflow: hidden;
}

ul {
  width: 100%;
  height: 100%;
  display: table;
  border-spacing: 10px;
}

.box li {
  display: table-row;
}

.box li div {
  display: table-cell;
  text-align: center;
  border-radius: 10px;
}
```

## canvas

[canvas 效能優化](https://juejin.cn/post/6919737962829709326)
[canvas 效能優化p2](https://juejin.cn/post/7042504911908503566#heading-4)
- 影響 Canvas 性能的因素包括：
  - 圖形數量：繪製指令的數量。
  - 圖形大小：繪製指令的執行時間。
  - requestAnimationFrame：這是一個無限動畫的機制，使用系統時間間隔，保持最佳繪製效率，讓各種網頁動畫效果能夠有一個統一的刷新機制。
- 優化 Canvas 繪製指令的方式包括：
  - 形狀優化：將複雜的多邊形轉換為簡單的圓形或弧形，減少繪製指令的數量。
  - 使用緩存：將圖形緩存到離屏 Canvas 中，然後使用 drawImage 指令繪製圖像，這樣可以減少繪製指令的數量。
  - 分層渲染：將不變的元素和變化的元素進行分層處理，以減少重繪的範圍。
  - 局部重繪：使用 clearRect 控制刷新的動態區域，使用 clip 讓圖形繪製限制在區域內，減少不必要的重繪。
  - 优化滤镜：對整個 Canvas 應用全局濾鏡，而不是對每個元素應用濾鏡，以減少性能開銷。
  - 多線程渲染：將 Canvas 渲染過程放到 Web Worker 中，以減少對主線程的阻塞。

## css 變數
```html
<style scoped>
/* 在 scoped 属性下定义样式 */
.container {
  color: var(--main-color);
  background-color: var(--secondary-color);
}

/* 在 :root 伪类下定义变量 */
:root {
  --main-color: #ff0000;
  --secondary-color: #00ff00;
}
</style>
```
