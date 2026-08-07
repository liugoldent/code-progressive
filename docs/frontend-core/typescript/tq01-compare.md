---
slug: "/TypeSctipt/tq01-compare"
title: "TypeScript 問題集"
description: "整理 TypeScript 常見比較題與核心觀念，包括 interface vs type、any vs unknown、const vs readonly、keyof、typeof、泛型與 mapped types。"
tags:
  - Frontend
  - TypeScript
keywords: ["TypeScript", "interface vs type", "any vs unknown", "const vs readonly", "keyof", "typeof", "generic", "mapped types"]
---

# [TS] 問題集

這篇不是把 TypeScript 零碎知識點堆在一起，而是把面試最常問的幾類問題整理成一條比較清楚的主線：

- 你怎麼用 TypeScript 建模
- 你怎麼理解型別安全與不可變性
- 你怎麼用進階型別把型別系統用得更精準

如果要快速掌握 TypeScript，最重要的不是死背語法，而是知道每個工具在解什麼問題。

## `interface` vs `type`

這是 TypeScript 最常見的比較題，但它其實不是非此即彼。

### 什麼時候用 `interface`

`interface` 比較適合描述「物件結構」或「對外公開的契約」。

```ts
interface User {
  id: number;
  name: string;
}
```

它的特點是：

- 語意上更像在描述一個物件形狀
- 可以 `extends`
- 可以宣告合併（declaration merging）

```ts
interface User {
  id: number;
}

interface User {
  name: string;
}

// 會被合併成 { id: number; name: string }
```

### 什麼時候用 `type`

`type` 比較適合描述「更廣義的型別」。

```ts
type Status = "active" | "inactive" | "pending";
type ID = string | number;
type Point = { x: number; y: number };
```

它的特點是：

- 可以定義 union type
- 可以定義 intersection type
- 可以描述 tuple、primitive alias、條件型別等

### 實務上的結論

- 物件結構、公開 API 契約：優先考慮 `interface`
- union、工具型別、型別轉換：通常用 `type`

不是哪個比較高級，而是語意不同。

## `const` vs `readonly`

這題本質上是在問「不可變性」發生在值本身，還是物件屬性上。

### `const`

`const` 用來保護變數綁定本身不能被重新指定。

```ts
const name = "KT";
// name = "John"; // error
```

但如果 `const` 指向的是物件，物件裡的內容仍然可以改：

```ts
const user = { name: "KT" };
user.name = "John"; // 合法
```

### `readonly`

`readonly` 是型別層級的限制，用來保護屬性不可被改寫。

```ts
interface Config {
  readonly apiUrl: string;
}
```

### 差異總結

- `const`：變數不能重新賦值
- `readonly`：屬性不能重新賦值

這兩個可以一起用，但不要把它們當成同一件事。

## `any`、`unknown`、`never`、`void`

這幾個常被一起問，因為都在描述「不是一般具體資料型別」的場景。

### `any`

`any` 表示放棄型別檢查。

```ts
let value: any = 10;
value.foo.bar();
```

優點是方便，缺點是 TypeScript 幾乎幫不了你。

### `unknown`

`unknown` 表示「我現在不知道它是什麼型別，但我不能亂用」。

```ts
let value: unknown = 10;

if (typeof value === "number") {
  console.log(value + 1);
}
```

這比 `any` 安全很多，因為你必須先縮小型別。

### `never`

`never` 表示這段邏輯理論上不會有值。

```ts
function throwError(message: string): never {
  throw new Error(message);
}
```

常見用途：

- 永遠丟錯的函式
- exhaustive check

```ts
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

### `void`

`void` 用來表示函式沒有有意義的回傳值。

```ts
function logMessage(message: string): void {
  console.log(message);
}
```

## `interface` 可以描述 function、array、class 嗎

可以。`interface` 不只拿來描述一般物件，也能描述可呼叫型別、索引簽名與 class contract。

### function

```ts
interface Say {
  (name: string): void;
}

const say: Say = (name) => {
  console.log(name);
};
```

### array

```ts
interface NumberArray {
  [index: number]: number;
}

const fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

### class

```ts
interface PersonLike {
  name: string;
  sayHi(name: string): string;
}

class Person implements PersonLike {
  constructor(public name: string) {}

  sayHi(name: string) {
    return `Hi, ${name}`;
  }
}
```

## 聯合型別（union type）有什麼限制

