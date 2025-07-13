import { promises as fs } from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface ProcessingRule {
  width: number;
  height: number;
  frameWidth: number;
  frameCount: number;
  framesToExtract: number[];
  repeatedFrameCount?: number;
  needsPadding?: boolean;
}

export abstract class SpriteProcessor {
  protected tempDir = "/tmp";

  /**
   * Ensure a directory exists, creating it if necessary
   */
  async ensureDirectoryExists(dir: string): Promise<void> {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }

  /**
   * Execute ImageMagick command with error handling
   */
  async execImageMagick(command: string): Promise<void> {
    try {
      await execAsync(command);
    } catch (error) {
      console.error(`ImageMagick command failed: ${command}`);
      throw error;
    }
  }

  /**
   * Execute ImageMagick command and return output
   */
  async execImageMagickWithOutput(command: string): Promise<string> {
    try {
      const { stdout } = await execAsync(command);
      return stdout;
    } catch (error) {
      console.error(`ImageMagick command failed: ${command}`);
      throw error;
    }
  }

  /**
   * Create animated WEBP from frame paths
   */
  async createAnimatedWebP(
    framePaths: string[],
    outputPath: string,
    frameDuration: number
  ): Promise<void> {
    try {
      // Build the img2webp command with lossless compression
      let img2webpCmd = `img2webp -loop 0 -m 6 -lossless`;

      // Add each frame with duration
      for (const framePath of framePaths) {
        img2webpCmd += ` -d ${frameDuration} "${framePath}"`;
      }

      img2webpCmd += ` -o "${outputPath}"`;

      await this.execImageMagick(img2webpCmd);
    } catch (error) {
      console.error(`Error creating animated WEBP: ${error}`);
      throw error;
    }
  }

  /**
   * Generate unique temp file path
   */
  generateTempPath(prefix: string, suffix: string = ".png"): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${this.tempDir}/${prefix}_${timestamp}_${random}${suffix}`;
  }

  /**
   * Clean up temporary files
   */
  async cleanupTempFiles(filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      try {
        await execAsync(`rm -f "${filePath}"`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Extract a rectangular region from an image
   */
  async extractRegion(
    inputPath: string,
    outputPath: string,
    width: number,
    height: number,
    x: number = 0,
    y: number = 0
  ): Promise<void> {
    const cropCmd = `magick "${inputPath}" -crop ${width}x${height}+${x}+${y} +repage "${outputPath}"`;
    await this.execImageMagick(cropCmd);
  }

  /**
   * Add padding to an image
   */
  async addPadding(
    inputPath: string,
    outputPath: string,
    totalWidth: number,
    totalHeight: number,
    offsetX: number = 0,
    offsetY: number = 0
  ): Promise<void> {
    const paddingCmd = `magick -size ${totalWidth}x${totalHeight} xc:transparent \\( "${inputPath}" \\) -geometry +${offsetX}+${offsetY} -composite "${outputPath}"`;
    await this.execImageMagick(paddingCmd);
  }

  /**
   * Abstract method that subclasses must implement
   */
  abstract processAllSprites(): Promise<void>;
}
