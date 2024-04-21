---
description: C++ 修飾符類型
tags:
  - c++
  - backend
keywords: [c++修飾符類型]
---

# [C++] 修飾符類型
## 基本修飾符
### signed：
* 表示變量可以存儲負數。對於整型變量來說，signed 可以省略，因為整型變量默認為有符號類型。
### unsigned：
* 表示變量不能存儲負數。對於整型變量來說，unsigned 可以將變量範圍擴大一倍。
* 不能存負數 -> 意味著只有正值
### short：
* 表示變量的範圍比int 更小。short int 可以縮寫為short。

### long：
* 表示變量的範圍比int 更大。long int 可以縮寫為long。

### long long：
* 表示變量的範圍比long 更大。C++11 中新增的數據類型修飾符。

### float：
* 表示單精度浮點數。

### double：
* 表示雙精度浮點數。

### bool：
* 表示布爾類型，只有true 和false 兩個值。

### char：
* 表示字符類型。

### wchar_t：
* 表示寬字符類型，可以存儲Unicode 字符。

## 程式範例
```cpp
#include < iostream > 
using namespace std ;
/*  
* 這個程序演示了有符號整數和無符號整數之間的差別
*/ 
int main ( ) { 
    short int i ;            // 有符號短整數：short int 是有符號短整數，其範圍通常為 -32,768 到 32,767 
    short unsigned int j ;   // 無符號短整數：short unsigned int 是無符號短整數，其範圍通常為 0 到 65,535。
    j = 50000 ;
    i = j ;
    cout << i << " " << j ;
    return 0 ;
} 

// 輸出 -15536 50000
```

## 類型限定符
### const 限定符
* 用於聲明不可變（常量）的變數
```cpp
const int x = 10; // x 是不可修改的常量
```
### volatile 限定符
* 指示編譯器，該變數的值可能在程式的控制之外被修改，因此編譯器不應對該變數進行優化，以確保讀寫操作的順序正確
* 用於指示變數可能在不同時間被修改，例如硬體設備的狀態。
```cpp
volatile int sensorValue; // 用於指示 sensorValue 可能被外部因素更改
```
```cpp
#include <iostream>

int main() {
    volatile int sensorValue = 0; // 用 volatile 限定符聲明變數

    while (true) {
        // 假設 sensorValue 由外部硬體設備更新
        sensorValue = readSensorValue();

        // 由於 sensorValue 是 volatile，編譯器不會對讀取進行優化
        std::cout << "Sensor Value: " << sensorValue << std::endl;
    }
    return 0;
}
```
### mutable 限定符
* 用於將類中的成員變數標記為可修改，即使在 const 函式中。
```cpp
class MyClass {
public:
    mutable int counter; // 可以在 const 函式中修改的成員變數
};
```
### restrict 限定符
* 用於指示指標之間沒有重疊，從而幫助編譯器進行優化。
* restrict 告訴編譯器，通過該指標訪問的內存不會通過其他指標進行修改，從而允許進行更多的優化
```cpp
void processArray(int* restrict arr1, int* restrict arr2, int size);
```
```cpp
#include <iostream>

void updateArray(int* restrict arr1, int* restrict arr2, int size) {
    for (int i = 0; i < size; ++i) {
        arr1[i] += arr2[i];
    }
}

int main() {
    int array1[] = {1, 2, 3, 4, 5};
    int array2[] = {10, 20, 30, 40, 50};
    int size = sizeof(array1) / sizeof(array1[0]);

    updateArray(array1, array2, size);

    for (int i = 0; i < size; ++i) {
        std::cout << array1[i] << " ";
    }

    return 0;
}
```
### explicit 限定符
* 當一個類別的建構函式被聲明為 explicit 時，該建構函式將不再允許在隱式轉換的上下文中被調用，從而防止意外的轉換。
* 用於防止隱式的類型轉換。
```cpp
class MyClass {
public:
    explicit MyClass(int value) { /* constructor code */ }
};

MyClass obj = 10; // 這會產生編譯錯誤，因為 explicit 限定符阻止了隱式轉換
```
```cpp
#include <iostream>

class MyClass {
public:
    explicit MyClass(int value) : data(value) {
        std::cout << "Constructor called with value: " << value << std::endl;
    }

    int getData() const {
        return data;
    }

private:
    int data;
};

void printData(const MyClass& obj) {
    std::cout << "Data: " << obj.getData() << std::endl;
}

int main() {
    MyClass obj1 = 10; // 錯誤，無法使用隱式轉換
    MyClass obj2(20); // 正確，使用顯式轉換

    printData(obj1);
    printData(obj2);

    return 0;
}

```
### constexpr 限定符
* 用於在編譯時求值的常量運算式。
```cpp
constexpr int square(int x) {
    return x * x;
}

int result = square(5); // 在編譯時計算出結果
```
```cpp
#include <iostream>

constexpr int factorial(int n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

int main() {
    constexpr int num = 5;
    constexpr int result = factorial(num);

    std::cout << "Factorial of " << num << " is: " << result << std::endl;

    return 0;
}
```

## static
* 用於修改變數的生命週期和作用域
### 在函式內部的靜態變數：
當 static 用於函式內部聲明的變數時，該變數稱為靜態變數。靜態變數在函式的多次調用之間保持其值不變，即使函式退出，該變數的值也不會被重置
```cpp
void countCalls() {
    static int counter = 0; // 靜態變數
    counter++;
    std::cout << "Function called " << counter << " times." << std::endl;
}
```
### 在類內部的靜態成員變數
* 當 static 用於類內部聲明的變數時，該變數成為該類的靜態成員變數。這意味著所有該類的物件共享同一個變數實例，並且可以在不創建物件的情況下訪問。
```cpp
class MyClass {
public:
    static int count; // 靜態成員變數
};

int MyClass::count = 0; // 初始化靜態成員變數

// 在其他地方
MyClass::count++;
```
### 在檔案內部的靜態全局變數
* 當 static 用於檔案內部聲明的變數時，該變數稱為靜態全局變數。這意味著該變數僅在當前檔案中可見，其他檔案無法訪問。
```cpp
// File1.cpp
static int file1Var = 42; // 靜態全局變數

// File2.cpp
// 無法訪問 file1Var

```

