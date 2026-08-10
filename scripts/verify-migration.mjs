import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const postsRoot = "src/content/blog";
const assetsRoot = "public/assets/ghost";
const entries = (await readdir(postsRoot))
  .filter((name) => name.endsWith(".md") && !name.startsWith("-"))
  .sort();

if (entries.length !== 12) {
  throw new Error(`expected 12 migrated posts, found ${entries.length}`);
}

const assetFiles = [];
async function collectFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectFiles(target);
    else if (entry.isFile()) assetFiles.push(target);
  }
}
await collectFiles(assetsRoot);
if (assetFiles.length !== 221) {
  throw new Error(`expected 221 migrated assets, found ${assetFiles.length}`);
}

const refs = new Set();
const malformedTags = [];
const notices = [];
for (const name of entries) {
  const raw = await readFile(path.join(postsRoot, name), "utf8");
  const { data, content } = matter(raw);
  if (!data.title || !data.date || !Array.isArray(data.tags) || !data.tags.length) {
    throw new Error(`required metadata missing: ${name}`);
  }
  if (data.tags.some((tag) => /^(Image:|portStatus:)/.test(tag))) {
    malformedTags.push(name);
  }
  if (content.includes("기존 Ghost 블로그에서 이전한 글입니다")) notices.push(name);
  for (const match of raw.matchAll(/\/assets\/ghost\/[^)"'\s]+/g)) refs.add(match[0]);
}
if (malformedTags.length) throw new Error(`malformed tags: ${malformedTags.join(", ")}`);
if (notices.length) throw new Error(`Ghost migration notices remain: ${notices.join(", ")}`);

const missing = [];
for (const ref of refs) {
  try {
    await access(path.join("public", ref));
  } catch {
    missing.push(ref);
  }
}
if (missing.length) throw new Error(`missing assets: ${missing.join(", ")}`);

console.log(`PASS migrated posts: ${entries.length}`);
console.log(`PASS migrated assets: ${assetFiles.length}`);
console.log(`PASS unique asset refs: ${refs.size}, missing: ${missing.length}`);
console.log("PASS Ghost migration notices removed");
console.log("PASS required dates and tags present");
