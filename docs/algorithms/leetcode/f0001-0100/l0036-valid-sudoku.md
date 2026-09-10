---
title: "[0036] Valid Sudoku"
toc_max_heading_level: 2
description: "LeetCode 36 Valid Sudoku 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - TypeScript
  - Python
  - Array
  - Interview
keywords: ["0036", "Valid Sudoku", "TypeScript", "Python", "面試練習"]
---

# [0036] Valid Sudoku

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-09-21（W03）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 36／Medium |
| 廣義分類 | Array |
| 官方題面 | [LeetCode：Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

判斷目前填入的數字是否違反數獨規則：每行、每列、每個 3×3 宮都不能重複數字。只驗證目前棋盤，不用填滿，也不用判定能不能解出來。

### 3. Input / Output 契約

輸入固定 9×9 字元陣列，值是 "1" 到 "9" 或 "."；回傳布林。點表示空格，不參與重複判斷。合法的未完成棋盤不保證有解。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function isValidSudoku(board: string[][]): boolean;
```

#### Python

```python
def is_valid_sudoku(board: list[list[str]]) -> bool: ...
```

### 4. 官方範例拆解

官方範例 1 的九行是 `53..7.... / 6..195... / .98....6. / 8...6...3 / 4..8.3..1 / 7...2...6 / .6....28. / ...419..5 / ....8..79`，回傳 true：已填數字沒有違反三種區域規則。官方範例 2 只把左上角 5 改成 8，回傳 false：左上宮以及第一列都有兩個 8。完整二維輸入見下方測資。

### 5. 限制條件

board 有 9 行，每行有 9 格；每格只可能是 1–9 的字元或點。沒有任意尺寸與其他符號的官方輸入。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「已填入」「行／列／宮各自不能重複」「固定 9×9」「驗證而非求解」。

### 7. 面試確認問題

不必問是否要填空格，題面明確只驗證。若做自訂棋盤 API，需問尺寸、字元集合及錯誤位置回報；不把這些額外需求混入官方判定。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `["53..7.... / 6..195... / .98....6. / 8...6...3 / 4..8.3..1 / 7...2...6 / .6....28. / ...419..5 / ....8..79"]` | `true` |
| 官方 2 | `["83..7.... / 6..195... / .98....6. / 8...6...3 / 4..8.3..1 / 7...2...6 / .6....28. / ...419..5 / ....8..79"]` | `false` |
| 自訂：全空 | `["......... / ......... / ......... / ......... / ......... / ......... / ......... / ......... / ........."]` | `true` |
| 自訂：只同行衝突 | `["1.......1 / ......... / ......... / ......... / ......... / ......... / ......... / ......... / ........."]` | `false` |
| 自訂：只同列衝突 | `["1........ / ......... / ......... / ......... / ......... / ......... / ......... / ......... / 1........"]` | `false` |
| 自訂：只同宮衝突 | `["1........ / .1....... / ......... / ......... / ......... / ......... / ......... / ......... / ........."]` | `false` |
| 自訂：不同區域可重複 | `["1........ / ......... / ......... / ......... / ....1.... / ......... / ......... / ......... / ........."]` | `true` |



### 9. 第一個直覺

每放一格，你需要跟哪些格子比較？兩個相同數字只要出現在棋盤上就一定非法嗎？

沒有提供這次的作答，所以不代填你的想法。記錄：我準備逐一檢查什麼？為何不會漏掉有效答案？

### 10. 複雜度預估

先填 `n` 的意思、每輪工作量、最多幾輪，以及另建了哪些資料。若有字串、群組或輸出清單，也要列出它們的總長度；不要只填一個背過的 Big-O。

### 11. 解題計畫

```txt
1. 我要按照什麼順序處理輸入：
2. 每一步如何判定／產生答案：
3. 何時停止，如何確認沒有漏解：
我認為最容易錯的測資與理由：
```

### 12. 第一次實作

#### TypeScript

```ts
function isValidSudoku(board: string[][]): boolean {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def is_valid_sudoku(board: list[list[str]]) -> bool:
    raise NotImplementedError("先完成自己的版本")
```

```txt
實際耗時：
結果／失敗測資：
錯誤類型（契約／推導／邊界／語法／複雜度）：
卡點：
看到第幾層提示：
```

<details>
<summary>提示一：從需求再想一步</summary>

同一數字出現在不同區域時，該如何區分？

</details>

<details>
<summary>提示二：解法方向</summary>

可以為每個行、列、宮各保存已出現的數字。

</details>

<details>
<summary>提示三：接近解法</summary>

宮編號為 floor(row/3)*3+floor(col/3)；每格先查三個 Set，再加入。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用按行／列／宮分開的 Set？

真正要問的是「這個數字在這一行、這一列或這一宮出現過沒」。最直接是每格重掃它所在區域，但同一區域會一直被掃。例：左上角的 5 應分別記在 row0、col0、box0，另一宮的 5 不能只因數字相同就被擋。Set 足以回答看過沒；需要指出衝突格座標時才改用 Map 保存位置。

**下次可以怎麼想：** 限制是某個範圍內不能重複時，先找出範圍身分，再分開記錄看過的值。

### 2. 暴力解／最直接的正確解

把所有已填格兩兩比較：如果數字相同，且同行、同列或同宮，就非法。這是最直觀的完整檢查。

#### TypeScript

```ts
function isValidSudokuBrute(board: string[][]): boolean {
  for (let a = 0; a < 81; a++) {
    const r = Math.floor(a / 9), c = a % 9;
    if (board[r][c] === '.') continue;
    for (let b = a + 1; b < 81; b++) {
      const rr = Math.floor(b / 9), cc = b % 9;
      const sameBox = Math.floor(r / 3) === Math.floor(rr / 3) && Math.floor(c / 3) === Math.floor(cc / 3);
      if (board[r][c] === board[rr][cc] && (r === rr || c === cc || sameBox)) return false;
    }
  }
  return true;
}
```

#### Python

```python
def is_valid_sudoku_brute(board: list[list[str]]) -> bool:
    for a in range(81):
        r, c = divmod(a, 9)
        if board[r][c] == '.':
            continue
        for b in range(a + 1, 81):
            rr, cc = divmod(b, 9)
            same_box = r // 3 == rr // 3 and c // 3 == cc // 3
            if board[r][c] == board[rr][cc] and (r == rr or c == cc or same_box):
                return False
    return True
```

### 3. 暴力解的瓶頸

固定棋盤最多比較 81×80/2=3240 對；每填一格都從既有格重新判斷區域。固定大小下仍是 O(1)，優化重點是減少重複工作並明確表示規則。

### 4. 從瓶頸推導資料結構／演算法

掃描每格時，對三個區域做三次看過沒的查詢。已處理部分的資訊存在對應 Set，不再重掃已填格。

### 5. 為什麼是這個資料結構／方法

建立三組各 9 個獨立 Set；平均 has/add 為 O(1)。宮編號把 3×3 區域映射到 0–8。不要只以數字當全棋盤唯一 key，也不要用 fill(new Set()) 共享容器。

### 6. 最佳解法步驟

1. 建立 rows、cols、boxes。
2. 逐格讀取，點直接略過。
3. 算宮號，任一對應集合已見該值就 false。
4. 否則加入三個集合，全部完成就 true。

### 7. 核心不變量：每輪都要保持什麼

處理某格之前，每個集合精確包含該區域已處理的非空數字；此前沒有衝突。先查後加入，才能發現與先前格重複。

### 8. 手動演算

| 格子 | 宮號 | 查找／加入 |
| --- | --- | --- |
| (0,0)=5 | 0 | row0、col0、box0 加 5 |
| (0,1)=3 | 0 | row0、col1、box0 加 3 |
| (1,0)=6 | 0 | row1、col0、box0 加 6 |
| 若 (1,1)=5 | 0 | box0 已有 5，失敗 |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function isValidSudoku(board: string[][]): boolean {
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const x = board[r][c];
      if (x === '.') continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r].has(x) || cols[c].has(x) || boxes[b].has(x)) return false;
      rows[r].add(x); cols[c].add(x); boxes[b].add(x);
    }
  }
  return true;
}
```

#### Python

```python
def is_valid_sudoku(board: list[list[str]]) -> bool:
    rows: list[set[str]] = [set() for _ in range(9)]
    cols: list[set[str]] = [set() for _ in range(9)]
    boxes: list[set[str]] = [set() for _ in range(9)]
    for r in range(9):
        for c in range(9):
            x = board[r][c]
            if x == '.':
                continue
            b = (r // 3) * 3 + c // 3
            if x in rows[r] or x in cols[c] or x in boxes[b]:
                return False
            rows[r].add(x)
            cols[c].add(x)
            boxes[b].add(x)
    return True
```

### 10. 複雜度分析

官方固定 81 格，所以時間、空間都是 O(1)。為比較擴展版，假設 N×N 且每宮邊長 √N：兩兩比較 O(N⁴)，逐格集合平均 O(N²) 時間、O(N²) 空間。這是一般化分析；本頁程式仍固定 9，不能直接宣稱支援任意 N。

### 11. 邊界條件與常見錯誤

空格不能加入 Set；同一數字可在不同範圍重現；宮號不能寫 r%3；不能以合法推論一定有解。舊版「看到重複一定用 Set」過度簡化，需先釐清範圍與要保存的資訊。

### 12. 為什麼不用其他方法

也可逐一檢查 27 個單位，各用一個局部 Set，較省同時持有的狀態且易讀。位元遮罩能縮記憶體，但要解釋 bit 對應；固定小棋盤優先可讀性。解數獨則需要搜尋，不是這個驗證問題。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [string[][]]; expected: boolean }[] = [
  { args: [["53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"].map(row => row.split(""))], expected: true },
  { args: [["83..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"].map(row => row.split(""))], expected: false },
  { args: [[".........", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "........."].map(row => row.split(""))], expected: true },
  { args: [["1.......1", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "........."].map(row => row.split(""))], expected: false },
  { args: [["1........", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "1........"].map(row => row.split(""))], expected: false },
  { args: [["1........", ".1.......", ".........", ".........", ".........", ".........", ".........", ".........", "........."].map(row => row.split(""))], expected: false },
  { args: [["1........", ".........", ".........", ".........", "....1....", ".........", ".........", ".........", "........."].map(row => row.split(""))], expected: true }
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [isValidSudokuBrute, isValidSudoku]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('36: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": [["53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"]], "expected": true}, {"args": [["83..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"]], "expected": false}, {"args": [[".........", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "........."]], "expected": true}, {"args": [["1.......1", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "........."]], "expected": false}, {"args": [["1........", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "1........"]], "expected": false}, {"args": [["1........", ".1.......", ".........", ".........", ".........", ".........", ".........", ".........", "........."]], "expected": false}, {"args": [["1........", ".........", ".........", ".........", "....1....", ".........", ".........", ".........", "........."]], "expected": true}]''')
for case in cases:
    case["args"][0] = [list(row) for row in case["args"][0]]
def normalize(value):
    return value
for solve in (is_valid_sudoku_brute, is_valid_sudoku):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('36: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

避免每驗證一筆，就掃過所有舊資料找同範圍重複。例如兩租戶都能使用名字 admin，同租戶內才不可重複；必須記錄租戶範圍，不能用全域名字 Set。代價是保留這批已見 key。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

多租戶匯入帳號：棋盤區域 → tenant ID，數字 → username。原本逐筆比先前所有帳號；按 tenant 分集合就可直接查。前端只能預檢同批衝突；同時匯入或已有資料衝突，仍需資料庫唯一限制。

### 3. 工程遷移情境

匯入預檢函式只接收已做過業務正規化的 tenant 與 username，回報同批是否有重複；不把大小寫與空白規則藏在 Set 中。

### 4. 常見直覺寫法

```ts
type ImportUser = { tenant: string; username: string };
function hasConflictBefore(users: readonly ImportUser[]): boolean {
  return users.some((u, i) => users.slice(0, i).some(v => v.tenant === u.tenant && v.username === u.username));
}
```

### 5. 潛在問題與觸發門檻

數萬列匯入、幾乎沒有衝突時原版掃描到最後，每筆 slice 還複製前綴。總 O(n²) 比較與複製；只有少數帳號的表單可維持簡單實作。

### 6. 套用本題技巧

每個區域的 Set → 每個租戶的名字 Set；scope 被明確存成外層 Map key，避免用字串拼接引入分隔符碰撞。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function hasConflict(users: readonly ImportUser[]): boolean {
  const byTenant = new Map<string, Set<string>>();
  for (const { tenant, username } of users) {
    let names = byTenant.get(tenant);
    if (!names) { names = new Set<string>(); byTenant.set(tenant, names); }
    if (names.has(username)) return true;
    names.add(username);
  }
  return false;
}
```

### 8. 優化前後比較

平均 O(n²) 掃描改平均 O(n) Map／Set 存取，最差儲存 O(n) 名字參照。原版短暫 slice 也占最多 O(n) 空間；新版本減少重複配置。

### 9. 使用界線與代價

回傳第一個衝突布林；若 UI 要指出哪兩列，內層用 Map 存首個 row index。不得用本機集合取代資料庫 `(tenant, username)` 的唯一限制。

### 10. Code Review 說法

> 同批匯入目前逐列 slice 後再搜尋，資料量大時會重做很多工作。可按 tenant 保存已見 username，保留正規化規則，並由資料庫處理跨請求衝突。

### 11. 變形題

1. 要回傳所有衝突座標，Set 哪裡不夠？
2. 支援 16×16 時，宮號與字元集合如何變？
3. 要求判斷是否有解，為何不能只做驗證？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 限制是某個範圍內不能重複時，先找出範圍身分，再分開記錄看過的值。 |
| 最直接的解法與瓶頸 | 固定 81 格兩兩比較，最多 3240 對。 |
| 最佳化方法 | 按行／列／宮分開的 Set |
| 每輪都要保持什麼（invariant） | 三類集合只保存各自區域的已處理數字。 |
| 時間／空間 | 固定 9×9 為 O(1)；一般化 N×N 平均 O(N²)。 |
| 常見錯誤 | 共用 Set、宮號錯、把合法當可解。 |
| 工作用途與限制 | 按租戶驗證唯一性；跨請求靠資料庫。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
