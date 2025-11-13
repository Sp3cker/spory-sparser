import { promises as fs } from "fs";
import { basename, join } from "path";
import {
  PeopleSpriteProcessorBase,
  type PeopleSpriteRule,
} from "./PeopleSpriteProcessorBase.ts";
import { SpriteProcessingError } from "./SpriteProcessor.ts";
const UnsupportedDimensions = [
  [192, 32],
  [160, 32],
  [224, 32],
  [64, 64],
];
const EXCEPTION_FILES = [
  "candice.png",
  "cycling_triathlete_f.png",
  "cycling_triathlete_m.png",
];

export interface TrainerProcessorOptions {
  convertToWebP?: boolean;
}

export class TrainerSpriteProcessor extends PeopleSpriteProcessorBase {
  private readonly options: Required<TrainerProcessorOptions>;

  constructor(
    sourceDirPath: string,
    outputDirPath: string,
    options: TrainerProcessorOptions = {}
  ) {
    super(sourceDirPath, outputDirPath, EXCEPTION_FILES);
    this.options = {
      convertToWebP: options.convertToWebP ?? true,
    };
  }

  protected getSpriteRule(
    filename: string,
    width: number,
    height: number
  ): PeopleSpriteRule {
    if (height === 16) {
      if (width !== 144) {
        throw new Error(
          `16px tall sprite ${filename} should be 144px wide, got ${width}px`
        );
      }
      return {
        width: 144,
        height: 16,
        frameWidth: 16,
        frameCount: 9,
        framesToExtract: [3, 0, 4, 0],
        needsPadding: true,
      };
    }

    if (height !== 32) {
      throw new Error(
        `Invalid sprite height for ${filename}: expected 32px or 16px, got ${height}px`
      );
    }

    if (width === 288) {
      return {
        width: 288,
        height: 32,
        frameWidth: 32,
        frameCount: 9,
        framesToExtract: [0, 3, 4, 0],
      };
    }

    if (width === 48) {
      return {
        width: 48,
        height: 32,
        frameWidth: 16,
        frameCount: 3,
        framesToExtract: [0, 0, 0, 0],
      };
    }

    if (width === 96) {
      return {
        width: 96,
        height: 32,
        frameWidth: 32,
        frameCount: 3,
        framesToExtract: [0, 1, 2, 0],
      };
    }

    if (width === 144) {
      return {
        width: 144,
        height: 32,
        frameWidth: 16,
        frameCount: 9,
        framesToExtract: [3, 0, 4, 0],
      };
    }

    throw new Error(
      `Unsupported sprite dimensions for ${filename}: ${width}x${height}px. Supported widths: 48px, 96px, 144px, 288px`
    );
  }

  protected async processSpriteFile(filePath: string): Promise<void> {
    const filename = basename(filePath);
    const { width, height } = await this.readImageDimensions(filePath);
    if (UnsupportedDimensions.some(([w, h]) => w === width && h === height)) {
      return;
    }
    const rule = this.getSpriteRule(filename, width, height);

    let normalizedFrames: string[] = [];

    try {
      normalizedFrames = await this.extractNormalizedFrames(
        filePath,
        filename,
        rule
      );
    } catch (error) {
      throw new SpriteProcessingError(
        "resizing",
        `Failed to normalize frames for ${filename}`,
        error
      );
    }

    try {
      const frameWidthWithPadding = 32;
      const frameHeightWithPadding = 40;
      const outputWidth = normalizedFrames.length * frameWidthWithPadding;
      const outputHeight = frameHeightWithPadding;

      let compositeCmd = `magick -size ${outputWidth}x${outputHeight} xc:transparent`;

      for (let i = 0; i < normalizedFrames.length; i++) {
        const frameX = i * frameWidthWithPadding + 8;
        let frameY = 8;
        if (rule.width === 144 && rule.framesToExtract[i] === 0) {
          frameY = 9;
        }

        compositeCmd += ` \( "${normalizedFrames[i]}" \) -geometry +${frameX}+${frameY} -composite`;
      }

      const outputPng = join(
        this.outputDirPath,
        `${this.getBaseName(filePath)}.png`
      );
      compositeCmd += ` "${outputPng}"`;

      try {
        await this.exec(compositeCmd);
      } catch (error) {
        throw new SpriteProcessingError(
          "resizing",
          `Failed to composite frames for ${filename}`,
          error
        );
      }

      if (this.options.convertToWebP) {
        const webpPath = outputPng.replace(/\.png$/i, ".webp");
        const convertCmd = `magick "${outputPng}" -define webp:lossless=true "${webpPath}"`;
        try {
          await this.exec(convertCmd);
        } catch (error) {
          throw new SpriteProcessingError(
            "writingWebm",
            `Failed to convert ${filename} to WEBP`,
            error
          );
        }
      }
    } catch (error) {
      console.error(
        `✗ Error processing ${filename}:`,
        error instanceof Error ? error.message : error
      );
      throw error;
    } finally {
      await this.cleanupTempFiles(normalizedFrames);
    }
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
        "Error during trainer sprite processing:",
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  }
}
