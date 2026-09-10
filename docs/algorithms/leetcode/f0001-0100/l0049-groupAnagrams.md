---
title: "[0049] Group Anagrams"
sidebar_label: "[0049] Group Anagrams"
description: "LeetCode 49 Group Anagrams 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - TypeScript
  - Python
  - Array
  - Interview
keywords: ["0049", "Group Anagrams", "TypeScript", "Python", "面試練習"]
---

# [0049] Group Anagrams

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-09-14（W02）<br />
> 整理／官方題面核對：2026-09-09；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成（0–25 分鐘）

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 49／Medium |
| 廣義分類 | Array |
| 官方題面 | [LeetCode：Group Anagrams](https://leetcode.com/problems/group-anagrams/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

你會拿到一份字串清單 `strs`。請把「只需要重新排列字母，就能變成彼此」的字串放在同一組，最後回傳所有群組。

例如 `eat` 可以重排成 `tea`，所以兩者同組；`tan` 沒辦法只靠重排變成 `eat`，所以要放到另一組。不能增加或刪除字母，因此 `ab` 和 `aab` 不同組。

每筆輸入都要保留，包括重複字串與空字串。這題要整理整份清單，不是只判斷兩個字是否相同，也不是找到一組就結束。

### 3. Input / Output 契約

```ts
function groupAnagrams(strs: string[]): string[][];
```

Python：

```python
def group_anagrams(strs: list[str]) -> list[list[str]]:
    ...
```

| 項目 | 契約 |
| --- | --- |
| `strs` | 至少一筆的小寫英文字串陣列，字串本身可以是空字串 |
| 回傳值 | 二維字串陣列；每個內層陣列是一組 |
| 是否回傳位置 | 否，保留原字串 |
| 同組條件 | 字母種類與每種字母的出現次數都相同 |
| 不同群組 | 不能再合併成同一組異位詞 |
| 重複輸入 | 出現幾次，就必須在結果保留幾次 |
| 組別與組內順序 | 任意順序皆可 |
| 是否修改輸入 | 本文實作不修改 `strs`，這是本頁額外約定 |

`[""]` 表示有一筆空字串，和沒有資料的 `[]` 不同。官方輸入不包含空陣列，別把它當成必考的官方範例。

### 4. 官方範例拆解

#### 範例一

```text
輸入：strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
輸出：[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
```

- `eat`、`tea`、`ate` 可以只靠重新排列變成彼此。
- `tan` 和 `nat` 也可以互相重排，但無法變成上一組的字。
- `bat` 沒有可配成同組的其他字串，因此自己成一組。

回傳 `[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]` 也正確。驗證答案時要檢查分組內容，不能要求和範例的排列完全一致。

#### 範例二

```text
輸入：strs = [""]
輸出：[[""]]
```

空字串仍是一筆輸入，因此要有一個群組收下它；回傳 `[]` 或 `[[]]` 都遺失了這筆資料。

#### 範例三

```text
輸入：strs = ["a"]
輸出：[["a"]]
```

只有一筆時也必須回傳二維陣列。不能因為沒有其他字串可以比較，就直接回傳 `["a"]`。

### 5. 限制條件

- `1 <= strs.length <= 10^4`
- `0 <= strs[i].length <= 100`
- `strs[i]` 只包含小寫英文字母。

先把兩個規模分開：有多少個字串，以及每個字串有多長。最多一萬筆、每筆一百個字元，總共最多一百萬個字元；你的方法會把同一批字元重看幾次？

題面沒有要求結果排序，也沒有指定必須達到哪個 Big-O。先估算自己的方法，不要把常見的面試追問當成官方額外限制。

### 6. 客觀關鍵字與線索

「可以重排」「每個字都要分組」「輸出順序不限」「小寫英文字母」；先記錄，不急著套方法。

### 7. 面試確認問題

| 可以確認的問題 | 本題答案 |
| --- | --- |
| 大小寫要視為相同嗎？ | 本題只有小寫英文，不必另外轉換 |
| 空字串要保留嗎？ | 要，官方範例已有說明 |
| 相同字串出現兩次可以去重嗎？ | 不可以，兩筆都要分組 |
| 只有字母種類相同就算同組嗎？ | 不算，每種字母的次數也要相同 |
| 輸出順序重要嗎？ | 組別與組內順序皆不限 |
| 可以修改原陣列嗎？ | 本頁選擇不修改，面試時可先說明 |

題面已回答的條件，口述確認理解即可。若換成產品需求，才需要再問 Unicode、大小寫、標點與重複資料的定義。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `[["eat", "tea", "tan", "ate", "nat", "bat"]]` | `[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]` |
| 官方 2 | `[[""]]` | `[[""]]` |
| 官方 3 | `[["a"]]` | `[["a"]]` |
| 自訂：保留重複 | `[["ab", "ba", "ab"]]` | `[["ab", "ba", "ab"]]` |
| 自訂：次數不同 | `[["aab", "abb"]]` | `[["aab"], ["abb"]]` |
| 自訂：重複空字串 | `[["", ""]]` | `[["", ""]]` |
| 自訂：單字最大長度 | `["a".repeat(100), "b".repeat(100)]`（產生輸入的寫法） | 兩個各含一筆的群組 |



### 9. 第一個直覺

先在自己的筆記中回答，不必追求最佳解：

1. 新字串來了，你怎麼判定它能放進哪一組？
2. 怎麼分辨 `ab` 與 `aab`，又不會把 `ab` 與 `ba` 分開？
3. 需要和組內每個字比較，還是只比較一個代表就足夠？為什麼？
4. 找到可放入的群組之後，哪些工作能停、哪些還不能停？
5. 同樣的字出現兩次時，你的流程會不會遺失一筆？

> 我的第一個想法：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿

沒有提供這次作答，因此這裡不代填你的思路。先自己寫完，再與 Stage B 對照。

### 10. 複雜度預估

令 `n` 是字串數、`m` 是最長字串長度，先估算：

- 每來一個新字串，最多要嘗試多少個群組？
- 判斷兩個字能否同組，是固定次數的工作，還是跟字串長度有關？
- 全部都不同組時，工作量會如何成長？
- 如果所有字串都是空字串，是否仍需要走過每筆輸入？
- 除了輸出群組，你還建立了哪些臨時資料？

> 我的預估：時間 `O(____)`，額外空間 `O(____)`；輸出空間 `O(____)`。

### 11. 解題計畫

```txt
1. 我要按照什麼順序處理輸入：
2. 每一步如何判定／產生答案：
3. 何時停止，如何確認沒有漏解：
我認為最容易錯的測資與理由：
```

### 12. 第一次閉卷實作

#### TypeScript

```ts
function groupAnagrams(strs: string[]): string[][] {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def group_anagrams(strs: list[str]) -> list[list[str]]:
    raise NotImplementedError("先完成自己的版本")
```

```txt
實際耗時：
結果／失敗測資：
錯誤類型（契約／推導／邊界／語法／複雜度）：
卡點：
看到第幾層提示：
```

#### 分級提示

<details>
<summary>提示一：從需求再想一步</summary>

同組字串究竟有哪些資訊一定相同？

</details>

<details>
<summary>提示二：解法方向</summary>

為每個字串建立可比較的代表，再用 Map／dict 收集群組。

</details>

<details>
<summary>提示三：接近解法</summary>

固定 26 個字母時，次數向量就是代表；字串 key 需要分隔符，避免 1、11 與 11、1 混淆。

</details>

---

## Stage B｜解題分析：完成閉卷後再看（25–50 分鐘）

:::warning 先完成第一次作答

以下開始包含解法。若還沒自己嘗試，先停在 A 區。

:::

### 1. 看到這題，怎麼想到要用字母次數與 Map／dict 分組？

**回答：** 我不想每來一個字，就把所有群組重新找一遍。只要能替每個字算出一個「同組一定相同、不同組一定不同」的代表，就能用這個代表直接找到群組。

可以順著下面的過程推導，而不是看到字串就背 Map：

1. 題目要把全部字串分類，因此每筆都得處理。
2. 最直接的方式是拿新字串和各組的一個代表比較，找到能重排成彼此的組就加入。
3. 但群組越來越多，每筆又要重新找一次；比較過程還可能一再搜尋相同字母。
4. `eat`、`tea` 的字母順序不同，但兩者都是 a、e、t 各一次。真正決定分組的是每種字母各有幾個。
5. 把這份次數資料變成穩定的 key，Map／dict 就能保存「key → 該組所有原字串」。

```text
 eat → a:1, e:1, t:1 ─┐
 tea → a:1, e:1, t:1 ─┴→ ["eat", "tea"]
 tan → a:1, n:1, t:1 ───→ ["tan"]
```

只記字母種類的 Set 不夠：`ab` 和 `aab` 都有 a、b，卻不能同組。只記某種組別「出現過」也不夠，因為最後要回傳每組完整字串，而非不同組別的數量。

Map 不會自動理解異位詞。**計數負責判定什麼叫同組，Map 負責快速找到那一組。** 這是兩個不同責任。

**下次可以怎麼想：** 如果要依內容分組，而且內容順序不影響相等性，先問「哪些資訊能完整代表一組」，再用代表查找群組；若次數也影響相等性，就不能只留下種類。

### 2. 暴力解／最直接的正確解

對每個字串逐組嘗試。比較時用一份可刪除字元清單逐字配對，配不齊就不是同組。這刻意保留最直接的正確比較方式，方便看到兩層重複工作。

#### TypeScript

```ts
function groupAnagramsBrute(strs: string[]): string[][] {
  function same(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    const remaining = [...b];
    for (const c of a) {
      const i = remaining.indexOf(c);
      if (i < 0) return false;
      remaining.splice(i, 1);
    }
    return true;
  }
  const groups: string[][] = [];
  for (const word of strs) {
    const group = groups.find(g => same(word, g[0]));
    if (group) group.push(word);
    else groups.push([word]);
  }
  return groups;
}
```

#### Python

```python
def group_anagrams_brute(strs: list[str]) -> list[list[str]]:
    def same(a: str, b: str) -> bool:
        if len(a) != len(b):
            return False
        remaining = list(b)
        for c in a:
            if c not in remaining:
                return False
            remaining.remove(c)
        return True
    groups: list[list[str]] = []
    for word in strs:
        for group in groups:
            if same(word, group[0]):
                group.append(word)
                break
        else:
            groups.append([word])
    return groups
```

### 3. 暴力解的瓶頸

這個版本有兩層重複工作。

第一層是找群組。若前面已經有 `g` 組，新字串最多要和 `g` 個代表比較。群組數一路增加時，候選比較次數的上界為：

```text
0 + 1 + 2 + ... + (n - 1) = n × (n - 1) / 2
```

`n = 10,000` 時接近五千萬次候選比較。這是次數估算，不是實測耗時；字串長度不同會提早失敗，實際工作量也可能少很多。

第二層是比較字串。對每個字母執行 `indexOf`／清單搜尋，再刪除已配到的一個字母，搜尋與搬移元素都可能花 `O(m)`；最多做 `m` 次，一次配對的上界為 `O(m²)`。

合起來的保守上界是 `O(n²(m² + 1))`。保留 `+1` 是為了涵蓋空字串仍有候選比較的成本，並不代表全空字串真的會產生 `n²` 次比較：它們會很快進入同一組。

真正要改善的是「每次重新找群組」和「比較時反覆搜尋字母」，不是單純把迴圈寫短。

### 4. 從瓶頸推導資料結構／演算法

#### 第一步：不用反覆找字母，改成數每種字母

`aab` 和 `aba` 都是 a 有 2 個、b 有 1 個；`abb` 則是 a 有 1 個、b 有 2 個。逐字掃一次就能得到這些數字，不必反覆刪字配對。

本題只有 a 到 z，可以固定用 26 格：第 0 格記 a、第 1 格記 b，一直到第 25 格記 z。

#### 第二步：別再拿這份次數和每一組逐一比

如果只把比較函式改成計數，卻仍然用 `groups.find(...)`，群組多時還是會反覆掃描。下一步是把 26 格次數轉成 key，讓相同次數直接指向同一組。

```text
原本：新字串 → 和第 1 組比 → 和第 2 組比 → ...
現在：新字串 → 算一次次數 → 產生 key → 取得群組
```

TypeScript 可以把數字用 `#` 接起來；Python 可以轉成 tuple。這不是隨便選一個摘要，而是完整保留 26 個位置與次數，不能讓不同內容得到相同 key。

#### 排序其實也是一種代表

把 `eat`、`tea`、`ate` 都排序成 `aet`，也能達到相同目的。原筆記的歷史解法就是這條路。計數版本利用固定字母集合省下排序，但核心概念都是「先建立穩定代表，再分組」。

### 5. 為什麼是這個資料結構／方法

| 需要的操作 | 選擇 | 原因與成本 |
| --- | --- | --- |
| 記每個字母出現幾次 | 26 格陣列 | 字母可直接對應位置，每次累加 `O(1)` |
| 讓相同內容能比較相等 | TS 字串 key／Python tuple | 保留完整位置與次數；建 key 要讀過 26 格 |
| 由代表取得群組 | Map／dict | 一般雜湊情況下平均常數次查找，但仍要計入 key 的處理成本 |
| 保留同組每筆字串 | 陣列／list | 加到尾端的攤銷成本 `O(1)`，保留重複項 |

JavaScript 的兩個新陣列就算內容相同，也不是同一個 Map key。Python 的 list 則不能直接作 dict key；tuple 由整數構成時可雜湊，也會依內容判斷相等。

雜湊表若發生內部雜湊值碰撞，容器會再判斷 key 是否相等；這與我們把不同次數錯誤串成同一個 key 是兩回事。後者丟失的資訊，Map 無法替我們找回。

### 6. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const word of strs) {
    const counts = Array<number>(26).fill(0);
    for (const c of word) counts[c.charCodeAt(0) - 97]++;
    const key = counts.join('#');
    const group = groups.get(key);
    if (group) group.push(word);
    else groups.set(key, [word]);
  }
  return [...groups.values()];
}
```

#### Python

```python
def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups: dict[tuple[int, ...], list[str]] = {}
    for word in strs:
        counts = [0] * 26
        for c in word:
            counts[ord(c) - ord('a')] += 1
        key = tuple(counts)
        groups.setdefault(key, []).append(word)
    return list(groups.values())
