---
sidebar_position: 4
title: "Vue 中高階面試實戰題"
description: "以 Vue 3 響應式、更新排程、watch、元件 API、KeepAlive、SSR hydration 與效能除錯為核心的中高階面試題。"
tags:
  - Vue
  - Interview
  - Reactivity
keywords: ["Vue 3 中高階面試題", "Vue reactivity", "watchEffect", "KeepAlive", "Vue 效能"]
---

# Vue 中高階面試實戰題

[回到 Web Platform 題庫](./index.md)

以下以 Vue 3 Composition API 為主。每題要能說清楚「依賴怎麼被追蹤、更新何時發生、元件邊界如何設計」。

## 1. 解構 `reactive()` 後為什麼失去響應式？

```ts
const state = reactive({ count: 0 });
const { count } = state;

watchEffect(() => console.log(count));
state.count++;
```

<details>
<summary>參考答案</summary>

`reactive()` 依靠 Proxy 攔截 property get/set。解構時只讀取一次 `state.count`，得到普通 number；effect 後續讀的是區域變數，不再經過 Proxy，因此不會追蹤更新。

可保留 `state.count` 的存取，或用 `toRef(state, "count")` / `toRefs(state)` 建立與原 property 連動的 ref。這不代表所有 composable 都該回傳 `reactive` 再 `toRefs`；API 可以直接回傳多個 refs，讓 ownership 和是否可寫更清楚。

</details>

## 2. 同一個 tick 改三次 state，DOM 與 watcher 何時更新？

```ts
count.value++;
count.value++;
count.value++;
console.log(el.value?.textContent);
```

<details>
<summary>參考答案</summary>

Vue 會把元件更新排入 queue 並批次處理，同一 tick 的同步 mutation 通常只造成一次 DOM patch；因此緊接著讀 DOM 可能還是舊值。要等待 Vue 完成 DOM flush，可 `await nextTick()`。

Watcher 預設 flush timing 是 `pre`：父元件更新後、owner component DOM 更新前執行。需要讀更新後 DOM 時使用 `flush: "post"` 或 `watchPostEffect()`；`flush: "sync"` 會同步觸發且不 batching，對陣列高頻 mutation 可能造成大量執行，應非常克制。

</details>

## 3. `watch` 和 `watchEffect` 怎麼選？如何取消過期請求？

<details>
<summary>參考答案</summary>

`watch(source, callback)` 明確分離依賴與 side effect，可取得 old/new value，預設 lazy，適合「只因這幾個來源改變才執行」。`watchEffect` 立即執行，並自動追蹤同步執行期間讀到的依賴，適合依賴與 effect 高度一致的情境；`await` 之後才讀到的狀態不會在首次同步追蹤階段納入。

搜尋請求要在 watcher cleanup 取消舊 request，避免舊結果覆蓋新結果：

```ts
watch(query, async (value, _oldValue, onCleanup) => {
  const controller = new AbortController();
  onCleanup(() => controller.abort());
  result.value = await search(value, { signal: controller.signal });
});
```

實務還會處理 debounce、abort error、loading ownership 與 server state cache。

</details>

## 4. `computed` 裡可以打 API 或修改別的 state 嗎？

<details>
<summary>參考答案</summary>

不應該。Computed getter 應保持 pure，只根據 reactive dependency 派生值。它是 lazy 且有 cache 的：何時被讀取、是否重新計算不該改變外部世界。若在裡面送 request、寫 storage 或修改其他 state，執行時機會難以預測，也可能造成更新循環。

衍生同步值用 computed；同步外部系統用 watch/watchEffect；使用者操作造成的命令型行為通常直接放 event handler。Writable computed 適合把讀寫轉換封裝成明確 contract，但 setter 也不應偷偷承擔無關 side effect。

</details>

## 5. 列表使用 index 當 `key`，什麼時候真的會出 bug？

<details>
<summary>參考答案</summary>

`key` 決定 Vue 在 patch 時如何辨識 VNode identity。列表若排序、插入或刪除，index 會指向不同業務資料，Vue 可能重用錯誤的 component instance 或 DOM state，導致 input 值、focus、動畫、子元件 local state 跟錯資料。

穩定且唯一的 domain id 才是較好的 key。若列表是完全靜態、永不重排且 child 無狀態，index 未必立刻出錯，但它把未來修改變成隱性風險。也不要每次 render 產生隨機 key，那會迫使整列 remount。

</details>

## 6. 多 root 子元件的 `$attrs` 為什麼沒有自動落到你預期的位置？

<details>
<summary>參考答案</summary>

