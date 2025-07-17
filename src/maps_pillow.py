from PIL import Image, ImageDraw, ImageFont
import os
import struct
import subprocess
import numpy as np
from scipy.cluster.vq import kmeans, vq
import struct

def gba_color_to_rgb(color):
    r = (color & 0x1F) << 3
    g = ((color >> 5) & 0x1F) << 3
    b = ((color >> 10) & 0x1F) << 3
    return (r, g, b)

def load_gbapal(path):
    with open(path, "rb") as f:
        data = f.read()
        return [gba_color_to_rgb(struct.unpack("<H", data[i:i+2])[0]) for i in range(0, len(data), 2)]

def apply_transparency(image, transparent_color=(57, 255, 20)):
    data = image.getdata()
    new_data = []
    for pixel in data:
        if pixel[:3] == transparent_color:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(pixel)
    image.putdata(new_data)
    return image

def merge_tilesets(bg_path, fg_path, output_path):
    bg_img = Image.open(bg_path)
    fg_img = Image.open(fg_path)

    # Ensure same width
    assert bg_img.width == fg_img.width, "Tileset widths must match."

    total_height = bg_img.height + fg_img.height
    merged = Image.new("RGBA", (bg_img.width, total_height))

    merged.paste(fg_img, (0, 0))
    merged.paste(bg_img, (0, fg_img.height))

    merged.save(output_path)
    print(f"✅ Merged saved to {output_path}")

    return bg_img, fg_img, merged

# === Settings ===
input_dir = "map_3_5"  # folder exported by HMA
# === Load map info ===
with open(os.path.join(input_dir, "info.txt"), "r") as f:
    map_name = f.readline().strip()
    width = int(f.readline())
    height = int(f.readline())

# === Load blockmap (2 bytes per block ID) ===
with open(os.path.join(input_dir, "blockmap.bin"), "rb") as f:
    blockmap = [struct.unpack("<H", f.read(2))[0] for _ in range(width * height)]

# === Tile cache ===
tile_cache = {}
def load_tile_from_sheet(sheet_image, tile_id):
    tile_width = 8
    tiles_per_row = sheet_image.width // tile_width
    row = tile_id // tiles_per_row
    col = tile_id % tiles_per_row
    box = (col * tile_width, row * tile_width, (col + 1) * tile_width, (row + 1) * tile_width)
    tile = sheet_image.crop(box).convert("RGBA")  # <-- enforce RGBA
    return tile

# === Draw map ===
map_img = Image.new("RGBA", (width * 16, height * 16))
def combine_tiles_into_block(tiles):
    # tiles is a list of 4 tiles (each 8x8)
    block_img = Image.new('RGBA', (16, 16))
    block_img.paste(tiles[0], (0, 0))
    block_img.paste(tiles[1], (8, 0))
    block_img.paste(tiles[2], (0, 8))
    block_img.paste(tiles[3], (8, 8))
    return block_img

font = ImageFont.truetype("arial.ttf", size=6)

def draw_tile_grid_overlay(block_img):
    draw = ImageDraw.Draw(block_img)
    # Draw borders between 8×8 tiles (light red lines)
    draw.line([(8, 0), (8, 16)], fill=(255, 0, 0, 128))   # vertical
    draw.line([(0, 8), (16, 8)], fill=(255, 0, 0, 128))   # horizontal
    # Label tile indices: 0 (top-left), 1 (top-right), 2 (bottom-left), 3 (bottom-right)
    index_labels = [(1, 1), (9, 1), (1, 9), (9, 9)]
    for i, (x, y) in enumerate(index_labels):
        draw.text((x, y), str(i), fill=(255, 255, 255, 255), font=font)
    return block_img

fg_tile_file = "fg_tileset.4bpp.lz"       # or .lz
bg_tile_file = "bg_tileset.4bpp.lz"       # or .lz
fg_palette = "fg_palette.gbapal"
bg_palette = "bg_palette.gbapal"

def run_gbagfx(tile_path, out_path):
    subprocess.run([
        "./gbagfx",
        tile_path,
        out_path
    ], check=True)

def run_gbagfx_full(tile_path, out_path, width):
    subprocess.run([
        "./gbagfx",
        tile_path,
        out_path,
        "-mwidth", str(width),
        # "-palette", pal_path
    ], check=True)

