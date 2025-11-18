import { z } from "zod";
import { BattleTypeSchema } from "./battleRecord.ts";

export const WildMonSchema = z.object({
  script: z.string(),
  species: z.string(),
  level: z.number(),
  id: z.number(),
});
/**
This is a trainerbattle we find in an .inc file.
 */
export const IncTrainerSchema = z.object({
  id: z.string(),
  script: z.string(),
  rematch: z.boolean().optional(),
  battlePicPath: z.string(),
});

/**
This is a battle trigger we find in an .inc/.pory file.
Represents a battle event with one or more trainers.
 */
export const IncBattleSchema = z.object({
  script: z.string(),
  battleType: BattleTypeSchema,
  trainerIds: z.array(z.string()).min(1),
  battlePicPaths: z.array(z.string()).min(1),
  rematch: z.boolean().optional(),
});
/** Item given to player in .inc file */
export const IncItemEntrySchema = z.object({
  constantName: z.string(),
  quantity: z.number(),
});
/** Pokemon species given to player
 * Part of the `IncFileParser` class.
 */
export const IncPokemonEntrySchema = z.object({
  species: z.string(),
  id: z.number(),
  level: z.number(),
  isRandom: z.boolean().optional(), // if `givemonrandom`
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
export const MartSchema = z.object({
  label: z.string(),
  items: z.array(z.string()),
});
export const IncDataSchema = z.object({
  scriptedGives: z.array(IncScriptedEventSchema),
  trainerRefs: z.array(IncTrainerSchema),
  battleRefs: z.array(IncBattleSchema).optional(),
  marts: z.array(MartSchema).optional(),
});

export const LevelIncDataSchema = IncDataSchema.extend({
  levelLabel: z.string(),
  baseMap: z.string(),
  thisLevelsId: z.string(),
});

export type IncTrainer = z.infer<typeof IncTrainerSchema>;
export type IncBattle = z.infer<typeof IncBattleSchema>;
export type IncTrainerAndEventData = z.infer<typeof IncDataSchema>;
export type LevelIncData = z.infer<typeof LevelIncDataSchema>;

export type IncScriptEvent = z.infer<typeof IncScriptedEventSchema>;
export type IncItemEntry = z.infer<typeof IncItemEntrySchema>;
export type IncPokemonEntry = z.infer<typeof IncPokemonEntrySchema>;
export type IncWildMon = z.infer<typeof WildMonSchema>;
export type Mart = z.infer<typeof MartSchema>;