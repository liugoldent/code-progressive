---
tags: 
    - LeetCode
    - Hard
    - Find Median from Data Stream
    - Javascript
    - Heap / Priority Queue
---

# [0295] Find Median from Data Stream
## javascript 解
```js
class MinHeap {
    constructor(){
        this.heap = []
    }

    insert(num){
        this.heap.push(num)
        this.heapifyUp()
    }
    size(){
        return this.heap.length
    }
    heapifyUp(){
        let currentIndex = this.size() -1;
        while(this.hasParent(currentIndex) && this.getParent(currentIndex) > this.heap[currentIndex]){
            const parentIndex = this.getParentIndex(currentIndex)
            this.swap(parentIndex, currentIndex)
            currentIndex = parentIndex
        }
    }
    heapifyDown(){
        let currentIndex = 0
        while(this.hasLeftChild(currentIndex)){
            let smallestChildIndex = this.getLeftChildIndex(currentIndex)
        }
    }
    getLeftChildIndex(parentIndex){
        return 2* parentIndex +1
    }
    getRightChildIndex(parentIndex){
        return 2* parentIndex +2
    }
    hasParent(childIndex) {
        return this.getParentIndex(childIndex) >= 0;
    }
    getParent(childIndex) {
        return this.heap[this.getParentIndex(childIndex)];
    }
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }
}

```
## 完整程式碼
```js
class MedianFinder {
  constructor() {
    this.minHeap = new MinHeap();
    this.maxHeap = new MaxHeap();
  }

  addNum(num) {
    if (this.minHeap.isEmpty() || num > this.minHeap.peek()) {
      this.minHeap.insert(num);
    } else {
      this.maxHeap.insert(num);
    }

    // Balance the heaps
    if (this.minHeap.size() - this.maxHeap.size() > 1) {
      this.maxHeap.insert(this.minHeap.remove());
    } else if (this.maxHeap.size() - this.minHeap.size() > 1) {
      this.minHeap.insert(this.maxHeap.remove());
    }
  }

  findMedian() {
    if (this.minHeap.size() === this.maxHeap.size()) {
      return (this.minHeap.peek() + this.maxHeap.peek()) / 2;
    } else if (this.minHeap.size() > this.maxHeap.size()) {
      return this.minHeap.peek();
    } else {
      return this.maxHeap.peek();
    }
  }
}

class MinHeap {
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
    let currentIndex = this.size() - 1;
    while (this.hasParent(currentIndex) && this.getParent(currentIndex) > this.heap[currentIndex]) {
      const parentIndex = this.getParentIndex(currentIndex);
      this.swap(parentIndex, currentIndex);
      currentIndex = parentIndex;
    }
  }

  heapifyDown() {
    let currentIndex = 0;
    while (this.hasLeftChild(currentIndex)) {
      let smallestChildIndex = this.getLeftChildIndex(currentIndex);
      if (this.hasRightChild(currentIndex) && this.getRightChild(currentIndex) < this.getLeftChild(currentIndex)) {
        smallestChildIndex = this.getRightChildIndex(currentIndex);
      }

      if (this.heap[currentIndex] < this.heap[smallestChildIndex]) {
        break;
      } else {
        this.swap(currentIndex, smallestChildIndex);
      }

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

  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
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
    let currentIndex = this.size() - 1;
    while (this.hasParent(currentIndex) && this.getParent(currentIndex) < this.heap[currentIndex]) {
      const parentIndex = this.getParentIndex(currentIndex);
      this.swap(parentIndex, currentIndex);
      currentIndex = parentIndex;
    }
  }

  heapifyDown() {
    let currentIndex = 0;
    while (this.hasLeftChild(currentIndex)) {
      let largestChildIndex = this.getLeftChildIndex(currentIndex);
      if (this.hasRightChild(currentIndex) && this.getRightChild(currentIndex) > this.getLeftChild(currentIndex)) {
        largestChildIndex = this.getRightChildIndex(currentIndex);
      }

      if (this.heap[currentIndex] > this.heap[largestChildIndex]) {
        break;
      } else {
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
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
}

```