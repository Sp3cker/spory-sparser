import fs from "fs/promises";
import * as path from "path";
import { getLevelLabel, getBasemapID } from "../../helpers.ts";
import {
  MapEventPlaceSchema,
  MapEventPlace,
} from "../../validators/mapEvent.ts";
import collectSprites from "./collectSprites.ts";
const spritePaths = await collectSprites();
/**
 * Coords is their xy on the Porymap map.
 * Script is used to key this trainer to their Trainer data, parsed by `extractTrainers`
 * graphics_id is the name of PNG file
 */
export type MapEventTrainer = {
  coords: [number, number];
  script: string;
  graphics_id?: string;
};
export type MapEventPickup = {
  coords: [number, number];
  item: string; // item id 'ITEM_ABILITY_CAPSULE'
  type: "object_event" | "hidden_item"; // whether the item is in a pokeball on not
};

// const mapPattern = /^(.+?)(?:_([B]?\d+F(?:_\d+R)?)|_(\w+_ROOM))?$/i;

// export function parseMapString(mapString: string) {
//   const match = mapString.match(mapPattern);

//   if (match) {
//     let baseName = match[1];
//     let level = match[2] || null; // Floor level (like 1F, B1F, 2F_1R)
//     if (baseName.match(/_/g)?.length!! >= 3) {
//       baseName = baseName.split("_").slice(0, 3).join("_");
//     }
//     if (mapString.includes("MAP_CAVE_OF_ORIGIN")) {
//       baseName = "MAP_CAVE_OF_ORIGIN";
//       level = mapString.split("MAP_CAVE_OF_ORIGIN_")[1];
//     }
//     if (mapString.includes("MAP_GRANITE_CAVE")) {
//       baseName = "MAP_GRANITE_CAVE";
//       level = mapString.split("MAP_GRANITE_CAVE_")[1];
//     }
//     if (mapString.includes("MAP_SHOAL_CAVE")) {
//       baseName = "MAP_SHOAL_CAVE";
//       level = mapString.split("MAP_SHOAL_CAVE_")[1];
//     }
//     if (mapString.includes("MAP_NEW_MAUVILLE")) {
//       baseName = "MAP_NEW_MAUVILLE";
//       level = mapString.split("MAP_NEW_MAUVILLE_")[1];
//     }
//     if (mapString.includes("MAP_SEAFLOOR_CAVERN")) {
//       baseName = "MAP_SEAFLOOR_CAVERN";
//       level = mapString.split("MAP_SEAFLOOR_CAVERN_")[1];
//     }
//     if (mapString.includes("MAP_EVER_GRAND_CITY")) {
//       baseName = "MAP_EVER_GRAND_CITY";
//       level = mapString.split("MAP_EVER_GRAND_CITY_")[1];
//     }
//     MAP_ROOT_NAMES.forEach((rootName: string) => {
//       if (mapString.includes(rootName)) {
//         baseName = rootName;
//         level = mapString.split(`${rootName}_`)[1];
//       }
//     });
//     return {
//       baseMap: baseName,
//       thisLevelsId: level,
//       original: mapString,
//     };
//   }

//   return null; // No match found
// }

function extractMapData(mapObj: any) {
  const trainers: MapEventTrainer[] = [];
  const pickupitems: MapEventPickup[] = [];
  if (Array.isArray(mapObj.object_events)) {
    for (const obj of mapObj.object_events) {
      if (obj.trainer_type && obj.trainer_type !== "TRAINER_TYPE_NONE") {
        trainers.push({
          coords: [obj.x, obj.y],
          script: obj.script,
          graphics_id: spritePaths.get(obj.graphics_id),
        });
      }
      // Find pickup items
      if (
        obj.graphics_id &&
        obj.graphics_id.includes("ITEM_BALL") &&
        obj.trainer_type === "TRAINER_TYPE_NONE" &&
        obj.trainer_sight_or_berry_tree_id !== "0"
      ) {
        pickupitems.push({
          coords: [obj.x, obj.y],
          item: obj.trainer_sight_or_berry_tree_id,
          type: "object_event",
        });
      }
    }
  }
  if (Array.isArray(mapObj.bg_events)) {
    for (const obj of mapObj.bg_events) {
      if (obj.type === "hidden_item" && obj.item) {
        pickupitems.push({
          coords: [obj.x, obj.y],
          item: obj.item,
          type: "hidden_item",
        });
      }
    }
  }
  return { trainers, pickupitems };
}

export default async (mapsDir: string): Promise<MapEventPlace[]> => {
  const folders = (await fs.readdir(mapsDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    // .filter((entry) => {
    //   entry.name === "_scripts";
    // })
    .map((entry) => entry.name);

  const baseMapToLevels: Record<string, MapEventPlace> = {};

  for (const folder of folders) {
    const mapJsonPath = path.join(mapsDir, folder, "map.json");
    let id: string | undefined;
    let trainers: MapEventTrainer[] = [];
    let pickupItems: MapEventPickup[] = [];

    try {
      const mapJson = JSON.parse(await fs.readFile(mapJsonPath, "utf8"));
      id = mapJson.id;
      const extracted = extractMapData(mapJson);
      trainers = extracted.trainers;
      pickupItems = extracted.pickupitems;
      // Parse `.pory` files for story items
    } catch (err) {
      throw new Error("huh? " + err);
    }

    if (!id) continue;

    const levelLabel = getLevelLabel(folder).toUpperCase().replace(/\s+/g, "_");
    const imageName = path.basename(path.dirname(mapJsonPath));
    const baseMap = await getBasemapID(path.dirname(mapJsonPath));
    const place: MapEventPlace = MapEventPlaceSchema.parse({
      thisLevelsId: id,
      baseMap,
      levelLabel,
      imageName,
      trainers,
      pickupItems,
    });
    baseMapToLevels[id] = place;
  }

  return Object.values(baseMapToLevels);
}
