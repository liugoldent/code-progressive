---
description: TS - 泛型
tags:
  - TS
  - TypeScript
---

# [TS] 泛型
## 概念
* 泛型：不預先指定具體的型別而在使用的時候再指定型別的一種特性。
## 範例
### 一般的預先定義
* 缺點：無法擴充
```ts
// 在identity function中，我們「預先指定」陣列型別為number，但是這樣在擴充時，就要另外寫一個identity2 function
function identity(arg: Array<number>): Array<number> {
  console.log(arg);
  return arg;
}

identity([1, 2, 3]); // [1, 2, 3]

function identity2(arg: Array<string>): Array<string> {
  console.log(arg);
  return arg;
}

console.log(identity2(['2']))
```
### 使用時才定義
* 依照使用時才定義輸入輸出型別
* 所以我們可以運用「泛型」來解決這個問題
```ts
//identity3 定義了
function identity3<Type>(arg: Type[]): Type[] {
  return arg;
}

let output1 = identity3([1, 2, 3]); 
let output2 = identity3(["a", "b", "c"]);
console.log(output1);// [1, 2, 3]
console.log(output2); //["a","b","c"]
```

### 多參數情況
```ts
function merge<T, U>(arg1: T, arg2: U): T & U {
  return Object.assign({}, arg1, arg2);
}

const result = merge({ name: 'John' }, { age: 30 });

console.log(result); // { name: 'John', age: 30 }

```

## 泛型約束
### 基本約束
* 意義：由於不知道傳入類別是什麼，所以不可以在function隨意使用.length這種方法
```ts
function identity2<Type>(arg: Type): Type {
  console.log(arg.length); // Property 'length' does not exist on type 'Type'.

  return arg;
}
```
### Using Type Parameters in Generic Constraints
* 當使用泛型時，有時候可能想要對泛型參數進行一些約束，以便限制它們可以接受的型別範圍。這種情況下，可以使用泛型約束（Generic Constraints）來實現。
```ts
// 泛型約束：要求 T 必須是具有 'length' 屬性的型別
function getLength<T extends { length: number }>(obj: T): number {
  return obj.length;
}

const strLength = getLength('Hello'); // 5
const arrLength = getLength([1, 2, 3]); // 3
// 下面的呼叫會報錯，因為數字型別沒有 'length' 屬性
// const numLength = getLength(100);
```

### Generic Interface - 泛型介面
```ts
interface Animal {
  name: string;
}

function getName<T extends Animal>(animal: T): string {
  return animal.name;
}

const cat = { name: 'Tom', age: 5 };
const dog = { age: 12 };

console.log(getName(cat)); // 'Tom'
console.log(getName(dog)); // 下面的呼叫會報錯，因為 dog 缺少 'name' 屬性
```

### Generic Classes - 泛型類型
* 允許我們在實例化時，指定類別中的型別參數，從而讓類別中的屬性&方法可以使用這些特定型別
```ts
class Box<T> {
  private value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    this.value = newValue;
  }
}

// 使用泛型類別 Box，型別參數為 string
const stringBox = new Box<string>("Hello");
console.log(stringBox.getValue()); // 輸出 "Hello"

stringBox.setValue("World");
console.log(stringBox.getValue()); // 輸出 "World"

// 使用泛型類別 Box，型別參數為 number
const numberBox = new Box<number>(42);
console.log(numberBox.getValue()); // 輸出 42

numberBox.setValue(100);
console.log(numberBox.getValue()); // 輸出 100

```

### Inference - 泛型推斷
* n 被 inferred 為 string
* input & output 可以自行定義
```ts
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n, 10));

console.log(parsed); //[1,2,3]
```

### Specifying Type Arguments - 指定參數型別 
#### 指定泛型函數的型別
```ts
function identity<T>(arg: T): T {
  return arg;
}
let result = identity<number>(42); // 指定參數型別為 number
```

#### 指定泛型類別的型別
```ts
class Box<T> {
  constructor(private value: T) {}

  getValue(): T {
    return this.value;
  }
}

let box = new Box<number>(42); // 指定參數型別為 number
let value = box.getValue(); // 此時 value 的型別是 number
```
### 多種型別
```ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}

const arr = combine([1, 2, 3], ["hello"]);
// error: Type 'string' is not assignable to type 'number'.


const arr = combine<string | number>([1, 2, 3], ["hello"]);
console.log(arr); //[1, 2, 3, "hello"]
// 指定他為 string | number 聯合型別。
```

## 好的泛型寫法
### 返回型別為type
```ts
// 返回型別為 Type
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}
```
### 使用較少的type 參數
```ts
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}
```
### 如果只使用一種型別，應該用更簡單的方式去寫
```ts
function greet1<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}
greet1("world");
```

## 各種型別泛型
### 函式型別泛型
```ts
type IdentityFunction<T> = (arg: T) => T; // 先定義型別
let myIdentity : IdentityFunction<number> = (arg: number) => arg // 再宣告myIdentity是一個function，型別為IdentityFunction
console.log(myIdentity(123))
```

## 物件型別泛型
```ts
type Box<T> = {
  value: T
}
let box:Box<string> = { value: 'Hello'}
```

## 類別型別泛型
```ts
class Box<T> {
  value: T;

  constructor(value: T) {
    this.value = value
  }
}
let box: Box<number> = new Box(3)
```

## 接口型別泛型
```ts
interface Pair<T,U> {
  first: T,
  second: U
}
let pair: Pair<number, string> = { first: 1, second: 'Hello'}
```

## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)

