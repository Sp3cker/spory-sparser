import { promises as fs } from "fs";
import { basename, join } from "path";
import {
  PeopleSpriteProcessorBase,
  type PeopleSpriteRule,
} from "./PeopleSpriteProcessorBase.ts";
/**
 * Run this file/class in a CLI to process all character sprites
 */
// Exception files that are 288px wide with 32px frames
const EXCEPTION_FILES = [
  "candice.png",
  "cycling_triathlete_f.png",
  "cycling_triathlete_m.png",
];

export class CharacterSpriteProcessor extends PeopleSpriteProcessorBase {
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
        needsPadding: true, // Flag to indicate this sprite needs padding
      };
    }

    // Validate height - all other sprites should be 32px tall
    if (height !== 32) {
      throw new Error(
        `Invalid sprite height for ${filename}: expected 32px or 16px, got ${height}px`
      );
    }

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

    throw new Error(
      `Unsupported sprite dimensions for ${filename}: ${width}x${height}px. Supported widths: 48px, 96px, 144px, 288px (exception files only)`
    );
  }

  protected async processSpriteFile(filePath: string): Promise<void> {
    const filename = basename(filePath);
    const { width, height } = await this.readImageDimensions(filePath);
    const rule = this.getSpriteRule(filename, width, height);

    console.log(`Processing ${filename} (${width}x${height})`);

    const normalizedFrames = await this.extractNormalizedFrames(
      filePath,
      filename,
      rule
    );
    const paddedFrames: string[] = [];

    try {
      for (let i = 0; i < normalizedFrames.length; i++) {
        const paddedFramePath = this.generateTempPath(`padded_final_${i}`);
        let frameY = 8;
        if (rule.width === 144 && rule.framesToExtract[i] === 0) {
          frameY = 9;
        }

        await this.addPadding(
          normalizedFrames[i],
          paddedFramePath,
          32,
          40,
          8,
          frameY
        );

        paddedFrames.push(paddedFramePath);
      }

      const outputPath = join(
        this.outputDirPath,
        `${this.getBaseName(filePath)}.webp`
      );

      await this.createAnimatedWebP2x(paddedFrames, outputPath, 330);
      console.log(`✓ Processed ${filename} -> ${outputPath}`);
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
        console.log("No PNG files found to process.");
        return;
      }

      console.log(`Found ${pngFiles.length} PNG files to process`);

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

      console.log("\nSprite frame extraction complete!");
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
    const pngFiles = files.filter((file) => file.toLowerCase().endsWith(".png"));

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
