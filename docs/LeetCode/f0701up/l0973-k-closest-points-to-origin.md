---
tags: 
    - LeetCode
    - Medium
    - K Closest Points to Origin
    - Javascript
---
# [0973] K Closest Points to Origin
* 思路：主要因為是跟原點取距離，所以直接將每個元素去計算距離，最後攤平，即可取得前面k項最接近的points

```js
/**
 * @param {number[][]} points
 * @param {number} k
 * @return {number[][]}
 */
var kClosest = function(points, k) {
    // 將所有點與距離，變成一個物件儲存
    // 變成 distance = {
    //    '32': [4,4],
    //    '20': [4,2]
    // }
    let allDistance = points.reduce((accu, cur) =>{
        let distance = cur[0] * cur[0] + cur[1] * cur[1]
        if(accu[distance]){
            accu[distance].push(cur)
        }else{
            accu[distance] = []
            accu[distance].push(cur)
        }
        return accu
    }, {})

    // 再將其攤平，由2維陣列變1維陣列
    let sortedKeys = Object.values(allDistance).flat()
    // 最後將其切出
    return sortedKeys.slice(0,k)
};
```