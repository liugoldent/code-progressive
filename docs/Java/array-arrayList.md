---
sidebar_position: 0
description: array vs arrayList
tags:
  - java
  - array
  - arrayList
keywords: [java,array,arrayList]
---

# [JAVA 比較]Array vs ArrayList

## 程式碼比較
1. Array的大小是固定的；ArrayList的大小是可變的。
2. Array中的元素可以是原始型別(primitive)或物件(object)；ArrayList的元素只能是物件。
```java
// ArrayList
ArrayList<Egg> myList = new ArrayList<Egg>();
// Array
String [] myArray = new String[2]
```
3. Array不能使用泛型(generic)，ArrayList可以使用泛型。
4. Array用length屬性取得內容長度；ArrayList用size()方法取得內容長度。
```java
// ArrayList
int theSize = myList.size()
// Array
int arraySize = myArray.length
```
5. Array用賦值符(=)儲存元素值；ArrayList用add()方法儲存元素值。
```java
// ArrayList 加入元素
Egg myEgg = new Egg();
myList.add(myEgg);
// ArrayList 刪除元素
myList.remove(s)

// Array 加入元素
String a = new String('whoowho')
myArray[0] = a
// ArrayList 刪除元素
myArray[0] = null
```
6. ArrayList查詢特定位置
```java
int idx = myList.indexOf(myEgg) // return 0
```
7. 判斷集合是否為空
```java
boolean empty = myList.isEmpty()
```
8. 查詢特定元素
```java
// ArrayList
boolean isIn = myList.contains(myEgg)
// Array -> 跑for迴圈
boolean isIn = false
for(String item: myArray){
    if(b.equal(item)){
        isIn = true
        break
    }
}
```

## 文字比較
* 一般Array：
    * 創建時就要確定大小
    * 存放物件時需要指定位址
    * 使用[]取得內容
