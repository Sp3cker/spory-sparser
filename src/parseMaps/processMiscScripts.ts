import {
  IncScriptEvent,
  IncTrainer,
  IncScriptedEventSchema,
  IncTrainerSchema,
} from "../validators/levelIncData.js";

export const processMiscScripts = (
  scriptedGives: IncScriptEvent[],
  trainerRefs: IncTrainer[],
  miscScriptDict: Map<
    string,
    { scriptedGives: IncScriptEvent[]; trainerRefs: IncTrainer[] }
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

  ["scriptedGives", "trainerRefs"].forEach((key) => {
    if (key !== "scriptedGives" && key !== "trainerRefs") {
      return;
    }

    const items = key === "scriptedGives" ? scriptedGives : trainerRefs;

    items.map((scriptOrRef) => {
      const maybeBaseMap = toBaseMap(
        key === "scriptedGives"
          ? (scriptOrRef as IncScriptEvent).scriptName
          : (scriptOrRef as IncTrainer).script
      );

      if (key === "scriptedGives") {
        IncScriptedEventSchema.parse(scriptOrRef);
      } else {
        IncTrainerSchema.parse(scriptOrRef);
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
        });
        miscScriptDict.get(maybeBaseMap)![key].push(
          //@ts-ignore
          scriptOrRef
        );
      }
    });
  });
};
