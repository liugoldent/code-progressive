---
title: "[0242] Valid Anagram"
description: "LeetCode 242 Valid Anagram 的 JavaScript 與 Python 三階段練習筆記：獨立讀題、解法推導、測試、Big-O 與工程遷移。"
tags:
  - LeetCode
  - Easy
  - JavaScript
  - Python
  - String
  - Interview
keywords: ["0242", "Valid Anagram", "LeetCode", "JavaScript", "Python", "String", "Edge Cases", "Big-O", "面試口述"]
---

# [0242] Valid Anagram

> 題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)  
> 官方題目：[LeetCode 242. Valid Anagram](https://leetcode.com/problems/valid-anagram/)  
> 今日完整日課：[第 1 週 Day 2：Python、React 回想與容量估算](/docs/career-blueprint/week-01-day-02)  
> 今日指定語言：**JavaScript＋Python**

## Stage A｜解題前：先獨立完成（0–30 分鐘）

這一段刻意不透露最佳解法。啟動 30 分鐘計時器，只看 Stage A；先口述、寫計畫，再分別用 JavaScript 與 Python 實作。

### 1. 題目基本資料

| 欄位 | 內容 |
| --- | --- |
| 題號 | 242 |
| 題名 | Valid Anagram |
| 難度 | Easy |
| 官方廣義分類 | String |
| 練習日期 | 2026-09-06 |
| 建議 timebox | 讀題與測資 10 分鐘＋推導 5 分鐘＋兩種語言各 7.5 分鐘 |

### 2. 白話題意

給定兩個字串 `s` 和 `t`，判斷 `t` 是否能只靠重新排列 `s` 的字元得到。

兩邊必須使用完全相同的字元，而且每個字元的出現次數也完全相同。題目只要求回傳布林值，不需要回傳重排後的字串或排列步驟。

### 3. Input / Output 契約

JavaScript：

```js
function isAnagram(s, t) {
  // 回傳 boolean
}
```

Python：

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        ...
```

- 輸入 `s` 與 `t` 都是字串。
- 回傳 `true`／`True` 代表 `t` 是 `s` 的 anagram，否則回傳 false。
- 字元順序不需要相同，但種類與出現次數必須相同。
- 題目不要求修改輸入；JavaScript 與 Python 的字串都是 immutable。
- 官方 constraints 保證兩個字串都至少有一個字元，且只含小寫英文字母。

### 4. 官方範例拆解

```txt
輸入：s = "anagram", t = "nagaram"
輸出：true
原因：兩邊都有 a × 3、n × 1、g × 1、r × 1、m × 1；只有順序不同。
```

```txt
輸入：s = "rat", t = "car"
輸出：false
原因：s 有 t，t 則有 c；使用的字元不同，無法只靠重新排列得到。
```

這裡只是在解釋輸出為什麼成立，還沒有決定程式要如何判斷。

### 5. 限制條件

- `1 <= s.length, t.length <= 5 * 10^4`
- `s` 與 `t` 只包含小寫英文字母。
- 官方 follow-up：如果輸入包含 Unicode 字元，要如何調整解法？

先回答：

1. 長度到 `50,000` 時，對每個字元都重新掃描完整字串是否合理？
2. 小寫英文字母的字元集合是固定的；若改成 Unicode，這個假設是否仍成立？
3. 題目只問布林值，在哪些情況可以提早回傳？

### 6. 客觀關鍵字與線索

先圈題目明講的資訊，不把單一關鍵字直接背成演算法：

- 「rearranging」：順序可以改變。
- 「all the original letters exactly once」：每個原始字元都必須被使用，重複次數不能遺失。
- 回傳 boolean：只需回答是否符合。
- 兩個輸入：需要比較兩邊整體內容，而不是找單一字元。
- 長度最多 `5 × 10^4`：重複完整掃描可能過慢。
- 小寫英文字母：目前字元集合有限，但 follow-up 會移除這個便利條件。

### 7. 面試確認問題

由題面已知，不必重複問：

- 輸入不含空白、標點或大小寫混合。
- 兩個字串都至少有一個字元。
- 只需回傳布林值。

若題目改成 production utility，值得確認：

- 大小寫是否視為相同？
- 空白與標點是否忽略？
- Unicode 的 composed／decomposed forms 是否要先 normalization？
- 判斷的是 code point、grapheme cluster，還是人眼看到的字素？
- 是否可建立與輸入大小相關的額外狀態？

> 不要擅自替官方題目做 lowercase、移除空白或 Unicode normalization；那會改變題意。

### 8. 自訂測資

先手寫預期答案與原因，再執行 code：

| 類型 | `s` | `t` | 預期 | 要驗證什麼 |
| --- | --- | --- | --- | --- |
| 官方成立 | `"anagram"` | `"nagaram"` | `true` | 相同內容、不同順序 |
| 官方不成立 | `"rat"` | `"car"` | `false` | 字元種類不同 |
| 最小成立 | `"a"` | `"a"` | `true` | 單字元相同 |
| 最小不成立 | `"a"` | `"b"` | `false` | 單字元不同 |
| 長度不同 | `"ab"` | `"a"` | `false` | 能否提早失敗 |
| 相同字串 | `"abc"` | `"abc"` | `true` | 不要求順序必須不同 |
| 次數不同 | `"aab"` | `"abb"` | `false` | 不能只比較字元種類 |
| 全部重複 | `"aaaa"` | `"aaaa"` | `true` | 大量相同字元 |
| 易誤判 | `"ab"` | `"aa"` | `false` | 一邊缺字、一邊多字 |
| 壓力方向 | `"a"` 重複 50,000 次 | 最後一字改為 `"b"` | `false` | 最長量級仍可接受 |

> 空字串不在官方輸入範圍內。若把函式當一般 utility，兩個空字串通常可定義為 anagram，但要明確區分這是延伸契約。

### 9. 第一個直覺

不要捏造「我本來就會」的答案，誠實記錄今天真正想到的第一版：

```txt
我的第一個直覺：


為什麼它一定正確：


它需要重複做的操作：

```

### 10. 複雜度預估

在寫 code 前先填：

```txt
令 n = s 的長度，m = t 的長度：
預估時間：O(          )
預估額外空間：O(          )
在 n、m 最多 50,000 時是否可接受：
```

### 11. 解題計畫

先寫三到五句 prose 或 pseudocode，再開始實作：

```txt
1.
2.
3.
4.
```

計畫應包含：

- 哪個條件可立即判定不成立？
- 需要保存什麼資訊？
- 掃描每個字元時如何更新？
- 最後什麼狀態才代表成立？

### 12. 第一次閉卷實作

JavaScript：

```js
function isAnagram(s, t) {
  // 前 30 分鐘先自己完成
}
```

Python：

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # 前 30 分鐘先自己完成
        pass
```

紀錄：

| 欄位 | JavaScript | Python |
| --- | --- | --- |
| 實作耗時 | ＿＿分鐘 | ＿＿分鐘 |
| 是否一次通過 | 是／否 | 是／否 |
| 錯誤類型 | 讀題／邏輯／語法／edge case | 讀題／邏輯／語法／edge case |
| 最卡的位置 | ＿＿＿＿ | ＿＿＿＿ |

共同紀錄：

```txt
看到哪層提示：未看／提示一／提示二／提示三
能否口述 Big-O：
```

<details>
<summary>提示一：需求層級</summary>

只知道兩邊「有哪些不同字元」夠不夠？`"aab"` 和 `"abb"` 能幫你找出還缺哪一項資訊嗎？

</details>

<details>
<summary>提示二：狀態方向</summary>

試著保存每個字元對應的一個整數狀態。讀到 `s` 的字元和 `t` 的字元時，能否讓它們對同一份狀態產生相反效果？

</details>

<details>
<summary>提示三：複雜度目標</summary>

長度不同可直接失敗。長度相同時，用一輪索引同時處理 `s[i]` 與 `t[i]`；最後確認所有字元的差值是否為零。目標是平均 `O(n)` 時間。

</details>

---

## Stage B｜解題分析：完成閉卷後再看（30–55 分鐘）

### 1. 看到這題，怎麼想到要用 Map／dict？

**先抓住這個想法：** 順序可以不一樣，但每個字母的數量要一樣。我需要記住「哪個字母有幾個」，所以可以用 `Map`；Python 用 `dict`。

可以照這個順序想：

1. **題目要我比什麼？** 不是同一個位置的字母是否相同，而是兩邊用的字母和數量是否相同。`"aab"` 和 `"aba"` 就應該通過。
2. **像 217 一樣用 Set 可以嗎？** 不夠。`"aab"` 和 `"abb"` 都有 `a`、`b`，但一邊有兩個 `a`，另一邊有兩個 `b`。Set 會把這個差別丟掉。
3. **最直接怎麼確認數量？** 每看到一個字母，就回頭數它在兩個字串裡各有幾個。能解，但又看到同一個字母時，就把剛才數過的事情重做一次。
4. **那就把次數記下來？** 對。需要的是像 `a → 2`、`b → 1` 這種紀錄：用字母找到它的數量。這正是 Map／dict 適合做的事。
5. **要記兩份嗎？** 可以各記一份再比較，也可以只記「兩邊差幾個」：讀到 `s` 的字母加一，讀到 `t` 的字母減一，最後每個字母都剩零就相同。

例如 `s = "aab"`、`t = "abb"`：數完後 `a` 差 `+1`、`b` 差 `-1`，代表 `s` 比 `t` 多一個 `a`、少一個 `b`，所以不相同。

**那為什麼不用陣列？** 這題保證只有 `a` 到 `z`，用 26 格陣列分別記每個字母的數量也很好。這篇用 Map／dict，是為了直接練習「用字母找到數量」；Map 不是唯一解。

下次可以這樣分：

> 只問「出現過沒」→ 想 Set；還要知道「出現幾次」→ 想 Map／dict 計數；如果種類很少又固定，也可以用固定大小的陣列。

這題的 Pattern 就是「把兩邊的數量記下來，看能不能全部抵銷」。

### 2. 最直接但較慢的解法

對 `s` 的每個字元，重新計算它在兩邊出現幾次。

#### JavaScript 暴力解

```js
function countCharacter(text, target) {
  let count = 0;

  for (const character of text) {
    if (character === target) {
      count += 1;
    }
  }

  return count;
}

function isAnagramRepeatedCount(s, t) {
  if (s.length !== t.length) {
    return false;
  }

  for (const character of s) {
    if (countCharacter(s, character) !== countCharacter(t, character)) {
      return false;
    }
  }

  return true;
}
```

#### Python 暴力解

```python
def is_anagram_repeated_count(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False

    for character in s:
        if s.count(character) != t.count(character):
            return False

    return True
```

長度相同時，若 `s` 中每個字元在 `t` 都有相同次數，兩邊就擁有相同的字元 multiset；任一字元次數不同就不成立。

最差時間是 `O(n²)`：外層最多走訪 `n` 次，每次計數又要掃描字串。額外空間為 `O(1)`。

### 3. 暴力解的瓶頸

假設 `s = "aaaa...a"`，外層每次讀到 `a` 都會重新計算相同的次數。第一次取得的資訊沒有保存，之後又重做相同掃描。

真正要加速的是：

```txt
讀到一個字元時，更新並取得它目前的次數差。
```

### 4. 從瓶頸推導資料結構

不要每次都回頭重數。用一份 Map／dict 記住「每個字母目前差幾個」：

- key（用來查找的名字）是字母，例如 `a`。
- value（記下來的數字）是目前 `s` 讀到的數量，減掉 `t` 讀到的數量。
- 讀到 `s[i]` 就加一，讀到 `t[i]` 就減一。
- 最後每個差值都等於零，就代表兩邊每個字母的數量一樣。

JavaScript 用 `Map`，Python 用 `dict[str, int]`。一般雜湊實作下，找到並更新一個字母的紀錄平均是 `O(1)`，不必重新掃描字串。

### 5. 為什麼不是 Set

| 結構 | 保存的資訊 | 本題評估 |
| --- | --- | --- |
| Set／`set[str]` | 字元是否至少出現過 | 會丟失重複次數；`"aab"` 與 `"abb"` 都只剩 `{a, b}` |
| Map／`dict[str, int]` | 每個字元的次數差 | 正好保存判斷所需資訊 |
| 長度 26 的整數陣列 | 每個小寫字母的次數差 | 官方限制下可行且空間固定，但 Unicode follow-up 要改寫 |
| 排序後比較 | 讓相同字元聚在一起 | 簡單，但時間為 `O(n log n)` 且會建立排序結果 |
| `Counter` | Python 標準函式庫的頻率映射 | Production 很清楚，但今天仍要能親手解釋 invariant |

### 6. 最佳解法步驟

1. 若兩個字串長度不同，立即回傳 false。
2. 建立空的 frequency balance。
3. 對每個索引 `i`，將 `s[i]` 的 balance 加一，`t[i]` 的 balance 減一。
4. 走訪完成後，檢查每個差值。
5. 全部為零回傳 true；任一非零回傳 false。

### 7. 核心不變量

處理完索引 `0...i` 後：

> 對任一字元 `c`，`balance[c]` 等於 `c` 在 `s[0...i]` 的出現次數，減掉它在 `t[0...i]` 的出現次數。

完整處理後：

- 所有差值為零，代表每個字元在兩邊總次數相同。
- 任一差值不為零，代表至少有一個字元多出或缺少。

### 8. 手動演算

以 `s = "aab"`、`t = "aba"` 為例：

| `i` | `s[i]` | `t[i]` | 更新後 balance | 解讀 |
| ---: | --- | --- | --- | --- |
| 0 | `a` | `a` | `{a: 0}` | 目前 a 抵銷 |
| 1 | `a` | `b` | `{a: 1, b: -1}` | s 暫時多 a、少 b |
| 2 | `b` | `a` | `{a: 0, b: 0}` | 所有差值歸零 |

中途不必要求每個差值都是零；字元順序不同時，中間狀態本來就可能正負變化。

### 9. 最佳化完整實作

#### JavaScript

```js
function isAnagram(s, t) {
  if (s.length !== t.length) {
    return false;
  }

  const balance = new Map();

  for (let index = 0; index < s.length; index += 1) {
    const sourceCharacter = s[index];
    const targetCharacter = t[index];

    balance.set(sourceCharacter, (balance.get(sourceCharacter) ?? 0) + 1);
    balance.set(targetCharacter, (balance.get(targetCharacter) ?? 0) - 1);
  }

  for (const difference of balance.values()) {
    if (difference !== 0) {
      return false;
    }
  }

  return true;
}
```

#### Python

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        balance: dict[str, int] = {}

        for source_character, target_character in zip(s, t):
            balance[source_character] = balance.get(source_character, 0) + 1
            balance[target_character] = balance.get(target_character, 0) - 1

        return all(difference == 0 for difference in balance.values())
```

Python 的 `zip(s, t)` 在這裡安全，是因為前面已確認長度相同。若漏掉長度檢查，`zip` 會在較短輸入結束時停止，剩餘字元可能完全沒被處理。

### 10. 可執行測試

#### JavaScript：Node.js

```js
const assert = require("node:assert/strict");

function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const balance = new Map();

  for (let index = 0; index < s.length; index += 1) {
    const source = s[index];
    const target = t[index];
    balance.set(source, (balance.get(source) ?? 0) + 1);
    balance.set(target, (balance.get(target) ?? 0) - 1);
  }

  return [...balance.values()].every((difference) => difference === 0);
}

