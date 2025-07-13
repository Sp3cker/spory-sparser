import * as fs from "fs/promises";
function baseLabelToMap(baseLabel: string): string {
  // Remove leading 'g', insert underscores before capitals (except first), uppercase all
  return (
    "MAP_" +
    baseLabel
      .replace(/^g/, "") // Remove leading 'g'
      .replace(/([A-Z])/g, "_$1") // Insert _ before each capital
      .replace(/^_/, "") // Remove leading _
      .toUpperCase()
  );
}

(async () => {
  const encounters = JSON.parse(
    await fs.readFile("cleanEncounters.json", "utf-8")
  );
  const BaseMapNames = new Map<string, any>();
  for (const encounter of encounters) {
    const baseMapName = baseLabelToMap(encounter.base_label.split("_")[0]);

    if (!BaseMapNames.has(baseMapName)) {
      BaseMapNames.set(baseMapName, []);
    }
    BaseMapNames.get(baseMapName).push(encounter);
  }
  await fs.writeFile(
    "encounterGroup.json",
    JSON.stringify(Object.fromEntries(BaseMapNames), null, 2)
  );
})();
