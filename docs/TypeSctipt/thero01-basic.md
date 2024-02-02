---
description: TS - TS Hero Beginner
tags:
  - TS
  - TypeScript
---

# [TS Hero] Beginner
## 1. Primitive Data Types
[换个角度理解 Typescript 的 type 和 interface](https://zhuanlan.zhihu.com/p/351213183)
* interface：有創造出新的型別
* 如果我们是定义一个 object，那么最好是使用 interface 去做类型声明
```typescript
const playSong = (artistName: string, year: number) => {
  return `${artistName} was released in the year ${year}`
}
const artistName: string = 'Frank Zappa'
const age: number = 52;

// 介面大寫開頭，另外介面內會有些成員
// 介面的名稱：開頭要大小寫，代表一個型別
interface Musician {
  artistName: string;
  age: number;
  // 在 interface 中物件必須跟介面的定義一致，多出或少了介面中的屬性都不行
  deceased: boolean;
} 

// musicianInfo 接受一個物件作為參數，這個參數必須符合 Musician 的介面結構
const musicianInfo = ({artistName, age, deceased}: Musician) => {
  return `${artistName}, age ${age}${deceased ? ' (deceased)' : ''}`;
}
```

## 2. Type Aliases
* type Aliases：為一個引用，沒有創造出新的型別
* 型別別名只是給某個類型起了一個新名字，它本身並不會創建一個全新的型別。
```ts
// We completed the first alias (`Name`) for you to see as an example
type Name = string;

// Now try replacing `unknown` with a primitive data type that might be appropriate for `Year`
type Year = number;

type IsOperational = boolean;

type Count = number;

type Kilograms = number;

type Payload = {
  name: Name;
  mass: number;
  // the tests show that you need a `mass` property here
  // but first you might need to create an alias for `Kilograms`
  // because that's the value of `mass`
};
// 測試程式碼
import { Expect, Equal } from 'type-testing';

type test_Name = Expect<Equal<Name, string>>;
type test_Year = Expect<Equal<Year, number>>;
type test_Count = Expect<Equal<Count, number>>;
type test_IsOperational = Expect<Equal<IsOperational, boolean>>;

// 我預期PayloadName這個測試型別為Payload，並且有name屬性，而name為字串類別
type test_PayloadName = Expect<Equal<
  Payload['name'],
  string
>>;

type test_Kilograms = Expect<Equal<
  Kilograms,
  number
>>;

type test_PayloadMass = Expect<Equal<
  Payload['mass'],
  Kilograms
>>;

interface Spacecraft {
  name: Name;
  yearBuilt: Year;
  crewCapacity: Count;
  launchDate: Date;
  isOperational: IsOperational;
  propulsionSystem: string[];
  payload: Payload[];
}

const voyager1 = {
  name: "Voyager 1",
  yearBuilt: 1977,
  crewCapacity: 0,
  launchDate: new Date("1977 09 05"),
  isOperational: true,
  propulsionSystem: ["RTG (Radioisotope Thermoelectric Generator)"],
  payload: [
    { name: "Golden Record", mass: 0.3 },
    { name: "Instruments", mass: 721 },
  ],
} satisfies Spacecraft;

```

## 3. Literal Types
* 明著說只有哪些值可以使用，以明確的賦值來約束。 字串明文型別
```ts
type LiteralString = 'chocolate chips';
type LiteralTrue = true;
type LiteralNumbers = 1 | 2 | 3 | 4 | 5 | 6;
type LiteralObject = {
	name: 'chocolate chips',
	inStock: true,
	kilograms: 5,
};
type LiteralFunction = (a: number, b: number) => number;
type AlmostPi = 3.141


const literalString = 'Ziltoid the Omniscient';
const literalTrue = true;
const literalNumber = Math.random() > 0.5 ? 1 : 2;
const literalObject = {
	origin: "string",
	command: 'string',
	item: 'string',
	time: 'string'
};
const literalFunction = (a: number, b: string): string | number => {
	return a + b;
};
const almostPi = 3.141
```

## 4. Index Signatures（索引簽章）
```ts
type GroceryList = {
	[s2key:string]: number
};

type InappropriateActionBySituation = {
	[skey: string]: string[]
};

type CharactersById = {
	[nKey: number]: {
	}
};
```

## 5. The typeof Operator
* 將ts「推導的結果」變成型別
* [TS keyof typeof怎麼用](https://123davidbill.medium.com/%E7%AD%86%E8%A8%98-ts-keyof-typeof-%E5%88%B0%E5%BA%95%E6%80%8E%E9%BA%BC%E7%94%A8-92fb5566b9e6)
```ts
type Width = typeof width;
type Margin = typeof margin;
type Data = typeof d3ChartConfig.data;
type YScale = typeof d3ChartConfig.yScale;

type D3ChartConfig = typeof d3ChartConfig;

```

## 6. Indexed Types
* 將陣列or物件的鍵值當作型別
```ts
type TheCoolestCarEverMade = Cars[4];
type TruckDriverBonusGiver = Donations['Taylor Swift'];
```

## 7. The keyof Operator
```ts
const casettesByArtist = {
  'Alanis Morissette': 2,
  'Mariah Carey': 8,
  'Nirvana': 3,
  'Oasis': 2,
  'Radiohead': 3,
  'No Doubt': 3,
  'Backstreet Boys': 3,
  'Spice Girls': 2,
  'Green Day': 2,
  'Pearl Jam': 5,
  'Metallica': 5,
  'Guns N\' Roses': 2,
  'U2': 3,
  'Aerosmith': 4,
  'R.E.M.': 4,
  'Blur': 3,
  'The Smashing Pumpkins': 5,
  'Britney Spears': 3,
  'Whitney Houston': 3,
};

type CasettesByArtist = typeof casettesByArtist; 
// 這裡用typeof代表這個CasettesByArtist型別為「內部key與value」要跟typeof 內的一樣
type Artist = keyof CasettesByArtist;
// keyof代表，Artist這型別要是CasettesByArtist的Key值
const result : Artist = 'Oasis'
console.log(result)
```


## 8. Generic Type Arguments
```ts

type GroceryStore<Name, City> = ({
	name: Name,
	city: City
});

type GroceryItem<
	Name extends string,
	Price extends number,
	InStock extends boolean
> = {
	name: Name,
	price: Price,
	inStock: InStock
};

type CapreseSalad = GroceryItem<"Caprese Salad", 14.99, true>


// 測試程式碼
import { Expect, Equal } from 'type-testing';

type test_CapreseSaladName = Expect<Equal<
  CapreseSalad['name'],
  'Caprese Salad'
>>;

type test_CapreseSaladPrice = Expect<Equal<
  CapreseSalad['price'],
  14.99
>>;

type test_CapreseSaladInStock = Expect<Equal<
  CapreseSalad['inStock'],
  true
>>;

type test_KrogerDetroit = Expect<Equal<
  GroceryStore<'Kroger', 'Detroit'>,
  { name: 'Kroger', city: 'Detroit' }
>>;

type test_StopNShopMassachusetts = Expect<Equal<
  GroceryStore<'Stop \'N Shop', 'Massachusetts'>,
  { name: 'Stop \'N Shop', city: 'Massachusetts' }
>>;

```
```ts
/// demo 範例
type Person<Name, Age> =  ({
  name: Name,
  age: Age
})

let ming : Person<string, number> = {
  name: 'Ming',
  age: 19,
}
```
