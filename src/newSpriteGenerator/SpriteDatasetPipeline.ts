import { promises as fs } from "fs";
import path from "path";
import { Jimp, intToRGBA } from "jimp";
import {
  PaletteApplier,
  type PaletteEntry,
} from "./PaletteApplier/PaletteApplier.ts";
import { config, type Config } from "../config/index.js";
import { ObjectEventGraphicSchema } from "../parseMaps/overworld/collectSprites.ts";
import { TrainerGraphicsSchema } from "../parseMaps/Trainers/joinTrainerGraphics.ts";
import { OverworldTrainerSpriteProcessor } from "./OverworldTrainerSpriteProcessor.ts";
import { OverworldSpeciesSpriteProcessor } from "./OverworldSpeciesSpriteProcessor.ts";
import { TrainerSpriteProcessor } from "./TrainerSpriteProcessor.ts";
import { ItemSpriteProcessor } from "./ItemSpriteProcessor.ts";
import { SpriteProcessingError } from "./SpriteProcessor.ts";
import { speciesEntrySchema } from "../validators/speciesData.ts";

export interface PaletteTask {
  name: string;
  spritePath: string;
  palettePath: string;
  outputFileName?: string;
  transformPalette?: (palette: PaletteEntry[]) => PaletteEntry[];
  postProcess?: (pngPath: string) => Promise<void>;
  useSourceImage?: boolean;
}

export interface SpritePipelineRule {
  name: string;
  jsonFile: string;
  paletteOutputSubDir: string; // Palettized images output subdirectory
  processedOutputSubDir: string; // .webp output subdirectory
  entryToTasks(
    entryName: string,
    entryValue: unknown
  ): PaletteTask | PaletteTask[] | undefined;
  processorFactory(
    sourceDir: string,
    outputDir: string
  ): SpritePipelineProcessor;
}

export interface PipelineResult {
  ruleName: string;
  generatedCount: number;
  paletteOutputDir: string;
  processedOutputDir: string;
}

export interface SpritePipelineProcessor {
  processSpriteFiles(filePaths: string[]): Promise<number>;
}

export class SpriteDatasetPipeline {
  private readonly paletteApplier: PaletteApplier;

  constructor(private readonly cfg: Config = config) {
    this.paletteApplier = new PaletteApplier({ config: this.cfg });
  }

