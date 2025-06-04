/**
 * 將類似 "Q1. Partition Array into Two Equal Product Subsets" 的字串
 * 轉換成 "q1-partition-array-into-two-equal-product-subsets.md"
 *
 * @param {string} header - 原始輸入，例如 "Q1. Partition Array into Two Equal Product Subsets"
 * @return {string|null}  - 轉換後的檔名，若格式不符則回傳 null
 */
function generateFilenameFromHeader(header) {
  // 1. 用正規表達式抓出編號與標題部分
  //    - ^Q(\d+)\.\s*   → Q開頭、接數字(編號)，接著一個點跟任意空白
  //    - (.+)$         → 後面就是完整的標題
  const match = header.match(/^Q(\d+)\.\s*(.+)$/i);
  if (!match) {
    // 輸入格式不正確，就回傳 null
    return null;
  }

  const index = match[1];    // 例如 "1"
  const title = match[2];    // 例如 "Partition Array into Two Equal Product Subsets"

  // 2. 把標題轉小寫
  const lower = title.toLowerCase();

  // 3. 將所有空格換成連字號
  //    （如果有可能包含其他標點，也可改用 replace(/[^a-z0-9]+/g, '-') 以統一替換成 '-' 並去頭尾多餘的 '-'）
  const slug = lower.split(' ').join('-');

  // 4. 組出最終檔名
  return `q${index}-${slug}.md`;
}


// 範例
const input = "Q1. Find All Anagrams in a String";
const filename = generateFilenameFromHeader(input);
console.log(filename); 
// 印出： "q1-partition-array-into-two-equal-product-subsets.md"
