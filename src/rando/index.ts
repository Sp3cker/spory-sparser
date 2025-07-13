interface PokemonData {
  species: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  isLegendary?: boolean;
}
class Sfc32State {
  constructor(
    public a: number,
    public b: number,
    public c: number,
    public ctr: number
  ) {}

  next(): number {
    this.ctr = (this.ctr + 1) | 0;
    let t = (this.a + this.b + this.ctr) | 0;
    this.a = this.b ^ (this.b >>> 9);
    this.b = (this.c + (this.c << 3)) | 0;
    this.c = (this.c << 21) | (this.c >>> 11);
    this.c = (this.c + t) | 0;
    return t >>> 0; // Ensure unsigned 32-bit
  }

  nextRange(range: number): number {
    if (range < 2) return 0;

    // Power of 2 ceiling
    let nextPowerOfTwo = range - 1;
    nextPowerOfTwo |= nextPowerOfTwo >> 1;
    nextPowerOfTwo |= nextPowerOfTwo >> 2;
    nextPowerOfTwo |= nextPowerOfTwo >> 4;
    nextPowerOfTwo |= nextPowerOfTwo >> 8;
    nextPowerOfTwo |= nextPowerOfTwo >> 16;
    nextPowerOfTwo++;

    const mask = nextPowerOfTwo - 1;
    let result: number;

    do {
      result = this.next() & mask;
    } while (result >= range);

    return result;
  }
}
function randomizeSpecies(
  state: Sfc32State,
  originalSpecies: number,
  pokemonData: Map<number, PokemonData>
): number {
  const originalBST = calculateBST(pokemonData.get(originalSpecies)!);
  const [minBST, maxBST] = getBSTRange(originalBST);

  // Get all species within BST range
  const validSpecies: number[] = [];
  for (const [species, data] of pokemonData) {
    const bst = calculateBST(data);
    if (bst >= minBST && bst <= maxBST) {
      validSpecies.push(species);
    }
  }

  if (validSpecies.length === 0) return originalSpecies;

  const randomIndex = state.nextRange(validSpecies.length);
  return validSpecies[randomIndex];
}
function createRandomizerState(
  globalSeed: number,
  reason: number, // RANDOMIZER_REASON_WILD_ENCOUNTER = 1
  locationSeed: number,
  originalSpecies: number
): Sfc32State {
  const state = new Sfc32State(
    (globalSeed + reason) >>> 0,
    (globalSeed ^ originalSpecies) >>> 0,
    locationSeed >>> 0,
    1 // RANDOMIZER_STREAM
  );

  // Advance 10 times for mixing
  for (let i = 0; i < 10; i++) {
    state.next();
  }

  return state;
}

function createLocationSeed(
  mapGroup: number,
  mapNum: number,
  area: number, // 0=land, 1=water, 2=fishing, 3=rocks
  slot: number
): number {
  return (mapGroup << 24) | (mapNum << 16) | (area << 8) | slot;
}
function calculateBST(pokemon: PokemonData): number {
  return (
    pokemon.hp +
    pokemon.attack +
    pokemon.defense +
    pokemon.spAttack +
    pokemon.spDefense +
    pokemon.speed
  );
}

function getBSTRange(bst: number): [number, number] {
  const tolerance = Math.floor(bst * 0.1024); // 10.24%
  return [Math.max(0, bst - tolerance), bst + tolerance];
}
function findSpeciesLocations(
  targetSpecies: number,
  globalSeed: number,
  pokemonData: Map<number, PokemonData>,
  wildEncounterData: WildEncounterTable[]
): MapLocation[] {
  const locations: MapLocation[] = [];
  const targetBST = calculateBST(pokemonData.get(targetSpecies)!);
  const [targetMinBST, targetMaxBST] = getBSTRange(targetBST);

  for (const encounterTable of wildEncounterData) {
    // Check each encounter type (land, water, fishing, rocks)
    for (let area = 0; area < 4; area++) {
      const encounters = getEncountersForArea(encounterTable, area);
      if (!encounters) continue;

      // Check each slot in this area
      for (let slot = 0; slot < encounters.length; slot++) {
        const originalSpecies = encounters[slot].species;
        const originalBST = calculateBST(pokemonData.get(originalSpecies)!);
        const [originalMinBST, originalMaxBST] = getBSTRange(originalBST);

        // Check if BST ranges overlap (randomization possible)
        if (originalMaxBST >= targetMinBST && originalMinBST <= targetMaxBST) {
          const locationSeed = createLocationSeed(
            encounterTable.mapGroup,
            encounterTable.mapNum,
            area,
            slot
          );

          const state = createRandomizerState(
            globalSeed,
            1, // RANDOMIZER_REASON_WILD_ENCOUNTER
            locationSeed,
            originalSpecies
          );

          const randomizedSpecies = randomizeSpecies(
            state,
            originalSpecies,
            pokemonData
          );

          if (randomizedSpecies === targetSpecies) {
            locations.push({
              mapGroup: encounterTable.mapGroup,
              mapNum: encounterTable.mapNum,
              area: area,
              slot: slot,
            });
          }
        }
      }
    }
  }

  return locations;
}
