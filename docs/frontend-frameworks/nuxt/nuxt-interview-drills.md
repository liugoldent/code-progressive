---
sidebar_position: 2
title: "Nuxt 初中階到高階面試實戰題"
description: "Nuxt 3／4 面試題庫，涵蓋 SSR、Hydration、資料取得、路由中介層、狀態隔離、Nitro、快取、安全性與架構實作。"
tags:
  - Nuxt
  - Interview
  - SSR
  - Nitro
keywords: ["Nuxt 面試題", "Nuxt SSR", "Nuxt useFetch", "Nuxt Nitro", "Nuxt hydration", "Nuxt 高階面試"]
---

# Nuxt 初中階到高階面試實戰題

這份題庫以 **Nuxt 3／4 共通核心**為主，程式碼目錄以 Nuxt 4 為例。Nuxt 3 專案可能沒有最外層的 `app/`，但 SSR、資料取得、Hydration 與 Nitro 等核心觀念相同。

建議先口頭回答，再展開參考答案。面試官真正想聽的通常不是 API 名稱，而是你能不能說明：**程式在哪裡執行、資料如何跨越 server/client 邊界、狀態屬於誰，以及失敗時怎麼定位。**

## 能力分級

| 區段 | 建議能力 | 回答標準 |
| --- | --- | --- |
| 1～6 | 初中階 | 知道 Nuxt 解決什麼問題，能正確使用路由、資料取得與 server API |
| 7～12 | 中階 | 能處理 reactive fetch、Hydration、SSR 狀態隔離、middleware 與 cookie |
| 13～18 | 中高階～高階 | 能做 rendering、cache、安全性、效能與可觀測性的系統性取捨 |

---

## 初中階：框架與日常開發

### 1. Nuxt 和只使用 Vue + Vue Router 有什麼差別？

<details>
<summary>參考答案</summary>

Vue 是 UI framework；Nuxt 在 Vue 之上提供應用框架所需的約定與整合，例如：

- 檔案式路由、layout、middleware、plugin 與 auto-import。
- Universal rendering、client-side rendering、prerender 與 hybrid rendering。
- `useFetch`、`useAsyncData` 與 payload，處理 SSR 資料傳遞。
- Nitro server，可建立 API、server middleware，並部署到 Node、serverless 或 edge 類型環境。
- head/SEO、錯誤頁、build 與部署整合。

重點不是「Nuxt 比 Vue 多很多 API」，而是它定義了一套 server/client 都能運作的 application lifecycle 與專案慣例。若產品只是一個不需要 SSR、SEO 或 server 能力的小型內部 SPA，Vue + Router 可能已足夠；若需要內容首屏、SEO、BFF 或多種 rendering 策略，Nuxt 通常能減少自行整合的成本。

</details>

### 2. 使用 universal rendering 開啟一個 Nuxt 頁面時，發生了哪些事？

<details>
<summary>參考答案</summary>

可以分成四段：

1. 瀏覽器向 Nuxt/Nitro server 請求頁面。
2. Server 建立這次 request 的 Vue/Nuxt app，執行需要的 middleware、plugin、page setup 與資料取得，產生 HTML。
3. Nuxt 把 `useFetch`、`useAsyncData`、`useState` 等需要的初始資料序列化進 payload，連同 HTML 回傳。
4. 瀏覽器載入 JavaScript，以相同初始狀態進行 hydration，接管既有 DOM；之後的頁面切換通常由 client router 完成。

Server render 出來的 HTML 和 client 第一次 render 必須一致。也要記得同一份 universal code 可能在 server 與 browser 都執行，因此不能無條件讀取 `window`、`document` 或 `localStorage`。

</details>

### 3. 如何建立動態頁面、巢狀頁面和 404 catch-all 頁面？

<details>
<summary>參考答案</summary>

Nuxt 依 `app/pages/` 檔案結構產生 Vue Router routes，例如：

```text
app/pages/
├── index.vue                 # /
├── products/
│   ├── index.vue             # /products
│   └── [id].vue              # /products/:id
└── [...slug].vue             # catch-all
```

頁面中可用 `useRoute()` 取得參數，用 `navigateTo()` 做 Nuxt-aware navigation。共用外框放 `app/layouts/`，頁面可透過 `definePageMeta({ layout: 'admin' })` 指定 layout。

高品質回答還會提到：route param 是外部輸入，進入 server API 或資料庫前仍要驗證；catch-all 並不自動等於正確的 HTTP 404，需要在找不到資料時丟出帶 `statusCode: 404` 的錯誤。

</details>

### 4. `$fetch`、`useFetch`、`useAsyncData` 分別什麼時候用？