```

#### `ord()` 是什麼？為什麼要減掉 `ord('a')`？

**`ord()` 會把一個字元轉成它的 Unicode 編碼數字。** 它不是在數字母出現幾次，而是幫我們找到這個字母應該使用哪一格。

```python
ord('a')  # 97
ord('b')  # 98
ord('c')  # 99
ord('z')  # 122
```

小寫英文字母的編碼是連續的。減掉 `ord('a')`，就能把 a 到 z 對應到陣列位置 0 到 25：

| 字母 `c` | `ord(c) - ord('a')` | 要更新的位置 |
| --- | --- | --- |
| `'a'` | `97 - 97 = 0` | `counts[0]` |
| `'b'` | `98 - 97 = 1` | `counts[1]` |
| `'c'` | `99 - 97 = 2` | `counts[2]` |
| `'z'` | `122 - 97 = 25` | `counts[25]` |

所以原本這一行：

```python
counts[ord(c) - ord('a')] += 1
```

可以拆成兩步理解：

```python
index = ord(c) - ord('a')  # 找出這個字母對應哪一格
counts[index] += 1        # 這個字母的出現次數加一
```

例如處理 `"aba"`：先把第 0 格加一，再把第 1 格加一，最後再把第 0 格加一。結果就是 a 有 2 個、b 有 1 個，其餘 24 格都是 0。

這個索引計算利用了本題「只有小寫 a 到 z」的條件；`ord()` 本身也能處理其他 Unicode 字元，但它們不一定能對應到這份 26 格陣列。

#### `tuple()` 是什麼？為什麼把 `counts` 轉成 tuple？

**tuple（元組）是一種有順序、建立後不能替換或增刪元素的序列。** 本題可以先把它想成「固定下來的一整排計數」。

```python
counts = [2, 1, 0]    # list：可以修改元素
key = tuple(counts)  # 轉成 tuple，得到 (2, 1, 0)

