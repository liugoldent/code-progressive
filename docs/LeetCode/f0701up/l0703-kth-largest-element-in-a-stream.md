---
tags:
  - LeetCode
  - Easy
  - Heap / Priority Queue
  - javascript
  - Kth Largest Element in a Stream
---

# [0703] Kth Largest Element in a Stream

## 一般 sort 解法

```js
/* ---------- 最小堆工具函式 ---------- */
function heapSize(h) { return h.length; }
function heapPeek(h) { return h[0]; }

function heapPush(h, val) {
  h.push(val);
  let i = h.length - 1;
  while (i > 0) {
    const p = Math.floor((i-1)/2);
    if (h[p] <= h[i]) break;
    [h[p], h[i]] = [h[i], h[p]];
    i = p;
  }
}

function heapPop(h) {
  if (!h.length) return undefined;
  const min = h[0];
  const last = h.pop();
  if (h.length) {
    h[0] = last;
    let i = 0;
    while (true) {
      const l = i * 2 + 1;
      const r = l + 1;
      let s = i;
      if (l < h.length && h[l] < h[s]) s = l;
      if (r < h.length && h[r] < h[s]) s = r;
      if (s === i) break;
      [h[i], h[s]] = [h[s], h[i]];
      i = s;
    }
  }
  return min;
}
/* ----------------------------------- */

/**
 * @param {number} k
 * @param {number[]} nums
 */
var KthLargest = function (k, nums) {
  this.k = k;
  this.heap = [];
  /* 初始化：把 nums 全扔進堆（超過 k 就彈最小） */
  for (var i = 0; i < nums.length; i++) {
    this.add(nums[i]);
  }
};

/**
 * @param {number} val
 * @return {number}
 */
KthLargest.prototype.add = function (val) {
  if (heapSize(this.heap) < this.k) {
    heapPush(this.heap, val)
  } else if (val > heapPeek(this.heap)) {
    heapPop(this.heap)
    heapPush(this.heap, val)
  }
  return heapPeek(this.heap)   // 堆頂 = 第 k 大
};

```

## 進階二分搜尋法

- 在排序部分，使用二分搜尋
- BigO 可勝過 99%的人

```js
///////

/**
 * @param {number} k - 整數 k，代表要找到第 k 大的元素
 * @param {number[]} nums - 整數陣列 nums，作為初始元素集合
 */
var KthLargest = function (k, nums) {
  this.k = k; // 儲存 k 的值，代表要找到第 k 大的元素
  this.heap = []; // 建立一個空的最小堆數組
  for (let num of nums) {
    this.add(num); // 將初始元素依序添加到最小堆中
  }
};

/**
 * @param {number} val - 整數 val，代表要添加到數組中的元素
 * @return {number} - 回傳第 k 大的元素
 */
KthLargest.prototype.add = function (val) {
  if (this.heap.length < this.k) {
    // 如果最小堆的長度小於 k，直接將元素添加到堆中
    this.heap.push(val);
    this.heapifyUp(this.heap.length - 1); // 進行堆化操作，使堆保持最小堆的性質
  } else if (val > this.heap[0]) {
    // 如果元素大於堆頂元素，替換堆頂元素並進行堆化操作
    this.heap[0] = val;
    this.heapifyDown(0); // 進行堆化操作，使堆保持最小堆的性質
  }
  return this.heap[0]; // 返回第 k 大的元素
};

/**
 * 將指定索引的元素進行向上堆化操作，使堆保持最小堆的性質
 * @param {number} index - 要進行堆化操作的元素索引
 */
KthLargest.prototype.heapifyUp = function (index) {
  const parent = Math.floor((index - 1) / 2); // 計算父節點的索引
  if (parent >= 0 && this.heap[parent] > this.heap[index]) {
    // 如果父節點比當前節點大，交換它們的位置並繼續向上堆化
    [this.heap[parent], this.heap[index]] = [
      this.heap[index],
      this.heap[parent],
    ];
    this.heapifyUp(parent); // 遞歸向上堆化
  }
};

/**
 * 將指定索引的元素進行向下堆化操作，使堆保持最小堆的性質
 * @param {number} index - 要進行堆化操作的元素索引
 */
KthLargest.prototype.heapifyDown = function (index) {
  const left = 2 * index + 1; // 計算左子節點的索引
  const right = 2 * index + 2; // 計算右子節點的索引
  let smallest = index; // 假設當前節點為最小值
  if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
    // 如果左子節點比當前節點小，更新最小值索引
    smallest = left;
  }
  if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
    // 如果右子節點比當前節點小，更新最小值索引
    smallest = right;
  }
  if (smallest !== index) {
    // 如果最小值索引不等於當前節點索引，交換它們的位置並繼續向下堆化
    [this.heap[index], this.heap[smallest]] = [
      this.heap[smallest],
      this.heap[index],
    ];
    this.heapifyDown(smallest); // 遞歸向下堆化
  }
};

/**
 * 將 KthLargest 物件實例化並呼叫如下：
 * var obj = new KthLargest(k, nums);
 * var param_1 = obj.add(val);
 */
```
