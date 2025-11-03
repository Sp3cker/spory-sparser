# Spory-Sparser

Named so to prevent further diluting the branding of the `Pory...` brand of products.

## About

This library primarily parses `.inc` files from a Pokémon Decompilation Project repository and produces JSON describing the locations and methods of obtaining items & gift pokémon.
It also can parse your `trainer_parties.h` and document what trainers are on each Map, if you're old-school.
The resultant JSON looks like this:

```json
"MAP_ROUTE109": [
    {
      "thisLevelsId": "MAP_ROUTE109",
      "baseMap": "MAP_ROUTE109",
      "levelLabel": "",
      "shopItems": [],
      "pickupItems": [
        {
          "coords": [
            10,
            24
          ],
          "item": "ITEM_PP_UP",
          "type": "object_event"
        },
      ],
      "scriptedGives": [
        {
          "items": [
            {
              "name": "ITEM_CHESTO_BERRY",
              "quantity": 1
            }
          ],
          "pokemon": [],
          "explanation": "Florist that gives you berries",
          "scriptName": "Route104_EventScript_ExpertF::"
        },
      ],
      "image": "Route104",
      "trainerRefs": [
        {
          "id": "TRAINER_IVAN",
          "script": "Route104_EventScript_Ivan",
          "rematch": false
        },
        {
          "id": "TRAINER_BILLY",
          "script": "Route104_EventScript_Billy",
          "rematch": false
        },]

```

The below documentation may not use terminology the way a rom-hacker would be used to, given my inexperience working in the space. I'm open to renaming/refactoring to better align with what everyone else calls things.

## Parsing Item locations

Your interested in `src/parseMaps`.

## Terminology

The source uses some pretty loose terminology, but this is how I look at it at a high level:

### `Level`

`spory-sparser` sees a new `Level` whenever it finds a `.inc` file in the `maps/*` directory.

### What is a `Map`?

A `Map` is one or more `Level`s (explained below).
`spory-sparser` takes the folder name, such as`AquaHideout_1F/` of a folder that contains a `.inc` file. It then uses the test _before_ the first `_` in that folder name, so `AquaHideout`.

### Determining the Level an item is given.

Spory-sparser looks at the
**Preface**: You only really care about `main.ts`, and `/parseMaps/*`. Everything else has nothing to do with parsing items.

1. The `incParser.` is given a script block
