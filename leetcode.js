function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

function levelOrder(root) {
  if (!root) {
    return []; // 空树的情况，直接返回空数组
  }

  const result = []; // 存储层级遍历结果的二维数组
  const queue = [root]; // 存储待访问的节点的队列
  console.log(111,queue)
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    console.log('levelSize', levelSize)
    console.log('currentLevel', currentLevel)
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    result.push(currentLevel);
  }

  return result;
}

// 创建二叉树
const root = new TreeNode(3);
root.left = new TreeNode(9);
root.right = new TreeNode(20);
root.right.left = new TreeNode(15);
root.right.right = new TreeNode(7);

// 执行层级遍历
const traversalResult = levelOrder(root);
console.log(traversalResult);
