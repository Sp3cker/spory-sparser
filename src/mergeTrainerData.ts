import path from "path";
import { getLevelLabel } from "./helpers.ts";
import { generateSpriteFromScript } from "./parseMaps/generateSpriteFromScript.ts";
import { TrainerStruct } from "./validators/trainerRecord.ts";
import { IncTrainer } from "./validators/levelIncData.ts";
import { MapEventPlace } from "./validators/mapEvent.ts";
import { logger } from "./util/logger.ts";

const mergeTrainers = (
  trainerFromInc: IncTrainer,
  trainersFlat: Record<string, TrainerStruct>,
  thisLevelsId: string,
  thisLevelsMapJson: MapEventPlace
) => {
  // We match up trainers using their name in the .inc file to their var name in the .h file
  // `trainersFlat` is data from the header file
  const trainerFromHeaderFile = trainersFlat[trainerFromInc.id];

  if (!trainerFromHeaderFile) {
    // There is a mismatch between header and inc files
    throw new Error(
      "Could not match up trainers between header and inc files" +
        ` for ${trainerFromInc.id} in ${thisLevelsId}`
    );
  }

  const trainerFromMapJson = thisLevelsMapJson.trainers?.find(
    (mapTrainer) => mapTrainer.script === trainerFromInc.script
  );
  if (!trainerFromMapJson) {
    // mapJson script might not line up
    // to the name of inc script that initiates battle
    // See `fortree creator house map.json` for good example.
    logger.warn(
      `Could not find trainer in map.json for script: ${trainerFromInc.script} in ${thisLevelsId}`
    );
    // return null; // Skip this trainer
  }
  // if (trainerFromHeaderFile.trainerName === "iriv24") {
  //   throw "foundn em";
  // }
  // const base = { ...rawBase }; // clone to avoid mutating source
  // const coord = coordMap.get(ref.script);
  /** if name is grunt and  last char of script is 1-9
   * We add the last number from maps.json.object_event.script
   *  to Grunt name to identify them, plus imply their order in level
   */
  const nameIsGrunt =
    trainerFromHeaderFile.trainerName === "Grunt" &&
    /\d$/.test(trainerFromInc.script);

  if (nameIsGrunt) {
    trainerFromHeaderFile.trainerName = `Grunt ${trainerFromInc.script.slice(
      -1
    )}`;
  }

  // If sprite is undefined, try to generate it from the script name
  let sprite = trainerFromMapJson?.graphics_id;
  // console.log(sprite, ref.script, coord);
  if (!sprite) {
    const mapsBasePath = path.join(process.cwd(), "maps");
    // The code for grabing the `graphics_id` doesn't work
    // for trainers that don't walk up to you when they see you
    // So any gym leader or optional trainer...
    sprite = generateSpriteFromScript(trainerFromInc.script, mapsBasePath);

    // If generateSpriteFromScript returns undefined (image doesn't exist),
    // use the trainer's battlePic as fallback
    if (!sprite) {
      sprite = trainerFromHeaderFile.battlePic;
    }
  }

  return {
    ...trainerFromHeaderFile,
    script: trainerFromInc.script,
    sprite: sprite,
    level: getLevelLabel(thisLevelsId),
    rematch: trainerFromHeaderFile.rematch ? true : undefined,
  };
};

export default mergeTrainers;
