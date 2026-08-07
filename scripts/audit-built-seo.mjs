import fs from "node:fs";
import path from "node:path";

const BUILD_DIR = path.resolve("build");
const ROBOTS_FILE = path.join(BUILD_DIR, "robots.txt");
const SITEMAP_FILE = path.join(BUILD_DIR, "sitemap.xml");
const PLACEHOLDER_TEXT = "Description will go into a meta tag";

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(fullPath, files);
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function getAttribute(tag, attribute) {
  const match = tag.match(
    new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, "i")
  );
  return match?.[2]?.trim() || "";
}

function findTag(html, tagName, attribute, value) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) || [];
  return tags.find(
    (tag) => getAttribute(tag, attribute).toLowerCase() === value.toLowerCase()
  );
}

function validatePage(file) {
  const html = fs.readFileSync(file, "utf8");
  const relativePath = path.relative(BUILD_DIR, file);

  if (
    relativePath === "404.html" ||
    /<meta[^>]+http-equiv=["']refresh["']/i.test(html)
  ) {
    return null;
  }

  const errors = [];
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const descriptionTag = findTag(html, "meta", "name", "description");
  const description = descriptionTag
    ? getAttribute(descriptionTag, "content")
    : "";
  const canonicalTag = findTag(html, "link", "rel", "canonical");
  const canonical = canonicalTag ? getAttribute(canonicalTag, "href") : "";

  const requiredMeta = [
    ["name", "keywords"],
    ["name", "twitter:card"],
    ["property", "og:title"],
    ["property", "og:description"],
    ["property", "og:image"],
    ["property", "og:url"],
  ];

  if (!title) errors.push("缺少 title");
  if (!description) errors.push("缺少 meta description");
  if (description.includes(PLACEHOLDER_TEXT)) errors.push("仍使用範例 description");
  if (!canonical.startsWith("https://")) errors.push("缺少有效 canonical URL");

  for (const [attribute, value] of requiredMeta) {
    const tag = findTag(html, "meta", attribute, value);
    if (!tag || !getAttribute(tag, "content")) {
      errors.push(`缺少 ${value}`);
    }
  }

  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] || "";
  if (getAttribute(htmlTag, "lang").toLowerCase() !== "zh-tw") {
    errors.push("html lang 不是 zh-TW");
  }

  return errors.map((message) => `${relativePath}: ${message}`);
}

if (!fs.existsSync(BUILD_DIR)) {
  console.error("找不到 build/，請先執行 npm run build。");
  process.exit(1);
}

const pages = walkHtml(BUILD_DIR);
const checkedPages = pages.map(validatePage).filter(Boolean);
const errors = checkedPages.flat();

if (!fs.existsSync(ROBOTS_FILE)) {
  errors.push("build/robots.txt: 建置結果缺少 robots.txt");
}

if (!fs.existsSync(SITEMAP_FILE)) {
  errors.push("build/sitemap.xml: 建置結果缺少 sitemap");
}

if (errors.length > 0) {
  console.error(`SEO 稽核失敗（${errors.length} 項）：`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `SEO 稽核通過：已檢查 ${checkedPages.length} 個可索引 HTML 頁面。`
);
