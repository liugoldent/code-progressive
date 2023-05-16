/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
  let result = new Array(nums.length).fill(1)
  let p 
  p = 1
  for (let i = 0, len = nums.length; i < len; i++) {
    result[i] = result[i] * p // 左到右的乘積（不包含頭尾）
    p = nums[i] * p // 累積的product
  }
  p = 1
  for (let j = nums.length - 1 ; j >= 0 ; j-- ) {
    result[j] = result[j] * p // 右到左的乘積
    p = nums[j] * p // 累積的product
  }
};

productExceptSelf([2,3,4,5])
