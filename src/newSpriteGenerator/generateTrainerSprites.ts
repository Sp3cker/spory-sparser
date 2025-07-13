import * as fs from "fs";
import * as path from "path";
import extractChunks from "png-chunks-extract";
import encodeChunks from "png-chunks-encode";
import { PNG } from "pngjs";

interface PaletteEntry {
  r: number;
  g: number;
  b: number;
}

const ROOT = path.resolve(
  path.dirname(decodeURI(new URL(import.meta.url).pathname)),
  "../../"
);

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJascPal(palPath: string): PaletteEntry[] {
  const lines = fs.readFileSync(palPath, "utf8").trim().split(/\r?\n/);
  if (lines[0] !== "JASC-PAL")
    throw new Error(`Invalid JASC-PAL signature in ${palPath}`);
  // Skip version line lines[1]
  const count = parseInt(lines[2], 10);
  const colors: PaletteEntry[] = [];
  for (let i = 0; i < count; i++) {
    const [r, g, b] = lines[3 + i].split(" ").map(Number);
    colors.push({ r, g, b });
  }
  return colors;
}

function replacePngPalette(
  pngBuffer: Buffer,
  newPalette: PaletteEntry[]
): Buffer {
  const chunks = extractChunks(pngBuffer);
  const paletteBytes: number[] = [];
  newPalette.forEach(({ r, g, b }) => {
    paletteBytes.push(r & 0xff, g & 0xff, b & 0xff);
  });
  // PNG spec allows fewer than 256 colours, but PLTE length must be a multiple of 3.
  const plteChunk = {
    name: "PLTE",
    data: Buffer.from(paletteBytes),
  } as const;
  // Build transparency chunk: first palette entry transparent, others opaque
  const trnsData = Buffer.alloc(newPalette.length, 0xff);
  if (trnsData.length > 0) trnsData[0] = 0x00;
  const trnsChunk = { name: "tRNS", data: trnsData } as const;
  const newChunks = (chunks as any[]).map((chunk: any) =>
    chunk.name === "PLTE" ? plteChunk : chunk
  );
  // If no PLTE existed (unlikely), insert after IHDR
  if (!(chunks as any[]).some((c: any) => c.name === "PLTE")) {
    const ihdrIndex = (chunks as any[]).findIndex(
      (c: any) => c.name === "IHDR"
    );
    newChunks.splice(ihdrIndex + 1, 0, plteChunk);
  }
  // Handle tRNS chunk: replace or insert right after PLTE
  const plteIndex = newChunks.findIndex((c: any) => c.name === "PLTE");
  const existingTrns = newChunks.findIndex((c: any) => c.name === "tRNS");
  if (existingTrns !== -1) {
    newChunks[existingTrns] = trnsChunk;
  } else {
    newChunks.splice(plteIndex + 1, 0, trnsChunk);
  }
  return Buffer.from(encodeChunks(newChunks));
}

function getBaseName(fileName: string): string {
  return path.parse(fileName).name;
}

interface GenerateSpritesOptions {
  pngDir: string;
  paletteDir: string;
  outputDir: string;
  logMissingFiles?: boolean;
}

