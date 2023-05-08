---
description: HTML知識點
tags: 
    - html
    - frontend
---

# FE-HTML

### 頁面載入時，import 跟 link 差在哪裡
[q1](https://github.com/haizlin/fe-interview/issues/1)
* 區別
  * 屬性：link是HTML標籤。@import是CSS標籤
  * 加載順序：link是頁面加載時同時載入。@import是頁面載入完之後載入
  * 兼容性：link沒有兼容性問題。@import不兼容ie5以下
  * DOM可控性：link可以透過js去改變樣式。@import無法透過js改變樣式


