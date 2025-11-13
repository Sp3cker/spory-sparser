import { promises as fs } from "fs";
import { basename, join } from "path";
import { Jimp } from "jimp";
import { SpriteProcessor, type ProcessingRule } from "./SpriteProcessor.js";

export interface PeopleSpriteRule extends ProcessingRule {
  // needsPadding?: boolean;
}

export abstract class PeopleSpriteProcessorBase extends SpriteProcessor {
  protected exceptionFiles: Set<string>;

  constructor(
    protected sourceDirPath: string,
    protected outputDirPath: string,
    exceptionFiles: string[] = []
  ) {
    super();
    this.exceptionFiles = new Set(exceptionFiles.map((file) => file.toLowerCase()));
  }

  /**
   * Determine if a sprite should be center-cropped from 32px to 16px.
   */
  protected shouldCenterCrop(filename: string, rule: PeopleSpriteRule): boolean {
    return (
      rule.frameWidth === 32 ||
      this.exceptionFiles.has(filename.toLowerCase())
    );
  }

  /**
   * Extract frames from the source sprite and normalize them to 16x24 PNGs.
   */
  protected async extractNormalizedFrames(
    inputPath: string,
    filename: string,
    rule: PeopleSpriteRule
  ): Promise<string[]> {
    const normalizedFrames: string[] = [];
    try {
      for (let i = 0; i < rule.framesToExtract.length; i++) {
        const frameIndex = rule.framesToExtract[i];
        const startX = frameIndex * rule.frameWidth;
        const tempFramePath = this.generateTempPath(`frame_${i}`);

        await this.extractRegion(
          inputPath,
          tempFramePath,
          rule.frameWidth,
          rule.height,
          startX,
          0
        );

        if (rule.needsPadding) {
          const paddedFramePath = this.generateTempPath(`padded_${i}`);
          await this.addPadding(
            tempFramePath,
            paddedFramePath,
            rule.frameWidth,
            32,
            0,
            8
          );
          await this.exec(
            `mv "${paddedFramePath}" "${tempFramePath}"`
          );
        }

        if (this.shouldCenterCrop(filename, rule)) {
          const cropStartX = (rule.frameWidth - 16) / 2;
          const tempCroppedPath = this.generateTempPath(`cropped_${i}`);
          const effectiveHeight = rule.needsPadding ? 32 : rule.height;
          await this.extractRegion(
            tempFramePath,
            tempCroppedPath,
            16,
            effectiveHeight,
            cropStartX,
            0
          );
          await this.exec(
            `mv "${tempCroppedPath}" "${tempFramePath}"`
          );
        }

        const finalFrameWidth = rule.frameWidth === 32 ? 16 : rule.frameWidth;
        const finalCropPath = this.generateTempPath(`final_${i}`);
        await this.extractRegion(
          tempFramePath,
          finalCropPath,
          finalFrameWidth,
          24,
          0,
          8
        );

        normalizedFrames.push(finalCropPath);

        await this.exec(`rm -f "${tempFramePath}"`);
      }

      return normalizedFrames;
    } catch (error) {
      await this.cleanupTempFiles(normalizedFrames);
      throw error;
    }
  }

  /**
   * Process a list of sprite files.
   */
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

  /**
   * Process every PNG inside the configured source directory.
   */
  async processAllSprites(): Promise<void> {
    const files = await fs.readdir(this.sourceDirPath);
    const pngFiles = files.filter((file) =>
      file.toLowerCase().endsWith(".png")
    );

    const absolutePaths = pngFiles.map((file) =>
      join(this.sourceDirPath, file)
    );

    await this.processSpriteFiles(absolutePaths);
  }

  protected async readImageDimensions(filePath: string): Promise<{
    width: number;
    height: number;
  }> {
    const image = await Jimp.read(filePath);
    return { width: image.width, height: image.height };
  }

  protected abstract getSpriteRule(
    filename: string,
    width: number,
    height: number
  ): PeopleSpriteRule;

  protected abstract processSpriteFile(filePath: string): Promise<void>;

  protected getBaseName(filePath: string): string {
    return basename(filePath).replace(/\.png$/i, "");
  }
}
