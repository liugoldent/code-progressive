---
slug: "/FE-knowledge/fe-ts-p1"
title: "前端 TypeScript - p1"
description: "TypeScript 基礎完整筆記：型別推論、核心型別、unknown、聯合型別、介面、列舉、函式、類別與 strict 設定。"
tags:
  - JavaScript
  - TypeScript
keywords: ["前端", "TypeScript", "型別推論", "unknown", "聯合型別", "interface", "enum", "函式重載", "strict"]
---

# [FE] TypeScript - p1

這一篇整理 TypeScript 的基礎觀念與日常寫法。重點不是替每個值補上型別，而是讓編譯器能在程式執行前發現不合理的資料流，同時保留 JavaScript 原本的執行方式。

## TypeScript 是什麼？

TypeScript（TS）是 JavaScript 的超集，也是靜態型別檢查器：合法的 JavaScript 語法大多也是合法的 TypeScript，而 TypeScript 額外提供型別系統與開發工具支援。

```ts
function add(left: number, right: number): number {
  return left + right;
}

add(1, 2);     // OK
add("1", 2);   // 編譯錯誤：string 不能傳給 number
```

TypeScript 編譯成 JavaScript 後，`number`、`interface` 等型別資訊通常會被移除，真正執行程式的仍是 JavaScript 引擎。因此：

- TS 能提早發現型別錯誤，改善自動完成、重構與文件提示。
- TS 不會自動驗證 API、localStorage、表單或 JSON 等外部資料。
- 型別斷言不是資料轉換，也不是執行期驗證。
- 新的 ECMAScript 語法（如 class、module、async/await）屬於 JavaScript，不是 TypeScript 專屬功能。

```ts
const raw = JSON.parse('{"id": 1}'); // JSON.parse 的結果是 any
const user = raw as { id: number };   // 只告訴編譯器「相信我」，沒有驗證 raw
```

## 型別註記與型別推論

### 型別註記（type annotation）

在變數、參數或回傳值後方使用 `: Type` 明確標示型別：

```ts
let count: number = 0;

function greet(name: string): string {
  return `Hello, ${name}`;
}
```

### 型別推論（type inference）

能讓 TypeScript 正確推論時，不必重複標註：

```ts
const framework = "React"; // 推論為字面值型別 "React"
let language = "TypeScript"; // 推論為 string，因為 let 之後可以重新賦值

const prices = [100, 200, 300]; // 推論為 number[]
const total = prices.reduce((sum, price) => sum + price, 0); // number
```

函式參數通常要標註，回傳型別則可以推論；對外公開的函式若明確標註回傳型別，能避免實作改動意外改變 API。

## 常用型別

| 類別 | 寫法 | 說明 |
| --- | --- | --- |
| 字串 | `string` | 使用小寫；不要使用包裝物件型別 `String` |
| 數字 | `number` | JavaScript 不另外區分 `int`、`float` |
| 布林 | `boolean` | `true` 或 `false` |
| bigint | `bigint` | 大整數，例如 `123n` |
| symbol | `symbol` | 唯一識別值 |
| 陣列 | `number[]`、`Array<number>` | 相同元素型別的集合 |
| tuple | `[string, number]` | 已知長度及每個位置型別的陣列 |
| object | `object` | 非原始值；通常應寫出更具體的物件形狀 |
| null／undefined | `null`、`undefined` | 建議搭配 `strictNullChecks` 使用 |
| void | `void` | 函式不提供有意義的回傳值 |
| never | `never` | 永遠不會產生值，例如一定拋錯或無限迴圈 |
| unknown | `unknown` | 未知型別，使用前必須先縮小範圍 |
| any | `any` | 關閉該值後續的型別檢查，應盡量避免 |

### Array 與 tuple

```ts
const ids: number[] = [1, 2, 3];
const point: [number, number] = [25, 80];
const response: readonly [status: number, message: string] = [200, "OK"];
```

Tuple 適合有明確位置語意且長度固定的資料；若欄位變多，具名物件通常更容易閱讀。

### 字面值型別（literal type）

字面值型別能把值限制在指定集合內：

```ts
type Theme = "light" | "dark" | "system";

function setTheme(theme: Theme): void {
  // ...
}

setTheme("dark");  // OK
setTheme("blue");  // 編譯錯誤
```

### `any` 與 `unknown`

`any` 會讓錯誤一路擴散；無法確定外部資料型別時，優先使用 `unknown`，並在使用前檢查。

