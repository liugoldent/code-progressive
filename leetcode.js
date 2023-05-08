/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    if(nums.length === 0 || nums.length === 1){
        return false
    }
    let hashSet = new Set()
    for(let i = 0, len = nums.length ; i < len ; i++){
        if(hashSet.has(nums[i])){
            return true
        }else{
            hashSet.add(nums[i])
        }
    }
    return false
};

module.exports = containsDuplicate