<details>
<summary>參考答案</summary>

- `$fetch`：單純發出 request。適合 click/submit 等事件觸發的 mutation，或放進 `useAsyncData` handler。
- `useFetch`：`useAsyncData` + `$fetch` 的便利封裝，適合依 URL 取得頁面初始資料。
- `useAsyncData`：handler 不只是一個 HTTP URL，或需要自訂 key、轉換、組合多個資料來源時使用。

在 universal page setup 直接寫 `await $fetch('/api/products')`，server render 和 client hydration 可能各執行一次。`useFetch` / `useAsyncData` 會把 server 結果放進 Nuxt payload，client hydration 可以重用資料。

```vue
<script setup lang="ts">
const { data, status, error, refresh } = await useFetch('/api/products')

async function createProduct(input: ProductInput) {
  await $fetch('/api/products', { method: 'POST', body: input })
  await refresh()
}
</script>
```

面試時不要只回答「GET 用 `useFetch`、POST 用 `$fetch`」；真正差異是 **async state、SSR payload、dedupe 與 navigation 行為**。

</details>

### 5. `runtimeConfig` 的 public 和 private 設定有什麼差別？

<details>
<summary>參考答案</summary>

`runtimeConfig` 最外層的自訂 key 預設只在 server 可用；`runtimeConfig.public` 會送到 client，任何人都能從瀏覽器看到，所以不能放 secret。

```ts title="nuxt.config.ts"
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: '/api',
    },
  },
})
```

部署時可用結構相符的環境變數覆寫，例如 `NUXT_API_SECRET`、`NUXT_PUBLIC_API_BASE`。Server route 中建議以 `useRuntimeConfig(event)` 讀取；client 只能取得 public/app config。

若第三方服務需要 secret，應由 Nitro server 代為呼叫，不能因為前端需要請求就把 secret 移進 `public`。`app.config.ts` 適合可公開、build-time 決定的 app 設定；需要部署後由環境變數調整的值則使用 runtime config。

</details>

### 6. `server/api/` 能做什麼？它和一般頁面有什麼邊界？

<details>
<summary>參考答案</summary>

`server/api/users.get.ts` 會成為 `/api/users` endpoint，由 Nitro/h3 執行；handler 可以驗證輸入、讀 cookie、呼叫資料庫或使用 server-only secret。

```ts title="server/api/profile.get.ts"
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  return getPublicProfile(session.userId)
})
```

它常被用作 BFF（Backend for Frontend）：瀏覽器只呼叫同源 `/api`，Nitro 再整合後端服務、正規化 response，並避免把 token 或內部服務位址暴露給 client。

但 BFF 不該變成沒有邊界的第二套大型 backend。Server code 不應 import Vue component 或 app-only composable；browser bundle 也不應 import server-only database/secret code。商業規則放在哪一層要有明確 ownership。

</details>

---

## 中階：資料流、Hydration 與 request 邊界

### 7. 切換 route param 後，為什麼畫面仍是上一個商品？

```vue
<script setup lang="ts">
const route = useRoute()
const url = `/api/products/${route.params.id}`
const { data } = await useFetch(url)
</script>
```

<details>
<summary>參考答案</summary>

這段在 setup 時把 URL 算成普通字串，之後 param 改變不會使 URL 成為 reactive dependency。應傳 getter/computed，或明確用 `watch`：

```ts
const route = useRoute()
const productId = computed(() => String(route.params.id))

const { data, status } = await useFetch(
  () => `/api/products/${productId.value}`,
)
```

進一步要檢查 async data key。相同 key 的呼叫會共享 `data`、`error`、`status` refs；共用 key 時，handler、`deep`、`transform`、`pick`、`default` 等會影響資料形狀的選項必須一致。也要處理快速切換時的取消/dedupe、404 與 loading UI，不能只讓 request 成功就算完成。

</details>

### 8. `lazy: true`、`server: false` 和預設資料取得的 UX 差異是什麼？

<details>
<summary>參考答案</summary>

預設的 `useFetch` / `useAsyncData` 會配合 Vue Suspense，在 client navigation 時等待資料完成後再完成導頁，適合頁面不可缺少的主要資料。

`lazy: true`（或 `useLazyFetch`）不阻擋 client navigation，頁面先進入，再用 `status === 'pending'` 顯示 skeleton，適合次要內容或希望快速轉場的情境。

`server: false` 代表 SSR 不取資料，要等 hydration 後才在 client 執行。初次載入即使 `await useFetch(...)`，setup 當下的 data 仍可能是 `undefined`，因此一定要設計 pending/empty/error 狀態。它不是「修好 SSR bug」的通用開關，因為會犧牲 server HTML 的內容、SEO 與首屏表現。

