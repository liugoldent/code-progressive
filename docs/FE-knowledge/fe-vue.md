---
description: Vue知識點
tags: 
    - vue
    - frontend
---

# FE-Vue

### 請說說Vue.use的方法的作用及原理
#### 作用
[q5396](https://github.com/haizlin/fe-interview/issues/5396)
* 在Vue中，使用`Vue.use()`方法可以拓展Vue的功能，那麼這個方法具體是做什麼的？
* `Vue.use()`：用於安裝Vue插件，也就是將特定功能注入到Vue中。
  * 需要在實例前被調用
  * step1：安裝該插件並將其添加到Vue中
  * step2：在Vue的選項中配置插件

```js
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    // 对路由进行配置
  ]
});

// 在實例化之前調用
const app = new Vue({
  router
}).$mount('#app');
```
#### 原理
主要會做幾件事
1. 判斷插件是否被安裝，若安裝則`return`
2. 如果插件為函數，則將Vue作為參數傳遞給他
3. 否則，如果插件提供了`install`方法，則調用該方法並將Vue作為參數傳遞給他

#### 原始碼
```js
Vue.use = function (plugin) {
  const installedPlugins = this._installedPlugins || (this._installedPlugins = []);
  if (installedPlugins.indexOf(plugin) > -1) {
    // 它將檢查插件是否已經被安裝，如果已經安裝了，它會直接返回 Vue 對象
    return this;
  }

  const args = toArray(arguments, 1);
  // args將Vue(this)加入args中
  args.unshift(this);
  //如果 plugin 參數具有 install 方法，那麼 Vue.use() 將調用 plugin 的 install 方法並傳遞 Vue 對象和其他參數，以便該插件能夠註冊自己的全局功能。
  if (typeof plugin.install === "function") {
    plugin.install.apply(plugin, args);
  // 如果 plugin 參數沒有 install 方法，但是 plugin 本身是一個函數
  // 那麼 Vue.use() 將認為該 plugin 函數本身就是一個安裝方法，直接調用該函數並傳遞 Vue 對象和其他參數。
  } else if (typeof plugin === "function") {
    plugin.apply(null, args);
  }
  installedPlugins.push(plugin);
  return this;
};
```