counts[0] = 9        # list 可以改
print(counts)        # [9, 1, 0]
print(key)           # (2, 1, 0)，先前建立的整數 tuple 不受影響
```

上面只用三格示範語法；本題實際會保留全部 26 格。`tuple(counts)` 不會排序，也不會去重，會依原順序保留每格次數。

為什麼要轉？因為 Python 的 dict 要求 key 可以被雜湊，也就是能供字典計算查找用的雜湊值。**list 不能直接當 dict key；本題這種全部由整數構成的 tuple 可以。**

```python
groups = {}

# groups[[2, 1, 0]] = ["aab"]  # TypeError：list 不能當 key
groups[(2, 1, 0)] = ["aab"]    # 整數 tuple 可以當 key
groups[(2, 1, 0)].append("aba")

print(groups[(2, 1, 0)])       # ['aab', 'aba']
```

注意：不是所有 tuple 都能當 key。如果裡面包含 list，例如 `([1, 2], 3)`，仍然不能當 dict key；本題裡面都是整數，所以沒有這個問題。

`"aab"` 與 `"aba"` 算出的 26 格次數完全相同。即使各自建立了新的 tuple，Python 仍會依元素內容判斷它們相等，因此可以找到同一個群組。

#### `tuple[int, ...]` 又是什麼意思？

```python
groups: dict[tuple[int, ...], list[str]] = {}
```

這是型別註記，意思是：

- `tuple[int, ...]`：元素都是整數、長度不固定的 tuple。這裡的 `...` 表示可以有任意多個整數，不是要在 key 裡放入省略號。
- `list[str]`：存放字串的 list，也就是某個群組。
- 整行：`groups` 是一個「整數 tuple → 字串清單」的字典，初始值為空字典 `{}`。

型別註記本身沒有規定長度必須是 26；是前面的 `counts = [0] * 26` 決定了本題 key 的長度。真正執行轉換的是 `tuple(counts)`。

把這幾行連起來讀就是：**用 `ord()` 找到字母的位置，累加次數；用 `tuple()` 固定這份計數，作為查找群組的 key。**

### 7. 最佳解法步驟

1. 為目前字串清空 26 格計數並逐字累加。
2. 把次數序列變成可穩定比較的 key。
3. 找到群組就加入原字串，否則建立新群組。
4. 回傳所有群組。

#### 細部拆解

假設輸入是 `strs = ["tea", "eat"]`，先只看外層第一輪 `word = "tea"`。以下在原程式各步驟加入 `print`，觀察資料如何改變。

先記住：`counts` 的 **26 個位置依序代表 a 到 z 出現幾次**，位置從 0 開始。

```text
位置： 0  1  2  3  4  ...  19  ...  25
字母： a  b  c  d  e  ...   t  ...   z
```

**① 建立空字典**

```python
groups: dict[tuple[int, ...], list[str]] = {}
print(groups)
```

印出：

```text
{}
```

目前還沒有任何群組。型別註記表示這份字典會保存「整數 tuple → 字串清單」，不會自動產生內容。

**② 外層迴圈取出第一個字串**

```python
for word in strs:
    print(word)
