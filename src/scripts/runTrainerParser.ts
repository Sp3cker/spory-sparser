import { readFile } from "fs/promises";
import path from "path";
import { parseWildMon } from "../parseMaps/baseInc.js";

(async () => {
  try {
    const filePath = path.resolve("maps/Route124/scripts.inc"); // Replace with the actual path to your .inc file
    const incFileData = await readFile(filePath, "utf8");

    const trainerBattles = parseWildMon(incFileData);

    console.log("Parsed Trainer Battles:", trainerBattles);
  } catch (error) {
    console.error("Error parsing trainer battles:", error);
  }
})();
