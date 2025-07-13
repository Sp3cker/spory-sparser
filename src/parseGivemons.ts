
// Array of strings to match against
export const targetStrings = [
  "SPECIES_SQUIRTLE", //0
  "SPECIES_BULBASAUR",
  "SPECIES_CHARMANDER",
  "SPECIES_TOTODILE",
  "SPECIES_CHIKORITA",
  "SPECIES_CYNDAQUIL",
  "SPECIES_MUDKIP",
  "SPECIES_TREECKO",
  "SPECIES_TORCHIC", //8
  "SPECIES_PIPLUP",
  "SPECIES_TURTWIG",
  "SPECIES_CHIMCHAR",
  "SPECIES_OSHAWOTT",
  "SPECIES_SNIVY",
  "SPECIES_TEPIG",
  "SPECIES_FROAKIE",
  "SPECIES_CHESPIN", // 16
  "SPECIES_FENNEKIN",
  "SPECIES_POPPLIO",
  "SPECIES_ROWLET",
  "SPECIES_LITTEN",
  "SPECIES_SOBBLE",
  "SPECIES_GROOKEY",
  "SPECIES_SCORBUNNY",
  "SPECIES_QUAXLY", // 24
  "SPECIES_SPRIGATITO",
  "SPECIES_FUECOCO",
  "SPECIES_KUBFU",
  "SPECIES_ZERAORA", // gift mythical
  "SPECIES_CHARCADET",
  "SPECIES_TYROGUE",
  "SPECIES_LILEEP",
  "SPECIES_ANORITH", //32
  "SPECIES_MELTAN", // gift from steven post game
  "SPECIES_CELEBI", // gift mythical
  "SPECIES_DARKRAI", //36, gift mythical
  "SPECIES_PIKACHU_COSPLAY",
  "SPECIES_PIKACHU_ROCK_STAR",
  "SPECIES_PIKACHU_BELLE",
  "SPECIES_PIKACHU_POP_STAR",
  "SPECIES_PIKACHU_FLYING",
  "SPECIES_PIKACHU_PHD", //40
  "SPECIES_PIKACHU_SURFING",
  "SPECIES_PIKACHU_LIBRE",
  "SPECIES_VICTINI", // gift mythical
  "SPECIES_HOOPA_CONFINED", // gift mythical
  "SPECIES_DITTO",
  "SPECIES_GENESECT", // gift mythical
  "SPECIES_MELOETTA_ARIA", // gift mythical
  "SPECIES_JIRACHI", // gift mythical
  "SPECIES_ZARUDE", // 48, gift mythical
  "SPECIES_MARSHADOW", // gift mythical
  "SPECIES_TOGEPI",
  "SPECIES_RIOLU",
  "SPECIES_PANSAGE",
  "SPECIES_PANPOUR",
  "SPECIES_PANSEAR", //56
  "SPECIES_SCYTHER",
  "SPECIES_HERACROSS",
  "SPECIES_PINSIR",
  "SPECIES_MISDREAVUS",
  "SPECIES_ELEKID",
  "SPECIES_MAGBY",
  "SPECIES_SMOOCHUM",
  "SPECIES_EEVEE", // 64
  "SPECIES_TYPE_NULL",
  // ...add more as needed
];



// Main function
// function parseGivemonFiles(dir: string, targets: string[]) {
//   const results: {
//     file: string;
//     line: number;

//     content: string;
//   }[] = [];
//   const files = findTextFiles(dir);

//   for (const file of files) {
//     const lines = readFileSync(file, "utf8").split("\n");
//     lines.forEach((line, idx) => {
//       if (line.includes("givemonrandom") || line.includes("givemon")) {
//         const found = findTarget(line, targets);
//         if (found) {
//           foundMonds.add(found);
//           results.push({
//             file,
//             line: idx + 1,
//             content: line.trim(),
//           });
//         }
//       }
//     });
//   }
//   return results;
// }

// // Example usage:
// const dirToSearch = process.argv[2];
// if (!dirToSearch) {
//   console.error("Usage: ts-node parseGivemons.ts <directory>");
//   process.exit(1);
// }
// const matches = parseGivemonFiles(dirToSearch, targetStrings);
// console.log(JSON.stringify(matches, null, 2));

// const notFound = new Set();

// for (const neededMon of targetStrings) {
//   if (!foundMonds.has(neededMon)) {
//     notFound.add(neededMon);
//   }
// }
// console.log("Not found in any givemon files: %s", foundMonds.size);
// notFound.forEach((mon) => console.log(mon));