import { readFileSync } from "node:fs";
import path from "node:path";

type ResponsiveVariant = {
  src: string;
  width: number;
  height: number;
  bytes: number;
};

export type ResponsiveImageEntry = {
  width: number;
  height: number;
  sources: {
    avif: ResponsiveVariant[];
    webp: ResponsiveVariant[];
  };
};

type ResponsiveImageManifest = Record<string, ResponsiveImageEntry>;

const manifestPath = path.resolve(".json/responsive-images.json");
let manifest: ResponsiveImageManifest = {};

try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (error) {
  const missingFile =
    error instanceof Error && "code" in error && error.code === "ENOENT";
  if (!missingFile) throw error;
}

export const getResponsiveImage = (
  src: string,
): ResponsiveImageEntry | undefined => manifest[src];
