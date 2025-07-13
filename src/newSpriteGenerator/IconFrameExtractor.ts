import { promises as fs } from "fs";
import { join } from "path";
import { SpriteProcessor } from "./SpriteProcessor.js";

const SOURCE_DIR = "generated/192";
const OUTPUT_DIR = "generated/icons";

export class IconFrameExtractor extends SpriteProcessor {
  private sourceDirPath: string;
  private outputDirPath: string;

  constructor(
    sourceDirPath: string = SOURCE_DIR,
    outputDirPath: string = OUTPUT_DIR
  ) {
    super();
    this.sourceDirPath = sourceDirPath;
    this.outputDirPath = outputDirPath;
  }

  /**
   * Process a single 192x384 icon file into an animated WEBP
   */
  async processIconFile(inputPath: string, outputPath: string): Promise<void> {
    const tempFrames: string[] = [];

    try {
      // Use ImageMagick to get dimensions instead of Jimp (handles both PNG and WEBP)
      const identifyCmd = `magick identify -format "%wx%h" "${inputPath}"`;
      const stdout = await this.execImageMagickWithOutput(identifyCmd);
      const [widthStr, heightStr] = stdout.trim().split('x');
      const width = parseInt(widthStr);
      const height = parseInt(heightStr);

      if (width !== 192 || height !== 384) {
        throw new Error(
          `Invalid icon dimensions for ${inputPath}: expected 192x384, got ${width}x${height}`
        );
      }

      // Extract the two 192x192 frames
      const frame1Path = this.generateTempPath("icon_frame1");
      const frame2Path = this.generateTempPath("icon_frame2");

      // Extract top frame (0, 0, 192, 192)
      await this.extractRegion(inputPath, frame1Path, 192, 192, 0, 0);
      tempFrames.push(frame1Path);

      // Extract bottom frame (0, 192, 192, 192)
      await this.extractRegion(inputPath, frame2Path, 192, 192, 0, 192);
      tempFrames.push(frame2Path);

      // Create animated WEBP with both frames
      // Using a longer duration since these are icon animations
      await this.createAnimatedWebP([frame1Path, frame2Path], outputPath, 250);

      console.log(`✓ Processed icon: ${inputPath} -> ${outputPath}`);
    } catch (error) {
      console.error(
        `✗ Error processing icon ${inputPath}:`,
        error instanceof Error ? error.message : error
      );
      throw error;
    } finally {
      // Clean up temporary files
      await this.cleanupTempFiles(tempFrames);
    }
  }

  /**
   * Find all icon.png files in the source directory structure
   */
  async findAllIconFiles(): Promise<string[]> {
    const iconPaths: string[] = [];

    async function scanDirectory(dirPath: string): Promise<void> {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = join(dirPath, entry.name);

          if (entry.isDirectory()) {
            // Recursively scan subdirectories
            await scanDirectory(fullPath);
          } else if (entry.name === "icon.png") {
            iconPaths.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not read directory ${dirPath}:`, error);
      }
    }

    await scanDirectory(this.sourceDirPath);
    return iconPaths;
  }

  /**
   * Process all icon files in the source directory
   */
  async processAllSprites(): Promise<void> {
    try {
      // Ensure output directory exists
      await this.ensureDirectoryExists(this.outputDirPath);

      // Find all icon.png files
      const iconFiles = await this.findAllIconFiles();
      console.log(`Found ${iconFiles.length} icon files to process`);

      if (iconFiles.length === 0) {
        console.log("No icon files found to process");
        return;
      }

      // Process each icon file
      for (const iconPath of iconFiles) {
        try {
          // Generate output path: preserve directory structure under output dir
          const relativePath = iconPath.replace(this.sourceDirPath + "/", "");
          const dirName = relativePath.replace("/icon.png", "");
          const outputPath = join(this.outputDirPath, dirName, "icon.webp");

          // Ensure output subdirectory exists
          const outputDir = join(this.outputDirPath, dirName);
          await this.ensureDirectoryExists(outputDir);

          await this.processIconFile(iconPath, outputPath);
        } catch (error) {
          console.error(
            `Failed to process ${iconPath}:`,
            error instanceof Error ? error.message : error
          );
          // Continue processing other files
        }
      }

      console.log("\nIcon frame extraction complete!");
    } catch (error) {
      console.error("Error during icon processing:", error);
      throw error;
    }
  }
}

// Export the main function for compatibility
export async function processAllIcons(): Promise<void> {
  const extractor = new IconFrameExtractor();
  await extractor.processAllSprites();
}

// If this file is run directly, execute the processing
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllIcons().catch(console.error);
}
