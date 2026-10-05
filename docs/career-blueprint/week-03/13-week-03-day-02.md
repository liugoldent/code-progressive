---
sidebar_position: 2
sidebar_label: "Day 2"
slug: "/career-blueprint/week-03-day-02"
title: "第 3 週 Day 2：Longest Consecutive Sequence、Python 函式語意與 Load Balancer Health Check"
description: "140 分鐘日課：Longest Consecutive Sequence 前 30 分鐘獨立作答，再修正、測試與分析 Big-O；理解 Python args、kwargs、closure 與 mutable default；閉卷回想 React Effect 邊界；畫出 Load Balancer 與 health check。"
tags: [Career, Interview, NeetCode 150, Python, React, System Design]
keywords: ["Longest Consecutive Sequence", "Arrays and Hashing", "Two Pointers", "Python args", "Python kwargs", "Python closure", "mutable default", "React effect", "Load Balancer", "health check", "水平擴展", "負載平衡"]
---

# 第 3 週 Day 2：Longest Consecutive Sequence、Python 函式語意與 Health Check

> 安排日期：2026-09-22；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing III／Two Pointers  
> 本週 System Design 主題：水平擴展與負載平衡

接續 [第 3 週 Day 1](/docs/career-blueprint/week-03-day-01)。今天的演算法前 30 分鐘只保留題目、函式簽名與自己的測資；看提示或答案後，即使修好也要標記為「待閉卷重寫」，不能算獨立完成。

作答方式：知識題標示單選，先選再展開解析；進度題依事實勾選，沒有標準答案；「尚未完成／無需補課」不可與互相矛盾的完成項同時勾選。Markdown 勾選不代表網站會自動保存；程式、測試、圖與口述仍需留下自己的可驗證證據。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：Longest Consecutive Sequence 前 30 分鐘獨立讀題、推導與實作；其餘時間才看提示、修正、測試與寫 Big-O。看過答案不算完成。
- [ ] **Python 次主線｜45 分鐘**：能解釋並實作 `*args`、`**kwargs`、closure 與 mutable default，說出各自的資料流與常見錯誤。
- [ ] **React 回想｜15 分鐘**：不看稿講出昨天 effect／event／derived data／cleanup 的心智模型，並說明一個真實 trade-off。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：畫 Load Balancer 與 health check；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。未完成項放進週末補課，不推遲下一個工作日主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Longest Consecutive Sequence | 第一次版本、提示層級、測資、Big-O 與卡點 |
| 21:30–22:15 | Python 函式語意 | 四個小實驗、預測結果與修正版 |
| 22:15–22:30 | React 閉卷回想 | 90 秒心智模型與一個 trade-off |
| 22:30–22:50 | Load Balancer＋health check | 小圖／三個數字／failure case／口述至少一項 |

---

## Part 1｜NeetCode 150：Longest Consecutive Sequence（60 分鐘）

完整 TypeScript＋Python 三階段題解放在 LeetCode 專區：

**[開始 LeetCode 128｜Longest Consecutive Sequence 練習](/docs/algorithms/leetcode/f0101-0200/l0128-longest-consecutive-sequence)**

前 30 分鐘只讀該頁 Stage A，不展開提示、不往下看 Stage B，也不搜尋題名。若以前看過解答，今天仍要關閉答案從空白重寫；只有能自行推導、實作、測試與解釋成本，才算完成。

### 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 必須留下的內容 |
| ---: | --- | --- |
| 0–5 | 讀題與確認契約 | 一句話 Input／Output；釐清 sequence 不是 subarray |
| 5–10 | 手算測資 | 官方範例＋至少 4 組自訂 edge cases |
| 10–15 | 寫第一個正確直覺 | 說明為何不漏解，先估 Big-O |
| 15–20 | 找重複工作 | 指出哪些數值可能被反覆走訪 |
| 20–30 | 閉卷實作 | TypeScript 或 Python 第一版，不看提示 |
| 30–38 | 必要時依序看提示 | 只看足以解除卡點的最小提示並記錄層級 |
| 38–48 | 修正與補另一語言 | 保留第一次版本，不用答案覆蓋證據 |
| 48–55 | 執行測試 | 官方 3 組＋自訂至少 5 組 |
| 55–60 | Big-O 與口述 | 定義 `n`、`u`、平均雜湊前提與 invariant |

### 1. 前 30 分鐘：先確認題目契約

**單選｜這題要求的「連續」是哪一種？**

- [ ] A. 原陣列中索引相鄰，而且順序不可改變。
- [ ] B. 整數值每次相差 1；它們在原陣列中的位置和順序不重要。
- [ ] C. 任意兩個值的差都小於陣列長度。

<details>
<summary>第 30 分鐘後再看答案與解析</summary>

**答案：B。** 例如 `[100, 4, 200, 1, 3, 2]` 的最長序列是值 `1, 2, 3, 4`，雖然它們在輸入中沒有排在一起。題目回傳長度，不要求回傳原陣列的一段。

</details>

