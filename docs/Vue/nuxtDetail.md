---
description: Nuxt.js 精讀
tags:
  - Vue
  - Nuxt
---

# [Nuxt.js] 精讀

## 參考文章
#### [Nuxt.js 精讀連結](https://juejin.cn/post/6844903981848756231)
#### [Nuxt.js 2.x 實戰手冊(5) - 生命週期(lifecycle)](https://israynotarray.com/vue/20211205/3240380460/)
#### [【Nuxt】这样理解Nuxt的生命周期真是太棒了](https://blog.csdn.net/baidu_36511315/article/details/118415482)

## 概述
### pages
使用者看到的「每一頁」，nuxt會自動與pages內的檔案做連結
如果有 `cart.vue` 就會產生 /cart 的url

### layouts
模板。如果有兩種頁面，一個想要header、一個不要，那麼就可以用到layouts
* 在vue中使用

### store
自帶VueX
```js
export const state = () => ({
  videos: [],
})

export const mutations = {
  SET_A (state, videos) {
    state.videos = videos
  }
}
```
in Vue
```js
<script>
  import { mapState } from "vuex";

  export default {
    async fetch({ $axios, params, store }) {
      const reponse = await $axios.get(`/videos/${params.id}`);
      const video = response.data.data.arrtibutes;
      store.commit("SET_CURRENT_VIDEO", video);
    }
  };
</script>
```

### assets、static
存放不需要被編譯的文件，如SCSS文字

### middleware、plugins
中間件與插件，這為可選，並且可以訂製拓展功能。

### nuxt.config.js
nuxt的配置文件

### 模板使用
```html
<script>
  export default {
    // 在pages中，可以指名layout，預設default
    layout: "videos"
  };
</script>
```

### meta
加入head標籤
```xml
<script>
  export default {
    head() {
      return {
        title: "",
        meta: {
          
        },
        script: [
        ]
      };
    }
  };
</script>
```

## 路由
### 一般路由
```python
├── pages
│   ├── home.vue
│   └── index.vue
```
即會產生 `/` `/index` 兩個路由

### 嵌套路由
```python
├── pages
│   ├── videos
│   │   └── index.vue
│   └── videos.vue
```
`videos.vue` 與 `videos/index.vue` 都指向 `/videos` 這個路由，如果這兩個同時存在，外層videos就會攔截所有 `/videos`文件夾下的路由，可以通過 `<nuxt-child>` 取出子元素
```html
# pages/videos.vue
<template>
  <div>
    videos
    <nuxt-child />
  </div>
</template>
```

## Nuxtjs 做的幾件事

### 統一執行命令
1. npm start.
2. monkey dev.
3. npm run xxx....
nuxt.js 透過統一執行命令解決這個問題

### 統一開發框架

### 統一目錄規範

## Nuxt.js 生命週期
![Nuxt.js 生命週期](https://nuxtjs.org/_nuxt/image/de48ca.svg)
* `nuxtServerInit` - 伺服器初始化
* `middleware` - 中間組件
* `validate` - 驗證參數
* `asyncData` - 非同步資料處理
* `fetch` - 非同步資料處理

### `nuxtServerInit`
* 無法讀取`this`
* 在server端  
主要為 Nuxt.js 在環境初始化時才會觸發的生命週期，而我們可以在這個階段初始化 Vuex
```js
export const actions = {
  nuxtServerInit({ commit }, { req }){
    if (req.session.user) {
      commit('user', req.session.user)
    }
  }
}
```

### `middleware`
* 無法讀取`this`
* 在server端  
其分別有：Global、Layout、Page，執行順序依序為Global -> Layout -> Page。
```js
// 在middleware下新建filter.js
export default({store, route, redirect, params, query, req, res}){
  console.log('middleware nuxt.config.js')
}
```

```js
// 在nuxt.config.js中插入內容
// 所以在run時，這個filter會先跑
router: {
  middleware: 'filter'
}
```

```js
// 在layout中加入middleware()
export default{
  middleware(){
    console.log('middleware in layout')
  }
}
```

```js
// 在pages中加入middleware()
export default{
  middleware(){
    console.log('middleware in pages')
  }
}
```


### `validate`
* 無法讀取`this`
* 在server端  
主要用於驗證參數，並且一定要回傳`true` or `false`，用於切換頁面後，想要驗證router參數，就可以用此生命週期。
```js
export default{
  validate({params, query}){
    return true || false // must require
  }
}
```

### `asyncData`
* 無法讀取`this`
* 在server端  
為實戰上最常用的生命週期，因為一般SPA是靠JS去渲染DOM，而這使得SEO很差，這時我們只需要將生成畫面的資料放在`asyncData`中，那Nuxt.js就會真實被渲染在畫面上。
```js
export default {
  async asyncData ({ $axios }) {
    const res = await $axios.get('xxx')
    return {
      data: res.data.results
    }
  },
}
```

>>> 點擊連結 -> asyncData() -> 組件建立完成 -> render畫面（換頁）

### `fetch`
* 在這邊可以操作`this`
* 通常`fetch` 會放置於`data()`後

>>> 點擊連結 -> 組件建立完成 -> render畫面（換頁） -> fetch()

### `fetch` vs `asyncData`
* `fetch`用於取回遠端資料後，要被Vue使用的資料
* `asyncData`用於取回遠端資料後，不用被Vue使用的資料








