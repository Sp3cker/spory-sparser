import fs from "fs/promises";
import path from "path";

/** Makes the level ID pretty */
export function getLevelLabel(folderName: string): string {
  const firstUnderscore = folderName.indexOf("_");
  if (firstUnderscore === -1) return "";
  let level = folderName.substring(firstUnderscore + 1);

  // Special case for Pokémon League rooms
  const pokemonLeagueRooms = [
    "MAP_EVER_GRANDE_CITY_CHAMPIONS_ROOM",
    "MAP_EVER_GRANDE_CITY_DRAKES_ROOM",
    "MAP_EVER_GRANDE_CITY_GLACIAS_ROOM",
    "MAP_EVER_GRANDE_CITY_PHOEBES_ROOM",
    "MAP_EVER_GRANDE_CITY_SIDNEYS_ROOM",
  ];
  if (pokemonLeagueRooms.includes(folderName)) {
    return "Pokémon League";
  }

  // Special case for MAP_ABANDONED_SHIP_CORRIDORS_B1F
  if (folderName.startsWith("MAP_ABANDONED_SHIP_CORRIDORS_B1F")) {
    return "Corridors B1 F";
  }
  if (folderName.startsWith("MAP_ABANDONED_SHIP_CORRIDORS_1F")) {
    return "Corridors 1F";
  }

  // Split by underscores and process each part
  const parts = level.split("_");
  const processedParts = parts.map((part) => {
    // Handle special cases for common words
    if (part === "ROUTE") return "Route";
    if (part === "WEATHER") return "Weather";
    if (part === "INSTITUTE") return "Institute";
    if (part === "CENTER") return "Center";
    if (part === "TOWER") return "Tower";
    if (part === "CAVE") return "Cave";
    if (part === "FOREST") return "Forest";
    if (part === "CITY") return "City";
    if (part === "TOWN") return "Town";
    if (part === "VILLAGE") return "Village";
    if (part === "HIDEOUT") return "Hideout";
    if (part === "GYM") return "Gym";
    if (part === "MART") return "Mart";
    if (part === "HALL") return "Hall";
    if (part === "HOUSE") return "House";
    if (part === "BUILDING") return "Building";
    if (part === "FACTORY") return "Factory";
    if (part === "LABORATORY") return "Laboratory";
    if (part === "OFFICE") return "Office";
    if (part === "ROOM") return "Room";
    if (part === "CORRIDOR") return "Corridor";
    if (part === "DECK") return "Deck";
    if (part === "FLOOR") return "Floor";
    if (part === "ENTRANCE") return "Entrance";
    if (part === "EXTERIOR") return "Exterior";
    if (part === "HARBOR") return "Harbor";
    if (part === "SQUARE") return "Square";
    if (part === "LOUNGE") return "Lounge";
    if (part === "BATTLE") return "Battle";
    if (part === "ARENA") return "Arena";
    if (part === "COLOSSEUM") return "Colosseum";
    if (part === "FRONTIER") return "Frontier";
    if (part === "PYRAMID") return "Pyramid";
    if (part === "TOMB") return "Tomb";
    if (part === "RUINS") return "Ruins";
    if (part === "UNDERPASS") return "Underpass";
    if (part === "ARTISAN") return "Artisan";
    if (part === "ANCIENT") return "Ancient";
    if (part === "ALTERING") return "Altering";
    if (part === "BIRTH") return "Birth";
    if (part === "ISLAND") return "Island";
    if (part === "ORIGIN") return "Origin";
    if (part === "CONTEST") return "Contest";
    if (part === "DESERT") return "Desert";
    if (part === "DEWFORD") return "Dewford";
    if (part === "AQUA") return "Aqua";
    if (part === "ABANDONED") return "Abandoned";
    if (part === "SHIP") return "Ship";
    if (part === "CAPTAINS") return "Captain's";
    if (part === "HIDDEN") return "Hidden";
    if (part === "UNDERWATER") return "Underwater";
    if (part === "UNUSED") return "Unused";
    if (part === "RUBY") return "Ruby";
    if (part === "SAPPHIRE") return "Sapphire";
    if (part === "MAP") return "Map";
    if (part === "SERVICE") return "Service";
    if (part === "CORNER") return "Corner";
    if (part === "RANKING") return "Ranking";
    if (part === "RECEPTION") return "Reception";
    if (part === "GATE") return "Gate";
    if (part === "SCOTTS") return "Scott's";
    if (part === "PALACE") return "Palace";
    if (part === "PIKE") return "Pike";
    if (part === "FACTORY") return "Factory";
    if (part === "PRE") return "Pre";
    if (part === "MULTI") return "Multi";
    if (part === "PARTNER") return "Partner";
    if (part === "EXCHANGE") return "Exchange";
    if (part === "ELEVATOR") return "Elevator";
    if (part === "OUTSIDE") return "Outside";
    if (part === "EAST") return "East";
    if (part === "WEST") return "West";
    if (part === "POKEMON") return "Pokemon";

    if (part === "TOUGH") return "Tough";
    if (part === "TRICK") return "Trick";
    if (part === "PUZZLE") return "Puzzle";
    if (part === "OCEANIC") return "Oceanic";
    if (part === "MUSEUM") return "Museum";
    if (part === "SOOTOPOLIS") return "Sootopolis";
    if (part === "SLATEPORT") return "Slateport";

    // Handle floor numbers (1F, 2F, B1F, etc.)
    if (/^\d+F$/.test(part)) return part;
    if (/^B\d+F$/.test(part)) return part;

    // Handle route numbers (ROUTE119 -> Route 119)
    if (part.startsWith("ROUTE")) {
      const routeNum = part.substring(5);
      return `Route ${routeNum}`;
    }

    // For other parts, convert from UPPERCASE to Title Case
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });

  // Filter out map location parts and keep only level/room parts
  const filteredParts = processedParts.filter((part, _) => {
    // Skip route parts (Route 119, Route 110, etc.)
    if (part.startsWith("Route ")) return false;

    // Skip city/town parts (Slateport City, Sootopolis City, Dewford Town, etc.)
    if (part === "City" || part === "Town" || part === "Village") return false;

    // Skip specific city names that are part of the map location
    if (
      [
        "Slateport",
        "Sootopolis",
        "Dewford",
        "Rustboro",
        "Meteor Falls",
        "Mauville",
        "Verdanturf",
        "Fallarbor",
        "Lavaridge",
        "Petalburg",
        "Fortree",
        "Lilycove",
        "Mossdeep",
        "Pacifidlog",
        "Ever Grande",
      ].includes(part)
    )
      return false;

    return true;
  });

  // If filtered result is empty, it means it was just a route - return the route name
  if (filteredParts.length === 0) {
    const routePart = processedParts.find((part) => part.startsWith("Route "));
    if (routePart) {
      return routePart;
    }
  }

  // Join the parts with spaces
  let result = filteredParts.join(" ");

  // Handle special cases for numbers after words (House5 -> House 5, Puzzle1 -> Puzzle 1)
  result = result.replace(/([A-Za-z])(\d+)/g, "$1 $2");

  // But don't add spaces for floor numbers (2F, B1F)
  result = result.replace(/(\d+)\s+F/g, "$1F");
  result = result.replace(/B(\d+)\s+F/g, "B$1F");

  return result;
}