const cases = [
  ["anagram", "nagaram", true],
  ["rat", "car", false],
  ["a", "a", true],
  ["a", "b", false],
  ["ab", "a", false],
  ["abc", "abc", true],
  ["aab", "abb", false],
  ["aaaa", "aaaa", true],
  ["ab", "aa", false],
  ["a".repeat(50_000), `${"a".repeat(49_999)}b`, false],
];

for (const [source, target, expected] of cases) {
  assert.equal(isAnagram(source, target), expected);
}

console.log("All JavaScript tests passed.");
```

#### Python

```python
def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False

    balance: dict[str, int] = {}

    for source_character, target_character in zip(s, t):
        balance[source_character] = balance.get(source_character, 0) + 1
        balance[target_character] = balance.get(target_character, 0) - 1

    return all(difference == 0 for difference in balance.values())


def test_is_anagram() -> None:
    cases: list[tuple[str, str, bool]] = [
        ("anagram", "nagaram", True),
        ("rat", "car", False),
        ("a", "a", True),
        ("a", "b", False),
        ("ab", "a", False),
        ("abc", "abc", True),
        ("aab", "abb", False),
        ("aaaa", "aaaa", True),
        ("ab", "aa", False),
        ("a" * 50_000, "a" * 49_999 + "b", False),
    ]

    for source, target, expected in cases:
        actual = is_anagram(source, target)
        assert actual is expected, (
            f"is_anagram({source!r}, {target!r}) "
            f"returned {actual}, expected {expected}"
        )


