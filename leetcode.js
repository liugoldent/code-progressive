/**
 * Definition for a binary tree node.
 */
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    const allOrder = preorder.concat(inorder)
    const setOrder = Array.from(new Set(allOrder))
    const root = new TreeNode()
    setOrder.forEach(item =>{
      if()
    })
    let toTree = function(){

    }
};
buildTree([3,9,20,15,7],[9,3,15,20,7])