# === Run conversions ===
fg_tile_path = os.path.join(input_dir, fg_tile_file)
fg_pal_path = os.path.join(input_dir, fg_palette)
fg_out_path = os.path.join(input_dir, "fg_tileset.png")
bg_tile_path = os.path.join(input_dir, bg_tile_file)
bg_pal_path = os.path.join(input_dir, bg_palette)
bg_out_path = os.path.join(input_dir, "bg_tileset.png")

run_gbagfx(fg_tile_path, fg_tile_path.replace('.lz', ''))
run_gbagfx_full(fg_tile_path.replace('.lz', ''), fg_out_path, 16)
run_gbagfx(bg_tile_path, bg_tile_path.replace('.lz', ''))
run_gbagfx_full(bg_tile_path.replace('.lz', ''), bg_out_path, 16)
print("✅ gbagfx tile conversions complete.")

for i in range(13):
    run_gbagfx(f"{input_dir}/bg_palette_{i}.gbapal", f"{input_dir}/bg_palette_{i}.pal")
    run_gbagfx(f"{input_dir}/fg_palette_{i}.gbapal", f"{input_dir}/fg_palette_{i}.pal")

final_img = Image.new('RGBA', (width * 16, height * 16))
def load_blocks(filename):
    blocks = []
    path = os.path.join(input_dir, filename)
    if not os.path.exists(path):
        print(f"⚠️ Missing file: {filename}")
        return blocks
    print(f"📥 Loading: {filename}")
    with open(path, "rb") as f:
        while True:
            bytes_ = f.read(16)
            if len(bytes_) < 16:
                break
            bg_block = [struct.unpack("<H", bytes_[i:i+2])[0] for i in range(0, 8, 2)]
            fg_block = [struct.unpack("<H", bytes_[i:i+2])[0] for i in range(8, 16, 2)]
            blocks.append((bg_block, fg_block))
    print(f"✅ Loaded {len(blocks)} blocks")
    return blocks

def load_palettes(palette_dir, prefix, count):
    palettes = []
    for i in range(count):
        path = os.path.join(palette_dir, f"{prefix}_{i}.gbapal")
        with open(path, "rb") as f:
            entries = [struct.unpack("<H", f.read(2))[0] for _ in range(16)]
            palettes.append(entries)
    return palettes
bg_palettes = load_palettes(input_dir, "bg_palette", 13)
fg_palettes = load_palettes(input_dir, "fg_palette", 13)

def load_4bpp_tile(file_path):
    with open(file_path, "rb") as f:
        data = f.read()
    # 8x8 tile = 64 pixels = 32 bytes in 4bpp
    assert len(data) == 32
    pixels = []
    for byte in data:
        hi = (byte >> 4) & 0xF
        lo = byte & 0xF
        pixels.append(lo)
        pixels.append(hi)
    return np.array(pixels, dtype=np.uint8).reshape((8, 8))

def load_4bpp_tileset(path):
    with open(path, "rb") as f:
        data = f.read()
    assert len(data) % 32 == 0, "Tileset file must be a multiple of 32 bytes"
    num_tiles = len(data) // 32
    tiles = []
    for i in range(num_tiles):
        tile_data = data[i * 32:(i + 1) * 32]
        pixels = []
        for byte in tile_data:
            lo = byte & 0xF
            hi = (byte >> 4) & 0xF
            pixels.append(lo)
            pixels.append(hi)
        tile_array = np.array(pixels, dtype=np.uint8).reshape((8, 8))
        tiles.append(tile_array)
    return tiles  # list of np.array shape (8, 8)

def apply_palette_from_gbapal(indices, palette_rgb):
    img = Image.fromarray(indices, mode="P")

    # Flatten and pad palette to 256 entries
    flat_palette = []
    for rgb in palette_rgb:
        flat_palette.extend(rgb)
    flat_palette += [57, 255, 20] * (256 - len(palette_rgb))  # neon padding

    img.putpalette(flat_palette)
    return img.convert("RGBA")

