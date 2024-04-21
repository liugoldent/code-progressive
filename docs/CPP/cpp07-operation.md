---
description: C++ 算術運算符
tags:
  - c++
  - backend
keywords: [c++算術運算符]
---

# [C++] 運算符

## 算數運算符

### +

把兩個數相加

### -

減法

### \*

乘法

### /

分子除以分母，取整數

### %

取餘數

### ++

回傳數字+1

### --

回傳數字-1

```cpp
#include <iostream>
using namespace std;

int main()
{
   int a = 21;
   int b = 10;
   int c;

   c = a + b;
   cout << "Line 1 - c 的值是 " << c << endl ;
   c = a - b;
   cout << "Line 2 - c 的值是 " << c << endl ;
   c = a * b;
   cout << "Line 3 - c 的值是 " << c << endl ;
   c = a / b;
   cout << "Line 4 - c 的值是 " << c << endl ;
   c = a % b;
   cout << "Line 5 - c 的值是 " << c << endl ;

   int d = 10;   //  测试自增、自减
   c = d++;
   cout << "Line 6 - c 的值是 " << c << endl ;

   d = 10;    // 重新赋值
   c = d--;
   cout << "Line 7 - c 的值是 " << c << endl ;
   return 0;
}
```

```cpp
// Line 1 - c 的值是 31
// Line 2 - c 的值是 11
// Line 3 - c 的值是 210
// Line 4 - c 的值是 2
// Line 5 - c 的值是 1
// Line 6 - c 的值是 10
// Line 7 - c 的值是 10
```

## 關係運算符

### `==`

### `!=`

### `>`

### `<`

### `>=`

### `<=`

```cpp
#include <iostream>
using namespace std;

int main()
{
   int a = 21;
   int b = 10;
   int c ;

   if( a == b )
   {
      cout << "Line 1 - a 等于 b" << endl ;
   }
   else
   {
      cout << "Line 1 - a 不等于 b" << endl ;
   }
   if ( a < b )
   {
      cout << "Line 2 - a 小于 b" << endl ;
   }
   else
   {
      cout << "Line 2 - a 不小于 b" << endl ;
   }
   if ( a > b )
   {
      cout << "Line 3 - a 大于 b" << endl ;
   }
   else
   {
      cout << "Line 3 - a 不大于 b" << endl ;
   }
   /* 改变 a 和 b 的值 */
   a = 5;
   b = 20;
   if ( a <= b )
   {
      cout << "Line 4 - a 小于或等于 b" << endl ;
   }
   if ( b >= a )
   {
      cout << "Line 5 - b 大于或等于 a" << endl ;
   }
   return 0;
}
// Line 1 - a 不等于 b
// Line 2 - a 不小于 b
// Line 3 - a 大于 b
// Line 4 - a 小于或等于 b
// Line 5 - b 大于或等于 a
```

## 邏輯運算符

### &&

### ||

### !

```cpp
#include <iostream>
using namespace std;

int main()
{
   int a = 5;
   int b = 20;
   int c ;

   if ( a && b )
   {
      cout << "Line 1 - 条件为真"<< endl ;
   }
   if ( a || b )
   {
      cout << "Line 2 - 条件为真"<< endl ;
   }
   /* 改变 a 和 b 的值 */
   a = 0;
   b = 10;
   if ( a && b )
   {
      cout << "Line 3 - 条件为真"<< endl ;
   }
   else
   {
      cout << "Line 4 - 条件不为真"<< endl ;
   }
   if ( !(a && b) )
   {
      cout << "Line 5 - 条件为真"<< endl ;
   }
   return 0;
}
// Line 1 - 条件为真
// Line 2 - 条件为真
// Line 4 - 条件不为真
// Line 5 - 条件为真
```

## 位元運算符

- 數位邏輯的 or and

