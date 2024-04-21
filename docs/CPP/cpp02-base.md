---
description: C++ 規範
tags:
  - c++
  - backend
keywords: [c++規範]
---

# [C++] 基本規範

## 編寫架構

- 一定要雙引號
- 結束一定要分號

## 基本語句

- 物件：物件具有狀態、行為。
- 類：類可以定義為描述物件行為、狀態的模板藍圖
- 方法：一個方法代表一個行為。一個類可以包含多個方法。可以再方法中寫入邏輯、操作數據以及執行所有動作
- 即時變量：每個物件有獨特的即時變量。物件的狀態是由這些變量的值所創建的

## 程式結構

### 基本 Hello World

- 包含了一個稱為 `<iostream>` 的標頭檔。這個標頭檔提供了 C++ 的輸入輸出功能，允許你在程式中進行輸出顯示和輸入操作。
- 告訴編譯器，我們要使用 std 命名空間中的東西。std 是 C++ 標準函式庫的命名空間，裡面包含了很多標準的函式和物件
- cout，這是 C++ 標準函式庫中的物件，代表控制台輸出。`<<` 是一個輸出操作符，用於將文字或數值輸出到控制台。

```cpp
#include <iostream>
using namespace std;

// main() 是程序开始执行的地方

int main()
{
   cout << "Hello World"; // 输出 Hello World
   return 0;
}
```

## 程式空白

- 為必要

```cpp
fruit = apples + oranges;   // 获取水果的总数
```

## 關鍵字

### 基本數據型別關鍵字：

- int
- float
- double
- char
- bool

### 控制結構關鍵字：

- if
- else
- switch
- case
- default
- for
- while
- do
- break
- continue
- return

### 類型修飾符和存儲類別關鍵字：

- const
- static
- volatile
- extern

### 類別和物件相關關鍵字：

- class
- struct
- public
- private
- protected
- virtual
- new
- delete
- this

### 函式相關關鍵字：

- void
- int
- float
- double
- char
- bool
- namespace
- using

### 異常處理相關關鍵字：

- try
- catch
- throw

### 命名空間相關關鍵字：

- namespace

### 類型轉換關鍵字：

- static_cast
- dynamic_cast
- const_cast
- reinterpret_cast

### 模板相關關鍵字：

- template
- typename
- class
- typename

### STL 相關關鍵字：

- vector
- map
- set
- list
- iterator
- algorithm

## 註解

- C++也有單行與多行註解

```cpp
#include <iostream>
using namesapce std;

int main(){
  // 這是一個註解
  /**
    * 跨行註解
    */
}
```
