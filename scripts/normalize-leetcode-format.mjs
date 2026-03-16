import fs from "fs";
import path from "path";

const ROOT = path.resolve("docs/LeetCode");

const HEADING_REPLACEMENTS = [
  [/^##\s+Javascript 解(?:\s*-\s*\d+)?\s*$/gim, "## JavaScript 解法"],
  [/^##\s+JavaScript 實作\s*$/gim, "## JavaScript 解法"],
  [/^##\s+✅ JavaScript 解法\s*$/gim, "## JavaScript 解法"],
  [/^##\s+💻 JavaScript 解法\s*$/gim, "## JavaScript 解法"],
  [/^##\s+💻 JavaScript 程式碼\s*$/gim, "## JavaScript 解法"],
  [/^##\s+💻 JavaScript 參考實作\s*$/gim, "## JavaScript 解法"],
  [/^##\s+Python 解\s*$/gim, "## Python 解法"],
  [/^##\s+python 解\s*$/gim, "## Python 解法"],
  [/^##\s+cpp 解\s*$/gim, "## C++ 解法"],
  [/^##\s+測試程式\s*$/gim, "## 測試案例"],
  [/^##\s+test case\s*$/gim, "## 測試案例"],
  [/^##\s+📘 題目說明\s*$/gim, "## 題目描述"],
  [/^##\s+📘 題目描述\s*$/gim, "## 題目描述"],
  [/^##\s+📘 題目摘要\s*$/gim, "## 題目描述"],
  [/^##\s+🧠 題目說明\s*$/gim, "## 題目描述"],
  [/^##\s+🧠 題目描述（.*）\s*$/gim, "## 題目描述"],
  [/^##\s+🔢 題目描述\s*$/gim, "## 題目描述"],
  [/^##\s+題目簡述\s*$/gim, "## 題目描述"],
  [/^##\s+範例：\s*$/gim, "## 範例"],
  [/^##\s+🧪 範例\s*$/gim, "## 範例"],
  [/^##\s+🧠 解題思路.*$/gim, "## 解題思路"],
  [/^##\s+✅ 解題思路.*$/gim, "## 解題思路"],
  [/^##\s+解題思路（.*）\s*$/gim, "## 解題思路"],
  [/^##\s+思路：\s*$/gim, "## 解題思路"],
];

const FENCE_REPLACEMENTS = [
  [/```javascript/g, "```js"],
  [/```jsx/g, "```jsx"],
  [/```python/g, "```python"],
  [/```cpp/g, "```cpp"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function splitFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: "", body: source };
  return {
    frontmatter: match[1],
    body: source.slice(match[0].length),
  };
}

function getTags(frontmatter) {
  const inline = frontmatter.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (inline) {
    return inline[1]
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  const block = frontmatter.match(/^tags:\s*\n((?:\s+-.*\n?)*)/m);
  if (!block) return [];
  return block[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace(/^-+\s*/, "").trim())
    .filter(Boolean);
}

function extractTitle(frontmatter) {
  const match = frontmatter.match(/^title:\s*(.+)$/m);
  return match ? match[1].replace(/^["']|["']$/g, "").trim() : "";
}

function buildInfoLine(title, tags) {
  const number = title.match(/\[(\d+)\]/)?.[1];
  const difficulty = tags.find((tag) => /^(Easy|Medium|Hard)$/i.test(tag));
  const topicTags = tags.filter(
    (tag) =>
      !/^(LeetCode|Easy|Medium|Hard|javascript|python|cpp|interview)$/i.test(tag)
  );

  const parts = [];
  if (number) parts.push(`題號：**${number}**`);
  if (difficulty) parts.push(`難度：**${difficulty}**`);
  if (topicTags.length) parts.push(`主題：**${topicTags.slice(0, 3).join(", ")}**`);

  return parts.length ? `> ${parts.join(" | ")}` : "";
}

function hasInfoBlock(afterH1) {
  const lines = afterH1.split("\n").slice(0, 6).map((line) => line.trim());
  return lines.some((line) => line.startsWith("> ") && /題號|難度|主題/.test(line));
}

function ensureTopInfo(body, title, tags) {
  const h1Match = body.match(/^# .+\n?/);
  if (!h1Match) return body;

  const h1 = h1Match[0].trimEnd();
  const rest = body.slice(h1Match[0].length).replace(/^\n+/, "");
  if (hasInfoBlock(rest)) {
    return `${h1}\n\n${rest}`;
  }

  const infoLine = buildInfoLine(title, tags);
  if (!infoLine) {
    return `${h1}\n\n${rest}`;
  }

  return `${h1}\n\n${infoLine}\n\n${rest}`;
}

function cleanup(body) {
  let next = body;

  for (const [pattern, replacement] of HEADING_REPLACEMENTS) {
    next = next.replace(pattern, replacement);
  }

  for (const [pattern, replacement] of FENCE_REPLACEMENTS) {
    next = next.replace(pattern, replacement);
  }

  next = next.replace(/\n---\n/g, "\n");
  next = next.replace(/\n{3,}/g, "\n\n");

  return next.trim().replace(/\n{3,}/g, "\n\n") + "\n";
}

let changed = 0;
for (const file of walk(ROOT)) {
  const source = fs.readFileSync(file, "utf8");
  const { frontmatter, body } = splitFrontmatter(source);
  const title = extractTitle(frontmatter);
  const tags = getTags(frontmatter);

  let nextBody = cleanup(body);
  nextBody = ensureTopInfo(nextBody, title, tags);

  const nextSource = `---\n${frontmatter}\n---\n\n${nextBody}`;
  if (nextSource !== source) {
    fs.writeFileSync(file, nextSource);
    changed += 1;
  }
}

console.log(`Normalized ${changed} LeetCode docs.`);