</details>

### 9. Hydration mismatch 常見原因有哪些？你會怎麼查？

<details>
<summary>參考答案</summary>

常見原因：

- render 期間使用 `Date.now()`、`Math.random()`，或 server/client timezone、locale 不一致。
- 首次 render 直接依 `window`、viewport、localStorage 或 client-only auth state 分支。
- 無效 HTML nesting 被瀏覽器 parser 修正。
- server 與 client 取得不同資料，或 payload key/狀態被錯誤共用。
- module-scope mutable state 汙染不同 SSR requests。
- 第三方 library 在 Vue hydration 前修改 DOM。

定位順序：先保留警告，不急著用 `<ClientOnly>` 隱藏；比較 server response HTML、Nuxt payload 和 client 第一次 render 的輸出；縮小到最小元件；讓初始輸出 deterministic，再把 browser-only 行為移到 `onMounted` 或 `.client` plugin。

`<ClientOnly>` 適合本質上無法 SSR 的 widget，例如依賴 canvas/DOM 的 editor，但仍應提供合理 fallback，並接受它對首屏與 SEO 的影響。

</details>

### 10. 為什麼不能把共享的 `ref` 直接宣告在 composable 檔案最外層？

```ts
// composables/useCart.ts
const cart = ref<CartItem[]>([])
export const useCart = () => cart
```

<details>
<summary>參考答案</summary>

在長時間運行的 SSR server 中，module instance 可能被多個 request 重用。最外層 mutable singleton 可能讓 A 使用者的狀態洩漏給 B 使用者，也可能造成記憶體持續累積。

需要 SSR-friendly 的 app state 可使用帶穩定 key 的 `useState`：

```ts
export const useCart = () =>
  useState<CartItem[]>('cart', () => [])
```

`useState` 會依 Nuxt app/request context 管理，且可把 server 初始值帶到 client。放入的內容仍須能安全序列化，也不能把 secret 塞進 payload。

高品質回答還要區分：client global state、單次 request context、server process cache、database 是四種不同生命週期；不是所有東西都該改成 `useState`。例如 server connection pool 是刻意的 process singleton，使用者 cart 則不是。

</details>

### 11. Route middleware 和 server middleware 有什麼不同？驗證登入該放哪裡？

<details>
<summary>參考答案</summary>

Route middleware 位於 Vue app/router 層，收到 `to`、`from`，適合 navigation redirect、頁面權限 UX。它可能在初次 SSR、client hydration 與後續 client navigation 執行，程式要能處理不同環境，side effect 也要避免重複。

Server middleware 位於 Nitro 層，針對送進 server 的 HTTP requests 執行，適合解析 session、加 request context、log/trace 與 header policy；它不是 Vue Router guard。

登入頁 redirect 可以由 route middleware 做，但 API 的真正授權必須在 server endpoint 再驗證。只靠 client/route guard 保護資料是不安全的，攻擊者可以直接呼叫 API。

</details>

### 12. SSR 呼叫需要登入的 API 時，cookie/header 為什麼可能不見？

<details>
<summary>參考答案</summary>

Browser 發 request 時會按規則自動帶 cookie；但 SSR 是 Nuxt server 代表使用者再發一個 request，不能假設任意 `$fetch` 都會自動轉送使用者 header，否則可能造成安全問題。

對同源相對路徑使用 `useFetch('/api/me')` 時，Nuxt server 會透過 request-aware fetch 轉送合適的 headers/cookies。自行用 `useAsyncData` + `$fetch` 時，可評估 `useRequestFetch()`，或只白名單取出必要 header：

```ts
const headers = useRequestHeaders(['authorization'])

const { data: me } = await useFetch('/api/me', { headers })
```

不要把所有 incoming headers 無條件轉送到外部網域。還要區分兩個方向：把 browser cookie 帶到上游，和把上游的 `Set-Cookie` 帶回 browser 是不同問題；後者需要明確處理 response header。

</details>

---

## 中高階～高階：架構、快取、安全與效能

### 13. 一個只能在瀏覽器執行的圖表套件，應如何整合？

<details>
<summary>參考答案</summary>

先確認套件是在 import 階段就讀 DOM，還是只有建立 instance 時才需要 DOM。常見做法是：

- 放進 `app/plugins/chart.client.ts`，限制 plugin 只進 client bundle/runtime。
- 或在 `onMounted` 中 dynamic import，延後下載與初始化。
- 元件 unmount 時銷毀 chart、observer、timer 與 listener。
- Server 與 client 首次輸出提供一致的容器或 skeleton，避免 hydration mismatch 與 layout shift。