**單選｜重複值如何影響答案？**

- [ ] A. 每次重複都讓長度加一。
- [ ] B. 重複值不延長不同整數形成的連續序列。
- [ ] C. 輸入只要重複就無效。

<details>
<summary>第 30 分鐘後再看答案與解析</summary>

**答案：B。** `[1, 2, 2, 3]` 的答案是 3，不是 4。這也是測資必須涵蓋的情況。

</details>

### 2. 先手算測資，不先找資料結構

| 輸入 | 預期 | 驗證目的 |
| --- | ---: | --- |
| `[100, 4, 200, 1, 3, 2]` | `4` | 順序打亂、存在多段 |
| `[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]` | `9` | 重複值不延長序列 |
| `[1, 0, 1, 2]` | `3` | 重複出現在序列中 |
| `[]` | `0` | 空輸入 |
| `[7, 7, 7]` | `1` | 全部重複 |
| `[-3, -2, -1, 1]` | `3` | 負數與斷點 |
| `[10]` | `1` | 單一值 |
| `[5, 4, 3, 2, 1]` | `5` | 反向排列不影響答案 |

在 coding 前先寫：

```txt
第一個正確方法：
它為什麼不漏掉任何序列：
它可能重複做的工作：
我預估的時間／額外空間：
```

### 3. 第一次閉卷實作

先選一種語言完成；不要同時在兩個空白模板間來回切換。

#### TypeScript

```ts
function longestConsecutive(nums: number[]): number {
  throw new Error('先完成自己的版本');
}
```

#### Python

```python
def longest_consecutive(nums: list[int]) -> int:
    raise NotImplementedError('先完成自己的版本')
```

```txt
30 分鐘時的狀態（未完成／可執行／測試通過）：
第一次版本的實際 Big-O：
失敗測資：
卡點：
```

### 4. 第 30 分鐘後：只取需要的提示

按順序一次展開一層；看到足夠資訊就停止。

<details>
<summary>提示一：先找重複工作</summary>

若從序列中每一個值都向後尋找，長序列會被重走很多次。想一想：哪些值才有資格代表一段序列的開始？

</details>

<details>
<summary>提示二：如何用 O(1) 平均成本查相鄰值</summary>

先把不同數值放入能做平均 O(1) membership check 的容器。對某個值 `x`，若前一個值不存在，`x` 才可能是一段序列的起點。

</details>

<details>
<summary>提示三：Invariant 與計數方式</summary>

只從「沒有前驅」的值向後展開。展開期間目前長度代表從該起點開始，已確認連續存在的不同整數數量；每個不同整數只會落在唯一一段由起點開始的展開中。

</details>

<details>
<summary>修正後才核對：最低解法骨架</summary>

```txt
values = 輸入中所有不同數字
best = 0

for value in values:
    if value - 1 不在 values:
        從 value 向後數 value + 1、value + 2……
        用這一段長度更新 best

return best
```

關鍵不是只有「用了 Set」，而是**只從沒有前驅的起點展開**。若對原陣列的每個重複起點都展開，仍可能反覆走同一長段。

</details>

### 5. Big-O：說清楚線性成本從哪裡來

令 `n` 為輸入長度，`u` 為不同數字數量，且一般雜湊 membership／insert 平均為 `O(1)`：

- 建立集合平均 `O(n)`。
- 外層看每個不同值，共 `O(u)`。
- 只有沒有前驅的值會啟動展開；所有展開合計最多走過 `u` 個不同值，不是每輪都走 `u` 次。
- 因此平均時間 `O(n)`，額外空間 `O(u)`，最差可寫成 `O(n)`。
- 若排序，常見成本是 `O(n log n)`；若原地排序還會修改輸入，本頁練習約定不修改輸入。

**單選｜為何巢狀 while 不代表這份解法一定是 O(n²)？**

- [ ] A. while 在 JavaScript／Python 都是 O(1)。
- [ ] B. 只看語法層數就能忽略內層成本。
- [ ] C. 需看所有內層迭代的總和；只從每段起點展開時，每個不同值只屬於一次完整展開。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** Big-O 要數總工作量。若拿掉起點判斷，才可能從同一長段中的許多值重複向後掃描，形成平方級工作。

</details>

### 6. 今日演算法驗收

- [ ] 前 30 分鐘沒有看提示、Stage B、搜尋結果或既有答案。
- [ ] 先留下第一個正確方法與成本，再進行最佳化。
- [ ] 能解釋 sequence 與 subarray 的差別，以及重複值的行為。
- [ ] 至少一種語言從空白實作，另一種已完成或排入補課。
- [ ] 官方 3 組與自訂至少 5 組測資已實際執行。
- [ ] 能由重複展開推導「只有起點才展開」，不只背 `Set`。
- [ ] 能說明平均 `O(n)` 的加總理由、雜湊前提與 `O(u)` 空間。
- [ ] 若看過提示／答案，已標記待閉卷重寫，沒有把「修好」算成獨立完成。

---

## Part 2｜Python 次主線：args、kwargs、closure、mutable default（45 分鐘）

