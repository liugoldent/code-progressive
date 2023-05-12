const groupAnagrams = require("./leetcode.js");

test("基本測試-1", function () {
  expect(groupAnagrams(["eat","tea","tan","ate","nat","bat"])).toEqual([ 'eat', 'tea', 'ate' ], [ 'nat', 'tan' ], [ 'bat' ]);
});

test("基本測試-2", function () {
  expect(groupAnagrams([""])).toEqual([[""]]);
});

test("基本測試-3", function () {
  expect(groupAnagrams(["a"])).toEqual([["a"]]);
});

test("基本測試-4", function () {
  expect(groupAnagrams(["abc", "bbb"])).toEqual([["abc"], ["bbb"]]);
});