if __name__ == "__main__":
    test_is_anagram()
    print("All Python tests passed.")
```

### 11. 複雜度分析

令 `n = len(s)`、`m = len(t)`，`k` 是兩個輸入中不同字元的數量：

- 長度不同時：`O(1)` 時間、`O(1)` 額外空間，直接回傳。
- 長度相同時：走訪 `n` 組字元，最後最多檢查 `k` 個差值，所以平均時間為 `O(n + k)`，簡寫為 `O(n)`。
- 一般字元集合下，Map／dict 最多保存 `k` 個 key，因此額外空間是 `O(k)`，最差 `O(n)`。
- 官方只有 26 個小寫英文字母，`k <= 26`，所以也可說相對輸入長度是 `O(1)` 額外空間；必須同時說明這依賴固定 alphabet。
- 雜湊查找的 `O(1)` 是一般情況的平均成本，不是所有情況的絕對保證。

排序替代方案：

```js
function isAnagramBySorting(s, t) {
  return [...s].sort().join("") === [...t].sort().join("");
}
```

```python
def is_anagram_by_sorting(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)
```

排序時間為 `O(n log n + m log m)`，而且兩種語言都會建立排序用的新集合。它的優點是短、直觀、較難寫錯；小型資料時完全可能是更好的工程選擇。

### 12. Edge Cases 與常見錯誤

- **只比較 Set：** 會忽略重複次數，將 `"aab"` 與 `"abb"` 誤判為相同。
- **漏掉長度檢查：** Python `zip` 會截短；JavaScript 也可能忽略另一邊剩餘內容。
- **中途看到負值就回傳：** 同步掃描時順序不同，中途 balance 可正可負，不代表最後不能抵銷。
- **先加後減寫錯 key：** `s[i]` 要增加，`t[i]` 要減少，兩次更新都要讀取各自最新值。
- **把 Map／dict 單次平均 `O(1)` 說成總成本：** 總共仍走訪 `n` 次，所以是平均 `O(n)`。
- **空間永遠寫 `O(1)`：** 只有固定 26 字母時才成立；一般 Unicode 應寫 `O(k)`。
- **擅自 lowercase 或移除空白：** 會改變官方契約。
- **JavaScript 直接用索引處理任意 Unicode：** 索引走訪的是 UTF-16 code units，不能直接等同使用者看見的完整字元。

### 13. 為什麼不用其他方法

| 方法 | 何時合理 | 為什麼今天不選為主解 |
| --- | --- | --- |
| 重複 count | 輸入很小、先求正確 | 最差 `O(n²)`，重算相同資訊 |
| 排序後比較 | 小型資料、可讀性最重要 | `O(n log n)` 且建立排序結果 |
| Python `Counter(s) == Counter(t)` | Production Python、團隊熟悉標準函式庫 | 很適合，但今天要親手練狀態與 invariant |
| 長度 26 的 array/list | 永遠只有 `a` 到 `z`，重視常數成本 | Unicode follow-up 要重寫索引策略 |
| Map／dict balance | 要線性處理並自然延伸到較大字元集合 | 使用 `O(k)` 狀態，但最符合今天的推導 |

### 14. Unicode Follow-up

Python `dict` 與 JavaScript `Map` 都能用更大的字元集合當 key，但「支援 Unicode」不只換資料結構：

- Python 字串迭代以 Unicode code points 為主，但視覺相同文字仍可能有不同 normalization forms。
- JavaScript `for...of` 比索引更接近逐 code point；`string.length` 與 `string[index]` 則以 UTF-16 code units 為基礎。
- 人眼的一個 grapheme cluster 仍可能包含多個 code points。
- 是否 NFC／NFD normalization、是否 case-fold、是否按 grapheme cluster 比較，必須由產品契約決定。

Python normalization 範例：

```python
import unicodedata


