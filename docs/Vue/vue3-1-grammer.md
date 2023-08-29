---
description: Vue3 語法介紹
tags:
  - Vue
---

# [Vue3] Vue3 語法介紹
[Vue 3 響應式基礎](https://ithelp.ithome.com.tw/articles/10298545)
## reactive 
### 基本原理
* 使用`Proxy`實作
* 透過`Proxy`代理操作物件，可以攔截針對物件的所有操作，不只讀取或寫入物件屬性，還包含迭代物件、使用`in`運算子、透過`new`建立物件實體
```js
const proxy = new Proxy(target, handler)
// 其中handler，為每次透過代理操作物件時，會去觸發的方法
// 將target傳進去，會建立一個代理target的Proxy物件
```
* 透過Proxy物件寫入底下的任何屬性，包含新增屬性，也會觸發set handler
* 透過Proxy物件讀取底下的任何屬性，都會觸發get handler
* 直接對原物件操作不會觸發handler
* 所以Proxy攔截原物件的操作，從而做到響應式
* `reactive()`傳入相同的物件or已經存在的Proxy，會回傳相同的Proxy
```js
// 響應原理
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key) //簡單來說，是用來紀錄相依邏輯和資料
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key) //簡單來說，是用來執行相依邏輯和更新資料
    }
  })
}
```

### 操作特殊性
* 參數只接收`Object`、`Array`、`Map`、`Set`，建議其`reference`一致
* 預設為deeply reactive，若為巢狀物件，所有巢狀資料都會有響應性
* 將`ref`資料傳進去`reactive`，會自動取出`value`值

### 喪失響應性
* 對`Proxy`物件重新賦值，因為新物件不再是`Proxy`，所以會失去響應性
```js
// 解決辦法
const objReactive = reactive({ name: "obj" });
console.log(`原本的`, objReactive);
Object.assign(objReactive, { name: "new-obj" });
console.log(`透過 Object.assign 修改的`, objReactive);
```
* 屬性值脫離Proxy，失去響應性
```js
const {name: name1} = objReactive // 脫離原本的reactive
```

## ref

### 基本原理
* 使用`get`、`set`關鍵字來實作
* 可用於基本型別與物件型別上
* ref是把基本型別放到物件的`value`之上，來達到響應式
* 會將傳入的資料放在 RefImpl 物件的 value 屬性下，並回傳 RefImpl 物件
* 對物件的 value 屬性定義 getter 跟 setter，去攔截對 value 的讀取跟寫入。
* 透過 ref() 創造回傳的 reference，來維持響應性，而不是資料(value)本身，所以基本型別才能透過 ref() 來達成響應
* 先經過reactive的proxy之後，把Proxy物件放到value屬性之下
```js
// 響應原理
function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value') //簡單來說，是用來紀錄相依邏輯和資料
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value') //簡單來說，是用來執行相依邏輯和更新資料
    }
  }
  return refObject
}
```

### 基本操作
* 參數可以傳入任何型別
* 會回傳具有響應式、可變動的ref物件（RefImpl），參數裝在value屬性下
* 即使傳入的資料為物件，依然可以對RefImpl.value做重新賦值。因為每次要對.value重新賦值時，都會觸發RefImpl的setter處理響應性。
* 模板上可直接使用資料

### 喪失響應性
```js
// 解構後，喪失響應性
const numberRef = ref(11);
const { value } = numberRef;
numberRef.value = 101;

//value 變數沒有響應性
console.log(value); //印出 11
```



