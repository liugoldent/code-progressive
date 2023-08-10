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
