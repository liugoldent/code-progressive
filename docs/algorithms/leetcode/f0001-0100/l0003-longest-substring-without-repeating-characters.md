---
title: "[0003] Longest Substring Without Repeating Characters"
toc_max_heading_level: 2
description: "LeetCode 3 Longest Substring Without Repeating Characters 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - TypeScript
  - Python
  - String
  - Interview
keywords: ["0003", "Longest Substring Without Repeating Characters", "TypeScript", "Python", "面試練習"]
---

# [0003] Longest Substring Without Repeating Characters

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-10-06（W05）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 3／Medium |
| 廣義分類 | String |
| 官方題面 | [LeetCode：Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

找一段連續字串，裡面每個字元都不重複，回傳其中最長的長度。不能跳過中間字元把不相鄰的內容拼起來。

### 3. Input / Output 契約

輸入字串，可為空；輸出非負長度。空白與符號也是字元，大小寫不同。兩種語言本頁都以 Unicode code point 為迭代單位；不是把使用者可見的多碼點符號當成一格。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function lengthOfLongestSubstring(s: string): number;
```

#### Python

```python
def length_of_longest_substring(s: str) -> int: ...
```

### 4. 官方範例拆解

1. `"abcabcbb" → 3`：例如 abc、bca。
2. `"bbbbb" → 1`：只能取一個 b。
3. `"pwwkew" → 3`：wke 是連續片段；pwke 中間跳過字元，不能算。

### 5. 限制條件

`0 <= s.length <= 10^5`；題面描述字串由英文字母、數字、符號與空白組成。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「連續子字串」「不重複」「最長長度」「空字串允許」。

### 7. 面試確認問題

題面明說 substring，不需再問是不是 subsequence。產品若有 emoji 或組合重音，應另定字元單位與正規化；題面未明確定義 grapheme cluster，不自行當作官方保證。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `["abcabcbb"]` | `3` |
| 官方 2 | `["bbbbb"]` | `1` |
| 官方 3 | `["pwwkew"]` | `3` |
| 自訂：空 | `[""]` | `0` |
| 自訂：左界不能退 | `["abba"]` | `2` |
| 自訂：不是整段清空 | `["dvdf"]` | `3` |
| 自訂：空白符號 | `["a b!a"]` | `4` |
| 自訂：大小寫不同 | `["aA"]` | `2` |



### 9. 第一個直覺

從每個起點向右找，遇到重複就停；換下一個起點時，剛剛檢查過的內容能否重用？

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
function lengthOfLongestSubstring(s: string): number {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def length_of_longest_substring(s: str) -> int:
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

遇到重複時，必須丟掉目前整段，還是只丟到舊字元的下一格？

</details>

<details>
<summary>提示二：解法方向</summary>

用 Map／dict 記字元最近出現的位置，維持一段不重複的窗口。

</details>

<details>
<summary>提示三：接近解法</summary>

left=max(left,lastSeen[c]+1)，不能讓 left 倒退；再更新最近位置與答案。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用滑動窗口與最近位置 Map／dict？

不想每換起點就重查一遍字元。在 `abba` 讀到第二個 b 時，窗口左邊只需推到第一個 b 的下一格，留下目前 b。再讀到最後 a，之前 a 已在窗口外，不能把左界退回去。Map 保存字元最近位置，讓我們直接跳界；Set 也能做，但需要逐格移左並移除舊字元，不能遇重複就把整組清空。

**下次可以怎麼想：** 連續片段的合法性在右擴後可能被破壞，而左移能恢復時，維持一個窗口並找最小必要的左移。

### 2. 暴力解／最直接的正確解

枚舉每個起點，每次建立新的 Set 向右擴張；遇第一個重複就停止該起點。

#### TypeScript

```ts
function lengthOfLongestSubstringBrute(s: string): number {
  const chars = [...s];
  let best = 0;
  for (let i = 0; i < chars.length; i++) {
    const seen = new Set<string>();
    for (let j = i; j < chars.length; j++) {
      if (seen.has(chars[j])) break;
      seen.add(chars[j]);
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}
```

#### Python

```python
def length_of_longest_substring_brute(s: str) -> int:
    best = 0
    for i in range(len(s)):
        seen: set[str] = set()
        for j in range(i, len(s)):
            if s[j] in seen:
                break
            seen.add(s[j])
            best = max(best, j - i + 1)
    return best
```

### 3. 暴力解的瓶頸

相鄰起點的範圍大量重疊。以可變字元集合估計最差 O(n²) 次插入／查找；若集合大小固定為 σ，遇重複會停止，可更精確寫 O(n·min(n,σ))。

### 4. 從瓶頸推導資料結構／演算法

右端每次讀一字，找它前一次位置 prev；如果仍在窗口內，左界至少要到 prev+1。使用 max 保持左界單調，窗口外舊紀錄不會讓它倒退。

### 5. 為什麼是這個資料結構／方法

Map／dict 平均讀写 O(1)，保存每字最後位置。TypeScript 用 for...of 逐碼點走且自行累加 right，避免用 UTF-16 code unit 索引與 Python code point 索引混用；沒有建立整串陣列。

### 6. 最佳解法步驟

1. left=0、best=0，建立最近位置表。
2. 讀到字元 c，若有舊位置，left=max(left,舊位置+1)。
3. 記錄 c 的新位置。
4. 用 right−left+1 更新最大長度。

### 7. 核心不變量：每輪都要保持什麼

每輪更新後 `[left,right]` 裡沒有重複字元；left 不倒退，lastSeen 儲存截至目前每字最後位置。best 是所有已處理右端所能形成的最大合法窗口長度。

### 8. 手動演算

| abba 的 right | 字元 | 舊位置 | left 更新後 | 窗口／best |
| --- | --- | --- | --- | --- |
| 0 | a | 無 | 0 | a／1 |
| 1 | b | 無 | 0 | ab／2 |
| 2 | b | 1 | 2 | b／2 |
| 3 | a | 0 | max(2,1)=2 | ba／2 |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0, right = 0, best = 0;
  for (const c of s) {
    const previous = lastSeen.get(c);
    if (previous !== undefined) left = Math.max(left, previous + 1);
    lastSeen.set(c, right);
    best = Math.max(best, right - left + 1);
    right++;
  }
  return best;
}
```

#### Python

```python
def length_of_longest_substring(s: str) -> int:
    last_seen: dict[str, int] = {}
    left = best = 0
    for right, c in enumerate(s):
        if c in last_seen:
            left = max(left, last_seen[c] + 1)
        last_seen[c] = right
        best = max(best, right - left + 1)
    return best
```

### 10. 複雜度分析

令 n 為迭代字元數，u 為遇過的相異字元數；右端走 n 次，每次平均 O(1) 查寫，平均 O(n) 時間、O(u) 空間，u≤min(n,σ)。不能不說字母集合就一律寫 O(1)。TypeScript 暴力版還配置 O(n) 字元陣列，最佳版沒有。

### 11. 邊界條件與常見錯誤

left=prev+1 沒加 max；以 truthy 檢查舊索引漏掉 0；遇重複清空全部導致 dvdf 少算 vdf；把子序列當子字串；窗口長度忘記 +1。

### 12. 為什麼不用其他方法

Set 加逐格縮窗也可平均 O(n)，因每字最多入窗出窗各一次。若字元固定小集合可用位置陣列；任意文字要先定義 code point 或 grapheme，不能因範例都是英文就忽略產品語意。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [string]; expected: number }[] = [
  {"args": ["abcabcbb"], "expected": 3},
  {"args": ["bbbbb"], "expected": 1},
  {"args": ["pwwkew"], "expected": 3},
  {"args": [""], "expected": 0},
  {"args": ["abba"], "expected": 2},
  {"args": ["dvdf"], "expected": 3},
  {"args": ["a b!a"], "expected": 4},
  {"args": ["aA"], "expected": 2}
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [lengthOfLongestSubstringBrute, lengthOfLongestSubstring]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('3: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": ["abcabcbb"], "expected": 3}, {"args": ["bbbbb"], "expected": 1}, {"args": ["pwwkew"], "expected": 3}, {"args": [""], "expected": 0}, {"args": ["abba"], "expected": 2}, {"args": ["dvdf"], "expected": 3}, {"args": ["a b!a"], "expected": 4}, {"args": ["aA"], "expected": 2}]''')

def normalize(value):
    return value
for solve in (length_of_longest_substring_brute, length_of_longest_substring):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('3: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

不要每次窗口往前就從頭驗證整段。遇到違規項，只移走造成衝突的最小前綴，重用剩餘內容。Map 存最近位置，窗口移動規則維持不重複；代價是保存每個不同 key。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

事件序列分析：找一段沒有重複 event type 的最長連續互動，字元 → event type。原版從每個事件開始重建 Set；新版本記最近出現位置直接更新範圍。這不是事件去重：不能刪掉重複事件後把前後拼接成一段。

### 3. 工程遷移情境

離線 UX 分析器處理已按時間排序的 event type 陣列，只回傳長度；相同時間順序由上游固定，類型字串按精確相等判定。

### 4. 常見直覺寫法

```ts
function uniqueEventSpanBefore(types: readonly string[]): number {
  let best = 0;
  for (let i = 0; i < types.length; i++) {
    const seen = new Set<string>();
    for (let j = i; j < types.length && !seen.has(types[j]); j++) {
      seen.add(types[j]); best = Math.max(best, j - i + 1);
    }
  }
  return best;
}
```

### 5. 潛在問題與觸發門檻

當 n 大、不同事件類型也多，逐起點重掃可能接近平方；若類型只有十種，原版每起點很快遇重複，應用 O(n·min(n,σ)) 分析實際成本。

### 6. 套用本題技巧

保留連續性的同一不變量，Map key 換為 event type。若需求是「不重複 event ID」，得先確認每 ID 本來就唯一，否則這個指標可能沒有分析價值。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function uniqueEventSpan(types: readonly string[]): number {
  const last = new Map<string, number>();
  let left = 0, best = 0;
  for (let right = 0; right < types.length; right++) {
    const prev = last.get(types[right]);
    if (prev !== undefined) left = Math.max(left, prev + 1);
    last.set(types[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

### 8. 優化前後比較

平均 O(n·min(n,σ)) 改 O(n)，空間 O(u)。不複製或排序輸入；同一批資料在相同順序下結果可重現。

### 9. 使用界線與代價

Map 會保留曾遇過的類型，無限流資料可能持續增長。若只需當前窗口，可用移出時刪除的 Set 版本；重新定義分析時間區間也需要處理邊界。

### 10. Code Review 說法

> 這段分析要維持原事件連續性，不能先去重。建議保存各 type 的最近位置，將 left 推到衝突後一格，並用 abba 類型序列測試左界不退。

### 11. 變形題

1. 允許每種字元最多兩次，要多保存什麼？
2. 改回傳窗口本身，如何保存最優起點而不反覆切片？
3. 輸入是無限事件流，Map 的清理策略是什麼？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 連續片段的合法性在右擴後可能被破壞，而左移能恢復時，維持一個窗口並找最小必要的左移。 |
| 最直接的解法與瓶頸 | 每個起點重建 Set，最差 O(n²)。 |
| 最佳化方法 | 滑動窗口與最近位置 Map／dict |
| 每輪都要保持什麼（invariant） | 窗口無重複，左界單調，表存最後位置。 |
| 時間／空間 | 平均 O(n)，空間 O(u)。 |
| 常見錯誤 | 左界倒退、索引 0、清空整窗。 |
| 工作用途與限制 | 連續互動分析；不是先去重再串接。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