export function generateSprites(options: GenerateSpritesOptions) {
  const { pngDir, paletteDir, outputDir, logMissingFiles = true } = options;

  ensureDir(outputDir);

  if (!fs.existsSync(pngDir)) {
    throw new Error(`PNG directory does not exist: ${pngDir}`);
  }

  if (!fs.existsSync(paletteDir)) {
    throw new Error(`Palette directory does not exist: ${paletteDir}`);
  }

  const pngFiles = fs.readdirSync(pngDir).filter((f) => f.endsWith(".png"));
  const paletteFiles = fs
    .readdirSync(paletteDir)
    .filter((f) => f.endsWith(".pal"));

  // Check if we're processing the "people" directory
  const isPeopleDirectory = pngDir.includes("people");

  // Create a map of base names to palette files for quick lookup
  const paletteMap = new Map<string, string>();
  paletteFiles.forEach((palFile) => {
    const baseName = getBaseName(palFile);
    paletteMap.set(baseName, palFile);
  });

  let processed = 0;
  let skipped = 0;

  for (const pngFile of pngFiles) {
    const baseName = getBaseName(pngFile);
    const paletteFile = paletteMap.get(baseName);

    const pngPath = path.join(pngDir, pngFile);
    const outputPath = path.join(outputDir, pngFile);

    try {
      let pngBuffer = fs.readFileSync(pngPath);

      if (isPeopleDirectory) {
        // For people directory: remove background and make transparent
        pngBuffer = removeBackgroundAndMakeTransparent(pngBuffer);

        // If palette exists, still apply it
        if (paletteFile) {
          const palettePath = path.join(paletteDir, paletteFile);
          const palette = readJascPal(palettePath);
          pngBuffer = replacePngPalette(pngBuffer, palette);
        }
      } else {
        // For other directories: require palette file
        if (!paletteFile) {
          if (logMissingFiles) {
            console.warn(
              `No palette found for ${pngFile} (looking for ${baseName}.pal)`
            );
          }
          skipped++;
          continue;
        }

        const palettePath = path.join(paletteDir, paletteFile);
        const palette = readJascPal(palettePath);
        pngBuffer = replacePngPalette(pngBuffer, palette);
      }

      fs.writeFileSync(outputPath, pngBuffer);
      console.log(`Generated ${path.relative(ROOT, outputPath)}`);
      processed++;
    } catch (error) {
      console.error(`Error processing ${pngFile}:`, error);
      skipped++;
    }
  }

  console.log(`\nSummary: ${processed} sprites generated, ${skipped} skipped`);
}

// Main function for direct execution
export function generateTrainerSprites() {
  // ...existing code...

  // Main function for direct execution

  const args = process.argv.slice(2);

  // Handle both --key=value and key=value formats
  const picsArg = args.find(
    (arg) => arg.startsWith("--pics=") || arg.startsWith("pics=")
  );
  const palletsArg = args.find(
    (arg) => arg.startsWith("--pallets=") || arg.startsWith("pallets=")
  );
  const outdirArg = args.find(
    (arg) => arg.startsWith("--outdir=") || arg.startsWith("outdir=")
  );

  const TRAINER_FRONT_PICS = picsArg
    ? path.resolve(ROOT, picsArg.split("=")[1])
    : undefined;
  const TRAINER_PALETTES = palletsArg
    ? path.resolve(ROOT, palletsArg.split("=")[1])
    : undefined;
  const OUTPUT_DIR = outdirArg
    ? path.resolve(ROOT, outdirArg.split("=")[1])
    : undefined;

  // ...existing code...

  // const TRAINER_FRONT_PICS = path.join(ROOT, "upscaled", "trainers", "front_pics");
  // const TRAINER_PALETTES = path.join(ROOT, "upscaled", "trainers", "palettes");
  // const OUTPUT_DIR = path.join(ROOT, "generated", "trainers");

  if (!TRAINER_FRONT_PICS || !TRAINER_PALETTES || !OUTPUT_DIR) {
    console.error(
      "Missing required parameters. Please provide all of: pics=, pallets=, outdir=\n" +
        "Example: node generateTrainerSprites.js pics=upscaled/trainers/front_pics pallets=upscaled/trainers/palettes outdir=generated/trainers"
    );
    process.exit(1);
  }

  generateSprites({
    pngDir: TRAINER_FRONT_PICS,
    paletteDir: TRAINER_PALETTES,
    outputDir: OUTPUT_DIR,
    logMissingFiles: true,
  });
}

// Auto-execute when run directly
(() => {
  generateTrainerSprites();
})();

// Example usage for other directories:
// generateSprites({
//   pngDir: "/path/to/front_pics",
//   paletteDir: "/path/to/palettes",
//   outputDir: "/path/to/output",
//   logMissingFiles: true
// });

function removeBackgroundAndMakeTransparent(pngBuffer: Buffer): Buffer {
  const png = PNG.sync.read(pngBuffer);

  // Get the background color from the top-left pixel (assuming it's the background)
  const bgR = png.data[0];
  const bgG = png.data[1];
  const bgB = png.data[2];

  // Make all pixels matching the background color transparent
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i];
    const g = png.data[i + 1];
    const b = png.data[i + 2];

    // If pixel matches background color (with some tolerance for compression artifacts)
    if (
      Math.abs(r - bgR) <= 5 &&
      Math.abs(g - bgG) <= 5 &&
      Math.abs(b - bgB) <= 5
    ) {
      png.data[i + 3] = 0; // Make transparent
    }
  }

  return PNG.sync.write(png);
}