```ts
function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
```

### `void` 與 `never`

```ts
function logMessage(message: string): void {
  console.log(message);
}

function fail(message: string): never {
  throw new Error(message);
}
```

`void` 代表呼叫端不應依賴回傳值；`never` 則代表這條執行路徑不可能正常完成。

## 聯合型別與型別縮小

聯合型別（union type）使用 `|` 表示「可能是其中任一型別」。存取某一成員專屬的屬性前，必須先縮小型別（narrowing）。

```ts
function normalizeId(id: string | number): string {
  if (typeof id === "number") {
    return id.toString(); // 此分支的 id 是 number
  }

  return id.trim(); // 此分支的 id 是 string
}
```

常見的縮小方式有：

- `typeof value === "string"`
- `value instanceof Date`
- `Array.isArray(value)`
- `"property" in value`
- 判斷可辨識聯合中的共同欄位

```ts
type ApiResult =
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function renderResult(result: ApiResult): string {
  switch (result.status) {
    case "success":
      return result.data.join(", ");
    case "error":
      return result.message;
    default:
      return assertNever(result);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}
```

當 `ApiResult` 新增一種狀態卻忘記處理時，`assertNever` 能讓編譯器提示缺漏。

## 物件型別、interface 與 type

TypeScript 採用結構型別（structural typing）：只要值的結構符合要求，不必宣告「實作了哪個型別」也能使用。

```ts
interface User {
  readonly id: number;
  name: string;
  avatarUrl?: string;
}

const admin = {
  id: 1,
  name: "Ming",
  role: "admin",
};

function printUser(user: User): void {
  console.log(user.name);
}

printUser(admin); // 結構包含 User 需要的屬性，因此可使用
```

- `?` 代表可選屬性，讀取時型別通常包含 `undefined`。
- `readonly` 防止 TypeScript 程式碼直接重新賦值，但不是執行期的深層凍結。
- 物件字面值直接傳入函式時，會進行額外屬性檢查，協助抓出拼字錯誤。

### `interface` 與 `type` 怎麼選？

兩者都能描述物件；主要差異是 `interface` 可以重新開啟並合併宣告，`type` 可以替聯合型別、tuple、primitive 等任何型別取別名。

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

type Id = string | number;
type Coordinate = [x: number, y: number];
type Success = { ok: true; data: string[] };
type Failure = { ok: false; error: string };
type Result = Success | Failure;
```

實務上可以採用一致的團隊規則：物件公開契約優先用 `interface`；需要聯合、tuple 或型別運算時用 `type`。進階型別運算會在 [TypeScript p2](/docs/FE-knowledge/fe-ts-p2) 繼續說明。

## Enum（列舉）

Enum 用來定義一組具名常數。它與多數 TypeScript 型別不同：enum 會產生執行期 JavaScript 物件。

### 數字 enum

```ts
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

console.log(Direction.Up); // 0
console.log(Direction[0]); // "Up"，數字 enum 支援反向映射
```

可以指定起始值，後續成員會自動加一：

```ts
enum HttpStatus {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
}
```

### 字串 enum

```ts
enum LogLevel {
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
}

console.log(LogLevel.Warn); // "WARN"
```

字串 enum 每個成員都應明確初始化，而且不會產生數字 enum 的反向映射。

### 何時改用 literal union？

如果只需要限制一組字串值，不需要 enum 的執行期物件，字面值聯合通常更簡單，也更容易和 JSON／API 資料配合。

```ts
type DirectionValue = "up" | "down" | "left" | "right";
const directions: readonly DirectionValue[] = ["up", "down", "left", "right"];
```

## 函式

TypeScript 可以檢查參數、回傳值、可選參數、預設值與剩餘參數。

```ts
function multiply(a: number, b: number): number {
  return a * b;
}

function greet(name: string, prefix = "Hello"): string {
  return `${prefix}, ${name}`;
}

function sum(first: number, ...rest: number[]): number {
  return rest.reduce((total, value) => total + value, first);
}

async function fetchCount(): Promise<number> {
  return 42;
}
```

可選參數的型別會包含 `undefined`。判斷數字是否有傳入時，不要用 truthy 檢查，否則 `0` 會被當成沒有值。

```ts
function add(a: number, b?: number): number {
  return a + (b ?? 0);
}
```

### 函式型別

```ts
type StringComparator = (left: string, right: string) => number;

const byLength: StringComparator = (left, right) =>
  left.length - right.length;
