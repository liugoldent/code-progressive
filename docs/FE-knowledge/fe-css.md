---
description: CSS知識點
tags: 
    - CSS
    - frontend
---

# FE-CSS


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

