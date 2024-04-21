---
sidebar_position: 0
description: interface vs class
tags:
  - java
  - interface
  - class
---

# [JAVA 比較]接口 vs 類

## 接口
* 接口不是類，但兩種寫法很近。類描述物件的屬性與方法。接口主要是說實現的方法
* 除非接口的類為抽象，不然接口內的屬性要全都實際定義：也就是一個實現接口的class，必須要實現接口內的所有方法
## 接口與類的相似之處
* 一個接口可以有多個方法
* 接口文件保存在.java結尾的檔案中，文件必須使用接口名稱
* 接口的字節碼，保存在.class結尾的文件中
* 接口相應的字節碼.class中，必須同時存在同名的.java檔案。

## 接口與類的不同之處
* 接口不可使用於實例化物件
* 接口沒有構造方法（constructor）
```java
class Bike1 {
    Bike1() {
        System.out.println("Bike is created");
    }
    // 構造方法：main
    public static void main(String args[]) {
        Bike1 b = new Bike1();
    }
}
```
* 接口所有方法都是抽象方法，Java8之後，可以使用default修飾非抽象方法
* 接口不能包含成員變量，除了static or final
* 接口不是拿來繼承，是拿來被類實現
* 接口支援多重繼承

## 接口特性
* 接口中每一個方法都是隱式抽象（public abstract），也只能是此種修飾符
* 接口中可以有變量，但一樣是指定為public static final，並且只能是public
* 接口中的方法不能在接口中實現，只能透過實現class來實現接口中的方法

## 抽象類與接口的區別
* 抽象類中可以實現方法，但是接口不行
* 抽象類中可以有各種型態的變量，而接口的成員變量只能是public static final
* 兩者皆可以有靜態代碼區塊 & 靜態方法
    * （靜態：可以想成是class共有的東西）
    * 存取方法：[類別名稱].[靜態成員] ;
```java
// 靜態意義：static變數就是在載入程式後會主動配給記憶體給程式(僅一次)，後續無論實例化多少次，記憶體位置都一樣。
// ex:
//filename : Circle.cs
public class Circle
{
    private static float PI = 0.0f;
    private float radius = 0.0f;
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

//filename : Program.cs
class Program
{
    static void Main(string[] args)
    {
        Circle circle1 = new Circle(3.0f);
        Circle circle2 = new Circle(5.0f);
        Console.WriteLine(circle1.getArea());
        Console.WriteLine(circle2.getArea());
        Console.ReadKey();
    }
}

// 結果----->
// 靜態建構函式-啟動(new 兩次，但是只執行一次，代表static只會執行一次)
// 建構函式-啟動
// 建構函式-啟動
```

```java
// ex2:
class Human{
    static int total = 0;  // 紀錄總人數
    String name;
    int age;
    int height;
    Human(String str){
        name=str;
        total++;  // 每建立一個Human物件，即對總人數+1
    } // end of constructor(String)
}// end of class Human
```
* 一個類只能繼承一個抽象類，而一個類可以實現多個接口


## 接口的聲明
```java
[可見度] interface 接口名稱 [extends 其他的接口名] {
        // 聲明變量
        // 抽象方法
}
interface Animal {
    public void eat()
    public void see()
}
```

## 接口的實現
```java
public class Dog implements Animal {
    public void eat(){
        System.out.println("Mammal eats");
    }
}
```
```java
public class Hello{
 
	public void eat(){
	   System.out.println("Mammal eats");
	}
  
	public void travel(){
	   System.out.println("Mammal travels");
	} 
  
	public int noOfLegs(){
	   return 0;
	}
    // public static void main 主執行之後
    // new Hello 為自己new一個自己出來
	public static void main(String args[]){
	   Hello m = new Hello();
	   m.eat();
	   m.travel();
	}
 }
```

## 重寫接口中聲明的方法時，需要注意以下規則
* 類在實現接口方法時，不能拋出強制性異常，只能在接口中或繼承接口的抽象類中拋出異常
* 類在重寫方法時，要保持一致的方法名稱，並且應該保持相同或兼容的返回值類型
* 如果實現接口的類是抽象類，那麼沒必要實現接口所有方法

## 一些實現的規則
* 一個類可以同時實現多個接口
* 一個類只能繼承一個類，但是能實現多個接口
* 一個接口能繼承另一個接口，和類之間的繼承類似

## 接口的繼承
* 使用extends
```java
// 文件名: Sports.java
public interface Sports
{
   public void setHomeTeam(String name);
   public void setVisitingTeam(String name);
}
 
// 文件名: Football.java
public interface Football extends Sports
{
   public void homeTeamScored(int points);
   public void visitingTeamScored(int points);
   public void endOfQuarter(int quarter);
}
```

## 接口的多重繼承
* 主要直接使用逗號就可以
```java
public interface Hockey extends Sports, Event
```


