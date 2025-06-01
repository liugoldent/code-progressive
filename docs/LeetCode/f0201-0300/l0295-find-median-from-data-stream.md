---
tags:
  - LeetCode
  - Hard
  - Find Median from Data Stream
  - javascript
  - Heap / Priority Queue
---

# [0295] Find Median from Data Stream

[堆的講解-youtube](https://www.youtube.com/watch?v=j-DqQcNPGbE&list=PLAnjpYDY-l8L7kiVvyYrYsM9pq9BflB2l&index=18&ab_channel=%E9%BB%84%E6%B5%A9%E6%9D%B0)
[堆的講解-it](https://ithelp.ithome.com.tw/articles/10279678?sc=iThelpR)
[推薦視頻](https://www.youtube.com/watch?v=cqhED6Xgy9Y&ab_channel=%E5%B1%B1%E6%99%AF%E5%9F%8E%E4%B8%80%E5%A7%90)

## Javascript 解 - 1

```js
class MedianFinder {
  constructor() {
    this.minHeap = new MinHeap();
    this.maxHeap = new MaxHeap();
  }

  addNum(num) {
    // 如果最小堆為空 or num > 最小堆第一個元素，則直接insert
    if (this.minHeap.isEmpty() || num > this.minHeap.peek()) {
      this.minHeap.insert(num);
    } else {
      this.maxHeap.insert(num);
    }

    // Balance the heaps。總而言之是要讓兩邊相等
    if (this.minHeap.size() - this.maxHeap.size() > 1) {
      // 如果minHeap > maxHeap 則maxHeap插入
      this.maxHeap.insert(this.minHeap.remove());
    } else if (this.maxHeap.size() - this.minHeap.size() > 1) {
      // 反之則反
      this.minHeap.insert(this.maxHeap.remove());
    }
  }

  findMedian() {
    if (this.minHeap.size() === this.maxHeap.size()) {
      // 相等則取出中位數
      return (this.minHeap.peek() + this.maxHeap.peek()) / 2;
    } else if (this.minHeap.size() > this.maxHeap.size()) {
      // minHeap較多則peak出minHeap
      return this.minHeap.peek();
    } else {
      // maxHeap較多則peak出maxHeap
      return this.maxHeap.peek();
    }
  }
}

class MinHeap {
  constructor() {
    this.heap = [];
  }
  /**
   * @description 插入元素之後，要再最小堆化
   */
  insert(num) {
    this.heap.push(num);
    this.heapifyUp();
  }
  /**
   * @description 移除元素。先peak第一個元素，再把最後一個元素，提到第一個
   */
  remove() {
    if (this.isEmpty()) return null;
    if (this.size() === 1) return this.heap.pop();

    const removedValue = this.peek();
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return removedValue;
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  heapifyUp() {
    // 取得最後一個節點
    let currentIndex = this.size() - 1;
    // 當有父節點時，並且父節點大於現在節點
    while (
      this.hasParent(currentIndex) &&
      this.getParent(currentIndex) > this.heap[currentIndex]
    ) {
      // 取得parentIndex，讓其交換
      const parentIndex = this.getParentIndex(currentIndex);
      this.swap(parentIndex, currentIndex);
      currentIndex = parentIndex;
    }
  }

  heapifyDown() {
    // 設置 currentIndex 為 0，從根節點進行操作。
    let currentIndex = 0;
    // 當我們有左節點時，就一直往下走
    while (this.hasLeftChild(currentIndex)) {
      // 先假設左邊子節點的數值是最小的
      let smallestChildIndex = this.getLeftChildIndex(currentIndex);
      // 然後如果右邊子節點有比較小的值，就把最小值變成右節點
      if (
        this.hasRightChild(currentIndex) &&
        this.getRightChild(currentIndex) < this.getLeftChild(currentIndex)
      ) {
        smallestChildIndex = this.getRightChildIndex(currentIndex);
      }

      // 如果這個最小的節點已經大於currentIndex，則break（因為已經符合最小堆原則）
      if (this.heap[currentIndex] < this.heap[smallestChildIndex]) {
        break;
      } else {
        // 否則swap
        this.swap(currentIndex, smallestChildIndex);
      }

      // 最後將currentIndex = 最小index
      currentIndex = smallestChildIndex;
    }
  }

  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  hasLeftChild(parentIndex) {
    return this.getLeftChildIndex(parentIndex) < this.size();
  }

  hasRightChild(parentIndex) {
    return this.getRightChildIndex(parentIndex) < this.size();
  }

  hasParent(childIndex) {
    return this.getParentIndex(childIndex) >= 0;
  }

  getLeftChild(parentIndex) {
    return this.heap[this.getLeftChildIndex(parentIndex)];
  }

  getRightChild(parentIndex) {
    return this.heap[this.getRightChildIndex(parentIndex)];
  }

  getParent(childIndex) {
    return this.heap[this.getParentIndex(childIndex)];
  }
  /**
   * @description 交換兩者元素
   */
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }
}

class MaxHeap {
  constructor() {
    this.heap = [];
  }

  insert(num) {
    this.heap.push(num);
    this.heapifyUp();
  }

  remove() {
    if (this.isEmpty()) return null;
    if (this.size() === 1) return this.heap.pop();

    const removedValue = this.peek(); // 先取出第一個元素
    this.heap[0] = this.heap.pop(); // 取出最後一個元素
    this.heapifyDown(); //
    return removedValue;
  }
  /**
   * @description peak出第一個元素
   */
  peek() {
    if (this.isEmpty()) return null;
    return this.heap[0];
  }
  /**
   * @description 這個堆有多大
   */
  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  heapifyUp() {
    let currentIndex = this.size() - 1;
    while (
      this.hasParent(currentIndex) &&
      this.getParent(currentIndex) < this.heap[currentIndex]
    ) {
      const parentIndex = this.getParentIndex(currentIndex);
      this.swap(parentIndex, currentIndex);
      currentIndex = parentIndex;
    }
  }

  heapifyDown() {
    // 設置 currentIndex 為 0，從根節點進行操作。
    let currentIndex = 0;
    // 然後，進入 while 循環，該循環會一直執行，直到 currentIndex 節點沒有左子節點為止。
    while (this.hasLeftChild(currentIndex)) {
      // 我們先假設左邊子節點比較大
      let largestChildIndex = this.getLeftChildIndex(currentIndex);
      // 然後去判斷右邊子節點是否大於左邊子節點
      if (
        this.hasRightChild(currentIndex) &&
        this.getRightChild(currentIndex) > this.getLeftChild(currentIndex)
      ) {
        // 如果右邊比較大，就將這個index，設成右邊的子節點
        largestChildIndex = this.getRightChildIndex(currentIndex);
      }
      // 如果currentIndex 節點的值大於 largestChildIndex 節點的值
      if (this.heap[currentIndex] > this.heap[largestChildIndex]) {
        break;
      } else {
        // 否則交換
        this.swap(currentIndex, largestChildIndex);
      }

      currentIndex = largestChildIndex;
    }
  }

  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }
  /**
   * @description 取得父元素節點
   */
  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  hasLeftChild(parentIndex) {
    return this.getLeftChildIndex(parentIndex) < this.size();
  }

  hasRightChild(parentIndex) {
    return this.getRightChildIndex(parentIndex) < this.size();
  }

  hasParent(childIndex) {
    return this.getParentIndex(childIndex) >= 0;
  }

  getLeftChild(parentIndex) {
    return this.heap[this.getLeftChildIndex(parentIndex)];
  }

  getRightChild(parentIndex) {
    return this.heap[this.getRightChildIndex(parentIndex)];
  }

  getParent(childIndex) {
    return this.heap[this.getParentIndex(childIndex)];
  }

  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }
}
```

## Javascript 解 - 2

```js
/**
 * 用于实现堆（优先队列）的通用类
 * comparator(a, b) 返回 true 时，表示 a 的优先级高于 b
 */
class Heap {
  constructor(comparator) {
    this.data = [];
    this.comparator = comparator;
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  // 插入元素 x 到堆中，维持堆性质
  push(x) {
    this.data.push(x);
    this._siftUp(this.data.length - 1);
  }

  // heap - pop
  pop() {
    if (this.data.length === 0) return null;
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  _parent(index) {
    return Math.floor((index - 1) / 2);
  }

  _leftChild(index) {
    return index * 2 + 1;
  }

  _rightChild(index) {
    return index * 2 + 2;
  }
  // 這個是heap - 上浮
  _siftUp(index) {
    let parent = this._parent(index);
    while (
      index > 0 &&
      this.comparator(this.data[index], this.data[parent])
    ) {
      this._swap(index, parent);
      index = parent;
      parent = this._parent(index);
    }
  }

  // 這個是heap - heapify
  _siftDown(index) {
    const size = this.data.length;
    while (true) {
      let left = this._leftChild(index);
      let right = this._rightChild(index);
      let candidate = index;

      if (
        left < size &&
        this.comparator(this.data[left], this.data[candidate])
      ) {
        candidate = left;
      }
      if (
        right < size &&
        this.comparator(this.data[right], this.data[candidate])
      ) {
        candidate = right;
      }
      if (candidate === index) break;
      this._swap(index, candidate);
      index = candidate;
    }
  }

  _swap(i, j) {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  }
}

/**
 * 295. Find Median From Data Stream
 * 维护一个最大堆（lowerHalf）和一个最小堆（upperHalf）：
 * - lowerHalf: 存储较小的一半数，用最大堆实现，堆顶是这一半的最大值
 * - upperHalf: 存储较大的一半数，用最小堆实现，堆顶是这一半的最小值
 *
 * 插入新数时：
 *   1. 如果 lowerHalf 为空，或者新数 ≤ lowerHalf.peek()，就推到 lowerHalf；否则推到 upperHalf。
 *   2. 平衡两个堆：保证 |size(lowerHalf) - size(upperHalf)| ≤ 1。若差值为 2，就把堆顶元素从大堆移动到小堆。
 *
 * 查找中位数时：
 *   - 若两个堆大小相等，则中位数 = (lowerHalf.peek() + upperHalf.peek()) / 2
 *   - 否则中位数 = 元素较多的那一堆的堆顶
 */
class MedianFinder {
  constructor() {
    // 最大堆：放较小的一半元素，堆顶是最大值
    this.lowerHalf = new Heap((a, b) => a > b);
    // 最小堆：放较大的一半元素，堆顶是最小值
    this.upperHalf = new Heap((a, b) => a < b);
  }

  /** 
   * 将数值 num 加入数据流
   * @param {number} num
   * @return {void}
   */
  addNum(num) {
    // 初步将 num 放入合适的堆
    if (
      this.lowerHalf.size() === 0 ||
      num <= this.lowerHalf.peek()
    ) {
      this.lowerHalf.push(num);
    } else {
      this.upperHalf.push(num);
    }

    // 如果两个堆的大小差 > 1，需要从大堆“弹顶”到小堆
    if (this.lowerHalf.size() - this.upperHalf.size() > 1) {
      this.upperHalf.push(this.lowerHalf.pop());
    } else if (this.upperHalf.size() - this.lowerHalf.size() > 1) {
      this.lowerHalf.push(this.upperHalf.pop());
    }
  }

  /**
   * 返回到目前为止所有数的中位数
   * @return {number}
   */
  findMedian() {
    const sizeL = this.lowerHalf.size();
    const sizeU = this.upperHalf.size();

    if (sizeL === sizeU) {
      // 如果两个堆大小相等，中位数为两个堆顶平均
      if (sizeL === 0) return null; // 如果都空，返回 null 或者按题意返回 0
      return (this.lowerHalf.peek() + this.upperHalf.peek()) / 2;
    } else if (sizeL > sizeU) {
      return this.lowerHalf.peek();
    } else {
      return this.upperHalf.peek();
    }
  }
}

/* ------------------ 测试 ------------------ */
const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log(mf.findMedian()); // 输出 1.5
mf.addNum(3);
console.log(mf.findMedian()); // 输出 2

// 进一步测试
const mf2 = new MedianFinder();
const nums = [5, 15, 1, 3];
for (const x of nums) {
  mf2.addNum(x);
  console.log(`Added ${x}, current median: ${mf2.findMedian()}`);
}
// 依次输出：
// Added 5, current median: 5
// Added 15, current median: 10
// Added 1, current median: 5
// Added 3, current median: 4

```