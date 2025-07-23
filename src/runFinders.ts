import path from "path";
import { mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { findMartSectionsByLevel } from "./parseMarts.ts";
import { findGiveItemsByLevel } from "./parseMaps/index.ts";
import { Config } from "./configReader.ts";

const prettyPrint = (data: any): string => JSON.stringify(data, null, 2);

(async () => {
  try {
    const config = new Config();

    // Ensure output directory exists
    mkdirSync(path.join(config.outputDir), { recursive: true });

    // Run findMartSectionsByLevel
    const martSections = await findMartSectionsByLevel(config.mapsDir);
    await writeFile(
      path.join(config.outputDir, "mart_sections.json"),
      prettyPrint(martSections)
    );
    console.log("Mart sections written to mart_sections.json");

    // Run findGiveItemsByLevel
    const giveItems = await findGiveItemsByLevel(
      config.mapsDir,
      config.miscScriptsDir
    );
    await writeFile(
      path.join(config.outputDir, "give_items.json"),
      prettyPrint(giveItems)
    );
    console.log("Give items written to give_items.json");
  } catch (error) {
    console.error("Error running finders:", error);
  }
})();
