---
description: vue 面試常見問題
tags:
  - javascript
  - Test
  - Vue
---

# [FE] Vue - p3

## slot

### 使用場景

- 如果一個組件在不同地方有極少量的更改，可以通過`slot`來達成內部指定內容

### 分類

- 默認插槽

```html
<!-- 子component -->
<template>
  <!-- <div>默认插槽</div>   -->
</template>

<!-- 父component -->
<Child>
  <div>默认插槽</div>
</Child>
```

- 具名插槽

```html
<!-- 子component -->
<template>
  <slot>插槽后备的内容</slot>
  <slot name="content">插槽后备的内容</slot>
</template>
<!-- 父component -->
<child>
  <template v-slot:default>具名插槽</template>
  <!-- 具名插槽⽤插槽名做参数 -->
  <template v-slot:content>内容...</template>
</child>
```

- 作用域插槽
* 插槽上的 name 是一个 Vue 特别保留的 attribute，不会作为 props 传递给插槽
* 子組件可以將數據傳給父組件
```html

<template>
  <slot name="footer" testProps="子组件的值">
    <h3>没传footer插槽</h3>
  </slot>
</template>
<child>
  <!-- 把v-slot的值指定为作⽤域上下⽂对象 -->
  <template v-slot:default="slotProps">
    来⾃⼦组件数据：{{slotProps.testProps}}
  </template>
  <template #default="slotProps">
    来⾃⼦组件数据：{{slotProps.testProps}}
  </template>
</child>
```
