import { readFile, access } from "node:fs/promises";

const required = [
  "dist/index.html",
  "dist/blog/clarity/index.html",
  "dist/rss.xml",
  "dist/sitemap-index.xml",
  "dist/llms.txt",
];

for (const file of required) await access(file);

const home = await readFile("dist/index.html", "utf8");
const post = await readFile("dist/blog/clarity/index.html", "utf8");
const rss = await readFile("dist/rss.xml", "utf8");

const checks = [
  [home.includes('<html lang="ko">'), "home has lang=ko"],
  [
    home.includes('rel="canonical" href="https://yong2bba.github.io/"'),
    "home canonical",
  ],
  [home.includes('type="application/rss+xml"'), "RSS auto-discovery"],
  [home.includes('type="application/ld+json"'), "home JSON-LD"],
  [home.includes('toolname="searchPosts"'), "Declarative WebMCP form"],
  [home.includes("2025년"), "imported Korean dates render"],
  [post.includes('id="목차"') || post.includes('id="toc"'), "post TOC heading"],
  [post.includes("<details>"), "post collapsible TOC"],
  [
    post.includes('property="og:type" content="article"'),
    "article Open Graph type",
  ],
  [post.includes('"@type":"BlogPosting"'), "BlogPosting JSON-LD"],
  [
    post.includes(encodeURIComponent("https://yong2bba.github.io/blog/clarity")),
    "share links use canonical post URL",
  ],
  [rss.includes("<language>ko-KR</language>"), "RSS language"],
  [rss.includes("MS Clarity 사용기"), "imported RSS item"],
  [!home.includes("this is meta description"), "sample metadata removed"],
  [!home.includes("Astroplate"), "template branding removed from home"],
  [home.includes('class="mb-6 break-words"'), "card summaries wrap on mobile"],
];

const failed = checks.filter(([ok]) => !ok);
for (const [ok, label] of checks)
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
if (failed.length) process.exit(1);
