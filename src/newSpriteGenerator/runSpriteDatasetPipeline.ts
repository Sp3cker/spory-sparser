#!/usr/bin/env node
import { fileURLToPath } from "url";
import path from "path";
import {
  SpriteDatasetPipeline,
  createOverworldRule,
  createTrainerRule,
  createSpeciesOverworldRule,
  type SpritePipelineRule,
} from "./SpriteDatasetPipeline.ts";
import { config } from "../config/index.js";

type RuleKey = "overworld" | "trainers" | "species";

interface CliOptions {
  rules: RuleKey[];
  help?: boolean;
  list?: boolean;
  runAll?: boolean;
}

const RULE_BUILDERS: Record<RuleKey, () => SpritePipelineRule> = {
  overworld: createOverworldRule,
  trainers: createTrainerRule,
  species: createSpeciesOverworldRule,
};

function printHelp(scriptName: string): void {
  console.log(`Sprite Dataset Pipeline CLI

Usage:
  ${scriptName} [--help]

Runs all sprite dataset pipelines concurrently.
`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { rules: Object.keys(RULE_BUILDERS) as RuleKey[] };

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

  let options: CliOptions;
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

  const rulePromises = (Object.keys(RULE_BUILDERS) as RuleKey[]).map(async (key) => {
    const rule = RULE_BUILDERS[key]();
    try {
      const result = await pipeline.process(rule);
      return { rule, result };
    } catch (error) {
      throw { rule, error };
    }
  });

  const results = await Promise.allSettled(rulePromises);

  for (const entry of results) {
    if (entry.status === "fulfilled") {
      const {
        rule,
        result: { generatedCount, paletteOutputDir, processedOutputDir },
      } = entry.value;
      console.log(
        `✓ ${rule.name}: generated ${generatedCount} sprite(s)\n  Palette output: ${paletteOutputDir}\n  Processed output: ${processedOutputDir}`
      );
    } else {
      const { rule, error } = entry.reason as {
        rule: SpritePipelineRule;
        error: unknown;
      };
      console.error(
        `✗ ${rule.name} pipeline failed:`,
        error instanceof Error ? error.message : error
      );
      process.exitCode = 1;
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
