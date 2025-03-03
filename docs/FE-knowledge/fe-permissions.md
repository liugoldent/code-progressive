---
description: vue 面試常見問題
tags:
  - javascript
  - Test
  - Vue
  - Vue2
  - Vue3
---

# [FE] 前端權限

## 觸發形式
- 頁面加載觸發
- 頁面上的按鈕點擊觸發

## 最終目標

### 路由方面
使用者登入後只能看到自己有權存取的導覽選單，也只能存取自己有權訪問的路由地址，否則將跳轉 `4xx` 提示頁

### 視圖方面
使用者只能看到自己有權瀏覽的內容和有權操作的控件

### 最後再加上請求控制
作為最後一道防線，路由可能配置失誤，按鈕可能忘了加權限，這種時候請求控制可以用來兜底，越權請求將在前端被攔截

## 四種權限

前端權限控制可以分為四個方面：

- 接口(API)權限
- 按鈕權限
- 菜單權限
- 路由權限

## 1. 接口權限（API 權限）

### 核心流程
1. Token 驗證
使用者登入後，後端會發放一個 JWT（或其他格式的令牌），前端需將此令牌保存（例如存放在 Vuex/Pinia、LocalStorage 或 Cookie 中）。

2. 自動附帶 Token
使用 Axios 攔截器，在每次發送 API 請求前，從集中管理的狀態中取得令牌並附加到請求頭部（一般使用 Authorization 標頭）。

3. 全局錯誤處理
在回應攔截器中，統一捕捉如 401（未授權）或 403（禁止訪問）等錯誤。當遇到這類錯誤時，可選擇刷新令牌、登出或跳轉到登入頁，確保使用者在令牌過期或非法情況下不會繼續操作。

4. 進階功能：令牌刷新
如果需要，可以實作令牌自動刷新機制，即當令牌即將過期或已過期時，自動向後端請求新的令牌，並重試原本失敗的請求。

### 實作
```js
// api.js
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 建立 Axios 實例
const apiClient = axios.create({
  baseURL: 'https://your-api-domain.com', // API 基本 URL
  timeout: 10000
})

// 請求攔截器：在發送請求前自動附帶令牌
apiClient.interceptors.request.use(config => {
  const userStore = useUserStore()
  const token = userStore.token // 或從 localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 回應攔截器：統一處理錯誤，例如 401 或 403
apiClient.interceptors.response.use(response => {
  return response
}, async error => {
  if (error.response) {
    // 若返回 401 未授權，代表令牌可能過期或無效
    if (error.response.status === 401) {
      // 可以選擇嘗試刷新令牌（若有實作刷新機制）
      // 例如：await userStore.refreshToken()
      // 或直接登出並導向登入頁
      const userStore = useUserStore()
      await userStore.logout()  // 清除使用者狀態
      router.push('/login')
    }
    // 根據需要，可處理其他狀態碼，例如 403 亦可跳轉到錯誤頁面
    if (error.response.status === 403) {
      router.push('/403')
    }
  }
  return Promise.reject(error)
})

export default apiClient
```

### 範例
```js
import apiClient from '@/api'

async function fetchUserData() {
  try {
    const response = await apiClient.get('/user/profile')
    console.log(response.data)
  } catch (error) {
    console.error('API 請求失敗', error)
  }
}
```

### 小結
* 集中管理：前端透過 Pinia 或其他狀態管理工具統一管理令牌，確保各個 API 請求都能自動附帶驗證資訊。
* 攔截器封裝：利用 Axios 攔截器封裝請求和回應邏輯，使得全局錯誤處理（例如 401 或 403）更集中、易於維護。
* 進階擴展：可以加入令牌自動刷新機制，提升使用體驗，降低因令牌過期導致的中斷風險