def apply_palette_indexed(tile, palette_rgb):
    # Convert grayscale to 'P' (palette-indexed mode)
    paletted = tile.convert("P")
    # Build 768-entry RGB palette (256 * 3)
    flat_palette = [57, 255, 20]
    for i in range(1, 16):
        flat_palette.extend(palette_rgb[i])  # each is (r, g, b)
    # Pad remaining 240 entries with something (e.g., magenta or green)
    flat_palette.extend([57, 255, 20] * (256 - 16))
    paletted.putpalette(flat_palette)
    return paletted.convert("RGBA")  # to composite or view

blocks = load_blocks("blocks.bin")
# Load both sheets
# Don't use fg_primary for image; use a different name
output_path = os.path.join(input_dir, "merged_tileset.png")
bg_sheet_path = os.path.join(input_dir, "bg_tileset.png")
fg_sheet_path = os.path.join(input_dir, "fg_tileset.png")
bg_img, fg_img, merged_tileset = merge_tilesets(bg_sheet_path, fg_sheet_path, output_path)
bg_tile_count = (bg_img.height // 8) * (bg_img.width // 8)
fg_tile_count = (fg_img.height // 8) * (fg_img.width // 8)

subprocess.run(['./magick', output_path, '-colors', "16", '-define', 'png:exclude-chunk=bKGD', output_path])
run_gbagfx(output_path, output_path.replace('.png', '.4bpp'))
all_tiles = load_4bpp_tileset(output_path.replace('.png', '.4bpp'))

def get_tile_image(tile_id, tile_list, palette_rgb, hflip=False, vflip=False):
    # Get the indexed tile data (values 0–15)
    indexed_tile = tile_list[tile_id]
    # Create an RGBA image from the indexed data
    tile_img = Image.new("RGBA", (8, 8))
    pixels = tile_img.load()
    for y in range(8):
        for x in range(8):
            index = indexed_tile[y][x]
            if index == 0:
                # Transparent color override
                pixels[x, y] = (57, 255, 20, 0)
            else:
                r, g, b = palette_rgb[index]
                pixels[x, y] = (r, g, b, 255)
    # Flip if needed
    if hflip:
        tile_img = tile_img.transpose(Image.FLIP_LEFT_RIGHT)
    if vflip:
        tile_img = tile_img.transpose(Image.FLIP_TOP_BOTTOM)
    return tile_img

def render_block_with_source(blocks, block_id, fg, tile_list, palettes):
    if block_id >= len(blocks):
        print(f"⚠️ Block ID {block_id} out of range")
        return [Image.new("RGBA", (8, 8), (255, 0, 255, 255))] * 4
    tile_ids = blocks[block_id][1 if fg else 0]  # 0 = BG, 1 = FG
    tiles = []
    for tile_id in tile_ids:
        base_id = tile_id & 0x3FF
        hflip = (tile_id >> 10) & 1
        vflip = (tile_id >> 11) & 1
        palette_index = (tile_id >> 12) & 0xF
        if palette_index >= len(palettes):
            print(f"⚠️ Palette index {palette_index} out of range")
            palette_rgb = [(57, 255, 20)] * 16  # fallback
        else:
            palette_rgb = palettes[palette_index]
        tile_img = get_tile_image(base_id, tile_list, palette_rgb, hflip=hflip, vflip=vflip)
        tiles.append(tile_img)
    return tiles
    
palettes = [load_gbapal(f"{input_dir}/fg_palette_{i}.gbapal") for i in range(7)]
palettes += [load_gbapal(f"{input_dir}/bg_palette_{i}.gbapal") for i in range(7, 13)]

# Rendering
for y in range(height):
    for x in range(width):
        raw_block_id = blockmap[y * width + x]
        block_id = raw_block_id & 0x3FF
        # Background
        tiles = render_block_with_source(blocks, block_id, fg=False, tile_list=all_tiles, palettes=palettes)
        block_img = combine_tiles_into_block(tiles)
        final_img.paste(block_img, (x * 16, y * 16))
        # Foreground
        tiles = render_block_with_source(blocks, block_id, fg=True, tile_list=all_tiles, palettes=palettes)
        block_img = combine_tiles_into_block(tiles)
        block_img = apply_transparency(block_img)
        final_img.paste(block_img, (x * 16, y * 16), mask=block_img.getchannel("A"))

# === Save ===
safe_name = map_name.replace(" ", "_")
output_file = f"{safe_name}.png"
final_img.save(output_file)
print(f"✅ Saved: {output_file}")