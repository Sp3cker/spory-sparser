// Check for trainers without sprite images
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

interface Trainer {
  battlePic: string;
  [key: string]: any;
}

async function checkTrainersWithoutSprites(): Promise<void> {
  try {
    console.log("Loading groupedTrainers.json...");

    const trainersPath = path.resolve(process.cwd(), "groupedTrainers.json");
    const trainersContent = await readFile(trainersPath, "utf8");
    const trainersData = JSON.parse(trainersContent);
    
    console.log("Trainers data structure:", typeof trainersData);
    console.log("Keys:", Object.keys(trainersData));
    
    // Check if it's grouped data (object with arrays) or direct array
    let trainers: Trainer[];
    if (Array.isArray(trainersData)) {
      trainers = trainersData;
    } else {
      // Flatten all trainer arrays from the grouped object
      trainers = Object.values(trainersData).flat() as Trainer[];
    }
    
    if (!trainers || trainers.length === 0) {
      throw new Error("No trainers found in the data");
    }
    console.log(`Checking ${trainers.length} trainers for sprite images...`);

    const spritePath = path.resolve(
      process.cwd(),
      "upscaled/trainers/front_pics"
    );
    const missingSprites: string[] = [];
    debugger;
    for (const trainer of trainers) {
      if (!trainer.battlePic) {
        console.warn(`Trainer missing battlePic property:`, trainer);
        continue;
      }

      const spriteFilePath = path.join(spritePath, `${trainer.battlePic}`);

      if (!existsSync(spriteFilePath)) {
        missingSprites.push(trainer.battlePic);
        console.log(`Missing sprite: ${spriteFilePath}`);
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Total trainers: ${trainers.length}`);
    console.log(`- Missing sprites: ${missingSprites.length}`);

    if (missingSprites.length > 0) {
      console.log(`\nTrainers without sprites:`);
      missingSprites.forEach((battlePic) => {
        console.log(`  - ${battlePic}.png`);
      });
    } else {
      console.log("✅ All trainers have sprite images!");
    }
  } catch (error) {
    console.error("Error checking trainer sprites:", error);
  }
}

// Run the check
checkTrainersWithoutSprites();
