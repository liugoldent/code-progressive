---
description: 在vue中使用scss + module
tags:
  - SCSS
  - Vue
  - frontEnd
---
# [SCSS] SCSS module in Vue

## 範例程式碼
### 範例1 出現 `$style.container`
```html
<template>
    <- 這邊可以直接使用$style.xxx 獲取到css ->
    <div :class="[$style.container]"></div>
</template>

<style lang='scss' module>
.container {
  position: relative;
  margin-top: 10px;
}
</style>
```

### 範例2 出現 `$style['uploader--circle']]`
* 這類通常有加 `&--` 指令
```html
<template>
    <- 這邊可以直接使用$style.xxx 獲取到css ->
    <div :class="[$style.container, { [$style['uploader--circle']]: circle }]"></div>
</template>

<style lang='scss' module>
.uploader {
  display: flex;
  :global {
    .el-upload,
    .el-image {
      color: $color-text-placeholder;
    }
  }
  &__iconBg {
    width: 60px;
  }
}
</style>
```

### 範例3 想要直接更改 element-ui 樣式（客製化）
除了在另外寫出一個`.scss`檔案，我們還可以直接使用module來客製化自己的樣式  
主要就是寫出`:global{}`，在其裡面加入element-ui的tag名稱
```html
<template>
    <- 這邊可以直接使用$style.xxx 獲取到css ->
    <div :class="[$style.container]">
      <el-upload>xxxx</el-upload>
      <el-image>xxxx</el-image>
    </div>
</template>

<style lang='scss' module>
.container {
  display: flex;
  :global {
    .el-upload,
    .el-image {
      color: $color-text-placeholder;
    }
  }
}
</style>
```

### 範例4 使用程式控制module $style
```html
<template>
  <div id="app">
    <!-- 這邊可以用isBlue來控制`$style.blue`是否要顯示 -->
    <p :class="{ [$style.blue]: isBlue }">Am I blue?</p>
    <p :class="[$style.red, $style.bold]">Red and bold</p>
  </div>
</template>
```