### 今日目標與節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–10 | `*args`／`**kwargs` | 預測型別、呼叫方式與錯誤情況 |
| 10–22 | unpacking 與明確 API | 寫一個轉交參數的小函式，說出取捨 |
| 22–34 | closure | 畫出保留的 lexical state，測 `nonlocal` 與 late binding |
| 34–42 | mutable default | 重現共享狀態 bug，改成 `None` sentinel |
| 42–45 | 閉卷口述 | 四個概念各用一句話＋一個陷阱 |

### 1. `*args`：把額外 positional arguments 收成 tuple

```python
def total(*numbers: float) -> float:
    return sum(numbers)


assert total() == 0
assert total(1, 2, 3) == 6
```

函式定義中的 `*numbers` 會把尚未被其他參數接走的 positional arguments 收成一個 tuple；名稱慣例是 `args`，但星號才是語法。型別 `float` 描述每個元素，不是整個 tuple。

例如 `def introduce(name, *hobbies)` 收到 `introduce('Amy', 'swim', 'code')` 時，`name == 'Amy'`，剩餘的 `hobbies == ('swim', 'code')`。是否進入 `args` 是看「有沒有用名稱傳入」，不是看值的型別。

呼叫端的 `*` 則是 unpacking：

```python
values = [10, 20, 30]
assert total(*values) == 60  # 等同 total(10, 20, 30)
```

兩者要分開讀：定義端是「收集」，呼叫端是「展開」。

```text
def total(*numbers)  ：total(1, 2, 3) → numbers == (1, 2, 3)
total(*values)       ：[1, 2, 3] → total(1, 2, 3)
```

### 2. `**kwargs`：把額外 keyword arguments 收成 dict

```python
def build_label(symbol: str, **metadata: str) -> str:
    venue = metadata.get('venue', 'unknown')
    currency = metadata.get('currency', 'USD')
    return f'{symbol}@{venue}/{currency}'


assert build_label('BTC', venue='Binance', currency='USDT') == 'BTC@Binance/USDT'
```

定義中的 `**metadata` 收集額外 keyword arguments，得到 `dict[str, str]`；呼叫端 `**mapping` 則把 mapping 展開為具名參數：

```python
options = {'venue': 'TWSE', 'currency': 'TWD'}
assert build_label('2330', **options) == '2330@TWSE/TWD'
```

上面的呼叫等同 `build_label('2330', venue='TWSE', currency='TWD')`。已由明確參數 `symbol` 接走的值不會再放進 `metadata`；只有剩餘的具名參數會被收集。

**單選｜以下 `inspect(1, 2, mode='fast')` 中，`args` 與 `kwargs` 是什麼？**

```python
def inspect(*args: object, **kwargs: object) -> None:
    print(args, kwargs)
```

- [ ] A. `args == [1, 2]`，`kwargs == ('mode', 'fast')`
- [ ] B. `args == (1, 2)`，`kwargs == {'mode': 'fast'}`
- [ ] C. 兩者都是 set。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** `args` 是 tuple，`kwargs` 是 dict。它們不會自動驗證業務上允許哪些參數。

</details>

### 3. 彈性與可理解性的 trade-off

`*args`、`**kwargs` 適合 decorator、adapter 或將參數轉交給另一層，但不應把明確的業務 API 全藏起來：

```python
# 呼叫契約不清楚，拼錯也可能拖到更深處才失敗
def create_order(**kwargs: object) -> None:
    ...


# 必要欄位與 keyword-only 選項一眼可見
def create_order(
    symbol: str,
    quantity: int,
    *,
    dry_run: bool = False,
) -> None:
    ...
```

`*` 單獨出現在參數列表時，表示後面的參數必須用 keyword 傳入；它不是 `*args`。明確簽名能讓 IDE、型別檢查與 code review 更早抓到問題。

這裡的取捨是「彈性」對「呼叫契約清楚」：`**kwargs` 可以接受很多未知選項，但只看簽名無法知道哪些欄位必填，也可能讓 `qunatity` 之類的拼字錯誤延後才爆炸。業務函式通常明列參數；只負責包裝、記錄或轉交呼叫的函式，才特別適合 `*args`／`**kwargs`。

今日小實作：寫一個計時 wrapper，把任意參數轉交給原函式，並保留回傳值。

```python
from collections.abc import Callable
from typing import Any


def call_and_log(function: Callable[..., Any], *args: Any, **kwargs: Any) -> Any:
    print(f'calling {function.__name__}')
    return function(*args, **kwargs)
```

進階正式版本可用 `ParamSpec` 與 `TypeVar` 保留精確簽名；今天先確認參數流向，不把 `Any` 誤解成 runtime validation。

### 4. Closure：函式連同它建立時可見的 lexical state

內層函式即使在外層函式已回傳後，仍可讀取外層作用域中的名稱：

