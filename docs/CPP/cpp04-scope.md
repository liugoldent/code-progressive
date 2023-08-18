---
description: C++ 作用域
tags:
  - c++
  - backend
keywords: [c++作用域]
---

# [C++] 作用域

## 定義變量的三個地方
* 在函數或一個代碼塊內部聲明的變量，稱為局部變量。
* 在函數「參數」的定義中聲明的變量，稱為形式參數。
* 在所有函數外部聲明的變量，稱為全局變量。

## 自動初始化
* int：0
* char：'\0'
* float：0
* double：0
* pointer：NULL
## 變量作用域
### 局部作用域：
* 在函數內部聲明的變量具有局部作用域，它們只能在函數內部訪問。局部變量在函數每次被調用時被創建，在函數執行完後被銷毀。
```cpp
#include <iostream>

int globalVar = 42; // 全局變數

int main() {
    int localVar = 10; // 主函式的局部變數

    {
        int innerVar = 5; // 內部區塊的局部變數
        std::cout << "innerVar: " << innerVar << std::endl; // 可以在這裡訪問 innerVar
    }

    std::cout << "localVar: " << localVar << std::endl;     // 可以在這裡訪問 localVar
    std::cout << "globalVar: " << globalVar << std::endl;   // 可以在這裡訪問 globalVar

    // 以下程式碼無法訪問 innerVar，因為它已經超出作用域
    // std::cout << "innerVar: " << innerVar << std::endl;

    return 0;
}
```

### 全局作用域：
* 在所有函數和代碼塊之外聲明的變量具有全局作用域，它們可以被程序中的任何函數訪問。全局變量在程序開始時被創建，在程序結束時被銷毀。
```cpp
#include <iostream>

int globalVar = 42; // 全局變數

void printGlobalVar() {
    std::cout << "Global variable: " << globalVar << std::endl;
}

int main() {
    std::cout << "Global variable in main: " << globalVar << std::endl;
    globalVar = 99; // 修改全局變數的值

    printGlobalVar(); // 調用函式以訪問和印出全局變數

    return 0;
}
```

### 塊作用域：
* 在代碼塊內部聲明的變量具有塊作用域，它們只能在代碼塊內部訪問。塊作用域變量在代碼塊每次被執行時被創建，在代碼塊執行完後被銷毀。
```cpp
#include <iostream>

int main() {
    int x = 10; // x 在 main 函式的塊級作用域內

    if (x == 10) {
        int y = 20; // y 在 if 區塊的塊級作用域內
        std::cout << "x: " << x << std::endl;
        std::cout << "y: " << y << std::endl;
    }

    // 在這裡無法訪問 y，因為它的作用域僅在 if 區塊內部
    // std::cout << "y: " << y << std::endl;

    return 0;
}
```

### 類作用域：
* 在類內部聲明的變量具有類作用域，它們可以被類的所有成員函數訪問。類作用域變量的生命週期與類的生命週期相同。
```cpp
#include <iostream>

class MyClass {
public:
    int publicVar; // 公開成員變數

    void publicFunction() {
        std::cout << "Public function" << std::endl;
    }

private:
    int privateVar; // 私有成員變數

    void privateFunction() {
        std::cout << "Private function" << std::endl;
    }
};

int main() {
    MyClass obj;

    obj.publicVar = 42; // 訪問公開成員變數
    obj.publicFunction(); // 調用公開成員函式

    // 下面的代碼將導致編譯錯誤，因為 privateVar 和 privateFunction 是私有的，無法在外部訪問
    // obj.privateVar = 10;
    // obj.privateFunction();

    return 0;
}
```