```

第一輪印出：

```text
tea
```

接下來先完成這個字串的所有處理，才會進入下一輪的 `"eat"`。

**③ 建立這個字串專用的計數清單**

```python
counts = [0] * 26
print(counts)
```

印出 26 個 `0`：

```text
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

還沒開始讀 `"tea"` 的字母，因此次數全部是零。這一行在外層迴圈裡，所以每個新字串都會得到一份全新的計數。

**④ 內層迴圈，依序讀取 t、e、a**

原本的 `counts[ord(c) - ord('a')] += 1` 可以拆成下面兩步，再印出結果：

```python
for c in word:
    index = ord(c) - ord('a')
    counts[index] += 1
    print(c, index, counts)
```

`ord()` 取得字元的編碼數字；減掉 `ord('a')`，就是找出該小寫英文字母對應的位置。

第一次讀到 `"t"`：

```python
# ord('t') - ord('a') = 116 - 97 = 19
counts[19] += 1
```

印出：

```text
t 19 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
```

意思是：**t 出現 1 次**。

第二次讀到 `"e"`：

```python
# ord('e') - ord('a') = 101 - 97 = 4
counts[4] += 1
```

印出：

```text
e 4 [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
```

意思是：**e、t 各出現 1 次**。

第三次讀到 `"a"`：

```python
# ord('a') - ord('a') = 97 - 97 = 0
counts[0] += 1
```

印出：

```text
a 0 [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
```

現在 `"tea"` 已經讀完：**a、e、t 各出現 1 次，其他字母都是 0 次**。上述三次加一就是內層迴圈做的事，不是執行完內層迴圈後再加一次。

**⑤ 把計數轉成 tuple，準備當字典的 key**

```python
key = tuple(counts)
print(key)
```

印出：

```text
(1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0)
```

數字和順序都沒改，從 list 的 `[...]` 轉成 tuple 的 `(...)`。本題由整數構成的 tuple 可以當 dict key，list 不可以。

這份 key 代表「a、e、t 各一個的那一組」。它沒有記錄原本的字母排列，所以之後 `"eat"` 也會產生相同的 key。

**⑥ 找到或建立群組，再加入 `"tea"`**

原本這一行：

```python
groups.setdefault(key, []).append(word)
```

可以拆成：

```python
group = groups.setdefault(key, [])
group.append(word)
```

`setdefault(key, [])` 的意思是：

- 字典裡已經有這個 key，就回傳它對應的清單。
- 還沒有這個 key，就先放入空清單 `[]`，再回傳那份清單。

目前 `groups` 是空的，因此執行第一步後：

```python
group = groups.setdefault(key, [])
print(group)
print(groups)
```

依序印出：

```text
[]
{(1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0): []}
```

接著加入目前的字串：

```python
group.append(word)  # word 是 "tea"
print(group)
print(groups)
```

依序印出：

```text
['tea']
{(1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0): ['tea']}
```

**`group` 就是字典裡的那份清單，不是另外複製的一份。** 所以對它 `append`，字典裡的群組也會一起改變。

觀察時應先執行原本那行，再 `print(groups)`。不要用 `print(groups.setdefault(key, []).append(word))` 查看群組，因為 `append()` 本身回傳的是 `None`；它的作用是修改清單。

**⑦ 第一輪結束，此時如果取出所有群組**

```python
print(list(groups.values()))
```

印出：

```text
[['tea']]
```

`groups.values()` 取出字典裡的群組清單，不包含前面的計數 key；外面的 `list(...)` 把這些群組收集成一份清單，因此是二維清單。

不過原程式的 `return` 在外層迴圈之外，**要等所有字串處理完才執行**。這裡只是先印出第一輪的中間狀態，不是提早回傳。

下一輪處理 `"eat"` 時，會重新建立 `counts`，算出同一個 key。這次 `setdefault` 會取得既有的 `['tea']`，不會用空清單覆蓋它；再加入 `"eat"`，最後回傳：

```text
[['tea', 'eat']]
```

### 8. 核心不變量：每輪都要保持什麼

處理完前 `i` 筆輸入後：

1. 前 `i` 筆每筆都恰好放入一個群組，重複值仍按出現次數保留。
2. 每個 key 對應群組中的字串，26 個字母次數都與 key 一致。
3. 同組字串共享同一個 key；次數不同的字串不會被混在一起。

