// import { promises as fs } from "fs";
// import { join } from "path";
// import { Jimp } from "jimp";
// import { exec } from "child_process";
// import { promisify } from "util";

// const execAsync = promisify(exec);

// const UPSCALED_PEOPLE_DIR = "generated/people";
// const GENERATED_PEOPLE_16_DIR = "generated/people/16";
// const GENERATED_PEOPLE_48_DIR = "generated/people/48";

// // Exception files that are 288px wide with 32px frames
// const EXCEPTION_FILES = [
//   "candice.png",
//   "cycling_triathlete_f.png",
//   "cycling_triathlete_m.png",
// ];

// interface SpriteProcessingRule {
//   width: number;
//   height: number;
//   frameWidth: number;
//   frameCount: number;
//   outputDir: string;
//   framesToExtract: number[];
//   repeatedFrameCount?: number; // Number of repeated frames to create for 48px sprites
//   needsPadding?: boolean; // For 16px tall sprites that need transparent padding
// }

// async function ensureDirectoryExists(dir: string): Promise<void> {
//   try {
//     await fs.mkdir(dir, { recursive: true });
//   } catch (error) {
//     // Directory might already exist, ignore error
//   }
// }

// function getSpriteRule(
//   filename: string,
//   width: number,
//   height: number
// ): SpriteProcessingRule {
//   // Handle 16px tall sprites by adding transparent padding
//   if (height === 16) {
//     if (width !== 144) {
//       throw new Error(
//         `16px tall sprite ${filename} should be 144px wide, got ${width}px`
//       );
//     }
//     return {
//       width: 144,
//       height: 16,
//       frameWidth: 16,
//       frameCount: 9, // 144 / 16 = 9 frames
//       outputDir: GENERATED_PEOPLE_48_DIR,
//       framesToExtract: [3, 0, 4, 0], // 4th, 1st, 5th frames (0-indexed)
//       needsPadding: true, // Flag to indicate this sprite needs padding
//     };
//   }

//   // Validate height - all other sprites should be 32px tall
//   if (height !== 32) {
//     throw new Error(
//       `Invalid sprite height for ${filename}: expected 32px or 16px, got ${height}px`
//     );
//   }

//   // Handle exception files (288px wide)
//   if (EXCEPTION_FILES.includes(filename)) {
//     if (width !== 288) {
//       throw new Error(
//         `Exception file ${filename} should be 288px wide, got ${width}px`
//       );
//     }
//     return {
//       width: 288,
//       height: 32,
//       frameWidth: 32,
//       frameCount: 9, // 288 / 32 = 9 frames
//       outputDir: GENERATED_PEOPLE_48_DIR,
//       framesToExtract: [0, 3, 4, 0], // 1st, 4th, 5th frames (0-indexed)
//     };
//   }

//   // Handle 48px wide sprites
//   if (width === 48) {
//     return {
//       width: 48,
//       height: 32,
//       frameWidth: 16,
//       frameCount: 3, // 48 / 16 = 3 frames
//       outputDir: GENERATED_PEOPLE_48_DIR, // Only create the repeated frame version
//       framesToExtract: [0, 0, 0, 0], // Create 4 repeated frames from the 1st frame
//       repeatedFrameCount: 4, // Create 4 repeated frames
//     };
//   }

//   // Handle 96px wide sprites (3 frames)
//   if (width === 96) {
//     return {
//       width: 96,
//       height: 32,
//       frameWidth: 32,
//       frameCount: 3, // 96 / 32 = 3 frames
//       outputDir: GENERATED_PEOPLE_48_DIR,
//       framesToExtract: [0, 1, 2, 0], // 1st, 2nd, 3rd frames (0-indexed)
//     };
//   }

