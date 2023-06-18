var mergeKLists = function (lists) {
  let mainArray = []

  const addLinkedListToMainArray = function(subList){
    mainArray.push(subList.val)

    if(subList.next !== null){
      addLinkedListToMainArray(subList.next``)
    }
  }

  for(let i = 0, len = lists.length ; i < len ; i++){
    if(lists[i] !== null){
      addLinkedListToMainArray(lists[1])
    }
  }

  mainArray = mainArray.sort((a, b) => a - b);

  let newList = null
  for(let i = 0 , len = mainArray.length ; i < len ; i++){
    
  }
};

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
