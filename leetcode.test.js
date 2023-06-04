/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    const targetFreq = {}
    for(let i = 0 ; i < t.length ; i++){
      targetFreq[t[i]] = (targetFreq[t[i]] || 0) + 1
    }
    let windowStart = 0
    let windowEnd = 0
    let minWindowLength = Infinity
    let windowCount = 0
    let minWindowStr = ''

    while(windowEnd < s.length){
      const charEnd = s[windowEnd]

      if(targetFreq[charEnd] !== undefined){
        targetFreq[charEnd]--
        if(targetFreq[charEnd] >= 0){
          windowCount++
        }
      }
      while(windowCount === t.length){
        if(windowEnd - windowStart + 1 < minWindowLength){
          minWindowLength = windowEnd - windowStart +1
          minWindowStr = s.substring(windowStart, windowEnd + 1)
        }
        const charStart = s[windowStart]
        if(targetFreq[charStart] !== undefined){
          targetFreq[charStart]++
          if(targetFreq[charStart] > 0){
            windowCount--
          }
        }
        windowStart++
      }
      windowEnd++
    }
    return minWindowStr
};

console.log(minWindow('ADOBECODEBANC', 'ABC'))
// test("基本測試", () => {
//   expect(lengthOfLongestSubstring('abcabcbb')).toEqual(3);
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