// async function geAlltMapIds(dir: string): Promise<Set<string>> {
//   const ids = new Set<string>();
//   const entries = await fs.readdir(dir, { withFileTypes: true });

//   for (const entry of entries) {
//     if (entry.isDirectory()) {
//       const mapPath = path.join(dir, entry.name, "map.json");
//       const id = await getMapJsonId(mapPath);
//       if (id) {
//         ids.add(id);
//       }
//     }
//   }

//   return ids;
// }
export const getMapJsonId = async (filePath: string): Promise<string> => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);

    return json.id;
  } catch (error) {
    // console.error(`Error reading ${mapPath}:`, error);
    throw new Error(`No id found in ${filePath}`);
  }
};

export async function getLevelId(folderPath: string): Promise<string> {
  const levelFilePath = path.join(folderPath, "map.json");
  try {
    const data = await fs.readFile(levelFilePath, "utf-8");
    const json = JSON.parse(data);
    return json.id;
  } catch (error) {
    console.error(`Error reading ${levelFilePath}:`, error);
    throw new Error(`No id found in ${levelFilePath}`);
  }
}

export async function getBasemapID(folderOrMapJson: string): Promise<string> {
  let folderName: string;

  const stat = await fs.stat(folderOrMapJson);
  if (stat.isDirectory()) {
    // If it's a directory, use the directory name
    folderName = path.basename(folderOrMapJson);
  } else if (folderOrMapJson.endsWith("map.json")) {
    // If it's a map.json file, use the name of its containing folder
    folderName = path.basename(path.dirname(folderOrMapJson));
  } else {
    console.error(folderOrMapJson);
    throw new Error("Invalid input: must be a directory or a path to map.json");
  }

  const parts = folderName.split("_");
  const beforeUnderscore = parts[0];
  // const afterUnderscore = parts
  //   .slice(1)
  //   .join("_")
  //   .replace(/([A-Z])(?=[A-Z\d])/g, " $1") // Add space only before uppercase not followed by number
  //   .trim()
  //   .replace(/\b\w/g, (char) => char.toUpperCase());
  // Insert underscore before each capital letter (except the first one)
  let result;
  if (beforeUnderscore.includes("Route") === false) {
    // Dont _under_score route names
    result = beforeUnderscore.charAt(0);
    for (let i = 1; i < beforeUnderscore.length; i++) {
      if (
        beforeUnderscore.charAt(i) === beforeUnderscore.charAt(i).toUpperCase()
      ) {
        result += "_" + beforeUnderscore.charAt(i);
      } else {
        result += beforeUnderscore.charAt(i);
      }
    }
  } else {
    result = beforeUnderscore;
  }

  // Convert to uppercase and prepend MAP_
  const map = "MAP_" + result.toUpperCase();
  return map;
}
