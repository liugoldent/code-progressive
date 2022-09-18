---
tags: 
    - CSS
    - Test
---
# [面試] CSS 
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




