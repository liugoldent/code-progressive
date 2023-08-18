---
description: C++ 陣列
tags:
  - c++
  - backend
keywords: [c++陣列]
---

# [C++] 陣列

## 聲明陣列與使用
```cpp
// type arrayName [ arraySize ];
double balance[10];
// or
// 這邊{}內長度，不可以超過定義數量
double balance[5] = {1000.0, 2.0, 3.4, 7.0, 50.0};
// 這邊沒有先定義長度
double balance[] = {1000.0, 2.0, 3.4, 7.0, 50.0};
// 取用
double salary = balance[9];
```
### 實例
```cpp
#include <iostream>
using namespace std;
 
#include <iomanip>
using std::setw;
 
int main ()
{
   int n[ 10 ]; // n 是一个包含 10 个整数的数组
 
   // 初始化数组元素          
   for ( int i = 0; i < 10; i++ )
   {
      n[ i ] = i + 100; // 设置元素 i 为 i + 100
   }
   cout << "Element" << setw( 13 ) << "Value" << endl;
 
   // 输出数组中每个元素的值                     
   for ( int j = 0; j < 10; j++ )
   {
      cout << setw( 7 )<< j << setw( 13 ) << n[ j ] << endl;
   }
 
   return 0;
}
```

## 指向指針的陣列
```cpp
double *p;
double runoobAarray[10];

p = runoobAarray;
```
### 實例
```cpp
#include <iostream>
using namespace std;
 
int main ()
{
   // 带有 5 个元素的双精度浮点型数组
   double runoobAarray[5] = {1000.0, 2.0, 3.4, 17.0, 50.0};
   double *p;
 
   p = runoobAarray;
 
   // 输出数组中每个元素的值
   cout << "使用指针的数组值 " << endl; 
   for ( int i = 0; i < 5; i++ )
   {
       cout << "*(p + " << i << ") : ";
       cout << *(p + i) << endl;
   }
 
   cout << "使用 runoobAarray 作为地址的数组值 " << endl;
   for ( int i = 0; i < 5; i++ )
   {
       cout << "*(runoobAarray + " << i << ") : ";
       cout << *(runoobAarray + i) << endl;
   }
 
   return 0;
}
```

## 傳遞陣列給函數
### 形式參數是指針
```cpp
void myFunction(int *param)
{
.
.
.
}
```
### 形式參數是已定義大小的陣列 
```cpp
void myFunction(int param[10])
{
.
.
.
}
```
### 形式參數是未定義大小的陣列 
```cpp
void myFunction(int param[])
{
.
.
.
}

```
## 從函數返回陣列
* 如果需要從函數返回一維陣列，需要聲明一個返回指針的函數
```cpp
int * myFunction() {
    //. . .
}
int* myFunction()
{
   int myArray[3] = {1, 2, 3};
   return myArray;
}
```

### 一個返回指針的function
```cpp
#include <iostream>
#include <cstdlib>
#include <ctime>
 
using namespace std;
 
// 要生成和返回随机数的函数
int* getRandom( )
{
  static int  r[10];
 
  // 设置种子
  srand( (unsigned)time( NULL ) );
  for (int i = 0; i < 10; ++i)
  {
    r[i] = rand();
    cout << r[i] << endl;
  }
 
  return r;
}
 
// 要调用上面定义函数的主函数
int main ()
{
   // 一个指向整数的指针
   int *p;
 
   p = getRandom();
   for ( int i = 0; i < 10; i++ )
   {
       cout << "*(p + " << i << ") : ";
       cout << *(p + i) << endl;
   }
 
   return 0;
}
```