```python
from collections.abc import Callable


def make_multiplier(factor: int) -> Callable[[int], int]:
    def multiply(value: int) -> int:
        return value * factor

    return multiply


double = make_multiplier(2)
triple = make_multiplier(3)

assert double(5) == 10
assert triple(5) == 15
```

`double` 與 `triple` 共用同一段函式程式碼，但各自保留不同環境中的 `factor`。Closure 捕捉的是名稱與其環境，不是保證在建立當下把所有值複製成快照。

若要重新綁定外層變數，使用 `nonlocal`：

```python
def make_counter() -> Callable[[], int]:
    count = 0

    def increment() -> int:
        nonlocal count
        count += 1
        return count

    return increment


counter = make_counter()
assert counter() == 1
assert counter() == 2
```

這份 state 是隱藏且可變的；方便封裝小型行為，但大型共享狀態若藏在 closure 中，測試、重設、序列化與跨 process 共享都會變難。

### 5. Closure 的 late binding 陷阱

先預測：

```python
functions = []
for number in range(3):
    functions.append(lambda: number)

result = [function() for function in functions]
```

<details>
<summary>先預測 result，再看解析</summary>

結果是 `[2, 2, 2]`。三個 lambda 執行時才查找同一個 `number`；迴圈結束時它是 2。若需求是保存每輪當下的值，可用 default argument 在函式建立時綁定：

```text
建立 lambda 時：三個函式都記住「之後去找 number」
迴圈結束後：   number == 2
呼叫 lambda 時：三個函式查到的都是 2
```

```python
functions = []
for number in range(3):
    functions.append(lambda number=number: number)

assert [function() for function in functions] == [0, 1, 2]
```

`lambda number=number: number` 左邊是 lambda 自己的參數，右邊是當輪外部變數；右邊會在建立 lambda 時求值，因此三個函式分別保存 `0`、`1`、`2`。

這和 JavaScript 的 `var` closure 陷阱相同：多個函式會讀取同一個外部 binding。JavaScript 的 `for (let number = ...)` 會替每輪建立新 binding，所以能得到 `[0, 1, 2]`；Python 的 `for` 沒有這項 `let` 行為，才常用 default argument 或額外的 factory function 保存當輪值。

這裡利用 default argument 的「定義時求值」保存不可變整數，正好也連到下一節的 mutable default 風險。

</details>

### 6. Mutable default：default expression 只在定義函式時求值一次

以下不是每次呼叫都建立新 list：

```python
def append_tag(tag: str, tags: list[str] = []) -> list[str]:
    tags.append(tag)
    return tags


first = append_tag('python')
second = append_tag('react')

assert first is second
assert second == ['python', 'react']
```

default list 在函式定義時建立，之後未傳 `tags` 的呼叫共用同一個物件。一般「每次呼叫要全新容器」的需求應使用 sentinel：

這和上一節其實是同一條規則，差別只在保存的值：`number=number` 保存不可變整數，適合固定每輪快照；`tags=[]` 保存可被修改的 list，後續呼叫就會看見先前留下的內容。

#### 這不是 `nonlocal`：共享的是物件，不是區域變數名稱

每次呼叫時，參數名稱 `tags` 仍然是該次呼叫的區域變數。怪異之處不在作用域，而是呼叫者沒傳入 `tags` 時，每次的區域名稱都會指向函式物件保存的同一個預設 list：

```python
assert append_tag.__defaults__ is not None
assert append_tag.__defaults__[0] is first
```

可以把函式定義想成以下概念模型：

```python
default_tags = []  # 執行到 def 時建立一次


def append_tag(tag: str, tags=default_tags) -> list[str]:
    tags.append(tag)
    return tags
```

因此，要分清楚「重新綁定區域名稱」與「修改名稱指向的物件」：

```python
def rebind(items: list[str] = []) -> list[str]:
    items = ['new']       # 區域名稱改指向新 list，不修改預設 list
    return items


def mutate(items: list[str] = []) -> list[str]:
    items.append('new')   # 原地修改函式保存的預設 list
    return items
```

真正的 `nonlocal` 則是內層函式使用外層函式作用域的 binding；mutable default 不需要從外層作用域查找 `tags`，兩者機制不同。

#### 為什麼 Python 會這樣設計？

Python 採用一條一致規則：執行 `def`、建立函式物件時，就求出所有 default expressions，並把結果保存在函式物件上；呼叫時若缺少引數，直接取出已保存的值，而不是重新執行 expression。

```python
default_name = 'Alice'


def greet(name: str = default_name) -> str:
    return f'Hello, {name}'


default_name = 'Bob'
assert greet() == 'Hello, Alice'
```

這項設計讓預設值能固定函式定義當下的值，規則也和上一節用 `number=number` 捕捉迴圈當下數值完全一致。`tags=[]` 會共享並不是 list 的特殊規則，而是同一條「定義時求值」規則碰上可變物件後產生的結果。

所以更準確的心智模型是：**default argument 不是每次呼叫時執行的初始化程式碼，而是建立函式時附加在函式物件上的備用值。**這個模型一致且偶爾有用，但對可變物件非常容易造成隱藏狀態，因此一般程式碼仍應避開 mutable default。

