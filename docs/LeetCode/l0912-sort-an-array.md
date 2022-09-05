---
tags: 
    - LeetCode
    - Medium
    - Sort an Array
    - Javascript
---
# [0912] Sort an Array
## Javascript 解
思路：
1. 定義一個quicksort function
2. 先找到分界點
3. partition 分界點index
    - 先設定軸心pivot
    - 最大條件是當兩者沒有相碰時，則while loop
    - 迴圈內條件：1. 當arr[i] < pivot 時，i不斷++
    - 迴圈內條件：2. 當arr[j] > pivot 時，j不斷--
    - 當兩者終於相等時，則交換，並且i++/j--
    - 最後 return i值，作為新的中點index
4. 回到quicksort function
5. 分為左陣列與右陣列
6. 再次呼叫quicksort，但是傳入值為新的左右邊界。
```javascript
/**
 2  * @param {number[]} nums
 3  * @return {number[]}
 4  */
var sortArray = function (nums) {
    return quickSort(nums, 0, nums.length - 1);
};

const quickSort = function (arr, left, right) {
    let index;
    if (arr.length > 1) {
        // partition => 想像找出中間位子
        index = partition(arr, left, right);
        if (left < index - 1) {
            quickSort(arr, left, index - 1);
        }
        if (right > index) {
            quickSort(arr, index, right);
        }
    }
    return arr;
};

const partition = function (arr, left, right) {
    // 設定軸心
    const pivot = arr[Math.floor((left + right) / 2)];
    let i = left;
    let j = right;
    // 當 i > j 代表這次的巡迴結束
    while (i <= j) {
        // 左指標：當指標小於軸心，則一直向右
        while (arr[i] < pivot) {
            i++;
        }
        // 右指標：當指標大於軸心，則一直向左（直到找到比軸心小的數值）
        while (arr[j] > pivot) {
            j--;
        }
        // 當兩個都跑完，則交換
        if (i <= j) {
            swap(arr, i, j);
            i++;
            j--;
        }
    }
    // return i = index => 代表新軸心，下次迭代則以這個為分界點
    return i;
};

const swap = function (arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
};
```
