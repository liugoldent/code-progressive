---
title: "[0424] Longest Repeating Character Replacement"
toc_max_heading_level: 2
description: "LeetCode 424 Longest Repeating Character Replacement 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - TypeScript
  - Python
  - String
  - Interview
keywords: ["0424", "Longest Repeating Character Replacement", "TypeScript", "Python", "面試練習"]
---

# [0424] Longest Repeating Character Replacement

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-10-08（W05）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 424／Medium |
| 廣義分類 | String |
| 官方題面 | [LeetCode：Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

最多改掉 k 個位置的字母，找能變成同一個字母的最長連續片段長度。不要求真的回傳修改後的字串。

### 3. Input / Output 契約

s 只含大寫英文字母；k 是可替換位置數上限，不是必須用完。回傳長度，片段必須連續；可把一字改成任意大寫字母。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function characterReplacement(s: string, k: number): number;
```

#### Python

```python
def character_replacement(s: str, k: int) -> int: ...
```

### 4. 官方範例拆解

1. `"ABAB",k=2 → 4`：把兩個 A 改 B，或兩個 B 改 A。
2. `"AABABBA",k=1 → 4`：例如中間四字 BABB，改其中一個 A 就變 BBBB。

### 5. 限制條件

`1 <= n <= 10^5`；s 只含 A–Z；`0 <= k <= n`。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「連續」「最多 k 個替換」「全部變相同」「固定 26 個字母」。

### 7. 面試確認問題

題面已說替換不是刪除，也不必用完 k。若允許每個位置不同修改成本，不能沿用單純次數差。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `["ABAB", 2]` | `4` |
| 官方 2 | `["AABABBA", 1]` | `4` |
| 自訂：最小 | `["A", 0]` | `1` |
| 自訂：不需修改 | `["AAAA", 0]` | `4` |
| 自訂：不可修改 | `["ABCD", 0]` | `1` |
| 自訂：預算足夠 | `["ABCD", 4]` | `4` |
| 自訂：不可同時改兩端 | `["BAAAB", 1]` | `4` |
| 自訂：需反覆縮窗 | `["ABCDE", 1]` | `2` |



### 9. 第一個直覺

固定一段後，要保留哪個字母才能修改最少位置？怎麼算需要修改的次數？

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
function characterReplacement(s: string, k: number): number {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def character_replacement(s: str, k: int) -> int:
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

固定片段長度減去其中最多的字母次數，代表什麼？

</details>

<details>
<summary>提示二：解法方向</summary>

用頻率陣列維持窗口；需要替換數超過 k 就移左端。

</details>

<details>
<summary>提示三：接近解法</summary>

為了清楚保持窗口合法，每次縮窗重算目前 26 格最大次數；O(26n) 仍是線性。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用頻率陣列與滑動窗口？

對每個片段來說，最省修改的方法是保留最多的字母。例如 AABA 有三個 A、一個 B，長度 4 減最多次數 3，只需改 1 格。枚舉所有片段很慢，但右邊加入一字時只變一個頻率；若預算不夠，就逐步移走左端。Set 只知道有幾種字，無法區分 AAAB 與 AABB 的修改成本。

**下次可以怎麼想：** 若一段資料的修正成本可由長度與頻率算出，且縮短不會增加最低修正成本，就可用窗口維持預算。

### 2. 暴力解／最直接的正確解

枚舉起點，逐步右擴並計次數；每次檢查長度−最高次數是否不超過 k，記錄合法最大長度。

#### TypeScript

```ts
function characterReplacementBrute(s: string, k: number): number {
  let best = 0;
  for (let left = 0; left < s.length; left++) {
    const counts = Array<number>(26).fill(0);
    let most = 0;
    for (let right = left; right < s.length; right++) {
      const index = s.charCodeAt(right) - 65;
      most = Math.max(most, ++counts[index]);
      if (right - left + 1 - most <= k) best = Math.max(best, right - left + 1);
    }
  }
  return best;
}
```

#### Python

```python
def character_replacement_brute(s: str, k: int) -> int:
    best = 0
    for left in range(len(s)):
        counts = [0] * 26
        most = 0
        for right in range(left, len(s)):
            index = ord(s[right]) - ord('A')
            counts[index] += 1
            most = max(most, counts[index])
            if right - left + 1 - most <= k:
                best = max(best, right - left + 1)
    return best
```

### 3. 暴力解的瓶頸

n 個起點各重新走後綴，約 n²/2 個片段。即使單次頻率更新 O(1)，總片段數仍 O(n²)。

### 4. 從瓶頸推導資料結構／演算法

增加一字時，長度與最高次數各最多加一，所以最低修改數不會下降；移除一字則修改數不會增加。因此一旦超標，舊左界對未來更長窗口也不會突然變好，可單調向右移。

### 5. 為什麼是這個資料結構／方法

26 格頻率陣列更新 O(1)，找真正目前最高次數 O(26)。本頁刻意使用每次重算的清楚版本，讓「窗口一直合法」的推理與程式完全一致；字母集合固定，所以仍 O(n)。

### 6. 最佳解法步驟

1. counts 全零，left=0、best=0。
2. 右端字母次數加一。
3. 當窗口長度−目前最高次數>k，左端次數減一並 left++。
4. 窗口合法後再更新 best。

### 7. 核心不變量：每輪都要保持什麼

每輪 while 結束後，counts 精確描述 `[left,right]`，且窗口長度−max(counts)≤k，所以目前窗口確實能在預算內改成同字。left 只右移；被丟棄的更早起點已不可能對目前或更晚右端合法。

### 8. 手動演算

| AABABBA，k=1 | 窗口／動作 | 長度−最高次數 | best |
| --- | --- | --- | --- |
| right=0..3 | AABA | 4−3=1 | 4 |
| right=4 | AABAB 超標，移兩次成 BAB | 3−2=1 | 4 |
| right=5 | BABB | 4−3=1 | 4 |
| right=6 | BABBA 超標，移到 BBA | 3−2=1 | 4 |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function characterReplacement(s: string, k: number): number {
  const counts = Array<number>(26).fill(0);
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    counts[s.charCodeAt(right) - 65]++;
    while (right - left + 1 - Math.max(...counts) > k) {
      counts[s.charCodeAt(left) - 65]--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

#### Python

```python
def character_replacement(s: str, k: int) -> int:
    counts = [0] * 26
    left = best = 0
    for right, c in enumerate(s):
        counts[ord(c) - ord('A')] += 1
        while right - left + 1 - max(counts) > k:
            counts[ord(s[left]) - ord('A')] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best
```

### 10. 複雜度分析

右端 n 次，左端最多 n 次；每次判定掃 26 格，總 O(26n)=O(n)，空間 O(26)=O(1)。若字母集合改為大小 σ，重算最高值會是 O(σn)，不可再把 26 的常數推廣為任意集合的 O(n)。

### 11. 邊界條件與常見錯誤

用相異種類數代替修改位置數；縮窗沒扣頻率；把最多 k 次當必須 k 次；使用歷史最高頻率但仍宣稱每一輪窗口合法。舊筆記 Easy 已依官方修正為 Medium。

### 12. 為什麼不用其他方法

舊文採用只增不減的歷史 maxCount，可以以較少常數求最長長度，但中間窗口可能不合法；它需要「只追求可達最大長度」的另一套證明，不能與本頁不變量混用。要回傳真實窗口時，重算精確頻率更容易驗證。固定目標字母逐一跑 26 次窗口也是 O(26n)。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [string, number]; expected: number }[] = [
  {"args": ["ABAB", 2], "expected": 4},
  {"args": ["AABABBA", 1], "expected": 4},
  {"args": ["A", 0], "expected": 1},
  {"args": ["AAAA", 0], "expected": 4},
  {"args": ["ABCD", 0], "expected": 1},
  {"args": ["ABCD", 4], "expected": 4},
  {"args": ["BAAAB", 1], "expected": 4},
  {"args": ["ABCDE", 1], "expected": 2}
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [characterReplacementBrute, characterReplacement]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('424: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": ["ABAB", 2], "expected": 4}, {"args": ["AABABBA", 1], "expected": 4}, {"args": ["A", 0], "expected": 1}, {"args": ["AAAA", 0], "expected": 4}, {"args": ["ABCD", 0], "expected": 1}, {"args": ["ABCD", 4], "expected": 4}, {"args": ["BAAAB", 1], "expected": 4}, {"args": ["ABCDE", 1], "expected": 2}]''')

def normalize(value):
    return value
for solve in (character_replacement_brute, character_replacement):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('424: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

不用把每個片段真的修改後再檢查；只算「留下最多的一種，其他要改幾格」。例如同一工作序列 `[A,A,B,A]` 容許一次重試，就能視為長度 4 的一致片段。頻率陣列存數量，窗口維持可修正預算。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

日誌品質分析找「最多容忍 k 個異類事件」的最長近似同類連續段：字母 → 固定類型代碼，替換 → 分析時視為例外。它只做摘要，不應真的修改或刪掉稽核日誌。各事件的成本不同時，次數公式就不成立。

### 3. 工程遷移情境

固定 A–Z 的狀態序列報表，回傳最長長度；空序列回 0，預算必须為非負整數。分析只讀資料，不更動來源。

### 4. 常見直覺寫法

```ts
function validateRunInput(sequence: string, budget: number): void {
  if (!/^[A-Z]*$/.test(sequence) || sequence.length > 100000 || !Number.isInteger(budget)
    || budget < 0 || budget > sequence.length) throw new Error('invalid run input');
}
function tolerantRunBefore(sequence: string, budget: number): number {
  validateRunInput(sequence, budget);
  return characterReplacementBrute(sequence, budget);
}
```

### 5. 潛在問題與觸發門檻

長度十萬的事件序列若檢查所有片段，約五十億組。線性窗口適合批次摘要；若每條事件進來都從頭呼叫，累積仍可能平方，應另設計增量處理。

### 6. 套用本題技巧

以同一「長度−最多類型次數」衡量需要容忍的例外數；不假裝這等於真實更改事件的成本。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function tolerantRun(sequence: string, budget: number): number {
  validateRunInput(sequence, budget);
  return characterReplacement(sequence, budget);
}
```

### 8. 優化前後比較

O(n²) 改 O(26n)，固定字母集合下 O(n)，O(26) 空間。前置正規式驗證仍 O(n)。没有額外輸出整段，因契約只求長度。

### 9. 使用界線與代價

若狀態類型擴成任意字串，改 Map 後每輪取最大可能依類型數增加。若要回傳區間與例外位置，需保存最佳左右界，最後再掃一次該區間。

### 10. Code Review 說法

> 這個摘要只需頻率算例外數，不必枚舉每個起點；建議用精確頻率窗口，保留預算驗證，並避免把歷史 maxCount 的寬鬆窗口當作真實可回傳區間。

### 11. 變形題

1. 指定必須變成 A，公式與狀態怎麼簡化？
2. 每字修改成本不同，最多頻率還是最便宜選擇嗎？
3. 要回傳實際片段與例外位置，應保存哪個時刻的區間？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 若一段資料的修正成本可由長度與頻率算出，且縮短不會增加最低修正成本，就可用窗口維持預算。 |
| 最直接的解法與瓶頸 | 每個起點重新計數，O(n²)。 |
| 最佳化方法 | 頻率陣列與滑動窗口 |
| 每輪都要保持什麼（invariant） | 目前頻率精確，更新 best 前窗口確實符合預算。 |
| 時間／空間 | O(26n)=O(n)，O(26)=O(1)。 |
| 常見錯誤 | 歷史最高值版本不可宣稱每輪合法。 |
| 工作用途與限制 | 容忍少數異類的序列分析；不修改原日誌。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
