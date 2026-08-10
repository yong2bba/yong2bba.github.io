import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const expectedSlugs = [
  "chaotic-n8n-01",
  "clarity-extraction",
  "clarity",
  "docker-install",
  "homeserver-01-n8n-traefik",
  "homeserver-02-cloudflare-tunnel",
  "homeserver-03-nowadays",
  "pm-tech-01-utm",
  "re-server-01",
  "re-server-02",
  "re-server-03",
  "re-server-output",
];

const required = [
  "dist/index.html",
  "dist/rss.xml",
  "dist/sitemap-index.xml",
  "dist/llms.txt",
  ...expectedSlugs.map((slug) => `dist/blog/${slug}/index.html`),
];

for (const file of required) await access(file);

const contentFiles = (await readdir("src/content/blog"))
  .filter((name) => !name.startsWith("-") && /\.mdx?$/.test(name))
  .sort();
const actualSlugs = contentFiles.map((name) => name.replace(/\.mdx?$/, ""));

const assetReferences = [];
let hasMigrationNotice = false;
for (const name of contentFiles) {
  const markdown = await readFile(path.join("src/content/blog", name), "utf8");
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  hasMigrationNotice ||= body.includes(
    "기존 Ghost 블로그에서 이전한 글입니다.",
  );
  for (const match of body.matchAll(/\/images\/ghost\/[^\s)'\"]+/g)) {
    const ref = match[0].replace(/[?#].*$/, "");
    assetReferences.push(ref);
    await access(`public${decodeURI(ref)}`);
  }
}

async function countFiles(root) {
  let total = 0;
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const target = path.join(root, entry.name);
    total += entry.isDirectory() ? await countFiles(target) : 1;
  }
  return total;
}

const assetCount = await countFiles("public/images/ghost");
const home = await readFile("dist/index.html", "utf8");
const post = await readFile("dist/blog/clarity/index.html", "utf8");
const rss = await readFile("dist/rss.xml", "utf8");

const checks = [
  [
    actualSlugs.length === expectedSlugs.length &&
      actualSlugs.every((slug) => expectedSlugs.includes(slug)),
    "exactly 12 migrated post slugs",
  ],
  [assetCount === 221, "all 221 Ghost assets copied"],
  [assetReferences.length === 83, "all 83 body asset references preserved"],
  [!hasMigrationNotice, "temporary migration notice removed"],
  [home.includes('<html lang="ko">'), "home has lang=ko"],
  [
    home.includes('rel="canonical" href="https://yong2bba.github.io/"'),
    "home canonical",
  ],
  [home.includes('type="application/rss+xml"'), "RSS auto-discovery"],
  [home.includes('type="application/ld+json"'), "home JSON-LD"],
  [home.includes('toolname="searchPosts"'), "Declarative WebMCP form"],
  [
    home.includes("2025년 12월 7일"),
    "latest migrated date remains stable in UTC CI",
  ],
  [post.includes('id="목차"') || post.includes('id="toc"'), "post TOC heading"],
  [post.includes("<details>"), "post collapsible TOC"],
  [
    post.includes('property="og:type" content="article"'),
    "article Open Graph type",
  ],
  [post.includes('"@type":"BlogPosting"'), "BlogPosting JSON-LD"],
  [
    post.includes(
      encodeURIComponent("https://yong2bba.github.io/blog/clarity"),
    ),
    "share links use canonical migrated post URL",
  ],
  [rss.includes("<language>ko-KR</language>"), "RSS language"],
  [
    rss.includes("도르마무...가 아니라 도커(Docker) 설치"),
    "RSS contains migrated post",
  ],
  [!home.includes("this is meta description"), "sample metadata removed"],
  [!home.includes("Astroplate"), "template branding removed from home"],
  [!home.includes("블로그를 시작합니다"), "temporary launch post removed"],
];

const failed = checks.filter(([ok]) => !ok);
for (const [ok, label] of checks)
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
if (failed.length) process.exit(1);
