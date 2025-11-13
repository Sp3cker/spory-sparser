import { promises as fs } from "fs";
import { basename, join } from "path";
import {
  PeopleSpriteProcessorBase,
  type PeopleSpriteRule,
} from "./PeopleSpriteProcessorBase.ts";
import { SpriteProcessingError } from "./SpriteProcessor.ts";
const SupportedDimensions = new Set<string>([
  "48x32",
  "96x32",
  "128x32",
  "144x16",
  "144x32",
  "288x32",
  "416x32",
]);
/**
 * Run this file/class in a CLI to process all character sprites
 */
// Exception files that are 288px wide with 32px frames
const EXCEPTION_FILES = [
  "candice.png",
  "cycling_triathlete_f.png",
  "cycling_triathlete_m.png",
];

export class OverworldTrainerSpriteProcessor extends PeopleSpriteProcessorBase {
  constructor(sourceDirPath: string, outputDirPath: string) {
    super(sourceDirPath, outputDirPath, EXCEPTION_FILES);
  }

  /**
   * Get processing rule for a sprite based on its dimensions and filename
   */
  protected getSpriteRule(
    filename: string,
    width: number,
    height: number
  ): PeopleSpriteRule {
    if (height === 32 && width === 416) {
      return {
        width,
        height,
        frameWidth: 32,
        frameCount: 13,
        framesToExtract: [0, 3, 0, 4],
      };
    }
    // Handle 16px tall sprites by adding transparent padding
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
        frameCount: 9, // 144 / 16 = 9 frames
        framesToExtract: [3, 0, 4, 0], // 4th, 1st, 5th frames (0-indexed)
        // needsPadding: true, // Flag to indicate this sprite needs padding
      };
    }

    // Validate height - all other sprites should be 32px tall
    if (height === 32) {
      // throw new Error(
      //   `Invalid sprite height for ${filename}: expected 32px or 16px, got ${height}px`
      // );

      // Handle exception files (288px wide)
      // if (EXCEPTION_FILES.includes(filename)) {
      // if (width !== 288) {
      //   throw new Error(
      //     `Exception file ${filename} should be 288px wide, got ${width}px`
      //   );
      // }

      if (width === 288) {
        return {
          width: 288,
          height: 32,
          frameWidth: 32,
          frameCount: 9, // 288 / 32 = 9 frames
          framesToExtract: [0, 3, 0, 4], // 1st, 4th, 5th frames (0-indexed)
        };
      }

      // Handle 48px wide sprites
      if (width === 48) {
        return {
          width: 48,
          height: 32,
          frameWidth: 16,
          frameCount: 3, // 48 / 16 = 3 frames
          framesToExtract: [0, 0, 0, 0], // Create 4 repeated frames from the 1st frame
          repeatedFrameCount: 4, // Create 4 repeated frames
        };
      }

      // Handle 96px wide sprites (3 frames)
      if (width === 96) {
        return {
          width: 96,
          height: 32,
          frameWidth: 32,
          frameCount: 3, // 96 / 32 = 3 frames
          framesToExtract: [0, 1, 2, 0], // 1st, 2nd, 3rd frames (0-indexed)
        };
      }

      // Handle 144px wide sprites. ORDER OF FRAMES IS SET HERE.
      if (width === 144) {
        return {
          width: 144,
          height: 32,
          frameWidth: 16,
          frameCount: 9, // 144 / 16 = 9 frames
          framesToExtract: [3, 0, 4, 0], // 4th, 1st, 5th frames (0-indexed)
        };
      }
      if (width === 128) {
        return {
          width: 128,
          height: 32,
          frameWidth: 16,
          frameCount: 8, // 128 / 16 = 8 frames
          framesToExtract: [4, 0, 4, 0], // 4th, 1st, 5th frames (0-indexed)
        };
      }
    }

    throw new Error(
      `Unsupported sprite dimensions for ${filename}: ${width}x${height}px. Supported sizes: ${[
        ...SupportedDimensions,
      ].join(", ")}`
    );
  }

  protected async processSpriteFile(filePath: string): Promise<void> {
    const filename = basename(filePath);
    const { width, height } = await this.readImageDimensions(filePath);
    if (!SupportedDimensions.has(`${width}x${height}`)) {
      return;
    }
    const rule = this.getSpriteRule(filename, width, height);

    let normalizedFrames: string[] = [];
    const paddedFrames: string[] = [];

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
      for (let i = 0; i < normalizedFrames.length; i++) {
        const paddedFramePath = this.generateTempPath(`padded_final_${i}`);
        let frameY = 8;
        if (rule.width === 144 && rule.framesToExtract[i] === 0) {
          frameY = 9;
        }

        try {
          await this.addPadding(
            normalizedFrames[i],
            paddedFramePath,
            32,
            40,
            8,
            frameY
          );
        } catch (error) {
          throw new SpriteProcessingError(
            "resizing",
            `Failed to pad frame ${i} for ${filename}`,
            error
          );
        }

        paddedFrames.push(paddedFramePath);
      }

      const outputPath = join(
        this.outputDirPath,
        `${this.getBaseName(filePath)}.webp`
      );

      try {
        await this.createAnimatedWebPScaled(paddedFrames, outputPath, 330, 2);
      } catch (error) {
        throw new SpriteProcessingError(
          "writingWebm",
          `Failed to create WEBP for ${filename}`,
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
      await this.cleanupTempFiles(normalizedFrames);
      await this.cleanupTempFiles(paddedFrames);
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
        "Error during sprite processing:",
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  }

  async processFirstNSprites(limit: number): Promise<void> {
    if (limit <= 0) {
      return;
    }

    await this.ensureDirectoryExists(this.outputDirPath);

    const files = await fs.readdir(this.sourceDirPath);
    const pngFiles = files.filter((file) =>
      file.toLowerCase().endsWith(".png")
    );

    if (pngFiles.length === 0) {
      console.log("No PNG files found to process.");
      return;
    }

    console.log(
      `Found ${pngFiles.length} PNG files to process (limiting to ${limit}).`
    );

    let processed = 0;
    for (const filename of pngFiles) {
      if (processed >= limit) break;
      try {
        await this.processSpriteFile(join(this.sourceDirPath, filename));
      } catch (error) {
        console.error(
          `✗ Error processing ${filename}:`,
          error instanceof Error ? error.message : error
        );
      }
      processed++;
    }

    console.log("\nLimited sprite processing complete!");
  }
}
