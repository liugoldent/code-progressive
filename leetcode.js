/**
 * Definition for a binary tree node.
 */
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}


/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {
  let tempResult = []
  return seeTree(root, tempResult)
};

var dfs = function(root, result){
  if(!root) return null
  // 如果root.left有，就再往下跑
  if(root.left){
    dfs(root.left, result)
  }
  // 這邊push代表都是左節點跑完後才push近來，所以直接就等於排序後的結果
  result.push(root.val)
  if(root.right){
    dfs(root.right, result)
  }
  return result
}

var tree = new TreeNode(5);
tree.left = new TreeNode(3);
tree.right = new TreeNode(7);
tree.left.left = new TreeNode(2);
tree.left.right = new TreeNode(4);
tree.right.right = new TreeNode(8);
isValidBST(tree)
