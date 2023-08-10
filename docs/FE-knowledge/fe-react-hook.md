---
description: React Hook 知識點
tags: 
    - React Hook
    - frontend
---

# [FE] React Hook 知識點

[readfog](https://www.readfog.com/a/1632458350731038720)
## 簡單介紹什麼是Hooks，與其產生背景？以及其之優點
### 問題：
* 在過去要達到組件復用，需要使用HOC和Render Props，他們本質是將復用邏輯提升到父組件中，很容易產生很多包裝組件，帶來嵌套
* 組件邏輯越來越複雜，尤其是當生命週期中包含一些不相關邏輯，不相關的程式放在一同一個方法組合在一起。很容易產生Bug，而且邏輯不一致
* 複雜的Class組件，不只需要理解JS的this，也不能忘記綁定事件處理，代碼複雜且冗餘。
#### 什麼是render props
* 心得：把props丟進組件中，render出來
* 是一種復用性高的模式，可以把特定行為封裝成一個組件，提供給其他組件讓其他組件擁有這樣的能力。
* 適用於： 
  * 業務邏輯抽取
  * 當兩個平級組件需要單向依賴時，比如A組件要跟隨B組件來改變自己的內部狀態。
```js
// Counter组件的render方法将count和increment方法作为参数传递给渲染函数，它接收这些参数并返回希望在子组件中渲染的内容。
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  };

  render() {
    return this.props.render(this.state.count, this.increment);
  }
}

// CounterDisplay组件使用Render Props模式，将一个渲染函数作为renderprop传递给Counter组件。渲染函数接收count和increment作为参数，并渲染计数器的值和一个增加计数器的按钮。
class CounterDisplay extends React.Component {
  render() {
    return (
      <Counter
        render={(count, increment) => (
          <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
          </div>
        )}
      />
    );
  }
}

// 在App组件中，我们使用CounterDisplay组件来展示计数器的渲染效果。
function App() {
  return (
    <div>
      <h1>Render Props Example</h1>
      <CounterDisplay />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

```


### 解決之道：Hook
* 用於在函數組件中引入狀態管理&生命週期方法
* 取代高階組件和render props來實現抽象和可重用性





