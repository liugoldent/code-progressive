var KthLargest = function(k, nums){
    this.k = k // 代表要找到的第k大元素
    this.heap = []
    for(let num of nums){
        this.add(num)
    }
}

KthLargest.prototype.add = function(val){
    if(this.heap.length < this.k){ // 如果最小堆的長度小於 k，直接將元素添加到堆中
        this.heap.push(val)
        this.heapifyUp(this.heap.length -1)
    }else if(val > this.heap[0]){ // 如果元素大於堆頂元素，替換堆頂元素並進行堆化操作
        this.heap[0] = val
        this.heapifyDown(0)
    }

    return this.heap[0]
}

KthLargest.prototype.heapifyUp = function(index){
    const parent = Math.floor((index - 1) /2)
    if(parent >= 0 && this.heap[parent] > this.heap[index]){
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[heap]]
      this.heapifyUp(parent)
    }
}


KthLargest.prototype.heapifyDown = function(index){
    const left = 2 * index + 1
    const right = 2 * index + 2
    let smallest = index
    if(left < this.heap.length && this.heap[left] < this.heap[smallest]) {
      smallest = left
    }
    if(right < this.heap.length && this.heap[right] < this.heap[smallest]){
      smallest = right
    }
    if(smallest !== index){
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]]
      thtis.heapifyDown(smallest)
    }
}
