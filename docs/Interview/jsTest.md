---
tags: 
    - javascript
    - Test
---
# [面試] javascript
## Difference
### var、const、let
* var 為 function scope
* const let 為 block scope
* const 是常數一經宣告之後就要指定數值，不可再度被賦值
* var 在 function 內還是會暴露到global環境
* const let 則不會暴露出去

```javascript
var a = 1;
var b = 1;
var c = 1;

function test(a){
  console.log(a) // undefined
  var b = 2;
  console.log(b) // 2
  if(true){
    let c = 5
    var d = 6
    const e = 7
  }
  console.log(c) // 1
  console.log(d) // 6
  console.log(e) // error
}

test()
```

### 淺拷貝 vs 深拷貝
#### 深拷貝使用
```javascript
JSON.parse(JSON.stringify())
```
#### 淺拷貝
```javascript
Object.assign() // 只能完成第一層的淺層複製

let a = {
    'text': 1,
    'text2': {
        result: 2
    }
}

let b = Object.assign({}, a)
let c = JSON.parse(JSON.stringify(a))
b['text'] = 2
b['text2']['result'] = 3
b['text2']['result2'] = 4
console.log(a) // { text: 1, text2: { result: 3, result2: 4 } }
console.log(b) // { text: 2, text2: { result: 3, result2: 4 } }
console.log(c) // { text: 1, text2: { result: 2 } }

```




### 型別

#### 基本型別
* Boolean、Null、Undefined、Number、String、Symbol

#### 物件型別
* Object、Array、Function

### call vs apply vs bind
* 差別在於傳遞參數方式
* apply只允許傳進兩個參數

```javascript
fun.call(this, arg1, arg2) == fun.apply(this, arguments)
```

### == vs ===
* == 會自動轉型
* === 要型別正確 & 資料正確 才會true

### map vs filter vs reduce
* map 遍歷陣列，然後返回新陣列
* filter 遍歷陣列，然後條件為true才會返回
* reduce 遍歷陣列，但可通過回調函數返回一個值

### callback vs promise
* callback是將函數當作參數去給另一個函數存取，並透過另一個函式呼叫他。
* promise則是該函數執行結束，使用`then`去做接續，其共有三個狀態
  * pending：初始狀態
  * fulfilled：完成狀態
  * reject：失敗狀態
* callback -> promise & generator -> async