不應只在任意 universal plugin 裡寫 `if (import.meta.client)` 就結束討論；`.client` suffix 還能清楚表達 bundle 邊界。若套件很大，還要考慮 route-level code splitting、互動前是否真的需要下載，以及資料和 view instance 的 ownership。

</details>

### 14. 電商站的首頁、商品頁、會員後台，rendering 策略怎麼選？

<details>
<summary>參考答案</summary>

不應整站只選一種模式，可以按 route 的內容新鮮度、個人化程度、SEO 與成本做 hybrid rendering：

```ts title="nuxt.config.ts"
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/products/**': { swr: 300 },
    '/admin/**': { ssr: false },
  },
})
```

- 首頁若發布時即可決定，可 prerender；更新頻繁則評估 SWR/ISR。
- 公開商品頁需要 SEO，可 SSR 或用 SWR/ISR，並設計價格/庫存的新鮮度。
- 高互動、登入後且 SEO 不重要的 admin 可 CSR，但 SSR 也不是一定不能用。

`prerender`、`swr`、`isr` 的實際能力還跟 deployment preset/platform 有關。答案必須說明失效時間、重新驗證、fallback、成本與監控，而不是把 `ssr: false` 當成效能最佳化。

</details>

### 15. 把商品頁設成 SWR 後，為什麼可能把會員價格顯示給別人？

<details>
<summary>參考答案</summary>

Full-page/handler cache 若只以 URL 當 key，而 HTML 或 response 混入 cookie、會員等級、tenant、語系等個人化資料，後來的使用者可能拿到前一人的 cache，這是資料外洩，不只是內容過期。

設計選項包括：

- 可快取頁面只 render 公開資料，個人化區塊在授權後另外取得。
- 真的需要 vary 時，明確把必要維度放進 cache key，但要評估 cardinality 和 cache 效益。
- 私人 response 不做 shared cache，並設定正確的 cache headers。
- mutation 後定義 purge/revalidate 策略，不只靠 TTL 猜測。

高階回答應把 cache 拆成 CDN、Nitro full response、server data、browser HTTP cache 與 client async state；每層的 key、TTL、stale policy、ownership 和 invalidation 都不同。

</details>

### 16. 請設計 Nuxt 的登入與授權邊界。

<details>
<summary>參考答案</summary>

一個合理答案可以是：

1. Server endpoint 驗證帳密/第三方 callback，建立 session；敏感 token 優先留在 server 或 `HttpOnly`、`Secure`、合適 `SameSite` 的 cookie。
2. Nitro server middleware 或 server utility 解析 session，將最小 user context 放進 `event.context`。
3. 每個受保護 API 執行 authentication + authorization；不只驗證「有登入」，還要驗證 resource ownership/role。
4. Route middleware 只負責頁面 redirect 和 UX，不能取代 server authorization。
5. SSR 透過 request-aware fetch 取得目前使用者，避免先顯示登出再跳成登入的閃爍。
6. Logout、過期、refresh rotation、CSRF、XSS、rate limit、audit log 都有明確策略。

把 access token 存 localStorage 再稱為「因為方便」不是完整設計；要根據攻擊模型、跨網域需求、token 生命週期與後端架構說明取捨。

</details>

### 17. Nuxt 頁面 TTFB 快、但 LCP 與 hydration 很慢，你會怎麼改善？

<details>
<summary>參考答案</summary>

先量測而不是直接加快取。用 server timing/APM 區分 server work，以 Lighthouse/Performance、Network、Nuxt DevTools 觀察 LCP resource、long task、bundle、payload 與 hydration。

可能的改善方向：

- 降低 client JavaScript：移除重套件、dynamic import、延後非關鍵 widget、避免把 server-only code 帶進 client。
- 降低 payload：只回傳畫面需要的欄位，評估 `pick`/`transform`、分頁，以及不需要深層響應式時使用 `deep: false`。
- 優化 LCP image/font：正確尺寸、格式、preload priority，避免 client render 才知道圖片 URL。
- 避免 waterfall：主要資料平行取得，次要資料 lazy；同 key/同 endpoint 避免重複 request。
- 降低 hydration 工作：減少首屏 component 數量、昂貴 computed/watch、同步第三方 script 與不必要 reactive proxy。

每項修改要回到指標驗證，並注意 TTFB、freshness、SEO、互動性與 server 成本可能互相拉扯。

</details>

### 18. Nuxt 的錯誤處理和可觀測性要怎麼分層？

<details>
<summary>參考答案</summary>

先區分「預期的 domain error」和「非預期系統錯誤」：