//   // Handle 144px wide sprites. ORDER OF FRAMES IS SET HERE.
//   if (width === 144) {
//     return {
//       width: 144,
//       height: 32,
//       frameWidth: 16,
//       frameCount: 9, // 144 / 16 = 9 frames
//       outputDir: GENERATED_PEOPLE_48_DIR,
//       framesToExtract: [3, 0, 4, 0], // 4th, 1st, 5th frames (0-indexed)
//     };
//   }

//   throw new Error(
//     `Unsupported sprite dimensions for ${filename}: ${width}x${height}px. Supported widths: 48px, 96px, 144px, 288px (exception files only)`
//   );
// }

// async function processSprite(
//   inputPath: string,
//   outputPath: string,
//   rule: SpriteProcessingRule
// ): Promise<void> {
//   // Use ImageMagick for better transparency handling
//   const tempDir = "/tmp";
//   const timestamp = Date.now();
//   const tempFrames: string[] = [];

//   try {
//     // Extract frames using ImageMagick to preserve transparency
//     for (let i = 0; i < rule.framesToExtract.length; i++) {
//       const frameIndex = rule.framesToExtract[i];
//       const startX = frameIndex * rule.frameWidth;
//       const tempFramePath = `${tempDir}/frame_${timestamp}_${i}.png`;

//       // Extract frame with ImageMagick, preserving alpha
//       let cropCmd = `magick "${inputPath}" -crop ${rule.frameWidth}x${rule.height}+${startX}+0 +repage "${tempFramePath}"`;
//       await execAsync(cropCmd);

//       // Add padding for 16px tall sprites to make them 32px tall
//       if (rule.needsPadding) {
//         const paddedFramePath = `${tempDir}/padded_${timestamp}_${i}.png`;
//         const paddingCmd = `magick -size ${rule.frameWidth}x32 xc:transparent \\( "${tempFramePath}" \\) -geometry +0+8 -composite "${paddedFramePath}"`;
//         await execAsync(paddingCmd);
//         // Replace the temp file with the padded version
//         await execAsync(`mv "${paddedFramePath}" "${tempFramePath}"`);
//       }

//       // For exception files and 96x32 sprites, center crop from 32px to 16px width
//       if (EXCEPTION_FILES.includes(inputPath.split("/").pop() || "") || rule.frameWidth === 32) {
//         const cropStartX = (rule.frameWidth - 16) / 2;
//         const tempCroppedPath = `${tempDir}/cropped_${timestamp}_${i}.png`;
//         const effectiveHeight = rule.needsPadding ? 32 : rule.height;
//         cropCmd = `magick "${tempFramePath}" -crop 16x${effectiveHeight}+${cropStartX}+0 +repage "${tempCroppedPath}"`;
//         await execAsync(cropCmd);
//         // Replace the temp file
//         await execAsync(`mv "${tempCroppedPath}" "${tempFramePath}"`);
//       }

//       // Crop top 8 pixels to get final 24px height
//       const finalCropPath = `${tempDir}/final_${timestamp}_${i}.png`;
//       // For sprites with 32px frames (exception files and 96x32 sprites), use 16px width after cropping
//       const finalFrameWidth = rule.frameWidth === 32 ? 16 : rule.frameWidth;
//       cropCmd = `magick "${tempFramePath}" -crop ${finalFrameWidth}x24+0+8 +repage "${finalCropPath}"`;
//       await execAsync(cropCmd);

//       tempFrames.push(finalCropPath);

//       // Clean up intermediate temp file
//       await execAsync(`rm -f "${tempFramePath}"`);
//     }

//     // Create final output with padding using ImageMagick
//     const frameWidthWithPadding = 32; // 16px frame + 8px padding on each side
//     const frameHeightWithPadding = 40; // 24px frame + 8px padding on top and bottom
//     const outputWidth = tempFrames.length * frameWidthWithPadding;
//     const outputHeight = frameHeightWithPadding;

//     // Create transparent background
//     let compositeCmd = `magick -size ${outputWidth}x${outputHeight} xc:transparent`;

