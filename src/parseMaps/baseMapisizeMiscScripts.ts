import {
  IncScriptEvent,
  IncTrainer,
  IncBattle,
  IncScriptedEventSchema,
  IncTrainerSchema,
  IncBattleSchema,
} from "../validators/levelIncData.ts";

export const baseMapisizeMiscScripts = (
  scriptedGives: IncScriptEvent[],
  trainerRefs: IncTrainer[],
  battleRefs: IncBattle[],
  miscScriptDict: Map<
    string,
    {
      scriptedGives: IncScriptEvent[];
      trainerRefs: IncTrainer[];
      battleRefs: IncBattle[];
    }
  >
) => {
  const splitRegex = /^(.*?)_EventScript/; // Text before _EventScript

  const toBaseMap = (scriptName: string) => {
    const match = scriptName.match(splitRegex);
    let maybeBaseMap: string;
    if (match) {
      maybeBaseMap = `${match[1].toUpperCase().replace(/_/g, "_")}`;
      const [mapName] = maybeBaseMap.split("_");
      switch (mapName) {
        case "LILYCOVECITY":
          maybeBaseMap = "LILYCOVE_CITY";
          break;
        default:
          maybeBaseMap = `${mapName}`;
      }
    } else {
      maybeBaseMap = "MAP_UNKNOWN";
    }
    return `MAP_${maybeBaseMap}`;
  };

  ["scriptedGives", "trainerRefs", "battleRefs"].forEach((key) => {
    if (key !== "scriptedGives" && key !== "trainerRefs" && key !== "battleRefs") {
      return;
    }

    const items = key === "scriptedGives" ? scriptedGives : key === "trainerRefs" ? trainerRefs : battleRefs;

    items.map((scriptOrRef) => {
      const maybeBaseMap = toBaseMap(
        key === "scriptedGives"
          ? (scriptOrRef as IncScriptEvent).scriptName
          : (scriptOrRef as IncTrainer | IncBattle).script
      );

      if (key === "scriptedGives") {
        IncScriptedEventSchema.parse(scriptOrRef);
      } else if (key === "trainerRefs") {
        IncTrainerSchema.parse(scriptOrRef);
      } else if (key === "battleRefs") {
        IncBattleSchema.parse(scriptOrRef);
      }

      if (miscScriptDict.has(maybeBaseMap)) {
        miscScriptDict.get(maybeBaseMap)![key].push(
          //@ts-ignore
          scriptOrRef
        );
      } else {
        miscScriptDict.set(maybeBaseMap, {
          scriptedGives: [],
          trainerRefs: [],
          battleRefs: [],
        });
        miscScriptDict.get(maybeBaseMap)![key].push(
          //@ts-ignore
          scriptOrRef
        );
      }
    });
  });
};
