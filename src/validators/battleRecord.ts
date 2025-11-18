import { z } from "zod";
import { PartyMonSchema } from "./partyMon.ts";

export const BattleTypeSchema = z.enum([
  "single",
  "double",
]);

export const TrainerMetadataSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  battlePic: z.string(),
  sprite: z.string().optional(),
  aiFlags: z.array(z.string()).optional(),
  items: z.array(z.string()).optional(),
});

export const BattlePartySchema = z.object({
  trainer: TrainerMetadataSchema,
  pokemon: z.array(PartyMonSchema),
});

export const BattleSchema = z.object({
  id: z.string(),
  battleType: BattleTypeSchema,
  parties: z.array(BattlePartySchema).min(1),
  level: z.string().optional(),
});

export type BattleType = z.infer<typeof BattleTypeSchema>;
export type TrainerMetadata = z.infer<typeof TrainerMetadataSchema>;
export type BattleParty = z.infer<typeof BattlePartySchema>;
export type Battle = z.infer<typeof BattleSchema>;
