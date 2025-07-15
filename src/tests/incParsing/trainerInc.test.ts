import test from "ava";
import { parseTrainerBattles } from "../../parseMaps/Trainers/trainerInc.ts";

test("basic", (t) => {
  const content = `
  script::
  @explanation This is a test
    trainerbattle_rematch TRAINER_BUG_CATCHER, bullshit whatever
  end
  `;
  const [battle] = parseTrainerBattles(content);
  t.deepEqual(battle, {
    id: "TRAINER_BUG_CATCHER",
    script: "script",
    rematch: true,
  });
});
