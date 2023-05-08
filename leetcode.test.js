const containsDuplicate = require('./leetcode.js')


test('基本測試-1', function () {
    expect(containsDuplicate([1, 2, 3, 1])).toBe(true)
})
test('基本測試-2', function () {
    expect(containsDuplicate([1, 2, 3, 4])).toBe(false)
})
test('基本測試-3', function () {
    expect(containsDuplicate([])).toBe(false)
})
test('基本測試-4', function () {
    expect(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true)
})
test('基本測試-5', function () {
    expect(containsDuplicate([-1])).toBe(false)
})