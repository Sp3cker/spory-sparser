import { z } from "zod";

export const levelUpMoveSchema = z.tuple([
  z.number().int(), // move id
  z.number().int(), // learn level
]);

export const speciesEntrySchema = z.object({
  speciesId: z.number().int(),
  speciesName: z.string(),
  unknownName: z.string(),
  types: z
    .array(z.number().int())
    .min(0)
    .max(2),
  stats: z.tuple([
    z.number().int(),
    z.number().int(),
    z.number().int(),
    z.number().int(),
    z.number().int(),
    z.number().int(),
  ]),
  abilities: z.tuple([z.number().int(), z.number().int(), z.number().int()]),
  levelUpMoves: z.array(levelUpMoveSchema),
  tmMoves: z.array(z.number().int()),
  eggMoves: z.array(z.number().int()).nullable(),
  dexId: z.number().int(),
  evolutions: z
    .array(z.tuple([z.number().int(), z.number().int(), z.number().int()]))
    .nullable(), // set to nullable if some species omit evolutions entirely
  forms: z.unknown().nullable(), // refine if forms have a concrete shape
  formId: z.number().int(),
  nameKey: z.string(),
  baseForm: z.number().int(),
  isLegendary: z.boolean(),
  isMythic: z.boolean(),
  isUltraBeast: z.boolean(),
  frontPic: z.string(),
  backPic: z.string(),
  palette: z.string(),
  shinyPalette: z.string(),
  icon: z.string(),
});

export const speciesRecordSchema = z.record(z.string(), speciesEntrySchema);
export type SpeciesEntry = z.infer<typeof speciesEntrySchema>;
