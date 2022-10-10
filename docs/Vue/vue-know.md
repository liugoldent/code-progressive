---
description: Vue.js 一些小細節
tags:
  - Vue
---

# [Vue] 關於Vue的一些小細節

## 語法糖：`.sync`
一般來說，我們使用`props`、`$emit`來做父子組件數據上的溝通，但是若我們想要直接地
「經由改變子組件props，直接修改父組件的資料」我們可以使用.sync

### step1. props的問題
由於單向資料流，我們會被vue警告
```shell
[Vue warn]: Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. 
Instead, use a data or computed property based on the prop's value. Prop being mutated: "formData"

found in...
```
### step2. 使用`.sync`後
```html
<!-- father -->
<template>
  <div class="FormPlayGroundPage">
    <h1 class="title">FormPlayGroundPage</h1>
    <FormPlaySync :form-data.sync="state.formData" /> // .syncを追加
  </div>
</template>
```
```html
<!-- son -->
<template>
  <div class="FormPlaySync">
    <h2 class="title">FormPlaySync</h2>
    <el-input :value="props.formData" @input="updateFormData"></el-input>
  </div>
</template>
<script>
export default {
  props: {
    // 略
  }
  methods:{
    updateFormData(){
      // 這邊允許直接改變formData，因為已經是.sync了
      // change formData
    }
  }
}
</script>
```

## vue-router 的 next()
在Vue2，這代表「繼續往下執行」的callback，我們程式做完後，必須呼叫他，才可以繼續往下執行。
```js
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: HelloWorld,
      beforeEnter (to, from, next) {
        checkLoginStatus()
          // 這邊使用next，才可以繼續往下執行。
          .then(next)
          .catch(() => {
            next({ 'msg' : 'xxx'})
          });
      }
    }
  ]
});
```

## vue-router的 params / query
### params -> 純網址
```js
router.push({name: 'user'}, params: { userId: 123})

// :userId會綁定到params內的東西
// 網址相同：localhost:8080/users/1
{
  path: '/users/:userId',
  name: 'User',
  component: User,
},
```

### query -> ?+網址
```js
this.$router.push({ path: '/backend/order', query: { gender: "male", age: "25"}})

// 網址就會變成
// localhost:8080/users?genger=male&age=25
```