```javascript
// generator 範例：記住yield會丟東西也會吃東西
// 取自Huli 網站，實在是太好懂了！！
function *gen(){
  let arr = [];
  while(true){
    arr.push(yield arr);
  }
}

var name = gen();
// 第一次呼叫name.next() -> 遇到yield -> 他會丟出arr出來 -> 而因為我們東西都還沒丟進去，所以返回為[]
console.log(name.next('init').value);//[]
// 第二次呼叫name.next('nick') -> yield把'nick'吃進去 -> arr.push 做完結束後 -> 再次回到yield -> yield再次把arr 丟出來 -> 得到 nick
console.log(name.next('nick').value);//["nick"]

console.log(name.next('peter').value);//["nick","peter"]
```
[[Javascript] ES6 Generator基礎](http://huli.logdown.com/posts/292331-javascript-es6-generator-foundation)

### event bubbling vs event capture and stopPropagation
* bubbling 為向上傳遞
* capture 為向下捕捉
* 舉例：
  * 當我們點下一個按鈕時，其走法是從window一路往下capture元素，直到該元素
  * 找到元素之後，就一路bubbling上來，直到windows
* 若要取消bubbling，則可以使用`event.stopPropagation`
* event delegation：意思是若今天有多個元素需要綁定，那我們盡量把事件綁在父元素上，以減少大量子事件
* 傳遞順序原則
  * 先捕獲，再冒泡
  * 到了target本身，沒有分捕獲或冒泡
* stopPropagation：意思是中斷下一個連結，但是同層會繼續跑
* preventDefault：取消預設行為，但是會繼續往下跑

```javascript
// 第一個參數：事件名稱
// 第二個參數：事件處理器
// 第三個參數：true / false : 捕獲 / 冒泡
xxx.addEventListener('click',function(){
    // e.eventPhase 若等於1：CAPTURING_PHASE
    // e.eventPhase 若等於2：AT_TARGET
    // e.eventPhase 若等於3：BUBBLING_PHASE
    console.log('list_item_link bubbling', e.eventPhase)
}, true)
```
[DOM 的事件傳遞機制：捕獲與冒泡](https://blog.huli.tw/2017/08/27/dom-event-capture-and-propagation/)
[重新認識 JavaScript: Day 14 事件機制的原理](https://ithelp.ithome.com.tw/articles/10191970)

## what is ?
### scope
* 指某變數在程式中，能被讀取的範圍，可分為區域變數、全域變數

### closure
* 指內部函式捕捉了外部函式變數，其包含一個函式，以及函式被建立時的環境

### hoisting
* 指變數或function被提升，舉例來說

```javascript
// in js 程式
var a = '1'
var b = '2'
console.log('5')
function c(){
  console.log('xxx')
}

// js 內部解讀為
function c(){
  console.log('xxx')
}
var a
var b
a = '1'
b = '2'
console.log('5')
```
所以如果提早 `console.log(a)`會出現undefined
題外話，`let`、`const` 會出現TDZ 暫時性死區

### Event Loop
* 因為js是單一執行緒，所以遇到同步與非同步時，瀏覽器機制不同。
1. 當js執行到該行時，會進入Call Stack（先進後出）
2. 然後遇到cb時，cb進入Web API等待
3. 然後Web API得到結果時，將這個cb丟給Queue（先進先出）
4. 最後當stack都清空時，Queue的資料或function會進入Call Stack執行

### this
**思考：把呼叫function想像成：function.call()** 

* 指每一個function在執行時，所參照的reference環境
* 總共四種環境：
  * normal function calls
  * within methods on objects
  * constructor
  * call, bind, apply

### prototype
* 因為在JS中，沒有CLASS，所以我們可以透過「原型」繼承，來讓原本沒有某個屬性的物件，去存取其他物件的屬性
```javascript
// 使用setPrototypeOf(a, b)來去繼承。a為想要被繼承的人，b為其他原型物件。
Object.setPrototypeOf(rockman, cutman);
// 但是要注意到，一個物件無法指定兩個其他原型物件。
// 所以我們必須讓 b先繼承c，然後a再去繼承b，藉此達到原型鍊的概念。
```
* 若我們要找尋與原本物件同屬性的方法時，js會先去找尋自己的方法，若沒有才會向上找尋
* 如果向上找有找到屬性，且屬性描述writable為true，則會為此物件實體新增一個對應的方法。若為false，同樣新增一個唯讀屬性。
* 若要查找是否為物件本身所有，則可以使用`hasOwnProperty`

### cookie vs localStorage vs SessionStorage
[cookie vs localStorage vs SessionStorage](https://liugoldent.gitbook.io/workspace/conceptual-analysis/http/http-cookie-storage)


## 考古題文章
[javascript-questions.md](https://github.com/h5bp/Front-end-Developer-Interview-Questions/blob/main/src/questions/javascript-questions.md)
[Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question)
[Amazon front end interview questions](https://www.frontendinterviewhandbook.com/companies/amazon-front-end-interview-questions/)
[Software Engineer interviews: Everything you need to prepare](https://www.techinterviewhandbook.org/software-engineering-interview-guide/)

## 觀念文章
[前端工程師一定要會的 JS 觀念題-中英對照之上篇](https://medium.com/starbugs/%E9%9D%A2%E8%A9%A6-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB%E4%B8%80%E5%AE%9A%E8%A6%81%E6%9C%83%E7%9A%84-js-%E8%A7%80%E5%BF%B5%E9%A1%8C-%E4%B8%AD%E8%8B%B1%E5%B0%8D%E7%85%A7%E4%B9%8B%E4%B8%8A%E7%AF%87-3b0a3feda14f#ff68)
[前端工程師一定要會的 JS 觀念題-中英對照之下篇](https://medium.com/hannah-lin/%E9%9D%A2%E8%A9%A6-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB%E4%B8%80%E5%AE%9A%E8%A6%81%E6%9C%83%E7%9A%84-js-%E8%A7%80%E5%BF%B5%E9%A1%8C-%E4%B8%AD%E8%8B%B1%E5%B0%8D%E7%85%A7%E4%B9%8B%E4%B8%8B%E7%AF%87-fd46292e374b)
