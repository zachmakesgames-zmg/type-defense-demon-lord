// ─── World 1 Level 5 Map ─────────────────────────────────────────
// 16×16 grid, 1 road (Level 5 introduces G and H keys - full Home Row)

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
  [D, G, B, G, G, D, G, G, B, G, G, D, G, G, B, G],
  // Row 1
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, D],
  // Row 2
  [G, G, C4, RH, RH, RH, RH, RH, RH, RH, RH, RH, C2, G, G, G],
  // Row 3
  [D, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, D],
  // Row 4
  [G, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G],
  // Row 5
  [G, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G],
  // Row 6
  [B, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, B],
  // Row 7 (base row top)
  [G, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G],
  // Row 8 (base row bottom)
  [G, G, RV, G, G, G, G, RV, G, G, G, G, RV, G, G, G],
  // Row 9
  [D, G, RV, G, G, G, G, RV, G, G, G, G, RV, G, G, D],
  // Row 10
  [G, G, RV, G, G, G, G, RV, G, G, G, G, RV, G, G, G],
  // Row 11
  [G, G, RV, G, G, G, G, RV, G, G, G, G, C1, RH, RH, RH],
  // Row 12
  [B, G, RV, G, G, G, G, RV, G, G, G, G, G, G, G, B],
  // Row 13
  [G, G, C1, RH, RH, RH, C3, RV, G, G, G, G, G, G, G, G],
  // Row 14
  [G, G, G, G, G, G, G, G, G, D, G, G, B, G, G, G],
  // Row 15
  [D, G, B, G, G, D, G, G, B, G, G, D, G, G, B, G],
];

const level5 = {
  world: 1,
  level: 5,
  biome: 'forest',
  grid,
  road: [
    { x: 992, y: 736 },      // enter from right edge, row 11
    { x: 800, y: 736 },      // left to col 12
    { x: 800, y: 160 },      // up to row 2
    { x: 160, y: 160 },      // left to col 2
    { x: 160, y: 864 },      // down to row 13
    { x: 480, y: 864 },      // right to col 7.5
    { x: 480, y: 512 },      // up to base
  ],
  towerSites: [
    { gx: 5,  gy: 4 },
    { gx: 9,  gy: 4 },
    { gx: 5,  gy: 9 },
    { gx: 9,  gy: 9 },
    { gx: 1,  gy: 5 },
    { gx: 14, gy: 5 },
    { gx: 1,  gy: 11 },
    { gx: 14, gy: 11 },
    { gx: 4,  gy: 14 },
    { gx: 10, gy: 14 },
  ],
  basePosition: { gx: 7, gy: 7 },
};

export default level5;
