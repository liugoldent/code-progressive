---
description: Flask lxml 操作
tags:
  - Python
  - Flask
  - lxml
---

# [爬蟲]lxml的使用

## 參考文章
[Python中lxml库xpath知识梳理](https://zhuanlan.zhihu.com/p/440283187)

## 基本使用

### 層級
* 「/」：直接子集
* 「//」：跳级

### 屬性名稱
* 「@」：屬性名稱
```js
// ul[@id='dataFull']
// table[@class="t01"]
```

### 函數
* contains()、text()
```js
//ul[@id='dataFull']/li/a/text()   -> 取得其元素文字
```


