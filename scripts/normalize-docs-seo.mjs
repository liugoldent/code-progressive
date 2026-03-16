import fs from "fs";
import path from "path";

const DOCS_DIR = path.resolve("docs");
const SKIP_DIRS = new Set([".obsidian"]);

const GENERIC_DESCRIPTIONS = new Set([
  "FE 面試",
  "vue 面試常見問題",
  "java 基本課程",
  "Pinia",
  "react useRef",
  "基本介紹",
  "常見關鍵字",
]);

const KEYWORD_STOPWORDS = new Set([
  "test",
  "demo",
  "基本",
  "介紹",
  "概念",
  "範例",
  "程式",
  "用法",
  "說明",
  "整理",
  "筆記",
  "重點",
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        walk(path.join(dir, entry.name), files);
      }
      continue;
    }
    if (/\.mdx?$/i.test(entry.name)) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function splitFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { frontmatter: "", body: source };
  }
  return {
    frontmatter: match[1],
    body: source.slice(match[0].length),
  };
}

function getScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) return "";
  return cleanYamlValue(match[1].trim());
}

function getBlockArray(frontmatter, key) {
  const match = frontmatter.match(
    new RegExp(`^${key}:\\s*(?:\\[(.*?)\\])?\\s*(?:\\n((?:[ \\t]+-.*\\n?)*))?`, "m")
  );
  if (!match) return [];

  if (match[1]) {
    return parseInlineArray(match[1]);
  }

  if (!match[2]) return [];

  return match[2]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) => cleanYamlValue(line.replace(/^-+\s*/, "")))
    .filter(Boolean);
}

function extractRawBlock(frontmatter, key) {
  const lines = frontmatter.split("\n");
  const start = lines.findIndex((line) => line.startsWith(`${key}:`));
  if (start === -1) return [];
  const block = [lines[start]];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) {
      block.push(line);
      continue;
    }
    if (/^[A-Za-z_][A-Za-z0-9_-]*:/.test(line)) break;
    if (/^\s+-/.test(line) || /^\s+/.test(line)) {
      block.push(line);
      continue;
    }
    break;
  }
  return block.filter((line, index, arr) => !(index === arr.length - 1 && line === ""));
}

function stripManagedFields(frontmatter) {
  const lines = frontmatter.split("\n");
  const managed = new Set(["title", "description", "keywords", "tags"]);
  const kept = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const keyMatch = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):/);
    if (!keyMatch) {
      if (line.trim()) kept.push(line);
      continue;
    }

    const key = keyMatch[1];
    if (!managed.has(key)) {
      kept.push(line);
      continue;
    }

    while (i + 1 < lines.length) {
      const next = lines[i + 1];
      if (!next.trim()) {
        i += 1;
        continue;
      }
      if (/^[A-Za-z_][A-Za-z0-9_-]*:/.test(next)) break;
      if (/^\s+/.test(next)) {
        i += 1;
        continue;
      }
      break;
    }
  }

  return kept.filter(Boolean);
}

