#!/usr/bin/env node
import { fileURLToPath } from "url";
import path from "path";
import {
  SpriteDatasetPipeline,
  createOverworldRule,
  createTrainerRule,
  // createSpeciesOverworldRule,
  createItemSpriteRule,
  type SpritePipelineRule,
} from "./SpriteDatasetPipeline.ts";
import { config } from "../config/index.js";

export type RuleKey = "overworld" | "trainers" | "items";

export const RULE_BUILDERS: Record<RuleKey, () => SpritePipelineRule> = {
  overworld: createOverworldRule,
  trainers: createTrainerRule,
  // species: createSpeciesOverworldRule,
  items: createItemSpriteRule,
};

export async function runRule(
  key: RuleKey,
  pipeline: SpriteDatasetPipeline = new SpriteDatasetPipeline(config)
) {
  const factory = RULE_BUILDERS[key];
  if (!factory) {
    throw new Error(`Unknown pipeline rule: ${key}`);
  }
  const rule = factory();
  try {
    return { rule, result: await pipeline.process(rule) };
  } catch (error) {
    if (error && typeof error === "object") {
      Object.assign(error as Record<string, unknown>, { rule });
    }
    throw error;
  }
}

function printHelp(scriptName: string): void {
  console.log(`Sprite Dataset Pipeline CLI

Usage:
  ${scriptName} [--help]

Runs all sprite dataset pipelines concurrently.
`);
}

function parseArgs(argv: string[]): { rules: RuleKey[]; help?: boolean } {
  const options: { rules: RuleKey[]; help?: boolean } = {
    rules: Object.keys(RULE_BUILDERS) as RuleKey[],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

async function main(): Promise<void> {
  const scriptPath = fileURLToPath(import.meta.url);
  const scriptName = path.basename(scriptPath);

  let options: ReturnType<typeof parseArgs>;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    printHelp(scriptName);
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    printHelp(scriptName);
    return;
  }

  const pipeline = new SpriteDatasetPipeline(config);
  const settled = await Promise.allSettled(
    options.rules.map((key) => runRule(key, pipeline))
  );

  for (const entry of settled) {
    if (entry.status === "fulfilled") {
      const {
        value: {
          rule,
          result: { generatedCount, paletteOutputDir, processedOutputDir },
        },
      } = entry;
      console.log(
        `✓ ${rule.name}: generated ${generatedCount} sprite(s)\n  Palette output: ${paletteOutputDir}\n  Processed output: ${processedOutputDir}`
      );
      continue;
    }
    const ruleName =
      (entry.reason as { rule?: SpritePipelineRule }).rule?.name ?? "unknown";
    console.error(
      `✗ ${ruleName} pipeline failed:`,
      entry.reason instanceof Error ? entry.reason.message : entry.reason
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
