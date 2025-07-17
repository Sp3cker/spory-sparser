import { extractParties } from "../../parseMaps/Trainers/extractTrainerPartiesfromHeaderFile.ts";
import test from "ava";

const hedaerData1 = `static const struct TrainerMon sParty_Roxanne5[] = {
    {
    .iv = TRAINER_PARTY_IVS(31, 31, 31, 31, 31, 31),
    .lvl = 14,
    .species = SPECIES_RHYHORN,
    .heldItem = ITEM_RINDO_BERRY,
    .nature = NATURE_ADAMANT,
    //custom adamant
           //hp,atk,def,spatk,spdef,speed
    .ev = TRAINER_PARTY_EVS( 0, 36, 0, 0, 0, 36 ),
    .ability = ABILITY_LIGHTNING_ROD,
    .moves = {MOVE_ROCK_TOMB, MOVE_HORN_ATTACK, MOVE_BULLDOZE, MOVE_ROCK_SMASH}
    },
    {
    .iv = TRAINER_PARTY_IVS(31, 31, 31, 31, 31, 31),
    .lvl = 15,
    .species = SPECIES_WOOPER_PALDEA,
    .heldItem = ITEM_ORAN_BERRY,
    .nature = NATURE_MODEST,
    //custom adamant
           //hp,atk,def,spatk,spdef,speed
    .ev = TRAINER_PARTY_EVS( 0, 0, 0, 36, 0, 36 ),
    .ability = ABILITY_WATER_ABSORB,
    .moves = {MOVE_MUD_SHOT, MOVE_ACID_SPRAY, MOVE_YAWN, MOVE_SANDSTORM}
    },
    {
    .iv = TRAINER_PARTY_IVS(31, 31, 31, 31, 31, 31),
    .lvl = 15,
    .species = SPECIES_GLIGAR,
    .heldItem = ITEM_ORAN_BERRY,
    .nature = NATURE_ADAMANT,
    //custom adamant
           //hp,atk,def,spatk,spdef,speed
    .ev = TRAINER_PARTY_EVS( 0, 36, 0, 0, 0, 36 ),
    .ability = ABILITY_SAND_VEIL,
    .moves = {MOVE_WING_ATTACK, MOVE_QUICK_ATTACK, MOVE_BULLDOZE, MOVE_NONE}
    },
    {
    .iv = TRAINER_PARTY_IVS(31, 31, 31, 31, 31, 31),
    .lvl = 15,
    .species = SPECIES_NOSEPASS,
    .heldItem = ITEM_BERRY_JUICE,
    .nature = NATURE_IMPISH,
    //custom impish
           //hp,atk,def,spatk,spdef,speed
    .ev = TRAINER_PARTY_EVS( 0, 36, 36, 0, 0, 0 ),
    .ability = ABILITY_STURDY,
    .moves = {MOVE_ROCK_BLAST, MOVE_SPARK, MOVE_BULLDOZE, MOVE_THUNDER_WAVE}
    }
};`;

const hedaerData2 = `static const struct TrainerMon sParty_Brock[] = {
    {
    .iv = TRAINER_PARTY_IVS(15, 20, 25, 10, 15, 20),
    .lvl = 12,
    .species = SPECIES_GEODUDE,
    .heldItem = ITEM_NONE,
    .nature = NATURE_HARDY,
    .ev = TRAINER_PARTY_EVS( 0, 0, 0, 0, 0, 0 ),
    .ability = ABILITY_ROCK_HEAD,
    .moves = {MOVE_TACKLE, MOVE_DEFENSE_CURL, MOVE_NONE, MOVE_NONE}
    }
};`;

const hedaerData3 = `static const struct TrainerMon sParty_Multi[] = {
    {
    .iv = TRAINER_PARTY_IVS(0, 0, 0, 0, 0, 0),
    .lvl = 5,
    .species = SPECIES_CATERPIE,
    .moves = {MOVE_NONE, MOVE_NONE, MOVE_NONE, MOVE_NONE}
    },
    {
    .iv = TRAINER_PARTY_IVS(31, 0, 31, 0, 31, 0),
    .lvl = 50,
    .species = SPECIES_CHARIZARD,
    .heldItem = ITEM_LEFTOVERS,
    .nature = NATURE_JOLLY,
    .ev = TRAINER_PARTY_EVS( 252, 252, 4, 0, 0, 0 ),
    .ability = ABILITY_BLAZE,
    .moves = {MOVE_FLAMETHROWER, MOVE_DRAGON_CLAW, MOVE_EARTHQUAKE, MOVE_SOLAR_BEAM}
    }
};`;