一開始尚未處理任何輸入，空 Map 符合規則。每輪只為當前字串產生 key，再加入對應群組一次，所以不漏資料，也不多加資料；原本的群組關係不會被破壞。

掃完所有輸入後，規則就涵蓋整份清單，因此回傳 Map 的全部群組即為答案。這也解釋了為什麼「找到群組」只能結束本筆的查找，不能提早回傳整題答案。

### 9. 手動演算

以官方第一組輸入為例。表格只顯示非零次數，實際 key 仍包含全部 26 格。

| 新字串 | 非零次數 | 查找結果 | 處理後的所有群組 |
| --- | --- | --- | --- |
| `eat` | a:1 e:1 t:1 | 尚未建立 | `[["eat"]]` |
| `tea` | a:1 e:1 t:1 | 找到 eat 那組 | `[["eat", "tea"]]` |
| `tan` | a:1 n:1 t:1 | 尚未建立 | `[["eat", "tea"], ["tan"]]` |
| `ate` | a:1 e:1 t:1 | 找到 eat 那組 | `[["eat", "tea", "ate"], ["tan"]]` |
| `nat` | a:1 n:1 t:1 | 找到 tan 那組 | `[["eat", "tea", "ate"], ["tan", "nat"]]` |
| `bat` | a:1 b:1 t:1 | 尚未建立 | `[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]` |

再看容易遺漏的重複與空字串：

| 新字串 | key 的內容 | 行為 |
| --- | --- | --- |
| `""` | 26 格都是 0 | 建立 `[""]` |
| `""` | 26 格都是 0 | 加入同組，成為 `["", ""]` |
| `ab` | a:1 b:1，其餘 0 | 另建 `["ab"]` |
| `aab` | a:2 b:1，其餘 0 | 另建 `["aab"]` |
| `ba` | a:1 b:1，其餘 0 | 加入 ab 那組，成為 `["ab", "ba"]` |

每輪都要重新建立計數陣列。若沿用上一個字串的累積次數，第二筆開始的 key 就不再代表當前字串。

### 10. 複雜度分析

令 `n` 為字串數、`L` 為所有字串的總字元數、`g` 為最後群組數、`m` 為最長字串長度。

#### 時間：平均 `O(L + 26n)`

- 所有字串逐字累加，合計掃過 `L` 個字元。
- 每筆初始化 26 格，再建立 key。題目中每格最多 100，因此序列化與雜湊 key 的成本可用 `O(26)` 表示。
- 共 `n` 次加入群組，最後收集 `g` 組，且 `g <= n`。

固定 26 個字母與題目次數上限時，可簡寫為平均 `O(L + n)`；用最長字串估算則是 `O(n(m + 1))`。只寫 `O(nm)` 容易忽略 `m = 0` 時仍要處理所有空字串。

這裡採一般雜湊表平均效能，不是宣稱任意實作或所有碰撞情況都保證相同最壞時間。

#### 空間：輔助 `O(26g + 26)`，結果容器 `O(n + g)`

每個不同群組保留一份 key，共 `O(26g)`；目前字串使用一份 26 格臨時計數。各群組合計保存 `n` 個原字串參照，外層保存 `g` 組，因此結果容器為 `O(n + g)`。

把字母集合當常數且 `g <= n`，包含結果的總額外空間可簡寫為 `O(n)`。程式沒有複製每個原字串的內容；若把結果轉成 JSON 或傳到網路，另外需要處理總字元數 `L`。

暴力解的臨時字元清單最長 `m`，所以不計結果的額外空間為 `O(m + 1)`；結果本身同樣需要存下所有字串。

### 11. Edge cases 與常見錯誤

#### 只比較種類，漏掉重複次數

`aab` 與 `abb` 的字母種類都是 a、b，但次數不同；只比較 Set 會誤判。題目允許重排，不允許增刪字母。

#### 次數直接接起來，失去數字邊界

```text
a 有 1 個、b 有 11 個 → 不加分隔符的開頭：111
 a 有 11 個、b 有 1 個 → 不加分隔符的開頭：111
```

後面 24 格都為 0 時，整個 key 也相同。用 `counts.join("#")` 後，`1#11#0...` 與 `11#1#0...` 才能分開。

#### 用 JavaScript 陣列當成內容 key

```ts
const wrong = new Map<number[], string[]>();
wrong.set([1, 1], ["ab"]);
wrong.get([1, 1]); // undefined：這是另一個陣列物件
```

Map 不會逐格比較兩份陣列。先轉成字串，才能讓內容相同的兩次計數查到同一組。

#### 計數陣列沒有每筆重設

上一筆 `eat` 的次數若沒清空，再處理 `tea` 就會得到每種字母各 2 次。每個 key 必須只代表當前字串。

#### 把群組換成 Set，或排序後的字串當輸出

輸入 `["ab", "ba", "ab"]` 必須保留三筆。Set 去重會遺失第二個 `ab`；若只存排序後的 `ab`，則把原本的 `ba` 改掉了。key 用來查找，群組存原字串。

#### 測試要求固定順序，或把空字串丟掉

答案順序不限，測試可以排序副本後比較，但不能去重。`[""]` 的結果是 `[[""]]`，不是沒有群組；不要用 `if (!word) continue` 跳過它。

### 12. 為什麼不用其他方法

令 `mᵢ` 是第 `i` 個字串長度，以下都須另外保存輸出。

| 方法 | 主要成本 | 本題取捨 |
| --- | --- | --- |
| 逐組搜尋＋逐字刪除配對 | 上界 `O(n²(m² + 1))` | 正確且直覺，卻重複搜尋群組與字母 |
| 預先計數，再逐組比 26 格 | 上界 `O(L + 26n²)` | 改善字串比較，但仍反覆找群組 |
| 排序每個字串＋Map | 平均 `O(n + Σ mᵢ log(mᵢ + 1))` | 代表容易理解，原歷史解法可繼續使用 |
| 26 格計數＋Map／dict | 平均 `O(L + 26n)` | 利用固定小寫英文集合，不用排序 |
| 只用字母 Set | 資訊不足 | 無法區分字母種類相同、次數不同的字 |
| 字元碼加總 | 資訊不足 | `ad` 與 `bc` 的加總相同，卻不是異位詞 |

