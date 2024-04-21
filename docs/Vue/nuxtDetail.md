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

#### [【Nuxt】这样理解 Nuxt 的生命周期真是太棒了](https://blog.csdn.net/baidu_36511315/article/details/118415482)

## 概述

### pages

使用者看到的「每一頁」，nuxt 會自動與 pages 內的檔案做連結
如果有 `cart.vue` 就會產生 /cart 的 url

### layouts

模板。如果有兩種頁面，一個想要 header、一個不要，那麼就可以用到 layouts

- 在 vue 中使用

### store

自帶 VueX

```js
export const state = () => ({
  videos: [],
});

export const mutations = {
  SET_A(state, videos) {
    state.videos = videos;
  },
};
```

in Vue

```js
import { mapState } from "vuex";

export default {
  async fetch({ $axios, params, store }) {
    const reponse = await $axios.get(`/videos/${params.id}`);
    const video = response.data.data.arrtibutes;
    store.commit("SET_CURRENT_VIDEO", video);
  },
};
```

### assets、static

存放不需要被編譯的文件，如 SCSS 文字

### middleware、plugins

中間件與插件，這為可選，並且可以訂製拓展功能。

### nuxt.config.js

nuxt 的配置文件

### 模板使用

```html
<script>
  export default {
    // 在pages中，可以指名layout，預設default
    layout: "videos",
  };
</script>
```

### meta

加入 head 標籤

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

`videos.vue` 與 `videos/index.vue` 都指向 `/videos` 這個路由，如果這兩個同時存在，外層 videos 就會攔截所有 `/videos`文件夾下的路由，可以通過 `<nuxt-child>` 取出子元素

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

- `nuxtServerInit` - 伺服器初始化
- `middleware` - 中間組件
- `validate` - 驗證參數
- `asyncData` - 非同步資料處理
- `fetch` - 非同步資料處理

### `nuxtServerInit`

- 無法讀取`this`
- 在 server 端  
  主要為 Nuxt.js 在環境初始化時才會觸發的生命週期，而我們可以在這個階段初始化 Vuex
- 用於啟動之前執行一些非同步的初始化操作，例如加載應用的初始數據，設置VueX store
```js
export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.session.user) {
      commit("user", req.session.user);
    }
  },
};
```

### `middleware`

- 無法讀取`this`
- 在 server 端  
  其分別有：Global、Layout、Page，執行順序依序為 Global -> Layout -> Page。
- 可以定義一些函數，在渲染頁面之前執行路由跳轉之前執行。用於處理身份驗證或路由控制
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
  middleware: "filter";
}
```

```js
// 在layout中加入middleware()
export default {
  middleware() {
    console.log("middleware in layout");
  },
};
```

```js
// 在pages中加入middleware()
export default {
  middleware() {
    console.log("middleware in pages");
  },
};
```

### `validate`

- 無法讀取`this`
- 在 server 端  
  主要用於驗證參數，並且一定要回傳`true` or `false`，用於切換頁面後，想要驗證 router 參數，就可以用此生命週期。
- 當你定義路由時，可以為路由參數設置驗證規則。如果驗證失敗，可以選擇跳轉到另一個錯誤頁面或者重定向到另一個頁面
```js
export default {
  validate({ params, query }) {
    return true || false; // must require
  },
};
```

### `asyncData`

- 無法讀取`this`
- 在 server 端  
  為實戰上最常用的生命週期，因為一般 SPA 是靠 JS 去渲染 DOM，而這使得 SEO 很差，這時我們只需要將生成畫面的資料放在`asyncData`中，那 Nuxt.js 就會真實被渲染在畫面上。
- 主要用於將資料放上seo供給爬蟲
- 每次都會執行

```js
export default {
  async asyncData({ $axios }) {
    const res = await $axios.get("xxx");
    return {
      data: res.data.results,
    };
  },
};
```

> > > 點擊連結 -> asyncData() -> 組件建立完成 -> render 畫面（換頁）

### `fetch`

- 在這邊可以操作`this`
- 通常`fetch` 會放置於`data()`後
- 如果是keep-alive要用到的資料，要在這邊操作 

> > > 點擊連結 -> 組件建立完成 -> render 畫面（換頁） -> fetch()

### `fetch` vs `asyncData`
[AsyncData 和 Fetch 使用详解](https://www.cnblogs.com/China-Dream/p/15667561.html)
- `fetch`用於取回遠端資料後，要被 Vue 使用的資料。使用this直接覆蓋值
- `asyncData`用於取回遠端資料後，不用被 Vue 使用的資料。通過return 合併data數據