## 2. 按鈕權限
建立一個「權限按鈕」元件，將權限檢查邏輯包裝起來，使用時只需傳入該按鈕所需的權限即可
### 核心流程
1. 建立元件
```html
<!-- PermissionButton.vue -->
<template>
  <!-- 當有權限時才渲染預設的按鈕，並且傳遞所有屬性和事件 -->
  <button v-if="hasPermission" v-bind="attrs" @click="handleClick">
    <slot />
  </button>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { useUserStore } from '@/stores/user'  // 假設這裡使用 Pinia 管理使用者狀態

// 定義元件接收的 props，allowed 為需要的權限陣列，若不傳則代表無限制
const props = defineProps({
  allowed: {
    type: Array,
    default: () => []
  }
})

// 取得所有父層傳入的屬性 (例如 class、id、type 等)
const attrs = useAttrs()

// 從 store 中取得使用者當前的權限 (這裡假設權限為字串陣列)
const userStore = useUserStore()
const hasPermission = computed(() => {
  // 如果未指定權限要求，則直接回傳 true
  if (!props.allowed.length) return true
  // 若使用者任一權限在 allowed 內，即有權限
  return props.allowed.some(role => userStore.permissions.includes(role))
})

// 若需要，可以在這裡加入點擊前的其他邏輯處理
function handleClick(event) {
  // 僅在有權限的情況下觸發 click 事件（此處因 v-if 已做判斷，一般直接觸發即可）
  // 若需要額外處理，可在此進行擴展
  // 這邊直接讓事件往上傳遞
}
</script>
```
2. 使用元件
只需要將按鈕內容包在 `<PermissionButton>` 內，並指定該按鈕所需的權限（例如 ['admin', 'editor']）
```html
<template>
  <PermissionButton :allowed="['admin']" @click="editHandler">
    編輯
  </PermissionButton>
</template>

<script setup>
function editHandler() {
  // 編輯的處理邏輯
  console.log('進行編輯操作')
}
</script>
```

### 小結
* 封裝性高： 將權限檢查邏輯集中在一個元件內，模板變得更乾淨，日後修改或擴展也較容易。
* 宣告式設計： 直接在模板中使用 `<PermissionButton :allowed="...">`，直觀地表達出「此按鈕需要這些權限」的意圖。
* 維護方便： 若使用者權限的來源或邏輯有變動，只需修改元件內的邏輯，不必遍及每個使用 v-if 的地方。

## 3. 菜單權限
核心思想：動態生成菜單

### 核心流程
1. 菜單配置
先在前端定義一份完整的菜單配置檔（也可以由後端返回），每個菜單項目中包含標題、路由、圖標與對應需要的權限（例如 roles 或 permissions）：
```js
// menu.config.js
export const menuConfig = [
  {
    title: '儀表板',
    path: '/dashboard',
    icon: 'dashboard-icon',
    roles: ['admin', 'user']
  },
  {
    title: '管理',
    path: '/admin',
    icon: 'admin-icon',
    roles: ['admin'],
    children: [
      {
        title: '使用者管理',
        path: '/admin/users',
        roles: ['admin']
      },
      {
        title: '權限設定',
        path: '/admin/permissions',
        roles: ['admin']
      }
    ]
  },
  {
    title: '個人中心',
    path: '/profile',
    icon: 'profile-icon',
    roles: ['admin', 'user']
  }
]
```
2. 動態過濾
當使用者登入後，透過集中式狀態管理（如 Pinia 或 Vuex）保存使用者的角色或權限，然後建立一個 computed property 根據該資訊從完整菜單配置中過濾出可存取的項目。這裡建議使用遞迴處理，因為菜單可能具有多層結構。

3. 渲染菜單
最後，使用一個菜單元件（例如側邊欄）依據過濾後的菜單資料進行渲染。這樣既能做到菜單與路由的解耦，也方便之後做權限修改或新增功能時只需更新菜單配置檔即可。

### 範例
: 在 Store 中存放使用者權限
```js
// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    roles: []  // 例如 ['user'] 或 ['admin']
  }),
  actions: {
    setRoles(newRoles) {
      this.roles = newRoles
    }
  }
})
```
: 建立過濾菜單的邏輯
```html
<!-- src/components/Menu.vue -->
<template>
  <nav>
    <ul>
      <li v-for="item in allowedMenus" :key="item.path">
        <router-link :to="item.path">
          <i :class="item.icon"></i>
          {{ item.title }}
        </router-link>
        <!-- 如果有子菜單，遞迴渲染 -->
        <ul v-if="item.children && item.children.length">
          <li v-for="child in item.children" :key="child.path">
            <router-link :to="child.path">
              {{ child.title }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { menuConfig } from '@/config/menu.config'

const userStore = useUserStore()

const allowedMenus = computed(() => {
  // 遞迴過濾菜單項目
  const filterMenus = menus => {
    return menus.reduce((acc, menu) => {
      // 如果沒有設定 roles，預設允許存取；否則需檢查是否有符合使用者角色
      const hasPermission =
        !menu.roles || menu.roles.some(role => userStore.roles.includes(role))
      if (hasPermission) {
        const newMenu = { ...menu }
        if (newMenu.children) {
          newMenu.children = filterMenus(newMenu.children)
        }
        acc.push(newMenu)
      }
      return acc
    }, [])
  }
  return filterMenus(menuConfig)
})
</script>

```

