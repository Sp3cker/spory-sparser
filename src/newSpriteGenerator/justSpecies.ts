import {
  SpriteDatasetPipeline,
  createSpeciesOverworldRule,
} from "./SpriteDatasetPipeline.ts";
import { config } from "../config/index.js";
import { promises as fs } from "fs";
(async () => {
    try {
        console.log("Running species pipeline...");
        const result = await new SpriteDatasetPipeline(config).process(createSpeciesOverworldRule());
        console.log("Pipeline promise resolved");
        await fs.writeFile("species_result.json", JSON.stringify(result, null, 2));
        console.log("Pipeline result:", result);
        console.log("Species pipeline complete.");
    } catch (error) {
        console.error(
            "Error during species overworld sprite processing:",
            error instanceof Error ? error.message : error
        );
        process.exit(1);
    }
})();