當一個值是 `A | B`，TypeScript 只能保證你能使用 A 與 B 都共同擁有的成員。

```ts
function getLength(value: string | number): number {
  // return value.length; // error
  return value.toString().length;
}
```

如果你要使用某個特定型別才有的屬性，就必須先做 narrowing。

```ts
function getLength(value: string | number): number {
  if (typeof value === "string") {
    return value.length;
  }

  return value.toString().length;
}
```

這題的重點不是「union 很爛」，而是 TypeScript 在保守地保證安全。

## `keyof`、`typeof`、`keyof typeof`

這組也很常一起問，因為它們常被拿來做型別推導。

### `typeof`

在型別系統裡，`typeof` 是從「值」取得它的型別。

```ts
const person = {
  name: "John",
  age: 30,
};

type PersonType = typeof person;
```

### `keyof`

`keyof` 是從「型別」取出所有 key 的聯合型別。

```ts
interface Person {
  name: string;
  age: number;
  email: string;
}

type PersonKey = keyof Person;
// "name" | "age" | "email"
```

### `keyof typeof`

這通常用在 enum 或常數物件上。

```ts
enum Status {
  Active,
  Inactive,
  Pending,
}

type StatusKey = keyof typeof Status;
// "Active" | "Inactive" | "Pending"
```

## TypeScript 的型別推斷

TypeScript 不需要所有地方都手寫型別，它會依上下文自動推斷。

```ts
let count = 10;
// count 被推斷成 number
```

### 型別推斷的價值

- 少寫很多重複型別註記
- 保持型別資訊
- 讓程式碼比較乾淨

但要注意，推斷不是萬能的。當函式 API 很重要、資料結構會被外部使用、或型別會變得模糊時，還是應該明確標註。

## 泛型（Generics）

泛型的核心不是語法，而是「延後決定型別」。

```ts
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = firstElement([1, 2, 3]);
const firstStr = firstElement(["a", "b", "c"]);
```

這樣同一個函式可以保有重用性，同時保有型別資訊。

### 什麼時候需要泛型

- 函式輸入和輸出之間有型別關聯
- 工具函式要重用，但又不能失去型別安全
- 你在做 reusable hooks、API client、data mapper

## 條件型別（Conditional Types）

條件型別讓型別系統可以做分支判斷。

```ts
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"
```

這種能力常被用來做：

- 型別過濾
- 型別轉換
- 工具型別封裝

## 映射型別（Mapped Types）

映射型別可以遍歷一個既有型別的所有 key，再重新產生新型別。

```ts
interface Person {
  name: string;
  age: number;
}

type PartialPerson = {
  [K in keyof Person]?: Person[K];
};
```

這其實就是很多內建工具型別的基礎，例如：

- `Partial<T>`
- `Readonly<T>`
- `Required<T>`
- `Pick<T, K>`

## 不可變性（Immutability）

TypeScript 無法讓資料真正 immutable，但它可以在型別層限制你不要亂改。

```ts
interface Config {
  apiUrl: string;
  timeout: number;
}

const config: Readonly<Config> = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};
```

這對以下場景特別有用：

- 設定檔
- state snapshot
- 共用常數

## TypeScript 模組載入機制

如果 TypeScript 遇到 import，會先嘗試解析模組路徑，再看有沒有對應型別資訊。

大致上是：

1. 找實際模組檔案
2. 找對應的型別宣告
3. 找不到就報錯

實務上你最常碰到的是：

- `tsconfig` 的 `baseUrl` / `paths`
- 第三方套件是否有型別
- 是否需要額外安裝 `@types/*`

## 面試時可以怎麼回答這篇內容

如果面試官從 `interface vs type` 一路問到 `any vs unknown`、`keyof typeof`、泛型，你可以用這個順序回答：

1. 先講 TypeScript 的核心價值是「在開發期限制錯誤」。
2. 再講建模工具：`interface`、`type`、union、generic。
3. 接著講安全邊界：`unknown`、`never`、`readonly`。
4. 最後講進階型別：`keyof`、`typeof`、mapped types、conditional types。

這樣回答會比一題一題背誦更像真的理解。

## 總結

TypeScript 最重要的不是多會背語法，而是知道：

- 怎麼描述資料結構
- 怎麼維持型別安全
- 怎麼把型別資訊傳遞到函式、物件與工具型別

如果把這三件事想清楚，你再去看 React、Vue、Node.js 裡的 TypeScript 實戰，理解速度會快很多。
