// ─── World 1 Level 4 Map ─────────────────────────────────────────
// 16×16 grid, 1 road (Level 4 introduces A and ; keys)

const G  = { type: 'ground', rotation: 0 };
const D  = { type: 'decoration', rotation: 0 };
const B  = { type: 'boulder', rotation: 0 };

const RV = { type: 'road_straight', rotation: 0 };
const RH = { type: 'road_straight', rotation: 90 };
const C1 = { type: 'road_corner', rotation: 0 };      // └
const C2 = { type: 'road_corner', rotation: 90 };     // ┘
const C3 = { type: 'road_corner', rotation: 180 };    // ┐
const C4 = { type: 'road_corner', rotation: 270 };    // ┌

const grid = [
  // Row 0
  [D, G, G, B, G, G, B, G, G, D, G, G, B, G, G, D],
  // Row 1
  [G, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, C3, G],
  // Row 2
  [D, G, G, G, G, G, G, G, G, G, G, G, G, G, RV, G],
  // Row 3
  [G, G, B, G, G, B, G, G, D, G, G, B, G, G, RV, G],
  // Row 4
  [G, C4, RH, RH, RH, RH, RH, RH, RH, RH, RH, C3, G, G, RV, G],
  // Row 5
  [G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, RV, D],
  // Row 6
  [D, RV, G, G, B, G, G, G, G, G, G, RV, G, G, RV, G],
  // Row 7 (base row top)
  [G, RV, G, G, C4, RH, RH, G, G, G, G, RV, G, G, RV, G],
  // Row 8 (base row bottom)
  [G, RV, G, G, RV, G, G, G, G, G, G, RV, G, G, RV, G],
  // Row 9
  [B, RV, G, G, RV, G, G, G, G, B, G, RV, G, G, RV, G],
  // Row 10
  [G, RV, G, G, RV, G, G, G, G, G, G, RV, G, B, RV, G],
  // Row 11
  [G, RV, G, G, C1, RH, RH, RH, RH, RH, RH, C3, G, G, RV, G],
  // Row 12
  [D, RV, G, G, G, G, G, G, G, G, G, G, G, G, RV, D],
  // Row 13
  [G, RV, G, B, G, G, D, G, G, B, G, G, B, G, RV, G],
  // Row 14
  [G, C1, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, C2, G],
  // Row 15
  [D, G, G, B, G, G, B, G, G, D, G, G, B, G, G, D],
];

const level4 = {
  world: 1,
  level: 4,
  biome: 'forest',
  grid,
  road: [
    { x: 0, y: 96 },         // enter from left, row 1
    { x: 928, y: 96 },       // right to col 14
    { x: 928, y: 928 },      // down to row 14
    { x: 96, y: 928 },       // left to col 1
    { x: 96, y: 288 },       // up to row 4
    { x: 736, y: 288 },      // right to col 11
    { x: 736, y: 736 },      // down to row 11
    { x: 288, y: 736 },      // left to col 4
    { x: 288, y: 480 },      // up to row 7.5 (align with base)
    { x: 512, y: 480 },      // right into center col 7.5 into base
  ],
  towerSites: [
    { gx: 6,  gy: 2 },
    { gx: 9,  gy: 2 },
    { gx: 12, gy: 2 },
    { gx: 3,  gy: 5 },
    { gx: 6,  gy: 5 },
    { gx: 9,  gy: 5 },
    { gx: 6,  gy: 9 },
    { gx: 9,  gy: 9 },
    { gx: 3,  gy: 12 },
    { gx: 12, gy: 12 },
  ],
  basePosition: { gx: 7, gy: 7 },
};

export default level4;
