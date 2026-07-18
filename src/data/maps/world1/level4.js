// ─── World 1 Level 4 Map ─────────────────────────────────────
const G  = { type: 'ground', rotation: 0 };
const RV = { type: 'road_straight', rotation: 0 };
const RH = { type: 'road_straight', rotation: 90 };
const C1 = { type: 'road_corner', rotation: 0 };      // └
const C2 = { type: 'road_corner', rotation: 90 };     // ┘
const C3 = { type: 'road_corner', rotation: 180 };    // ┐
const C4 = { type: 'road_corner', rotation: 270 };    // ┌

const grid = [
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, C4, RH, RH, RH, RH, RH],
  [G, G, C4, RH, RH, C3, G, G, G, G, RV, G, G, G, G, G],
  [G, G, RV, G, G, RV, G, G, G, G, RV, G, G, G, G, G],
  [G, G, RV, G, G, RV, G, G, G, G, RV, G, G, G, G, G],
  [G, G, RV, G, G, RV, G, G, G, G, C1, RH, RH, RH, C3, G],
  [G, G, RV, G, G, C1, RH, G, G, G, G, G, G, G, RV, G],
  [G, G, RV, G, G, G, G, G, G, G, G, G, G, G, RV, G],
  [G, G, RV, G, G, G, G, G, G, G, G, G, G, G, RV, G],
  [G, G, RV, G, G, G, G, G, G, G, G, G, G, G, RV, G],
  [G, G, RV, G, G, G, G, G, G, G, G, G, G, G, RV, G],
  [G, G, RV, G, G, G, G, G, G, G, G, G, G, G, RV, G],
  [G, G, C1, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, C2, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
];

const level4 = {
  world: 1,
  level: 4,
  biome: 'forest',
  grid,
  road: [
    { x: 1024, y: 96 },
    { x: 672, y: 96 },
    { x: 672, y: 352 },
    { x: 928, y: 352 },
    { x: 928, y: 800 },
    { x: 160, y: 800 },
    { x: 160, y: 160 },
    { x: 352, y: 160 },
    { x: 352, y: 416 },
    { x: 416, y: 416 }
  ],
  towerSites: [
    { gx: 1, gy: 1 },
    { gx: 11, gy: 2 },
    { gx: 3, gy: 3 },
    { gx: 9, gy: 3 },
    { gx: 11, gy: 4 },
    { gx: 6, gy: 5 },
    { gx: 3, gy: 11 },
    { gx: 13, gy: 11 },
    { gx: 5, gy: 13 },
    { gx: 11, gy: 13 }
  ],
  basePosition: { gx: 7, gy: 7 },
};

export default level4;
