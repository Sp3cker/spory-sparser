Below is a “road-map” of the engine’s own pipeline for turning the 16-colour JASC-PAL files you see in graphics/items/icon_palettes/*.pal into the compressed runtime assets that the game shows on–screen. Each bullet tells you ❶ what the step does, ❷ where in the repo it is implemented, and ❸ why it matters to your TypeScript port. Skim the cited excerpts if you need to see the exact logic.
Reading a .pal file (JASC-PAL → in-RAM palette)
Implementation
]
What it does
Guarantees the file really is JASC-PAL (“JASC-PAL / 0100 / <num>”).
Parses each decimal triplet 0-255 and records it in an in-memory struct Palette.
TS take-away: replicate this parser exactly; the file format is fixed and <40 lines.
Writing that palette into GBA colour-space (in-RAM palette → .gbapal)
;
What it does
Down-converts 8-bit RGB to GBA BGR555.
Streams the 16 (or 256) half-words to disk.
TS take-away: after parsing, perform this 5-bit conversion before you shove data into whatever image buffer / canvas you’re targeting.
Converting the PNG itself to bit-plane (tile) data that references those palette indices
PNG
and later
order
What it does
Reads the source PNG, optionally changes bit-depth, then iterates row-by-row to lay pixels into GBA’s 8×8 planar/tiled arrangement.
Handles 1-, 4-, 8-bpp; the icons are 4-bpp (16-colour) so you’ll follow ConvertToTiles4Bpp.
TS take-away: you need identical bit-shuffling to end up with the same “ccyyyx xx” bit layout the SNES/ GBA expects (see the SNESLab article you linked).
Lossless compression (optional but used by the build-system)
INCBIN
What it does
Runs Nintendo’s LZ77 flavour so the binary blobs ship smaller.
TS take-away: if you’re only previewing in a tool/web-page you can skip this. Runtime needs to decompress, but your TS side can probably leave the data raw.
Runtime loading inside the game
palette
and the look-ups:
}
What it does
Decompresses the .4bpp.lz tile blob, maps it into a 32×32 sprite, then decompresses the .gbapal.lz palette to OBJ palette slot 2.
TS take-away: this is the last mile—you just need to mimic “index → colour” with the palette you produced in step 2.
Where the data is declared so the build knows what to assemble
;
Not code you need to port, but useful when you’re matching file-names: simply strip the gItemIconPalette_ prefix to get the base palette name.
Putting it all together for your TypeScript tool
A faithful port only needs three of the C routines above:
JASC parser → produce array\<{r,g,b}\> (step 1).
8-bit→5-bit reduction (step 2).
4-bpp tile writer that walks the PNG’s pixel rows eight-at-a-time and emits bytes in the same left-pixel/right-pixel order as ConvertToTiles4Bpp (step 3).
If you keep those algorithms byte-for-byte identical to the cited C, the .pal + .png pairs you generate will match what the game (and its existing build scripts) already understand.