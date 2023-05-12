/**
 * @param {string[]} strs
 * @return {string[][]}
 */
let groupAnagrams = function(strs) {
  if(strs.length === 1){
    return [strs]
  }
  let result = []
  let anagramsMap = new Map()
  for(let i = 0, len = strs.length ; i < len ; i++){
    let sortStr = strs[i].split('').sort().join('')
    if(anagramsMap.has(sortStr)){
      let index = anagramsMap.get(sortStr)
      result[index].push(strs[i])
    }else{
      anagramsMap.set(sortStr, result.length)
      result.push([strs[i]])
    }
  }
  return result
};
module.exports = groupAnagrams;
