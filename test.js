class BSTNode {
 constructor(val){
    this.val = val
    this.left = null
    this.right = null
 }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(val) {
    this.root = this._insertNode(this.root, val);
  }

  _insertNode(node, val) {
    if (node === null) {
      return new BSTNode(val);
    }
    if (val < node.val) {
      node.left = this._insertNode(node.left, val);
    } else if (val > node.val) {
      node.right = this._insertNode(node.right, val);
    }
    // val === node.val 的情況直接忽略（不重複插入）
    return node;
  }

  // 中序遍歷：只會把每個節點的 val 推進 arr 一次，保證唯一性
  inOrderCollect(node, arr) {
    if (!node) return;
    this.inOrderCollect(node.left, arr);
    arr.push(node.val);
    this.inOrderCollect(node.right, arr);
  }

  // sorted !
  getSortedUniqueArray() {
    const arr = [];
    this.inOrderCollect(this.root, arr);
    return arr;
  }
}

/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number[][]}
 */
var minimumDifference = function(grid, k) {
  const m = grid.length;
  const n = grid[0].length;
  const H = m - k + 1;
  const W = n - k + 1;
  const ans = Array.from({ length: H }, () => new Array(W).fill(0));

  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      // 用 BST 收集「唯一值」
      const tree = new BST();
      for (let di = 0; di < k; di++) {
        for (let dj = 0; dj < k; dj++) {
          tree.insert(grid[i + di][j + dj]);
        }
      }
        console.log(tree)
      // 取出已排序的唯一值陣列
      const sortedVals = tree.getSortedUniqueArray();
      console.log('sortedVals',sortedVals)

      // 如果只有一個值（或完全沒有），最小絕對差 = 0
      if (sortedVals.length < 2) {
        ans[i][j] = 0;
        continue;
      }

      // 計算相鄰兩值差值中的最小
      let minDiff = Infinity;
      for (let idx = 1; idx < sortedVals.length; idx++) {
        const diff = sortedVals[idx] - sortedVals[idx - 1];
        if (diff < minDiff) {
          minDiff = diff;
          if (minDiff === 0) break; // 理論上若 value 有重複就只會保留唯一，此處不太可能 0
        }
      }
      ans[i][j] = minDiff;
    }
  }

  return ans;
};

// 範例測試
console.log(minimumDifference([[1, 8], [3, -2]], 2));       // [[2]]
// console.log(minimumDifference([[3, -1]], 1));              // [[0, 0]]
// console.log(minimumDifference([[1, -2, 3], [2, 3, 5]], 2)); // [[1, 2]]