def normalize_for_comparison(text: str) -> str:
    return unicodedata.normalize("NFC", text)
```

不要在官方小寫英文字母題目裡額外做這一步；這是 follow-up 的需求決策。

---

## Stage C｜解題後：遷移到真實工程（55–60 分鐘＋延伸）

### 【這個資料結構／演算法是為了解決什麼問題？】

**回答：** 這題用 Map／dict 解決的是「我要知道每一種東西有幾個，不想每次都從頭數」。

例如已經數出兩個 `a`，下次再看到 `a`，把紀錄從 2 改成 3 就好，不用再翻整個字串。比較兩份資料時，還可以一邊加、一邊減，最後看每一項是不是剛好抵銷。

所以這題比 217 多一個要求：217 記「有沒有」，242 要記「有幾個」。**Map 本身不會自動幫忙計數，是我們用它保存字母和數量，再逐次更新。**

每次回頭重數，整體最差會到 `O(n²)`；改成邊讀邊更新紀錄，平均是 `O(n)`。代價是需要 `O(k)` 額外記憶體，`k` 是不同字母的數量。本題只有 26 種小寫字母，也能用 26 格陣列，空間不會隨字串長度增加。

### 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

#### 情境 A：出貨前，確認每種商品都裝對數量

訂單要兩件 A、一件 B；掃描器卻掃到一件 A、兩件 B。雖然總共都是三件，也都有 A 和 B，還是不能算正確。這就像 `"aab"` 和 `"abb"`。

- **原本麻煩在哪？** 每檢查一種商品，都把訂單和掃描紀錄重新翻一遍數數量；或者先排序再比較，但還要另外算出缺哪種、多哪種。
- **怎麼套用 242？** 把字母換成商品編號（SKU）。訂單數量加一、掃描數量減一；最後 A 是 `+1` 就表示少裝一件 A，B 是 `-1` 就表示多裝一件 B。兩份清單各讀一遍，就能整理出差多少。
- **做到哪裡就不夠？** 相同掃描事件若因網路重送兩次，要先用事件 ID 排除重送，否則會多算。這份計數也只負責核對；真的修改庫存時，還要靠資料庫交易等機制處理同時修改的情況。

#### 情境 B：前端判斷使用者有沒有改動商品清單

假設清單用重複的商品 ID 表示數量，使用者可以調整順序。原本是 `[A, A, B]`，改成 `[B, A, A]` 不算改內容；改成 `[A, B, B]` 就算。

- **原本麻煩在哪？** 按位置比較會把換順序當成內容變更；只比 Set 又看不出數量變了。若對每個 ID 都重新數一次，清單大、比對頻繁時也會做很多重複工作。
- **怎麼套用 242？** 分別記每個商品 ID 的數量，或累積前後數量差。全部相同才表示商品和數量沒改；不用在意排列順序。
- **做到哪裡就不夠？** 如果價格、規格或顯示順序也算變更，就得另外比較，不能只看 ID 的數量。清單只有幾筆時，先排序再比較也可能更簡單。

下面用出貨核對示範完整做法。

### 1. 工程遷移情境：倉儲出貨 SKU 對帳

- `expectedSkus` 來自已確認訂單。
- `scannedSkus` 來自包裝站掃描器。
- 順序不重要，但重複數量非常重要。
- 系統不只要 boolean，也要告訴操作員缺少與多出的 SKU。

### 2. 常見直覺寫法

```js
function shipmentMatches(expectedSkus, scannedSkus) {
  return [...expectedSkus].sort().join("\u0000") ===
    [...scannedSkus].sort().join("\u0000");
}
```

```python
def shipment_matches(expected_skus: list[str], scanned_skus: list[str]) -> bool:
    return sorted(expected_skus) == sorted(scanned_skus)
