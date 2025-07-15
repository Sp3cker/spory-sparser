import { readdirSync, readFileSync } from "fs";
import { join } from "path";


interface ObjectEvent {
  graphics_id: string;
  x: number;
  y: number;
  elevation: number;
  movement_type: string;
  movement_range_x: number;
  movement_range_y: number;
  trainer_type: string;
  trainer_sight_or_berry_tree_id: string;
  script: string;
  flag: string;
}

interface MapData {
  id: string;
  name: string;
  object_events: ObjectEvent[];
}

interface NonTrainerTrainerResult {
  mapId: string;
  mapName: string;
  objectEvent: ObjectEvent;
}

function findNonTrainerTrainers(): NonTrainerTrainerResult[] {
  const results: NonTrainerTrainerResult[] = [];
  const mapsDir = join(process.cwd(), "maps");

  try {
    const mapFolders = readdirSync(mapsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const folder of mapFolders) {
      const mapJsonPath = join(mapsDir, folder, "map.json");

      try {
        const mapData: MapData = JSON.parse(readFileSync(mapJsonPath, "utf8"));

        // Check each object event
        for (const objectEvent of mapData.object_events || []) {
          const script = objectEvent.script || "";
          if (
            objectEvent.trainer_type === "TRAINER_TYPE_NONE" &&
            script.includes("EventScript") &&
            !script.includes("Item") &&
            objectEvent.flag === "0" // Ensure the flag is set
          ) {
            results.push({
              mapId: mapData.id,
              mapName: mapData.name,
              objectEvent: objectEvent,
            });
          }
        }
      } catch (error) {
        console.warn(
          `Could not read map file: ${mapJsonPath}`,
          error instanceof Error ? error.message : error
        );
      }
    }
  } catch (error) {
    console.error("Error reading maps directory:", error);
  }

  return results;
}

function main() {
  console.log(
    "Finding non-trainer trainers (TRAINER_TYPE_NONE with EventScript)...\n"
  );

  const results = findNonTrainerTrainers();

  if (results.length === 0) {
    console.log("No non-trainer trainers found.");
    return;
  }

  console.log(`Found ${results.length} non-trainer trainers:\n`);

  results.forEach((result, index) => {
    console.log(`${index + 1}. Map: ${result.mapName} (${result.mapId})`);
    console.log(
      `   Position: (${result.objectEvent.x}, ${result.objectEvent.y})`
    );
    console.log(`   Graphics: ${result.objectEvent.graphics_id}`);
    console.log(`   Script: ${result.objectEvent.script}`);
    console.log(`   Flag: ${result.objectEvent.flag}`);
    console.log("");
  });

  // Also output as JSON for potential further processing
  console.log("\nJSON output:");
  console.log(JSON.stringify(results, null, 2));
}

(() => main())();

export { findNonTrainerTrainers, NonTrainerTrainerResult };
