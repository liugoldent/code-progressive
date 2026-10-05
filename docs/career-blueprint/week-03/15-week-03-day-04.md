---
sidebar_position: 4
sidebar_label: "Day 4"
slug: "/career-blueprint/week-03-day-04"
title: "第 3 週 Day 4：Valid Palindrome、Python API 與自動擴容"
description: "140 分鐘日課：練習 Valid Palindrome 的雙指標推導、程式、測試與 Big-O；實作 Python keyword-only API 和 closure，修正 mutable default；估算 autoscaling 指標與 cold-start 風險。"
tags: [Career, Interview, NeetCode 150, Python, System Design]
keywords: ["Valid Palindrome", "Two Pointers", "keyword-only", "closure", "mutable default", "autoscaling", "cold start", "水平擴展", "負載平衡"]
---

# 第 3 週 Day 4：Valid Palindrome、Python API 與自動擴容

> 安排日期：2026-09-24；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing III／Two Pointers  
> 本週 System Design 主題：水平擴展與負載平衡

接續 [第 3 週 Day 3](/docs/career-blueprint/week-03-day-03)。今天從「前後對稱」推導比較方式，再把 Python 參數契約和狀態保存方式寫成可測試的小程式。範例與解析供作答後核對；閱讀範例不算實作完成。

作答方式：知識題先選再展開解析；進度題只按實際操作勾選。Markdown 勾選不會自動保存作答，請另外保存第一次程式、測試輸出和自己畫的圖。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：指定 Valid Palindrome，完成 Pattern 判斷、TypeScript＋Python 程式、測試與 Big-O；Tree／Graph／DP 卡住時優先畫圖與追狀態。
- [ ] **Python 實作｜50 分鐘**：寫 keyword-only API 與 closure；重現並修正 mutable default bug，跑過測試。
- [ ] **收尾｜10 分鐘**：執行測試，將未完成步驟寫入週末補課清單。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：估 autoscaling 指標與 cold-start 風險；小圖／三個數字／failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。演算法完整三階段題解見 [LeetCode 125｜Valid Palindrome](/docs/algorithms/leetcode/f0101-0200/l0125-valid-palindrome)；先做該頁 Stage A，再回來核對今天的題目。若 System Design 沒做完，一併列入週末清單。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Valid Palindrome | Pattern 推導、兩種語言的第一次程式、測資、Big-O |
| 21:30–22:20 | Python 實作 | keyword-only API、closure、bug 重現與修正版測試 |
| 22:20–22:30 | 收尾 | 測試結果、未完成步驟及週末最小行動 |
| 22:30–22:50 | Autoscaling | 自畫圖／自算三數字／自寫 failure case／口述至少一項 |

---

## Part 1｜NeetCode 150：Valid Palindrome（60 分鐘）

先開 [LeetCode 125 的 Stage A](/docs/algorithms/leetcode/f0101-0200/l0125-valid-palindrome)，只看題意、契約、範例與自己的第一個直覺。閉卷寫完並跑測試後，才看 Stage B、Stage C 和下方解析。

### 1. 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 讀題與確認契約 | 一句話說明哪些字元要保留、何時回傳 true |
| 5–12 | 手算官方範例和自訂邊界 | 輸入與預期答案，不先執行程式 |
| 12–20 | 最直接正確解與成本 | 寫下清理、反轉的成本，再問能否少建暫存 |
| 20–35 | 判斷 Pattern 並閉卷實作 | 左右位置如何移動；TypeScript＋Python 第一版 |
| 35–50 | 執行測試並修正 | 官方三例、數字、標點、單字元與兩端不等 |
| 50–60 | 口述與 Big-O | invariant、每個指標移動上限、額外空間與卡點 |

### 2. 閉卷判斷：這題究竟要保留什麼？

先自己回答：

1. `"A man, a plan, a canal: Panama"` 忽略了什麼？`"0P"` 的數字能不能丟？
2. 先過濾、轉小寫、反轉再比較，是不是正確？額外建立了哪些資料？
3. 若只想知道左右對應的有效字元是否相同，可以從哪兩個位置開始？遇到標點時哪一側移動？
4. 每一輪要保持什麼已經成立，才能在兩側相遇時放心回傳 `true`？

**單選｜對 `"ab_a"`，哪個解釋符合本題契約？**

- [ ] A. 底線是英文字母，清理後是 `ab_a`，因此為 false。
- [ ] B. 底線忽略，清理後是 `aba`，因此為 true。
- [ ] C. 所有非字母數字都使輸入不合法，應丟出例外。

<details>
<summary>完成第一次作答後再看解析</summary>

