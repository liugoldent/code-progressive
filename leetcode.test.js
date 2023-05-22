/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
  let left = 0
  let right = numbers.length - 1
  while(left < right){
    let sum = numbers[left] + numbers[right]
    if(sum === target){
      return [left+1, right+1]
    }
   if( sum > target){
          right--
      }else{
          left++
      }
  }
};


test("基本測試", () => {
  expect(twoSum([2,7,11,15], 9)).toMatchObject([1, 2]);
});

test("基本測試", () => {
  expect(twoSum([-1, 0], -1)).toMatchObject([1, 2]);
});

test("基本測試", () => {
  expect(twoSum([2,3,4], 6)).toMatchObject([1, 3]);
});



