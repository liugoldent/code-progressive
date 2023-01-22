---
sidebar_position: 0
description: java 基本課程
tags:
  - java
keywords: [java]
---

# [JAVA 基本] 類別知識 ch02

## 類別
### 基本類別
#### 類別就是把資料成員與函數成員一起裝在膠囊內的概念
```java
class ABC {
  資料型態 資料名稱
  傳回值 函數名稱(引數1, 引數2){
    // do thing
  }
}

class CRectangle {
  int width;
  int height;

  int area(){
    return width * height
  }
}
```

### 宣告與建立物件
```java
// 先「建立」一個「指向」CRectangle 物件「位址」的 rect1 變數 
// 配置儲存CRectangle物件，所需的記憶空間
// rect1 是指向物件實體的一個參考位址
CRectangle rect1 = new CRectangle()
// new CRectangle 才是真正讓 rect1 去指向CRectangle物件所需的記憶空間
```

### 存取物件內容
直接利用「.」去存取
```java
CRectangle rect1 = new CRectangle()
rect1.width = 20
```

### 物件內部，存取自己
使用`this`存取自己類別內部的數據
```java
class CCircle {
  double PI = 3.14
  void show_area(){
    System.our.println("area = "+this.PI)
  }
}
```

### 私有成員（private）
```java
class CCircle {
  private double pi = 3.14;
  private double radius;

  // 這邊可以運用setRadius來設定私有成員的值
  public void setRadius(double r){
    if(r>0){
      radius = r
    }
  }
}
```

## 建構元
#### 目的：幫助新建立的物件設定初始值
#### 規定：沒有回傳值＋必須與類別名稱相同
#### 呼叫時機點：建立物件時自動呼叫
```java
class ABC {
  修飾子(public or private) 類別名稱(type value1, ...){
    // 程式敘述
  }
}
```
```java
// demo
class CCircle {
  private double pi = 3.14;
  private double radius;

  public CCircle(double r){
    radius = r
  }
}

public class app9_1 {
  public static main(String args[]){
    // 這邊new時，會自動帶入數字給建構元
    CCircle cc = new CCircle(4)
  }
}
```

### 建構元互相呼叫
#### 必須以this()來呼叫，看下面範例，不是this.()，而是this()
```java
class CCircle {
  private String Color;
  private double pi = 3.14;
  private double radius;

  public CCircle(){
    this("Green", 1.9);
  }
  public CCircle(String str, double radius){
    color = str;
    radius = r;
  }
}
```

### 建構元的公有私有
#### 建立物件時，新的物件會自動呼叫public的建構元
```java
class CCircle {
  private String Color;
  private double pi = 3.14;
  private double radius;

  private CCircle(){
    // do something
  }

  // public 預先被呼叫
  public CCircle(String str, double radius){
    // 然後呼叫無引數的建構元
    this()
    color = str;
    radius = r;
  }
}
```

### 建構元的省略
#### 如果啥都沒定義，Java會自定義一個預設的建構元
```java
// 啥事都沒做，也沒傳進引數
public CCircle(){

}
```

## 類別變數與類別函數
### 實例變數與實例函數
```java
// 各radius獨立，並各自占用一個記憶體位子
// 然後show也是各自物件獨有的
CCircle cir1 = new CCircle(1.0);
cirl.radius = 1.0
cir1.show()

CCircle cir1 = new CCircle(2.0);
cirl.radius = 2.0
cir1.show()
```