  async process(rule: SpritePipelineRule): Promise<PipelineResult> {
    type PipelineStage =
      | "beforePaletteApplication"
      | "afterPaletteBeforeResizing"
      | "completed";
    let stage: PipelineStage = "beforePaletteApplication";

    try {
      const jsonPath = path.resolve(this.cfg.dataDir, rule.jsonFile);
      const rawJson = await fs.readFile(jsonPath, "utf-8");
      const parsedJson = JSON.parse(rawJson) as Record<string, unknown>;

      const tasks: PaletteTask[] = [];
      for (const [name, entry] of Object.entries(parsedJson)) {
        const result = rule.entryToTasks(name, entry);
        if (!result) continue;
        if (Array.isArray(result)) {
          tasks.push(...result);
        } else {
          tasks.push(result);
        }
      }

      if (tasks.length === 0) {
        return {
          ruleName: rule.name,
          generatedCount: 0,
          paletteOutputDir: path.resolve(
            this.cfg.outputDir,
            rule.paletteOutputSubDir
          ),
          processedOutputDir: path.resolve(
            this.cfg.outputDir,
            rule.processedOutputSubDir
          ),
        };
      }

      const sourceDir = path.resolve(
        this.cfg.outputDir,
        rule.paletteOutputSubDir
      );
      const outputDir = path.resolve(
        this.cfg.outputDir,
        rule.processedOutputSubDir
      );

      await fs.mkdir(sourceDir, { recursive: true });
      await fs.mkdir(outputDir, { recursive: true });

      const processedEntries = await fs.readdir(outputDir);
      const processedBaseNames = new Set(
        processedEntries
          .filter((file) => /\.(png|webp)$/i.test(file))
          .map((file) => path.parse(file).name)
      );

      console.log(`[${rule.name}] Preparing ${tasks.length} task(s)`);
      console.log(
        `[${rule.name}] Sample tasks: ${tasks
          .slice(0, 5)
          .map((t) => t.name)
          .join(", ")}`
      );

      const generatedPaths: string[] = [];
      let processedCount = 0;
      let taskIndex = 0;
      for (const task of tasks) {
        taskIndex++;
        const baseName = task.outputFileName ?? task.name;
        try {
          console.log(
            `[${rule.name}] Preparing ${baseName} (task ${taskIndex}/${tasks.length})`
          );
          const useSourceImage = task.useSourceImage === true;
          const hasTransform =
            !useSourceImage && typeof task.transformPalette === "function";
          const hasPostProcess = typeof task.postProcess === "function";
          const requiresAdditionalProcessing = hasTransform || hasPostProcess;

          if (taskIndex <= 5) {
            console.log(
              `[${rule.name}] Debug task ${taskIndex}: useSourceImage=${useSourceImage}, hasTransform=${hasTransform}, hasPostProcess=${hasPostProcess}`
            );
          }

          if (
            processedBaseNames.has(baseName) &&
            !requiresAdditionalProcessing
          ) {
            continue;
          }

          processedCount++;

          const fileName = `${baseName}.png`;
          const absolutePath = path.resolve(sourceDir, fileName);

          let buffer: Buffer;
          if (useSourceImage) {
            try {
              buffer = await fs.readFile(task.spritePath);
              await this.paletteApplier.writePng(
                rule.paletteOutputSubDir,
                fileName,
                buffer,
                { overwrite: true }
              );
            } catch (error) {
              console.error(
                `[${rule.name}] Failed copying source image for ${baseName}:`,
                error instanceof Error ? error.message : error
              );
              continue;
            }
          } else if (hasTransform) {
            const basePalette = this.paletteApplier.readPalette(
              task.palettePath
            );
            const adjustedPalette = task.transformPalette!(
              basePalette.map((entry) => ({ ...entry }))
            );
            const pngBuffer = await fs.readFile(task.spritePath);
            buffer = this.paletteApplier.applyPalette(
              pngBuffer,
              adjustedPalette
            );
            await this.paletteApplier.writePng(
              rule.paletteOutputSubDir,
              fileName,
              buffer,
              { overwrite: true }
            );
          } else {
            try {
              buffer = await fs.readFile(absolutePath);
            } catch {
              buffer = this.paletteApplier.applyPaletteFromFiles(
                task.spritePath,
                task.palettePath
              );
              await this.paletteApplier.writePng(
                rule.paletteOutputSubDir,
                fileName,
                buffer,
                { overwrite: hasPostProcess }
              );
            }
          }

          if (hasPostProcess && task.postProcess) {
            console.log(`[${rule.name}] Post-processing ${baseName}`);
            try {
              await task.postProcess(absolutePath);
              buffer = await fs.readFile(absolutePath);
            } catch (postError) {
              console.error(
                `[${rule.name}] Post-process failed for ${baseName}:`,
                postError instanceof Error ? postError.message : postError
              );
              continue;
            }
          }

          if (["overworld", "speciesOverworld"].includes(task.name) && this.isSquarePng(buffer)) {
            console.log(
              `[${rule.name}] Skipping ${baseName} (square image detected)`
            );
            continue;
          }

          generatedPaths.push(absolutePath);
          console.log(
            `[${rule.name}] Added ${baseName} to generated list (size=${generatedPaths.length})`
          );
          console.log(`[${rule.name}] Ready to process ${baseName}`);
        } catch (taskError) {
          console.error(
            `[${rule.name}] Fatal error processing ${baseName}:`,
            taskError instanceof Error ? taskError.stack : taskError
          );
          throw taskError;
        }
      }

      console.log(
        `[${rule.name}] Generated ${generatedPaths.length} sprite input(s) after iterating ${taskIndex} task(s)`
      );

      const processor = rule.processorFactory(sourceDir, outputDir);
      stage = "afterPaletteBeforeResizing";
      const processedCountResult = await processor.processSpriteFiles(
        generatedPaths
      );
      console.log(
        `[${rule.name}] Processor handled ${processedCountResult} file(s)`
      );
      stage = "completed";

      return {
        ruleName: rule.name,
        generatedCount: processedCount,
        paletteOutputDir: sourceDir,
        processedOutputDir: outputDir,
      };
    } catch (error) {
      if (error instanceof SpriteProcessingError) {
        if (error.stage === "resizing") {
          console.error(
            `[${rule.name}] Failed after palette application but before resizing: ${error.message}`
          );
        } else if (error.stage === "writingWebm") {
          console.error(
            `[${rule.name}] Failed after resizing but before writing to WEBP: ${error.message}`
          );
        }
      } else {
        const message = error instanceof Error ? error.message : String(error);
        if (stage === "beforePaletteApplication") {
          console.error(
            `[${rule.name}] Failed before palette application: ${message}`
          );
        } else if (stage === "afterPaletteBeforeResizing") {
          console.error(
            `[${rule.name}] Failed after palette application but before resizing: ${message}`
          );
        } else {
          console.error(
            `[${rule.name}] Failed after resizing but before writing to WEBP: ${message}`
          );
        }
      }
      throw error;
    } finally {
      console.log(`[${rule.name}] process() exiting at stage ${stage}`);
    }
  }

