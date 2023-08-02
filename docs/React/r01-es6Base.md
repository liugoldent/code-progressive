---
description: react ES6必備語法
tags:
  - javascript
  - react
  - frontEnd
---
# [React] ES6 必備語法
## Template Literals 模板語法
* 可以方便我們在字串中帶入JS表達式
```js
const favoriteFood = 'sushi'

console.log(`I love ${favoriteFood}`)
```

## Arrow Functions 箭頭函式
```js
// 傳統function
function show(){
    // .....
}

// 箭頭函式function
const show = () => {

}
```
## 解構賦值
### 解構一層
```js
const person = {
    name: 'Alex',
    age: 18
}
// 直接解構，取得其值
const {name, age} = person
```
### 解構二層物件
```js
const person = {
    offers: {
        company: 'A company'
    }
}
// 解構第二層物件
const {
    offers: {company}
} = person
```
### 陣列的解構
* 會將第0、1、2變成所指定的變數
```js
const mobileBrands = [
  'Samsung', 'Apple', 'Huawei', 'Oppo'
]; 
const [best, second, third] = mobileBrands;

console.log(best);     // Samsung
console.log(second);   // Apple
console.log(third);    // Huawei
```

## 展開語法 與 其餘語法
* `...` 稱作「展開語法（Spread Syntax）」和「其餘語法（Rest Syntax）」
### 展開語法（spread syntax）
#### 物件
```js
const mobilePhone = {
  name: 'mobile phone',
  publishedYear: '2019',
};
const iPhone = {
  ...mobilePhone,
  name: 'iPhone',
  os: 'iOS',
};
```
#### 陣列
```js
const mobilesOnSale = ['Samsung', 'Apple', 'Huawei'];
const allMobiles = [...mobilesOnSale, 'Oppo', 'Vivo', 'Xiaomi'];

console.log(allMobiles); // [ 'Samsung', 'Apple', 'Huawei', 'Oppo', 'Vivo', 'Xiaomi' ]
```

### 其餘語法
```js
const product = {
  name: 'iPhone',
  image: 'https://i.imgur.com/b3qRKiI.jpg',
  brand: {
    name: 'Apple',
  },
  // ...
};
// 這邊使用...other將其餘的東西都解出來
const { name, description, ...other } = product;
console.log(other);
```