```

兩個版本都正確且容易閱讀。對幾十筆 SKU 的低頻操作，可能已經足夠。

### 3. 潛在問題與觸發門檻

當單批數萬筆、每秒大量批次、對帳位於 latency-sensitive path，或還要輸出數量差時，排序才可能成為值得處理的瓶頸。先以 production-sized fixture profiling；不要只因為看到 `sort` 就預設必須最佳化。

### 4. 套用本題技巧

把「character → count」替換成「SKU → count」：預期清單增加 count、掃描清單減少 count。差值為正代表缺少，為負代表多掃。重複 SKU 保留數量語意，輸入順序則不影響結果。

### 5. Production 風格優化

```python
from collections import Counter
from dataclasses import dataclass


@dataclass(frozen=True)
class ReconciliationResult:
    matches: bool
    missing: dict[str, int]
    unexpected: dict[str, int]


def reconcile_shipment(
    expected_skus: list[str],
    scanned_skus: list[str],
) -> ReconciliationResult:
    expected_counts = Counter(expected_skus)
    scanned_counts = Counter(scanned_skus)

    missing = dict(expected_counts - scanned_counts)
    unexpected = dict(scanned_counts - expected_counts)

    return ReconciliationResult(
        matches=not missing and not unexpected,
        missing=missing,
        unexpected=unexpected,
    )