```python
def append_tag(tag: str, tags: list[str] | None = None) -> list[str]:
    if tags is None:
        tags = []

    tags.append(tag)
    return tags
```

不要偷改成 `tags = tags or []` 當通用修正，因為呼叫者刻意傳入空 list 時也會被替換，語意不同。`None` 能明確區分「沒提供」與「提供一個目前為空的容器」。

Mutable default 並非語法錯誤；若刻意要跨呼叫 cache，確實可利用共享物件。但這種隱藏狀態不直觀，也有併發、測試隔離與記憶體成長風險，通常應改用明確 cache 工具或物件。

### 7. Python 今日驗收

- [ ] 能說出定義端 `*args`／`**kwargs` 是收集，呼叫端 `*`／`**` 是展開。
- [ ] 能預測 `args` 是 tuple、`kwargs` 是 dict，並寫出一組測試。
- [ ] 能說明彈性簽名與明確參數契約的 trade-off。
- [ ] 能畫出 closure 保留的外層名稱，並用 `nonlocal` 完成 counter。
- [ ] 能重現 late binding，解釋為何三個 lambda 讀到同一個最終值。
- [ ] 能重現 mutable default 的共享 list，使用 `None` sentinel 修正。
- [ ] 能說明 `tags is None` 與 `tags or []` 對空容器的語意差異。

### Python 一分鐘複習卡

| 問題 | 一句答案 |
| --- | --- |
| `*args` 得到什麼？ | 額外 positional arguments 組成的 tuple |
| `**kwargs` 得到什麼？ | 額外 keyword arguments 組成的 dict |
| 何時別濫用 kwargs？ | 業務契約本來明確、需要 IDE 與型別檢查提早報錯時 |
| Closure 保留什麼？ | 內層函式連同建立時可見的 lexical environment |
| `nonlocal` 做什麼？ | 允許內層函式重新綁定最近一層外部函式作用域的名稱 |
| Mutable default 為何共享？ | default expression 在函式定義時只求值一次 |
| 常見修正？ | 以 `None` 表示未提供，再於函式內建立新容器 |

---

## Part 3｜React 回想：effect、event、derived data 與 cleanup（15 分鐘）

今天不讀新 React 主題。先關閉 [昨天的 React Effect 邊界筆記](/docs/career-blueprint/week-03-day-01)，用 90 秒說出心智模型，再打開核對。卡住時先記錄缺口，不邊看邊念。

### 1. 閉卷 90 秒口述

回答四個問題：

1. 能由目前 props／state 算出的資料應放哪裡？
2. 因特定 click／submit 才執行的工作應放哪裡？
3. Effect 解決的同步問題是什麼？
4. Dependency 改變與 unmount 時，cleanup 的順序是什麼？

```txt
我的 90 秒版本：
中斷的位置：
用了哪個真實例子：
```

### 2. 一個 trade-off：手寫 Effect 請求 vs data layer

閉卷先說兩邊各一個優點與成本：

| 選擇 | 適合情境 | 成本／風險 |
| --- | --- | --- |
| 手寫 Effect＋fetch | 小型 client-only 同步、行為簡單、需要直接控制 cleanup | 要自行處理競態、abort、cache、dedupe、loading／error 與重新驗證 |
| Framework loader／query library | 多頁共用 server state、需要 cache、dedupe、SSR 或一致重試策略 | 增加抽象、設定與套件心智負擔，不代表不必理解請求生命週期 |

面試不要回答「Effect 不好」或「一律用 library」。先說資料種類、生命週期、競態與快取需求，再做選擇。

### 3. 快速情境分類

先不看答案，把下列工作分成 render／event／effect：

| 情境 | 我的分類 |
| --- | --- |
| 由 `firstName`、`lastName` 顯示 `fullName` | |
| 使用者按 Buy 後送出購買請求 | |
| `roomId` 改變時切換 WebSocket 訂閱 | |
| 依 `products` 與 `query` 顯示篩選結果 | |
| 元件顯示期間監聽 `window.resize` | |

<details>
<summary>分類後再看解析</summary>

- `fullName`、篩選結果：render 時計算的 derived data。
- 購買請求：因這次 click 發生，放 event handler。
- WebSocket 與 resize listener：元件顯示期間同步外部系統，放 Effect，並回傳對稱 cleanup。

</details>

### 4. React 今日驗收

- [ ] 完全不看稿講滿 90 秒，包含 derived data、event、effect 與 cleanup。
- [ ] 能說出 dependency change 時先清舊 setup，再建立新 setup。
- [ ] 使用一個真實例子，不只背名詞。
- [ ] 能比較手寫 Effect 與 data layer 的一個 trade-off。
- [ ] 若無法完成，已記錄中斷點並排入週末補課。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：畫 Load Balancer 與 health check

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 畫 request path | Client、LB、三台 app server、依賴與 health check |
| 5–10 | 定義健康條件 | interval、timeout、閾值、readiness 與 drain |
| 10–15 | 算三個數字 | 正常、尖峰、失去一台後的利用率 |
| 15–20 | failure case／口述 | 至少完成其中一項自己的產出 |

