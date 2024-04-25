---
tags:
  - LeetCode
  - Hard
  - Minimum Window Substring
  - javascript
  - Sliding Window
---

# [0076] Minimum Window Substring

```js
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function (s, t) {
  // 建立字典用於存儲目標字符串中各字符的出現次數
  const targetFreq = {};
  for (let i = 0; i < t.length; i++) {
    targetFreq[t[i]] = (targetFreq[t[i]] || 0) + 1;
  }

  let windowStart = 0; // 滑動窗口的起始位置
  let windowEnd = 0; // 滑動窗口的結束位置
  let minWindowLength = Infinity; // 最小視窗長度
  let windowCount = 0; // 滑動窗口中已匹配目標字符的數量
  let minWindow = ""; // 最小視窗字符串

  while (windowEnd < s.length) {
    const charEnd = s[windowEnd];

    if (targetFreq[charEnd] !== undefined) {
      // 目標字符在窗口內出現，增加已匹配的目標字符數量
      targetFreq[charEnd]--;
      if (targetFreq[charEnd] >= 0) {
        // 只有當目標字符的數量大於等於 0 時才算有效的匹配
        windowCount++;
      }
    }

    // 窗口內的字符已經滿足目標字符串的要求
    while (windowCount === t.length) {
      // 更新最小視窗長度和最小視窗字符串
      if (windowEnd - windowStart + 1 < minWindowLength) {
        minWindowLength = windowEnd - windowStart + 1;
        minWindow = s.substring(windowStart, windowEnd + 1);
      }

      const charStart = s[windowStart];
      if (targetFreq[charStart] !== undefined) {
        // 窗口左側的字符移出窗口，減少已匹配的目標字符數量
        targetFreq[charStart]++;
        // 當大於0時，代表剛好又與t相等數量
        if (targetFreq[charStart] > 0) {
          // 窗口內的字符不再滿足目標字符串的要求
          windowCount--;
        }
      }

      windowStart++; // 滑動窗口向右移動
    }

    windowEnd++; // 滑動窗口向右擴展
  }

  return minWindow;
};
```
