// ─── World 1 Level 2 Map ─────────────────────────────────────
const G  = { type: 'ground', rotation: 0 };
const RV = { type: 'road_straight', rotation: 0 };
const RH = { type: 'road_straight', rotation: 90 };
const C1 = { type: 'road_corner', rotation: 0 };      // └
const C2 = { type: 'road_corner', rotation: 90 };     // ┘
const C3 = { type: 'road_corner', rotation: 180 };    // ┐
const C4 = { type: 'road_corner', rotation: 270 };    // ┌

const grid = [
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, C4, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, RH, C3, G],
  [G, RV, G, G, G, G, G, G, G, G, G, G, G, G, RV, G],
  [G, RV, G, G, G, G, G, G, G, G, G, G, G, G, RV, G],
  [G, RV, G, G, G, G, G, G, G, G, RH, RH, C3, G, RV, G],
  [G, RV, G, G, G, G, G, G, G, G, G, G, RV, G, RV, G],
  [G, RV, G, G, G, G, G, G, G, G, G, G, RV, G, RV, G],
  [G, RV, G, G, G, G, G, G, G, G, G, G, RV, G, RV, G],
  [G, RV, G, G, G, G, C4, RH, RH, RH, RH, RH, C2, G, RV, G],
  [G, RV, G, G, G, G, RV, G, G, G, G, G, G, G, RV, G],
  [G, RV, G, G, G, G, C1, RH, RH, RH, RH, RH, RH, RH, C2, G],
  [G, RV, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, RV, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
];

const level2 = {
  world: 1,
  level: 2,
  biome: 'forest',
  grid,
  road: [
    { x: 96, y: 1024 },
    { x: 96, y: 288 },
    { x: 928, y: 288 },
    { x: 928, y: 864 },
    { x: 416, y: 864 },
    { x: 416, y: 736 },
    { x: 800, y: 736 },
    { x: 800, y: 480 },
    { x: 672, y: 480 }
  ],
  towerSites: [
    { gx: 5, gy: 3 },
    { gx: 11, gy: 3 },
    { gx: 2, gy: 5 },
    { gx: 11, gy: 6 },
    { gx: 13, gy: 7 },
    { gx: 2, gy: 9 },
    { gx: 0, gy: 12 },
    { gx: 7, gy: 12 },
    { gx: 13, gy: 12 }
  ],
  basePosition: { gx: 7, gy: 7 },
};

export default level2;
