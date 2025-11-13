// import { runRule } from "./runSpriteDatasetPipeline.ts";
// import { promises as fs } from "fs";

// (async () => {
//     try {
//         console.log("Running species pipeline...");
//         const { rule, result } = await runRule("species");
//         await fs.writeFile("species_result.json", JSON.stringify(result, null, 2));
//         console.log(
//             `✓ ${rule.name}: generated ${result.generatedCount} sprite(s)\n  Palette output: ${result.paletteOutputDir}\n  Processed output: ${result.processedOutputDir}`
//         );
//         console.log("Species pipeline complete.");
//     } catch (error) {
//         console.error(
//             "Error during species overworld sprite processing:",
//             error instanceof Error ? error.message : error
//         );
//         process.exit(1);
//     }
// })();