### 類別變數與類別函數
#### 就是類別中共同擁有的變數與函數
#### 關鍵字：static
##### 好處：共享記憶體節省空間
##### 缺點：無法存取實例變數、實例函數（因為可能物件還沒實例）
##### 缺點：類別函數內無法使用`this`，（同樣是因為物件可能還沒實例）
at Java p9-15
```java
// 類別變數
class CCircle {
  private static double = 3.14;
  private static count = 0;
  private double radius;
  public CCircle(){
    this(1.0)
  }
  public CCircle(double r){
    radius = r;
    count++
  }
  public void show(){
    System.out.println("area="+pi*radius*radius);
  }
  public void show_count(){
    System.out.println(count+"object(s) created");
  }
}

public class app9_6 {
  public void main(String args[]){
    CCircle cir1 = new CCircle();
    cir1.show_count()
    CCircle cir2 = new CCircle(2.0);
    CCircle cir3 = new CCircle(4.3);
    cir1.show_count() // 3 object(s) created
    cir2.show_count()
    cir3.show_count()
  }
}
```
```java
// 實體函數
// 一開始我們的函數都是如此呼叫
CCircle cir1 = new CCircle()
cir1.show_count()

// 但透過類別函數
class CCircle {
  public static void show_count(){
    // System.....
  }
}
// 我們可以直接從類別呼叫，而不需要再new一個物件出來
CCircle.show_count()
```

### 類別型態的變數
page: 9-22
```java
// 基本型態
private double PI = 3.14;

// 物件型態
CCircle cir1, cir2;
cir1 = new CCircle();
cir2 = cir1; // means cir1指向cir2（兩個指向一樣的位置）
```

### 類別型態的引數
```java
傳回值型態 compare(CCircle cir){
  if(this.radius == cir.radius){
    System.out.println('radius are equal')
  }
}
```
### 傳回類別型態的變數
```java
public CCircle compare(CCircle cir){
  if(this.radius > cir.radius){
    return this
  }else{
    return cir
  }
}
```

## 利用陣列儲存物件
作法：先建立類別型態的陣列，再將變數陣列指向物件陣列
#### 必須使用2次new運算子來配置記憶體空間
  * #### 第一次配記憶體空間給類別型態的陣列
  * #### 第二次配記憶體空間給物件陣列
```java
CCircle cir[] = new CCircle[3]
cir[0] = new CCircle()
cir[1] = new CCircle()
cir[2] = new CCircle()
```

## 巢狀類別
### static type
#### 檔名：app9_15$Caaa.class(檔名：外部class$內部class)
```java
public class app9_15 {
  public static void main(String args[]){
    Caaa aa = new Caaa()
    aa.set_num(5)
  }
  // 由於static 函數只能存取static成員，所以別無選擇
  static class Caaa {
    int num;
    void set_num(int n){
      num = n;
      System.out.println("num = "+ num)
    }
  }
}
```
### no static type
若不想要將`Caaa`設定為static，但卻又想在main()裡存取，可以用下列步驟：
1. 在外部類別的建構元內建立內部類別的物件
2. 在main()中建立一個外部類別的物件
-> 等於自己建立自己
```java
public class app9_16 {
  public app9_16 {
    Caaa aa = new Caaa() // 建構子這邊，new出新的Caaa
    aa.set_num(5)
  }
  public static void main(String args[]){
    app9_16 obj = new app9_16(); // 自己建立自己，就跑上去建構子
  }
  
  class Caaa {
    int num;
    void set_num(int n){
      num = n;
      System.out.println("num = "+ num)
    }
  }
}
```

## 匿名內部類別
#### 目的：用於new建立類別，並補足內部類別內沒有定義的函數，可以有效降低程式碼
#### 注意：使用小括號
```java
public class app9_17 {
  public static void main(String args[]){
    (
      new Caaa {
        void set_num(int n){
          num = n;
        }
      }.set_num(5)
    )
  }
  static Class Caaa {
    int num
  }
}
```

## 資源回收
```java
class app {
  public static void main(String args[]){
    CCircle cir1 = new CCircle()
    CCircle cir2;
    cir2 = cir1; // 雖然cir1 被回收，但是cir2還存在！不會被回收
    cir1 = null; // 這會讓資料進行回收
  }
}
```

## 總結：
1. 當new物件時，先去找建構子
2. 建構子走完，再去看function怎麼走
* 外部成員與內部成員可以互相讀取





