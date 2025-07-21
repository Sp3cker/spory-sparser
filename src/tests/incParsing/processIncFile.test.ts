import test from "ava";
import { processIncFile } from "../../parseMaps/index.js";
test("parse an inc file with both trainers and scripted gives", async (t) => {
  const content = `
  levelname_mybawls_script::
  @explanation bawls hang lowwww
    giveitem ITEM_POTION, 5
    trainerbattle_rematch TRAINER_JOE
    givemonrandom SPECIES_PIKACHU, 5
    end
        `;
  const result = await processIncFile(content);
  t.is(result.scriptedGives.length, 1);

  t.is(result.scriptedGives.length, 1);
  t.deepEqual(result.scriptedGives[0], {
    scriptName: "mybawls",
    explanation: "bawls hang lowwww",
    items: [{ name: "ITEM_POTION", quantity: 5 }],
    pokemon: [{ species: "SPECIES_PIKACHU", level: 5, isRandom: true }],
  });
  t.is(result.trainerRefs.length, 1);
  t.deepEqual(result.trainerRefs, [
    { id: "TRAINER_JOE", script: "levelname_mybawls_script", rematch: true },
  ]);
});

test("parse an inc file with multiple items and pokemon", async (t) => {
  const content = `
    levelname_testscript_script::
    @explanation test multiple items
      giveitem ITEM_POTION, 3
      giveitem ITEM_SUPER_POTION, 2
      givemonrandom SPECIES_CHARIZARD, 5
      givemonrandom SPECIES_BLASTOISE, 5
      end
          `;
  const result = await processIncFile(content);
  t.is(result.scriptedGives.length, 1);
  t.deepEqual(result.scriptedGives[0], {
    scriptName: " levelname_testscript_script",
    explanation: "test multiple items",
    items: [
      { name: "ITEM_POTION", quantity: 3 },
      { name: "ITEM_SUPER_POTION", quantity: 2 },
    ],
    pokemon: [
      { species: "SPECIES_CHARIZARD", level: 5, isRandom: true },
      { species: "SPECIES_BLASTOISE", level: 5, isRandom: true },
    ],
  });
});

test("parse an inc file with only items", async (t) => {
  const content = `
    levelname_itemsonly_script::
    @explanation only items here
      giveitem ITEM_POKEBALL, 10
      end
          `;
  const result = await processIncFile(content);
  t.is(result.scriptedGives.length, 1);
  t.deepEqual(result.scriptedGives[0], {
    scriptName: "itemsonly",
    explanation: "only items here",
    items: [{ name: "ITEM_POKEBALL", quantity: 10 }],
    pokemon: [],
  });
});

test("parse an inc file with only pokemon", async (t) => {
  const content = `
    levelname_pokemononly_script::
    @explanation only pokemon here
      givemonrandom SPECIES_PIKACHU, 5
      givemonrandom SPECIES_PIKACHU, 5
      givemonrandom SPECIES_RAICHU, 5
      end
          `;
  const result = await processIncFile(content);
  t.is(result.scriptedGives.length, 1);
  t.deepEqual(result.scriptedGives[0], {
    scriptName: "levelname_pokemononly_script::",
    explanation: "only pokemon here",
    items: [],
    pokemon: [
      { species: "SPECIES_PIKACHU", level: 5, isRandom: true },
      { species: "SPECIES_RAICHU", level: 5, isRandom: true },
    ],
  });
});
