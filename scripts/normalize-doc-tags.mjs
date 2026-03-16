import fs from "fs";
import path from "path";

const ROOT = path.resolve("docs");
const SKIP_DIRS = new Set([".obsidian"]);

const CANONICAL_MAP = new Map([
  ["js", "JavaScript"],
  ["javascript", "JavaScript"],
  ["typescript", "TypeScript"],
  ["ts", "TypeScript"],
  ["react", "React"],
  ["react hook", "React Hooks"],
  ["vue", "Vue"],
  ["vue2", "Vue 2"],
  ["vue3", "Vue 3"],
  ["vue router", "Vue Router"],
  ["vuex", "Vuex"],
  ["pinia", "Pinia"],
  ["frontend", "Frontend"],
  ["frontend面試", "Frontend Interview"],
  ["前端面試", "Frontend Interview"],
  ["interview", "Interview"],
  ["backend", "Backend"],
  ["test", "Testing"],
  ["jest", "Jest"],
  ["python", "Python"],
  ["java", "Java"],
  ["c++", "C++"],
  ["nodejs", "Node.js"],
  ["node.js", "Node.js"],
  ["nuxt", "Nuxt"],
  ["composable", "Composable"],
  ["html", "HTML"],
  ["css", "CSS"],
  ["scss", "SCSS"],
  ["sql", "SQL"],
  ["mongodb", "MongoDB"],
  ["pymongo", "PyMongo"],
  ["django", "Django"],
  ["flask", "Flask"],
  ["express", "Express"],
  ["docker", "Docker"],
  ["git", "Git"],
  ["vite", "Vite"],
  ["docusaurus", "Docusaurus"],
  ["docsearch", "DocSearch"],
  ["google", "Google"],
  ["elementui", "Element UI"],
  ["information security", "Information Security"],
  ["leetcode", "LeetCode"],
  ["leetcodeweekly", "LeetCode Weekly"],
  ["easy", "Easy"],
  ["medium", "Medium"],
  ["hard", "Hard"],
  ["tree", "Tree"],
  ["trees", "Tree"],
  ["graph", "Graph"],
  ["dfs", "DFS"],
  ["dp", "DP"],
  ["dynamic programming", "Dynamic Programming"],
  ["sliding window", "Sliding Window"],
  ["binary search", "Binary Search"],
  ["greedy", "Greedy"],
  ["backtracking", "Backtracking"],
  ["matrix", "Matrix"],
  ["array", "Array"],
  ["interval", "Interval"],
  ["linked list", "Linked List"],
  ["two pointer", "Two Pointers"],
  ["two pointers", "Two Pointers"],
  ["two  pointers", "Two Pointers"],
  ["stack", "Stack"],
  ["queue", "Queue"],
  ["heap", "Heap"],
  ["heap / priority", "Heap / Priority Queue"],
  ["heap / priority queue", "Heap / Priority Queue"],
  ["priorityqueue", "Priority Queue"],
  ["trie", "Trie"],
  ["tries", "Trie"],
  ["hashing", "Hashing"],
  ["hashset", "HashSet"],
  ["set", "Set"],
  ["bit manipulation", "Bit Manipulation"],
  ["bitwise", "Bitwise"],
  ["event loop", "Event Loop"],
  ["nvm", "NVM"],
  ["protocol buffers", "Protocol Buffers"],
  ["bst", "BST"],
  ["sliding-window", "Sliding Window"],
  ["algorithm", "Algorithm"],
  ["class", "Class"],
  ["interface", "Interface"],
  ["constructor", "Constructor"],
  ["arraylist", "ArrayList"],
  ["learn", "Learning"],
  ["normal", "General"],
  ["lt", "LT"],
  ["east", "Easy"]
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
  if (!match) return null;
  return {
    frontmatter: match[1],
    body: source.slice(match[0].length),
  };
}

function repairFrontmatter(frontmatter) {
  return frontmatter.replace(/([^\n])(keywords:\s*\[)/g, "$1\n$2");
}

function normalizeLookup(tag) {
  return tag.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeTag(tag) {
  const trimmed = tag.trim();
  if (!trimmed) return "";

  const canonical = CANONICAL_MAP.get(normalizeLookup(trimmed));
  if (canonical) return canonical;

  return trimmed;
}

function extractTags(frontmatter) {
  const inline = frontmatter.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (inline) {
    return inline[1]
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }

  const lines = frontmatter.split("\n");
  const start = lines.findIndex((line) => /^tags:\s*$/.test(line));
  if (start === -1) return null;

  const tags = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\s+-\s+/.test(line)) {
      tags.push(line.replace(/^\s+-\s+/, "").trim());
      continue;
    }
    if (!line.trim()) continue;
    break;
  }

  return tags;
}

function replaceTags(frontmatter, nextTags) {
  const lines = frontmatter.split("\n");
  const tagBlock = ["tags:", ...nextTags.map((tag) => `  - ${tag}`)];
  const inlineIndex = lines.findIndex((line) => /^tags:\s*\[.*\]\s*$/.test(line));

  if (inlineIndex !== -1) {
    lines.splice(inlineIndex, 1, ...tagBlock);
    return lines.join("\n");
  }

  const blockIndex = lines.findIndex((line) => /^tags:\s*$/.test(line));
  if (blockIndex !== -1) {
    let end = blockIndex + 1;
    while (end < lines.length) {
      const line = lines[end];
      if (/^\s+-\s+/.test(line) || !line.trim()) {
        end += 1;
        continue;
      }
      break;
    }
    lines.splice(blockIndex, end - blockIndex, ...tagBlock);
    return lines.join("\n");
  }

  return [...lines, ...tagBlock].join("\n");
}

const files = walk(ROOT);
let changed = 0;

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const parts = splitFrontmatter(source);
  if (!parts) continue;

  const repairedFrontmatter = repairFrontmatter(parts.frontmatter);
  const tags = extractTags(repairedFrontmatter);
  if (!tags || !tags.length) continue;

  const seen = new Set();
  const nextTags = [];

  for (const tag of tags) {
    const normalized = normalizeTag(tag);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    nextTags.push(normalized);
  }

  const nextFrontmatter = replaceTags(repairedFrontmatter, nextTags);
  const nextSource = `---\n${nextFrontmatter}\n---\n${source.match(/^---\n[\s\S]*?\n---(\n?)/)?.[1] ?? "\n"}${parts.body}`;

  if (nextSource !== source) {
    fs.writeFileSync(file, nextSource);
    changed += 1;
  }
}

console.log(`Normalized tags in ${changed} docs.`);
