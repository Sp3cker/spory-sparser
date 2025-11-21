/**
 * Some trainers use overworld sprites that cannot be derived automatically from
 * the mugshot metadata. List those overrides here so parser consumers receive
 * consistent data. Add entries as `"TRAINER_ID": "OBJ_EVENT_GFX_..."`.
 */
const TRAINER_MUGSHOT_OVERRIDES: Record<string, string> = {
  // Example:
  // TRAINER_ELITE_FOUR_WALLACE: "OBJ_EVENT_GFX_CHAMPION_WALLACE",
};

export const getMugshotOverrideForTrainer = (trainerId: string) =>
  TRAINER_MUGSHOT_OVERRIDES[trainerId];