### 1. 一張小圖：流量路徑與控制路徑分開

先自己畫，再對照：

```txt
                         health probes
                    ┌ - - - - - - - - - ┐
                    v          v          v
Clients ──DNS──> Load Balancer
                    │          │          │
                    v          v          v
                 App A      App B      App C
                    │          │          │
                    └──────────┼──────────┘
                               v
                         DB / Cache / Queue

request path: Client → LB → healthy, ready App
control path: LB → health endpoint → eligibility state
```

Load Balancer 不只是 round-robin。它保存哪些 backend 目前有資格接新流量，依演算法選節點，並在節點部署、過載或故障時調整 pool。若應用把 session 只放單機記憶體，隨機分流可能造成登入或購物車消失；優先把 session 放共享儲存或設計無狀態服務，sticky session 是有成本的取捨，不是 health check 的替代品。

### 2. Health check 要回答「能不能接新請求」

| 機制 | 問題 | 例子 |
| --- | --- | --- |
| Passive check | 真實流量最近是否持續失敗？ | 連線錯誤、timeout、5xx 比率 |
| Active check | LB 主動探測是否成功？ | 每 5 秒呼叫 `/ready`，1 秒 timeout |
| Liveness | process 是否卡死、需不需要重啟？ | event loop／worker 還能回應 |
| Readiness | 此刻能否安全接新流量？ | 啟動完成、必要資源可用、尚未進入 drain |

不要讓 health endpoint 永遠回固定 `200`；也不要把每個非必要下游都設成硬依賴。若推薦服務壞掉但核心下單仍可降級，readiness 不應因此把全部 app server 同時移除。健康定義要反映服務真正能否處理核心請求。

一組練習設定，不是通用標準：

```txt
interval = 5 秒
timeout = 1 秒
連續 3 次失敗 → unhealthy，停止送新流量
連續 2 次成功 → healthy，重新加入
部署終止流程 → 先標成 not ready，再 drain 既有請求
```

失敗與恢復使用不同閾值可減少 flapping；但較高閾值也會延後真正故障的移除。要依請求時間、錯誤預算與誤判成本調整，而不是背固定數字。

**單選｜服務準備滾動部署，較安全的停止順序是哪個？**

- [ ] A. 先 kill process，再等 LB 發現連線失敗。
- [ ] B. 先把 readiness 設為 false，等待 LB 停送新流量並 drain，再終止 process。
- [ ] C. 只關閉 health check，繼續送流量。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 先退出可分流集合，讓新請求去其他節點，並給既有 in-flight requests 一段完成時間。仍需設定最大 grace period，避免永遠等不到關閉。

</details>

### 3. 三個數字：故障後仍要算容量

假設尖峰為 **1,800 requests/s**，三台 app server 每台安全容量為 **800 requests/s**：

- 正常總安全容量：`3 × 800 = 2,400 requests/s`。
- 正常尖峰利用率：`1,800 ÷ 2,400 = 75%`。
- 失去一台後容量：`2 × 800 = 1,600 requests/s`，需求仍為 1,800，因此達 **112.5%**，不能只靠 LB 把問題分散掉。

這三個數字顯示「有三台」不等於「可容忍壞一台」。若目標是在失去一台後仍守住每台 800 的安全容量，至少要四台：`1,800 ÷ (4 - 1) = 600 requests/s`，故障後每台 75%。實際設計還要用壓測得到容量，並保留 autoscaling 啟動時間、流量不均、長連線與下游瓶頸的餘裕。

請換一組自己的數字重算：

```txt
尖峰需求：
節點數／每台安全容量：
正常利用率：
失去一台後利用率：
是否仍符合安全容量，理由：
```

### 4. 一個 Failure Case：下游變慢造成全體 health check 失敗

先看這個架構的關鍵：三台 app 看似是三個備援節點，背後卻共用同一個 DB。因此，DB 變慢是**共同故障**，把流量從 App A 移到 App B 並不會避開問題。

```txt
                         ┌── App A ──┐
Client ──> LB ───────────┼── App B ──┼──> 同一個 DB
                         └── App C ──┘       ↑ 變慢

LB 每 5 秒呼叫各 app 的 /ready
/ready 又同步查詢同一個 DB
```

事故會依照以下順序發生：

1. **DB 短暫變慢。** App process 本身還活著，靜態內容與 cache hit 也仍能回應；只有需要查 DB 的請求變慢或失敗。
2. **三台 `/ready` 同時查 DB。** 因為共用的 DB 回應太慢，三台 health probe 都超過 timeout。這不代表三台 app 同時當機，而是三次探測都卡在同一個下游。
3. **LB 摘除三台 app。** 若連續失敗次數達門檻，LB 會把 A、B、C 都標成 unhealthy。此時已沒有「另一台健康機器」可接手，backend pool 直接變空。
4. **原本還能成功的請求也失敗。** 靜態內容、cache hit 或可降級的讀取，本來不一定需要 DB，現在卻因為 LB 不再送流量而一起中斷。health check 反而擴大了故障範圍。
5. **恢復時出現第二波尖峰。** DB 剛恢復，probe、使用者重試與排隊中的請求可能同時湧入；若沒有退避與限流，DB 會再次過載，形成 retry storm。

