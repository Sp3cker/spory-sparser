import test from "ava";
import { processIncFile } from "../../parseMaps/index.js";
test("parse an inc file with both trainers and scripted gives", async (t) => {
  const content = `
  levelname_mybawls_script::
  @explanation bawls hang lowwww
    giveitem ITEM_POTION, 5
    trainerbattle TRAINER_JOE
    givemon_random PIKACHU
    end
        `;
  const result = await processIncFile(content);
  t.is(result.scriptedGives.length, 1);
  t.deepEqual(result.scriptedGives[0], {
    scriptName: "test_script",
    explanation: "bawls hang lowwww",
    items: [{ name: "ITEM_POTION", quantity: 5 }],
    pokemon: [{ species: "PIKACHU", level: 5, isRandom: true }],
  });
  t.deepEqual(result.trainerRefs, [
    { id: "TRAINER_JOE", script: "mybawls_script" },
  ]);
});
