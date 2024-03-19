---
sidebar_position: 0
description: constructor
tags:
  - java
  - constructor
  - class
---

# [JAVA 介紹]建構子

```java
public class Hello {
    // 與類別同名的方法，視為建構子
    public Hello(){
        // print vs print line(有換行)
        System.out.print("Mammal aaa");
        System.out.println("Mammal aaa");
    }
    public world(){
        System.out.println("Hello World");
    }
    // public static void main：為主要執行程式
	public static void main(String[] args){
        // 而在這主要執行程式中，new出一個自己（可行）
		Hello abc = new Hello();
        abc.world()
	}	
}
```

## Class 與 Instance
### Class
* 是定義物件的藍圖或模板。在 Java 中，類定義了物件的屬性和方法。它可以包含數據成員（變量）和方法（函數）
### Instance
* 是類的一個具體實例，也就是根據類創建的一個具體對象。類提供了創建實例的機制，通常使用 new 關鍵字來實例化一個類
```java
public class MyClass {
    int x; // 數據成員

    void myMethod() { // 方法
        System.out.println("Hello World!");
    }
}

public class Main {
    public static void main(String[] args) {
        MyClass myObject = new MyClass(); // 創建 MyClass 的一個實例
        myObject.x = 5; // 設置實例的屬性
        myObject.myMethod(); // 調用實例的方法
    }
}
```

## Interface 與 Polymorphism（接口與多態）
### Interface
* 是一種抽象類型，它定義了一組抽象方法，但「沒有方法的實現」。類可以實現（implement）接口，並提供方法的具體實現。接口提供了一種規範，使得不同的類可以擁有相同的行為
### Polymorphism
* 是指一個對象可以具有多種形式。在 Java 中，多態性通常與繼承和接口一起使用。通過多態，可以使用一個父類或接口的引用來引用子類或實現類的對象，從而實現代碼的靈活性和重用性。
```java
interface Animal {
    void sound();
}

class Dog implements Animal {
    public void sound() {
        System.out.println("Woof");
    }
}

class Cat implements Animal {
    public void sound() {
        System.out.println("Meow");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myDog = new Dog(); // 多態性，Animal 接口的引用指向 Dog 對象
        Animal myCat = new Cat(); // 多態性，Animal 接口的引用指向 Cat 對象

        myDog.sound(); // 輸出: Woof // 多型：呼叫同一個function，但輸出不同值
        myCat.sound(); // 輸出: Meow
    }
}
```

### 抽象介面的數值
```java
interface Power{
    int value = 10;
}
class Test{
    public static void main(String[] args){
        System.out.println(Power.value);
    }
}
```

## 其他檔案使用此類
```java
public class OtherClass {
    public static void main(String[] args) {
        // 呼叫 ArraySort 的 main 方法，並將要排序的國家名稱陣列作為參數傳遞進去
        // 記得就.main
        ArraySort.main(new String[]{"India", "United States", "Malaysia", "Australia", "Lundon"});
    }
}
```

## 修飾子比較
### public
* 同一類別、同一套件、不同套件的子類別、不同套件的非子類別
### protected
* 同一類別、同一套件、不同套件的子類別
### (no modifier)
* 同一類別、同一套件
### private
* 同一類別


## static
[靜態成員](https://yubin551.gitbook.io/java-note/basic_java_programming/reservedwordstatic)
* 一開始就存在於記憶體中，所以稱為靜態
* 記得一開始就會執行
```java
public class Circle
{
    private static float PI = 0.0f;
    private float radius = 0.0f;
    // 只會執行一次
    static Circle()
    {
        Console.WriteLine("靜態建構函式-啟動");
        PI = 3.141592653f;       
    }
    public Circle(float radius)
    {
        Console.WriteLine("建構函式-啟動");
        this.radius = radius;
    }
    public float getArea() { return PI * this.radius * this.radius; }
}
```




