#!/usr/bin/env node
import {
  SpriteDatasetPipeline,
  createOverworldRule,
  createTrainerRule,
  // createSpeciesOverworldRule,
  createItemSpriteRule,
  type SpritePipelineRule,
} from "./SpriteDatasetPipeline.ts";
import { config as CONFIG } from "../config/index.js";

export type RuleKey = "overworld" | "trainers" | "items";

export const RULE_BUILDERS: Record<RuleKey, () => SpritePipelineRule> = {
  overworld: createOverworldRule,
  trainers: createTrainerRule,
  // species: createSpeciesOverworldRule,
  items: createItemSpriteRule,
};

export async function runRule(
  key: RuleKey,
  pipeline: SpriteDatasetPipeline
) {
  const factory = RULE_BUILDERS[key]();
  if (!factory) {
    throw new Error(`Unknown pipeline rule: ${key}`);
  }

  try {
    return { rule: factory, result: await pipeline.process(factory) };
  } catch (error) {

    throw error;
  }
}

// function parseArgs(argv: string[]): { rules: RuleKey[]; help?: boolean } {
//   const options: { rules: RuleKey[]; help?: boolean } = {
//     rules: Object.keys(RULE_BUILDERS) as RuleKey[],
//   };

//   for (let i = 0; i < argv.length; i++) {
//     const arg = argv[i];
//     switch (arg) {
//       case "--help":
//       case "-h":
//         options.help = true;
//         break;
//       default:
//         throw new Error(`Unknown argument: ${arg}`);
//     }
//   }

//   return options;
// }

async function main(): Promise<void> {
  const options: { rules: RuleKey[]; help?: boolean } = {
    rules: Object.keys(RULE_BUILDERS) as RuleKey[],
  };

  const pipeline = new SpriteDatasetPipeline(CONFIG);
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
