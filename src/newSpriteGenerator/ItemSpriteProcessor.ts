import { promises as fs } from "fs";
import { basename, join } from "path";

import { SpriteProcessor, SpriteProcessingError } from "./SpriteProcessor.ts";

const UPSCALE_FACTOR = 4;

export class ItemSpriteProcessor extends SpriteProcessor {
  constructor(
    private readonly sourceDirPath: string,
    private readonly outputDirPath: string
  ) {
    super();
  }

  private getBaseName(filePath: string): string {
    return basename(filePath).replace(/\.png$/i, "");
  }

  private getUpscaledOutputPath(filePath: string): string {
    return join(this.outputDirPath, `${this.getBaseName(filePath)}.png`);
  }

  private async processSpriteFile(filePath: string): Promise<void> {
    const outputPath = this.getUpscaledOutputPath(filePath);
    const resizePercent = UPSCALE_FACTOR * 100;
    const upscaleCmd = `magick "${filePath}" -filter point -resize ${resizePercent}% "${outputPath}"`;

    try {
      await this.exec(upscaleCmd);
    } catch (error) {
      throw new SpriteProcessingError(
        "resizing",
        `Failed to upscale item sprite ${basename(filePath)}`,
        error
      );
    }

    const webpPath = outputPath.replace(/\.png$/i, ".webp");
    try {
      const pngBuffer = await fs.readFile(outputPath);
      await this.writeWebp(pngBuffer, webpPath);
    } catch (error) {
      throw error;
    } finally {
      try {
        await fs.unlink(outputPath);
      } catch {
        // Ignore cleanup errors so a lingering PNG doesn't fail the pipeline
      }
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
    await this.ensureDirectoryExists(this.outputDirPath);

    let entries: string[] = [];
    try {
      entries = await fs.readdir(this.sourceDirPath);
    } catch (error) {
      throw new SpriteProcessingError(
        "resizing",
        `Failed to read item sprite directory: ${this.sourceDirPath}`,
        error
      );
    }

    for (const entry of entries) {
      if (!entry.toLowerCase().endsWith(".png")) {
        continue;
      }
      const absolutePath = join(this.sourceDirPath, entry);
      try {
        await this.processSpriteFile(absolutePath);
      } catch (error) {
        console.error(
          `✗ Error processing item sprite ${entry}:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  }

  
}
