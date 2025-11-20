// import path from "path";
// // import { mkdirSync } from "fs";
// import { readFile } from "fs/promises";

// import { config } from "../config/index.ts";

// // const prettyPrint = (data: any): string => JSON.stringify(data, null, 2);

// (async () => {
//   const mugsPath = path.resolve(config.dataDir, "mugshots.json");
//   console.log(mugsPath);
//   const mugshots = await readFile(mugsPath, "utf-8")
//     .then(JSON.parse)
//     .then((data) => data.mugshots);
//   Object.keys(mugshots).map((key) => {
//     const locale = key.split("_").slice(1, 2).join();
//     const name = key.split("_").slice(2).join("_");
//     const path = `${locale.toLocaleLowerCase()}/${name.toLocaleLowerCase()}.png`;
    
//   });
// })();
