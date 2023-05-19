/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    let composeS = s.replace(/[^A-Za-z]/g, '').toLocaleLowerCase();
    if(composeS.length === 0){
      return true
    }
    let i = 0
    let j = composeS.length -1
    while(i !== j){
      if(composeS[i] === composeS[j]){
        i++
        j--
      }else{
        return false
      }
    }
    return true
};
console.log(isPalindrome("A man, a plan, a canal: Panama"))
module.export = isPalindrome()