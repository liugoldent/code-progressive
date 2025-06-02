---
tags:
  - LeetCode
  - Medium
  - Trees
  - javascript
  - Serialize and Deserialize Binary Tree
---

# [0297] Serialize and Deserialize Binary Tree

## Javascript 解

思路：
將樹轉成序列後，再轉回來

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
  if (!root) {
    return "null";
  }
  // 先把root放進queue
  let queue = [root];
  let result = [];

  // 當queue.length > 0 繼續往下跑
  while (queue.length > 0) {
    // 把node取出
    let node = queue.shift();
    // 如果node有，就放入其.val
    // 並且把queue加上接下來的節點
    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push("null");
    }
  }
  return result.join(",");
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
  console.log(data);
  if (data === "null") {
    return null;
  }
  // 首先把資料切開
  let splitData = data.split(",");
  // 建立新樹
  let root = new TreeNode(parseInt(splitData[0]));
  // 轉成一個queue
  let queue = [root];
  let index = 1;

  // 終止條件：queue.length > 0 && index > 傳進的資料長度
  while (queue.length > 0 && index < splitData.length) {
    // 先取出節點
    let node = queue.shift();
    if(!node) continue

    // 如果資料不為null
    if (splitData[index] !== "null") {
      // 則將此資料變成左子樹（因為序列是比較小的）
      node.left = new TreeNode(parseInt(splitData[index]));
      // 因為是放進資料，故queue.push節點進去
      queue.push(node.left);
    }
    // 做完index++
    index++;

    if (splitData[index] !== "null") {
      node.right = new TreeNode(parseInt(splitData[index]));
      queue.push(node.right);
    }
    index++;
  }

  return root;
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
```