Fallthrough attributes 是未被 props 或 emits 宣告的 attributes/listeners。單一 root 時 Vue 可自動合併到 root；多 root 時無法猜該放哪裡，需要以 `v-bind="$attrs"` 明確指定。若元件要完全控制 forwarding，可設 `inheritAttrs: false`。

元件 API 應明確決定 class、ARIA attributes 與 listeners 要落在哪個實際元素，尤其 wrapper 與真正 input 分開時。`attrs` 會反映最新值，但為了效能它本身不是 reactive dependency；若邏輯真的要響應某值，應將它宣告成 prop。

</details>

## 7. `KeepAlive` 後為什麼 WebSocket 或 timer 重複執行？

<details>
<summary>參考答案</summary>

被 `<KeepAlive>` 快取的元件離開畫面時通常是 deactivated，不是 unmounted；只在 `onUnmounted` cleanup 會漏掉停用階段。回來時若又在 `onActivated` 建新訂閱，就可能疊加連線或 timer。

需要先定義資源生命週期：若只在可見頁面需要，在 `onActivated` 訂閱、`onDeactivated` 取消；若訂閱屬於 app 級 server state，應提升到 store/service，由 reference count 或單一連線層管理。也要注意 activated component 最終 unmount 時仍會觸發 deactivated，因此 cleanup 要能 idempotent。

</details>

## 8. SSR hydration mismatch 你會怎麼定位，而不是直接加 `<ClientOnly>`？

<details>
<summary>參考答案</summary>

先比較 server HTML 與 client 第一次 render 的輸出，常見來源包括：

- render 期間使用 `Date.now()`、`Math.random()` 或 locale/timezone 不一致。
- 直接讀 `window`、viewport、localStorage，導致 client 初始分支不同。
- server request 間共享可變 singleton state，造成跨使用者污染。
- 無效 HTML nesting 被瀏覽器 parser 修正，實際 DOM 和 VNode 結構不同。
- client 沒拿到 server 使用的同一份初始資料。

修法是讓首次 render deterministic，序列化 request-scoped state，瀏覽器限定邏輯延後到 mounted，並修正無效 markup。只有該區塊本質上不能 SSR 且能接受 SEO/首屏取捨時，才用 ClientOnly 隔離；它不該只是把根因藏起來。

</details>

## 9. 大型唯讀資料放進 `ref`，為什麼可能有額外成本？

<details>
<summary>參考答案</summary>

一般 `ref(object)` 會深度轉成 reactive proxy，大型 immutable response、圖表 instance 或第三方 class 若不需要深層追蹤，這些 proxy 與 dependency tracking 可能是多餘成本，也可能破壞依賴 identity 的第三方程式。

只需要在整體替換時更新，可用 `shallowRef`；外部 instance 可評估 `markRaw`。但這會改變更新 contract：深層 mutation 不會自動觸發 view，必須以 immutable replacement 或明確 `triggerRef` 更新。應先用 profiler、render debug hooks 或效能量測證明瓶頸，再採用較淺的響應式策略。

</details>

## 10. 實作題：設計可重用的遠端搜尋 composable

需求：支援 debounce、取消舊請求、loading/error/result、元件卸載清理；兩個元件同時使用時不能互相覆蓋狀態。

<details>
<summary>評分重點</summary>

好的回答應先定義 contract，而不是急著寫 `watchEffect`：

- 輸入是 `Ref<string>` 還是由 composable 自己持有 query？
- 每次呼叫是否建立獨立 state；若要共享 cache，cache key 與失效策略是什麼？
- debounce timer 與 `AbortController` 如何在下一次執行及 scope dispose 時清理？
- abort 不應顯示成一般錯誤；舊 request 不得關閉新 request 的 loading。
- 空 query、重試、SSR、最小字數與結果正規化如何定義？

可以用 `watch` 搭配 cleanup；若這已經是完整 server state 問題，應說明為何會改用具 query key、dedupe、cache 與 retry 的資料函式庫，而不是讓自製 composable 無限膨脹。

</details>

## 面試追問清單

- 這個值的 owner 是元件、composable、store 還是 server cache？
- 依賴在哪次同步執行被 track，什麼操作會 trigger？
- 更新是 pre、post 還是 sync flush？真的需要 `nextTick` 嗎？
- 元件消失是 unmount、deactivate，還是只被 `v-show` 隱藏？
- 你如何用 Vue Devtools、Performance panel、`onRenderTracked` / `onRenderTriggered` 證明問題？

## 延伸查證

- [Vue 官方文件：Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [Vue 官方文件：Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [Vue 官方文件：Fallthrough Attributes](https://vuejs.org/guide/components/attrs)
