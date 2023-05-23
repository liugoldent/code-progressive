/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  nums = nums.sort((a, b) => a - b)
  console.log(nums)
  let res = []
  for (let i = 0, len = nums.length - 2; i < len; i++) {
    if (i === 0 || (i > 0 && nums[i - 1] !== nums[i])) {
      let left = i+1
      let right = nums.length - 1
      let sum = 0 - nums[i]
      while (left < right) {
        if (nums[left] + nums[right] === sum) {
          // 這裏將答案放進去res
          res.push([nums[i], nums[left], nums[right]])
          // 放完之後，因爲不是找唯一解，所以在while循環，找到下一個不是重複的元素
          while (left < right && nums[left] === nums[left + 1]) {
              left++
              console.log('1--',left)
          }
          while (left < right && nums[right] === nums[right - 1]) right--
          // 最後在++一次
          left++
          console.log('2--',left)
          right--
        }else if(nums[left] + nums[right] > sum){
          right--
        }else if (nums[left] + nums[right] < sum){
          left++
        }
        
      }
    }
  }
  return res
};
console.log(threeSum([-1,-1,2,3,-5,6,-7]))
// test("基本測試", () => {
//   expect(threeSum([-1,0,1,2,-1,-4])).toMatchObject([[-1,-1,2],[-1,0,1]]);
// });

// test("基本測試", () => {
//   expect(threeSum([0,1,1])).toMatchObject([]);
// });

// test("基本測試", () => {
//   expect(threeSum([0,0,0])).toMatchObject([[0,0,0]]);
// });

// test("基本測試", () => {
//   expect(threeSum([-1,2,3,-5,6,-7])).toMatchObject([[ -5, -1, 6 ], [ -5, 2, 3 ]]);
// });





