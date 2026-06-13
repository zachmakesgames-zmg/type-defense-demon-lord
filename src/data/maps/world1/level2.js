// ─── World 1 Level 2 Map ─────────────────────────────────────────
// 16×16 grid, 1 road (Level 2 introduces D and K keys)

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
  [G, D, G, G, RV, G, B, G, G, D, G, G, B, G, G, G],
  // Row 1
  [G, G, G, G, RV, G, G, G, G, G, G, G, G, G, D, G],
  // Row 2
  [D, G, G, G, RV, G, G, G, G, G, G, G, G, G, G, G],
  // Row 3
  [G, G, G, G, RV, G, G, C4, RH, RH, RH, C2, G, G, B, G],
  // Row 4
  [G, B, G, G, RV, G, G, RV, G, G, G, RV, G, G, G, G],
  // Row 5
  [G, G, G, G, RV, G, G, RV, G, G, G, RV, G, D, G, G],
  // Row 6
  [D, G, G, G, RV, G, G, RV, G, G, G, RV, G, G, G, D],
  // Row 7 (base row top)
  [G, G, B, G, RV, G, G, G, G, G, G, RV, G, G, G, G],
  // Row 8 (base row bottom)
  [G, G, G, G, RV, G, G, G, G, G, G, RV, G, B, G, G],
  // Row 9
  [G, D, G, G, RV, G, G, G, G, G, G, RV, G, G, G, G],
  // Row 10
  [G, G, G, G, RV, G, G, G, G, G, G, RV, G, G, D, G],
  // Row 11
  [G, G, G, G, C1, RH, RH, RH, RH, RH, RH, C3, G, G, G, G],
  // Row 12
  [B, G, G, G, G, G, G, G, G, G, G, G, G, G, G, B],
  // Row 13
  [G, G, D, G, G, B, G, G, D, G, G, B, G, G, G, G],
  // Row 14
  [G, G, G, G, G, G, G, G, G, G, G, G, G, D, G, G],
  // Row 15
  [D, G, G, B, G, G, G, G, G, G, G, B, G, G, G, G],
];

const level2 = {
  world: 1,
  level: 2,
  biome: 'forest',
  grid,
  road: [
    { x: 288, y: 0 },        // enter from top, col 4
    { x: 288, y: 736 },      // down to row 11
    { x: 736, y: 736 },      // right to col 11
    { x: 736, y: 224 },      // up to row 3
    { x: 512, y: 224 },      // left to center col 7.5
    { x: 512, y: 512 },      // down to base
  ],
  towerSites: [
    { gx: 2,  gy: 2 },
    { gx: 2,  gy: 7 },
    { gx: 2,  gy: 12 },
    { gx: 6,  gy: 2 },
    { gx: 6,  gy: 7 },
    { gx: 6,  gy: 12 },
    { gx: 9,  gy: 5 },
    { gx: 13, gy: 2 },
    { gx: 13, gy: 7 },
    { gx: 13, gy: 12 },
  ],
  basePosition: { gx: 7, gy: 7 },
};

export default level2;