真正的問題不是「health check 不該檢查 DB」，而是 `/ready` 把「DB 查詢暫時變慢」直接等同於「整台 app 完全不能服務」。健康條件太粗，無法區分以下三種狀態：

| 狀態 | 應有的判斷 |
| --- | --- |
| App process 卡死，連基本請求都無法處理 | liveness 失敗；可能需要重啟 process |
| 完成核心操作所必需的依賴不可用 | readiness 失敗；暫停送入無法安全處理的新流量 |
| 非必要功能故障，或仍可用 cache／唯讀模式服務 | 保持 ready，但將受影響功能降級並明確標示 |

排查時先確認這是「app 故障」還是「共同下游故障」：

- 看 healthy backend 是否在同一時間全部下降，以及每次 probe 的失敗原因。
- 對照真實流量的 5xx、timeout 與各 endpoint 成功率，不要只看 `/ready` 的 200／500。
- 查看 DB latency、DB connection pool 等待時間與 timeout 數量；若三台 app 同時出現相同依賴錯誤，通常不是三台主機各自故障。

改善分成兩個時間尺度：

| 時間 | 動作 |
| --- | --- |
| 事故當下 | 限制瀏覽器與伺服器的重試次數，而且每次隔更久、加入隨機等待，避免大家同時重試。限制 App 可占用的 DB 連線數；可接受舊資料的讀取暫時使用快取，付款等不能安全完成的操作則立即回報失敗，不要一直等待。 |
| 恢復期間 | 不要讓所有 App 瞬間接回全部流量。先讓一台 App 重新取得 LB 的分流資格並接少量請求；確認 DB 回應時間、錯誤率及最舊排隊請求的等待時間正常後，再逐台、逐步增加流量。 |
| 長期設計 | 存活檢查只確認 App process 能否正常運作；接流量檢查才判斷核心依賴是否可用。每次探測要有自己的等待上限，也要規定失敗幾次才移除、成功幾次才恢復，並錯開各台 App 的探測時間。 |
| 驗收方式 | 在測試環境刻意讓 DB 回應變慢，確認不需要 DB 的功能仍可用、需要 DB 的功能會按照設計停止或降級，並量測仍可接流量的 App 數量、錯誤率與整體恢復時間。 |

上表名詞的白話意思：

| 名詞 | 白話解釋 |
| --- | --- |
| client | 發出請求的一端，例如使用者的瀏覽器、手機 App，或另一個服務。 |
| server | 接收並處理請求的伺服器；此處主要指 app server。 |
| retry | 一次請求失敗後再試一次。若沒有次數與速度限制，重試本身可能造成更多負載。 |
| exponential backoff | 每失敗一次就等待更久再重試，例如依序等待 1、2、4、8 秒，而不是每秒一直重試。 |
| jitter | 在等待時間中加入隨機差異，例如原本都等 4 秒，改成各自等 3～5 秒，避免大量 client 同一秒再次送出請求。 |
| DB connection pool | App 預先維護、重複使用的一組 DB 連線。若允許無限制建立或占住連線，DB 變慢時更容易被塞滿。 |
| cache | 暫存的資料副本，讀取通常比重新查 DB 快，但內容可能不是最新的。 |
| stale data | 已經不是最新、但可能仍可暫時使用的舊資料。畫面必須標明資料時間，且不能用在要求即時正確的操作。 |
| node／app | 一台正在執行應用程式、可以接收請求的服務實例；本例中的 App A、B、C 各是一個 node。 |
| backend pool | LB 目前認為「可以接收新流量」的 app 清單。把 app 加回 pool，就是讓它重新取得 LB 的分流資格，不一定代表重新啟動程式。 |
| DB latency | App 發出 DB 請求到收到回應所花的時間。數值升高代表 DB 回應變慢，但不一定已經回傳錯誤。 |
| queue age | 排隊中最舊工作已等待多久。即使 queue 長度不再增加，queue age 很高仍表示使用者等了很久。 |
| liveness | 「程式還活著嗎？」若失敗，通常代表 process 卡死或無法運作，平台可能需要重啟它。 |
| readiness | 「現在適合接收新的使用者請求嗎？」失敗時先從 LB 的 backend pool 移除，不一定要重啟。 |
| probe | 系統定期送出的健康探測請求，例如 LB 每 5 秒呼叫一次 `/ready`。 |
| timeout | 最多願意等待多久；超過時間仍未得到結果，就把這次操作視為失敗。 |
| 失敗／恢復閾值 | 連續失敗幾次才判定 unhealthy，以及連續成功幾次才重新判定 healthy。它可避免一次短暫延遲就反覆移除、加入節點。 |
| 注入 DB 延遲 | 在測試環境刻意讓 DB 回應變慢，用來驗證系統遇到真實事故時是否會按照設計降級與恢復。 |
| healthy host 數 | LB 目前認為健康、可以接收新流量的 app 數量。 |

