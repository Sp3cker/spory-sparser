import fs from "fs";
import { doubleBattles } from "./parseMaps/Trainers/doubleBattles.ts";
(() => {
  fs.readFile(
    "/Users/sallegrezza/dev/nodeProjects/spory-sparser/maps/Route116/map.json",
    (err, data) => {
      if (err) throw err;
      const ddata = JSON.parse(data.toString());
      console.log(doubleBattles(ddata.object_events));
    }
  );
})();
