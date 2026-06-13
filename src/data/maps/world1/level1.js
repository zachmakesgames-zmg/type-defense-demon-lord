// ─── World 1 Level 1 Map ─────────────────────────────────────────
// 16×16 grid, 1 road (level number = roads, capped at 4)
// Road enters from the left edge and winds to the base at center

// Tile type shorthand:
// G = ground, D = decoration (tree), B = boulder
// RS = road_straight, RC = road_corner
// Rotation: 0 = default, 90, 180, 270

const G  = { type: 'ground', rotation: 0 };
const D  = { type: 'decoration', rotation: 0 };
const B  = { type: 'boulder', rotation: 0 };

// Road pieces:
const RV = { type: 'road_straight', rotation: 0 };    // vertical
const RH = { type: 'road_straight', rotation: 90 };   // horizontal
const C1 = { type: 'road_corner', rotation: 0 };      // turns from bottom to right (└)
const C2 = { type: 'road_corner', rotation: 90 };     // turns from left to bottom (┘)
const C3 = { type: 'road_corner', rotation: 180 };    // turns from top to left (┐)
const C4 = { type: 'road_corner', rotation: 270 };    // turns from right to top (┌)

const grid = [
  // Row 0 (top)
  [D, G, D, G, G, B, G, D, G, G, B, G, G, D, G, G],
  // Row 1
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, D],
  // Row 2
  [D, G, B, G, D, G, G, G, G, G, G, D, G, G, G, G],
  // Row 3
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  // Row 4 - road enters from left
  [G, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, C3, G, D],
  // Row 5
  [D, G, G, G, G, G, G, G, G, G, G, G, G, RV, G, G],
  // Row 6
  [G, G, D, G, B, G, G, G, G, G, D, G, G, RV, G, G],
  // Row 7 - base row top
  [G, G, G, G, G, G, C4, RH, RH, RH, RH, RH, RH, C2, G, G],
  // Row 8 - base row bottom (base at 7,7 and 8,8)
  [B, G, G, G, G, G, RV, G, G, G, G, G, G, G, D, G],
  // Row 9
  [G, G, D, G, G, G, RV, G, G, G, G, G, G, G, G, G],
  // Row 10
  [G, G, G, G, G, G, RV, G, D, G, B, G, G, D, G, G],
  // Row 11
  [D, G, G, G, G, G, C1, RH, RH, RH, RH, RH, RH, RH, RH, G],
  // Row 12
  [G, G, B, G, G, G, G, G, G, G, G, G, G, G, G, G],
  // Row 13
  [G, G, G, G, D, G, G, G, G, D, G, G, B, G, G, G],
  // Row 14
  [G, D, G, G, G, G, G, G, G, G, G, G, G, G, D, G],
  // Row 15 (bottom)
  [G, G, G, B, G, D, G, G, G, G, G, D, G, G, G, G],
];

const level1 = {
  world: 1,
  level: 1,
  biome: 'forest',
  grid,
  // Road waypoints in pixel coordinates (center of road tiles)
  // Path: enter left → across top → down right side → across bottom → up left-center → into base
  roads: [
    {
      waypoints: [
        { x: 0, y: 288 },      // enter from left edge (row 4)
        { x: 864, y: 288 },    // across to column 13
        { x: 864, y: 480 },    // down to row 7
        { x: 416, y: 480 },    // left to column 6
        { x: 416, y: 736 },    // down to row 11
        { x: 992, y: 736 },    // across to right
        // Actually let's simplify: single winding road
      ],
    },
  ],
  // Road path in pixel coordinates — winding path to the base center
  road: [
    { x: 0, y: 288 },        // enter from left edge, row 4
    { x: 864, y: 288 },      // across to col 13
    { x: 864, y: 480 },      // down to row 7
    { x: 416, y: 480 },      // left to col 6
    { x: 416, y: 736 },      // down to row 11
    { x: 960, y: 736 },      // right to col 15
    { x: 960, y: 160 },      // up to row 2.5
    { x: 512, y: 160 },      // left to center
    { x: 512, y: 512 },      // down into the base
  ],
  // 10 tower sites — grid coordinates (will convert to pixels)
  towerSites: [
    { gx: 2,  gy: 3 },   // left of road, above
    { gx: 5,  gy: 3 },   // above road, left-center
    { gx: 9,  gy: 3 },   // above road, right-center
    { gx: 12, gy: 3 },   // above road, right
    { gx: 10, gy: 6 },   // between road rows
    { gx: 3,  gy: 6 },   // between road rows, left
    { gx: 8,  gy: 9 },   // below middle road
    { gx: 3,  gy: 10 },  // left side lower
    { gx: 10, gy: 10 },  // right of lower road
    { gx: 14, gy: 10 },  // far right lower
  ],
  // Base position (grid coordinates of top-left corner of 2×2 base)
  basePosition: { gx: 7, gy: 7 },
};

export default level1;