```

```python
result = reconcile_shipment(
    expected_skus=["A", "A", "B", "C"],
    scanned_skus=["C", "A", "B", "D"],
)

assert result.matches is False
assert result.missing == {"A": 1}
assert result.unexpected == {"D": 1}
```

Production 行為要明確：

- 重複 SKU 代表數量，不可先轉成 Set。
- 回傳 dict 適合 JSON serialization，但不承諾業務排序；UI 需要固定順序時在 presentation layer 排序。
- 函式不修改呼叫者傳入的 list。
- SKU 大小寫、空白與 alias normalization 應在進入對帳前依業務規則完成。
- 同一掃描事件若可能重送，要先用 event ID 做 idempotency；頻率映射無法辨認網路重送。

### 6. 優化前後比較

| 面向 | 排序比較 | 頻率對帳 |
| --- | --- | --- |
| 時間 | `O(n log n + m log m)` | 平均 `O(n + m)` |
| 額外空間 | 排序結果 `O(n + m)` | `O(k)`，`k` 為不同 SKU 數 |
| 順序 | 排序後才比較 | 天然忽略輸入順序 |
| 重複數量 | 保留 | 保留 |
| 錯誤細節 | 需額外 diff | 可直接產生 missing／unexpected counts |
| 小資料可讀性 | 非常簡單 | 程式較多，但回傳資訊完整 |

### 7. 使用界線與代價

小資料、低頻、只需 boolean，且 profile 沒顯示排序為瓶頸時，簡單排序版更容易維護。資料大、呼叫頻繁、要輸出數量差或接收 stream 時，頻率映射較合適。

代價是 `O(k)` 額外記憶體；key 必須 hashable 且 equality 語意穩定。跨服務資料另需處理 transaction、版本、一致性與重送。

### 8. Code Review 說法

> 目前排序比較的邏輯是正確的。這條路徑每批可能到數萬筆，而且後面還要顯示缺少與多出的 SKU；可以考慮一次走訪建立 frequency map，平均時間由 `O(n log n)` 降為 `O(n)`，也能直接產生數量差。代價是 `O(k)` 記憶體。建議先用 production-sized fixture benchmark，確認排序確實影響 SLO 再改。

### 9. 變形題

1. 忽略大小寫與空白時，normalization 應由哪一層負責？
2. 輸入是無法一次載入記憶體的 stream，要如何逐批更新狀態？何時才能宣布相同？
3. 要回傳最少刪除幾個字元才能互為 anagram，frequency difference 如何轉成答案？
4. 包含 Unicode 時，code point、normalization 與 grapheme cluster 如何改變契約？

### 10. 一分鐘複習卡

| 問題 | 一句答案 |
| --- | --- |
| 題目比較什麼？ | 每個字母的數量是不是一樣，順序不重要 |
| 怎麼想到 Map／dict？ | 只記有沒有不夠，還要用字母查到它的數量 |
| 客觀線索 | 順序可變，但每個字元與重複次數要保留 |
| 暴力解 | 對每個字元重複計數，最差 `O(n²)` |
| 瓶頸 | 相同次數資訊被一再重新計算 |
| 最佳化 | 一輪維護字元到次數差的 Map／dict |
| 每輪都要保持什麼？ | balance 記的是兩邊目前讀過的每個字母差幾個 |
| 時間 | 長度相同時平均 `O(n)` |
| 空間 | 一般 `O(k)`；固定 26 字母時可視為 `O(1)` |
| 常見錯誤 | 只比較 Set、漏長度檢查、中途負值就失敗 |
| 排序 trade-off | 更短直觀，但 `O(n log n)` 且建立排序結果 |
| Production 用途 | 對帳兩批順序無關、重複數量重要的資料 |
| 使用界線 | 本地 Map／dict 不解決一致性、重送與 transaction |

## 今日回填

```txt
實際耗時：＿＿分鐘
完成狀態：未完成／提示後完成／閉卷完成
看到提示層級：未看／提示一／提示二／提示三／Stage B

JavaScript 卡點：
Python 卡點：
我的第一版時間與空間：
我最後能口述的 invariant：
下次看到什麼需求，會想到用 Map／dict 記次數：
```

## 延伸連結

- [第 1 週 Day 2：完整 140 分鐘日課](/docs/career-blueprint/week-01-day-02)
- [LeetCode 242. Valid Anagram](https://leetcode.com/problems/valid-anagram/)
- [NeetCode 150 題單](https://neetcode.io/practice/practice/neetcode150)
