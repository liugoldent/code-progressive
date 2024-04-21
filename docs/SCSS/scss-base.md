---
description: 一些scss的基本使用
tags:
  - SCSS
  - CSS
  - frontEnd
---
# [SCSS] SCSS的基本使用
## 為何需要預處理器
預處理器有著許多原生CSS沒有的功能，例如：mixin、變數、巢狀選擇器等，而這些功能可以使 CSS 結構的可讀性更高且更容易維護。

## SASS vs SCSS

- SASS：不寫`{ }`，縮寫取代{ }，不兼容CSS
- SCSS：一樣要寫`{ }`，兼容CSS

## SCSS 特點

### 1. 巢狀結構
→ 選擇器
```scss
#banner{
  #logo{    // 等同於 #banner #logo
      img{  // 等同於 #banner #logo img
      }
  }
  nav{     // 等同於 #banner nav 
  }
}
```

→ 屬性也可以巢狀：如果有前綴字的屬性可以巢狀
```scss
.box{
    background: {
      image: url(/img/bg.jpg);
      repeat: repeat;
      position: top;
  }
    font: {
        size: 1rem;     //等同於font-size:...
        weight: bold;   //     font-weight:...
  }
}
```

### 2.變數$

→ 可用在變數管理

```scss
$main-color: blue;
$sub-color: gray;

footer {
    background-color: $sub-color; 
    color: $main-color; 
}
p{
    color: $main-color; 
}
```

### 3. `Mixin`

→ 偏向`function`的概念

```scss
@mixin basic-space{
    padding: 1rem;
    margin: 1rem;
}

/* 另一個檔案則為 */
.box{
		/* 這裡將其 include近來 */
    @include basic-space
}
```

→ 可用類似`function`寫法，帶入參數

```scss
@mixin basic-space($mg, $pd){
    padding: $mg;
    margin: $pd;
}

.wrap{
		/* 呼叫function 引入樣式 */
    @include basic-space(0, 1rem);
}
```

### 4. `@extend`

→ 使用 `%` 語法來定義要被繼承的class

```scss
%basic-space{
    padding: 1rem;
    margin: 1rem;
}

.wrap{
    @extend %basic-space;
    background-color: red;
}

.box{
    @extend %basic-space;
    font-size: 1rem;
}
```

→ 被編譯出來會合併

```scss
.wrap, .box, .footer {
  padding: 1rem;
  margin: 1rem;
}

.wrap {
  background-color: red;
}
```

→ 沒預先定義，則可以直接繼承某selector

```scss
.box-point {
    @extend .box;
 }
```

### 5. 運算符

```scss
$box-width: 10rem ;

.box {
    width: $box-width;
    img {
				/* 這邊可以直接加減乘除 */
        width: $box-width / 2;
    }
}
```

### 6. `@import` file

→ 使用 import 輸入SASS/SCSS

```scss
@import "reset"
@import "layout"
@import "product"
@import "company"
```

### 7. 註解與編譯

```scss
/* 多行註解
* 多行註解
* 多行註解 */

// 單行註解（與JS相同）
```

### 8. `@if`

```scss
body{
    @if $theme == dark {
        background-color: black
    }@else if  $theme == light {
        background-color: white
    }@else{
        background-color: grey;
    } ;
}
```

### 9. `@for`

```scss
@for $var from 起始值 to 結束值{

}

@for $var from 起始值 through 包含結束值{

}

@for $col from 1 to $cols{   
    .col-#{$col}{                
        width: 100% / $cols * $col; 
    }
}
```

### 10. `@each`

```scss
$status: sucess error warning;

@each $statu in $status {
  .icon-#{$statu} {
    background-image: url('img/icons/#{$statu}');
  }
}

// 編譯成 
// icon-success
// icon-error
// icon-warning
```

### 11. `@while`

```scss
@while _____ { 

}$num: 8;

@while $num > 0 {
  .w-#{$num} {
    width: 10px * $num;
  }

  $num: $num - 2; 
}
```

### 12. Map

```scss
$z-index: (
    container: 5,
    header: 10,
    notice: 20
);

.header{
		// 編譯成：z-index：10
    z-index: map-get($z-index, header);
}
.container{
    z-index: map-get($z-index, container);
}
.notice{
    z-index: map-get($z-index, notice);
}
```

### 13. lighten & darken

```scss
$color-main: #00F;
$color-main-light30: lighten($color-main, 30%);
$color-main-dark30: darken($color-main, 30%);

a{
    background-color: $color-main;
    &:hover{
        color: $color-main-light30;
    }
    &:active{
        color: $color-main-dark30;
    }
}
```

### 14. `&` 選擇符：代表父層

```scss
a{
  color:red; 
  &:hover{   //等同於　a:hover
      color:red;
  }
  &.active{  //等同於　a.active
      color:blue;
  }
}
.item {
  // 代表item 如果加上 .red屬性，就會變為下面樣子
  &.red {
    background: rgba(255, 0, 0, 0.7);
    flex-basis: 20px;
  }
}
```

## 總結

- $：為變數名稱
- @：為關鍵字代表
- #：為函數內代表
- &：代表父層
- %：代表要被繼承的類 → 其資料將被組合為一行
