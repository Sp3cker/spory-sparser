#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";
import { CharacterSpriteProcessor } from "./CharacterSpriteProcessor.ts";

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
  -s, --source   Source directory containing input PNG sprites (default: generated/people)
  -o, --output   Output directory for generated WEBP files (default: generated/frames)
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

  const processor = new CharacterSpriteProcessor(
    "graphics/object_events/people",
    "generated/overworld/animated"
  );

  try {
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
