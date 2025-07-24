import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

(async () => {
  try {
    const inputFilePath = resolve("levels.json"); // Read from levels.json
    const outputFilePath = resolve("generated/filtered_wild_mons.json");

    // Read and parse the JSON file
    const data = JSON.parse(readFileSync(inputFilePath, "utf8"));

    // Extract all wildMons from all levels
    const allWildMons = [];
    
    // Iterate through each map in the data
    Object.values(data).forEach(mapLevels => {
      // Iterate through each level in the map
      mapLevels.forEach(level => {
        // Check if the level has scriptedGives
        if (level.scriptedGives && Array.isArray(level.scriptedGives)) {
          // Iterate through each scriptedGive
          level.scriptedGives.forEach(scriptedGive => {
            // Check if the scriptedGive has wildMon array
            if (scriptedGive.wildMon && Array.isArray(scriptedGive.wildMon)) {
              // Extract each wildMon from the array
              scriptedGive.wildMon.forEach(wildMonEntry => {
                if (wildMonEntry.species) {
                  allWildMons.push({
                    species: wildMonEntry.species,
                    level: wildMonEntry.level,
                    map: level.thisLevelsId,
                    script: wildMonEntry.script || null
                  });
                }
              });
            }
          });
        }
      });
    });

    // Write the filtered data to a new file
    writeFileSync(outputFilePath, JSON.stringify(allWildMons, null, 2));

    console.log(`Found ${allWildMons.length} wildMons across all levels`);
    console.log(`Filtered data written to ${outputFilePath}`);
  } catch (error) {
    console.error("Error filtering wildMons:", error);
  }
})();