最後仍要決定 backend pool 變空時的策略：

- **Fail-closed（保守關閉）：** backend pool 沒有健康節點時，LB 停止轉送請求。適合付款、建立訂單等「不確定就不能執行」的操作；代價是某台 App 即使仍能處理部分請求，也收不到流量。
- **Fail-open／last resort（最後手段仍嘗試）：** backend pool 變空時，LB 仍挑選最近曾經健康的 App 試著轉送。這可能讓快取中找得到資料的讀取繼續成功；代價是 App 若真的完全故障，請求仍會被送過去並失敗，甚至增加系統負擔。

這裡的 **cache hit** 是「要找的資料剛好存在快取中，不必查 DB」；**唯讀請求**只取得資料、不修改資料。相對地，付款與建立訂單屬於**寫入請求**，會改變系統狀態，通常更重視一致性，也就是不能出現重複扣款、少寫一筆或各處結果互相矛盾。

因此不能替整個服務只選一個答案。較安全的做法是依操作分類：可接受短暫舊資料的讀取可以降級；付款或需要一致性的寫入則應 fail-closed，不能因 health check 設計方便而混在同一策略裡。

### 5. 3 分鐘口述骨架

```txt
0:00–0:40  Client → LB → healthy App 的 request path
0:40–1:20  active／passive、liveness／readiness 與 drain
1:20–2:05  三個容量數字與失去一台後的結果
2:05–3:00  DB 變慢造成全體摘除：偵測、恢復與 trade-off
```

### 6. System Design 今日驗收

- [ ] 已自己畫 Client、LB、三台 app、必要依賴與 health probe。
- [ ] 能區分 request path 與 health check control path。
- [ ] 能區分 active／passive check 與 liveness／readiness。
- [ ] 能說明連續成功／失敗閾值與 flapping／偵測延遲的 trade-off。
- [ ] 已自行計算正常與失去一台後的利用率，且標明單位與假設。
- [ ] 能解釋 DB 變慢為何可能讓所有節點同時被移除。
- [ ] 已完成一張小圖／三個數字／一個 failure case／3 分鐘口述至少一項。
- [ ] 尚未主動產出，需補課（不可與上一項同時勾選）。

---

## 今日結束打卡

下列各組依實際情況單選；看過解析不等於自己已完成。

**Longest Consecutive Sequence（依實際情況單選）**

- [ ] 尚未完成 30 分鐘獨立嘗試。
- [ ] 已獨立嘗試；看提示／答案後修好，待閉卷重寫。
- [ ] 未看提示閉卷完成、跑過測資，能推導 Big-O。

**Python 次主線（依實際情況單選）**

- [ ] 尚未完成。
- [ ] 看得懂範例，但還不能預測共享狀態或自行修正。
- [ ] 已完成四個小實驗，能說出各自用途、資料流與陷阱。

**React 回想（依實際情況單選）**

- [ ] 尚未完成。
- [ ] 需要看稿才能解釋。
- [ ] 已閉卷講出心智模型與一個 trade-off。

**System Design（依實際情況單選）**

- [ ] 尚未閱讀或完成圖解。
- [ ] 已閱讀，尚未主動產出。
- [ ] 已完成至少一項自己的產出。

**今天最重要的卡點（最多選三項）**

- [ ] 把連續序列誤認為連續子陣列。
- [ ] 知道使用 Set，但說不出為何只從起點展開。
- [ ] 寫出解法，但無法說明所有 while 迭代的總成本。
- [ ] 混淆定義端收集與呼叫端 unpacking。
- [ ] 不清楚 closure late binding 或 `nonlocal`。
- [ ] Mutable default 測試互相污染。
- [ ] React 把 derived data、event 或 effect 分錯。
- [ ] Health check 圖只有流量箭頭，沒有狀態與移除／恢復條件。
- [ ] 容量只算正常狀態，漏算失去一台。
- [ ] 目前沒有待補項目。

### 未完成才加入的週末補課清單

- [ ] 30 分鐘：關閉答案重寫 Longest Consecutive Sequence，跑 8 組測資並口述平均 `O(n)` 的加總理由。
- [ ] 20 分鐘：補完另一種語言版本，以相同測資驗證。
- [ ] 20 分鐘：閉卷寫 `*args`／`**kwargs` wrapper、counter closure 與 mutable default 修正版。
- [ ] 10 分鐘：重做 late binding 預測，畫出三個函式查找的名稱。
- [ ] 10 分鐘：重講 effect／event／derived data／cleanup，補一個請求競態 trade-off。
- [ ] 20 分鐘：重畫 LB＋health check，注入一台故障與 DB 變慢兩種情境，再算容量。
- [ ] 無需補課（不可與補課項同時勾選）。

[回到一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01)
