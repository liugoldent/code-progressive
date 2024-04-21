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


