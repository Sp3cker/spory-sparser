// // We have to collect the overworld sprite and
// // in-battle sprite for each trainer.
// // This file will take `trainer_graphics.json`, which is just
// // the battle sprite, and export a Map of trainer IDs to
// // the overworld sprite.
// import path from "path";
// import { config } from "../../configReader.ts";
// import { readFileSync } from "fs";
// const trainerGraphicsJSONPath = path.join(config.dataDir, "trainer_graphics.json");
// const trainerGraphicsImgsPath = path.join(config.trainerFrontPicsDir);
// const trainerGraphicsData: Record<string, string> = JSON.parse(
//   readFileSync(trainerGraphicsPath, "utf8")
// );

// export const trainerIdToBattleSprite = new Map<string, string>();
// for (const [trainerId, battleSprite] of Object.entries(trainerGraphicsData)) {
//     const testIfSpriteExists = path.join(t
//   trainerIdToBattleSprite.set(trainerId, battleSprite);
// }
