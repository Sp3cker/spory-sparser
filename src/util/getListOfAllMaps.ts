import { readdir, readFile, writeFile } from "fs/promises";

import path from "path";
/* This script gives you the places you're gonna need to make shapes for
. List comes from `map_groups.json` in the project. */
const MapPlaces = [
  "SunriseVillage",
  "SunriseVillage_Beach",
  "ChiiTown",
  "TranquilRoute",
  "SakuTown",
  "KuraTown",
  "BeachboundRoute",
  "MaguroHarbor",
  "WindsweptRoute",
  "SunriseVillage_PlayersHouse_Bedroom",
  "Silveridge",
  "WindyCape",
  "WhiteslateRoute",
  "BelvedereRoute",
  "Soulkeep",
  "OrchardPath",
  "SeastrollChannel",
  "ScenicRoute",
  "SabersideTown",
  "HarvestShrine",
  "SoulkeepGraveyard",
  "Beachbound_Route_Decay",
  "SabersideChannel",
  "CoreefIsle",
  "OpenSeaCoral",
  "OpenSeaHaven",
  "OpenSeaIcy",
  "OpenSeaLeague",
  "HavenIsle",
  "MiddleIsle",
  "TopIsle",
  "LongtideChannel",
  "LongTideChannelSoulkeep",
  "SeaTurfRoute",
  "HanabiCity",
  "PuddlePath",
  "DragonsPass",
  "Dryugon",
  "BurnfootPassBottom",
  "SteepstonePassBottom",
  "BurnfootPass",
  "MtKazanExterior",
  "SteepstonePass",
  "Shogunate",
  "ScenicRouteSaberside",
  "WindyCape2",
  "YifuCity",
  "FlowergrassPlateau",
  "WindsweptRouteBottom",
  "SakuTown_BufferArea",
  "YifuCity_BufferArea",
];
export async function geAlltMapIds(dir: string): Promise<Set<string>> {
  const ids = new Set<string>();
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const mapPath = path.join(dir, entry.name, "map.json");
      const data = await readFile(mapPath, "utf-8");
      const json = JSON.parse(data);
      if (!json.name) {
        throw Error("map.json missing name field: " + mapPath);
      }

      if (MapPlaces.includes(json.name)) {
        ids.add(json.id);
      }
    }
  }

  return ids;
}

(() => {
  // Example usage:

  geAlltMapIds("maps").then((ids) => {
    writeFile("hearth-map.json", JSON.stringify(Array.from(ids), null, 2));
  });
})();
