import fs from "fs";

interface Mon {
  min_level?: number;
  max_level?: number;
  species: string;
}

interface EncounterGroup {
  encounter_rate: number;
  mons: Mon[];
}

interface MapEncounter {
  map: string;
  base_label: string;
  land_mons?: EncounterGroup;
  water_mons?: EncounterGroup;
  fishing_mons?: EncounterGroup;
  rock_smash_mons?: EncounterGroup;
}

interface WildEncounterData {
  wild_encounter_groups: Array<{
    label: string;
    for_maps: boolean;
    encounters: MapEncounter[];
  }>;
}

const file = fs.readFileSync("./wild_encounters.json", "utf8");
if (!file) {
  throw new Error("Encounters file not found or empty");
}

function parseAndConvertSpecies(jsonData: string): MapEncounter[] {
  let parsedData: WildEncounterData;

  try {
    parsedData = JSON.parse(jsonData);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error}`);
  }

  // Get the main encounters array (first group that has for_maps: true)
  const mainEncounterGroup = parsedData.wild_encounter_groups.find(
    (group) => group.for_maps
  );

  if (!mainEncounterGroup || !mainEncounterGroup.encounters) {
    throw new Error("Could not find main encounters group");
  }

  const convertSpecies = (mons: Mon[]): Mon[] => {
    return mons.map((mon) => ({
      ...mon,
      species: mon.species.replace(/^SPECIES_/, "").toLowerCase(),
    }));
  };

  return mainEncounterGroup.encounters.map((mapObj: MapEncounter) => {
    const newMapObj: MapEncounter = { ...mapObj };

    if (newMapObj.land_mons) {
      newMapObj.land_mons = {
        ...newMapObj.land_mons,
        mons: convertSpecies(newMapObj.land_mons.mons),
      };
    }

    if (newMapObj.water_mons) {
      newMapObj.water_mons = {
        ...newMapObj.water_mons,
        mons: convertSpecies(newMapObj.water_mons.mons),
      };
    }

    if (newMapObj.fishing_mons) {
      newMapObj.fishing_mons = {
        ...newMapObj.fishing_mons,
        mons: convertSpecies(newMapObj.fishing_mons.mons),
      };
    }

    if (newMapObj.rock_smash_mons) {
      newMapObj.rock_smash_mons = {
        ...newMapObj.rock_smash_mons,
        mons: convertSpecies(newMapObj.rock_smash_mons.mons),
      };
    }

    return newMapObj;
  });
}

(() => {
  try {
    const data = parseAndConvertSpecies(file);
    fs.writeFileSync("cleanEncounters.json", JSON.stringify(data, null, 2));
    console.log(`Successfully converted ${data.length} encounter maps!`);
    console.log("Output saved to cleanEncounters.json");
  } catch (error) {
    console.error("Error processing encounters:", error);
  }
})();
