---
sidebar_position: 0
description: java 基本課程
tags:
  - java
keywords: [java]
---

# [JAVA 基本] 抽象類別與介面 ch04

## 抽象類別與介面
### 抽象類別
* 主要是用來專門當作父類別，這種類別稱作抽象類別
* 抽象類別內可以定義一般函數與抽象函數，以方便其子類取用繼承來的函數。也可以針對子類別的特性，明確定義父類別的抽象函數。
* 定義在抽象類別內的抽象函數，在子類別裡一定要改寫它，不然會報錯。
* #### 有點範本的感覺，目的是要我們依據它的格式來修改並建立新類型
* #### 不可使用抽象類別來建立物件
### 抽象類別格式
```java
abstract class 名稱 {
  
  宣告資料成員
  傳回值型態 函數名稱(引數){

  }
  修飾子 abstract 傳回值型態 函數名稱(引數){

  }
}

```
demo
```java
abstract class CShape {
  protected String Color;
  public void setColor(String str){
    color = str;
  }
  public abstract void show(); // 只定義不實作
}
```
### 抽象類別格式衍生出的子類別
```java
class Circle extends CShape {
  protected double radius;
  public Circle(double r){
    radius = r;
  }
  // 下面這個一定要實現！！
  public void show(){
    System.out.println('xxx')
  }
}
```

### 用抽象類別型態的變數來建立物件
#### 利用父類別的變數來存取子類別物件的成員
```java
public class app11_2{
  CShape shape1 = new Circle(5,10); // 以類別CShape 建立物件 shape1，並以它來存取子類別Circle的成員
  shape1.setColor("Yellow"); // 設定顏色（從父類別繼承來的function
  shape1.show(); // 子類別自己的function
}
```

#### 利用父類別陣列變數來存取子類別物件的成員
```java
public class app11_3 {
  public static void main(String args[]){
    CShape shape[];
    shape = new CShape[2];

    shape[0] = new CRectangle(5,10); // 利用陣列變數，建立一個新的CRectangle物件，並存取子類別成員
    shape[0].setColor('Yellow');
    shape[0].show()
  }
}

```
## 介面
### 介面 vs 抽象類別
* #### 介面的資料成員都要初始化
* #### 介面裡的函數都要是abstract
* 建立物件：以介面A打造新的類別B的過程，我們稱做以類別B實作介面A。或稱介面的實作。

### 介面格式
```java
interface 介面名稱{
  final 資料型態 成員名稱=常數;
  修飾子 abstract 傳回值型態 函數名稱(引數){}
}
```
#### 介面 demo
```java
interface iShape2D {
  final double PI = 3.14; // 資料成員必定要設定初始值
  abstract void area(); // 只能定義名稱，不定義做啥事。另外一定要是public
}
```
#### 介面 demo 改寫
```java 
interface iShape2D {
  double PI = 3.14; // 可以去掉final 關鍵字
  void area(); // 可以去掉abstract關鍵字
}
```

### 介面實作
#### 格式
```java
class 類別名稱 implements 介面名稱 {

}
```
#### demo 
```java
class Circle implements iShape2D { // 以Circle 類別實作iShape2D介面
  double radius;
  public Circle(double r){
    radius = r;
  }
  // 這邊要實際定義area裡面到底要做啥事
  public void area(){
    System.out.println('area='+PI*radius*radius)
  }
}
```

### 介面型態的變數
```java
public class app11_5 {
  public static void main(String args[]){
    iShape2D var1, var2;  // 宣告兩個變數，其為iShape2D的介面
    var1 = new Circle(2.0); // 然後實作起來
    var1.area()

    // ....
  }
}
```

## 多重繼承
因為在JAVA中，沒有多重繼承這種事情（孩子不可以同時有兩個爸爸）  
但我們可以讓孩子實作兩個介面達到多重繼承的感覺
### 多重繼承格式
```java
class 類別名稱 implements 介面1, 介面2 {

}
```
### 多重繼承 demo
```java
interface iShape2D {
  final double PI= 3.14;
  abstract void area();
}

interface iColor {
  abstract void setColor(String str);
}

class Circle implements iShape2D,iColor {
  double radius;
  String color;
  public Circle(double r){
    radius = r
  }
  public void area(){
    // System.out.println('xxxx')
  }
  public void setColor(String str){
    color = str;
    // System.out.println('yyyy') 
  }
}

```

## 介面的延伸
* #### 介面跟一般類別一樣，可以透過繼承的技術來衍生出新介面
### 介面的延伸 格式
```java
interface 子介面名稱 extends 父介面名稱1, 父介面名稱2 {

}
```
### 介面的延伸 demo
```java
interface iShape {
  final double PI = 3.14;
  abstract void setColor(String str);
}

interface iShape2D extends iShape {
  abstract void area()
}

class Circle implements iShape2D {
  double radius;
  String color;
  public Circle(){
    radius = r;
  }

  public void setColor(String str){
    color = str;
    // system.out.println.....
  }

  public void area(){
    // system.out.println....
  }
}

public class app11_7 {
  public static void main(String args[]){
    Circle cir;
    cir = new Circle(2.0);
    cir.setColor("Blue");
    cir.area(); // 呼叫area，記得這邊可以用常數PI
  }
}

```
## 類別關係的判別 - instanceof
### 判別 基本格式/語法
* #### True：表示物件object是ClassName的類別或其子類別的物件
* #### False：表示object與該類別及其子類別無關。
* 也就是object向上找，是否找得到某個類別
```java
obj instanceof ClassName
```

### 判別 demo
```java


```

