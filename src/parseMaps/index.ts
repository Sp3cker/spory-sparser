import { Dirent, existsSync, readFileSync, readdirSync } from "fs";
import * as path from "path";
import { getLevelLabel, getBasemapID, getMapJsonId } from "../helpers.ts";
import { incParser, IncScriptEvent } from "./incParser.ts";
import {
  parseTrainerBattles,
  TrainerReference,
} from "./Trainers/trainerInc.ts";
import {
  LevelIncDataSchema,
  LevelIncData,
} from "../validators/levelIncData.js";

export const processIncFile = async (
  fullPath: string
): Promise<LevelIncData> => {
  try {
    const content = readFileSync(fullPath, "utf8");
    const scriptedGiveEvents = incParser(content);
    const trainerRefsRaw = parseTrainerBattles(content);

    // console.log(
    //   `[Debug] Output from poryParser for ${fullPath}:`,
    //   JSON.stringify(scriptedGiveEvents, null, 2)
    // );

    const pikachuSection = scriptedGiveEvents.find(
      (section) =>
        section.scriptName ===
        "MauvilleCity_PokemonCenter_1F_EventScript_CostumePikachuGive"
    );
    if (pikachuSection) {
      const species = [
        "SPECIES_PIKACHU_COSPLAY",
        "SPECIES_PIKACHU_ROCK_STAR",
        "SPECIES_PIKACHU_BELLE",
        "SPECIES_PIKACHU_POP_STAR",
        "SPECIES_PIKACHU_PHD",
        "SPECIES_PIKACHU_LIBRE",
        "SPECIES_PIKACHU_SURFING",
        "SPECIES_PIKACHU_FLYING",
      ];
      pikachuSection.pokemon = species.map((p) => ({
        species: p,
        level: 5,
        isRandom: true,
      }));
    }

    // if (scriptsWithoutExplanation.length > 0 ){
    //   throw "Unexplained Scripts!"
    // }

    const levelLabel = getLevelLabel(path.basename(path.dirname(fullPath)));
    const parentFolderPath = path.dirname(fullPath);
    const baseMap = await getBasemapID(parentFolderPath);
    const thisLevelsId = await getMapJsonId(
      path.join(parentFolderPath, "map.json")
    );

    const obj = {
      levelLabel,
      baseMap,
      thisLevelsId,
      scriptedGives: scriptedGiveEvents,
      trainerRefs: trainerRefsRaw.map((r) => ({
        id: r.id,
        script: r.script,
        rematch: r.rematch,
      })),
    };

    return LevelIncDataSchema.parse(obj);
  } catch (error) {
    console.error(`Error processing file ${fullPath}:`, error);
    throw new Error(`Error processing file ${fullPath}`);
  }
};

async function processDirectory(
  mapPath: string,
  folders: Dirent[]
): Promise<LevelIncData[]> {
  const results: LevelIncData[] = [];
  for (const folder of folders) {
    const fullPath = path.join(mapPath, folder.name, "scripts.inc");
    if (!existsSync(fullPath)) continue;
    try {
      const result = await processIncFile(fullPath);
      results.push(LevelIncDataSchema.parse(result));
    } catch (e) {
      console.error(`Failed to process directory for ${fullPath}:`, e);
    }
  }
  return results;
}

export async function findGiveItemsByLevel(
  mapsPath: string
): Promise<LevelIncData[]> {
  const folders = readdirSync(mapsPath, { withFileTypes: true }).filter(
    (entry) => entry.isDirectory()
  );
  const levels = await processDirectory(mapsPath, folders);
  return levels.map((level: LevelIncData) => {
    const obj = {
      baseMap: level.baseMap,
      levelLabel: level.levelLabel,
      thisLevelsId: level.thisLevelsId,

      scriptedGives: [] as IncScriptEvent[],

      trainerRefs: [] as TrainerReference[],
    };

    obj.scriptedGives = level.scriptedGives;
    obj.trainerRefs = level.trainerRefs;
    for (const giveevent of obj.scriptedGives) {
      if (level.thisLevelsId === "MAP_NEW_BIRCHS_LAB") {
        if (!giveevent.explanation) {
          giveevent.explanation = "Choose a starter";
        }
      }
      if (giveevent.explanation) {
        continue;
      }
      console.warn(
        `maps/${level.thisLevelsId}/scripts.inc ${giveevent.items
          .flatMap((i) => i.name)
          .join(",")}`
      );
    }
    return obj;
  }); /** map */
}

export { LevelIncData };
