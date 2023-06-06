/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  let left = 0
  let right = nums.length - 1
  while (left < right) {
    const mid = left + (Math.floor((right - left) / 2))
    if (nums[right] >= nums[mid]) {
      right = mid
    } else {
      left = mid + 1
    }
  }
  return nums[left]
};
console.log(findMin([3,4,5,1,2]))
// test("基本測試", () => {
//   expect(findMin([1, 2, 3, 4, 5, 6])).toEqual(1);
// });

// test("基本測試", () => {
//   expect(maxArea([1, 1])).toEqual(1);
// });

// test("基本測試", () => {
//   expect(threeSum([0,0,0])).toMatchObject([[0,0,0]]);
// });

// test("基本測試", () => {
//   expect(threeSum([-1,2,3,-5,6,-7])).toMatchObject([[ -5, -1, 6 ], [ -5, 2, 3 ]]);
// });





