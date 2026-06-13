import os
from PIL import Image

def main():
    sheet_path = '../TypeDefense_Tile_Variations/TypeDungeon_GroundRoads_PNG.png'
    if not os.path.exists(sheet_path):
        print(f"Error: Sheet path {sheet_path} does not exist!")
        return

    img = Image.open(sheet_path)
    # The sheet is 1024x1024, divided into a 3x3 grid
    # Each cell is roughly 341.33 x 341.33 pixels
    cell_w = 1024 // 3  # 341
    cell_h = 1024 // 3  # 341

    # Define coords for ground tiles
    # Format: (col, row, biome_name)
    grounds = [
        (0, 0, 'forest'),
        (1, 0, 'snow'),
        (2, 0, 'badlands'),
        (0, 1, 'swamp'),
        (1, 1, 'desert'),
        (2, 1, 'corrupted'),
        (0, 2, 'tropical'),
    ]

    # Define coords for road tiles
    # Format: (col, row, type_name)
    roads = [
        (1, 2, 'road_corner'),
        (2, 2, 'road_straight'),
    ]

    # Helper function to remove white background and make transparent
    def make_transparent(tile_img):
        rgba = tile_img.convert("RGBA")
        datas = rgba.getdata()
        newData = []
        for item in datas:
            # item is (R, G, B, A)
            # If it is white/near-white, make it transparent
            if item[0] >= 240 and item[1] >= 240 and item[2] >= 240:
                newData.append((0, 0, 0, 0))  # transparent
            else:
                newData.append(item)
        rgba.putdata(newData)
        return rgba

    # Ensure output folders exist
    os.makedirs('public/assets/tiles', exist_ok=True)

    # Cut and save roads first
    sliced_roads = {}
    for col, row, name in roads:
        left = col * cell_w
        top = row * cell_h
        right = 1024 if col == 2 else (col + 1) * cell_w
        bottom = 1024 if row == 2 else (row + 1) * cell_h

        cropped = img.crop((left, top, right, bottom))
        transparent_road = make_transparent(cropped)
        resized_road = transparent_road.resize((64, 64), Image.Resampling.LANCZOS)
        sliced_roads[name] = resized_road

    # Cut and save grounds, and copy the roads to each biome folder
    for col, row, biome in grounds:
        left = col * cell_w
        top = row * cell_h
        right = 1024 if col == 2 else (col + 1) * cell_w
        bottom = 1024 if row == 2 else (row + 1) * cell_h

        cropped = img.crop((left, top, right, bottom))
        resized_ground = cropped.resize((64, 64), Image.Resampling.LANCZOS)

        # Create biome folder
        biome_dir = f'public/assets/tiles/{biome}'
        os.makedirs(biome_dir, exist_ok=True)

        # Save ground
        resized_ground.save(f'{biome_dir}/ground.png', 'PNG')
        print(f"Saved {biome_dir}/ground.png")

        # Save roads in this biome folder
        sliced_roads['road_straight'].save(f'{biome_dir}/road_straight.png', 'PNG')
        sliced_roads['road_corner'].save(f'{biome_dir}/road_corner.png', 'PNG')
        print(f"Saved roads to {biome_dir}/")

if __name__ == '__main__':
    main()
