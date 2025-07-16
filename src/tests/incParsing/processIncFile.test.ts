import test from "ava";
import { processIncFile } from "../../parseMaps/index.js";
test("parse an inc file with both trainers and scripted gives", (t) => {
  const content = `
  script::test_script
  @explanation bawls hang lowwww
    giveitem ITEM_POTION, 5
    trainerbattle TRAINER_JOE
    end
        `;
    const result = processIncFile(content);
    t.is(result.scriptedGives.length, 1);
  end;
});
