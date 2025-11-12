import { promises as fs } from "fs";
import { join } from "path";
import { Jimp } from "jimp";
import { SpriteProcessor, ProcessingRule } from "./SpriteProcessor.js";

// Exception files that are 288px wide with 32px frames
const EXCEPTION_FILES = [
  "candice.png",
  "cycling_triathlete_f.png",
  "cycling_triathlete_m.png",
];

interface SpriteProcessingRule extends ProcessingRule {
  repeatedFrameCount?: number; // Number of repeated frames to create for 48px sprites
  needsPadding?: boolean; // For 16px tall sprites that need transparent padding
}

export class CharacterSpriteProcessor extends SpriteProcessor {
  private sourceDirPath: string;
  private outputDirPath: string;

  constructor(sourceDirPath: string, outputDirPath: string) {
    super();
    this.sourceDirPath = sourceDirPath;
    this.outputDirPath = outputDirPath;
  }

  /**
   * Get processing rule for a sprite based on its dimensions and filename
   */
  private getSpriteRule(
    filename: string,
    width: number,
    height: number
  ): SpriteProcessingRule {
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

  /**
   * Process sprite frames with complex logic for different sprite types
   */
  async processSpriteFrames(
    inputPath: string,
    outputPath: string,
    rule: SpriteProcessingRule
  ): Promise<void> {
    const tempFrames: string[] = [];
    const finalFramePaths: string[] = [];

    try {
      // Extract frames using ImageMagick to preserve transparency
      for (let i = 0; i < rule.framesToExtract.length; i++) {
        const frameIndex = rule.framesToExtract[i];
        const startX = frameIndex * rule.frameWidth;
        const tempFramePath = this.generateTempPath(`frame_${i}`);

        // Extract frame with ImageMagick, preserving alpha
        await this.extractRegion(
          inputPath,
          tempFramePath,
          rule.frameWidth,
          rule.height,
          startX,
          0
        );

        // Add padding for 16px tall sprites to make them 32px tall
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
          // Replace the temp file with the padded version
          await this.execImageMagick(
            `mv "${paddedFramePath}" "${tempFramePath}"`
          );
        }

        // For exception files and 96x32 sprites, center crop from 32px to 16px width
        if (
          EXCEPTION_FILES.includes(inputPath.split("/").pop() || "") ||
          rule.frameWidth === 32
        ) {
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
          // Replace the temp file
          await this.execImageMagick(
            `mv "${tempCroppedPath}" "${tempFramePath}"`
          );
        }

        // Crop top 8 pixels to get final 24px height
        const finalCropPath = this.generateTempPath(`final_${i}`);
        // For sprites with 32px frames (exception files and 96x32 sprites), use 16px width after cropping
        const finalFrameWidth = rule.frameWidth === 32 ? 16 : rule.frameWidth;
        await this.extractRegion(
          tempFramePath,
          finalCropPath,
          finalFrameWidth,
          24,
          0,
          8
        );

        tempFrames.push(finalCropPath);

        // Clean up intermediate temp file
        await this.execImageMagick(`rm -f "${tempFramePath}"`);
      }

      // Add padding to each frame and prepare for animated WEBP creation
      const frameWidthWithPadding = 32; // 16px frame + 8px padding on each side
      const frameHeightWithPadding = 40; // 24px frame + 8px padding on top and bottom

      for (let i = 0; i < tempFrames.length; i++) {
        // Create padded frame with 8px padding on all sides
        const paddedFramePath = this.generateTempPath(`padded_final_${i}`);

        // For 144px sprites, the 1st frame needs to be 2px lower
        let frameY = 8; // 8px top padding (default)
        if (rule.width === 144 && rule.framesToExtract[i] === 0) {
          frameY = 9; // 2px lower for the first frame of 144px sprites
        }

        await this.addPadding(
          tempFrames[i],
          paddedFramePath,
          frameWidthWithPadding,
          frameHeightWithPadding,
          8,
          frameY
        );

        finalFramePaths.push(paddedFramePath);
      }

      // Clean up temp frames
      await this.cleanupTempFiles(tempFrames);

      // Create animated WEBP directly
      await this.createAnimatedWebP(finalFramePaths, outputPath, 330);

      // Clean up padded frames
      await this.cleanupTempFiles(finalFramePaths);
    } catch (error) {
      // Clean up on error
      await this.cleanupTempFiles(tempFrames);
      await this.cleanupTempFiles(finalFramePaths);
      throw error;
    }
  }

  /**
   * Process all sprites in the source directory
   */
  async processAllSprites(): Promise<void> {
    try {
      // Ensure output directory exists
      await this.ensureDirectoryExists(this.outputDirPath);

      // Read all PNG files from upscaled/people directory
      const files = await fs.readdir(this.sourceDirPath);
      const pngFiles = files.filter((file) =>
        file.toLowerCase().endsWith(".png")
      );

      console.log(`Found ${pngFiles.length} PNG files to process`);

      for (const filename of pngFiles) {
        try {
          const inputPath = join(this.sourceDirPath, filename);
          const baseName = filename.replace(/\.png$/i, "");

          // Read image to get dimensions
          const image = await Jimp.read(inputPath);
          const width = image.width;
          const height = image.height;

          console.log(`Processing ${filename} (${width}x${height})`);

          // Get processing rule for this sprite
          const rule = this.getSpriteRule(filename, width, height);

          // Process the sprite frames and create animated WEBP
          const animatedWebPPath = join(this.outputDirPath, `${baseName}.webp`);
          await this.processSpriteFrames(inputPath, animatedWebPPath, rule);

          console.log(
            `✓ Processed ${filename} -> ${this.outputDirPath}/${baseName}.webp`
          );
        } catch (error) {
          console.error(
            `✗ Error processing ${filename}:`,
            error instanceof Error ? error.message : error
          );
        }
      }

      console.log("\nSprite frame extraction complete!");
    } catch (error) {
      console.error("Error during sprite processing:", error);
      throw error;
    }
  }
}

// Export the main function for backward compatibility
export async function processAllSprites(): Promise<void> {
  const processor = new CharacterSpriteProcessor("temp", "temp");
  await processor.processAllSprites();
}
