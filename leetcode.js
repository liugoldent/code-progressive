/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
  const results = []

  const backTrack = (currentCombination, start, currentSum) => {
    // 如果顯在的總和就等於target，則return 解構的currentCombination
    if(currentSum === target){
      results.push([...currentCombination])
      return 
    }

    // 如果現在的總和 > target 代表不成立，則return 
    if(currentSum > target){
      return 
    }

    // 遍歷候選數組，從起始索引開始
    for(let i = start; i < candidates.length ; i ++){
      currentCombination.push(candidates[i]) // 將候選數加入當前組合
      backTrack(currentCombination, i, currentSum + candidates[i]) // 遞歸繼續尋找符合要求的組合
      console.log(currentCombination)
      currentCombination.pop() // 回溯，將最後一個添加的候選數移出當前組合，進行下一輪遍歷
    }
  }

  // 初始化回溯函數，起始組合為空，起始索引為 0，當前總和為 0
  backTrack([], 0, 0)

  return results
};

combinationSum([2,3,6,7], 7)