```cpp
#include <iostream>
using namespace std;

int main()
{
   unsigned int a = 60;      // 60 = 0011 1100
   unsigned int b = 13;      // 13 = 0000 1101
   int c = 0;

   c = a & b;             // 12 = 0000 1100
   cout << "Line 1 - c 的值是 " << c << endl ;

   c = a | b;             // 61 = 0011 1101
   cout << "Line 2 - c 的值是 " << c << endl ;

   c = a ^ b;             // 49 = 0011 0001 // 抑或，也就是2者不同，才1
   cout << "Line 3 - c 的值是 " << c << endl ;

   c = ~a;                // -61 = 1100 0011 // 反向的a
   cout << "Line 4 - c 的值是 " << c << endl ;

   c = a << 2;            // 240 = 1111 0000 // 0011 1100 往左兩位
   cout << "Line 5 - c 的值是 " << c << endl ;

   c = a >> 2;            // 15 = 0000 1111 // 0011 1100 往右兩位
   cout << "Line 6 - c 的值是 " << c << endl ;

   return 0;
}
// Line 1 - c 的值是 12
// Line 2 - c 的值是 61
// Line 3 - c 的值是 49
// Line 4 - c 的值是 -61
// Line 5 - c 的值是 240
// Line 6 - c 的值是 15
```

## 賦值運算符

```cpp
#include <iostream>
using namespace std;

int main()
{
   int a = 21;
   int c ;

   c =  a;
   cout << "Line 1 - =  运算符实例，c 的值 = : " <<c<< endl ;

   c +=  a;
   cout << "Line 2 - += 运算符实例，c 的值 = : " <<c<< endl ;

   c -=  a;
   cout << "Line 3 - -= 运算符实例，c 的值 = : " <<c<< endl ;

   c *=  a;
   cout << "Line 4 - *= 运算符实例，c 的值 = : " <<c<< endl ;

   c /=  a;
   cout << "Line 5 - /= 运算符实例，c 的值 = : " <<c<< endl ;

   c  = 200;
   c %=  a;
   cout << "Line 6 - %= 运算符实例，c 的值 = : " <<c<< endl ;

   c <<=  2;
   cout << "Line 7 - <<= 运算符实例，c 的值 = : " <<c<< endl ;

   c >>=  2;
   cout << "Line 8 - >>= 运算符实例，c 的值 = : " <<c<< endl ;

   c &=  2;
   cout << "Line 9 - &= 运算符实例，c 的值 = : " <<c<< endl ;

   c ^=  2;
   cout << "Line 10 - ^= 运算符实例，c 的值 = : " <<c<< endl ;

   c |=  2;
   cout << "Line 11 - |= 运算符实例，c 的值 = : " <<c<< endl ;

   return 0;
}
```

```cpp
// Line 1 - =  运算符实例，c 的值 = 21
// Line 2 - += 运算符实例，c 的值 = 42
// Line 3 - -= 运算符实例，c 的值 = 21
// Line 4 - *= 运算符实例，c 的值 = 441
// Line 5 - /= 运算符实例，c 的值 = 21
// Line 6 - %= 运算符实例，c 的值 = 11
// Line 7 - <<= 运算符实例，c 的值 = 44
// Line 8 - >>= 运算符实例，c 的值 = 11
// Line 9 - &= 运算符实例，c 的值 = 2
// Line 10 - ^= 运算符实例，c 的值 = 0
// Line 11 - |= 运算符实例，c 的值 = 2
```

## 雜項運算符

### sizeof

- sizeof 運算符，返回變量的大小。例如，`sizeof(a)` 将返回 4，其中 a 是整数。

### Condition ? X : Y

- 條件运算符。如果 Condition 为真 `?` 则值为 `X` `:` 否则值为 `Y`。

### .（點）和 ->（箭頭）

- `.` 代表物件的
- `->` 代表指針（指向物件）

### Cast

- 强制转换运算符把一种数据类型转换为另一种数据类型。例如，`int(2.2000)` 将返回 2。

### &

- 指針運算符 & 返回變量的地址。例如 `&a`; 將給出變量的實際地址。
