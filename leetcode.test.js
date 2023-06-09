/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  if (nums.length === 1 && nums[0] !== target) {
    return -1;
  }
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = Math.floor((right - left) / 2);
    if(nums[mid] === target) return mid
    if(nums[left] <= nums[mid]){
      if(nums[left] <= target && target < nums[mid]){
        right = mid
      }else{
        left = mid + 1
      }
    }else{
      if(nums[mid] < target && target <= nums[right]){
        left = mid + 1
      }else{
        right = mid
      }
    }
  }
  return nums[left] === target ? left : -1
};

// search([1], 0);
console.log(search([4, 5, 6, 7, 0, 1, 2], 0))

// test("基本測試", () => {
//   expect(findMin([1, 2, 3, 4, 5, 6])).toEqual(1);
// });

// test("基本測試", () => {
//   expect(lengthOfLongestSubstring('bbbbb')).toEqual(1);
// });

// test("基本測試", () => {
//   expect(lengthOfLongestSubstring('pwwkew')).toEqual(3);
// });

// test("基本測試", () => {
//   expect(threeSum([-1,2,3,-5,6,-7])).toMatchObject([[ -5, -1, 6 ], [ -5, 2, 3 ]]);
// });
