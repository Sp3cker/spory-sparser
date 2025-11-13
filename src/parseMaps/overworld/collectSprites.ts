import { existsSync, readFileSync } from "fs";
import path, { resolve } from "path";
import z from "zod";
import { config } from "../../config/index.js";
// import { CharacterSpriteProcessor } from "../../newSpriteGenerator/CharacterSpriteProcessor.ts";

/*
// import type { Config } from "../../config/configReader.ts";
*/
type OverworldID = string;
export const ObjectEventGraphicSchema = z
  .object({
    sprites: z.array(z.string()),
    palette: z.string(),
  })
  .refine(
    (data) => {
      /* Check that all images exist */
      const baseDir = process.cwd();

      // Check all sprite files exist
      /* TODO: Put these into an array and Promise.all access async */
      const spriteChecks = data.sprites.map((sprite) =>
        existsSync(resolve(baseDir, sprite))
      );
      if (spriteChecks.some((exists) => !exists)) return false;

      // Check palette file exists
      if (!existsSync(resolve(baseDir, data.palette))) return false;

      return true;
    },
    { message: "One or more file paths do not exist" }
  );

export default async () => {
  const _graphics_json = "object_event_graphics.json";
  const overworldGraphicsPath = path.resolve(
    `${config.dataDir}/${_graphics_json}`
  );
  const trainerGraphicsData = JSON.parse(
    readFileSync(overworldGraphicsPath, "utf-8")
  );
  /*
 Original object is [name: string]: { sprites: string[]; palette: string }
Turns into array of { name: string; sprites: string[]; palette: string }
    */
  const validOverworldGraphics = Object.entries(trainerGraphicsData).map(
    ([name, graphicData]) => {
      try {
        ObjectEventGraphicSchema.parse(graphicData);

        return {
          name,
          ...(graphicData as z.infer<typeof ObjectEventGraphicSchema>),
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(`Validation failed for object: ${name}`);
          console.error(error.errors);
        }
        throw error;
      }
    }
  );

  const overworldGraphicPath = new Map<OverworldID, string>();
  for await (const graphic of validOverworldGraphics) {
    const { name, sprites } = graphic;
    if (sprites.length === 0) {
      console.warn(
        `Skipping overworld graphic ${name} due to no sprites defined.`
      );
      continue;
    }
    overworldGraphicPath.set(name, `overworld/animated/${name}.webp`);

    // Below needs to run if you're not doign the sprite pipelines
    // try {
    //   const buffer = paletteApplier.applyPaletteFromFiles(
    //     sprites[0].replace(/(.*?)\.4bpp/, "$1.png"),
    //     palette
    //   );
    //   const pngPath = await paletteApplier.writePng(
    //     outFolder,
    //     `${name}.png`,
    //     buffer
    //   );
    //   console.log(pngPath)
    // } catch (error) {
    //   throw new Error(
    //     `Failed to process overworld sprite for ${name}: ${
    //       (error as Error).message
    //     }`
    //   );
    // }
  }
  return overworldGraphicPath;
  /* Uncomment this if you want to process animated sprites as well */
  // const animatedOutfolder = "overworld/animated";
  // const spriteProcessor = new CharacterSpriteProcessor(outDir, animatedOutDir);
  // const outDir = path.resolve(config.outputDir, outFolder);
  // const animatedOutDir = path.resolve(config.outputDir, animatedOutfolder);

  // await spriteProcessor.processAllSprites();
};