排序方案不是錯誤解法。短字串時常數成本也重要，不能只看 Big-O 就斷言計數在任何環境都更快。

若改成任意語言文字，26 格就不適用。要先確認「一個字元」指什麼、大小寫是否相同、是否需 Unicode 正規化，再選擇排序或以字元計數；不能只把 `c - 97` 換個數字就當作支援所有文字。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。共八組測資，最後一組特別檢查次數 key 沒有分隔符時容易發生的碰撞。

#### TypeScript

```ts
const cases: { args: [string[]]; expected: string[][] }[] = [
  {
    args: [["eat", "tea", "tan", "ate", "nat", "bat"]],
    expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]],
  },
  { args: [[""]], expected: [[""]] },
  { args: [["a"]], expected: [["a"]] },
  { args: [["ab", "ba", "ab"]], expected: [["ab", "ba", "ab"]] },
  { args: [["aab", "abb"]], expected: [["aab"], ["abb"]] },
  { args: [["", ""]], expected: [["", ""]] },
  {
    args: [["a".repeat(100), "b".repeat(100)]],
    expected: [["a".repeat(100)], ["b".repeat(100)]],
  },
  {
    args: [["a" + "b".repeat(11), "a".repeat(11) + "b"]],
    expected: [["a" + "b".repeat(11)], ["a".repeat(11) + "b"]],
  },
];
const normalize = (value: string[][]): string => JSON.stringify(
  value.map(group => [...group].sort())
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
);
for (const solve of [groupAnagramsBrute, groupAnagrams]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('49: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = [
    {
        "args": [["eat", "tea", "tan", "ate", "nat", "bat"]],
        "expected": [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]],
    },
    {"args": [[""]], "expected": [[""]]},
    {"args": [["a"]], "expected": [["a"]]},
    {"args": [["ab", "ba", "ab"]], "expected": [["ab", "ba", "ab"]]},
    {"args": [["aab", "abb"]], "expected": [["aab"], ["abb"]]},
    {"args": [["", ""]], "expected": [["", ""]]},
    {"args": [["a" * 100, "b" * 100]], "expected": [["a" * 100], ["b" * 100]]},
    {
        "args": [["a" + "b" * 11, "a" * 11 + "b"]],
        "expected": [["a" + "b" * 11], ["a" * 11 + "b"]],
    },
]

def normalize(value):
    return sorted(sorted(group) for group in value)
for solve in (group_anagrams_brute, group_anagrams):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('49: both implementations passed', len(cases), 'cases')
```

面試口述模板：

> 最直接是逐組比較能否重排，會反覆找群組與字母。我注意到同組字串的每種字母次數相同，因此每筆先建立 26 格次數，再轉成穩定 key，用 Map／dict 找到群組並放入原字串。每筆只加入一次，同 key 才同組。令 L 為總字元數、n 為字串數，平均時間是 O(L + 26n)，包含輸出的額外空間是 O(n)。排序字母作 key 也正確，但固定字母集可以用計數省下排序。

<details>
<summary>舊筆記的筆者解：保留實際歷史版本</summary>

這是原頁已標記的 JavaScript 筆者解，保留供比較，不代表本次作答。排序後分組的想法正確；本次另提供 TypeScript＋Python 計數版本。舊測試曾把多個群組分別傳入 `toEqual`，本頁改成完整巢狀陣列並正規化比較。

```js
// 筆者解
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
let groupAnagrams = function (strs) {
  if (strs.length === 1) {
    return [strs];
  }
  let anagramsObj = {};
  for (let i = 0, len = strs.length; i < len; i++) {
    let sortStr = strs[i].split("").sort().join("");
    if (!anagramsObj[sortStr]) {
      anagramsObj[sortStr] = [strs[i]];
    } else {
      anagramsObj[sortStr].push(strs[i]);
    }
  }
  return Object.values(anagramsObj);
};
```

</details>

---

## Stage C｜解題後：遷移到 Production（50–60 分鐘）

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

**回答：** 不想每來一筆資料，就把所有群組重新找一遍；也不想因為內容排列不同，就把其實相同的資料分開。

例如三份標籤 `[red, big]`、`[big, red]`、`[red]`，前兩份順序不同，但內容相同。可以先產生相同的代表，再直接找到同一組，不必逐組比較。

產生代表的演算法負責定義「哪些差異可以忽略、哪些必須保留」；Map 保存「代表 → 該組資料」，負責查找。**Map 不會替你決定什麼叫相同。** 本題保留字母次數，產品標籤是否保留重複次數則要由需求決定。

有 `n` 筆資料、最多 `n` 組時，逐組查找有最差 `O(n²)` 次候選比較；穩定 key 加 Map 後，一般雜湊情況下只需平均 `O(n)` 次存取。建立與雜湊 key 的成本仍要計算，代價也包括額外索引記憶體。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

#### 情境 A：商品後台依相同標籤分組匯出

- **原本麻煩在哪？** 每筆商品都要逐組找相同標籤；`[red, big]` 與 `[big, red]` 又不能直接當成不同分類。
- **怎麼套用這題？** 把「字串 → 字母次數代表」換成「商品 → 標籤清單代表」，再用代表找到商品群組。
- **做到哪裡就不夠？** 別名、階層標籤與更新規則仍需另外定義；一份本機 Map 不會自動知道兩個不同 ID 是同一種標籤。

#### 情境 B：批次報表合併相同篩選條件的工作

- **原本麻煩在哪？** 多個請求只差狀態 ID 的排列順序，系統卻重複建立相同查詢工作。
- **怎麼套用這題？** 將不影響語意的狀態順序整理成穩定代表，把同條件請求先分到同組，再共用查詢結果。
- **做到哪裡就不夠？** 必須把租戶、權限範圍、日期與報表版本等影響結果的條件納入 key。不能只比較一份狀態清單就共用不同使用者的資料；跨程序的重複執行也不是本機 Map 能控制的。