function cleanYamlValue(value) {
  return value.replace(/^["']|["']$/g, "").trim();
}

function parseInlineArray(raw) {
  return raw
    .split(",")
    .map((item) => cleanYamlValue(item.trim()))
    .filter(Boolean);
}

function getHeading(body, depth = 1) {
  const match = body.match(new RegExp(`^${"#".repeat(depth)}\\s+(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function getHeadings(body, depth = 2) {
  const matches = [...body.matchAll(new RegExp(`^${"#".repeat(depth)}\\s+(.+)$`, "gm"))];
  return matches.map((match) => match[1].trim());
}

function prettifyTitle(rawTitle, relativePath) {
  let title = rawTitle.replace(/`/g, "").trim();

  const replacements = [
    [/^\[FE\]\s*/i, "前端 "],
    [/^\[JS\]\s*/i, "JavaScript "],
    [/^\[Node\.js\]\s*/i, "Node.js "],
    [/^\[React\]\s*/i, "React "],
    [/^\[JAVA 基本\]\s*/i, "Java 基本 "],
    [/^\[Pinia\]\s*/i, "Pinia "],
  ];

  for (const [pattern, value] of replacements) {
    title = title.replace(pattern, value);
  }

  title = title.replace(/\bInterview\b/gi, "面試題整理");
  title = title.replace(/\s+/g, " ").trim();

  if (title) return title;

  const fallback = path.basename(relativePath, path.extname(relativePath));
  return fallback.replace(/[-_]/g, " ");
}

function normalizeToken(token) {
  return token
    .replace(/[`()[\]#,.!?/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function generateDescription({ title, headings, relativePath }) {
  const category = relativePath.split(path.sep)[0];
  const usefulHeadings = headings
    .map((heading) => normalizeToken(heading))
    .filter(Boolean)
    .filter((heading) => heading.length <= 24)
    .slice(0, 3);

  if (/LeetCode/.test(relativePath)) {
    return `${title} 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。`;
  }

  if (usefulHeadings.length >= 2) {
    return `${title} 筆記，整理 ${usefulHeadings.slice(0, 2).join("、")} 等重點。`;
  }

  const categoryMap = {
    React: "React 開發重點與實作觀念",
    Vue: "Vue 開發重點與實作觀念",
    JavaScript: "JavaScript 核心觀念與常見實務",
    TypeSctipt: "TypeScript 型別系統與開發重點",
    "FE-knowledge": "前端面試與開發知識整理",
    Nodejs: "Node.js 核心觀念與執行流程",
    Nuxt: "Nuxt 常用 API 與組合式開發重點",
    Java: "Java 基礎語法與物件導向重點",
    Python: "Python 開發基礎與常見實務",
    SCSS: "CSS 與 SCSS 版面與樣式技巧",
  };

  const categoryText = categoryMap[category] || "技術筆記與核心概念整理";
  return `${title} 筆記，聚焦 ${categoryText}。`;
}

function shouldRewriteDescription(description) {
  if (!description) return true;
  if (GENERIC_DESCRIPTIONS.has(description)) return true;
  if (description.length < 12) return true;
  if (/^(leetCode|leetcode)/i.test(description)) return true;
  if (/js 解答|python 解答|js 解|python 解/i.test(description)) return true;
  return false;
}

function generateKeywords({ title, headings, tags, relativePath }) {
  const category = relativePath.split(path.sep)[0];
  const rawPool = [title, category, ...tags, ...headings.slice(0, 4)];
  const seen = new Set();
  const results = [];

  for (const entry of rawPool) {
    const tokens = normalizeToken(entry)
      .split(" ")
      .map((token) => token.trim())
      .filter(Boolean);

    for (const token of tokens) {
      const normalized = token.toLowerCase();
      if (token.length < 2) continue;
      if (KEYWORD_STOPWORDS.has(normalized)) continue;
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      results.push(token);
      if (results.length === 8) return results;
    }
  }

  return results;
}

function formatArray(values) {
  return `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
}

const files = walk(DOCS_DIR);
let changedCount = 0;

for (const file of files) {
  const relativePath = path.relative(DOCS_DIR, file);
  const source = fs.readFileSync(file, "utf8");
  const { frontmatter, body } = splitFrontmatter(source);
  const h1 = getHeading(body, 1);
  if (!h1) continue;

  const title = getScalar(frontmatter, "title") || prettifyTitle(h1, relativePath);
  const existingDescription = getScalar(frontmatter, "description");
  const tags = getBlockArray(frontmatter, "tags");
  const keywords = getBlockArray(frontmatter, "keywords");
  const headings = getHeadings(body, 2);
  const description = shouldRewriteDescription(existingDescription)
    ? generateDescription({ title, headings, relativePath })
    : existingDescription;
  const nextKeywords = keywords.length
    ? keywords
    : generateKeywords({ title, headings, tags, relativePath });

  const preserved = stripManagedFields(frontmatter);
  const tagBlock = extractRawBlock(frontmatter, "tags");

  const nextFrontmatterLines = [
    ...preserved,
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    ...(tagBlock.length ? tagBlock : []),
    `keywords: ${formatArray(nextKeywords)}`,
  ].filter(Boolean);

  const nextSource = `---\n${nextFrontmatterLines.join("\n")}\n---\n\n${body.replace(/^\n+/, "")}`;

  if (nextSource !== source) {
    fs.writeFileSync(file, nextSource);
    changedCount += 1;
  }
}

console.log(`Updated ${changedCount} doc files.`);
