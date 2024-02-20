---
tags: 
    - javascript
    - Test
    - typescript
---
# [FE] TypeScript - p2

## TS - 泛型
* 不預先指定好類型，而在使用時再指定類型的特性
### code
```ts
function returnItem<T>(para: T): T{
  return para
}
```
### 使用方式
#### 函數
* 通過`<>`來表述，可以聲明函數、接口、類
```ts
function swap<T,U>(tuple: [T,U]): [U,T]{
  return [tuple[1], tuple[0]]
}
swap([7, 'seven'])
```
#### 接口
```ts
interface ReturnItemFn<T> {
  (para:T): T
}
const returnItem: ReturnItemFn<number> = para => para
```
#### 類
```ts
class Stack<T> {
  private arr:T[] = []

  public push(item: T) {
    this.arr.push(item)
  }
  public pop(){
    this.arr.pop()
  }
}

const stack = new Stack<number>()
```
* 如果想要限制泛型的型別，則需要使用犯型約束
```ts
type ParamsLimit = number | string
class Stack<T extends ParamsLimit> {
  private arr: T[] = []

  public push(item: T) {
    this.arr.push(item)
  }

  public pop(){
    this.arr.pop()
  }
}

const stack = new Stack<boolean>() // 報錯
```

## TS - 高級類型
### 交叉類型
* `&`
```ts
function extend<T, U>(first: T, second: U): T & U {
  let result: T & U = {}
  for(let key in first) {
    result[key] = first[key]
  }
  for(let key in second) {
    if(!result.hasOwnProperty(key)){
      result[key] = second[key]
    }
  }
  return result
}
```

### 聯合類型
* `|`
```ts
function formatCommandLine(arg: string[] | string){

}
```

### 類型別名
* 類型別名可用於原始類型、聯合類型、元祖
* 類型別名與接口使用十分相似，但interface只能用於定義物件模型。而type除了物件還可以交叉、聯合、原始類型等
```ts
type some = boolean | string
const b: some = true
const c: some = 'hello'
const d: some = 123 // 錯誤

// 可使用泛型
type ContainerSimple<T> = T
type Container<T> = {
  value: T
}

// 可以使用類型別名來在屬性裡引用自己
type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
}
```

### 類型索引
* `keyof`類似於`object.keys`，用於取接口中的key聯合類型
```ts
interface Button {
  type: string
  text: string
}
type ButtonKeys = keyof Button
type ButtonKeys = 'type' | 'text'
```

### 類型約束
* 通過extends做類型約束，在泛型中主要作用是對泛型加以約束
```ts
type BaseType = string | number | boolean

function copy<T extends BaseType>(arg: T) {
  return arg
}
```
```ts
function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
const obj = { a: 1}
const a = getValue(obj, 'a')
```

### 映射類型
* 通過`in`關鍵字做類型的映射，遍歷已有接口的`key`或是遍歷聯合類型
```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

interface Obj {
  a: string
  b: string
}

type ReadOnlyObj = Readonly<Obj>
```
* `keyof T`：通過類型索引keyof得到聯合類型'a' | 'b'
* `P in keyof T`等同於`p in 'a' | 'b'`，相當於執行一次forEach的邏輯

### 條件類型
```ts
T extends U ? X : Y
```

### 裝飾器
* 記得：由下往上執行
#### 基礎形式
```ts
// @裝飾者名稱（跟程式一樣是呼叫執行，但是靠近修飾子會先執行）
```
#### 基礎用法與分類
主要分成
1. Class Decorator
```ts
function classDecorator(target : any) {
  console.log(target)
}
```
2. Method Decorator
```ts
function methodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

}
```
3. Property Decorator
```ts
function property(target: any, propertyKey: string){

}
```
4. Parameter Decorator
```ts
function parameterDecorator(target: any, propertyKey: string, parameterIndex: number) {

}
```
#### Decorator Factory裝飾器工廠
* 接收傳下來的參數，並且回傳
```ts
@Logger('I am xxx')
class Person {
  name = 'xxx'
  constructor(){
    console.log('yyyy')
  }
}
```
[十分鐘帶你了解 TypeScript Decorator](https://oldmo860617.medium.com/%E5%8D%81%E5%88%86%E9%90%98%E5%B8%B6%E4%BD%A0%E4%BA%86%E8%A7%A3-typescript-decorator-48c2ae9e246d)


### 模塊
* 假如我們在一個TS工程中，建立一個文件`1.ts`，聲明一個變量`a`，那麼在另一個文件同樣聲明一個變量`a`，這時會出現錯誤訊息（因為所處空間為全局的）
* export關鍵字可以導出變量or類型，用法與`es6`模塊一樣
```ts
export const a = 1
export type Person = {
  name: String
}

import { a, Person } from './export'
```

### 命名空間
* 解決重名問題
* 它難以去識別組件之間的依賴關係，尤其在大型的應用中
* 模塊和命名空間都可以包含代碼和聲明。但是模塊可以聲明他的依賴
* 正常的開發不建議用命名空間
```ts
// 定義
namespace SomeNameSpaceName {
  export interface ISomeInterfaceName {}
  export class SomeClassName {}
}
// 使用
SomeNameSpaceName.SomeClassName
```
* 本質上是一個物件，作用是將相關的全局變量組織到一個物件的屬性
```ts
namespace Letter {
  export let a = 1;
  export let b = 2;
}
```


