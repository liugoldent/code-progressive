---
description: python 程式常用指令
tags:
  - Python
---

# [Python] Python 基礎

[python 面試-1](https://hackmd.io/@_FqBW8dGS8a5ZqhdMwvpuA/ByYoWaxfD)

## 在字串中塞入變數

```python
age = 34
shepherd = "Martha"
stuff_in_string = f"Shepherd {shepherd} is {age} years old."
print(stuff_in_string)
# Shepherd Martha is 34 years old.
```

## 特性：

1. 為解釋型語言，是邊運行邊解釋的
2. 動態類型，不需要聲明變量類型
3. 為一等對象，意味著可以在運行時動態創建，能賦值給變量或作為參數傳給函數，還能作為函數的返回值
4. 運行速度比編譯語言慢
5. 垃圾回收：回收計數引用為 0 的對象，釋放其佔用空間

## 實例化 class 的執行順序

1. 調用 type 類 -> 調用內置的 metaClass -> 調用*new*方法將類實例化
2. 實例會初始化自己的類變量
3. 進入構造方法*init*，並初始自己的實例變量

```py3
class MyClass:
    class_variable = "I am a class variable"  # 類變量

    def __init__(self, instance_variable):
        self.instance_variable = instance_variable  # 實例變量

    def method(self):
        print("This is a method")

# 創建類的實例
instance = MyClass("I am an instance variable")

# 訪問類變量
print(MyClass.class_variable)

# 訪問實例變量
print(instance.instance_variable)

# 調用方法
instance.method()
```

## 函數參數

### 位置(必選)參數：

- def foo(x, y)

### 默認參數：

- def foo(x, y=10)
- 默認參數(y)要放在必選參數(x)後面，且默認參數不要設為可變對象(可先用 None 代替)

### 可變參數(arguments)：

- def foo(x, y ,\*args)
- 可變參數允許函數接受任意數量的位置引數，這些引數會被打包成一個元組（Tuple）。
- 在函數定義中，使用星號（\*）來表示可變參數。
- 在函數調用時，可以傳遞任意數量的位置引數給可變參數，這些引數會被打包成一個元組，然後傳遞給函數。

```py3
def my_function(*args):
    for arg in args:
        print(arg)

my_function(1, 2, 3)  # 輸出：1 2 3
```

### 關鍵字參數(keyword arguments)：

- def foo(x, y ,\*\*kwargs)
- 關鍵字參數允許函數接受任意數量的關鍵字引數，這些引數會被打包成一個字典（Dictionary）。
- 在函數定義中，使用兩個星號（\*\*）來表示關鍵字參數。
- 在函數調用時，可以傳遞任意數量的關鍵字引數給關鍵字參數，這些引數會被打包成一個字典，然後傳遞給函數。

```py3
def my_function(**kwargs):
    for key, value in kwargs.items():
        print(key, value)

my_function(a=1, b=2, c=3)  # 輸出：a 1，b 2，c 3
```

### 命名關鍵字參數：

- def person(name, age, \*, city, job)
- 命名關鍵字參數需要一個特殊分隔符*，*後面的參數被視為命名關鍵字參數
- 命名關鍵字參數允許函數只接受特定名稱的關鍵字引數，並且不接受其他未定義的關鍵字引數。
- 在函數定義中，使用一個星號和一個後面帶有預設值的參數來表示命名關鍵字參數。
- 在函數調用時，必須使用關鍵字方式傳遞命名關鍵字參數，否則會引發錯誤。

```py3
def my_function(*, a=1, b=2):
    print(a, b)

my_function()           # 輸出：1 2
my_function(a=10)       # 輸出：10 2
my_function(b=20)       # 輸出：1 20
my_function(a=10, b=20) # 輸出：10 20
```

## lambda

- Lambda 表達式是 Python 中的一種匿名函數，它可以在不使用 def 定義函數的情況下創建小型的匿名函數。
  - lambda：關鍵字，表示創建一個 Lambda 函數。
  - arguments：函數的參數，可以有多個，但只能是單個表達式。
  - expression：函數的返回值，是一個表達式。

```py3
# 定義一個簡單的 Lambda 函數，將兩個數相加
add = lambda x, y: x + y
print(add(2, 3))  # 輸出：5

# 使用 Lambda 函數作為 sorted 函數的 key 參數，按照元組的第二個元素進行排序
pairs = [(1, 'one'), (3, 'three'), (2, 'two'), (4, 'four')]
sorted_pairs = sorted(pairs, key=lambda pair: pair[1])
print(sorted_pairs)  # 輸出：[(4, 'four'), (1, 'one'), (3, 'three'), (2, 'two')]

# 使用 Lambda 函數作為 map 函數的第一個參數，對列表中的每個元素進行平方操作
numbers = [1, 2, 3, 4, 5]
squared_numbers = list(map(lambda x: x**2, numbers))
print(squared_numbers)  # 輸出：[1, 4, 9, 16, 25]

```

## OOP，物件導向程式設計

### 三大特性：

### 封裝：

- 把相同類型的屬性和方法封裝到類中，這樣可以簡化編程，使用者也可以僅通過外部接口來調用，使程式容易模組化

### 繼承：

- 繼承就是子類繼承父類的特徵和行為，使得子類對象具有父類的實例和方法， 這樣可以減少重複性代碼，且彼此的耦合度會較低，靈活度也較高

### 多態：

- 不同的(子類)對象調用相同的(父類)方法，產生不同的結果，可以增加代碼的外部調用靈活度 簡單的說就是呼叫同名的方法時，會得到不同的結果

## mutable/immutable

### Immutable（不可變的）：

- 如果一個對象是不可變的，那麼它的內容在創建後是不能被修改的。
- 在 Python 中，一些常見的不可變對象包括整數（int）、浮點數（float）、字符串（str）、元組（tuple）等。
- 不可變對象的特點是，一旦它們被創建，就不能被修改。如果想要修改這些對象的值，必須創建一個新的對象。

### Mutable（可變的）：

- 如果一個對象是可變的，那麼它的內容在創建後是可以被修改的。
- 在 Python 中，一些常見的可變對象包括列表（list）、字典（dict）、集合（set）等。
- 可變對象的特點是，它們的內容可以被修改。這意味著我們可以向列表中添加或刪除元素，或者更改字典中的鍵值對。

## list vs array

### list

- 可以容納不同數據，但較慢也要耗費更多記憶體

### array

- 只能容納一種數據，較快也較省空間
  - 一開始就將陣列內部型態定義好，所以不會需要每次到底層做比對
  - array：直接儲存數據，非指針。而 list 要去遍歷所有指針，較快

## dict vs list

- 字典的查找速度比列表快很多，但也因此要耗費較大的內存
  - 原因：dict 和 set 都是由 hash 和散列表來實現的。 查找時會通過基層的演算法用 hash(key)進行匹對， 如果為空，表示沒有這個值。 如果不為空，且這個值的 key 為我們要找的，則成功並返回。 如果不為空，但這個值不是我們要的，那就繼續找這個 key 會存的下一個位置，直到找到我們要的值或為空為止。
- 字典和集合是無序的，列表是有序的
- 字典查找和插入的速度很快，且不會隨著 key 的增加而變慢；列表查找和插入時間會隨著元素的增加而增加

## tuple vs list

- 兩者最大的差異就在於元組是不可變的
- 元組佔用空間較少，也可以當作字典的 key 做使用，且具名元組可以理解為元組的增強版本，它為元組中的每個元素都賦予了含義，從而增強代碼可讀性

## json vs dict

- json 是一種輕量級的數據交換格式；dict 是 python 中的數據類型
- json 的字符串強制使用雙引號；dict 則是單、雙引號都可以
- json 的類型是字符串，只是是按照 key:value 鍵值對格式定義
- json 的 key 可以是有序、重複的；dict 的 key 不可以重複

## linked-list vs array

- 陣列使用一連串的記憶體位置，因此可以透過`array[index]`直接存取資料，但相對的，若要在陣列中加入或是刪除元素，則需要大量的資料搬移
- 鏈表的資料則散落在記憶體各處，加入或是刪除元素只需要改變 pointer 即可，但相對的，在資料的讀取上比較適合循序的使用，且無法直接取得特定順序的值

## 字符串格式化

- %在於使用時更為方便快速
- format 較為靈活與強大，可以做到格式限定符(比如:填充、對齊、精度等)

## 多線程

- Python 有一個多線程包 threading，可以使用多線程來加快你的代碼。但是 Python 有一個叫做 GIL(全局解釋器鎖 Global Interpreter Lock)的構造
- 它限制了 python 同一時間只能有一個線程執行，所以多線程們實際上只是輪流使用相同的 CPU 內核
  * 對於 IO 密集型操作：在等待操作系統返回時會釋放 GIL；再比如爬蟲因為有等待的服務器的響應時間，可以利用多線程來加速
  * 對於 CPU 密集型操作：只能通過多進程 Multiprocess 來加速

