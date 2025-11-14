import path from "path";
import { mkdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";

import findGiveItemsByLevel, { LevelIncData } from "./parseMaps/index.ts";
import parseMapEvents from "./parseMaps/overworld/parseMapEvents.ts";
// import { extractTrainers } from "./parseMaps/Trainers/extractTrainersFromHeaderFile.ts";
//

import { MapEventPlace, Mart, TrainerStruct } from "./validators/index.ts";
import { logger } from "./util/logger.ts";

import { config } from "./config/index.js";
import { IncScriptEvent } from "./parseMaps/incParser.ts";

// import mergeTrainers from "./mergeTrainerData.ts";

/**
 * Combined trainer data from maps.json and trainers_flat.json
 */
interface Trainer {
  id: string;
  battlePic: string;
  sprite?: string;
  aiFlags: [string];
  name: string;
  items: string[];
  /** ID of the level this trainer appears on */
  level: string;
  party: any[]; // Define more specific type if possible
}

interface MergedData {
  thisLevelsId: string;
  baseMap: string;
  levelLabel: string;
  shopItems: Mart[];
  pickupItems: any[]; // Define more specific type if possible
  scriptedGives: IncScriptEvent[];
  image: string;
  // trainers?: Trainer[];
  trainerRefs: TrainerStruct[];
}

type GroupedData = Record<string, MergedData[]>;

// Insert a new helper type that omits trainers when preparing grouped output

interface MergeDataParams {
  mapsData: LevelIncData[];
  pickupItemsAndTrainers: MapEventPlace[];
  /** Data from `trainers_flat */
  // trainersFlat: Record<string, TrainerStruct>;
  encountersMap: Map<string, any>;
}

const prettyPrint = (data: any): string => JSON.stringify(data, null, 2);

const mergeDataByLevelsID = async ({
  mapsData,
  pickupItemsAndTrainers,
  encountersMap,
}: MergeDataParams) => {
  const mergedData: MergedData[] = mapsData
    .map((mapEntry) => {
      const { thisLevelsId } = mapEntry;
      const hasEncountersThereforNeeded = encountersMap.has(thisLevelsId);

      // Things found in `map.json`
      const pickupEntry = pickupItemsAndTrainers.find(
        (pickup) => pickup.thisLevelsId === thisLevelsId
      );

      if (!mapEntry || !pickupEntry) {
        logger.warn(`Missing data for thisLevelsId: ${thisLevelsId}`);
        return null; // Return null to be filtered out later
      }
      mapEntry.trainerRefs.forEach((tr, index, arr) => {
        const pickupTrainer = pickupEntry.trainers?.find(
          (pt) => pt.script === tr.script
        );
        if (pickupTrainer) {
          //@ts-ignore
          arr[index]["sprite"] = pickupTrainer.graphics_id;
        } else {
          console.error(
            "Trainer in poryscript not corresponding to any trainer in pickup data: " +
              tr.script
          );
        }
      });
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

      /** filter out battles with same ID. Generally these get in here
       * because of double battles. When there are duplicates, prioritize keeping
       * the one with rematch: true but preserve sprite from original
       */

      // for (const tr of trainersAlsoInMapJson) {
      //   const existing = seen.get(tr.id);
      //   if (!existing) {
      //     // First time seeing this ID, keep it
      //     seen.set(tr.id, tr);
      //   } else if (tr.rematch && !existing.rematch) {
      //     // Replace the existing trainer if current one has rematch: true
      //     // but preserve the sprite from the original (non-rematch) version
      //     const updatedTrainer = {
      //       ...tr,
      //       sprite: existing.sprite || tr.sprite, // Keep original sprite if it exists
      //     };
      //     seen.set(tr.id, updatedTrainer);
      //   } else if (!tr.rematch && existing.rematch) {
      //     // If we encounter a non-rematch after a rematch, update the rematch trainer
      //     // to have rematch: true but use the sprite from the non-rematch version
      //     const updatedTrainer = {
      //       ...existing,
      //       sprite: tr.sprite || existing.sprite, // Use the non-rematch sprite
      //     };
      //     seen.set(tr.id, updatedTrainer);
      //   }
      //   // Otherwise, keep the existing one (don't replace)
      // }

      const result = {
        thisLevelsId: mapEntry.thisLevelsId,
        baseMap: mapEntry.baseMap,
        levelLabel: mapEntry.levelLabel,
        shopItems: mapEntry.marts,
        pickupItems: pickupEntry.pickupItems || [],
        scriptedGives: mapEntry.scriptedGives || [],
        image: pickupEntry.imageName,
        trainerRefs: mapEntry.trainerRefs,
      };

      // Filter out places that don't have any meaningful content
      // like the Battle Frontier...
      const hasShopItems = result.shopItems && result.shopItems.length > 0;
      const hasPickupItems =
        result.pickupItems && result.pickupItems.length > 0;
      const hasTrainerRefs =
        result.trainerRefs && result.trainerRefs.length > 0;

      const hasScriptedGives = result.scriptedGives.length > 0;
      if (
        !hasShopItems &&
        !hasPickupItems &&
        !hasTrainerRefs &&
        !hasEncountersThereforNeeded &&
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

  const dedupeTrainersByIdAndLevel = (trainers: Trainer[]): Trainer[] => {
    const seen = new Map<string, Trainer>();
    for (const trainer of trainers) {
      const key = `${trainer.id}|${trainer.level}`;
      const existing = seen.get(key);
      if (!existing) {
        seen.set(key, trainer);
        continue;
      }
      const merged: Trainer = {
        ...existing,
        ...trainer,
        sprite: trainer.sprite ?? existing.sprite,
        battlePic: trainer.battlePic ?? existing.battlePic,
      };
      seen.set(key, merged);
    }
    return Array.from(seen.values());
  };

  const groupedTrainers = await readFile(
    path.join(config.dataDir, "trainers.json"),
    "utf8"
  ).then((data) => {
    const trainers = JSON.parse(data);
    const groupedTrainers: Record<string, Trainer[]> = {};
    for (const [mapName, levelData] of Object.entries(groupedData)) {
      debugger;

      const thisMapsTrainersForAllLevels = levelData
        .flatMap(({ trainerRefs, thisLevelsId }) => {
          if (!trainerRefs) return [];
          /* Go through levels, grab trainers from `trainers.json`, 
            assign mapName as key in `trainersOnMapDictionary`, put
            trainerJson data into array in there. */

          return trainerRefs.map((incTrainer) => {
            const trainerJsonData = trainers.find(
              (tr: any) => tr.id === incTrainer.id
            );
            if (!trainerJsonData) {
              throw `Trainer ID ${incTrainer.id} from map ${mapName} not found in trainers.json`;
            }
            // Get their overworld sprite from pickup data
            const pickupData = pickupItemsAndTrainers.find(
              (level) => level.baseMap === mapName
            );
            if (!pickupData) throw "No pickup data for map " + mapName;

            // Get their party data from trainers.json
            const trainerData = trainers.find(
              (tr: any) => tr.id === incTrainer.id
            );
            const toReturn = {
              // Appending to their map data
              battlePic: incTrainer.battlePicPath,
              id: trainerJsonData.id,
              name: trainerJsonData.name,
              sprite: pickupData.trainers?.find(
                (t) => t.script === incTrainer.script
              )?.graphics_id,
              aiFlags: trainerJsonData.aiFlags,
              items: trainerJsonData.items,
              // script: incTrainer.script,
              level: thisLevelsId,
              party: trainerData.party,
            } as Trainer;
            delete incTrainer.battlePicPath;
            delete incTrainer.rematch;
            return toReturn;
          });
        })
        .filter(Boolean) as Trainer[];
      /* Now that we have the trainers on this Map, we create the object that will be 
`trainers.json` */
      const dedupedTrainers = dedupeTrainersByIdAndLevel(
        thisMapsTrainersForAllLevels
      );

      if (dedupedTrainers.length > 0) {
        groupedTrainers[mapName] = dedupedTrainers;
      }
    }
    return groupedTrainers;
  });

  /** Here we match up trainers from the .inc/.pory file
   * with trainers from the header/party file.
   * Their overworld sprite graphic is already on the pickup entry.
   * */
  // for (const [index, incTrainer] of mapEntry.trainerRefs.entries()) {
  //   // This is their battle data
  //   const trainerJsonData = TrainersFromJsonMap.get(incTrainer.id);
  //   if (!trainerJsonData) {
  //     logger.warn(
  //       `Trainer ID ${incTrainer.id} from map ${thisLevelsId} not found in trainers.json`
  //     );
  //     return null;
  //   }
  //   // We need to append thei
  //   mapEntry.trainerRefs[index] = {
  //     // Appending to their map data
  //     sprite: pickupItemsAndTrainers
  //       .find((level) => level.thisLevelsId === thisLevelsId)
  //       ?.trainers?.find((tr) => tr.script === incTrainer.script)?.graphics_id,
  //     ...trainerJsonData,
  //     ...incTrainer,
  //   };
  // }
  // Create dictionary of BASE_MAPs with trainer objects
  // This will become `trainers.json`
  // for (const [map, levels] of Object.entries(groupedData)) {
  // const trainersOnMap = levels.flatMap((lvl) => lvl.trainerRefs || []);
  // if (trainersOnMap.length) {
  //   trainersOnMapDictionary[map] = Object.values(TrainersFromJsonMap).map(
  //     (tr) => {
  //       if (trainersOnMap.find((t) => t.id === tr.id)) {
  //         return {
  //           ...tr,
  //           sprite: trainersOnMap.find((t) => t.id === tr.id)?.sprite,
  //           level:
  //             levels.find((lvl) =>
  //               lvl.trainerRefs?.some((t) => t.id === tr.id)
  //             )?.thisLevelsId || "",
  //         };
  //       }
  //     }
  //   );
  // }
  // }

  // Strip `trainers` before returning groupedData
  // This will be `levels.json`
  const groupedDataForOutput: Record<string, any> = {};
  for (const [base, levels] of Object.entries(groupedData)) {
    groupedDataForOutput[base] = levels.map(
      // ({÷ trainers: _t, ...rest }) => rest,
      ({ ...rest }) => rest
    );
  }

  return {
    groupedData: groupedDataForOutput,
    groupedTrainers,
  };
};

(async () => {
  try {
    // const rootDir = process.cwd();
    // const directoryPath = path.join(rootDir, "maps");

    // if (!directoryPath) {
    //   console.error("Usage: ts-node main.ts <directory-path>");
    //   process.exit(1);
    // }

    const encountersData = JSON.parse(
      await readFile(path.join(config.dataDir, "wild_encounters.json"), "utf8")
    )["wild_encounter_groups"][0]["encounters"];
    const encountersMap = new Map<string, any>(
      encountersData.map((enc: any) => [enc.map, enc])
    );
    // --- Trainer & party extraction ----------------------------------
    // const trainerParties = await readFile(
    //   path.join(config.dataDir, "trainer_parties.json"),
    //   "utf8"
    // ).then(JSON.parse);
    // new scriptedGive format already has the path to the battle pic
    // const trainersFlat: Record<string, TrainerStruct> = extractTrainers(
    //   config.dataDir,
    //   trainerParties,
    //   config.dataDir,
    //   config.outputDir
    // );
    // console.log(trainersFlat)
    // Ensure output directory exists
    mkdirSync(path.join(config.outputDir), { recursive: true });

    // await writeFile(
    //   path.join(config.outputDir, "trainers_flat.json"),
    //   prettyPrint(trainersFlat),
    // );

    // Find and log mart sections

    // Find and log give items by level
    const scriptedGives = await findGiveItemsByLevel(
      config.mapsDir,
      config.miscScriptsDir
    );

    // Parse map events
    const mapEvents = await parseMapEvents(config.mapsDir);

    // Merge all data in memory
    const { groupedData, groupedTrainers } = await mergeDataByLevelsID({
      mapsData: scriptedGives,
      pickupItemsAndTrainers: mapEvents,

      encountersMap,
    });

    await writeFile("levels.json", prettyPrint(groupedData));
    await writeFile("trainers.json", prettyPrint(groupedTrainers));

    logger.info("Merged data written to levels.json and trainers.json");
    logger.info("Validating...");
  } catch (error) {
    throw error;
  }
})().catch((error) => {
  console.error("Unhandled error in main execution:", error);
  logger.error("Unhandled error in main execution:", error);
});