### 小結
* 解耦合： 菜單配置與路由、視圖完全分離，修改菜單只需更新配置檔，不影響其他部分。
* 動態生成： 根據使用者權限動態過濾菜單，確保使用者只能看到有權存取的功能。
* 彈性高： 若日後權限邏輯或資料結構有所變動，只需修改過濾函數或菜單配置檔即可。

## 4. 路由權限
### 核心流程
1. 預設公共路由：
應用啟動時先掛載不需要權限驗證的公共路由，例如登入頁、404 頁、401 或 403 頁等。

2. 獲取使用者權限：
當使用者登入後，透過 API 獲取使用者資訊（包含角色或權限），並將該資訊存放在集中式狀態管理（例如 Pinia 或 Vuex）中。

3. 動態生成路由：
根據使用者的權限從完整的路由配置中過濾出可存取的路由，再利用 Vue Router 的 addRoutes（Vue Router 3）或動態路由組件（Vue Router 4）進行掛載。這樣可以避免一開始就將所有路由載入，減少不必要的資源浪費，同時也確保使用者無法透過 URL 直接訪問未授權的頁面。

4. 全局路由守衛檢查：
每次路由跳轉前，先檢查該路由是否設有 meta.roles（或其他權限字段）。如果存在則檢查使用者權限是否符合，不符合則跳轉到 403 或其他提示頁面。

### 範例
1. 定義完整的路由配置（含權限資訊）
```js
// src/router/allRoutes.js
export const allRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '儀表板',
      roles: ['admin', 'user']
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: {
      title: '管理頁',
      roles: ['admin']
    },
    children: [
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/admin/UserManagement.vue'),
        meta: {
          title: '使用者管理',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      title: '個人中心',
      roles: ['admin', 'user']
    }
  }
]
```

2. 使用 Pinia 儲存使用者資訊與生成可訪問路由
```js
// src/stores/user.js
import { defineStore } from 'pinia'
import { allRoutes } from '@/router/allRoutes'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    roles: [],
    allowedRoutes: []  // 儲存可訪問的動態路由
  }),
  actions: {
    // 假設從 API 獲取使用者資訊
    async fetchUserInfo() {
      // 模擬 API 請求
      const response = await new Promise(resolve =>
        setTimeout(() => resolve({ roles: ['user'] }), 500)
      )
      this.roles = response.roles
    },
    // 根據使用者角色過濾可訪問的路由
    generateAllowedRoutes() {
      const filterRoutes = routes => {
        return routes.filter(route => {
          if (route.meta && route.meta.roles) {
            return route.meta.roles.some(role => this.roles.includes(role))
          }
          return true // 未設定角色則預設可訪問
        }).map(route => {
          const tmp = { ...route }
          if (tmp.children) {
            tmp.children = filterRoutes(tmp.children)
          }
          return tmp
        })
      }
      this.allowedRoutes = filterRoutes(allRoutes)
    }
  }
})

```

3. 在路由守衛中動態添加與檢查權限
```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 先定義公共路由（不需驗證的頁面）
const publicRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/403.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes
})

// 全局守衛
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 假設 token 為空表示未登入
  if (!userStore.token && to.path !== '/login') {
    return next('/login')
  }

  // 如果已登入但尚未加載使用者資訊（例如 roles 為空）
  if (userStore.token && userStore.roles.length === 0) {
    await userStore.fetchUserInfo()
    userStore.generateAllowedRoutes()
    // 動態添加可訪問的路由
    userStore.allowedRoutes.forEach(route => {
      router.addRoute(route)
    })
    // 確保 addRoute 完成後再跳轉
    return next({ ...to, replace: true })
  }

  // 檢查目標路由是否有權限限制
  if (to.meta && to.meta.roles) {
    const hasAccess = to.meta.roles.some(role => userStore.roles.includes(role))
    if (!hasAccess) {
      return next({ path: '/403' })
    }
  }
  
  next()
})

export default router
```

### 小結
* 動態路由生成： 根據使用者權限從完整路由配置中篩選出可訪問的路由，避免將不必要的路由預先載入。
* 全局守衛檢查： 在路由跳轉前進行權限檢查，確保使用者無法透過手動輸入 URL 存取未授權頁面。
* 前後端雙重驗證： 儘管前端可做權限控制，但後端仍應該進行二次驗證，防止惡意請求。


## 推薦文章
- [前端權限設計](https://vue3js.cn/interview/vue/permission.html#%E4%B8%80%E3%80%81%E6%98%AF%E4%BB%80%E4%B9%88)