test("extractParties should parse trainer parties correctly", (t) => {
  const result = extractParties(hedaerData1);
  t.is(Object.keys(result).length, 1);
  t.is(result.sParty_Roxanne5.length, 4);

  const firstMon = result.sParty_Roxanne5[0];
  t.is(firstMon.id, 111);
  t.is(firstMon.lvl, 14);
  t.is(firstMon.iv, true);
  t.deepEqual(firstMon.ev, [0, 36, 0, 0, 0, 36]);
  t.is(firstMon.nature, "adamant");
  t.is(firstMon.item, "ITEM_RINDO_BERRY");
});

test("extractParties should parse IV values correctly", (t) => {
  const result = extractParties(hedaerData2);
  const firstMon = result.sParty_Brock[0];

  t.is(firstMon.iv, true);
});

test("extractParties should parse moves correctly", (t) => {
  const result = extractParties(hedaerData1);
  const firstMon = result.sParty_Roxanne5[0];

  t.deepEqual(firstMon.moves, [
    317, // MOVE_ROCK_TOMB
    30,  // MOVE_HORN_ATTACK
    525, // MOVE_BULLDOZE
    249, // MOVE_ROCK_SMASH
  ]);

  const thirdMon = result.sParty_Roxanne5[2];
  t.deepEqual(thirdMon.moves, [
    17,  // MOVE_WING_ATTACK
    98,  // MOVE_QUICK_ATTACK
    525, // MOVE_BULLDOZE
    0,   // MOVE_NONE
  ]);
});

test("extractParties should handle zero IV values", (t) => {
  const result = extractParties(hedaerData3);
  const firstMon = result.sParty_Multi[0];

  t.is(firstMon.iv, true);
});

test("extractParties should handle mixed IV values", (t) => {
  const result = extractParties(hedaerData3);
  const secondMon = result.sParty_Multi[1];

  t.is(secondMon.iv, true);
});

test("extractParties should handle MOVE_NONE correctly", (t) => {
  const result = extractParties(hedaerData2);
  const firstMon = result.sParty_Brock[0];

  t.deepEqual(firstMon.moves, [
    33, // MOVE_TACKLE
    111, // MOVE_DEFENSE_CURL
    0,   // MOVE_NONE
    0,   // MOVE_NONE
  ]);
});

test("extractParties should handle multiple parties in one data", (t) => {
  const result = extractParties(hedaerData3);
  t.is(Object.keys(result).length, 1);
  t.is(result.sParty_Multi.length, 2);

  const firstMon = result.sParty_Multi[0];
  t.is(firstMon.lvl, 5);
  t.is(firstMon.id, 10); // SPECIES_CATERPIE

  const secondMon = result.sParty_Multi[1];
  t.is(secondMon.lvl, 50);
  t.is(secondMon.id, 6); // SPECIES_CHARIZARD
});

test("extractParties should handle missing optional fields", (t) => {
  const result = extractParties(hedaerData3);
  const firstMon = result.sParty_Multi[0];

  t.is(firstMon.item, undefined);
  t.is(firstMon.nature, undefined);
  t.is(firstMon.ability, undefined);
  t.is(firstMon.ev, undefined);
});

test("extractParties should correctly map SPECIES_ARCANINE to ID 59", (t) => {
  const arcanineData = `static const struct TrainerMon sParty_ArcanineTest[] = {
    {
    .lvl = 50,
    .species = SPECIES_ARCANINE,
    .iv = TRAINER_PARTY_IVS(31, 31, 31, 31, 31, 31),
    .moves = {MOVE_FLAMETHROWER, MOVE_BITE, MOVE_ROAR, MOVE_NONE}
    }
};`;

  const result = extractParties(arcanineData);
  const firstMon = result.sParty_ArcanineTest[0];

  t.is(firstMon.id, 59);
  t.is(firstMon.lvl, 50);
  t.deepEqual(firstMon.moves, [53, 44, 46, 0]); // MOVE_FLAMETHROWER, MOVE_BITE, MOVE_ROAR, MOVE_NONE
});

test("extractParties should correctly map SPECIES_ARCANINE_HISUI to ID 994", (t) => {
  const arcanineHisuiData = `static const struct TrainerMon sParty_ArcanineHisuiTest[] = {
    {
    .lvl = 50,
    .species = SPECIES_ARCANINE_HISUI,
    .iv = TRAINER_PARTY_IVS(31, 31, 31, 31, 31, 31),
    .moves = {MOVE_FLAMETHROWER, MOVE_ROCK_SLIDE, MOVE_CRUNCH, MOVE_NONE}
    }
};`;

  const result = extractParties(arcanineHisuiData);
  const firstMon = result.sParty_ArcanineHisuiTest[0];

  t.is(firstMon.id, 994);
  t.is(firstMon.lvl, 50);
  t.deepEqual(firstMon.moves, [53, 157, 242, 0]); // MOVE_FLAMETHROWER, MOVE_ROCK_SLIDE, MOVE_CRUNCH, MOVE_NONE
});

