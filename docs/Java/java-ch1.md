---
sidebar_position: 0
description: java 基本課程
tags:
  - java
keywords: [java]
---

# [JAVA 基本] 基本知識 ch01

## 變數與資料型態
### 基本型態
```java
// long
long a = 1233333
// int（初始值0）
int b = 1233
// short（初始值0）
short c = 32
// byte（初始值0）
byte d = 126
// char（初始值'\u0000'）
char e = 654
// boolean（初始值false）
boolean f = true
// float（初始值0.0F）
float g = 3.4*10
// double（初始值0.0D）
double h = 1.7E308
```
### 物件型態
```java
Scanner scn = new Scanner('s')
```

## 型態轉換
```java
a = 25
// 直接轉換 -> ()內放類別
-> (float)a
```

## 運算子/式
```java
sum = sum + 20
// +
// -
// *
// /：除（取商數）
// %：取餘數
// && -> 皆要
// || -> 或是
```

## 迴圈
### for
```java
for(int i = 0, j= 0; 判斷條件 ; 增減量){
  
}
```
### while
```java
while(條件){
  // 主體
}
```
### do while
```java
// 設定迴圈初始值
do{
  // 主體
  // 增減量
}while(條件);
```
### switch
```java
switch(運算式){
  case value1:
    // to do
  case value2:
    // to do
}
```

## 陣列
### 一維陣列
```java
// 寫法 1. 
int score[] // 宣告一個內容都為整數的'score'陣列
score = new int[4] // 然後放置其內容

// 寫法 2. 
int score[] = new int[4]
```
### 二維陣列
```java
int score = new score[列的個數][行的個數]
```

## 函數
注意函數的傳遞為拷貝一份資料
#### 傳遞基本型態的為傳值(call by value)
#### 傳遞物件型態的為傳參考(call by reference)
```java
public static 傳回資料型態 函數名稱(型態 引數1, ....){
  // 程式敘述
  // return 數值
}

// ex1.
public static 傳回資料型態 函數名稱(int arr[]){
  // 程式敘述
  // return 數值
}
```



