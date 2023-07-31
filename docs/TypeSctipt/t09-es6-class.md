---
description: TS - ES6 Class
tags:
  - TS
  - TypeScript
---
# [TS] ES6 Class 
## 概念
* 在 ECMAScript 6（簡稱 ES6）標準中引入的一種新的物件導向程式設計語法。提供了更簡潔和方便的方式來定義和創建類別，並且更符合傳統物件導向程式設計的寫法。
* class 語法本身只是語法糖，底層仍然使用原型繼承來實現物件之間的繼承。
## 程式碼
### demo
```js
class ClassName {
  // 建構子，初始化類別實例的屬性
  constructor(arg1, arg2, ...) {
    // 屬性初始化
    this.property1 = arg1;
    this.property2 = arg2;
    // ...
  }

  // 方法定義
  methodName1() {
    // 方法實作
  }

  methodName2() {
    // 方法實作
  }

  // ...
}
```
### example
```js
// 定義一個 Person 類別
class Person {
  // 建構子，用來初始化物件屬性
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 方法定義
  sayHello() {
    console.log(`Hello, my name is ${this.name} and I'm ${this.age} years old.`);
  }
}

// 創建 Person 類別的實例
const person1 = new Person("Alice", 30);
const person2 = new Person("Bob", 25);

// 使用方法
person1.sayHello(); // 輸出 "Hello, my name is Alice and I'm 30 years old."
person2.sayHello(); // 輸出 "Hello, my name is Bob and I'm 25 years old."

```

## 關鍵字
### constructor
* 建構一個class的物件。一個class只能有一個constructor
### extends
* 使用extends繼承類別，建立子類別，子類別可以使用父層的東西
### super
* 可以使用super通過函式存取父層，super關鍵字必須出現在this關鍵字之前使用
```ts
class Shape {
  constructor(private color: string) {
    // 父類別 Shape 的建構子有一個 color 參數
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    // 呼叫父類別 Shape 的建構子，並傳遞參數
    super("red");
  }
}
```
### static method
* 使用關鍵字static，在class中的其他方法都不能使用它，靜態方法常被用來建立給應用程式使用的工具函數
* 不用實例就可以使用
### protect
* 受保護的屬性or方法，只能運用於子類or本身類內部
### private
* 只能在class內被運用
### readonly
* 在變數前加上這關鍵字，即可讓變數唯讀
```ts
class Point {
  x: number; //可以使用實例屬性
  y: number;
  readonly name: string = "show point"; //readonly唯讀

  constructor(x = 0, y = 0) {  //預設給0
    // ...
  }
}
```
### 程式碼
```ts
class Animal {
  constructor(name) {
    this.name = name;
  }

  // 靜態方法，不需要實例化即可呼叫
  static greet() {
    console.log("Hello from Animal!");
  }

  // 實例方法
  makeSound() {
    console.log("Animal makes a sound.");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // 呼叫父類別的 constructor
    super(name);
    this.breed = breed;
  }

  // 覆寫父類別的實例方法
  makeSound() {
    console.log("Dog barks!");
  }

  // 新增 Dog 類別自己的方法
  fetch() {
    console.log("Dog fetches the ball.");
  }
}

// 使用靜態方法
Animal.greet(); // 輸出 "Hello from Animal!"

// 創建 Dog 類別的實例
const dog = new Dog("Buddy", "Golden Retriever");

// 使用實例方法
dog.makeSound(); // 輸出 "Dog barks!"
dog.fetch(); // 輸出 "Dog fetches the ball."

// 存取繼承自父類別的屬性
console.log(dog.name); // 輸出 "Buddy"
console.log(dog.breed); // 輸出 "Golden Retriever"

```
## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)

