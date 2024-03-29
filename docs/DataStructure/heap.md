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