  private isSquarePng(buffer: Buffer): boolean {
    if (buffer.length < 24) {
      return false;
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return width === height;
  }
}

export function createOverworldRule(): SpritePipelineRule {
  return {
    name: "overworld",
    jsonFile: "object_event_graphics.json",
    paletteOutputSubDir: "overworld",
    processedOutputSubDir: "overworld/animated",
    entryToTasks: (entryName, entryValue) => {
      const parsed = ObjectEventGraphicSchema.parse(entryValue);
      const firstSprite = parsed.sprites[0];
      if (!firstSprite) {
        return undefined;
      }

      const spritePath = firstSprite.replace(/(.*?)\.4bpp(\.smol)?$/, "$1.png");

      return {
        name: entryName,
        spritePath,
        palettePath: parsed.palette,
      };
    },
    processorFactory: (sourceDir, outputDir) =>
      new OverworldTrainerSpriteProcessor(sourceDir, outputDir),
  };
}

export function createTrainerRule(): SpritePipelineRule {
  return {
    name: "trainers",
    jsonFile: "trainer_graphics.json",
    paletteOutputSubDir: "trainers/raw",
    processedOutputSubDir: "trainers/processed",
    entryToTasks: (entryName, entryValue) => {
      const parsed = TrainerGraphicsSchema.parse(entryValue);
      const spritePath = parsed.frontPic.replace(
        /(.*?)\.4bpp\.smol$/,
        "$1.png"
      );

      return {
        name: entryName,
        spritePath,
        palettePath: parsed.palette,
      };
    },
    processorFactory: (sourceDir, outputDir) =>
      new TrainerSpriteProcessor(sourceDir, outputDir),
  };
}

export function createItemSpriteRule(): SpritePipelineRule {
  return {
    name: "items",
    jsonFile: "items.json",
    paletteOutputSubDir: "items/raw",
    processedOutputSubDir: "items/processed",
    entryToTasks: (entryName, entryValue) => {
      if (
        !entryValue ||
        typeof entryValue !== "object" ||
        entryValue === null
      ) {
        return undefined;
      }
      const { iconPic, iconPalette } = entryValue as {
        iconPic?: unknown;
        iconPalette?: unknown;
      };
      if (typeof iconPic !== "string" || typeof iconPalette !== "string") {
        return undefined;
      }

      const iconPicPath = iconPic.trim();
      const iconPalettePath = iconPalette.trim();
      if (!iconPicPath) {
        console.warn(`[items] Skipping ${entryName}: missing icon resource`);
        return undefined;
      }

      if (!iconPalettePath) {
        console.warn(
          `[items] Skipping ${entryName}: missing icon palette reference`
        );
        return undefined;
      }

      const spritePath = iconPicPath.replace(/(.*?)\.4bpp(\.smol)?$/i, "$1.png");
      return {
        name: entryName,
        spritePath,
        palettePath: iconPalettePath,
      };
    },
    processorFactory: (sourceDir, outputDir) =>
      new ItemSpriteProcessor(sourceDir, outputDir),
  };
}

export function createSpeciesOverworldRule(): SpritePipelineRule {
  return {
    name: "speciesOverworld",
    jsonFile: "species.json",
    paletteOutputSubDir: "species_overworld",
    processedOutputSubDir: "species_overworld/animated",
    entryToTasks: (entryName, entryValue) => {
      const parsedResult = speciesEntrySchema.safeParse(entryValue);
      if (!parsedResult.success) {
        const candidateName =
          typeof entryValue === "object" &&
          entryValue !== null &&
          "nameKey" in entryValue &&
          typeof (entryValue as { nameKey?: unknown }).nameKey === "string"
            ? (entryValue as { nameKey: string }).nameKey
            : entryName;

        console.error(
          `[speciesOverworld] Validation failed for "${candidateName}"`
        );
        console.error(parsedResult.error.flatten());
        return undefined;
      }

      const parsed = parsedResult.data;
      const spritePath = parsed.icon.replace(/(.*?)\.4bpp$/, "$1.png");
      return {
        name: entryName,
        spritePath,
        palettePath: parsed.palette,
        useSourceImage: true,
        postProcess: async (pngPath) => {
          try {
            const image = await Jimp.read(pngPath);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            let targetColor = image.getPixelColor(0, 5);
            if (width <= 5 || height <= 5) {
              targetColor = image.getPixelColor(
                Math.max(0, Math.min(5, width - 1)),
                Math.max(0, Math.min(5, height - 1))
              );
            }

            const { r, g, b, a } = intToRGBA(targetColor);
            const { data } = image.bitmap;
            let maxX = -1;
            let maxY = -1;
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                if (
                  data[idx] === r &&
                  data[idx + 1] === g &&
                  data[idx + 2] === b &&
                  data[idx + 3] === a
                ) {
                  data[idx + 3] = 0;
                }
                if (data[idx + 3] !== 0) {
                  if (x > maxX) maxX = x;
                  if (y > maxY) maxY = y;
                }
              }
            }

            if (maxX === -1 || maxY === -1) {
              await (image as any).write(pngPath);
              console.log(`[speciesOverworld] Post-process complete for ${entryName}`);
              return;
            }

            const desiredOffsetX = 0;
            const desiredOffsetY = 1;
            const desiredBlur = 2;
            const desiredShadowAlpha = 0.45;

            const marginRight = width - 1 - maxX;
            const marginBottom = height - 1 - maxY;
            let blurRadius = Math.max(
              0,
              Math.min(desiredBlur, marginRight, marginBottom)
            );
            blurRadius = Math.floor(blurRadius);
            const maxOffsetX = Math.max(0, marginRight - blurRadius);
            const maxOffsetY = Math.max(0, marginBottom - blurRadius);
            const offsetX = Math.min(desiredOffsetX, maxOffsetX);
            const offsetY = Math.min(desiredOffsetY, maxOffsetY);

            // if (blurRadius === 0 && offsetX === 0 && offsetY === 0) {
            //   await (image as any).write(pngPath);
            //   console.log(`[speciesOverworld] Post-process complete for ${entryName}`);
            //   return;
            // }

            const sprite = image.clone();
            const shadow = sprite.clone();
            const shadowData = shadow.bitmap.data;
            const targetAlpha = Math.round(255 * desiredShadowAlpha);
            for (let i = 0; i < shadowData.length; i += 4) {
              const alphaValue = shadowData[i + 3];
              if (alphaValue === 0) {
                continue;
              }
              shadowData[i] = 0;
              shadowData[i + 1] = 0;
              shadowData[i + 2] = 0;
              shadowData[i + 3] = Math.min(alphaValue, targetAlpha);
            }
            if (blurRadius > 0) {
              shadow.blur(blurRadius);
            }

            image.bitmap.data.fill(0);
            image.composite(shadow, offsetX, offsetY);
            image.composite(sprite, 0, 0);

            await (image as any).write(pngPath);
            console.log(`[speciesOverworld] Post-process complete for ${entryName}`);
          } catch (error) {
            throw new SpriteProcessingError(
              "writingWebm",
              `Failed to remove background for ${entryName}`,
              error
            );
          }
        },
      };
    },
    processorFactory: (sourceDir, outputDir) =>
      new OverworldSpeciesSpriteProcessor(sourceDir, outputDir),
  };
}
