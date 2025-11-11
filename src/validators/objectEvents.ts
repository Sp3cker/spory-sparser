import { existsSync } from "fs";
import { resolve } from "path";
import z from "zod";

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
