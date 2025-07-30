import { z } from "zod";

export const MapEventTrainerSchema = z.object({
  coords: z.tuple([z.number(), z.number()]),
  script: z.string(),
  graphics_id: z.string().optional(),
});

export const MapEventPickupSchema = z.object({
  coords: z.tuple([z.number(), z.number()]),
  item: z.string(),
  type: z.union([z.literal("object_event"), z.literal("hidden_item")]),
});

export const MapEventPlaceSchema = z.object({
  thisLevelsId: z.string(),
  baseMap: z.string(),
  levelLabel: z.string(),
  imageName: z.string(),
  trainers: z.array(MapEventTrainerSchema).optional(),
  pickupItems: z.array(MapEventPickupSchema).optional(),
});

export type MapEventTrainer = z.infer<typeof MapEventTrainerSchema>;
export type MapEventPickup = z.infer<typeof MapEventPickupSchema>;
export type MapEventPlace = z.infer<typeof MapEventPlaceSchema>; 