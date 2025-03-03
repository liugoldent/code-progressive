---
description: VueRouter知識點
tags:
  - vue
  - vue router
  - frontend
---

# [FE] Vue Router

![vue router分類](https://www.leyeah.com/upload/images/2022/12/01/63889748cd28e.jpg)

## vue-router 怎麼重新定向頁面

[vue-router 怎么重定向页面？](https://github.com/haizlin/fe-interview/issues/419)

```js
export default {
  path: "",
  name: "",
  meta: {
    //元信息（非必填）
    icon: "", //路由图标
    title: "", //路由名称
    light: "", //高亮显示那个路由name
    show: true, //是否显示
  },
  redirect: {
    name: "", //重定向，指向哪个路由的name
  },
  component: "", //当前路由时要显示的组件
  children: [], //嵌套子路由
};
```

## vue-router 如何配置 404 頁面

```js
{
// 会匹配所有路径
// 含有通配符的路由应该放在最后
// 一定要放在最後！！
  path: '*',
  name: '404',
  component: () => import('../views/404.vue')
}
```

## SPA vs MPA

### SPA

- 一個主頁和多個頁面片段
- 局部刷新
- url mode：hash mode
- SEO：難以實現，可使用 SSR 改善
- 數據傳遞：容易
- 頁面切換：速度快、用戶體驗良好
- 維護成本：容易

### MPA

- 多個主頁面
- 整頁刷新
- url mode：history mode
- SEO：容易實現
- 數據傳遞：通過 url、cookie、localStorage 實現
- 頁面切換：切換加載資源、速度慢、用戶體驗差
- 維護成本：複雜

## history mode vs hash mode

### history mode

- 透過 HTML5 history API 裏的 `pushState()` 和`replaceState()` 方法，以及瀏覽器的 `popstate` 事件來實現
- 優點：對 url 更加友好，更符合傳統網站的 URL 格式，對 SEO 更加有利
- 缺點：需要伺服器的特殊配置，並且在刷新頁面時會向服務器發送新的 HTTP 請求，可能會增加服務器的負擔與網路流量
- 缺點解釋：必須確認**後端有相對應的配置**才行，如果沒有後端的配置，使用者直接輸入網址，就會被導到 404 error 頁面

### hash mode

- 用`#`後面的網址來當作路由。路由的切換不會向伺服器發送新的 HTTP 請求，所有切換都是在客戶端進行，不會影響伺服器
- 優點：不需要 server 端特殊配置，所以對 SPA 較簡單，可以在不刷新頁面之下，實現路由切換。
- 缺點：對 URL 看起來不太友好、在 SEO 優化方面也有一定局限性。（在爬蟲時，不會讀取到`#`之後的內容，因為會把`#`當作錨點）

## vue-router 有哪些元件
### `<router-link>`：用於建立連結，點擊後會切換到對應的路由。
* 當使用者點擊連結後，Vue Router 根據 to 屬性切換路由，從而在 `<router-view>` 中渲染對應的組件。
### `<router-view>`：根據當前路由，渲染對應的組件。
* 這是路由的出口，根據當前的路由路徑渲染相應的組件（例如 Home 或 About）。
### `<keep-alive>`：包裹 `<router-view>` 時，當路由切換時會暫存不活躍的組件，保留組件狀態，避免每次切換都重新創建組件。
* 包裹 `<router-view>` 後，當路由切換時不會銷毀不活躍的組件，而是將它們保留在緩存中。這對於需要保持狀態（例如表單填寫進度或滾動位置）的組件來說非常有用。
```html
<template>
  <div id="app">
    <h1>Vue Router 與 Keep-Alive Demo</h1>
    <nav>
      <router-link to="/">Home</router-link> | 
      <router-link to="/about">About</router-link>
    </nav>
    <!-- 使用 keep-alive 來緩存不活躍的組件 -->
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 簡單的樣式 */
nav {
  margin-bottom: 20px;
}

router-link {
  margin: 0 10px;
}
</style>
```

## active-class 是哪個元件的屬性
- 是`<router-link>`的屬性，用來做選中樣式的切換，當`<router-link>`標籤被點選時，會應用此樣式

```html
<template>
  <nav>
    <router-link to="/home" active-class="my-active-class">Home</router-link>
    <router-link to="/about" active-class="my-active-class">About</router-link>
  </nav>
</template>

```

## 嵌套路由
* 會有children，當在子層的router
```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```
## 命名視圖
### 為什麼使用命名視圖？
* 複雜佈局：當頁面有多個區域（例如 header、sidebar、main 等），每個區域需要獨立渲染不同的內容時，可以利用命名視圖來解決。
* 單一路由，多個組件：你可以在一個路由中定義多個組件，各自對應到不同的 `<router-view>` 插槽，而不必為每個區域建立單獨的路由。

### 如何使用命名視圖？
```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'

const routes = [
  {
    path: '/dashboard',
    components: {
      default: Home,
      sidebar: Sidebar,
      header: Header
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

```
```html
<!-- DashboardLayout.vue -->
<template>
  <div>
    <!-- 命名為 header 的視圖 -->
    <router-view name="header"></router-view>
    <div class="container">
      <!-- 命名為 sidebar 的視圖 -->
      <router-view name="sidebar"></router-view>
      <!-- 預設視圖 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardLayout'
}
</script>

<style>
.container {
  display: flex;
}
</style>
```

### 總結
* 命名視圖可以讓你在單一路由中同時渲染多個組件，滿足複雜佈局的需求。
透過在路由配置中使用 components 屬性與在模板中設置具有對應 name 屬性的 `<router-view>`，你可以靈活地組合頁面不同區域的內容。

## 命名路由
```js
const routes = [
  {
    path: '/user/:username',
    name: 'user',
    component: User,
  },
]
<router-link :to="{ name: 'user', params: { username: 'erina' }}">
  User
</router-link>
```

## 程式導航

### router.push:

- router.push 方法用於在路由器的歷史棧中添加一個新的記錄，然後導航到該記錄對應的頁面。
- 使用 router.push 可以實現正常的路由導航，並且會在瀏覽器歷史記錄中添加一個新的條目，用戶可以通過瀏覽器的前進和後退按鈕導航。

### router.replace:

- router.replace 方法也用於進行路由導航，但是它不會在瀏覽器歷史棧中添加一個新的記錄，而是替換當前的記錄。
- 使用 router.replace 導航後，用戶無法通過瀏覽器的後退按鈕返回到之前的頁面，因為之前的記錄已經被替換掉了。

### router.go:

- router.go 方法用於在路由器的歷史棧中向前或向後導航若幹步，類似於瀏覽器的前進和後退按鈕。
- router.go(n) 可以導航到歷史棧中的第 n 步，n 可以為負數表示向後導航，為正數表示向前導航。

## sensitive vs strict

### sensitive

- 會嚴格限制大小寫

### strict

- 會限制末尾的`/`

## `+` & `*`的差別

### + (Plus Modifier)
路由參數必須匹配「一個或多個」路徑片段。也就是說，如果使用 :param+，那麼路徑中至少要有一個對應的值。
### * (Asterisk Modifier)
表示該路由參數可以匹配「零個或多個」路徑片段。使用 :param* 意味著即使路徑中沒有對應的參數，匹配也會成功

### summary
+：要求至少有一個匹配項，匹配結果至少有一個值。
*：允許沒有匹配項，匹配結果可能是空的。
```js
const routes = [
  // /:chapters ->  匹配 /one, /one/two, /one/two/three, 等
  { path: "/:chapters+" },

  // /:chapters -> 匹配 「/」, /one, /one/two, /one/two/three, 等
  // 可以匹配到「/」
  { path: "/:chapters*" },

  // /:orderId -> 仅匹配数字
  { path: '/:orderId(\\d+)' },

  // /:productName -> 匹配其他任何内容
  { path: '/:productName' },

];
```

## 如何定義 vue-router 的動態路由

- 主要使用 path 的屬性，並使用動態路徑引數，以冒號為開頭
- details/a、details/b，都會映射到 Details 元件上

```js
{
  path: "/details/:id";
  name: "Details";
  components: Details;
}
```

- 當匹配到/details 下的路由時，引數會被設定到`this.$route.params`之下，通過這屬性可以獲得動態引數

```js
console.log(this.$route.params.id);
```

## $router vs $route

### $route：

- $route 是指當前路由的信息對象。在 Vue.js 中，它是 Vue Router 插件提供的一個全局對象，在組件內部可以通過 $route 訪問當前路由的相關信息，比如路由參數、查詢參數、路徑等。
- 通過 $route，你可以訪問當前頁面的路由信息，例如當前路徑、參數等，而不管是通過動態路由還是編程式導航來到達當前頁面的。
- vue3 使用`useRoute`，監聽時建議監聽一個 key 值

```js
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

export default {
  setup() {
    const route = useRoute();
    const userData = ref();

    // 当参数更改时获取用户信息
    watch(
      () => route.params.id,
      async (newId) => {
        userData.value = await fetchUser(newId);
      }
    );
  },
};
```

### $router：

- $router 是指路由器對象，它是 Vue Router 或類似的路由管理器的實例。在 Vue.js 中，它是由 Vue Router 創建的路由器實例，在組件內部可以通過 $router 進行編程式導航，比如跳轉到其他頁面、修改 URL 等。
- 通過 $router，你可以在組件中進行路由的導航操作，例如通過 push 方法跳轉到其他頁面，或者通過 go 方法在瀏覽器歷史記錄中前進或後退。
- vue3 使用`useRouter`

```js
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    function pushWithQuery(query) {
      router.push({
        name: "search",
        query: {
          ...route.query,
          ...query,
        },
      });
    }
  },
};
```

## vue router hook

- beforeRouteLeave（組件）：在導航離開該組件的對應路由時觸發。可以用來詢問用戶是否要離開當前頁面，或者執行一些離開頁面前的清理工作。

- beforeEach（全域）: 在路由跳轉之前觸發，可以用來進行全局的導航守衛邏輯，例如檢查用戶是否有權限訪問某個頁面。

- beforeRouteUpdate（組件）: 在當前路由改變，但是該組件被「覆用時」觸發。例如從 /users/1 導航到 /users/2 時，會觸發 beforeRouteUpdate 鉤子。

- beforeEnter（路由獨享）

- beforeRouteEnter（組件）: 在路由進入之前觸發，但是在組件渲染之前。在這個鉤子中無法訪問組件實例 this，但可以通過傳入的回調函數訪問組件實例。

```html
<!-- vue2 -->
<script>
  export default {
    data(){
      return { ... }
    },
    beforeRouteEnter(){
      // 尚未進入該元件時被調用
      // ...
    },
    beforeRouteUpdate(){
      // 路由被改變，但是元件本身仍是同一個的時候被調用
      // ...
    },
    beforeRouteLeave(){
      // 當路由要離開這個元件時被自動調用
      // ...
    }
  }
</script>
```

```js
// vue3
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ref } from "vue";

export default {
  setup() {
    // 与 beforeRouteLeave 相同，无法访问 `this`
    onBeforeRouteLeave((to, from) => {
      const answer = window.confirm(
        "Do you really want to leave? you have unsaved changes!"
      );
      // 取消导航并停留在同一页面上
      if (!answer) return false;
    });

    const userData = ref();

    // 与 beforeRouteUpdate 相同，无法访问 `this`
    onBeforeRouteUpdate(async (to, from) => {
      //仅当 id 更改时才获取用户，例如仅 query 或 hash 值已更改
      if (to.params.id !== from.params.id) {
        userData.value = await fetchUser(to.params.id);
      }
    });
  },
};
```

- beforeResolve（全局）: 在導航被確認之前，同時在所有組件內守衛和異步路由組件被解析之後觸發。與 beforeEach 不同的是，beforeResolve 在所有組件內守衛和異步路由組件解析完之後才被調用。

- afterEach（全局）: 在導航成功完成後觸發，可以用來執行一些全局的邏輯，例如頁面瀏覽統計等。
  - 可在此測試全局是否導航故障

## 如何得知路由引數變化

- 用 watch 監測

```js
watch: {
  $route(to, from){
    console.log(to.path)
    // 對路由變化做出響應
  }
}
```

- 元件內 hook function update

```js
beforeRouteUpdate(to, from, next){
  // to do somethings
}
```

## 傳參數

### params：

- 只能使用 name
- 引數不會顯示在路徑上
- 強制重新整理引數會被清空

```js
// 傳遞引數
this.$router.push({
  name: Home，
  params: {
    number: 1 ,
    code: '999'
  }
})
// 接收引數
const p = this.$route.params
```

### Query:

- 引數會顯示在路徑上，重新整理不會被清空
- name 可以使用 path 路徑

```js
// 傳遞引數
this.$router.push({
  name: Home，
  query: {
    number: 1 ,
    code: '999'
  }
})
// 接收引數
const q = this.$route.query
```

## vue-router 如何實現 lazy load

- 把不同路由對應的元件分割成不同的程式區塊，然後當路由被存取時才載入對應的元件（可以加快專案載入速度，提高效率）

```js
const router = new VueRouter({
  routes: [
    {
      path: '/home',
      name: 'Home'，
      component:() = import('../views/home')
    }
  ]
})
```

## meta

- 通過 meta 的訊息，可以在路由地址與導航守衛上都被訪問到，以達到近一步過濾的結果

```js
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        // 只有经过身份验证的用户才能创建帖子
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        component: PostsDetail
        // 任何人都可以阅读文章
        meta: { requiresAuth: false },
      }
    ]
  }
]

// 使用
router.beforeEach((to, from) => {
  // 而不是去检查每条路由记录
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    return {
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    }
  }
})
```

## 獲取數據

1. 在 created 中獲取數據
2. 在組件中的 beforeRouteEnter 中獲取數據

## props

- 想要傳不同參數給 router，可以這樣寫

```js
const router = new VueRouter({
  routes: [
    {
      path: "/userA/:id",
      component: UserA,
      props: (route) => ({ id: route.params.id, isAdmin: true }),
    },
    {
      path: "/userB/:id",
      component: UserB,
      props: (route) => ({ id: route.params.id, isAdmin: false }),
    },
  ],
});
```

## scrollBehavior

- 我們可以透過這個 key 值，來讓跳轉 router 時，跳到某處

## 檢測故障

- 如果要檢測故障，可以接 router.push 的值

```js
const navigationResult = await router.push("/my-profile");

if (navigationResult) {
  // 导航被阻止
} else {
  // 导航成功 (包括重新导航的情况)
  this.isMenuOpen = false;
}
```

## 鑑別故障原因

- aborted：在導航守衛中返回 false 中斷了本次導航。
- cancelled： 在當前導航完成之前又有了一個新的導航。比如，在等待導航守衛的過程中又調用了 router.push。
- duplicated：導航被阻止，因為我們已經在目標位置了。

```js
// 正在尝试访问 admin 页面
router.push("/admin").then((failure) => {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    failure.to.path; // '/admin'
    failure.from.path; // '/'
  }
});
```

```js
import { NavigationFailureType, isNavigationFailure } from "vue-router";

// await後，去看錯誤是什麼
const failure = await router.push("/articles/2");

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // 给用户显示一个小通知
  showToast("You have unsaved changes, discard and leave anyway?");
}
```

## 程式新刪路由

### 新增

```js
router.addRoute({ path: "/about", component: About });
// 我们也可以使用 this.$route 或 route = useRoute() （在 setup 中）
router.replace(router.currentRoute.value.fullPath);
```

### 刪除

- 通過新增一個名稱衝突的路由，來添加路由

```js
router.addRoute({ path: "/about", name: "about", component: About });
// 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
router.addRoute({ path: "/other", name: "about", component: Other });
```

- 按照名稱刪除路由

```js
router.addRoute({ path: "/about", name: "about", component: About });
// 删除路由
router.removeRoute("about");
```

- 新增嵌套路由

```js
router.addRoute({ name: "admin", path: "/admin", component: Admin });
router.addRoute("admin", { path: "settings", component: AdminSettings });
```

- 查看現有路由

```js
router.hasRoute();
router.getRoutes();
```
