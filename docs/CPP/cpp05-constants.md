---
description: C++ 常量與數字
tags:
  - c++
  - backend
keywords: [c++常量與數字]
---

# [C++] 常量與數字
* 不可變的數值或表示式，它們在程式運行期間保持不變
## 字面值常量（Literal Constants）
```cpp
int x = 10; // 整數字面值常量
double pi = 3.14159; // 浮點數字面值常量
char ch = 'A'; // 字符字面值常量
```
## const 修飾的常量（const Constants）
```cpp
const int maxCount = 100; // 使用 const 修飾的整數常量
const double gravity = 9.8; // 使用 const 修飾的浮點數常量
```
## enum 常量（Enum Constants）
```cpp
enum Color {
    Red,
    Green,
    Blue
};
Color selectedColor = Red; // 使用 enum 定義的常量
```

## 預處理器常量（Preprocessor Constants）
* 使用預處理器 #define 指令定義的常量。
```cpp
#define PI 3.14159
double radius = 5.0;
double circumference = 2 * PI * radius; // 使用預處理器常量
```

## 數字內建function
[C++ 数字](https://www.runoob.com/cplusplus/cpp-numbers.html)
```cpp
#include <iostream>
#include <cmath>
using namespace std;
 
int main ()
{
   // 数字定义
   short  s = 10;
   int    i = -1000;
   long   l = 100000;
   float  f = 230.47;
   double d = 200.374;
 
   // 数学运算
   cout << "sin(d) :" << sin(d) << endl;
   cout << "abs(i)  :" << abs(i) << endl;
   cout << "floor(d) :" << floor(d) << endl;
   cout << "sqrt(f) :" << sqrt(f) << endl;
   cout << "pow( d, 2) :" << pow(d, 2) << endl;
 
   return 0;
}
```
### 隨機數
```cpp
srand( (unsigned)time( NULL ) );
```








