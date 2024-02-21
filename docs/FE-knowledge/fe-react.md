---
tags: 
    - javascript
    - Test
    - React
---
# [FE] React

## React特點
* Virtual DOM
* 可用於Server side render
* 遵循單向數據流

## 什麼是JSX
* 為javascript XML 的縮寫

## Virtual DOM 原理
1. 當底層數據變化時，整個UI都會在Virtual DOM做渲染
![step1](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/25/169b42c3abe78a05~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)
2. 然後React會去解析Virtual DOM 舊與新的差別
![step2](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/25/169b42c3b5c6759a~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)
3. 完成之後，只用實際更改的內容去更新real DOM
![step3](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/25/169b42c3b5163360~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## ES6的React
```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = { code: 'Pas' };
  }
  render() {
    return
      <h2>Hello, {this.state.code}!</h2>;
  }
}
```

## 更新組件狀態
```jsx
// old
this.setState({name: 'xxx', id: '222'})
// new
setState(xxx)
```

## 簡單的生命週期函數
### class Component
* componentWillMount
* componentDidMount
* componentWillUpdate
* componentDidUpdate
* componentWillUnmount

### Function Component
* componentDidMount
```jsx
useEffect(() => {
  // 因為是空的陣列，所以只會執行一次
}, []);
```
* componentWillUnmount
```jsx
useEffect(() => {
  return () => {
    window.removeEventListener("mousemove", () => {})
  }
}, []);
```
## Refs
* Refs是React中引用的縮寫，有助於用React去操作元素或引用的屬性。
* 場景
  * 管理焦點、觸發式動畫
  * 直接控制其DOM

## 受控元件 vs 非受控元件
* 受控元件
  * 沒有自己的狀態
  * 數據由父組件控制
  * 使用props獲取值

## Key作用？
* 可以讓React識別Virtual DOM的相應元素。例如更新後，React只是更新元素，而不是全部重新渲染

## What is Redux?
* 類似VueX管理
* 優點：
  * 單一事件來源：整個應用程序存放在一個`store`的物件或狀態數中
  * 狀態唯讀：改變狀態的唯一方式，是觸發一個動作
  * 使用純函數去修改
* Redux組件有哪些？
  * action：描述發生什麼事的物件（method）
  * Reducer：定義狀態如何改變的地方（改變狀態的地方）
  * Store：儲存資料的地方
  * View：顯示Store提供的數據

## this.state和setState有什麼差別？
* this.state：為設定初始值
* setState：為更新數值


## react和vue的區別
### 相同點：
* 數據驅動畫面，響應式的改變組件
* virtual DOM，通過`props`進行父子間的組件數值傳遞
* 數據單向流動、SSR
* 都有支持native的方法
### 不同點：
* 數據绑定：Vue實現雙向綁定，react單向數據流
* 數據渲染：Vue大規模的數據渲染，react更快
* 使用场景：React配合Redux架構適合大規模多人協作專案，Vue適合小而快的項目
* 開發風格：react all in js、Vue 分門別類

## forwardRef作用
* 轉發ref

## Vue 與 React 對比
### 相同點
* 都有組件化思想
* 都有支持SSR渲染
* 都有Virtual DOM
* 數據驅動視圖
* 都有支持native的方案。`Vue`：`weex`、`React`：`React Native`。
* 都有自己的建構工具：`Vue`：`vue-cli`。`React`：`create-react-app`

### 差異點
* 數據變化的實現原理不同。`react`是不可變的數據、`Vue`是可變的數據
* 組件通信不同。`React`是透過回調函數來進行通信。`Vue`是事件or回調函數
* diff算法不同。`React`是用diff演算法來看需要更新哪些DOM，得到patch樹，再統一操作批量更新DOM。`Vue`是透過雙指針邊對比邊更新DOM。


