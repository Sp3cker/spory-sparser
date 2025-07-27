// import { TrainerStruct } from "../validators/trainerRecord.ts";
// import fs from "fs";

// const mergeAdditionalParties = (
//   gameDataDir: string,
//   trainersFlat: Record<string, TrainerStruct>
// ) => {
//   const additionalPartiesFile = fs.readFileSync(
//     `${gameDataDir}/trainer_parties.json`,
//     "utf-8"
//   );

//   let trainerParties: Record<string, string[]>;
//   try {
//     trainerParties = JSON.parse(additionalPartiesFile);
//   } catch (error) {
//     throw new Error(`Error parsing additional parties file: ${error}`);
//   }
//   // If trainer has `additionalParties`,
//   // overwrite the `additionalParties` with a
//   // new array containing the `additionalParties` from the trainer
//   for (const trainerId in trainersFlat) {
//     const trainer = trainersFlat[trainerId];
//     if (trainer.additionalProperties === undefined) {
//       return;
//     }
//     const additionalParties =
//       // If the trainer has additional parties, merge them
//       (trainer.additionalParties = [
//         ...(trainer.additionalParties || []),
//         ...(trainer.party || []),
//       ]);
//   }
// };
