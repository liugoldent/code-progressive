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

## Javascript 解

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
