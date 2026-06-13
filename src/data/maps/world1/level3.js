// ─── World 1 Level 3 Map ─────────────────────────────────────────
// 16×16 grid, 1 road (Level 3 introduces S and L keys)

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
  [G, D, G, G, B, G, G, D, G, G, B, G, G, G, D, G],
  // Row 1
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  // Row 2
  [D, G, G, G, G, G, G, G, G, G, G, G, G, G, G, D],
  // Row 3
  [G, G, C4, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, C2, G, G],
  // Row 4
  [B, G, RV, G, G, G, G, G, G, G, G, G, G, RV, G, B],
  // Row 5
  [G, G, RV, G, G, G, G, G, G, G, G, G, G, RV, G, G],
  // Row 6
  [G, D, RV, G, G, G, G, G, G, G, G, G, G, RV, D, G],
  // Row 7 (base row top)
  [G, G, RV, G, G, G, G, G, G, RH, RH, RH, RH, C3, G, G],
  // Row 8 (base row bottom)
  [D, G, RV, G, G, G, G, G, G, G, G, G, G, G, G, D],
  // Row 9
  [G, G, RV, G, G, G, G, G, G, G, G, G, G, G, G, G],
  // Row 10
  [G, G, C1, RH, RH, RH, RH, RH, RH, RH, RH, C3, G, B, G, G],
  // Row 11
  [B, G, G, G, G, G, G, G, G, G, G, RV, G, G, G, G],
  // Row 12
  [G, G, D, G, G, B, G, G, D, G, G, RV, G, G, D, G],
  // Row 13
  [G, G, G, G, G, G, G, G, G, G, G, RV, G, G, G, G],
  // Row 14
  [D, G, G, G, G, G, G, G, G, G, G, RV, G, G, B, G],
  // Row 15
  [G, G, B, G, G, D, G, G, B, G, G, RV, G, G, G, G],
];

const level3 = {
  world: 1,
  level: 3,
  biome: 'forest',
  grid,
  road: [
    { x: 736, y: 992 },      // enter from bottom, col 11
    { x: 736, y: 672 },      // up to row 10
    { x: 160, y: 672 },      // left to col 2
    { x: 160, y: 224 },      // up to row 3
    { x: 864, y: 224 },      // right to col 13
    { x: 864, y: 480 },      // down to row 7 (align with base)
    { x: 512, y: 480 },      // left to center col 7.5 into base
  ],
  towerSites: [
    { gx: 5,  gy: 1 },
    { gx: 9,  gy: 1 },
    { gx: 5,  gy: 5 },
    { gx: 9,  gy: 5 },
    { gx: 1,  gy: 7 },
    { gx: 4,  gy: 8 },
    { gx: 14, gy: 6 },
    { gx: 5,  gy: 12 },
    { gx: 9,  gy: 12 },
    { gx: 13, gy: 12 },
  ],
  basePosition: { gx: 7, gy: 7 },
};

export default level3;
