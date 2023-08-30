---
description: Vue3 v-on
tags:
  - Vue
---

# [Vue3] Vue3 v-on

## v-on 
### modifiers
* `.stop`：阻止事件冒泡
* `.prevent`：取消事件預設行為
* `.self`：只在綁定監聽器的元素&觸發監聽器元素相等才執行
* `.capture`：切換成捕獲模式
* `.once`：只觸發一次，觸發之後移除監聽
* `.passive`：告訴瀏覽器這個handler，不會呼叫`event.preventDefault()`
  * 好處：優化效能，提升使用者體驗
  * 適合用來優化高頻率觸發的事件監聽器，例如手機touch事件，在觸發時，瀏覽器就不會先去看是否有預設事件，藉此達到提高使用者體驗

### 為何不能使用console.log
* 主要因為Vue在template中，只能使用部分全域物件（如Number、Array、Math、Date），不包含console & window

## 動作原理
1. `withModifier` 會按照修飾符串接的順序，依序判別並呼叫 `guard function`，修飾符判別都通過後，再執行 handler 函式內容。

### guard Function
* `v-on`守衛
```js
const systemModifiers = ['ctrl', 'shift', 'alt', 'meta']

type KeyedEvent = KeyboardEvent | MouseEvent | TouchEvent

const modifierGuards: Record<
  string,
  (e: Event, modifiers: string[]) => void | boolean
> = {
  stop: e => e.stopPropagation(), //呼叫 event 停止冒泡的 method
  prevent: e => e.preventDefault(), //呼叫 event 取消預設行為的 method
  self: e => e.target !== e.currentTarget,
  ctrl: e => !(e as KeyedEvent).ctrlKey,
  shift: e => !(e as KeyedEvent).shiftKey,
  alt: e => !(e as KeyedEvent).altKey,
  meta: e => !(e as KeyedEvent).metaKey,
  left: e => 'button' in e && (e as MouseEvent).button !== 0,
  middle: e => 'button' in e && (e as MouseEvent).button !== 1,
  right: e => 'button' in e && (e as MouseEvent).button !== 2,
  exact: (e, modifiers) =>
    systemModifiers.some(m => (e as any)[`${m}Key`] && !modifiers.includes(m))
}
```

### withModifiers
* `v-on`的執行順序
```js
//傳入的 fn 為 ($event) => customHandler(param1, param2,...)
//傳入的 modifiers 為陣列，如["prevent", "self"]
export const withModifiers = (fn: Function, modifiers: string[]) => {
  return (event: Event, ...args: unknown[]) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]]
      if (guard && guard(event, modifiers)) return 
        //這裡的 return 會結束函式的執行，符合條件代表不會繼續往下觸發 customHandler
    }
    return fn(event, ...args)
    //回傳並執行 fn，即 customHandler
  }
}
```

## demo
* `@click.prevent.self`：先取消預設行為，再判斷觸發元素是不是自己，是的話才執行 handle function，但無論執行與否，取消預設行為已經完成。
* `@click.self.prevent`：只有在確定觸發元素是自己之後，才取消預設行為，接著執行 handle function。