- API 對輸入錯誤、未登入、無權限、找不到資源回正確 4xx；dependency failure 或程式錯誤才是 5xx。
- Page 取得不到核心資源時可丟出 `createError({ statusCode: 404, fatal: true })`，交給 error page；局部 widget 失敗則顯示局部 retry，不一定炸掉整頁。
- 不把原始 stack、SQL、token 或上游 response 直接回給 client。
- Server log 使用 request/trace id 串接入口、Nitro handler 和上游服務；記錄 latency、status、cache hit/miss 與 retry，但遮罩個資。
- Client error reporting 帶 route、release/build id 與必要 context，source map 僅安全上傳到監控服務。

高階回答還會談 timeout、abort、有限次 retry + backoff、circuit breaker/降級，以及「使用者可採取什麼動作」，而不只是全域 `console.error`。

</details>

---

## 綜合實作題

### 實作題 A：商品詳情頁

需求：`/products/:id` 要支援 SEO、SSR、404、切換規格、會員價、加入購物車與錯誤重試。

<details>
<summary>評分重點</summary>

- 用 reactive URL/key 取得公開商品資料，並讓 server status code 真正成為 404。
- `useSeoMeta` 的 title/description 使用 SSR 已取得的商品資料。
- 公開商品資料與會員價分開定義 cache/security boundary，不能讓 shared cache 混入私人資料。
- 加入購物車是事件型 mutation，用 `$fetch`，處理 double submit、錯誤與重新同步。
- route param、規格 id 與 API response 有 runtime validation，不能只相信 TypeScript。
- skeleton、not found、局部 error、retry 和 stale UI 都有明確狀態。

</details>

### 實作題 B：找出重複 request

現象：首頁 initial load 中 `/api/home` 出現兩次，偶爾還有 hydration warning。請說明你的排查流程。

<details>
<summary>評分重點</summary>

先確認兩次 request 分別來自 browser network、Nitro internal fetch、server log，不能只看 log 行數就認定重複。

接著檢查：是否在 setup 直接 `$fetch`、`onMounted` 又 fetch、watch immediate 又執行、server/client plugin 各執行、兩個 component 使用不同 async key、錯誤 fallback 重試，或 reactive options 在 hydration 時改變。

再用 Nuxt payload/DevTools、request id 和最小重現確認 server 資料是否成功傳給 client，最後修正資料 owner 與唯一取得路徑。Hydration warning 要比較首次輸出，不應靠延遲 request 或 `<ClientOnly>` 假裝消失。

</details>

### 實作題 C：設計 `useApiFetch`

需求：統一 base URL、型別、認證錯誤與 request id，但 SSR cookie 不能遺失，也不能讓 refresh token 洩漏到 client。

<details>
<summary>評分重點</summary>

- 先定義它是包裝 `$fetch` instance，還是包裝 `useFetch` async state；兩者用途不同，不要用同一函式隱藏所有行為。
- Client/server 的 credential 來源不同；server 端使用 request context 或走同源 BFF，不把 server secret 注入 public config。
- 只轉送白名單 headers，避免把 incoming headers 全部送到任意外部 URL。
- 401 refresh 要避免多個 request 同時 refresh、無限 retry 與 mutation 自動重送。
- 保留 AbortSignal、timeout、錯誤型別與原本的 async data key/options，不讓 wrapper 吃掉 Nuxt 能力。
- request id、log 與使用者訊息分層，敏感資訊要遮罩。

</details>

## 面試自我檢查

回答每題後，用下面五個追問檢查自己：

1. 這段程式會在 server、client，還是兩邊執行？
2. 這個 state 是 component、Nuxt app、單次 request、server process，還是 shared cache 的？
3. 初次 SSR 和後續 client navigation 的行為是否不同？
4. 這份資料能否被序列化、快取或送到瀏覽器？是否包含個資或 secret？
5. 我會用什麼 log、DevTools、Network 或效能指標證明判斷？

## 官方延伸閱讀

- [Nuxt：Rendering Modes](https://nuxt.com/docs/4.x/guide/concepts/rendering)
- [Nuxt：Data Fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching)
- [Nuxt：State Management](https://nuxt.com/docs/4.x/getting-started/state-management)
- [Nuxt：Route Middleware](https://nuxt.com/docs/4.x/directory-structure/app/middleware)
- [Nuxt：Server Directory](https://nuxt.com/docs/4.x/directory-structure/server)
- [Nuxt：Runtime Config](https://nuxt.com/docs/4.x/guide/going-further/runtime-config)
- [Nuxt：Plugins](https://nuxt.com/docs/4.x/directory-structure/app/plugins)
