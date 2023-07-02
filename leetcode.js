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
var serialize = function(root) {
  if(!root){
      return 'null'
  }

  let queue = [root]
  let result = []

  while(queue.length > 0){
      let node = queue.shift()

      if(node){
          result.push(node.val)
          result.push(node.left)
          result.push(node.right)
      }else{
          result.push('null')
      }
  }
  return result.join(',')
};

/**
* Decodes your encoded data to tree.
*
* @param {string} data
* @return {TreeNode}
*/
var deserialize = function(data) {
  if(data === 'null'){
      return null
  }
  let splitData = data.split(',')
  let root = new TreeNode(parseInt(splitData[0]))
  let queue = [root]
  let index = 1

  while(queue.length > 0 && index < splitData.length){
      let node = queue.shift()

      if(splitData[index] !== 'null'){
          node.left = new TreeNode(parseInt(splitData[index]))
          queue.push(node.left)
      }
      index++

      if(splitData[index] !== 'null'){
          node.right = new TreeNode(parseInt(splitData[index]))
          queue.push(node.right)
      }
      index++
  }

  return root
};

/**
* Your functions will be called as such:
* deserialize(serialize(root));
*/
