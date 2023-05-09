const isAnagram = require('./leetcode.js')


test('基本測試-1', function () {
    expect(isAnagram('anagram', 'nagaram')).toBe(true)
})

test('基本測試-2', function () {
  expect(isAnagram('cat', 'rat')).toBe(false)
})

test('基本測試-3', function () {
  expect(isAnagram('catr', 'rat')).toBe(false)
})

test('基本測試-4', function () {
  expect(isAnagram('a', 'c')).toBe(false)
})

test('基本測試-5', function () {
  expect(isAnagram('acc', 'cca')).toBe(true)
})
