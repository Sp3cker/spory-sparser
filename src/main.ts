import path from "path";
import { mkdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import { findMartSectionsByLevel, Mart, MartEntry } from "./parseMarts.ts";
import { findGiveItemsByLevel, LevelIncData } from "./parseMaps/index.ts";
import { main } from "./parseMapEvents.ts";
// import { extractTrainerParties } from "./parseMaps/Trainers/extractTrainerPartiesfromHeaderFile.ts";
// import { mergeAdditionalParties } from "./parseMaps/Trainers/mergeAdditionalParties.ts";
import { extractTrainers } from "./parseMaps/Trainers/extractTrainersFromHeaderFile.ts";

import { MapEventPlace, TrainerStruct } from "./validators/index.ts";
import { logger } from "./util/logger.ts";
import { compareDataChanges } from "./util/compareDataChanges.ts";

import { Config } from "./configReader.ts";
import { IncScriptEvent } from "./parseMaps/incParser.ts";
import mergeTrainers from "./mergeTrainerData.ts";

/**
 * Combined trainer data from maps.json and trainers_flat.json
 */
interface Trainer {
  id: string;
  script: string;
  sprite?: string;
  /** ID of the level this trainer appears on */
  level: string;
  rematch?: boolean; // could be assigned undefined or true
}

interface MergedData {
  thisLevelsId: string;
  baseMap: string;
  levelLabel: string;
  shopItems: Mart[];
  pickupItems: any[]; // Define more specific type if possible
  scriptedGives: IncScriptEvent[];
  image: string;
  trainers?: Trainer[];
  trainerRefs?: { id: string; script: string }[];
}

type GroupedData = Record<string, MergedData[]>;

// Insert a new helper type that omits trainers when preparing grouped output
type GroupedDataOutput = Record<string, Omit<MergedData, "trainers">[]>;

interface MergeDataParams {
  martsData: MartEntry[];
  mapsData: LevelIncData[];
  pickupItemsAndTrainers: MapEventPlace[];
  /** Data from `trainers_flat */
  trainersFlat: Record<string, TrainerStruct>;
  encountersMap: Map<string, any>;
}

const prettyPrint = (data: any): string => JSON.stringify(data, null, 2);

const mergeDataByLevelsID = async ({
  martsData,
  mapsData,
  pickupItemsAndTrainers,
  trainersFlat,
  encountersMap,
}: MergeDataParams): Promise<{
  groupedData: GroupedDataOutput;
  groupedTrainers: Record<string, Trainer[]>;
}> => {
  const mergedData: MergedData[] = mapsData
    .map((mapEntry) => {
      const { thisLevelsId } = mapEntry;

      const martEntry = martsData.find(
        (mart) => mart.thisLevelsId === thisLevelsId
      );
      // Things found in `map.json`
      const pickupEntry = pickupItemsAndTrainers.find(
        (pickup) => pickup.thisLevelsId === thisLevelsId
      );

      if (!martEntry || !pickupEntry) {
        logger.warn(`Missing data for thisLevelsId: ${thisLevelsId}`);
        return null; // Return null to be filtered out later
      }

      // const coordMap = new Map<
      //   string,
      //   { x: number; y: number; sprite?: string }
      // >();
      // for (const t of pickupEntry.trainers ?? []) {
      //   if (t.script) {
      //     coordMap.set(t.script, {
      //       x: t.coords[0],
      //       y: t.coords[1],
      //       sprite: t.graphics_id,
      //     });
      //   }
      // }
      /** Here we match up trainers from the .inc file
       * with trainers from the header file.
       * We also get their overworld sprite here from the map.json.
       * We also move the `rematch` prop from `trainerRefs` to the trainer object
       * */
      const trainersAlsoInMapJson = mapEntry.trainerRefs
        .map((incTrainer) =>
          mergeTrainers(incTrainer, trainersFlat, thisLevelsId, pickupEntry)
        )
        .filter((trainer) => trainer !== null) as Trainer[];

      /** filter out battles with same ID. Generally these get in here
       * because of double battles. When there are duplicates, prioritize keeping
       * the one with rematch: true but preserve sprite from original
       */
      const seen = new Map<string, Trainer>();
      for (const tr of trainersAlsoInMapJson) {
        const existing = seen.get(tr.id);
        if (!existing) {
          // First time seeing this ID, keep it
          seen.set(tr.id, tr);
        } else if (tr.rematch && !existing.rematch) {
          // Replace the existing trainer if current one has rematch: true
          // but preserve the sprite from the original (non-rematch) version
          const updatedTrainer = {
            ...tr,
            sprite: existing.sprite || tr.sprite, // Keep original sprite if it exists
          };
          seen.set(tr.id, updatedTrainer);
        } else if (!tr.rematch && existing.rematch) {
          // If we encounter a non-rematch after a rematch, update the rematch trainer
          // to have rematch: true but use the sprite from the non-rematch version
          const updatedTrainer = {
            ...existing,
            sprite: tr.sprite || existing.sprite, // Use the non-rematch sprite
          };
          seen.set(tr.id, updatedTrainer);
        }
        // Otherwise, keep the existing one (don't replace)
      }

      const trainersUnique = Array.from(seen.values());

      const result = {
        thisLevelsId: mapEntry.thisLevelsId,
        baseMap: mapEntry.baseMap,
        levelLabel: mapEntry.levelLabel,
        shopItems: martEntry.marts,
        pickupItems: pickupEntry.pickupItems || [],
        scriptedGives: mapEntry.scriptedGives || [],
        image: pickupEntry.imageName,
        trainers: trainersUnique,
        trainerRefs: mapEntry.trainerRefs,
      };

      // Filter out places that don't have any meaningful content
      // like the Battle Frontier...
      const hasShopItems = result.shopItems && result.shopItems.length > 0;
      const hasPickupItems = result.pickupItems && result.pickupItems.length > 0;
      const hasTrainerRefs = result.trainerRefs && result.trainerRefs.length > 0;
      const hasEncounters = encountersMap.has(result.thisLevelsId);
      const hasScriptedGives = result.scriptedGives.length > 0;
      if (
        !hasShopItems &&
        !hasPickupItems &&
        !hasTrainerRefs &&
        !hasEncounters &&
        !hasScriptedGives
      ) {
        return null; // Skip empty locations (no shops, items, trainers, or encounters)
      }

      return result;
    })
    .map((r) => {
      if (!r) return r;

      // Remove empty array properties by creating new object without them
      const cleaned: any = { ...r };
      if (cleaned.shopItems && cleaned.shopItems.length === 0) {
        delete cleaned.shopItems;
      }
      if (cleaned.pickupItems && cleaned.pickupItems.length === 0) {
        delete cleaned.pickupItems;
      }
      if (cleaned.scriptedGives && cleaned.scriptedGives.length === 0) {
        delete cleaned.scriptedGives;
      }
      if (cleaned.trainers && cleaned.trainers.length === 0) {
        delete cleaned.trainers;
      }
      if (cleaned.trainerRefs && cleaned.trainerRefs.length === 0) {
        delete cleaned.trainerRefs;
      }
      return cleaned;
    })
    .filter(Boolean) as MergedData[]; // Filter out null entries

  // Make this a dictionary with keys of baseMaps
  // so {ABANDONED_SHIP: [...], ROUTE_1: [...]}
  // OTHERwise, it's just an array of [{scriptedGives,pickupitems...}]
  const groupedData = mergedData.reduce<GroupedData>((acc, entry) => {
    const { baseMap } = entry;
    if (!acc[baseMap]) {
      acc[baseMap] = [];
    }
    acc[baseMap].push(entry);
    return acc;
  }, {});

  // Create dictionary of BASE_MAPs with trainer objects
  // This will become `trainers.json`
  const trainersOnMapDictionary: Record<string, Trainer[]> = {};
  for (const [map, levels] of Object.entries(groupedData)) {
    const trainersOnMap = levels.flatMap((lvl) => lvl.trainers || []);
    if (trainersOnMap.length) trainersOnMapDictionary[map] = trainersOnMap;
  }

  // Strip `trainers` before returning groupedData
  // This will be `levels.json`
  const groupedDataForOutput: GroupedDataOutput = {};
  for (const [base, levels] of Object.entries(groupedData)) {
    groupedDataForOutput[base] = levels.map(({ trainers: _t, ...rest }) => rest);
  }

  return {
    groupedData: groupedDataForOutput,
    groupedTrainers: trainersOnMapDictionary,
  };
};

(async () => {
  // Call the functions here as needed
  try {
    // const rootDir = process.cwd();
    // const directoryPath = path.join(rootDir, "maps");

    // if (!directoryPath) {
    //   console.error("Usage: ts-node main.ts <directory-path>");
    //   process.exit(1);
    // }

    const config = new Config();
    const encountersData = JSON.parse(
      await readFile(path.join(config.dataDir, "cleanEncounters.json"), "utf8")
    );
    const encountersMap = new Map<string, any>(
      encountersData.map((enc: any) => [enc.map, enc])
    );
    // --- Trainer & party extraction ----------------------------------
    const trainerParties = await readFile(
      path.join(config.dataDir, "trainer_parties.json"),
      "utf8"
    ).then(JSON.parse);
    const trainersFlat: Record<string, TrainerStruct> = extractTrainers(
      config.dataDir,
      trainerParties,
      config.battlePics,
      config.outputDir
    );

    // Ensure output directory exists
    mkdirSync(path.join(config.outputDir), { recursive: true });

    // Optionally persist to disk for inspection
    // await writeFile(
    //   path.join(config.outputDir, "trainer_parties.json"),
    //   prettyPrint(trainerParties)
    // );
    await writeFile(
      path.join(config.outputDir, "trainers_flat.json"),
      prettyPrint(trainersFlat)
    );

    // Find and log mart sections
    const martSections = await findMartSectionsByLevel(config.mapsDir);

    // Find and log give items by level
    const scriptedGives = await findGiveItemsByLevel(
      config.mapsDir,
      config.miscScriptsDir
    );

    // Parse map events
    const mapEvents = await main(config.mapsDir);

    // Merge all data in memory
    const { groupedData, groupedTrainers } = await mergeDataByLevelsID({
      martsData: martSections,
      mapsData: scriptedGives,
      pickupItemsAndTrainers: mapEvents,
      trainersFlat,
      encountersMap,
    });
    // console.log(sset.values());
    const [existingTrainers, existingLevels] = await Promise.all([
      readFile(path.join(process.cwd(), "trainers.json"), "utf8").then(
        (data) => JSON.parse(data) as Record<string, Trainer[]>
      ),
      readFile(path.join(process.cwd(), "levels.json"), "utf8").then(
        (data) => JSON.parse(data) as Record<string, any[]>
      ),
    ]).catch((error) => {
      throw error;
    });
    // Compare with existing data before writing new files
    await compareDataChanges({
      existingLevels,
      existingTrainers,
      newGroupedTrainers: groupedTrainers,
      newGroupedData: groupedData,
    }).then(async () => {
      // Write output files
      await writeFile("levels.json", prettyPrint(groupedData));
      await writeFile("trainers.json", prettyPrint(groupedTrainers));
    });

    logger.info("Merged data written to levels.json and trainers.json");
    logger.info("Validating...");
  } catch (error) {
    throw error;
    logger.error("Error:", error);
  }
})().catch((error) => {
  console.error("Unhandled error in main execution:", error);
  logger.error("Unhandled error in main execution:", error);
});