以下展開商品匯出，先改善查找，再補上整批資料的驗證。

### 工程情境：商品批次匯出

需求是把標籤內容完全相同的商品放到同一組。先明確定義行為：

| 項目 | 本例約定 |
| --- | --- |
| 標籤身分 | 使用大小寫敏感的 tag ID，不用顯示名稱 |
| 標籤順序 | 不影響分組 |
| 重複 tag ID | 視為資料錯誤，不默默去重 |
| 沒有標籤 | 所有空標籤清單的商品同組 |
| 商品 ID | 整批唯一且非空，重複 ID 視為錯誤 |
| 群組順序 | 依該組第一次出現的位置 |
| 組內順序 | 保留商品輸入順序 |
| 修改輸入 | 不修改商品或其標籤陣列 |
| 空批次 | 回傳 `[]`，這是工程例子的契約 |

與 LeetCode 的差別是：題目必須保留相同字串的多次出現；本例把重複商品 ID 當成資料錯誤。不能把這條業務規則倒套回題目。

### 常見直覺寫法

先假設上游已驗證商品 ID 與標籤。標籤是任意字串，無法直接照搬 26 格；先排序副本，再用 JSON 編碼完整字串清單。

```ts
type Product = Readonly<{
  id: string;
  tags: readonly string[];
}>;

function tagKey(tags: readonly string[]): string {
  return JSON.stringify([...tags].sort());
}

function groupProductsBefore(items: readonly Product[]): Product[][] {
  const groups: { key: string; items: Product[] }[] = [];

  for (const item of items) {
    const key = tagKey(item.tags);
    const group = groups.find(candidate => candidate.key === key);

    if (group !== undefined) {
      group.items.push(item);
    } else {
      groups.push({ key, items: [item] });
    }
  }

  return groups.map(group => group.items);
}
```

這是正確且容易理解的寫法。每筆已經只算一次 key，瓶頸在於 `find` 仍然從第一組開始找，不在 `tagKey` 呼叫次數。

不能直接寫 `tags.sort()`，那會修改呼叫端的資料。也不宜用 `tags.join("|")`：`["a|b", "c"]` 和 `["a", "b|c"]` 會變成相同字串；JSON 陣列編碼會保留元素邊界與跳脫字元。

### 潛在問題與觸發門檻

- 30 筆且各自成組，最多比較 `435` 個候選，直接掃描通常容易維護。
- 10,000 筆且各自成組，最多比較 `49,995,000` 個候選。
- 若資料幾乎都在同一組，`find` 通常很快就找到，不能只看總筆數推論一定很慢。
- 若篩選每次變更都觸發重算，還要看呼叫頻率與 key 長度。上述數字是操作次數估算，不能直接換成毫秒。

應量測商品數、群組數、標籤長度與實際耗時，再決定是否需要進一步處理背景計算或快取。

### 套用本題技巧：先直接優化常見寫法

沿用相同 `Product`、`tagKey` 與有效輸入契約，只把逐組搜尋改成 Map 查詢。

```ts
function groupProductsIndexed(items: readonly Product[]): Product[][] {
  const groups = new Map<string, Product[]>();

  for (const item of items) {
    const key = tagKey(item.tags);
    const group = groups.get(key);

    if (group !== undefined) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  return [...groups.values()];
}
```

```text
原本：每個商品 → 算 tagKey → 逐組 find → 加入群組
現在：每個商品 → 算 tagKey → Map.get → 加入群組
```

這裡直接對應本題：字串換成商品、字母次數代表換成標籤代表、字串群組換成商品群組。每輪處理後，所有已讀商品都恰好位於符合自身 key 的一組。

Map 依 key 首次插入順序回傳群組，組內使用 `push`，因此保留原本的兩層順序。Map 每次呼叫重新建立，不需要在元件外維護常駐快取。

### 第一層優化留下的問題

查詢變快不代表資料符合契約：

```text
同一商品 ID 出現兩次 → 仍然被放入結果兩次
商品標籤誤填為 ["red", "red"] → 仍然產生一個合法 JSON key
```

如果呼叫端已經保證整批有效，直接索引版本就足夠；如果此函式要對外保證本例的資料契約，就先完整驗證，再建立群組。不要為了方便分組而默默移除錯誤資料。

### Production 進階優化：先驗證整批，再分組

下面沿用相同型別與索引函式。這一層補的是正確性，沒有再降低分組的時間量級。

```ts
function groupProducts(items: readonly Product[]): Product[][] {
  const ids = new Set<string>();

  for (const item of items) {
    if (item.id.length === 0 || ids.has(item.id)) {
      throw new TypeError("Product IDs must be unique and nonempty.");
    }
    ids.add(item.id);

    const tags = new Set<string>();
    for (const tag of item.tags) {
      if (tag.length === 0 || tags.has(tag)) {
        throw new TypeError(`Product ${item.id} has an empty or duplicate tag ID.`);
      }
      tags.add(tag);
    }
  }

  return groupProductsIndexed(items);
}
```

TypeScript 型別不會驗證外部 JSON，API 邊界仍須檢查 `id` 是字串、`tags` 是字串陣列。這份函式處理的是已符合型別的資料，進一步驗證 ID 的業務規則。

輸出的群組陣列是新建的，但商品物件仍是原本參照，沒有深拷貝。`readonly` 表達本函式不修改輸入的責任，並非執行時凍結物件；外部如果修改商品標籤，原先的分組不會自動重算。

### 優化前後

令 `n` 為商品數，`K` 為所有商品產生排序 key 的總成本，`q` 為最長 key 的字元數。下表採一般字串比較與雜湊成本模型，Map 使用平均情況。

