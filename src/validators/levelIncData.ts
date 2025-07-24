import { z } from "zod";
export const WildMonSchema = z.object({
  script: z.string(),
  species: z.string(),
  level: z.number(),
});
/**
This is a trainerbattle we find in an .inc file.
 */
export const IncTrainerSchema = z.object({
  id: z.string(),
  script: z.string(),
  rematch: z.boolean().optional(),
});
/** Item given to player in .inc file */
export const IncItemEntrySchema = z.object({
  name: z.string(),
  quantity: z.number(),
});
/** Pokemon species given to player
 * Part of the `IncFileParser` class.
 */
export const IncPokemonEntrySchema = z.object({
  species: z.string(),
  level: z.number(),
  isRandom: z.boolean(), // if `givemonrandom`
});
/** All events that happen in an inc file. */
export const AllIncEventsSchema = z.object({
  items: z.array(IncItemEntrySchema),
  pokemon: z.array(IncPokemonEntrySchema),
  wildMon: z.array(WildMonSchema),
  explanation: z.string(),
});

export const IncScriptedEventSchema = z.object({
  scriptName: z.string(),
  explanation: z.string().optional(),
  items: z.array(IncItemEntrySchema).optional(),
  pokemon: z.array(IncPokemonEntrySchema).optional(),
  wildMon: z.array(WildMonSchema).optional(),
});
export const IncDataSchema = z.object({
  scriptedGives: z.array(IncScriptedEventSchema),
  trainerRefs: z.array(IncTrainerSchema),
});

export const LevelIncDataSchema = IncDataSchema.extend({
  levelLabel: z.string(),
  baseMap: z.string(),
  thisLevelsId: z.string(),
});

export type IncTrainer = z.infer<typeof IncTrainerSchema>;
export type IncTrainerAndEventData = z.infer<typeof IncDataSchema>;
export type LevelIncData = z.infer<typeof LevelIncDataSchema>;

export type IncScriptEvent = z.infer<typeof IncScriptedEventSchema>;
export type IncItemEntry = z.infer<typeof IncItemEntrySchema>;
export type IncPokemonEntry = z.infer<typeof IncPokemonEntrySchema>;
export type IncWildMon = z.infer<typeof WildMonSchema>;
