---
description: 測試基本資訊
tags:
  - learn
  - javascript
  - jest
---


# 測試 - 關鍵字
## 常用關鍵字與基本知識
### 命名方式
* 測試檔案的命名（建議與組件有相同名稱），外加一個`.spec`後綴字
* 好的測試名稱
  * 正在測試什麼
  * 在什麼情況下
  * 預期得到什麼

### shallowMount
* 如果有子元件，子元件會被替代掉

### mount
* 對於子元件與母元件全部渲染

### it、test
* 為測試最小單位，像是變數宣告，每一筆測試都要使用test宣告
```js
const number = 2

describe('Number', () => {
  test('is 2', () => {
    expect(number).toBe(2)
  })

  it('is even', () => {
    expect(number % 2).toBe(0)
  })
})
```

### Wrapper
* 是一個包含要掛載組件（mounted component）或vnode，以及測試該組件或vnode的方法
* vm：為Vue的實例，可以通過`wrapper.vm`去訪問掛載在這個wrapper的Component方法與屬性
```js
chai.expect(wrapper.vm.$route.path).to.equal('/');
```

### describe 測試分組
* 一個組別下可以有多個小單元測試

### 測試前後的任務
* beforeAll：所有測試前開始執行
* afterAll：所有測試後開始執行
* beforeEach：每個測試前開始執行
* afterEach：每個測試後開始執行

## 常用匹配器
### toBe（基本型態）
```js
test('toBe test', () => {
    expect(1 + 2).toBe(3);
});
```
### toEqual（物件型別）
```js
test('toEqual 比對物件', () => {
    const data = { one: 2 };
    data['two'] = 3;
    expect(data).toEqual({ one: 2, two: 3 });
});
```
### toBeCloseTo：應用在小數點的計算。

### toMatch：字串比對

### toContain：確認值是否存在於陣列

### toThrow：確認吐出的錯誤訊息是否符合預期

