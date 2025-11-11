// map.json has the overworld sprite name
// script.pory has the const name of the trainer party
// trainer_graphics.json has mapping from both to the actual sprite file
import { z } from "zod";
import { existsSync,  writeFileSync } from "fs";
import { resolve } from "path";
import trainerGraphicsData from "../../gameData/trainer_graphics.json" with { type: "json" };

import { PaletteApplier } from "../newSpriteGenerator/PaletteApplier.ts";
import { config } from "../config/index.js";
/* This will build into `trainers.json`
This has the trainer overworld_sprite as a path to the PNG, 
and the in-battle sprite path as a PNG, palette applied.
*/
type TrainerName = string;
type TrainerFPicPath = string; // file path to in-battle sprite
/* Object Event schema prob shouldn't go here
but vibin... */
/** === MARK: Schemas === */

const TrainerGraphicsSchema = z
  .object({
    trainerClass: z.string(),
    pic: z.string(),
    frontPic: z.string(),
    palette: z.string(),
  })
  .refine(
    (data) => {
      /* Check that all images exist */
      const baseDir = process.cwd();
      const frontPicRealPath = data.frontPic.replace(/(.*?)\.4bpp\.smol/, "$1.png");

      if (!existsSync(resolve(baseDir, frontPicRealPath))) return false;
      if (!existsSync(resolve(baseDir, data.palette))) return false;
      return true;
    },
    { message: "One or more file paths do not exist" }
  );

/** === MARK: - Code  */
(async () => {
  /* Goal is to output a JSON file with data:
    {
        trainerId: { 
            overworldSprite: string; // path to PNG
            inBattleSprite: string;  // path to PNG with palette applied
        }
    }
        To do this, we run `PaletteApplier.applyPaletteFromFiles` on each in-battle sprite with its palette,
    */
  const validTrainerGraphics = Object.entries(trainerGraphicsData).map(
    ([name, graphicData]) => {
      TrainerGraphicsSchema.parse(graphicData);
      return { name, ...graphicData };
    }
  );

  // Same for objectevents

  const paletteApplier = new PaletteApplier({ config: config });
  const trainers = []
  // 1. Map through `validTrainerGraphics`, applying trainer palette to it's sprite
  // `TrainersWithPngPaths[overworldSprite] will still be undefined when it leaves this loop`
  for await (const trainerGraphic of validTrainerGraphics) {
    const trainerData: Record<TrainerName, TrainerFPicPath> = {};
    const { frontPic, palette } = trainerGraphic;
    const frontPicRealPath = frontPic.replace(/(.*?)\.4bpp\.smol/, "$1.png");
    const inBattleSpriteBuffer = paletteApplier.applyPaletteFromFiles(
      frontPicRealPath,
      palette
    );

    try {
      /* TRAINER_TOSHIKO: "path/to/generated/png" */
      trainerData[trainerGraphic.name] = await paletteApplier.writePng(
        "trainers",
        `${trainerGraphic.name}.png`,
        inBattleSpriteBuffer
      );
    } catch (error) {
      throw new Error(
        `Failed to write in-battle sprite for ${trainerGraphic.name}: ${error}`
      );
    }
    trainers.push(trainerData);
  }
  writeFileSync("trainersFrontPics.json", JSON.stringify(trainers, null, 2));
})();
