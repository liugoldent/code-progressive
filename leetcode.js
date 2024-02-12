/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement2 = function (nums) {
  let majorMap = new Map();
  let countBiggest = 0;
  let valueBiggest = 0;
  for (let i = 0, len = nums.length; i < len; i++) {
    if (!majorMap.has(nums[i])) {
      majorMap.set(nums[i], 1);
    } else {
      let addCount = majorMap.get(nums[i]) + 1;
      majorMap.set(nums[i], addCount);
    }
    if (majorMap.get(nums[i]) > countBiggest) {
      countBiggest = majorMap.get(nums[i]);
      valueBiggest = nums[i];
    }
  }
  return valueBiggest;
};
var majorityElement = function (nums) {
  let count = 0;
  let candidate = null;

  for (let num of nums) {
    if (count === 0) {
      candidate = num;
    }
    if (num === candidate) {
      count = count + 1;
    } else {
      count = count - 1;
    }
  }

  return candidate;
};

console.log(111, majorityElement([6, 5, 5]));
