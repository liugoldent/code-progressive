/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let left = 0
    let right = height.length -1
    let leftMax = 0
    let rightMax = 0
    let totalWater = 0
    while(left < right){
      if(height[left] < height[right]){
        leftMax = Math.max(leftMax, height[left])
        totalWater += leftMax - height[left]
        left++
      }else{
        rightMax = Math.max(rightMax, height[right])
        totalWater += rightMax - height[right]
        right--
      }
    }
    return totalWater
};

// test("基本測試", () => {
//   expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toEqual(49);
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





