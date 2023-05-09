/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  if (s.length !== t.length) {
    return false;
  }
  let sObj = {};
  let tObj = {};

  for (let i = 0, len = s.length; i < len; i++) {
    sObj[s[i]] = (sObj[s[i]] ? sObj[s[i]] : 0) + 1;
    tObj[t[i]] = (tObj[t[i]] ? tObj[t[i]] : 0) + 1;
  }
  for (item in sObj) {
    if(sObj[item] !== tObj[item]){
      return false
    }
  }
  return true
};
// console.log(isAnagram("anagram", "nagaram"))
module.exports = isAnagram

