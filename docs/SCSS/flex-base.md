---
description: 一些flex的基本使用
tags:
  - SCSS
  - CSS
  - frontEnd
---
# [CSS] flex 的基本使用

## 參考文章
[[css] 搞懂 flex-grow, flex-shirk 及 flex-basis 三種屬性](https://blog.camel2243.com/2019/11/14/css-%E6%90%9E%E6%87%82-flex-grow-flex-shirk-%E5%8F%8A-flex-basis-%E4%B8%89%E7%A8%AE%E5%B1%AC%E6%80%A7/)  
[Day 5 : HTML - 網頁排版超強神器，CSS Flex到底是什麼？](https://ithelp.ithome.com.tw/articles/10267398)

## 外元素
### display **(注意：這裡如果沒設成flex，底下語法都無法使用喔!!!)**
### flex-wrap
  1. nowrap (預設值)
  2. wrap (換行)
  3. wrap-reverse (換行，且行順序反轉)
### flex-direction
  1. row (預設值，由左至右，從上到下)
  2. row-reverse (排列方向和row一樣，但內元件順序會反轉)
  3. column (先從上到下，再由左至右)
  4. column-reverse (排列方向和column一樣，但內元件順序會反轉)
### flex-flow (可以同時設定flex-direction和flex-wrap)
### justify-content
  1. Flex-start (預設值)
  2. Flex-end
  3. Center
  4. Space-between：平均分配元素位置，左右切齊主軸起點終點
  5. Space-around：平均分配元素位置，左右起點終點會留比較小的位置
  6. Space-evenly：平均分配元素位置，元素與起點終點間距皆相同
### align-item
  1. Stretch：全伸展
  2. flex-start
  3. flex-end
  4. center：與文字中間對齊
  5. baseline：與文字baseline對齊
### align-content

## 內元素
### align-self
  1. Stretch (預設值，要測試請記得內元素不能設定height)
  2. flex-start
  3. flex-end
  4. center
  5. baseline
### order
  1. order預設值為0，它可以重新定義內元件的排列順序，順序會依照數值的大小排列
### flex-basis
使用：決定 flexbox 排版的 item 的**初始寬/高**(取決於 flex-direction 的方向)．
:::info
當 flex-direction: row 時，flex-basis 會決定了 width．  
當 flex-direction: column 時，flex-basis 會決定了 height．
:::

### flex-grow
決定 flexbox 排版的 item 如何分配**剩餘的空間**．
* 全部item（內元素）的`flex-grow`總和最小為1
* 預設值為0，代表不去分配剩餘空間
* 設定為1，則將剩餘空間分成1等份，給設定的那個元素
* 假設多元素設定，則將剩餘空間分成加總等份，然後依照倍數給個元素
```html
<div class="container">
  <div class="sidebar">sidebar</div>
  <div class="content">content</div>
   <div class="sidebar">sidebar</div>
</div>
```
```scss
// content因為是內元素，當sidebar沒有填滿整個container佈局時，content就會將其全部填滿
.content {
  flex-grow: 1;
  background: lightblue;
}
```


### flex-shrink
* 預設值為 1：代表壓縮比例一樣
* 如果設置為 0 則不會縮放
* 當空間有限時，決定如何分配縮小的比例在每個 item，預設值為 1


## align-items vs align-content vs align-self 
### 參考文章
[align-items和align-content的区别](https://juejin.cn/post/6844903911690600456#heading-6)
* align-items：當交錯軸只有一行時的對齊方式，針對該行內部成員
  * 設定align-items會將內部每一個元素做定位
* align-content：交錯軸為**多行**時的的整體對齊方式，針對所有成員
  * 會將flex內的所有元素視為一個整體，來做定位
  * ex：所有元素排列後有多行，這多行怎麼定位就要使用`align-content`
* align-self：交錯軸個別項目的對齊方式（for 內元素）