**答案：B。** 本題保留英文字母與數字、忽略大小寫；底線不是要保留的字元。清理反轉法本身正確，時間 `O(n)`、額外空間 `O(n)`。若只需布林答案，左右各放一個位置，略過無效字元後成對比較，就不用建立整份清理字串。每輪都要保持「目前兩端外側的有效字元已驗證相同」，這就是 invariant；兩指標總共移動至多 `n` 次，時間 `O(n)`、額外空間 `O(1)`。

</details>

第一次實作模板；不要把題解頁的完成版貼進來：

```ts
function isPalindrome(s: string): boolean {
  throw new Error('先完成自己的版本');
}
```

```python
def is_palindrome(s: str) -> bool:
    raise NotImplementedError('先完成自己的版本')
```

### 3. 測試與 Pattern 驗收

| 輸入 | 預期 | 要查的錯誤 |
| --- | :---: | --- |
| `"A man, a plan, a canal: Panama"` | true | 大小寫與標點 |
| `"race a car"` | false | 中途不相等 |
| `" "` | true | 清理後沒有有效字元 |
| `"0P"` | false | 數字不可丟 |
| `".,!"` | true | 全是忽略字元 |
| `"a"` | true | 單字元 |
| `"ab_a"` | true | 底線須忽略 |

- [ ] 先記錄 Pattern 判斷的推導，再看「雙指標」解析。
- [ ] TypeScript 與 Python 都保存了第一次閉卷版本，不用參考解覆蓋。
- [ ] 執行官方與自訂測資，紀錄測試命令、失敗與修正。
- [ ] 能說明清理反轉與相向雙指標同為 `O(n)` 時間，空間分別為 `O(n)`、`O(1)`。
- [ ] 若遇到 Tree／Graph／DP 卡點，先畫節點／邊／狀態轉移並追一個最小案例，再查提示。

---

## Part 2｜Python 實作：keyword-only API、closure 與 mutable default（50 分鐘）

### 1. 今日目標與節奏

把「呼叫時必須寫明參數名稱」與「函式保存自己的計數狀態」放進同一個小型請求計數器。先預測測試結果，再寫自己的版本；下面完整程式折疊起來供對照。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–8 | 設計 API 契約 | 哪個參數為必要？哪些必須用名稱呼叫？ |
| 8–20 | 寫 keyword-only API | 正常呼叫與錯誤呼叫各一例 |
| 20–32 | 寫 closure | 兩個 counter 彼此獨立、`nonlocal` 修改外層數值 |
| 32–42 | 重現並修 mutable default | 兩次呼叫的輸出與修正理由 |
| 42–50 | 執行測試與口述 | 測試輸出、狀態存放位置與使用界線 |

### 2. 先定義呼叫契約

今天寫 `record_request(path, *, status, tags=None)`：`path` 是必要位置參數；`*` 後的 `status` 與 `tags` 是 keyword-only，呼叫時必須寫名稱。`status` 沒有預設值，不能省略。`tags=None` 用來避免跨呼叫共享同一個可變清單。

**單選｜以下哪個呼叫符合契約？**

- [ ] A. `record_request('/watchlist', 200)`
- [ ] B. `record_request('/watchlist', status=200)`
- [ ] C. `record_request(status=200)`

<details>
<summary>先選再看解析</summary>

**答案：B。** `status` 位於 `*` 之後，必須以名稱傳入；`path` 必填。`keyword-only` 讓重要選項在呼叫位置看得見，也避免多個同型別參數只靠順序辨識。

</details>

先用自己的程式實現以下要求：

```python
record_request('/watchlist', status=200)                    # 只含這次的 path 和 status
record_request('/watchlist', status=503, tags=['upstream']) # 回傳資料保留標記

counter_a = make_counter(start=0)
counter_b = make_counter(start=10)
counter_a()  # 1
counter_a()  # 2
counter_b()  # 11；不受 counter_a 影響
```

### 3. 重現 mutable default bug

這段是**刻意有錯**的練習材料。先預測第二次回傳，再執行：

```python
def broken_record(path: str, *, status: int, tags: list[str] = []) -> list[str]:
    tags.append(f'{path}:{status}')
    return tags

print(broken_record('/a', status=200))  # ['/a:200']
print(broken_record('/b', status=503))  # ['/a:200', '/b:503']：前次資料外洩
```

預設值在建立函式時求值；兩次省略 `tags` 的呼叫會拿到同一個 list。修正時用 `None` 表示「本次未提供」，在每次呼叫內建立新 list。若呼叫者有傳 list，也要先決定是否複製，避免修改呼叫者原本的資料。

<details>
<summary>自己完成後再看參考實作與可執行測試</summary>

