import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import matter from "gray-matter";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const outputRoot = path.join(publicRoot, "_optimized");
const manifestPath = path.join(root, ".json", "responsive-images.json");
const targetWidths = [480, 768, 1200];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });

const postFiles = await glob("src/content/blog/*.{md,mdx}", {
  cwd: root,
  absolute: true,
});

const imagePaths = new Set();
for (const postFile of postFiles) {
  const source = await readFile(postFile, "utf8");
  const image = matter(source).data.image;
  if (typeof image === "string" && image.startsWith("/assets/")) {
    imagePaths.add(image);
  }
}

const manifest = {};
let generatedFiles = 0;
let sourceBytes = 0;
let generatedBytes = 0;

for (const publicPath of [...imagePaths].sort()) {
  const sourcePath = path.join(publicRoot, publicPath.slice(1));
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Image dimensions unavailable: ${publicPath}`);
  }

  const widths = [
    ...new Set([
      ...targetWidths.filter((width) => width < metadata.width),
      Math.min(targetWidths.at(-1), metadata.width),
    ]),
  ].sort((a, b) => a - b);

  const relativeWithoutExtension = publicPath
    .slice(1)
    .replace(path.posix.extname(publicPath), "");
  const entry = {
    width: metadata.width,
    height: metadata.height,
    sources: { avif: [], webp: [] },
  };

  sourceBytes += (await stat(sourcePath)).size;

  for (const width of widths) {
    for (const format of ["avif", "webp"]) {
      const outputRelative = `${relativeWithoutExtension}-${width}.${format}`;
      const outputPath = path.join(outputRoot, outputRelative);
      await mkdir(path.dirname(outputPath), { recursive: true });

      const pipeline = sharp(sourcePath).resize({
        width,
        withoutEnlargement: true,
      });
      const info =
        format === "avif"
          ? await pipeline.avif({ quality: 50, effort: 5 }).toFile(outputPath)
          : await pipeline.webp({ quality: 80, effort: 5 }).toFile(outputPath);

      entry.sources[format].push({
        src: `/_optimized/${outputRelative.split(path.sep).join("/")}`,
        width: info.width,
        height: info.height,
        bytes: info.size,
      });
      generatedFiles += 1;
      generatedBytes += info.size;
    }
  }

  manifest[publicPath] = entry;
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  JSON.stringify({
    sourceImages: Object.keys(manifest).length,
    generatedFiles,
    sourceBytes,
    generatedBytes,
    manifest: path.relative(root, manifestPath),
  }),
);