test("extractParties should handle monsters without IV field", (t) => {
  const noIVData = `static const struct TrainerMon sParty_NoIV[] = {
    {
    .lvl = 25,
    .species = SPECIES_PIKACHU,
    .moves = {MOVE_THUNDERBOLT, MOVE_QUICK_ATTACK, MOVE_NONE, MOVE_NONE}
    }
};`;

  const result = extractParties(noIVData);
  const firstMon = result.sParty_NoIV[0];

  t.is(firstMon.iv, undefined);
  t.is(firstMon.lvl, 25);
  t.deepEqual(firstMon.moves, [85, 98, 0, 0]); // MOVE_THUNDERBOLT, MOVE_QUICK_ATTACK, MOVE_NONE, MOVE_NONE
});

test("extractParties should handle complex EV parsing", (t) => {
  const complexEVData = `static const struct TrainerMon sParty_ComplexEV[] = {
    {
    .lvl = 50,
    .species = SPECIES_CHARIZARD,
    .iv = TRAINER_PARTY_IVS(31, 31, 31, 31, 31, 31),
    .ev = TRAINER_PARTY_EVS( 252, 128, 0, 128, 0, 0 ),
    .moves = {MOVE_FLAMETHROWER, MOVE_DRAGON_CLAW, MOVE_EARTHQUAKE, MOVE_SOLAR_BEAM}
    }
};`;

  const result = extractParties(complexEVData);
  const firstMon = result.sParty_ComplexEV[0];

  t.deepEqual(firstMon.ev, [252, 128, 0, 128, 0, 0]);
  t.deepEqual(firstMon.moves, [53, 337, 89, 76]); // MOVE_FLAMETHROWER, MOVE_DRAGON_CLAW, MOVE_EARTHQUAKE, MOVE_SOLAR_BEAM
});

test("extractParties should handle multiple parties in same data", (t) => {
  const multiplePartiesData = `static const struct TrainerMon sParty_Leader1[] = {
    {
    .lvl = 12,
    .species = SPECIES_GEODUDE,
    .iv = TRAINER_PARTY_IVS(15, 15, 15, 15, 15, 15),
    .moves = {MOVE_ROCK_THROW, MOVE_TACKLE, MOVE_NONE, MOVE_NONE}
    }
};

static const struct TrainerMon sParty_Leader2[] = {
    {
    .lvl = 15,
    .species = SPECIES_ONIX,
    .iv = TRAINER_PARTY_IVS(20, 20, 20, 20, 20, 20),
    .moves = {MOVE_ROCK_TOMB, MOVE_BIND, MOVE_NONE, MOVE_NONE}
    }
};`;

  const result = extractParties(multiplePartiesData);

  t.is(Object.keys(result).length, 2);
  t.is(result.sParty_Leader1[0].lvl, 12);
  t.is(result.sParty_Leader2[0].lvl, 15);
  t.is(result.sParty_Leader1[0].iv, true);
  t.is(result.sParty_Leader2[0].iv, true);
  t.deepEqual(result.sParty_Leader1[0].moves, [88, 33, 0, 0]); // MOVE_ROCK_THROW, MOVE_TACKLE, MOVE_NONE, MOVE_NONE
  t.deepEqual(result.sParty_Leader2[0].moves, [317, 20, 0, 0]); // MOVE_ROCK_TOMB, MOVE_BIND, MOVE_NONE, MOVE_NONE
});

test("extractParties should return EV arrays in correct order: [hp, atk, def, spatk, spdef, speed]", (t) => {
  const evOrderTestData = `static const struct TrainerMon sParty_EVOrder[] = {
    {
    .lvl = 50,
    .species = SPECIES_CHARIZARD,
    .iv = TRAINER_PARTY_IVS(31, 31, 31, 31, 31, 31),
    .ev = TRAINER_PARTY_EVS( 100, 200, 50, 150, 25, 75 ),
    .moves = {MOVE_FLAMETHROWER, MOVE_DRAGON_CLAW, MOVE_NONE, MOVE_NONE}
    }
};`;

  const result = extractParties(evOrderTestData);
  const firstMon = result.sParty_EVOrder[0];

  // Verify the array is in the correct order: [hp, atk, def, spatk, spdef, speed]
  t.deepEqual(firstMon.ev, [100, 200, 50, 150, 25, 75]);
  t.is(firstMon.ev![0], 100); // HP
  t.is(firstMon.ev![1], 200); // ATK
  t.is(firstMon.ev![2], 50); // DEF
  t.is(firstMon.ev![3], 150); // SP.ATK
  t.is(firstMon.ev![4], 25); // SP.DEF
  t.is(firstMon.ev![5], 75); // SPEED
  t.deepEqual(firstMon.moves, [53, 337, 0, 0]); // MOVE_FLAMETHROWER, MOVE_DRAGON_CLAW, MOVE_NONE, MOVE_NONE
});
