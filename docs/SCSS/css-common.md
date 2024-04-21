---
description: css 常用操作
tags:
  - CSS
  - frontEnd
---

# [CSS] CSS 常用操作

## 去掉button樣式
```css
padding: 0;
border: none;
background: none;
```

## 文字換行
[CSS 語法，文字換行，強迫不換行。](https://www.puritys.me/docs-blog/article-31-CSS-%E8%AA%9E%E6%B3%95%EF%BC%8C%E6%96%87%E5%AD%97%E6%8F%9B%E8%A1%8C%EF%BC%8C%E5%BC%B7%E8%BF%AB%E4%B8%8D%E6%8F%9B%E8%A1%8C%E3%80%82.html)
### 強迫文字不換行
```css
white-space:nowrap;
```

### 保留原始空白與換行
```css
white-space:pre;
```

### 保留原本空白，但文字自動換行
```css
white-space:pre-wrap;
```

### 連續空白，轉換成一個空白
```css
white-space: pre-line;
```

### 強迫換行
文字會被切斷！！
```css
word-break: break-all;
```

### 文字自動換行，長英文字不切斷
```css
word-wrap:break-word;
```

## CSS 分成三欄
[css divide width 100% to 3 column](https://stackoverflow.com/questions/18781713/css-divide-width-100-to-3-column)
```html
<div id="wrapper">
  <div id="c1"></div>
  <div id="c2"></div>
  <div id="c3"></div>
</div>
```
### flex-box
```css
#wrapper > div {
  flex-grow: 1;
}
#wrapper > div:first-of-type { background-color: red }
#wrapper > div:nth-of-type(2) { background-color: blue }
#wrapper > div:nth-of-type(3) { background-color: green }
```

### grid-box
```css
#wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(200px, auto);
}

#wrapper>div:first-of-type { background-color: red }
#wrapper>div:nth-of-type(2) { background-color: blue }
#wrapper>div:nth-of-type(3) { background-color: green }
```

### calc()
```css
div {
  height: 200px;
  width: 33.33%; /* as @passatgt mentioned in the comment, for the older browsers fallback */
  width: calc(100% / 3);
  display: inline-block;
}

div:first-of-type { background-color: red }
div:nth-of-type(2) { background-color: blue }
div:nth-of-type(3) { background-color: green }
```

## 如何做出疊圖
* 使用background-image
```css
.element {
    background-image: url('first-image.jpg'), url('second-image.jpg');
    background-position: top left, bottom right;
    background-size: contain, cover;
    background-repeat: no-repeat, repeat-x;
}

```

