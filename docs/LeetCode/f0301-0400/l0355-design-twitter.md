---
tags: 
    - LeetCode
    - Medium
    - Design Twitter
    - Javascript
    - Heap / Priority
---
# [0355] Design Twitter
## Javascript 解
[贾考博 LeetCode 355. Design Twitter - 马斯克你到底买不买? 给个准信儿](https://www.youtube.com/watch?v=vUGrlKvib1k&ab_channel=%E8%B4%BE%E8%80%83%E5%8D%9A)
```js
/**
 * Initialize your data structure here.
 */
var Twitter = function() {
  this.users = new Map(); // 用一個Map去創建users的陣列
  this.tweets = []; // 儲存tweet資料
};

/**
 * @description tweet po文
 * @param {number} userId
 * @param {number} tweetId
 */
Twitter.prototype.postTweet = function(userId, tweetId) {
  // 確認是否有此會員
  if (!this.users.has(userId)) {
    // 如果沒有會員，則要新增一個set
    this.users.set(userId, new Set());
  }
  // this.tweets保存所有文章，使用unshift將文章，放到最前面
  this.tweets.unshift({ userId, tweetId, timestamp: Date.now() });
};

/**
 * @description 取得最新文章
 * @param {number} userId
 * @return {number[]}
 */
Twitter.prototype.getNewsFeed = function(userId) {
  // 首先找到follow的使用者
  const followedUsers = this.users.get(userId);
  
  // 然後取得文章內容 || 使用者的文章
  const filteredTweets = this.tweets.filter(tweet => {
    return tweet.userId === userId || followedUsers.has(tweet.userId);
  });
  
  // 對找出的文章做排序（記得是b => a）因為要最新的放上面
  filteredTweets.sort((a, b) => b.timestamp - a.timestamp);
  
  // 最後取出前10篇文章
  return filteredTweets.slice(0, 10).map(tweet => tweet.tweetId);
};

/**
 * @description 追隨人員
 * @param {number} followerId
 * @param {number} followeeId
 */
Twitter.prototype.follow = function(followerId, followeeId) {
  // 如果沒有followerId -> 先set
  if (!this.users.has(followerId)) {
    this.users.set(followerId, new Set());
  }
  // 如果沒有followeeId -> 先set
  if (!this.users.has(followeeId)) {
    this.users.set(followeeId, new Set());
  }
  
  // 然後取得追隨者的陣列，再加上followeeId
  this.users.get(followerId).add(followeeId);
};

/**
 * @description 取消追蹤
 * @param {number} followerId
 * @param {number} followeeId
 */
Twitter.prototype.unfollow = function(followerId, followeeId) {
  // 確認是否已經追蹤，若沒有追蹤了，就return 
  if (!this.users.has(followerId) || !this.users.has(followeeId)) {
    return;
  }
  
  // 有追蹤，就delete掉
  this.users.get(followerId).delete(followeeId);
};

/**
 * Your Twitter object will be instantiated and called as such:
 * var obj = new Twitter()
 * obj.postTweet(userId,tweetId)
 * var param_2 = obj.getNewsFeed(userId)
 * obj.follow(followerId,followeeId)
 * obj.unfollow(followerId,followeeId)
 */

```