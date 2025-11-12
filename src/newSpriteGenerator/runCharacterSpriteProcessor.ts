#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import { CharacterSpriteProcessor } from "./CharacterSpriteProcessor.ts";
import {
  SpriteDatasetPipeline,
  createOverworldRule,
} from "./SpriteDatasetPipeline.ts";
import { config } from "../config/index.js";

interface CliOptions {
  sourceDir?: string;
  outputDir?: string;
  help?: boolean;
}

function printHelp(scriptName: string): void {
  console.log(`Character Sprite Processor CLI

Usage:
  ${scriptName} [--source <dir>] [--output <dir>]

Options:
  -s, --source   Source directory containing input PNG sprites (skips JSON pipeline)
  -o, --output   Output directory for generated WEBP files (default: <outputDir>/overworld/animated)
  -h, --help     Show this message and exit
`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--source":
      case "-s":
        options.sourceDir = argv[++i];
        break;
      case "--output":
      case "-o":
        options.outputDir = argv[++i];
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        console.warn(`Unknown argument: ${arg}`);
        options.help = true;
        break;
    }
  }

  return options;
}

async function main(): Promise<void> {
  const scriptPath = fileURLToPath(import.meta.url);
  const scriptName = path.basename(scriptPath);
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp(scriptName);
    return;
  }

  if (!options.sourceDir) {
    const pipeline = new SpriteDatasetPipeline(config);
    try {
      const result = await pipeline.process(createOverworldRule());
      console.log(
        `Generated ${result.generatedCount} palette-applied sprite(s).`
      );
      console.log(`Palette output: ${result.paletteOutputDir}`);
      console.log(`Animated output: ${result.processedOutputDir}`);
    } catch (error) {
      console.error(
        "Overworld pipeline failed:",
        error instanceof Error ? error.message : error
      );
      process.exitCode = 1;
    }
    return;
  }

  const defaultOutput = path.resolve(config.outputDir, "overworld/animated");
  const sourceDir = path.resolve(options.sourceDir);
  const outputDir = path.resolve(options.outputDir || defaultOutput);

  // Helpful logging and existence checks
  console.log(`Using source: ${sourceDir}`);
  console.log(`Using output: ${outputDir}`);

  try {
    await fs.access(sourceDir);
  } catch {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exitCode = 1;
    return;
  }

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  const processor = new CharacterSpriteProcessor(sourceDir, outputDir);

  try {
    // Process all sprites in the source directory
    await processor.processAllSprites();
  } catch (error) {
    console.error(
      "Character sprite processing failed:",
      error instanceof Error ? error.message : error
    );
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
