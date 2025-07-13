# Spory-Sparser
Named so to prevent further diluding the branding of the `Pory...` brand of products.
## About
This library primarily parses `.inc` files from a Pokémon Decompilation Project repository and produces JSON describing the locations and methods of obtaining items & gift pokémon.

The resultant JSON looks like this:
```
```
The below documentation may not use terminology the way a rom-hacker would be used to, given my inexperience working in the space. I'm open to renaming/refactoring to better align with what everyone else calls things.

## Parsing Item locations
### Abstract
To me, there are 4 ways to get items:
1. The game gives you an item via `giveitem` and `giveitemfast`

    1.A *Or* as the result of a script utilizing `dynmultipush`.
2. You buy an item from a `Mart`.
3. You find a `Pickup Item` in the overworld

This library finds those items.
## Terminology
The source uses some pretty loose terminology, but this is how I look at it at a high level:
### `Level`
`spory-sparser` sees a new `Level` whenever it finds a `.inc` file in the `maps/*` directory.


### What is a `Map`?
A `Map` is one or more `Level`s (explained below).
`spory-sparser` takes the folder name, such as`AquaHideout_1F/` of a folder that contains a `.inc` file. It then uses the test *before* the first `_` in that folder name, so `AquaHideout`.
### Determining the Level an item is given.
Spory-sparser looks at the 
**Preface**: You only really care about `main.ts`, and `/parseMaps/*`. Everything else has nothing to do with parsing items.


1. The `incParser.` is given a script block