```

### 函式重載（overload）

重載需要兩個以上的「重載簽章」，再接一個範圍足以處理所有情況的「實作簽章」。呼叫端只能看見重載簽章。

```ts
function combine(left: number, right: number): number;
function combine(left: string, right: string): string;
function combine(
  left: number | string,
  right: number | string,
): number | string {
  if (typeof left === "number" && typeof right === "number") {
    return left + right;
  }

  if (typeof left === "string" && typeof right === "string") {
    return left + right;
  }

  throw new TypeError("Arguments must have the same type");
}

combine(2, 3);          // number
combine("Type", "Script"); // string
combine(2, "Script"); // 編譯錯誤
```

如果參數數量與回傳值關係沒有不同，通常直接使用聯合型別會比 overload 簡單。

## Class

TypeScript class 是 JavaScript class 加上欄位型別、存取修飾符、`implements`、`abstract` 等型別檢查功能。

```ts
interface Movable {
  move(distance: number): void;
}

class Vehicle implements Movable {
  public readonly brand: string;
  protected speed = 0;
  private engineStarted = false;

  constructor(brand: string) {
    this.brand = brand;
  }

  public move(distance: number): void {
    this.engineStarted = true;
    console.log(`${this.brand} moved ${distance} meters`);
  }
}
```

### 存取修飾符

| 修飾符 | 類別內 | 子類別 | 實例外部 |
| --- | --- | --- | --- |
| `public` | 可存取 | 可存取 | 可存取 |
| `protected` | 可存取 | 可存取 | 不可存取 |
| `private` | 可存取 | 不可存取 | 不可存取 |

- 成員預設為 `public`。
- TypeScript 的 `private` 主要在型別檢查階段限制存取。
- JavaScript 原生的 `#field` 是執行期私有欄位，兩者語意不完全相同。
- `readonly` 表示屬性只能在宣告處或 constructor 中賦值。
- `static` 成員屬於 class 本身，使用 `ClassName.member` 存取，不屬於實例。

```ts
class Counter {
  static total = 0;

  constructor() {
    Counter.total += 1;
  }
}
```

### 抽象類別

抽象類別不能直接實例化，可以同時提供已實作的共用方法與要求子類別實作的抽象成員。

```ts
abstract class Animal {
  abstract makeSound(): string;

  move(): void {
    console.log("moving");
  }
}

class Cat extends Animal {
  makeSound(): string {
    return "meow";
  }
}

const cat = new Cat();
cat.move();
console.log(cat.makeSound());
```

`implements` 只檢查 class 是否符合介面，不會自動建立欄位或方法實作；`extends` 則會繼承父類別的實作。

## 建議開啟 strict 模式

新專案建議從 `strict: true` 開始。它會啟用一組較嚴格的檢查，例如避免隱含 `any`，並要求處理可能為 `null`／`undefined` 的值。

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noEmit": true
  }
}
```

- `strict`：啟用 TypeScript 的 strict family 檢查。
- `noUncheckedIndexedAccess`：索引陣列或物件時，提醒結果可能是 `undefined`。
- `exactOptionalPropertyTypes`：區分「屬性不存在」和「屬性值為 undefined」。
- `noEmit`：只做型別檢查，輸出交給 Vite、Next.js 等建置工具。

既有 JavaScript 專案可以逐步導入，不必一次開啟所有選項；但新程式不要以 `any` 或大量 `as` 壓掉 strict 模式發現的問題。

## 常見錯誤與檢查清單

- 型別使用小寫 `string`、`number`、`boolean`，不要使用 `String`、`Number`、`Boolean`。
- 不確定的外部資料先視為 `unknown`，驗證後再使用。
- `as` 只影響型別檢查，不會轉換或驗證資料。
- 可選數字用 `??` 處理預設值，避免把 `0` 當成沒傳。
- `protected` 可在子類別存取；`private` 不行。
- 抽象子類別必須實作所有抽象成員，除非子類別本身也是 `abstract`。
- 真正的函式重載需要多個 overload signature，只有 union 參數不叫重載。
- 字串 enum 沒有反向映射；數字 enum 才有。
- TypeScript 保證的是編譯期一致性，API 回應與使用者輸入仍需執行期驗證。

## 延伸閱讀

- [TypeScript Handbook：Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook：Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook：Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TSConfig：strict](https://www.typescriptlang.org/tsconfig/strict.html)
- [下一篇：TypeScript p2](/docs/FE-knowledge/fe-ts-p2)
