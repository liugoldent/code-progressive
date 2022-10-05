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
    <div :class="[$style.container, { [$style['uploader--circle']]: circle }]">
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
    <div :class="[$style.container, { [$style['uploader--circle']]: circle }]">
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