## register
* 用於提示編譯器將變數存儲在 CPU 的暫存器中，以便更快地訪問
* 然而，現代的編譯器通常會自動優化變數的存儲和訪問，因此使用 register 關鍵字的效果可能有限，甚至被忽略。
```cpp
#include <iostream>

int main() {
    register int x = 10; // 使用 register 關鍵字聲明變數 x

    std::cout << "Value of x: " << x << std::endl;

    return 0;
}
```
* register 關鍵字僅是一個提示，編譯器可以選擇是否將變數存儲在暫存器中，或者存儲在記憶體中。現代的編譯器通常會自動優化變數的存儲和訪問，因此使用 register 關鍵字可能不會帶來顯著的性能提升。
* register 關鍵字僅適用於普通變數，不能用於指標、引用、類成員變數等
* register 關鍵字已被視為過時，編譯器可以忽略它。因此，通常建議不要使用 register 關鍵字，而是讓編譯器自行進行優化。

## &語法
### 位元運算子
```cpp
int result = a & b;
```
### 函式參數中的引用
```cpp
void modifyValue(int& value){
  value = 42
}
```
### 動態轉換
```cpp
int& r = const_cast<int&>(i)
```
### 宣告引用（目的：改變物件值）
* & 符號可以用來宣告引用變數，它建立了一個已存在變數的別名。引用變數是一個別名，它與原始變數共用同一個記憶體位置，因此對引用的操作實際上是對原始變數的操作
```cpp
int x = 5;
int& ref = x; 
// 建立了一個 x 的引用
// 所以實際上會對該「記憶體」位置上的值做改變
```
### 使用引用改變物件
```cpp
#include <iostream>

class MyClass {
public:
    int value;
};

int main() {
    MyClass obj;
    obj.value = 10;

    MyClass& ref = obj; // 建立 obj 的引用
    ref.value = 20;     // 透過引用修改 obj 的成員

    std::cout << obj.value << std::endl; // 輸出修改後的值

    return 0;
}
```
### 使用指針改變物件
```cpp
#include <iostream>

class MyClass {
public:
    int value;
};

int main() {
    MyClass obj;
    obj.value = 10;

    MyClass* ptr = &obj; // 建立指向 obj 的指針
    ptr->value = 20;     // 透過指針修改 obj 的成員

    std::cout << obj.value << std::endl; // 輸出修改後的值

    return 0;
}

```

## virtual 關鍵字
* 它主要用於基類和派生類之間的成員函式，特別是在虛擬函式（Virtual Functions）的概念中
* 虛擬函式允許你在基類中聲明一個函式為虛擬的，並在派生類中重新實現（覆寫）該函式。當你通過基類的指針或引用呼叫這個函式時，將根據實際對象的型別（基類或派生類）來決定調用哪個版本的函式。這使得你可以在運行時根據實際對象的型別動態地決定要調用的函式版本。

## extern
### 聲明外部變數
* 你在一個文件中聲明一個外部變數時，extern 關鍵字告訴編譯器這個變數是在其他文件中定義的。這樣可以在當前文件中使用這個變數，而實際的定義在其他文件中。
* extern關鍵字在任何地方聲明一個變量。雖然您可以在C++ 程序中多次聲明一個變量，但變量只能在某個文件、函數或代碼塊中被定義一次。
```cpp
// File1.cpp
int globalVar = 42;

// File2.cpp
extern int globalVar; // 声明外部变量
// 可以在这里使用 globalVar
```

### 聲明外部函式
* extern 關鍵字告訴編譯器這個函式是在其他文件中定義的。這允許你在當前文件中使用這個函式，而實際的函式實現在其他文件中。
```cpp
// MathFunctions.cpp
double square(double x) {
    return x * x;
}

// main.cpp
extern double square(double x); // 声明外部函数
// 可以在这里使用 square 函数
```

## thread_local 線程本地變數
* 線程本地變數是一種變數，它的值對於每個執行緒都是獨立的，每個執行緒都有自己的變數實例。這在多執行緒程式中非常有用，可以確保不同執行緒之間的變數互不干擾。
```cpp
#include <iostream>
#include <thread>

thread_local int threadId; // 聲明一個線程本地變數

void printThreadId() {
    std::cout << "Thread ID: " << threadId << std::endl;
}

int main() {
    std::thread t1([] {
        threadId = 1;
        printThreadId();
    });

    std::thread t2([] {
        threadId = 2;
        printThreadId();
    });

    t1.join();
    t2.join();

    return 0;
}

```
1. 這個例子中，我們聲明了一個 thread_local 變數 threadId。在 main 函式中，我們創建了兩個執行緒 t1 和 t2，每個執行緒分別設置了 threadId 的值，然後調用 printThreadId 函式來輸出當前執行緒的 ID。

2. threadId 是線程本地變數，每個執行緒的 threadId 值都是獨立的。因此，即使在多個執行緒中使用相同的變數名稱，也不會產生競爭條件或互相干擾的情況。

3. 需要注意的是，thread_local 變數只能用於函式的區塊內、全局區域或命名空間內，且它的生命週期僅限於當前執行緒的生命週期。在多執行緒程式中，使用 thread_local 可以幫助你簡化線程間的資料共享和保護。


