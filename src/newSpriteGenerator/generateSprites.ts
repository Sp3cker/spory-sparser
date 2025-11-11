import * as fs from "fs";
import * as path from "path";
import { PaletteApplier } from "./PaletteApplier.js";
import { config } from "../config/index.js";

export interface ItemFromJson {
  id: string;
  name: string;
  iconPalette: string;
  iconPic: string;
  price?: number;
  description?: string;
  importance?: string;
  constantName?: string;
}

const ROOT = config.rootDir;
const ICON_SOURCE_DIR = config.itemIconsDir;
const ICON_PALETTE_DIR = config.itemPalettesDir;
const OUTPUT_DIR = config.itemOutputDir;
const ITEMS_JSON = path.join(config.dataDir, "items.json");
const paletteApplier = new PaletteApplier({ config });

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeResourcePath(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/\\/g, "/").replace(/^\/+/, "");
}

function stripKnownSuffixes(resourcePath: string): string {
  return resourcePath
    .replace(/\.4bpp\.smol$/i, "")
    .replace(/\.4bpp$/i, "")
    .replace(/\.gbapal$/i, "")
    .replace(/\.pal$/i, "")
    .replace(/\.png$/i, "");
}

function deriveBaseName(value: string, prefix: string): string {
  if (!value) return "";
  const normalized = value.replace(/\\/g, "/");
  if (normalized.includes("/")) {
    const base = path.posix.basename(normalized);
    return stripKnownSuffixes(base);
  }
  if (value.startsWith(prefix)) {
    const raw = value.replace(prefix, "");
    return stripKnownSuffixes(
      raw
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
        .replace(/TMHM/g, "TM_HM")
        .toLowerCase()
    );
  }
  return stripKnownSuffixes(value);
}

interface ResolvedIcon {
  absolutePath: string;
  baseName: string;
}

function resolveIconResource(iconPic: string): ResolvedIcon | undefined {
  const normalized = normalizeResourcePath(iconPic);
  if (normalized && normalized.includes("/")) {
    const withoutSuffix = stripKnownSuffixes(normalized);
    const absolute = path.join(ROOT, `${withoutSuffix}.png`);
    return {
      absolutePath: absolute,
      baseName: path.posix.basename(withoutSuffix),
    };
  }

  const baseName = deriveBaseName(iconPic, "gItemIcon_");
  if (!baseName) return undefined;
  const absolutePath = path.join(ICON_SOURCE_DIR, `${baseName}.png`);
  return { absolutePath, baseName };
}

function findPalettePath(iconPalette: string, fallbackBase: string): string | undefined {
  const candidates = new Set<string>();
  const normalized = normalizeResourcePath(iconPalette);

  if (normalized) {
    const absoluteOriginal = path.join(ROOT, normalized);
    candidates.add(absoluteOriginal);

    const withoutSuffix = stripKnownSuffixes(normalized);
    const basePaths = new Set<string>([withoutSuffix]);
    if (withoutSuffix.includes("/icons/")) {
      basePaths.add(withoutSuffix.replace("/icons/", "/icon_palettes/"));
    }
    basePaths.forEach((basePath) => {
      ["pal", "gbapal"].forEach((ext) => {
        candidates.add(path.join(ROOT, `${basePath}.${ext}`));
      });
    });
  }

  if (fallbackBase) {
    ["pal", "gbapal"].forEach((ext) => {
      candidates.add(path.join(ICON_PALETTE_DIR, `${fallbackBase}.${ext}`));
    });
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

function processItem(item: ItemFromJson) {
  const resolvedIcon = resolveIconResource(item.iconPic);
  if (!resolvedIcon) {
    console.warn(
      `Skipping item ${item.constantName ?? item.name}: unable to resolve icon path from ${item.iconPic}`
    );
    return;
  }

  if (!fs.existsSync(resolvedIcon.absolutePath)) {
    console.warn(`Base icon missing: ${resolvedIcon.absolutePath}`);
    return;
  }

  const palettePath =
    findPalettePath(item.iconPalette, deriveBaseName(item.iconPalette, "gItemIconPalette_")) ??
    findPalettePath(item.iconPalette, resolvedIcon.baseName);

  if (!palettePath) {
    console.warn(
      `Palette missing: unable to resolve palette for ${item.constantName ?? item.name} (${item.iconPalette})`
    );
    return;
  }

  const palette = paletteApplier.readPalette(palettePath);
  const pngBuf = fs.readFileSync(resolvedIcon.absolutePath);
  const newPng = paletteApplier.applyPalette(pngBuf, palette);

  const outputFile = path.join(OUTPUT_DIR, `${resolvedIcon.baseName}.png`);
  fs.writeFileSync(outputFile, newPng);
  console.log(`Generated ${path.relative(ROOT, outputFile)}`);
}

(() => {
  ensureDir(OUTPUT_DIR);
  const items: ItemFromJson[] = JSON.parse(fs.readFileSync(ITEMS_JSON, "utf8"));
  const toParse = items.filter((i) => i.iconPic !== undefined && i.iconPalette !== undefined);
  toParse.forEach(processItem);
})();

// if (require.main === module) {
//   main();
// }
