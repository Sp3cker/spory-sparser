//@ts-nocheck
import { IncScriptEvent } from "../validators/levelIncData.ts";
const mapp: Record<string, string> = {
  Route123_BerryMastersHouse_EventScript_Give: "Received as daily berry",
};
/**
 * Take the scripted gives for an inc file and
 * explains them. For when there's several scripts that do
 * the same thing, just branched to.
 *
 * @param scriptedGives
 */
const bulkExplanations = (
  thisLevelsId: string,
  scriptedGives: IncScriptEvent[]
) => {
  for (const giveevent of scriptedGives) {
    if (thisLevelsId === "MAP_NEW_BIRCHS_LAB") {
      if (!giveevent.explanation) {
        giveevent.explanation = "Choose a starter";
      }
    }
    if (giveevent.scriptName.includes("SeashoreHouse")) {
      giveevent.explanation = "Defeat trainers in Seashore House";
    }
    if (giveevent.explanation) {
      continue;
    }
  }
};
