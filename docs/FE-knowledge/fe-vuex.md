---
description: VueX知識點
tags: 
    - vue
    - vuex
    - frontend
---

# [FE] VueX

## 請說說actions 與 mutations有什麼區別
[VueX 原始碼解析](https://www.gushiciku.cn/pl/p6ye/zh-tw)
* actions可以處理非同步函數
  * 延伸：為什麼action的第一個引數可以取得commit（如下面程式碼的{}）
* mutation處理同步函數
```js
// vuex actions 註冊原始碼
/**
* 註冊 mutation
* @param {Object} store 物件
* @param {String} type 型別
* @param {Function} handler 使用者自定義的函式
* @param {Object} local local 物件
*/
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  // payload 是actions函式的第二個引數
  entry.push(function wrappedActionHandler (payload) {
    /**
     * 也就是為什麼使用者定義的actions中的函式第一個引數有
     *  { dispatch, commit, getters, state, rootGetters, rootState } 的原因
     *  actions: {
     *    checkout ({ commit, state }, products) {
     *        console.log(commit, state);
     *    }
     *  }
     */
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload)
    /**
      export function isPromise (val) {
          return val && typeof val.then === 'function'
      }

      判斷如果不是Promise Promise 化，也就是為啥 actions 中處理非同步函式
      也就是為什麼建構函式中斷言不支援promise報錯的原因
      vuex需要Promise polyfill
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
    */
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    // ....
  })
}
```

## mutation vs action
### mutation
- Mutation 是用於修改 Vuex 中的狀態的唯一方式。
- Mutation 必須是同步函數。這是因為 Vuex 要求所有的狀態變更都是可追蹤的，即在進行狀態變更時，Vuex 可以跟蹤到是哪個 - mutation 修改了狀態，並且可以記錄下每次變更。如果 mutation 是異步的，那麽無法保證狀態變更的順序和可追蹤性。
由於 mutation 必須是同步的，因此它們通常只用於執行簡單的狀態變更，例如更改狀態的屬性值。
### action
- Action 用於處理異步操作、業務邏輯和異步狀態變更。
- Action 可以是異步函數，可以執行異步操作，例如發送 HTTP 請求、定時器等。
- 當需要進行異步操作並最終提交 mutation 時，通常會在 action 中執行異步操作，並在異步操作完成後提交對應的 mutation。


