import fs from "fs";
// Read the existing legendaries data
const legendariesData = JSON.parse(
  fs.readFileSync("./data/pokemon-data/legendaries-data.json", "utf8")
);

// Read the map breakdown to get all valid mapBaseName values


// Read species data to validate Pokemon names and get indices
const speciesData = JSON.parse(
  fs.readFileSync("./speciesData.json", "utf8")
);
const validSpeciesNames = new Set(speciesData.map((species: any) => species.nameKey));
const speciesNameToData = new Map(speciesData.map((species: any) => [species.nameKey, species]));

// Function to convert location to mapBasename
function locationToMapBasename(location: string): string | null {
  // Handle special cases first
  if (location === "-" || !location) {
    return null; // No map for evolutions
  }

  if (location.includes("Hoenn (")) {
    return "MAP_HOENN"; // Generic roaming
  }

  // Handle routes - extract number and format as MAP_ROUTExxx
  const routeMatch = location.match(/Route (\d+)/);
  if (routeMatch) {
    return `MAP_ROUTE${routeMatch[1]}`;
  }

  // Handle cities - convert to MAP_CITY_NAME format
  if (location.includes(" City")) {
    const cityName = location
      .replace(" City", "")
      .split(" (")[0]
      .toUpperCase()
      .replace(/[^A-Z]/g, "_");
    return `MAP_${cityName}_CITY`;
  }

  // Handle special location mappings
  const locationMappings = {
    "Safari Zone Northwest": "MAP_SAFARI_ZONE",
    "Safari Zone Northeast": "MAP_SAFARI_ZONE",
    "Safari Zone Southeast": "MAP_SAFARI_ZONE",
    "Safari Zone Southwest": "MAP_SAFARI_ZONE",
    "Safari Zone North": "MAP_SAFARI_ZONE",
    "Safari Zone South": "MAP_SAFARI_ZONE",
    "Sky Pillar (Top)": "MAP_SKY_PILLAR",
    "Sky Pillar": "MAP_SKY_PILLAR",
    "Meteor Falls (Waterfall Zones)": "MAP_METEOR_FALLS",
    "Meteor Falls (Metagross Room)": "MAP_METEOR_FALLS",
    "Victory Road": "MAP_VICTORY_ROAD",
    "Mt. Chimney": "MAP_MT_CHIMNEY",
    "Birth Island": "MAP_BIRTH_ISLAND",
    "Faraway Island": "MAP_FARAWAY_ISLAND",
    "Southern Island": "MAP_SOUTHERN_ISLAND",
    "Navel Rock": "MAP_NAVEL_ROCK",
    "Devon Corporation": "MAP_DEVON_CORP",
    "Abandoned Ship": "MAP_ABANDONED_SHIP",
    "Rusturf Tunnel": "MAP_RUSTURF_TUNNEL",
    "New Mauville": "MAP_NEW_MAUVILLE",
    "Granite Cave (Mach Bike Path)": "MAP_GRANITE_CAVE",
    "Shoal Cave (Icy Area)": "MAP_SHOAL_CAVE",
    "Shoal Cave (High Tide)": "MAP_SHOAL_CAVE",
    "Shoal Cave (Low Tide)": "MAP_SHOAL_CAVE",
    "Artisan Cave 1F": "MAP_ARTISAN_CAVE",
    "Artisan Cave B1F": "MAP_ARTISAN_CAVE",
    "Magma Hideout": "MAP_MAGMA_HIDEOUT",
    "Seafloor Cavern": "MAP_SEAFLOOR_CAVERN",
    "Mt. Pyre": "MAP_MT_PYRE",
  };

  // Check direct mappings first
  //@ts-ignore
  if (locationMappings[location]) {
    //@ts-ignore
    return locationMappings[location];
  }

  // Handle route-specific locations like 'Route 114 Waterfall'
  const routeLocationMatch = location.match(/Route (\d+)/);
  if (routeLocationMatch) {
    return `MAP_ROUTE${routeLocationMatch[1]}`;
  }

  // Handle cave locations in routes like 'Route 111 (Desert Cave)'
  const routeCaveMatch = location.match(/Route (\d+) \(/);
  if (routeCaveMatch) {
    return `MAP_ROUTE${routeCaveMatch[1]}`;
  }

  // Handle multi-route locations like 'Route 130 or 131'
  const multiRouteMatch = location.match(/Route (\d+) or \d+/);
  if (multiRouteMatch) {
    return `MAP_ROUTE${multiRouteMatch[1]}`;
  }

  // Handle generic diving spots
  if (location.includes("Diving Spot")) {
    return "MAP_HOENN";
  }

  if (location.includes("Cave")) {
    return "MAP_HOENN";
  }

  // Default fallback - convert to standard format
  const cleanLocation = location
    .split(" (")[0]
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return `MAP_${cleanLocation}`;
}

// Function to convert Pokemon name to SPECIES_NAME format
function pokemonToSpeciesName(pokemonName: string): { speciesName: string; nameKey: string } {
  if (!pokemonName) return { speciesName: '', nameKey: '' };

  // Handle special cases and forms
  const specialMappings: Record<string, string> = {
    "Type: Null": "Type: Null",  // Keep the colon for this one
    "Tapu Koko": "Tapu Koko", 
    "Tapu Lele": "Tapu Lele",
    "Tapu Bulu": "Tapu Bulu",
    "Tapu Fini": "Tapu Fini",
    "Walking Wake": "Walking Wake",
    "Gouging Fire": "Gouging Fire", 
    "Raging Bolt": "Raging Bolt",
    "Iron Leaves": "Iron Leaves",
    "Iron Boulder": "Iron Boulder",
    "Iron Crown": "Iron Crown",
  };

  // Base form corrections (Pokemon that need default forms)
  const baseFormMappings: Record<string, string> = {
    "Deoxys": "Deoxys-Normal",
    "Shaymin": "Shaymin-Land", 
    "Keldeo": "Keldeo-Ordinary",
    "Meloetta": "Meloetta-Aria",
    "Hoopa": "Hoopa-Confined",
    "Silvally": "Silvally-Normal"
  };

  // Form name corrections for species data compatibility
  const formCorrections: Record<string, string> = {
    // Galarian forms
    'Articuno-Galarian': 'Articuno-Galar',
    'Zapdos-Galarian': 'Zapdos-Galar',
    'Moltres-Galarian': 'Moltres-Galar',
    // Incarnate/Therian forms
    'Tornadus-I': 'Tornadus-Incarnate',
    'Thundurus-I': 'Thundurus-Incarnate',
    'Landorus-I': 'Landorus-Incarnate',
    'Enamorus-I': 'Enamorus-Incarnate',
    'Tornadus-T': 'Tornadus-Therian',
    'Thundurus-T': 'Thundurus-Therian',
    'Landorus-T': 'Landorus-Therian',
    'Enamorus-T': 'Enamorus-Therian',
    // Kyurem forms
    'Kyurem-B': 'Kyurem-Black',
    'Kyurem-W': 'Kyurem-White',
    // Deoxys forms
    'Deoxys-A': 'Deoxys-Attack',
    'Deoxys-D': 'Deoxys-Defense', 
    'Deoxys-S': 'Deoxys-Speed',
    // Urshifu forms
    'Urshifu-Single': 'Urshifu-Single-Strike',
    'Urshifu-Rapid': 'Urshifu-Rapid-Strike',
    // Calyrex forms
    'Calyrex-Ice': 'Calyrex-Ice',
    'Calyrex-Shadow': 'Calyrex-Shadow',
    // Necrozma forms
    'Necrozma-Dusk Mane': 'Necrozma-Dusk-Mane',
    'Necrozma-Dawn Wings': 'Necrozma-Dawn-Wings',
    // Hoopa forms
    'Hoopa-U': 'Hoopa-Unbound',
    // Shaymin forms
    'Shaymin-Sky': 'Shaymin-Sky',
    // Ogerpon forms - all just use base name
    'Ogerpon-Wellspring': 'Ogerpon',
    'Ogerpon-Hearthflame': 'Ogerpon',
    'Ogerpon-Cornerstone': 'Ogerpon'
  };

  let processedName = pokemonName;

  // Check special mappings first
  if (specialMappings[pokemonName]) {
    processedName = specialMappings[pokemonName];
  } 
  // Check base form mappings
  else if (baseFormMappings[pokemonName]) {
    processedName = baseFormMappings[pokemonName];
  }
  // Check exact form corrections
  else if (formCorrections[pokemonName]) {
    processedName = formCorrections[pokemonName];
  }

  // Convert to nameKey format (what's in speciesData.json)
  let nameKey = processedName;
  
  // Only remove colons if it's not "Type: Null"
  if (processedName !== "Type: Null") {
    nameKey = nameKey.replace(/:/g, '');   // Remove colons
  }
  
  nameKey = nameKey
    .replace(/'/g, '')   // Remove apostrophes
    .replace(/\./g, '')  // Remove periods
    .trim();

  // Convert to SPECIES format
  let speciesNameFormatted = nameKey
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/-/g, '_')   // Replace hyphens with underscores
    .toUpperCase();

  const finalSpeciesName = `SPECIES_${speciesNameFormatted}`;

  // Validate that the nameKey exists in species data

  return {
    speciesName: finalSpeciesName,
    nameKey: nameKey
  };
}

// Add mapBasename and species name to each legendary entry
const updatedData = legendariesData.map((legendary: any) => {
  const mapBasename = locationToMapBasename(legendary.Location);
  const speciesNameData = pokemonToSpeciesName(legendary.Pokémon);
  const speciesInfo = speciesNameToData.get(speciesNameData.nameKey);
  const index = speciesInfo ? (speciesInfo as any).index : null;
  
  return {
    ...legendary,
    mapBasename: mapBasename,
    speciesName: speciesNameData.speciesName,
    nameKey: speciesNameData.nameKey,
    index: index,
  };
});

// Validation reporting - check if nameKey exists in species data
const invalidEntries = updatedData.filter((entry: any) => !validSpeciesNames.has(entry.nameKey));
if (invalidEntries.length > 0) {
  console.log('\n⚠️  WARNING: Found Pokemon names that don\'t match species data:');
  invalidEntries.forEach((entry: any) => {
    console.log(`   ${entry.Pokémon} -> ${entry.nameKey} (not found in speciesData.json)`);
  });
  console.log(`\nTotal invalid entries: ${invalidEntries.length} out of ${updatedData.length}`);
}

// Write the updated data back
fs.writeFileSync(
  "./data/pokemon-data/legendaries-with-maps.json",
  JSON.stringify(updatedData, null, 2)
);

console.log(
  "Added mapBasename and speciesName properties to",
  updatedData.length,
  "legendary entries"
);
console.log("Sample mappings:");
updatedData.slice(0, 5).forEach((entry: any) => {
  console.log(`${entry.Pokémon}: ${entry.Location} -> ${entry.mapBasename} | ${entry.speciesName}`);
});
