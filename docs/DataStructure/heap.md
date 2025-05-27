---
tags:
  - 資料結構 / 演算法
---
# Heap 
## heapifyDown() 
* 是用於在最小堆或最大堆中維護堆的性質的方法之一。

* 在最小堆中，heapifyDown() 方法的目的是將當前節點與其子節點進行比較，並將較小的子節點與當前節點交換，以確保當前節點的值小於或等於其子節點的值。這樣可以將較小的元素向下移動，以維護最小堆的性質。

* 在最大堆中，heapifyDown() 方法的目的是將當前節點與其子節點進行比較，並將較大的子節點與當前節點交換，以確保當前節點的值大於或等於其子節點的值。這樣可以將較大的元素向下移動，以維護最大堆的性質。

* heapifyDown() 方法在堆排序和堆的建立過程中起到重要作用。它通常在刪除堆頂元素後或插入新元素後使用，以確保堆的性質不被破壞。

* 在程式碼中，heapifyDown() 方法根據當前節點的索引，通過比較當前節點與其子節點的值，選擇較小或較大的子節點，並進行交換，然後將當前節點的索引更新為選擇的子節點的索引，重複這個過程直到當前節點的值小於或等於（在最小堆中）或大於或等於（在最大堆中）其子節點的值，或者已經沒有子節點。

## Leetcode題目

| 题号   | 标题                              | 难度     | 核心考点                     |
| ---- | ------------------------------- | ------ | ------------------------ |
| 215  | Kth Largest Element in an Array | Medium | 用大小为 k 的最小堆，维护全局第 k 大元素  |
| 347  | Top K Frequent Elements         | Medium | 哈希统计频率后，用堆筛出前 k 个高频元素    |
| 692  | Top K Frequent Words            | Medium | 频率 + 自定义比较（词频相同按字典序）     |
| 703  | Kth Largest Element in a Stream | Easy   | 动态数据流版的 215，用最小堆维护前 k 大  |
| 295  | Find Median from Data Stream    | Hard   | 用「大顶堆 + 小顶堆」维护中位数        |
| 23   | Merge k Sorted Lists            | Hard   | 用堆合并 k 条有序链表             |
| 239  | Sliding Window Maximum          | Hard   | 滑动窗口中高效维护当前最大值（可用堆或双端队列） |
| 973  | K Closest Points to Origin      | Medium | 计算距离后用大小为 k 的最大堆         |
| 218  | The Skyline Problem             | Hard   | 扫描线 + 堆维护当前最大高度          |
| 1046 | Last Stone Weight               | Easy   | 模拟两块最大石头相撞，用最大堆          |
| 414  | Third Maximum Number            | Easy   | 用大小为 2 的最小堆维护前三大         |


## js Heap Code
```js
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  left(i) {
    return 2 * i + 1;
  }

  right(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // 插入：上浮
  push(val) {
    this.heap.push(val);
    let i = this.heap.length - 1;
    while (i > 0 && this.heap[i] > this.heap[this.parent(i)]) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  // 弹出堆顶：用最后一个顶替后下沉
  pop() {
    if (this.size() === 0) return undefined;
    const max = this.heap[0];
    const end = this.heap.pop();
    if (this.size() > 0) {
      this.heap[0] = end;
      this.heapify(0);
    }
    return max;
  }

  // 下沉：保证子堆也保持堆序
  heapify(i) {
    const l = this.left(i), r = this.right(i);
    let largest = i;
    if (l < this.size() && this.heap[l] > this.heap[largest]) largest = l;
    if (r < this.size() && this.heap[r] > this.heap[largest]) largest = r;
    if (largest !== i) {
      this.swap(i, largest);
      this.heapify(largest);
    }
  }

  // 查看堆顶
  peek() {
    return this.heap[0];
  }
}


class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  left(i) {
    return 2 * i + 1;
  }

  right(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // 插入：上浮
  push(val) {
    this.heap.push(val);
    let i = this.heap.length - 1;
    while (i > 0 && this.heap[i] < this.heap[this.parent(i)]) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  // 弹出堆顶：用最后一个顶替后下沉
  pop() {
    if (this.size() === 0) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.size() > 0) {
      this.heap[0] = end;
      this.heapify(0);
    }
    return min;
  }

  // 下沉：保证子堆也保持堆序
  heapify(i) {
    const l = this.left(i), r = this.right(i);
    let smallest = i;
    if (l < this.size() && this.heap[l] < this.heap[smallest]) smallest = l;
    if (r < this.size() && this.heap[r] < this.heap[smallest]) smallest = r;
    if (smallest !== i) {
      this.swap(i, smallest);
      this.heapify(smallest);
    }
  }

  // 查看堆顶
  peek() {
    return this.heap[0];
  }
}
```