import * as fs from "fs";
import * as path from "path";
import extractChunks from "png-chunks-extract";
import encodeChunks from "png-chunks-encode";

export interface ItemFromJson {
  id: string;
  name: string;
  iconPalette: string;
  iconPic: string;
  price?: number;
  description?: string;
  importance?: string;
}

interface PaletteEntry {
  r: number;
  g: number;
  b: number;
}

const ROOT = path.resolve(
  path.dirname(decodeURI(new URL(import.meta.url).pathname)),
  "../../"
);
const UPSCALED_ICONS = path.join(ROOT, "upscaled", "icons");
const UPSCALED_PALETTES = path.join(ROOT, "upscaled", "icon_palettes");
const OUTPUT_DIR = path.join(ROOT, "generated", "icons");
const ITEMS_JSON = path.join(ROOT, "items.json");

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
  // PNG spec allows fewer than 256 colours, but PLTE length must be multiple of 3.
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

function toBaseName(symbol: string, prefix: string): string {
  const raw = symbol.replace(prefix, "");
  // Convert CamelCase / PascalCase to snake_case
  const withUnderscores = raw
    // insert underscore between lowerUpper
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    // insert underscore between capital followed by capital+lower (e.g., HTMLParser→html_parser)
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    // special case: TMHM acronym -> tm_hm
    .replace(/TMHM/g, "TM_HM");
  return withUnderscores.toLowerCase();
}

function processItem(item: ItemFromJson) {
  const iconBase = toBaseName(item.iconPic, "gItemIcon_");
  const paletteBase = toBaseName(item.iconPalette, "gItemIconPalette_");

  const baseIconPath = path.join(UPSCALED_ICONS, `${iconBase}.png`);
  const palettePath = path.join(UPSCALED_PALETTES, `${paletteBase}.pal`);

  if (!fs.existsSync(baseIconPath)) {
    console.warn(`Base icon missing: ${baseIconPath}`);
    return;
  }
  if (!fs.existsSync(palettePath)) {
    console.warn(`Palette missing: ${palettePath}`);
    return;
  }

  const outputFile = path.join(OUTPUT_DIR, `${iconBase}.png`);

  const palette = readJascPal(palettePath);
  const pngBuf = fs.readFileSync(baseIconPath);
  const newPng = replacePngPalette(pngBuf, palette);

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
