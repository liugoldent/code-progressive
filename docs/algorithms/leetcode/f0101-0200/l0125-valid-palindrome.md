---
title: "[0125] Valid Palindrome"
toc_max_heading_level: 2
description: "LeetCode 125 Valid Palindrome 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Easy
  - TypeScript
  - Python
  - String
  - Interview
keywords: ["0125", "Valid Palindrome", "TypeScript", "Python", "面試練習"]
---

# [0125] Valid Palindrome

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-09-24（W03）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 125／Easy |
| 廣義分類 | String |
| 官方題面 | [LeetCode：Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

忽略非英文字母、非數字的字元，且忽略大小寫，判斷剩下的內容正著讀和反著讀是否一樣。

### 3. Input / Output 契約

輸入字串，回傳布林。數字必須保留；清理後沒有字元時成立。官方輸入只含 printable ASCII，所以本頁兩語言明確使用 ASCII 範圍。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function isPalindrome(s: string): boolean;
```

#### Python

```python
def is_palindrome(s: str) -> bool: ...
```

### 4. 官方範例拆解

1. `"A man, a plan, a canal: Panama" → true`，忽略標點與大小寫後前後相同。
2. `"race a car" → false`，有效內容 raceacar 前後不同。
3. `" " → true`，沒有需要比較的有效字元。

### 5. 限制條件

`1 <= s.length <= 2*10^5`；僅可列印 ASCII。官方沒有原始空字串，但允許清理後為空。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「前後相同」「忽略非字母數字」「大小寫不區分」「字串可很長」。

### 7. 面試確認問題

不必問數字是否保留、是否忽略大小寫。產品版要問 Unicode 正規化、重音、emoji 與語系規則；Python isalnum 的範圍比 ASCII 大。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `["A man, a plan, a canal: Panama"]` | `true` |
| 官方 2 | `["race a car"]` | `false` |
| 官方 3 | `[" "]` | `true` |
| 自訂：數字保留 | `["0P"]` | `false` |
| 自訂：全標點 | `[".,!"]` | `true` |
| 自訂：單字元 | `["a"]` | `true` |
| 自訂：底線忽略 | `["ab_a"]` | `true` |
| 自訂：兩端不同 | `["1a2"]` | `false` |



### 9. 第一個直覺

如果先做一份清理後字串，再反轉比較，會配置哪些新資料？可不可以不建立它們？

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
function isPalindrome(s: string): boolean {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def is_palindrome(s: str) -> bool:
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

清理後字串的第一個有效字元應該跟誰比較？

</details>

<details>
<summary>提示二：解法方向</summary>

左右兩個位置向內走，遇到無效字元就跳過。

</details>

<details>
<summary>提示三：接近解法</summary>

只把目前兩個 ASCII 字元轉小寫，避免一次複製整串；總掃描 O(n)，額外 O(1)。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用相向雙指標？

不想為了比前後，就先複製清理字串，再複製反轉字串。最直接的清理反轉法正確，但每次只需要最外側兩個有效字元。例如 `A, a` 先比兩端 A 與 a，再跳過中間標點即可。Map 計數不保留位置關係，會把同字母數量但順序不同的 `aabb` 誤當可能的回文。

**下次可以怎麼想：** 如果答案由前後對應位置是否相同決定，就從兩端逐對確認，遇到可忽略項再跳過。

### 2. 暴力解／最直接的正確解

先保留 ASCII 字母數字、轉成小寫，再反轉比較。它已是線性時間的正確基準解，最佳化針對空間。

#### TypeScript

```ts
function isPalindromeBrute(s: string): boolean {
  const cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return cleaned === [...cleaned].reverse().join('');
}
```

#### Python

```python
def is_palindrome_brute(s: str) -> bool:
    cleaned = ''.join(c.lower() for c in s if 'a' <= c <= 'z' or 'A' <= c <= 'Z' or '0' <= c <= '9')
    return cleaned == cleaned[::-1]
```

### 3. 暴力解的瓶頸

清理、轉小寫、反轉都可能配置長度 O(n) 的暫存；不是 O(n²) 時間問題，不應硬說原版很慢。

### 4. 從瓶頸推導資料結構／演算法

把整串清理延後到真正比較時。左右指標略過無效字元，僅轉換當下兩個字元，不建立長度 n 的新字串。

### 5. 為什麼是這個資料結構／方法

字元索引、ASCII 判斷與單字元大小寫轉換 O(1)；兩個索引只向內，不需 Set。JavaScript substring 全串轉小寫仍配置 O(n)，不能算作常數空間。

### 6. 最佳解法步驟

1. left=0、right=n−1。
2. 各自略過非 ASCII 字母數字。
3. 比較兩端小寫字元，不同立刻 false。
4. 同時向內，直到相遇就 true。

### 7. 核心不變量：每輪都要保持什麼

目前兩端外側的有效字元已成對驗證相同；未解決的內容只剩 `[left,right]`。略過的字元依契約不影響答案。

### 8. 手動演算

| s="A, a" | left | right | 動作 |
| --- | --- | --- | --- |
| 起始 | 0=A | 3=a | 小寫相同 |
| 向內 | 1=逗號 | 2=空白 | 略過至相遇 |
| 結束 | 相遇 | 相遇 | true |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function isPalindrome(s: string): boolean {
  const valid = (c: string): boolean => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
  let left = 0, right = s.length - 1;
  while (left < right) {
    while (left < right && !valid(s[left])) left++;
    while (left < right && !valid(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++; right--;
  }
  return true;
}
```

#### Python

```python
def is_palindrome(s: str) -> bool:
    def valid(c: str) -> bool:
        return 'a' <= c <= 'z' or 'A' <= c <= 'Z' or '0' <= c <= '9'
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not valid(s[left]):
            left += 1
        while left < right and not valid(s[right]):
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
```

### 10. 複雜度分析

兩個指標總共移動最多 n 次，時間 O(n)。只持有索引與單字元，額外空間 O(1)。清理反轉基準同樣 O(n) 時間，但 O(n) 暫存；最佳化主要節省配置。

### 11. 邊界條件與常見錯誤

正規式只留字母卻丟掉數字；`\w` 保留底線而改變題意；跳過字元忘記界線；全串 lower 後仍宣稱 O(1) 空間。

### 12. 為什麼不用其他方法

字串很短時清理反轉更簡潔。如果必須給使用者看清理結果，反正需要那份字串，不必刻意避免配置。Unicode 使用者可見字元需另定切分規則，不能直接套 UTF-16 索引。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [string]; expected: boolean }[] = [
  {"args": ["A man, a plan, a canal: Panama"], "expected": true},
  {"args": ["race a car"], "expected": false},
  {"args": [" "], "expected": true},
  {"args": ["0P"], "expected": false},
  {"args": [".,!"], "expected": true},
  {"args": ["a"], "expected": true},
  {"args": ["ab_a"], "expected": true},
  {"args": ["1a2"], "expected": false}
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [isPalindromeBrute, isPalindrome]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('125: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": ["A man, a plan, a canal: Panama"], "expected": true}, {"args": ["race a car"], "expected": false}, {"args": [" "], "expected": true}, {"args": ["0P"], "expected": false}, {"args": [".,!"], "expected": true}, {"args": ["a"], "expected": true}, {"args": ["ab_a"], "expected": true}, {"args": ["1a2"], "expected": false}]''')

def normalize(value):
    return value
for solve in (is_palindrome_brute, is_palindrome):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('125: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

不想為了一次對稱檢查配置兩份長字串。先看最外側一對，再縮小範圍即可；索引是當前比較位置，演算法負責略過無關內容。時間未改善量級，省的是暫存記憶體。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

文字教學或回文小遊戲的輸入驗證可以直接用：輸入文字 → s，允許忽略的標點 → valid 判斷。它不是一般帳號或密碼驗證规则，不能把忽略標點當成任意字串相等的定義。

### 3. 工程遷移情境

明確只接受 ASCII 的回文練習元件，最大字數由產品限制；不支援的字元顯示錯誤，而非默默刪掉。

### 4. 常見直覺寫法

```ts
type PalindromeCheck = { ok: true; palindrome: boolean } | { ok: false; reason: string };
function checkPhraseBefore(text: string): PalindromeCheck {
  if (text.length > 200000 || /[^\x20-\x7E]/.test(text)) return { ok: false, reason: '請輸入範圍內的 ASCII 文字' };
  return { ok: true, palindrome: isPalindromeBrute(text) };
}
```

### 5. 潛在問題與觸發門檻

若長文每次輸入都重新計算，O(n) 暫存會反覆產生；應量測配置與觸發頻率。短句場景沒有必要為此犧牲可讀性。

### 6. 套用本題技巧

直接重用相同的 ASCII、忽略標點契約，wrapper 只負責界線與可辨識錯誤。這是範圍有限但真實的文字工具功能。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function checkPhrase(text: string): PalindromeCheck {
  if (text.length > 200000 || /[^\x20-\x7E]/.test(text)) return { ok: false, reason: '請輸入範圍內的 ASCII 文字' };
  return { ok: true, palindrome: isPalindrome(text) };
}
```

### 8. 優化前後比較

兩版 O(n) 時間；基準 O(n) 額外空間，雙指標 O(1)。前置輸入檢查仍掃描一次，不會讓整體變成次線性。

### 9. 使用界線與代價

若要支援中文、重音或 emoji，必須先定義 grapheme 與 normalization；轉換可能需要額外記憶體。每次按鍵重跑整串仍是 O(n)，可調整觸發時機。

### 10. Code Review 說法

> 長輸入在每次驗證會建立清理與反轉字串；若配置已影響互動，可用雙指標節省暫存，保留 ASCII 限制與明確錯誤回傳。

### 11. 變形題

1. 允許刪除一個有效字元，第一個不匹配時要驗證哪些分支？
2. 改成回傳清理結果，空間分析怎麼改？
3. 需要支援 Unicode 使用者可見字元時，索引單位是什麼？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 如果答案由前後對應位置是否相同決定，就從兩端逐對確認，遇到可忽略項再跳過。 |
| 最直接的解法與瓶頸 | 清理＋反轉：線性時間、線性暫存。 |
| 最佳化方法 | 相向雙指標 |
| 每輪都要保持什麼（invariant） | 兩端外側已驗證，內側待驗證。 |
| 時間／空間 | O(n) 時間，O(1) 額外空間。 |
| 常見錯誤 | 漏數字、保留底線、全串 lower 卻稱常數空間。 |
| 工作用途與限制 | ASCII 文字練習；Unicode 需另定義。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
