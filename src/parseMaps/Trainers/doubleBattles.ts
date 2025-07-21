type MapObjectEvent = {
  graphics_id: string;
  x: number;
  y: number;
  elevation: string;
  movement_type: string;
  movement_range_x: string;
  movement_range_y: string;
  trainer_type: string;
  trainer_sight_or_berry_tree_id: string;
  script: string;
  flag: string;
};
export const doubleBattles = (mapJsonData: MapObjectEvent[]) => {
  const maybeDoubles = new Map();
  const alreadyCounted = new Set<string>();
  //MOVEMENT_TYPE_FACE_DOWN
  // MOVEMENT_TYPE_FACE_UP
  mapJsonData
    .filter((obj) => obj.trainer_type === "TRAINER_TYPE_NORMAL")
    .forEach((obj, index) => {
      const thisTrainersX = obj.x;
      const thisTrainersY = obj.y;
      const nearbyTrainers = mapJsonData
        .filter((obj) => obj.trainer_type === "TRAINER_TYPE_NORMAL")
        .filter((otherObj, otherIndex) => {
          if (index === otherIndex) return false; // Skip self
          if (alreadyCounted.has(otherObj.script)) return false; // Skip already counted
          const xDiff = Math.abs(otherObj.x - thisTrainersX);
          const yDiff = Math.abs(otherObj.y - thisTrainersY);
          return xDiff <= 6 && yDiff <= 6;
        })
        .filter((otherObj) => {
          // Check if the player could be in line-of-sight of both trainers
          const playerInLineOfSight =
            thisTrainersX === otherObj.x || thisTrainersY === otherObj.y;
          return playerInLineOfSight;
        });
      if (nearbyTrainers.length > 1) {
        maybeDoubles.set(obj.script, {
          thisTrainer: obj.script,
          trainers: nearbyTrainers.map((t) => t.script),
          x: thisTrainersX,
          y: thisTrainersY,
        });
      }
    });
  return Array.from(maybeDoubles.values());
};
