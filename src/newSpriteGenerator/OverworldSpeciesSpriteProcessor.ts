import { promises as fs } from "fs";
import { basename, join } from "path";
import { SpriteProcessingError, SpriteProcessor } from "./SpriteProcessor.ts";

const EXPECTED_WIDTH = 32;
const EXPECTED_HEIGHT = 64;
const FRAME_HEIGHT = EXPECTED_HEIGHT / 2;
const FRAME_DURATION_MS = 330;

export class OverworldSpeciesSpriteProcessor extends SpriteProcessor {
  constructor(
    private readonly sourceDirPath: string,
    private readonly outputDirPath: string
  ) {
    super();
  }

  private getBaseName(filePath: string): string {
    return basename(filePath).replace(/\.png$/i, "");
  }

  private async getImageDimensions(
    filePath: string
  ): Promise<{ width: number; height: number }> {
    const identifyCmd = `magick identify -format "%w %h" "${filePath}"`;
    const stdout = await this.execImageMagickWithOutput(identifyCmd);
    const [widthStr, heightStr] = stdout.trim().split(/\s+/);
    const width = Number(widthStr);
    const height = Number(heightStr);

    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      throw new Error(
        `Unable to determine dimensions for ${filePath}: got "${stdout.trim()}"`
      );
    }

    return { width, height };
  }

  private async sliceFrames(filePath: string): Promise<string[]> {
    const topFramePath = this.generateTempPath("species_frame_top");
    const bottomFramePath = this.generateTempPath("species_frame_bottom");

    await this.extractRegion(
      filePath,
      topFramePath,
      EXPECTED_WIDTH,
      FRAME_HEIGHT,
      0,
      0
    );
    await this.extractRegion(
      filePath,
      bottomFramePath,
      EXPECTED_WIDTH,
      FRAME_HEIGHT,
      0,
      FRAME_HEIGHT
    );

    return [topFramePath, bottomFramePath];
  }

  async processSpriteFile(filePath: string): Promise<void> {
    const filename = basename(filePath);
    let dimensions;
    try {
      dimensions = await this.getImageDimensions(filePath);
    } catch (error) {
      throw new SpriteProcessingError(
        "resizing",
        `Failed to read dimensions for ${filename}`,
        error
      );
    }
    const { width, height } = dimensions;

    if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
      throw new Error(
        `Invalid sprite dimensions for ${filename}: expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}, got ${width}x${height}`
      );
    }

    let frames: string[] = [];
    try {
      frames = await this.sliceFrames(filePath);
    } catch (error) {
      throw new SpriteProcessingError(
        "resizing",
        `Failed to slice frames for ${filename}`,
        error
      );
    }

    try {
      const outputPath = join(
        this.outputDirPath,
        `${this.getBaseName(filePath)}.webp`
      );

      await this.ensureDirectoryExists(this.outputDirPath);
      try {
        await this.createAnimatedWebPScaled(
          frames,
          outputPath,
          FRAME_DURATION_MS,
          4
        );
      } catch (error) {
        throw new SpriteProcessingError(
          "writingWebm",
          `Failed to write WEBP for ${filename}`,
          error
        );
      }
    } catch (error) {
      console.error(
        `✗ Error processing ${filename}:`,
        error instanceof Error ? error.message : error
      );
      throw error;
    } finally {
      await this.cleanupTempFiles(frames);
    }
  }

  async processSpriteFiles(filePaths: string[]): Promise<number> {
    if (filePaths.length === 0) {
      return 0;
    }

    await this.ensureDirectoryExists(this.outputDirPath);

    let processed = 0;
    for (const filePath of filePaths) {
      await this.processSpriteFile(filePath);
      processed++;
    }

    return processed;
  }

  async processAllSprites(): Promise<void> {
    try {
      await this.ensureDirectoryExists(this.outputDirPath);

      const files = await fs.readdir(this.sourceDirPath);
      const pngFiles = files.filter((file) =>
        file.toLowerCase().endsWith(".png")
      );

      if (pngFiles.length === 0) {
        return;
      }

      for (const filename of pngFiles) {
        try {
          await this.processSpriteFile(join(this.sourceDirPath, filename));
        } catch (error) {
          console.error(
            `✗ Error processing ${filename}:`,
            error instanceof Error ? error.message : error
          );
        }
      }
    } catch (error) {
      console.error(
        "Error during species sprite processing:",
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  }
}