| 面向 | 逐組 find | 直接 Map | 驗證整批＋Map |
| --- | --- | --- | --- |
| 時間上界 | `O(K + n²(q + 1))` | 平均 `O(K + n(q + 1))` | 另加整批 ID／tag 驗證成本 |
| 重複工作 | 一再掃描既有群組 | 每筆直接查 key | 驗證後直接查 key |
| key 與結果儲存 | 都需要 | 都需要，另有 Map 索引結構 | 另加 ID 集合與當前商品 tag 集合 |
| 群組與組內順序 | 首次出現／輸入順序 | 相同 | 相同 |
| 輸入修改 | 不修改 | 不修改 | 不修改 |
| 錯誤 ID／重複標籤 | 依賴呼叫端 | 依賴呼叫端 | 主動拒絕 |
| 適合情境 | 小量低頻 | 已驗證的大批資料 | 需要此函式保證資料契約 |

前後都會排序標籤，所以 Map 沒有消除 `K`。tag ID 長度有界時，每筆 `t` 個標籤的排序通常按 `O(t log(t + 1))` 分析；ID 很長時還需計入字串比較與序列化成本。

若只看群組儲存，兩個版本都保存每組 key 與全部商品參照。驗證版另需最多 `n` 個商品 ID，以及當前商品的標籤集合；它不是零成本的包裝。

### 驗證工程例子的行為

將本階段所有 TypeScript 實作與下列測試放在同一個檔案執行。這次結果順序是產品契約的一部分，因此直接比較完整陣列，不像 LeetCode 測試會先排序。

```ts
const products: Product[] = [
  { id: "p1", tags: ["red", "big"] },
  { id: "p2", tags: ["big", "red"] },
  { id: "p3", tags: [] },
  { id: "p4", tags: ["red"] },
  { id: "p5", tags: [] },
  { id: "p6", tags: ["a|b", "c"] },
  { id: "p7", tags: ["a", "b|c"] },
];
const expectedIds = [["p1", "p2"], ["p3", "p5"], ["p4"], ["p6"], ["p7"]];
const inputSnapshot = JSON.stringify(products);

for (const solve of [groupProductsBefore, groupProductsIndexed, groupProducts]) {
  const result = solve(products);
  const ids = result.map(group => group.map(item => item.id));
  if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) {
    throw new Error("Unexpected group order or membership.");
  }
  if (JSON.stringify(products) !== inputSnapshot || result[0][0] !== products[0]) {
    throw new Error("Unexpected mutation or object copying.");
  }
  if (solve([]).length !== 0) throw new Error("Expected empty groups.");
}

const invalidBatches: Product[][] = [
  [{ id: "p1", tags: [] }, { id: "p1", tags: [] }],
  [{ id: "p1", tags: ["red", "red"] }],
  [{ id: "", tags: [] }],
  [{ id: "p1", tags: [""] }],
];
for (const items of invalidBatches) {
  let rejected = false;
  try { groupProducts(items); } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    rejected = true;
  }
  if (!rejected) throw new Error("Expected invalid product data to be rejected.");
}
console.log("Product grouping: ordering, validation and ownership passed");
```

### 使用界線與代價

- 只有十幾筆且低頻執行時，直接搜尋可能就夠；不要只因為看到迴圈裡有 `find` 就要求大改。
- 本例標籤次數不代表商品屬性，重複值被拒絕。若改成購物清單，商品數量有意義，就要保留次數，不能用 Set 去重。
- tag ID 的大小寫、別名與階層不能自行推測。需要正規化時，應先定義規則，再讓分組與其他功能共用相同規則。
- 商品更新後要重新分組；在 React 中，只有在資料以不可變方式更新、相依項完整時，才適合依該批資料做 memoization。
- 若要長期保存匯出快照，需另外複製或持久化必要欄位，不能把原物件參照當成歷史資料。
- 多個程序同時處理同一批匯出時，本機 Map 只改善各自的分類，不負責協調重複工作。

### Code Review 說法

> 目前每筆商品都用 `find` 重掃已有群組；若一萬筆大多各自成組，最差接近五千萬次候選比較。可以沿用現有 `tagKey`，改用 Map 直接取得群組，並用測試確認首次出現順序、組內順序與不修改輸入。若這裡也負責資料契約，再驗證重複商品 ID 與標籤；排序 key 的成本仍存在，是否需要更多優化可依批次大小與實測耗時決定。

### 變形題

1. 大小寫視為相同時，在哪一步正規化？回傳時要保留原字串，還是回傳正規化後的字？
2. 如果只要回傳異位詞群組數量，可以少存哪些資料？若要回傳最大群組，又需要保留什麼？
3. 若商品分批新增、刪除或修改標籤，如何找到舊群組、搬移商品，並維持群組顯示順序？

### 一分鐘複習卡

| 項目 | 答案 |
| --- | --- |
| 怎麼想到 Map／dict？ | 每筆都要找同內容的組；先算能代表內容的 key，再用 key 找群組 |
| 為什麼數字母？ | 順序可變，但每種字母有幾個不能改 |
| 暴力解 | 逐組找代表，再逐字配對 |
| 暴力瓶頸 | 重複搜尋群組與字母 |
| 最佳化 | 26 格計數 → 穩定 key → 加入原字串 |
| 每輪都要保持什麼？ | 每筆恰好放一次，群組內次數相同；這就是 invariant |
| 時間 | 平均 `O(L + 26n)`，固定字母集可寫 `O(L + n)` |
| 空間 | 含結果 `O(n)`；key 為 `O(26g)` |
| 常見錯誤 | 陣列當 JS key、漏分隔符、只比種類、去掉重複字 |
| Production | 先定義相同，再優化找組；另外處理順序、驗證與更新 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

---

## 相關連結

- [Two Sum：對照 Map 保存的內容](/docs/algorithms/leetcode/f0001-0100/l0001-two-sum)
- [Valid Anagram：先練兩個字串的判斷](/docs/algorithms/leetcode/f0201-0300/l0242-valid-anagram)
- [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01)
- [LeetCode：Group Anagrams 官方題目](https://leetcode.com/problems/group-anagrams/)