```python
def record_request(
    path: str, *, status: int, tags: list[str] | None = None
) -> list[str]:
    result = list(tags) if tags is not None else []
    result.append(f'{path}:{status}')
    return result


def make_counter(*, start: int = 0):
    count = start

    def next_count() -> int:
        nonlocal count
        count += 1
        return count

    return next_count


assert record_request('/a', status=200) == ['/a:200']
assert record_request('/b', status=503) == ['/b:503']
original = ['upstream']
assert record_request('/b', status=503, tags=original) == ['upstream', '/b:503']
assert original == ['upstream']

a, b = make_counter(), make_counter(start=10)
assert [a(), a(), b(), a(), b()] == [1, 2, 11, 3, 12]

try:
    record_request('/a', 200)
except TypeError:
    pass
else:
    raise AssertionError('status 應為 keyword-only')

print('Python API、closure、mutable default：測試通過')
```

把程式放入 `practice.py`，執行 `python3 practice.py`。`nonlocal count` 表示內層函式更新外層這次 `make_counter` 呼叫建立的 binding；每次呼叫 factory 都有獨立狀態。這種 closure 適合小範圍、本機狀態；跨服務實例共用計數仍需要外部儲存。

</details>

### 4. Python 今日驗收

- [ ] 能解釋 `*` 如何讓 `status` 成為必填的 keyword-only 參數。
- [ ] 實測位置傳入 `status` 會得到 `TypeError`。
- [ ] 建立兩個 closure，測到計數互不干擾。
- [ ] 先看到 mutable default 的跨呼叫污染，再用 `None` sentinel 修好。
- [ ] 確認函式沒有意外修改呼叫者傳入的 `tags`。

---

## Part 3｜收尾：測試與週末補課（10 分鐘）

先跑今天真正寫出的檔案，不用只勾「看過測資」。記錄命令、通過組數與失敗原因；沒完成的項目改寫成週末可在 20–30 分鐘內執行的動作。

| 分鐘 | 動作 | 紀錄 |
| ---: | --- | --- |
| 0–4 | 重跑 Valid Palindrome 兩語言測試 | 命令、通過／失敗、第一個失敗案例 |
| 4–7 | 重跑 `practice.py` | keyword-only、closure、mutable default 測試結果 |
| 7–10 | 轉入週末清單 | 指定要重做哪一步、何時做、完成證據 |

**未完成才加入的週末補課清單：**

- [ ] 週六 30 分鐘：閉卷重寫 Valid Palindrome，補 `"0P"`、全標點與兩端不等測試，說出 Big-O。
- [ ] 週六 20 分鐘：不看參考碼重寫 `record_request`，測必要 keyword-only 與不修改原始 `tags`。
- [ ] 週日 20 分鐘：重現 mutable default bug，重寫 closure 並測兩個實例互不干擾。
- [ ] 週日 20 分鐘：補畫 autoscaling 圖、重算三數字或重錄故障口述。
- [ ] 今天各項都有證據，無需補課。

清單只勾真的要補做的項目；「無需補課」不能與待補項同時勾選。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：估 autoscaling 指標與 cold-start 風險

延續本週的 Watchlist 服務：Load Balancer 把請求分給多台 Service。流量快速增加時，autoscaling 決定何時增加實例；但新實例要啟動、載入程式、建立連線並通過健康檢查後，才能真正接流量。這段等待就是今天要估的 **cold-start 風險**。

**先看懂三個關鍵字：**

| 關鍵字 | 白話意思 | 放進 Watchlist 情境 |
| --- | --- | --- |
| Autoscaling（自動擴縮容） | 根據流量或負載指標，自動增加或減少服務實例。 | 請求變多、現有三台快撐不住時，系統決定再開一台；決定擴容不代表新台立刻能接請求。 |
| Cold start（冷啟動） | 新實例從啟動到準備好服務的過程；啟動期間還不能算進可用容量。 | 第四台要載入程式、連上 DB、通過 readiness／健康檢查後，LB 才能把流量送給它。若尖峰先到，原本三台仍要撐過這段時間。 |
| p95 延遲（第 95 百分位回應時間） | 把一段時間內的請求延遲由快到慢排序，約 95% 的請求在這個時間內完成，約 5% 更慢；不是平均值。 | 若 p95 是 800 ms，表示約 95% 的請求不超過 800 ms。尖峰時 p95 升高，代表較慢那批使用者等得更久。 |

一句話串起來：**autoscaling 決定加台數，cold start 決定新台何時真正可用，p95 幫你觀察使用者的等待時間有沒有變差。**

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 畫現有流量路徑 | LB、服務、資料庫與指標來源 |
| 4–9 | 選擴容訊號 | 比較 CPU、同時處理量、佇列等待與延遲 |
| 9–14 | 重算容量與等待時間 | 至少三個數字，標明假設 |
| 14–20 | 選一個主動產出並口述風險 | 小圖／三數字／failure case／3 分鐘口述 |

### 1. 先選指標：流量進來到哪裡會先排隊？

