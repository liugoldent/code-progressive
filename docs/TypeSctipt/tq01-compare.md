---
description: TS - TS 問題集
tags:
  - TS
  - TypeScript
---
# [TS] 問題集
[ts面試-1](https://juejin.cn/post/6999985372440559624)
## interface vs type
### 可擴展性：
* 介面 (interface) 可以通過繼承（extends）來擴展其他介面，這使得它們非常適合於定義物件的結構並將其分解為更小的部分。
  * 相同名稱的interface會自動合併(同個文件內)
* 型別 (type) 可以使用交集 (&) 和聯合 (|) 來「組合」多個型別，但不支援繼承。

### 可讀性：
* 介面 (interface) 常常被用於描述「物件的結構」，因為它們提供了更清晰和易於閱讀的語法。
* 型別 (type) 可以用於定義任何型別或是聯合類型，不僅限於物件結構，所以有時候可能會更靈活，但可能會讓程式碼讀起來更加複雜。
```ts
// 使用类型别名定义联合类型
type Status = 'active' | 'inactive' | 'pending';

// 创建一个变量，它的类型为 Status
let userStatus: Status;

// 赋值给 userStatus 可选的三种状态之一
userStatus = 'active';
console.log(userStatus); // 输出: active
```

### 擴展性：
* 如果您需要定義一個可以被其他程式碼擴展的結構，通常使用介面 (interface) 會更適合，因為它們支援擴展。
* 如果您僅需要描述一個固定的結構並在整個應用程式中重複使用，則可以使用型別 (type)。


## const vs readonly
* const 防止變量被修改
* readonly 防止變量的屬性被修改

## any
* 在寫程式途中，為一個還不清楚地變量先指定型別。這些值可能來自動態內容，例如用戶輸入or第三方代碼庫。

## any never unkonwn null undefined void
* any：為任一型別，但其實這樣失去了類型檢查的功能
* never：永遠不會發生的值的類型。用於標示不可到達的終點。例如錯誤處理
```ts
function throwError(message: string): never { throw new Error(message); }
```
* unknown
  * 未知類型的值。unknown要求在使用前進行檢查。
  * 用於需要動態檢查內容，但是我不確定動態內容時。
* null & undefined
  * 分別表示空值與未定義之值
* void
  * 代表沒有返回值得函數

## interface 可以給array function class做聲明嗎
```ts
/* 可以 */
// 函数声明
interface Say {
 (name: string): viod;
}
let say: Say = (name: string):viod => {}
// Array 声明
interface NumberArray { 
 [index: number]: number; 
} 
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
// Class 声明
interface PersonalIntl {
 name: string
 sayHi (name: string): string
}
```

## union types有什麼限制
* 在使用聯合類型時，只能訪問共同擁有的方法
```ts
function getLength(something: string | number): number {
   return something.length;
}
// index.ts(2,22): error TS2339: Property 'length' does not exist on type >'string | number'.
//   Property 'length' does not exist on type 'number'.

function getString(something: string | number): string {
   return something.toString();
}
// 公共方法和属性可以访问
```

## 如何聯合枚舉類型的key
```ts
enum str {
   A,
   B,
   C
}
type strUnion =  keyof typeof str; // 'A' | 'B' | 'C'
```

## ts模塊的加載機制？
1. 首先，編譯器會嘗試定位需要導入的模塊文件，通過絕對或者相對的路徑查找方式；
2. 如果上面的解析失敗了，沒有查找到對應的模塊，編譯器會嘗試定位一個外部模塊聲明（.d.ts）；
3. 都沒有的話就會報錯

## keyof typeof的作用
### typeof
* 獲取值的類型
* 返回一个表示该值类型的 TypeScript 类型
```ts
const person = {
  name: 'John',
  age: 30
};

type PersonType = typeof person;

// PersonType 的类型为 { name: string, age: number }
```

### keyof
- keyof 關鍵字用於獲取對象類型的所有鍵的聯合類型。
- 它返回一個包含對象所有鍵的字符串聯合類型。
- 這個操作可以幫助你在編譯時對對象的鍵進行靜態類型檢查。
```ts
interface Person {
  name: string;
  age: number;
  email: string;
}

type PersonKey = keyof Person;

// PersonKey 的值为 "name" | "age" | "email"
```

## TypeScript 如何自動推斷變數或函式的型別。請提供一個示例，並說明型別推斷對開發者的優勢。
### Ans
TypeScript 會根據變數初始化時賦予的值自動推斷其型別。例如：
```ts
let count = 10; // TypeScript 推斷 count 為 number 型別
count = 20;     // 合法
// count = 'hello'; // 編譯錯誤：不能將 string 指派給 number
```

### 優點
* 減少重複的型別註記
* 提高程式碼可讀性與可維護性
* 提早捕捉潛在型別錯誤

## 什麼是泛型？請說明如何在 TypeScript 中使用泛型來撰寫通用函式或介面，並提供一個範例。
### Ans
泛型允許在定義函式、類別或介面時，不指定具體型別，而在使用時再決定，從而提升重用性與型別安全性。
```ts
// 泛型函式範例：取得陣列的第一個元素
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const numbers = [1, 2, 3];
const firstNum = firstElement(numbers); // 推斷為 number

const strings = ['a', 'b', 'c'];
const firstStr = firstElement(strings); // 推斷為 string
```
### 優點
* 泛型提供靈活且安全的型別重用方案
* 適用於函式、類別與介面


## 條件型別 (Conditional Types)

### Ans
條件型別允許根據型別之間的關係來選擇不同的型別，語法為 T extends U ? X : Y。
```ts
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>;  // 'yes'
type B = IsString<number>;  // 'no'
```
### 優點
* 根據型別條件動態選擇型別
* 適合實現複雜型別轉換與工具型別

## unknown 與 any 的區別
### Ans
any：放棄所有型別檢查，任何操作都允許，容易導致潛在的運行時錯誤。
unknown：代表未知型別，但在操作前必須進行類型窄化，從而保證安全性。
```ts
let valueAny: any = 10;
let valueUnknown: unknown = 10;

// any 可以直接操作
let sumAny = valueAny + 5;

// unknown 需要類型檢查
if (typeof valueUnknown === 'number') {
  let sumUnknown = valueUnknown + 5; // 合法
}
```
### 優點
* unknown 強制開發者檢查型別，降低錯誤風險
* any 則完全放棄靜態檢查

## 映射型別 (Mapped Types)
### Ans
映射型別允許通過遍歷已有型別的屬性，對每個屬性進行轉換，生成新型別。
```ts
interface Person {
  name: string;
  age: number;
}

// 將 Person 中所有屬性變為可選
type PartialPerson = {
  [K in keyof Person]?: Person[K];
};

const person: PartialPerson = {
  name: 'John'
};
```

### 優點
* 利用 keyof 取得屬性鍵，再遍歷並重新定義型別
* 常用於實作工具型別，如 `Partial<T>`、`Readonly<T>` 等

## 不可變性 (Immutability)
### Ans
使用 TypeScript 的 `Readonly<T>` 工具型別可以將一個型別的所有屬性設為只讀，防止修改。
```ts
interface Config {
  apiUrl: string;
  timeout: number;
}

const config: Readonly<Config> = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// config.timeout = 3000; // 編譯錯誤：不能賦值給只讀屬性
```

### 優點
* `Readonly<T>` 使得物件的所有屬性不能被重新賦值
* 有助於保持配置或狀態數據的一致性

## 聯合型別與交叉型別
### 聯合型別 (Union Types)
表示一個變數可以是多種類型中的一種，用 | 分隔。
```ts
type Status = 'success' | 'error' | 'loading';
let state: Status = 'success';
```

### 交叉型別
將多個型別合併，要求變數必須滿足所有型別的要求，用 & 連接。
```ts
interface A {
  name: string;
}
interface B {
  age: number;
}
type Person = A & B;

const person: Person = {
  name: 'Alice',
  age: 30
};
```

### 優點
* 聯合型別提供靈活性，允許變數屬於多種可能的型別之一。
* 交叉型別結合多個型別要求，生成一個包含所有屬性的型別

## 實用工具型別（Partial, Pick, Omit, Record）
### `Partial<T>`
將型別 T 的所有屬性設為可選
```ts
interface User {
  id: number;
  name: string;
}
const partialUser: Partial<User> = { name: 'Alice' };
```

### `Pick<T, K>`
從型別 T 中**選取**屬性 K 組成新型別
```ts
type UserName = Pick<User, 'name'>;
const userName: UserName = { name: 'Bob' };
```

### `Omit<T, K>`
從型別 T 中剔除屬性 K 組成新型別
```ts
type UserWithoutId = Omit<User, 'id'>;
const userWithoutId: UserWithoutId = { name: 'Carol' };
```

### `Record<K, T>`
構造一個物件型別，其鍵來自型別 K，值為型別 T
```ts
type UserRoles = 'admin' | 'user';
const roles: Record<UserRoles, number> = {
  admin: 1,
  user: 2
};
```