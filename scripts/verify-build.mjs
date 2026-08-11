import { readFile, access } from "node:fs/promises";
import { glob } from "glob";

const required = [
  "dist/index.html",
  "dist/blog/clarity/index.html",
  "dist/rss.xml",
  "dist/sitemap-index.xml",
  "dist/llms.txt",
  "dist/_optimized/assets/ghost/docker-install/01-freepik__-yongjin-__75455-480.avif",
  "dist/_optimized/assets/ghost/docker-install/01-freepik__-yongjin-__75455-480.webp",
];

for (const file of required) await access(file);

const home = await readFile("dist/index.html", "utf8");
const post = await readFile("dist/blog/clarity/index.html", "utf8");
const relatedPost = await readFile("dist/blog/re-server-03/index.html", "utf8");
const homeServerPost = await readFile(
  "dist/blog/homeserver-03-nowadays/index.html",
  "utf8",
);
const dockerPost = await readFile(
  "dist/blog/docker-install/index.html",
  "utf8",
);
const rss = await readFile("dist/rss.xml", "utf8");
const responsiveManifest = JSON.parse(
  await readFile(".json/responsive-images.json", "utf8"),
);
const responsiveEntries = Object.values(responsiveManifest);
const generatedVariantCount = responsiveEntries.reduce(
  (count, entry) =>
    count + entry.sources.avif.length + entry.sources.webp.length,
  0,
);
const generatedVariants = responsiveEntries.flatMap((entry) => [
  ...entry.sources.avif,
  ...entry.sources.webp,
]);
for (const variant of generatedVariants) await access(`dist${variant.src}`);
const highPriorityImageCount = (home.match(/fetchpriority="high"/g) || [])
  .length;
const fontPreloadCount = (home.match(/rel="preload"[^>]+as="font"/g) || [])
  .length;
const searchBundles = await glob("dist/_astro/SearchModal.*.js");
const searchBundle = (
  await Promise.all(searchBundles.map((file) => readFile(file, "utf8")))
).join("\n");

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
    post.includes(
      encodeURIComponent("https://yong2bba.github.io/blog/clarity"),
    ),
    "share links use canonical post URL",
  ],
  [rss.includes("<language>ko-KR</language>"), "RSS language"],
  [rss.includes("MS Clarity 사용기"), "imported RSS item"],
  [!home.includes("this is meta description"), "sample metadata removed"],
  [!home.includes("Astroplate"), "template branding removed from home"],
  [
    home.includes("Noto Sans KR") &&
      home.includes("Space Grotesk") &&
      home.includes("Nanum Gothic Coding"),
    "selected Google fonts are present",
  ],
  [
    !home.includes("Heebo") && !home.includes("Signika"),
    "legacy fonts are removed",
  ],
  [fontPreloadCount === 1, "only the above-fold logo font is preloaded"],
  [responsiveEntries.length === 12, "all 12 post cover images have a manifest"],
  [generatedVariantCount === 72, "all 72 responsive image variants exist"],
  [
    home.includes('type="image/avif"') &&
      home.includes('type="image/webp"') &&
      home.includes(" 480w") &&
      home.includes(" 768w") &&
      home.includes(" 1200w"),
    "home cards expose AVIF/WebP responsive sources",
  ],
  [highPriorityImageCount === 1, "only the first home card has high priority"],
  [home.includes('loading="lazy"'), "below-fold home cards load lazily"],
  [
    !home.includes(
      'src="/assets/ghost/docker-install/01-freepik__-yongjin-__75455.png"',
    ),
    "home does not load the original 5.55 MB cover PNG",
  ],
  [
    searchBundles.length === 1 &&
      searchBundle.includes("image/avif") &&
      searchBundle.includes("image/webp") &&
      searchBundle.includes("-480.avif") &&
      searchBundle.includes("-480.webp") &&
      /loading:[`"']lazy[`"']/.test(searchBundle),
    "search results use lazy AVIF/WebP cover thumbnails",
  ],
  [
    dockerPost.includes(
      'src="/_optimized/assets/ghost/docker-install/01-freepik__-yongjin-__75455-1200.webp"',
    ) && dockerPost.includes('fetchpriority="high"'),
    "single post hero uses the optimized high-priority image",
  ],
  [home.includes('class="mb-6 break-words"'), "card summaries wrap on mobile"],
  [
    !relatedPost.includes("![돈 아끼려고"),
    "card summaries strip Markdown before truncation",
  ],
  [
    relatedPost.includes('href="/blog/re-server-output"') &&
      homeServerPost.includes('href="/blog/homeserver-01-n8n-traefik"') &&
      homeServerPost.includes('href="/blog/homeserver-02-cloudflare-tunnel"'),
    "migrated cross-post links stay on the new blog",
  ],
];

const failed = checks.filter(([ok]) => !ok);
for (const [ok, label] of checks)
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
if (failed.length) process.exit(1);
