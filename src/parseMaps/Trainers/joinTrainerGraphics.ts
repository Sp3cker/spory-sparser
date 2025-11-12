// map.json has the overworld sprite name
// script.pory has the const name of the trainer party
// trainer_graphics.json has mapping from both to the actual sprite file
import { existsSync, readFileSync } from "fs";
import path, { resolve } from "path";
import { z } from "zod";

import { PaletteApplier } from "../../newSpriteGenerator/PaletteApplier/PaletteApplier.ts";
import type { Config } from "../../config/index.ts";
/*

This is ran on-import in `trainerInc.ts` 

It returns a Map of trainer overworld_sprite as a path to the PNG,
and the in-battle sprite path as a PNG, palette applied.
*/

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
      const frontPicRealPath = data.frontPic.replace(
        /(.*?)\.4bpp\.smol/,
        "$1.png"
      );

      if (!existsSync(resolve(baseDir, frontPicRealPath))) return false;
      if (!existsSync(resolve(baseDir, data.palette))) return false;
      return true;
    },
    { message: "One or more file paths do not exist" }
  );

/** === MARK: - Code  */
/* Returns the trainer ID mapped to in-battle sprite PNG path */
export default async (config: Config) => {
  const trainerGraphicsPath = path.resolve(
    `${config.dataDir}/trainer_graphics.json`
  );
  const trainerGraphicsData = JSON.parse(
    readFileSync(trainerGraphicsPath, "utf-8")
  );

  /*
  Create palette-applied PNG of battle pic, run `PaletteApplier.applyPaletteFromFiles` on each in-battle sprite with its palette,
    */
  const validTrainerGraphics = Object.entries(trainerGraphicsData).map(
    ([name, graphicData]) => {
      TrainerGraphicsSchema.parse(graphicData);
      return {
        name,
        ...(graphicData as z.infer<typeof TrainerGraphicsSchema>),
      };
    }
  );

  const paletteApplier = new PaletteApplier({ config: config });
  const trainersWithBattlePath = new Map<string, string>();
  // 1. Map through `validTrainerGraphics`, applying trainer palette to it's sprite
  for await (const trainerGraphic of validTrainerGraphics) {
    const { frontPic, palette } = trainerGraphic;
    const frontPicRealPath = frontPic.replace(/(.*?)\.4bpp\.smol/, "$1.png");
    const inBattleSpriteBuffer = paletteApplier.applyPaletteFromFiles(
      frontPicRealPath,
      palette
    );

    try {
      /* TRAINER_TOSHIKO: "path/to/generated/png" */
      // Mashalah this is bad...
      trainersWithBattlePath.set(
        trainerGraphic.name,
        await paletteApplier.writePng(
          "trainers",
          `${trainerGraphic.name}.png`,
          inBattleSpriteBuffer
        )
      );
    } catch (error) {
      throw new Error(
        `Failed to write in-battle sprite for ${trainerGraphic.name}: ${error}`
      );
    }
  }
  return trainersWithBattlePath;
  // writeFileSync("trainersFrontPics.json", JSON.stringify(trainers, null, 2));
};
