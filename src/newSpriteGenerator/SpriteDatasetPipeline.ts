import { promises as fs } from "fs";
import path from "path";
import { PaletteApplier } from "./PaletteApplier/PaletteApplier.ts";
import { config, type Config } from "../config/index.js";
import {
  ObjectEventGraphicSchema,
} from "../parseMaps/overworld/collectSprites.ts";
import {
  TrainerGraphicsSchema,
} from "../parseMaps/Trainers/joinTrainerGraphics.ts";
import { CharacterSpriteProcessor } from "./CharacterSpriteProcessor.ts";
import { TrainerSpriteProcessor } from "./TrainerSpriteProcessor.ts";
import type { PeopleSpriteProcessorBase } from "./PeopleSpriteProcessorBase.ts";

export interface PaletteTask {
  name: string;
  spritePath: string;
  palettePath: string;
  outputFileName?: string;
}

export interface SpritePipelineRule {
  name: string;
  jsonFile: string;
  paletteOutputSubDir: string;
  processedOutputSubDir: string;
  entryToTasks(
    entryName: string,
    entryValue: unknown
  ): PaletteTask | PaletteTask[] | undefined;
  processorFactory(
    sourceDir: string,
    outputDir: string
  ): PeopleSpriteProcessorBase;
}

export interface PipelineResult {
  ruleName: string;
  generatedCount: number;
  paletteOutputDir: string;
  processedOutputDir: string;
}

export class SpriteDatasetPipeline {
  private readonly paletteApplier: PaletteApplier;

  constructor(private readonly cfg: Config = config) {
    this.paletteApplier = new PaletteApplier({ config: this.cfg });
  }

  async process(rule: SpritePipelineRule): Promise<PipelineResult> {
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

    const generatedPaths: string[] = [];
    for (const task of tasks) {
      const buffer = this.paletteApplier.applyPaletteFromFiles(
        task.spritePath,
        task.palettePath
      );

      const fileName = `${task.outputFileName ?? task.name}.png`;
      const relativeWritten = await this.paletteApplier.writePng(
        rule.paletteOutputSubDir,
        fileName,
        buffer
      );
      generatedPaths.push(
        path.resolve(this.cfg.outputDir, relativeWritten)
      );
    }

    const sourceDir = path.resolve(
      this.cfg.outputDir,
      rule.paletteOutputSubDir
    );
    const outputDir = path.resolve(
      this.cfg.outputDir,
      rule.processedOutputSubDir
    );

    const processor = rule.processorFactory(sourceDir, outputDir);
    await processor.processSpriteFiles(generatedPaths);

    return {
      ruleName: rule.name,
      generatedCount: tasks.length,
      paletteOutputDir: sourceDir,
      processedOutputDir: outputDir,
    };
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
      new CharacterSpriteProcessor(sourceDir, outputDir),
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
