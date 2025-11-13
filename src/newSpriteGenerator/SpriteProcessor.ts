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

export type SpriteProcessingStage = "resizing" | "writingWebm";

export class SpriteProcessingError extends Error {
  public readonly stage: SpriteProcessingStage;
  public readonly cause?: unknown;

  constructor(stage: SpriteProcessingStage, message: string, cause?: unknown) {
    super(message);
    this.name = "SpriteProcessingError";
    this.stage = stage;
    this.cause = cause;
  }
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
  async exec(command: string): Promise<void> {
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

      await this.exec(img2webpCmd);
    } catch (error) {
      console.error(`Error creating animated WEBP: ${error}`);
      throw error;
    }
  }

  /**
   * Create animated WEBP after upscaling frames 2x with point filter.
   * This preserves pixel-art crispness and centralizes scaling.
   */
  async createAnimatedWebP2x(
    framePaths: string[],
    outputPath: string,
    frameDuration: number
  ): Promise<void> {
    const scaledFrames: string[] = [];
    try {
      // Pre-scale all frames to 200% with nearest-neighbour (point) filter
      for (const src of framePaths) {
        const dst = this.generateTempPath("scaled", ".png");
        const cmd = `magick "${src}" -filter point -resize 200% "${dst}"`;
        await this.exec(cmd);
        scaledFrames.push(dst);
      }

      // Build the img2webp command with lossless compression
      let img2webpCmd = `img2webp -loop 0 -m 6 -lossless`;
      for (const framePath of scaledFrames) {
        img2webpCmd += ` -d ${frameDuration} "${framePath}"`;
      }
      img2webpCmd += ` -o "${outputPath}"`;

      await this.exec(img2webpCmd);
    } catch (error) {
      console.error(`Error creating upscaled animated WEBP: ${error}`);
      throw error;
    } finally {
      // Cleanup temp scaled frames regardless of success
      await this.cleanupTempFiles(scaledFrames);
    }
  }

  async createAnimatedWebPScaled(
    framePaths: string[],
    outputPath: string,
    frameDuration: number,
    scaleFactor: number
  ): Promise<void> {
    if (scaleFactor <= 0) {
      throw new Error("scaleFactor must be greater than zero");
    }

    const scaledFrames: string[] = [];
    try {
      for (const src of framePaths) {
        const dst = this.generateTempPath("scaled", ".png");
        const percent = scaleFactor * 100;
        const cmd = `magick "${src}" -filter point -resize ${percent}% "${dst}"`;
        await this.exec(cmd);
        scaledFrames.push(dst);
      }

      let img2webpCmd = `img2webp -loop 0 -m 6 -lossless`;
      for (const framePath of scaledFrames) {
        img2webpCmd += ` -d ${frameDuration} "${framePath}"`;
      }
      img2webpCmd += ` -o "${outputPath}"`;

      await this.exec(img2webpCmd);
    } catch (error) {
      console.error(`Error creating scaled animated WEBP: ${error}`);
      throw error;
    } finally {
      await this.cleanupTempFiles(scaledFrames);
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
    await this.exec(cropCmd);
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
    await this.exec(paddingCmd);
  }

  /**
   * Abstract method that subclasses must implement
   */
  abstract processAllSprites(): Promise<void>;
}
