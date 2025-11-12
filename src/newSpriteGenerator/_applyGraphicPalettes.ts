#!/usr/bin/env node

import { promises as fs } from "fs";
import * as path from "path";
import { PaletteApplier } from "./PaletteApplier/PaletteApplier.ts";
import { config } from "../config/index.js";

const paletteApplier = new PaletteApplier({ config });
const INPUT_ROOT = config.sprites;
const OUTPUT_ROOT = path.join(config.outputDir, "graphics");

const stats = {
  processed: 0,
  skipped: 0,
  missingPalette: 0,
};

function isPng(fileName: string): boolean {
  return fileName.toLowerCase().endsWith(".png");
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

function addPaletteCandidates(
  set: Set<string>,
  basePathWithoutExt: string
): void {
  if (!basePathWithoutExt) return;
  for (const ext of ["pal", "gbapal"]) {
    set.add(`${basePathWithoutExt}.${ext}`);
  }
}

async function findPaletteForPng(pngPath: string): Promise<string | undefined> {
  const candidates = new Set<string>();
  const dir = path.dirname(pngPath);
  const baseName = path.basename(pngPath, path.extname(pngPath));

  addPaletteCandidates(candidates, path.join(dir, baseName));

  const normalizedPng = path.normalize(pngPath);
  const iconDir = path.normalize(config.itemIconsDir);
  const trainerFrontDir = path.normalize(config.trainerFrontPicsDir);

  if (
    normalizedPng.startsWith(iconDir + path.sep) ||
    normalizedPng === iconDir
  ) {
    addPaletteCandidates(
      candidates,
      path.join(config.itemPalettesDir, baseName)
    );
  }

  if (
    normalizedPng.startsWith(trainerFrontDir + path.sep) ||
    normalizedPng === trainerFrontDir
  ) {
    addPaletteCandidates(
      candidates,
      path.join(config.trainerPalettesDir, baseName)
    );
  }

  if (dir.includes(`${path.sep}icons${path.sep}`) || dir.endsWith("icons")) {
    addPaletteCandidates(
      candidates,
      path.join(dir.replace(/icons(?=[/\\]|$)/, "icon_palettes"), baseName)
    );
  }

  if (
    dir.includes(`${path.sep}front_pics${path.sep}`) ||
    dir.endsWith("front_pics")
  ) {
    addPaletteCandidates(
      candidates,
      path.join(dir.replace(/front_pics(?=[/\\]|$)/, "palettes"), baseName)
    );
  }

  addPaletteCandidates(
    candidates,
    path.join(path.dirname(dir), "palettes", baseName)
  );

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // continue
    }
  }

  return undefined;
}

async function processPng(pngPath: string): Promise<void> {
  const palettePath = await findPaletteForPng(pngPath);
  if (!palettePath) {
    stats.missingPalette += 1;
    stats.skipped += 1;
    const relative = path.relative(INPUT_ROOT, pngPath);
    console.warn(`Palette missing for ${relative}`);
    return;
  }

  try {
    const palette = paletteApplier.readPalette(palettePath);
    const pngBuffer = await fs.readFile(pngPath);
    const recolored = paletteApplier.applyPalette(pngBuffer, palette);

    const relativePath = path.relative(INPUT_ROOT, pngPath);
    const outputPath = path.join(OUTPUT_ROOT, relativePath);
    await ensureDirectoryExists(path.dirname(outputPath));
    await fs.writeFile(outputPath, recolored);

    stats.processed += 1;
    console.log(
      `Generated ${path.relative(config.rootDir, outputPath)} (palette: ${path.relative(
        config.rootDir,
        palettePath
      )})`
    );
  } catch (error) {
    stats.skipped += 1;
    const relative = path.relative(INPUT_ROOT, pngPath);
    console.error(`Failed to process ${relative}:`, error);
  }
}

async function walkDirectory(dirPath: string): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await walkDirectory(fullPath);
    } else if (entry.isFile() && isPng(entry.name)) {
      await processPng(fullPath);
    }
  }
}

async function main() {
  const generatedRoot = path.join(config.outputDir, "graphics");
  await ensureDirectoryExists(generatedRoot);

  const initialRelative = path.relative(config.rootDir, INPUT_ROOT);
  console.log(`Applying palettes under ${initialRelative}...`);

  await walkDirectory(INPUT_ROOT);

  console.log("\nSummary:");
  console.log(`  Processed PNGs: ${stats.processed}`);
  console.log(`  Skipped PNGs: ${stats.skipped}`);
  console.log(`  Missing palettes: ${stats.missingPalette}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Palette application failed:", error);
    process.exit(1);
  });
}
