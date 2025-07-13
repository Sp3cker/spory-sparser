import * as fs from "fs";
import * as path from "path";
const hardRules: Record<string, string> = {
  FortreeCity_CreatorHouse_EventScript_BattleIriv24: "maniac.webp",
  FortreeCity_CreatorHouse_EventScript_BattleCap: "man_4.webp",
  SkyPillar_Top_EventScript_Drake: "drake.webp",
  VictoryRoad_1F_EventScript_WallyEntranceBattle: "wally.webp",
  PetalburgWoods_EventScript_BattleGardenia2: "gardenia.webp",
  PetalburgWoods_EventScript_DevonResearcherLeft: "aqua_member_m.webp",
  PetalburgCity_Gym_EventScript_NormanBattle: "norman.webp",
  EverGrandeCity_GlaciasRoom_EventScript_BattleGlacia1: "glacia.webp",
  EverGrandeCity_PhoebesRoom_EventScript_BattlePhoebe1: "phoebe.webp",
  EverGrandeCity_SidneysRoom_EventScript_BattleSidney1: "sidney.webp",
  EverGrandeCity_WallacesRoom_EventScript_BattleWallace1: "wallace.webp",
  EverGrandeCity_StevensRoom_EventScript_BattleSteven1: "steven.webp",
  VerdanturfTown_EventScript_BattleUrsula: "phoebe.webp", // ok
  EverGrandeCity_ChampionsRoom_EventScript_Wallace: "wallace.webp",
  MagmaHideout_EventScript_BackToBackScene: "magma_member_f.webp",
  SeafloorCavern_EventScript_BackToBackScene: "aqua_member_m.webp",
  SlateportCity_OceanicMuseum_2F_EventScript_CaptStern: "aqua_member_m.webp",
  MossdeepCity_BetaTesterHouse_EventScript_BattleDollaMike: "man_4.webp",
  MossdeepCity_BetaTesterHouse_EventScript_BattleSunbird: "woman_4.webp",
  MossdeepCity_BetaTesterHouse_EventScript_BattleSuneal: "scientist_1.webp",
  SootopolisCity_ChampHouse_EventScript_Danni: "woman_5.webp",
  SootopolisCity_ChampHouse_EventScript_MastaJanes: "scientist_1.webp",
  SootopolisCity_ChampHouse_EventScript_Befools: "psychic_m.webp",
  SootopolisCity_House5_EventScript_OblivionWing: "man_5.webp",
  SootopolisCity_House5_EventScript_MasterPoucine: "man_4.webp",
  SootopolisCity_House5_EventScript_Natn: "man_3.webp",
};
const testImageExists = (spriteFileName: string): string | undefined => {
  const upscaledPeoplePath = path.join(
    process.cwd(),
    "upscaled",
    "people",
    spriteFileName
  );
  if (fs.existsSync(upscaledPeoplePath)) {
    return spriteFileName;
  }
  return undefined;
};
/**
 * Gets the graphics_id for a trainer from their script by reading the corresponding map.json file.
 * This is used to find sprites for trainers with TRAINER_TYPE_NONE that don't get their graphics_id
 * recorded in the normal parsing flow.
 *
 * @param script - The trainer's script name (e.g., "PetalburgCity_Gym_EventScript_Norman")
 * @param mapsBasePath - Path to the maps directory (usually "maps" or "1.3")
 * @returns The graphics_id if found, otherwise a fallback sprite filename
 */
export function generateSpriteFromScript(
  script: string,
  mapsBasePath: string
): string | undefined {
  if (!script) return undefined;

  // Check hardcoded rules first
  if (hardRules[script]) {
    return hardRules[script];
  }
  if (script.includes("DawnRivalBattle")) {
    return "dawn.webp";
  }
  // Extract trainer name from script and convert to PNG filename
  // Returns filename if it exists in upscaled/people, otherwise undefined
  const generateFallbackSprite = (scriptName: string): string | undefined => {
    // Extract the last part after the last underscore
    const parts = scriptName.split("_");
    let lastPart = parts[parts.length - 1];

    /** SootopolisCity_House5_EventScript_BattleNatn -> BattleNatn -> Natn*/
    if (lastPart.startsWith("Battle")) {
      lastPart = lastPart.substring(6); // Remove "Battle"
    }

    // Remove trailing numbers
    lastPart = lastPart.replace(/\d+$/, "");

    const pngFilename = lastPart.toLowerCase() + ".webp";

    // Check if the file exists in upscaled/people directory
    return testImageExists(pngFilename);

    // File doesn't exist, return undefined so calling code can use battlePic
  };

  // Check for rival battles (Treecko, Mudkip, Torchic)
  const rivalStarters = ["Treecko", "Mudkip", "Torchic"];
  const isRivalBattle = rivalStarters.some((starter) =>
    script.endsWith(starter)
  );

  if (isRivalBattle) {
    // For rival battles, return may.webp or brendan.webp based on script name
    if (script.includes("May")) {
      //   console.log(`Rival battle detected for ${script}: returning may.webp`);
      return "may.webp";
    } else if (script.includes("Brendan")) {
      //   console.log(`Rival battle detected for ${script}: returning brendan.webp`);
      return "brendan.webp";
    }
    // Fallback for other rival battles
    return "may.webp";
  }

  try {
    // Extract the map folder name from the script
    // Script format is usually: "{MapFolder}_EventScript_{TrainerName}"
    const eventScriptIndex = script.indexOf("_EventScript_");
    if (eventScriptIndex === -1) {
      // If no _EventScript_ pattern, use fallback
      return generateFallbackSprite(script);
    }

    const mapFolderName = script.substring(0, eventScriptIndex);
    const mapJsonPath = path.join(mapsBasePath, mapFolderName, "map.json");

    // Check if the map.json file exists
    if (!fs.existsSync(mapJsonPath)) {
      console.warn(`Map file not found: ${mapJsonPath}, using fallback sprite`);
      return generateFallbackSprite(script);
    }

    // Read and parse the map.json file
    const mapData = JSON.parse(fs.readFileSync(mapJsonPath, "utf8"));

    // Find the object_event with matching script
    const objectEvents = mapData.object_events;
    let scriptNameToObjEventMatch = objectEvents.find(
      (event: any) => event.script === script
    );

    // Plan B: If not found and script contains "Battle", try removing "Battle" and searching again
    if (!scriptNameToObjEventMatch && script.includes("Battle")) {
      // Create a modified script name by removing "Battle" from the last part
      const parts = script.split("_");
      const lastPart = parts[parts.length - 1];
      if (lastPart.startsWith("Battle")) {
        const modifiedLastPart = lastPart.substring(6); // Remove "Battle"
        const modifiedScript =
          parts.slice(0, -1).join("_") + "_" + modifiedLastPart;

        scriptNameToObjEventMatch = objectEvents.find(
          (event: any) => event.script === modifiedScript
        );
      }
    }

    if (scriptNameToObjEventMatch && scriptNameToObjEventMatch.graphics_id) {
      const graphics_id =
        scriptNameToObjEventMatch.graphics_id
          .split("_")
          .slice(-1)[0]
          .toLowerCase() + ".webp";

      return testImageExists(graphics_id);
    }

    return generateFallbackSprite(script);
  } catch (error) {
    console.error(`Error reading map data for script ${script}:`, error);
    return generateFallbackSprite(script);
  }
}
