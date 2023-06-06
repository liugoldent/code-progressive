---
description: Vue知識點
tags: 
    - vue
    - frontend
---

# FE-Vue

## 請說說Vue.use的方法的作用及原理
### 作用
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
### 原理
主要會做幾件事
1. 判斷插件是否被安裝，若安裝則`return`
2. 如果插件為函數，則將Vue作為參數傳遞給他
3. 否則，如果插件提供了`install`方法，則調用該方法並將Vue作為參數傳遞給他

### 原始碼
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

## 從0到1自己架構一個vue項目，説説有哪些步驟與哪些重要插件、目錄結構要怎麼組織
[vue q983](https://github.com/haizlin/fe-interview/issues/983)
### 項目類型
* PC官網：有些官網可能要用到SSR，這時就要使用Nuxt.js來做，來確保有良好的SEO
* 後台管理系統：CMS、OA，主要用於數據的配置、權限控制、數據報表的展示
* Native開發：可以使用Weex or Electron
* 通吃：uni-app，可以一套代碼編譯成不同的平台原始碼

### 基於@vue/cli的選擇
* 對於後台管理系統中：`vue-router`、`vuex`都是必要的
* ES6 or ES7 or TS
  * (運用ts其實有時候有考慮到團隊成員與項目週期或是有沒有時間來試錯、踩坑)
* SASS、LESS、Stylus、PostCSS？
* 代碼風格：Prettier or Airbnb style
* 測試：Unit Test or E2E Test

### 通用配置
* 編輯器的配置：`.editorconfig`
```
# https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```
* Git忽略文件的配置：`.gitignore`
* Eslint配置：`.eslintrc.js`、`.eslintignore`
* PostCSS配置：`postcss.config.js`
* Babel配置：`babel.config.js`
  * 主要是配置：plugins、presets、parse
* StyleLint:`.stylelintrc`
* @vue/cli配置：`vue.config.js`
  * 在這邊可以對@vue/cli的webpack進行配置與覆蓋
* webpack配置：`webpack.config.js`
  * 因為webpack無法辨識@路徑，所以要提供一個文件讓vue知道怎麼找。

### 版控
* 主要可以使用git

### CI、CD
* 目前開源項目大部分採用`Travis`，而一般公司通常用`Jenkins`來持續集成，在部署上通常採用`Docker`，集群上使用`KubeOperator`

* API請求方式：可以使用`axios` or `fetch api`

### 常用的library如
* UI：Element、iView、vue-strap
* 日期：moment.js、dayjs
* URL解析: query-string、path-to-reqexp
* 實用方法: lodash
* Cookie: js-cookie
* 混淆ID: hashids
* 圖表: echarts
* Ajax: axios, isomorphic-fetch, vue-apollo
* 拖拽: Vue.Draggable
* Meta修改: vue-meta

### 項目目錄
* 視圖頁面放在 pages 或者 views 中
* 靜態文件放在 static 中
  * 是指在應用程序中不需要經過處理或編譯的文件，它們的內容不會根據應用程序的狀態或邏輯而改變。靜態文件可以是圖片、字體、CSS 文件、JavaScript 文件等。它們一般用於展示、呈現和美化網頁的外觀和功能。靜態文件通常存儲在 static 目錄中。
* 資源文件放在 assets 中
  * 是指應用程序中需要使用的資源，這些資源可以是數據、配置文件、語言文件、模板文件等。資源文件的內容可能會根據應用程序的需要而變化，例如語言文件可能根據用戶的語言設置而切換顯示不同的內容。資源文件通常存儲在 assets 目錄中。
* 樣式文件放在 styles 中
* 輔助庫放在 utils 中
* 配置文件可以放在 config 或者 constants 中
* vuex 的文件放在 stores 中，至於 getters, actions, mutation, modules 可以參考 vuex 的文檔
* 路由文件放在 routes 中
* 所有組件放在 components 中
* 共享代碼也可以使用 shared 作為目錄
* 布局組件可以放在 layouts 目錄中

## vue 的模板語法，是使用那個模板引擎呢？
是使用`mustache`，模板引擎的初衷是解決字串拼接問題，也因這個慢慢擴大。

## v-model 原理是什麼？
`v-model`是一個語法糖：主要實現還是靠
* v-bind：綁定響應式數據
* v-input：觸發事件，並傳遞數據
```html
<!-- 先bind綁定value -->
<!-- 再來input改變msg -->
<input v-bind:value="msg"  v-on:input="msg=$event.target.value" />
```

## 在使用computed時，可以讓函數名和data中的名稱相同嗎
![initState](https://user-images.githubusercontent.com/59282087/236611014-d76129d3-1aa8-4e85-9062-67550dd93053.png)
[vue-q-558](https://github.com/haizlin/fe-interview/issues/558)
* 可以同名，但是會覆蓋掉資料
* 會噴 [vue warn]: The computed property "xxxx" is already defined in data.
* 在初始化時，會先把data綁到vm上，再把computed值綁到vm上，這樣會覆蓋掉
* 初始化數據順序為：props -> methods -> data -> computed -> watch
* 有此可以看到computed會把data資料覆蓋掉
[initState原始碼](https://github.com/vuejs/vue/blob/77796596adc48d050beefd11e827e8e4d44c6b3c/src/core/instance/state.js#L48)
```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

## vue 要怎麼定義全局方法
[vue 556](https://github.com/haizlin/fe-interview/issues/556)
### prototype
#### 缺點是使用此方法時沒有提示。
```js
Object.keys(tools).forEach(key => {
      Vue.prototype[key] = tools[key] // 主要是這行
 })
```
### mixin
#### 利用全局引入mixin，mixin裡的methods和創建的每個單一組件合併。這樣做的好處是調用此方法時有提示
```js
// myMixin.js
export default {
  created() {
    console.log('Mixin created');
  },
  methods: {
    greet() {
      console.log('Hello from mixin!');
    }
  }
}


// main.js
import Vue from 'vue';
import App from './App.vue';
import myMixin from './myMixin';

Vue.mixin(myMixin);

new Vue({
  render: h => h(App),
}).$mount('#app');

// MyComponent.vue
export default {
  created() {
    this.greet(); // 调用mixin中的方法
  }
}

```

## vue2.0 不支持v-html中使用過濾器，該怎麼辦
[vue 555](https://github.com/haizlin/fe-interview/issues/555)
* 使用computed屬性來換掉message
```html
<template>
  <div>
    <div v-html="formattedContent"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawContent: '<p>{{ message }}</p>',
      message: 'Hello, Vue!'
    };
  },
  computed: {
    formattedContent() {
      return this.$options.filters.myFilter(this.rawContent, this.message);
    }
  },
  filters: {
    myFilter(value, message) {
      // 在这里实现过滤器逻辑
      // 例如，将value中的占位符{{ message }}替换为实际的message值
      return value.replace('{{ message }}', message);
    }
  }
};
</script>

```

## 怎麼解決vue打包之後，靜態資源的圖片失效問題
[vue q554](https://github.com/haizlin/fe-interview/issues/554)
1. 確定線上環境是否在根路徑上
  - publicPath是用於指定打包後的靜態資源文件在服務器上的訪問路徑。默認情況下，publicPath的值是/，表示靜態資源文件將被部署在服務器的根路徑下。如果你的項目將被部署在子目錄下，你需要將publicPath設置為對應的子目錄路徑。例如，如果項目將被部署在 https://example.com/my-app/，那麽publicPath應該設置為/my-app/。
  - assetsPublicPath是在開發模式下用於指定靜態資源的訪問路徑，適用於開發環境
2. 確定靜態文件放的位置
  - 如果放在public/static，不經過webpack打包，放在public上又分為相對or絕對路徑
  - 如果是放在assets，經過打包，要使用相對路徑
3. 路徑是否是動態的，如果是，要用require引入

## 怎麽解決vue動態設置img的src不生效的問題
[vue q553](https://github.com/haizlin/fe-interview/issues/553)
* require('@/assets/images/xxx.png')

## vue 項目如何做好SEO
[vue q552](https://github.com/haizlin/fe-interview/issues/552)
* 使用SSR框架：Nuxt.js
* 靜態化
* 預渲染：prerender-spa-plugin
* 使用phantom.js針對爬蟲做處理

## 跟keep-alive有關的生命周期是哪些？描述下這些生命周期
[vue q551](https://github.com/haizlin/fe-interview/issues/551)
* keep-alive生命週期：
1. activated：頁面第一次進入時，會觸發created -> mounted -> activated
2. deactivated：頁面退出時，會觸發deactivated，當再次前進or後退時，只觸發activated
```js
beforeRouteEnter - 在進入路由之前調用。這個生命周期鉤子在組件實例化之前被調用，因此在這個階段無法訪問組件實例。

created - 組件實例創建後立即調用。在這個階段，可以進行一些初始化的操作，但是DOM尚未渲染。

beforeMount - 在組件掛載到DOM之前調用。在這個階段，組件的模板已經編譯完成，但尚未插入到DOM中。

mounted - 組件掛載到DOM後調用。在這個階段，組件已經被插入到DOM中，可以進行DOM操作和請求數據。

activated - 組件被<keep-alive>緩存後重新激活時調用。在這個階段，組件從緩存中恢覆，可以執行一些特定的操作。

beforeUpdate - 在組件更新之前調用。在這個階段，數據已經改變，但尚未重新渲染DOM。

updated - 組件更新完成後調用。在這個階段，組件的數據已經更新，並且DOM已經重新渲染。

deactivated - 組件被<keep-alive>緩存時調用。在這個階段，組件被緩存起來，可以執行一些特定的操作。

beforeDestroy - 在組件銷毀之前調用。在這個階段，組件實例仍然可用，可以執行一些清理操作。

destroyed - 組件銷毀後調用。在這個階段，組件實例已經被銷毀，所有的事件監聽器和定時器也被移除。
```
