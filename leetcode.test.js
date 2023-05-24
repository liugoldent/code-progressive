/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let maxA = 0
  let left = 0
  let right = height.length - 1
  while (left < right) {
    maxA = Math.max(maxA, [right - left] * Math.min(height[left], height[right]))
    if (height[left] > height[right]) {
      right--
    } else {
      left++
    }
  }
  return maxA
};

test("基本測試", () => {
  expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toEqual(49);
});

test("基本測試", () => {
  expect(maxArea([1, 1])).toEqual(1);
});

// test("基本測試", () => {
//   expect(threeSum([0,0,0])).toMatchObject([[0,0,0]]);
// });

// test("基本測試", () => {
//   expect(threeSum([-1,2,3,-5,6,-7])).toMatchObject([[ -5, -1, 6 ], [ -5, 2, 3 ]]);
// });