//     // Composite each frame with 8px padding
//     for (let i = 0; i < tempFrames.length; i++) {
//       const frameX = i * frameWidthWithPadding + 8; // 8px left padding

//       // For 144px sprites, the 1st frame needs to be 2px lower
//       let frameY = 8; // 8px top padding (default)
//       if (rule.width === 144 && rule.framesToExtract[i] === 0) {
//         frameY = 9; // 2px lower for the first frame of 144px sprites
//       }

//       compositeCmd += ` \\( "${tempFrames[i]}" \\) -geometry +${frameX}+${frameY} -composite`;
//     }

//     compositeCmd += ` "${outputPath}"`;
//     await execAsync(compositeCmd);

//     // Clean up temp frames
//     for (const tempFrame of tempFrames) {
//       await execAsync(`rm -f "${tempFrame}"`);
//     }
//   } catch (error) {
//     // Clean up on error
//     for (const tempFrame of tempFrames) {
//       try {
//         await execAsync(`rm -f "${tempFrame}"`);
//       } catch (cleanupError) {
//         // Ignore cleanup errors
//       }
//     }
//     throw error;
//   }
// }

// async function processAllSprites(): Promise<void> {
//   try {
//     // Ensure output directories exist
//     await ensureDirectoryExists(GENERATED_PEOPLE_16_DIR);
//     await ensureDirectoryExists(GENERATED_PEOPLE_48_DIR);

//     // Read all PNG files from upscaled/people directory
//     const files = await fs.readdir(UPSCALED_PEOPLE_DIR);
//     const pngFiles = files.filter((file) =>
//       file.toLowerCase().endsWith(".png")
//     );

//     console.log(`Found ${pngFiles.length} PNG files to process`);

//     for (const filename of pngFiles) {
//       try {
//         const inputPath = join(UPSCALED_PEOPLE_DIR, filename);

//         // Read image to get dimensions
//         const image = await Jimp.read(inputPath);
//         const width = image.width;
//         const height = image.height;

//         console.log(`Processing ${filename} (${width}x${height})`);

//         // Get processing rule for this sprite
//         const rule = getSpriteRule(filename, width, height);

//         // Generate output path
//         const outputPath = join(rule.outputDir, filename);

//         // Process the sprite
//         await processSprite(inputPath, outputPath, rule);

//         console.log(`✓ Processed ${filename} -> ${rule.outputDir}/${filename}`);
//       } catch (error) {
//         console.error(
//           `✗ Error processing ${filename}:`,
//           error instanceof Error ? error.message : error
//         );
//       }
//     }

//     console.log("\nSprite processing complete!");

//     // Convert all PNGs to WEBP in both output directories
//     for (const dir of [GENERATED_PEOPLE_16_DIR, GENERATED_PEOPLE_48_DIR]) {
//       try {
//         console.log(`Converting PNGs to WEBP in ${dir} ...`);
//         const files = await fs.readdir(dir);
//         const pngFiles = files.filter((file) =>
//           file.toLowerCase().endsWith(".png")
//         );
//         for (const file of pngFiles) {
//           const inputPath = join(dir, file);
//           const outputPath = join(dir, file.replace(/\.png$/i, ".webp"));
//           const cwebpCmd = `cwebp -q 100 -m 6 -near_lossless 100 -mt "${inputPath}" -o "${outputPath}"`;
//           await execAsync(cwebpCmd);
//         }
//         console.log(`✓ WEBP conversion complete in ${dir}`);
//       } catch (error) {
//         console.error(
//           `✗ Error converting PNGs to WEBP in ${dir}:`,
//           error instanceof Error ? error.message : error
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Error during sprite processing:", error);
//     throw error;
//   }
// }

// // Export the main function
// export { processAllSprites };

// // If this file is run directly, execute the processing
// if (import.meta.url === `file://${process.argv[1]}`) {
//   processAllSprites().catch(console.error);
// }
