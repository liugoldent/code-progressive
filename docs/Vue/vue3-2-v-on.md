---
description: Vue3 v-on
tags:
  - Vue
---

# [Vue3] Vue3 v-on

## v-on

### modifiers

- `.stop`：阻止事件冒泡
  - 阻止事件冒泡，相當於使用`event.stopPropagation`
- `.prevent`：取消事件預設行為
  - 相當於使用`event.preventDefault`
- `.self`：只在綁定監聽器的元素&觸發監聽器元素相等才執行
- `.capture`：切換成捕獲模式
- `.once`：只觸發一次，觸發之後移除監聽
- `.passive`：告訴瀏覽器這個 handler，不會呼叫`event.preventDefault()`
  - 好處：優化效能，提升使用者體驗
  - 適合用來優化高頻率觸發的事件監聽器，例如手機 touch 事件，在觸發時，瀏覽器就不會先去看是否有預設事件，藉此達到提高使用者體驗
- `.native`：使用原生事件

### sync

- 允許子組件改動父組件資料

```js
//父组件
<comp :myMessage.sync="bar"></comp>
//子组件
this.$emit('update:myMessage',params);

// 相當於
//父亲组件
<comp :myMessage="bar" @update:myMessage="func"></comp>
func(e){
 this.bar = e;
}
//子组件js
func2(){
  this.$emit('update:myMessage',params);
}
```

### $event

- 有時如果想要訪問事件參數，就可以使用此$event

```html
<!-- 使用特殊的 $event 变量 -->
<button @click="warn('Form cannot be submitted yet.', $event)">Submit</button>

<!-- 使用内联箭头函数 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

```js
function warn(message, event) {
  // 这里可以访问原生事件
  if (event) {
    event.preventDefault();
  }
  alert(message);
}
```

### 為何不能使用 console.log

- 主要因為 Vue 在 template 中，只能使用部分全域物件（如 Number、Array、Math、Date），不包含 console & window

## 動作原理

1. `withModifier` 會按照修飾符串接的順序，依序判別並呼叫 `guard function`，修飾符判別都通過後，再執行 handler 函式內容。

### guard Function

- `v-on`守衛

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

- `v-on`的執行順序

```js
//傳入的 fn 為 ($event) => customHandler(param1, param2,...)
//傳入的 modifiers 為陣列，如["prevent", "self"]
export const withModifiers = (fn: Function, modifiers: string[]) => {
  return (event: Event, ...args: unknown[]) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers)) return;
      //這裡的 return 會結束函式的執行，符合條件代表不會繼續往下觸發 customHandler
    }
    return fn(event, ...args);
    //回傳並執行 fn，即 customHandler
  };
};
```

## demo

- `@click.prevent.self`：先取消預設行為，再判斷觸發元素是不是自己，是的話才執行 handle function，但無論執行與否，取消預設行為已經完成。
- `@click.self.prevent`：只有在確定觸發元素是自己之後，才取消預設行為，接著執行 handle function。
