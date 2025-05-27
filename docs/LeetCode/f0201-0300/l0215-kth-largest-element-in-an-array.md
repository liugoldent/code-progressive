---
tags:
  - LeetCode
  - Medium
  - javascript
  - Kth Largest Element in an Array
  - Heap
  - PriorityQueue
---

# [0215] Kth Largest Element in an Array

- 思路：
- 此題有一種最簡單解法：先排序後，直接取值，沒什麼複雜度，但可以試試看快速排序法。（看第二種解法）

### 一般排序

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  let sortNums = nums.sort((a, b) => b - a);
  return sortNums[k - 1];
};
```

### 快速選擇

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  // 快速選擇的遞迴函式
  // 這答案是大排到小
  function quickSelect(nums, left, right, k) {
    // 將陣列分為左、中、右三部分
    const pivotIndex = partition(nums, left, right);
    // 判斷第 K 大的元素在哪一部分
    if (pivotIndex === k - 1) {
      return nums[pivotIndex];
    } else if (pivotIndex < k - 1) {
      // 第 K 大的元素在右部分，繼續遞迴處理右部分
      return quickSelect(nums, pivotIndex + 1, right, k);
    } else {
      // 第 K 大的元素在左部分，繼續遞迴處理左部分
      return quickSelect(nums, left, pivotIndex - 1, k);
    }
  }
  // 將陣列分為左、中、右三部分的分割函式
  function partition(nums, left, right) {
    const pivot = nums[left]; // 選擇第一個元素作為基準值
    let i = left + 1; // 左指標
    let j = right; // 右指標

    while (true) {
      // 左指標向右移動，直到找到小於等於基準值的元素
      while (i <= j && nums[i] > pivot) {
        i++;
      }
      // 右指標向左移動，直到找到大於等於基準值的元素
      while (i <= j && nums[j] < pivot) {
        j--;
      }

      if (i >= j) {
        break;
      }
      // 交換左右指標對應的元素
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i++;
      j--;
    }
    // 將基準值放到最後的正確位置
    [nums[left], nums[j]] = [nums[j], nums[left]];
    return j;
  }
  return quickSelect(nums, 0, nums.length - 1, k);
};
```

### 最大堆最小堆
```js
class MaxHeap {
    constructor() {
        this.heap = []
    }
    size(){
        return this.heap.length
    }
    parent(i){
        return Math.floor((i-1) / 2)
    }
    left(i) {
        return 2*i+1
    }
    right(i){
        return 2*i+2
    }
    swap(i,j){
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
    }
    push(val){
        this.heap.push(val)
        let i = this.heap.length - 1
        while(i > 0 && this.heap[i] > this.heap[this.parent(i)]){
            this.swap(i, this.parent(i))
            i = this.parent(i)
        }
    }

    pop(){
        if(this.heap.length === 0) return undefined
        const max = this.heap[0]
        const end = this.heap.pop()
        if(this.size() > 0){
            this.heap[0] = end
            this.heapify(0)
        }
        return max
    }

    heapify(i){
        const l = this.left(i)
        const r = this.right(i)
        let largest = i
        if(l < this.size() && this.heap[l] > this.heap[largest]) largest = l
        if(r < this.size() && this.heap[r] > this.heap[largest]) largest = r
        if(largest !== i){
            this.swap(i, largest)
            this.heapify(largest)
        }
    }
}


/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    const heap = new MaxHeap()
    nums.forEach(x => heap.push(x))

    for(let i = 1; i < k; i++){
        heap.pop()
    }

    return heap.pop()
};
```
