---
description: TS - 泛型使用
tags:
  - TS
  - TypeScript
---

# 泛型
## 名詞解釋
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

## 泛型約束
### 基本約束
* 由於不知道傳入類別是什麼，所以不可以在function隨意使用.length這種方法
```ts
function identity2<Type>(arg: Type): Type {
  console.log(arg.length); // Property 'length' does not exist on type 'Type'.

  return arg;
}
```
### extends約束
```ts
// 即使Type被限定為Array（預想），但想要在裡面用length時，就必須要再extends
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
```

