import * as fs from "fs";
import extractChunks from "png-chunks-extract";
import encodeChunks from "png-chunks-encode";
import writePng from "./PaletteApplier.writePng.ts";
import type { Config } from "../../config/index.ts";
/* BEST FUNCTION in this class is `applyPaletteFromFiles` !!!! */

export interface PaletteEntry {
  r: number;
  g: number;
  b: number;
}

export interface PaletteApplierOptions {
  /**
   * Index in the palette that should be forced transparent.
   * Defaults to 0 which matches how the original assets are authored.
   */
  transparentIndex?: number;
  config: Config
}

/**
 * Centralizes palette loading and application for PNG sprites so both the item
 * and trainer generators stay in sync.
 */
export class PaletteApplier {
  private transparentIndex: number;
  /*
  @param folder The name of the folder inside outputDir to write the png
  @returns The path it came up with to your image.
  */
  writePng: (folder: string, fileName: string, data: Buffer) => Promise<string>;

  constructor(options: PaletteApplierOptions) {
    this.transparentIndex = options.transparentIndex ?? 0;
    this.writePng = writePng(options.config);
  }
  /**
   * Parse a JASC-PAL palette file and return its colour entries.
   */
  readJascPalette(palPath: string): PaletteEntry[] {
    const lines = fs.readFileSync(palPath, "utf8").trim().split(/\r?\n/);
    if (lines[0] !== "JASC-PAL") {
      throw new Error(`Invalid JASC-PAL signature in ${palPath}`);
    }
    const colourCount = parseInt(lines[2], 10);
    const colours: PaletteEntry[] = [];
    for (let i = 0; i < colourCount; i++) {
      const [r, g, b] = lines[3 + i].split(" ").map(Number);
      colours.push({ r, g, b });
    }
    return colours;
  }

  private readGbapal(palPath: string): PaletteEntry[] {
    const buffer = fs.readFileSync(palPath);
    if (buffer.length % 2 !== 0) {
      throw new Error(`Invalid .gbapal length for ${palPath}`);
    }
    const colours: PaletteEntry[] = [];
    for (let i = 0; i < buffer.length; i += 2) {
      const value = buffer[i] | (buffer[i + 1] << 8);
      const r5 = value & 0x1f;
      const g5 = (value >> 5) & 0x1f;
      const b5 = (value >> 10) & 0x1f;
      colours.push({
        r: (r5 << 3) | (r5 >> 2),
        g: (g5 << 3) | (g5 >> 2),
        b: (b5 << 3) | (b5 >> 2),
      });
    }
    return colours;
  }

  /**
   * Reads a palette file (either JASC-PAL or GBA .gbapal) and returns colour entries.
   */
  readPalette(palPath: string): PaletteEntry[] {
    const lower = palPath.toLowerCase();
    if (lower.endsWith(".gbapal")) {
      return this.readGbapal(palPath);
    }
    return this.readJascPalette(palPath);
  }

  /**
   * Inject the provided palette into a PNG, returning a new PNG buffer.
   */
  applyPalette(pngBuffer: Buffer, palette: PaletteEntry[]): Buffer {
    const chunks = extractChunks(pngBuffer);
    const paletteBytes: number[] = [];
    palette.forEach(({ r, g, b }) => {
      paletteBytes.push(r & 0xff, g & 0xff, b & 0xff);
    });

    const plteChunk = {
      name: "PLTE",
      data: Buffer.from(paletteBytes),
    } as const;

    const trnsData = Buffer.alloc(palette.length, 0xff);
    if (trnsData.length > this.transparentIndex) {
      trnsData[this.transparentIndex] = 0x00;
    }
    const trnsChunk = { name: "tRNS", data: trnsData } as const;

    const newChunks = (chunks as any[]).map((chunk: any) =>
      chunk.name === "PLTE" ? plteChunk : chunk
    );

    if (!(chunks as any[]).some((chunk: any) => chunk.name === "PLTE")) {
      const ihdrIndex = (chunks as any[]).findIndex(
        (chunk: any) => chunk.name === "IHDR"
      );
      newChunks.splice(ihdrIndex + 1, 0, plteChunk);
    }

    const plteIndex = newChunks.findIndex((chunk: any) => chunk.name === "PLTE");
    const existingTrnsIndex = newChunks.findIndex(
      (chunk: any) => chunk.name === "tRNS"
    );
    if (existingTrnsIndex !== -1) {
      newChunks[existingTrnsIndex] = trnsChunk;
    } else {
      newChunks.splice(plteIndex + 1, 0, trnsChunk);
    }

    return Buffer.from(encodeChunks(newChunks));
  }

  /**
   * Convenience helper for the common case where both source files live on disk.
   */
  public applyPaletteFromFiles(pngPath: string, palPath: string): Buffer {
    const palette = this.readPalette(palPath);
    const pngBuffer = fs.readFileSync(pngPath);
    return this.applyPalette(pngBuffer, palette);
  }
}