| 指標 | 看到了什麼 | 單獨使用的盲點 |
| --- | --- | --- |
| CPU 使用率 | Service 是否忙於計算 | I/O 等待、下游逾時或排隊時，CPU 可能不高 |
| 每台同時處理請求數 | 執行中的工作是否接近容量 | 請求變慢會讓此值升高，需結合延遲判讀 |
| 佇列長度／最舊等待時間 | 工作是否已經等候 | 佇列上升時可能已晚，必須看增長速度 |
| p95 延遲與錯誤率 | 使用者實際感受與失敗 | 屬於結果指標；可當警報與保護條件 |

**單選｜CPU 不高，但請求排隊時間持續上升、p95 延遲變差；哪個判斷較合理？**

- [ ] A. CPU 不高，代表所有環節都還有容量。
- [ ] B. 先看同時處理量、佇列等待與下游延遲，確認瓶頸，再決定擴哪一層。
- [ ] C. 立即無上限增加 Service 台數，不用查看資料庫。

<details>
<summary>先選再看解析</summary>

**答案：B。** CPU 只描述其中一種資源。若資料庫已飽和，增加 Service 可能讓更多請求同時打向資料庫；若 Service 自己的同時處理量接近安全上限，擴 Service 才有望分攤工作。擴容訊號要與 p95、錯誤率和下游健康一起核對。

</details>

### 2. 自算三個數字：新實例來得及嗎？

以下都是**練習假設**，不是 Watchlist 的實測容量：目前有 3 台，每台安全容量 `400 requests/s`，現有流量 `900 requests/s`；30 秒後預計升到 `1,500 requests/s`。從觸發擴容到新實例通過健康檢查需 90 秒。

先在紙上算，並回答是否只要設定 autoscaling 就能撐住這次尖峰。

<details>
<summary>算完再看參考數字</summary>

1. 現有安全容量：`3 × 400 = 1,200 requests/s`。
2. 尖峰缺口：`1,500 - 1,200 = 300 requests/s`，至少需要 `ceil(1,500 / 400) = 4` 台健康實例才夠；若要容忍其中一台故障，至少需要 5 台。
3. 尖峰提前 30 秒到，但新實例需 90 秒；中間至少有 **60 秒容量缺口**。若流量維持 `1,500 requests/s`，且沒有降級、節流或排隊策略，最多約 `300 × 60 = 18,000` 個請求超出原有安全處理能力。這是壓力估算，不能直接當成實際失敗請求數。

可考慮預熱、保留常駐餘裕、限制流量或讓可延後的工作入有界佇列；須再查 LB 只把流量送到已 ready 的實例，並確認資料庫也能承受四台以上的併發。

</details>

### 3. 主動產出：至少自己完成一項

- [ ] **一張小圖**：畫 `Client → LB → 3 台 Service → DB`；補上第四台從啟動到 ready 的路徑，標出 health check 與不應接流量的時間。
- [ ] **三個數字**：自己重算目前容量、尖峰缺口、cold-start 時間差；寫下單位與假設。
- [ ] **一個 failure case**：流量先到、新實例 90 秒後才 ready，說明使用者現象、限流／降級方式、何時恢復。
- [ ] **3 分鐘口述**：說明選哪個擴容指標、為何 CPU 不夠、三個數字、DB 瓶頸與一項代價。

參考 failure case：尖峰 `1,500 requests/s` 到達時，只有 3 台 ready；佇列等待與 p95 上升，部分請求可能逾時。先保護讀取新鮮度較低的非核心功能，限制重試與下游併發；新實例通過健康檢查、p95 和錯誤率回穩後，再逐步恢復流量。若 DB 才是瓶頸，不能把加 Service 當成恢復條件。

**今日驗收：**

- [ ] 至少一項主動產出是自己畫、算、寫或口述；只讀參考答案不算。
- [ ] 擴容決策同時看領先指標、使用者結果與下游健康。
- [ ] 能說明「實例啟動」與「ready 可接流量」不同。
- [ ] 數字有單位，並說出這次至少 60 秒的容量風險來自哪些假設。

---

## 今日結束打卡

每列依實際結果選一個狀態；「理解參考解」不等於閉卷完成或執行測試。

| 項目 | 尚未完成 | 提示／參考後完成 | 獨立完成且有證據 |
| --- | :---: | :---: | :---: |
| Valid Palindrome Pattern、程式、測試與 Big-O | [ ] | [ ] | [ ] |
| Python API、closure、mutable default 修正 | [ ] | [ ] | [ ] |
| 測試收尾與週末清單 | [ ] | [ ] | [ ] |
| Autoscaling 與 cold-start 主動產出 | [ ] | [ ] | [ ] |

明天開始前閉卷回答：為何 Valid Palindrome 用相向雙指標能省空間？`status` 為何必須寫名稱？closure 的計數存在哪裡？新實例還沒 ready 時，這 60 秒如何保護使用者與資料庫？
