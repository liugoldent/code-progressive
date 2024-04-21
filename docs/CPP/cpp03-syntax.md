---
description: C++ 型別
tags:
  - c++
  - backend
keywords: [c++型別]
---

# [C++] 基本型別

## 基本型別
* 參考[C++數據類型](https://www.runoob.com/cplusplus/cpp-data-types.html) -> 注意範圍
* 一個位元組Byte，通常由8個Bit組成 => 4個字節等於32個位元
### 整數類型（Integer Types）：
* int：用於表示整數，通常佔用4個字節。
* short：用於表示短整數，通常佔用2個字節。
* long：用於表示長整數，通常佔用4個字節。
* long long：用於表示更長的整數，通常佔用8個字節。
### 浮點類型（Floating-Point Types）：
* float：用於表示單精度浮點數，通常佔用4個字節。
* double：用於表示雙精度浮點數，通常佔用8個字節。
* long double：用於表示更高精度的浮點數，佔用字節數可以根據實現而變化。
### 字符類型（Character Types）：
* char：用於表示字符，通常佔用1個字節。
* wchar_t：用於表示寬字符，通常佔用2或4個字節。
* char16_t：用於表示16位Unicode字符，佔用2個字節。
* char32_t：用於表示32位Unicode字符，佔用4個字節。
### 布爾類型（Boolean Type）：
* bool：用於表示布爾值，只能取true或false。
### 枚舉類型（Enumeration Types）：
* enum：用於定義一組命名的整數常量。
### 指針類型（Pointer Types）：
* type*：用於表示指向類型為的type對象的指針。
### 數組類型（Array Types）：
* `type[]`或`type[size]`：用於表示具有相同類型的元素組成的數組。
### 結構體類型（Structure Types）：
* struct：用於定義包含多個不同類型成員的結構。
### 類類型（Class Types）：
* class：用於定義具有屬性和方法的自定義類型。
### 共用體類型（Union Types）：
* union：用於定義一種特殊的數據類型，它可以在相同的內存位置存儲不同的數據類型。

## typedef
* 為一個已有的類型取一個新的名字
```cpp
// 定義
typedef type newname;
// 使用
typedef int feet;
feet distance;
```

## 枚舉型別：enum
* 枚舉是將變量的值一一列舉出來，變量的值只能在列舉出來的值範圍內
### 講解
```cpp
// 語法
enum 枚舉名稱{ 
     標籤符[=整數常數], 
     標籤符[=整數常數], 
... 
    標籤符[=整數常數]
} 枚舉變量;

// 使用
enum color { red, green, blue } c;
c = blue;
```
* 默認情況下，第一個名稱的值為0，第二個名稱的值為1，第三個名稱的值為2，以此類推。但是，您也可以給名稱賦予一個特殊的值，只需要添加一個初始值即可。例如，在下面的枚舉中，green的值為5。
```cpp
enum color { red , green = 5 , blue };
// blue的值為6
```

### 範例
```cpp
#include <iostream>

enum Color {
    RED,
    GREEN,
    BLUE
};

int main(){
    // 創建一個枚舉變數
    Color selectedColor = GREEN;

    // 使用 switch 敘述根據枚舉值進行不同的處理
    switch(selectedColor) {
        case RED:
            std::cout << "Selected color: Red" << std::endl;
        case RED:
            std::cout << "Selected color: Red" << std::endl;
        case RED:
            std::cout << "Selected color: Red" << std::endl;
        default:
            std::cout << "Unknown Color" << std::endl;
            break
    }
    return 0
}
```

## 型別轉換
### 靜態轉換 Static Cast
* 是將一種數據強制轉換成另一種類型的值
```cpp
int i = 10;
float f = static_cast<float>(i)
```
### 動態轉換 Dynamic Cast
* 表示在運行時，進行型別轉換和檢查，以處理物件的多態性。
* 通常用於處理繼承關係中的類型轉換，以及執行時判斷一個指向基類（父類）的指針或引用是否實際指向了派生類（子類）的對象
* 不能用於基本型別
* 只有當基本類別包含至少一個虛擬成員函式時，才可以使用`dynamic_cast`
#### dynamic_cast
* 執行動態轉換，主要用於多態性的情況，例如基類指針或引用指向派生類對象。這可以幫助你安全地轉換基類指針或引用到派生類的指針或引用，並在轉換失敗時返回 nullptr（對於指針）或拋出 std::bad_cast 異常（對於引用）。
```cpp
Base* basePtr = new Derived();
Derived* derivedPtr = dynamic_cast<Derived*>(basePtr);
if (derivedPtr) {
    // 轉換成功，使用 derivedPtr
} else {
    // 轉換失敗，basePtr 不是指向 Derived 的指針
}
```
```cpp
#include <iostream>
using namespace std;
// 基本類別
class Base{
	virtual void printf();
};
// 衍生類別
class Derive : public Base{
	void printf(){
		cout<<"hello"<<endl; 
	}
};
int main()
{ 
	Base* a = 0;
	Derive* a1 = 0;
	
	// 将派生类的指针转换为基类的指针（安全的） 
	Base* test1 = dynamic_cast<Base*>(a1); 
	
	// 将基类的指针转换为派生类的指针（不安全的，如果产生了多态，则可以向下转换）
	Derive* test2 = dynamic_cast<Derive*>(a);  
	
	return 0;
}
```
#### typeid
* 用於取得一個表達式的型別資訊，返回一個 std::type_info 對象。它通常與 dynamic_cast 一起使用，用於比較兩個型別是否相同。
```cpp
if (typeid(*basePtr) == typeid(Derived)) {
    // basePtr 指向 Derived
} else {
    // basePtr 不是指向 Derived
}
```
### 常量轉換 Const Cast
* 將常量轉換用於將const類型的物件轉換為非const類型的物件
* 只能用於轉換const屬性，不能改變物件的類型
```cpp
const ini i = 10;
// 上面宣告了一個名為 i 的常數整數變數，並將其初始化為 10。這表示變數 i 的值不能在後續的程式中被修改。
int& r = const_cast<int&>(i);
// const_cast => 這是一個 const_cast 運算符的使用，它用於去除常數性質。在這裡，我們試圖去除 i 的常數性質，以便將其賦值給一個非常數的整數引用。
// int& r => 整數引用的宣告。我們想將一個非常數的引用指向 i，這需要透過 const_cast 來去除 i 的常數性質。
```
### 重新解釋轉換 Reinterpres Cast
* 不建議此種方法！
* 將一個指標或引用轉換為另一種不同型別的指標或引用，而不進行任何型別檢查或資料轉換
* 重新解釋轉換允許你將記憶體中的位元模式解釋為不同的型別，但不會進行實際的數值轉換。
* 重新解釋轉換是一個相當危險的操作，因為它會忽略型別之間的差異，可能導致未定義行為或不正確的結果。因此，應該謹慎使用重新解釋轉換，並僅在你非常確定該操作是安全且合理的情況下使用。
```cpp
int i = 10;
float f = reinterpret_cast<float&>(i);
```
#### 指標型的重新解釋轉換
```cpp
int num = 42;
double* ptr = reinterpret_cast<double*>(&num);
```
#### 引用的重新解釋轉換
```cpp
int num = 42;
double& ref = reinterpret_cast<double&>(num);
```

