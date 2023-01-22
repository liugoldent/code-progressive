---
sidebar_position: 0
description: 常見關鍵字
tags:
  - java
---

# [JAVA 介紹]Java 基本知識
## 推薦資源
[廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/1252599548343744/1260464690677856)
## 常見關鍵字
### 建構方法
1. 先建立一個class
2. 前面放其class，後面放其想要定義的變數
```java
public class Account { // 檔案必須是Account.java
    // 實作內容 
}
// class 變數名稱 = new Class
Account account1 = new Account(); 

```
### @Override
* 指子類別繼承父類別時，改寫父類別原有的方法內容
* 複寫的方法：名稱、回傳的資料型態、參數型態、數量都要相等
```java
public class Main {
  public static void main(String[] args) {
    Animal animal = new Dog(); // animal為Dog的實例
    animal.run(5);
  }
}
// 父類別
class Animal {
  public void run(int units) {
    System.out.println("動物移動" + units + "步");
  }
}
class Dog extends Animal {
  @Override
  public void run(int units){
    System.out.println("狗狗跑" + units + "步");
  }
}
```

### void
#### 代表什麼都不返回
```java
class Dog extends Animal {
  @Override
  // void 不返回數據
  public void run(int units){
    System.out.println("狗狗跑" + units + "步");
  }
}
```

### interface
* 意義：介面
* 必須1：介面中的資料成員必須設定初值
* 必須2：介面沒有一般函數，只有抽象函數（但是不用特別指名abstract，已經是了）
```java
interface CShape               // 定義介面 CShape
{
   final double PI=3.14;        //final 可省略
   public abstract void show(); //public abstract 可省略
}
```
實作層面
```java
class CCircle implements CShape
{
   double radius;
   public CCircle(double r)   //CCircle建構元
   {
     radius=r;
   }
   public void show()         //改寫介面中抽象函數
   {
     System.out.println("面積＝"+PI*radius*radius);
   }
}
```


### main() 函數
* 意義：作為程式架構的進入點
* 一但程式開始run，會優先跑這個程式碼
* 必須：被包在class中
* 必須：冠上`public static void`
```java
class Test{
    public static void main（String[ ] args）{
    System.out.println（"Hello Java~~"）; 
  }
}
```

### is-A & has-A
* is-A：繼承
  * is kind of
  * 超人是人類的一種
  * 類別之間階層的父子關係
```java
class Person{ }

class Superman extends Person{ }
```
* has-A：聚合
  * 代表A class內有B class
  * 類別A中的宣告包含了另一個類別B的型態
  * 類別之間的whole/part關係
```java
class Animal { }

class Circus {
  public Animal a; //代表馬戲團中有包含到Animal型態
}
```
