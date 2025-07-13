import { promises as fs } from "fs";
import { join } from "path";
import { Jimp } from "jimp";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const UPSCALED_PEOPLE_DIR = "generated/people";
const GENERATED_FRAMES_DIR = "generated/frames";

// Exception files that are 288px wide with 32px frames
const EXCEPTION_FILES = [
  "candice.png",
  "cycling_triathlete_f.png",
  "cycling_triathlete_m.png",
];

interface SpriteProcessingRule {
  width: number;
  height: number;
  frameWidth: number;
  frameCount: number;
  framesToExtract: number[];
  repeatedFrameCount?: number; // Number of repeated frames to create for 48px sprites
  needsPadding?: boolean; // For 16px tall sprites that need transparent padding
}

async function ensureDirectoryExists(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

function getSpriteRule(
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
  if (EXCEPTION_FILES.includes(filename)) {
    if (width !== 288) {
      throw new Error(
        `Exception file ${filename} should be 288px wide, got ${width}px`
      );
    }
    return {
      width: 288,
      height: 32,
      frameWidth: 32,
      frameCount: 9, // 288 / 32 = 9 frames
      framesToExtract: [0, 3, 4, 0], // 1st, 4th, 5th frames (0-indexed)
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

async function processSpriteFrames(
  inputPath: string,
  outputPath: string,
  rule: SpriteProcessingRule
): Promise<void> {
  // Use ImageMagick for better transparency handling
  const tempDir = "/tmp";
  const timestamp = Date.now();
  const tempFrames: string[] = [];
  const finalFramePaths: string[] = [];

  try {
    // Extract frames using ImageMagick to preserve transparency
    for (let i = 0; i < rule.framesToExtract.length; i++) {
      const frameIndex = rule.framesToExtract[i];
      const startX = frameIndex * rule.frameWidth;
      const tempFramePath = `${tempDir}/frame_${timestamp}_${i}.png`;

      // Extract frame with ImageMagick, preserving alpha
      let cropCmd = `magick "${inputPath}" -crop ${rule.frameWidth}x${rule.height}+${startX}+0 +repage "${tempFramePath}"`;
      await execAsync(cropCmd);

      // Add padding for 16px tall sprites to make them 32px tall
      if (rule.needsPadding) {
        const paddedFramePath = `${tempDir}/padded_${timestamp}_${i}.png`;
        const paddingCmd = `magick -size ${rule.frameWidth}x32 xc:transparent \\( "${tempFramePath}" \\) -geometry +0+8 -composite "${paddedFramePath}"`;
        await execAsync(paddingCmd);
        // Replace the temp file with the padded version
        await execAsync(`mv "${paddedFramePath}" "${tempFramePath}"`);
      }

      // For exception files and 96x32 sprites, center crop from 32px to 16px width
      if (
        EXCEPTION_FILES.includes(inputPath.split("/").pop() || "") ||
        rule.frameWidth === 32
      ) {
        const cropStartX = (rule.frameWidth - 16) / 2;
        const tempCroppedPath = `${tempDir}/cropped_${timestamp}_${i}.png`;
        const effectiveHeight = rule.needsPadding ? 32 : rule.height;
        cropCmd = `magick "${tempFramePath}" -crop 16x${effectiveHeight}+${cropStartX}+0 +repage "${tempCroppedPath}"`;
        await execAsync(cropCmd);
        // Replace the temp file
        await execAsync(`mv "${tempCroppedPath}" "${tempFramePath}"`);
      }

      // Crop top 8 pixels to get final 24px height
      const finalCropPath = `${tempDir}/final_${timestamp}_${i}.png`;
      // For sprites with 32px frames (exception files and 96x32 sprites), use 16px width after cropping
      const finalFrameWidth = rule.frameWidth === 32 ? 16 : rule.frameWidth;
      cropCmd = `magick "${tempFramePath}" -crop ${finalFrameWidth}x24+0+8 +repage "${finalCropPath}"`;
      await execAsync(cropCmd);

      tempFrames.push(finalCropPath);

      // Clean up intermediate temp file
      await execAsync(`rm -f "${tempFramePath}"`);
    }

    // Add padding to each frame and prepare for animated WEBP creation
    const frameWidthWithPadding = 32; // 16px frame + 8px padding on each side
    const frameHeightWithPadding = 40; // 24px frame + 8px padding on top and bottom

    for (let i = 0; i < tempFrames.length; i++) {
      // Create padded frame with 8px padding on all sides
      const paddedFramePath = `${tempDir}/padded_final_${timestamp}_${i}.png`;

      // For 144px sprites, the 1st frame needs to be 2px lower
      let frameY = 8; // 8px top padding (default)
      if (rule.width === 144 && rule.framesToExtract[i] === 0) {
        frameY = 9; // 2px lower for the first frame of 144px sprites
      }

      const paddingCmd = `magick -size ${frameWidthWithPadding}x${frameHeightWithPadding} xc:transparent \\( "${tempFrames[i]}" \\) -geometry +8+${frameY} -composite "${paddedFramePath}"`;
      await execAsync(paddingCmd);

      finalFramePaths.push(paddedFramePath);
    }

    // Clean up temp frames
    for (const tempFrame of tempFrames) {
      await execAsync(`rm -f "${tempFrame}"`);
    }

    // Create animated WEBP directly
    await createAnimatedWebP(finalFramePaths, outputPath);

    // Clean up padded frames
    for (const paddedFrame of finalFramePaths) {
      await execAsync(`rm -f "${paddedFrame}"`);
    }
  } catch (error) {
    // Clean up on error
    for (const tempFrame of tempFrames) {
      try {
        await execAsync(`rm -f "${tempFrame}"`);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
    for (const paddedFrame of finalFramePaths) {
      try {
        await execAsync(`rm -f "${paddedFrame}"`);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
    throw error;
  }
}

async function createAnimatedWebP(
  framePaths: string[],
  outputPath: string
): Promise<void> {
  try {
    // Create animated WEBP with 0.93s frame duration and loop
    // Using img2webp with lossless compression for maximum quality
    const frameDuration = 330; // 0.43 seconds in milliseconds

    // Build the img2webp command with lossless compression
    // -loop 0: loop indefinitely
    // -m 6: highest compression method
    // -lossless: use lossless compression to preserve all colors and quality
    let img2webpCmd = `img2webp -loop 0 -m 6 -lossless`;

    // Add each frame with duration
    for (const framePath of framePaths) {
      img2webpCmd += ` -d ${frameDuration} "${framePath}"`;
    }

    img2webpCmd += ` -o "${outputPath}"`;

    await execAsync(img2webpCmd);
  } catch (error) {
    console.error(`Error creating animated WEBP: ${error}`);
    throw error;
  }
}

async function processAllSprites(): Promise<void> {
  try {
    // Ensure output directory exists
    await ensureDirectoryExists(GENERATED_FRAMES_DIR);

    // Read all PNG files from upscaled/people directory
    const files = await fs.readdir(UPSCALED_PEOPLE_DIR);
    const pngFiles = files.filter((file) =>
      file.toLowerCase().endsWith(".png")
    );

    console.log(`Found ${pngFiles.length} PNG files to process`);

    for (const filename of pngFiles) {
      try {
        const inputPath = join(UPSCALED_PEOPLE_DIR, filename);
        const baseName = filename.replace(/\.png$/i, "");

        // Read image to get dimensions
        const image = await Jimp.read(inputPath);
        const width = image.width;
        const height = image.height;

        console.log(`Processing ${filename} (${width}x${height})`);

        // Get processing rule for this sprite
        const rule = getSpriteRule(filename, width, height);

        // Process the sprite frames and create animated WEBP
        const animatedWebPPath = join(GENERATED_FRAMES_DIR, `${baseName}.webp`);
        await processSpriteFrames(inputPath, animatedWebPPath, rule);

        console.log(
          `✓ Processed ${filename} -> ${GENERATED_FRAMES_DIR}/${baseName}.webp`
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

// Export the main function
export { processAllSprites };

// If this file is run directly, execute the processing
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllSprites().catch(console.error);
}
