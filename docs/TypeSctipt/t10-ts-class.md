---
description: TS - TS Class
tags:
  - TS
  - TypeScript
---
# [TS] Class
## 概念 - 封裝
* 封裝是指將相關的資料（屬性）和行為（方法）包裝在一個單獨的單位中，並對外部隱藏內部實現的細節。這樣做可以避免外部直接訪問和修改物件的內部狀態，並提供公開的介面供外部使用
* 在 TypeScript 中，可以使用存取修飾符（public、protected、private）來實現封裝。
* protected 表示這個屬性可以在類別內部和子類別中訪問，但不能在類別的實例中直接訪問
* private 表示這個屬性只能在類別內部訪問
```ts
class Person {
  // 無法從外部存取
  private name: string;
  // 無法從外部存取
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public introduce() {
    console.log(`Hi, my name is ${this.name} and I'm ${this.age} years old.`);
  }
}

const person = new Person("Alice", 30);
person.introduce(); // 輸出 "Hi, my name is Alice and I'm 30 years old."

// 以下呼叫會報錯，因為 name 和 age 是 private 和 protected 屬性，無法在外部直接訪問
// console.log(person.name);
// console.log(person.age);

```
## 概念 - 繼承（Inheritance）
* 一個類別（子類別）可以繼承另一個類別（父類別）的屬性和方法，並且可以擴展和覆寫這些屬性和方法
* 繼承可以實現代碼的重用，使得類別之間的關係更加靈活
```ts
class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  public makeSound() {
    console.log("Animal makes a sound.");
  }
}

class Dog extends Animal {
  public makeSound() {
    console.log("Dog barks!");
  }

  public fetch() {
    console.log("Dog fetches the ball.");
  }
}

const dog = new Dog("Buddy");
dog.makeSound(); // 輸出 "Dog barks!"
dog.fetch(); // 輸出 "Dog fetches the ball."


```
## 概念 - 多型（Polymorphism）
* 一個物件可以根據其所處的類別型別來表現出不同的行為
```ts
class Shape {
  area() {
    return 0;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area() {
    return this.width * this.height;
  }
}

function printArea(shape: Shape) {
  console.log("Area:", shape.area());
}

const circle = new Circle(5);
const rectangle = new Rectangle(4, 6);

printArea(circle); // 輸出 "Area: 78.53981633974483"
printArea(rectangle); // 輸出 "Area: 24"
```

## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)




