import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Trainer {
  id: string;
  name: string;
  level: string;
  battlePic: string;
  party: any[];
}

interface TrainerData {
  [key: string]: Trainer[];
}

// Read and parse the trainers.json file
const trainersPath = resolve('trainers.json');
const trainersData: TrainerData = JSON.parse(readFileSync(trainersPath, 'utf-8'));

// Collect all trainer IDs
const trainerIds: string[] = [];
const trainerDetails: { id: string; level: string; name: string }[] = [];

for (const [level, trainers] of Object.entries(trainersData)) {
  for (const trainer of trainers) {
    trainerIds.push(trainer.id);
    trainerDetails.push({
      id: trainer.id,
      level: level,
      name: trainer.name
    });
  }
}

// Count occurrences of each ID
const idCounts = new Map<string, number>();
for (const id of trainerIds) {
  idCounts.set(id, (idCounts.get(id) || 0) + 1);
}

// Find duplicates
const duplicates = new Map<string, { count: number; locations: { level: string; name: string }[] }>();

for (const [id, count] of idCounts) {
  if (count > 1) {
    const locations = trainerDetails
      .filter(trainer => trainer.id === id)
      .map(trainer => ({ level: trainer.level, name: trainer.name }));

    duplicates.set(id, { count, locations });
  }
}

// Output results
console.log(`Total trainers: ${trainerIds.length}`);
console.log(`Unique trainer IDs: ${idCounts.size}`);
console.log(`Duplicate trainer IDs: ${duplicates.size}`);
console.log('');

if (duplicates.size > 0) {
  console.log('DUPLICATE TRAINER IDs:');
  console.log('====================');

  for (const [id, data] of duplicates) {
    console.log(`\nID: ${id} (appears ${data.count} times)`);
    console.log('Locations:');
    for (const location of data.locations) {
      console.log(`  - Level: ${location.level}, Name: ${location.name}`);
    }
  }
} else {
  console.log('No duplicate trainer IDs found!');
}